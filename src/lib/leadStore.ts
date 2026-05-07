import { supabase } from "@/integrations/supabase/client";

const STORAGE_KEY = "ag_funnel_state";

export type FunnelState = {
  leadId?: string;
  nome?: string;
  signo?: string;
  mes_nascimento?: string;
  dia_nascimento?: number;
  preocupacao?: string;
  etapa_atual?: string;
};

export function getState(): FunnelState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function saveState(patch: Partial<FunnelState>) {
  const next = { ...getState(), ...patch };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  return next;
}

export function clearState() {
  localStorage.removeItem(STORAGE_KEY);
}

/** Cria ou atualiza o lead no Cloud. Silencioso em caso de erro pra não quebrar o funil. */
export async function syncLead(patch: Partial<FunnelState>): Promise<FunnelState> {
  const current = getState();
  const merged = { ...current, ...patch };

  try {
    if (!merged.leadId) {
      const { data, error } = await supabase
        .from("leads")
        .insert({
          nome: merged.nome ?? null,
          signo: merged.signo ?? null,
          mes_nascimento: merged.mes_nascimento ?? null,
          dia_nascimento: merged.dia_nascimento ?? null,
          preocupacao: merged.preocupacao ?? null,
          etapa_atual: merged.etapa_atual ?? "quiz",
        })
        .select("id")
        .single();
      if (!error && data) {
        merged.leadId = data.id;
      }
    } else {
      await supabase
        .from("leads")
        .update({
          nome: merged.nome ?? null,
          signo: merged.signo ?? null,
          mes_nascimento: merged.mes_nascimento ?? null,
          dia_nascimento: merged.dia_nascimento ?? null,
          preocupacao: merged.preocupacao ?? null,
          etapa_atual: merged.etapa_atual ?? "quiz",
        })
        .eq("id", merged.leadId);
    }
  } catch (err) {
    console.warn("syncLead failed", err);
  }

  return saveState(merged);
}

export async function logEvent(evento: string, metadata?: Record<string, unknown>) {
  const { leadId } = getState();
  try {
    await supabase.from("lead_eventos").insert([{
      lead_id: leadId ?? null,
      evento,
      metadata: (metadata ?? null) as never,
    }]);
  } catch (err) {
    console.warn("logEvent failed", err);
  }
}
