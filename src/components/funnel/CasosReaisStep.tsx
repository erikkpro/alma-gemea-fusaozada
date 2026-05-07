import { useEffect, useState } from "react";
import wpp1 from "@/assets/depoimentos/wpp1.webp";
import wpp2 from "@/assets/depoimentos/wpp2.webp";
import wpp3 from "@/assets/depoimentos/wpp3.webp";

const SLIDES = [wpp1, wpp2, wpp3];

interface Props {
  onContinue: () => void;
}

export function CasosReaisStep({ onContinue }: Props) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % SLIDES.length);
    }, 3000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="animate-fade-in">
      <h2 className="text-center text-xl sm:text-2xl font-extrabold text-[#3d1766] leading-snug mb-5 px-2 font-sans">
        Veja casos reais de mulheres que conheceram sua alma gêmea com o{" "}
        <span className="text-[#d63ad6]">número do amor.</span>
      </h2>

      <div className="bg-[#d8b4fe]/60 rounded-2xl p-3 mb-4 overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {SLIDES.map((src, i) => (
            <div key={i} className="w-full shrink-0 px-1">
              <img src={src} alt={`Depoimento ${i + 1}`} className="w-full h-auto rounded-xl" />
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-center gap-2 mb-5">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            aria-label={`Slide ${i + 1}`}
            className={`h-2 rounded-full transition-all ${
              i === index ? "w-6 bg-[#3d1766]" : "w-2 bg-[#3d1766]/30"
            }`}
          />
        ))}
      </div>

      <button
        onClick={onContinue}
        className="w-full h-14 rounded-2xl bg-[#312e81] hover:bg-[#312e81]/90 text-white font-bold text-base flex items-center justify-center gap-2"
      >
        <span>🔮</span> CLIQUE PARA CONTINUAR
      </button>
    </div>
  );
}
