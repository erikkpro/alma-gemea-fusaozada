export const SIGNOS = [
  { id: "aries", nome: "Áries", emoji: "♈" },
  { id: "touro", nome: "Touro", emoji: "♉" },
  { id: "gemeos", nome: "Gêmeos", emoji: "♊" },
  { id: "cancer", nome: "Câncer", emoji: "♋" },
  { id: "leao", nome: "Leão", emoji: "♌" },
  { id: "virgem", nome: "Virgem", emoji: "♍" },
  { id: "libra", nome: "Libra", emoji: "♎" },
  { id: "escorpiao", nome: "Escorpião", emoji: "♏" },
  { id: "sagitario", nome: "Sagitário", emoji: "♐" },
  { id: "capricornio", nome: "Capricórnio", emoji: "♑" },
  { id: "aquario", nome: "Aquário", emoji: "♒" },
  { id: "peixes", nome: "Peixes", emoji: "♓" },
];

export const MESES = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

export const PREOCUPACOES = [
  { id: "sozinha", label: "Tenho medo de ficar sozinha pra sempre" },
  { id: "errado", label: "Sempre escolho a pessoa errada" },
  { id: "magoada", label: "Já fui muito magoada antes" },
  { id: "quando", label: "Quero saber quando vou encontrar" },
];

/**
 * Roteiro do chat da Serena — extraído e organizado dos JSONs do Typebot.
 * Cada item é renderizado em sequência. Tipos:
 *  - 'text': mensagem de texto (suporta {{nome}})
 *  - 'audio': player de áudio
 *  - 'video': embed (Wistia/YouTube)
 *  - 'choice': bloco de botões. Avança após clique.
 *  - 'cta': botão de ação que navega pra outra rota
 *  - 'wait': pausa extra (em ms) — opcional, normalmente o delay já é por mensagem
 */
export type ChatStep =
  | { type: "text"; text: string; delay?: number }
  | { type: "audio"; url: string; delay?: number }
  | { type: "video"; url: string; delay?: number }
  | { type: "choice"; options: { label: string; value: string }[]; saveAs?: string }
  | { type: "cta"; label: string; href: string };

export const FRONT_CHAT: ChatStep[] = [
  { type: "text", text: "Oi {{nome}}! Você clicou no momento certo! 👋" },
  { type: "text", text: "Antes de eu revelar o seu número do amor, deixa eu te dar boas-vindas..." },
  { type: "text", text: "⏳ Sua consulta está começando..." },
  { type: "text", text: "Feliz que você está aqui, eu estava esperando por você! 🔮" },
  { type: "text", text: "Meu nome é **Serena**, e em apenas **1 minuto** irei ter as respostas que você está procurando sobre o seu **futuro amoroso...**" },
  { type: "text", text: "Inclusive olha a minha reportagem que saiu mês passado 👇" },
  { type: "video", url: "https://fast.wistia.com/embed/medias/71djxx30im" },
  { type: "text", text: "Você sabia que o universo já tem uma pessoa preparada especialmente para você?" },
  { type: "text", text: "Essa pessoa é o que chamamos de **alma gêmea** — alguém que vibra na mesma frequência energética que você." },
  { type: "text", text: "E hoje vou te mostrar **o rosto dela** através do seu número do amor 💜" },
  {
    type: "choice",
    saveAs: "interesse",
    options: [
      { label: "✨ Quero descobrir agora!", value: "sim" },
      { label: "💜 Estou curiosa", value: "curiosa" },
    ],
  },
  { type: "text", text: "Perfeito {{nome}}! Olha o que algumas das milhares de mulheres que já passaram por aqui me disseram..." },
  { type: "text", text: "🎙️ Áudio da Fátima Bernardes (uma das minhas clientes):" },
  { type: "audio", url: "https://tuachamagemea.site/wp-content/uploads/2024/07/fatima-audio.mp3" },
  { type: "text", text: "💌 *\"Serena, recebi o desenho e fiquei sem reação. Era o rosto exato do homem que conheci 2 semanas depois!\"* — Maria, 34" },
  { type: "text", text: "💌 *\"Achei que era brincadeira. Mas quando vi o desenho, era IDÊNTICO ao meu vizinho que eu nem reparava antes...\"* — Camila, 28" },
  { type: "text", text: "💌 *\"Eu tinha desistido do amor. Hoje estou noiva do homem que apareceu no desenho!\"* — Patrícia, 41" },
  { type: "text", text: "Agora preciso te avisar uma coisa importante, {{nome}}..." },
  { type: "text", text: "Esse desenho NÃO é simbólico. É o **rosto real** da sua alma gêmea — a pessoa que o universo já escolheu pra você." },
  { type: "text", text: "Normalmente a consulta custa **R$ 197**, mas hoje, por estar aqui no momento certo, você consegue por apenas **R$ 29**." },
  { type: "text", text: "São apenas **17 vagas** abertas hoje (depois disso, volta pro preço normal)." },
  { type: "text", text: "👇 Toque no botão abaixo pra garantir o seu desenho:" },
  { type: "cta", label: "✨ Quero meu desenho agora", href: "/oferta" },
];

