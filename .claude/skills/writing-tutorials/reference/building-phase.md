# Phase 1: Building the Tutorial Feature

Follow these steps to build the tutorial's feature in the example project before writing any documentation.

## Step 1 — Gather Requirements

Ask the user the following before doing anything else:

1. **Tutorial topic** — What feature or integration is being built? (e.g., "product reviews", "PayPal integration")
2. **Tutorial type** — How-to tutorial or integration guide?
3. **Example project path** — Where is the target Medusa example project? (e.g., `~/projects/my-medusa-app`)
4. **Third-party services** — Are any external services involved? (e.g., PayPal, Segment, Stripe)
5. **Scope** — Should the tutorial include Admin UI customizations? Storefront customizations?

Do NOT proceed until all required information is collected.

## Step 2 — Research & Plan

Before writing any code:

1. Load `medusa-dev:building-with-medusa` — required for all backend work
   - Also load `medusa-dev:building-admin-dashboard-customizations` if admin UI is in scope
   - Also load `medusa-dev:building-storefronts` if storefront is in scope
2. Use `mcp__medusa__ask_medusa_question` for questions about Medusa APIs, modules, and patterns
3. For integrations with third-party services: use `context7` MCP or skills to retrieve their documentation

**Write a plan covering:**
- Data models to create (custom module if needed)
- Workflows and their steps
- API routes (store and/or admin)
- Admin UI widgets/pages (if applicable)
- Storefront components/changes (if applicable)
- Seed data or configuration needed

> **CRITICAL:** Keep it simple. Tutorial code is for learning, not production. Avoid unnecessary abstractions, overly generic utilities, or complex patterns. One clear approach beats multiple flexible ones.

**Present the plan to the user and get explicit approval before writing any code.**

## Step 3 — Build the Feature

Follow the approved plan. Always follow the architecture layer order:

```
Custom Module (data models + CRUD)
  ↓
Workflow (business logic, mutations)
  ↓
API Route (HTTP interface)
  ↓
Admin UI / Storefront
```

**Useful commands:**
- Generate migration: `/medusa-dev:db-generate <module-name>`
- Run migrations: `/medusa-dev:db-migrate`
- Create admin user: `/medusa-dev:new-user <email> <password>`

Load reference files from `medusa-dev:building-with-medusa` for each component as you build it.

## Step 4 — Add Tests

Write tests to validate the implementation:

- **Workflow steps** — Unit tests for each step's main logic
- **API routes** — Integration tests covering success and error cases
- **Custom module service methods** — Unit tests for any non-trivial service logic

Place tests in:
- `integration-tests/` for API/integration tests
- `src/**/__tests__/` for unit tests

Keep tests simple and focused on verifying the feature works as expected. These tests also serve as examples for tutorial readers.

## Step 5 - Validate Implementation

Before finishing up, make sure that:

1. Build passes: `yarn build`
2. Integration and unit tests pass

Fix all issues before wrapping up.

## Step 6 — Wrap Up

1. Tell the user to test the feature manually:
   - Start the Medusa app and test relevant API routes
   - Verify in the Admin UI (if applicable)
   - Verify in the Storefront (if applicable)
2. Ask the user: **"Does everything look good? Let me know when you're ready to write the tutorial documentation."**
3. Once the user confirms, instruct them: **"Reload `/writing-tutorials` and I'll help you write the documentation."**

> **IMPORTANT:** Do not start writing documentation until the user explicitly confirms the build is complete and working.
