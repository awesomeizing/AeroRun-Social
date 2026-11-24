// Builds the strategy document (report.html → AeroRun-Social-Strategy.pdf). Run: node report.js
const fs = require("fs");
const path = require("path");
const puppeteer = require("puppeteer-core");
const C = require("./content");
const { shoe } = require("./creatives");

const ROOT = path.resolve(__dirname, "..");
const CHROME = ["C:/Program Files/Google/Chrome/Application/chrome.exe", "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe"].find(fs.existsSync);
const BASE_CSS = fs.readFileSync(path.join(__dirname, "styles.css"), "utf8");

const SOURCES = [
  ["S1", "Business Today, “Instagram limits hashtag usage to just 5 per Reel and post” (Dec 2025)", "https://www.businesstoday.in/technology/news/story/no-more-hashtag-stuffing-instagram-limits-hashtag-usage-to-just-5-per-reel-and-post-507444-2025-12-19", "Press"],
  ["S2", "Social Media Today, “Instagram implements new limits on hashtag use”", "https://www.socialmediatoday.com/news/instagram-implements-new-limits-on-hashtag-use/808309/", "Trade press"],
  ["S3", "Social Media Today, “Instagram shares algorithm insights” (Mosseri: watch time, likes, sends), 2025", "https://www.socialmediatoday.com/news/instagram-shares-algorithm-insights-2025/738034/", "Trade press, quoting Instagram"],
  ["S4", "Buffer, “How the Instagram algorithm works” (2026 guide)", "https://buffer.com/resources/instagram-algorithms/", "Practitioner guide"],
  ["S5", "ASCI, Guidelines for Influencer Advertising in Digital Media", "https://www.ascionline.in/social/wp-content/uploads/2025/04/ASCI-Influencer-Guidelines.pdf", "Self-regulatory code (primary)"],
  ["S6", "Khaitan & Co, “ASCI updates its Code for Self-Regulation in Advertising” (2025)", "https://khaitanco.com/thought-leadership/ASCI-updates-its-Code-for-Self-Regulation-in-Advertising", "Legal commentary"],
  ["S7", "Emplifi, Q2 2026 Fashion benchmarks, Asia-Pacific", "https://emplifi.io/resources/q2-2026-fashion-asia-pacific-benchmarks/", "Vendor benchmark"],
  ["S8", "Colorlib summary of Socialinsider 2025 Instagram engagement by format", "https://colorlib.com/wp/instagram-engagement-rate/", "Secondary summary of vendor data"],
  ["S9", "Project 01: AeroRun Launch Strategy (this portfolio): personas, positioning, budget", "../Project-01-AeroRun/AeroRun-Strategy-Report.pdf", "Internal"],
];
const c = (...ids) => `<sup class="src">[${ids.join(", ")}]</sup>`;
const V = `<span class="tag v">Verified</span>`, AS = `<span class="tag a">Assumption</span>`, H = `<span class="tag h">Hypothesis</span>`, R = `<span class="tag r">Recommendation</span>`;
const nl = (s) => s.replace(/\n/g, "<br>");
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/\n/g, "<br>");
const P = (x) => C.pillars.find((p) => p.key === x.pillar);
const aud = (x) => x.aud.split("").map((k) => C.personas[k].split(" (")[0]).join(", ");
const thumb = (x) => x.format === "post" ? `posts/${x.id}.png` : x.format === "reel" ? `reels/${x.id}-cover.png` : x.format === "story" ? `stories/${x.id}-1.png` : `carousels/${x.id}-1.png`;
const img = (f, style = "") => `<img src="../creatives/${f}" style="${style}">`;

const decision = (d, alts, why) => `<div class="decision"><div class="dl">Strategist's note</div><p><b>Decision.</b> ${d}</p><p><b>Alternatives considered.</b> ${alts}</p><p><b>Why.</b> ${why}</p></div>`;
const sec = (n, title, lede, body) => `<section class="sec"><div class="num">${String(n).padStart(2, "0")}</div><h2>${title}</h2>${lede ? `<p class="lede">${lede}</p>` : ""}${body}</section>`;
const table = (head, rows) => `<table class="rt"><thead><tr>${head.map((h) => `<th>${h}</th>`).join("")}</tr></thead><tbody>${rows.map((r) => `<tr>${r.map((x) => `<td>${x}</td>`).join("")}</tr>`).join("")}</tbody></table>`;

