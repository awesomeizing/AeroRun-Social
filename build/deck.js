// Builds AeroRun-Social-Campaign-Deck.pptx (agency-style presentation). Run: node deck.js
const path = require("path");
const pptxgen = require("pptxgenjs");
const { applyTheme } = require("./apply_theme");
const C = require("./content");

const OUT = path.resolve(__dirname, "..", "AeroRun-Social-Campaign-Deck.pptx");
const CR = (f) => path.resolve(__dirname, "..", "creatives", f);
const THEME = {
  name: "AeroRun Social", headFontFace: "Arial", bodyFontFace: "Calibri",
  colors: { dk1: "101217", lt1: "FFFFFF", dk2: "1B2340", lt2: "F4F6F9", accent1: "FF4F2E", accent2: "1B2340", accent3: "6B7A99", accent4: "C9D1EA", accent5: "0F7B5A", accent6: "6A35D4", hlink: "1F4FD1", folHlink: "6A35D4" },
};
const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE";
pres.theme = { headFontFace: THEME.headFontFace, bodyFontFace: THEME.bodyFontFace };
pres.title = "AeroRun 30-Day Social Campaign";
pres.author = "Portfolio Project 02";
const S = pres.SchemeColor;
const DISC = "Independent fictional concept · AeroRun is not a real product · not an official Nike campaign";
const PILLAR_HEX = { style: "FF4F2E", proof: "1B2340", crew: "6A35D4", drop: "0F7B5A" };

pres.defineSlideMaster({
  title: "Dark Title", background: { color: THEME.colors.dk1 },
  objects: [
    { placeholder: { options: { name: "kicker", type: "body", x: 0.7, y: 0.7, w: 11, h: 0.4, fontSize: 12, bold: true, color: S.accent1, charSpacing: 3 }, text: "" } },
    { placeholder: { options: { name: "title", type: "title", x: 0.7, y: 1.5, w: 7.4, h: 2.4, fontSize: 44, bold: true, color: S.background1, valign: "top", align: "left" }, text: "" } },
    { placeholder: { options: { name: "body", type: "body", x: 0.7, y: 4.1, w: 7.0, h: 1.7, fontSize: 17, color: S.accent4, valign: "top" }, text: "" } },
    { text: { text: DISC, options: { x: 0.7, y: 6.9, w: 10, h: 0.3, fontSize: 10, color: S.accent3, isTextBox: true } } },
  ],
});
pres.defineSlideMaster({
  title: "Content", background: { color: THEME.colors.lt1 },
  objects: [
    { placeholder: { options: { name: "kicker", type: "body", x: 0.6, y: 0.35, w: 12, h: 0.35, fontSize: 11, bold: true, color: S.accent1, charSpacing: 2 }, text: "" } },
    { placeholder: { options: { name: "title", type: "title", x: 0.6, y: 0.7, w: 12.1, h: 0.9, fontSize: 28, bold: true, color: S.text1, valign: "top", align: "left" }, text: "" } },
    { text: { text: DISC, options: { x: 0.6, y: 7.0, w: 10.5, h: 0.3, fontSize: 10, color: S.accent3, isTextBox: true } } },
  ],
  slideNumber: { x: 12.2, y: 7.0, w: 0.6, h: 0.3, fontSize: 10, color: THEME.colors.accent3, align: "right" },
});

let section = "";
function slide(master, kicker, title, sec, notes) {
  if (sec !== section) { pres.addSection({ title: sec }); section = sec; }
  const s = pres.addSlide({ masterName: master, sectionTitle: sec });
  s.addText(kicker.toUpperCase(), { placeholder: "kicker" });
  s.addText(title, { placeholder: "title" });
  if (notes) s.addNotes(notes);
  return s;
}
const text = (s, t, o) => s.addText(t, { isTextBox: true, margin: 0, fontSize: 14, color: S.text1, valign: "top", ...o });
const card = (s, x, y, w, h, fill = S.background2, name) => s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w, h, rectRadius: 0.12, fill: { color: fill }, line: { type: "none" }, objectName: name });
const pic = (s, f, x, y, w, h, alt) => s.addImage({ path: CR(f), x, y, w, h, altText: alt || f, objectName: f });
const tbl = (s, head, rows, o) => s.addTable([head.map((t) => ({ text: t, options: { bold: true, color: S.background1, fill: { color: S.text2 }, fontSize: 12 } })), ...rows.map((r) => r.map((t, i) => ({ text: String(t), options: { fontSize: 12, bold: i === 0 } })))], { border: { type: "solid", pt: 0.75, color: "E4E7EC" }, valign: "top", margin: 0.07, color: S.text1, ...o });

