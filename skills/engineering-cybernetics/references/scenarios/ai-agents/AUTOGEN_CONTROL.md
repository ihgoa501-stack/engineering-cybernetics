# 垂直场景：AutoGen 控制场景

适用于使用 Microsoft AutoGen 设计 AgentChat、Core、GroupChat、GraphFlow、Swarm、Magentic-One 或 AutoGen Studio 工作流的任务。

本场景继承[工程控制论总纲](../../CORE.md)、[AI Agent 与自动化](../AI_AGENTS.md)和[多 Agent 协作](MULTI_AGENT.md)的规则；本文件只增加 AutoGen 特有的控制约束。

AutoGen 的核心风险不是“能不能让多个 Agent 聊起来”，而是会话、工具、代码执行、终止条件和人类介入没有控制好，导致无限循环、错误工具调用、共享上下文污染或外部副作用。

调研依据：

- Microsoft AutoGen 官方文档将 AutoGen 定位为构建 AI agents and applications 的框架，包含 Studio、AgentChat、Core、Extensions 等层。
- AgentChat 是用于构建单 Agent 和多 Agent 对话应用的高层框架；Core 是事件驱动框架，面向可扩展多 Agent 系统。
- AgentChat 支持 GroupChat、SelectorGroupChat、Swarm、Magentic-One、GraphFlow、Memory/RAG、logging、tracing 和 observability。
- 官方终止条件包括 MaxMessage、TextMention、TokenUsage、Timeout、Handoff、External、StopMessage、FunctionCall 等。
- Microsoft 另有 AutoGen 到 Microsoft Agent Framework 的迁移指南；新项目需要确认到底使用 AutoGen，还是使用更新的 Microsoft Agent Framework。

---

## 一、什么时候使用

出现以下情况时加载本场景：

- 使用 AutoGen AgentChat 快速搭单 Agent 或多 Agent 原型；
- 使用 GroupChat、SelectorGroupChat、RoundRobinGroupChat 或 Swarm；
- 使用 Core 做事件驱动、多运行时或分布式 Agent；
- 使用 GraphFlow 描述确定性或半确定性 workflow；
- 使用 AutoGen Studio 做无代码/低代码多 Agent workflow；
- 使用 AutoGen 执行模型生成代码、工具调用、MCP、Docker code executor 或外部服务。

以下情况优先不用 AutoGen：

- 只是一次性问答、简单脚本或单次工具调用；
- 任务只有固定两三步，普通函数或单 Agent 能清楚完成；
- 没有明确终止条件、预算上限和人工确认边界；
- 外部动作高风险，但无法审查工具、代码执行或会话状态；
- 新项目更适合 Microsoft Agent Framework，但尚未比较迁移成本。

---

## 二、控制目标

设计 AutoGen 系统前，先写清：

```text
目标结果：AutoGen workflow 最终要交付什么可验证结果？
层级选择：用 AgentChat、Core、GraphFlow、Studio，还是 Microsoft Agent Framework？
Agent 分工：每个 Agent 的职责、工具和禁止动作是什么？
会话结构：RoundRobin、Selector、Swarm、GraphFlow 还是自定义？
共享状态：哪些内容进入 shared conversation history，哪些必须隔离？
工具边界：哪些 Agent 能调用哪些工具、代码执行器和外部服务？
终止条件：靠什么停止？最多几轮、多少 token、多久、哪个事件？
人工介入：哪些 handoff 或审批点必须暂停？
验收证据：如何证明结果正确、外部状态已验证且未越权？
安全状态：失控时如何停止会话、冻结工具和保留日志？
```

“多个 Agent 互相讨论”不是完成证据。AutoGen 的完成证据必须来自终止条件、工具结果、测试、trace 或外部状态验证。

---

## 三、状态、信号与动作

| 控制元素 | AutoGen 场景中的含义 |
|---|---|
| 目标状态 | Team/Workflow 正常停止，任务验收证据成立，外部副作用已验证 |
| 当前状态 | Agent 列表、系统提示、工具权限、会话历史、终止条件、运行日志 |
| 观测信号 | 消息流、speaker 选择、tool call、code execution、termination、trace、成本 |
| 控制动作 | 选择下一个 speaker、调用工具、执行代码、handoff、暂停、终止、重试 |
| 扰动 | 无限对话、错误 speaker、上下文污染、工具越权、代码执行副作用、成本失控 |
| 约束 | 唯一写入者、最小工具权限、终止条件、人工确认、沙盒、预算上限 |
| 反馈 | 最终输出核验、工具结果复查、trace 审查、测试、外部真实状态检查 |
| 安全状态 | ExternalTermination 或人工停止；禁用高风险工具；保留消息和日志 |

AutoGen 的 conversation history 是共享观测面，不是事实数据库。Agent 说过的话仍然需要证据。

---

## 四、架构选择

先选最弱的结构，只有当前结构无法满足控制要求时才升级。

| 架构 | 适合场景 | 控制要点 |
|---|---|---|
| 单个 AssistantAgent | 单任务、少工具、低风险 | 明确 max tool iterations 和结果验证 |
| RoundRobinGroupChat | 固定角色轮流协作 | 设置 MaxMessage/Timeout，避免空转 |
| SelectorGroupChat | 由模型动态选择下一个 Agent | agent description 要清楚；复杂规则用 selector function |
| Swarm | 动态 handoff 和接管 | handoff 触发人工/应用暂停，限制循环 |
| GraphFlow | 步骤和依赖较确定 | 显式节点、边、输入输出和失败路径 |
| Core Runtime | 事件驱动、分布式、可扩展系统 | topic、subscription、handler 和外部副作用要可审计 |
| AutoGen Studio | 快速原型和调试 workflow | 不直接当生产系统；导出配置后审查 |