const css = `
@page { size: A4; margin: 16mm 17mm 20mm; }
@page cover { margin: 0; }
body { font-size: 9.6pt; }
.cover { page: cover; height: 297mm; background: #101217; color: #fff; padding: 22mm 20mm; position: relative; overflow: hidden; page-break-after: always; }
.cover .k { font: 600 9pt Inter; letter-spacing: .2em; text-transform: uppercase; color: #ff4f2e; }
.cover h1 { font-size: 50pt; margin-top: 24mm; line-height: .98; }
.cover .sub { font-size: 14pt; color: #c9d1ea; margin-top: 7mm; max-width: 150mm; }
.cover .disc { margin-top: 8mm; display: inline-block; border: 1px solid #ff4f2e; color: #ffd5cb; padding: 3mm 4mm; border-radius: 2mm; font-size: 8.5pt; max-width: 150mm; }
.cover .strip { position: absolute; left: 20mm; right: 20mm; bottom: 42mm; display: flex; gap: 3mm; }
.cover .strip img { width: 33mm; border-radius: 2mm; }
.cover .meta { position: absolute; left: 20mm; right: 20mm; bottom: 16mm; display: grid; grid-template-columns: repeat(3, 1fr); gap: 8mm; font-size: 9pt; color: #c9d1ea; border-top: 1px solid #2e3445; padding-top: 5mm; }
.cover .meta b { display: block; color: #fff; font-size: 10pt; }
.sec { page-break-before: always; }
.num { font: 700 40pt "Space Grotesk"; color: #ff4f2e; line-height: 1; }
h2 { font-size: 22pt; margin: 2mm 0 3mm; } h3 { font-size: 12pt; margin: 6mm 0 2mm; break-after: avoid; page-break-after: avoid; }
.lede { font-size: 11.5pt; color: #3b4150; max-width: 165mm; margin-bottom: 5mm; }
p { margin: 0 0 2.6mm; } ul.b { margin: 0 0 3mm 4.5mm; } ul.b li { margin-bottom: 1.3mm; }
.rt { width: 100%; border-collapse: collapse; margin: 2mm 0 5mm; font-size: 8.5pt; }
.rt th { text-align: left; font: 700 7pt Inter; letter-spacing: .08em; text-transform: uppercase; color: #3b4150; border-bottom: 1.5px solid #101217; padding: 2mm; }
.rt td { border-bottom: 1px solid #e4e7ec; padding: 2mm; vertical-align: top; } .rt tr { page-break-inside: avoid; } .rt td:first-child { font-weight: 600; }
.decision { background: #f4f6f9; border-radius: 3mm; padding: 4mm 5mm; margin: 4mm 0; page-break-inside: avoid; font-size: 9pt; }
.decision .dl { font: 700 7.5pt Inter; letter-spacing: .14em; text-transform: uppercase; color: #ff4f2e; margin-bottom: 2mm; }
.stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 3mm; margin: 4mm 0; }
.stat { background: #f4f6f9; border-radius: 3mm; padding: 4mm; } .stat .n { font: 700 17pt "Space Grotesk"; } .stat .l { font-size: 8pt; color: #3b4150; margin-top: 1mm; }
.pillars { display: grid; grid-template-columns: 1fr 1fr; gap: 3mm; margin: 3mm 0 5mm; }
.pillar { border-radius: 3mm; padding: 4mm 5mm; color: #fff; page-break-inside: avoid; } .pillar h3 { margin: 0 0 1mm; color: #fff; } .pillar .pct { font: 700 22pt "Space Grotesk"; float: right; }
.phases { display: grid; grid-template-columns: repeat(4, 1fr); gap: 2mm; margin: 3mm 0 5mm; }
.phase { background: #f4f6f9; border-radius: 3mm; padding: 3.5mm; font-size: 8.3pt; } .phase b { display: block; font: 700 11pt "Space Grotesk"; } .phase .d { color: #ff4f2e; font-weight: 700; font-size: 7.5pt; letter-spacing: .1em; }
.cal { width: 100%; border-collapse: separate; border-spacing: 1.2mm; table-layout: fixed; font-size: 7.4pt; }
.cal th { font: 700 7pt Inter; letter-spacing: .1em; color: #3b4150; text-align: left; }
.cal td { background: #f4f6f9; border-radius: 2mm; padding: 1.8mm; vertical-align: top; height: 24mm; }
.cal .dt { font-weight: 700; color: #101217; } .cal .ph { font-size: 6.4pt; color: #6b7280; }
.chipx { display: block; color: #fff; border-radius: 1.4mm; padding: .8mm 1.4mm; margin-top: 1mm; font-weight: 600; font-size: 7pt; }
.ops { display: block; color: #6b7280; font-size: 6.6pt; margin-top: 1mm; font-style: italic; }
.card { display: grid; grid-template-columns: 38mm 1fr; gap: 5mm; padding: 4mm 0; border-bottom: 1px solid #e4e7ec; page-break-inside: avoid; }
.card.tall { grid-template-columns: 30mm 1fr; }
.card img { width: 100%; border-radius: 2mm; border: 1px solid #e4e7ec; }
.card h4 { font: 700 11pt "Space Grotesk"; margin-bottom: 1mm; } .card .meta { font-size: 7.6pt; color: #6b7280; margin-bottom: 2mm; }
.card dl { display: grid; grid-template-columns: 26mm 1fr; gap: 1mm 3mm; font-size: 8.2pt; } .card dt { font-weight: 700; color: #3b4150; } .card dd { margin: 0; }
.legend { display: grid; grid-template-columns: repeat(4, 1fr); gap: 3mm; margin: 4mm 0; } .legend div { background: #f4f6f9; border-radius: 3mm; padding: 3mm; font-size: 8.3pt; }
.box { border: 1.5px solid #101217; border-radius: 3mm; padding: 4.5mm; margin: 4mm 0; page-break-inside: avoid; } .box.accent { border-color: #ff4f2e; background: #fff8f6; }
.toc { columns: 2; column-gap: 10mm; margin-top: 4mm; } .toc div { break-inside: avoid; display: flex; gap: 3mm; padding: 1.6mm 0; border-bottom: 1px solid #e4e7ec; font-size: 10pt; } .toc b { color: #ff4f2e; width: 8mm; }
.src-list { font-size: 7.6pt; } .src-list a { color: #1f4fd1; word-break: break-all; text-decoration: none; }
.fig { width: 100%; border: 1px solid #e4e7ec; border-radius: 3mm; margin: 3mm 0; }
`;