// 1 Title
{
  const s = slide("Dark Title", "Social media campaign · Portfolio Project 02", "Light on your feet.\nLoud on your feed.", "Opening",
    "Open with the line and the work. This is a 30-day Instagram and Facebook campaign for AeroRun, the fictional sneaker from Project 01, using the same research and positioning. Say upfront that it's an independent fictional concept with no Nike branding.");
  s.addText("A 30-day Instagram and Facebook campaign for AeroRun, a fictional ₹5,999 sneaker. 28 creatives, 5 creators, 1 community.", { placeholder: "body" });
  [["posts/P03.png", 0, 0], ["reels/R02-cover.png", 1, 0], ["posts/P04.png", 0, 1], ["stories/S02-2.png", 1, 1]].forEach(([f, cx, cy]) => {
    const tall = f.includes("reels") || f.includes("stories");
    pic(s, f, 8.5 + cx * 2.25, 0.7 + cy * 3.0, tall ? 1.6 : 2.1, tall ? 2.84 : 2.63);
  });
}

// 2 Challenge
{
  const s = slide("Content", "01 · The challenge", "Reach is easy. Doubt is the problem.", "Strategy",
    "Bridge from Project 01: the research said this buyer is reachable on Instagram but hesitates over price and fakes. So social media can't just be about reach. It has to show the shoe on real people, answer doubts in public and build a community whose posts become proof.");
  const cols = [["Discover", "70% of Gen Z discover brands online (Project 01 research)", "Make the feed the shop window"], ["Doubt", "₹5,999 is a considered buy; fakes are a real fear", "Prove comfort, value and authenticity in public"], ["Trust", "Creators and customers are believed more than brands", "Hand the stage to creators and UGC"]];
  cols.forEach(([h, a, b], i) => {
    const x = 0.6 + i * 4.1;
    card(s, x, 1.9, 3.85, 4.3, i === 1 ? S.accent1 : S.background2, `challenge ${h}`);
    const fg = i === 1 ? S.background1 : S.text1;
    text(s, h, { x: x + 0.3, y: 2.15, w: 3.3, h: 0.6, fontSize: 28, bold: true, fontFace: "Arial", color: fg });
    text(s, a, { x: x + 0.3, y: 2.95, w: 3.3, h: 1.4, fontSize: 15, color: fg });
    text(s, [{ text: "So social must:\n", options: { bold: true, fontSize: 12 } }, { text: b, options: { fontSize: 16, bold: true } }], { x: x + 0.3, y: 4.6, w: 3.3, h: 1.4, color: fg });
  });
}

// 3 Objectives
{
  const s = slide("Content", "02 · Objectives", "One target per funnel stage, organic and creator only", "Strategy",
    "Paid media is Project 01's budget and is reported separately, so we don't double-count. The engagement target of 3% is set above the roughly 2.2% fashion median from Emplifi's Q2 2026 Asia-Pacific benchmark. For sends per reach there's no trustworthy public benchmark, so we set our own baseline in week 1 and aim for +20%. Add-to-carts: 1,500 clicks × 80% page loads × 8% add-to-cart.");
  const big = C.objectives.filter((o) => ["Reach from creator partnership content", "Engagement rate by reach (organic feed)", "Link clicks (link sticker + bio link, UTM-tagged)", "Add-to-carts from social UTMs", "#AeroRunFitCheck UGC posts"].includes(o.kpi));
  big.forEach((o, i) => {
    const x = 0.6 + i * 2.45;
    card(s, x, 1.9, 2.25, 2.6, i === 3 ? S.accent1 : S.background2, `objective ${i + 1}`);
    const fg = i === 3 ? S.background1 : S.text1;
    text(s, o.stage.toUpperCase(), { x: x + 0.2, y: 2.05, w: 1.9, h: 0.3, fontSize: 10, bold: true, color: i === 3 ? S.background1 : S.accent1 });
    text(s, o.target, { x: x + 0.2, y: 2.4, w: 1.9, h: 0.7, fontSize: 30, bold: true, fontFace: "Arial", color: fg });
    text(s, o.kpi, { x: x + 0.2, y: 3.2, w: 1.9, h: 1.2, fontSize: 12, color: fg });
  });
  tbl(s, ["Also tracked", "Target", "Basis"], C.objectives.filter((o) => !big.includes(o)).map((o) => [o.kpi, o.target, o.basis]), { x: 0.6, y: 4.8, w: 12.1, colW: [4.0, 3.0, 5.1] });
}

