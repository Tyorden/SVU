#!/usr/bin/env python3
"""
Publication-quality PNG charts for r/dataisbeautiful from the SVU
false-accusation dataset.

Source of truth for every number: docs/svu_paper_stats_v2.md
(n = 521 persons after exclusions; 567-episode corrected base with the
576-episode original base kept as reference; death audit adjudicated
row-by-row against source transcripts).

Run:  python3 graphics/make_charts.py
Deps: matplotlib only.

Charts follow the dataviz-skill method: form first, color by job
(sequential one-hue ramp for severity magnitude; highlight-vs-neutral for
emphasis; no rainbow, no dual axes, no chartjunk), thin marks, recessive
grid, direct labels over legends, text in ink tokens (never series color),
title states the finding, light Reddit-friendly background, 2x scale.
"""

import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib.patches import FancyArrowPatch

# ----------------------------------------------------------------------------
# Design tokens (brand-neutral, per dataviz skill: text wears ink, not series
# color; one hue for magnitude; highlight + neutral for emphasis)
# ----------------------------------------------------------------------------
INK       = "#1F2430"   # primary text
INK_2     = "#555C6B"   # secondary text
INK_MUTED = "#7A8191"   # captions/footers
GRID      = "#E4E7ED"   # recessive gridlines
SURFACE   = "#FFFFFF"   # light background (Reddit-friendly)

BLUE      = "#3D6DB5"   # primary accent / highlight series
NEUTRAL   = "#C7CDD8"   # de-emphasized bars
NEUTRAL_2 = "#E0E4EB"   # further de-emphasized (small-n)

# Sequential severity ramp — ONE hue (burnt red-orange), light -> dark,
# escalating severity = escalating intensity. Validated below.
SEV_RAMP  = ["#F5D7C8", "#E8A987", "#CE6E48", "#96351C"]

DEATH_RED = "#96351C"   # darkest ramp step, reused for fatal outcomes
SURV_GRAY = "#AEB5C2"   # non-fatal outcomes

ERA_BANDS = ["#F5F6F9", "#EBEEF4", "#F5F6F9"]  # subtle alternating era shading

FONT = {"family": ["Helvetica Neue", "Helvetica", "Arial", "DejaVu Sans"]}
plt.rcParams.update({
    "font.family": FONT["family"],
    "figure.facecolor": SURFACE,
    "axes.facecolor": SURFACE,
    "savefig.facecolor": SURFACE,
    "axes.edgecolor": GRID,
    "text.color": INK,
    "axes.labelcolor": INK_2,
    "xtick.color": INK_2,
    "ytick.color": INK_2,
    "svg.fonttype": "none",
})

DPI = 200

FOOTER_LINES = [
    "Data: all 576 SVU episodes (1999–2026), transcripts via "
    "subslikescript.com · Coding: Claude (Anthropic) batch analysis, "
    "human-audited",
    "n=521 falsely accused persons after exclusions · github.com/Tyorden/SVU",
]


# ----------------------------------------------------------------------------
# Palette validation (computed, not eyeballed). The skill's bundled
# validate_palette.js is not present in this install, so we compute the
# equivalent checks here: WCAG relative luminance monotonicity for the
# sequential ramp, minimum adjacent-step separation, and contrast of the
# darkest step against the light surface.
# ----------------------------------------------------------------------------
def _lum(hexcolor):
    def chan(c):
        c = c / 255.0
        return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4
    r, g, b = (int(hexcolor[i:i + 2], 16) for i in (1, 3, 5))
    return 0.2126 * chan(r) + 0.7152 * chan(g) + 0.0722 * chan(b)


def _contrast(a, b):
    la, lb = sorted((_lum(a), _lum(b)), reverse=True)
    return (la + 0.05) / (lb + 0.05)


def validate_palettes():
    lums = [_lum(c) for c in SEV_RAMP]
    assert all(lums[i] > lums[i + 1] for i in range(3)), \
        "sequential ramp must be monotonically light->dark"
    steps = [lums[i] - lums[i + 1] for i in range(3)]
    assert min(steps) > 0.05, f"ramp steps too close: {steps}"
    assert _contrast(SEV_RAMP[-1], SURFACE) >= 3.0, "dark ramp end vs surface"
    assert _contrast(BLUE, SURFACE) >= 3.0, "highlight vs surface"
    assert _contrast(INK, SURFACE) >= 7.0, "ink vs surface"
    # highlight vs neutral bars must be separable without hue (CVD-safe by
    # lightness): require a clear luminance gap.
    assert _contrast(BLUE, NEUTRAL) >= 2.0, "highlight vs neutral separation"
    print("palette checks: PASS "
          f"(ramp lum {['%.3f' % v for v in lums]}, "
          f"dark-end contrast {_contrast(SEV_RAMP[-1], SURFACE):.1f}:1, "
          f"blue contrast {_contrast(BLUE, SURFACE):.1f}:1)")


