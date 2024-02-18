# Experimental Features

This section of the documentation includes features that are currently experimental.

As Medusa moves towards modularization, commerce concepts such as Products or Pricing will be moved to isolated commerce modules shipped as NPM packages. This significantly changes Medusa's architecture, making it more flexible for custom digital commerce applications.

## Enabling Experimental Features

:::danger[Production Warning]

All features guarded by the `medusa_v2` flag are not ready for production and will cause unexpected issues in your production server. Additionally, the core Store and Admin API routes are not registered if the flag is enabled – only routes in the `dist/api-v2/*` directory of the `@medusajs/medusa` package.

:::

To enable the experimental features:

1. [Enable the `medusa_v2` feature flag](../development/feature-flags/toggle.md) in your backend.
2. Install the [Product](./product/install-medusa.mdx) and [Pricing](./pricing/install-medusa.mdx) modules and add them to the Medusa configurations.
3. Finally, run migrations in your backend with the following command:

```bash
npx medusa migrations run
```
