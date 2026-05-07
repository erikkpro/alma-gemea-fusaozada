import { ReactNode } from "react";

interface Props {
  titulo: ReactNode;
  onPick: (resposta: "sim" | "nao") => void;
  emojiSim?: string;
  emojiNao?: string;
}

export function SimNaoStep({ titulo, onPick, emojiSim = "😍", emojiNao = "🤔" }: Props) {
  return (
    <div className="animate-fade-in text-center">
      <h2 className="text-xl sm:text-2xl font-extrabold text-[#3d1766] leading-snug mb-3 font-sans">
        {titulo}
      </h2>
      <p className="text-[#d63ad6] text-sm font-semibold mb-6">*Responda com sinceridade</p>
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => onPick("sim")}
          className="h-14 rounded-2xl bg-[#312e81] hover:bg-[#312e81]/90 text-white font-semibold flex items-center justify-center px-4 gap-2"
        >
          <span className="text-xl">{emojiSim}</span>
          <span>Sim</span>
        </button>
        <button
          onClick={() => onPick("nao")}
          className="h-14 rounded-2xl bg-[#312e81] hover:bg-[#312e81]/90 text-white font-semibold flex items-center justify-center px-4 gap-2"
        >
          <span className="text-xl">{emojiNao}</span>
          <span>Não</span>
        </button>
      </div>
    </div>
  );
}
