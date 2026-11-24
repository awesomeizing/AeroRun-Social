// Single source of truth for Project 02. Creatives, calendar, spreadsheet, report and deck all read from here.
const assert = require("assert");

const START = new Date(Date.UTC(2027, 0, 11)); // Day 1 = Mon 11 Jan 2027 (ASSUMPTION: launch month)
const dayDate = (d) => new Date(START.getTime() + (d - 1) * 864e5);
const fmtDate = (d) => dayDate(d).toLocaleDateString("en-GB", { weekday: "short", day: "2-digit", month: "short", timeZone: "UTC" });

const personas = {
  A: "Aarav (21, Pune): Feed-First Stylist",
  M: "Meera (24, Bengaluru): Versatile Professional",
  K: "Kabir (19, Delhi NCR): Culture Climber",
};

const pillars = [
  { key: "style", name: "Fit Check", theme: "Style", target: 0.40, color: "#ff4f2e", job: "Show AeroRun styled on real people in real outfits. Answers 'will it work with my clothes?'" },
  { key: "proof", name: "Light Proof", theme: "Proof & value", target: 0.25, color: "#1b2340", job: "Prove comfort, authenticity and value. Answers 'is it worth ₹5,999?' and 'is it genuine?'" },
  { key: "crew", name: "The Crew", theme: "Community & creators", target: 0.25, color: "#6a35d4", job: "Put creators and customers at the centre: UGC, Q&As, challenges. Builds social proof the brand can't claim itself." },
  { key: "drop", name: "The Drop", theme: "Launch moments", target: 0.10, color: "#0f7b5a", job: "Mark the big moments: tease, reveal, launch day. Kept small so the feed never feels like a sales catalogue." },
];

const phases = [
  { name: "Tease", days: [1, 4], goal: "Create curiosity and a reminder list before launch", kpi: "Reach, countdown reminders, comments" },
  { name: "Reveal", days: [5, 9], goal: "Launch the product and the campaign idea", kpi: "Reach, Reel watch time, sends" },
  { name: "Prove & Style", days: [10, 20], goal: "Answer comfort, value and authenticity doubts; show versatility", kpi: "Saves, link clicks, profile visits" },
  { name: "Convert & Crew", days: [21, 30], goal: "Turn interest into purchase intent and UGC", kpi: "Add-to-carts (UTM), UGC posts, DMs" },
];

const hashtagSets = {
  style: { tags: ["#AeroRunFitCheck", "#FitCheck", "#StreetwearIndia", "#OOTDIndia", "#Sneakers"], why: "Campaign tag + one broad discovery tag + two India style communities + category" },
  proof: { tags: ["#AeroRun", "#SneakersIndia", "#SneakerReview", "#EverydayStyle", "#Sneakers"], why: "Brand tag + India category + review-intent searchers" },
  crew: { tags: ["#AeroRunFitCheck", "#IndianSneakerheads", "#SneakersIndia", "#CampusStyle", "#StreetStyleIndia"], why: "UGC tag first so customers copy it; sneaker and campus communities" },
  drop: { tags: ["#AeroRun", "#NewDrop", "#SneakerRelease", "#SneakersIndia", "#Sneakers"], why: "Launch-intent tags people browse around release days" },
};

