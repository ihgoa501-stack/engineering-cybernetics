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

## Agent 自动加载

本仓库同时是一个可移植的 Agent 规则包：

- `AGENTS.md`：不支持插件的平台使用的常驻核心规则；
- `skills/engineering-cybernetics/SKILL.md`：按任务触发并加载对应场景；
- `hooks/`：Claude Code 和 Codex 在主会话、子 Agent 启动时注入总纲；
- `.opencode/plugins/`：OpenCode 每轮注入同一份总纲；
- `adapters/`：Kilo 和 Antigravity 的安装包；
- Cursor、Windsurf、Cline、Copilot、Kiro、Qoder 的规则文件由 `scripts/sync-adapters.mjs` 从 `AGENTS.md` 生成。

### Claude Code

```text
/plugin marketplace add ihgoa501-stack/engineering-cybernetics
/plugin install engineering-cybernetics@engineering-cybernetics
```

### Codex

```bash
codex plugin marketplace add ihgoa501-stack/engineering-cybernetics
codex plugin add engineering-cybernetics@engineering-cybernetics
```

`/hooks` 只在 Codex CLI 的交互界面中提供，Codex 桌面 App 目前没有这个斜杠命令。安装后请启动 Codex CLI：

```bash
codex
```

如果 macOS 终端找不到 `codex`，使用桌面 App 内置的可执行文件：

```bash
/Applications/ChatGPT.app/Contents/Resources/codex
```

进入 CLI 后输入 `/hooks`，审核并信任本插件的 `SessionStart` 和 `SubagentStart` Hook。信任信息保存在同一个 `~/.codex/config.toml` 中；完成后重启桌面 App 并开启新任务。不要使用 `--dangerously-bypass-hook-trust` 代替正常审核。

其他 Agent 的加载级别和安装位置见 [Agent 兼容说明](docs/agent-portability.md)。

## 修改和扩展

- 修改总纲：只改 `ENGINEERING_CYBERNETICS.md`；
- 修改场景：只改对应 `control-scenarios/` 文档；
- 新增场景：增加文档，并只在 `SCENARIOS.md` 登记触发条件和路径；
- 修改 `AGENTS.md` 或 Skill 后：运行 `node scripts/sync-adapters.mjs`；
- 发布更新后：已安装的 Agent 需要更新插件并开启新任务，GitHub 内容不会自动替换本机旧版本。

验证适配器和加载行为：

```bash
node scripts/sync-adapters.mjs --check
node tests/loading.test.mjs
```

## 历史版本

仓库最初的 8-lens 架构设计 Skill、参考资料和示例已原样归档到 [history/v1-architecture-skill/](history/v1-architecture-skill/)。新版文档覆盖其主入口，但不删除原始成果。

## 来源与边界

项目受到钱学森 1954 年出版的 *Engineering Cybernetics*（《工程控制论》）启发。原著主要面向受控和制导工程系统；本仓库对软件、AI Agent、项目开发和业务流程的内容属于现代场景适配，不应被表述为原著逐字结论，也不能替代物理控制、安全工程或相关行业标准。

## License

MIT
