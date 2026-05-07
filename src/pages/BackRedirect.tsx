import { useEffect, useRef, useSyncExternalStore } from 'react';
import typebotJson from '../typebot/back-redirect/typebot.json';
import type { Typebot } from '../typebot/types';
import { Runner } from '../typebot/engine/runner';
import { config } from '../config';
import { WhatsAppBar } from '../typebot/components/WhatsAppBar';
import { TypingIndicator } from '../typebot/components/TypingIndicator';
import { HostBubble, HostImageBubble } from '../typebot/components/HostBubble';
import { GuestBubble } from '../typebot/components/GuestBubble';
import { AudioBubble } from '../typebot/components/AudioBubble';
import { InputArea } from '../typebot/components/InputArea';
import '../typebot/typebot.css';

const typebot = typebotJson as unknown as Typebot;

const HOST_NAME = 'Isis Luz';
const AVATAR_URL = typebot.theme?.chat?.hostAvatar?.url
  ?? 'https://tuachamagemeaa.site/wp-content/uploads/2025/07/Captura-de-Tela-2025-07-23-as-00.27.09.png';

function nowTime(): string {
  const d = new Date();
  return d.getHours().toString().padStart(2, '0') + ':' + d.getMinutes().toString().padStart(2, '0');
}

export default function BackRedirect() {
  useEffect(() => {
    document.documentElement.setAttribute('data-tb-theme', 'upsell1');
    return () => document.documentElement.removeAttribute('data-tb-theme');
  }, []);

  const runnerRef = useRef<Runner | null>(null);
  if (!runnerRef.current) {
    runnerRef.current = new Runner(typebot, {}, config.backRedirectCheckoutUrl);
  }
  const runner = runnerRef.current;
  const snapshot = useSyncExternalStore(runner.subscribe, runner.getSnapshot, runner.getSnapshot);

  useEffect(() => { runner.start(); }, []);

  const feedRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const el = feedRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [snapshot.items.length, snapshot.pendingInput]);

  return (
    <div className="tb-shell">
      <div className="tb-inner">
        <WhatsAppBar name={HOST_NAME} avatarUrl={AVATAR_URL} status={snapshot.status} />
        <div className="tb-chat-view" ref={feedRef}>
          <div className="tb-hoje">HOJE</div>
          {snapshot.items.map((item) => {
            if (item.kind === 'host-text') return <HostBubble key={item.id} nodes={item.richText} vars={snapshot.vars} time={nowTime()} />;
            if (item.kind === 'host-image') return <HostImageBubble key={item.id} url={item.url} time={nowTime()} />;
            if (item.kind === 'host-audio') return <AudioBubble key={item.id} url={item.url} autoplay={item.autoplay} avatarUrl={AVATAR_URL} time={nowTime()} />;
            if (item.kind === 'guest-text') return <GuestBubble key={item.id} text={item.text} time={nowTime()} />;
            if (item.kind === 'typing') return <TypingIndicator key={item.id} />;
            return null;
          })}
          {snapshot.pendingInput?.kind === 'choice' && (
            <InputArea pending={snapshot.pendingInput} onRespond={(v) => runner.respond(v)} />
          )}
        </div>
        {snapshot.pendingInput?.kind === 'text' && (
          <InputArea pending={snapshot.pendingInput} onRespond={(v) => runner.respond(v)} />
        )}
      </div>
    </div>
  );
}
