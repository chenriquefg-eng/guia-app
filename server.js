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

function renderLista(lista = []) {
  if (!Array.isArray(lista) || lista.length === 0) {
    return `<p class="text-sm text-gray-500">Sem itens cadastrados nesta seção.</p>`;
  }

  return `
    <div class="space-y-3">
      ${lista
        .map((item) => {
          const titulo = escHtml(item.nome || item.titulo || "");
          const endereco = escHtml(item.endereco || "");
          const descricao = escHtml(item.descricao || "");
          const maps = item.maps || item.link || "";
          const instagram = item.instagram || "";

          return `
            <div class="rounded-2xl border border-gray-200 p-4">
              <h3 class="font-semibold text-base text-gray-800">${titulo}</h3>
              ${endereco ? `<p class="text-sm text-gray-500 mt-1">${endereco}</p>` : ""}
              ${descricao ? `<p class="text-sm text-gray-600 mt-2">${descricao}</p>` : ""}
              <div class="flex flex-wrap gap-2 mt-3">
                ${
                  maps
                    ? `<a href="${escHtml(maps)}" target="_blank" class="text-sm px-3 py-2 rounded-full text-white" style="background:#1a5c3a;">Google Maps</a>`
                    : ""
                }
                ${
                  instagram
                    ? `<a href="${escHtml(instagram)}" target="_blank" class="text-sm px-3 py-2 rounded-full border" style="border-color:#1a5c3a;color:#1a5c3a;">Instagram</a>`
                    : ""
                }
              </div>
            </div>
          `;
        })
        .join("")}
    </div>
  `;
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

function buildSections(t, dados = {}) {
  const {
    conteudo = {},
    listas = {},
    idioma = "pt"
  } = dados;

  const wifiRede = conteudo.wifi_rede || "Ap1101";
  const wifiSenha = conteudo.wifi_senha || "Paodeacucar1101";

  return {
    importante: {
      title: t.importantTitle,
      html: `
        <div class="space-y-3 text-sm leading-relaxed text-gray-700">
          <p>Acesso por fechadura eletrônica.</p>
          <p>O código será enviado no dia da chegada.</p>
          <p>Portaria 24h – informe Ap 1101.</p>
          <p>Check-in rápido e independente.</p>
          <hr class="my-3">
          <p><strong>Ao sair, pedimos gentilmente que:</strong></p>
          <ul class="list-disc pl-5 space-y-1">
            <li>Desligue ar-condicionado</li>
            <li>Apague as luzes</li>
            <li>Feche portas e janelas</li>
          </ul>
        </div>
      `
    },

    amenidades: {
      title: t.amenitiesTitle,
      html: `
        <div class="space-y-2 text-sm leading-relaxed text-gray-700">
          <p>Ar condicionado nos quartos e sala</p>
          <p>Roupas de cama</p>
          <p>Toalhas</p>
          <p>Papel higiênico</p>
          <p>Pó de café</p>
          <p>Açúcar</p>
          <p>Sal e temperos</p>
          <p>Cafeteira elétrica</p>
          <p>Cafeteira Nespresso</p>
          <p>Microondas</p>
          <p>Sanduicheira</p>
          <p>Liquidificador</p>
          <p>Panos de prato</p>
          <p>Esponja e detergente</p>
          <p>Shampoo, condicionador e sabonete líquido</p>
        </div>
      `
    },

    wifi: {
      title: t.wifi.title,
      html: `
        <div class="wifi-box rounded-2xl p-4 border border-gray-200">
          <div class="mb-4">
            <p class="text-xs uppercase tracking-widest text-gray-500">${escHtml(t.wifi.network)}</p>
            <p class="text-lg font-semibold text-gray-800 break-all">${escHtml(wifiRede)}</p>
          </div>
          <div class="mb-4">
            <p class="text-xs uppercase tracking-widest text-gray-500">${escHtml(t.wifi.password)}</p>
            <p class="text-lg font-semibold text-gray-800 break-all">${escHtml(wifiSenha)}</p>
          </div>
          <button onclick="copyText('${escHtml(wifiSenha)}')" class="text-sm px-4 py-2 rounded-full text-white" style="background:#1a5c3a;">
            ${escHtml(t.wifi.copyPassword)}
          </button>
        </div>
      `
    },

    checkin: {
      title: t.checkin.title,
      html: `
        <div class="grid grid-cols-2 gap-3">
          <div class="rounded-2xl p-4 text-center" style="background:#f5f0eb;">
            <p class="text-xs uppercase tracking-widest text-gray-500 mb-2">${escHtml(t.checkin.checkin)}</p>
            <p class="text-2xl font-semibold" style="color:#1a5c3a;">15:00</p>
          </div>
          <div class="rounded-2xl p-4 text-center" style="background:#f5f0eb;">
            <p class="text-xs uppercase tracking-widest text-gray-500 mb-2">${escHtml(t.checkin.checkout)}</p>
            <p class="text-2xl font-semibold" style="color:#1a5c3a;">11:00</p>
          </div>
        </div>
      `
    },

    regras: {
      title: t.rulesTitle,
      html: `
        <ul class="list-disc pl-5 space-y-2 text-sm text-gray-700">
          <li>Silêncio após 22h</li>
          <li>Não é permitido fumar</li>
          <li>Não são permitidas festas</li>
          <li>Não alterar disposição dos móveis</li>
          <li>Respeitar horários de check-in e check-out</li>
          <li>Retirar o lixo ao sair</li>
        </ul>
      `
    },

    apartamento: {
      title: t.apartmentTitle,
      html: `
        <div class="space-y-4 text-sm text-gray-700">
          <p>Estamos muito felizes em receber você. O apartamento foi recém-reformado, com marcenaria planejada, decoração contemporânea e enxoval padrão hotelaria.</p>
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
      html: `
        <div class="space-y-4 text-sm text-gray-700">
          <div><strong>Uber / 99:</strong> serviços amplamente disponíveis na região.</div>
          <div><strong>Táxi:</strong> há ponto fixo na torre do Shopping RioSul.</div>
          <div><strong>Transporte público:</strong> ônibus em frente ao Shopping RioSul e metrô Botafogo nas proximidades.</div>
          <div><strong>A pé:</strong> região residencial, tranquila e arborizada, ideal para caminhadas.</div>
          <div><strong>Bicicleta:</strong> aluguel por apps como Tembici e Uber.</div>
          <div><strong>Estacionamento:</strong> o edifício não dispõe de vaga privativa.</div>
        </div>
      `
    },

    chegar: {
      title: t.gettingThereTitle,
      html: `
        <div class="space-y-3 text-sm text-gray-700">
          <p><strong>Endereço:</strong> Rua Lauro Müller, 46 - Botafogo - Rio de Janeiro</p>
          <p>• Utilize o endereço completo no Google Maps ou Uber</p>
          <p>• O prédio possui portaria 24h</p>
          <p>• Informe o número do apartamento: 1101</p>
          <p>• A entrada é feita por fechadura eletrônica</p>
          <a href="https://maps.app.goo.gl/FEPcLwTqpL1vyYfdA" target="_blank" class="inline-flex text-sm px-4 py-2 rounded-full text-white" style="background:#1a5c3a;">
            ${escHtml(t.openMaps)}
          </a>
        </div>
      `
    },

    restaurantes: {
      title: t.restaurantsTitle,
      html: renderLista(listas.restaurantes || [])
    },

    bares: {
      title: t.barsTitle,
      html: renderLista(listas.bares || [])
    },

    cafe: {
      title: t.breakfastTitle,
      html: renderLista(listas.cafe || [])
    },

    fazer: {
      title: t.whatToDoTitle,
      html: renderLista(listas.fazer || [])
    },

    proximos: {
      title: t.nearbyTitle,
      html: renderLista(listas.proximos || [])
    },

    doces: {
      title: t.sweetsTitle,
      html: renderLista(listas.doces || [])
    },

    emergencia: {
      title: t.emergencyTitle,
      html: `
        <div class="space-y-3 text-sm text-gray-700">
          <a href="tel:190" class="block rounded-2xl border p-4">190 — Polícia Militar</a>
          <a href="tel:192" class="block rounded-2xl border p-4">192 — SAMU</a>
          <a href="tel:193" class="block rounded-2xl border p-4">193 — Corpo de Bombeiros</a>
        </div>
      `
    },

    avaliacao: {
      title: t.reviewTitle,
      html: `
        <div class="space-y-4 text-sm text-gray-700">
          <p>Esperamos que você tenha gostado da sua estadia em nossa hospedagem.</p>
          <a href="https://airbnb.com/" target="_blank" class="inline-flex px-4 py-2 rounded-full text-white" style="background:#1a5c3a;">
            Deixar avaliação
          </a>
        </div>
      `
    },

    faq: {
      title: t.faqTitle,
      html: `
        <div class="space-y-4 text-sm text-gray-700">
          <div class="rounded-2xl border p-4">
            <strong>Tem estacionamento disponível no local?</strong>
            <p class="mt-2">O edifício não dispõe de vaga privativa. Há vagas públicas na rua e estacionamentos próximos.</p>
          </div>
          <div class="rounded-2xl border p-4">
            <strong>Posso levar meu pet?</strong>
            <p class="mt-2">Não é permitida a hospedagem de animais.</p>
          </div>
          <div class="rounded-2xl border p-4">
            <strong>Tem roupa de cama e banho disponível?</strong>
            <p class="mt-2">Sim. Disponibilizamos enxoval completo, incluindo roupas de cama e toalhas.</p>
          </div>
          <div class="rounded-2xl border p-4">
            <strong>Como funciona a lavanderia?</strong>
            <p class="mt-2">O apartamento não dispõe de máquina de lavar. Para maior comodidade, sugerimos lavanderias próximas.</p>
          </div>
        </div>
      `
    },

    partir: {
      title: t.beforeLeavingTitle,
      html: `
        <div class="space-y-3 text-sm text-gray-700">
          <p><strong>Check-out:</strong> 11:00</p>
          <p>• Retirar o lixo e colocá-lo no local indicado do prédio</p>
          <p>• Feche todas as janelas e portas</p>
          <p>• Desligue o ar-condicionado e as luzes antes de sair</p>
          <p>• Informe-nos se algum dano pequeno tiver acontecido</p>
          <p>• Antes de sair, verifique se nenhum item pessoal foi esquecido</p>
        </div>
      `
    },

    contato: {
      title: t.contactTitle,
      html: `
        <div class="space-y-4 text-sm text-gray-700">
          <p>Foi um prazer recebê-lo em nosso apartamento.</p>
          <p><strong>Instagram:</strong> @milepascoal</p>
          <p><strong>WhatsApp:</strong> +55 21 97181-0022</p>
          <p><strong>Endereço:</strong> Rua Lauro Müller, 46 Ap 1101</p>
          <a href="https://wa.me/5521971810022" target="_blank" class="inline-flex px-4 py-2 rounded-full text-white" style="background:#25d366;">
            💬 Falar com anfitrião
          </a>
        </div>
      `
    }
  };
}

app.get("/imovel/:codigo/:idioma?", async (req, res) => {
  try {
    const codigo = req.params.codigo;
    const idioma = req.params.idioma || "pt";
    const t = getLabels(idioma);

    const imovel = {
      nome: "Apartamento Nova Urca - Botafogo",
      endereco: "Rua Lauro Müller, 46",
      apartamento: "1101",
      cidade: "Rio de Janeiro",
      estado: "RJ"
    };

    const conteudo = {
      titulo:
        idioma === "en"
          ? "WELCOME GUIDE"
          : idioma === "es"
            ? "GUÍA DE BIENVENIDA"
            : "GUIA DE BOAS-VINDAS",
      wifi_rede: "Ap1101",
      wifi_senha: "Paodeacucar1101"
    };

    const listas = {
      cafe: [
        {
          nome: "Empório Jardim Casa Firjan",
          endereco: "R. Guilhermina Guinle, 211 - Botafogo, Rio de Janeiro - RJ",
          descricao: "18 minutos de carro",
          maps: "https://maps.app.goo.gl/euoubBRqSvoWERnD7",
          instagram: "http://www.instagram.com/emporiojardimrio/?hl=pt-br"
        },
        {
          nome: "The Slow Bakery",
          endereco: "R. General Polidoro, 25 - Botafogo, Rio de Janeiro - RJ",
          descricao: "10 minutos a pé",
          maps: "https://maps.app.goo.gl/ws4dffA6P8NPr9k17",
          instagram: "https://www.instagram.com/theslowbakery/"
        }
      ],
      bares: [
        {
          nome: "Brewteco Botafogo",
          endereco: "Praia de Botafogo, 400 Rooftop",
          descricao: "10 minutos de carro",
          maps: "https://maps.google.com/?q=Brewteco+Botafogo",
          instagram: "https://www.instagram.com/brewteco/"
        },
        {
          nome: "Rio Scenarium",
          endereco: "Rua do Lavradio, 20 Lapa",
          descricao: "15 minutos de carro",
          maps: "https://maps.google.com/?q=Rio+Scenarium",
          instagram: "https://www.instagram.com/rioscenarium/"
        }
      ],
      fazer: [
        {
          nome: "Bondinho do Pão de Açúcar",
          endereco: "Av. Pasteur, 520 – Urca",
          descricao: "10 minutos a pé · Necessita ingresso",
          maps: "https://maps.google.com/?q=Bondinho+Pao+de+Acucar",
          instagram: "https://www.instagram.com/parquebondinho/"
        },
        {
          nome: "Cristo Redentor",
          endereco: "Rio de Janeiro - RJ",
          descricao: "20 min de carro até embarque",
          maps: "https://maps.app.goo.gl/EWKaN2UA23HwhF4H8",
          instagram: "https://www.instagram.com/cristoredentoroficial/"
        }
      ],
      proximos: [
        {
          nome: "Pão e Companhia",
          endereco: "Rua Lauro Müller, 116",
          descricao: "Panificadora",
          maps: "https://maps.app.goo.gl/iVgWfZgKAmKHNabs7"
        },
        {
          nome: "Drogaria Pacheco – RioSul",
          endereco: "Rua Lauro Müller, 116",
          descricao: "Farmácia",
          maps: "http://www.googlemaps.com/"
        }
      ],
      restaurantes: [],
      doces: []
    };

    const menuItems = buildMenuItems(t);
    const sections = buildSections(t, { conteudo, listas, idioma });

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
      width: 56px;
      height: 56px;
      border-radius: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
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
    .heading-font { letter-spacing: 0.2px; }
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
      navigator.clipboard.writeText(text).then(() => {
        const toast = document.getElementById("copyToast");
        toast.classList.add("show");
        setTimeout(() => toast.classList.remove("show"), 1800);
      });
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
