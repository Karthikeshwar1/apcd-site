# 🏁 APCD vs AI orchestrators: token benchmark

> 📌 Living doc. All details for this benchmark live here. Last update: 2026-10-13.

## 🎯 TL;DR

Same app, same model (Sonnet 5.5, low effort), same quality: **every run passed 30/30 API tests and 20/20 UI checks.**

| Comparison | Tokens used | Speed | Runs |
|---|---|---|---|
| 🖥️ **Desktop app:** Claude projects coordinator vs APCD | Projects used **1.6× more** | – | 2 vs 1 |
| ⌨️ **CLI:** Claude Code + sub-agents vs APCD | Sub-agents used **1.1–1.3× more** (1.15× on cost) | APCD **2× faster** | 2 vs 3 |

💡 **Why:** an orchestrator adds a "manager" agent that re-reads its whole growing conversation on every step, and its sub-agents re-explore the code. APCD has no manager. One short project doc lets each fresh chat pick up exactly where the last one stopped.

> 🚗 Karthik, 2026-10-12: in my experience, orchestrator coordination hasn't been great yet. It's like manual shift vs auto transmission, back when auto transmissions were just introduced.

## 🧪 1. What we compare

| Arm | How work is split | How context carries over |
|---|---|---|
| 🅿️ **P**: APCD plugin | The human opens one new chat per milestone (6 chats) | `CLAUDE.md` Progress list |
| 🅾️ **O**: orchestrator | A coordinator spawns one sub-agent per milestone (1 + 6) | The coordinator's handoff notes |

- **O flavours:** 🖥️ the desktop **Claude projects coordinator**, and ⌨️ a **CLI session + sub-agents** (`claude -p`).
- **Compare only on the same surface.** Desktop vs CLI changes cost a lot by itself (§4).
- **Scope:** ⚖️ token efficiency only. Coordination quality isn't scored.
- **Excluded:** a single solo chat. Real big projects need a split.

## ⚙️ 2. Setup

- 📦 **Specimen:** Linkshelf (`SPEC.md`). A bookmark API plus a one-page UI, Node with zero dependencies, about 400 LOC, 6 milestones.
- 🤖 **Model:** Sonnet 5.5, effort low, everywhere.
- 🔌 **Environment:** the same plugins and MCP in all runs (realistic, not stripped).
- 🧩 **APCD version:** published, without the auto-refresh hook.

### 📏 Metrics

| Metric | What it is |
|---|---|
| 🔢 **Input units** (main) | in×1 + 5-min cache write×1.25 + 1-hour cache write×2 + cache read×0.1, which is Anthropic's relative pricing |
| ➕ Total units | Input units + output×5. Desktop sub-agent logs under-record output, so O's desktop totals are too low. |
| 💲 CLI cost | Claude Code's own $ estimate (CLI runs only) |
| ✅ Quality | Hidden API tests /30, scripted UI checks /20, own tests, LOC, blind visual rating (pending) |

## 📊 3. All runs

<!-- results:start -->
| Run | Arm | Input units | Total units* | CLI cost $ | Calls | Chats + subagents | Hidden API | UI checks | Own tests | LOC | Min |
|---|---|---|---|---|---|---|---|---|---|---|---|
| O-1 - Copy | O | **954k** | 990k | – | 78 | 1 + 6 | 30/30 | 20/20 | 49/50 | 387 | – |
| P-1 | P | **602k** | 737k | – | 45 | 6 + 0 | 30/30 | 20/20 | 17/17 | 368 | – |
| r2-O-1 | O | **405k** | 611k | 1.06 | 59 | 1 + 6 | 30/30 | 20/20 | 30/30 | 386 | 8 |
| r2-O-1-claude-projects | O | **970k** | 1013k | – | 73 | 1 + 6 | 30/30 | 20/20 | 46/46 | 475 | – |
| r2-P-3 (folder r2-O-2) | P | **361k** | 465k | 0.91 | 38 | 6 + 0 | 30/30 | 20/20 | 12/12 | 334 | 4 |
| r2-O-2-corrected | O | **415k** | 657k | 1.16 | 53 | 1 + 6 | 30/30 | 20/20 | 48/48 | 442 | 9 |
| r2-P-1 | P | **394k** | 523k | 1.01 | 41 | 6 + 0 | 30/30 | 20/20 | 17/17 | 403 | 4 |
| r2-P-2 | P | **377k** | 497k | 0.97 | 39 | 6 + 0 | 30/30 | 20/20 | 17/17 | 344 | 4 |
<!-- results:end -->

