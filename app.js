// Kniyot: shared shopping lists for family and friends.
// Google sign-in, groups with one list each, one-time invites. Data lives in Firebase (Spark plan).

const FIREBASE = {
  apiKey: "AIzaSyDQc_3QdAGbrz-cTX8ADEctzTANt2MH7-E",
  authDomain: "kniyot-f85b1.firebaseapp.com",
  projectId: "kniyot-f85b1",
  storageBucket: "kniyot-f85b1.firebasestorage.app",
  messagingSenderId: "285619415090",
  appId: "1:285619415090:web:d38dc3f1f9f5e5a428f42b",
};
const SDK = "https://www.gstatic.com/firebasejs/10.12.2/";
const PROD_HOST = "kniyot.roieregev.com";
const INVITE_DAYS = 7;

// ---------- categories, in the order you walk a supermarket ----------
const CATS = [
  { id: "produce", label: "פירות וירקות", c: "#6BCB77", kw: ["עגבני","מלפפון","מלפפונים","גזר","בצל","שום","תפוח אדמה","תפוחי אדמה","תפוא","בטטה","פלפל","חסה","כרוב","כרובית","ברוקולי","קישוא","קישואים","חציל","חצילים","פטרוזיליה","כוסברה","שמיר","נענע","בזיליקום","פטריות","פטריה","תרד","סלק","צנון","צנונית","תירס","אבוקדו","לימון","לימונים","תפוח","תפוחים","בננה","בננות","תפוז","תפוזים","קלמנטינה","קלמנטינות","אגס","אגסים","ענב","ענבים","אבטיח","מלון","תות","תותים","אפרסק","אפרסקים","שזיף","שזיפים","מנגו","אננס","קיווי","רימון","רימונים","אשכולית","פירות","ירקות","סלרי","כרישה","ג'ינג'ר","ג׳ינג׳ר","דלעת","שעועית ירוקה","נבטים","עלי בייבי","רוקט","ארטישוק","תמר","תמרים","אוכמניות","פטל","דובדבנים","נקטרינה","פומלה","ליים","שרי"] },
  { id: "bakery", label: "לחם ומאפים", c: "#F2A65A", kw: ["לחם","לחמניה","לחמניות","פיתה","פיתות","חלה","חלות","באגט","טורטיה","טורטיות","בייגל","קרואסון","קרואסונים","עוגה","עוגות","עוגיות","מאפה","מאפים","בורקס","לאפה","לחמים","פרנה","קרקרים","פריכיות","פריכית","בגט"] },
  { id: "dairy", label: "מוצרי חלב וביצים", c: "#8EC5FF", kw: ["חלב","גבינה","גבינות","גבינה צהובה","גבינה לבנה","קוטג","קוטג'","קוטג׳","יוגורט","יוגורטים","שמנת","שמנת מתוקה","שמנת חמוצה","חמאה","ביצים","ביצה","לבנה","לבן","אשל","מעדן","מעדנים","פודינג","בולגרית","פטה","מוצרלה","פרמזן","צפתית","ריקוטה","גאודה","עמק","טל העמק","חלב שקדים","חלב סויה","חלב שיבולת","חלב שיבולת שועל","מרגרינה","שוקו","מילקי","דנונה","גבינת שמנת","קממבר","ברי"] },
  { id: "meat", label: "בשר, עוף ודגים", c: "#FF7F6E", kw: ["עוף","חזה עוף","שניצל","שניצלים","פרגית","פרגיות","כרעיים","שוקיים","כנפיים","בשר","בשר טחון","טחון","סטייק","אנטריקוט","צלעות","קבב","המבורגר","המבורגרים","נקניק","נקניקיות","נקניקייה","פסטרמה","סלמון","דג","דגים","טונה טרייה","אמנון","דניס","לברק","בקלה","הודו","שווארמה","כבד","קציצות","פילה","אסאדו","צלי"] },
  { id: "dry", label: "מזווה ושימורים", c: "#D9B26F", kw: ["אורז","פסטה","ספגטי","פתיתים","קוסקוס","בורגול","קינואה","עדשים","חומוס","שעועית","קמח","סוכר","מלח","פלפל שחור","שמן","שמן זית","שמן קנולה","חומץ","קטשופ","מיונז","חרדל","טחינה","רסק","רסק עגבניות","רוטב","רטבים","רוטב סויה","סויה","טונה","שימורים","שימור","תירס שימורים","זיתים","זית","מלפפונים חמוצים","חמוצים","ריבה","דבש","ממרח","נוטלה","חמאת בוטנים","קורנפלקס","דגני בוקר","גרנולה","שיבולת שועל","קפה","נס קפה","תה","קקאו","שמרים","אבקת אפיה","סודה לשתיה","וניל","פירורי לחם","תבלינים","תבלין","פפריקה","כמון","כורכום","אבקת מרק","מרק","אטריות","נודלס","קרם קוקוס","חלב קוקוס","שקדים","אגוזים","אגוזי מלך","קשיו","צימוקים","תמרים יבשים","פירות יבשים","זרעים","גרעינים","סילאן","מייפל","שוקולד מריר"] },
  { id: "frozen", label: "קפואים", c: "#5ED3E0", kw: ["קפוא","קפואים","קפואה","גלידה","גלידות","ארטיק","ארטיקים","אפונה","שעועית קפואה","ירקות קפואים","בצק עלים","בצק","פיצה","מלאווח","ג'חנון","ג׳חנון","צ'יפס","צ׳יפס","בורקס קפוא","קרח","פירות קפואים","כופתאות","ופלים בלגיים"] },
  { id: "drinks", label: "משקאות", c: "#B79CFF", kw: ["מיץ תפוזים","מיץ ענבים","מיץ תפוחים","מים","מים מינרלים","סודה","קולה","קוקה קולה","ספרייט","פאנטה","מיץ","מיצים","תפוזים טבעי","בירה","בירות","יין","יינות","וודקה","ערק","וויסקי","משקה","משקאות","תרכיז","פטל","פריגת","מים מוגזים","שוופס","אייס קפה","משקה אנרגיה","רד בול","ליפטון"] },
  { id: "snacks", label: "חטיפים ומתוקים", c: "#FF8FC0", kw: ["במבה","ביסלי","תפוצ'יפס","תפוצ׳יפס","דוריטוס","חטיף","חטיפים","שוקולד","שוקולדים","סוכריות","סוכריה","מסטיק","וופל","וופלים","בייגלה","פופקורן","חטיף אנרגיה","חטיפי חלבון","קליק","פסק זמן","כיף כף","קינדר","מרשמלו","גומי"] },
  { id: "cleaning", label: "ניקיון ובית", c: "#3FBFA8", kw: ["נייר טואלט","טואלט","מגבות נייר","מגבונים לבית","נייר סופג","סבון כלים","נוזל כלים","טבליות למדיח","מדיח","אבקת כביסה","ג'ל כביסה","ג׳ל כביסה","מרכך כביסה","מרכך","אקונומיקה","סנו","אקמה","ספוג","ספוגים","שקיות זבל","שקית זבל","שקיות","נייר אפיה","נייר כסף","ניילון נצמד","מטליות","מטלית","מגב","מטהר אוויר","נוזל רצפה","ניקוי","חלונית","כלים חד פעמיים","צלחות חד פעמיות","כוסות חד פעמיות","סכו\"ם חד פעמי","מפיות","נרות","סוללות","נורה","נורות","קיסמים","אלומיניום","תבניות"] },
  { id: "hygiene", label: "טיפוח והיגיינה", c: "#C6E34A", kw: ["שמפו","מרכך שיער","סבון","סבון גוף","ג'ל רחצה","ג׳ל רחצה","משחת שיניים","מברשת שיניים","מברשות שיניים","חוט דנטלי","דאודורנט","דיאודורנט","קרם","קרם גוף","קרם הגנה","קרם לחות","תחבושות","טמפונים","פדים","מגבונים","מגבונים לחים","צמר גפן","מקלוני אוזניים","סכין גילוח","סכיני גילוח","קצף גילוח","פלסטרים","אקמול","נורופן","ויטמינים","ויטמין","מי פה","לק","מסיר איפור","ספריי"] },
  { id: "baby", label: "תינוקות וחיות", c: "#FFE45E", kw: ["חיתולים","חיתול","מטרנה","סימילאק","דייסה","מחית","מוצץ","בקבוק לתינוק","אוכל לכלב","אוכל לחתול","חול לחתול","חטיפים לכלב","מזון לכלבים","מזון לחתולים"] },
  { id: "other", label: "שונות", c: "#C7CCD6", kw: [] },
];
const CAT = Object.fromEntries(CATS.map(c => [c.id, c]));

