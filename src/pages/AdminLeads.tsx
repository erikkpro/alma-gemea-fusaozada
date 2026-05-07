import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";

type Lead = {
  id: string;
  created_at: string;
  nome: string | null;
  signo: string | null;
  mes_nascimento: string | null;
  dia_nascimento: number | null;
  preocupacao: string | null;
  etapa_atual: string;
  comprou_principal: boolean;
  comprou_upsell_1: boolean;
  comprou_upsell_2: boolean;
};

export default function AdminLeads() {
  const [session, setSession] = useState<unknown>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    supabase.auth.onAuthStateChange((_event, sess) => {
      setSession(sess);
      if (sess?.user) checkRole(sess.user.id);
      else { setIsAdmin(false); setLoading(false); }
    });
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      if (data.session?.user) checkRole(data.session.user.id);
      else setLoading(false);
    });
  }, []);

  async function checkRole(uid: string) {
    setLoading(true);
    const { data } = await supabase.from("user_roles").select("role").eq("user_id", uid).eq("role", "admin").maybeSingle();
    setIsAdmin(!!data);
    if (data) loadLeads();
    else setLoading(false);
  }

  async function loadLeads() {
    setLoading(true);
    const { data, error } = await supabase
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(500);
    if (error) toast({ title: "Erro", description: error.message, variant: "destructive" });
    setLeads((data ?? []) as Lead[]);
    setLoading(false);
  }

  async function signIn(e: React.FormEvent) {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) toast({ title: "Erro", description: error.message, variant: "destructive" });
  }
  async function signUp(e: React.FormEvent) {
    e.preventDefault();
    const { error } = await supabase.auth.signUp({
      email, password,
      options: { emailRedirectTo: window.location.origin + "/admin/leads" },
    });
    if (error) return toast({ title: "Erro", description: error.message, variant: "destructive" });
    toast({ title: "Cadastrado!", description: "Agora peça pro dono do projeto te tornar admin no banco." });
  }
  async function signOut() {
    await supabase.auth.signOut();
    setSession(null); setIsAdmin(false); setLeads([]);
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Carregando...</div>;

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-sm p-6 bg-gradient-card border-border">
          <h1 className="text-2xl font-serif-mystic mb-4 text-gold">Painel — Login</h1>
          <form onSubmit={signIn} className="space-y-3">
            <Input type="email" placeholder="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <Input type="password" placeholder="senha" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
            <Button type="submit" className="w-full bg-gradient-gold text-gold-foreground">Entrar</Button>
            <Button type="button" variant="outline" className="w-full" onClick={signUp}>Criar conta</Button>
          </form>
        </Card>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 text-center">
        <Card className="p-6 max-w-sm bg-gradient-card">
          <h2 className="text-xl mb-2 text-gold font-serif-mystic">Acesso negado</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Sua conta foi criada mas não tem permissão de admin. Adicione um registro na tabela <code>user_roles</code> com seu user_id e role = <b>admin</b>.
          </p>
          <Button onClick={signOut} variant="outline" className="w-full">Sair</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 sm:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-serif-mystic text-gold">Leads ({leads.length})</h1>
          <div className="flex gap-2">
            <Button onClick={loadLeads} variant="outline" size="sm">↻ Atualizar</Button>
            <Button onClick={signOut} variant="outline" size="sm">Sair</Button>
          </div>
        </div>

        <Card className="bg-gradient-card border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-secondary/50 text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="text-left p-3">Data</th>
                  <th className="text-left p-3">Nome</th>
                  <th className="text-left p-3">Signo</th>
                  <th className="text-left p-3">Nascimento</th>
                  <th className="text-left p-3">Preocupação</th>
                  <th className="text-left p-3">Etapa</th>
                  <th className="text-left p-3">Compras</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((l) => (
                  <tr key={l.id} className="border-t border-border hover:bg-secondary/30">
                    <td className="p-3 whitespace-nowrap text-muted-foreground">{new Date(l.created_at).toLocaleString("pt-BR")}</td>
                    <td className="p-3 font-medium">{l.nome ?? "—"}</td>
                    <td className="p-3 capitalize">{l.signo ?? "—"}</td>
                    <td className="p-3">{l.dia_nascimento ?? "—"} {l.mes_nascimento ?? ""}</td>
                    <td className="p-3 text-xs">{l.preocupacao ?? "—"}</td>
                    <td className="p-3"><span className="px-2 py-0.5 rounded-full bg-secondary text-xs">{l.etapa_atual}</span></td>
                    <td className="p-3 text-xs">
                      {l.comprou_principal && <span className="text-emerald-400 mr-1">✓P</span>}
                      {l.comprou_upsell_1 && <span className="text-emerald-400 mr-1">✓U1</span>}
                      {l.comprou_upsell_2 && <span className="text-emerald-400">✓U2</span>}
                    </td>
                  </tr>
                ))}
                {leads.length === 0 && (
                  <tr><td colSpan={7} className="p-8 text-center text-muted-foreground">Nenhum lead ainda.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