// 4 Audience
{
  const s = slide("Content", "03 · Audience", "Three personas, three jobs for social", "Strategy",
    "Same proto-personas as Project 01, still hypotheses. Aarav is primary: style content and challenges. Meera needs proof of versatility and comfort, so she gets styling carousels, the 9-to-9 Reel and reviews. Kabir needs culture credibility and a reason a parent will buy it, so he gets the honest unboxing and the gift guide.");
  const ps = [["A", "Fit Check Reels · colourway posts · challenge", "R02 R03 P04 R07"], ["M", "‘3 ways to wear’ · 9-to-9 comfort Reel · reviews", "C02 R04 P11"], ["K", "Honest unboxing · challenge · gift guide", "R05 R07 S05 P12"]];
  ps.forEach(([k, give, ids], i) => {
    const x = 0.6 + i * 4.1, [name, rest] = C.personas[k].split(": ");
    card(s, x, 1.9, 3.85, 4.7, i === 0 ? S.text2 : S.background2, `persona ${k}`);
    const fg = i === 0 ? S.background1 : S.text1;
    text(s, i === 0 ? "PRIMARY" : i === 1 ? "SECONDARY" : "TERTIARY", { x: x + 0.3, y: 2.1, w: 3.3, h: 0.3, fontSize: 10, bold: true, color: S.accent1 });
    text(s, name, { x: x + 0.3, y: 2.45, w: 3.3, h: 0.5, fontSize: 20, bold: true, fontFace: "Arial", color: fg });
    text(s, rest, { x: x + 0.3, y: 2.95, w: 3.3, h: 0.4, fontSize: 13, color: i === 0 ? S.accent4 : S.text2 });
    text(s, [{ text: "We give them\n", options: { bold: true, fontSize: 12, color: S.accent1 } }, { text: give, options: { fontSize: 16 } }], { x: x + 0.3, y: 3.6, w: 3.3, h: 1.6, color: fg });
    text(s, ids, { x: x + 0.3, y: 5.6, w: 3.3, h: 0.4, fontSize: 12, bold: true, color: i === 0 ? S.accent4 : S.accent3 });
  });
}

// 5 Platform
{
  const s = slide("Content", "04 · Platform strategy", "Design every post to be sent, not just liked", "Strategy",
    "Instagram's head named watch time, likes and sends as the top ranking signals, with sends mattering most for reaching non-followers (Social Media Today, Buffer). That's why the content includes colourway personalities, a fake-spotting guide and 'send this to a friend' CTAs. Facebook has a narrower job: cheap reach, retargeting and gift-givers.");
  const sig = [["Watch time", "Hook in second one; 12–30 sec Reels; captions burned in"], ["Sends per reach", "Content worth DM-ing: colourway personalities, fake-spotting guide"], ["Likes per reach", "Strong single-image posts for the follower feed"], ["Saves", "Carousels and the trust post as reference material"]];
  sig.forEach(([h, t], i) => {
    const y = 1.9 + i * 1.15;
    card(s, 0.6, y, 6.6, 1.0, i === 1 ? S.accent1 : S.background2, `signal ${h}`);
    const fg = i === 1 ? S.background1 : S.text1;
    text(s, h, { x: 0.85, y: y + 0.15, w: 2.2, h: 0.7, fontSize: 16, bold: true, color: fg, valign: "middle" });
    text(s, t, { x: 3.1, y: y + 0.15, w: 3.9, h: 0.7, fontSize: 14, color: fg, valign: "middle" });
  });
  card(s, 7.6, 1.9, 5.1, 4.45, S.text2, "platform roles");
  text(s, [
    { text: "Instagram · lead\n", options: { bold: true, fontSize: 18, color: S.accent1 } },
    { text: "All 28 creatives. Discovery, culture, community.", options: { breakLine: true } },
    { text: " ", options: { breakLine: true } },
    { text: "Facebook · support\n", options: { bold: true, fontSize: 18, color: S.accent1 } },
    { text: "About 20 cross-posts. Cheap reach, retargeting, gift-givers (parents of Kabir-type buyers).", options: { breakLine: true } },
    { text: " ", options: { breakLine: true } },
    { text: "Cadence\n", options: { bold: true, fontSize: 18, color: S.accent1 } },
    { text: "Feed post on 25 of 30 days · Stories daily · Reels at 8 pm (verify in week 1)" },
  ], { x: 7.9, y: 2.1, w: 4.5, h: 4.1, fontSize: 14, color: S.background1 });
}

