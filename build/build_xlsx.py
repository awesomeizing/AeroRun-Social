"""Builds AeroRun-Social-Campaign.xlsx from campaign.json (written by export.js).
Run: .venv\\Scripts\\python.exe build_xlsx.py"""
import json
from pathlib import Path

from openpyxl import Workbook
from openpyxl.comments import Comment
from openpyxl.styles import Alignment, Border, Font, PatternFill, Side
from openpyxl.utils import get_column_letter
from openpyxl.worksheet.datavalidation import DataValidation

HERE = Path(__file__).parent
OUT = HERE.parent / "AeroRun-Social-Campaign.xlsx"
D = json.loads((HERE / "campaign.json").read_text(encoding="utf-8"))

F = "Arial"
NAVY, ORANGE, MIST = "1B2340", "FF4F2E", "F4F6F9"
H_FILL = PatternFill("solid", fgColor=NAVY)
IN_FILL = PatternFill("solid", fgColor="FFF59D")  # yellow = fill in
PILLAR_FILL = {"Fit Check": "FFE9E3", "Light Proof": "E5ECFD", "The Crew": "EFE8FD", "The Drop": "E3F5EE"}
thin = Side(style="thin", color="E4E7EC")
BORDER = Border(bottom=thin)
WRAP = Alignment(wrap_text=True, vertical="top")
DISC = "AeroRun is a fictional product. Independent educational simulation, not an official Nike campaign. No real results are included."


def title(ws, text, sub):
    ws["A1"] = text
    ws["A1"].font = Font(name=F, size=16, bold=True, color="101217")
    ws["A2"] = sub
    ws["A2"].font = Font(name=F, size=9, italic=True, color="6B7280")


def header(ws, row, cols, widths=None):
    for i, h in enumerate(cols, 1):
        c = ws.cell(row=row, column=i, value=h)
        c.font = Font(name=F, bold=True, color="FFFFFF", size=10)
        c.fill = H_FILL
        c.alignment = Alignment(wrap_text=True, vertical="center")
    if widths:
        for i, w in enumerate(widths, 1):
            ws.column_dimensions[get_column_letter(i)].width = w
    ws.freeze_panes = ws.cell(row=row + 1, column=1)


def body(c, bold=False, color="101217"):
    c.font = Font(name=F, size=10, bold=bold, color=color)
    c.alignment = WRAP
    c.border = BORDER


def inp(c):
    """Input cell: blue text, yellow fill."""
    c.font = Font(name=F, size=10, color="0000FF")
    c.fill = IN_FILL
    c.border = BORDER


wb = Workbook()

# ---------------- Read Me ----------------
ws = wb.active
ws.title = "Read Me"
title(ws, "AeroRun · 30-Day Social Media Campaign Workbook", DISC)
rows = [
    ("Tab", "What it is"),
    ("30-Day Calendar", "Every creative and task by day: phase, pillar, format, objective, audience, posting time, Facebook use, paid amplification, status"),
    ("Creative Library", "All 28 creatives with visual concept, headline, caption, CTA, audience, objective and visual direction"),
    ("Caption Library", "Copy-ready captions + hashtags with a live character count against Instagram's 2,200-character limit"),
    ("Hashtags", "Four hashtag sets (max 5 per post, Instagram's current cap) with the reasoning"),
    ("Influencers", "Five creator partnerships (₹25,000 from Project 01's budget) with fields to track their results"),
    ("Monthly Report", "Blank reporting template: enter weekly numbers in the yellow cells; KPIs and status calculate automatically"),
    ("Report Example", "The same template filled with ILLUSTRATIVE DUMMY DATA, so you can see how it works. Not real results"),
    ("KPI Definitions", "What each metric means and how it is calculated"),
]
for r, (a, b) in enumerate(rows, 4):
    ws.cell(row=r, column=1, value=a)
    ws.cell(row=r, column=2, value=b)
    body(ws.cell(row=r, column=1), bold=True)
    body(ws.cell(row=r, column=2))
