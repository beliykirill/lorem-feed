---
name: take-home
description: Stage-by-stage process for completing a take-home assignment with an AI agent — requirements, AI environment, architecture, scaffold, data & state, UI, final. Each stage has an input, an artifact, a check and a journal entry, and ends with a mandatory stop until the author confirms. Use when starting, continuing or closing any stage of a take-home task.
argument-hint: "[stage]"
---

# Take-home process

Work in stages. Never start the next stage, or slip its work into the current one, without the author's explicit confirmation.

If an argument is given, it names the stage to work on. Otherwise, find the current stage from the journal and say which one it is before doing anything.

## Rules for every stage
- **Ambiguities.** Never resolve them silently. List the options, mark your own inferences as unconfirmed, ask.
- **Decisions.** Write accepted decisions to the requirements document. Write changed decisions, with the reason, to the journal.
- **Dependencies.** Add nothing outside the approved stack without asking.
- **Definition of done.** Use the project's DoD (see CLAUDE.md). A stage is not done while any check fails.
- **Commits.** Only when the author asks.
- **End of stage.** Give a short report: what was done, what was deviated from, open questions. Then **STOP** and wait.

## Stages

### 1. Requirements
- **Input:** assignment text.
- **Artifact:** requirements document with explicit and implicit requirements, ambiguities with interpretation options, questions, then accepted decisions and assumptions for the README.
- **Check:** every ambiguity is closed by a decision. No open questions remain. Version and compatibility claims are verified, not assumed.
- **Journal:** what was decided, what was rejected and why, where the agent's inference was overruled.

### 2. AI environment
- **Input:** accepted requirements.
- **Artifact:** agent rules file (CLAUDE.md): stack, prohibitions, invariants, commands, DoD, languages. Process skill, reviewer subagent, check hooks, journal.
- **Check:** hooks skip cleanly when there is no project yet. Config files are valid. The skill and the agent are discoverable.
- **Journal:** what tooling was set up, deviations from the request.

### 3. Architecture
- **Input:** requirements + rules.
- **Artifact:** architecture plan: layers and slices, module list with responsibilities, data flow, state shape, persistence, the list of tests to write.
- **Check:** every requirement maps to a module. Every invariant has a planned test or an explicit reason why not.
- **Journal:** chosen structure, rejected alternatives.

### 4. Scaffold
- **Input:** architecture plan.
- **Artifact:** initialized project. Pinned toolchain versions, lint, format, typecheck and test scripts, CI. Empty layer structure. The app builds and starts on every target platform.
- **Check:** install + run commands work from a clean clone. DoD checks are green.
- **Journal:** exact versions, build problems and how they were solved.

### 5. Data & state
- **Input:** scaffold.
- **Artifact:** API layer, models, data enrichment, store with persistence, loading logic, selectors. Tests for the key invariants.
- **Check:** invariant tests pass. The reviewer subagent reports no violations.
- **Journal:** non-obvious implementation decisions, deviations from the plan.

### 6. UI
- **Input:** data & state.
- **Artifact:** screens, navigation, components. Loading, error and empty states.
- **Check:** manual run on every platform against the requirements, screenshots. The reviewer reports no violations.
- **Journal:** UX decisions, issues found during manual testing.

### 7. Final
- **Input:** working app.
- **Artifact:** README (setup, run, assumptions), process write-up, exported sessions, prompts, screenshots, release build.
- **Check:** a clean-clone run following only the README. Full reviewer pass over the requirements.
- **Journal:** summary of the whole process.
