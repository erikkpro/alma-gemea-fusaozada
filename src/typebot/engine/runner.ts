import type { Block, Edge, Group, Typebot, RichTextNode, ChoiceItem } from '../types';
import { runCodeBlock, calcularSigno } from './codeBlocks';
import { config } from '../../config';
import type { VarsMap } from './variables';

export type RenderedItem =
  | { kind: 'host-text'; id: string; richText: RichTextNode[] }
  | { kind: 'host-image'; id: string; url: string }
  | { kind: 'host-audio'; id: string; url: string; autoplay?: boolean }
  | { kind: 'guest-text'; id: string; text: string }
  | { kind: 'typing'; id: string; nextKind?: 'text' | 'audio' | 'image' };

export type PendingInput =
  | null
  | {
      kind: 'choice';
      blockId: string;
      items: ChoiceItem[];
      isMultiple?: boolean;
      buttonLabel?: string;
      variableId?: string;
    }
  | {
      kind: 'text';
      blockId: string;
      placeholder: string;
      inputMode?: 'numeric' | 'text';
      variableId?: string;
    };

export type Snapshot = {
  items: RenderedItem[];
  pendingInput: PendingInput;
  vars: VarsMap;
  status: 'online' | 'digitando...' | 'gravando audio...';
  finished: boolean;
};

const TYPING_SPEED = 300;
const TYPING_MAX = 1500;
const TYPING_MIN = 1000;
const INITIAL_TYPING_MIN = 2800;
const INITIAL_TYPING_MAX = 3200;

function uid(): string {
  return Math.random().toString(36).slice(2, 10);
}

function flatTextLength(nodes: RichTextNode[] | undefined): number {
  if (!nodes) return 0;
  let n = 0;
  for (const node of nodes) {
    if (typeof node.text === 'string') n += node.text.length;
    if (node.children) n += flatTextLength(node.children);
  }
  return n;
}

export class Runner {
  private typebot: Typebot;
  private vars: VarsMap = {};
  private varNameById: Record<string, string> = {};
  private groupById: Record<string, Group> = {};
  private edgeById: Record<string, Edge> = {};
  private items: RenderedItem[] = [];
  private pendingInput: PendingInput = null;
  private status: Snapshot['status'] = 'online';
  private finished = false;
  private listeners = new Set<() => void>();
  private cachedSnapshot: Snapshot | null = null;
  private resolveInput: ((value: { content: string; outgoingEdgeId?: string }) => void) | null = null;
  private cancelled = false;
  private started = false;
  private hasReceivedInput = false;
  private checkoutUrl: string;

  constructor(typebot: Typebot, initialVars: VarsMap = {}, checkoutUrl?: string) {
    this.checkoutUrl = checkoutUrl ?? config.checkoutUrl;
    this.typebot = typebot;
    for (const v of typebot.variables) {
      this.varNameById[v.id] = v.name;
      if (v.value) this.vars[v.name] = v.value;
    }
    Object.assign(this.vars, initialVars);
    for (const g of typebot.groups) this.groupById[g.id] = g;
    for (const e of typebot.edges) this.edgeById[e.id] = e;
  }

  subscribe = (listener: () => void): (() => void) => {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  };

  getSnapshot = (): Snapshot => {
    if (!this.cachedSnapshot) {
      this.cachedSnapshot = {
        items: this.items,
        pendingInput: this.pendingInput,
        vars: this.vars,
        status: this.status,
        finished: this.finished,
      };
    }
    return this.cachedSnapshot;
  };

  private notify() {
    this.cachedSnapshot = null;
    for (const l of this.listeners) l();
  }

  private setVar = (name: string, value: string | number) => {
    this.vars = { ...this.vars, [name]: value };
  };

  private setVarById(id: string | undefined, value: string | number) {
    if (!id) return;
    const name = this.varNameById[id];
    if (!name) return;
    this.setVar(name, value);
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((res) => setTimeout(res, ms));
  }

  private startEvent() {
    const ev = Array.isArray(this.typebot.events) ? this.typebot.events[0] : this.typebot.events;
    return ev;
  }