// format: post | reel | story | carousel. aud: persona keys. obj: Awareness | Engagement | Consideration | Purchase intent
const creatives = [
  // ---------------- POSTS (12) ----------------
  { id: "P01", format: "post", day: 1, pillar: "drop", aud: "AMK", obj: "Awareness", title: "Something light is coming",
    headline: "Something light\nis coming.", template: "tease",
    concept: "Pure typography on ink black with the aero-lines motif sweeping across. No product shown: the absence creates curiosity.",
    direction: "Ink background, oversized Space Grotesk headline, three orange aero lines, date stamp '15.01' in the corner.",
    caption: `Something light is coming. 15.01.\n\nTurn on post notifications so you don't miss it.`, cta: "Turn on notifications", fb: "Cross-post as feed image", amp: false },
  { id: "P02", format: "post", day: 3, pillar: "style", aud: "AK", obj: "Engagement", title: "Guess the colourway",
    headline: "Guess the\ncolourway.", template: "silhouette",
    concept: "Close crop of the shoe in deep shadow, only the outline and aero lines lit. A guessing game that drives comments before launch.",
    direction: "Navy-to-black background, shoe in silhouette with a thin rim light, four colour dots as hints at the bottom.",
    caption: `Four colourways. One hint: one of them is named after fire.\n\nDrop your guess in the comments. Right answers get a shout-out on launch day 🔥`, cta: "Comment your guess", fb: "Skip (Instagram-only game)", amp: false },
  { id: "P03", format: "post", day: 5, pillar: "drop", aud: "AMK", obj: "Awareness", title: "Launch hero: AeroRun is here",
    headline: "Light on your feet.\nLoud on your feed.", template: "hero",
    concept: "The campaign line, the shoe at hero scale and the price, stated confidently. The single post that defines the launch.",
    direction: "White canvas, Ember colourway at 80% width, headline top-left, '₹5,999 · Official store' price chip bottom-left.",
    caption: `AeroRun is here.\n\nA lightweight lifestyle runner that looks good in the fit check and still feels light at 9 pm. ₹5,999, only at the official store.\n\nTap the link in bio to pick your colourway.`, cta: "Shop via link in bio", fb: "Cross-post + pin to Page", amp: true },
  { id: "P04", format: "post", day: 6, pillar: "style", aud: "AMK", obj: "Engagement", title: "Four colourways",
    headline: "Which one\nare you?", template: "colourways",
    concept: "2 × 2 grid of the four colourways, each with a one-word personality. Built to be sent to friends ('you're so Midnight').",
    direction: "Mist background, four rounded tiles each tinted to the colourway, name + personality word under each shoe.",
    caption: `Ember. Midnight. Chalk. Sage.\n\nWhich one are you, and which one is your best friend? Send this to them and find out if they agree 👀`, cta: "Send to a friend", fb: "Cross-post as feed image", amp: false },
  { id: "P05", format: "post", day: 8, pillar: "proof", aud: "AK", obj: "Consideration", title: "Iconic style. Under ₹6K.",
    headline: "Iconic style.\nUnder ₹6K.", template: "ladder",
    concept: "Price Smart angle from Project 01: the price ladder made social. Shows AeroRun as the smart entry into iconic style, not the 'cheap' option.",
    direction: "Ink background, bold headline, minimal horizontal bar showing ₹5,999 against an unlabelled '₹10k+ icons' bar. No competitor names on the creative.",
    caption: `The look you've been saving for, without saving for six months.\n\nAeroRun: ₹5,999. Official store, free size exchange, no guesswork.`, cta: "Shop the drop", fb: "Cross-post; boost to retargeting", amp: true },
  { id: "P06", format: "post", day: 11, pillar: "proof", aud: "M", obj: "Consideration", title: "What makes it light",
    headline: "Built light.\nStyled loud.", template: "spec",
    concept: "Exploded product card with three callouts (foam, upper, outsole). Product attributes are fictional for this simulation and labelled so.",
    direction: "Mist background, shoe centred, three thin leader lines to callout labels, small 'Concept specs' tag.",
    caption: `What's inside:\n• Running-derived foam for all-day comfort\n• Breathable knit upper\n• Grippy rubber outsole for metro stairs and monsoon pavements\n\nSave this for when someone asks "but is it comfortable?"`, cta: "Save for later", fb: "Cross-post as feed image", amp: false },
  { id: "P07", format: "post", day: 13, pillar: "proof", aud: "AK", obj: "Consideration", title: "Real ones only",
    headline: "Real ones\nonly.", template: "trust",
    concept: "Authenticity explainer: where to buy genuine AeroRun and three ways to spot a fake. Tackles the counterfeit fear head-on (H4).",
    direction: "White background, large 'official store' badge, three numbered checks, warning strip in accent colour.",
    caption: `Seen AeroRun for ₹1,999 on a random Instagram ad? That's not us.\n\nGenuine AeroRun is sold only at the official store and listed partners. Check the three signs in this post before you buy.\n\nSave it. Share it with the friend who always finds "deals".`, cta: "Save & share", fb: "Cross-post; high priority on Facebook", amp: true },
  { id: "P08", format: "post", day: 15, pillar: "crew", aud: "AK", obj: "Engagement", title: "Your fit, our feed",
    headline: "Your fit.\nOur feed.", template: "ugcCall",
    concept: "Launches the #AeroRunFitCheck UGC mechanic: post your fit, tag us, get featured on the brand feed every Friday.",
    direction: "Phone-frame graphic with a photo zone, hashtag as a big sticker, 'Featured every Friday' badge.",
    caption: `Got your AeroRun? Show us the fit.\n\nPost it with #AeroRunFitCheck and tag us. Every Friday we feature our favourite fits on this feed. Real fits, real people, no filters required.`, cta: "Post with #AeroRunFitCheck", fb: "Cross-post", amp: false },
  { id: "P09", format: "post", day: 16, pillar: "proof", aud: "AM", obj: "Purchase intent", title: "No sale. Free size exchange.",
    headline: "No sale.\nJust no stress.", template: "noSale",
    concept: "On Republic Day, when every brand runs a sale, AeroRun deliberately doesn't. It reminds buyers of the free size exchange instead (Project 01 TOWS: value-adds, not discounts).",
    direction: "Bold typographic poster, strikethrough on 'SALE', exchange promise in a white card, calm navy background.",
    caption: `Everyone's having a sale today. We're not.\n\nWhat we do have: free size exchange on every AeroRun, so you can order without stressing about fit.`, cta: "Shop with free exchange", fb: "Cross-post; boost to warm audience", amp: true },
  { id: "P10", format: "post", day: 19, pillar: "crew", aud: "AMK", obj: "Engagement", title: "Fit check of the week",
    headline: "Fit check\nof the week.", template: "ugcFeature",
    concept: "Weekly feature of the best customer UGC. Template shown with a photo placeholder: it only goes live with a real post, used with written permission.",
    direction: "Polaroid-style photo frame, credit line '@handle · city', orange 'Featured' sticker.",
    caption: `Fit check of the week goes to @[customer handle] in [city] 👏\n\n[One line on what we love about the fit.]\n\nWant to be next? Post with #AeroRunFitCheck.`, cta: "Post with #AeroRunFitCheck", fb: "Cross-post", amp: false },
  { id: "P11", format: "post", day: 23, pillar: "crew", aud: "M", obj: "Purchase intent", title: "What buyers are saying",
    headline: "What buyers\nnoticed.", template: "review",
    concept: "Review spotlight. The template has placeholder slots: only real, verified reviews, quoted with the reviewer's permission. No invented testimonials.",
    direction: "Three stacked quote cards with star rows and 'Verified buyer' tags; placeholder text clearly marked in the sample.",
    caption: `We asked our first buyers what they noticed after a week in AeroRun. Here's what they said, unedited.\n\n[Only real reviews, shared with permission.]`, cta: "Read all reviews (link in bio)", fb: "Cross-post; boost to retargeting", amp: true },
  { id: "P12", format: "post", day: 28, pillar: "style", aud: "K", obj: "Purchase intent", title: "Gift the fit",
    headline: "Gift the fit.", template: "gift",
    concept: "Valentine's week gifting post (starts on Rose Day). Targets Kabir's co-decision hypothesis: a gift that parents, partners or friends can buy.",
    direction: "Shoe peeking out of an open box with a gift tag reading 'For the one with the best fits'. Warm accent palette.",
    caption: `Know someone whose fits deserve an upgrade?\n\nAeroRun comes gift-ready, with free size exchange, so it's the safest gift you'll give this Valentine's week.`, cta: "Shop gifts", fb: "Cross-post; Facebook priority (gift-givers)", amp: true },

  // ---------------- REELS (8) ----------------
  { id: "R01", format: "reel", day: 2, pillar: "style", aud: "AK", obj: "Awareness", title: "The sound of light", len: "12 sec",
    headline: "What does light\nsound like?", template: "reel",
    concept: "ASMR teaser: box opening, tissue rustle, laces pulled tight, the shoe dropped onto a table with almost no sound. Cuts before the full reveal.",
    direction: "Macro shots, dark set, single warm light, crisp foley audio, no music until the final beat.",
    caption: `Turn your sound on 🔊\n\n15.01.`, cta: "Turn on notifications", fb: "Cross-post as Reel", amp: false,
    script: [["0–2s", "Close-up: box lid lifts in darkness", "WHAT DOES LIGHT SOUND LIKE?", "Silence, then tissue paper rustle"], ["2–6s", "Macro: laces pulled tight, aero lines catch the light", "—", "Lace zip foley"], ["6–9s", "Shoe dropped onto table from 10 cm, barely a sound", "—", "Soft tap"], ["9–12s", "Cut to black, date appears", "15.01", "Single bass hit"]] },
  { id: "R02", format: "reel", day: 5, pillar: "style", aud: "A", obj: "Awareness", title: "Reveal: 3 fits, 1 pair", len: "15 sec",
    headline: "3 fits.\n1 pair.", template: "reel",
    concept: "Hero launch Reel (Project 01 Angle A). One creator, three outfit transitions on the beat (campus, gig, date night), same AeroRun throughout.",
    direction: "Fast match-cut transitions on a fixed tripod, feet first then full body, text pops on each beat, ends on product + price.",
    caption: `3 fits. 1 pair. AeroRun is here.\n\n₹5,999 · Official store · Free size exchange.`, cta: "Shop now", fb: "Cross-post as Reel; main launch ad", amp: true,
    script: [["0–1s", "Feet in AeroRun stamp onto frame", "3 FITS. 1 PAIR.", "Beat drops"], ["1–5s", "Transition 1: campus fit (hoodie, cargos)", "CAMPUS", "Beat"], ["5–9s", "Transition 2: gig fit (oversized shirt, denim)", "GIG", "Beat"], ["9–12s", "Transition 3: date-night fit (knit polo, trousers)", "DATE NIGHT", "Beat"], ["12–15s", "Product shot, all four colourways", "AERORUN · ₹5,999", "Outro sting"]] },
  { id: "R03", format: "reel", day: 7, pillar: "style", aud: "A", obj: "Consideration", title: "Creator #1: Mumbai style", len: "20 sec",
    headline: "Styling AeroRun\nin Bandra.", template: "reel", creator: "C1",
    concept: "Partnership Reel from the Mumbai style creator: a street-style walk through Bandra with three quick styling tips.",
    direction: "Creator's own handheld style, natural light, voiceover in their voice (English/Hinglish). Brand only checks facts and labels.",
    caption: `@[creator] styling AeroRun three ways in Bandra 👟\n\n#ad #AeroRunFitCheck`, cta: "Shop the look", fb: "Cross-post as partnership Reel", amp: true,
    script: [["0–2s", "Creator stops mid-walk, points at shoes", "ONE SNEAKER, THREE BANDRA FITS", "VO: \"Okay, these are actually light\""], ["2–8s", "Tip 1: cuff the jeans to show the aero lines", "TIP 1: SHOW THE LINES", "VO tip"], ["8–14s", "Tip 2: match the Ember accent with one orange piece", "TIP 2: ONE ACCENT", "VO tip"], ["14–18s", "Tip 3: go monochrome with Midnight", "TIP 3: MONOCHROME", "VO tip"], ["18–20s", "Creator to camera", "#AERORUNFITCHECK", "VO: \"Your turn\""]] },
  { id: "R04", format: "reel", day: 10, pillar: "proof", aud: "M", obj: "Consideration", title: "9 am to 9 pm: still light", len: "25 sec",
    headline: "9 am lecture.\n9 pm gig.\nStill light.", template: "reel", creator: "C2",
    concept: "Day-in-the-life with the Bengaluru creator (Project 01 Angle B): metro, office, a long walk, dinner, and the shoes never come off.",
    direction: "Clock-stamped time-lapse, consistent framing on the feet, warm evening grade at the end.",
    caption: `12 hours, one pair. @[creator] put AeroRun through a real Bengaluru day.\n\n#ad #AeroRun`, cta: "Save for your next long day", fb: "Cross-post as Reel", amp: true,
    script: [["0–2s", "Alarm at 7:30, shoes by the door", "9 AM → 9 PM IN ONE PAIR", "Alarm sound"], ["2–8s", "Metro platform, stairs, office lift", "9:00 METRO", "Upbeat track"], ["8–14s", "Desk to coffee run", "1:00 LUNCH WALK", "Track"], ["14–20s", "Evening walk, real step count shown on the creator's phone", "6:30 · [REAL STEP COUNT]", "Track"], ["20–25s", "Dinner with friends, still in AeroRun", "9 PM. STILL LIGHT.", "VO: creator's honest verdict"]] },
  { id: "R05", format: "reel", day: 14, pillar: "crew", aud: "K", obj: "Consideration", title: "Sneakerhead unboxing", len: "30 sec",
    headline: "Honest\nunboxing.", template: "reel", creator: "C3",
    concept: "Delhi sneaker reviewer does an honest unboxing and first impressions, including one thing they'd change. Honesty builds credibility with Kabir.",
    direction: "Reviewer's own desk set-up, top-down unboxing, close-ups of stitching, outsole and tag.",
    caption: `@[creator]'s honest first take on AeroRun, including the one thing they'd change.\n\n#ad #IndianSneakerheads`, cta: "Read the full take in comments", fb: "Cross-post as Reel", amp: true,
    script: [["0–3s", "Box slides into frame", "HONEST AERORUN UNBOXING", "VO: \"Let's see if it's worth ₹5,999\""], ["3–12s", "Top-down unboxing, tissue, insert card", "WHAT'S IN THE BOX", "VO"], ["12–20s", "Close-ups: stitching, foam, outsole", "BUILD CHECK", "VO verdict on quality"], ["20–26s", "On-foot walk test", "ON FOOT", "VO: comfort verdict"], ["26–30s", "Rating card", "WHAT I'D CHANGE: …", "VO: honest con"]] },
  { id: "R06", format: "reel", day: 18, pillar: "proof", aud: "MA", obj: "Consideration", title: "Reply: is it actually comfortable?", len: "20 sec",
    headline: "\"But is it\ncomfortable?\"", template: "reel", creator: "C4",
    concept: "Reply-to-comment Reel: the most common question from comments, answered on camera by the Pune creator with a campus stair-climb test.",
    direction: "Starts with the real comment sticker on screen (with permission), handheld, campus stairs, honest tone.",
    caption: `You asked, @[creator] tested it. 6 floors of campus stairs later…\n\n#ad #AeroRun`, cta: "Comment your next question", fb: "Cross-post as Reel", amp: false,
    script: [["0–2s", "Comment sticker on screen", "REPLYING TO: 'BUT IS IT COMFORTABLE?'", "VO: \"Fair question\""], ["2–10s", "Creator runs up campus stairs", "6 FLOORS. NO LIFT.", "Track"], ["10–16s", "Sits, presses the foam, flexes the sole", "THE FOAM TEST", "VO verdict"], ["16–20s", "To camera", "ASK US ANYTHING ↓", "VO: \"Next question?\""]] },
  { id: "R07", format: "reel", day: 22, pillar: "crew", aud: "AK", obj: "Engagement", title: "#AeroRunFitCheck challenge", len: "15 sec",
    headline: "Your move.", template: "reel", creator: "C5",
    concept: "Dance/movement creator from Hyderabad starts a remixable fit-check challenge: one move, outfit switch on the beat. Built for Remix and sends.",
    direction: "Simple repeatable move, clean wall background, audio saved as an original sound people can reuse.",
    caption: `New challenge: one move, one outfit switch, one pair. Remix this with #AeroRunFitCheck and we'll feature our favourites 🕺\n\n#ad`, cta: "Remix this Reel", fb: "Cross-post as Reel", amp: true,
    script: [["0–3s", "Creator in fit 1, counts in", "#AERORUNFITCHECK CHALLENGE", "Original audio starts"], ["3–7s", "The move", "—", "Beat"], ["7–8s", "Jump-cut switch to fit 2 on the beat", "—", "Beat"], ["8–12s", "Move repeated in fit 2", "—", "Beat"], ["12–15s", "Point at camera", "YOUR MOVE. REMIX IT.", "Audio end"]] },
  { id: "R08", format: "reel", day: 25, pillar: "style", aud: "AK", obj: "Engagement", title: "Ember vs Midnight", len: "15 sec",
    headline: "Ember or\nMidnight?", template: "reel",
    concept: "Colourway personality Reel: two friends, two colourways, two vibes. Ends with 'send this to your Midnight friend'. Designed for sends per reach.",
    direction: "Split-screen, each friend styled to their colourway, quick-fire comparison captions.",
    caption: `Ember people: first on the dance floor. Midnight people: already left with the snacks.\n\nSend this to your Midnight friend 🖤`, cta: "Send to a friend", fb: "Cross-post as Reel", amp: false,
    script: [["0–2s", "Split screen, two friends", "EMBER OR MIDNIGHT?", "Track"], ["2–6s", "'Ember people…' vs 'Midnight people…' gag 1", "EMBER: FRONT ROW / MIDNIGHT: BACK ROW", "Track"], ["6–10s", "Gag 2", "EMBER: TEXTS FIRST / MIDNIGHT: LEFT ON READ", "Track"], ["10–15s", "Both shoes side by side", "SEND THIS TO YOUR MIDNIGHT FRIEND", "Track"]] },

  // ---------------- STORY SEQUENCES (5) ----------------
  { id: "S01", format: "story", day: 1, pillar: "crew", aud: "AMK", obj: "Engagement", title: "Countdown & guessing game",
    headline: "4 days to go", template: "story",
    concept: "Three-frame teaser sequence posted Day 1 and refreshed daily to launch. Quiz, poll and countdown stickers turn followers into a reminder list.",
    direction: "Ink frames, orange stickers, aero lines across each frame.",
    caption: `Frame captions: "Something light is coming" / "Quiz: how light is light?" / "Set your reminder"`, cta: "Tap 'Remind me' on the countdown", fb: "Facebook Stories: frames 1 and 3 only", amp: false,
    frames: [{ k: "COMING 15.01", h: "Something\nlight is\ncoming.", sticker: null }, { k: "QUIZ", h: "How light\nis light?", sticker: { type: "quiz", q: "Guess the feel", opts: ["Like a feather", "Like a cloud", "Like nothing at all"] } }, { k: "SET A REMINDER", h: "Don't miss\nthe drop.", sticker: { type: "countdown", q: "AeroRun drops", opts: ["15 Jan · 6 pm"] } }] },
  { id: "S02", format: "story", day: 5, pillar: "drop", aud: "AMK", obj: "Purchase intent", title: "Launch day",
    headline: "It's here.", template: "story",
    concept: "Launch-day Stories: reveal, colourway poll, then a link sticker straight to the product page. Shortest path from hype to product page.",
    direction: "Frame 1 white with hero shoe, frame 2 colourway poll, frame 3 link sticker with price.",
    caption: `Frame captions: "It's here." / "Which colourway first?" / "Shop AeroRun · ₹5,999"`, cta: "Tap the link sticker", fb: "Facebook Stories: all frames", amp: true,
    frames: [{ k: "LAUNCH DAY", h: "It's here.", sticker: null, light: true }, { k: "PICK ONE", h: "Which\ncolourway\nfirst?", sticker: { type: "poll", q: "First pick", opts: ["Ember", "Midnight"] } }, { k: "₹5,999 · OFFICIAL STORE", h: "Shop\nAeroRun.", sticker: { type: "link", q: "", opts: ["SHOP AERORUN"] } }] },
  { id: "S03", format: "story", day: 12, pillar: "style", aud: "AM", obj: "Engagement", title: "This or that: style quiz",
    headline: "This or that?", template: "story",
    concept: "Interactive styling quiz: two quick 'this or that' polls, then a result frame recommending a colourway with a link to C02 (3 ways to wear).",
    direction: "Big poll stickers on ink frames, result frame in the recommended colour.",
    caption: `Frame captions: "Jeans or cargos?" / "Night out or day out?" / "Your match: Midnight"`, cta: "Vote, then see '3 ways to wear'", fb: "Skip", amp: false,
    frames: [{ k: "THIS OR THAT 1/2", h: "Jeans\nor cargos?", sticker: { type: "poll", q: "", opts: ["Jeans", "Cargos"] } }, { k: "THIS OR THAT 2/2", h: "Day out\nor night out?", sticker: { type: "poll", q: "", opts: ["Day", "Night"] } }, { k: "YOUR MATCH", h: "You're a\nMidnight.", sticker: { type: "link", q: "", opts: ["SEE 3 WAYS TO WEAR"] } }] },
  { id: "S04", format: "story", day: 21, pillar: "crew", aud: "AMK", obj: "Consideration", title: "Creator AMA takeover",
    headline: "Ask me anything", template: "story", creator: "C4",
    concept: "The Pune creator takes over Stories for a day: a question box, answers on video, and a final frame with the size guide. Real questions only.",
    direction: "Creator selfie frames (photo zone), question-box sticker, answers as text overlays in brand style.",
    caption: `Frame captions: "Takeover: ask me anything about AeroRun" / "Answer: sizing" / "Size guide + free exchange"`, cta: "Ask a question", fb: "Skip", amp: false,
    frames: [{ k: "TAKEOVER", h: "Ask me\nanything.", sticker: { type: "question", q: "Ask about AeroRun", opts: [] }, photo: true }, { k: "YOU ASKED", h: "\"True to\nsize?\"", sticker: null, photo: true, sub: "Answered on video by the creator" }, { k: "SIZE GUIDE", h: "Still unsure?\nFree exchange.", sticker: { type: "link", q: "", opts: ["OPEN SIZE GUIDE"] } }] },
  { id: "S05", format: "story", day: 27, pillar: "style", aud: "K", obj: "Purchase intent", title: "Valentine's gift guide",
    headline: "Gift guide", template: "story",
    concept: "Gift guide sequence for Valentine's week: who to gift which colourway, gift-ready packaging, delivery cut-off reminder.",
    direction: "Warm palette, gift-tag shapes, slider sticker 'how badly do they need new sneakers?'.",
    caption: `Frame captions: "For the loud one: Ember" / "How badly do they need new kicks?" / "Order by 11 Feb for Valentine's"`, cta: "Tap the link sticker", fb: "Facebook Stories: all frames (gift-givers)", amp: true,
    frames: [{ k: "GIFT GUIDE 1/3", h: "For the\nloud one:\nEmber.", sticker: null }, { k: "GIFT GUIDE 2/3", h: "How badly\ndo they need\nnew kicks?", sticker: { type: "slider", q: "", opts: [] } }, { k: "GIFT GUIDE 3/3", h: "Order by\n11 Feb.", sticker: { type: "link", q: "", opts: ["SHOP GIFTS"] } }] },

  // ---------------- CAROUSELS (3) ----------------
  { id: "C01", format: "carousel", day: 4, pillar: "proof", aud: "AMK", obj: "Consideration", title: "Why we made AeroRun",
    headline: "Why we made\nAeroRun.", template: "carousel",
    concept: "Brand-story carousel: the problem (iconic looks cost ₹10k+), the idea, the feel, the look, the date. Swipe-through narrative that sets up the launch.",
    direction: "Alternating ink and white slides, one idea per slide, aero lines continuing across slide edges so the swipe feels seamless.",
    caption: `Why does the sneaker everyone wants cost more than a month's rent? We asked the same thing. Swipe →\n\nAeroRun drops 15.01.`, cta: "Swipe and save", fb: "Cross-post as multi-image", amp: false,
    slides: [["01", "Why we made\nAeroRun."], ["02", "The look you want\nusually costs ₹10k+."], ["03", "So we built one\nthat doesn't."], ["04", "Running-derived comfort.\nEveryday style."], ["05", "AeroRun.\nDrops 15.01."]] },
  { id: "C02", format: "carousel", day: 9, pillar: "style", aud: "M", obj: "Consideration", title: "3 ways to wear AeroRun",
    headline: "3 ways to\nwear it.", template: "carousel",
    concept: "Styling guide (Meera): office, weekend, evening. Each slide a flat-lay layout with the outfit pieces and AeroRun. Highly saveable.",
    direction: "Mist background, flat-lay photo zones with labelled pieces, colourway chip on each slide.",
    caption: `One pair, three plans. Office, weekend, evening: here's how we'd wear AeroRun.\n\nSave this for your next "what do I wear" moment.`, cta: "Save this post", fb: "Cross-post as multi-image", amp: true,
    slides: [["01", "3 ways to\nwear it."], ["02", "Office:\nChalk + wide trousers"], ["03", "Weekend:\nSage + denim"], ["04", "Evening:\nMidnight + all black"], ["05", "Which one's\nyour plan?"]] },
  { id: "C03", format: "carousel", day: 17, pillar: "proof", aud: "AM", obj: "Purchase intent", title: "Is it worth ₹5,999? Honest FAQ",
    headline: "Is it worth\n₹5,999?", template: "carousel",
    concept: "FAQ carousel built from real comment questions: sizing, comfort, authenticity, exchange. Removes the last purchase barriers.",
    direction: "Question-and-answer cards, big question mark motif, final slide with link-in-bio CTA.",
    caption: `Your top questions, answered honestly. Swipe →\n\nStill have one? Drop it below and we'll reply.`, cta: "Comment your question", fb: "Cross-post as multi-image", amp: true,
    slides: [["01", "Is it worth\n₹5,999?"], ["02", "Does it run\ntrue to size?"], ["03", "Is it comfortable\nall day?"], ["04", "How do I know\nit's genuine?"], ["05", "Free size exchange.\nLink in bio."]] },
];

