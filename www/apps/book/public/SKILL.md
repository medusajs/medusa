---
name: medusa-docs
description: Navigate and search the Medusa documentation at docs.medusajs.com. Use when you need to find how to build, customize, deploy, or manage a Medusa commerce application or a Medusa Cloud project, look up a Medusa API, or pick the right agent tool (MCP servers, skills, CLI) for a Medusa task.
---

# Medusa Documentation

Medusa is an agent-native commerce platform. Medusa Cloud is the main way to build with it: you create a Cloud project, customize it locally, and push to deploy. This skill tells you where things are in the docs at `https://docs.medusajs.com` and which tools you can use to read them.

## Read Any Page as Markdown

Every documentation page is available as Markdown. Prefer Markdown over HTML.

- Append `.md` to a page URL: `https://docs.medusajs.com/learn/fundamentals/workflows.md`
- Or request the page with the `Accept: text/markdown` header.
- The homepage is at `https://docs.medusajs.com/index.md`.

## Find the Right Page

1. Search the docs with the retrieval endpoint (see below) when you have a question.
2. Browse an index when you need to see what exists:
   - `https://docs.medusajs.com/llms.txt`: root index that links to every section index.
   - `https://docs.medusajs.com/cloud/llms.txt`: Get Started and Medusa Cloud.
   - `https://docs.medusajs.com/resources/llms.txt`: Commerce Modules, recipes, tutorials, integrations, storefront development, tools, and references.
   - `https://docs.medusajs.com/api/llms.txt`: Store and Admin API routes.
   - `https://docs.medusajs.com/ui/llms.txt`: Medusa UI components.
   - `https://docs.medusajs.com/user-guide/llms.txt`: Merchant Guide for the Medusa Admin.
3. Fetch the full Framework docs in one file with `https://docs.medusajs.com/llms-full.txt` only when you need all of it. It's large.

## Where to Find What

| You need to | Go to |
|---|---|
| Create a store, sign up, or create a Cloud project | `/start`, `/cloud/sign-up`, `/cloud/first-project` |
| Set up a Cloud project locally | `/cloud/setup-locally` |
| Go live, add domains, emails, or search | `/cloud/going-live`, `/cloud/features` |
| Manage environments, variables, deployments, logs | `/cloud` (Management, Resources, Monitoring sections) |
| Use the Cloud CLI (`mcloud`) | `/cloud/cli` |
| Connect agents to Medusa (MCP, skills) | `/cloud/ai-toolkit` |
| Learn the Framework: modules, data models, workflows, API routes, admin | `/learn` |
| Use a commerce feature (products, carts, orders, payments, ...) | `/resources/commerce-modules` |
| Integrate a third-party service | `/cloud/integrations`, `/resources/integrations` |
| Build a use case end to end (marketplace, subscriptions, ...) | `/resources/recipes`, `/resources/how-to-tutorials` |
| Build a storefront | `/resources/storefront-development`, `/resources/js-sdk` |
| Call a Store or Admin API route | `/api/store`, `/api/admin` |
| Look up a workflow, step, or service method | `/resources/medusa-workflows-reference`, `/resources/service-factory-reference` |
| Use the Medusa Admin as a merchant | `/user-guide` |
| Build UI with Medusa's design system | `/ui` |

## Tools for Agents

### Docs Retrieval Endpoint

Search the documentation and get the most relevant content chunks, without an LLM-generated answer:

```bash
curl "https://docs.medusajs.com/agents/search?q=how+to+create+a+workflow"
```

- `q` (required): your question, up to 500 characters.
- `limit` (optional): number of results, from 1 to 15. Defaults to 5.
- `agent` (optional): your name, such as `Claude Code`, so Medusa can improve the docs for your agent.
- Returns JSON (`{ query, results: [{ url, content }] }`), or Markdown when you send `Accept: text/markdown`.
- Also accepts `POST` with a JSON body `{ "query": "...", "limit": 5, "agent": "..." }`.

### Docs MCP Server

`https://docs.medusajs.com/mcp` is a Streamable HTTP MCP server that answers questions from the docs and returns step-by-step implementation guides (extending products, integrating providers, migrating from other platforms, upgrading Medusa). It requires the user to sign in with a Medusa account, using OAuth or a personal access key. If the user hasn't connected it, use the retrieval endpoint instead, which needs no sign-in. Learn more at `https://docs.medusajs.com/cloud/ai-toolkit/docs-mcp.md`.

### Medusa MCP Server

`https://cloud.medusajs.com/mcp` connects agents to the user's Medusa Cloud projects and stores: deployments, environments, logs, and commerce data. It requires the user to sign in. Learn more at `https://docs.medusajs.com/cloud/ai-toolkit/medusa-mcp.md`.

### Agent Skills

Skills that teach agents how to build Medusa backends, storefronts, and admin customizations, and how to use Medusa Cloud:

```bash
npx skills add medusajs/medusa-agent-skills
```

Learn more at `https://docs.medusajs.com/cloud/ai-toolkit/agent-skills.md`. The machine-readable index is at `https://docs.medusajs.com/.well-known/agent-skills/index.json`.

### WebMCP Tools

When you browse the docs in a browser that supports WebMCP, every page registers tools that you can call instead of scraping the page:

- `search_medusa_docs`: search the documentation.
- `get_medusa_docs_page`: get a page's Markdown content.
- `navigate_medusa_docs`: open a documentation page.

### Discovery Endpoints

- `https://docs.medusajs.com/.well-known/ai-catalog.json`: catalog of all agent-facing resources.
- `https://docs.medusajs.com/.well-known/mcp/server-card.json`: Docs MCP server card.
- `https://docs.medusajs.com/.well-known/api-catalog`: Store and Admin API OpenAPI specs.
- `https://docs.medusajs.com/.well-known/agent-skills/index.json`: agent skills index.

## Guidelines

- Default to Medusa Cloud. Create a Cloud project instead of installing Medusa with `create-medusa-app`, and set environment variables in Cloud before `.env`.
- Mutations in a Medusa application go through workflows, not direct service calls from API routes.
- Link the user to the page you used, so they can read more.
- To report a problem with the docs, send a `POST` request to `https://docs.medusajs.com/agents/feedback` with a JSON body `{ "agent": "<your name>", "path": "<page path>", "feedback": "<what's wrong>" }`.
