import type { RichTextNode } from '../types';

export type VarsMap = Record<string, string | number | undefined>;

const VAR_PATTERN = /\{\{([^}]+)\}\}/g;

export function interpolate(input: string, vars: VarsMap): string {
  if (!input) return '';
  return input.replace(VAR_PATTERN, (_match, raw: string) => {
    const name = raw.trim();
    const v = vars[name];
    return v == null ? '' : String(v);
  });
}

export function richTextToReactKey(nodes: RichTextNode[]): string {
  return JSON.stringify(nodes).slice(0, 64);
}

export function flattenRichTextToText(nodes: RichTextNode[] | undefined, vars: VarsMap): string {
  if (!nodes) return '';
  return nodes
    .map((n) => {
      if (typeof n.text === 'string') return interpolate(n.text, vars);
      if (n.children) return flattenRichTextToText(n.children, vars);
      return '';
    })
    .join('');
}