const creators = [
  { id: "C1", city: "Mumbai", niche: "Street-style fashion", persona: "A", deliverables: "R03 partnership Reel + 3 Stories", fee: 5000, why: "Owns the Fit Check angle; audience matches Aarav" },
  { id: "C2", city: "Bengaluru", niche: "Women's minimal / workwear style", persona: "M", deliverables: "R04 day-in-the-life Reel + C02 outfit input", fee: 5000, why: "Women-led styling, the gap Meera's persona flagged" },
  { id: "C3", city: "Delhi NCR", niche: "Sneaker reviews", persona: "K", deliverables: "R05 honest unboxing Reel", fee: 5000, why: "Credibility with sneaker culture; honesty beats hype" },
  { id: "C4", city: "Pune", niche: "Campus lifestyle", persona: "A", deliverables: "R06 reply Reel + S04 Stories takeover", fee: 5000, why: "Answers real questions in a peer voice" },
  { id: "C5", city: "Hyderabad", niche: "Dance / movement", persona: "AK", deliverables: "R07 challenge Reel + original audio", fee: 5000, why: "Remixable format built for sends and UGC" },
];

// Organic + creator SMART objectives for the 30 days (paid media is Project 01's budget and reported separately)
const assumptions = { avgCreatorFollowers: 30000, creatorReachRate: 0.40, linkClicks: 1500, lpvRate: 0.8, atcRate: 0.08 };
const creatorReach = creators.length * assumptions.avgCreatorFollowers * assumptions.creatorReachRate;
const atcTarget = Math.round(assumptions.linkClicks * assumptions.lpvRate * assumptions.atcRate);

