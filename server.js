const express = require("express");
const { Pool } = require("pg");

const app = express();
const port = process.env.PORT || 3000;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: false
});

function escHtml(texto) {
  if (texto === null || texto === undefined) return "";
  return String(texto)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function nl2brEsc(texto) {
  return escHtml(texto).replace(/\n/g, "<br>");
}

function getLabels(idioma) {
  const dict = {
    pt: {
      pageTitle: "Guia de Boas-Vindas",
      welcomeTitle: "Seja bem-vindo! 🌿",
      welcomeText:
        "Toque nos ícones para saber mais sobre o apartamento, a vizinhança e tudo que você precisa para uma estadia perfeita.",
      contactButton: "Entre em contato",
      copyToast: "✓ Copiado!",
      languageTitle: "Idioma",
      sections: {
        importante: "Importante",
        amenidades: "Amenidades",
        wifi: "Wi-Fi",
        checkin: "Check-in/out",
        regras: "Regras",
        apartamento: "O Apartamento",
        locomover: "Locomover",
        chegar: "Como Chegar",
        restaurantes: "Restaurantes",
        bares: "Bares",
        fazer: "O que Fazer",
        partir: "Antes de Partir",
        emergencia: "Emergência",
        avaliacao: "Avaliação",
        faq: "Perguntas",
        cafe: "Café da Manhã",
        proximos: "Mais Próximos",
        doces: "Cafés & Doces",
        contato: "Contato"
      },
      wifi: {
        title: "Wi-Fi",
        network: "Rede",
        password: "Senha",
        copyPassword: "Copiar senha"
      },
      checkin: { title: "Check-in / Check-out", checkin: "Check-in", checkout: "Check-out" },
      apartmentTitle: "O Apartamento",
      rulesTitle: "Regras do Apartamento",
      gettingThereTitle: "Como Chegar",
      gettingAroundTitle: "Como se Locomover",
      beforeLeavingTitle: "Antes de Partir",
      contactTitle: "Entre em Contato",
      importantTitle: "Importante",
      amenitiesTitle: "Amenidades",
      restaurantsTitle: "Restaurantes Locais",
      barsTitle: "Bares",
      breakfastTitle: "Café da Manhã",
      sweetsTitle: "Cafés & Doces",
      nearbyTitle: "Mais Próximos",
      whatToDoTitle: "O que Fazer",
      emergencyTitle: "Emergência",
      reviewTitle: "Avaliação",
      faqTitle: "Perguntas Frequentes",
      openMaps: "Abrir no Google Maps",
      placeholder:
        "Conteúdo desta seção pode ser enriquecido depois com os dados completos do PDF.",
      activeLang: {
        pt: "🇧🇷 Português",
        en: "🇺🇸 English",
        es: "🇪🇸 Español"
      }
    },
    en: {
      pageTitle: "Welcome Guide",
      welcomeTitle: "Welcome! 🌿",
      welcomeText:
        "Tap the icons to learn more about the apartment, the neighborhood and everything you need for a perfect stay.",
      contactButton: "Get in touch",
      copyToast: "✓ Copied!",
      languageTitle: "Language",
      sections: {
        importante: "Important",
        amenidades: "Amenities",
        wifi: "Wi-Fi",
        checkin: "Check-in/out",
        regras: "Rules",
        apartamento: "The Apartment",
        locomover: "Getting Around",
        chegar: "Directions",
        restaurantes: "Restaurants",
        bares: "Bars",
        fazer: "What To Do",
        partir: "Before Leaving",
        emergencia: "Emergency",
        avaliacao: "Review",
        faq: "Questions",
        cafe: "Breakfast",
        proximos: "Nearby",
        doces: "Cafés & Pastries",
        contato: "Contact"
      },
      wifi: {
        title: "Wi-Fi",
        network: "Network",
        password: "Password",
        copyPassword: "Copy password"
      },
      checkin: { title: "Check-in / Check-out", checkin: "Check-in", checkout: "Check-out" },
      apartmentTitle: "The Apartment",
      rulesTitle: "Apartment Rules",
      gettingThereTitle: "Directions",
      gettingAroundTitle: "Getting Around",
      beforeLeavingTitle: "Before Leaving",
      contactTitle: "Get in Touch",
      importantTitle: "Important",
      amenitiesTitle: "Amenities",
      restaurantsTitle: "Local Restaurants",
      barsTitle: "Bars",
      breakfastTitle: "Breakfast",
      sweetsTitle: "Cafés & Pastries",
      nearbyTitle: "Places Nearby",
      whatToDoTitle: "What To Do",
      emergencyTitle: "Emergency",
      reviewTitle: "Review",
      faqTitle: "Frequently Asked Questions",
      openMaps: "Open in Google Maps",
      placeholder:
        "This section can be enriched later with the full data from the PDF.",
      activeLang: {
        pt: "🇧🇷 Português",
        en: "🇺🇸 English",
        es: "🇪🇸 Español"
      }
    },
    es: {
      pageTitle: "Guía de Bienvenida",
      welcomeTitle: "¡Bienvenido! 🌿",
      welcomeText:
        "Toca los íconos para saber más sobre el apartamento, el vecindario y todo lo que necesitas para una estadía perfecta.",
      contactButton: "Contáctanos",
      copyToast: "✓ ¡Copiado!",
      languageTitle: "Idioma",
      sections: {
        importante: "Importante",
        amenidades: "Comodidades",
        wifi: "Wi-Fi",
        checkin: "Check-in/out",
        regras: "Reglas",
        apartamento: "El Apartamento",
        locomover: "Moverse",
        chegar: "Cómo Llegar",
        restaurantes: "Restaurantes",
        bares: "Bares",
        fazer: "Qué Hacer",
        partir: "Antes de Partir",
        emergencia: "Emergencia",
        avaliacao: "Reseña",
        faq: "Preguntas",
        cafe: "Desayuno",
        proximos: "Lugares Cercanos",
        doces: "Cafés y Dulces",
        contato: "Contacto"
      },
      wifi: {
        title: "Wi-Fi",
        network: "Red",
        password: "Contraseña",
        copyPassword: "Copiar contraseña"
      },
      checkin: { title: "Check-in / Check-out", checkin: "Check-in", checkout: "Check-out" },
      apartmentTitle: "El Apartamento",
      rulesTitle: "Reglas del Apartamento",
      gettingThereTitle: "Cómo Llegar",
      gettingAroundTitle: "Cómo Moverse",
      beforeLeavingTitle: "Antes de Partir",
      contactTitle: "Contáctanos",
      importantTitle: "Importante",
      amenitiesTitle: "Comodidades",
      restaurantsTitle: "Restaurantes Locales",
      barsTitle: "Bares",
      breakfastTitle: "Desayuno",
      sweetsTitle: "Cafés y Dulces",
      nearbyTitle: "Lugares Cercanos",
      whatToDoTitle: "Qué Hacer",
      emergencyTitle: "Emergencia",
      reviewTitle: "Reseña",
      faqTitle: "Preguntas Frecuentes",
      openMaps: "Abrir en Google Maps",
      placeholder:
        "Esta sección puede enriquecerse después con los datos completos del PDF.",
      activeLang: {
        pt: "🇧🇷 Português",
        en: "🇺🇸 English",
        es: "🇪🇸 Español"
      }
    }
  };

  return dict[idioma] || dict.pt;
}

app.get("/", (req, res) => {
  res.send("Guia do Hóspede rodando 🚀");
});

app.get("/imovel/:codigo/:idioma?", async (req, res) => {
  const { codigo } = req.params;
  const idioma = req.params.idioma || "pt";
  const t = getLabels(idioma);

  try {
    const imovelResult = await pool.query(
      "SELECT * FROM imoveis WHERE codigo_publico = $1",
      [codigo]
    );

    if (imovelResult.rows.length === 0) {
      return res.status(404).send("Imóvel não encontrado");
    }

    const imovel = imovelResult.rows[0];

    let conteudoResult = await pool.query(
      "SELECT * FROM imovel_conteudos WHERE imovel_id = $1 AND idioma = $2 LIMIT 1",
      [imovel.id, idioma]
    );

    if (conteudoResult.rows.length === 0 && idioma !== "pt") {
      conteudoResult = await pool.query(
        "SELECT * FROM imovel_conteudos WHERE imovel_id = $1 AND idioma = 'pt' LIMIT 1",
        [imovel.id]
      );
    }

    const conteudo = conteudoResult.rows[0] || {};
const idiomaFinal = req.params.idioma || "pt";

let secoesResult = await pool.query(
  `
  SELECT *
  FROM imovel_secao_itens
  WHERE imovel_id = $1
    AND idioma = $2
    AND ativo = true
  ORDER BY secao, ordem
  `,
  [imovel.id, idiomaFinal]
);

// fallback para português
if (secoesResult.rows.length === 0 && idiomaFinal !== "pt") {
  secoesResult = await pool.query(
    `
    SELECT *
    FROM imovel_secao_itens
    WHERE imovel_id = $1
      AND idioma = 'pt'
      AND ativo = true
    ORDER BY secao, ordem
    `,
    [imovel.id]
  );
}

const secoesAgrupadas = {};

secoesResult.rows.forEach(item => {
  if (!secoesAgrupadas[item.secao]) {
    secoesAgrupadas[item.secao] = [];
  }
  secoesAgrupadas[item.secao].push(item);
});
    function renderLista(secao) {
  if (!secoes[secao]) return "<p>Sem conteúdo.</p>";

  return secoes[secao].map(item => `
    <div class="p-3 rounded-xl mb-3" style="background:#f5f0eb;">
      <p style="font-weight:600">${item.titulo}</p>
      <p style="font-size:13px;color:#555">${item.descricao || ""}</p>

      <div style="margin-top:8px;display:flex;gap:8px;flex-wrap:wrap">
        ${item.link_maps ? `<a class="botao maps" href="${item.link_maps}" target="_blank">Maps</a>` : ""}
        ${item.link_instagram ? `<a class="botao instagram" href="${item.link_instagram}" target="_blank">Instagram</a>` : ""}
        ${item.link_reviews ? `<a class="botao whatsapp" href="${item.link_reviews}" target="_blank">Avaliações</a>` : ""}
      </div>
    </div>
  `).join("");
}
        

    const enderecoMaps = encodeURIComponent(
      conteudo.endereco_exibicao ||
        `${imovel.endereco || ""}, ${imovel.apartamento || ""} - ${imovel.cidade || ""} - ${imovel.estado || ""}`
    );
    const linkMaps = `https://www.google.com/maps/search/?api=1&query=${enderecoMaps}`;

    const menuItems = [
      { id: "importante", icon: "alert-circle", label: t.sections.importante, color: "#d94f4f" },
      { id: "amenidades", icon: "coffee", label: t.sections.amenidades, color: "#c47a2e" },
      { id: "wifi", icon: "wifi", label: t.sections.wifi, color: "#2a7d50" },
      { id: "checkin", icon: "clock", label: t.sections.checkin, color: "#3b73b8" },
      { id: "regras", icon: "book-open", label: t.sections.regras, color: "#8b5fbf" },
      { id: "apartamento", icon: "home", label: t.sections.apartamento, color: "#2a7d50" },
      { id: "locomover", icon: "map-pin", label: t.sections.locomover, color: "#3b73b8" },
      { id: "chegar", icon: "navigation", label: t.sections.chegar, color: "#c47a2e" },
      { id: "restaurantes", icon: "utensils", label: t.sections.restaurantes, color: "#d94f4f" },
      { id: "bares", icon: "glass-water", label: t.sections.bares, color: "#8b5fbf" },
      { id: "fazer", icon: "camera", label: t.sections.fazer, color: "#2a7d50" },
      { id: "partir", icon: "log-out", label: t.sections.partir, color: "#3b73b8" },
      { id: "emergencia", icon: "phone", label: t.sections.emergencia, color: "#d94f4f" },
      { id: "avaliacao", icon: "star", label: t.sections.avaliacao, color: "#c47a2e" },
      { id: "faq", icon: "help-circle", label: t.sections.faq, color: "#8b5fbf" },
      { id: "cafe", icon: "sunrise", label: t.sections.cafe, color: "#c47a2e" },
      { id: "proximos", icon: "map", label: t.sections.proximos, color: "#3b73b8" },
      { id: "doces", icon: "cake", label: t.sections.doces, color: "#d94f4f" },
      { id: "contato", icon: "message-circle", label: t.sections.contato, color: "#2a7d50" }
    ];

    const sections = {
  importante: {
    title: "Importante",
    html: `
      <div class="space-y-3">
        ${[
          ["trash-2","Lixo","Descartar no local indicado pelo condomínio."],
          ["tv","TV Smart","Disponível com acesso a aplicativos de streaming (login do hóspede)."],
          ["coffee","Máquina de café","Utilize cápsulas compatíveis com Nespresso."],
          ["spray-can","Produtos de limpeza","Disponíveis na área de serviço."],
          ["sparkles","Serviço de limpeza","Para estadias longas, pode ser solicitado à parte."]
        ].map(([ic,t,d])=>`
          <div class="flex items-start gap-3 p-4 rounded-xl bg-white border border-gray-100">
            <div class="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style="background:#d94f4f15;">
              <i data-lucide="${ic}" style="width:18px;height:18px;color:#d94f4f;"></i>
            </div>
            <div>
              <p class="text-sm font-semibold text-gray-800">${t}</p>
              <p class="text-xs text-gray-500 mt-0.5">${d}</p>
            </div>
          </div>`).join("")}
      </div>`
  },

  amenidades: {
    title: "Amenidades",
    html: `
      <div class="grid grid-cols-2 gap-2">
        ${[
          "Ar condicionado nos quartos e sala",
          "Roupas de cama",
          "Toalhas",
          "Papel higiênico",
          "Pó de café",
          "Açúcar",
          "Sal e temperos",
          "Cafeteira elétrica",
          "Cafeteira Nespresso",
          "Microondas",
          "Sanduicheira",
          "Liquidificador",
          "Panos de prato",
          "Esponja e detergente",
          "Shampoo",
          "Condicionador",
          "Sabonete líquido"
        ].map(a=>`
          <div class="flex items-center gap-2 p-2.5 rounded-lg" style="background:#c47a2e08;">
            <span style="color:#c47a2e;">✓</span>
            <span class="text-xs text-gray-700">${a}</span>
          </div>`).join("")}
      </div>`
  },

  wifi: {
    title: "Wi-Fi",
    html: `
      <div class="rounded-2xl p-6 wifi-box" style="background:#1a5c3a;">
        <div class="text-center">
          <i data-lucide="wifi" style="width:48px;height:48px;color:#7cc9a0;margin:0 auto 16px;display:block;"></i>
          <div class="mb-4">
            <p class="text-white/60 text-xs uppercase tracking-widest mb-1">Rede</p>
            <p class="text-white text-2xl font-semibold">${escHtml(conteudo.wifi_nome || "")}</p>
          </div>
          <div class="mb-5">
            <p class="text-white/60 text-xs uppercase tracking-widest mb-1">Senha</p>
            <p class="text-white text-2xl font-semibold">${escHtml(conteudo.wifi_senha || "")}</p>
          </div>
          <button onclick="event.stopPropagation();copyText(${JSON.stringify(conteudo.wifi_senha || "")})" class="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium" style="background:rgba(255,255,255,0.15);color:white;">
            <i data-lucide="copy" style="width:14px;height:14px;"></i> Copiar senha
          </button>
        </div>
      </div>`
  },

  checkin: {
    title: "Check-in / Check-out",
    html: `
      <div class="space-y-4">
        <div class="rounded-xl p-4" style="background:#2a7d5010;">
          <div class="flex items-center gap-3 mb-2">
            <div class="w-10 h-10 rounded-full flex items-center justify-center" style="background:#2a7d50;">
              <i data-lucide="log-in" style="width:18px;height:18px;color:white;"></i>
            </div>
            <span class="font-semibold text-lg" style="color:#1a5c3a;">Check-in: 15:00</span>
          </div>
          <ul class="text-sm text-gray-600 space-y-1 list-disc pl-5">
            <li>Acesso por fechadura eletrônica</li>
            <li>O código será enviado no dia da chegada</li>
            <li>Portaria 24h – informe Ap 1101</li>
            <li>Check-in rápido e independente</li>
          </ul>
        </div>
        <div class="rounded-xl p-4" style="background:#3b73b810;">
          <div class="flex items-center gap-3 mb-2">
            <div class="w-10 h-10 rounded-full flex items-center justify-center" style="background:#3b73b8;">
              <i data-lucide="log-out" style="width:18px;height:18px;color:white;"></i>
            </div>
            <span class="font-semibold text-lg" style="color:#3b73b8;">Check-out: 11:00</span>
          </div>
          <ul class="text-sm text-gray-600 space-y-1 list-disc pl-5">
            <li>Desligue ar-condicionado</li>
            <li>Apague as luzes</li>
            <li>Feche portas e janelas</li>
          </ul>
        </div>
      </div>`
  },

  regras: {
    title: "Regras do Apartamento",
    html: `
      <div class="space-y-3">
        ${[
          ["🤫","Silêncio após 22h"],
          ["🚭","Não é permitido fumar"],
          ["🚫","Não são permitidas festas"],
          ["🪑","Não alterar disposição dos móveis"],
          ["⏰","Respeitar horários de check-in e check-out"],
          ["🗑️","Retirar o lixo ao sair"]
        ].map(([em,tx])=>`
          <div class="flex items-start gap-3 p-3 rounded-xl" style="background:#f5f0eb;">
            <span class="text-xl">${em}</span>
            <span class="text-sm text-gray-700 pt-0.5">${tx}</span>
          </div>`).join("")}
        <div class="mt-5 p-4 rounded-xl" style="background:#2a7d5010;">
          <p class="text-sm" style="color:#1a5c3a;">💚 Agradeço antecipadamente por você ser um super hóspede! Espero que você aproveite o máximo da casa!</p>
        </div>
      </div>`
  },

  apartamento: {
    title: "O Apartamento",
    html: `
      <p class="text-gray-600 text-sm leading-relaxed mb-5">
        Estamos muito felizes em receber você. O apartamento foi recém-reformado, com marcenaria planejada, decoração contemporânea e enxoval padrão hotelaria.
      </p>
      <div class="grid grid-cols-2 gap-3">
        ${[
          ["users","4 pessoas"],
          ["door-open","2 quartos"],
          ["bath","1 banheiro"],
          ["bed-double","4 camas"]
        ].map(([ic,lb])=>`
          <div class="rounded-xl p-4 flex items-center gap-3" style="background:#f5f0eb;">
            <i data-lucide="${ic}" style="width:20px;height:20px;color:#2a7d50;"></i>
            <span class="text-sm font-medium text-gray-700">${lb}</span>
          </div>`).join("")}
      </div>
      <div class="mt-4 rounded-xl p-4 text-sm text-gray-600 space-y-1" style="background:#f5f0eb;">
        <p>🛏️ 1 cama de casal (Queen)</p>
        <p>🛏️ 1 cama de solteiro com cama auxiliar</p>
        <p>🛋️ 1 sofá-cama</p>
      </div>`
  },

  locomover: {
    title: "Como se Locomover",
    html: `
      <div class="space-y-3">
        ${[
          ["🚗","Uber / 99","Serviços amplamente disponíveis na região, com rápida chegada e excelente cobertura."],
          ["🚕","Táxi","Há ponto fixo de táxi na torre do Shopping RioSul, a poucos passos do edifício."],
          ["🚇","Transporte Público","Diversas linhas de ônibus passam em frente ao Shopping RioSul. A estação de metrô Botafogo é a mais próxima."],
          ["🚲","Bicicleta","Aluguel pelos aplicativos Tembici ou Uber."],
          ["🚶","A Pé","A região é residencial, tranquila e arborizada, ideal para caminhadas até a Praia Vermelha, Pão de Açúcar e Shopping RioSul."],
          ["🅿️","Estacionamento","O edifício não dispõe de vaga privativa. Há vagas públicas na rua e estacionamentos próximos."]
        ].map(([em,t,d])=>`
          <div class="flex items-start gap-3 p-3 rounded-xl" style="background:#f5f0eb;">
            <span class="text-xl flex-shrink-0">${em}</span>
            <div>
              <p class="text-sm font-semibold text-gray-800">${t}</p>
              <p class="text-xs text-gray-500">${d}</p>
            </div>
          </div>`).join("")}
      </div>`
  },

  chegar: {
    title: "Como Chegar",
    html: `
      <div class="rounded-xl p-5" style="background:#c47a2e10;">
        <p class="font-semibold text-gray-800 mb-2">📍 Rua Lauro Müller, 46 - Botafogo</p>
        <p class="text-gray-600 mb-4 text-sm">Rio de Janeiro - RJ</p>
        <ul class="text-sm text-gray-600 space-y-2">
          <li>• Utilize o endereço completo no Google Maps ou Uber</li>
          <li>• O prédio possui portaria 24h</li>
          <li>• Informe o número do apartamento: 1101</li>
          <li>• A entrada é feita por fechadura eletrônica</li>
        </ul>
        <a href="https://maps.app.goo.gl/FEPcLwTqpL1vyYfdA" target="_blank" class="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-full text-sm font-medium text-white" style="background:#1a5c3a;">
          <i data-lucide="map-pinned" style="width:16px;height:16px;"></i> Abrir no Google Maps
        </a>
      </div>`
  },

  restaurantes: {
    title: "Restaurantes Locais",
    html: `
      <div class="space-y-2">
        ${[
          "Terra Brasilis",
          "Fogo de Chão",
          "Assador Rio's",
          "Bar Urca / Mureta da Urca",
          "Irajá Redux",
          "Pergula",
          "Ferro e Farinha",
          "San Izakaya",
          "Encarnado Burger",
          "Delivery - iFood"
        ].map(r=>`
          <div class="flex items-center gap-3 p-3 rounded-xl" style="background:#d94f4f08;">
            <span>🍽️</span><span class="text-sm text-gray-700">${r}</span>
          </div>`).join("")}
      </div>`
  },

  bares: {
    title: "Bares",
    html: `
      <div class="space-y-2">
        ${[
          "Brewteco Botafogo",
          "Rio Scenarium",
          "Belmonte Ipanema",
          "Blue Note Rio"
        ].map(b=>`
          <div class="flex items-center gap-3 p-3 rounded-xl" style="background:#8b5fbf08;">
            <span>🍸</span><span class="text-sm text-gray-700">${b}</span>
          </div>`).join("")}
      </div>`
  },

  cafe: {
  title: "Café da Manhã",
  html: `
    <div class="space-y-3">
      ${[
        {
          nome: "Empório Jardim Casa Firjan",
          desc: "R. Guilhermina Guinle, 211 - Botafogo · 18 min de carro",
          maps: "https://maps.app.goo.gl/euoubBRqSvoWERnD7",
          insta: "http://www.instagram.com/emporiojardimrio/?hl=pt-br",
          review: "https://share.google/QOOw0wgcoPqA4CH5c"
        },
        {
          nome: "The Slow Bakery",
          desc: "R. General Polidoro, 25 - Botafogo · 10 min a pé",
          maps: "https://maps.app.goo.gl/ws4dffA6P8NPr9k17",
          insta: "https://www.instagram.com/theslowbakery/",
          review: "https://share.google/TpGcvFVtgbzUmBYIW"
        },
        {
          nome: "Café 18 do Forte",
          desc: "Forte de Copacabana · ótimo passeio + café",
          maps: "https://maps.app.goo.gl/nYbbGHAwZXnwzCEP8",
          insta: "https://www.instagram.com/cafe18doforte/",
          review: "https://share.google/q1u8YrHJEHRCaFizi"
        }
      ].map(item => `
        <div class="p-4 rounded-2xl bg-white border border-gray-100">
          <p class="text-sm font-semibold text-gray-800">${item.nome}</p>
          <p class="text-xs text-gray-500 mt-1">${item.desc}</p>
          <div class="flex flex-wrap gap-2 mt-3">
            <a href="${item.maps}" target="_blank" class="px-3 py-2 rounded-full text-xs font-medium text-white" style="background:#1a5c3a;">Maps</a>
            <a href="${item.insta}" target="_blank" class="px-3 py-2 rounded-full text-xs font-medium text-white" style="background:#c47a2e;">Instagram</a>
            <a href="${item.review}" target="_blank" class="px-3 py-2 rounded-full text-xs font-medium text-white" style="background:#3b73b8;">Reviews</a>
          </div>
        </div>
      `).join("")}
    </div>`
},

doces: {
  title: "Cafés & Doces",
  html: `
    <div class="space-y-3">
      ${[
        {
          nome: "Classico Beach Club Urca",
          desc: "Av. Pasteur, 520 - Urca · 15 min a pé",
          maps: "https://maps.app.goo.gl/VUVTfQYV1cRjEwe77",
          insta: "https://www.instagram.com/classicobeachclub/?hl=pt-br",
          review: "https://share.google/5aXU0nBUW4il3mwTK"
        },
        {
          nome: "Cirandaia",
          desc: "R. Voluntários da Pátria, 416 - Botafogo · 19 min de carro",
          maps: "https://maps.app.goo.gl/4dRMtCkRGyMiErW49",
          insta: "http://www.instagram.com/",
          review: "https://share.google/FWbcwup74oNPihmpF"
        },
        {
          nome: "Que Doce",
          desc: "R. Odílio Bacelar, 30 - Urca · 10 min a pé",
          maps: "https://www.google.com/maps/place/Casa+Que+Doce/@-22.9541372,-43.174362,17z/data=!4m6!3m5!1s0x997b58dcd90f71:0x4ca184d7bd113064!8m2!3d-22.9532045!4d-43.1682974!16s%2Fg%2F11cmykzrps",
          insta: "https://www.instagram.com/quedoce/",
          review: "https://share.google/ZPx65fJw5pWCTAlSh"
        },
        {
          nome: "Padaria Ipanema",
          desc: "R. Visc. de Pirajá, 325 - Ipanema · 23 min de carro",
          maps: "https://maps.app.goo.gl/sz9eXmq3dGMR5ujF8",
          insta: "https://www.instagram.com/padariaipanemaoficial/",
          review: "https://share.google/YM0kd1DIl4Yml89Rm"
        }
      ].map(item => `
        <div class="p-4 rounded-2xl bg-white border border-gray-100">
          <p class="text-sm font-semibold text-gray-800">${item.nome}</p>
          <p class="text-xs text-gray-500 mt-1">${item.desc}</p>
          <div class="flex flex-wrap gap-2 mt-3">
            <a href="${item.maps}" target="_blank" class="px-3 py-2 rounded-full text-xs font-medium text-white" style="background:#1a5c3a;">Maps</a>
            <a href="${item.insta}" target="_blank" class="px-3 py-2 rounded-full text-xs font-medium text-white" style="background:#c47a2e;">Instagram</a>
            <a href="${item.review}" target="_blank" class="px-3 py-2 rounded-full text-xs font-medium text-white" style="background:#3b73b8;">Reviews</a>
          </div>
        </div>
      `).join("")}
    </div>`
},

restaurantes: {
  title: "Restaurantes Locais",
  html: `
    <div class="space-y-3">
      ${[
        {
          nome: "Terra Brasilis",
          desc: "Praça General Tibúrcio, s/n · comida brasileira · 15 min a pé",
          maps: "https://maps.app.goo.gl/UKcfaSs7kywVz4XX6",
          insta: "https://www.instagram.com/restauranteterrabrasilis/",
          review: "https://share.google/HypQmZYjXdM1BRLMw"
        },
        {
          nome: "Fogo de Chão",
          desc: "Praia de Botafogo, 400 · carnes e vista linda · 15 min a pé",
          maps: "https://maps.app.goo.gl/9rzSjzqu7tuuPrce8",
          insta: "https://www.instagram.com/fogodechaobr/?hl=en",
          review: "https://share.google/Qv9X5UeAyXTtJK4Aa"
        },
        {
          nome: "Assador Rio's",
          desc: "Av. Infante Dom Henrique, s/n · churrascaria · 9 min de carro",
          maps: "http://www.googlemaps.com/",
          insta: "https://www.instagram.com/assadorbr/?hl=en",
          review: "https://share.google/4DTQZiT70rZnZQXjP"
        },
        {
          nome: "Bar Urca / Mureta",
          desc: "Rua Cândido Gaffrée, 205 · boteco clássico · 10 min de carro",
          maps: "https://maps.app.goo.gl/2xzVEpzyvjRBKVpY7",
          insta: "https://www.instagram.com/barurca/",
          review: "https://share.google/dt4P7Wm3jwq8QbDNz"
        },
        {
          nome: "Pergula",
          desc: "Copacabana Palace · 15 min de carro",
          maps: "http://www.googlemaps.com/",
          insta: "https://www.instagram.com/belmondcopacabanapalace/",
          review: "https://riotur.rio/onde_comer/pergula/"
        },
        {
          nome: "Irajá Redux",
          desc: "Shopping RioSul · 3 min a pé",
          maps: "https://maps.app.goo.gl/QPWX4k7fTXzvj4cY9",
          insta: "https://www.instagram.com/irajaredux/?hl=en",
          review: "https://share.google/SqLmhVAICt4EWg438"
        }
      ].map(item => `
        <div class="p-4 rounded-2xl bg-white border border-gray-100">
          <p class="text-sm font-semibold text-gray-800">${item.nome}</p>
          <p class="text-xs text-gray-500 mt-1">${item.desc}</p>
          <div class="flex flex-wrap gap-2 mt-3">
            <a href="${item.maps}" target="_blank" class="px-3 py-2 rounded-full text-xs font-medium text-white" style="background:#1a5c3a;">Maps</a>
            <a href="${item.insta}" target="_blank" class="px-3 py-2 rounded-full text-xs font-medium text-white" style="background:#c47a2e;">Instagram</a>
            <a href="${item.review}" target="_blank" class="px-3 py-2 rounded-full text-xs font-medium text-white" style="background:#3b73b8;">Reviews</a>
          </div>
        </div>
      `).join("")}
    </div>`
},

bares: {
  title: "Bares",
  html: `
    <div class="space-y-3">
      ${[
        ["Brewteco Botafogo","10 min de carro","https://maps.google.com/?q=Brewteco+Botafogo","https://www.instagram.com/brewteco/","https://www.google.com/search?q=Brewteco+Botafogo+reviews"],
        ["Rio Scenarium","15 min de carro","https://maps.google.com/?q=Rio+Scenarium","https://www.instagram.com/rioscenarium/","https://www.google.com/search?q=Rio+Scenarium+reviews"],
        ["Belmonte Ipanema","18 min de carro","https://maps.google.com/?q=Belmonte+Ipanema","https://www.instagram.com/belmontebar/","https://www.google.com/search?q=Belmonte+Ipanema+avaliacoes"],
        ["Blue Note Rio","12 min de carro","https://maps.google.com/?q=Blue+Note+Rio","https://www.instagram.com/bluenoterio/?utm_source=chatgpt.com","https://www.google.com/search?q=Blue+Note+Rio+reviews"]
      ].map(([nome,desc,maps,insta,review]) => `
        <div class="p-4 rounded-2xl bg-white border border-gray-100">
          <p class="text-sm font-semibold text-gray-800">${nome}</p>
          <p class="text-xs text-gray-500 mt-1">${desc}</p>
          <div class="flex flex-wrap gap-2 mt-3">
            <a href="${maps}" target="_blank" class="px-3 py-2 rounded-full text-xs font-medium text-white" style="background:#1a5c3a;">Maps</a>
            <a href="${insta}" target="_blank" class="px-3 py-2 rounded-full text-xs font-medium text-white" style="background:#c47a2e;">Instagram</a>
            <a href="${review}" target="_blank" class="px-3 py-2 rounded-full text-xs font-medium text-white" style="background:#3b73b8;">Reviews</a>
          </div>
        </div>
      `).join("")}
    </div>`
},
emergencia: {
  title: "Emergência",
  html: `
    <div class="space-y-3">
      <div class="flex items-center justify-between p-4 rounded-xl" style="background:#d94f4f08;">
        <div class="flex items-center gap-3">
          <span class="text-xl">🚔</span>
          <span class="text-sm font-semibold text-gray-800">Polícia Militar</span>
        </div>
        <a href="tel:190" class="text-sm font-bold" style="color:#d94f4f;">190</a>
      </div>

      <div class="flex items-center justify-between p-4 rounded-xl" style="background:#d94f4f08;">
        <div class="flex items-center gap-3">
          <span class="text-xl">🚑</span>
          <span class="text-sm font-semibold text-gray-800">SAMU</span>
        </div>
        <a href="tel:192" class="text-sm font-bold" style="color:#d94f4f;">192</a>
      </div>

      <div class="flex items-center justify-between p-4 rounded-xl" style="background:#d94f4f08;">
        <div class="flex items-center gap-3">
          <span class="text-xl">🚒</span>
          <span class="text-sm font-semibold text-gray-800">Corpo de Bombeiros</span>
        </div>
        <a href="tel:193" class="text-sm font-bold" style="color:#d94f4f;">193</a>
      </div>

      <div class="mt-4 p-4 rounded-xl" style="background:#fff7f7;">
        <p class="text-sm text-gray-700 leading-relaxed">
          Em caso de emergência médica, policial ou incêndio, utilize os números acima imediatamente.
          Para situações menos urgentes, fale com o anfitrião pelo card de contato.
        </p>
      </div>
    </div>`
},
avaliacao: {
  title: "Avaliação",
  html: `
    <div class="text-center py-6">
      <div class="text-5xl mb-4">⭐</div>
      <p class="heading-font text-2xl mb-2" style="color:#1a5c3a;">Sua opinião é muito importante</p>
      <p class="text-sm text-gray-500 mb-5 leading-relaxed">
        Esperamos que você tenha gostado da sua estadia em nosso apartamento.
        Se puder, deixe sua avaliação no Airbnb. Isso nos ajuda muito e faz diferença para os próximos hóspedes.
      </p>

      <a href="https://airbnb.com/" target="_blank" class="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium text-white shadow-sm" style="background:#1a5c3a;">
        <i data-lucide="star" style="width:14px;height:14px;"></i> Deixar avaliação no Airbnb
      </a>

      <p class="text-xs text-gray-400 mt-4">
        Obrigado por dedicar um tempinho para compartilhar sua experiência. 💚
      </p>
    </div>`
},
      faq: {
  title: "Perguntas Frequentes",
  html: `
    <div class="space-y-3">
      ${[
        [
          "Tem estacionamento disponível no local?",
          "O edifício não dispõe de vaga privativa. Há vagas públicas na rua e estacionamentos próximos."
        ],
        [
          "Posso levar meu pet?",
          "Não é permitida a hospedagem de animais."
        ],
        [
          "Tem roupa de cama e banho disponível?",
          "Sim. Disponibilizamos enxoval completo, incluindo roupas de cama e toalhas de banho e rosto, preparados com padrão de qualidade e conforto."
        ],
        [
          "Como funciona a lavanderia?",
          "O apartamento não dispõe de máquina de lavar. Para maior comodidade, sugerimos: Lavô Lavanderia – Botafogo; Acqua Lavanderia – Leme; e 5àSec – Botafogo ou Copacabana."
        ]
      ].map(([q,a]) => `
        <div class="p-4 rounded-xl" style="background:#8b5fbf08;">
          <p class="text-sm font-semibold text-gray-800 mb-1">${q}</p>
          <p class="text-xs text-gray-600">${a}</p>
        </div>
      `).join("")}
    </div>`
},
      
proximos: {
  title: "Mais Próximos",
  html: `
    <div class="space-y-3">
      ${[
        ["🥖","Pão e companhia","Rua Lauro Müller, 116","https://maps.app.goo.gl/iVgWfZgKAmKHNabs7"],
        ["🛒","Zona Sul Urca","R. Marechal Cantuária, 178","https://maps.app.goo.gl/ri5vHFrNv4e4rb246"],
        ["🏥","Hospital Samaritano Botafogo","Rua Bambina, 98","https://maps.google.com/?q=Hospital+Samaritano+Botafogo"],
        ["💊","Drogaria Pacheco – RioSul","Rua Lauro Müller, 116","http://www.googlemaps.com/"],
        ["🍺","Zé Delivery","Aplicativo","https://apps.apple.com/br/app/z%C3%A9-delivery/id1070070438"],
        ["⛽","Posto Petrobras","Av. Pasteur, 490 – Urca","https://maps.google.com/?q=Posto+Petrobras+Av+Pasteur+490+Urca"]
      ].map(([em,n,d,maps])=>`
        <div class="flex items-start justify-between gap-3 p-3 rounded-xl" style="background:#3b73b808;">
          <div class="flex items-start gap-3">
            <span>${em}</span>
            <div><p class="text-sm font-semibold text-gray-800">${n}</p><p class="text-xs text-gray-500">${d}</p></div>
          </div>
          <a href="${maps}" target="_blank" class="text-xs font-medium" style="color:#3b73b8;">Abrir</a>
        </div>`).join("")}
    </div>`
},

fazer: {
  title: "O que Fazer",
  html: `
    <div class="space-y-3">
      ${[
        ["🏔️","Bondinho do Pão de Açúcar","10 min a pé · Av. Pasteur, 520 – Urca","https://maps.google.com/?q=Bondinho+Pao+de+Acucar"],
        ["⛰️","Cristo Redentor","20 min de carro até embarque","https://maps.app.goo.gl/EWKaN2UA23HwhF4H8"],
        ["🎨","Escadaria Selarón","15 min de carro · Rua Joaquim Silva – Lapa","https://maps.google.com/?q=Escadaria+Selaron"],
        ["🌊","Praia de Copacabana","5 min de carro · Av. Atlântica","https://maps.google.com/?q=Copacabana+Beach"],
        ["🌿","Jardim Botânico","25 min de carro · Rua Jardim Botânico, 1008","https://maps.app.goo.gl/mcfnQUqDPCVbRuko8"],
        ["🌅","Pôr do sol no Arpoador","20 min de carro · Pedra do Arpoador","https://maps.app.goo.gl/RGknCvVpfwp6C2c87"]
      ].map(([em,t,d,maps])=>`
        <div class="flex items-start justify-between gap-3 p-3 rounded-xl" style="background:#2a7d5008;">
          <div class="flex items-start gap-3">
            <span class="text-xl flex-shrink-0">${em}</span>
            <div><p class="text-sm font-semibold text-gray-800">${t}</p><p class="text-xs text-gray-500">${d}</p></div>
          </div>
          <a href="${maps}" target="_blank" class="text-xs font-medium" style="color:#2a7d50;">Abrir</a>
        </div>`).join("")}
    </div>`
},
partir: {
  title: "Antes de Partir",
  html: `
    <div class="space-y-3">

      <div class="p-4 rounded-xl" style="background:#3b73b808;">
        <p class="text-sm font-semibold text-gray-800 mb-2">⏰ Check-out</p>
        <p class="text-xs text-gray-600">
          O horário de saída é até <strong>11:00</strong>. Caso precise de um horário diferente, nos avise com antecedência.
        </p>
      </div>

      ${[
        "Verifique se não esqueceu nenhum item pessoal",
        "Retire o lixo e coloque no local indicado do prédio",
        "Feche todas as janelas e portas",
        "Desligue o ar-condicionado",
        "Apague as luzes",
        "Informe caso tenha ocorrido algum pequeno dano"
      ].map(item => `
        <div class="flex items-center gap-3 p-3 rounded-xl" style="background:#f5f0eb;">
          <span>✔️</span>
          <span class="text-sm text-gray-700">${item}</span>
        </div>
      `).join("")}

      <div class="mt-4 p-4 rounded-xl text-sm text-gray-700" style="background:#2a7d5010;">
        💚 Esperamos que você tenha tido uma excelente estadia e momentos especiais aqui no Rio!
      </div>

    </div>`
},
contato: {
  title: "Entre em Contato",
  html: `
    <div class="text-center py-6">
      <div class="text-5xl mb-4">💬</div>
      <p class="heading-font text-2xl mb-2" style="color:#1a5c3a;">Estamos por perto</p>
      <p class="text-sm text-gray-500 mb-5 leading-relaxed">
        Foi um prazer recebê-lo em nosso apartamento. Caso tenha qualquer dúvida, sugestão ou precise de ajuda, ficaremos muito felizes em falar com você.
      </p>

      <div class="space-y-2 text-sm mb-5">
        <p><strong>Instagram:</strong> @milepascoal</p>
        <p><strong>Telefone:</strong> <a href="tel:+5521971810022" style="color:#1a5c3a;">+55 21 97181-0022</a></p>
        <p><strong>Endereço:</strong> Rua Lauro Müller, 46 Ap 1101</p>
      </div>

      <div class="flex flex-col gap-2">
        <a href="https://wa.me/5521971810022" target="_blank" class="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full text-sm font-medium text-white" style="background:#25d366;">
          <i data-lucide="message-circle" style="width:14px;height:14px;"></i> Falar no WhatsApp
        </a>

        <a href="https://maps.app.goo.gl/5r23kN9fv3gH8JBr8" target="_blank" class="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full text-sm font-medium text-white" style="background:#1a5c3a;">
          <i data-lucide="map-pinned" style="width:14px;height:14px;"></i> Abrir localização
        </a>
      </div>
    </div>`
},
    };

    const html = `
<!doctype html>
<html lang="pt-BR" class="h-full">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escHtml(t.pageTitle)} - ${escHtml(imovel.nome || "")}</title>
  <script src="https://cdn.tailwindcss.com/3.4.17"></script>
  <script src="https://cdn.jsdelivr.net/npm/lucide@0.263.0/dist/umd/lucide.min.js"></script>
  <link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=Outfit:wght@300;400;500;600&display=swap" rel="stylesheet">
  <style>
    html, body { height: 100%; margin: 0; }
    * { box-sizing: border-box; }
    body { font-family: 'Outfit', sans-serif; }
    .heading-font { font-family: 'DM Serif Display', serif; }
    .section-card {
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      cursor: pointer;
    }
    .section-card:hover { transform: translateY(-2px); }
    .modal-overlay {
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.3s ease;
    }
    .modal-overlay.active {
      opacity: 1;
      pointer-events: all;
    }
    .modal-content {
      transform: translateY(100%);
      transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .modal-overlay.active .modal-content {
      transform: translateY(0);
    }
    .fade-in {
      animation: fadeUp 0.5s ease forwards;
      opacity: 0;
    }
    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(16px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .hero-gradient {
      background: linear-gradient(165deg, #0c2e1e 0%, #1a5c3a 40%, #2a7d50 70%, #1a5c3a 100%);
    }
    .menu-icon-box {
      width: 56px; height: 56px;
      border-radius: 14px;
      display: flex; align-items: center; justify-content: center;
      transition: all 0.2s ease;
    }
    .wifi-box {
      background: repeating-linear-gradient(
        135deg,
        transparent,
        transparent 10px,
        rgba(255,255,255,0.03) 10px,
        rgba(255,255,255,0.03) 20px
      );
    }
    .copy-toast {
      position: fixed;
      bottom: 80px;
      left: 50%;
      transform: translateX(-50%) translateY(20px);
      opacity: 0;
      transition: all 0.3s ease;
      pointer-events: none;
      z-index: 9999;
    }
    .copy-toast.show {
      opacity: 1;
      transform: translateX(-50%) translateY(0);
    }
    .lang-pill {
      border: 2px solid transparent;
    }
    .lang-pill.active {
      border-color: #7cc9a0;
      box-shadow: 0 0 0 3px rgba(124, 201, 160, 0.18);
    }
    ::-webkit-scrollbar { width: 0; 
    }
    .heading-font {
  letter-spacing: 0.2px;
}
  </style>
</head>
<body class="h-full">
  <div id="app" class="h-full w-full overflow-auto" style="background:#f5f0eb;">
    <div id="copyToast" class="copy-toast px-4 py-2 rounded-full text-sm font-medium text-white" style="background:#1a5c3a;">
      ${escHtml(t.copyToast)}
    </div>

    <div id="homeScreen">
      <div class="hero-gradient relative overflow-hidden" style="padding: 48px 24px 36px;">
        <div class="absolute inset-0 opacity-10" style="background-image: radial-gradient(circle at 20% 50%, rgba(255,255,255,0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.2) 0%, transparent 40%);"></div>
        <div class="relative z-10 max-w-md mx-auto">
          <div class="fade-in" style="animation-delay:0.1s">
            <p class="text-white/60 text-xs tracking-widest uppercase mb-2">Welcome Guide · Guía de Bienvenida</p>
            <h1 id="heroTitle" class="heading-font text-white text-4xl leading-tight mb-3">${escHtml(conteudo.titulo || "WELCOME GUIDE")}</h1>
            <div class="w-10 h-0.5 rounded-full mb-4" style="background:#7cc9a0;"></div>
          </div>
          <div class="fade-in" style="animation-delay:0.25s">
            <p class="text-white/90 font-light text-lg leading-relaxed">${escHtml(imovel.nome || "")}</p>
            <p class="text-white/50 text-sm mt-1">${escHtml(imovel.endereco || "")}${imovel.apartamento ? " · Ap " + escHtml(imovel.apartamento) : ""}</p>
            <p class="text-white/50 text-sm">${escHtml(imovel.cidade || "")} · ${escHtml(imovel.estado || "")} · Brasil</p>
          </div>
        </div>
      </div>

      <div class="max-w-md mx-auto px-5 -mt-4 relative z-10">
        <div class="bg-white rounded-2xl p-5 shadow-sm fade-in" style="animation-delay:0.35s">
          <p class="heading-font text-xl mb-1" style="color:#1a5c3a;">${escHtml(t.welcomeTitle)}</p>
          <p class="text-sm text-gray-500 leading-relaxed">${escHtml(t.welcomeText)}</p>
          <button onclick="openSection('contato')" class="mt-3 flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-full text-white" style="background:#1a5c3a;">
            <i data-lucide="message-circle" style="width:15px;height:15px;"></i> ${escHtml(t.contactButton)}
          </button>
        </div>
      </div>

      <div class="max-w-md mx-auto px-5 pt-5">
        <div class="bg-white rounded-2xl p-4 shadow-sm fade-in" style="animation-delay:0.38s">
          <div class="flex items-center gap-2 mb-3">
            <i data-lucide="languages" style="width:18px;height:18px;color:#2a7d50;"></i>
            <p class="text-sm font-semibold text-gray-700">${escHtml(t.languageTitle)}</p>
          </div>
          <div class="grid grid-cols-3 gap-2">
            <a href="/imovel/${escHtml(codigo)}/pt" class="lang-pill ${idioma === "pt" ? "active" : ""} text-center rounded-xl px-3 py-2 text-sm font-medium" style="background:#f5f0eb;color:#1a5c3a;">${escHtml(t.activeLang.pt)}</a>
            <a href="/imovel/${escHtml(codigo)}/en" class="lang-pill ${idioma === "en" ? "active" : ""} text-center rounded-xl px-3 py-2 text-sm font-medium" style="background:#f5f0eb;color:#1a5c3a;">${escHtml(t.activeLang.en)}</a>
            <a href="/imovel/${escHtml(codigo)}/es" class="lang-pill ${idioma === "es" ? "active" : ""} text-center rounded-xl px-3 py-2 text-sm font-medium" style="background:#f5f0eb;color:#1a5c3a;">${escHtml(t.activeLang.es)}</a>
          </div>
        </div>
      </div>

      <div class="max-w-md mx-auto px-5 py-6">
        <div class="grid grid-cols-3 gap-3" id="menuGrid"></div>
      </div>
    </div>

    <div id="modal" class="modal-overlay fixed inset-0 z-50" style="background:rgba(0,0,0,0.4);" onclick="closeModal(event)">
  <div class="modal-content absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl overflow-hidden" style="max-height:88%;">
    <div class="sticky top-0 bg-white z-10 px-5 pt-4 pb-3 border-b border-gray-100 flex items-center justify-between">
      <h2 id="modalTitle" class="heading-font text-xl" style="color:#1a5c3a;"></h2>
      <button onclick="closeModalDirect()" class="w-8 h-8 rounded-full flex items-center justify-center" style="background:#f0f0f0;">
        <i data-lucide="x" style="width:16px;height:16px;color:#666;"></i>
      </button>
    </div>
    <div id="modalBody" class="px-5 py-5 overflow-auto" style="max-height:calc(88% - 60px);"></div>
  </div>
</div>
  </div>

  <script>
    const menuItems = ${JSON.stringify(menuItems)};
    const sections = ${JSON.stringify(sections)};

    function buildMenu() {
      const grid = document.getElementById("menuGrid");
      grid.innerHTML = "";
      menuItems.forEach((item, i) => {
        const card = document.createElement("div");
        card.className = "section-card bg-white rounded-2xl p-3 flex flex-col items-center gap-2 shadow-sm fade-in";
        card.style.animationDelay = \`\${0.4 + i * 0.04}s\`;
        card.onclick = () => openSection(item.id);
        card.innerHTML = \`
          <div class="menu-icon-box" style="background:\${item.color}15;">
            <i data-lucide="\${item.icon}" style="width:24px;height:24px;color:\${item.color};"></i>
          </div>
          <span class="text-xs font-medium text-center leading-tight" style="color:#444;">\${item.label}</span>
        \`;
        grid.appendChild(card);
      });
      lucide.createIcons();
    }

   function openSection(id) {
  const modal = document.getElementById("modal");
  const modalBody = document.getElementById("modalBody");
  const modalTitle = document.getElementById("modalTitle");

  const section = sections[id] || { title: "Info", html: "<p>Sem conteúdo.</p>" };

  // se já está aberto no mesmo → fecha
  if (modal.dataset.open === id) {
    modal.classList.remove("active");
    modal.dataset.open = "";
    return;
  }

  modalTitle.textContent = section.title;
  modalBody.innerHTML = section.html;

  modal.classList.add("active");
  modal.dataset.open = id;

  lucide.createIcons();
}

   function closeModal(e) {
  const modal = document.getElementById("modal");

  if (e.target === modal) {
    modal.classList.remove("active");
    modal.dataset.open = ""; // 🔥 IMPORTANTE
  }
}

function closeModalDirect() {
  const modal = document.getElementById("modal");
  modal.classList.remove("active");
  modal.dataset.open = ""; // 🔥 IMPORTANTE
}
    buildMenu();
    lucide.createIcons();
  </script>
<a href="https://wa.me/5521971810022" target="_blank" style="
position: fixed;
bottom: 20px;
right: 20px;
background: #25d366;
color: white;
padding: 14px 16px;
border-radius: 50px;
font-weight: bold;
box-shadow: 0 6px 20px rgba(0,0,0,0.2);
text-decoration: none;
z-index: 999;
">
💬 Falar com anfitrião
</a>
  
</body>
</html>
    `;

    return res.send(html);
  } catch (err) {
    console.error("ERRO:", err);
    return res.status(500).send(err.message);
  }
});

app.listen(port, () => {
  console.log("Servidor rodando 🚀");
});
