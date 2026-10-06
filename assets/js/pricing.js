/* LAV CLUB — calcul du panier et des dates. Fonctions pures, testées par tests/pricing.test.js. */
(function (root) {
  function round3(n) {
    return Math.round(n * 1000) / 1000;
  }

  /**
   * lines: [{ id, qty }] — qty = nombre de pièces, ou surface en m² pour les articles au m².
   * opts: { firstOrder: bool, express: bool }
   */
  function computeTotals(lines, catalog, config, opts) {
    opts = opts || {};
    var subtotal = 0;
    var normalCount = 0;
    var pieces = 0;
    var hasFromPrice = false;

    lines.forEach(function (line) {
      var item = catalog[line.id];
      if (!item || !(line.qty > 0)) return;
      subtotal += item.price * line.qty;
      if (item.kind === "normal") normalCount += line.qty;
      // Un tapis ou un rideau compte pour une pièce, quelle que soit sa surface.
      pieces += item.kind === "m2" ? 1 : line.qty;
      if (item.from) hasFromPrice = true;
    });
    subtotal = round3(subtotal);

    // Les remises ne se cumulent pas : on applique la plus avantageuse.
    var discountRate = 0;
    var discountLabel = "";
    if (opts.firstOrder && config.firstOrderDiscount > 0) {
      discountRate = config.firstOrderDiscount;
      discountLabel = "Première commande -" + Math.round(discountRate * 100) + " %";
    } else if (normalCount >= config.volumeMinItems && config.volumeDiscount > 0) {
      discountRate = config.volumeDiscount;
      discountLabel = "Dès " + config.volumeMinItems + " articles -" + Math.round(discountRate * 100) + " %";
    }
    var discount = round3(subtotal * discountRate);

    var expressFee = 0;
    if (opts.express && pieces > 0) {
      expressFee = pieces >= config.expressFlatFrom ? config.expressFlat : pieces * config.expressPerItem;
    }

    var deliveryFee = pieces > 0 ? config.deliveryFee : 0;
    var total = round3(subtotal - discount + expressFee + deliveryFee);

    return {
      subtotal: subtotal,
      normalCount: normalCount,
      pieces: pieces,
      discountRate: discountRate,
      discountLabel: discountLabel,
      discount: discount,
      expressFee: expressFee,
      deliveryFee: deliveryFee,
      total: total,
      hasFromPrice: hasFromPrice,
      itemsToVolumeDiscount: Math.max(0, config.volumeMinItems - normalCount)
    };
  }

  function startOfDay(d) {
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  }

  function addDays(d, n) {
    var r = startOfDay(d);
    r.setDate(r.getDate() + n);
    return r;
  }

  function sameDay(a, b) {
    return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
  }

  // Le ramassage a toujours lieu le lendemain de la commande, 7j/7.
  function pickupDate(now) {
    return addDays(now, 1);
  }

  function isDeliveryDay(d, config) {
    return config.closedWeekdays.indexOf(d.getDay()) === -1;
  }

  function earliestDelivery(now, express, config) {
    var d = addDays(pickupDate(now), express ? config.expressDelayDays : config.standardDelayDays);
    while (!isDeliveryDay(d, config)) d = addDays(d, 1);
    return d;
  }

  function isSelectableDelivery(d, now, express, config) {
    var first = earliestDelivery(now, express, config);
    var last = addDays(now, config.bookingWindowDays);
    var day = startOfDay(d);
    return day >= first && day <= last && isDeliveryDay(day, config);
  }

  var DAYS = ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"];
  var MONTHS = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];

  function formatDate(d) {
    return DAYS[d.getDay()] + " " + d.getDate() + " " + MONTHS[d.getMonth()];
  }

  function formatDT(n) {
    var s = (Math.round(n * 1000) / 1000).toFixed(3).replace(/\.?0+$/, "");
    return s.replace(".", ",") + " DT";
  }

  var api = {
    computeTotals: computeTotals,
    pickupDate: pickupDate,
    earliestDelivery: earliestDelivery,
    isSelectableDelivery: isSelectableDelivery,
    isDeliveryDay: isDeliveryDay,
    addDays: addDays,
    sameDay: sameDay,
    startOfDay: startOfDay,
    formatDate: formatDate,
    formatDT: formatDT,
    MONTHS: MONTHS
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else {
    root.LAV = root.LAV || {};
    root.LAV.pricing = api;
  }
})(typeof window !== "undefined" ? window : globalThis);
