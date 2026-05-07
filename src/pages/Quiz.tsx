import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { SIGNOS, MESES, PREOCUPACOES } from "@/data/funnel";

import { ProgressBar } from "@/components/funnel/ProgressBar";
import { ChoiceCard } from "@/components/funnel/ChoiceCard";
import { SignoIcon } from "@/components/funnel/SignoIcon";
import { SocialProofStep } from "@/components/funnel/SocialProofStep";
import { EstadoCivilStep } from "@/components/funnel/EstadoCivilStep";
import { LoadingScreen } from "@/components/funnel/LoadingScreen";
import { CasosReaisStep } from "@/components/funnel/CasosReaisStep";
import { SimNaoStep } from "@/components/funnel/SimNaoStep";
import { VerifyingScreen } from "@/components/funnel/VerifyingScreen";
import isisCard from "@/assets/isis-card.webp";
import { syncLead, getState, logEvent } from "@/lib/leadStore";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import grupoDepoimentos from "@/assets/depoimentos/grupo.webp";
import camilaImg from "@/assets/depoimentos/camila.webp";
import larissaImg from "@/assets/depoimentos/larissa.webp";
import julianeImg from "@/assets/depoimentos/juliane.webp";
import wpp1 from "@/assets/depoimentos/wpp1.webp";
import wpp2 from "@/assets/depoimentos/wpp2.webp";
import wpp3 from "@/assets/depoimentos/wpp3.webp";
import ariesImg from "@/assets/signos/aries.webp";
import touroImg from "@/assets/signos/touro.webp";
import gemeosImg from "@/assets/signos/gemeos.webp";
import cancerImg from "@/assets/signos/cancer.webp";
import leaoImg from "@/assets/signos/leao.webp";
import virgemImg from "@/assets/signos/virgem.webp";
import libraImg from "@/assets/signos/libra.webp";
import escorpiaoImg from "@/assets/signos/escorpiao.webp";
import sagitarioImg from "@/assets/signos/sagitario.webp";
import capricornioImg from "@/assets/signos/capricornio.webp";
import aquarioImg from "@/assets/signos/aquario.webp";
import peixesImg from "@/assets/signos/peixes.webp";

const SIGNO_IMAGES: Record<string, string> = {
  aries: ariesImg,
  touro: touroImg,
  gemeos: gemeosImg,
  cancer: cancerImg,
  leao: leaoImg,
  virgem: virgemImg,
  libra: libraImg,
  escorpiao: escorpiaoImg,
  sagitario: sagitarioImg,
  capricornio: capricornioImg,
  aquario: aquarioImg,
  peixes: peixesImg,
};

const TOTAL_STEPS = 12;

