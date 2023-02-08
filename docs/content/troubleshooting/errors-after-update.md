# Errors After Update

If you run into errors after updating Medusa and its dependencies, it's highly recommended to check the [Upgrade Guides](../advanced/backend/upgrade-guides/index.mdx) if there is a specific guide for your version. These guides include steps required to perform after upgrading Medusa.

If there's no upgrade guide for your version, make sure that you ran the `migrations` command in the root directory of your Medusa server:

```bash
medusa migrations run
```

This ensures your server has the latest database structure required. Then, try running your Medusa server again and check whether the same error occurs.

---

## See Also

- [Migrations](../advanced/backend/migrations/index.md)