for i in (1, 2):
    ws.cell(row=4, column=i).font = Font(name=F, bold=True, color="FFFFFF")
    ws.cell(row=4, column=i).fill = H_FILL
ws["A15"] = "Legend"
ws["A15"].font = Font(name=F, bold=True)
ws["A16"] = "Input"
inp(ws["A16"])
ws["B16"] = "Yellow cell, blue text: type your numbers here"
ws["A17"] = "Formula"
body(ws["A17"])
ws["B17"] = "Black text: calculated, don't overwrite"
for c in ("B16", "B17"):
    body(ws[c])
ws.column_dimensions["A"].width = 22
ws.column_dimensions["B"].width = 110

# ---------------- Calendar ----------------
ws = wb.create_sheet("30-Day Calendar")
title(ws, "30-Day Content Calendar · 11 Jan – 9 Feb 2027", "Posting times are assumptions: check Instagram Insights in week 1 and move them to when your followers are online.")
cols = ["Day", "Date", "Phase", "ID", "Format", "Pillar", "Title", "Objective", "Audience", "Post time", "Facebook", "Paid boost", "Daily Stories / tasks", "Status"]
header(ws, 4, cols, [6, 13, 15, 7, 15, 13, 34, 15, 22, 12, 30, 10, 52, 14])
items = sorted([("c", x["day"], x) for x in D["creatives"]] + [("o", x["day"], x) for x in D["ops"]], key=lambda t: (t[1], t[0] != "c", t[2].get("id", "")))
dv = DataValidation(type="list", formula1='"Planned,In production,Approved,Scheduled,Posted"', allow_blank=True)
ws.add_data_validation(dv)
r = 5
for kind, day, x in items:
    if kind == "c":
        vals = [day, x["date"], x["phase"], x["id"], x["format"], x["pillar"], x["title"], x["objective"], x["audience"], x["time"], x["facebook"], x["amplify"], D["stories"], "Planned"]
    else:
        vals = [day, x["date"], x["phase"], "—", "Task", "—", x["ops"], "—", "—", "—", "—", "—", D["stories"], "Planned"]
    for i, v in enumerate(vals, 1):
        body(ws.cell(row=r, column=i, value=v), bold=(i == 4))
    if kind == "c":
        ws.cell(row=r, column=6).fill = PatternFill("solid", fgColor=PILLAR_FILL[x["pillar"]])
    dv.add(ws.cell(row=r, column=14))
    r += 1
ws.auto_filter.ref = f"A4:N{r - 1}"

# ---------------- Creative Library ----------------
ws = wb.create_sheet("Creative Library")
title(ws, "Creative Library · 12 posts · 8 Reels · 5 Story sequences · 3 carousels", DISC)
cols = ["ID", "Format", "Day", "Pillar", "Title", "Headline (on graphic)", "Visual concept", "Suggested visual direction", "Caption", "CTA", "Target audience", "Marketing objective", "Hashtags", "Asset file(s)"]
header(ws, 4, cols, [6, 14, 6, 12, 26, 26, 48, 44, 56, 22, 22, 15, 40, 32])
for r, x in enumerate(D["creatives"], 5):
    vals = [x["id"], x["format"], x["day"], x["pillar"], x["title"], x["headline"], x["concept"], x["direction"], x["caption"], x["cta"], x["audience"], x["objective"], x["hashtags"], x["files"]]
    for i, v in enumerate(vals, 1):
        body(ws.cell(row=r, column=i, value=v), bold=(i == 1))
    ws.cell(row=r, column=4).fill = PatternFill("solid", fgColor=PILLAR_FILL[x["pillar"]])
ws.auto_filter.ref = f"A4:N{len(D['creatives']) + 4}"

