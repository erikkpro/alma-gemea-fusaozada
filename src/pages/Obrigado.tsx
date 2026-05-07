import { useEffect } from "react";
import { Link } from "react-router-dom";
import { MysticShell } from "@/components/funnel/MysticShell";
import { syncLead, logEvent, clearState } from "@/lib/leadStore";

export default function Obrigado() {
  useEffect(() => {
    syncLead({ etapa_atual: "concluido" });
    logEvent("concluiu_funil");
    setTimeout(clearState, 5000);
  }, []);

  return (
    <MysticShell>
      <div className="text-center py-12 animate-fade-in-up">
        <div className="text-6xl mb-6">✨</div>
        <h1 className="text-4xl font-serif-mystic mb-4 text-gold-glow">Tudo certo!</h1>
        <p className="text-lg text-muted-foreground mb-2">
          Em alguns minutos você receberá no seu e-mail o desenho da sua alma gêmea junto com sua leitura completa.
        </p>
        <p className="text-sm text-muted-foreground mb-8">
          O universo já está alinhando os caminhos pra vocês se encontrarem 💜
        </p>
        <Link
          to="/"
          className="inline-block px-6 py-3 rounded-full border border-gold/40 text-gold hover:bg-gold/10 transition-colors text-sm"
        >
          ← Voltar ao início
        </Link>
      </div>
    </MysticShell>
  );
}