export default function Quiz() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [signo, setSigno] = useState<string>();
  const [mes, setMes] = useState<string>();
  const [dia, setDia] = useState<string>("");
  const [preocupacao, setPreocupacao] = useState<string>();
  const [estadoCivil, setEstadoCivil] = useState<string>();
  const [nome, setNome] = useState("");

  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);

  function goToVerifying() {
    setVerifying(true);
    setTimeout(() => {
      setVerifying(false);
      nextStep();
    }, 3000);
  }

  async function submitNome() {
    const n = nome.trim();
    if (n.length < 2) return;
    await syncLead({ nome: n, etapa_atual: "quiz_nome" });
    goToVerifying();
  }

  async function pickEstadoCivil(id: string) {
    setEstadoCivil(id);
    await syncLead({ estado_civil: id, etapa_atual: "quiz_estado_civil" } as any);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      nextStep();
    }, 4000);
  }

  async function pickAcredita(resposta: "sim" | "nao") {
    await syncLead({ acredita_alma_gemea: resposta, etapa_atual: "quiz_acredita" } as any);
    setTimeout(nextStep, 200);
  }

  useEffect(() => {
    const s = getState();
    if (s.nome) setNome(s.nome);
    if (s.signo) setSigno(s.signo);
    if (s.mes_nascimento) setMes(s.mes_nascimento);
    if (s.dia_nascimento) setDia(String(s.dia_nascimento));
    if (s.preocupacao) setPreocupacao(s.preocupacao);
    logEvent("abriu_quiz");
  }, []);

  // Preload imagens das próximas etapas assim que o quiz abre,
  // pra que a transição entre passos seja instantânea.
  useEffect(() => {
    const urls = [
      grupoDepoimentos, camilaImg, larissaImg, julianeImg, isisCard,
      wpp1, wpp2, wpp3,
    ];
    urls.forEach((u) => { const img = new Image(); img.src = u; });
  }, []);

  function nextStep() {
    setStep((s) => Math.min(TOTAL_STEPS, s + 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  function prevStep() {
    setStep((s) => Math.max(1, s - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function pickSigno(id: string) {
    setSigno(id);
    await syncLead({ signo: id, etapa_atual: "quiz_signo" });
    setTimeout(nextStep, 200);
  }
  async function pickMes(m: string) {
    setMes(m);
    await syncLead({ mes_nascimento: m, etapa_atual: "quiz_mes" });
    setTimeout(nextStep, 200);
  }
  async function pickDia() {
    const d = parseInt(dia, 10);
    if (!d || d < 1 || d > 31) return;
    await syncLead({ dia_nascimento: d, etapa_atual: "quiz_dia" });
    nextStep();
  }
  async function pickPreocupacao(id: string) {
    setPreocupacao(id);
    await syncLead({ preocupacao: id, etapa_atual: "quiz_preocupacao" });
    setTimeout(nextStep, 200);
  }
  async function pickNome() {
    const n = nome.trim();
    if (n.length < 2) return;
    await syncLead({ nome: n, etapa_atual: "concluiu_quiz" });
    logEvent("concluiu_quiz");
    navigate("/chat");
  }

  return (
    <div className="min-h-screen bg-[#c9a4f0] flex flex-col">
      <div className={`max-w-xl w-full mx-auto px-4 relative flex-1 flex flex-col ${step > 1 ? "justify-center" : "py-8 sm:py-12"}`}>
        {loading ? <LoadingScreen /> : verifying ? <VerifyingScreen /> : <div className={step > 1 ? "w-full flex flex-col items-center text-center py-6" : ""}>
        {step === 1 && (
          <div className="animate-fade-in">
            <div className="text-center mb-6">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#3d1766] leading-tight mb-5 font-sans">
                Sua ALMA GÊMEA está procurando por você nesse momento!
              </h1>
              <p className="text-base sm:text-lg font-bold uppercase text-[#a259d9] mb-4 leading-snug">
                ESTÁ PRONTA PRA DESCOBRIR QUEM É ELE E ONDE ELE ESTÁ?
              </p>
              <h2 className="text-xl sm:text-2xl font-extrabold font-sans">
                <span className="text-[#d63ad6]">PASSO 1:</span> <span className="text-[#3d1766]">Qual o seu signo?</span>
              </h2>
            </div>

            <div className="grid grid-cols-4 gap-2 sm:gap-3 justify-items-center">
              {SIGNOS.map((s) => {
                const img = SIGNO_IMAGES[s.id];
                return (
                  <button
                    key={s.id}
                    onClick={() => pickSigno(s.id)}
                    className={`w-full aspect-[117/170] bg-[#d8b4fe] rounded-[14px] flex flex-col overflow-hidden border border-[#312e81] transition-all duration-200 hover:-translate-y-0.5 animate-fade-in-up ${
                      signo === s.id ? "ring-2 ring-[#d63ad6]" : "ring-0"
                    }`}
                  >
                    <div className="flex-1 flex items-center justify-center overflow-hidden p-1">
                      {img ? (
                        <img src={img} alt="" loading="lazy" decoding="async" className="w-full h-full object-contain" />
                      ) : (
                        <div className="w-full h-full rounded-full bg-black border-2 border-[#d4af37] flex items-center justify-center text-[#d4af37]">
                          <SignoIcon signoId={s.id} className="w-8 h-8" />
                        </div>
                      )}
                    </div>
                    <div className="h-[36%] bg-[#312e81] px-2 flex items-center justify-center text-white">
                      <span className="font-semibold text-[12px] sm:text-[14px] leading-tight text-center truncate">{s.nome}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {step === 2 && (
          <SocialProofStep
            signoNome={SIGNOS.find((s) => s.id === signo)?.nome ?? "Câncer"}
            onContinue={nextStep}
          />
        )}

        {false && step === 2 && (
          <div className="animate-fade-in">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {MESES.map((m) => (
                <ChoiceCard key={m} onClick={() => pickMes(m)} selected={mes === m}>
                  <span className="font-medium">{m}</span>
                </ChoiceCard>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <EstadoCivilStep
            value={estadoCivil}
            onPick={pickEstadoCivil}
          />
        )}

        {step === 4 && (
          <div className="animate-fade-in text-center">
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#3d1766] leading-snug mb-3 font-sans">
              Você acredita que o universo reservou uma <span className="text-[#d63ad6]">alma gêmea</span> destinada para sua vida?
            </h2>
            <p className="text-[#d63ad6] text-sm font-semibold mb-6">*Responda com sinceridade</p>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => pickAcredita("sim")}
                className="h-14 rounded-2xl bg-[#312e81] hover:bg-[#312e81]/90 text-white font-semibold flex items-center justify-center px-4 gap-2"
              >
                <span className="text-xl">🥰</span>
                <span>Sim</span>
              </button>
              <button
                onClick={() => pickAcredita("nao")}
                className="h-14 rounded-2xl bg-[#312e81] hover:bg-[#312e81]/90 text-white font-semibold flex items-center justify-center px-4 gap-2"
              >
                <span className="text-xl">💔</span>
                <span>Não</span>
              </button>
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="animate-fade-in text-center">
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#3d1766] leading-snug mb-3 font-sans">
              Você sabia que a sua <span className="text-[#d63ad6]">DATA DE NASCIMENTO</span> é capaz de revelar quem é a sua alma gêmea?
            </h2>
            <p className="text-[#d63ad6] text-sm font-semibold mb-6">*Responda com sinceridade</p>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => { syncLead({ data_revela: "sim" } as any); setTimeout(nextStep, 200); }}
                className="h-14 rounded-2xl bg-[#312e81] hover:bg-[#312e81]/90 text-white font-semibold flex items-center justify-center px-4 gap-2"
              >
                <span className="text-xl">🔮</span>
                <span>Sim</span>
              </button>
              <button
                onClick={() => { syncLead({ data_revela: "nao" } as any); setTimeout(nextStep, 200); }}
                className="h-14 rounded-2xl bg-[#312e81] hover:bg-[#312e81]/90 text-white font-semibold flex items-center justify-center px-4 gap-2"
              >
                <span className="text-xl">🤔</span>
                <span>Não</span>
              </button>
            </div>
          </div>
        )}

        {step === 6 && (
          <div className="animate-fade-in text-center text-[#3d1766]">
            <h2 className="text-lg sm:text-xl font-extrabold mb-4 leading-snug font-sans">
              <span>🔮</span> É COMPROVADO! Sua data de nascimento não é coincidência
            </h2>
            <p className="mb-4 text-[15px] leading-snug">
              O que quase ninguém sabe é que existe um <strong>Número do Amor</strong> oculto na sua data de nascimento.
            </p>
            <p className="mb-4 text-[15px] leading-snug">
              Esse número é o segredo escondido pelo universo que revela <strong>a verdade mais oculta do seu destino amoroso...</strong>
            </p>
            <p className="mb-3 text-[15px] font-bold leading-snug">
              E agora vou usar número do amor para te revelar quem é a pessoa que o universo reservou para você!
            </p>
            <p className="mb-6 text-[15px] font-bold">
              Está preparada para descobrir?
            </p>
            <button
              onClick={nextStep}
              className="w-full h-14 rounded-2xl bg-[#312e81] hover:bg-[#312e81]/90 text-white font-bold text-base flex items-center justify-center gap-2"
            >
              <span>🔮</span> CLIQUE PARA DESCOBRIR
            </button>
          </div>
        )}

        {step === 7 && (
          <CasosReaisStep onContinue={nextStep} />
        )}

        {step === 8 && (
          <SimNaoStep
            titulo={<>Você acredita que uma única decisão pode mudar seu <span className="text-[#d63ad6]">destino amoroso para sempre?</span></>}
            onPick={(r) => { syncLead({ decisao_destino: r } as any); setTimeout(nextStep, 200); }}
            emojiSim="😍"
            emojiNao="🤔"
          />
        )}

        {step === 9 && (
          <SimNaoStep
            titulo={<>Você gostaria de descobrir quem é sua alma gêmea <span className="text-[#d63ad6]">ainda hoje?</span></>}
            onPick={(r) => { syncLead({ descobrir_hoje: r } as any); setTimeout(nextStep, 200); }}
            emojiSim="😍"
            emojiNao="🤔"
          />
        )}

        {step === 10 && (
          <div className="animate-fade-in text-center">
            <h2 className="text-lg sm:text-xl font-extrabold text-[#3d1766] leading-snug mb-3 font-sans">
              Meu nome é Isis, sou numeromante a 20 anos e fiquei famosa por revelar a alma gêmea de várias celebridades
            </h2>
            <p className="text-[#d63ad6] font-bold mb-5">
              Olha um vídeo da Virgínia falando em um podcast.
            </p>
            <div className="relative w-full rounded-2xl overflow-hidden mb-5" style={{ paddingBottom: "56.25%" }}>
              <iframe
                className="absolute inset-0 w-full h-full"
                src="https://www.youtube.com/embed/rnWeSWUho10"
                title="Vídeo Virgínia"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <button
              onClick={nextStep}
              className="w-full h-14 rounded-2xl bg-[#312e81] hover:bg-[#312e81]/90 text-white font-bold text-base flex items-center justify-center gap-2"
            >
              <span>🔮</span> CLIQUE PARA CONTINUAR
            </button>
          </div>
        )}

        {step === 11 && (
          <div className="animate-fade-in text-center">
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#3d1766] leading-snug mb-3 font-sans">
              Para começar, me fale o seu primeiro nome
            </h2>
            <p className="text-[#d63ad6] font-semibold mb-5 flex items-center justify-center gap-2">
              <span>🔒</span> Seus dados estão seguros
            </p>
            <Input
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Digite seu nome..."
              className="text-lg italic h-16 bg-white border-0 rounded-2xl text-[#3d1766] placeholder:text-[#3d1766]/40 px-5"
              maxLength={60}
            />
            <button
              onClick={submitNome}
              className="w-full mt-4 h-14 rounded-2xl bg-[#312e81] hover:bg-[#312e81]/90 text-white font-bold text-base"
            >
              Clique para continuar
            </button>
          </div>
        )}

        {step === 12 && (
          <div className="animate-fade-in">
            <div className="bg-[#ef4444] text-white rounded-2xl p-5 mb-5">
              <p className="font-bold mb-2">Atenção!</p>
              <p className="text-sm">Apenas três leituras gratuitas para hoje!</p>
            </div>
            <h2 className="text-center text-xl sm:text-2xl font-extrabold text-[#3d1766] leading-snug mb-5 font-sans">
              Boa notícia ! Isis está online agora e está pronta para revelar sua alma gêmea!
            </h2>
            <img src={isisCard} alt="Numeromante Isis - Online" className="w-full h-auto mb-5 rounded-2xl" />
            <button
              onClick={() => { navigate(`/chat?nome=${encodeURIComponent(nome.trim())}`); }}
              className="w-full h-14 rounded-2xl bg-[#312e81] hover:bg-[#312e81]/90 text-white font-bold"
            >
              REVELAR MINHA ALMA GÊMEA
            </button>
          </div>
        )}
        </div>}
      </div>
    </div>
  );
}
