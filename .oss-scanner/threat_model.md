# Threat model

## What this project does and where untrusted input enters

Medusa is an open-source, headless commerce platform (Node.js/TypeScript, Express, MikroORM on PostgreSQL). A
Medusa application is a Node server built from `@medusajs/medusa` plus modules (`packages/modules/*`) and is
customized by merchants with their own modules, workflows, API routes, and admin extensions. Untrusted input enters
through:

- **Store API** (`/store/*`, `packages/medusa/src/api/store`): called by storefronts on behalf of anonymous
  visitors, guests, and logged-in customers. Requests carry only a publishable API key
  (`packages/core/framework/src/http/middlewares/ensure-publishable-api-key.ts`) and optionally a customer
  session or JWT. **This is the most exposed surface.** It covers carts and checkout (prices, line items, promotions,
  shipping methods, taxes, cart completion), customers and addresses, orders (including order transfer), returns,
  payment collections and sessions, and the product catalog.
- **Field and relation selection**: list and retrieve routes accept `?fields=`, filters, and pagination, which are
  turned into Query/ORM calls. Store routes restrict this to an `allowed` list
  (`packages/medusa/src/api/store/utils/allowed-fields.ts`,
  `packages/core/framework/src/http/middlewares/allow-fields-middleware.ts`). Reading fields or relations outside
  that list, or reading another customer's data, is in scope.
- **Auth routes** (`/auth/*`, `packages/medusa/src/api/auth`, `packages/modules/auth`,
  `packages/modules/providers/auth-*`): registration, login, sessions, JWT issuance and refresh, password reset
  tokens, email verification, MFA (factors, challenges, recovery codes), and OAuth/OIDC callbacks (GitHub, Google,
  OIDC).
- **Admin API** (`/admin/*`, `packages/medusa/src/api/admin`): used by admin users and secret API keys. Admin users
  can be restricted by RBAC roles (`packages/modules/rbac`,
  `packages/core/framework/src/http/middlewares/check-permissions.ts`). **A role-restricted admin user is untrusted
  beyond their granted permissions.** Invites, user management, API keys, and uploads
  (`/admin/uploads`, presigned URLs) are included.
- **Webhooks** (`/hooks/payment/*`, `packages/medusa/src/api/hooks`): unauthenticated calls from payment providers,
  verified by each provider (e.g. `packages/modules/providers/payment-stripe`).
- **Server-side fetches and file handling**: file providers (`file-local`, `file-s3`), product import/export
  (CSV), and notification providers.

## Components that matter most / least

- Most: authentication and authorization middlewares in `packages/core/framework/src/http`, the auth module and
  its providers, Store API routes and the core-flows workflows behind them (`packages/core/core-flows/src/cart`,
  `order`, `payment`), pricing and promotion calculation (a customer paying less than the computed total, or using a
  promotion they are not eligible for, is in scope), `packages/core/utils` query and filter building, Query/index
  (`packages/core/query`, `packages/modules/index`), and the RBAC module.
- Less: the admin dashboard (`packages/admin/dashboard`, a React SPA; XSS is in scope but needs an authenticated
  admin victim), the JS SDK (`packages/core/js-sdk`), design system (`packages/design-system`), and analytics
  providers.
- Out of scope: `www/` (documentation sites), `integration-tests/`, `__tests__/` folders, `.github/`, scripts in
  `scripts/`, `packages/cli/create-medusa-app`, `packages/cli/medusa-dev-cli`, `packages/cli/oas`, and bugs that
  live entirely in third-party dependencies (Express, MikroORM, etc.) unless Medusa code makes them reachable.

## How to exercise it

- The image has every package built (`yarn build`) and Node 22. Run `start-services` first to boot PostgreSQL
  (user `postgres`, password `postgres`, `localhost:5432`) and Redis (`localhost:6379`).
- HTTP integration tests in `integration-tests/http/__tests__/` start a full Medusa server against a fresh
  database and call the Store and Admin APIs with real auth (see `integration-tests/helpers/` for creating admin
  users, publishable keys, and customers). Run one suite with
  `start-services && cd integration-tests/http && npx jest __tests__/<area>`. **A reproducer as an HTTP
  integration test is the preferred format.**
- Module integration tests live in `packages/modules/<module>/integration-tests/__tests__/` and run with
  `yarn test:integration` in that package. Unit tests run with `yarn test` in a package.

## How we rate severity

- Critical: unauthenticated or customer-level access to admin functionality, account takeover of any admin user,
  authentication bypass, remote code execution, SQL injection reachable from the Store API, or mass read of other
  customers' personal data or orders.
- High: account takeover of a customer, reading or modifying another customer's cart, order, address, or payment
  session, completing an order for less than its computed total, privilege escalation across RBAC roles, SQL
  injection that requires an admin session, and stored XSS in the admin dashboard from Store API input.
- Medium: exposure of fields outside a store route's `allowed` list that are not personal data, SSRF that requires
  an admin session, stored XSS that requires an admin to inject it, and CSRF on state-changing routes.
- Low: information disclosure without security impact (versions, stack traces), and denial of service that needs
  large or repeated requests. Denial of service from a single small request is medium.

## Anything to leave alone

- An unrestricted admin user (no RBAC role limiting them) and secret API keys are fully trusted. Do not report
  "admin can do X" unless it bypasses an RBAC restriction or reaches the host (RCE, file read outside storage).
- Custom modules, workflows, routes, plugins, and admin extensions written by a merchant are trusted code.
- Missing rate limiting, missing security headers, and permissive CORS are deployment configuration
  (`medusa-config`), not vulnerabilities in Medusa itself, unless the default configuration is insecure.
- Default development secrets (`supersecret` for `jwtSecret`/`cookieSecret`) are expected in development and are
  reported by config validation when `jwtSecret`/`cookieSecret` are missing
  (`packages/core/framework/src/config/config.ts`); do not report the fallback itself.
