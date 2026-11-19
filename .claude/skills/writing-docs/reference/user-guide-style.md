# Merchant Guide Style Guide

The Merchant Guide (formerly User Guide) lives in the `user-guide` project (`www/apps/user-guide/`, served at `/user-guide`). It covers how non-technical admin users perform tasks in the Medusa dashboard (`packages/admin/dashboard`).

## Audience

The Merchant Guide is for store operators and merchants, not developers. Always call it the "Merchant Guide" in prose, never "User Guide". Assume the reader:
- Has no coding knowledge
- Manages the store through the Medusa admin UI
- Needs step-by-step UI instructions

## Page Structure

```mdx
---
sidebar_label: "Manage Products"
tags:
  - user guide
  - product
products:
  - product
---

export const metadata = {
  title: `Manage Products in Medusa Admin`,
}

# {metadata.title}

In this guide, you'll learn how to manage products in the Medusa admin.

## Overview

[What this section covers — 1-2 sentences]

---

## Create a Product

To create a new product:

1. Go to the **Products** section from the sidebar.
2. Click the **Create** button in the top-right corner.
3. Fill in the product details.
4. Click **Save**.

---

## Edit a Product

...
```

## Frontmatter

Always include:
- `sidebar_label` — short label shown in navigation
- `tags` — always include `user guide` (the tag keeps its old name) and the domain tag (e.g. `product`)
- `products` — list of product domains covered (e.g. `product`, `order`, `customer`)

## Writing Style

- **Task-based titles**: "Manage Orders", not "Orders"
- **Imperative instructions**: "Click Save", "Enter the product name", "Select a region"
- **Present tense**: "The order appears in the list", not "The order will appear"
- **Bold UI elements**: `**Products**`, `**Save**`, `**Create**`
- **No code**: This project never contains TypeScript or JavaScript code examples
- **No developer concepts**: Don't mention modules, workflows, APIs, or container resolution
- **Deployed admin**: The reader uses the admin of a Medusa application deployed on Cloud. Don't write `localhost:9000/app` in steps. If you must mention local development, put it in a `Running Medusa locally?` note

## Screenshots

Screenshots are Cloudinary-hosted images. DO NOT add images. Images can be added manually later if needed.

## Navigation

The sidebar is in `www/apps/user-guide/sidebar.mjs`. When adding a new page:

```javascript
{
  type: "link",
  path: "/<section>/<topic>",
  title: "Page Title",
}
```

Some sections use `autogenerate_path` — check if your target section uses that pattern before manually adding entries.

## When to update the Merchant Guide

- A new page or screen is added to the Medusa admin dashboard
- An existing admin workflow changes (new steps, different UI flow)
- A new feature becomes available to users in the admin (e.g. new order action, new product field)
- A button, form, or flow is renamed or reorganized

## What NOT to put in the Merchant Guide

- Developer instructions (code, API calls, CLI commands)
- Architecture explanations
- Module configuration
- Anything not visible in the Medusa admin UI