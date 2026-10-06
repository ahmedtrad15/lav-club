// Lancer avec : node --test tests/*.test.js
const test = require("node:test");
const assert = require("node:assert/strict");
const { CONFIG, CATALOG } = require("../assets/js/data.js");
const P = require("../assets/js/pricing.js");

const totals = (lines, opts) => P.computeTotals(lines, CATALOG, CONFIG, opts);

test("empty cart costs nothing", () => {
  const t = totals([]);
  assert.equal(t.total, 0);
  assert.equal(t.deliveryFee, 0);
});

test("delivery fee is charged once", () => {
  const t = totals([{ id: "h-chemise", qty: 2 }]);
  assert.equal(t.subtotal, 10);
  assert.equal(t.deliveryFee, 10);
  assert.equal(t.total, 20);
});

test("10% volume discount from 4 normal items", () => {
  assert.equal(totals([{ id: "h-chemise", qty: 3 }]).discount, 0);
  const t = totals([{ id: "h-chemise", qty: 4 }]);
  assert.equal(t.discountRate, 0.1);
  assert.equal(t.discount, 2);
  assert.equal(t.total, 28);
});

test("bridal dresses and m2 items don't count toward the volume discount", () => {
  const t = totals([
    { id: "h-chemise", qty: 3 },
    { id: "mariee", qty: 2 },
    { id: "a-tapis", qty: 6 }
  ]);
  assert.equal(t.normalCount, 3);
  assert.equal(t.discount, 0);
  assert.equal(t.subtotal, 15 + 120 + 30);
});

test("volume discount applies to the whole order", () => {
  const t = totals([
    { id: "h-chemise", qty: 4 },
    { id: "mariee", qty: 1 }
  ]);
  assert.equal(t.discount, 8); // 10% of 80
});

test("first-order discount wins over volume discount, no stacking", () => {
  const t = totals([{ id: "h-chemise", qty: 4 }], { firstOrder: true });
  assert.equal(t.discountRate, 0.3);
  assert.equal(t.discount, 6);
});

test("discounts never apply to fees", () => {
  const t = totals([{ id: "h-chemise", qty: 1 }], { firstOrder: true, express: true });
  assert.equal(t.total, 5 - 1.5 + 1 + 10);
});

test("express: 1 DT per piece, flat 10 DT from 5 pieces", () => {
  assert.equal(totals([{ id: "h-chemise", qty: 4 }], { express: true }).expressFee, 4);
  assert.equal(totals([{ id: "h-chemise", qty: 5 }], { express: true }).expressFee, 10);
  assert.equal(totals([{ id: "h-chemise", qty: 12 }], { express: true }).expressFee, 10);
});

test("a carpet counts as one piece for express whatever its surface", () => {
  const t = totals([{ id: "a-tapis", qty: 8 }], { express: true });
  assert.equal(t.pieces, 1);
  assert.equal(t.expressFee, 1);
});

test("child prices keep their millimes", () => {
  const t = totals([{ id: "e-chemise", qty: 1 }, { id: "e-robe", qty: 1 }]);
  assert.equal(t.subtotal, 9.3);
  assert.equal(P.formatDT(t.subtotal), "9,3 DT");
});

test("pickup is the next day, even on Saturday night", () => {
  const sat = new Date(2026, 9, 10, 23, 0); // samedi 10 oct. 2026
  assert.equal(P.pickupDate(sat).getDay(), 0); // dimanche : ramassage 7j/7
});

test("standard delivery is 48h after pickup, skipping Sundays", () => {
  const thu = new Date(2026, 9, 8, 9, 0); // jeudi → ramassage vendredi → dimanche → lundi
  const d = P.earliestDelivery(thu, false, CONFIG);
  assert.equal(d.getDay(), 1);
  assert.equal(d.getDate(), 12);
});

test("express delivery is 24h after pickup", () => {
  const mon = new Date(2026, 9, 5, 9, 0); // lundi → ramassage mardi → mercredi
  assert.equal(P.earliestDelivery(mon, true, CONFIG).getDate(), 7);
  assert.equal(P.earliestDelivery(mon, false, CONFIG).getDate(), 8);
});

test("Sundays are never selectable for delivery", () => {
  const mon = new Date(2026, 9, 5, 9, 0);
  assert.equal(P.isSelectableDelivery(new Date(2026, 9, 11), mon, false, CONFIG), false);
  assert.equal(P.isSelectableDelivery(new Date(2026, 9, 10), mon, false, CONFIG), true);
});
