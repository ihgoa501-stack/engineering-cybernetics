# Agent 兼容与加载方式

没有一个跨所有 Agent 的统一启动协议。本项目保持一份权威总纲，再用薄适配器接入不同平台。

## 支持矩阵

| Agent | 自动加载方式 | 子 Agent | 当前级别 |
|---|---|---|---|
| Claude Code | 插件 `SessionStart` 注入总纲 | `SubagentStart` 再注入 | 强 |
| Codex | 插件 `SessionStart` 注入总纲 | `SubagentStart` 再注入 | 强 |
| OpenCode | `experimental.chat.system.transform` 每轮注入 | 子会话经过同一聊天变换时生效 | 强，但应做真机验证 |
| Antigravity | 插件 Rules 常驻，Skill 按需加载 | 取决于其插件和子 Agent 运行路径 | 中 |
| Kilo | 全局或项目 `AGENTS.md` 常驻，Skill 按需加载 | 隔离子 Agent 是否继承全部指令未作保证 | 中 |
| Gemini CLI | 扩展的 `contextFileName` 指向 `AGENTS.md` | 未作统一保证 | 中 |
| Cursor | `.cursor/rules/*.mdc` 常驻规则 | 平台相关 | 指令级 |
| Windsurf | `.windsurf/rules/*.md` | 平台相关 | 指令级 |
| Cline / Roo | `.clinerules/*.md` | 平台相关 | 指令级 |
| GitHub Copilot | `.github/copilot-instructions.md` | 平台相关 | 指令级 |
| Kiro | `.kiro/steering/*.md` | 平台相关 | 指令级 |
| Qoder | `.qoder/rules/*.md` | 平台相关 | 指令级 |
| 其他支持 Agent Skills 的工具 | `skills/engineering-cybernetics/SKILL.md` | 取决于宿主 | 按需 |
| 其他支持 AGENTS.md 的工具 | `AGENTS.md` | 取决于宿主 | 指令级 |

“强”表示存在专门的运行时注入入口；“中”表示平台会加载规则或 Skill，但子 Agent 继承边界仍依赖宿主；“指令级”表示模型会看到规则，但没有程序化强制保证。

## 各平台文件

### Claude Code 和 Codex

共同使用：

- `.claude-plugin/plugin.json` 或 `.codex-plugin/plugin.json`；
- `hooks/claude-codex-hooks.json`；
- `hooks/activate.js`；
- `hooks/subagent.js`；
- `skills/engineering-cybernetics/SKILL.md`。

启动 Hook 读取 `AGENTS.md` 和 `ENGINEERING_CYBERNETICS.md`。子 Agent Hook 读取同一来源，不依赖父 Agent 自行转述。

Codex 的 `/hooks` 是 CLI 命令，不是桌面 App 命令。在 CLI 中审核后，Codex 会把当前 Hook 定义的信任哈希写入 `~/.codex/config.toml`。同一台机器上的桌面 App 使用这份配置；信任完成后应重启 App 并开启新任务。Hook 内容发生变化时，哈希会变化，需要重新审核。

官方依据：[Codex CLI 斜杠命令](https://learn.chatgpt.com/docs/developer-commands.md?surface=cli)、[Codex Hooks](https://learn.chatgpt.com/docs/hooks.md)。

### OpenCode

`.opencode/plugins/engineering-cybernetics.mjs` 在每轮系统上下文中加入总纲，并把仓库的 `skills/` 注册到 OpenCode。使用本地检出时，在 `opencode.json` 的 `plugin` 数组中加入该文件的绝对路径。

### Kilo

适配包位于 `adapters/kilo/`：

- 把 `AGENTS.md` 合并到 `~/.config/kilo/AGENTS.md`，不要覆盖已有规则；
- 把 `skills/engineering-cybernetics/` 放到 `~/.kilo/skills/`。

Kilo 也会自动读取项目根目录的 `AGENTS.md` 和 `.agents/skills/`。本仓库没有替用户修改全局配置，避免破坏已有规则。

### Antigravity

完整插件位于 `adapters/antigravity/engineering-cybernetics/`。可以放到：

- 工作区：`.agents/plugins/engineering-cybernetics/`；
- 全局：`~/.gemini/config/plugins/engineering-cybernetics/`。

插件包含常驻 Rules 和按需 Skill。

## 内容更新规则

权威内容只有三类：

1. `ENGINEERING_CYBERNETICS.md`：总纲；
2. `control-scenarios/`：场景和垂直场景；
3. `skills/engineering-cybernetics/SKILL.md`：触发与路由。

平台规则副本不得手工修改。修改 `AGENTS.md` 或 Skill 后运行：

```bash
node scripts/sync-adapters.mjs
node scripts/sync-adapters.mjs --check
```

已安装插件不会因为 GitHub 文件变化而立即更新。发布新版本后，需要更新对应插件并重新开启任务。

## 尚未承诺的事情

- 不声称所有 Agent 都支持同一种 Hook；
- 不声称所有隔离子 Agent 都自动继承父上下文；
- 不远程静默更新规则；
- 不覆盖用户现有的全局 `AGENTS.md`、`CLAUDE.md` 或平台配置；
- 不把 Markdown 规则描述成权限、测试或安全策略的强制替代品。