# ----------------------------------------------------------------------------
# Shared helpers
# ----------------------------------------------------------------------------
def strip(ax, y_grid=True, x_grid=False):
    for s in ("top", "right", "left"):
        ax.spines[s].set_visible(False)
    ax.spines["bottom"].set_color(GRID)
    if y_grid:
        ax.grid(axis="y", color=GRID, linewidth=0.8, zorder=0)
    if x_grid:
        ax.grid(axis="x", color=GRID, linewidth=0.8, zorder=0)
    ax.tick_params(length=0)


def titles(fig, title, subtitle, top=0.955, sub_dy=0.048, x=0.06):
    fig.text(x, top, title, fontsize=15.5, fontweight="bold", color=INK,
             ha="left", va="top")
    fig.text(x, top - sub_dy, subtitle, fontsize=10.5, color=INK_2,
             ha="left", va="top")


def footer(fig, extra=None, x=0.06, dy=0.027):
    """extra: a string or list of strings drawn above the credit block."""
    lines = []
    if extra:
        lines += [extra] if isinstance(extra, str) else list(extra)
    lines += FOOTER_LINES
    y = 0.016
    for line in reversed(lines):
        fig.text(x, y, line, fontsize=7.6, color=INK_MUTED, ha="left",
                 va="bottom")
        y += dy


def save(fig, name):
    path = f"/Users/tylerorden/Desktop/SVU/graphics/{name}"
    fig.savefig(path, dpi=DPI)
    plt.close(fig)
    print("wrote", path)


# ----------------------------------------------------------------------------
# 1. the_retreat.png — per-season false-suspect episode rate (v2 §B1)
# ----------------------------------------------------------------------------
def chart_retreat():
    seasons = list(range(1, 28))
    # Y-only rates, corrected denominators, v2 §B1 per-season series
    rates = [47.6, 73.7, 78.3, 58.3, 78.3, 69.6, 50.0, 81.0, 83.3, 81.8,
             78.3, 70.8, 69.6, 54.2, 54.2, 52.2, 47.8, 52.4, 54.2, 62.5,
             30.0, 37.5, 40.9, 36.4, 38.5, 54.5, 33.3]
    era_means = [(1, 18, 65.3), (19, 21, 50.0), (22, 27, 41.8)]

    fig, ax = plt.subplots(figsize=(10.5, 6.2))
    fig.subplots_adjust(left=0.075, right=0.965, top=0.845, bottom=0.185)

    # Era bands (subtle) + era mean segments
    for (s0, s1, mean), band in zip(era_means, ERA_BANDS):
        ax.axvspan(s0 - 0.5, s1 + 0.5, color=band, zorder=0)
        ax.hlines(mean, s0 - 0.5, s1 + 0.5, color=INK_2, linewidth=1.1,
                  linestyle=(0, (4, 3)), zorder=2)

    ax.plot(seasons, rates, color=BLUE, linewidth=2, zorder=3,
            marker="o", markersize=4.5, markerfacecolor=BLUE,
            markeredgecolor=SURFACE, markeredgewidth=1.2)

    # Era labels + mean labels (text in ink tokens)
    ax.text(9.5, 90.5, "Pre-#MeToo (S1–18)", fontsize=9, color=INK_2,
            ha="center", fontweight="bold")
    ax.text(9.5, 86.6, "era mean 65.3%", fontsize=8.4, color=INK_2, ha="center")
    ax.text(20.0, 90.5, "#MeToo era\n(S19–21)", fontsize=9, color=INK_2,
            ha="center", va="top", fontweight="bold", linespacing=1.25)
    ax.text(20.0, 81.0, "mean 50.0%", fontsize=8.4, color=INK_2, ha="center")
    ax.text(24.5, 90.5, "Post-2020 (S22–27)", fontsize=9, color=INK_2,
            ha="center", fontweight="bold")
    ax.text(24.5, 86.6, "era mean 41.8%", fontsize=8.4, color=INK_2, ha="center")

    # Season 21 break annotation
    ax.annotate("The break: Season 21 (2019–20)\ndrops to 30.0%",
                xy=(21, 30.0), xytext=(16.2, 15.5), fontsize=9, color=INK,
                ha="center", linespacing=1.3,
                arrowprops=dict(arrowstyle="-", color=INK_2, linewidth=0.9,
                                connectionstyle="arc3,rad=0.15"))
    # Endpoint labels (selective direct labels, not every point)
    ax.annotate("47.6%", xy=(1, 47.6), xytext=(1, 41.5), fontsize=8.2,
                color=INK_2, ha="center")
    ax.annotate("83.3%", xy=(9, 83.3), xytext=(9, 77.0), fontsize=8.2,
                color=INK_2, ha="center")
    ax.annotate("S27: 33.3%\n(3 eps aired)", xy=(27, 33.3), xytext=(26.3, 20.0),
                fontsize=8.2, color=INK_2, ha="center", linespacing=1.25)

    ax.set_xlim(0.4, 27.6)
    ax.set_ylim(0, 95)
    ax.set_xticks(range(1, 28, 2))
    ax.set_xlabel("Season", fontsize=9.5)
    ax.set_yticks(range(0, 100, 20))
    ax.set_yticklabels([f"{v}%" for v in range(0, 100, 20)], fontsize=9)
    strip(ax)

    titles(fig,
           "SVU is retreating from the false-accusation plot",
           "Share of Law & Order: SVU episodes featuring a falsely accused "
           "person, by season (1999–2026) · definite cases only",
           top=0.965, sub_dy=0.052)
    footer(fig, extra="Corrected 567-episode base (9 corrupted-transcript "
                      "episodes excluded). Era means are episode-weighted. "
                      "Era × rate χ² = 20.89, p < .001.")
    save(fig, "the_retreat.png")


