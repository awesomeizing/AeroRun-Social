// Writes campaign.json (for build_xlsx.py) and the two Markdown deliverables: Reel scripts and caption library.
const fs = require("fs");
const path = require("path");
const C = require("./content");

const ROOT = path.resolve(__dirname, "..");
const P = (c) => C.pillars.find((p) => p.key === c.pillar).name;
const aud = (c) => c.aud.split("").map((k) => C.personas[k].split(" (")[0]).join(", ");
const files = (c) => c.format === "post" ? `creatives/posts/${c.id}.png` : c.format === "reel" ? `creatives/reels/${c.id}-cover.png` : c.format === "story" ? `creatives/stories/${c.id}-1..3.png` : `creatives/carousels/${c.id}-1..5.png`;
const label = { post: "Post", reel: "Reel", story: "Story sequence", carousel: "Carousel" };

const json = {
  creatives: C.creatives.map((c) => ({
    id: c.id, format: label[c.format], day: c.day, date: C.fmtDate(c.day), phase: C.calendar[c.day - 1].phase, pillar: P(c), title: c.title,
    headline: c.headline.replace(/\n/g, " "), concept: c.concept, direction: c.direction, caption: c.caption, cta: c.cta,
    hashtags: C.hashtagSets[c.pillar].tags.join(" "), audience: aud(c), objective: c.obj, facebook: c.fb, amplify: c.amp ? "Yes" : "No",
    time: C.postTime[c.format], files: files(c), creator: c.creator || "",
  })),
  ops: C.calendar.filter((d) => d.ops).map((d) => ({ day: d.day, date: d.date, phase: d.phase, ops: d.ops })),
  stories: C.calendar[0].stories,
  hashtags: Object.entries(C.hashtagSets).map(([k, v]) => ({ pillar: C.pillars.find((p) => p.key === k).name, tags: v.tags, why: v.why })),
  creators: C.creators.map((c) => ({ ...c, persona: c.persona.split("").map((k) => C.personas[k].split(" (")[0]).join(", "), day: (C.creatives.find((x) => x.creator === c.id) || {}).day || "" })),
  kpis: C.kpis,
  objectives: C.objectives,
};
fs.writeFileSync(path.join(__dirname, "campaign.json"), JSON.stringify(json, null, 1));

// ---- Reel scripts ----
const reels = C.creatives.filter((c) => c.format === "reel");
let md = `# AeroRun: Reel Scripts\n\n8 Reels for the 30-day campaign. Independent fictional concept, not an official Nike ad.\n\n**Format rules for every Reel:** 9:16, 1080 × 1920; product or hook on screen within the first second; captions burned in (many people watch muted); keep text out of the bottom ~320 px and top ~220 px (Instagram UI). Creator Reels are posted as **Paid partnership** with an ASCI disclosure label (#ad) in the caption, not just the platform tag.\n\n`;
for (const r of reels) {
  const cr = r.creator && C.creators.find((x) => x.id === r.creator);
  md += `---\n\n## ${r.id} · ${r.title}\n\n| | |\n|---|---|\n| **Day** | ${r.day} (${C.fmtDate(r.day)}) · ${C.calendar[r.day - 1].phase} phase |\n| **Length** | ${r.len} |\n| **Pillar** | ${P(r)} |\n| **Objective** | ${r.obj} |\n| **Audience** | ${aud(r)} |\n| **Made by** | ${cr ? `Creator ${cr.id}: ${cr.niche}, ${cr.city} (fee ₹${cr.fee.toLocaleString("en-IN")})` : "Brand (in-house shoot)"} |\n| **Cover headline** | ${r.headline.replace(/\n/g, " ")} |\n| **Cover file** | \`creatives/reels/${r.id}-cover.png\` |\n\n**Concept.** ${r.concept}\n\n**Visual direction.** ${r.direction}\n\n| Time | Shot | On-screen text | Audio / VO |\n|---|---|---|---|\n${r.script.map((s) => `| ${s.join(" | ")} |`).join("\n")}\n\n**Caption.** ${r.caption.replace(/\n+/g, " ")}\n\n**CTA.** ${r.cta} · **Hashtags.** ${C.hashtagSets[r.pillar].tags.join(" ")} · **Facebook.** ${r.fb}\n\n`;
}
fs.writeFileSync(path.join(ROOT, "AeroRun-Reel-Scripts.md"), md);

// ---- Caption library ----
let cap = `# AeroRun: Caption Library\n\nEvery caption in the 30-day campaign, ready to copy. Independent fictional concept, not an official Nike ad.\n\n**House rules**\n- First line = the hook. Instagram truncates after about 125 characters, so the point comes first.\n- Max **5 hashtags** (Instagram's current cap), at the end of the caption.\n- Creator posts carry **#ad** (ASCI disclosure) in the caption, not only the Paid-partnership tag.\n- Text in [square brackets] is filled in only with real details, such as a real customer handle or a real review used with permission.\n- Say "AeroRun", never "Nike AeroRun", in public copy.\n\n`;
for (const f of ["post", "reel", "carousel", "story"]) {
  cap += `## ${label[f]}s\n\n`;
  for (const c of C.creatives.filter((x) => x.format === f)) {
    cap += `### ${c.id} · ${c.title}\n*Day ${c.day} · ${P(c)} · ${c.obj} · for ${aud(c)}*\n\n\`\`\`text\n${c.caption}\n\n${C.hashtagSets[c.pillar].tags.join(" ")}\n\`\`\`\n**CTA:** ${c.cta}\n\n`;
  }
}
cap += `## Saved replies (community management)\n\n${C.community.savedReplies.map(([k, v]) => `**${k}**\n\`\`\`text\n${v}\n\`\`\``).join("\n\n")}\n`;
fs.writeFileSync(path.join(ROOT, "AeroRun-Caption-Library.md"), cap);
console.log("wrote campaign.json, AeroRun-Reel-Scripts.md, AeroRun-Caption-Library.md");