// 6 Pillars
{
  const s = slide("Content", "05 · Content pillars", "Four pillars, each with one job", "Strategy",
    "The pillar mix carries over from Project 01: 40/25/25/10. Planned mix comes out at 36/29/25/11. The Drop, meaning sales and launch moments, is kept to about 10% because a feed full of ads gives no one a reason to follow or send it. The paid budget does the direct response.");
  C.pillarMix.forEach((p, i) => {
    const x = 0.6 + (i % 2) * 3.55, y = 1.9 + Math.floor(i / 2) * 2.4;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w: 3.4, h: 2.25, rectRadius: 0.12, fill: { color: PILLAR_HEX[p.key] }, line: { type: "none" }, objectName: `pillar ${p.name}` });
    text(s, `${Math.round(p.target * 100)}%`, { x: x + 2.2, y: y + 0.15, w: 1.0, h: 0.5, fontSize: 24, bold: true, color: S.background1, align: "right" });
    text(s, p.name, { x: x + 0.25, y: y + 0.2, w: 2.2, h: 0.5, fontSize: 20, bold: true, fontFace: "Arial", color: S.background1 });
    text(s, p.job, { x: x + 0.25, y: y + 0.8, w: 2.95, h: 1.35, fontSize: 12, color: S.background1 });
  });
  s.addChart(pres.charts.DOUGHNUT, [{ name: "Planned mix", labels: C.pillarMix.map((p) => p.name), values: C.pillarMix.map((p) => p.count) }], {
    x: 8.0, y: 1.8, w: 4.7, h: 4.7, holeSize: 58, chartColors: C.pillarMix.map((p) => PILLAR_HEX[p.key]), showPercent: true, showValue: false,
    dataLabelColor: "FFFFFF", dataLabelFontSize: 12, dataLabelFontFace: "+mn-lt", showLegend: true, legendPos: "b", legendFontSize: 12, legendFontFace: "+mn-lt", legendColor: "101217",
    showTitle: true, title: "Planned mix: 28 creatives", titleFontSize: 14, titleColor: "101217", titleFontFace: "+mn-lt", objectName: "pillar mix chart",
  });
}

