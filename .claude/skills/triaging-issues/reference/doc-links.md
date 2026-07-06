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

## API Reference

The API reference has only two pages: `/api/store` and `/api/admin`.

**Linking to a tag** (group of routes) — append `#<tag-kebab-case>`:

```
/api/admin#products
/api/store#carts
```

**Linking to a specific operation** — format: `#{tag}_{method}{path-without-slashes}`:

```
/api/admin#products_getproducts        (GET /admin/products)
/api/admin#products_getproductsid      (GET /admin/products/:id)
/api/store#carts_postcarts             (POST /store/carts)
```

## Full URL

Prepend `https://docs.medusajs.com` to all paths:

```
https://docs.medusajs.com/learn
https://docs.medusajs.com/resources/commerce-modules
https://docs.medusajs.com/api/admin#products_getproducts
```
