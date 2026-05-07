import { useEffect, useRef, useState } from "react";
import { ChatStep } from "@/data/funnel";
import { useNavigate } from "react-router-dom";
import { saveState, syncLead, logEvent } from "@/lib/leadStore";

type Props = {
  script: ChatStep[];
  nome?: string;
  /** Etapa salva no DB conforme avança */
  etapa: string;
};

type RenderedItem =
  | { kind: "msg"; step: ChatStep; key: string }
  | { kind: "choice"; step: Extract<ChatStep, { type: "choice" }>; key: string }
  | { kind: "cta"; step: Extract<ChatStep, { type: "cta" }>; key: string };

const TYPING_DELAY = 1200;
const READ_DELAY = 600;

function interpolate(text: string, vars: Record<string, string | undefined>) {
  return text.replace(/\{\{(\w+)\}\}/g, (_, k) => vars[k] ?? "");
}

function renderMarkdown(text: string) {
  // mini parser: **bold** e *italic*
  const parts: (string | JSX.Element)[] = [];
  const regex = /(\*\*[^*]+\*\*|\*[^*]+\*)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = regex.exec(text))) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    const token = m[0];
    if (token.startsWith("**")) {
      parts.push(<strong key={i++} className="text-gold-glow">{token.slice(2, -2)}</strong>);
    } else {
      parts.push(<em key={i++}>{token.slice(1, -1)}</em>);
    }
    last = m.index + token.length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts;
}