// 7 Architecture
{
  const s = slide("Content", "06 · Campaign architecture", "Tease → Reveal → Prove & Style → Convert & Crew", "Plan",
    "Four phases, each with its own goal and KPI. Two cultural moments: on Republic Day, when every brand runs a sale, we deliberately don't, and remind people about free size exchange instead. That's Project 01's 'value-adds, not discounts' move. Valentine's week (starting Rose Day, 7 Feb) is for gift-givers, which tests the Kabir co-decision hypothesis.");
  C.phases.forEach((p, i) => {
    const x = 0.6 + i * 3.08;
    s.addShape(pres.shapes.CHEVRON, { x, y: 1.95, w: 3.0, h: 0.8, fill: { color: [THEME.colors.dk2, "6B7A99", "FF4F2E", "0F7B5A"][i] }, line: { type: "none" }, objectName: `phase ${p.name}` });
    text(s, `${p.name} · D${p.days[0]}–${p.days[1]}`, { x: x + 0.5, y: 2.1, w: 2.2, h: 0.5, fontSize: 13, bold: true, color: S.background1, valign: "middle" });
    text(s, [{ text: p.goal, options: { breakLine: true } }, { text: "KPI: " + p.kpi, options: { italic: true, color: S.text2, fontSize: 12 } }], { x: x + 0.1, y: 2.95, w: 2.85, h: 1.6, fontSize: 14 });
  });
  tbl(s, ["Moment", "Day", "Move"], [["Launch", "Day 5 · Fri 15 Jan", "Hero post + hero Reel + launch Stories the same evening"], ["Republic Day", "Day 16 · Tue 26 Jan", "‘No sale. Just no stress.’ Free size exchange instead of a discount"], ["Valentine's week", "Day 28 · Sun 7 Feb", "Gift guide Stories + ‘Gift the fit’ for gift-givers"], ["Review", "Day 24 / Day 30", "Mid-campaign cut; monthly report"]], { x: 0.6, y: 4.7, w: 12.1, colW: [2.4, 2.6, 7.1] });
}

// 8 Calendar
{
  const s = slide("Content", "07 · 30-day calendar", "11 January – 9 February 2027", "Plan",
    "The full sortable calendar with status tracking is in the spreadsheet. Colour shows the pillar. Five days have no feed post: they're used for the mid-campaign review, UGC roundups and the monthly report.");
  const head = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"].map((t) => ({ text: t, options: { bold: true, color: S.background1, fill: { color: S.text2 }, fontSize: 11, align: "center" } }));
  const cells = C.calendar.map((d) => {
    const it = d.items;
    const fill = it.length ? PILLAR_HEX[it[0].pillar] : "F4F6F9";
    return { text: [{ text: d.date.replace(/^\w+ /, ""), options: { bold: true, fontSize: 10, breakLine: true } }, { text: it.map((x) => x.id).join(" ") || "ops", options: { fontSize: 12, bold: !!it.length } }], options: { fill: { color: fill }, color: it.length ? "FFFFFF" : "6B7280", align: "center", valign: "middle" } };
  });
  while (cells.length % 7) cells.push({ text: "", options: {} });
  const rows = [];
  for (let i = 0; i < cells.length; i += 7) rows.push(cells.slice(i, i + 7));
  s.addTable([head, ...rows], { x: 0.6, y: 1.8, w: 8.6, colW: Array(7).fill(8.6 / 7), rowH: [0.35, 0.85, 0.85, 0.85, 0.85, 0.85], border: { type: "solid", pt: 2, color: "FFFFFF" }, objectName: "calendar grid" });
  card(s, 9.5, 1.8, 3.2, 4.6, S.background2, "calendar legend");
  text(s, [
    { text: "Key\n", options: { bold: true, color: S.accent1, fontSize: 12 } },
    ...C.pillars.map((p) => ({ text: `■ ${p.name}`, options: { color: PILLAR_HEX[p.key], bold: true, breakLine: true } })),
    { text: " ", options: { breakLine: true } },
    { text: "P = post · R = Reel\nS = Story sequence · C = carousel", options: { fontSize: 12, breakLine: true } },
    { text: " ", options: { breakLine: true } },
    { text: "Stories run every day; Reels at 8 pm, posts at 1 pm.", options: { fontSize: 12, color: S.text2 } },
  ], { x: 9.75, y: 2.0, w: 2.8, h: 4.2, fontSize: 14 });
}