# ----------------------------------------------------------------------------
# 2. apology_gradient.png — apology rate by consequence severity (v2 §A8)
# ----------------------------------------------------------------------------
def chart_apology():
    labels = ["1 · Private /\nlow-level harm\n(n=60)",
              "2 · Public exposure,\nno formal sanction\n(n=136)",
              "3 · Material sanction /\nserious fallout\n(n=215)",
              "4 · Life-altering\nor death\n(n=110)"]
    rates = [0.0, 6.6, 5.6, 16.4]
    counts = ["0 of 60", "9 of 136", "12 of 215", "18 of 110"]

    fig, ax = plt.subplots(figsize=(9.0, 6.2))
    fig.subplots_adjust(left=0.075, right=0.96, top=0.80, bottom=0.235)

    x = range(4)
    ax.bar(x, rates, width=0.62, color=SEV_RAMP, zorder=3)
    for xi, r, c in zip(x, rates, counts):
        ax.text(xi, r + 0.45, f"{r:.1f}%", ha="center", fontsize=12,
                fontweight="bold", color=INK)
        ax.text(xi, r + 2.0, c, ha="center", fontsize=8.6, color=INK_MUTED)

    ax.annotate("Apology tracks catastrophe,\nnot conduct",
                xy=(3, 16.4), xytext=(1.85, 15.6), fontsize=10.5, color=INK,
                ha="center", fontweight="bold", linespacing=1.35,
                arrowprops=dict(arrowstyle="-", color=INK_2, linewidth=0.9,
                                connectionstyle="arc3,rad=-0.2"))

    ax.set_xticks(list(x))
    ax.set_xticklabels(labels, fontsize=9, linespacing=1.35)
    ax.set_ylim(0, 20)
    ax.set_yticks(range(0, 21, 5))
    ax.set_yticklabels([f"{v}%" for v in range(0, 21, 5)], fontsize=9)
    strip(ax)

    titles(fig,
           "SVU police apologize when the outcome is catastrophic,\n"
           "not when their conduct was bad",
           "Share of falsely accused persons receiving any police apology "
           "(partial or formal), by consequence severity of the accusation",
           top=0.965, sub_dy=0.098)
    footer(fig, extra=[
        "Conduct doesn’t move the needle: persons the police threatened or "
        "coerced get apologies at 8.0% (22/276) vs 6.9% (17/245) for those "
        "treated properly.",
        "Overall apology rate 7.5% (39/521); formal apologies just 1.5% "
        "(8/521).",
    ])
    save(fig, "apology_gradient.png")


