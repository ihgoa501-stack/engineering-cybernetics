# 工程控制论场景目录

先选择决定主要目标和失败代价的主场景；只有存在独立的跨域风险时，才补充第二个场景。

| 触发条件 | 场景文档 |
|---|---|
| 机器、设备、飞行器或工业过程 | `control-scenarios/PHYSICAL_SYSTEMS.md` |
| 在线服务、数据库、队列或分布式系统 | `control-scenarios/SOFTWARE_SYSTEMS.md` |
| 从问题、范围到交付和使用反馈 | `control-scenarios/SOFTWARE_DEVELOPMENT.md` |
| 自动决策、工具调用或多 Agent 协作 | `control-scenarios/AI_AGENTS.md` |
| 投放、库存、定价或运营实验 | `control-scenarios/BUSINESS_LOOPS.md` |
| AI 编码 Agent 的开发与验证 | `control-scenarios/ai-agents/CODING_AGENT.md` |
| 从真实问题到首个可用闭环 | `control-scenarios/software-development/FIRST_USABLE_LOOP.md` |

新增场景时，只在这里登记触发条件和文档路径。适配器会把本目录和场景文档一起同步到需要独立副本的平台。