export const UPSELL_1_CHAT: ChatStep[] = [
  { type: "text", text: "🎉 **PARABÉNS {{nome}}!** Você acabou de dar o primeiro passo para encontrar sua alma gêmea!" },
  { type: "text", text: "Em alguns minutos você receberá um e-mail com o seu desenho..." },
  { type: "text", text: "🚨 Mas preciso te contar algo URGENTE que descobri sobre você durante o cálculo do seu número do amor..." },
  { type: "text", text: "Sua energia numerológica está **BLOQUEADA** em pelo menos 3 áreas da sua vida!" },
  { type: "text", text: "E isso não está apenas impedindo você de encontrar seu par cósmico..." },
  { type: "text", text: "Está SABOTANDO seu sucesso financeiro, sua saúde e até sua autoestima 😰" },
  {
    type: "choice",
    options: [
      { label: "✅ Pode me contar!", value: "sim" },
      { label: "💜 Estou curiosa", value: "curiosa" },
    ],
  },
  { type: "text", text: "Eu vou te entregar o **Mapa Numerológico Completo** que revela:" },
  { type: "text", text: "🔓 Os 3 bloqueios energéticos que estão te travando" },
  { type: "text", text: "💰 Como destravar a sua prosperidade financeira" },
  { type: "text", text: "❤️ O caminho mais curto até a sua alma gêmea" },
  { type: "text", text: "Esse mapa custa **R$ 97**, mas como você é minha cliente, hoje sai por apenas **R$ 19**." },
  { type: "cta", label: "🔓 Quero meu Mapa Numerológico", href: "/upsell-2" },
];

export const UPSELL_2_CHAT: ChatStep[] = [
  { type: "text", text: "Olá {{nome}}, **Serena** aqui novamente ✨" },
  { type: "text", text: "Você não quer apenas *saber* quem é sua alma gêmea, certo?" },
  { type: "text", text: "Você quer **encontrá-la!**" },
  { type: "text", text: "Mas esse encontro pode demorar 1 mês, 1 ano ou até 5 anos..." },
  { type: "text", text: "E não quero que você espere tanto tempo pra finalmente conhecer a pessoa que o universo preparou pra você!" },
  { type: "text", text: "Por isso criei o **Ritual da Alma Gêmea** — um ritual ancestral que ACELERA o encontro em até 90 dias 🔥" },
  {
    type: "choice",
    options: [
      { label: "✅ Quero conhecer", value: "sim" },
    ],
  },
  { type: "text", text: "O Ritual inclui:" },
  { type: "text", text: "🕯️ Velas energizadas com seu número do amor" },
  { type: "text", text: "📿 Cristais alinhados à sua frequência" },
  { type: "text", text: "🌙 Meditação guiada de 7 dias para abrir os caminhos" },
  { type: "text", text: "Investimento normal: **R$ 297**. Hoje, somente para você: **R$ 47**." },
  { type: "cta", label: "🔥 Quero acelerar o encontro", href: "/obrigado" },
];

export const BACK_REDIRECT_CHAT: ChatStep[] = [
  { type: "text", text: "Oi {{nome}}, não vou desistir de você!! 💜" },
  { type: "text", text: "Eu te entendo... sei que abrir o coração de novo dá medo." },
  { type: "text", text: "Por isso vou fazer algo por você que raramente faço:" },
  { type: "text", text: "Vou te dar uma **GARANTIA TRIPLA:**" },
  { type: "text", text: "✅ Se não funcionar, devolvemos 100% do seu dinheiro" },
  { type: "text", text: "✅ E ainda te damos **R$ 50** pelo seu tempo" },
  { type: "text", text: "✅ Você pode até LUCRAR se não der certo!" },
  { type: "text", text: "E de R$ 49 vou fazer por apenas **R$ 19** se você decidir AGORA 👇" },
  { type: "cta", label: "✅ Quero aproveitar o desconto", href: "https://google.com" },
];
