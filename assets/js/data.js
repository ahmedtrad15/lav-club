/* LAV CLUB — catalogue et réglages.
 * Tous les prix sont en dinars tunisiens (DT).
 * `from: true` = prix « à partir de » (le « + » sur le tableau en boutique).
 * `unit: "m2"` = prix au mètre carré.
 */
(function (root) {
  var CONFIG = {
    businessName: "LAV CLUB",
    address: "68 Av. Salah Ben Youssef, Tunis",
    phoneDisplay: "28 188 755",
    phoneIntl: "21628188755",
    // Adresse e-mail qui reçoit les commandes. Laisser vide pour masquer le bouton e-mail.
    orderEmail: "",

    deliveryFee: 10, // ramassage + livraison, une seule fois par commande
    firstOrderDiscount: 0.30, // première commande sur le site
    volumeDiscount: 0.10, // remise sur toute la commande…
    volumeMinItems: 4, // …à partir de 4 articles « normaux » (hors mariée, tapis, rideaux)
    expressPerItem: 1, // option express 24 h : 1 DT par article…
    expressFlatFrom: 5, // …ou forfait à partir de 5 articles
    expressFlat: 10,

    standardDelayDays: 2, // livraison standard : 48 h après le ramassage
    expressDelayDays: 1, // livraison express : 24 h après le ramassage
    bookingWindowDays: 21, // jusqu'où le calendrier de livraison permet de choisir
    closedWeekdays: [0], // dimanche : pas de livraison (le ramassage se fait 7j/7)
    slots: ["10h – 12h", "16h – 19h"],

    zones: [
      "El Manar 1",
      "El Manar 2",
      "El Manar 3",
      "El Menzah 5",
      "El Menzah 6",
      "El Menzah 7",
      "El Menzah 8",
      "Jardins d'El Menzah 1",
      "Jardins d'El Menzah 2",
      "Ennasr 1",
      "Ennasr 2"
    ]
  };

  // kind: "normal" (compte pour la remise volume), "bridal", "m2"
  var GROUPS = [
    {
      id: "femme",
      title: "Femme",
      items: [
        { id: "f-veste", name: "Veste", icon: "jacket", price: 7, from: true },
        { id: "f-pantalon", name: "Pantalon", icon: "trousers", price: 5 },
        { id: "f-jupe", name: "Jupe", icon: "skirt", price: 7, from: true },
        { id: "f-chemisier", name: "Chemisier", icon: "blouse", price: 5 },
        { id: "f-chemisier-soie", name: "Chemisier en soie", icon: "blouse", price: 7, silk: true },
        { id: "f-robe", name: "Robe", icon: "dress", price: 10, from: true },
        { id: "f-robe-soiree", name: "Robe de soirée", icon: "gown", price: 25 },
        { id: "f-foulard", name: "Foulard", icon: "scarf", price: 5 },
        { id: "f-chemise-nuit", name: "Chemise de nuit", icon: "nightgown", price: 15 }
      ]
    },
    {
      id: "homme",
      title: "Homme",
      items: [
        { id: "h-veste", name: "Veste", icon: "jacket", price: 7 },
        { id: "h-blouson", name: "Blouson", icon: "bomber", price: 15, from: true },
        { id: "h-pantalon", name: "Pantalon", icon: "trousers", price: 5 },
        { id: "h-costume", name: "Costume", icon: "suit", price: 11 },
        { id: "h-gilet", name: "Gilet", icon: "vest", price: 7 },
        { id: "h-chemise", name: "Chemise", icon: "shirt", price: 5 },
        { id: "h-chemise-soie", name: "Chemise en soie", icon: "shirt", price: 7, silk: true },
        { id: "h-cravate", name: "Cravate", icon: "tie", price: 5 },
        { id: "h-chaussettes", name: "Chaussettes", icon: "socks", price: 3 }
      ]
    },
    {
      id: "enfant",
      title: "Enfant",
      items: [
        { id: "e-chemise", name: "Chemise enfant", icon: "shirt", price: 3.5, small: true },
        { id: "e-pantalon", name: "Pantalon enfant", icon: "trousers", price: 3.7, small: true },
        { id: "e-jupe", name: "Jupe enfant", icon: "skirt", price: 3.7, small: true },
        { id: "e-robe", name: "Robe enfant", icon: "dress", price: 5.8, small: true }
      ]
    },
    {
      id: "divers",
      title: "Au quotidien",
      items: [
        { id: "d-pull", name: "Pull-over", icon: "pullover", price: 7 },
        { id: "d-sweat", name: "Sweatshirt", icon: "hoodie", price: 7 },
        { id: "d-tshirt", name: "T-shirt", icon: "tshirt", price: 5 },
        { id: "d-short", name: "Short", icon: "shorts", price: 5 },
        { id: "d-pyjama", name: "Pyjama", icon: "pyjama", price: 12 },
        { id: "d-peignoir", name: "Peignoir", icon: "bathrobe", price: 10 },
        { id: "d-survetement", name: "Survêtement", icon: "tracksuit", price: 10 },
        { id: "d-drap-bain", name: "Drap de bain", icon: "towel", price: 7 }
      ]
    },
    {
      id: "maison",
      title: "Linge de maison",
      items: [
        { id: "m-couette-synth", name: "Couette synthétique", icon: "duvet", price: 30 },
        { id: "m-couette-plume", name: "Couette plume", icon: "duvetFeather", price: 35 },
        { id: "m-couverture", name: "Couverture", icon: "blanket", price: 15 },
        { id: "m-dessus-lit", name: "Dessus de lit", icon: "bed", price: 10 },
        { id: "m-drap", name: "Drap", icon: "sheet", price: 12 },
        { id: "m-housse", name: "Housse de couette", icon: "duvetCover", price: 20 },
        { id: "m-nappe", name: "Nappe", icon: "tablecloth", price: 15 }
      ]
    },
    {
      id: "cuir",
      title: "Cuir & daim",
      items: [
        { id: "c-veste", name: "Veste en cuir", icon: "leatherJacket", price: 30 },
        { id: "c-pantalon", name: "Pantalon en cuir", icon: "trousers", price: 20, leather: true },
        { id: "c-jupe", name: "Jupe en cuir", icon: "skirt", price: 20, leather: true },
        { id: "c-sac", name: "Sac", icon: "bag", price: 20 },
        { id: "c-divers", name: "Autre article en cuir", icon: "tag", price: 12, from: true }
      ]
    },
    {
      id: "ameublement",
      title: "Tapis & rideaux",
      note: "Prix au m². Indiquez la surface totale.",
      items: [
        { id: "a-tapis", name: "Tapis", icon: "carpet", price: 5, unit: "m2", kind: "m2" },
        { id: "a-rideau-simple", name: "Rideau simple", icon: "curtain", price: 5, unit: "m2", kind: "m2" },
        { id: "a-rideau-double", name: "Rideau double", icon: "curtainDouble", price: 5, unit: "m2", kind: "m2" }
      ]
    }
  ];

  var BRIDAL = {
    id: "mariee",
    name: "Robe de mariée",
    icon: "wedding",
    price: 60,
    kind: "bridal"
  };

  var CATALOG = {};
  GROUPS.forEach(function (g) {
    g.items.forEach(function (it) {
      it.kind = it.kind || "normal";
      it.group = g.id;
      CATALOG[it.id] = it;
    });
  });
  BRIDAL.group = "mariee";
  CATALOG[BRIDAL.id] = BRIDAL;

  var data = { CONFIG: CONFIG, GROUPS: GROUPS, BRIDAL: BRIDAL, CATALOG: CATALOG };
  if (typeof module !== "undefined" && module.exports) module.exports = data;
  else {
    root.LAV = root.LAV || {};
    Object.assign(root.LAV, data);
  }
})(typeof window !== "undefined" ? window : globalThis);