# ----------------------------------------------------------------------------
# 3. media_multiplier.png — severity-4 rate by exposure channel (v2 §A11)
# ----------------------------------------------------------------------------
def chart_media():
    # sorted by sev-4 rate desc (ties by n); v2 severity x exposure_channel
    rows = [  # (label, n, rate, sev4_count)
        ("Legal system",  14, 57.1,  8),
        ("Media",         86, 45.3, 39),
        ("Multiple",      18, 33.3,  6),
        ("Church",         4, 25.0,  1),
        ("Family",        90, 20.0, 18),
        ("School",        20, 20.0,  4),
        ("Workplace",    143, 15.4, 22),
        ("Police only",  142,  8.5, 12),
        ("Online",         2,  0.0,  0),
        ("Unknown",        2,  0.0,  0),
    ]
    labels = [f"{name}  (n={n})" for name, n, _, _ in rows]
    rates = [r for _, _, r, _ in rows]
    colors = []
    for name, n, _, _ in rows:
        if name == "Media":
            colors.append(BLUE)
        elif n < 25:
            colors.append(NEUTRAL_2)   # small-n: further de-emphasized
        else:
            colors.append(NEUTRAL)

    fig, ax = plt.subplots(figsize=(10.0, 6.6))
    fig.subplots_adjust(left=0.20, right=0.90, top=0.82, bottom=0.195)

    y = range(len(rows))[::-1]
    ax.barh(list(y), rates, height=0.62, color=colors, zorder=3)
    for yi, (name, n, r, k) in zip(y, rows):
        bold = name in ("Media", "Police only")
        ax.text(r + 0.8, yi, f"{r:.1f}%",
                va="center", fontsize=10 if bold else 9.2,
                fontweight="bold" if bold else "normal",
                color=INK if bold else INK_2)

    # 5.4x bracket between media and police_only
    ax.annotate("", xy=(50.5, 8.6), xytext=(50.5, 2.4),
                arrowprops=dict(arrowstyle="-", color=INK_2, linewidth=0.9))
    ax.annotate("", xy=(46.5, 8.6), xytext=(50.5, 8.6),
                arrowprops=dict(arrowstyle="-", color=INK_2, linewidth=0.9))
    ax.annotate("", xy=(9.7, 2.4), xytext=(50.5, 2.4),
                arrowprops=dict(arrowstyle="-", color=INK_2, linewidth=0.9))
    ax.text(51.8, 5.5, "5.4×\nthe police-only rate\n(45.3% vs 8.5%)",
            fontsize=10, color=INK, fontweight="bold", va="center",
            linespacing=1.35)

    ax.set_yticks(list(y))
    ax.set_yticklabels(labels, fontsize=9.5)
    ax.set_xlim(0, 66)
    ax.set_xticks(range(0, 61, 15))
    ax.set_xticklabels([f"{v}%" for v in range(0, 61, 15)], fontsize=9)
    strip(ax, y_grid=False, x_grid=True)

    titles(fig,
           "When the media learns your name, the odds of a ruined life "
           "multiply",
           "Share of falsely accused persons whose accusation becomes "
           "life-altering or fatal (severity 4), by how the accusation "
           "became public",
           top=0.965, sub_dy=0.052)
    footer(fig, extra=[
        "Lightest bars are small samples (n < 25) — legal, church, multiple, "
        "school, online, unknown; interpret with caution.",
        "The robust contrast is media (n=86) vs police-only (n=142). "
        "Dramaturgical association, not a causal estimate.",
    ])
    save(fig, "media_multiplier.png")


