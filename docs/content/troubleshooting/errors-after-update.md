# Errors After Update

If you run into errors after updating Medusa and its dependencies, it's highly recommended to check the [Upgrade Guides](../upgrade-guides/index.mdx) if there is a specific guide for your version. These guides include steps required to perform after upgrading Medusa.

If there's no upgrade guide for your version, make sure that you ran the `migrations` command in the root directory of your Medusa backend:

```bash
medusa migrations run
```

This ensures your backend has the latest database structure required. Then, try running your Medusa backend again and check whether the same error occurs.

---

## See Also

- [Migrations](../development/entities/migrations/overview.mdx)