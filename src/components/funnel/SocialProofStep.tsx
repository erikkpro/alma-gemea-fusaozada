import { useEffect, useState } from "react";
import grupoDepoimentos from "@/assets/depoimentos/grupo.webp";
import camilaImg from "@/assets/depoimentos/camila.webp";
import larissaImg from "@/assets/depoimentos/larissa.webp";
import julianeImg from "@/assets/depoimentos/juliane.webp";

type Depoimento = {
  nome: string;
  user: string;
  texto: string;
  foto: string;
};

const DEPOIMENTOS: Depoimento[] = [
  {
    nome: "Camila Andrade",
    user: "@camila.ferreira",
    texto: "Ainda sem acreditar, meu marido não é minha alma gêmea, descobri que ele me traia 😪",
    foto: camilaImg,
  },
  {
    nome: "Larissa Campos",
    user: "@laricampossoficial",
    texto: "Surreal! Encontrei minha alma gêmea no supermercado 2 semanas depois! 😍",
    foto: larissaImg,
  },
  {
    nome: "Juliane Moraes",
    user: "@ju.moraes_",
    texto: "Descobri que minha alma gêmea era meu ex 😅",
    foto: julianeImg,
  },
];

interface Props {
  signoNome: string;
  onContinue: () => void;
}

export function SocialProofStep({ signoNome, onContinue }: Props) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % DEPOIMENTOS.length);
    }, 3000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="animate-fade-in w-full">
      <h1 className="text-center text-[22px] sm:text-2xl font-extrabold text-[#3d1766] leading-tight mb-6 px-2 font-sans">
        Mais de 7,395 mulheres de {signoNome} descobriram sua alma gêmea com essa leitura da data de nascimento
      </h1>

      <div className="bg-[#d8b4fe]/60 rounded-2xl p-4 mb-6">
        <img
          src={grupoDepoimentos}
          alt="Mulheres que descobriram sua alma gêmea"
          className="w-full h-auto"
        />
      </div>

      <div className="bg-[#d8b4fe]/60 rounded-2xl p-4 mb-6 overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {DEPOIMENTOS.map((d) => (
            <div key={d.nome} className="w-full shrink-0 px-1">
              <div className="flex items-start gap-3">
                <img
                  src={d.foto}
                  alt={d.nome}
                  className="w-12 h-12 rounded-full object-cover shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="text-yellow-500 text-sm">★★★★★</div>
                  <div className="font-bold text-[#3d1766] text-sm leading-tight">{d.nome}</div>
                  <div className="text-[#3d1766]/60 text-xs mb-2">{d.user}</div>
                  <p className="text-[#3d1766] text-sm leading-snug">{d.texto}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-center gap-2 mt-3">
          {DEPOIMENTOS.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              aria-label={`Depoimento ${i + 1}`}
              className={`h-1.5 rounded-full transition-all ${
                i === index ? "w-6 bg-[#3d1766]" : "w-1.5 bg-[#3d1766]/30"
              }`}
            />
          ))}
        </div>
      </div>

      <button
        onClick={onContinue}
        className="w-full h-14 rounded-2xl bg-[#312e81] hover:bg-[#312e81]/90 text-white font-bold text-base flex items-center justify-center gap-2 transition-colors"
      >
        <span>🔮</span> CLIQUE PARA COMEÇAR
      </button>
    </div>
  );
}