  private edgeFromEdgeId(edgeId: string | undefined): Edge | undefined {
    if (!edgeId) return undefined;
    return this.edgeById[edgeId];
  }

  start() {
    if (this.started || this.cancelled) return;
    this.started = true;
    this.run().catch((e) => console.error('runner error', e));
  }

  cancel() {
    this.cancelled = true;
  }

  respond(value: { content: string; outgoingEdgeId?: string }) {
    if (this.resolveInput) {
      const fn = this.resolveInput;
      this.resolveInput = null;
      fn(value);
    }
  }

  private waitForResponse(): Promise<{ content: string; outgoingEdgeId?: string }> {
    return new Promise((res) => {
      this.resolveInput = res;
    });
  }

  private async typingPause(charCount: number, nextKind: 'text' | 'audio' | 'image') {
    const raw = (charCount * 1000) / TYPING_SPEED;
    const minD = this.hasReceivedInput ? TYPING_MIN : INITIAL_TYPING_MIN;
    const maxD = this.hasReceivedInput ? TYPING_MAX : INITIAL_TYPING_MAX;
    const delay = Math.min(Math.max(raw, minD), maxD);
    const id = uid();
    const typing: RenderedItem = { kind: 'typing', id, nextKind };
    this.items = [...this.items, typing];
    this.status = nextKind === 'audio' ? 'gravando audio...' : 'digitando...';
    this.notify();
    await this.sleep(delay);
    this.items = this.items.filter((i) => i.id !== id);
    this.status = 'online';
    this.notify();
  }

  private async run() {
    const startEvent = this.startEvent();
    const startEdge = this.edgeFromEdgeId(startEvent.outgoingEdgeId);
    if (!startEdge) {
      this.finished = true;
      this.notify();
      return;
    }

    let groupId: string | undefined = startEdge.to.groupId;
    let blockId: string | undefined = startEdge.to.blockId;

    while (groupId && !this.cancelled) {
      const group = this.groupById[groupId];
      if (!group) break;

      let startIndex = 0;
      if (blockId) {
        const idx = group.blocks.findIndex((b) => b.id === blockId);
        startIndex = idx >= 0 ? idx : 0;
      }

      const nav = await this.runGroupFrom(group, startIndex);
      if (this.cancelled) break;
      if (!nav) {
        this.finished = true;
        this.notify();
        return;
      }
      groupId = nav.groupId;
      blockId = nav.blockId;
    }
  }

  private async runGroupFrom(group: Group, startIndex: number): Promise<{ groupId: string; blockId?: string } | null> {
    for (let i = startIndex; i < group.blocks.length; i++) {
      if (this.cancelled) return null;
      const block = group.blocks[i];
      const result = await this.runBlock(block);
      if (result?.jump) return result.jump;
      if (result?.end) return null;
    }
    return null;
  }

