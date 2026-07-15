---
name: engineering-cybernetics
description: Apply engineering cybernetics to non-trivial software systems, software project development, AI agents and automation, repeatable business loops, or physical control where state changes over time and feedback can correct actions. Do not use for one-off, low-risk tasks with no evolving state.
---

# Engineering Cybernetics

1. Read [the project ethos](../../ETHOS.md) and [the core model](references/CORE.md). Read [AI-assisted building discipline](references/BUILDING_WITH_AI.md) only when the task involves software/agent construction choices, search-vs-build decisions, scope expansion, multi-agent review, QA, release, or automation discipline.
2. Before selecting a loop, preserve the user's stated goal with the [goal-preservation contract](references/CORE.md#目标保真合同). Distinguish the total goal, current stage goal, and current task goal; do not silently remove, narrow, or replace the total goal.
3. Define the control objective, constraints, current state, observations, available actions, disturbances, feedback, and safe state.
4. Read [the scenario registry](references/SCENARIOS.md) and choose one primary scenario. Add another only for an independent cross-domain risk.
5. Complete the smallest observable feedback loop that advances the preserved total goal without expanding the product scope. A smaller loop is a stage boundary, not permission to redefine the destination.
6. Verify the real outcome and separate `actual`, `quoted`, `estimated`, `inferred`, and `unknown`. Before claiming completion, map every original requirement to evidence or an explicit unresolved status and name the completed level: task, stage, or total goal.

When delegating, pass the total goal, stage goal, task goal, their relationship, constraints, verifiable outcome, stop conditions, and applicable scenario to the subagent. Agreement between agents is only a reference signal.

This skill guides decisions; it does not replace platform permissions, sandboxing, tests, CI, or domain safety standards.
