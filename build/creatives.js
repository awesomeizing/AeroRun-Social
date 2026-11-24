// Renders every creative to PNG at native Instagram sizes, plus contact sheets.
// Usage: node creatives.js
const fs = require("fs");
const path = require("path");
const puppeteer = require("puppeteer-core");
const C = require("./content");

const ROOT = path.resolve(__dirname, "..", "creatives");
const CHROME = ["C:/Program Files/Google/Chrome/Application/chrome.exe", "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe"].find(fs.existsSync);

const INK = "#101217", NAVY = "#1b2340", ORANGE = "#ff4f2e", MIST = "#f4f6f9", SOFT = "#ffe9e3";
const COLOURWAYS = {
  Ember: { body: "#ffffff", line: INK, accent: ORANGE, tile: "#fff1ec", word: "Loud" },
  Midnight: { body: NAVY, line: "#ffffff", accent: "#9db0ff", tile: "#dfe5fb", word: "Calm" },
  Chalk: { body: "#ecebe6", line: INK, accent: "#7b828f", tile: "#f1f1ee", word: "Clean" },
  Sage: { body: "#b9c8b0", line: INK, accent: "#2f5d50", tile: "#e6eee1", word: "Easy" },
};

// Stylised AeroRun side profile (same drawing as Project 01). Aero lines are the motif; there is deliberately no swoosh.
const shoe = (w, cw = COLOURWAYS.Ember, extra = "") => `
<svg width="${w}" viewBox="0 0 400 175" xmlns="http://www.w3.org/2000/svg" ${extra}>
  <path d="M30 128 L40 76 Q44 62 60 64 L100 72 Q118 74 128 60 L160 32 Q171 24 183 31 L250 82 Q300 102 352 110 Q386 116 389 130 Z" fill="${cw.body}" stroke="${cw.line}" stroke-width="3" stroke-linejoin="round"/>
  <path d="M22 128 L390 128 Q394 150 372 154 L36 154 Q18 152 22 128 Z" fill="#f4f6f9" stroke="${cw.line}" stroke-width="3" stroke-linejoin="round"/>
  <path d="M36 154 L372 154 Q386 154 388 146" fill="none" stroke="${cw.line}" stroke-width="6" stroke-linecap="round"/>
  <path d="M70 112 Q170 70 330 112" fill="none" stroke="${cw.accent}" stroke-width="7" stroke-linecap="round"/>
  <path d="M95 100 Q180 66 300 98" fill="none" stroke="${cw.accent}" stroke-width="4" stroke-linecap="round" opacity=".7"/>
  <path d="M120 88 Q190 62 270 86" fill="none" stroke="${cw.accent}" stroke-width="2.5" stroke-linecap="round" opacity=".45"/>
  ${[0, 1, 2, 3, 4].map((i) => `<line x1="${180 + i * 14}" y1="${40 + i * 10}" x2="${170 + i * 14}" y2="${52 + i * 10}" stroke="${cw.line}" stroke-width="3" stroke-linecap="round"/>`).join("")}
  <rect x="28" y="70" width="10" height="26" rx="4" fill="${cw.accent}"/>
</svg>`;

const aeroLines = (w, h, color = ORANGE, op = 1) => `
<svg class="aero" width="${w}" height="${h}" viewBox="0 0 1080 600" preserveAspectRatio="none" style="opacity:${op}">
  <path d="M-40 520 Q520 120 1120 420" fill="none" stroke="${color}" stroke-width="26" stroke-linecap="round"/>
  <path d="M-40 560 Q520 210 1120 470" fill="none" stroke="${color}" stroke-width="14" stroke-linecap="round" opacity=".65"/>
  <path d="M-40 595 Q520 290 1120 515" fill="none" stroke="${color}" stroke-width="7" stroke-linecap="round" opacity=".4"/>
</svg>`;

const camera = `<svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M4 7h3l2-2h6l2 2h3v12H4z"/><circle cx="12" cy="13" r="3.5"/></svg>`;
const photoZone = (label, style = "") => `<div class="photo" style="${style}">${camera}<div>PHOTO / VIDEO ZONE</div><small>${label}</small></div>`;

const nl = (s) => s.replace(/\n/g, "<br>");
const mark = (color = "#fff") => `<div class="mark" style="color:${color}">AERORUN<svg width="70" height="22" viewBox="0 0 70 22"><path d="M2 18 Q35 2 68 14" stroke="${ORANGE}" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M8 21 Q35 9 62 18" stroke="${ORANGE}" stroke-width="2.5" fill="none" stroke-linecap="round" opacity=".6"/></svg></div>`;
const disc = (color = "rgba(255,255,255,.55)") => `<div class="disc" style="color:${color}">Independent fictional concept · not an official Nike ad</div>`;

