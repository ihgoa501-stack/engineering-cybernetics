# Engineering Cybernetics — 工程控制论

一个面向 Claude Code、Codex 和 OpenCode 的工程控制论 Skill。它参考 [Ponytail](https://github.com/DietrichGebert/ponytail) 的多 Agent 加载结构，但不会把整套控制论强制塞进每个任务：Skill 匹配是基础加载方式；宿主支持并信任 Hook 时，Hook 额外注入轻量路由提醒。

## 它是什么

- **Skill** 是唯一的知识和执行规则源；
- **插件清单和适配器** 让不同 Agent 能发现同一个 Skill；
- **Hook** 是可选增强，在宿主支持并获得信任后提醒 Agent 判断是否需要控制论；
- **场景文档** 只在匹配后按需读取，不会全部常驻上下文。

```text
用户任务
   ↓
Skill 匹配；可选 Router Hook 提醒：这是不是控制问题？
   ├─ 否 → 正常处理，不加载控制论
   └─ 是 → 加载已安装插件中的 engineering-cybernetics/SKILL.md
                       ↓
                 总纲 + 一个主场景
                       ↓
                 执行并验证最小反馈闭环
```

## 目录结构

```text
.claude-plugin/plugin.json             Claude Code 插件入口
.codex-plugin/plugin.json              Codex 插件入口
.agents/plugins/marketplace.json       Codex marketplace 入口
.opencode/plugins/*.mjs                OpenCode 适配器
hooks/claude-codex-hooks.json          Claude/Codex 生命周期 Hook
hooks/inject-router.js                 轻量路由注入器
ETHOS.md                               项目长期稳定的工程信念
skills/engineering-cybernetics/        三端共用的唯一 Skill 源
skills/engineering-cybernetics/references/BUILDING_WITH_AI.md
                                       AI 辅助建设纪律
opencode.json                           OpenCode 本仓库配置
tests/router-hook.test.js              Hook 契约测试
```

## 什么时候触发

只有下面条件大部分成立时才使用：

1. 有需要维持或改善的目标状态；
2. 状态会随时间或扰动变化；
3. 能观察当前状态；
4. 有动作可以影响结果；
5. 动作后能再次测量和纠偏。

一次性、低风险、没有持续状态的任务不使用控制论。

## 三个平台如何加载

### Claude Code

发布到 GitHub 后安装：

```text
/plugin marketplace add ihgoa501-stack/engineering-cybernetics
/plugin install engineering-cybernetics@engineering-cybernetics
```

本地开发时，在仓库根目录运行：

```bash
claude --plugin-dir .
```

Claude 读取 `.claude-plugin/plugin.json`，加载共用 Hook 和 `skills/`。修改后可在 Claude Code 中运行 `/reload-plugins`。手动调用名为：

```text
/engineering-cybernetics:engineering-cybernetics
```

### Codex

Codex 通过 `.codex-plugin/plugin.json` 发现同一个 `skills/`，支持插件 Hook 的客户端还会发现 Hook。发布到 GitHub 后安装：

```bash
codex plugin marketplace add ihgoa501-stack/engineering-cybernetics
codex plugin add engineering-cybernetics@engineering-cybernetics
```

安装后重启 Codex 并新建任务。Skill 是基础能力，即使 Hook 没有运行，也可以通过任务匹配或明确要求使用 `engineering-cybernetics` Skill 加载。

- **Codex 桌面端**：不假设存在 `/hook` 或 `/hooks` 命令；没有 Hook 审查入口时，继续使用 Skill，Hook 视为未启用的可选增强。
- **Codex CLI**：启动时会自动提示审查新增或变化的 Hook；交互式 CLI 支持用 `/hooks` 再次查看和管理。这个命令不代表所有 Codex 客户端都支持。

当前 Codex CLI 的真实 marketplace 安装能够接受与 Ponytail 相同的 `hooks` 清单字段；部分旧版创建插件校验器仍会因静态 schema 滞后而拒绝该字段。应以目标客户端的真实加载结果为准，不能用 CLI 的 Hook 入口推断桌面端也有相同界面。

### OpenCode

在仓库根目录启动 OpenCode 时，`opencode.json` 加载本地适配器。适配器注册共用 `skills/` 路径，并在每轮系统上下文中加入同一份轻量路由规则。

## 场景和修改不会丢

源仓库只维护一份 `skills/engineering-cybernetics/`，不会为 Claude、Codex 和 OpenCode 分别维护三份知识副本：

- 修改长期工程信念：改 `ETHOS.md`；
- 修改触发和流程：改 `SKILL.md`；
- 修改总纲：改 `references/CORE.md`；
- 修改 AI 辅助建设纪律：改 `references/BUILDING_WITH_AI.md`；
- 修改场景：改 `references/scenarios/`；
- 新增场景：增加一个场景文档，并只在 `references/SCENARIOS.md` 登记一次。

运行时读取位置取决于安装方式：

- 本地直接加载仓库时，重启或 reload 后使用仓库里的最新文件；
- 通过 marketplace 安装时，Agent 读取的是已安装插件的版本快照，通常位于宿主自己的插件缓存目录；
- 旧的项目内 `.claude/skills/` 或 `.codex/skills/` 路径不是运行时唯一来源，路径变化不代表 Skill 丢失。

以后更新控制论 Skill 或增加场景，应先改源仓库，再发布新版本并升级插件。不要手改缓存目录；缓存是安装结果，不是维护源。

## 安全边界

- Hook 只输出路由文本，不修改项目、用户目录或全局配置；
- 不联网、不调用外部命令，不保存会话状态；
- Hook 出错时静默退出，不阻塞宿主 Agent；
- 需要 Node.js 运行，无第三方依赖；
- 控制论 Skill 不替代权限、沙箱、测试、CI 或领域安全标准。

## 验证

```bash
node tests/router-hook.test.js
node tests/opencode-adapter.test.mjs
claude plugin validate .
```

## 历史版本

最初的 8-lens 架构设计资料保存在 [history/v1-architecture-skill/](history/v1-architecture-skill/)。

## 来源与边界

项目受到钱学森 1954 年出版的 *Engineering Cybernetics*（《工程控制论》）启发。原著主要面向受控和制导工程系统；本项目对软件、AI Agent、项目开发和业务流程的内容属于现代场景适配，不能替代物理控制、安全工程或相关行业标准。

## License

MIT
