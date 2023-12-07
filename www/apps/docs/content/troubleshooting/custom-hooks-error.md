---
title: createCustomAdminHooks Error
---

If you've installed Medusa prior to v1.13.2 with the `create-medusa-app` command, then you try to update the `@medusajs/medusa` and `@medusajs/admin` to the latest `beta` versions, you might run into the following error when running your Medusa backend:

```bash
Module '"medusa-react"' has no exported member 'createCustomAdminHooks'.
```

This is because a previous version of `medusa-react` allowed creating custom hooks using `createCustomAdminHooks`. This has now changed to use different utility hooks, which you can learn about [the Medusa React documentation](../medusa-react/overview.mdx#custom-hooks).

To resolve this issue, you have the following options:

1. If you haven't used `createCustomAdminHooks` in your code, then you can delete the content of the `src/admin` directory which holds the widgets that create your onboarding flow, then try running your Medusa backend.
2. If you've used the `createCustomAdminHooks` in your code, refer to the [Medusa React](../medusa-react/overview.mdx#custom-hooks) to learn about the new utility hooks and how you can use them.

