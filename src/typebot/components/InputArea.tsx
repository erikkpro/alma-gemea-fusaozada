import { useState } from 'react';
import type { ChoiceItem } from '../types';
import type { PendingInput } from '../engine/runner';

type Props = {
  pending: PendingInput;
  onRespond: (value: { content: string; outgoingEdgeId?: string }) => void;
};

export function InputArea({ pending, onRespond }: Props) {
  if (!pending) return null;

  if (pending.kind === 'choice') {
    const items = pending.items;
    const isGrid = items.length >= 6;
    return (
      <div className={`tb-choice-area ${isGrid ? 'tb-choice-grid' : 'tb-choice-stack'}`}>
        {items.map((it: ChoiceItem) => (
          <button
            key={it.id}
            className="tb-choice-btn"
            onClick={() => onRespond({ content: it.content, outgoingEdgeId: it.outgoingEdgeId })}
          >
            {it.content}
          </button>
        ))}
      </div>
    );
  }

  return <TextInputBox pending={pending} onRespond={onRespond} />;
}

function TextInputBox({
  pending,
  onRespond,
}: {
  pending: Extract<PendingInput, { kind: 'text' }>;
  onRespond: Props['onRespond'];
}) {
  const [v, setV] = useState('');

  function submit() {
    const trimmed = v.trim();
    if (!trimmed) return;
    onRespond({ content: trimmed });
    setV('');
  }

  return (
    <div className="tb-input">
      <input
        autoFocus
        type={pending.inputMode === 'numeric' ? 'tel' : 'text'}
        inputMode={pending.inputMode === 'numeric' ? 'numeric' : 'text'}
        placeholder={pending.placeholder}
        value={v}
        onChange={(e) => setV(e.target.value)}
        onKeyDown={(e) => { if (e.key === 'Enter') submit(); }}
      />
      <button className="tb-send-btn" onClick={submit} aria-label="Enviar">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="19" height="19">
          <path
            d="M476.59 227.05l-.16-.07L49.35 49.84A23.56 23.56 0 0027.14 52 24.65 24.65 0 0016 72.59v113.29a24 24 0 0019.52 23.57l232.93 43.07a4 4 0 010 7.86L35.53 303.45A24 24 0 0016 327v113.31A23.57 23.57 0 0026.59 460a23.94 23.94 0 0013.22 4 24.55 24.55 0 009.52-1.93L476.4 285.94l.19-.09a32 32 0 000-58.8z"
            fill="white"
          />
        </svg>
      </button>
    </div>
  );
}
