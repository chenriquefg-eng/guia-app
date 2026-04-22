const express = require("express");
const { Pool } = require("pg");

const app = express();
app.use(express.static("/app/public"));
const port = Number(process.env.PORT || 3000);

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
  return escHtml(texto).replace(/\r?\n/g, "<br>");
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
      emergencyList: [
  { label: "🚓 190 — Polícia Militar", phone: "190" },
  { label: "🚑 192 — SAMU", phone: "192" },
  { label: "🚒 193 — Corpo de Bombeiros", phone: "193" }
],
      reviewText: "Esperamos que você tenha gostado da sua estadia em nossa hospedagem.",
reviewButton: "⭐ Deixar avaliação",
      wifi: {
        title: "Wi-Fi",
        network: "Rede",
        password: "Senha",
        copyPassword: "Copiar senha"
      },
      checkin: {
        title: "Check-in / Check-out",
        checkin: "Check-in",
        checkout: "Check-out"
      },
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
      mapLabel: "Maps",
      reviewLabel: "Avaliações",
      extraLabel: "Mais",
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
      emergencyList: [
  { label: "🚓 190 — Police", phone: "190" },
  { label: "🚑 192 — Ambulance (SAMU)", phone: "192" },
  { label: "🚒 193 — Fire Department", phone: "193" }
],
      reviewText: "We hope you enjoyed your stay in our property.",
reviewButton: "⭐ Leave a review",
      wifi: {
        title: "Wi-Fi",
        network: "Network",
        password: "Password",
        copyPassword: "Copy password"
      },
      checkin: {
        title: "Check-in / Check-out",
        checkin: "Check-in",
        checkout: "Check-out"
      },
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
      mapLabel: "Maps",
      reviewLabel: "Reviews",
      extraLabel: "More",
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
      emergencyList: [
  { label: "🚓 190 — Policía", phone: "190" },
  { label: "🚑 192 — Ambulancia (SAMU)", phone: "192" },
  { label: "🚒 193 — Bomberos", phone: "193" }
],
      reviewText: "Esperamos que haya disfrutado su estadía en nuestro alojamiento.",
reviewButton: "⭐ Dejar una reseña",
      wifi: {
        title: "Wi-Fi",
        network: "Red",
        password: "Contraseña",
        copyPassword: "Copiar contraseña"
      },
      checkin: {
        title: "Check-in / Check-out",
        checkin: "Check-in",
        checkout: "Check-out"
      },
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
      mapLabel: "Maps",
      reviewLabel: "Reseñas",
      extraLabel: "Más",
      activeLang: {
        pt: "🇧🇷 Português",
        en: "🇺🇸 English",
        es: "🇪🇸 Español"
      }
    }
  };

  return dict[idioma] || dict.pt;
}

function buildMenuItems(t) {
  return [
    { id: "importante", label: t.sections.importante, icon: "badge-alert", color: "#b7791f" },
    { id: "amenidades", label: t.sections.amenidades, icon: "sparkles", color: "#2a7d50" },
    { id: "wifi", label: t.sections.wifi, icon: "wifi", color: "#2563eb" },
    { id: "checkin", label: t.sections.checkin, icon: "log-in", color: "#7c3aed" },
    { id: "regras", label: t.sections.regras, icon: "shield-check", color: "#dc2626" },
    { id: "apartamento", label: t.sections.apartamento, icon: "bed-double", color: "#0f766e" },
    { id: "locomover", label: t.sections.locomover, icon: "car-front", color: "#ea580c" },
    { id: "chegar", label: t.sections.chegar, icon: "map-pinned", color: "#2563eb" },
    { id: "restaurantes", label: t.sections.restaurantes, icon: "utensils-crossed", color: "#be123c" },
    { id: "bares", label: t.sections.bares, icon: "martini", color: "#7c2d12" },
    { id: "fazer", label: t.sections.fazer, icon: "camera", color: "#0891b2" },
    { id: "partir", label: t.sections.partir, icon: "briefcase", color: "#475569" },
    { id: "emergencia", label: t.sections.emergencia, icon: "siren", color: "#dc2626" },
    { id: "avaliacao", label: t.sections.avaliacao, icon: "star", color: "#eab308" },
    { id: "faq", label: t.sections.faq, icon: "circle-help", color: "#6366f1" },
    { id: "cafe", label: t.sections.cafe, icon: "coffee", color: "#92400e" },
    { id: "proximos", label: t.sections.proximos, icon: "map", color: "#15803d" },
    { id: "doces", label: t.sections.doces, icon: "cake-slice", color: "#db2777" },
    { id: "contato", label: t.sections.contato, icon: "message-circle", color: "#16a34a" }
  ];
}

