# Documentation Link Conventions

Use these rules whenever linking to Medusa documentation in a comment, regardless of issue category.

## Base Rule

The URL path starts from the `app/` directory inside each doc project. Remove `page.mdx` or `page.tsx` from the end.

```
www/apps/<project>/app/<path>/page.mdx  →  <prefix>/<path>
```

## Prefix by Project

| Project directory | URL prefix | Example |
| --- | --- | --- |
| `www/apps/book` | *(none)* | `www/apps/book/app/learn/page.mdx` → `/learn` |
| `www/apps/resources` | `/resources` | `www/apps/resources/app/commerce-modules/page.mdx` → `/resources/commerce-modules` |
| `www/apps/cloud` | `/cloud` | `www/apps/cloud/app/user/page.mdx` → `/cloud/user` |
| `www/apps/ui` | `/ui` | `www/apps/ui/app/colors/overview/page.mdx` → `/ui/colors/overview` |
| `www/apps/user-guide` | `/user-guide` | `www/apps/user-guide/app/customers/page.mdx` → `/user-guide/customers` |

- `www/apps/cloud` is the docs' **Get Started** section: besides the Cloud platform, it holds onboarding, local setup (`/cloud/setup-locally`, formerly `/learn/installation`), and the AI Toolkit (`/cloud/ai-toolkit`, formerly `/learn/introduction/build-with-llms-ai`). Link the current paths, not the old ones.
- `www/apps/user-guide` is the **Merchant Guide** (formerly User Guide). Call it the Merchant Guide in comments.

## API Reference

The API reference uses real page paths, not hash anchors. Old hash links (`/api/admin#products`) only redirect on the client, so never write them.

**Linking to an area** — `/api/store` or `/api/admin`.

**Linking to a tag** (group of routes) — append the tag in kebab-case:

```
/api/admin/products
/api/store/carts
```

**Linking to a specific operation** — append the operation's slug, which is its sidebar summary in kebab-case:

```
/api/admin/products/list-products      (GET /admin/products)
/api/admin/products/get-a-product      (GET /admin/products/:id)
/api/store/carts/create-cart           (POST /store/carts)
```

**Linking to an intro section** — append the section, and a heading anchor if needed:

```
/api/admin/authentication
/api/admin/authentication#2-api-token
```

Find the exact paths in `www/apps/api-reference/generated/api-ref-paths.mjs`.

## Full URL

Prepend `https://docs.medusajs.com` to all paths:

```
https://docs.medusajs.com/learn
https://docs.medusajs.com/resources/commerce-modules
https://docs.medusajs.com/api/admin/products/list-products
```
