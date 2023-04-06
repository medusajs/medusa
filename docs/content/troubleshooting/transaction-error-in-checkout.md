# Error 409 in checkout

To provide the most frictionless onboarding and quickstart, Medusa uses SQLite as the backend's database by default. SQLite runs on all machines and operating systems. So, it allows you to get quickly started without installing PostgreSQL.

However, this comes at the expense of important features that are needed in a production environment.

Therefore, you might experience the following error when going through a checkout flow in one of Medusa's starters while using SQLite:

```bash noReport
Error: Transaction already started for the given connection, commit current transaction before starting a new one.
```

This error occurs because SQLite does not allow for multiple write transactions at the same time. To resolve it, you need to use PostgreSQL instead.

You can learn how to install PostgreSQL on your machine in the [Set Up your Development Environment documentation](../development/backend/prepare-environment.mdx#postgresql).

Then in your `medusa-config.js`, you should change the project configuration to use Postgres as the database type:

```jsx title=medusa-config.js
module.exports = {
  projectConfig: {
    // ...
    database_url: DATABASE_URL,
    database_type: "postgres",
  },
  plugins,
}
```

Where `DATABASE_URL` is the connection string to your PostgreSQL database. You can check out how to format it in [PostgreSQL’s documentation](https://www.postgresql.org/docs/current/libpq-connect.html).

Make sure to also remove the following lines that are used to configure an SQLite database:

<!-- eslint-skip -->

```jsx title=medusa-config.js
database_type: "sqlite",
database_database: "./medusa-db.sql",
```

Then, migrate the database schema to the new PostgreSQL database:

```bash
medusa migrations run
```

:::tip

If you want to add demo data into your backend, you should also seed the database using the following command:

```bash npm2yarn
npm run seed
```

:::

---

## See Also

- [Set up your development environment](../development/backend/prepare-environment.mdx)
- [Configure the Medusa backend](../development/backend/configurations.md)
- [Medusa CLI tool reference](../cli/reference.md)