# ---------------- Caption Library ----------------
ws = wb.create_sheet("Caption Library")
title(ws, "Caption Library", "Text in [brackets] is filled in only with real details (real handle, real review, used with permission). Creator posts must carry #ad.")
cols = ["ID", "Format", "Title", "Caption", "Hashtags", "CTA", "Full post text", "Characters", "Within 2,200 limit?"]
header(ws, 4, cols, [6, 14, 26, 60, 44, 22, 60, 11, 14])
for r, x in enumerate(D["creatives"], 5):
    for i, v in enumerate([x["id"], x["format"], x["title"], x["caption"], x["hashtags"], x["cta"]], 1):
        body(ws.cell(row=r, column=i, value=v), bold=(i == 1))
    ws.cell(row=r, column=7, value=f'=D{r}&CHAR(10)&CHAR(10)&E{r}')
    ws.cell(row=r, column=8, value=f"=LEN(G{r})")
    ws.cell(row=r, column=9, value=f'=IF(H{r}<=2200,"OK","Too long")')
    for i in (7, 8, 9):
        body(ws.cell(row=r, column=i))
ws["A34"] = "Instagram caption limit: 2,200 characters. Only the first ~125 characters show before 'more', so the hook goes first."
ws["A34"].font = Font(name=F, size=9, italic=True, color="6B7280")

# ---------------- Hashtags ----------------
ws = wb.create_sheet("Hashtags")
title(ws, "Hashtag Sets", "Max 5 hashtags per post (Instagram cap reported Dec 2025). Post counts are not published reliably, so check each tag in the app before launch.")
header(ws, 4, ["Pillar", "Tag 1", "Tag 2", "Tag 3", "Tag 4", "Tag 5", "Why this set", "Checked in app? (Y/N)"], [14, 20, 20, 20, 20, 20, 60, 16])
for r, h in enumerate(D["hashtags"], 5):
    for i, v in enumerate([h["pillar"]] + h["tags"] + [h["why"]], 1):
        body(ws.cell(row=r, column=i, value=v), bold=(i == 1))
    inp(ws.cell(row=r, column=8))
notes = [
    "Roles: branded (#AeroRun) = owned search page · campaign (#AeroRunFitCheck) = UGC collection · community (#IndianSneakerheads) = niche discovery · broad (#Sneakers) = category.",
    "Before launch: search #AeroRun and #AeroRunFitCheck to make sure no other brand or meaning already owns them.",
    "Hashtags help Instagram understand and categorise a post (search), but Instagram's head has said they don't increase reach. Content and sends matter more.",
]
for i, n in enumerate(notes, 10):
    ws.cell(row=i, column=1, value=n).font = Font(name=F, size=9, color="3B4150")

# ---------------- Influencers ----------------
ws = wb.create_sheet("Influencers")
title(ws, "Creator Partnerships · ₹25,000 (from Project 01 budget)", "Fees are assumptions until confirmed with quotes. Every creator post needs an ASCI disclosure label (#ad) in the caption, not just the Paid-partnership tag.")
cols = ["Creator", "City", "Niche", "Persona", "Deliverables", "Post day", "Fee (₹)", "Disclosure", "Usage rights", "Why them", "Reach", "Engagements", "Link clicks", "Cost per engagement (₹)", "Cost per 1,000 reach (₹)"]
header(ws, 4, cols, [9, 12, 24, 16, 34, 9, 11, 13, 20, 36, 11, 13, 11, 15, 15])
for r, c in enumerate(D["creators"], 5):
    vals = [c["id"], c["city"], c["niche"], c["persona"], c["deliverables"], c["day"], c["fee"], "#ad + Paid partnership", "30 days, paid ads (whitelisting)", c["why"]]
    for i, v in enumerate(vals, 1):
        body(ws.cell(row=r, column=i, value=v), bold=(i == 1))
    inp(ws.cell(row=r, column=7))
    ws.cell(row=r, column=7).number_format = '"₹"#,##0'
    for col in (11, 12, 13):
        inp(ws.cell(row=r, column=col))
        ws.cell(row=r, column=col).number_format = "#,##0"
    ws.cell(row=r, column=14, value=f'=IFERROR(G{r}/L{r},"")')
    ws.cell(row=r, column=15, value=f'=IFERROR(G{r}/K{r}*1000,"")')
    for col in (14, 15):
        body(ws.cell(row=r, column=col))
        ws.cell(row=r, column=col).number_format = '"₹"#,##0.00'
