# Engineering Cybernetics — 工程控制论

> **"Every system is a control problem."**

A skill that applies Qian Xuesen's **Engineering Cybernetics** (《工程控制论》, 1954) principles to modern system architecture design.

## What This Is

This repository distills the core principles of Engineering Cybernetics into a practical **architecture design framework** — 8 lenses rooted in control theory that help you design, review, and debug complex systems:

1. **Control Objective** — What behavior are we regulating?
2. **System Model** — What are states, inputs, outputs?
3. **Feedback Loops** — How does the system sense & respond?
4. **Stability** — Under what conditions does it break?
5. **Controllability** — Can we actually influence the outcomes?
6. **Observability** — Can we actually measure the state?
7. **Uncertainty Handling** — What if inputs are noisy or models wrong?
8. **Fault Tolerance** — What happens when components die?

## Usage

| File | Purpose |
|---|---|
| [SKILL.md](SKILL.md) | Main skill — the 8-lens workflow and quick reference |
| [REFERENCE.md](REFERENCE.md) | Detailed principles, theorems, and design heuristics |
| [EXAMPLES.md](EXAMPLES.md) | Worked architecture examples with cybernetic analysis |

## Origin

Qian Xuesen (Tsien Hsue-shen) published *Engineering Cybernetics* in 1954 (McGraw-Hill), the first work to systematically apply Norbert Wiener's cybernetics to engineering. It won the Chinese Academy of Sciences First-Class Science Prize in 1956 and became a foundational text in control theory and systems engineering.

## Why This Matters

Modern distributed systems face the same fundamental challenges Qian identified 70 years ago: uncertainty, coupling, cascading failure, and the need for self-regulation. The vocabulary of engineering cybernetics gives architects a precise language to describe and solve these problems.

## License

MIT
