type Props = { signoId: string; className?: string };

const PATHS: Record<string, JSX.Element> = {
  aries: (
    <g fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 32 Q16 18 24 18 Q32 18 32 28" />
      <path d="M48 32 Q48 18 40 18 Q32 18 32 28" />
      <path d="M32 28 V52" />
    </g>
  ),
  touro: (
    <g fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="32" cy="40" r="12" />
      <path d="M14 18 Q22 30 32 30 Q42 30 50 18" />
    </g>
  ),
  gemeos: (
    <g fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 16 H46" />
      <path d="M18 48 H46" />
      <path d="M22 16 V48" />
      <path d="M42 16 V48" />
    </g>
  ),
  cancer: (
    <g fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="22" cy="24" r="5" />
      <circle cx="42" cy="40" r="5" />
      <path d="M14 24 Q14 14 27 14 Q40 14 40 24" />
      <path d="M50 40 Q50 50 37 50 Q24 50 24 40" />
    </g>
  ),
  leao: (
    <g fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="38" cy="38" r="10" />
      <path d="M38 28 Q38 14 26 14 Q14 14 14 26 Q14 36 22 36" />
    </g>
  ),
  virgem: (
    <g fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 50 V20 Q14 16 18 16 Q22 16 22 20 V50" />
      <path d="M22 20 Q22 16 26 16 Q30 16 30 20 V50" />
      <path d="M30 20 Q30 16 34 16 Q38 16 38 20 V42 Q38 50 46 50 Q52 50 52 44" />
      <path d="M46 50 Q52 46 50 38" />
    </g>
  ),
  libra: (
    <g fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 50 H52" />
      <path d="M12 42 H52" />
      <path d="M20 42 Q20 28 32 28 Q44 28 44 42" />
    </g>
  ),
  escorpiao: (
    <g fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22 V46 Q12 50 16 50 Q20 50 20 46 V22" />
      <path d="M20 22 V46 Q20 50 24 50 Q28 50 28 46 V22" />
      <path d="M28 22 V42 Q28 50 36 50 H48" />
      <path d="M44 46 L52 42 L48 50 Z" fill="currentColor" />
    </g>
  ),
  sagitario: (
    <g fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 50 L50 14" />
      <path d="M50 14 L40 14 M50 14 L50 24" />
      <path d="M28 36 L36 28" />
    </g>
  ),
  capricornio: (
    <g fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 18 L20 38 L28 18 L28 42 Q28 50 36 50 Q44 50 44 42" />
      <circle cx="44" cy="38" r="6" />
    </g>
  ),
  aquario: (
    <g fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 22 L18 28 L26 22 L34 28 L42 22 L50 28 L54 24" />
      <path d="M10 38 L18 44 L26 38 L34 44 L42 38 L50 44 L54 40" />
    </g>
  ),
  peixes: (
    <g fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 14 Q24 32 16 50" />
      <path d="M48 14 Q40 32 48 50" />
      <path d="M16 32 H48" />
    </g>
  ),
};

export function SignoIcon({ signoId, className }: Props) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      {PATHS[signoId]}
    </svg>
  );
}