// 9 Launch day
{
  const s = slide("Content", "08 · Launch day (Day 5)", "One evening, three formats, one message", "Creative",
    "Launch evening: the hero post states the campaign line and price, the hero Reel shows '3 fits, 1 pair' (Project 01's Angle A), and Stories give the shortest path to the product page. All three are boosted with paid media from Project 01's budget.");
  pic(s, "posts/P03.png", 0.6, 1.8, 3.6, 4.5, "Launch hero post");
  pic(s, "reels/R02-cover.png", 4.5, 1.8, 2.53, 4.5, "Launch Reel cover");
  [1, 2, 3].forEach((k, i) => pic(s, `stories/S02-${k}.png`, 7.35 + i * 1.82, 1.8, 1.72, 3.06, `Launch Story frame ${k}`));
  text(s, [{ text: "P03 Hero post · ", options: { bold: true } }, { text: "R02 ‘3 fits, 1 pair’ Reel · ", options: { bold: true } }, { text: "S02 Stories: reveal → colourway poll → link sticker", options: { bold: true } }], { x: 0.6, y: 6.45, w: 12, h: 0.35, fontSize: 13 });
  card(s, 7.35, 5.05, 5.35, 1.25, S.accent1, "launch note");
  text(s, "Caption: “AeroRun is here. Looks good in the fit check, still feels light at 9 pm. ₹5,999, only at the official store.”", { x: 7.55, y: 5.15, w: 4.95, h: 1.05, fontSize: 13, color: S.background1, valign: "middle" });
}

// 10 Posts
{
  const s = slide("Content", "09 · Instagram posts (12)", "Style, proof and trust, made to be saved and sent", "Creative",
    "Six of the twelve posts. P05 makes Project 01's price ladder social without naming competitors. P07 tackles counterfeit fear head-on. P09 is the Republic Day 'no sale' post. P11 is a review template that only goes live with real, permitted reviews: we never invent testimonials.");
  ["P02", "P04", "P05", "P07", "P09", "P11"].forEach((id, i) => {
    const x = 0.6 + i * 2.05;
    pic(s, `posts/${id}.png`, x, 1.8, 1.9, 2.375, id);
    const c = C.creatives.find((v) => v.id === id);
    text(s, [{ text: `${id} · ${c.title}\n`, options: { bold: true, fontSize: 12 } }, { text: `${c.obj} · ${C.pillars.find((p) => p.key === c.pillar).name}`, options: { fontSize: 11, color: S.text2 } }], { x, y: 4.3, w: 1.9, h: 0.9 });
  });
  card(s, 0.6, 5.35, 12.1, 1.3, S.background2, "post principle");
  text(s, [{ text: "Every post spec includes: ", options: { bold: true, color: S.accent1 } }, { text: "visual concept · headline · caption · CTA · target audience · objective · visual direction · hashtags · Facebook use. All 28 are in the strategy document and the spreadsheet's Creative Library." }], { x: 0.85, y: 5.5, w: 11.6, h: 1.0, fontSize: 14, valign: "middle" });
}

// 11 Reels
{
  const s = slide("Content", "10 · Reels (8)", "Five by creators, three by the brand", "Creative",
    "Reels get the creators because watch time and trust both come from real people. Each has a shot-by-shot script in the Reel Scripts document. R07 is built for Remix with an original audio, and R08 is designed for sends: 'send this to your Midnight friend'.");
  const reels = C.creatives.filter((c) => c.format === "reel");
  reels.forEach((c, i) => {
    const x = 0.6 + i * 1.53;
    pic(s, `reels/${c.id}-cover.png`, x + 0.1, 1.75, 1.2, 2.13, c.id);
    text(s, [{ text: `${c.id}\n`, options: { bold: true, fontSize: 11 } }, { text: c.title, options: { fontSize: 10 } }], { x: x + 0.1, y: 3.95, w: 1.35, h: 0.7 });
  });
  const r = C.creatives.find((c) => c.id === "R02");
  tbl(s, ["R02 script", "Shot", "On-screen text"], r.script.map((x) => [x[0], x[1], x[2]]), { x: 0.6, y: 4.75, w: 12.1, colW: [1.4, 6.7, 4.0], fontSize: 11, margin: 0.04 });
}

