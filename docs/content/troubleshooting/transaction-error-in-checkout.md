# Error 409 in checkout

To provide the most frictionless onboarding and quick start, we default to SQLite as database. SQLite runs on all PCs, which is why it allows you to get quickly started without installing Postgres. Though, it comes at the expense of important features, that are needed in a production environment. 

Therefore, you might experience the following error when going through a checkout flow in our starters:
```
Error: Transaction already started for the given connection, commit current transaction before starting a new one.
```

This error occurs because SQLite does not allow for multiple write transactions at the same time. To resolve it, you need to use Postgres instead.

First install and start Postgres on your local machine. You can either [download it directly from their website](https://www.postgresql.org/download/) or use Homebrew:
```bash
brew install postgresql
brew services start postgresql
createdb
```

Then in your `medusa-config.js`, you should change the project config to use Postgres as database type:
```jsx
module.exports = {
  projectConfig: {
    redis_url: REDIS_URL,
    // The following two lines will enable Postgres
    database_url: DATABASE_URL,
    database_type: "postgres",
    store_cors: STORE_CORS,
    admin_cors: ADMIN_CORS,
  },
  plugins,
};
```
> When changing from SQLite to Postgres, you should seed the database again using: `yarn seed`