export function ChatThread({ script, nome, etapa }: Props) {
  const [items, setItems] = useState<RenderedItem[]>([]);
  const [typing, setTyping] = useState(false);
  const [waitingChoice, setWaitingChoice] = useState(false);
  const indexRef = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const vars = { nome: nome || "querida" };

  useEffect(() => {
    syncLead({ etapa_atual: etapa });
    logEvent(`abriu_${etapa}`);
    // run sequencer
    let cancelled = false;

    async function next() {
      if (cancelled) return;
      const i = indexRef.current;
      if (i >= script.length) return;
      const step = script[i];

      if (step.type === "choice") {
        setItems((prev) => [...prev, { kind: "choice", step, key: `c-${i}` }]);
        setWaitingChoice(true);
        return;
      }
      if (step.type === "cta") {
        setItems((prev) => [...prev, { kind: "cta", step, key: `cta-${i}` }]);
        return;
      }

      setTyping(true);
      await new Promise((r) => setTimeout(r, TYPING_DELAY));
      if (cancelled) return;
      setTyping(false);
      setItems((prev) => [...prev, { kind: "msg", step, key: `m-${i}` }]);
      indexRef.current = i + 1;
      await new Promise((r) => setTimeout(r, READ_DELAY));
      next();
    }

    next();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [items, typing]);

  function handleChoice(value: string, label: string, saveAs?: string) {
    const i = indexRef.current;
    // remove choice block, push user message
    setItems((prev) => [
      ...prev.filter((it) => it.key !== `c-${i}`),
      { kind: "msg", step: { type: "text", text: label } as ChatStep, key: `u-${i}` },
    ]);
    setWaitingChoice(false);
    if (saveAs) saveState({ [saveAs]: value } as never);
    logEvent("chat_choice", { etapa, value, label });
    indexRef.current = i + 1;
    // resume
    setTimeout(() => {
      // re-trigger by calling next via a side effect — simpler: restart loop
      const event = new Event("chat-resume");
      window.dispatchEvent(event);
    }, 200);
  }

  // Listener pra retomar após choice
  useEffect(() => {
    function resume() {
      let cancelled = false;
      async function next() {
        if (cancelled) return;
        const i = indexRef.current;
        if (i >= script.length) return;
        const step = script[i];
        if (step.type === "choice") {
          setItems((prev) => [...prev, { kind: "choice", step, key: `c-${i}` }]);
          setWaitingChoice(true);
          return;
        }
        if (step.type === "cta") {
          setItems((prev) => [...prev, { kind: "cta", step, key: `cta-${i}` }]);
          return;
        }
        setTyping(true);
        await new Promise((r) => setTimeout(r, TYPING_DELAY));
        if (cancelled) return;
        setTyping(false);
        setItems((prev) => [...prev, { kind: "msg", step, key: `m-${i}` }]);
        indexRef.current = i + 1;
        await new Promise((r) => setTimeout(r, READ_DELAY));
        next();
      }
      next();
      return () => { cancelled = true; };
    }
    window.addEventListener("chat-resume", resume);
    return () => window.removeEventListener("chat-resume", resume);
  }, [script]);

  function handleCta(href: string, label: string) {
    logEvent("chat_cta", { etapa, label, href });
    if (href.startsWith("http")) {
      window.location.href = href;
    } else {
      navigate(href);
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-2rem)] sm:h-[80vh] max-h-[800px] bg-card/40 backdrop-blur rounded-3xl border border-border overflow-hidden shadow-mystic">
      {/* Header da Serena */}
      <div className="flex items-center gap-3 p-4 border-b border-border bg-gradient-card">
        <div className="w-12 h-12 rounded-full bg-gradient-magenta flex items-center justify-center text-2xl shadow-gold">
          🔮
        </div>
        <div className="flex-1">
          <div className="font-semibold flex items-center gap-2">
            Serena <span className="text-gold text-xs">✦ Numeróloga</span>
          </div>
          <div className="text-xs text-muted-foreground flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
            online agora
          </div>
        </div>
      </div>

      {/* Mensagens */}
      <div ref={containerRef} className="flex-1 overflow-y-auto p-4 space-y-3 scroll-smooth">
        {items.map((item) => {
          if (item.kind === "msg") {
            const step = item.step;
            const isUser = item.key.startsWith("u-");
            if (step.type === "text") {
              return (
                <div
                  key={item.key}
                  className={`flex animate-fade-in-up ${isUser ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm sm:text-base leading-relaxed ${
                      isUser
                        ? "bg-gradient-gold text-gold-foreground rounded-br-md"
                        : "bg-secondary text-foreground rounded-bl-md"
                    }`}
                  >
                    {renderMarkdown(interpolate(step.text, vars))}
                  </div>
                </div>
              );
            }
            if (step.type === "audio") {
              return (
                <div key={item.key} className="flex justify-start animate-fade-in-up">
                  <div className="bg-secondary rounded-2xl rounded-bl-md p-3 max-w-[85%] w-full">
                    <audio controls src={step.url} className="w-full" />
                  </div>
                </div>
              );
            }
            if (step.type === "video") {
              return (
                <div key={item.key} className="flex justify-start animate-fade-in-up">
                  <div className="bg-secondary rounded-2xl rounded-bl-md p-2 max-w-[85%] w-full overflow-hidden">
                    <div className="aspect-video w-full rounded-xl overflow-hidden bg-black">
                      <iframe
                        src={step.url}
                        className="w-full h-full"
                        allow="autoplay; fullscreen"
                        allowFullScreen
                        title="vídeo"
                      />
                    </div>
                  </div>
                </div>
              );
            }
          }
          if (item.kind === "choice") {
            return (
              <div key={item.key} className="flex flex-col gap-2 pt-2 animate-fade-in-up">
                {item.step.options.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => handleChoice(opt.value, opt.label, item.step.saveAs)}
                    className="self-end max-w-[85%] px-5 py-3 rounded-2xl rounded-br-md bg-card border border-gold/40 text-foreground hover:bg-gradient-gold hover:text-gold-foreground hover:border-gold transition-all duration-300 text-sm sm:text-base font-medium shadow-sm hover:shadow-gold"
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            );
          }
          if (item.kind === "cta") {
            return (
              <div key={item.key} className="flex justify-center pt-4 pb-2 animate-fade-in-up">
                <button
                  onClick={() => handleCta(item.step.href, item.step.label)}
                  className="px-8 py-4 rounded-2xl bg-gradient-gold text-gold-foreground font-bold text-base sm:text-lg shadow-gold pulse-gold hover:scale-105 transition-transform"
                >
                  {item.step.label}
                </button>
              </div>
            );
          }
          return null;
        })}

        {typing && (
          <div className="flex justify-start animate-fade-in">
            <div className="bg-secondary rounded-2xl rounded-bl-md px-4 py-3 flex items-center gap-1">
              <span className="typing-dot w-2 h-2 rounded-full bg-muted-foreground inline-block" />
              <span className="typing-dot w-2 h-2 rounded-full bg-muted-foreground inline-block" />
              <span className="typing-dot w-2 h-2 rounded-full bg-muted-foreground inline-block" />
            </div>
          </div>
        )}
      </div>

      {waitingChoice && (
        <div className="px-4 py-2 text-center text-xs text-muted-foreground border-t border-border">
          ↑ Escolha uma opção pra continuar
        </div>
      )}
    </div>
  );
}
