# Configure your Server

In this document, you’ll learn what configurations you can add to your Medusa server and how to add them.

## Prerequisites

This document assumes you already followed along with the [“Set up your development environment” documentation](../tutorial/0-set-up-your-development-environment.mdx) and have [installed a Medusa server](../quickstart/quick-start.md#create-a-medusa-server).

## Medusa Configurations File

The configurations for your Medusa server are in `medusa-config.js`. This includes database, Redis, and plugin configurations, among other configurations.

Some of the configurations mentioned in this document are already defined in `medusa-config.js` with default values. It’s important that you know what these configurations are used for and how to set them.

## Environment Variables

In your configurations, you’ll often use environment variables. For example, when using API keys or setting your database URL.

By default, Medusa loads environment variables from the system’s environment variables. Any different method you prefer to use or other location you’d prefer to load environment variables from you need to manually implement.

:::info

This change in how environment variables are loaded was introduced in version 1.3.0. You can learn more in the [upgrade guide for version 1.3.0](../advanced/backend/upgrade-guides/1-3-0.md).

:::

## Database Configuration

Medusa supports two database types: SQLite and PostgreSQL.

:::tip

You can use SQLite for development purposes, however, it’s recommended to use PostgreSQL.

:::

### SQLite Configurations

For SQLite you mainly need two configurations:

```jsx
module.exports = {
  projectConfig: {
    //...other configurations
    database_type: "sqlite",
    database_database: "./medusa-db.sql",
  },
};
```

Where `database_type` is `sqlite` and `database_database` is the location you want the SQLite database to be created in.

### PostgreSQL Configurations

:::note

Before getting started with configuring PostgreSQL, you should have created a PostgreSQL `database`. You can check how to create a database in [PostgreSQL's documentation](https://www.postgresql.org/docs/current/sql-createdatabase.html).

:::

For PostgreSQL you mainly need two configurations:

```jsx
module.exports = {
  projectConfig: {
    //...other configurations
    database_type: "postgres",
    database_url: DATABASE_URL,
  },
};
```

Where `database_type` is `postgres` and `DATABASE_URL` is the URL connection string to your PostgreSQL database. You can check out how to format it in [PostgreSQL’s documentation](https://www.postgresql.org/docs/current/libpq-connect.html).

It is recommended to set the Database URL as an environment variable:

```bash
DATABASE_URL=<YOUR_DATABASE_URL>
```

Where `<YOUR_DATABASE_URL>` is the URL of your PostgreSQL database.

### Common Configuration

As Medusa internally uses [Typeorm](https://typeorm.io/) to connect to the database, the following configurations are also available:

1. `database_logging`: enable or disable logging.
2. `database_extra`: extra options that you can pass to the underlying database driver.

These configurations are not required and can be omitted.

```jsx
module.exports = {
  projectConfig: {
    //...other configurations
    database_logging: true,
    database_extra: {}
  },
};
```

## Redis

Medusa uses Redis to handle the event queue, among other usages. You need to set Redis URL in the configurations:

```jsx
module.exports = {
  projectConfig: {
    //...other configurations
    redis_url: REDIS_URL
  },
};
```

Where `REDIS_URL` is the URL used to connect to Redis. The format of the connection string is `redis[s]://[[username][:password]@][host][:port][/db-number]`.

If you omit this configuration, events will not be emitted and subscribers will not work.

:::tip

By default, the Redis connection string should be `redis://localhost:6379` unless you made any changes to the default configurations during the installation.

:::

It is recommended to set the Redis URL as an environment variable:

```bash
REDIS_URL=<YOUR_REDIS_URL>
```

Where `<YOUR_REDIS_URL>` is the URL of your Redis server.

:::info

You can learn more about Subscribers and events in the [Subscriber documentation](../advanced/backend/subscribers/create-subscriber.md).

:::

## JWT Secret

Medusa uses JSON Web Token (JWT) to handle user authentication. To set the JWT secret:

```jsx
module.exports = {
  projectConfig: {
    //...other configurations
    jwt_secret: "very secure string",
  },
};
```

Where `jwt_secret` is the secret used to create the tokens. The more secure it is the better.

It is recommended to set the JWT Secret as an environment variable:

```bash
JWT_SECRET=<YOUR_JWT_SECRET>
```

Where `<YOUR_JWT_SECRET>` is the JWT secret you want to use.

:::caution

In a development environment, if this option is not set the default secret is “supersecret”. However, in production, if this option is not set an error will be thrown and your server will crash.

:::

## Cookie Secret

This configuration is used to sign the session ID cookie. To set the cookie secret:

```jsx
module.exports = {
  projectConfig: {
    //...other configurations
    cookie_secret: "very secure string",
  },
};
```

Where `cookie_secret` is the secret used to create the tokens. The more secure it is the better.

It is recommended to set the Cookie secret as an environment variable:

```bash
COOKIE_SECRET=<YOUR_COOKIE_SECRET>
```

Where `<YOUR_COOKIE_SECRET>` is the Cookie secret you want to use.

:::caution

In a development environment, if this option is not set the default secret is “supersecret”. However, in production, if this option is not set an error will be thrown and your server will crash.

:::

## Admin CORS

Medusa uses Cross-Origin Resource Sharing (CORS) to only allow specific origins to access the server. To make sure your Admin dashboard can access the Medusa server’s admin endpoints, set this configuration:

```jsx
module.exports = {
  projectConfig: {
    //...other configurations
    admin_cors: ADMIN_CORS,
  },
};
```

Where `ADMIN_CORS` is the URL of your admin dashboard. By default, it’s `http://localhost:7000,http://localhost:7001`.

It is recommended to set the Admin CORS as an environment variable:

```bash
ADMIN_CORS=<YOUR_ADMIN_CORS>
```

Where `<YOUR_ADMIN_CORS>` is the URL of your admin dashboard.

:::tip

Make sure that the URL is without a backslash at the end. For example, you should use `http://localhost:7000` instead of `http://localhost:7000/`.

:::

## Storefront CORS

Medusa uses CORS to only allow specific origins to access the server. To make sure your Storefront dashboard can access the Medusa server, set this configuration:

```jsx
module.exports = {
  projectConfig: {
    //...other configurations
    store_cors: STORE_CORS,
  },
};
```

Where `STORE_CORS` is the URL of your storefront. By default, it’s `http://localhost:8000`.

It is recommended to set the Storefront CORS as an environment variable:

```bash
STORE_CORS=<YOUR_STORE_CORS>
```

Where `<YOUR_STORE_CORS>` is the URL of your storefront.

:::tip

Make sure that the URL is without a backslash at the end. For example, you should use `http://localhost:8000` instead of `http://localhost:8000/`.

:::

## Plugins

On your Medusa server, you can use Plugins to add custom features or integrate third-party services. For example, installing a plugin to use Stripe as a payment provider.

:::info

You can learn more about plugins in the [Plugins Overview documentation](../advanced/backend/plugins/overview.md).

:::

Aside from installing the plugin with NPM, you need to pass the plugin you installed into the `plugins` array defined in `medusa-config.js`. This array is then exported along with other configurations you’ve added:

```jsx
module.exports = {
  projectConfig: {
    //previous configurations mentioned...
  },
  plugins,
};
```

### Add a Plugin Without Configuration

To add a plugin that doesn’t need any configurations, you can simply add its name to the `plugins` array:

```jsx
const plugins = [
  //other plugins...
  `medusa-my-plugin`,
];
```

### Add a Plugin With Configuration

To add a plugin with configurations, you need to add an object to the `plugins` array with the plugin’s name and configurations:

```jsx
const plugins = [
  //other plugins...
  {
    resolve: `medusa-my-plugin`,
    options: {
      apiKey: `test`
    }
  }
];
```

:::tip

It is recommended to use environment variables to store values of options instead of hardcoding them in `medusa-config.js`.

:::

## What’s Next

- Check out the [Next.js](../starters/nextjs-medusa-starter.md) and [Gatsby](../starters/gatsby-medusa-starter.md) starter storefronts.
- Install the [Medusa admin](../admin/quickstart.md).
- Learn about [deploying the Medusa server](../deployments/server/index.mdx).
