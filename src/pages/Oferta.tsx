import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MysticShell } from "@/components/funnel/MysticShell";
import { Button } from "@/components/ui/button";
import { getState, logEvent, syncLead } from "@/lib/leadStore";

export default function Oferta() {
  const navigate = useNavigate();
  const [nome, setNome] = useState<string>();
  const [seconds, setSeconds] = useState(15 * 60);

  useEffect(() => {
    setNome(getState().nome);
    syncLead({ etapa_atual: "oferta" });
    logEvent("abriu_oferta");

    // Back redirect: se o usuário tentar voltar
    const onPop = () => {
      logEvent("back_redirect_disparado");
      navigate("/back-redirect", { replace: true });
    };
    history.pushState(null, "", location.href);
    window.addEventListener("popstate", onPop);

    const t = setInterval(() => setSeconds((s) => Math.max(0, s - 1)), 1000);
    return () => {
      clearInterval(t);
      window.removeEventListener("popstate", onPop);
    };
  }, [navigate]);

  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");

  function comprar() {
    logEvent("clicou_comprar_principal", { valor: 29 });
    syncLead({ etapa_atual: "checkout_principal", comprou_principal: true } as never);
    // placeholder pro checkout — google.com depois redireciona pro upsell ao voltar
    window.open("https://google.com", "_blank");
    setTimeout(() => navigate("/upsell-1"), 800);
  }

  return (
    <MysticShell>
      <div className="text-center mb-6 animate-fade-in">
        <div className="inline-flex items-center gap-2 bg-magenta/20 text-magenta border border-magenta/40 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
          ⏰ Oferta expira em {mm}:{ss}
        </div>
        <h1 className="text-3xl sm:text-4xl font-serif-mystic mb-3">
          {nome ?? "Querida"}, o universo já preparou o <span className="text-magenta">rosto da sua alma gêmea</span>
        </h1>
        <p className="text-muted-foreground">Receba agora o desenho exclusivo gerado pelo seu número do amor</p>
      </div>

      <div className="bg-gradient-card border-2 border-gold rounded-3xl p-6 sm:p-8 shadow-mystic animate-fade-in-up">
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="text-center">
            <div className="text-muted-foreground line-through text-lg">R$ 197</div>
            <div className="text-5xl sm:text-6xl font-bold text-gold-glow">R$ 29</div>
            <div className="text-xs text-muted-foreground mt-1">pagamento único</div>
          </div>
        </div>

        <div className="space-y-3 mb-6">
          {[
            "🎨 Desenho personalizado da sua alma gêmea",
            "🔮 Leitura completa do seu número do amor",
            "💜 Mapa das características dele(a)",
            "📍 Pistas sobre onde vocês podem se encontrar",
            "🛡️ Garantia tripla: 100% do dinheiro de volta + R$ 50",
          ].map((b) => (
            <div key={b} className="flex items-start gap-3 text-sm sm:text-base">
              <span className="text-gold mt-0.5">✓</span>
              <span>{b}</span>
            </div>
          ))}
        </div>

        <Button
          onClick={comprar}
          className="w-full h-16 text-lg sm:text-xl bg-gradient-gold text-gold-foreground hover:opacity-90 shadow-gold font-bold pulse-gold"
        >
          ✨ QUERO MEU DESENHO AGORA
        </Button>

        <div className="text-center mt-4 text-xs text-muted-foreground">
          🔒 Pagamento 100% seguro · Acesso imediato após confirmação
        </div>
      </div>

      <div className="mt-8 text-center text-sm text-muted-foreground space-y-2 animate-fade-in">
        <div>⭐⭐⭐⭐⭐ Mais de 12.847 mulheres já encontraram</div>
        <div className="italic">"Recebi o desenho e era IDÊNTICO ao homem que conheci 2 semanas depois!" — Maria, 34</div>
      </div>
    </MysticShell>
  );
}
