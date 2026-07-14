# Engineering Cybernetics — 工程控制论

一套按需加载的 Claude Code Skill，把工程控制论整理为“总纲 → 场景 → 垂直场景”的实用文档体系。

## 结构

```text
.claude/skills/engineering-cybernetics/
└── SKILL.md

ENGINEERING_CYBERNETICS.md
SCENARIOS.md
control-scenarios/
```

- `SKILL.md`：告诉 Claude 什么时候使用控制论，以及如何选择文档；
- `ENGINEERING_CYBERNETICS.md`：跨场景总纲；
- `SCENARIOS.md`：场景路由；
- `control-scenarios/`：领域和垂直场景。

## Claude 如何加载

Claude Code 会自动发现项目中的 `.claude/skills/*/SKILL.md`。启动时只发现 Skill 的名称和描述；当前任务与描述匹配时，才加载完整 `SKILL.md`，再按需要读取对应场景。

```text
任务进入 Claude Code
        ↓
匹配 engineering-cybernetics 的 description
        ↓
加载 SKILL.md
        ↓
读取总纲和一个适用场景
        ↓
执行并验证最小反馈闭环
```

也可以手动调用：

```text
/engineering-cybernetics
```

本项目不再使用 `AGENTS.md` 或 `CLAUDE.md` 作为加载入口。控制论不适用于每一个简单任务，因此不需要每次会话都强制加载。

## 使用

把以下内容复制到目标项目根目录：

```text
.claude/skills/engineering-cybernetics/
ENGINEERING_CYBERNETICS.md
SCENARIOS.md
control-scenarios/
```

重新启动 Claude Code，然后提出一个涉及持续状态、反馈和纠偏的任务，或者直接输入 `/engineering-cybernetics`。

## 当前安全边界

当前版本只有 Markdown：

- 没有 Hook；
- 没有安装脚本；
- 没有可执行代码；
- 不修改用户目录或全局配置；
- 不自动联网更新；
- 不申请工具权限。

## 场景

- [物理控制系统](control-scenarios/PHYSICAL_SYSTEMS.md)
- [软件系统](control-scenarios/SOFTWARE_SYSTEMS.md)
- [软件项目开发](control-scenarios/SOFTWARE_DEVELOPMENT.md)
- [AI Agent 与自动化](control-scenarios/AI_AGENTS.md)
- [业务反馈闭环](control-scenarios/BUSINESS_LOOPS.md)
- [AI 编码 Agent](control-scenarios/ai-agents/CODING_AGENT.md)
- [从真实问题到首个可用闭环](control-scenarios/software-development/FIRST_USABLE_LOOP.md)

## 修改和扩展

- 修改触发条件或工作流程：改 `.claude/skills/engineering-cybernetics/SKILL.md`；
- 修改总纲：改 `ENGINEERING_CYBERNETICS.md`；
- 修改场景：改对应的 `control-scenarios/` 文档；
- 新增场景：增加文档，并在 `SCENARIOS.md` 登记。

先在 Claude Code 中验证真实使用，再决定是否为其他 Agent 增加它们官方支持的 Skill 入口。

## 历史版本

最初的 8-lens 架构设计资料保存在 [history/v1-architecture-skill/](history/v1-architecture-skill/)。多平台插件与 Hook 实验可以从 Git 历史中的 `f8d6404` 查看。

## 来源与边界

项目受到钱学森 1954 年出版的 *Engineering Cybernetics*（《工程控制论》）启发。原著主要面向受控和制导工程系统；本项目对软件、AI Agent、项目开发和业务流程的内容属于现代场景适配，不能替代物理控制、安全工程或相关行业标准。

## License

MIT
