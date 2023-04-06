# Redis not emitting events

:::note

This troubleshooting guide only applies to Medusa backends using versions before v1.8 of the core Medusa package.

:::

When you create a new Medusa backend, Redis is disabled by default. Instead, a fake Redis backend is used that allows you to start your project but does not actually emit any events.

To enable a real Redis backend, you need to install Redis on your machine and configure it with Medusa.

You can learn how to [install Redis in the Set Up your Development Environment documentation](../development/backend/prepare-environment.mdx#redis).

After installing it, make sure to configure your Medusa backend to use Redis:

```jsx title=medusa-config.js
module.exports = {
  projectConfig: {
    // ...
    redis_url: REDIS_URL,
  },
}
```

By default, Medusa connects to Redis over the URL `redis://localhost:6379`. If you need to change that URL, set the following environment variable:

```bash
REDIS_URL=<YOUR_REDIS_URL>
```

---

## See Also

- [Set up your development environment](../development/backend/prepare-environment.mdx)
- [Configure the Medusa backend](../development/backend/configurations.md)
