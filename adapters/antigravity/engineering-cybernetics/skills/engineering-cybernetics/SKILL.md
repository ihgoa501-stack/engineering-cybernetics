---
name: engineering-cybernetics
description: Apply engineering cybernetics to project development, software systems, AI agents and automation, repeatable business loops, or physical control systems. Use when a task has a changing state, measurable feedback, corrective actions, disturbances, failure boundaries, or a need to design and verify an end-to-end control loop.
---

# Engineering Cybernetics

Use the repository's total doctrine first, then load only the scenario documents that match the current task.

## Workflow

1. Read `../../ENGINEERING_CYBERNETICS.md` completely before making a significant design or implementation decision.
2. Write a short control brief containing:
   - control objective and constraints;
   - current state and trustworthy observations;
   - available control actions and main disturbances;
   - feedback signal and acceptable delay;
   - success, failure, unknown, stop, and safe-state conditions.
3. Read `../../SCENARIOS.md`, then read the matching scenario document. Choose one main scenario; add another only for an independent cross-domain risk.
4. Implement the smallest end-to-end loop that can produce real feedback.
5. Verify the actual result and revise the model when evidence disagrees.

Read the selected document completely. Do not infer a scenario from its filename alone.

## Delegation

When delegating, include the control objective, constraints, required evidence, and stop conditions in the child task. Require the child agent to read the applicable project instructions and scenario. Treat agreement between agents as a reference signal, not independent evidence.

## Boundaries

- Do not apply the framework to a one-off, low-risk task with no changing state or useful feedback.
- Do not expand scope merely to make the control model look complete.
- Do not treat the framework as proof that the selected objective, signal, or model is correct.
- Use platform permissions, hooks, tests, or CI when a rule must be enforced rather than merely followed.
