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
        title: t.importantTitle,
        html: `
          <div class="space-y-3">
            <div class="flex items-start gap-3 p-4 rounded-xl bg-white border border-gray-100">
              <div class="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style="background:#d94f4f15;">
                <i data-lucide="info" style="width:18px;height:18px;color:#d94f4f;"></i>
              </div>
              <div>
                <p class="text-sm text-gray-700 leading-relaxed">${nl2brEsc(conteudo.boas_vindas_subtitulo || t.placeholder)}</p>
              </div>
            </div>
          </div>`
      },
      amenidades: {
        title: t.amenitiesTitle,
        html: `
          <div class="space-y-3">
            <div class="p-4 rounded-xl" style="background:#c47a2e08;">
              <p class="text-sm text-gray-700 leading-relaxed">${t.placeholder}</p>
            </div>
          </div>`
      },
      wifi: {
        title: t.wifi.title,
        html: `
          <div class="rounded-2xl p-6 wifi-box" style="background:#1a5c3a;">
            <div class="text-center">
              <i data-lucide="wifi" style="width:48px;height:48px;color:#7cc9a0;margin:0 auto 16px;display:block;"></i>
              <div class="mb-4">
                <p class="text-white/60 text-xs uppercase tracking-widest mb-1">${escHtml(t.wifi.network)}</p>
                <p class="text-white text-2xl font-semibold">${escHtml(conteudo.wifi_nome || "")}</p>
              </div>
              <div class="mb-5">
                <p class="text-white/60 text-xs uppercase tracking-widest mb-1">${escHtml(t.wifi.password)}</p>
                <p class="text-white text-2xl font-semibold">${escHtml(conteudo.wifi_senha || "")}</p>
              </div>
              <button onclick="event.stopPropagation();copyText(${JSON.stringify(conteudo.wifi_senha || "")})" class="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium" style="background:rgba(255,255,255,0.15);color:white;">
                <i data-lucide="copy" style="width:14px;height:14px;"></i> ${escHtml(t.wifi.copyPassword)}
              </button>
            </div>
          </div>`
      },
      checkin: {
        title: t.checkin.title,
        html: `
          <div class="space-y-4">
            <div class="rounded-xl p-4" style="background:#2a7d5010;">
              <div class="flex items-center gap-3 mb-2">
                <div class="w-10 h-10 rounded-full flex items-center justify-center" style="background:#2a7d50;">
                  <i data-lucide="log-in" style="width:18px;height:18px;color:white;"></i>
                </div>
                <span class="font-semibold text-lg" style="color:#1a5c3a;">${escHtml(t.checkin.checkin)}</span>
              </div>
              <p class="text-sm text-gray-600 whitespace-pre-line">${escHtml(conteudo.checkin_texto || "")}</p>
            </div>
            <div class="rounded-xl p-4" style="background:#3b73b810;">
              <div class="flex items-center gap-3 mb-2">
                <div class="w-10 h-10 rounded-full flex items-center justify-center" style="background:#3b73b8;">
                  <i data-lucide="log-out" style="width:18px;height:18px;color:white;"></i>
                </div>
                <span class="font-semibold text-lg" style="color:#3b73b8;">${escHtml(t.checkin.checkout)}</span>
              </div>
              <p class="text-sm text-gray-600 whitespace-pre-line">${escHtml(conteudo.checkout_texto || "")}</p>
            </div>
          </div>`
      },
      regras: {
        title: t.rulesTitle,
        html: `
          <div class="p-4 rounded-xl" style="background:#f5f0eb;">
            <p class="text-sm text-gray-700 whitespace-pre-line">${escHtml(conteudo.regras_texto || "")}</p>
          </div>`
      },
      apartamento: {
        title: t.apartmentTitle,
        html: `
          <div class="space-y-4">
            <p class="text-gray-600 text-sm leading-relaxed">${nl2brEsc(conteudo.apartamento_texto || "")}</p>
            <div class="grid grid-cols-2 gap-3">
              <div class="rounded-xl p-4 flex items-center gap-3" style="background:#f5f0eb;">
                <i data-lucide="users" style="width:20px;height:20px;color:#2a7d50;"></i>
                <span class="text-sm font-medium text-gray-700">4 pessoas</span>
              </div>
              <div class="rounded-xl p-4 flex items-center gap-3" style="background:#f5f0eb;">
                <i data-lucide="door-open" style="width:20px;height:20px;color:#2a7d50;"></i>
                <span class="text-sm font-medium text-gray-700">2 quartos</span>
              </div>
              <div class="rounded-xl p-4 flex items-center gap-3" style="background:#f5f0eb;">
                <i data-lucide="bath" style="width:20px;height:20px;color:#2a7d50;"></i>
                <span class="text-sm font-medium text-gray-700">1 banheiro</span>
              </div>
              <div class="rounded-xl p-4 flex items-center gap-3" style="background:#f5f0eb;">
                <i data-lucide="bed-double" style="width:20px;height:20px;color:#2a7d50;"></i>
                <span class="text-sm font-medium text-gray-700">4 camas</span>
              </div>
            </div>
          </div>`
      },
      locomover: {
        title: t.gettingAroundTitle,
        html: `
          <div class="p-4 rounded-xl" style="background:#f5f0eb;">
            <p class="text-sm text-gray-700 whitespace-pre-line">${escHtml(conteudo.transporte_texto || "")}</p>
          </div>`
      },
      chegar: {
        title: t.gettingThereTitle,
        html: `
          <div class="space-y-4">
            <div class="rounded-xl p-5" style="background:#c47a2e10;">
              <p class="font-semibold text-gray-800 mb-2">${escHtml(conteudo.endereco_exibicao || "")}</p>
              <p class="text-sm text-gray-600 whitespace-pre-line">${escHtml(conteudo.como_chegar_texto || "")}</p>
            </div>
            <a href="${linkMaps}" target="_blank" class="inline-flex items-center gap-2 px-4 py-3 rounded-full text-sm font-medium text-white" style="background:#1a5c3a;">
              <i data-lucide="map-pinned" style="width:16px;height:16px;"></i> ${escHtml(t.openMaps)}
            </a>
          </div>`
      },
      restaurantes: {
        title: t.restaurantsTitle,
        html: `<div class="p-4 rounded-xl" style="background:#d94f4f08;"><p class="text-sm text-gray-700">${escHtml(t.placeholder)}</p></div>`
      },
      bares: {
        title: t.barsTitle,
        html: `<div class="p-4 rounded-xl" style="background:#8b5fbf08;"><p class="text-sm text-gray-700">${escHtml(t.placeholder)}</p></div>`
      },
      fazer: {
        title: t.whatToDoTitle,
        html: `<div class="p-4 rounded-xl" style="background:#2a7d5008;"><p class="text-sm text-gray-700">${escHtml(t.placeholder)}</p></div>`
      },
      partir: {
        title: t.beforeLeavingTitle,
        html: `<div class="p-4 rounded-xl" style="background:#3b73b808;"><p class="text-sm text-gray-700 whitespace-pre-line">${escHtml(conteudo.antes_partir_texto || "")}</p></div>`
      },
      emergencia: {
        title: t.emergencyTitle,
        html: `
          <div class="space-y-3">
            <div class="flex items-center justify-between p-4 rounded-xl" style="background:#d94f4f08;">
              <div class="flex items-center gap-3"><span class="text-xl">🚔</span><span class="text-sm font-semibold text-gray-800">Polícia</span></div>
              <span class="text-sm font-bold" style="color:#d94f4f;">190</span>
            </div>
            <div class="flex items-center justify-between p-4 rounded-xl" style="background:#d94f4f08;">
              <div class="flex items-center gap-3"><span class="text-xl">🚑</span><span class="text-sm font-semibold text-gray-800">SAMU</span></div>
              <span class="text-sm font-bold" style="color:#d94f4f;">192</span>
            </div>
            <div class="flex items-center justify-between p-4 rounded-xl" style="background:#d94f4f08;">
              <div class="flex items-center gap-3"><span class="text-xl">🚒</span><span class="text-sm font-semibold text-gray-800">Bombeiros</span></div>
              <span class="text-sm font-bold" style="color:#d94f4f;">193</span>
            </div>
          </div>`
      },
      avaliacao: {
        title: t.reviewTitle,
        html: `
          <div class="text-center py-6">
            <div class="text-4xl mb-4">⭐</div>
            <p class="text-sm text-gray-500 mb-5">${escHtml(t.placeholder)}</p>
          </div>`
      },
      faq: {
        title: t.faqTitle,
        html: `<div class="p-4 rounded-xl" style="background:#8b5fbf08;"><p class="text-sm text-gray-700">${escHtml(t.placeholder)}</p></div>`
      },
      cafe: {
        title: t.breakfastTitle,
        html: `<div class="p-4 rounded-xl" style="background:#c47a2e08;"><p class="text-sm text-gray-700">${escHtml(t.placeholder)}</p></div>`
      },
      proximos: {
        title: t.nearbyTitle,
        html: `<div class="p-4 rounded-xl" style="background:#3b73b808;"><p class="text-sm text-gray-700">${escHtml(t.placeholder)}</p></div>`
      },
      doces: {
        title: t.sweetsTitle,
        html: `<div class="p-4 rounded-xl" style="background:#d94f4f08;"><p class="text-sm text-gray-700">${escHtml(t.placeholder)}</p></div>`
      },
      contato: {
        title: t.contactTitle,
        html: `
          <div class="text-center py-6">
            <div class="text-4xl mb-4">💬</div>
            <p class="text-sm text-gray-500 mb-5">${nl2brEsc(conteudo.contato_texto || "")}</p>
          </div>`
      }
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
    ::-webkit-scrollbar { width: 0; }
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
      const section = sections[id] || { title: "Info", html: "<p>Sem conteúdo.</p>" };
      document.getElementById("modalTitle").textContent = section.title;
      document.getElementById("modalBody").innerHTML = section.html;
      document.getElementById("modal").classList.add("active");
      lucide.createIcons();
    }

    function closeModal(e) {
      if (e.target === document.getElementById("modal")) {
        document.getElementById("modal").classList.remove("active");
      }
    }

    function closeModalDirect() {
      document.getElementById("modal").classList.remove("active");
    }

    function copyText(text) {
      navigator.clipboard.writeText(text).then(() => {
        const t = document.getElementById("copyToast");
        t.classList.add("show");
        setTimeout(() => t.classList.remove("show"), 1800);
      });
    }

    buildMenu();
    lucide.createIcons();
  </script>
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