// 12 Stories & carousels
{
  const s = slide("Content", "11 · Stories (5) & carousels (3)", "Interactive by design: polls, quizzes, swipes", "Creative",
    "Stories use stickers (quiz, poll, countdown, question box, slider, link) because sticker taps are engagement Instagram can see, and the link sticker is the shortest path to the product page. Carousels are reference content, made to be saved: the styling guide and the honest FAQ.");
  [1, 2, 3].forEach((k, i) => pic(s, `stories/S01-${k}.png`, 0.6 + i * 1.62, 1.8, 1.52, 2.7, `S01 frame ${k}`));
  text(s, "S01 Countdown: teaser → quiz → reminder", { x: 0.6, y: 4.6, w: 4.8, h: 0.3, fontSize: 12, bold: true });
  [1, 2, 3, 4, 5].forEach((k, i) => pic(s, `carousels/C02-${k}.png`, 5.6 + i * 1.43, 1.8, 1.35, 1.69, `C02 slide ${k}`));
  text(s, "C02 ‘3 ways to wear it’ · made to be saved", { x: 5.6, y: 3.6, w: 7, h: 0.3, fontSize: 12, bold: true });
  [1, 2, 3, 4, 5].forEach((k, i) => pic(s, `carousels/C03-${k}.png`, 5.6 + i * 1.43, 4.05, 1.35, 1.69, `C03 slide ${k}`));
  text(s, "C03 Honest FAQ · removes the last purchase doubts", { x: 5.6, y: 5.85, w: 7, h: 0.3, fontSize: 12, bold: true });
  text(s, "Stickers used: quiz · poll · countdown · question box · emoji slider · link", { x: 0.6, y: 5.1, w: 4.8, h: 0.8, fontSize: 13, color: S.text2 });
}

// 13 Hashtags
{
  const s = slide("Content", "12 · Hashtags", "Max five. They help search, not reach.", "Community",
    "Instagram capped hashtags at five per post and Reel in December 2025, and its head has said hashtags help search but don't increase reach. So every set has one branded or campaign tag, two community tags and one or two category tags. I didn't publish post counts: Instagram doesn't give reliable public numbers, so each tag gets checked in the app before launch.");
  tbl(s, ["Pillar", "Hashtag set", "Why"], Object.entries(C.hashtagSets).map(([k, v]) => [C.pillars.find((p) => p.key === k).name, v.tags.join("  "), v.why]), { x: 0.6, y: 1.85, w: 12.1, colW: [1.7, 5.6, 4.8] });
  card(s, 0.6, 4.95, 12.1, 1.5, S.accent1, "hashtag rule");
  text(s, [{ text: "Before launch: ", options: { bold: true } }, { text: "search #AeroRun and #AeroRunFitCheck to confirm no one else owns them, and log each tag's size and content in the spreadsheet. No invented ‘volume’ numbers." }], { x: 0.85, y: 5.1, w: 11.6, h: 1.2, fontSize: 15, color: S.background1, valign: "middle" });
}

// 14 Influencers
{
  const s = slide("Content", "13 · Influencer strategy", "Five micro-creators, five jobs, honest content", "Community",
    "₹25,000 from Project 01's budget, ₹5,000 each, which is an assumption until confirmed with quotes. Each creator maps to a persona and makes a Reel in their own voice. ASCI requires a clear disclosure label in each paid post, and 2025 updates say the platform's paid-partnership tag isn't enough on its own, so every creator caption carries #ad.");
  tbl(s, ["Creator", "City", "Niche", "Makes", "Fee"], C.creators.map((c) => [c.id, c.city, c.niche, c.deliverables, "₹" + c.fee.toLocaleString("en-IN")]), { x: 0.6, y: 1.85, w: 8.2, colW: [0.9, 1.3, 2.4, 2.8, 0.8] });
  card(s, 9.1, 1.85, 3.6, 4.6, S.text2, "influencer rules");
  text(s, [
    { text: "Must\n", options: { bold: true, color: S.accent1, fontSize: 13 } }, { text: "Shoe on-foot in 2 seconds · official store · #ad", options: { breakLine: true } },
    { text: " ", options: { breakLine: true } },
    { text: "Free to\n", options: { bold: true, color: S.accent1, fontSize: 13 } }, { text: "Use their own voice, edit and music; share one honest con", options: { breakLine: true } },
    { text: " ", options: { breakLine: true } },
    { text: "Never\n", options: { bold: true, color: S.accent1, fontSize: 13 } }, { text: "Invented specs, discounts, competitor bashing", options: { breakLine: true } },
    { text: " ", options: { breakLine: true } },
    { text: "+ 10–15 gifted nano-creators (labelled)", options: { italic: true, fontSize: 12 } },
  ], { x: 9.35, y: 2.05, w: 3.1, h: 4.2, fontSize: 14, color: S.background1 });
  text(s, "Selection: ≥60% audience 18–34 in Indian metros · engagement above niche median · no competitor deal in 90 days · brand-safety check of last 50 posts", { x: 0.6, y: 5.6, w: 8.2, h: 0.8, fontSize: 12, color: S.text2 });
}