function calendarGrid() {
  const cells = C.calendar.map((d) => `<td><div class="dt">${d.date.replace(/^\w+ /, "")}</div><div class="ph">Day ${d.day} · ${d.phase}</div>${d.items.map((x) => `<span class="chipx" style="background:${P(x).color}">${x.id} ${x.format === "reel" ? "▶" : x.format === "story" ? "◷" : x.format === "carousel" ? "⧉" : "■"} ${x.title.length > 22 ? x.title.slice(0, 21) + "…" : x.title}</span>`).join("")}${d.ops ? `<span class="ops">${d.ops.split(".")[0]}</span>` : ""}</td>`);
  while (cells.length % 7) cells.push(`<td style="background:none"></td>`);
  const rows = [];
  for (let i = 0; i < cells.length; i += 7) rows.push(`<tr>${cells.slice(i, i + 7).join("")}</tr>`);
  return `<table class="cal"><tr>${["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"].map((d) => `<th>${d}</th>`).join("")}</tr>${rows.join("")}</table>
  <p class="small muted">■ post · ▶ Reel · ◷ Story sequence · ⧉ carousel. Colours = pillar: ${C.pillars.map((p) => `<b style="color:${p.color}">${p.name}</b>`).join(" · ")}. Daily Stories run every day (share the feed item, one poll or question, reshare tagged posts).</p>`;
}

function creativeCard(x) {
  const tall = x.format === "reel" || x.format === "story";
  const extra = x.format === "reel" ? `<dt>Length</dt><dd>${x.len}${x.creator ? ` · creator ${x.creator}` : " · brand shoot"} · full script in Reel Scripts doc</dd>`
    : x.format === "story" ? `<dt>Frames</dt><dd>${x.frames.map((f) => `“${f.h.replace(/\n/g, " ")}”${f.sticker ? ` (${f.sticker.type} sticker)` : ""}`).join(" → ")}</dd>`
    : x.format === "carousel" ? `<dt>Slides</dt><dd>${x.slides.map((s) => s[1].replace(/\n/g, " ")).join(" → ")}</dd>` : "";
  return `<div class="card ${tall ? "tall" : ""}">${img(thumb(x))}<div>
    <h4>${x.id} · ${x.title}</h4><div class="meta">Day ${x.day} (${C.fmtDate(x.day)}) · ${P(x).name} · ${x.format}${x.amp ? " · ★ paid boost" : ""}</div>
    <dl><dt>Headline</dt><dd><b>${x.headline.replace(/\n/g, " ")}</b></dd><dt>Visual concept</dt><dd>${x.concept}</dd><dt>Visual direction</dt><dd>${x.direction}</dd>${extra}
    <dt>Caption</dt><dd>${esc(x.caption)}</dd><dt>CTA</dt><dd>${x.cta}</dd><dt>Audience</dt><dd>${aud(x)}</dd><dt>Objective</dt><dd>${x.obj}</dd><dt>Hashtags</dt><dd>${C.hashtagSets[x.pillar].tags.join(" ")}</dd><dt>Facebook</dt><dd>${x.fb}</dd></dl>
    ${x.format === "story" ? `<div style="display:flex;gap:2mm;margin-top:3mm">${[2, 3].map((k) => img(`stories/${x.id}-${k}.png`, "width:24mm;border-radius:2mm;border:1px solid #e4e7ec")).join("")}</div>` : ""}
    ${x.format === "carousel" ? `<div style="display:flex;gap:1.5mm;margin-top:3mm">${[2, 3, 4, 5].map((k) => img(`carousels/${x.id}-${k}.png`, "width:24mm;border:1px solid #e4e7ec")).join("")}</div>` : ""}</div></div>`;
}