function agruparListasPorSecao(rows = []) {
  const grupos = {
  cafe: [],
  bares: [],
  proximos: [],
  fazer: [],
  restaurantes: [],
  doces: [],
  amenidades: [],
  faq: [] // 👈 ESSENCIAL
};

  for (const row of rows) {
    const secao = (row.secao || "").toLowerCase().trim();

    if (grupos[secao]) {
      grupos[secao].push(row);
    }
  }

  for (const secao of Object.keys(grupos)) {
    grupos[secao].sort((a, b) => Number(a.ordem || 0) - Number(b.ordem || 0));
  }

  return grupos;
}
function renderLista(itens = [], labels = {}) {
  if (!Array.isArray(itens) || itens.length === 0) {
    return `<p class="text-sm text-gray-500">Sem itens cadastrados nesta seção.</p>`;
  }

  const mapLabel = labels.mapLabel || "Maps";
  const reviewLabel = labels.reviewLabel || "Reviews";
  const extraLabel = labels.extraLabel || "Mais";

  return `
    <div class="space-y-3">
      ${itens
        .map((item) => {
          const icone = item.icone || "map-pin";
          const titulo = escHtml(item.titulo || "");
          const imagem = item.imagem_url || "";
          const descricao = escHtml(item.descricao || "");
          const maps = item.link_maps || "";
          const instagram = item.link_instagram || "";
          const review = item.link_reviews || "";
          const extra = item.link_extra || "";

          return `
            <div class="rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-sm hover:shadow-md transition">
              ${imagem ? `
  <div class="overflow-hidden">
    <img src="${escHtml(imagem)}"
         style="
           width:100%;
           height:140px;
           object-fit:cover;
           border-top-left-radius:16px;
           border-top-right-radius:16px;
         ">
  </div>
` : ""}
              <div class="p-4">
                <div class="flex items-center gap-2">
                  <i data-lucide="${icone}" style="width:16px;height:16px;color:#1a5c3a;"></i>
                  <h3 class="font-semibold text-base text-gray-800">${titulo}</h3>
                </div>

                ${descricao ? `<p class="text-sm text-gray-600 mt-2">${descricao}</p>` : ""}

                <div class="flex flex-wrap gap-2 mt-3">
                  ${maps ? `<a href="${escHtml(maps)}" target="_blank" rel="noopener noreferrer" class="text-sm px-3 py-2 rounded-full text-white" style="background:#1a5c3a;">${escHtml(mapLabel)}</a>` : ""}
                  ${instagram ? `<a href="${escHtml(instagram)}" target="_blank" rel="noopener noreferrer" class="text-sm px-3 py-2 rounded-full border" style="border-color:#1a5c3a;color:#1a5c3a;">Instagram</a>` : ""}
                  ${review ? `<a href="${escHtml(review)}" target="_blank" rel="noopener noreferrer" class="text-sm px-3 py-2 rounded-full text-white" style="background:#3b73b8;">${escHtml(reviewLabel)}</a>` : ""}
                  ${extra ? `<a href="${escHtml(extra)}" target="_blank" rel="noopener noreferrer" class="text-sm px-3 py-2 rounded-full text-white" style="background:#92400e;">${escHtml(extraLabel)}</a>` : ""}
                </div>
              </div>
            </div>
          `;
        })
        .join("")}
    </div>
  `;
}
   
function renderTextoBlocos(texto) {
  if (!texto) {
    return `<p class="text-sm text-gray-500">Sem conteúdo cadastrado.</p>`;
  }

  const linhas = String(texto)
    .split(/\r?\n/)
    .map((linha) => linha.trim())
    .filter(Boolean);

  if (linhas.length === 0) {
    return `<p class="text-sm text-gray-500">Sem conteúdo cadastrado.</p>`;
  }

  return `
    <div class="space-y-2 text-sm leading-relaxed text-gray-700">
      ${linhas.map((linha) => `<p>${escHtml(linha)}</p>`).join("")}
    </div>
  `;
}