*\* Desktop runs (no `r2-` CLI cost) under-record sub-agent output, so O's desktop totals are too low.*
*📝 `r2-P-3` ran in the folder named `r2-O-2` by mistake. It's an APCD run.*

### 🖥️ 3.1 Desktop app: APCD vs Claude projects

| | 🅿️ APCD (P-1) | 🅾️ Projects (O-1 Copy, r2-O-1-claude-projects) | O ÷ P |
|---|---|---|---|
| 🔢 Input units | **602k** | **954k · 970k** (within 2%) | **1.6×** |
| 📞 API calls | 45 | 78 · 73 | 1.7× |
| ✅ Tests | 30/30 · 20/20 | 30/30 · 20/20 | equal |

The coordinator chat alone re-read 1.8–2.4M cached tokens.

### ⌨️ 3.2 CLI: APCD vs session + sub-agents (averages)

| | 🅿️ APCD (3 runs) | 🅾️ Sub-agents (2 runs) | O ÷ P |
|---|---|---|---|
| 🔢 Input units | 377k (361–394k) | 410k (405–415k) | **1.09×** |
| ➕ Total units | 495k | 634k | **1.28×** |
| 💲 CLI cost | $0.96 | $1.11 | **1.15×** |
| 📞 API calls | 39 | 56 | 1.4× |
| ⏱️ Time | 4 min | 8.5 min | **2.1×** |
| ✅ Tests | 30/30 · 20/20 | 30/30 · 20/20 | equal |

- **Runs are stable:** APCD varied ±4% across 3 runs, O ±1% across 2.
- **APCD's biggest cost is its cache price.** Each new chat writes the 1-hour cache at 2× base price; sub-agents write the 5-minute cache at 1.25×. That's about 2/3 of APCD's input units.

## 🔀 4. Desktop app vs CLI

| Arm | 🖥️ Desktop | ⌨️ CLI | Change |
|---|---|---|---|
| 🅿️ APCD | 602k | 377k | −37% |
| 🅾️ Orchestrator | 962k | 410k | −57% |

The desktop app adds overhead per agent, so orchestration (7 agents) pays it 7 times.

## 💡 5. Findings

1. 🏆 **APCD never cost more at equal quality.** It was 1.6× cheaper than desktop projects, and 1.15× cheaper in $ and 2× faster than CLI sub-agents.
2. 🧠 **The manager agent is the tax.** Its context grows every step, and it waits between sub-agents, which slows things down.
3. 🖥️ **Surface matters as much as method.** The desktop app made orchestration about 2.3× pricier than the CLI.
4. 🙃 **Orchestrators don't always orchestrate.** "Use sub-agents as you see fit" produced zero sub-agents, so the O prompt forces them.
5. 🎨 **Quality is equal on every automated check.** The visual comparison is still pending blind rating (round 1's APCD UI looked plainer).

## ⚠️ 6. Caveats

- 🔬 It's a small, focused specimen (about 400 LOC). Big, messy projects may differ.
- 🔢 The desktop comparison is n=1 for APCD vs n=2 for projects.
- 🙋 APCD trades a little laziness: you open each new chat yourself, while orchestrators do it for you.
- 🎛️ It was a single model and effort level (Sonnet 5.5, low).

## 🛠️ 7. How to run more

```
cd S:/PROJECTS/dir2_learner/apcd-benchmark/apcd
node tools/bench.mjs run P <new-name>
node tools/bench.mjs run O <new-name>
node tools/bench.mjs score <folder-name>
node tools/bench.mjs blind r2
```

- `run`: CLI, auto-scored.
- `score`: for a manual desktop run in `S:/bench/<folder-name>`.
- `blind`: blind visual rating page.
- Use a new name per run. Folders are never reused.

## ❓ 8. Open questions

- 🔄 Can new chats use the 5-min cache (1.25×) instead of the 1-hour one (2×)? It's about 2/3 of APCD's cost.
- 🪝 Does the auto-refresh hook add or save tokens? Run P with the hook on vs off after release.
- 🎨 Blind visual rating across all r2 runs.
- 🧭 Cursor: log its tokens by hand from the dashboard export.
