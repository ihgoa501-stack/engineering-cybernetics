# Engineering Cybernetics — 工程控制论

将工程控制论整理为“总纲 → 场景 → 垂直场景”的实用文档体系。

本项目从控制目标、状态、观测、控制动作、扰动、反馈、稳定性和安全状态出发，帮助人和 AI 分析动态系统。物理控制是理论原点；软件系统、软件项目开发、AI Agent 和业务反馈闭环是面向现代场景的延伸应用。

## 从这里开始

先阅读 [工程控制论总纲](ENGINEERING_CYBERNETICS.md)，判断当前问题是否真的是控制问题，再进入对应场景。

| 层级 | 作用 | 示例 |
|---|---|---|
| 总纲 | 定义跨场景共同模型与原则 | [ENGINEERING_CYBERNETICS.md](ENGINEERING_CYBERNETICS.md) |
| 场景 | 解释一个领域中的目标、信号、动作和失败模式 | [control-scenarios/](control-scenarios/) |
| 垂直场景 | 指导一个具体、可执行的控制闭环 | [AI 编码 Agent](control-scenarios/ai-agents/CODING_AGENT.md) |

## 当前场景

- [物理控制系统](control-scenarios/PHYSICAL_SYSTEMS.md)
- [软件系统](control-scenarios/SOFTWARE_SYSTEMS.md)
- [软件项目开发](control-scenarios/SOFTWARE_DEVELOPMENT.md)
- [AI Agent 与自动化](control-scenarios/AI_AGENTS.md)
- [业务反馈闭环](control-scenarios/BUSINESS_LOOPS.md)

当前已有两个垂直场景：

- [AI 编码 Agent](control-scenarios/ai-agents/CODING_AGENT.md)
- [从真实问题到首个可用闭环](control-scenarios/software-development/FIRST_USABLE_LOOP.md)

只有当真实场景出现不同的目标、观测、控制动作、反馈延迟或安全边界时，才增加新的垂直文档。

## 历史版本

仓库最初的 8-lens 架构设计 Skill、参考资料和示例已原样归档到 [history/v1-architecture-skill/](history/v1-architecture-skill/)。新版文档覆盖其主入口，但不删除原始成果。

## 来源与边界

项目受到钱学森 1954 年出版的 *Engineering Cybernetics*（《工程控制论》）启发。原著主要面向受控和制导工程系统；本仓库对软件、AI Agent、项目开发和业务流程的内容属于现代场景适配，不应被表述为原著逐字结论，也不能替代物理控制、安全工程或相关行业标准。

## License

MIT
