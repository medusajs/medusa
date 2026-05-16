# Agent Selection Guide

This directory contains specialized agents for codebase exploration, research, and development. Each agent has a specific purpose and set of tools.

## Agent Categories

### Exploration Agents (Read-only)

| Agent | Focus | Tools | When to Use |
|-------|-------|-------|-------------|
| **codebase-locator** | WHERE (location) | Grep, Glob, LS | Finding files and directories |
| **codebase-analyzer** | HOW (implementation) | Read, Grep, Glob, LS | Understanding technical details |
| **codebase-pattern-finder** | EXAMPLES (patterns) | Grep, Glob, Read, LS | Finding templates to model after |
| **web-search-researcher** | EXTERNAL (research) | WebSearch, WebFetch | Getting information from the web |

### Development Agents (Harness Roles)

| Agent | Role | Focus Area | Key Patterns |
|-------|------|------------|--------------|
| **module-developer** | 模块开发 | `packages/modules/` | MedusaService, DML, decorators, providers |
| **workflow-developer** | 工作流开发 | `packages/core/core-flows/` | createStep, createWorkflow, transform, when |
| **api-developer** | API 路由开发 | `packages/medusa/src/api/` | route.ts, validators, middlewares, query-config |
| **frontend-developer** | 前端开发 | `packages/admin/dashboard/` | React, hooks, components, forms |
| **test-engineer** | 测试开发 | `integration-tests/`, `__tests__/` | Jest, Vitest, fixtures, test runners |

---

## Exploration Agents

### codebase-locator
**Use when you need to find WHERE code lives**

- Locating files relevant to a feature or module
- Finding all components related to a functionality
- Discovering test files, config files, or documentation
- Getting a structured overview of what exists where

**Example queries:**
- "Where is the order cancellation functionality?"
- "Find all files related to product variants"
- "Locate the authentication middleware"

**Output:** Grouped file paths by category (implementation, tests, config, docs, types)

---

### codebase-analyzer
**Use when you need to understand HOW code works**

- Tracing data flow through the system
- Understanding how a feature is implemented
- Explaining technical implementation details
- Following execution paths and call chains
- Understanding complex logic or algorithms

**Example queries:**
- "How does the order creation workflow process payments?"
- "Trace how product prices are calculated"
- "Explain the authentication flow from login to token generation"

**Output:** Detailed technical explanations with file:line references

---

### codebase-pattern-finder
**Use when you need examples to model after**

- Finding similar implementations as templates
- Discovering usage examples of a library or pattern
- Understanding how to implement something based on existing code
- Identifying consistent patterns across the codebase

**Example queries:**
- "Show me examples of API routes with validation"
- "Find similar workflow implementations"
- "How are other modules handling soft deletes?"

**Output:** Concrete code examples with context and usage patterns

---

### web-search-researcher
**Use when you need external information**

- Researching libraries, frameworks, or tools
- Finding documentation for third-party packages
- Understanding industry standards or best practices
- Getting information not available in the codebase

**Example queries:**
- "What are the latest Stripe API payment methods?"
- "Find TypeScript best practices for dependency injection"
- "Research OAuth 2.0 PKCE flow implementation"

**Output:** Synthesized research with source citations

---

## Development Agents (Harness Roles)

### module-developer
**模块开发工程师** — 负责 `packages/modules/` 下的 commerce 模块开发

- 创建/修改模块服务（MedusaService + 装饰器模式）
- 定义数据模型（DML）
- 编写数据库迁移
- 实现 Provider（支付、物流、通知等）
- 配置 Joiner 跨模块链接

**可配合技能：** `/investigate`, `/qa`, `/health`, `/review`

---

### workflow-developer
**工作流开发工程师** — 负责 `packages/core/core-flows/` 下的业务流程编排

- 定义步骤（createStep + 补偿函数）
- 组合工作流（createWorkflow）
- 使用 transform/when/parallelize 原语
- 跨模块查询（useQueryGraphStep）
- 添加扩展点（createHook）

**可配合技能：** `/investigate`, `/qa`, `/review`, `/health`

---

### api-developer
**API 路由开发工程师** — 负责 `packages/medusa/src/api/` 下的 HTTP 接口

- 编写路由处理（命名导出 GET/POST/DELETE）
- 定义 Zod 验证器
- 配置中间件（MiddlewareRoute[]）
- 设置 Query Config 和 Policy 权限
- 集成 workflow 到路由

**可配合技能：** `/qa`, `/investigate`, `/review`, `/health`

---

### frontend-developer
**前端开发工程师** — 负责 `packages/admin/dashboard/` 下的 React 管理后台

- 创建管理页面（列表、详情、创建、编辑）
- 编写数据 hooks 和表单组件
- 实现表格列定义和查询
- 集成 Widget 扩展系统

**可配合技能：** `/browse`, `/design-review`, `/qa`, `/investigate`, `/health`

---

### test-engineer
**测试工程师** — 负责项目测试体系的开发和维护

- 编写模块集成测试
- 编写 HTTP 集成测试
- 编写工作流测试
- 编写单元测试
- 维护测试 Fixture

**可配合技能：** `/qa`, `/investigate`, `/health`, `/review`

---

## Constraints

### Exploration Agents
- **Read-only**: No modifications to code
- **Objective**: No recommendations or critiques
- **Focused**: Stay within their specific domain
- **Accurate**: Provide exact file:line references
- **Complete**: Read files fully, not partially

### Development Agents
- **Pattern-aware**: Follow Medusa conventions and patterns
- **Superpowers-ready**: Know which skills to leverage for each task
- **Domain-focused**: Stay within their development area
- **Conventions**: Follow Prettier/ESLint rules, naming conventions

## Tips

1. **Start with locator**: If you don't know where code lives, use codebase-locator first
2. **Then analyze**: Once you know where, use codebase-analyzer to understand how it works
3. **Find patterns**: Use codebase-pattern-finder to see similar implementations
4. **Research externally**: Use web-search-researcher for non-codebase information
5. **Use role agents**: When building features, use the appropriate role agent for domain expertise
6. **Combine agents**: Use multiple agents in parallel for comprehensive exploration