last = 4 + len(D["creators"])
t = last + 1
ws.cell(row=t, column=1, value="Total")
ws.cell(row=t, column=7, value=f"=SUM(G5:G{last})")
ws.cell(row=t, column=8, value=f'=IF(G{t}=25000,"Matches budget","Check: budget is ₹25,000")')
for col in (11, 12, 13):
    ws.cell(row=t, column=col, value=f"=SUM({get_column_letter(col)}5:{get_column_letter(col)}{last})")
    ws.cell(row=t, column=col).number_format = "#,##0"
ws.cell(row=t, column=14, value=f'=IFERROR(G{t}/L{t},"")')
ws.cell(row=t, column=15, value=f'=IFERROR(G{t}/K{t}*1000,"")')
for col in range(1, 16):
    ws.cell(row=t, column=col).font = Font(name=F, bold=True, size=10)
ws.cell(row=t, column=7).number_format = '"₹"#,##0'
for col in (14, 15):
    ws.cell(row=t, column=col).number_format = '"₹"#,##0.00'
ws.cell(row=t + 2, column=1, value="Selection checklist: ≥60% of audience aged 18–34 in Indian metros (ask for an Insights screenshot) · engagement above the creator's niche median · no competitor deal in the last 90 days · brand-safety review of the last 50 posts · style fits AeroRun naturally.").font = Font(name=F, size=9, color="3B4150")
ws.cell(row=t + 3, column=1, value="Nano-creator seeding (10–15 gifted pairs, no fee) is outside the cash budget; gifted posts must still be labelled (e.g. 'Free Gift' / #gifted).").font = Font(name=F, size=9, color="3B4150")


# ---------------- Monthly report ----------------
INPUTS = [
    ("Followers at start of week", "Instagram Insights"), ("Followers at end of week", "Instagram Insights"), ("Accounts reached", "Insights"), ("Views", "Insights"),
    ("Likes", "Insights"), ("Comments", "Insights"), ("Saves", "Insights"), ("Shares (sends)", "Insights"), ("Profile visits", "Insights"),
    ("Link clicks (bio + link stickers)", "Insights / UTM"), ("Story reach: first frame", "Story insights"), ("Story reach: last frame", "Story insights"),
    ("Story sticker taps", "Story insights"), ("Reel plays", "Reel insights"), ("Reel 3-second views", "Reel insights"), ("#AeroRunFitCheck UGC posts", "Hashtag search"),
    ("Add-to-carts from social (UTM)", "GA4"), ("Positive comments", "Comment log"), ("Comments classified", "Comment log"), ("Median response time (minutes)", "Comment log"),
]
EXAMPLE = [
    [0, 820, 1650, 2300], [820, 1650, 2300, 3050], [24000, 31000, 28000, 26000], [52000, 68000, 61000, 57000],
    [610, 820, 760, 690], [95, 160, 140, 120], [180, 310, 290, 240], [140, 260, 230, 210], [900, 1250, 1050, 980],
    [210, 420, 460, 390], [3200, 4100, 3900, 3600], [1900, 2600, 2500, 2300], [400, 610, 520, 480], [21000, 27000, 24000, 22000],
    [7300, 9800, 8900, 8100], [0, 9, 17, 21], [12, 26, 31, 29], [70, 120, 105, 95], [90, 160, 140, 125], [95, 80, 70, 65],
]


