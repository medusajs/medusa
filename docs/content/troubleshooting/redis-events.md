# Redis not emitting events

When you create a new Medusa server, Redis is disabled by default. Instead, a fake Redis server is used that allows you to start your project but does not actually emit any events.

To enable a real Redis server, you need to install Redis on your machine and configure it with Medusa.

You can learn how to [install Redis in the Set Up your Development Environment documentation](../tutorial/0-set-up-your-development-environment.mdx#redis).

After installing it, make sure to configure your Medusa server to use Redis:

```jsx title=medusa-config.js
module.exports = {
  projectConfig: {
    //...
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

- [Set up your development environment](../tutorial/0-set-up-your-development-environment.mdx)
- [Configure your server](../usage/configurations.md)