const CSS = `
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Space+Grotesk:wght@500;600;700&display=swap");
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:Inter,Arial,sans-serif;-webkit-font-smoothing:antialiased}
.f{position:relative;overflow:hidden}
.p{width:1080px;height:1350px}.s{width:1080px;height:1920px}
.h{font-family:"Space Grotesk",Arial,sans-serif;font-weight:700;letter-spacing:-.025em;line-height:.98}
.mark{position:absolute;top:64px;left:72px;font:700 34px "Space Grotesk";letter-spacing:.14em;display:flex;align-items:center;gap:12px;z-index:5}
.disc{position:absolute;bottom:44px;left:72px;font:500 22px Inter;letter-spacing:.02em;z-index:5}
.kick{font:700 26px Inter;letter-spacing:.16em;text-transform:uppercase}
.aero{position:absolute;left:0}
.chip{display:inline-block;padding:18px 30px;border-radius:999px;font:700 32px Inter}
.photo{position:absolute;border-radius:36px;background:linear-gradient(140deg,#2b3354,#141722 70%);color:rgba(255,255,255,.75);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;text-align:center;font:700 24px Inter;letter-spacing:.18em;border:3px dashed rgba(255,255,255,.25);padding:40px}
.photo small{font:500 24px Inter;letter-spacing:0;max-width:80%;opacity:.8;line-height:1.35}
.stk{background:#fff;color:${INK};border-radius:28px;box-shadow:0 12px 40px rgba(0,0,0,.25);padding:30px;font:700 34px Inter}
.opt{border:3px solid #e4e7ec;border-radius:20px;padding:22px 26px;margin-top:16px;font:600 32px Inter}
`;

const doc = (body, cls) => `<!doctype html><html><head><meta charset="utf-8"><style>${CSS}</style></head><body><div class="f ${cls}">${body}</div></body></html>`;