如果 selector prompt 里开始堆很多条件，优先拆成更小的 sequential task、GraphFlow 或自定义 selector function。

---

## 五、AutoGen 特有控制规则

### 1. Termination 是硬控制，不是提示词礼貌

每个 Team 必须至少有一个非语义上限：

- `MaxMessageTermination` 控制最大消息数；
- `TimeoutTermination` 控制最大时间；
- `TokenUsageTermination` 控制最大 token；
- `ExternalTermination` 支持 UI 或外部系统停止；
- 高风险 handoff 用 `HandoffTermination` 暂停给人或应用。

`TERMINATE` 这类文本停止条件可以使用，但不能作为唯一刹车。

### 2. Speaker 选择要可解释

SelectorGroupChat 用模型选择下一个 speaker，容易出现错选、重复选或绕过 Planner。

控制：

- agent name 和 description 写清楚；
- planner 未分配任务前，其他 Agent 不开始；
- 只允许一个 speaker；
- 复杂选择逻辑改用 selector function；
- 记录每次 speaker selection 的理由或上下文。

### 3. 共享会话历史要防污染

所有 Agent 看到同一段 conversation history 时，错误、猜测和提示注入会被放大。

控制：

- 把工具结果、用户指令、Agent 推断分开标记；
- 高风险证据不要只放在自然语言消息里；
- 子 Agent 不需要的敏感上下文不进入共享历史；
- 冲突结论由主控按证据裁决。

### 4. 工具和代码执行器最小权限

AutoGen Extensions 支持 MCP、Assistant API、Docker code executor、distributed runtime 等能力。

控制：

- 每个 Agent 只绑定必要工具；
- 代码执行默认 Docker/沙盒；
- 执行前审查生成代码是否读 secret、联网、写外部路径；
- 外部写入节点必须人工确认和幂等记录；
- 工具错误后不自动无限重试。

### 5. Human-in-the-loop 要放在动作之前

用户代理或 handoff 不能只做事后确认。

必须暂停的情况：

- 发送外部消息；
- 付款、退款、下单、改价；
- 删除或覆盖重要数据；
- 生产发布或权限变更；
- 目标、范围、成本或风险发生变化。

### 6. Studio 原型不能直接等于生产

AutoGen Studio 适合快速定义、调试和评估 workflow，但 UI 里跑通不等于生产可用。

进入生产前至少检查：

- JSON/配置是否可版本化；
- model、tool、termination、human approval 是否清楚；
- 是否能在 CI 或脚本里复现；
- 是否有日志、trace 和失败出口；
- secret 是否从环境或安全存储注入。

### 7. 新项目要评估 Microsoft Agent Framework

actual：Microsoft 已发布 AutoGen 到 Microsoft Agent Framework 的迁移指南，并说明 Agent Framework 在 workflow、middleware、hosted tools、typed workflow 和 observability 上有差异。

控制：

- 已有 AutoGen 项目：先稳定终止条件、工具权限和测试，再考虑迁移；
- 新项目：先比较 AutoGen 与 Microsoft Agent Framework，不因为名字熟悉就默认 AutoGen；
- 迁移不能只替换 API，要重新验证 orchestration、human-in-loop、checkpoint 和 observability。

---

## 六、真实场景

### 1. 多 Agent 研究助手

控制：

- Planner 先拆任务；
- Search Agent 只返回来源和证据；
- Analyst 只处理已收集证据；
- Selector 不能绕过 Planner；
- 最终报告必须区分 quoted、inferred、unknown。

### 2. 代码生成 + 执行

控制：

- Code Agent 是唯一生成代码者；
- Executor 只能在沙盒运行；
- 文件写入目录固定；
- 测试通过前不判定完成；
- 生成代码不能读取 secret 或调用未授权网络。

### 3. 客服/运营群聊

控制：

- 分类 Agent 只分类；
- 答复 Agent 只草拟；
- UserProxy 或人工审批后才能发送；
- 涉及退款、价格、账户和隐私时停止给人。

### 4. Studio 快速原型

控制：

- 先用于低风险模拟；
- 导出配置后审查；
- 加上消息数、时间和 token 上限；
- 高风险工具默认关闭；
- 再用真实样例做 dry run。

### 5. Core 事件驱动 Agent 系统

控制：

- topic 和 subscription 必须有边界；
- handler 只处理自己的事件类型；
- 外部副作用单独封装；
- 事件重复投递时要幂等；
- trace 能还原事件链路。

---

## 七、最小检查

- 这次 AutoGen 用哪一层：AgentChat、Core、GraphFlow、Studio？
- 为什么不是普通函数、单 Agent 或 LangGraph？
- 每个 Agent 的工具权限是什么？
- Team 用什么 termination，是否有硬上限？
- 谁选择下一个 speaker，选择逻辑能否解释？
- 哪些消息或证据进入共享历史？
- 是否存在代码执行、MCP、外部 API 或生产动作？
- 人类在哪个动作之前介入？
- 最终结果如何用 trace、测试或外部状态验证？

---

## 八、完成判定

- `PASS`：Agent 分工、工具权限、speaker 选择、termination、人类介入和验证证据都明确且通过最小运行；
- `FAIL`：出现无限对话、越权工具调用、错误代码执行、外部副作用错误或无法复现；
- `UNKNOWN`：无法确认会话状态、工具执行、外部结果、成本、trace 或迁移差异；
- `STOPPED`：发现不需要 AutoGen、应改用 Microsoft Agent Framework、风险过高或需要用户决策。

AutoGen 的价值是快速构建可对话、可协作的 Agent 系统；控制重点是让“谁说话、谁调用工具、何时停止、何时交给人、如何验证”都成为硬边界。