const objectives = [
  { stage: "Awareness", kpi: "Reach from creator partnership content", target: Math.round(creatorReach).toLocaleString("en-IN"), basis: "5 creators × ~30,000 followers × 40% reach rate (assumption)" },
  { stage: "Awareness", kpi: "Brand-account followers", target: "3,000", basis: "New launch account; assumption to recalibrate after week 1" },
  { stage: "Engagement", kpi: "Engagement rate by reach (organic feed)", target: "≥ 3.0%", basis: "Above ~2.2% fashion median on Instagram (Emplifi, Q2 2026)" },
  { stage: "Engagement", kpi: "Sends per reach", target: "Week-1 baseline +20% by week 4", basis: "No reliable public benchmark, so set our own baseline" },
  { stage: "Consideration", kpi: "Link clicks (link sticker + bio link, UTM-tagged)", target: assumptions.linkClicks.toLocaleString("en-IN"), basis: "Assumption" },
  { stage: "Purchase intent", kpi: "Add-to-carts from social UTMs", target: String(atcTarget), basis: "1,500 clicks × 80% page loads × 8% add-to-cart (Project 01 rate)" },
  { stage: "Community", kpi: "#AeroRunFitCheck UGC posts", target: "50", basis: "Assumption; first-month UGC from buyers + seeded nano-creators" },
  { stage: "Community", kpi: "Median comment response time", target: "< 2 hours (10 am–10 pm)", basis: "Service standard" },
];

