/* LAV CLUB — interface de la boutique */
(function () {
  "use strict";

  var L = window.LAV;
  var CONFIG = L.CONFIG;
  var CATALOG = L.CATALOG;
  var P = L.pricing;
  var icon = L.iconSvg;

  var CART_KEY = "lavclub.cart";
  var ORDERED_KEY = "lavclub.ordered";
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $all(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function store(key, value) {
    try {
      if (value === undefined) return JSON.parse(localStorage.getItem(key));
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) { return null; }
  }
  function waLink(text) {
    return "https://wa.me/" + CONFIG.phoneIntl + (text ? "?text=" + encodeURIComponent(text) : "");
  }

  /* ---------- État ---------- */
  var cart = store(CART_KEY) || {};
  Object.keys(cart).forEach(function (id) { if (!CATALOG[id] || !(cart[id] > 0)) delete cart[id]; });
  var hasOrdered = !!store(ORDERED_KEY);

  function cartLines() {
    return Object.keys(cart).map(function (id) { return { id: id, qty: cart[id] }; });
  }
  function totals(express) {
    return P.computeTotals(cartLines(), CATALOG, CONFIG, { firstOrder: !hasOrdered, express: !!express });
  }
  function saveCart() { store(CART_KEY, cart); }

  function displayName(item) {
    if (item.group === "femme" || item.group === "homme") {
      var dup = Object.keys(CATALOG).some(function (k) {
        var o = CATALOG[k];
        return o !== item && o.name === item.name;
      });
      if (dup) return item.name + (item.group === "femme" ? " femme" : " homme");
    }
    return item.name;
  }
  function qtyLabel(item, qty) {
    return item.unit === "m2" ? String(qty).replace(".", ",") + " m²" : String(qty);
  }
  function priceLabel(item) {
    var p = P.formatDT(item.price);
    if (item.unit === "m2") return p + " <small>/ m²</small>";
    if (item.from) return "<small>dès</small> " + p;
    return p;
  }
  function iconFor(item) {
    var cls = item.small ? "is-small" : item.silk ? "is-silk" : "";
    return icon(item.icon, cls);
  }
  function stepOf(item) { return item.unit === "m2" ? 0.5 : 1; }
  function minOf(item) { return item.unit === "m2" ? 1 : 1; }

  /* ---------- Machine du hero ---------- */
  (function buildDrum() {
    var drum = $("#drum");
    if (!drum) return;
    var pieces = [
      { name: "shirt", fill: "#FFFFFF", angle: 0 },
      { name: "trousers", fill: "#7FD3E8", angle: 90 },
      { name: "dress", fill: "#9BE3C1", angle: 180 },
      { name: "socks", fill: "#9DBDF2", angle: 270 }
    ];
    var html = "";
    pieces.forEach(function (p) {
      var rad = (p.angle * Math.PI) / 180;
      var x = 200 + Math.cos(rad) * 50 - 33.6;
      var y = 285 + Math.sin(rad) * 50 - 33.6;
      html += '<g class="garment" transform="translate(' + x.toFixed(1) + " " + y.toFixed(1) + ") rotate(" + p.angle + ' 33.6 33.6) scale(1.4)" fill="' + p.fill + '">';
      L.ICONS[p.name].forEach(function (d, i) {
        html += '<path d="' + d + '"' + (i > 0 ? ' fill="none"' : "") + "/>";
      });
      html += "</g>";
    });
    drum.innerHTML = html;
  })();

  var machine = $(".machine");
  var boostTimer;
  function boostMachine() {
    if (!machine || reduceMotion) return;
    machine.classList.add("is-boost");
    clearTimeout(boostTimer);
    boostTimer = setTimeout(function () { machine.classList.remove("is-boost"); }, 1400);
  }

  /* ---------- Liens WhatsApp statiques ---------- */
  $("#bridalWa").href = waLink("Bonjour LAV CLUB, je gère une boutique de robes de mariée et je souhaite un tarif pour plusieurs robes.");
  $("#zonesWa").href = waLink("Bonjour LAV CLUB, mon quartier n'est pas dans la liste. Pouvez-vous passer chez moi ?");
  $("#zoneWarnWa").href = $("#zonesWa").href;
  $("#footerWa").href = waLink("");

  /* ---------- Zones ---------- */
  $("#zoneList").innerHTML = CONFIG.zones.map(function (z) { return "<li>" + esc(z) + "</li>"; }).join("");
  $("#fZone").innerHTML =
    '<option value="">Choisissez votre quartier</option>' +
    CONFIG.zones.map(function (z) { return '<option value="' + esc(z) + '">' + esc(z) + "</option>"; }).join("") +
    '<option value="__other">Autre quartier</option>';

  /* ---------- Catalogue ---------- */
  function stepperHtml(id, value, label) {
    return (
      '<div class="stepper" data-stepper="' + id + '">' +
      '<button type="button" data-delta="-1" aria-label="Retirer un ' + esc(label) + '">−</button>' +
      '<output aria-live="polite">' + value + "</output>" +
      '<button type="button" data-delta="1" aria-label="Ajouter un ' + esc(label) + '">+</button>' +
      "</div>"
    );
  }

  function itemCard(item) {
    var name = displayName(item);
    return (
      '<div class="item" data-id="' + item.id + '" data-group="' + item.group + '" data-search="' + esc(normalize(name + " " + item.group)) + '">' +
      '<span class="item-badge" hidden></span>' +
      '<span class="item-ico">' + iconFor(item) + "</span>" +
      '<span class="item-name">' + esc(name) + "</span>" +
      '<span class="item-price">' + priceLabel(item) + "</span>" +
      '<button type="button" class="item-trigger" aria-label="Choisir ' + esc(name) + '"></button>' +
      '<div class="item-controls">' +
      stepperHtml(item.id, qtyLabel(item, minOf(item)), item.unit === "m2" ? "demi-mètre carré" : name) +
      '<button type="button" class="btn btn-primary" data-add="' + item.id + '">Ajouter au panier</button>' +
      "</div></div>"
    );
  }

  var catalogEl = $("#catalog");
  catalogEl.innerHTML = L.GROUPS.map(function (g) {
    return (
      '<div class="catalog-group" data-group="' + g.id + '">' +
      "<h3>" + esc(g.title) + (g.note ? " <small>" + esc(g.note) + "</small>" : "") + "</h3>" +
      '<div class="grid">' + g.items.map(itemCard).join("") + "</div></div>"
    );
  }).join("");

  // Robe de mariée, mise en avant
  $("#bridalIcon").innerHTML = icon("wedding");
  $("#bridalBuy").innerHTML =
    '<div class="bridal-buy-row" data-id="mariee">' +
    stepperHtml("mariee", 1, "robe de mariée") +
    '<button type="button" class="btn btn-primary btn-lg" data-add="mariee">Ajouter au panier</button>' +
    "</div>";

  var pending = {}; // quantité choisie avant l'ajout, par article
  function pendingQty(id) { return pending[id] || minOf(CATALOG[id]); }

  function closeCards(except) {
    $all(".item.is-open").forEach(function (el) {
      if (el !== except) el.classList.remove("is-open");
    });
  }

  document.addEventListener("click", function (e) {
    var trigger = e.target.closest(".item-trigger");
    if (trigger) {
      var card = trigger.closest(".item");
      closeCards(card);
      card.classList.add("is-open");
      var plus = card.querySelector('[data-delta="1"]');
      if (plus) plus.focus({ preventScroll: true });
      return;
    }

    var deltaBtn = e.target.closest("[data-delta]");
    if (deltaBtn) {
      var stepper = deltaBtn.closest("[data-stepper]");
      var id = stepper.getAttribute("data-stepper");
      var item = CATALOG[id];
      var d = Number(deltaBtn.getAttribute("data-delta")) * stepOf(item);
      if (stepper.closest(".cart-line")) {
        setCartQty(id, Math.round((cart[id] + d) * 10) / 10);
      } else {
        var next = Math.max(minOf(item), Math.min(99, Math.round((pendingQty(id) + d) * 10) / 10));
        pending[id] = next;
        stepper.querySelector("output").textContent = qtyLabel(item, next);
      }
      return;
    }

    var addBtn = e.target.closest("[data-add]");
    if (addBtn) {
      var addId = addBtn.getAttribute("data-add");
      addToCart(addId, pendingQty(addId), addBtn.closest(".item, .bridal-buy-row"));
      return;
    }

    var removeBtn = e.target.closest("[data-remove]");
    if (removeBtn) {
      setCartQty(removeBtn.getAttribute("data-remove"), 0);
      return;
    }

    if (!e.target.closest(".item")) closeCards(null);
  });

  // Recherche
  function normalize(s) {
    return s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  }
  $("#search").addEventListener("input", function (e) {
    var q = normalize(e.target.value.trim());
    var any = false;
    $all(".catalog-group").forEach(function (g) {
      var visible = 0;
      $all(".item", g).forEach(function (el) {
        var show = !q || el.getAttribute("data-search").indexOf(q) !== -1;
        el.hidden = !show;
        if (show) visible++;
      });
      g.hidden = visible === 0;
      if (visible) any = true;
    });
    $("#noResult").hidden = any;
  });

  /* ---------- Panier ---------- */
  var fab = $("#cartFab");

  function addToCart(id, qty, sourceEl) {
    var item = CATALOG[id];
    cart[id] = Math.round(((cart[id] || 0) + qty) * 10) / 10;
    saveCart();
    pending[id] = minOf(item);
    if (sourceEl) {
      var out = sourceEl.querySelector("output");
      if (out) out.textContent = qtyLabel(item, pending[id]);
      if (sourceEl.classList.contains("item")) sourceEl.classList.remove("is-open");
    }
    flyToCart(item, sourceEl);
    renderCart();
    boostMachine();
    toast(item.unit === "m2" ? displayName(item) + ", " + qtyLabel(item, qty) + " ajouté" : qty + " × " + displayName(item) + " ajouté" + (qty > 1 ? "s" : ""));
  }

  function setCartQty(id, qty) {
    if (qty <= 0 || (CATALOG[id].unit === "m2" && qty < minOf(CATALOG[id]))) delete cart[id];
    else cart[id] = qty;
    saveCart();
    renderCart();
  }

  function flyToCart(item, sourceEl) {
    if (reduceMotion || !sourceEl || !fab.animate) return bumpFab();
    var from = (sourceEl.querySelector(".item-ico") || sourceEl).getBoundingClientRect();
    fab.hidden = false;
    var to = fab.querySelector(".cart-fab-drum").getBoundingClientRect();
    var fly = document.createElement("div");
    fly.className = "flyer";
    fly.innerHTML = iconFor(item);
    document.body.appendChild(fly);
    var x0 = from.left + from.width / 2 - 24, y0 = from.top + from.height / 2 - 24;
    var x1 = to.left + to.width / 2 - 24, y1 = to.top + to.height / 2 - 24;
    var anim = fly.animate(
      [
        { transform: "translate(" + x0 + "px," + y0 + "px) scale(1)", opacity: 1 },
        { transform: "translate(" + (x0 + x1) / 2 + "px," + (Math.min(y0, y1) - 120) + "px) scale(1.15) rotate(-20deg)", opacity: 1, offset: 0.5 },
        { transform: "translate(" + x1 + "px," + y1 + "px) scale(.35) rotate(40deg)", opacity: 0.2 }
      ],
      { duration: 700, easing: "cubic-bezier(.5,0,.6,1)" }
    );
    anim.onfinish = function () { fly.remove(); bumpFab(); };
  }

  function bumpFab() {
    fab.classList.remove("is-bump");
    void fab.offsetWidth;
    fab.classList.add("is-bump");
  }

  function totalsHtml(t, opts) {
    opts = opts || {};
    var rows = [["Articles", P.formatDT(t.subtotal)]];
    if (t.discount > 0) rows.push([t.discountLabel, "-" + P.formatDT(t.discount), "is-discount"]);
    if (opts.showExpress && t.expressFee > 0) rows.push(["Express 24 h", P.formatDT(t.expressFee)]);
    rows.push(["Ramassage et livraison", P.formatDT(t.deliveryFee)]);
    var html = rows.map(function (r) {
      return '<dt class="' + (r[2] || "") + '">' + esc(r[0]) + '</dt><dd class="' + (r[2] || "") + '">' + r[1] + "</dd>";
    }).join("");
    html += '<dt class="is-total">Total à la livraison</dt><dd class="is-total">' + P.formatDT(t.total) + "</dd>";
    if (t.hasFromPrice) html += '<dd class="is-note">Certains prix sont « dès » : le montant final est confirmé au ramassage.</dd>';
    return html;
  }

  function renderCart() {
    var lines = cartLines();
    var t = totals(false);
    var count = lines.reduce(function (n, l) { return n + (CATALOG[l.id].unit === "m2" ? 1 : l.qty); }, 0);

    fab.hidden = lines.length === 0;
    $("#cartCount").textContent = count;
    $("#cartFabTotal").textContent = P.formatDT(t.total);
    fab.setAttribute("aria-label", "Voir le panier, " + count + " article" + (count > 1 ? "s" : "") + ", " + P.formatDT(t.total));

    $("#cartLines").innerHTML = lines.map(function (l) {
      var item = CATALOG[l.id];
      var unit = item.unit === "m2" ? P.formatDT(item.price) + " / m²" : (item.from ? "dès " : "") + P.formatDT(item.price) + " / pièce";
      return (
        '<li class="cart-line">' +
        '<span class="cart-line-ico">' + iconFor(item) + "</span>" +
        '<span><span class="cart-line-name">' + esc(displayName(item)) + '</span><br><span class="cart-line-unit">' + unit + "</span></span>" +
        '<span class="cart-line-right"><span class="cart-line-total">' + P.formatDT(item.price * l.qty) + "</span>" +
        stepperHtml(l.id, qtyLabel(item, l.qty), displayName(item)) + "</span></li>"
      );
    }).join("");
    $("#cartEmpty").hidden = lines.length > 0;
    $("#cartTotals").innerHTML = lines.length ? totalsHtml(t) : "";
    $("#toCheckout").disabled = lines.length === 0;

    var nudge = $("#nudge");
    if (lines.length && !hasOrdered) {
      nudge.textContent = "Bienvenue ! -30 % sur votre première commande en ligne, déjà déduit du total.";
      nudge.hidden = false;
    } else if (lines.length && t.itemsToVolumeDiscount > 0 && t.itemsToVolumeDiscount <= 2) {
      var n = t.itemsToVolumeDiscount;
      nudge.textContent = "Encore " + n + " article" + (n > 1 ? "s" : "") + " et vous profitez de -10 % sur toute la commande.";
      nudge.hidden = false;
    } else nudge.hidden = true;

    // Pastilles sur les cartes
    $all(".item").forEach(function (el) {
      var id = el.getAttribute("data-id");
      var badge = el.querySelector(".item-badge");
      if (cart[id]) {
        badge.textContent = CATALOG[id].unit === "m2" ? qtyLabel(CATALOG[id], cart[id]) : cart[id];
        badge.hidden = false;
      } else badge.hidden = true;
    });

    if (!$("#checkout").hidden) renderModalTotal();
  }

  /* ---------- Fenêtres (tiroir, modale) ---------- */
  var overlay = $("#overlay");
  var drawer = $("#cartDrawer");
  var modal = $("#checkout");
  var lastFocus = null;

  function openDrawer() {
    lastFocus = document.activeElement;
    overlay.hidden = false;
    drawer.hidden = false;
    document.body.classList.add("is-locked");
    drawer.querySelector("[data-close]").focus();
  }
  function closeDrawer() {
    drawer.hidden = true;
    overlay.hidden = true;
    document.body.classList.remove("is-locked");
    if (lastFocus) lastFocus.focus();
  }
  fab.addEventListener("click", openDrawer);
  overlay.addEventListener("click", closeDrawer);
  drawer.querySelector("[data-close]").addEventListener("click", closeDrawer);

  document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape") return;
    if (!modal.hidden) closeModal();
    else if (!drawer.hidden) closeDrawer();
    else closeCards(null);
  });

  /* ---------- Commande ---------- */
  var step = 1;
  var orderNow = new Date();
  var order = { pickupSlot: null, deliverySlot: null, deliveryDate: null, express: false };
  var calMonth = null;

  $("#toCheckout").addEventListener("click", function () {
    drawer.hidden = true;
    overlay.hidden = true;
    openModal();
  });

  function openModal() {
    orderNow = new Date();
    order.deliveryDate = P.earliestDelivery(orderNow, order.express, CONFIG);
    calMonth = new Date(order.deliveryDate.getFullYear(), order.deliveryDate.getMonth(), 1);
    modal.hidden = false;
    document.body.classList.add("is-locked");
    goTo(1);
    setTimeout(function () { $("#fName").focus(); }, 50);
  }
  function closeModal() {
    modal.hidden = true;
    document.body.classList.remove("is-locked");
    if (step === 4) goTo(1);
    if (lastFocus && document.body.contains(lastFocus)) lastFocus.focus();
  }
  $all("[data-close]", modal).forEach(function (b) { b.addEventListener("click", closeModal); });
  modal.addEventListener("click", function (e) { if (e.target === modal) closeModal(); });

  function goTo(n) {
    step = n;
    $all(".pane", modal).forEach(function (p) { p.hidden = Number(p.getAttribute("data-pane")) !== n; });
    $all(".progress li", modal).forEach(function (li) {
      var s = Number(li.getAttribute("data-step"));
      li.classList.toggle("is-current", s === n);
      li.classList.toggle("is-done", s < n);
    });
    $(".progress", modal).hidden = n === 4;
    $("#modalFoot").hidden = n === 4;
    $("#prevStep").style.visibility = n === 1 ? "hidden" : "visible";
    $("#nextStep").hidden = n === 3;
    $("#sendWa").hidden = n !== 3;
    $("#modalFoot").classList.toggle("is-final", n === 3);
    $("#formError").hidden = true;
    if (n === 2) renderSlots();
    if (n === 3) renderRecap();
    renderModalTotal();
    $(".modal-body", modal).scrollTop = 0;
  }

  function renderModalTotal() {
    $("#modalTotal").textContent = P.formatDT(totals(order.express).total);
  }

  function showError(msg, field) {
    var el = $("#formError");
    el.textContent = msg;
    el.hidden = false;
    if (field) { field.classList.add("is-invalid"); field.focus(); }
  }
  $all(".field input, .field select, .field textarea", modal).forEach(function (f) {
    f.addEventListener("input", function () { f.classList.remove("is-invalid"); $("#formError").hidden = true; });
  });

  $("#fZone").addEventListener("change", function (e) {
    $("#zoneWarning").hidden = e.target.value !== "__other";
  });

  function validate(n) {
    if (n === 1) {
      var name = $("#fName"), phone = $("#fPhone"), zone = $("#fZone"), addr = $("#fAddress");
      if (name.value.trim().length < 2) return showError("Indiquez votre nom.", name), false;
      if (phone.value.replace(/\D/g, "").length < 8) return showError("Indiquez un numéro de téléphone à 8 chiffres.", phone), false;
      if (!zone.value) return showError("Choisissez votre quartier.", zone), false;
      if (zone.value === "__other") return showError("Ce quartier n'est pas encore desservi via le site. Appelez-nous au " + CONFIG.phoneDisplay + ".", zone), false;
      if (addr.value.trim().length < 5) return showError("Indiquez votre adresse complète.", addr), false;
    }
    if (n === 2) {
      if (!order.pickupSlot) return showError("Choisissez un créneau de ramassage."), false;
      if (!order.deliveryDate) return showError("Choisissez une date de livraison."), false;
      if (!order.deliverySlot) return showError("Choisissez un créneau de livraison."), false;
    }
    return true;
  }

  $("#checkoutForm").addEventListener("submit", function (e) {
    e.preventDefault();
    if (validate(step)) goTo(step + 1);
  });
  $("#prevStep").addEventListener("click", function () { if (step > 1) goTo(step - 1); });

  function chipsHtml(name, selected) {
    return CONFIG.slots.map(function (s) {
      return '<button type="button" class="chip" role="radio" data-slot="' + name + '" data-value="' + esc(s) + '" aria-checked="' + (s === selected) + '">' + esc(s) + "</button>";
    }).join("");
  }

  function renderSlots() {
    var pickup = P.pickupDate(orderNow);
    $("#pickupDateText").innerHTML = "Demain, <strong>" + P.formatDate(pickup) + "</strong>";
    $("#pickupSlots").innerHTML = chipsHtml("pickup", order.pickupSlot);
    $("#deliverySlots").innerHTML = chipsHtml("delivery", order.deliverySlot);
    var t = totals(true);
    $("#expressPrice").textContent = "+" + P.formatDT(t.expressFee) + (t.pieces >= CONFIG.expressFlatFrom ? " (forfait)" : "");
    renderCalendar();
  }

  modal.addEventListener("click", function (e) {
    var chip = e.target.closest("[data-slot]");
    if (chip) {
      var which = chip.getAttribute("data-slot");
      order[which === "pickup" ? "pickupSlot" : "deliverySlot"] = chip.getAttribute("data-value");
      $all('[data-slot="' + which + '"]', modal).forEach(function (c) { c.setAttribute("aria-checked", c === chip); });
      $("#formError").hidden = true;
      return;
    }
    var day = e.target.closest("[data-day]");
    if (day && !day.disabled) {
      var parts = day.getAttribute("data-day").split("-").map(Number);
      order.deliveryDate = new Date(parts[0], parts[1], parts[2]);
      renderCalendar();
      return;
    }
    var nav = e.target.closest("[data-cal]");
    if (nav && !nav.disabled) {
      calMonth = new Date(calMonth.getFullYear(), calMonth.getMonth() + Number(nav.getAttribute("data-cal")), 1);
      renderCalendar();
    }
  });

  $all('input[name="speed"]', modal).forEach(function (r) {
    r.addEventListener("change", function () {
      order.express = r.value === "express" && r.checked;
      if (!order.deliveryDate || !P.isSelectableDelivery(order.deliveryDate, orderNow, order.express, CONFIG)) {
        order.deliveryDate = P.earliestDelivery(orderNow, order.express, CONFIG);
        calMonth = new Date(order.deliveryDate.getFullYear(), order.deliveryDate.getMonth(), 1);
      }
      renderCalendar();
      renderModalTotal();
    });
  });

  function renderCalendar() {
    var y = calMonth.getFullYear(), m = calMonth.getMonth();
    var first = P.earliestDelivery(orderNow, order.express, CONFIG);
    var last = P.addDays(orderNow, CONFIG.bookingWindowDays);
    var pickup = P.pickupDate(orderNow);
    var canPrev = new Date(y, m, 1) > new Date(first.getFullYear(), first.getMonth(), 1);
    var canNext = new Date(y, m + 1, 1) <= last;

    var html =
      '<div class="cal-head">' +
      '<button type="button" class="cal-nav" data-cal="-1" aria-label="Mois précédent"' + (canPrev ? "" : " disabled") + ">‹</button>" +
      '<span class="cal-title">' + P.MONTHS[m] + " " + y + "</span>" +
      '<button type="button" class="cal-nav" data-cal="1" aria-label="Mois suivant"' + (canNext ? "" : " disabled") + ">›</button>" +
      '</div><div class="cal-grid">';
    ["lu", "ma", "me", "je", "ve", "sa", "di"].forEach(function (d) { html += '<span class="cal-dow" aria-hidden="true">' + d + "</span>"; });

    var offset = (new Date(y, m, 1).getDay() + 6) % 7;
    for (var i = 0; i < offset; i++) html += "<span></span>";
    var daysInMonth = new Date(y, m + 1, 0).getDate();
    for (var d = 1; d <= daysInMonth; d++) {
      var date = new Date(y, m, d);
      var ok = P.isSelectableDelivery(date, orderNow, order.express, CONFIG);
      var cls = "cal-day";
      if (P.sameDay(date, pickup)) cls += " is-pickup";
      if (order.deliveryDate && P.sameDay(date, order.deliveryDate)) cls += " is-selected";
      var label = P.formatDate(date) + (P.sameDay(date, pickup) ? ", jour du ramassage" : "") + (!P.isDeliveryDay(date, CONFIG) ? ", pas de livraison le dimanche" : "");
      html += '<button type="button" class="' + cls + '" data-day="' + y + "-" + m + "-" + d + '" aria-label="' + esc(label) + '"' +
        (order.deliveryDate && P.sameDay(date, order.deliveryDate) ? ' aria-pressed="true"' : "") + (ok ? "" : " disabled") + ">" + d + "</button>";
    }
    html += "</div>";
    html += '<div class="cal-legend"><span class="lg-pickup">Ramassage</span><span class="lg-closed">Pas de livraison le dimanche</span></div>';
    $("#calendar").innerHTML = html;
  }

  /* ---------- Récapitulatif et envoi ---------- */
  function orderData() {
    return {
      name: $("#fName").value.trim(),
      phone: $("#fPhone").value.trim(),
      zone: $("#fZone").value,
      address: $("#fAddress").value.trim(),
      notes: $("#fNotes").value.trim(),
      pickup: P.formatDate(P.pickupDate(orderNow)) + ", " + order.pickupSlot,
      delivery: P.formatDate(order.deliveryDate) + ", " + order.deliverySlot,
      speed: order.express ? "Express 24 h" : "Standard 48 h",
      t: totals(order.express)
    };
  }

  function lineText(l) {
    var item = CATALOG[l.id];
    var qty = item.unit === "m2" ? qtyLabel(item, l.qty) : l.qty + " ×";
    return item.unit === "m2" ? displayName(item) + " " + qty : qty + " " + displayName(item);
  }

  function orderMessage(o) {
    var t = o.t;
    var lines = [
      "Nouvelle commande LAV CLUB",
      "",
      "Nom : " + o.name,
      "Téléphone : " + o.phone,
      "Quartier : " + o.zone,
      "Adresse : " + o.address,
      "",
      "Articles :"
    ];
    cartLines().forEach(function (l) {
      lines.push("- " + lineText(l) + " : " + P.formatDT(CATALOG[l.id].price * l.qty) + (CATALOG[l.id].from ? " (prix dès)" : ""));
    });
    lines.push("", "Sous-total : " + P.formatDT(t.subtotal));
    if (t.discount > 0) lines.push("Remise (" + t.discountLabel + ") : -" + P.formatDT(t.discount));
    if (t.expressFee > 0) lines.push("Express 24 h : " + P.formatDT(t.expressFee));
    lines.push("Ramassage et livraison : " + P.formatDT(t.deliveryFee));
    lines.push("TOTAL à payer à la livraison : " + P.formatDT(t.total) + (t.hasFromPrice ? " (estimation)" : ""));
    lines.push("", "Ramassage : " + o.pickup, "Livraison (" + o.speed + ") : " + o.delivery);
    if (o.notes) lines.push("", "Remarques : " + o.notes);
    return lines.join("\n");
  }

  function renderRecap() {
    var o = orderData();
    var items = cartLines().map(function (l) {
      return "<li><span>" + esc(lineText(l)) + "</span><strong>" + P.formatDT(CATALOG[l.id].price * l.qty) + "</strong></li>";
    }).join("");
    $("#recap").innerHTML =
      '<div class="recap-block"><h3>Vos articles</h3><ul class="recap-items">' + items + '</ul><dl class="totals" style="margin-top:12px">' + totalsHtml(o.t, { showExpress: true }) + "</dl></div>" +
      '<div class="recap-block"><h3>Ramassage</h3><p><strong>' + esc(o.pickup) + "</strong></p><p>" + esc(o.address) + ", " + esc(o.zone) + "</p></div>" +
      '<div class="recap-block"><h3>Livraison</h3><p><strong>' + esc(o.delivery) + "</strong></p><p>" + esc(o.speed) + ", paiement en espèces à la livraison</p></div>";

    var msg = orderMessage(o);
    $("#sendWa").href = waLink(msg);
    var mail = $("#sendMail");
    if (CONFIG.orderEmail) {
      mail.hidden = false;
      mail.href = "mailto:" + CONFIG.orderEmail + "?subject=" + encodeURIComponent("Commande LAV CLUB, " + o.name) + "&body=" + encodeURIComponent(msg);
    } else mail.hidden = true;
  }

  function orderSent() {
    var first = P.formatDate(P.pickupDate(orderNow));
    hasOrdered = true;
    store(ORDERED_KEY, new Date().toISOString());
    cart = {};
    saveCart();
    renderCart();
    $("#doneText").textContent = "Merci ! On passe chez vous " + first + ", " + order.pickupSlot + ". On vous appelle avant pour confirmer.";
    goTo(4);
  }
  $("#sendWa").addEventListener("click", function () { setTimeout(orderSent, 300); });
  $("#sendMail").addEventListener("click", function () { setTimeout(orderSent, 300); });

  /* ---------- Toast ---------- */
  var toastTimer;
  function toast(msg) {
    var el = $("#toast");
    el.textContent = msg;
    el.classList.add("is-on");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { el.classList.remove("is-on"); }, 1800);
  }

  renderCart();
})();
