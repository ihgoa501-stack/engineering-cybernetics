# Engineering Cybernetics — Architecture Examples

## Example 1: Autoscaling as a Feedback Controller

### Problem
Design an autoscaling system for a stateless web service.

### Cybernetic Analysis

| Lens | Application |
|---|---|
| **Control objective** | Keep P99 latency < 200ms while minimizing cost |
| **Setpoint** | 150ms P99 (headroom below limit) |
| **State** | Current replica count, CPU utilization, request queue depth |
| **Input** | Desired replica count (scaling signal) |
| **Output** | Observed P99 latency, request rate |
| **Disturbance** | Traffic spikes, deployment changes, instance failures |

### Design (PID-style autoscaler)

```
measure: [latency, queue_depth, request_rate]
  ↓
compute error = setpoint - measured_latency
  ↓
P_term = Kp * error                  # react to current gap
I_term += Ki * error * dt            # accumulate persistent error
D_term = Kd * d(queue_depth)/dt      # anticipate based on queue growth
  ↓
scale_signal = P_term + I_term + D_term
desired_replicas = max(min_replicas, current + round(scale_signal))
  ↓
enact with cooldown period (integral anti-windup)
```

### Key Insights
- **Integral term** prevents steady-state error: without it, a persistent traffic increase leads to permanent latency degradation
- **Derivative term** on queue depth catches spikes before latency moves
- **Cooldown period** is **integral anti-windup** — prevents the I term from accumulating during enactment delay
- **Hysteresis** prevents oscillation at boundary conditions (scale-up at 70% CPU, scale-down at 50%)

---

## Example 2: Circuit Breaker as Stability Guarantee

### Problem
A service calls an external dependency that occasionally fails. Without protection, failures cascade.

### Cybernetic Analysis

| Lens | Application |
|---|---|
| **Control objective** | Protect caller from dependency failure; allow recovery |
| **State** | closed / open / half-open |
| **Input** | Success/failure signal from each call |
| **Output** | Call allowed or denied |
| **Stability** | Prevent positive feedback: retrying a failing dependency only makes it worse |

### State Machine

```
[CLOSED] ──(error_rate > threshold)──→ [OPEN] ──(timeout)──→ [HALF-OPEN]
    ↑                                      │                    │
    └────(recovery detected)───────────────┘                    │
    ←──(single probe succeeds)──────────── ←────────────────────┘
```

### Key Insight
The circuit breaker is fundamentally a **stability mechanism**: it breaks the positive feedback loop where retries amplify load on an already struggling dependency.

---

## Example 3: Distributed Rate Limiting

### Problem
Rate-limit requests across N stateless instances without a central coordinator.

### Cybernetic Lens
This is a **decentralized control** problem — each instance has partial observability (only sees its own traffic) and partial controllability (can only throttle its own requests).

### Solution: Gossip-based coordination

Each instance maintains a local rate counter and periodically exchanges counters with peers:

```
locally:    throttle if local_rate > (global_quota / N) * tolerance
via gossip: adjust tolerance based on observed load imbalance
```

### Key Insight
Qian's **hierarchical control** applies: local loops handle instantaneous decisions (operational layer); gossip provides tactical coordination on a slower timescale.

---

## Example 4: Adapting to Traffic Pattern Shift

### Problem
A service historically serves read-heavy traffic but suddenly shifts to write-heavy (e.g., a product launch).

### Cybernetic Diagnosis
The system's **model** no longer matches reality. The controller tuned for read-dominated workloads has **high gain in the wrong regime**.

### Adaptation Strategy

1. **Detect regime change** (observability): track read/write ratio as a state variable
2. **Re-estimate model**: measure latency-per-type under current load
3. **Retune controller**: adjust cache ratio, connection pool split, thread allocation
4. **Validate**: compare predicted vs actual latency; if mismatch > threshold, iterate

This follows the **self-adaptive control** framework Qian described: identification → decision → modification.

---

## Example 5: Database Connection Pool as Buffer

### Problem
An application connects to a database through a connection pool. Under load, connections contend.

### Cybernetic Lens
The connection pool is a **buffer** that decouples two timescales: the fast timescale of request processing and the slower timescale of connection establishment.

| Element | Control analogue |
|---|---|
| Pool size | Control input (manipulated variable) |
| Connection wait time | Measured output |
| Active connections | State variable |
| Request arrival rate | Disturbance |

### Design
- **Feedback**: if wait time > threshold, increase pool size (within limits)
- **Anti-windup**: if pool is at max and wait time is still high, reject requests fast (fail-fast beats queueing)
- **Feedforward**: if request rate is predicted to spike (deployment event, known campaign), proactively grow pool

---

## Example 6: Queue Backpressure

### Problem
A producer-consumer pipeline where the consumer can be slower than the producer.

### Cybernetic Lens
This is a **flow control** problem — regulate the flow of items to maintain system stability.

### Solution: Backpressure as Integral Control

```
error = target_queue_depth - current_queue_depth
producer_throttle = Ki * integral(error)

If queue is growing: reduce producer rate proportionally to accumulated excess
If queue is shrinking (below target): allow producer to speed up
```

### Key Insight
The integral term naturally handles **persistent imbalance** — if the consumer is permanently slower, the controller will find the equilibrium rate without manual tuning.

---

## Anti-patterns in the Wild

| Real-world pattern | Cybernetic analysis |
|---|---|
| "Retry with backoff" — but clients retry simultaneously after fixed interval | **Undamped positive feedback**: all retries hit at the same time. Fix: add jitter (phase randomization). |
| Add more replicas when CPU > 80%, remove when < 40% | **Oscillation risk** — add/remove thresholds are too close. Fix: widen the hysteresis band or add a dead zone. |
| "Monitor everything" with 100 dashboards but no automated response | **Observability without controllability**: you can see the state but cannot influence it. Action: pair every critical metric with a control policy. |
| Two separate autoscalers on the same metric | **Coupled controllers** — they fight each other. Fix: decouple timescales or merge into one controller with multiple outputs. |
