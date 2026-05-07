const OPCOES = [
  { id: "casado", label: "Casado(a)", emoji: "💍" },
  { id: "namorando", label: "Namorando", emoji: "💕" },
  { id: "noivo", label: "Noivo(a)", emoji: "😍" },
  { id: "separado", label: "Separado(a)", emoji: "📱" },
  { id: "solteiro", label: "Solteiro(a)", emoji: "❤️" },
  { id: "viuvo", label: "Viúvo(a)", emoji: "💔" },
];

interface Props {
  value?: string;
  onPick: (id: string) => void;
}

export function EstadoCivilStep({ value, onPick }: Props) {
  return (
    <div className="animate-fade-in">
      <h2 className="text-center text-xl sm:text-2xl font-extrabold text-[#3d1766] uppercase mb-6 tracking-wide font-sans">
        Qual seu estado civil?
      </h2>
      <div className="grid grid-cols-2 gap-3">
        {OPCOES.map((o) => (
          <button
            key={o.id}
            onClick={() => onPick(o.id)}
            className={`h-14 rounded-2xl bg-[#312e81] hover:bg-[#312e81]/90 text-white font-semibold flex items-center justify-center px-4 gap-2 transition-all ${
              value === o.id ? "ring-2 ring-[#d63ad6]" : ""
            }`}
          >
            <span className="text-xl">{o.emoji}</span>
            <span className="text-[15px]">{o.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