  private async runBlock(block: Block): Promise<{ jump?: { groupId: string; blockId?: string }; end?: boolean } | undefined> {
    switch (block.type) {
      case 'text': {
        const len = flatTextLength(block.content.richText);
        await this.typingPause(len, 'text');
        const item: RenderedItem = { kind: 'host-text', id: block.id, richText: block.content.richText };
        this.items = [...this.items, item];
        this.notify();
        return;
      }
      case 'image': {
        await this.typingPause(20, 'image');
        const item: RenderedItem = { kind: 'host-image', id: block.id, url: block.content.url };
        this.items = [...this.items, item];
        this.notify();
        return;
      }
      case 'audio': {
        await this.typingPause(40, 'audio');
        const item: RenderedItem = {
          kind: 'host-audio',
          id: block.id,
          url: block.content.url,
          autoplay: block.content.isAutoplayEnabled,
        };
        this.items = [...this.items, item];
        this.notify();
        return;
      }
      case 'Wait': {
        const sec = Number(block.options.secondsToWaitFor) || 0;
        const id = uid();
        this.items = [...this.items, { kind: 'typing', id }];
        this.status = 'digitando...';
        this.notify();
        await this.sleep(sec * 1000);
        this.items = this.items.filter((i) => i.id !== id);
        this.status = 'online';
        this.notify();
        if (block.outgoingEdgeId) {
          const edge = this.edgeFromEdgeId(block.outgoingEdgeId);
          if (edge) return { jump: { groupId: edge.to.groupId, blockId: edge.to.blockId } };
        }
        return;
      }
      case 'choice input': {
        this.pendingInput = {
          kind: 'choice',
          blockId: block.id,
          items: block.items,
          isMultiple: block.options?.isMultipleChoice,
          buttonLabel: block.options?.buttonLabel,
          variableId: block.options?.variableId,
        };
        this.notify();
        const answer = await this.waitForResponse();
        this.pendingInput = null;
        this.hasReceivedInput = true;
        if (block.options?.variableId) {
          this.setVarById(block.options.variableId, answer.content);
        }
        this.maybeUpdateSigno();
        this.items = [...this.items, { kind: 'guest-text', id: uid(), text: answer.content }];
        this.notify();
        if (answer.outgoingEdgeId) {
          const edge = this.edgeFromEdgeId(answer.outgoingEdgeId);
          if (edge) return { jump: { groupId: edge.to.groupId, blockId: edge.to.blockId } };
        }
        return;
      }
      case 'text input': {
        this.pendingInput = {
          kind: 'text',
          blockId: block.id,
          placeholder: block.options?.labels?.placeholder ?? 'Digite sua resposta...',
          inputMode: block.options?.inputMode,
          variableId: block.options?.variableId,
        };
        this.notify();
        const answer = await this.waitForResponse();
        this.pendingInput = null;
        this.hasReceivedInput = true;
        if (block.options?.variableId) this.setVarById(block.options.variableId, answer.content);
        this.maybeUpdateSigno();
        this.items = [...this.items, { kind: 'guest-text', id: uid(), text: answer.content }];
        this.notify();
        if (block.outgoingEdgeId) {
          const edge = this.edgeFromEdgeId(block.outgoingEdgeId);
          if (edge) return { jump: { groupId: edge.to.groupId, blockId: edge.to.blockId } };
        }
        return;
      }
      case 'Code': {
        runCodeBlock(block.id, this.vars, this.setVar);
        this.notify();
        return;
      }
      case 'Webhook': {
        try {
          const res = await fetch(block.options.webhook.url, { method: block.options.webhook.method });
          const data = await res.json();
          for (const m of block.options.responseVariableMapping || []) {
            const val = resolvePath(data, m.bodyPath.replace(/^data\./, ''));
            if (val != null) this.setVarById(m.variableId, val);
          }
          this.notify();
        } catch (e) {
          console.warn('Webhook failed', e);
        }
        return;
      }
      case 'Redirect': {
        await this.sleep(400);
        const rawUrl = this.checkoutUrl || block.options.url;
        const url = appendQuery(rawUrl);
        if (typeof window !== 'undefined') window.location.href = url;
        return { end: true };
      }
    }
  }

  private maybeUpdateSigno() {
    const dia = Number(this.vars['Dia']);
    const mesNome = String(this.vars['Mês'] ?? '');
    const map: Record<string, number> = {
      Janeiro: 1, Fevereiro: 2, 'Março': 3, Abril: 4, Maio: 5, Junho: 6,
      Julho: 7, Agosto: 8, Setembro: 9, Outubro: 10, Novembro: 11, Dezembro: 12,
    };
    const mes = map[mesNome];
    if (dia && mes) {
      const signo = calcularSigno(dia, mes);
      this.setVar('signo', signo);
      this.setVar('Signo', signo);
    }
  }
}

function resolvePath(obj: any, path: string): any {
  if (!path) return obj;
  return path.split('.').reduce((acc, k) => (acc == null ? acc : acc[k]), obj);
}

function appendQuery(url: string): string {
  if (typeof window === 'undefined') return url;
  const search = window.location.search.replace(/^\?/, '');
  if (!search) return url;
  return url + (url.indexOf('?') >= 0 ? '&' : '?') + search;
}
