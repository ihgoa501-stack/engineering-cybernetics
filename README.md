# Engineering Cybernetics — 工程控制论

把工程控制论整理为“总纲 → 场景 → 垂直场景”的实用文档体系，并通过项目级说明文件帮助 Codex 和 Claude Code 在需要时使用这些文档。

## 文档结构

| 层级 | 作用 | 入口 |
|---|---|---|
| 项目规则 | 告诉 Agent 何时、怎样使用控制论 | [AGENTS.md](AGENTS.md) |
| 总纲 | 定义跨场景共同模型与原则 | [ENGINEERING_CYBERNETICS.md](ENGINEERING_CYBERNETICS.md) |
| 场景目录 | 根据当前问题选择文档 | [SCENARIOS.md](SCENARIOS.md) |
| 场景 | 展开一个领域的目标、信号、动作和风险 | [control-scenarios/](control-scenarios/) |

## Agent 如何加载

`AGENTS.md` 和 `CLAUDE.md` 不是两个 Agent，而是同一个 Agent 在当前项目中读取的说明文件。

```text
平台和用户的全局规则
        ↓
当前项目的 AGENTS.md
        ↓
用户本次提出的具体任务
        ↓
按任务需要读取总纲和场景文档
```

### Codex

Codex 在项目中工作时自动发现项目根目录的 `AGENTS.md`。它会把全局说明与项目说明组合使用；更接近当前工作目录的说明负责更具体的局部规则。

### Claude Code

Claude Code 自动发现项目中的 `CLAUDE.md`。本仓库的 `CLAUDE.md` 只有一行：

```md
@AGENTS.md
```

这让 Claude Code 导入同一份 `AGENTS.md`，因此不需要维护两套规则。

### 详细文档

启动时只加载短小的项目入口。Agent 遇到非简单的软件建设、自动化、AI Agent、业务闭环或物理控制任务时，再按照 `AGENTS.md` 读取总纲、场景目录和适用场景。简单、一次性、低风险任务不强制套用控制论。

## 放进其他项目

把以下内容复制到目标项目根目录：

```text
AGENTS.md
CLAUDE.md
ENGINEERING_CYBERNETICS.md
SCENARIOS.md
control-scenarios/
```

然后新开一个 Agent 任务，让它回答“当前加载了哪些项目说明”。如果它能说明 `AGENTS.md` 的适用条件，并能在复杂任务中找到对应场景，最小加载闭环就成立。

## 当前安全边界

当前版本是纯文档工具包：

- 不包含启动 Hook；
- 不执行安装脚本；
- 不修改用户目录或全局配置；
- 不自动联网更新；
- 不要求管理员权限；
- 不保证所有 Agent 都支持相同的文件发现机制。

其他 Agent 只有在其官方支持 `AGENTS.md`，或支持用自己的项目说明文件导入 `AGENTS.md` 时，才接入本工具包。先验证一个真实平台，再增加对应入口，不预先维护大量适配器。

## 当前场景

- [物理控制系统](control-scenarios/PHYSICAL_SYSTEMS.md)
- [软件系统](control-scenarios/SOFTWARE_SYSTEMS.md)
- [软件项目开发](control-scenarios/SOFTWARE_DEVELOPMENT.md)
- [AI Agent 与自动化](control-scenarios/AI_AGENTS.md)
- [业务反馈闭环](control-scenarios/BUSINESS_LOOPS.md)
- [AI 编码 Agent](control-scenarios/ai-agents/CODING_AGENT.md)
- [从真实问题到首个可用闭环](control-scenarios/software-development/FIRST_USABLE_LOOP.md)

## 修改和扩展

- 修改总纲：只改 `ENGINEERING_CYBERNETICS.md`；
- 修改场景：只改对应的 `control-scenarios/` 文档；
- 新增场景：增加文档，并在 `SCENARIOS.md` 登记触发条件和路径；
- 修改加载规则：只改 `AGENTS.md`，`CLAUDE.md` 继续导入它；
- 新增平台适配：先用真实项目验证该平台的官方项目级加载机制。

## 历史版本

仓库最初的 8-lens 架构设计 Skill、参考资料和示例保存在 [history/v1-architecture-skill/](history/v1-architecture-skill/)。曾经尝试过的多平台插件与 Hook 可以从 Git 历史中的 `f8d6404` 版本查看，但不再包含在当前默认方案中。

## 来源与边界

项目受到钱学森 1954 年出版的 *Engineering Cybernetics*（《工程控制论》）启发。原著主要面向受控和制导工程系统；本仓库对软件、AI Agent、项目开发和业务流程的内容属于现代场景适配，不应表述为原著逐字结论，也不能替代物理控制、安全工程或相关行业标准。

## License

MIT