// ---------------- POSTS ----------------
const post = {
  tease: (c) => `<div style="position:absolute;inset:0;background:${INK}"></div>${mark()}
    <div class="kick" style="position:absolute;top:70px;right:72px;color:${ORANGE};font-size:34px">15.01</div>
    <div style="top:330px">${aeroLines(1080, 600).replace('class="aero"', 'class="aero" style="top:330px"')}</div>
    <div class="h" style="position:absolute;left:72px;bottom:150px;color:#fff;font-size:132px">${nl(c.headline)}</div>${disc()}`,
  silhouette: (c) => `<div style="position:absolute;inset:0;background:radial-gradient(circle at 60% 45%,#24305a,#07080c 65%)"></div>${mark()}
    <div style="position:absolute;left:-60px;top:330px;filter:drop-shadow(0 0 30px rgba(255,79,46,.35))">${shoe(1240, { body: "#0b0d14", line: "#3a4570", accent: ORANGE })}</div>
    <div class="h" style="position:absolute;left:72px;bottom:230px;color:#fff;font-size:120px">${nl(c.headline)}</div>
    <div style="position:absolute;left:72px;bottom:130px;display:flex;gap:22px">${Object.values(COLOURWAYS).map((w) => `<span style="width:56px;height:56px;border-radius:50%;background:${w.body === "#ffffff" ? ORANGE : w.body};border:4px solid rgba(255,255,255,.4)"></span>`).join("")}<span style="color:#fff;font:600 30px Inter;align-self:center;margin-left:10px">4 colourways · 1 hint below</span></div>${disc()}`,
  hero: (c) => `<div style="position:absolute;inset:0;background:#fff"></div>${mark(INK)}
    <div style="position:absolute;top:640px;left:0;width:1080px">${aeroLines(1080, 380, ORANGE, 0.12).replace('class="aero"', 'class="aero" style="position:relative"')}</div>
    <div class="h" style="position:absolute;left:72px;top:190px;color:${INK};font-size:104px">${nl(c.headline)}</div>
    <div style="position:absolute;left:30px;top:520px">${shoe(1020)}</div>
    <div style="position:absolute;left:72px;bottom:130px;display:flex;gap:20px"><span class="chip" style="background:${INK};color:#fff">₹5,999</span><span class="chip" style="background:${SOFT};color:${ORANGE}">Official store · Free size exchange</span></div>${disc("#8a90a0")}`,
  colourways: (c) => `<div style="position:absolute;inset:0;background:${MIST}"></div>${mark(INK)}
    <div class="h" style="position:absolute;left:72px;top:160px;font-size:104px;color:${INK}">${nl(c.headline)}</div>
    <div style="position:absolute;left:72px;top:440px;right:72px;display:grid;grid-template-columns:1fr 1fr;gap:28px">
    ${Object.entries(COLOURWAYS).map(([n, w]) => `<div style="background:${w.tile};border-radius:32px;height:360px;padding:30px;position:relative">${shoe(400, w)}<div class="h" style="position:absolute;left:30px;bottom:30px;font-size:48px;color:${INK}">${n}</div><div style="position:absolute;right:30px;bottom:38px;font:600 30px Inter;color:#6b7280">${w.word}</div></div>`).join("")}</div>${disc("#8a90a0")}`,
  ladder: (c) => `<div style="position:absolute;inset:0;background:${INK}"></div>${mark()}
    <div class="h" style="position:absolute;left:72px;top:190px;color:#fff;font-size:128px">${nl(c.headline)}</div>
    <div style="position:absolute;left:72px;right:72px;top:620px;font:600 32px Inter;color:#c9d1ea">
      <div style="margin-bottom:14px">The iconic looks everyone wants</div><div style="height:90px;width:100%;background:#3a4157;border-radius:16px;display:flex;align-items:center;justify-content:flex-end;padding-right:30px;color:#fff;font:700 40px 'Space Grotesk'">₹10,000+</div>
      <div style="margin:44px 0 14px;color:#fff">AeroRun</div><div style="height:90px;width:55%;background:${ORANGE};border-radius:16px;display:flex;align-items:center;justify-content:flex-end;padding-right:30px;color:#fff;font:700 40px 'Space Grotesk'">₹5,999</div>
    </div>
    <div style="position:absolute;left:72px;bottom:130px;color:#fff;font:600 34px Inter">Official store · Free size exchange · No guesswork</div>${disc()}`,
  spec: (c) => `<div style="position:absolute;inset:0;background:${MIST}"></div>${mark(INK)}
    <div class="h" style="position:absolute;left:72px;top:160px;font-size:104px;color:${INK}">${nl(c.headline)}</div>
    <div style="position:absolute;left:120px;top:560px">${shoe(840)}</div>
    ${[["Running-derived foam", 330, 980, 230, 935], ["Breathable knit upper", 520, 470, 470, 650], ["Grippy rubber outsole", 760, 1040, 830, 1000]].map(([t, x, y, lx, ly]) => `<svg style="position:absolute;left:0;top:0" width="1080" height="1350"><line x1="${x}" y1="${y}" x2="${lx}" y2="${ly}" stroke="${ORANGE}" stroke-width="3"/><circle cx="${lx}" cy="${ly}" r="9" fill="${ORANGE}"/></svg><div style="position:absolute;left:${Math.min(x, 700) - 60}px;top:${y + (y > 900 ? 14 : -70)}px;font:700 32px Inter;color:${INK};background:#fff;padding:14px 22px;border-radius:14px">${t}</div>`).join("")}
    <div style="position:absolute;right:72px;top:72px;font:700 22px Inter;color:#6b7280;border:2px solid #c9ced8;border-radius:10px;padding:8px 14px">CONCEPT SPECS · FICTIONAL</div>${disc("#8a90a0")}`,
  trust: (c) => `<div style="position:absolute;inset:0;background:#fff"></div>${mark(INK)}
    <div class="h" style="position:absolute;left:72px;top:170px;font-size:120px;color:${INK}">${nl(c.headline)}</div>
    <div style="position:absolute;right:72px;top:150px;width:220px;height:220px;border-radius:50%;background:${ORANGE};color:#fff;display:flex;flex-direction:column;align-items:center;justify-content:center;font:800 30px Inter;text-align:center;line-height:1.2;transform:rotate(-8deg)">✓<br>OFFICIAL<br>STORE</div>
    <div style="position:absolute;left:72px;right:72px;top:480px;display:grid;gap:26px">
    ${[["Where you buy", "Only the official store and listed partners"], ["What you pay", "₹5,999. If it's ₹1,999, it isn't us"], ["What's in the box", "Authenticity card + size-exchange slip"]].map(([h, t], i) => `<div style="display:flex;gap:30px;align-items:center;background:${MIST};border-radius:28px;padding:34px"><div class="h" style="font-size:80px;color:${ORANGE};width:80px">${i + 1}</div><div><div style="font:800 38px Inter;color:${INK}">${h}</div><div style="font:500 32px Inter;color:#3b4150;margin-top:6px">${t}</div></div></div>`).join("")}</div>
    <div style="position:absolute;left:0;right:0;bottom:110px;background:${INK};color:#fff;padding:30px 72px;font:700 34px Inter">Too cheap to be true? It's not AeroRun.</div>${disc("#8a90a0")}`,
  ugcCall: (c) => `<div style="position:absolute;inset:0;background:${ORANGE}"></div>${mark()}
    <div class="h" style="position:absolute;left:72px;top:170px;color:#fff;font-size:120px">${nl(c.headline)}</div>
    <div style="position:absolute;right:90px;top:200px;width:430px;height:860px;border-radius:56px;background:${INK};padding:22px;transform:rotate(4deg)">${photoZone("Customer's fit photo, shot on their phone", "inset:22px;border-radius:40px")}</div>
    <div style="position:absolute;left:72px;top:520px;background:#fff;color:${INK};padding:26px 34px;border-radius:22px;font:800 44px Inter;transform:rotate(-4deg)">#AeroRunFitCheck</div>
    <div style="position:absolute;left:72px;top:700px;color:#fff;font:600 36px Inter;max-width:460px;line-height:1.35">Post your fit. Tag us. We feature our favourites every Friday.</div>${disc("rgba(255,255,255,.8)")}`,
  noSale: (c) => `<div style="position:absolute;inset:0;background:${NAVY}"></div>${mark()}
    <div class="h" style="position:absolute;left:60px;top:170px;color:rgba(255,255,255,.14);font-size:330px">SALE</div>
    <div style="position:absolute;left:50px;top:330px;width:960px;height:22px;background:${ORANGE};transform:rotate(-6deg)"></div>
    <div class="h" style="position:absolute;left:72px;top:600px;color:#fff;font-size:124px">${nl(c.headline)}</div>
    <div style="position:absolute;left:72px;right:72px;bottom:140px;background:#fff;border-radius:32px;padding:40px;display:flex;align-items:center;gap:34px"><div style="font-size:90px">⇄</div><div><div style="font:800 42px Inter;color:${INK}">Free size exchange</div><div style="font:500 32px Inter;color:#3b4150;margin-top:6px">On every AeroRun. Order without stressing about fit.</div></div></div>${disc()}`,
  ugcFeature: (c) => `<div style="position:absolute;inset:0;background:${MIST}"></div>${mark(INK)}
    <div class="h" style="position:absolute;left:72px;top:160px;font-size:96px;color:${INK}">${nl(c.headline)}</div>
    <div style="position:absolute;left:150px;top:420px;width:780px;height:760px;background:#fff;border-radius:18px;padding:34px 34px 120px;box-shadow:0 24px 60px rgba(16,18,23,.15);transform:rotate(-2.5deg)">${photoZone("Real customer post, featured only with written permission", "position:relative;width:100%;height:100%;border-radius:8px")}<div style="position:absolute;left:34px;bottom:36px;font:700 34px Inter;color:${INK}">@[customer handle] · [city]</div></div>
    <div style="position:absolute;right:110px;top:380px;background:${ORANGE};color:#fff;font:800 32px Inter;padding:20px 30px;border-radius:999px;transform:rotate(8deg)">FEATURED</div>${disc("#8a90a0")}`,
  review: (c) => `<div style="position:absolute;inset:0;background:#fff"></div>${mark(INK)}
    <div class="h" style="position:absolute;left:72px;top:160px;font-size:104px;color:${INK}">${nl(c.headline)}</div>
    <div style="position:absolute;left:72px;right:72px;top:440px;display:grid;gap:26px">
    ${[1, 2, 3].map((i) => `<div style="background:${MIST};border-radius:28px;padding:34px 38px"><div style="color:${ORANGE};font-size:40px;letter-spacing:6px">★★★★★</div><div style="font:600 34px Inter;color:#8a90a0;margin-top:12px;font-style:italic">[Real buyer review ${i}: quoted word for word, with permission]</div><div style="font:700 26px Inter;color:#0f7b5a;margin-top:14px">✓ VERIFIED BUYER · [CITY]</div></div>`).join("")}</div>
    <div style="position:absolute;right:72px;top:80px;font:700 22px Inter;color:${ORANGE};border:2px solid ${ORANGE};border-radius:10px;padding:8px 14px">TEMPLATE · NO REAL REVIEWS YET</div>${disc("#8a90a0")}`,
  gift: (c) => `<div style="position:absolute;inset:0;background:${SOFT}"></div>${mark(INK)}
    <div class="h" style="position:absolute;left:72px;top:170px;font-size:140px;color:${INK}">${nl(c.headline)}</div>
    <div style="position:absolute;left:160px;top:720px;width:760px;height:380px;background:${ORANGE};border-radius:20px"></div>
    <div style="position:absolute;left:130px;top:680px;width:820px;height:90px;background:#e0401f;border-radius:16px"></div>
    <div style="position:absolute;left:180px;top:470px;transform:rotate(-8deg)">${shoe(700)}</div>
    <div style="position:absolute;left:510px;top:720px;width:60px;height:380px;background:#fff;opacity:.85"></div>
    <div style="position:absolute;right:90px;top:430px;background:#fff;border-radius:18px;padding:24px 30px;font:700 30px Inter;color:${INK};transform:rotate(6deg);box-shadow:0 10px 30px rgba(0,0,0,.12)">For the one with<br>the best fits ♥</div>
    <div style="position:absolute;left:72px;bottom:130px;font:600 34px Inter;color:${INK}">Gift-ready box · Free size exchange · ₹5,999</div>${disc("#8a90a0")}`,
};