# ----------------------------------------------------------------------------
# 4. the_death_toll.png — adjudicated death audit (v2 §A9)
# ----------------------------------------------------------------------------
def chart_deaths():
    fig, ax = plt.subplots(figsize=(10.0, 6.4))
    fig.subplots_adjust(left=0.235, right=0.94, top=0.795, bottom=0.19)

    rows = [  # (label, value, color, detail)
        ("Murdered", 21, DEATH_RED,
         "incl. 2 killed in custody, 1 killed by police"),
        ("Suicide", 9, DEATH_RED, ""),
        ("Other accusation-linked death", 2, DEATH_RED,
         "overdose; AIDS after 15 yrs wrongful prison"),
        ("Suicide attempt, survived", 8, SURV_GRAY, ""),
        ("Non-fatal attack / vigilante violence", 31, SURV_GRAY,
         "28 structured + 3 notes-only"),
    ]
    gap = 0.9   # extra gap between the dead group and the survived group
    ys, y = [], 0.0
    for i in range(len(rows)):
        ys.append(y)
        y -= 1.0 + (gap if i == 2 else 0.0)

    for yi, (label, v, c, detail) in zip(ys, rows):
        ax.barh(yi, v, height=0.62, color=c, zorder=3)
        ax.text(v + 0.5, yi, str(v), va="center", fontsize=12.5,
                fontweight="bold", color=INK)
        if detail:
            ax.text(v + 2.1, yi, detail, va="center", fontsize=8.6,
                    color=INK_MUTED)

    # Group section labels
    ax.text(-0.4, ys[0] + 0.85, "DIED — 32 PEOPLE", fontsize=10,
            fontweight="bold", color=DEATH_RED, ha="left")
    ax.text(-0.4, ys[3] + 0.85, "SURVIVED VIOLENCE — 39 PEOPLE",
            fontsize=10, fontweight="bold", color=INK_2, ha="left")

    ax.set_yticks(ys)
    ax.set_yticklabels([r[0] for r in rows], fontsize=10)
    ax.set_xlim(0, 40)
    ax.set_ylim(ys[-1] - 0.85, ys[0] + 1.35)
    ax.set_xticks(range(0, 41, 10))
    ax.tick_params(axis="x", labelsize=9)
    strip(ax, y_grid=False, x_grid=True)

    titles(fig,
           "Being falsely accused on SVU kills: 32 innocent people die,\n"
           "across 1 in every 18 episodes",
           "Deaths and violence against falsely accused persons · 32 "
           "deaths across 31 distinct episodes = 5.4% of all 576 episodes",
           top=0.965, sub_dy=0.098)
    footer(fig, extra="Death audit row-level adjudicated against source "
                      "transcripts. Only 5 of the 32 dead ever received any "
                      "police apology.")
    save(fig, "the_death_toll.png")


# ----------------------------------------------------------------------------
# 5. who_points_the_finger.png — accusation origin distribution (v2 §A4)
# ----------------------------------------------------------------------------
def chart_origins():
    rows = [  # (label, n, pct)
        ("Detectives' own inference", 284, 54.5),
        ("Victim identification", 94, 18.0),
        ("Deliberate fabrication", 66, 12.7),
        ("Witness misidentification", 39, 7.5),
        ("Tech / database error", 25, 4.8),
        ("Coerced interview", 12, 2.3),
        ("Unknown", 1, 0.2),
    ]
    labels = [r[0] for r in rows]
    pcts = [r[2] for r in rows]
    colors = [BLUE] + [NEUTRAL] * 6

    fig, ax = plt.subplots(figsize=(10.0, 6.2))
    fig.subplots_adjust(left=0.235, right=0.955, top=0.825, bottom=0.165)

    y = range(len(rows))[::-1]
    ax.barh(list(y), pcts, height=0.62, color=colors, zorder=3)
    for yi, (label, n, p) in zip(y, rows):
        first = label.startswith("Detectives")
        ax.text(p + 0.7, yi, f"{p:.1f}%  (n={n})",
                va="center", fontsize=10.5 if first else 9.2,
                fontweight="bold" if first else "normal",
                color=INK if first else INK_2)

    ax.annotate("The squad’s own theory of the case — not victim "
                "error —\nis the origin of most false accusations",
                xy=(50.0, 5.62), xytext=(38.0, 3.6), fontsize=10.5, color=INK,
                fontweight="bold", ha="center", linespacing=1.4,
                arrowprops=dict(arrowstyle="-", color=INK_2, linewidth=0.9,
                                connectionstyle="arc3,rad=-0.25"))
    ax.text(38.0, 1.9, "All victim + witness misidentification\ncombined: "
                       "25.5% — less than half the squad’s share",
            fontsize=9, color=INK_2, ha="center", linespacing=1.4)

    ax.set_yticks(list(y))
    ax.set_yticklabels(labels, fontsize=10)
    ax.set_xlim(0, 62)
    ax.set_xticks(range(0, 61, 10))
    ax.set_xticklabels([f"{v}%" for v in range(0, 61, 10)], fontsize=9)
    strip(ax, y_grid=False, x_grid=True)

    titles(fig,
           "Who points the finger on SVU? Mostly the detectives themselves",
           "Origin of the false accusation for each of the 521 falsely "
           "accused persons (controlled coding field)",
           top=0.965, sub_dy=0.052)
    footer(fig)
    save(fig, "who_points_the_finger.png")


if __name__ == "__main__":
    validate_palettes()
    chart_retreat()
    chart_apology()
    chart_media()
    chart_deaths()
    chart_origins()
    print("done")
