# Experimental Features

This section of the documentation includes features that are currently experimental.

As Medusa moves towards modularization, commerce concepts such as Products or Pricing will be moved to isolated commerce modules shipped as NPM packages. This significantly changes Medusa's architecture, making it more flexible for custom digital commerce applications.

## Enabling Experimental Features

:::danger[Production Warning]

All features guarded by the `medusa_v2` flag are not ready for production and will cause unexpected issues in your production server.

:::

Experimental Features are guarded in the Medusa backend by a feature flag.

To use them, [enable the `medusa_v2` feature flag](../development/feature-flags/toggle.md) in your backend.

Then, run migrations in your backend with the following command:

```bash
npx medusa migrations run
```
