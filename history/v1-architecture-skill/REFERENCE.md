# Engineering Cybernetics — Reference

## Origins

**Engineering Cybernetics** (《工程控制论》) was published by Qian Xuesen (Tsien Hsue-shen) in 1954 (McGraw-Hill). It was the first work to systematically generalize Norbert Wiener's cybernetics into a technical science for engineering. It won the Chinese Academy of Sciences First-Class Science Prize in 1956.

## Key Theorems & Concepts

### Nyquist Stability Criterion
A feedback system is stable if the open-loop frequency response does not encircle the critical point (-1, j0) in the complex plane. In architecture terms: a closed-loop policy is stable if small disturbances dampen rather than amplify.

### Lyapunov Stability
A system is stable if there exists an "energy-like" function that always decreases along system trajectories. Architecture implication: design systems where natural dissipation mechanisms exist (queues drain, caches age out, connections time out).

### Kalman Controllability & Observability
- A system is **controllable** if the control inputs can drive all state variables to any desired value in finite time.
- A system is **observable** if all state variables can be reconstructed from output measurements over time.
- These are dual concepts — controllability of the forward system implies observability of its adjoint.

### Separation Principle
The optimal controller can be designed independently from the state estimator (observer). Architecture implication: control logic (decisions) and sensing logic (monitoring) can be designed separately as long as the interface is clean.

### Certainty Equivalence
For linear systems with Gaussian noise, the optimal strategy is to treat estimated states as if they were true states. Architecture: treat best-estimate metrics as truth for decision-making, but always bound execution.

## Hierarchical Control (Qian's Large-Scale Systems)

For complex systems, Qian proposed a **multi-layered, multi-epoch** framework:

| Layer | Timescale | Function | Example |
|---|---|---|---|
| Strategic | Hours–days | Goal-setting, planning, reconfiguration | Traffic splitting, region failover |
| Tactical | Seconds–minutes | Coordination, resource arbitration | Autoscaling, quota management |
| Operational | Milliseconds | Local feedback, real-time control | Circuit breakers, rate limiters |

Properties:
- Each layer is a control system in its own right
- Higher layers have broader scope but slower response
- Lower layers absorb high-frequency disturbances
- Information flows up as aggregates; decisions flow down as constraints

## Uncertainty Classification

| Type | Description | Approach |
|---|---|---|
| Known-knowns | Deterministic, modeled | Feedforward + feedback |
| Known-unknowns | Bounded uncertainty | Robust control (worst-case) |
| Unknown-unknowns | Surprise events | Adaptation, online learning |

## Key Failure Modes in Distributed Systems (Cybernetics Lens)

### Cascading Failure
A local failure propagates because remaining components take on the failed component's load, overload themselves, and fail in turn. **Diagnosis**: insufficient stability margin + no fault isolation. **Remedy**: bulkheads, circuit breakers, capacity reservation.

### Oscillation / Flapping
Two controllers with overlapping scope fight each other because each reacts to the other's effect. **Diagnosis**: uncoordinated loops, derivative gain too high. **Remedy**: decouple timescales, add integral damping, use coordination protocols.

### Deadlock / Livelock
System reaches a state from which no progress is possible. **Diagnosis**: loss of controllability — control inputs cannot reach the blocked state. **Remedy**: timeout, backpressure, deadlock detection with forced release.

### Retry Storm
Failed requests retry simultaneously, amplifying the original fault. **Diagnosis**: positive feedback loop (retry → more load → more failures → more retries). **Remedy**: exponential backoff, jitter, capped retry count.

### Slow Drain
Queue builds up but drains too slowly, eventually hitting latency SLO limits. **Diagnosis**: insufficient observability of internal state (queue depth not tracked). **Remedy**: queue monitoring, proactive shedding, control-theoretic admission control.

## Design Heuristics

### Heuristic 1: Every lever needs a sensor
For each control input (scaling, throttling, routing), there must be a corresponding measurement that detects its effect. No open-loop architecture survives first contact with production.

### Heuristic 2: Decouple timescales
If two control loops share state, ensure they operate on different timescales by at least an order of magnitude. Otherwise they will oscillate.

### Heuristic 3: Conservative higher-order
Higher-level controllers should be more conservative (lower gain, longer observation windows) than lower-level ones. Strategy changes slowly; tactics change quickly.

### Heuristic 4: Prefer integral over proportional
Pure proportional control leaves steady-state error. Integral action (accumulated error) eliminates it. In architecture: don't just react to current latency — track trend and persistent deviation.

### Heuristic 5: Limit loop gain
High gain gives fast response but low stability margin. Every feedback loop needs a gain margin — headroom before it oscillates.

### Heuristic 6: Graceful degradation
If full control is lost, the system should drift to a safe state, not an unsafe one. Define failure modes as explicitly as success modes.

### Heuristic 7: Strangler feedback
When migrating from one control strategy to another, run both in parallel with the old one still active until the new one proves stable. Never cut over without validation.

## Further Reading

- Tsien, H. S. (1954). *Engineering Cybernetics*. McGraw-Hill.
- Wiener, N. (1948). *Cybernetics: Or Control and Communication in the Animal and the Machine*. MIT Press.
- Qian Xuesen (钱学森), 宋健. 《工程控制论》(第三版). 科学出版社.
- Åström, K. J., & Murray, R. M. (2021). *Feedback Systems: An Introduction for Scientists and Engineers*. Princeton University Press.