function render() {
  const byFmt = (f) => C.creatives.filter((x) => x.format === f).sort((a, b) => a.day - b.day);
  const toc = ["Executive summary", "Objectives", "Audience & insights", "Platform strategy", "Content pillars", "Campaign architecture", "30-day calendar", "Creative: posts", "Creative: Reels", "Creative: Stories & carousels", "Hashtag strategy", "Influencer strategy", "Community management", "Measurement framework", "Risks, limitations & next steps"];
  const body = `
<div class="cover">
  <div class="k">Social media campaign · Portfolio Project 02</div>
  <h1>Light on your feet.<br>Loud on your feed.</h1>
  <div class="sub">A 30-day Instagram and Facebook campaign for AeroRun, a fictional ₹5,999 sneaker, built on the research and positioning from Project 01.</div>
  <div class="disc"><b>Independent fictional concept.</b> AeroRun is not a real product, and this is not an official Nike campaign: it was not commissioned by, affiliated with or endorsed by Nike, Inc. No Nike branding is used. All performance figures are targets or illustrations, not results.</div>
  <div class="strip">${["posts/P03.png", "reels/R02-cover.png", "posts/P04.png", "stories/S02-2.png", "carousels/C02-1.png"].map((f) => img(f)).join("")}</div>
  <div class="meta"><div><b>Prepared as</b>Social media manager & creative director (portfolio)</div><div><b>Campaign window</b>11 Jan – 9 Feb 2027 (30 days)</div><div><b>Date</b>November 2026</div></div>
</div>

<section class="sec" style="page-break-before:auto"><h2>Contents</h2>
<div class="toc">${toc.map((t, i) => `<div><b>${String(i + 1).padStart(2, "0")}</b>${t}</div>`).join("")}<div><b>A</b>Sources</div></div>
<h3 style="margin-top:9mm">How to read this document</h3>
<div class="legend"><div>${V}<br><br>From a named public source ${c("S1")}, listed in Appendix A.</div><div>${AS}<br><br>A planning number we chose. Changeable in <code>content.js</code>.</div><div>${H}<br><br>A belief about the audience still to be tested.</div><div>${R}<br><br>What we advise doing.</div></div>
<h3>What's in the campaign pack</h3>
${table(["File", "What it is"], [["AeroRun-Social-Strategy.pdf", "This document"], ["AeroRun-Social-Campaign-Deck.pptx", "Agency-style presentation"], ["AeroRun-Social-Campaign.xlsx", "30-day calendar, creative and caption libraries, hashtags, creators, monthly reporting template"], ["creatives/", "50 finished graphics at Instagram sizes + overview sheets"], ["AeroRun-Reel-Scripts.md", "Shot-by-shot scripts for all 8 Reels"], ["AeroRun-Caption-Library.md", "Copy-ready captions and saved replies"]])}
</section>

${sec(1, "Executive summary", "One month to turn a launch into a conversation: show the shoe in real fits, prove it's worth ₹5,999, and let creators and customers do the talking.", `
<div class="stats">
  <div class="stat"><div class="n">28</div><div class="l">Creatives: 12 posts, 8 Reels, 5 Story sequences, 3 carousels</div></div>
  <div class="stat"><div class="n">4</div><div class="l">Content pillars: Fit Check, Light Proof, The Crew, The Drop</div></div>
  <div class="stat"><div class="n">5</div><div class="l">Micro-creators, ₹25,000 (Project 01 budget) ${c("S9")}</div></div>
  <div class="stat"><div class="n">≥ 3.0%</div><div class="l">Engagement-rate target vs ~2.2% fashion median ${c("S7")}</div></div>
</div>
<p><b>The job.</b> Project 01 found that the 18–25 metro buyer is easy to reach but hesitates over price and fakes. Social media has to do three things paid ads alone can't: make AeroRun look good on real people, answer doubts in public, and build a community whose posts become the proof ${c("S9")}.</p>
<p><b>The idea.</b> <i>Light on your feet. Loud on your feed.</i> Every piece of content either shows a fit (style), proves a claim (comfort, value, authenticity) or hands the stage to someone else (creators and customers).</p>
<p><b>How Instagram decides reach.</b> Instagram's head has named watch time, likes and sends (DMs to friends) as the top ranking signals, and sends matter most for reaching non-followers ${c("S3", "S4")} ${V}. So the content is designed to be <b>sent</b>: colourway personalities, "send this to your Midnight friend", the fake-spotting guide.</p>
<p><b>What we'll measure.</b> Engagement rate by reach, sends per reach, saves, link clicks and add-to-carts from tagged links, plus UGC volume and response time. A monthly template calculates all of them automatically ${R}.</p>`)}

${sec(2, "Objectives", "Organic and creator objectives for the 30 days. Paid media is Project 01's budget and is reported separately, so the two don't double-count.", `
${table(["Stage", "KPI", "30-day target", "Basis"], C.objectives.map((o) => [o.stage, o.kpi, `<b>${o.target}</b>`, o.basis + " " + (o.basis.includes("Emplifi") ? V : AS)]))}
${decision("Set objectives for organic and creator activity only, and pick one per funnel stage.", "One blended target covering paid + organic; or vanity targets (likes, followers) only.", "Blending hides which activity worked. Likes and followers alone say nothing about purchase intent, so each stage has its own KPI, ending in add-to-carts tracked through tagged links. Where no trustworthy benchmark exists (sends per reach), we set our own baseline in week 1 instead of inventing a number.")}`)}

${sec(3, "Audience & insights", "Same three proto-personas as Project 01. The insights that shape social are about doubt, not awareness.", `
${table(["Persona", "On social they want…", "What we give them"], [
  [C.personas.A, "Outfit ideas they can copy; to look current", "Fit Check Reels, colourway posts, fit-check challenge"],
  [C.personas.M, "Proof it's versatile and comfortable; women-led styling", "‘3 ways to wear’, 9-to-9 comfort Reel, reviews"],
  [C.personas.K, "Culture credibility; honest takes; a reason a parent will buy it", "Sneakerhead unboxing, challenge, gift guide"],
])}
<h3>Four insights carried over from Project 01 ${c("S9")}</h3>
<ul class="b"><li><b>Discovery happens on social</b>, so the feed is the shop window ${H}.</li><li><b>₹5,999 is a considered buy</b>, so content must justify the price without discounting ${H}.</li><li><b>Counterfeit fear is real</b>, so trust content (official store, spotting fakes) is a pillar, not an afterthought ${H}.</li><li><b>Creators carry trust</b> the brand can't claim for itself, so creators get the Reels, not just reposts ${H}.</li></ul>`)}

${sec(4, "Platform strategy", "Instagram leads. Facebook is a supporting channel with a specific job.", `
${table(["", "Instagram (lead)", "Facebook (support)"], [
  ["Role", "Discovery, culture, community, the main feed", "Reach at low cost, retargeting, gift-givers (parents, older siblings)"],
  ["Formats", "Reels, carousels, Stories, posts, Collab/partnership posts", "Cross-posted Reels and key posts; Facebook Stories for launch and gifting"],
  ["What we post", "All 28 creatives", "About 20 cross-posts; skip Instagram-only games (P02, S03, S04)"],
  ["Why", "18–24 is Instagram's largest age group in India (Project 01)", "Kabir's purchase may be paid by a parent " + H],
])}
<h3>Designing for the algorithm</h3>
${table(["Signal Instagram uses", "What we do about it"], [
  ["Watch time " + c("S3"), "Hook in the first second; Reels 12–30 sec; captions burned in for muted viewing"],
  ["Sends per reach " + c("S3", "S4"), "Content made to be DM'd: colourway personalities, fake-spotting guide, 'send to your friend' CTAs"],
  ["Likes per reach " + c("S3"), "Strong single-image posts for the follower feed (likes count slightly more with followers)"],
  ["Saves", "Carousels (styling, FAQ) and the trust post are designed as reference material"],
])}
<h3>Cadence</h3>
<p>One feed item a day on 25 of 30 days, plus Stories every day ${AS}. Reels at 8 pm, posts and carousels at 1 pm, until week-1 Insights show when our followers are actually online ${AS}.</p>
${decision("Daily feed posting for the launch month, Reels-heavy (8 of 23 feed items).", "3 posts a week (lower workload); Reels only.", "A launch month needs momentum, and daily posting lets us test more formats in 30 days. Reels-only would miss saves (carousels) and the strong likes signal of static posts with followers. Cross-format data suggests carousels and Reels both outperform static images on engagement " + c("S8") + ".")}`)}

${sec(5, "Content pillars", "Four pillars from Project 01, with a target share of the feed and one job each.", `
<div class="pillars">${C.pillarMix.map((p) => `<div class="pillar" style="background:${p.color}"><span class="pct">${Math.round(p.target * 100)}%</span><h3>${p.name}</h3><div style="opacity:.8;font-size:8pt;margin-bottom:2mm">${p.theme} · ${p.count} creatives planned (${Math.round((p.count / C.creatives.length) * 100)}%)</div><div style="font-size:9pt">${p.job}</div></div>`).join("")}</div>
${table(["Pillar", "Creatives"], C.pillars.map((p) => [p.name, C.creatives.filter((x) => x.pillar === p.key).map((x) => `${x.id} ${x.title}`).join(" · ")]))}
${decision("Keep 'The Drop' (sales and launch moments) to about 10% of the feed.", "A promotion-heavy launch month (40%+ 'shop now' posts).", "A feed full of ads gives people no reason to follow or send it. Style and proof content earns attention, and the paid budget handles direct response.")}`)}

${sec(6, "Campaign architecture", "Four phases in 30 days, each with its own goal and KPI.", `
<div class="phases">${C.phases.map((p) => `<div class="phase"><div class="d">DAYS ${p.days[0]}–${p.days[1]}</div><b>${p.name}</b>${p.goal}<br><br><i>KPI: ${p.kpi}</i></div>`).join("")}</div>
${table(["Moment", "Day", "How we use it"], [
  ["Launch", "Day 5 · Fri 15 Jan", "Hero post + hero Reel + launch Stories the same evening"],
  ["Republic Day", "Day 16 · Tue 26 Jan", "Every brand runs a sale; we post ‘No sale. Just no stress.’ (free size exchange)"],
  ["Valentine's week (Rose Day)", "Day 28 · Sun 7 Feb", "Gift guide Stories + ‘Gift the fit’ post for gift-givers"],
  ["Mid-campaign review", "Day 24", "Cut the weakest format; brief creators on what's working"],
  ["Monthly report", "Day 30", "Reporting template; plan month 2"],
])}`)}

${sec(7, "30-day calendar", "Day by day, from 11 January to 9 February 2027. The full sortable version with status tracking is in the spreadsheet.", calendarGrid() + `<img class="fig" src="../creatives/overview-feed-grid.png" style="max-height:120mm;object-fit:contain;object-position:top;display:none">`)}

${sec(8, "Creative: 12 Instagram posts", "Each post with its visual, headline, caption, CTA, audience, objective and visual direction. Every graphic is a finished 1080 × 1350 file in <code>creatives/posts/</code>.", byFmt("post").map(creativeCard).join(""))}

${sec(9, "Creative: 8 Reels", "Cover frames are finished 1080 × 1920 files. Shot-by-shot scripts are in <code>AeroRun-Reel-Scripts.md</code>. Photo/video zones mark where real creator footage goes.", byFmt("reel").map(creativeCard).join(""))}

${sec(10, "Creative: 5 Story sequences & 3 carousels", "Story frames (1080 × 1920) show the interactive stickers we'd use; carousels (1080 × 1350) are five slides each. Full-size overview sheets are in <code>creatives/</code>.", byFmt("story").map(creativeCard).join("") + `<div style="page-break-before:always"></div>` + byFmt("carousel").map(creativeCard).join(""))}

${sec(11, "Hashtag strategy", "Fewer, sharper hashtags. They help Instagram categorise a post, not push it further.", `
<div class="box accent"><b>The rule has changed.</b> Instagram now caps posts and Reels at <b>5 hashtags</b> ${c("S1", "S2")} ${V}, and its head has said hashtags help with search but don't increase reach ${c("S1")} ${V}. Stuffing 30 tags is no longer possible, and wasn't working anyway.</div>
${table(["Pillar", "Set (max 5)", "Why this set"], Object.entries(C.hashtagSets).map(([k, v]) => [C.pillars.find((p) => p.key === k).name, v.tags.join(" "), v.why]))}
<h3>How each tag was chosen</h3>
${table(["Role", "Example", "Purpose"], [["Branded", "#AeroRun", "An owned search page for the product"], ["Campaign / UGC", "#AeroRunFitCheck", "Collects customer posts, so it leads every community post"], ["Community", "#IndianSneakerheads, #StreetwearIndia", "Niche, engaged audiences that match the personas"], ["Broad", "#Sneakers, #FitCheck", "Category context for search"]])}
<p><b>What we didn't do:</b> we haven't published post counts or "volume" for these tags. Instagram doesn't give reliable public numbers, and inventing them would be worse than leaving them out. Before launch: search each tag in the app, note its size and the kind of content it holds, and confirm #AeroRun and #AeroRunFitCheck aren't already used by someone else ${R}. The spreadsheet's Hashtags tab has a column for this.</p>`)}

${sec(12, "Influencer strategy", "Five micro-creators, each chosen for one persona and one job. Honest content over scripted endorsements.", `
${table(["Creator", "City", "Niche", "Persona", "Deliverables", "Fee", "Why"], C.creators.map((x) => [x.id, x.city, x.niche, x.persona.split("").map((k) => C.personas[k].split(" (")[0]).join(", "), x.deliverables, "₹" + x.fee.toLocaleString("en-IN"), x.why]))}
<p class="small muted">Fees are assumptions until confirmed with quotes ${AS}. Total ₹25,000, as in Project 01 ${c("S9")}.</p>
<div class="two" style="display:grid;grid-template-columns:1fr 1fr;gap:6mm">
<div><h3>Selection criteria</h3><ul class="b"><li>≥ 60% of audience aged 18–34 in Indian metros (Insights screenshot)</li><li>Engagement above their niche's median, with comments that read as real</li><li>No competitor deal in the last 90 days</li><li>Brand-safety review of the last 50 posts</li><li>AeroRun fits their existing style; no forced pivots</li></ul></div>
<div><h3>The brief, in one page</h3><ul class="b"><li><b>Must:</b> show the shoe on-foot in the first 2 seconds; mention the official store; use #ad</li><li><b>Freedom:</b> their own voice, edit and music; honest opinions, including one con if they have one</li><li><b>Never:</b> invented specs, discount claims, competitor bashing</li><li><b>Rights:</b> 30-day usage for paid partnership ads</li></ul></div></div>
<h3>Disclosure (ASCI)</h3>
<p>India's advertising self-regulator requires paid creator content to carry a clear, prominent disclosure label <b>in each post</b>, such as #ad, Collaboration or Partnership. A bio mention doesn't count, and 2025 updates say the platform's own paid-partnership tag isn't enough on its own ${c("S5", "S6")} ${V}. Brands share responsibility with creators ${c("S6")}. So every creator caption in the caption library includes #ad, and gifted nano-creator posts are labelled too ${R}.</p>
<h3>Nano-creator seeding</h3>
<p>10–15 gifted pairs to nano-creators (1k–10k followers) with no posting obligation, to seed early #AeroRunFitCheck UGC. The product cost sits outside the ₹1 lakh cash budget ${AS}.</p>
${decision("Use micro-creators as content makers (they shoot the Reels) and run their posts as partnership ads.", "One larger creator; or creators who only repost brand-made content.", "Five creators give five audiences and five content styles to compare. Reposted brand content loses the creator's voice, which is the whole reason followers trust them.")}`)}

${sec(13, "Community management", "Fast, human replies are part of the campaign, not after-sales.", `
<h3>Tone of voice</h3><ul class="b">${C.community.tone.map((t) => `<li>${t}</li>`).join("")}</ul>
<h3>Response times</h3>${table(["Type", "Standard"], C.community.sla)}
<h3>Response playbook</h3>${table(["Situation", "What we do", "Owner"], C.community.tiers)}
<h3>Saved replies</h3>${table(["For", "Reply"], C.community.savedReplies)}
<h3>UGC permission flow</h3><ol class="b" style="margin-left:5mm">${C.community.ugcFlow.map((t) => `<li>${t}</li>`).join("")}</ol>
${decision("Never feature customer content without a written 'yes', and never invent reviews or testimonials.", "Reposting tagged posts automatically (common, and quicker).", "A tag isn't consent. Asking first protects the brand legally, and people are more likely to say yes and share the repost when they've been asked.")}`)}

${sec(14, "Engagement measurement framework", "What we measure, how it's calculated, how often, and what we do when a number moves.", `
${table(["KPI", "What it tells us", "Formula", "Stage"], C.kpis)}
<h3>Benchmarks and targets</h3>
<p>Fashion brands' median Instagram post engagement was about 2.2% in Asia-Pacific in Q2 2026 ${c("S7")} ${V}; our target is ≥ 3.0% by reach for a launch with creator support ${AS}. Benchmarks use different formulas (by followers, reach, impressions or views), so we only compare like with like ${R}.</p>
<h3>Reporting rhythm</h3>
${table(["When", "What", "Decision it drives"], [["Daily (5 min)", "Comments, DMs, response time, sentiment flags", "Reply, escalate, hide"], ["Weekly", "Top 3 and bottom 3 items by sends and saves; creator results", "Brief next week's content; boost winners with paid"], ["Day 24", "Mid-campaign review", "Cut the weakest format; reallocate creator asks"], ["Day 30", "Monthly report (template in the spreadsheet)", "Month-2 plan and scale-up case"]])}
<p>The <b>Monthly Report</b> tab takes weekly numbers in yellow cells and calculates every KPI and a status against target. The <b>Report Example</b> tab shows it filled with clearly labelled <b>dummy data</b>, not results.</p>`)}

${sec(15, "Risks, limitations & next steps", "", `
${table(["Risk", "Mitigation"], [
  ["Creator post underperforms or goes off-brief", "Five creators, not one; brief with must/never lists; approval before posting"],
  ["Comment section fills with ‘too expensive’", "Saved reply + FAQ carousel; never argue; value-adds instead of discounts"],
  ["Fake sellers use our creatives", "Pin the ‘Real ones only’ post; report via Meta IP tools; reply with official links"],
  ["Low UGC volume", "Nano-creator seeding; weekly feature; insert card in the box"],
  ["Algorithm or feature changes mid-month", "Weekly review; formats are diversified across Reels, carousels and Stories"],
])}
<h3>Limitations</h3><ul class="b"><li>All graphics are concepts: product and creator photography would replace the photo/video zones.</li><li>Product attributes are invented for the simulation and labelled as such.</li><li>Targets are assumptions; there is no historical account data yet.</li><li>Hashtag sizes are not verified (see Section 11).</li></ul>
<h3>Next steps</h3><ul class="b"><li>Get quotes from 10–15 creators; confirm fees and audience data.</li><li>Run the Project 01 survey and fold the answers into the angles.</li><li>After month 1, replace assumptions with the week-1 baselines and rerun the plan.</li></ul>`)}

<section class="sec"><div class="num">A</div><h2>Sources</h2><p class="lede">Accessed November 2026.</p>
<table class="rt src-list"><thead><tr><th>ID</th><th>Source</th><th>Type</th></tr></thead><tbody>${SOURCES.map(([id, t, u, q]) => `<tr><td>${id}</td><td>${t}<br><a href="${u}">${u}</a></td><td>${q}</td></tr>`).join("")}</tbody></table></section>`;
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>AeroRun Social Campaign</title><style>${BASE_CSS}${css}</style></head><body>${body}</body></html>`;
}

(async () => {
  const htmlPath = path.join(__dirname, "report.html");
  fs.writeFileSync(htmlPath, render());
  const browser = await puppeteer.launch({ executablePath: CHROME, headless: true });
  try {
    const page = await browser.newPage();
    await page.goto("file:///" + htmlPath.replace(/\\/g, "/"), { waitUntil: "load" });
    await page.evaluateHandle("document.fonts.ready");
    const out = path.join(ROOT, "AeroRun-Social-Strategy.pdf");
    await page.pdf({
      path: out, format: "A4", printBackground: true, preferCSSPageSize: true, displayHeaderFooter: true, headerTemplate: "<span></span>",
      footerTemplate: `<div style="width:100%;font:7px Arial,sans-serif;color:#9aa1ad;padding:0 17mm;display:flex;justify-content:space-between"><span>AeroRun is a fictional product · independent fictional concept · not an official Nike campaign</span><span><span class="pageNumber"></span> / <span class="totalPages"></span></span></div>`,
    });
    console.log("report", out);
  } finally {
    await browser.close();
  }
})().catch((e) => { console.error(e); process.exit(1); });
