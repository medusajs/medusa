---
description: 'Actions Required for Vite Update'
sidebar_label: '(Repository) Vite'
slug: /upgrade-guides/admin/admin-vite
sidebar_custom_props:
  iconName: 'computer-desktop-solid'
---

# Updating Medusa Admin from Gatsby to Vite

Medusa Admin has been updated to Vite. Learn about breaking changes since the update.

:::warning

This guide applies if you're using an old version of the admin repository and you're adding the latest changes of the repository. However, this repository is now deprecated and it's highly recommended to switch to using an admin plugin instead. You can learn more in [the upgrade guide](./1-0-0.md)

:::

## Overview

Medusa Admin previously was built using Gatsby. As of a recent update, the Admin is now migrated to Vite 3.

This introduced breaking changes related to environment variables used and the published directory. Read below for actions required following this update.

---

## Required Node.js Version

<!-- vale docs.Numbers = NO -->

Following the change to Vite 3, the required Node.js version for the Admin has changed. [Vite 3](https://vitejs.dev/guide/#scaffolding-your-first-vite-project) requires versions 14.8+ or 16+ of Node.js.

<!-- vale docs.Numbers = YES -->

---

## Changed Environment Variables

Previously, the Medusa Admin used the environment variables `GATSBY_MEDUSA_BACKEND_URL` or `GATSBY_STORE_URL` to store the Medusa backend’s URL.

After the update to Vite, the environment variable name changed to `MEDUSA_BACKEND_URL`.

The Medusa Admin remains backward compatible, which means you can still use the same environment variables. However, it is advised to make the change to the new variable.

### Actions Required

Change your `GATSBY_MEDUSA_BACKEND_URL` or `GATSBY_STORE_URL` environment variables to be `MEDUSA_BACKEND_URL`:

```bash
MEDUSA_BACKEND_URL=<YOUR_BACKEND_URL>
```

---

## Changed Publish Directory

Previously, the build output of the Medusa Admin was placed in the `dist` directory. After this update, the build output is placed in the `public` directory.

For local usage and development, this shouldn’t have an effect. However, this is a breaking change if you deployed Medusa Admin.

### Actions Required

If you deployed your Medusa Admin, you must change the Publish directory in your hosting.

For Netlify, you can do that by following these steps:

1. On your Medusa Admin dashboard, click on “Site settings”.
2. From the sidebar, choose “Build & deploy”.
3. Find the “Build settings” section and click on the “Edit settings” button.
4. Change the “Publish directory” field to `public`.
5. Click on the Save button.

This should trigger a new deployment of your Medusa Admin. If not, you must redeploy it manually for changes to take effect.