// ---------- free text to items (same rules as the original app) ----------
const NUMS = { "אחד":"1","אחת":"1","שניים":"2","שתיים":"2","שני":"2","שתי":"2","שלוש":"3","שלושה":"3","ארבע":"4","ארבעה":"4","חמש":"5","חמישה":"5","שש":"6","שישה":"6","שבע":"7","שבעה":"7","שמונה":"8","תשע":"9","תשעה":"9","עשר":"10","עשרה":"10","זוג":"2","חצי":"½" };
const UNITS = ["קילו","ק\"ג","קג","גרם","ליטר","ליטרים","חבילה","חבילות","בקבוק","בקבוקים","קרטון","קרטונים","יחידות","יחידה","מגש","מגשים","קופסה","קופסאות","פחית","פחיות","שישייה","מארז","מארזים","צרור","צרורות","אריזה","אריזות"];
const FILLER = new Set(["צריך","צריכים","לקנות","תוסיף","תוסיפי","תוסיפו","להוסיף","גם","את","קצת","בבקשה","עוד","וגם","אני","רוצה","תקנה","תקני","תביא","תביאי"]);
const norm = s => String(s).replace(/[֑-ׇ]/g, "").replace(/[.!?;:]+/g, " ").replace(/\s+/g, " ").trim();
const key = s => norm(s).replace(/["'׳״]/g, "");
const HEAD_CAT = { "מיץ":"drinks","גלידת":"frozen","רסק":"dry","רוטב":"dry","ממרח":"dry","פירורי":"dry","דגני":"dry","אוכל":"baby","מזון":"baby","חטיף":"snacks","חטיפי":"snacks","עוגת":"bakery","שקיות":"cleaning","שקית":"cleaning","נוזל":"cleaning","טבליות":"cleaning","אבקת":"cleaning","מטליות":"cleaning","משחת":"hygiene","מברשת":"hygiene","מברשות":"hygiene","תחליב":"hygiene","גבינת":"dairy" };
const FORM_ONLY = new Set(["ספריי","תרסיס","ג'ל","ג׳ל","גל"]);
const GLUE = new Set(["ספריי","תרסיס","נוזל","אבקת","אבקה","ג'ל","ג׳ל","גל","קרם","סבון","שקיות","שקית","טבליות","מגבונים","נייר","מיץ","רסק","רוטב","שמן","חומץ","ממרח","מרכך","משחת","מברשת","מברשות","תחליב","מי","אוכל","מזון","חטיף","חטיפי","קופסת","גבינה","גבינת","גלידת","עוגת","פירורי","דגני","ספוג","מטליות","מגבות","בקבוק","קרטון","מארז","חבילת"]);

function kwScore(phrase, words, kw) {
  const k = key(kw);
  if (!k) return 0;
  if (k.includes(" ")) return (` ${phrase} `).includes(` ${k} `) ? k.length + 20 : 0;
  let best = 0;
  for (const w of words) {
    for (const x of (w.startsWith("ה") && w.length > 3 ? [w, w.slice(1)] : [w])) {
      if (x === k) best = Math.max(best, k.length + 10);
      else if (k.length >= 3 && x.startsWith(k) && x.length - k.length <= 3) best = Math.max(best, k.length + 5);
    }
  }
  return best;
}
function guessCat(name) {
  const phrase = key(name);
  if (learned[phrase]) return learned[phrase];
  const words = phrase.split(" ");
  let best = "other", bestScore = 0;
  for (const c of CATS) for (const kw of c.kw) {
    const s = kwScore(phrase, words, kw);
    if (s > bestScore) { bestScore = s; best = c.id; }
  }
  if (bestScore < 20 && words.length > 1 && HEAD_CAT[words[0]]) return HEAD_CAT[words[0]];
  return best;
}
const isHit = w => guessCat(w) !== "other";
const multiNames = () => [...CATS.flatMap(c => c.kw.filter(kw => kw.includes(" ")).map(key)), ...Object.keys(learned).filter(k => k.includes(" "))];
const isMulti = phrase => { const k = key(phrase); return multiNames().some(m => m === k || m.startsWith(k + " ")); };
const isNum = x => /^\d+([.,]\d+)?$/.test(x) || NUMS[x];
function splitQty(chunk) {
  const words = chunk.split(" ").filter(Boolean);
  let qty = "";
  if (words.length > 1 && isNum(words[0])) {
    qty = NUMS[words[0]] || words[0]; words.shift();
    if (words.length > 1 && UNITS.includes(words[0])) qty += " " + words.shift();
  }
  return { name: words.join(" "), qty };
}
function parse(text) {
  if (!norm(text)) return [];
  const segments = [];
  for (const part of String(text).split(/[,\n،]+/).map(norm).filter(Boolean)) {
    let cur = [];
    const curHit = () => cur.some(w => isHit(w)) || (cur.length && isHit(cur.join(" ")));
    const words = part.split(" ");
    for (let n = 0; n < words.length; n++) {
      const w = words[n];
      if (w === "וגם") { if (cur.length) segments.push(cur.join(" ")); cur = []; continue; }
      if (!cur.length && FILLER.has(w)) continue;
      const bare = w.startsWith("ו") && w.length > 2 ? w.slice(1) : null;
      if (cur.length && bare && (isHit(bare) || isNum(bare) || UNITS.includes(bare) || (curHit() && !isHit(w)))) {
        segments.push(cur.join(" ")); cur = [bare]; continue;
      }
      // "דאודורנט ספריי": a form word after a product describes it. But "ספריי אקונומיקה" right after
      // a finished product starts a new one: the form word belongs to the product that follows it.
      const formOfNext = FORM_ONLY.has(w) && words[n + 1] && isHit(words[n + 1]);
      if (cur.length && curHit() && formOfNext) { segments.push(cur.join(" ")); cur = [w]; continue; }
      const glued = GLUE.has(cur[cur.length - 1]) || FORM_ONLY.has(w) || isMulti(cur.join(" ") + " " + w);
      if (cur.length && curHit() && !glued && (isNum(w) || isHit(w))) { segments.push(cur.join(" ")); cur = [w]; continue; }
      cur.push(w);
    }
    if (cur.length) segments.push(cur.join(" "));
  }
  return segments.map(splitQty).filter(x => x.name).map(x => ({ ...x, cat: guessCat(x.name) }));
}

// Quantity is stored as text, "2" or "2 קילו". The edit sheet splits it into a number and a unit.
const EDIT_UNITS = ["יחידות", "קילו", "גרם", "ליטר", "אריזה"];
const UNIT_ALIAS = { "קילו":"קילו","ק\"ג":"קילו","קג":"קילו","גרם":"גרם","ליטר":"ליטר","ליטרים":"ליטר","אריזה":"אריזה","אריזות":"אריזה","חבילה":"אריזה","חבילות":"אריזה","מארז":"אריזה","מארזים":"אריזה","יחידות":"יחידות","יחידה":"יחידות" };
function splitStoredQty(q) {
  const m = String(q || "").trim().match(/^([\d.,½]+)\s*(.*)$/);
  if (!m) return { n: "", unit: "יחידות" };
  const u = m[2].trim();
  return { n: m[1], unit: u ? (UNIT_ALIAS[u] || u) : "יחידות" };
}
const joinQty = (n, unit) => { n = String(n || "").trim(); if (!n) return ""; return unit && unit !== "יחידות" ? `${n} ${unit}` : n; };

// ---------- small helpers ----------
const $ = id => document.getElementById(id);
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;" }[c]));
const svg = (paths, size = 24, sw = 2.2) => `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths}</svg>`;
const P = {
  people: '<circle cx="9" cy="8" r="3.2"/><path d="M3 19c0-3.3 2.7-5.5 6-5.5s6 2.2 6 5.5"/><circle cx="17" cy="9" r="2.5"/><path d="M17 14c2.5 0 4.5 1.7 4.5 4.5"/>',
  chevron: '<path d="M6 9l6 6 6-6"/>',
  back: '<path d="M9 5l7 7-7 7"/>',
  close: '<path d="M6 6l12 12M18 6L6 18"/>',
  pencil: '<path d="M4 20h4L19 9l-4-4L4 16v4z"/><path d="M13.5 6.5l4 4"/>',
  check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
  mic: '<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/>',
  micOff: '<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3M4 4l16 16"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  minus: '<path d="M5 12h14"/>',
  cart: '<path d="M3 4h3l2.4 11h9.2L20 8H7"/><circle cx="9.5" cy="19" r="1.5"/><circle cx="17" cy="19" r="1.5"/>',
  copy: '<rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V6a2 2 0 0 1 2-2h8"/>',
  share: '<circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="6" r="2.5"/><circle cx="18" cy="18" r="2.5"/><path d="M8.2 10.8l7.6-3.6M8.2 13.2l7.6 3.6"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-6 8-6s8 2 8 6"/>',
  camera: '<path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/>',
  gear: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>',
  link: '<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>',
  home: '<path d="M4 11l8-7 8 7v9H4z"/><path d="M10 20v-6h4v6"/>',
  heart: '<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/>',
  star: '<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  phone: '<rect x="7" y="2" width="10" height="20" rx="2"/><path d="M11 18h2"/>',
};
const GROUP_COLORS = [["#1737D8", "כחול"], ["#C93A00", "כתום כהה"], ["#8A1FB0", "סגול"], ["#00766B", "טורקיז כהה"], ["#8A5A00", "חרדל כהה"]];
const GROUP_ICONS = [["people", "משפחה"], ["home", "בית"], ["heart", "לב"], ["star", "כוכב"], ["cart", "עגלה"], ["sun", "שמש"]];
const AV_COLORS = ["#FFD23F", "#FF9EC4", "#A5E86B", "#7BD3FF", "#B79CFF", "#FFB36B"];
const hash = s => { let h = 0; for (const ch of String(s)) h = (h * 31 + ch.codePointAt(0)) >>> 0; return h; };

function avatar(p, cls = "s32", label = "") {
  const name = p?.name || "?";
  const letter = esc([...name.trim()][0] || "?");
  const img = p?.photo ? `<img src="${esc(p.photo)}" alt="" referrerpolicy="no-referrer" onerror="this.remove()">` : "";
  return `<span class="av ${cls}" style="--c:${AV_COLORS[hash(p?.uid || name) % AV_COLORS.length]}"${label ? ` aria-label="${esc(label)}" role="img"` : ' aria-hidden="true"'}>${letter}${img}</span>`;
}
function gicon(g, size = 48) {
  const icon = P[g?.icon] ? g.icon : "people";
  return `<span class="gicon" style="--c:${esc(g?.color || "#1737D8")};--s:${size}px" aria-hidden="true">${svg(P[icon], Math.round(size * .55), 2.1)}</span>`;
}

let toastTimer;
function toast(msg, err = false) {
  const t = $("toast");
  t.textContent = msg; t.className = "toast" + (err ? " err" : ""); t.hidden = false;
  clearTimeout(toastTimer); toastTimer = setTimeout(() => { t.hidden = true; }, err ? 7000 : 3500);
}
const ls = {
  get(k) { try { return localStorage.getItem("kniyot." + k); } catch { return null; } },
  set(k, v) { try { v == null ? localStorage.removeItem("kniyot." + k) : localStorage.setItem("kniyot." + k, v); } catch {} },
};
const daysLeft = ts => Math.max(0, Math.ceil((ts.toMillis() - Date.now()) / 864e5));
const validFor = ts => { const d = daysLeft(ts); return d > 1 ? `תקף עוד ${d} ימים` : "תקף עד מחר"; };
const inviteUrl = code => location.hostname === PROD_HOST ? `https://${PROD_HOST}/j/${code}` : `${location.origin}${location.pathname}?j=${code}`;
const prettyUrl = code => inviteUrl(code).replace(/^https?:\/\//, "");
function newCode() {
  const A = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
  const r = crypto.getRandomValues(new Uint8Array(12));
  const s = Array.from(r, x => A[x % A.length]).join("");
  return `${s.slice(0, 4)}-${s.slice(4, 8)}-${s.slice(8)}`;
}

// ---------- state ----------
let F = null;            // firebase modules and handles
let user = null;         // firebase auth user
let profile = null;      // users/{uid}
let groups = {};         // gid -> group doc
let gid = null;          // current group
let items = [], members = {}, learned = {};
let groupSubs = {}, curSubs = [], profileSub = null;
let view = "loading", vd = {};   // current full screen and its data
let pendingInvite = null;
let flashId = null, confirmClear = false;

// An invite link arrives as /j/CODE (via 404.html), ?j=CODE or #j=CODE.
function captureInvite() {
  const u = new URL(location.href);
  const code = u.searchParams.get("j") || (u.hash.match(/^#j=([\w-]+)/) || [])[1] || (u.pathname.match(/\/j\/([\w-]+)/) || [])[1];
  if (code && /^[A-Z0-9-]{8,20}$/.test(code)) ls.set("invite", code);
  if (code) { u.searchParams.delete("j"); history.replaceState(null, "", u.pathname.replace(/\/j\/.*$/, "/") + u.search); }
  pendingInvite = ls.get("invite");
}

// ---------- firebase ----------
async function loadFirebase() {
  const [app, auth, fs] = await Promise.all([import(SDK + "firebase-app.js"), import(SDK + "firebase-auth.js"), import(SDK + "firebase-firestore.js")]);
  // Local testing only: ?emu=1 on localhost talks to the Firebase emulators and a demo project, never the real one.
  const emu = /^(localhost|127\.0\.0\.1)$/.test(location.hostname) && (new URLSearchParams(location.search).has("emu") || sessionStorage.getItem("emu"));
  const a = app.initializeApp(emu ? { ...FIREBASE, projectId: "demo-kniyot", authDomain: "demo-kniyot.firebaseapp.com" } : FIREBASE);
  const au = auth.getAuth(a);
  let db;
  try { db = fs.initializeFirestore(a, emu ? {} : { localCache: fs.persistentLocalCache({ tabManager: fs.persistentMultipleTabManager() }) }); }
  catch { db = fs.getFirestore(a); }
  if (emu) {
    sessionStorage.setItem("emu", "1");
    auth.connectAuthEmulator(au, "http://127.0.0.1:9099", { disableWarnings: true });
    await auth.setPersistence(au, auth.browserSessionPersistence);   // each tab can be a different test user
    fs.connectFirestoreEmulator(db, "127.0.0.1", 8080);
  }
  F = { auth, fs, au, db, emu };
  if (emu) window.__kn = () => ({ view, gid, groups: Object.keys(groups), subs: Object.keys(groupSubs), cur: curSubs.length, items: items.length, members: Object.keys(members).length, checks: Object.keys(dropChecks), profileGroups: profile?.groups });
}
const d = (...p) => F.fs.doc(F.db, ...p);
const col = (...p) => F.fs.collection(F.db, ...p);
const me = () => user?.uid;
const myCard = () => ({ name: profile?.name || "", photo: profile?.photo || "" });

async function signIn() {
  const provider = new F.auth.GoogleAuthProvider();
  provider.setCustomParameters({ prompt: "select_account" });
  if (F.emu) {
    // Emulator only: sign in as a fake Google user chosen by ?as=name, without the Google window.
    const who = new URLSearchParams(location.search).get("as") || sessionStorage.getItem("as") || "a";
    sessionStorage.setItem("as", who);
    const token = JSON.stringify({ sub: "test-" + who, email: `${who}@example.com`, email_verified: true, name: "בודק " + who });
    await F.auth.signInWithCredential(F.au, F.auth.GoogleAuthProvider.credential(token));
    return;
  }
  try { await F.auth.signInWithPopup(F.au, provider); }
  catch (e) {
    const c = e?.code || "";
    if (/popup-blocked|operation-not-supported|cancelled-popup-request|web-storage-unsupported/.test(c)) {
      try { await F.auth.signInWithRedirect(F.au, provider); } catch (e2) { toast("הכניסה לא הצליחה. נסו שוב.", true); }
    } else if (!/popup-closed-by-user/.test(c)) {
      toast(/network/.test(c) ? "אין חיבור לאינטרנט. בדקו ונסו שוב." : "הכניסה לא הצליחה. נסו שוב.", true);
    }
  }
}

function stopAll() {
  Object.values(groupSubs).forEach(u => u()); groupSubs = {};
  curSubs.forEach(u => u()); curSubs = [];
  profileSub?.(); profileSub = null;
  groups = {}; gid = null; items = []; members = {}; learned = {}; profile = null;
}

function onUser(u) {
  stopAll();
  user = u;
  if (!u) { pendingInvite ? showInviteLanding() : show("login"); return; }
  let first = true;
  profileSub = F.fs.onSnapshot(d("users", u.uid), async snap => {
    if (!snap.exists()) {
      profile = null;
      if (first) { first = false; show("profile", { first: true, name: u.displayName || "", photo: u.photoURL || "", photoSource: u.photoURL ? "google" : "none" }); }
      return;
    }
    const wasNull = !profile;
    profile = snap.data();
    if (first || wasNull) {
      first = false;
      syncGooglePhoto();
      const joined = pendingInvite ? await joinWithInvite(pendingInvite) : null;
      syncGroups();
      if (joined) openGroup(joined);
      else if (!(view === "invalid" && vd.keep)) pickStart();
    } else syncGroups();
  }, err => { console.error(err); show("error", { msg: "לא הצלחתי לטעון את הפרופיל. בדקו חיבור ורעננו." }); });
}

async function syncGooglePhoto() {
  if (profile?.photoSource !== "google" || !user.photoURL || user.photoURL === profile.photo) return;
  try { await saveProfile({ photo: user.photoURL, googlePhoto: user.photoURL }); } catch {}
}
// Profile changes are copied to every group, so members see the new name and photo.
async function saveProfile(patch) {
  const b = F.fs.writeBatch(F.db);
  b.set(d("users", me()), patch, { merge: true });
  const card = { ...myCard(), ...("name" in patch ? { name: patch.name } : {}), ...("photo" in patch ? { photo: patch.photo } : {}) };
  for (const g of profile?.groups || []) if (groups[g]) b.set(d("groups", g, "members", me()), card, { merge: true });
  await b.commit();
}

function syncGroups() {
  const want = new Set(profile?.groups || []);
  for (const g of Object.keys(groupSubs)) if (!want.has(g)) { groupSubs[g](); delete groupSubs[g]; delete groups[g]; }
  for (const g of want) if (!groupSubs[g]) watchGroup(g);
}
function watchGroup(g) {
  groupSubs[g] = F.fs.onSnapshot(d("groups", g), s => {
    if (!s.exists()) return verifyDrop(g);
    groups[g] = { id: g, ...s.data() };
    if (g === gid) refreshMain();
    if (view === "people" || view === "settings") render();
  }, () => verifyDrop(g));
}
// A refusal can also mean "not saved on the server yet" (a group I just created or joined).
// Ask the server again a little later, and forget the group only if it still refuses.
const dropChecks = {};
function verifyDrop(g, attempt = 0) {
  groupSubs[g]?.(); delete groupSubs[g];
  if (dropChecks[g] && attempt === 0) return;
  dropChecks[g] = true;
  setTimeout(async () => {
    try {
      const s = await F.fs.getDocFromServer(d("groups", g));
      if (!s.exists()) { delete dropChecks[g]; return dropGroup(g); }
      delete dropChecks[g];
      if (profile?.groups?.includes(g)) { groupSubs[g]?.(); watchGroup(g); }
      if (g === gid && view === "main") { gid = null; openGroup(g); }   // list listeners stop after an error: start them again
    } catch (e) {
      if (e?.code === "permission-denied" && attempt >= 2) { delete dropChecks[g]; return dropGroup(g); }
      if (e?.code === "permission-denied") return verifyDrop(g, attempt + 1);
      delete dropChecks[g];
      if (profile?.groups?.includes(g) && !groupSubs[g]) watchGroup(g);   // offline: keep it
    }
  }, [1500, 3000, 6000][attempt] || 6000);
}
// The group was deleted, or the owner removed me: forget it.
function dropGroup(g) {
  groupSubs[g]?.(); delete groupSubs[g]; delete groups[g];
  if (profile?.groups?.includes(g)) F.fs.updateDoc(d("users", me()), { groups: F.fs.arrayRemove(g) }).catch(() => {});
  if (g === gid) { gid = null; curSubs.forEach(u => u()); curSubs = []; toast("כבר אין לכם גישה לקבוצה הזו."); setTimeout(pickStart, 300); }
}

function pickStart() {
  const list = profile?.groups || [];
  if (!list.length) { show("newGroup", { first: true, color: GROUP_COLORS[0][0], icon: "people", name: "" }); return; }
  const last = ls.get("gid");
  openGroup(list.includes(last) ? last : list[0]);
}

function openGroup(g) {
  if (g !== gid) {
    curSubs.forEach(u => u()); curSubs = [];
    gid = g; items = []; members = {}; learned = {};
    ls.set("gid", g);
    curSubs.push(F.fs.onSnapshot(col("groups", g, "items"), s => { items = s.docs.map(x => ({ id: x.id, ...x.data() })); refreshMain(); },
      e => { if (e?.code === "permission-denied") verifyDrop(g); }));
    curSubs.push(F.fs.onSnapshot(col("groups", g, "members"), s => {
      members = Object.fromEntries(s.docs.map(x => [x.id, { uid: x.id, ...x.data() }]));
      refreshMain(); if (view === "people") render();
    }, e => { if (e?.code === "permission-denied") verifyDrop(g); }));
    curSubs.push(F.fs.onSnapshot(d("groups", g, "meta", "learned"), s => { learned = (s.exists() && s.data().map) || {}; updatePreview(); },
      e => { if (e?.code === "permission-denied") verifyDrop(g); }));
  }
  show("main");
}

// ---------- invites ----------
async function readInvite(code) {
  try { const s = await F.fs.getDoc(d("invites", code)); return s.exists() ? { code, ...s.data() } : null; }
  catch { return null; }
}
const inviteOk = inv => inv && !inv.usedBy && !inv.revoked && inv.expiresAt?.toMillis() > Date.now();

async function showInviteLanding() {
  show("loading");
  const inv = await readInvite(pendingInvite);
  if (!inviteOk(inv)) { pendingInvite = null; ls.set("invite", null); show("invalid", { inv }); return; }
  show("join", { inv });
}

async function joinWithInvite(code) {
  const inv = await readInvite(code);
  pendingInvite = null; ls.set("invite", null);
  if (inv && profile.groups?.includes(inv.groupId)) return inv.groupId;
  if (!inviteOk(inv)) { show("invalid", { inv, keep: true }); return null; }
  try {
    const b = F.fs.writeBatch(F.db);
    b.update(d("invites", code), { usedBy: me(), usedAt: F.fs.serverTimestamp() });
    b.update(d("groups", inv.groupId), { memberIds: F.fs.arrayUnion(me()), joinInvite: code });
    b.set(d("groups", inv.groupId, "members", me()), { ...myCard(), joinedAt: F.fs.serverTimestamp() });
    b.set(d("users", me()), { groups: F.fs.arrayUnion(inv.groupId) }, { merge: true });
    await b.commit();
    try { await F.fs.getDocFromServer(d("groups", inv.groupId)); } catch {}   // the server has the join before the list opens
    toast(`הצטרפתם לקבוצה "${inv.groupName}"`);
    return inv.groupId;
  } catch (e) {
    console.error(e);
    show("invalid", { inv, keep: true });
    return null;
  }
}

async function createInvite(g) {
  const code = newCode();
  await F.fs.setDoc(d("invites", code), {
    groupId: g, groupName: groups[g]?.name || vd.name || "", inviterName: profile.name, createdBy: me(),
    createdAt: F.fs.serverTimestamp(), expiresAt: F.fs.Timestamp.fromMillis(Date.now() + INVITE_DAYS * 864e5), usedBy: null, revoked: false,
  });
  return { code, expiresAt: F.fs.Timestamp.fromMillis(Date.now() + INVITE_DAYS * 864e5) };
}
async function loadInvites(g) {
  const q = F.fs.query(col("invites"), F.fs.where("createdBy", "==", me()), F.fs.where("groupId", "==", g));
  const s = await F.fs.getDocs(q);
  return s.docs.map(x => ({ code: x.id, ...x.data() })).filter(inviteOk).sort((a, b) => b.expiresAt.toMillis() - a.expiresAt.toMillis());
}
async function shareInvite(code) {
  const url = inviteUrl(code), name = groups[gid]?.name || vd.name || "";
  if (navigator.share) {
    try { await navigator.share({ title: "הקניות שלנו", text: `הזמנה לרשימת הקניות "${name}". הקישור מיועד לאדם אחד.`, url }); return; } catch (e) { if (e?.name === "AbortError") return; }
  }
  copyText(url);
}
async function copyText(t) {
  try { await navigator.clipboard.writeText(t); toast("הועתק"); }
  catch { prompt("העתיקו את הקישור:", t); }
}

// ---------- screens ----------
function show(v, data = {}) { view = v; vd = data; closeLayer(); render(); window.scrollTo(0, 0); }
function render() {
  const app = $("app");
  if (view === "main") { renderMain(); return; }
  document.body.classList.remove("has-composer");
  const html = SCREENS[view]?.() ?? SCREENS.loading();
  app.innerHTML = `<div class="screen">${html}</div>`;
  const focus = app.querySelector("[autofocus]");
  if (focus && !matchMedia("(pointer: coarse)").matches) focus.focus();
}
const backRow = (title, sub = "", act = "toMain") => `<div class="back-row">
  <button class="icon-btn" data-act="${act}" aria-label="חזרה">${svg(P.back, 24, 2.6)}</button>
  <div class="grow"><h1>${esc(title)}</h1>${sub ? `<div class="sub">${esc(sub)}</div>` : ""}</div></div>`;

const SCREENS = {
  loading: () => `<div class="loading">רגע…</div>`,
  error: () => `<div class="pad screen"><h1>משהו השתבש</h1><p class="muted">${esc(vd.msg)}</p><button class="btn primary" data-act="reload">רענון</button></div>`,

  login: () => `
    <div class="strips" aria-hidden="true">${["produce","bakery","dairy","meat","drinks","baby"].map(c => `<div style="--c:${CAT[c].c}">${CAT[c].label}</div>`).join("")}</div>
    <div class="grow" style="display:flex;flex-direction:column;gap:14px;padding:30px 16px 0">
      <h1 class="login-title">הקניות שלנו</h1>
      <p style="max-width:320px;font-size:21px;line-height:1.4" class="muted">רשימת קניות משותפת למשפחה ולחברים.</p>
    </div>
    <div style="display:flex;flex-direction:column;gap:12px;padding:24px 16px calc(32px + env(safe-area-inset-bottom,0px))">
      <button class="btn primary big" data-act="signIn">${svg(P.user, 26, 2.3)}כניסה עם חשבון Google</button>
      <p class="muted center" style="font-size:16px;line-height:1.45;margin-top:6px">בלי סיסמה להקליד. הרשימות פרטיות, ורק מי שהוזמן רואה אותן.</p>
    </div>`,

  join: () => { const inv = vd.inv; return `<div class="pad screen">
    <div class="hero-col">
      <span class="tag">הוזמנתם להצטרף</span>
      <div style="display:flex;align-items:center;gap:14px">
        ${gicon({ color: "#1737D8", icon: "people" }, 72)}
        <h1 class="grow" style="font-size:40px">${esc(inv.groupName)}</h1>
      </div>
      <span class="muted" style="font-size:17px;font-weight:500">${esc(inv.inviterName)} הזמין אתכם</span>
    </div>
    <div class="stack" style="gap:14px">
      <h2 style="font-size:26px">מה קורה עכשיו</h2>
      <ol class="steps">
        <li><span class="num">1</span>נכנסים עם חשבון Google</li>
        <li><span class="num">2</span>בוחרים שם ותמונה</li>
        <li><span class="num">3</span>הרשימה של הקבוצה מוכנה</li>
      </ol>
    </div>
    <div class="stack" style="margin-top:auto;gap:12px">
      <button class="btn primary big" data-act="signIn">${svg(P.user, 26, 2.3)}המשך עם Google</button>
      <p class="muted center" style="font-size:16px">זה לוקח חצי דקה. אין סיסמה להקליד.</p>
    </div></div>`; },

  invalid: () => { const who = vd.inv?.inviterName; return `<div class="pad screen">
    <div class="hero-col">
      <span class="tag">הקישור לא עובד</span>
      <h1>הקישור הזה כבר לא תקף</h1>
      <p class="muted" style="font-size:18px;line-height:1.45">קישור הזמנה מתאים לאדם אחד ולזמן מוגבל. ייתכן שהוא כבר שומש, שפג תוקפו או שהמנהל ביטל אותו.</p>
    </div>
    <div class="stack" style="gap:14px">
      <h2 style="font-size:26px">מה עושים</h2>
      <ol class="steps">
        <li><span class="num">1</span>${who ? `מבקשים מ${esc(who)} קישור חדש` : "מבקשים קישור חדש ממי ששלח אותו"}</li>
        <li><span class="num">2</span>פותחים אותו, וזהו</li>
      </ol>
    </div>
    <div class="stack" style="margin-top:auto;gap:10px">
      <button class="btn primary" data-act="askNewLink">${svg(P.share, 24, 2.3)}שליחת הודעה: ״אפשר קישור חדש?״</button>
      <button class="btn outline" data-act="copyAsk">העתקת ההודעה</button>
      <button class="link-btn center" data-act="leaveInvalid">${user ? "המשך לאפליקציה" : "כניסה לאפליקציה"}</button>
    </div></div>`; },

  profile: () => {
    const f = vd.first;
    const card = { uid: me(), name: vd.name || "?", photo: vd.photo };
    return `<div class="pad screen">
    ${f ? `<div class="stack"><span class="tag">צעד אחרון</span><h1 style="font-size:36px">איך נקרא לכם?</h1></div>` : backRow("הפרופיל שלי")}
    <div class="stack" style="align-items:center;gap:12px">
      ${avatar(card, "s112")}
      <div class="actions" style="justify-content:center">
        <button class="btn outline small" data-act="pickPhoto">${svg(P.camera, 20)}החלפת תמונה</button>
        ${vd.photoSource === "custom" && (profile?.googlePhoto || user?.photoURL) ? `<button class="btn outline small" data-act="googlePhoto">חזרה לתמונה מ-Google</button>` : ""}
      </div>
    </div>
    <div class="stack">
      <label class="label" for="pname">השם שמופיע ליד המוצרים</label>
      <input id="pname" class="field" type="text" maxlength="40" value="${esc(vd.name)}" autocomplete="given-name" autofocus>
      <p class="muted" style="font-size:15px">השם והתמונה מופיעים ליד כל מוצר שתוסיפו.</p>
    </div>
    ${f ? "" : `<button class="btn outline small" data-act="install" style="align-self:flex-start">${svg(P.phone, 20)}הוספה למסך הבית</button>
      <p class="muted" style="font-size:15px">החשבון מחובר ל-Google${user?.email ? ` · <span dir="ltr">${esc(user.email)}</span>` : ""}</p>`}
    <div class="stack" style="margin-top:auto;gap:10px">
      <button class="btn primary" data-act="saveProfile">${f ? "המשך" : "שמירה"}</button>
      ${f ? "" : `<button class="btn danger" data-act="signOut">יציאה מהחשבון</button>`}
    </div></div>`;
  },

  newGroup: () => `<div class="pad screen">
    ${vd.first ? `<div class="stack"><h1 style="font-size:34px">קבוצה חדשה</h1><p class="muted" style="font-size:17px">כדי להתחיל, יוצרים קבוצה: משפחה, שותפים לדירה או חברים. לכל קבוצה יש רשימת קניות אחת.</p></div>` : backRow("קבוצה חדשה")}
    ${groupFields()}
    <div class="stack" style="margin-top:auto;gap:10px">
      <button class="btn primary" data-act="createGroup" id="ctaGroup"${norm(vd.name) ? "" : " disabled"}>יצירה והזמנה</button>
      <p class="muted center" style="font-size:16px">אחרי היצירה תקבלו קישור להזמנת אחרים.</p>
    </div></div>`,

  invite: () => { const g = groups[vd.gid] || { name: vd.name, color: vd.color, icon: vd.icon }; return `<div class="pad screen">
    <div class="hero">
      ${gicon(g, 84)}
      <div class="grow stack" style="gap:8px">
        <span class="tag">${svg(P.check, 16, 3.4)}הקבוצה נוצרה</span>
        <h1>${esc(g.name)}</h1>
      </div>
    </div>
    <div class="stack" style="gap:14px">
      <h2 style="font-size:26px">הזמינו את החברים</h2>
      <p class="muted" style="font-size:18px;line-height:1.45">זה קישור חד-פעמי: הוא מתאים לאדם אחד. לכל אדם נוסף יוצרים קישור חדש.</p>
      ${vd.code ? `<div class="link-box"><span>${esc(prettyUrl(vd.code))}</span></div>
      <div class="actions">
        <button class="btn outline flex1" data-act="copyInvite" data-code="${esc(vd.code)}" style="font-family:var(--body);font-weight:800;font-size:19px">${svg(P.copy, 24, 2.3)}העתקה</button>
        <button class="btn primary flex1" data-act="shareInvite" data-code="${esc(vd.code)}">${svg(P.share, 24, 2.3)}שיתוף</button>
      </div>
      <div class="label-row"><span class="muted" style="font-size:16px">${validFor(vd.expiresAt)}</span>
        <button class="link-btn" data-act="revokeInvite" data-code="${esc(vd.code)}" style="color:var(--danger)">ביטול הקישור</button></div>`
      : `<button class="btn primary" data-act="newInvite">${svg(P.link, 24, 2.3)}קישור חדש</button>`}
    </div>
    <div class="stack" style="padding-top:20px;border-top:1px solid var(--rule)">
      <span class="label">מי כבר בפנים</span>
      <div style="display:flex;align-items:center;gap:12px">${avatar({ uid: me(), ...myCard() }, "s48")}<span style="font-size:19px;font-weight:700">רק ${esc(profile?.name)} בינתיים</span></div>
    </div>
    <button class="btn outline" data-act="openGroup" data-gid="${esc(vd.gid)}" style="margin-top:auto">מעבר לרשימה</button>
  </div>`; },

  people: () => {
    const g = groups[gid]; if (!g) return SCREENS.loading();
    const owner = g.ownerId === me();
    const list = (g.memberIds || []).map(u => members[u] || { uid: u, name: "…" })
      .sort((a, b) => (a.uid === g.ownerId ? -1 : b.uid === g.ownerId ? 1 : (a.joinedAt?.toMillis?.() || 0) - (b.joinedAt?.toMillis?.() || 0)));
    return `<div class="pad screen">
    <div class="back-row">
      <button class="icon-btn" data-act="toMain" aria-label="חזרה">${svg(P.back, 24, 2.6)}</button>
      <div class="grow"><h1>אנשים</h1><div class="sub">${esc(g.name)}</div></div>
      ${owner ? `<button class="btn outline small" data-act="toSettings">${svg(P.gear, 20, 2.3)}הגדרות הקבוצה</button>` : ""}
    </div>
    <span style="font-size:16px;font-weight:800">חברים בקבוצה · ${list.length}</span>
    <div class="people-list">${list.map(m => `
      <div class="person">${avatar(m, "s46")}
        <span class="pn">${esc(m.name)}${m.uid === me() && !owner ? " (זה את/ה)" : ""}</span>
        <span class="role${m.uid === g.ownerId ? " owner" : ""}">${m.uid === g.ownerId ? "מנהל" : "חבר"}</span>
        ${owner && m.uid !== me() ? `<button class="btn outline small" data-act="removeMember" data-uid="${esc(m.uid)}" aria-label="הוצאת ${esc(m.name)} מהקבוצה" style="border-color:var(--danger);color:var(--danger)">הוצאה</button>` : ""}
      </div>`).join("")}</div>
    ${owner ? `
      <span style="font-size:16px;font-weight:800">קישורי הזמנה פעילים</span>
      ${vd.invites == null ? `<p class="muted">טוען…</p>` : vd.invites.length ? vd.invites.map(i => `
        <div class="invite-card">
          <div class="lnk">${esc(prettyUrl(i.code))}</div>
          <span class="muted" style="font-size:15px">לשימוש אדם אחד · ${validFor(i.expiresAt)}</span>
          <div class="actions">
            <button class="btn outline small flex1" data-act="copyInvite" data-code="${esc(i.code)}">${svg(P.copy, 20, 2.3)}העתקה</button>
            <button class="btn outline small flex1" data-act="shareInvite" data-code="${esc(i.code)}">${svg(P.share, 20, 2.3)}שיתוף</button>
            <button class="btn outline small" data-act="revokeInvite" data-code="${esc(i.code)}" style="border-color:var(--danger);color:var(--danger)">ביטול</button>
          </div>
        </div>`).join("") : `<p class="muted" style="font-size:16px">אין קישורים פעילים.</p>`}
      <button class="btn primary" data-act="newInvite" style="margin-top:auto">${svg(P.link, 24, 2.3)}קישור חדש לאדם נוסף</button>`
    : `<p class="muted" style="font-size:16px">הוספה והוצאה של אנשים נעשות על ידי המנהל.</p>
      <button class="btn danger" data-act="leaveGroup" style="margin-top:auto">יציאה מהקבוצה</button>`}
  </div>`;
  },

  settings: () => `<div class="pad screen">
    <div class="back-row">
      <button class="icon-btn" data-act="toPeople" aria-label="חזרה">${svg(P.back, 24, 2.6)}</button>
      <div class="grow"><h1>הגדרות הקבוצה</h1><div class="sub">למנהל בלבד</div></div>
    </div>
    ${groupFields()}
    <div class="stack" style="margin-top:auto;gap:10px">
      <button class="btn primary" data-act="saveGroup" id="ctaGroup"${norm(vd.name) ? "" : " disabled"}>שמירה</button>
      <button class="btn danger" data-act="deleteGroup">מחיקת הקבוצה</button>
    </div></div>`,
};

function groupFields() {
  return `<div class="stack">
      <label class="label" for="gname">שם הקבוצה, למשל: הבית</label>
      <input id="gname" class="field" type="text" maxlength="40" value="${esc(vd.name)}" autofocus>
    </div>
    <div class="stack"><span class="label">צבע</span>
      <div class="swatches">${GROUP_COLORS.map(([c, n]) => `<button class="swatch" style="--c:${c}" data-act="pickColor" data-v="${c}" aria-label="${n}" aria-pressed="${vd.color === c}"></button>`).join("")}</div>
    </div>
    <div class="stack"><span class="label">סמל</span>
      <div class="icons">${GROUP_ICONS.map(([i, n]) => `<button class="icon-pick" data-act="pickIcon" data-v="${i}" aria-label="${n}" aria-pressed="${vd.icon === i}">${svg(P[i], 26, 2.2)}</button>`).join("")}</div>
    </div>`;
}

// ---------- main list screen ----------
function renderMain() {
  const app = $("app");
  if (!$("list")) {
    document.body.classList.add("has-composer");
    app.innerHTML = `<div class="screen">
      <header class="top" id="top"></header>
      <main class="list" id="list" aria-live="polite"></main>
    </div>
    <div class="scrim" id="cscrim" data-act="focusInput" hidden></div>
    <div class="composer" id="composer"><div class="composer-inner">
      <div id="cpanel"></div>
      <form class="composer-row" id="addForm" autocomplete="off">
        <button type="button" class="mic" id="mic" data-act="mic" aria-label="הקלטה קולית">${svg(P.mic, 26)}</button>
        <input id="newItem" type="text" placeholder="מה צריך לקנות?" aria-label="מה צריך לקנות" enterkeyhint="done">
        <button type="submit" class="add-btn" id="addBtn" disabled>הוספה</button>
      </form>
    </div></div>`;
    $("newItem").addEventListener("input", () => { panel = null; updatePreview(); });
    $("addForm").addEventListener("submit", e => { e.preventDefault(); submitItems(); });
  }
  refreshMain();
  updatePreview();
}

function refreshMain() {
  if (view !== "main" || !$("list")) return;
  const g = groups[gid];
  const open = items.filter(i => !i.done).sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0));
  const done = items.filter(i => i.done).sort((a, b) => (b.doneAt || 0) - (a.doneAt || 0));
  const total = items.length;
  const meCard = { uid: me(), ...myCard() };
  $("top").innerHTML = `
    <div class="top-row">
      <button class="switcher" data-act="groups" aria-label="מעבר בין קבוצות: ${esc(g?.name || "")}"><span>${esc(g?.name || "…")}</span>${svg(P.chevron, 26, 2.6)}</button>
      <button class="people-btn" data-act="toPeople">${svg(P.people, 18, 2.4)}אנשים</button>
      <button class="me-btn" data-act="toProfile" aria-label="הפרופיל שלי">${avatar(meCard, "s48")}</button>
    </div>
    <div>
      <div class="progress-row"><b>${total ? (open.length ? `נשארו ${open.length} מתוך ${total}` : "הכול בעגלה") : "אין מוצרים ברשימה"}</b>${done.length ? `<span>${done.length} בעגלה</span>` : ""}</div>
      ${total && total <= 24
        ? `<div class="segs" role="img" aria-label="${done.length} מתוך ${total} מוצרים בעגלה">${items.map((_, n) => `<i${n < done.length ? ' class="on"' : ""}></i>`).join("")}</div>`
        : `<div class="bar" role="img" aria-label="${done.length} מתוך ${total} מוצרים בעגלה"><i style="width:${total ? Math.round(done.length / total * 100) : 0}%"></i></div>`}
    </div>`;
  let html = "";
  if (!total) {
    html = `<div class="empty">${svg(P.cart, 72, 1.8)}<h1>הרשימה ריקה</h1><p>כתבו או הקליטו מה חסר. אפשר כמה מוצרים בבת אחת, ונסדר אותם לפי הקטגוריות בסופר.</p></div>`;
  }
  for (const c of CATS) {
    const list = open.filter(i => (CAT[i.cat] ? i.cat : "other") === c.id);
    if (!list.length) continue;
    html += `<div class="cat-head" style="--c:${c.c}"><span class="cn">${c.label}</span><span class="count-pill">${list.length}</span></div>${list.map(itemRow).join("")}`;
  }
  if (done.length) {
    html += `<div class="cart-gap"></div><div class="cart-head">${svg(P.cart, 26)}<span class="t">בעגלה</span><span class="n">${done.length}</span>
      <button class="${confirmClear ? "warn" : ""}" data-act="clearCart">${confirmClear ? "בטוח? לחצו שוב" : "ניקוי העגלה"}</button></div>${done.map(itemRow).join("")}`;
  }
  $("list").innerHTML = html;
  flashId = null;
}

function itemRow(i) {
  const who = members[i.addedBy] || (i.addedBy ? { uid: i.addedBy, name: i.addedByName || "?" } : null);
  const q = i.qty ? `<span class="qty">× ${esc(i.qty)}</span>` : "";
  if (i.done) return `<div class="row done" data-id="${esc(i.id)}">
    <button class="check" data-act="toggle" aria-label="החזרה לרשימה: ${esc(i.name)}">${svg(P.check, 24, 3)}</button>
    <div class="row-text"><span class="name">${esc(i.name)}</span>${q}</div>
    ${who ? avatar(who, "s32", `נוסף על ידי ${who.name}`) : ""}
  </div>`;
  return `<div class="row${i.id === flashId ? " flash" : ""}" data-id="${esc(i.id)}">
    <button class="check" data-act="toggle" aria-label="סימון ${esc(i.name)} כנקנה"></button>
    <div class="row-text"><span class="name">${esc(i.name)}</span>${q}</div>
    ${who ? avatar(who, "s32", `נוסף על ידי ${who.name}`) : ""}
    <button class="edit" data-act="edit" aria-label="עריכת ${esc(i.name)}">${svg(P.pencil, 22)}</button>
  </div>`;
}

// The panel above the input: the split preview, or a microphone notice.
let panel = null;   // null | "unavailable" | "denied"
function updatePreview() {
  if (view !== "main" || !$("cpanel")) return;
  const input = $("newItem"), parsed = parse(input.value);
  const addBtn = $("addBtn");
  addBtn.disabled = !parsed.length;
  addBtn.textContent = parsed.length > 1 ? `הוספת ${parsed.length}` : "הוספה";
  $("mic").setAttribute("aria-disabled", String(panel === "unavailable" || panel === "denied" || !micPossible()));
  let html = "";
  if (panel) {
    const t = panel === "denied"
      ? ["אין הרשאה למיקרופון", "הדפדפן חסם את המיקרופון. לחצו על סמל המנעול ליד כתובת האתר ואשרו ״מיקרופון״. אחר כך נסו שוב."]
      : ["ההקלטה לא זמינה כאן", isIOS()
        ? "באייפון היא לא עובדת כשפותחים את האפליקציה מהאייקון במסך הבית. אפשר להקליד, או לפתוח את האתר ב-Safari."
        : "הדפדפן הזה לא תומך בזיהוי דיבור. אפשר להקליד, או לפתוח את האתר ב-Chrome."];
    html = `<div class="notice-panel" role="status"><b>${t[0]}</b><p>${t[1]}</p><button class="btn outline small" data-act="closePanel">הבנתי</button></div>`;
  } else if (parsed.length) {
    html = `<div class="preview"><div class="preview-head"><b>${parsed.length > 1 ? `זיהינו ${parsed.length} מוצרים` : "מוצר אחד"}</b><span>בדקו את הקטגוריות</span></div>
      ${parsed.map((p, n) => (n ? `<div class="join-row"><button type="button" class="join-btn" data-act="joinParts" data-n="${n}" aria-label="חיבור ${esc(parsed[n - 1].name)} ו${esc(p.name)} למוצר אחד">${svg(P.plus, 22, 2.8)}</button></div>` : "")
        + `<div class="pv"><span class="sw" style="--c:${CAT[p.cat].c}"></span><span class="nm">${esc(p.name)}</span>${p.qty ? `<span class="qty" style="font-size:16px">× ${esc(p.qty)}</span>` : ""}<span class="ct">${CAT[p.cat].label}</span></div>`).join("")}
      ${parsed.length > 1 ? `<p class="note">התפצל לא נכון? לחצו על + בין שני חלקים כדי לחבר אותם.</p>` : ""}</div>`;
  }
  $("cpanel").innerHTML = html;
  $("cscrim").hidden = !html;
}

function submitItems() {
  const input = $("newItem"), parsed = parse(input.value);
  if (!parsed.length || !gid) return;
  input.value = ""; updatePreview();
  const writes = [], seen = new Set();
  for (const p of parsed) {
    const k = key(p.name);
    if (seen.has(k)) continue;
    seen.add(k);
    const existing = items.find(i => key(i.name) === k);
    if (existing) {
      flashId = existing.id;
      writes.push(F.fs.updateDoc(d("groups", gid, "items", existing.id), { done: false, doneAt: 0, ...(p.qty ? { qty: p.qty } : {}) }));
    } else {
      writes.push(F.fs.addDoc(col("groups", gid, "items"), { name: p.name, qty: p.qty || "", cat: p.cat, done: false, createdAt: Date.now(), addedBy: me(), addedByName: profile.name, doneAt: 0 }));
    }
  }
  // Not awaited one by one: offline, a write is confirmed only when the server answers.
  Promise.all(writes).catch(() => toast("לא הצלחתי לשמור. בדקו חיבור לאינטרנט.", true));
}

function joinParts(n) {
  const input = $("newItem"), parsed = parse(input.value);
  const a = parsed[n - 1], c = parsed[n];
  if (!a || !c) return;
  const name = a.name + " " + c.name, qty = a.qty || c.qty, cat = guessCat(name);
  learned[key(name)] = cat;
  const parts = parsed.map(p => (p.qty ? p.qty + " " : "") + p.name);
  parts.splice(n - 1, 2, (qty ? qty + " " : "") + name);
  input.value = parts.join(", ");
  updatePreview(); input.focus();
  F.fs.setDoc(d("groups", gid, "meta", "learned"), { map: { [key(name)]: cat } }, { merge: true }).catch(() => {});
}

// ---------- voice ----------
const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
const isIOS = () => /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
const standalone = () => navigator.standalone === true || matchMedia("(display-mode: standalone)").matches;
const micPossible = () => !!SR && !(isIOS() && standalone());
let rec = null, recTimer = null, recBase = "", recText = "", recCancelled = false;

function startMic() {
  if (!micPossible()) { panel = "unavailable"; updatePreview(); return; }
  if (panel) { panel = null; }
  const input = $("newItem");
  recBase = input.value.trim() ? input.value.trim() + " " : "";
  recText = ""; recCancelled = false;
  try {
    rec = new SR();
    rec.lang = "he-IL"; rec.interimResults = true; rec.continuous = true; rec.maxAlternatives = 1;
  } catch { panel = "unavailable"; updatePreview(); return; }
  const started = Date.now();
  openLayer(`<div class="scrim"></div><section class="rec" aria-label="הקלטה פעילה">
    <div class="rec-top"><span class="rec-dot"></span><b>מקשיבים…</b><time id="recTime">0:00</time></div>
    <div class="waves" role="img" aria-label="גלי קול: האפליקציה מקשיבה">${Array.from({ length: 24 }, (_, n) => `<i style="height:${12 + (n * 37 % 40)}px;animation-duration:${.8 + (n % 4) * .1}s;animation-delay:-${(n * .13 % .9).toFixed(2)}s"></i>`).join("")}</div>
    <p class="rec-text" id="recText"><span class="ph">אמרו את המוצרים, למשל: חלב, ביצים ושני לחמים</span><span class="caret"></span></p>
    <div class="rec-actions">
      <div class="stop-wrap"><span class="ring"></span><span class="ring"></span><button class="stop" data-act="recStop" aria-label="סיום הקלטה והוספה"><span></span></button></div>
      <div class="lbl"><b>סיום והוספה</b><span>נפרק את מה שאמרתם למוצרים</span></div>
      <button class="rec-cancel" data-act="recCancel">ביטול</button>
    </div></section>`, "rec");
  recTimer = setInterval(() => { const s = Math.floor((Date.now() - started) / 1000); const t = $("recTime"); if (t) t.textContent = `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`; }, 500);
  rec.onresult = ev => {
    let txt = "";
    for (const r of ev.results) txt += r[0].transcript;
    recText = txt;
    const p = $("recText"); if (p) p.innerHTML = `${esc(txt)}<span class="caret"></span>`;
  };
  rec.onerror = ev => {
    if (ev.error === "not-allowed" || ev.error === "service-not-allowed") panel = "denied";
    else if (ev.error === "audio-capture") toast("לא נמצא מיקרופון פעיל.", true);
    else if (ev.error === "network") toast("זיהוי הדיבור צריך חיבור לאינטרנט.", true);
    else if (ev.error === "no-speech") toast("לא שמעתי כלום. נסו שוב, קרוב יותר לטלפון.");
  };
  rec.onend = () => {
    clearInterval(recTimer); rec = null;
    closeLayer();
    if (!recCancelled && recText.trim()) $("newItem").value = recBase + recText.trim();
    updatePreview();
  };
  try { rec.start(); } catch { closeLayer(); panel = "unavailable"; updatePreview(); }
}

// ---------- layers: sheets, dialogs, recording ----------
let layerKind = null;
function openLayer(html, kind = "sheet") { $("layer").innerHTML = html; layerKind = kind; }
function closeLayer() {
  if (layerKind === "rec" && rec) { recCancelled = true; try { rec.abort(); } catch {} }
  $("layer").innerHTML = ""; layerKind = null; editing = null;
}
function sheet(title, body) {
  openLayer(`<div class="scrim" data-act="closeLayer"></div><div class="sheet" role="dialog" aria-modal="true" aria-label="${esc(title)}"><div class="sheet-inner">
    <div class="sheet-head"><h2>${esc(title)}</h2><button class="close" data-act="closeLayer" aria-label="סגירה">${svg(P.close, 22, 2.4)}</button></div>${body}</div></div>`);
}
function confirmDialog(title, text, okLabel, onOk) {
  openLayer(`<div class="dialog-wrap" data-act="closeLayer"><section class="dialog" role="alertdialog" aria-label="${esc(title)}" onclick="event.stopPropagation()">
    <h2>${esc(title)}</h2><p>${esc(text)}</p>
    <button class="btn danger solid" id="dlgOk">${esc(okLabel)}</button>
    <button class="btn outline" data-act="closeLayer">ביטול</button></section></div>`, "dialog");
  $("dlgOk").addEventListener("click", async () => { $("dlgOk").disabled = true; try { await onOk(); } finally { if (layerKind === "dialog") closeLayer(); } });
}

function groupsSheet() {
  const list = (profile?.groups || []).map(g => groups[g]).filter(Boolean);
  const remaining = items.filter(i => !i.done).length;
  sheet("הקבוצות שלי", `<div class="stack" style="gap:10px">
    ${list.map(g => {
      const parts = [];
      if (g.id === gid) parts.push(items.length ? `${remaining} נשארו` : "אין מוצרים");
      const n = (g.memberIds || []).length;
      parts.push(n === 1 ? "חבר אחד" : `${n} חברים`);
      if (g.ownerId === me()) parts.push("מנהל");
      return `<button class="group-btn" data-act="openGroup" data-gid="${esc(g.id)}" aria-pressed="${g.id === gid}">${gicon(g)}
        <span class="gt"><b>${esc(g.name)}</b><span>${parts.join(" · ")}</span></span>${g.id === gid ? `<span aria-label="הרשימה הנוכחית">${svg(P.check, 24, 3)}</span>` : ""}</button>`;
    }).join("")}
    <button class="group-btn add-group" data-act="toNewGroup">${svg(P.plus, 22, 2.6)}קבוצה חדשה</button></div>`);
}

let editing = null, editState = {};
function editSheet(it) {
  const q = splitStoredQty(it.qty);
  editState = { cat: CAT[it.cat] ? it.cat : "other", unit: q.unit, n: q.n };
  const units = EDIT_UNITS.includes(q.unit) ? EDIT_UNITS : [...EDIT_UNITS, q.unit];
  sheet("עריכת מוצר", `
    <div class="stack"><label class="label" for="ename">שם המוצר</label><input id="ename" class="field" type="text" maxlength="100" value="${esc(it.name)}"></div>
    <div class="stack"><label class="label" for="eqty">כמות ויחידה</label>
      <div class="qty-row">
        <button class="step" data-act="qtyStep" data-v="-1" aria-label="הפחתת יחידה">${svg(P.minus, 24, 2.6)}</button>
        <input id="eqty" class="field" type="text" inputmode="decimal" value="${esc(q.n)}">
        <button class="step" data-act="qtyStep" data-v="1" aria-label="הוספת יחידה">${svg(P.plus, 24, 2.6)}</button>
      </div>
      <div class="chips" role="radiogroup" aria-label="יחידה">${units.map(u => `<button class="chip" role="radio" data-act="pickUnit" data-v="${esc(u)}" aria-checked="${u === q.unit}">${esc(u)}</button>`).join("")}</div>
    </div>
    <div class="stack"><div class="label-row"><span class="label">קטגוריה</span><small>התיקון נשמר לכל הקבוצה</small></div>
      <div class="cats">${CATS.map(c => `<button class="chip" data-act="pickCat" data-v="${c.id}" aria-pressed="${c.id === editState.cat}" style="--c:${c.c}"><i></i>${c.label}</button>`).join("")}</div>
    </div>
    <button class="btn primary" data-act="saveItem">שמירה</button>
    <button class="btn danger" data-act="deleteItem">מחיקה מהרשימה</button>`);
  editing = it;
}

function installSheet(tab) {
  tab = tab || (isIOS() ? "ios" : "android");
  const steps = tab === "ios"
    ? ["פותחים את האתר ב-Safari", "לוחצים על סמל השיתוף", "בוחרים ״הוספה למסך הבית״", "לוחצים ״הוספה״ למעלה"]
    : ["פותחים את האתר ב-Chrome", "לוחצים על ⋮ בפינה", "בוחרים ״הוספה למסך הבית״ או ״התקנת האפליקציה״", "מאשרים ״התקנה״"];
  sheet("הוספה למסך הבית", `
    <div class="tabs" role="tablist">
      <button role="tab" aria-selected="${tab === "ios"}" data-act="installTab" data-v="ios">אייפון</button>
      <button role="tab" aria-selected="${tab === "android"}" data-act="installTab" data-v="android">אנדרואיד</button>
    </div>
    <ol class="steps">${steps.map((s, n) => `<li><span class="num">${n + 1}</span>${s}</li>`).join("")}</ol>
    ${tab === "ios" ? `<p class="muted" style="font-size:16px">באייפון ההקלטה הקולית עובדת רק בדפדפן Safari, לא מהאייקון.</p>` : ""}
    ${tab === "android" && installPrompt ? `<button class="btn primary" data-act="installNow">התקנה עכשיו</button>` : ""}
    <button class="btn outline" data-act="closeLayer">הבנתי</button>`);
}
let installPrompt = null;
window.addEventListener("beforeinstallprompt", e => { e.preventDefault(); installPrompt = e; });

// ---------- photos ----------
function shrinkPhoto(file) {
  return new Promise((resolve, reject) => {
    const img = new Image(), url = URL.createObjectURL(file);
    img.onload = () => {
      const side = Math.min(img.naturalWidth, img.naturalHeight), out = 160;
      const c = document.createElement("canvas"); c.width = c.height = out;
      c.getContext("2d").drawImage(img, (img.naturalWidth - side) / 2, (img.naturalHeight - side) / 2, side, side, 0, 0, out, out);
      URL.revokeObjectURL(url);
      resolve(c.toDataURL("image/jpeg", 0.8));
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error("bad image")); };
    img.src = url;
  });
}
$("photoFile").addEventListener("change", async () => {
  const f = $("photoFile").files?.[0];
  if (!f || view !== "profile") return;
  try { vd.photo = await shrinkPhoto(f); vd.photoSource = "custom"; vd.name = $("pname")?.value ?? vd.name; render(); }
  catch { toast("לא הצלחתי לקרוא את התמונה. נסו תמונה אחרת.", true); }
});

// ---------- actions ----------
const ACT = {
  reload: () => location.reload(),
  signIn,
  async signOut() { try { await F.auth.signOut(F.au); } catch {} ls.set("gid", null); location.reload(); },
  toMain: () => gid && groups[gid] ? show("main") : pickStart(),
  toProfile: () => show("profile", { first: false, name: profile.name, photo: profile.photo, photoSource: profile.photoSource }),
  async toPeople() {
    const owner = groups[gid]?.ownerId === me(), data = { invites: owner ? null : [] };
    show("people", data);
    if (owner) { try { data.invites = await loadInvites(gid); } catch { data.invites = []; } if (vd === data) render(); }
  },
  toSettings: () => { const g = groups[gid]; show("settings", { name: g.name, color: g.color, icon: g.icon }); },
  toNewGroup: () => show("newGroup", { first: false, name: "", color: GROUP_COLORS[0][0], icon: "people" }),
  openGroup: el => openGroup(el.dataset.gid),
  groups: () => groupsSheet(),
  closeLayer: () => closeLayer(),
  focusInput: () => $("newItem")?.focus(),
  pickPhoto: () => { vd.name = $("pname")?.value ?? vd.name; $("photoFile").value = ""; $("photoFile").click(); },
  googlePhoto: () => { vd.name = $("pname")?.value ?? vd.name; vd.photo = profile?.googlePhoto || user?.photoURL || ""; vd.photoSource = vd.photo ? "google" : "none"; render(); },
  install: () => installSheet(),
  installTab: el => installSheet(el.dataset.v),
  async installNow() { if (!installPrompt) return; installPrompt.prompt(); installPrompt = null; closeLayer(); },

  async saveProfile(el) {
    const name = norm($("pname").value).slice(0, 40);
    if (!name) { toast("כתבו שם.", true); $("pname").focus(); return; }
    el.disabled = true;
    const photo = vd.photo || "";
    const patch = { name, photo, photoSource: vd.photoSource || (photo ? "custom" : "none"), googlePhoto: user.photoURL || profile?.googlePhoto || "" };
    try {
      if (vd.first) {
        await F.fs.setDoc(d("users", me()), { ...patch, email: user.email || "", groups: [], createdAt: F.fs.serverTimestamp() }, { merge: true });
      } else {
        await saveProfile(patch);
        toast("נשמר");
        ACT.toMain();
      }
    } catch (e) { console.error(e); toast("השמירה לא הצליחה. בדקו חיבור ונסו שוב.", true); el.disabled = false; }
  },

  pickColor: el => { vd.color = el.dataset.v; vd.name = $("gname").value; render(); },
  pickIcon: el => { vd.icon = el.dataset.v; vd.name = $("gname").value; render(); },
  async createGroup(el) {
    const name = norm($("gname").value).slice(0, 40);
    if (!name) return;
    el.disabled = true;
    try {
      const ref = F.fs.doc(col("groups"));
      const b = F.fs.writeBatch(F.db);
      b.set(ref, { name, color: vd.color, icon: vd.icon, ownerId: me(), memberIds: [me()], createdAt: F.fs.serverTimestamp() });
      b.set(F.fs.doc(ref, "members", me()), { ...myCard(), joinedAt: F.fs.serverTimestamp() });
      b.set(d("users", me()), { groups: F.fs.arrayUnion(ref.id) }, { merge: true });
      await b.commit();
      groups[ref.id] = groups[ref.id] || { id: ref.id, name, color: vd.color, icon: vd.icon, ownerId: me(), memberIds: [me()] };
      ls.set("gid", ref.id);
      const inv = await createInvite(ref.id).catch(() => null);
      show("invite", { gid: ref.id, name, color: vd.color, icon: vd.icon, ...(inv || {}) });
    } catch (e) { console.error(e); toast("לא הצלחתי ליצור את הקבוצה. בדקו חיבור ונסו שוב.", true); el.disabled = false; }
  },
  async saveGroup(el) {
    const name = norm($("gname").value).slice(0, 40);
    if (!name) return;
    el.disabled = true;
    try { await F.fs.updateDoc(d("groups", gid), { name, color: vd.color, icon: vd.icon }); toast("נשמר"); ACT.toPeople(); }
    catch { toast("השמירה לא הצליחה.", true); el.disabled = false; }
  },
  deleteGroup() {
    const g = groups[gid];
    const n = (g.memberIds || []).length;
    confirmDialog("למחוק את הקבוצה?", `הרשימה וכל המוצרים בה יימחקו${n > 1 ? " לכולם" : ""}, ואי אפשר לשחזר.${n > 1 ? ` ${n} החברים בקבוצה יאבדו גישה.` : ""}`, "מחיקת הקבוצה", async () => {
      const g0 = gid;
      try {
        const refs = [];
        for (const sub of ["items", "members", "meta"]) (await F.fs.getDocs(col("groups", g0, sub))).docs.forEach(x => refs.push(x.ref));
        (await F.fs.getDocs(F.fs.query(col("invites"), F.fs.where("createdBy", "==", me()), F.fs.where("groupId", "==", g0)))).docs.forEach(x => refs.push(x.ref));
        for (let n = 0; n < refs.length; n += 400) { const b = F.fs.writeBatch(F.db); refs.slice(n, n + 400).forEach(r => b.delete(r)); await b.commit(); }
        curSubs.forEach(u => u()); curSubs = []; gid = null;
        const b = F.fs.writeBatch(F.db);
        b.delete(d("groups", g0));
        b.update(d("users", me()), { groups: F.fs.arrayRemove(g0) });
        await b.commit();
        profile.groups = (profile.groups || []).filter(x => x !== g0);
        toast("הקבוצה נמחקה");
        pickStart();
      } catch (e) { console.error(e); toast("המחיקה לא הושלמה. נסו שוב.", true); }
    });
  },
  leaveGroup() {
    const g = groups[gid];
    confirmDialog("לצאת מהקבוצה?", `הקבוצה "${g.name}" תיעלם מהרשימות שלכם. כדי לחזור, מישהו מהקבוצה יצטרך להזמין אתכם שוב.`, "יציאה מהקבוצה", async () => {
      const g0 = gid;
      try {
        const b = F.fs.writeBatch(F.db);
        b.update(d("groups", g0), { memberIds: F.fs.arrayRemove(me()) });
        b.delete(d("groups", g0, "members", me()));
        b.update(d("users", me()), { groups: F.fs.arrayRemove(g0) });
        curSubs.forEach(u => u()); curSubs = []; gid = null;
        await b.commit();
        profile.groups = (profile.groups || []).filter(x => x !== g0);
        toast("יצאתם מהקבוצה");
        pickStart();
      } catch (e) { console.error(e); toast("היציאה לא הצליחה. נסו שוב.", true); openGroup(g0); }
    });
  },
  removeMember(el) {
    const u = el.dataset.uid, m = members[u];
    const who = m?.name || "החבר";
    confirmDialog(`להוציא את ${who}?`, `הקבוצה והרשימה ייעלמו מהטלפון של ${who} מיד. אפשר להזמין שוב בקישור חדש.`, "הוצאה מהקבוצה", async () => {
      try {
        const b = F.fs.writeBatch(F.db);
        b.update(d("groups", gid), { memberIds: F.fs.arrayRemove(u) });
        b.delete(d("groups", gid, "members", u));
        await b.commit();
      } catch { toast("ההוצאה לא הצליחה.", true); }
    });
  },
  async newInvite(el) {
    el.disabled = true;
    const g = view === "invite" ? vd.gid : gid;
    try {
      const inv = await createInvite(g);
      if (view === "invite") { Object.assign(vd, inv); render(); }
      else { vd.invites = await loadInvites(g); render(); shareInvite(inv.code); }
    } catch (e) { console.error(e); toast("לא הצלחתי ליצור קישור.", true); el.disabled = false; }
  },
  copyInvite: el => copyText(inviteUrl(el.dataset.code)),
  shareInvite: el => shareInvite(el.dataset.code),
  async revokeInvite(el) {
    try {
      await F.fs.updateDoc(d("invites", el.dataset.code), { revoked: true });
      toast("הקישור בוטל");
      if (view === "invite") { delete vd.code; render(); }
      else { vd.invites = (vd.invites || []).filter(i => i.code !== el.dataset.code); render(); }
    } catch { toast("הביטול לא הצליח.", true); }
  },
  askNewLink: async () => {
    const t = "הקישור לרשימת הקניות כבר לא עובד. אפשר קישור חדש?";
    if (navigator.share) { try { await navigator.share({ text: t }); return; } catch (e) { if (e?.name === "AbortError") return; } }
    copyText(t);
  },
  copyAsk: () => copyText("הקישור לרשימת הקניות כבר לא עובד. אפשר קישור חדש?"),
  leaveInvalid: () => user && profile ? pickStart() : show("login"),

  // list
  async toggle(el) {
    const id = el.closest("[data-id]").dataset.id, it = items.find(i => i.id === id);
    if (!it) return;
    const done = !it.done;
    try { await F.fs.updateDoc(d("groups", gid, "items", id), done ? { done, doneAt: Date.now(), doneBy: me() } : { done, doneAt: 0 }); }
    catch { toast("הסימון לא נשמר. נסו שוב.", true); }
  },
  edit(el) { const it = items.find(i => i.id === el.closest("[data-id]").dataset.id); if (it) editSheet(it); },
  async clearCart() {
    if (!confirmClear) { confirmClear = true; refreshMain(); setTimeout(() => { if (confirmClear) { confirmClear = false; refreshMain(); } }, 4000); return; }
    confirmClear = false;
    const b = F.fs.writeBatch(F.db);
    items.filter(i => i.done).forEach(i => b.delete(d("groups", gid, "items", i.id)));
    try { await b.commit(); } catch { toast("הניקוי לא הצליח.", true); }
  },
  qtyStep(el) {
    const inp = $("eqty"), v = parseFloat(String(inp.value).replace(",", ".")) || 0;
    const step = editState.unit === "גרם" ? 100 : 1;
    inp.value = String(Math.max(0, v + Number(el.dataset.v) * step)).replace(/^0$/, "");
  },
  pickUnit(el) { editState.unit = el.dataset.v; document.querySelectorAll('[data-act="pickUnit"]').forEach(b => b.setAttribute("aria-checked", String(b === el))); },
  pickCat(el) { editState.cat = el.dataset.v; document.querySelectorAll('[data-act="pickCat"]').forEach(b => b.setAttribute("aria-pressed", String(b === el))); },
  async saveItem() {
    const it = editing; if (!it) return;
    const name = norm($("ename").value).slice(0, 100) || it.name;
    const patch = { name, qty: joinQty($("eqty").value, editState.unit), cat: editState.cat };
    closeLayer();
    try {
      await F.fs.updateDoc(d("groups", gid, "items", it.id), patch);
      if (editState.cat !== it.cat || name !== it.name) {
        learned[key(name)] = editState.cat;
        await F.fs.setDoc(d("groups", gid, "meta", "learned"), { map: { [key(name)]: editState.cat } }, { merge: true });
      }
    } catch { toast("השינוי לא נשמר. נסו שוב.", true); }
  },
  async deleteItem() {
    const it = editing; if (!it) return;
    closeLayer();
    try { await F.fs.deleteDoc(d("groups", gid, "items", it.id)); } catch { toast("המחיקה לא נשמרה.", true); }
  },
  joinParts: el => joinParts(+el.dataset.n),
  mic: () => startMic(),
  recStop: () => { try { rec?.stop(); } catch {} },
  recCancel: () => { recCancelled = true; try { rec?.abort(); } catch {} closeLayer(); },
  closePanel: () => { panel = null; updatePreview(); },
};

document.addEventListener("click", e => {
  const el = e.target.closest("[data-act]");
  if (!el || el.disabled) return;
  const fn = ACT[el.dataset.act];
  if (fn) { e.preventDefault(); fn(el); }
});
document.addEventListener("input", e => {
  if (e.target.id === "gname") { const b = $("ctaGroup"); if (b) b.disabled = !norm(e.target.value); }
});
document.addEventListener("keydown", e => {
  if (e.key === "Escape" && layerKind && layerKind !== "rec") closeLayer();
  if (e.key === "Enter" && e.target.id === "pname") { e.preventDefault(); $("app").querySelector('[data-act="saveProfile"]')?.click(); }
  if (e.key === "Enter" && e.target.id === "gname") { e.preventDefault(); $("ctaGroup")?.click(); }
});

// ---------- start ----------
(async () => {
  captureInvite();
  if ("serviceWorker" in navigator && location.protocol === "https:") navigator.serviceWorker.register("sw.js").catch(() => {});
  try { await loadFirebase(); }
  catch (e) { console.error(e); show("error", { msg: "לא הצלחתי להתחבר. בדקו חיבור לאינטרנט ורעננו." }); return; }
  try { await F.auth.getRedirectResult(F.au); } catch (e) { if (e?.code && !/no-auth-event/.test(e.code)) toast("הכניסה לא הצליחה. נסו שוב.", true); }
  F.auth.onAuthStateChanged(F.au, onUser);
})();