const kpis = [
  ["Reach", "Unique accounts that saw content", "Platform metric", "Awareness"],
  ["Engagement rate (by reach)", "Engaged share of people reached", "(likes + comments + saves + shares) ÷ reach", "Engagement"],
  ["Sends per reach", "How often people DM our content to friends, Instagram's key signal for non-follower reach", "shares ÷ reach", "Engagement"],
  ["Save rate", "Content worth coming back to", "saves ÷ reach", "Consideration"],
  ["Average watch time / 3-sec hold", "Did the hook work?", "3-sec views ÷ plays; platform avg watch time", "Awareness"],
  ["Story completion rate", "Share of viewers who reach the last frame", "last-frame reach ÷ first-frame reach", "Engagement"],
  ["Sticker tap rate", "Interactive engagement in Stories", "sticker taps ÷ story reach", "Engagement"],
  ["Link click rate", "Traffic intent", "link clicks ÷ reach", "Consideration"],
  ["Profile visit rate", "Curiosity about the brand", "profile visits ÷ reach", "Consideration"],
  ["Follower growth rate", "Audience building", "new followers ÷ starting followers", "Awareness"],
  ["Add-to-carts (UTM)", "Purchase intent from social traffic", "GA4, filtered by utm_source=instagram/facebook", "Purchase intent"],
  ["Creator cost per engagement", "Value of each creator", "creator fee ÷ engagements on their content", "Efficiency"],
  ["UGC volume", "Community momentum", "count of #AeroRunFitCheck posts", "Community"],
  ["Positive sentiment share", "Brand health", "positive comments ÷ classified comments", "Community"],
  ["Median response time", "Service quality", "median minutes to first reply", "Community"],
];