def report(ws, example):
    title(ws, "Monthly Social Report · AeroRun" + (" · ILLUSTRATIVE DUMMY DATA, NOT REAL RESULTS" if example else ""),
          "Example numbers are invented to show how the template works." if example else "Enter weekly numbers in the yellow cells. Everything else calculates. Leave a week blank until it ends.")
    if example:
        ws["A1"].font = Font(name=F, size=16, bold=True, color="C00000")
    header(ws, 4, ["Inputs", "Week 1", "Week 2", "Week 3", "Week 4", "Month", "Source"], [40, 12, 12, 12, 12, 13, 18])
    row = {}
    for i, (name, src) in enumerate(INPUTS):
        r = 5 + i
        row[name] = r
        body(ws.cell(row=r, column=1, value=name), bold=True)
        body(ws.cell(row=r, column=7, value=src), color="6B7280")
        for w in range(4):
            c = ws.cell(row=r, column=2 + w, value=EXAMPLE[i][w] if example else None)
            inp(c)
            c.number_format = "#,##0"
        if name.startswith("Followers at start"):
            f = f"=IF(B{r}=\"\",\"\",B{r})"
        elif name.startswith("Followers at end"):
            f = f'=IF(COUNT(B{r}:E{r})=0,"",INDEX(B{r}:E{r},COUNT(B{r}:E{r})))'
        elif name.startswith("Median response"):
            f = f'=IF(COUNT(B{r}:E{r})=0,"",AVERAGE(B{r}:E{r}))'
        else:
            f = f'=IF(COUNT(B{r}:E{r})=0,"",SUM(B{r}:E{r}))'
        body(ws.cell(row=r, column=6, value=f), bold=True)
        ws.cell(row=r, column=6).number_format = "#,##0"
    ws.cell(row=row["Median response time (minutes)"], column=6).comment = Comment("Average of the weekly medians: an approximation of the monthly median.", "Template")

    k0 = 5 + len(INPUTS) + 2
    header(ws, k0, ["KPI", "Week 1", "Week 2", "Week 3", "Week 4", "Month", "Target", "Status", "How it's calculated"], None)
    ws.freeze_panes = "B5"
    ws.column_dimensions["H"].width = 16
    ws.column_dimensions["I"].width = 46
    R = lambda n: row[n]
    rates = [
        ("Engagement rate (by reach)", lambda c: f"({c}{R('Likes')}+{c}{R('Comments')}+{c}{R('Saves')}+{c}{R('Shares (sends)')})/{c}{R('Accounts reached')}", 0.03, "(likes + comments + saves + shares) ÷ reach"),
        ("Sends per reach", lambda c: f"{c}{R('Shares (sends)')}/{c}{R('Accounts reached')}", None, "shares ÷ reach · target = week-1 baseline +20%"),
        ("Save rate", lambda c: f"{c}{R('Saves')}/{c}{R('Accounts reached')}", None, "saves ÷ reach"),
        ("Link click rate", lambda c: f"{c}{R('Link clicks (bio + link stickers)')}/{c}{R('Accounts reached')}", None, "link clicks ÷ reach"),
        ("Profile visit rate", lambda c: f"{c}{R('Profile visits')}/{c}{R('Accounts reached')}", None, "profile visits ÷ reach"),
        ("Story completion rate", lambda c: f"{c}{R('Story reach: last frame')}/{c}{R('Story reach: first frame')}", None, "last-frame reach ÷ first-frame reach"),
        ("Sticker tap rate", lambda c: f"{c}{R('Story sticker taps')}/{c}{R('Story reach: first frame')}", None, "sticker taps ÷ first-frame reach"),
        ("Reel 3-second hold", lambda c: f"{c}{R('Reel 3-second views')}/{c}{R('Reel plays')}", None, "3-sec views ÷ plays"),
        ("Follower growth", lambda c: f"({c}{R('Followers at end of week')}-{c}{R('Followers at start of week')})/{c}{R('Followers at start of week')}", None, "(end − start) ÷ start"),
        ("Positive sentiment share", lambda c: f"{c}{R('Positive comments')}/{c}{R('Comments classified')}", None, "positive ÷ classified comments"),
    ]
    r = k0 + 1
    for name, expr, target, how in rates:
        body(ws.cell(row=r, column=1, value=name), bold=True)
        for j, col in enumerate("BCDEF"):
            c = ws.cell(row=r, column=2 + j, value=f'=IFERROR({expr(col)},"")')
            body(c, bold=(col == "F"))
            c.number_format = "0.0%"
        tc = ws.cell(row=r, column=7, value=target)
        inp(tc)
        tc.number_format = "0.0%"
        ws.cell(row=r, column=8, value=f'=IF(F{r}="","—",IF(G{r}="","Set target",IF(F{r}>=G{r},"On track","Below target")))')
        body(ws.cell(row=r, column=8))
        body(ws.cell(row=r, column=9, value=how), color="6B7280")
        r += 1
    totals = [
        ("Followers (end of month)", "Followers at end of week", 3000, True),
        ("Link clicks (month)", "Link clicks (bio + link stickers)", 1500, True),
        ("Add-to-carts from social (month)", "Add-to-carts from social (UTM)", 96, True),
        ("#AeroRunFitCheck UGC posts (month)", "#AeroRunFitCheck UGC posts", 50, True),
        ("Median response time (minutes)", "Median response time (minutes)", 120, False),
    ]
    for name, src, target, higher in totals:
        body(ws.cell(row=r, column=1, value=name), bold=True)
        c = ws.cell(row=r, column=6, value=f"=F{R(src)}")
        body(c, bold=True)
        c.number_format = "#,##0"
        tc = ws.cell(row=r, column=7, value=target)
        inp(tc)
        tc.number_format = "#,##0"
        op = ">=" if higher else "<="
        ws.cell(row=r, column=8, value=f'=IF(F{r}="","—",IF(F{r}{op}G{r},"On track","Below target"))')
        body(ws.cell(row=r, column=8))
        body(ws.cell(row=r, column=9, value="Project 02 objective" + (" (lower is better)" if not higher else "")), color="6B7280")
        r += 1
    r += 1
    for label in ("What worked (top 3 posts and why)", "What didn't (and what we'll change)", "Next month: tests and decisions"):
        body(ws.cell(row=r, column=1, value=label), bold=True)
        ws.merge_cells(start_row=r, start_column=2, end_row=r, end_column=9)
        inp(ws.cell(row=r, column=2))
        ws.row_dimensions[r].height = 48
        r += 1


