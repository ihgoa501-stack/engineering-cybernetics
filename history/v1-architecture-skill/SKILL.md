---
name: engineering-cybernetics
description: Apply Engineering Cybernetics (工程控制论, Qian Xuesen) principles to system architecture design — feedback, stability, controllability, observability, fault tolerance, adaptation, and large-scale system decomposition. Use when designing or reviewing system architectures, especially distributed, real-time, or safety-critical systems.
---

# Engineering Cybernetics — 工程控制论架构设计

## Core Principle

**Every system is a control problem.** Architecture is the art of designing feedback loops that keep a system in its desired operating region despite uncertainty, disturbance, and component failure.

## Quick Workflow: Cybernetic Architecture Review

When designing or reviewing a system architecture, walk through these lenses:

```
[1] Control Objective  →  What behavior are we regulating?
[2] System Model       →  What are states, inputs, outputs?
[3] Feedback Loops     →  How does the system sense & respond?
[4] Stability          →  Under what conditions does it break?
[5] Controllability    →  Can we actually influence the outcomes?
[6] Observability      →  Can we actually measure the state?
[7] Uncertainty        →  What if inputs are noisy or models wrong?
[8] Fault Tolerance    →  What happens when components die?
```

## The 8 Lenses

### 1. Control Objective
Define what the system is **regulating**. A system without clear objectives cannot be stable.

- **Setpoint**: target metric (latency P99 < 100ms, availability 99.99%)
- **Constraint**: limit not to exceed (cost per request, memory ceiling)
- **Disturbance rejection**: what external changes must the system absorb?

> **Antipattern**: optimizing for one objective while ignoring another (e.g., maximize throughput without latency constraint).

### 2. System Model
Abstract the system into **states**, **inputs**, and **outputs**.

- **State variables** — what needs to be tracked? (queue depth, connection pool usage, replica lag)
- **Control inputs** — what levers can we pull? (scaling factor, rate limit, circuit breaker threshold)
- **Measured outputs** — what can we observe? (request latency, error rate, CPU)
- **Disturbances** — what is outside our control? (traffic spikes, network partitions)

### 3. Feedback Loops
Feedback is the core of cybernetics. Every system needs closed-loop control.

- **Proportional** — react to current error (too slow → scale up)
- **Integral** — react to accumulated error (persistent lag → adjust)  
- **Derivative** — react to rate of change (spike → preemptively throttle)
- **Dead reckoning fails** — open-loop drift always diverges

**Architecture rule**: If a component cannot observe its own effect, it cannot control it.

### 4. Stability
The system must stay in its operating region. Analyze boundary conditions:

- **Positive feedback** → runaway (retry storms, cascading failure)
- **Oscillation** → over-correcting (thrashing, flapping autoscalers)
- **Nyquist criterion analogue**: a loop is stable if the response to a disturbance attenuates over time, not amplifies
- **Margin**: how close are we to instability?

### 5. Controllability
Can the control inputs actually reach the states that matter?

- A system is **controllable** if we can drive it from any state to any desired state in finite time
- In distributed systems: if your autoscaler can't reach the bottlenecked tier, it's not controllable
- **Check**: map every key state to a control input. If one is unpaired, you have an unmanaged risk.

### 6. Observability
Can we infer the internal state from what we measure?

- A system is **observable** if we can determine all internal states from outputs
- **Real-world**: can you detect queue buildup before latency spikes? Can you distinguish a slow query from a network partition?
- **Instrumentation is not observability** — raw metrics are signals; state reconstruction is the goal

### 7. Uncertainty Handling
No model is exact. Engineering cybernetics embraces this.

- **Robustness** — system works under worst-case bounds (circuit breakers, bulkheads)
- **Adaptation** — system retunes parameters online (auto-tuning, A/B testing)
- **Estimation** — Kalman-filter-style: fuse noisy signals to estimate true state (canary analysis, multi-probe health checks)

### 8. Fault Tolerance
Redundancy and self-diagnosis. Qian's framework emphasized reliability from first principles.

- **Redundancy** — N+1, active/standby, or N-active
- **Graceful degradation** — what still works when parts fail?
- **Self-diagnosis** — can the system detect its own failures and reconfigure?
- **Fail-safe** — if control is lost, does the system land in a safe state?

## Large-Scale Systems

For complex systems, use **hierarchical decomposition** (Qian's contribution to large-scale systems):

```
Layer 3: Strategic (goal-setting, long-term planning)
Layer 2: Tactical  (coordination, resource allocation)
Layer 1: Operational (local feedback loops, real-time control)
```

- Upper layers operate at slower timescales
- Each layer absorbs disturbances before they propagate up
- Layers communicate via **aggregated state**, not raw signals

## Anti-patterns

| Anti-pattern | Cybernetic diagnosis |
|---|---|
| Retry storm | Positive feedback loop with no damping |
| Flapping autoscaler | Derivative gain too high, integral too low |
| Silent data corruption | Unobservable state |
| Global lock contention | Uncontrollable shared resource |
| Cascading failure | No fault isolation / weak stability margin |
| "Just add more monitoring" | Observability without controllability is data hoarding |

## References

See [REFERENCE.md](REFERENCE.md) for detailed principles, theorems, and historical context.
See [EXAMPLES.md](EXAMPLES.md) for worked architecture examples.