const community = {
  tone: ["Sound like a friend who knows sneakers, not a call centre", "Short, warm, specific; use the commenter's name or detail", "Hinglish is fine when the commenter uses it", "Never argue in public; move problems to DMs", "Never promise what the product page doesn't (no invented specs or delivery dates)"],
  sla: [["Comments", "Within 2 hours, 10 am–10 pm"], ["DMs", "Within 4 hours, 10 am–10 pm"], ["Complaints", "Acknowledge within 1 hour; resolve or update within 24 hours"], ["Crisis signals", "Escalate to the brand lead within 1 hour"]],
  tiers: [
    ["Praise / fit photos", "Like + personal reply; ask permission to feature (see UGC flow)", "Community manager"],
    ["Product questions (size, comfort, delivery)", "Reply with the saved answer + link to the FAQ carousel or size guide", "Community manager"],
    ["Price objections ('too expensive')", "Acknowledge, don't argue; mention free size exchange and official-store authenticity", "Community manager"],
    ["Complaints (order, quality)", "Thank, apologise, move to DM, log the case, follow up in 24 hours", "CM → customer care"],
    ["Counterfeit reports / fake-seller links", "Thank the person, confirm official channels, report the account with Meta's IP reporting tools", "CM → brand lead"],
    ["Spam, hate, harassment", "Hide or delete per the moderation policy; block repeat offenders; don't engage", "Community manager"],
    ["Crisis (trending defect claim, creator controversy)", "Pause scheduled posts and boosts; holding statement; escalate", "Brand lead"],
  ],
  savedReplies: [
    ["Sizing", `AeroRun runs true to size for most people. Our size guide is in the link in bio, and if it's not right, size exchange is free 🙌`],
    ["Is it genuine?", `Genuine AeroRun is sold only at the official store and listed partners (link in bio). If you've seen it much cheaper elsewhere, please send us the link so we can check it.`],
    ["Too expensive", `Totally get it, ₹5,999 is a real decision. That's why every pair comes with free size exchange, and you're buying from the official store, so no fakes.`],
    ["Delivery", `Delivery times depend on your pin code; the product page shows the exact estimate at checkout.`],
    ["Feature request", `Love this, thank you! Can we feature your fit on our page? Reply "Yes AeroRun" and we'll credit you.`],
    ["Complaint", `So sorry about this, [name]. We've sent you a DM so we can sort it out properly.`],
  ],
  ugcFlow: ["Find: search #AeroRunFitCheck and tags daily", "Ask: comment the permission request (saved reply 'Feature request')", "Confirm: only feature after a written 'Yes'; screenshot and log it", "Credit: tag the creator in the post and first line of the caption", "Thank: DM a thank-you; top fits get a story shout-out"],
};