report(wb.create_sheet("Monthly Report"), example=False)
report(wb.create_sheet("Report Example"), example=True)

# ---------------- KPI definitions ----------------
ws = wb.create_sheet("KPI Definitions")
title(ws, "KPI Definitions", "Engagement rate is calculated by reach (not followers), so posts that travel beyond followers aren't penalised.")
header(ws, 4, ["KPI", "What it tells you", "Formula", "Funnel stage"], [30, 60, 46, 16])
for r, k in enumerate(D["kpis"], 5):
    for i, v in enumerate(k, 1):
        body(ws.cell(row=r, column=i, value=v), bold=(i == 1))
r = 6 + len(D["kpis"])
ws.cell(row=r, column=1, value="30-day objectives").font = Font(name=F, bold=True, size=12)
header_row = r + 1
for i, h in enumerate(["Stage", "KPI", "Target", "Basis"], 1):
    c = ws.cell(row=header_row, column=i, value=h)
    c.font = Font(name=F, bold=True, color="FFFFFF")
    c.fill = H_FILL
for j, o in enumerate(D["objectives"], header_row + 1):
    for i, v in enumerate([o["stage"], o["kpi"], o["target"], o["basis"]], 1):
        body(ws.cell(row=j, column=i, value=v), bold=(i == 1))

for s in wb.worksheets:
    s.sheet_view.showGridLines = False
wb.save(OUT)
print("saved", OUT)