// 15 Community
{
  const s = slide("Content", "14 · Community management", "Replies are part of the campaign", "Community",
    "Response times: comments within 2 hours, DMs within 4, complaints acknowledged within an hour. The playbook covers praise, product questions, price objections, complaints, counterfeit reports, spam and crisis. One rule matters most: no customer content gets featured without a written yes. A tag isn't consent.");
  tbl(s, ["Situation", "What we do"], C.community.tiers.map((t) => [t[0], t[1]]), { x: 0.6, y: 1.85, w: 7.8, colW: [2.6, 5.2], fontSize: 11 });
  card(s, 8.7, 1.85, 4.0, 2.3, S.accent1, "slas");
  text(s, [{ text: "Response times\n", options: { bold: true, fontSize: 12 } }, ...C.community.sla.map(([a, b], i) => ({ text: `${a}: ${b}`, options: { breakLine: i < C.community.sla.length - 1 } }))], { x: 8.95, y: 2.0, w: 3.5, h: 2.0, fontSize: 12, color: S.background1 });
  card(s, 8.7, 4.35, 4.0, 2.3, S.background2, "saved reply");
  text(s, [{ text: "Saved reply: ‘Too expensive’\n", options: { bold: true, color: S.accent1, fontSize: 12 } }, { text: C.community.savedReplies[2][1], options: { fontSize: 13 } }], { x: 8.95, y: 4.5, w: 3.5, h: 2.0 });
}

// 16 Measurement
{
  const s = slide("Content", "15 · Measurement", "Measure by reach, report weekly, decide monthly", "Measurement",
    "Engagement rate is calculated by reach, not followers, so posts that travel beyond followers aren't penalised. Benchmarks use different formulas, so only compare like with like. The spreadsheet's Monthly Report tab calculates every KPI from weekly inputs and flags status against target; the Report Example tab shows how it works with clearly labelled dummy data.");
  tbl(s, ["KPI", "Formula"], C.kpis.slice(0, 9).map((k) => [k[0], k[2]]), { x: 0.6, y: 1.85, w: 7.4, colW: [2.8, 4.6], fontSize: 11 });
  tbl(s, ["When", "What", "Decision"], [["Daily", "Comments, DMs, response time", "Reply · escalate"], ["Weekly", "Top/bottom 3 by sends & saves", "Boost winners"], ["Day 24", "Mid-campaign review", "Cut weakest format"], ["Day 30", "Monthly report", "Month-2 plan"]], { x: 8.3, y: 1.85, w: 4.4, colW: [0.9, 1.9, 1.6], fontSize: 11 });
}

// 17 Close
{
  const s = slide("Dark Title", "16 · Next steps", "Make it real, then make it bigger.", "Close",
    "Close on next steps. Replace the photo zones with real shoots, confirm creator quotes, run the Project 01 survey, and after month one replace every assumption with real baselines. Limitations to volunteer: all graphics are concepts, product attributes are fictional, and targets are assumptions because there's no account history yet.");
  s.addText([
    { text: "1  Get quotes from 10–15 creators; confirm fees and audience data", options: { breakLine: true } },
    { text: "2  Check every hashtag in the app before launch", options: { breakLine: true } },
    { text: "3  Shoot the product and creator content into the photo zones", options: { breakLine: true } },
    { text: "4  Week 1: set baselines for sends, saves and link clicks", options: { breakLine: true } },
    { text: "5  Day 30: report, then plan month 2 from real results" },
  ], { placeholder: "body", paraSpaceAfter: 6 });
  pic(s, "posts/P12.png", 9.0, 1.2, 3.6, 4.5, "Gift the fit post");
}

(async () => {
  await pres.writeFile({ fileName: OUT });
  await applyTheme(OUT, THEME);
  console.log("deck", OUT);
})().catch((e) => { console.error(e); process.exit(1); });