function buildSections(t, conteudo, listas, top5 = []) {
  const labelsLista = {
    mapLabel: t.mapLabel,
    reviewLabel: t.reviewLabel,
    extraLabel: t.extraLabel
  };

  const top5Section = top5.length
    ? `
      <section id="top5" class="mb-8">
        <div class="rounded-3xl p-5 bg-white border border-gray-200 shadow-sm">
          <div class="flex items-center gap-2 mb-4">
            <span style="font-size:18px;">⭐</span>
            <h2 class="text-lg font-semibold text-gray-800">Imperdíveis próximos ao apartamento</h2>
          </div>

          <div class="grid gap-4 sm:grid-cols-2">
            ${top5.map((item) => {
              const titulo = escHtml(item.titulo || "");
              const imagem = item.imagem_url || "";
              const descricao = escHtml(item.descricao || "");
              const maps = item.link_maps || "";

              return `
                <div class="rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-sm">
                 ${imagem ? `
  <div class="mb-3 overflow-hidden rounded-xl">
    <img src="${escHtml(imagem)}"
         style="width:100%; height:140px; object-fit:cover;">
  </div>
` : ""}

                  <div class="p-3">
                    <div style="
                      font-size:11px;
                      color:#6b7280;
                      margin-bottom:6px;
                      font-weight:500;
                    ">
                      ⭐ Recomendado
                    </div>

                    <h3 class="font-semibold text-base text-gray-800">
                      ${titulo}
                    </h3>

                    ${descricao ? `
                      <p class="text-sm text-gray-600 mt-1">
                        ${descricao}
                      </p>
                    ` : ""}

                    ${maps ? `
                      <a href="${escHtml(maps)}"
                         target="_blank"
                         rel="noopener noreferrer"
                         style="
                           display:inline-block;
                           margin-top:8px;
                           font-size:12px;
                           color:#fff;
                           background:#1a5c3a;
                           padding:6px 10px;
                           border-radius:8px;
                         ">
                        Ver no mapa
                      </a>
                    ` : ""}
                  </div>
                </div>
              `;
            }).join("")}
          </div>
        </div>
      </section>
    `
    : "";

  return {
  top5: {
    title: "Imperdíveis",
    html: top5Section
  },

  importante: {
    title: t.importantTitle,
    html: renderTextoBlocos(conteudo.importante_texto || conteudo.checkin_texto)
  },

  amenidades: {
    title: t.amenitiesTitle,
    html: renderLista(listas.amenidades || [], labelsLista)
  },

  wifi: {
    title: t.wifi.title,
    html: `
      <div class="wifi-box rounded-2xl p-4 border border-gray-200">
        <div class="mb-4">
          <p class="text-xs uppercase tracking-widest text-gray-500">${escHtml(t.wifi.network)}</p>
          <p class="text-lg font-semibold text-gray-800 break-all">${escHtml(conteudo.wifi_nome || "")}</p>
        </div>
        <div class="mb-4">
          <p class="text-xs uppercase tracking-widest text-gray-500">${escHtml(t.wifi.password)}</p>
          <p class="text-lg font-semibold text-gray-800 break-all">${escHtml(conteudo.wifi_senha || "")}</p>
        </div>
        <button onclick="copyText(${JSON.stringify(conteudo.wifi_senha || "")})" class="text-sm px-4 py-2 rounded-full text-white" style="background:#1a5c3a;">
          ${escHtml(t.wifi.copyPassword)}
        </button>
      </div>
    `
  },

  checkin: {
    title: t.checkin.title,
    html: `
      <div class="space-y-4 text-sm text-gray-700">
        <div class="rounded-2xl p-4" style="background:#f5f0eb;">
          <p class="font-semibold mb-2">${escHtml(t.checkin.checkin)}</p>
          ${renderTextoBlocos(conteudo.checkin_texto)}
        </div>
        <div class="rounded-2xl p-4" style="background:#f5f0eb;">
          <p class="font-semibold mb-2">${escHtml(t.checkin.checkout)}</p>
          ${renderTextoBlocos(conteudo.checkout_texto)}
        </div>
      </div>
    `
  },

  regras: {
    title: t.rulesTitle,
    html: renderTextoBlocos(conteudo.regras_texto)
  },

  apartamento: {
    title: t.apartmentTitle,
    html: `
      <div class="space-y-4 text-sm text-gray-700">
        ${renderTextoBlocos(conteudo.apartamento_texto)}
        <div class="grid grid-cols-2 gap-3">
          <div class="rounded-2xl p-4" style="background:#f5f0eb;">
            <p class="text-xs text-gray-500 uppercase">Capacidade</p>
            <p class="font-semibold text-lg">4 pessoas</p>
          </div>
          <div class="rounded-2xl p-4" style="background:#f5f0eb;">
            <p class="text-xs text-gray-500 uppercase">Quartos</p>
            <p class="font-semibold text-lg">2 quartos</p>
          </div>
          <div class="rounded-2xl p-4" style="background:#f5f0eb;">
            <p class="text-xs text-gray-500 uppercase">Banheiro</p>
            <p class="font-semibold text-lg">1 banheiro</p>
          </div>
          <div class="rounded-2xl p-4" style="background:#f5f0eb;">
            <p class="text-xs text-gray-500 uppercase">Camas</p>
            <p class="font-semibold text-lg">4 camas</p>
          </div>
        </div>
      </div>
    `
  },

  locomover: {
    title: t.gettingAroundTitle,
    html: renderTextoBlocos(conteudo.transporte_texto)
  },

  chegar: {
    title: t.gettingThereTitle,
    html: `
      <div class="space-y-3 text-sm text-gray-700">
        ${conteudo.endereco_exibicao ? `<p><strong>${conteudo.endereco_exibicao}</strong></p>` : ""}
        ${renderTextoBlocos(conteudo.como_chegar_texto)}
      </div>
    `
  },

  restaurantes: {
    title: t.restaurantsTitle,
    html: renderLista(listas.restaurantes || [], labelsLista)
  },

  bares: {
    title: t.barsTitle,
    html: renderLista(listas.bares || [], labelsLista)
  },

  cafe: {
    title: t.breakfastTitle,
    html: renderLista(listas.cafe || [], labelsLista)
  },

  fazer: {
    title: t.whatToDoTitle,
    html: renderLista(listas.fazer || [], labelsLista)
  },

  proximos: {
    title: t.nearbyTitle,
    html: renderLista(listas.proximos || [], labelsLista)
  },

  doces: {
    title: t.sweetsTitle,
    html: renderLista(listas.doces || [], labelsLista)
  },

  emergencia: {
    title: t.emergencyTitle,
    html: `
      <div class="space-y-3 text-sm text-gray-700">
        ${(t.emergencyList || [])
          .map((e) => `<a href="tel:${e.phone}" class="block rounded-2xl border p-4">${escHtml(e.label)}</a>`)
          .join("")}
      </div>
    `
  },

  avaliacao: {
    title: t.reviewTitle,
    html: `
      <div class="space-y-4 text-sm text-gray-700">
        <p>${escHtml(t.reviewText)}</p>
        <a href="https://airbnb.com/" target="_blank" rel="noopener noreferrer" class="inline-flex px-4 py-2 rounded-full text-white" style="background:#1a5c3a;">
          ${escHtml(t.reviewButton)}
        </a>
      </div>
    `
  },

  faq: {
    title: t.faqTitle,
    html: renderLista(listas.faq || [], labelsLista)
  },

  partir: {
    title: t.beforeLeavingTitle,
    html: renderTextoBlocos(conteudo.antes_partir_texto)
  },

  contato: {
    title: t.contactTitle,
    html: `
      <div class="space-y-4 text-sm text-gray-700">
        ${renderTextoBlocos(conteudo.contato_texto)}
        <a href="https://wa.me/5521971810022" target="_blank" rel="noopener noreferrer" class="inline-flex px-4 py-2 rounded-full text-white" style="background:#25d366;">
          💬 Falar com anfitrião
        </a>
      </div>
    `
  }
};
}
app.get("/", (req, res) => {
  res.status(200).send("Guia do Hóspede rodando 🚀");
});

