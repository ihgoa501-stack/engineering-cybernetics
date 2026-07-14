# 工程控制论场景目录

先按下面顺序选择一个主场景：

1. 多个场景同时匹配时，以最高失败代价所属的场景为主场景，例如人身与设备风险高于交付效率；
2. 失败代价相当时，选择描述当前任务最具体的场景，例如“首个可用闭环”优先于“软件项目开发”；
3. 只有另一领域存在独立风险和独立控制动作时，才补充第二个场景；
4. 无法判断主场景或关键事实不足时，标记 `unknown`，先获取能改变选择的最小证据；在此之前不执行高风险或不可逆动作。

只要动作会影响真实执行器、人身、设备或环境，就必须加载物理控制场景；只要自动动作会花钱或承诺价格、库存、订单，就必须同时加载业务场景。高风险覆盖规则不能被“只选一个主场景”省略。

| 触发条件 | 场景文档 |
|---|---|
| 机器、设备、飞行器或工业过程 | [物理控制系统](scenarios/PHYSICAL_SYSTEMS.md) |
| 在线服务、数据库、队列或分布式系统 | [软件系统](scenarios/SOFTWARE_SYSTEMS.md) |
| 从问题、范围到交付和使用反馈 | [软件项目开发](scenarios/SOFTWARE_DEVELOPMENT.md) |
| 自动决策、工具调用或多 Agent 协作 | [AI Agent 与自动化](scenarios/AI_AGENTS.md) |
| 投放、库存、定价或运营实验 | [业务反馈闭环](scenarios/BUSINESS_LOOPS.md) |
| AI 编码 Agent 的开发与验证 | [AI 编码 Agent](scenarios/ai-agents/CODING_AGENT.md) |
| 从真实问题到首个可用闭环 | [首个可用闭环](scenarios/software-development/FIRST_USABLE_LOOP.md) |

新增场景时，只增加场景文档并在这里登记触发条件和路径。