// ---------------- REEL COVERS ----------------
const reelBg = [INK, NAVY, ORANGE, INK, NAVY, ORANGE, INK, NAVY];
const reelCover = (c, i) => {
  const bg = reelBg[i % reelBg.length], cr = c.creator && C.creators.find((x) => x.id === c.creator);
  const visual = cr
    ? photoZone(`Creator footage: ${cr.niche.toLowerCase()} creator, ${cr.city}`, "left:72px;right:72px;top:330px;height:760px")
    : `<div style="position:absolute;left:40px;top:520px">${shoe(1000, bg === ORANGE ? { ...COLOURWAYS.Ember, accent: INK } : COLOURWAYS.Ember)}</div>`;
  return `<div style="position:absolute;inset:0;background:${bg}"></div>${mark()}
    <div style="position:absolute;top:150px;left:72px;display:flex;gap:16px"><span class="chip" style="background:rgba(255,255,255,.15);color:#fff;font-size:26px;padding:12px 24px">▶ REEL · ${c.len}</span>${cr ? `<span class="chip" style="background:#fff;color:${INK};font-size:26px;padding:12px 24px">Paid partnership · @creator_handle</span>` : ""}</div>
    ${visual}
    <div class="h" style="position:absolute;left:72px;right:72px;top:1150px;color:#fff;font-size:118px">${nl(c.headline)}</div>
    <div style="position:absolute;left:72px;right:72px;top:1600px;height:2px;background:rgba(255,255,255,.18)"></div>
    <div style="position:absolute;left:72px;top:1625px;color:rgba(255,255,255,.55);font:500 22px Inter">Keep clear: Instagram UI zone below this line</div>
    ${disc()}`;
};

