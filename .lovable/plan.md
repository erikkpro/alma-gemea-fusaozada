# Clone do Funil Alma Gêmea no Lovable

Vou recriar o funil inteiro como uma aplicação web só sua, mantendo a vibe mística (roxo + dourado) mas com tipografia melhor, animações suaves e ótimo mobile. Os leads ficam salvos no Lovable Cloud, e os botões de compra vão pro `google.com` como placeholder (você troca depois).

## Fluxo completo do funil

```text
/  (Quiz - estilo Inlead)
   ├─ Passo 1: Signo (12 cards com ícones dourados)
   ├─ Passo 2: Mês de nascimento
   ├─ Passo 3: Dia de nascimento
   ├─ Passo 4: Maior preocupação no amor
   ├─ Passo 5: Nome
   └─ → /chat

/chat  (Conversa da "Serena" estilo WhatsApp)
   ├─ Mensagens com efeito "digitando..."
   ├─ Áudios, vídeo embed (Wistia da Fátima Bernardes)
   ├─ Depoimentos
   ├─ Apresentação da oferta (R$49 → R$29)
   ├─ Botões de resposta (choice inputs)
   └─ CTA "Quero meu desenho" → /oferta

/oferta  (Página de checkout/pitch)
   ├─ Headline + prova social + garantia
   ├─ Botão Comprar → google.com
   ├─ Se sair sem comprar → trigger /back-redirect
   └─ Após "compra" → /upsell-1

/back-redirect  (Recuperação)
   └─ Serena: "Não vou desistir de você" + desconto R$29

/upsell-1  (Mapa Numerológico)
   └─ Serena revela "bloqueio energético" → CTA → /upsell-2 ou /obrigado

/upsell-2  (Ritual da Alma Gêmea)
   └─ Última oferta → /obrigado

/obrigado  (Confirmação final)

/admin/leads  (Painel pra você ver os leads)
   └─ Lista nome, mês/dia nascimento, signo, etapa que parou, data
```

## Visual / Design System

- **Paleta**: roxo profundo (`#1a0b2e` fundo) + lilás claro nos cards (`#b794f4`) + dourado (`#d4af37`) nos ícones e CTAs + rosa magenta no destaque dos títulos
- **Tipografia**: serifada elegante nos títulos (estilo místico), sans-serif limpa no corpo
- **Detalhes**: estrelinhas sutis no fundo, gradientes suaves, animações de fade/slide entre etapas, efeito "digitando..." no chat (3 bolinhas pulsando), barra de progresso no quiz
- **Mobile-first**: tudo otimizado pra celular (que é onde 99% do tráfego cai)

## Telas principais

**Quiz (5 passos)**: barra de progresso no topo, pergunta grande, opções em cards clicáveis. Cada clique avança suave pro próximo passo. Nome e respostas salvos no estado e persistidos no localStorage (caso recarregue).

**Chat da Serena**: layout WhatsApp (avatar da Serena no topo, "online", balões verdes/brancos). Mensagens aparecem uma a uma com timing real (delays de 1-3s como no Typebot), com indicador "digitando...". Suporta texto, áudio (player customizado), vídeo embed e blocos de escolha (botões que o usuário clica pra continuar). Auto-scroll pro fim.

**Oferta / Upsells**: páginas de venda com headline forte, vídeo/imagem do produto, prova social, garantia tripla, contador de urgência, botão grande dourado.

**Back Redirect**: dispara quando o usuário tenta sair da `/oferta` (evento `beforeunload` ou volta no histórico). Mostra modal/redireciona pra recuperação com desconto.

**Admin de Leads**: tela simples protegida (login básico) listando todos os leads capturados, filtrável por etapa.

## Backend (Lovable Cloud)

Tabela `leads`:
- `id`, `created_at`
- `nome`, `signo`, `mes_nascimento`, `dia_nascimento`, `preocupacao`
- `etapa_atual` (quiz / chat / oferta / upsell-1 / upsell-2 / concluido)
- `comprou_principal`, `comprou_upsell_1`, `comprou_upsell_2` (booleanos pra quando integrar checkout real)

Tabela `lead_eventos` (log de cada interação):
- `lead_id`, `evento` (passou_quiz, abriu_chat, clicou_oferta, etc), `timestamp`

Auth simples no `/admin/leads` (você cria seu usuário).

## Detalhes técnicos

- React Router com as rotas acima
- Estado do funil persistido em `localStorage` + sincronizado no Cloud a cada etapa concluída
- Componente `<TypingMessage />` reutilizável que recebe `delay` e `text` e simula digitação
- Conteúdo do chat (mensagens, áudios, escolhas) extraído dos JSONs do Typebot que você mandou e organizado num arquivo de configuração `src/data/chat-script.ts` — fácil de editar depois
- RLS nas tabelas: `leads` aceita INSERT/UPDATE público (pra capturar mesmo sem login), SELECT só pra admin autenticado
- Botões de compra apontam todos pra `https://google.com` (placeholder, troca em 1 lugar só depois)

## Fora do escopo desta primeira versão

- Integração com gateway de pagamento real (Kiwify/Hotmart/Stripe)
- Envio de e-mail automático com o "desenho"
- Pixels de tracking (Facebook, TikTok, Utmify) — dá pra adicionar depois
- Geração real do desenho da alma gêmea por IA (hoje no funil original isso é entregue por e-mail manual/serviço externo)

Quando aprovar, parto pra implementação. Vai ser uma jornada — recomendo a gente revisar tela por tela conforme forem ficando prontas.