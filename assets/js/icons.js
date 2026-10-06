/* LAV CLUB — icônes vectorielles des articles (traits, viewBox 48×48). */
(function (root) {
  var jacketBody = "M17 7 L24 10 L31 7 L39 11 L41 40 H35 L34 22 V41 H14 V22 L13 40 H7 L9 11 Z";
  var jacketLapels = "M17 7 L21 22 L24 18 L27 22 L31 7 M24 18 V41";
  var bomberBody = "M16 9 H32 L40 13 L42 38 H36 L34 22 V38 H14 V22 L12 38 H6 L8 13 Z";
  var pulloverBody = "M17 8 Q24 12 31 8 L38 11 L42 36 H36 L33 20 V40 H15 V20 L12 36 H6 L10 11 Z";
  var duvetBody = "M6 14 Q24 8 42 14 V36 Q24 42 6 36 Z";
  var curtainRod = "M5 7 H43 M6 5 V9 M42 5 V9";

  var ICONS = {
    shirt: ["M17 8 L24 12 L31 8 L40 13 L36 21 L33 19 V40 H15 V19 L12 21 L8 13 Z", "M20 9.5 L24 16 L28 9.5 M24 16 V40"],
    blouse: ["M18 8 Q24 13 30 8 L39 12 L36 20 L33 18 Q34 30 34 40 H14 Q14 30 15 18 L12 20 L9 12 Z", "M21 10 Q24 17 27 10 M14 30 H34"],
    tshirt: ["M16 8 Q24 14 32 8 L42 14 L37 22 L33 20 V40 H15 V20 L11 22 L6 14 Z"],
    pullover: [pulloverBody, "M15 36 H33 M20 9.5 Q24 13 28 9.5"],
    hoodie: [pulloverBody, "M18 8.5 Q24 1 30 8.5 M19 29 H29 L27.5 34 H20.5 Z"],
    tracksuit: [pulloverBody, "M24 10.5 V40 M10.5 14 L7.5 34 M37.5 14 L40.5 34"],
    trousers: ["M14 6 H34 L37 42 H27 L24 18 L21 42 H11 Z", "M14 10.5 H34"],
    shorts: ["M13 12 H35 L38 32 H27 L24 22 L21 32 H10 Z", "M13 16 H35"],
    skirt: ["M17 10 H31 L38 38 H10 Z", "M17 14 H31 M21 14 L18 38 M27 14 L30 38"],
    dress: ["M19 6 H21 Q24 10 27 6 H29 L30 16 L27 20 L37 42 H11 L21 20 L18 16 Z", "M21 20 H27"],
    gown: ["M20 5 H22 Q24 8 26 5 H28 V15 L26 19 Q30 30 38 43 H10 Q18 30 22 19 L20 15 Z", "M22 19 H26 M36 8 L36 12 M34 10 H38"],
    nightgown: ["M19 6 V14 Q14 30 13 42 H35 Q34 30 29 14 V6", "M19 14 Q24 18 29 14 M15 36 Q24 39 33 36"],
    jacket: [jacketBody, jacketLapels],
    bomber: [bomberBody, "M24 9 V38 M14 34.5 H34 M18 9 Q24 13 30 9"],
    leatherJacket: [bomberBody, "M19 9 L28 38 M16 9 L21 17 M32 9 L27 15 M31 26 H34"],
    suit: [jacketBody, "M17 7 L21 22 L24 18 L27 22 L31 7 M24 12 L22.6 15.5 L24 27 L25.4 15.5 Z"],
    vest: ["M17 7 L24 22 L31 7 L36 10 Q34 16 36 22 V40 H12 V22 Q14 16 12 10 Z", "M24 22 V40 M27 27 H28 M27 33 H28"],
    tie: ["M21 6 H27 L26 11 L30 34 L24 42 L18 34 L22 11 Z", "M22 11 H26"],
    socks: ["M17 6 H27 V26 L35 33 Q38 37 34 40 Q31 42 28 39 L18 31 Q17 30 17 28 Z", "M17 11 H27"],
    scarf: ["M9 13 Q24 4 39 13 Q31 17 27 21 L32 41 L26 43 L22 23 Q15 19 9 13 Z", "M26 43 L25 46 M32 41 L33 44"],
    pyjama: [
      "M14 5 L20 7 Q24 10 28 7 L34 5 L40 9 L37 15 L34 14 V23 H14 V14 L11 15 L8 9 Z",
      "M15 27 H33 L35 43 H27 L24 32 L21 43 H13 Z M24 9.5 V23"
    ],
    bathrobe: [
      "M17 6 L24 10 L31 6 L39 10 L42 30 H36 L34 18 V42 H14 V18 L12 30 H6 L9 10 Z",
      "M14 26 H34 M17 6 L27 26 M27 26 L25 32 M27 26 L30 31"
    ],
    towel: ["M10 9 H38 V39 H10 Z", "M10 31 H38 M10 35 H38 M17 9 V6 M24 9 V6 M31 9 V6"],
    duvet: [duvetBody, "M6 25 Q24 21 42 25 M18 11 V39 M30 11 V39"],
    duvetFeather: [duvetBody, "M6 25 Q24 21 42 25 M18 11 V39", "M44 3 Q46 12 36 17 L33 20 M36 17 Q36 9 44 3"],
    duvetCover: [duvetBody, "M6 32 Q24 37 42 32 M14 35 V35.5 M24 36.5 V37 M34 35 V35.5"],
    blanket: ["M8 11 H40 V19 H8 Z M8 19 H40 V27 H8 Z M8 27 H40 V35 H8 Z", "M11 35 V39 M16 35 V39 M21 35 V39 M26 35 V39 M31 35 V39 M36 35 V39"],
    bed: ["M5 23 H43 V36 H5 Z", "M5 36 V41 M43 36 V41 M9 23 V18 Q9 15 12 15 H21 Q23 15 23 18 V23 M5 29 H43"],
    sheet: ["M8 8 H40 V40 H17 L8 31 Z", "M8 31 H17 V40"],
    tablecloth: ["M6 15 H42 L39 30 Q36.5 33 34 30 Q31.5 33 29 30 Q26.5 33 24 30 Q21.5 33 19 30 Q16.5 33 14 30 Q11.5 33 9 30 Z", "M14 33 V43 M34 33 V43"],
    bag: ["M10 18 H38 L36 42 H12 Z", "M18 18 V14 Q18 8 24 8 Q30 8 30 14 V18 M10 25 H38"],
    tag: ["M7 24 L22 9 H39 V26 L24 41 Z", "M32 15 A2.5 2.5 0 1 0 32.1 15"],
    carpet: ["M9 10 H39 V38 H9 Z", "M14 15 H34 V33 H14 Z M24 18 L30 24 L24 30 L18 24 Z M12 38 V42 M18 38 V42 M24 38 V42 M30 38 V42 M36 38 V42"],
    curtain: [curtainRod, "M9 7 Q13 25 9 42 H22 Q17 25 22 7", "M26 7 Q31 25 26 42 H39 Q35 25 39 7"],
    curtainDouble: [curtainRod, "M8 7 Q12 25 8 42 H23 Q18 25 23 7 M25 7 Q30 25 25 42 H40 Q36 25 40 7", "M12 7 Q15 25 12 42 M36 7 Q33 25 36 42"],
    wedding: [
      "M20 5 H22 Q24 8 26 5 H28 V14 L26 17 Q34 26 42 42 Q24 46 6 42 Q14 26 22 17 L20 14 Z",
      "M21.5 17 H26.5 M24 17 Q21 30 17 43.5 M24 17 Q27 30 31 43.5"
    ]
  };

  function iconSvg(name, extraClass) {
    var paths = ICONS[name] || ICONS.tag;
    var body = paths
      .map(function (d) {
        return '<path d="' + d + '"/>';
      })
      .join("");
    return (
      '<svg class="ico ' + (extraClass || "") + '" viewBox="0 0 48 48" aria-hidden="true" fill="none" ' +
      'stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">' + body + "</svg>"
    );
  }

  root.LAV = root.LAV || {};
  root.LAV.iconSvg = iconSvg;
  root.LAV.ICONS = ICONS;
})(window);