// ---------------- STORIES ----------------
const sticker = (s) => {
  if (!s) return "";
  const box = (inner, w = 760) => `<div class="stk" style="position:absolute;left:${(1080 - w) / 2}px;width:${w}px;top:1160px">${inner}</div>`;
  if (s.type === "poll") return box(`${s.q ? `<div style="text-align:center;margin-bottom:6px">${s.q}</div>` : ""}<div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">${s.opts.map((o) => `<div class="opt" style="text-align:center;color:${ORANGE}">${o}</div>`).join("")}</div>`);
  if (s.type === "quiz") return box(`<div style="background:${ORANGE};color:#fff;margin:-30px -30px 10px;padding:24px 30px;border-radius:28px 28px 0 0;text-align:center">${s.q}</div>${s.opts.map((o, i) => `<div class="opt"><b style="color:${ORANGE}">${"ABC"[i]}</b>&nbsp; ${o}</div>`).join("")}`);
  if (s.type === "countdown") return box(`<div style="text-align:center;color:#6b7280;font-size:28px">${s.q.toUpperCase()}</div><div class="h" style="text-align:center;font-size:84px;margin:14px 0">${s.opts[0]}</div><div style="text-align:center;background:${ORANGE};color:#fff;border-radius:16px;padding:18px">🔔 Remind me</div>`);
  if (s.type === "link") return `<div style="position:absolute;left:50%;transform:translateX(-50%);top:1260px;background:#fff;color:${INK};border-radius:22px;padding:28px 44px;font:800 36px Inter;box-shadow:0 12px 40px rgba(0,0,0,.25);white-space:nowrap">🔗 ${s.opts[0]}</div>`;
  if (s.type === "question") return box(`<div style="background:${ORANGE};color:#fff;margin:-30px -30px 20px;padding:26px 30px;border-radius:28px 28px 0 0;text-align:center">${s.q}</div><div style="background:${MIST};border-radius:16px;padding:22px;color:#8a90a0;font-weight:500;text-align:center">Type something…</div>`);
  if (s.type === "slider") return box(`<div style="height:14px;border-radius:7px;background:linear-gradient(90deg,#ffd2c7,${ORANGE});margin:30px 10px;position:relative"><span style="position:absolute;left:68%;top:-40px;font-size:80px">🥵</span></div>`);
  return "";
};
const storyFrame = (c, f, i) => {
  const light = f.light, bg = light ? "#fff" : c.id === "S05" ? ORANGE : i === 2 && c.id === "S03" ? NAVY : INK, fg = light ? INK : "#fff";
  return `<div style="position:absolute;inset:0;background:${bg}"></div>
    <div style="position:absolute;top:40px;left:40px;right:40px;display:flex;gap:10px">${[0, 1, 2].map((k) => `<span style="flex:1;height:6px;border-radius:3px;background:${k <= i ? fg : light ? "#d0d5dd" : "rgba(255,255,255,.3)"}"></span>`).join("")}</div>
    ${mark(fg).replace("top:64px", "top:90px")}
    ${f.photo ? photoZone("Creator selfie video, takeover day", "left:72px;right:72px;top:240px;height:560px") : `<div style="position:absolute;top:${light ? 300 : 220}px;left:0;width:1080px">${light ? `<div style="padding-left:40px">${shoe(1000)}</div>` : aeroLines(1080, 420, bg === ORANGE ? "#fff" : ORANGE, 0.9).replace('class="aero"', 'class="aero" style="position:relative"')}</div>`}
    <div class="kick" style="position:absolute;left:72px;top:${f.photo ? 850 : light ? 840 : 690}px;color:${bg === ORANGE ? "#fff" : ORANGE}">${f.k}</div>
    <div class="h" style="position:absolute;left:72px;right:72px;top:${f.photo ? 900 : light ? 890 : 740}px;color:${fg};font-size:${f.photo ? 110 : 128}px">${nl(f.h)}</div>
    ${light ? `<div style="position:absolute;left:72px;top:1110px;display:flex;gap:18px"><span class="chip" style="background:${INK};color:#fff">₹5,999</span><span class="chip" style="background:${SOFT};color:${ORANGE}">4 colourways · Free size exchange</span></div>` : ""}
    ${f.sub ? `<div style="position:absolute;left:72px;top:1180px;color:${fg};font:600 36px Inter;opacity:.85">${f.sub}</div>` : ""}
    ${sticker(f.sticker)}
    ${disc(light ? "#8a90a0" : "rgba(255,255,255,.55)").replace("bottom:44px", "bottom:90px")}`;
};

// ---------------- CAROUSELS ----------------
const carouselExtra = {
  C02: { 2: ["Chalk", "Wide trousers · white tee · tote"], 3: ["Sage", "Straight denim · overshirt · cap"], 4: ["Midnight", "Black-on-black · silver accessories"] },
  C03: { 2: "Most people take their usual size. Not sure? Size exchange is free.", 3: "Running-derived foam (concept spec) made for long days. Watch our creators' honest tests.", 4: "Only from the official store and listed partners. Too cheap = not real." },
};
const carouselSlide = (c, s, i) => {
  const [num, text] = s, n = i + 1, last = n === c.slides.length;
  if (c.id === "C01") {
    const dark = n % 2 === 1;
    return `<div style="position:absolute;inset:0;background:${dark ? INK : "#fff"}"></div>${mark(dark ? "#fff" : INK)}
      <div style="position:absolute;left:${-i * 0}px;top:820px;width:1080px">${aeroLines(1080, 400, ORANGE, dark ? 1 : 0.9).replace('class="aero"', 'class="aero" style="position:relative"')}</div>
      <div class="kick" style="position:absolute;left:72px;top:250px;color:${ORANGE}">${num} / 05</div>
      <div class="h" style="position:absolute;left:72px;right:72px;top:310px;color:${dark ? "#fff" : INK};font-size:${n === 1 ? 128 : 96}px">${nl(text)}</div>
      ${n === 4 ? `<div style="position:absolute;right:40px;top:640px">${shoe(560)}</div>` : ""}
      ${!last ? `<div style="position:absolute;right:72px;top:72px;font:700 30px Inter;color:${dark ? "#fff" : INK}">Swipe →</div>` : ""}${disc(dark ? "rgba(255,255,255,.55)" : "#8a90a0")}`;
  }
  if (c.id === "C02") {
    const ex = carouselExtra.C02[n];
    if (!ex) return `<div style="position:absolute;inset:0;background:${n === 1 ? ORANGE : INK}"></div>${mark()}
      <div class="kick" style="position:absolute;left:72px;top:250px;color:${n === 1 ? "#fff" : ORANGE}">${num} / 05</div>
      <div class="h" style="position:absolute;left:72px;right:72px;top:310px;color:#fff;font-size:140px">${nl(text)}</div>
      <div style="position:absolute;left:60px;top:${n === 1 ? 760 : 720}px">${shoe(960, n === 1 ? { ...COLOURWAYS.Ember, accent: INK } : COLOURWAYS.Ember)}</div>${disc("rgba(255,255,255,.7)")}`;
    const w = COLOURWAYS[ex[0]];
    return `<div style="position:absolute;inset:0;background:${MIST}"></div>${mark(INK)}
      <div class="kick" style="position:absolute;left:72px;top:170px;color:${ORANGE}">${num} / 05</div>
      <div class="h" style="position:absolute;left:72px;right:72px;top:220px;color:${INK};font-size:84px">${nl(text)}</div>
      ${photoZone("Flat-lay: " + ex[1], "left:72px;right:72px;top:480px;height:520px")}
      <div style="position:absolute;left:72px;top:1040px;display:flex;align-items:center;gap:24px;background:#fff;border-radius:24px;padding:20px 30px">${shoe(220, w)}<div><div style="font:800 34px Inter;color:${INK}">${ex[0]}</div><div style="font:500 28px Inter;color:#3b4150">${ex[1]}</div></div></div>${disc("#8a90a0")}`;
  }
  // C03 FAQ
  const ans = carouselExtra.C03[n];
  return `<div style="position:absolute;inset:0;background:${n === 1 || last ? NAVY : "#fff"}"></div>${mark(n === 1 || last ? "#fff" : INK)}
    <div class="h" style="position:absolute;right:30px;top:120px;font-size:520px;color:${n === 1 || last ? "rgba(255,255,255,.07)" : MIST}">?</div>
    <div class="kick" style="position:absolute;left:72px;top:250px;color:${ORANGE}">${n === 1 ? "HONEST FAQ" : last ? "BOTTOM LINE" : "Q" + (n - 1)} · ${num} / 05</div>
    <div class="h" style="position:absolute;left:72px;right:72px;top:310px;color:${n === 1 || last ? "#fff" : INK};font-size:${n === 1 ? 140 : 100}px">${nl(text)}</div>
    ${ans ? `<div style="position:absolute;left:72px;right:72px;top:720px;background:${MIST};border-radius:32px;padding:44px;font:600 44px/1.35 Inter;color:${INK}"><span style="color:${ORANGE};font-weight:800">A.</span> ${ans}</div>` : ""}
    ${n === 1 ? `<div style="position:absolute;left:72px;top:760px;color:#c9d1ea;font:600 40px Inter">Your top questions, answered honestly →</div>` : ""}
    ${last ? `<div style="position:absolute;left:72px;top:720px"><span class="chip" style="background:${ORANGE};color:#fff;font-size:40px">Shop via link in bio</span></div>` : ""}${disc(n === 1 || last ? "rgba(255,255,255,.55)" : "#8a90a0")}`;
};

// ---------------- RENDER ----------------
function jobs() {
  const out = [];
  for (const c of C.creatives) {
    if (c.format === "post") out.push({ file: `posts/${c.id}.png`, cls: "p", html: post[c.template](c) });
    if (c.format === "reel") out.push({ file: `reels/${c.id}-cover.png`, cls: "s", html: reelCover(c, C.creatives.filter((x) => x.format === "reel").indexOf(c)) });
    if (c.format === "story") c.frames.forEach((f, i) => out.push({ file: `stories/${c.id}-${i + 1}.png`, cls: "s", html: storyFrame(c, f, i) }));
    if (c.format === "carousel") c.slides.forEach((s, i) => out.push({ file: `carousels/${c.id}-${i + 1}.png`, cls: "p", html: carouselSlide(c, s, i) }));
  }
  return out;
}

function contactSheets() {
  const rel = (f) => "../creatives/" + f;
  const feed = C.creatives.filter((c) => c.format !== "story").sort((a, b) => b.day - a.day || a.id.localeCompare(b.id));
  const thumb = (c) => c.format === "post" ? `posts/${c.id}.png` : c.format === "reel" ? `reels/${c.id}-cover.png` : `carousels/${c.id}-1.png`;
  const label = (c) => `${c.id} · Day ${c.day}`;
  const page = (title, sub, inner, w) => `<!doctype html><html><head><meta charset="utf-8"><style>${CSS}body{background:#fff}.wrap{width:${w}px;padding:70px;font-family:Inter}.t{font:700 64px "Space Grotesk";color:${INK}}.sub{font:500 26px Inter;color:#6b7280;margin:10px 0 40px}.cap{font:600 22px Inter;color:#3b4150;margin-top:10px}</style></head><body><div class="wrap"><div class="kick" style="color:${ORANGE}">AeroRun · 30-day social campaign · independent fictional concept</div><div class="t">${title}</div><div class="sub">${sub}</div>${inner}</div></body></html>`;
  const grid = page("The month on the grid", "Profile view, newest first. Reels and carousels shown by cover / first slide.",
    `<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px">${feed.map((c) => `<div><div style="aspect-ratio:4/5;overflow:hidden;background:#000"><img src="${rel(thumb(c))}" style="width:100%;height:100%;object-fit:cover"></div><div class="cap">${label(c)}${c.format === "reel" ? " · Reel" : c.format === "carousel" ? " · Carousel" : ""}</div></div>`).join("")}</div>`, 1400);
  const stories = page("Story sequences", "Five three-frame sequences with interactive stickers.",
    C.creatives.filter((c) => c.format === "story").map((c) => `<div style="display:flex;gap:18px;align-items:flex-start;margin-bottom:34px"><div style="width:240px"><div style="font:800 34px 'Space Grotesk'">${c.id}</div><div class="cap">${c.title}<br>Day ${c.day}</div></div>${[1, 2, 3].map((k) => `<img src="${rel(`stories/${c.id}-${k}.png`)}" style="width:300px;border-radius:18px">`).join("")}</div>`).join(""), 1400);
  const carousels = page("Carousels", "Three five-slide carousels, swipe order left to right.",
    C.creatives.filter((c) => c.format === "carousel").map((c) => `<div style="margin-bottom:34px"><div style="font:800 34px 'Space Grotesk'">${c.id} · ${c.title}</div><div style="display:flex;gap:10px;margin-top:12px">${[1, 2, 3, 4, 5].map((k) => `<img src="${rel(`carousels/${c.id}-${k}.png`)}" style="width:244px">`).join("")}</div></div>`).join(""), 1400);
  return { "overview-feed-grid": grid, "overview-stories": stories, "overview-carousels": carousels };
}

if (require.main === module) (async () => {
  for (const d of ["posts", "reels", "stories", "carousels"]) fs.mkdirSync(path.join(ROOT, d), { recursive: true });
  const browser = await puppeteer.launch({ executablePath: CHROME, headless: true });
  try {
    const page = await browser.newPage();
    for (const j of jobs()) {
      const [w, h] = j.cls === "p" ? [1080, 1350] : [1080, 1920];
      await page.setViewport({ width: w, height: h, deviceScaleFactor: 1 });
      await page.setContent(doc(j.html, j.cls), { waitUntil: "load" });
      await page.evaluateHandle("document.fonts.ready");
      await page.screenshot({ path: path.join(ROOT, j.file), clip: { x: 0, y: 0, width: w, height: h } });
    }
    console.log("frames", jobs().length);
    for (const [name, html] of Object.entries(contactSheets())) {
      const f = path.join(__dirname, `${name}.html`);
      fs.writeFileSync(f, html);
      await page.setViewport({ width: 1400, height: 1000, deviceScaleFactor: 1 });
      await page.goto("file:///" + f.replace(/\\/g, "/"), { waitUntil: "load" });
      await page.evaluateHandle("document.fonts.ready");
      await page.screenshot({ path: path.join(ROOT, `${name}.png`), fullPage: true });
      console.log("sheet", name);
    }
  } finally {
    await browser.close();
  }
})().catch((e) => { console.error(e); process.exit(1); });

module.exports = { shoe, COLOURWAYS };