// ---- self-checks ----
assert.strictEqual(creatives.filter((c) => c.format === "post").length, 12, "12 posts");
assert.strictEqual(creatives.filter((c) => c.format === "reel").length, 8, "8 reels");
assert.strictEqual(creatives.filter((c) => c.format === "story").length, 5, "5 story sequences");
assert.strictEqual(creatives.filter((c) => c.format === "carousel").length, 3, "3 carousels");
assert.ok(creatives.every((c) => c.day >= 1 && c.day <= 30 && hashtagSets[c.pillar] && c.caption && c.cta && c.concept && c.direction && c.headline));
assert.ok(Object.values(hashtagSets).every((s) => s.tags.length <= 5), "Instagram caps posts at 5 hashtags");
assert.strictEqual(creators.reduce((a, c) => a + c.fee, 0), 25000, "creator fees match Project 01's ₹25,000");
assert.strictEqual(new Set(creatives.map((c) => c.id)).size, creatives.length, "unique IDs");

// Work on days without a feed creative (and recurring tasks)
const ops = {
  20: "No feed post. Stories: repost best creator content + weekly 'ask us' question box",
  24: "No feed post. Mid-campaign review: pause weakest format, brief creators on what's working",
  26: "No feed post. Stories: #AeroRunFitCheck UGC roundup (with permission)",
  29: "No feed post. Stories: thank-you to the crew + top 5 fits of the month",
  30: "Monthly report due (Reporting template). Plan month 2 from results",
};
const dailyStories = "Share today's feed item to Stories + 1 poll/question + reshare tagged creator posts";
const postTime = { post: "1:00 pm", carousel: "1:00 pm", reel: "8:00 pm", story: "From 10:00 am" }; // ASSUMPTION: verify with Insights in week 1

const pillarMix = pillars.map((p) => ({ ...p, count: creatives.filter((c) => c.pillar === p.key).length }));
const calendar = Array.from({ length: 30 }, (_, i) => {
  const d = i + 1;
  const items = creatives.filter((c) => c.day === d);
  const phase = phases.find((p) => d >= p.days[0] && d <= p.days[1]).name;
  return { day: d, date: fmtDate(d), phase, items, ops: ops[d] || "", stories: dailyStories };
});
assert.ok(calendar.every((c) => c.items.length || c.ops), "every day has a feed item or an ops task");

module.exports = { postTime, START, fmtDate, personas, pillars, pillarMix, phases, hashtagSets, creatives, creators, objectives, assumptions, kpis, community, calendar };

if (require.main === module) {
  console.log(pillarMix.map((p) => `${p.name}: ${p.count} (${Math.round((p.count / creatives.length) * 100)}%)`).join(" · "));
  console.log("creator reach", creatorReach, "ATC", atcTarget);
  console.log(calendar.map((c) => `${c.day} ${c.date} ${c.phase}: ${c.items.map((i) => i.id).join(",") || "—"}`).join("\n"));
}