app.get("/health", async (req, res) => {
  try {
    await pool.query("SELECT 1");
    res.status(200).json({ ok: true, db: true });
  } catch (error) {
    res.status(200).json({ ok: true, db: false, error: error.message });
  }
});


function buildPrintCardHtml(cardData = {}) {
  const {
    titulo = "GUIA DE\nBOAS-VINDAS",
    subtitulo = "",
    endereco = "",
    boasVindasTitulo = "SEJA BEM-VINDO!",
    boasVindasTexto = "Escaneie o QR Code para acessar o guia digital do apartamento.",
    suporteTexto = "Guia interativo com check-in, Wi-Fi, regras, restaurantes, localização e informações úteis.",
    guiaUrl = "",
    marca = "mundodeoportunidades.com.br"
  } = cardData;

  return `
<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Card QR - ${escHtml(subtitulo)}</title>

  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=Outfit:wght@300;400;500;600;700&display=swap" rel="stylesheet">

  <script src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"></script>

<style>
  :root {
    --bg: #f5f0eb;
    --card: #ffffff;
    --green: #1a5c3a;
    --green-dark: #103a25;
    --green-soft: #7cc9a0;
    --text: #24323d;
    --muted: #6b7280;
    --line: #d9e2dc;
  }

  * { box-sizing: border-box; }

  html, body {
    margin: 0;
    padding: 0;
    background: var(--bg);
    color: var(--text);
    font-family: "Outfit", sans-serif;
  }

  body.print-card-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px;
}

  .page {
  width: 210mm;
  min-height: 297mm;
  background: var(--bg);
  padding: 14mm;
  margin: 0 auto;
}

  .poster {
    background: var(--card);
    border: 1px solid var(--line);
    border-radius: 24px;
    overflow: hidden;
    box-shadow: 0 8px 30px rgba(16, 58, 37, 0.08);
  }

  .hero {
    background: linear-gradient(160deg, var(--green-dark) 0%, var(--green) 65%, #236b46 100%);
    color: #fff;
    padding: 28px 28px 34px;
  }

  .hero-eyebrow {
    font-size: 12px;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    opacity: 0.72;
    margin-bottom: 14px;
  }

  .hero-title {
    margin: 0;
    font-family: "DM Serif Display", serif;
    font-size: 52px;
    line-height: 0.95;
  }

  .hero-line {
    width: 68px;
    height: 3px;
    border-radius: 999px;
    background: var(--green-soft);
    margin: 18px 0 18px;
  }

  .hero-subtitle {
    margin: 0;
    font-size: 22px;
    font-weight: 500;
    line-height: 1.3;
  }

  .hero-address {
    margin-top: 6px;
    font-size: 14px;
    opacity: 0.82;
  }

  .content {
    padding: 28px 28px 22px;
    text-align: center;
  }

  .welcome {
    font-family: "DM Serif Display", serif;
    color: var(--green);
    font-size: 34px;
    margin: 0 0 8px;
  }

  .description {
    max-width: 620px;
    margin: 0 auto 24px;
    font-size: 18px;
    color: var(--muted);
    line-height: 1.55;
  }

  .qr-wrap {
    display: flex;
    justify-content: center;
    margin: 14px 0 22px;
  }

  .qr-box {
    background: #fff;
    border: 2px solid var(--green);
    border-radius: 24px;
    padding: 18px;
    box-shadow: 0 10px 20px rgba(26, 92, 58, 0.10);
  }

  #qrcode {
    width: 320px;
    height: 320px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto;
    background: #fff;
  }

  .cta {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: var(--green);
    color: #fff;
    border-radius: 16px;
    padding: 14px 24px;
    font-size: 22px;
    font-weight: 700;
    margin-bottom: 16px;
    min-width: 420px;
  }

  .info {
    max-width: 700px;
    margin: 0 auto 20px;
    font-size: 16px;
    color: var(--text);
    line-height: 1.6;
  }

  .url-box {
    display: inline-block;
    background: #f7f8f7;
    border: 1px solid var(--line);
    color: var(--green);
    border-radius: 14px;
    padding: 12px 18px;
    font-size: 14px;
    margin-top: 6px;
    word-break: break-all;
    max-width: 90%;
  }

  .footer {
    margin-top: 28px;
    padding-top: 18px;
    border-top: 1px solid var(--line);
    text-align: center;
  }

  .brand-top {
    font-size: 14px;
    color: var(--muted);
    margin-bottom: 6px;
    opacity: 0.8;
  }

  .print-actions {
    width: 210mm;
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    margin-bottom: 12px;
  }

  .btn {
    border: 0;
    border-radius: 10px;
    padding: 10px 14px;
    background: var(--green);
    color: #fff;
    font-weight: 600;
    cursor: pointer;
  }

  @media print {
    html, body {
      width: 210mm;
      height: auto;
      background: #fff;
      margin: 0;
      padding: 0;
    }

    body.print-card-page {
      display: block;
      padding: 0;
    }

    .print-actions {
      display: none !important;
    }

    .page {
      width: 210mm;
      min-height: auto;
      padding: 0;
      margin: 0;
      background: #fff;
    }

    .poster {
      box-shadow: none;
      border: none;
      border-radius: 0;
    }

    @page {
      size: A4;
      margin: 10mm;
    }
  }
</style>
</head>
<body>
  <div>
    <div class="print-actions">
      <button class="btn" onclick="window.print()">Imprimir / Salvar PDF</button>
    </div>

    <div class="page">
      <div class="poster">
        <div class="hero">
          <div class="hero-eyebrow">WELCOME GUIDE · GUÍA DE BIENVENIDA</div>
          <h1 class="hero-title">${escHtml(titulo).replace(/\\n/g, "<br>")}</h1>
          <div class="hero-line"></div>
          <p class="hero-subtitle">${escHtml(subtitulo)}</p>
          <div class="hero-address">${endereco || ""}</div>
        </div>

        <div class="content">
          <h2 class="welcome">${escHtml(boasVindasTitulo)}</h2>
          <p class="description">${escHtml(boasVindasTexto)}</p>

          <div class="qr-wrap">
            <div class="qr-box">
              <div id="qrcode"></div>
            </div>
          </div>

          <div class="cta">ESCANEIE PARA ACESSAR</div>

          <div class="info">${escHtml(suporteTexto)}</div>

          <div class="url-box">${escHtml(guiaUrl)}</div>

          <div class="footer" style="text-align:center;">

  <div class="brand-top" style="text-align:center;">
    ✨ Guia Digital Inteligente
  </div>

  <div style="
    text-align:center;
    font-size:11px;
    color:#9ca3af;
    margin-top:8px;
    line-height:1.4;
  ">
    <div style="margin-bottom:2px;">
      desenvolvido por
    </div>

    <div style="
      font-size:12px;
      color:#374151;
      font-weight:500;
      letter-spacing:0.3px;
    ">
      mundodeoportunidades.com.br
    </div>

  </div>
</div>
</div>

</div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <script>
    new QRCode(document.getElementById("qrcode"), {
      text: ${JSON.stringify(guiaUrl)},
      width: 320,
      height: 320,
      colorDark: "#000000",
      colorLight: "#ffffff",
      correctLevel: QRCode.CorrectLevel.H
    });
  </script>
</body>
</html>
  `;
}
app.get("/imovel/:codigo/card", async (req, res) => {
  try {
    const codigo = req.params.codigo;

    const imovelResult = await pool.query(
      `SELECT * FROM imoveis WHERE codigo_publico = $1 LIMIT 1`,
      [codigo]
    );

    if (imovelResult.rows.length === 0) {
      return res.status(404).send("Imóvel não encontrado.");
    }

    const imovel = imovelResult.rows[0];

    const conteudoResult = await pool.query(
      `SELECT * FROM imovel_conteudos
       WHERE imovel_id = $1 AND idioma = 'pt'
       LIMIT 1`,
      [imovel.id]
    );

    const conteudo = conteudoResult.rows[0] || {};

    const guiaUrl = `${req.protocol}://${req.get("host")}/imovel/${codigo}/pt`;

    const html = buildPrintCardHtml({
      titulo: "GUIA DE\nBOAS-VINDAS",
      subtitulo: conteudo.subtitulo || imovel.nome || "Guia do Hóspede",
      endereco: conteudo.endereco_exibicao || "",
      boasVindasTitulo: "SEJA BEM-VINDO!",
      boasVindasTexto: "Escaneie o QR Code para acessar o guia digital do apartamento.",
      suporteTexto: "Guia interativo com check-in, Wi-Fi, regras, restaurantes, localização e informações úteis.",
      guiaUrl,
      marca: "mundodeoportunidades.com.br"
    });

    return res.status(200).send(html);
  } catch (err) {
    console.error("ERRO AO RENDERIZAR CARD:", err);
    return res.status(500).send("Erro interno ao carregar o card.");
  }
});
app.get("/imovel/:codigo/:idioma?", async (req, res) => {
  try {
    const codigo = req.params.codigo;
const idioma = req.params.idioma || "pt";

console.log("IDIOMA RECEBIDO:", idioma); // 👈 AQUI

const t = getLabels(idioma);

    const imovelResult = await pool.query(
      `SELECT * FROM imoveis WHERE codigo_publico = $1 LIMIT 1`,
      [codigo]
    );

    if (imovelResult.rows.length === 0) {
      return res.status(404).send("Imóvel não encontrado.");
    }

    const imovel = imovelResult.rows[0];

const fotosResult = await pool.query(
  `SELECT url, ordem
   FROM imovel_fotos
   WHERE imovel_id = $1
   ORDER BY ordem ASC, id ASC`,
  [imovel.id]
);

const fotos = fotosResult.rows || [];
console.log("FOTOS:", fotos);
const heroImage = fotos.length > 0 ? fotos[0].url : "";
const heroImages = fotos.map((f) => f.url).filter(Boolean);
    let conteudoResult = await pool.query(
  `SELECT * FROM imovel_conteudos WHERE imovel_id = $1 AND idioma = $2 LIMIT 1`,
  [imovel.id, idioma]
);

    if (conteudoResult.rows.length === 0 && idioma !== "pt") {
      conteudoResult = await pool.query(
        `SELECT * FROM imovel_conteudos WHERE imovel_id = $1 AND idioma = 'pt' LIMIT 1`,
        [imovel.id]
      );
    }

    const conteudo = conteudoResult.rows[0] || {};

     let listas = {
  cafe: [],
  bares: [],
  proximos: [],
  fazer: [],
  restaurantes: [],
  doces: [],
  amenidades: [],
  faq: []
};

try {
  let listasResult = await pool.query(
    `SELECT *
     FROM imovel_secao_itens
     WHERE imovel_id = $1
       AND idioma = $2
     ORDER BY secao, ordem ASC, id ASC`,
    [imovel.id, idioma]
  );

  if (listasResult.rows.length === 0 && idioma !== "pt") {
    listasResult = await pool.query(
      `SELECT *
       FROM imovel_secao_itens
       WHERE imovel_id = $1
         AND idioma = 'pt'
       ORDER BY secao, ordem ASC, id ASC`,
      [imovel.id]
    );
  }

  listas = agruparListasPorSecao(listasResult.rows);
  console.log("FAQ FINAL:", listas.faq);
  console.log("Itens encontrados:", listasResult.rows.length);
  console.log("Seções encontradas:", listasResult.rows.map((r) => r.secao));
} catch (e) {
  console.error("Erro ao buscar listas:", e.message);
}

const top5 = [
  ...listas.fazer,
  ...listas.bares,
  ...listas.cafe,
  ...listas.restaurantes,
  ...listas.doces,
  ...listas.proximos
]
  .filter((item) => item.destaque_ordem && Number(item.destaque_ordem) > 0)
  .sort((a, b) => Number(a.destaque_ordem) - Number(b.destaque_ordem))
  .slice(0, 5);

const menuItems = buildMenuItems(t);
const sections = buildSections(t, conteudo, listas, top5);
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
    .section-card { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); cursor: pointer; }
    .section-card:hover { transform: translateY(-2px); }
    .modal-overlay { opacity: 0; pointer-events: none; transition: opacity 0.3s ease; }
    .modal-overlay.active { opacity: 1; pointer-events: all; }
    .modal-content { transform: translateY(100%); transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
    .modal-overlay.active .modal-content { transform: translateY(0); }
    .fade-in { animation: fadeUp 0.5s ease forwards; opacity: 0; }
    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(16px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .hero-gradient {
      background: linear-gradient(165deg, #0c2e1e 0%, #1a5c3a 40%, #2a7d50 70%, #1a5c3a 100%);
    }
    .menu-icon-box {
      width: 56px; height: 56px; border-radius: 14px;
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
      position: fixed; bottom: 80px; left: 50%;
      transform: translateX(-50%) translateY(20px);
      opacity: 0; transition: all 0.3s ease;
      pointer-events: none; z-index: 9999;
    }
    .copy-toast.show { opacity: 1; transform: translateX(-50%) translateY(0); }
    .lang-pill { border: 2px solid transparent; }
    .lang-pill.active {
      border-color: #7cc9a0;
      box-shadow: 0 0 0 3px rgba(124, 201, 160, 0.18);
    }
    ::-webkit-scrollbar { width: 0; }
    .heading-font { letter-spacing: 0.2px; }
  </style>
</head>
<body class="h-full">
  <div id="app" class="h-full w-full overflow-auto" style="background:#f5f0eb;">
    <div id="copyToast" class="copy-toast px-4 py-2 rounded-full text-sm font-medium text-white" style="background:#1a5c3a;">
      ${escHtml(t.copyToast)}
    </div>

    <div id="homeScreen">
  <div
    class="relative overflow-hidden"
    style="
      min-height: 280px;
      padding: 36px 20px 24px;
      background-color: #1a5c3a;
      border-bottom-left-radius: 28px;
      border-bottom-right-radius: 28px;
    "
  >
    <div id="heroSlider" class="absolute inset-0">
      ${heroImages
        .map(
          (img, index) => `
            <div
              class="hero-slide absolute inset-0"
              style="
                background-image: url('${img}');
                background-size: cover;
                background-position: center center;
                opacity: ${index === 0 ? "1" : "0"};
                transition: opacity 1s ease-in-out;
              "
            ></div>
          `
        )
        .join("")}
    </div>
    <div
      class="absolute inset-0"
      style="background: linear-gradient(to bottom, rgba(0,0,0,0.35), rgba(0,0,0,0.65));"
    ></div>

    <div class="relative z-10 max-w-md mx-auto">
      <div class="fade-in" style="animation-delay:0.1s">
        <p class="text-white/60 text-xs tracking-widest uppercase mb-2">
          Welcome Guide · Guía de Bienvenida
        </p>

        <h1 id="heroTitle" class="heading-font text-white text-4xl leading-tight mb-3">
          ${escHtml(conteudo.titulo || t.pageTitle)}
        </h1>

        <div class="w-10 h-0.5 rounded-full mb-4" style="background:#7cc9a0;"></div>
      </div>

      <div class="fade-in" style="animation-delay:0.25s">
        <p class="text-white/90 font-light text-lg leading-relaxed">
          ${escHtml(conteudo.subtitulo || imovel.nome || "")}
        </p>

        <p class="text-white/50 text-sm mt-1">
          ${conteudo.endereco_exibicao || ""}
        </p>
      </div>
    </div>
  </div>
      <div class="max-w-md mx-auto px-5 -mt-4 relative z-10">
        <div class="bg-white rounded-2xl p-5 shadow-sm fade-in" style="animation-delay:0.35s">
          <p class="heading-font text-xl mb-1" style="color:#1a5c3a;">${escHtml(conteudo.boas_vindas_titulo || t.welcomeTitle)}</p>
          <p class="text-sm text-gray-500 leading-relaxed">${escHtml(conteudo.boas_vindas_subtitulo || t.welcomeText)}</p>
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
      <div class="modal-content absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl" style="max-height:90vh; display:flex; flex-direction:column;">
        <div class="sticky top-0 bg-white z-10 px-5 pt-4 pb-3 border-b border-gray-100 flex items-center justify-between">
          <h2 id="modalTitle" class="heading-font text-xl" style="color:#1a5c3a;"></h2>
          <button onclick="closeModalDirect()" class="w-8 h-8 rounded-full flex items-center justify-center" style="background:#f0f0f0;">
            <i data-lucide="x" style="width:16px;height:16px;color:#666;"></i>
          </button>
        </div>
        <div id="modalBody" style="flex:1; overflow-y:auto; padding:20px;"></div>
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

      if (window.lucide && typeof window.lucide.createIcons === "function") {
        window.lucide.createIcons();
      }
    }

    function openSection(id) {
  const modal = document.getElementById("modal");
  const modalBody = document.getElementById("modalBody");
  const modalTitle = document.getElementById("modalTitle");

  const section = sections[id] || { title: "Info", html: "<p>Sem conteúdo.</p>" };

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
    modal.dataset.open = "";
  }
}

function closeModalDirect() {
  const modal = document.getElementById("modal");
  modal.classList.remove("active");
  modal.dataset.open = "";
}
    function copyText(text) {
      if (!navigator.clipboard || !navigator.clipboard.writeText) return;
      navigator.clipboard.writeText(text).then(() => {
        const toast = document.getElementById("copyToast");
        toast.classList.add("show");
        setTimeout(() => toast.classList.remove("show"), 1800);
      }).catch(() => {});
    }

    buildMenu();

    if (window.lucide && typeof window.lucide.createIcons === "function") {
      window.lucide.createIcons();
    }
    const heroSlides = document.querySelectorAll(".hero-slide");

if (heroSlides.length > 1) {
  let heroIndex = 0;

  setInterval(() => {
    heroSlides[heroIndex].style.opacity = "0";
    heroIndex = (heroIndex + 1) % heroSlides.length;
    heroSlides[heroIndex].style.opacity = "1";
  }, 4000);
}
</script>

<div class="footer" style="text-align:center;">

  <div class="brand-top" style="
  text-align:center;
  font-size:12px;
  color:#9ca3af;
  opacity:0.8;
  margin-bottom:4px;
">
  ✨ Guia Digital Inteligente
</div>
 <div style="
  text-align:center;
  font-size:10px;
  color:#9ca3af;
  line-height:1.3;
">
  desenvolvido por
</div>

<div style="
  text-align:center;
  font-size:11px;
  color:#6b7280;
  font-weight:500;
  letter-spacing:0.2px;
">
  mundodeoportunidades.com.br
</div>
<div style="margin-top:10px;">
  <a href="/imovel/${codigo}/card" target="_blank" style="
    font-size:11px;
    color:#6b7280;
    text-decoration:none;
    border-bottom:1px dashed #9ca3af;
  ">
    📄 Imprimir QR Code
  </a>
</div>
  </div>
</div>

  body.print-card-page {
    display: flex;
    justify-content: center;
    align-items: flex-start;
    background: #ffffff;
  }
</style>
</html>
    `;

    return res.status(200).send(html);
  } catch (err) {
    console.error("ERRO AO RENDERIZAR /imovel:", err);
    return res.status(500).send("Erro interno ao carregar o guia.");
  }
});

app.use((err, req, res, next) => {
  console.error("ERRO NÃO TRATADO:", err);
  res.status(500).send("Erro interno do servidor.");
});

process.on("unhandledRejection", (reason) => {
  console.error("UNHANDLED REJECTION:", reason);
});

process.on("uncaughtException", (error) => {
  console.error("UNCAUGHT EXCEPTION:", error);
});

app.listen(port, "0.0.0.0", () => {
  console.log("Servidor rodando 🚀 na porta " + port);
});
