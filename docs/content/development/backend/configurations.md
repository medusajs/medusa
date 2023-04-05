---
description: 'Learn about the different configurations available in a Medusa backend. This includes configurations related to the database, CORS, plugins, and more.'
---

# Configure Medusa Backend

In this document, you’ll learn what configurations you can add to your Medusa backend and how to add them.

## Prerequisites

This document assumes you already followed along with the [Prepare Environment documentation](./prepare-environment.mdx) and have [installed a Medusa backend](./install.mdx#create-a-medusa-backend).

---

## Medusa Configurations File

The configurations for your Medusa backend are in `medusa-config.js`. This includes database, modules, and plugin configurations, among other configurations.

Some of the configurations mentioned in this document are already defined in `medusa-config.js` with default values. It’s important that you know what these configurations are used for and how to set them.

---

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
    // ...other configurations
    database_type: "sqlite",
    database_database: "./medusa-db.sql",
  },
}
```

Where `database_type` is `sqlite` and `database_database` is the location you want the SQLite database to be created in.

### PostgreSQL Configurations

:::note

Before getting started with configuring PostgreSQL, you should have created a PostgreSQL database. You can check how to create a database in [PostgreSQL's documentation](https://www.postgresql.org/docs/current/sql-createdatabase.html).

:::

For PostgreSQL you mainly need two configurations:

```jsx
module.exports = {
  projectConfig: {
    // ...other configurations
    database_type: "postgres",
    database_url: DATABASE_URL,
  },
}
```

Where `database_type` is `postgres` and `DATABASE_URL` is the URL connection string to your PostgreSQL database. You can check out how to format it in [PostgreSQL’s documentation](https://www.postgresql.org/docs/current/libpq-connect.html).

It's recommended to set the Database URL as an environment variable:

```bash
DATABASE_URL=<YOUR_DATABASE_URL>
```

Where `<YOUR_DATABASE_URL>` is the URL of your PostgreSQL database.

### Changing PostgreSQL Schema

By default, the `public` schema is used in PostgreSQL. You can change it to use a custom schema by passing the `search_path` option in the database URL. For example:

```bash
postgres://localhost/store?options=-c search_path=test
```

Where `test` is the name of the database schema that should be used instead of `public`.

### Changing Database Type

Remember to run migrations after you change your database type to `postgres` from another type:

```bash
medusa migrations run
```

### Common Configuration

As Medusa internally uses [Typeorm](https://typeorm.io/) to connect to the database, the following configurations are also available:

1. `database_logging`: enable or disable logging.
2. `database_extra`: extra options that you can pass to the underlying database driver.

These configurations are not required and can be omitted.

```jsx
module.exports = {
  projectConfig: {
    // ...other configurations
    database_logging: true,
    database_extra: {},
  },
}
```

---

## Redis

:::note

As of v1.8 of the Medusa core package, Redis is only used for scheduled jobs. For events handling, it's now moved into a module and can be configured as explained [here](#modules).

:::

You must first have Redis installed. You can refer to [Redis's installation guide](https://redis.io/docs/getting-started/installation/). You need to set Redis URL in the configurations:

```js
module.exports = {
  projectConfig: {
    // ...other configurations
    redis_url: REDIS_URL,
  },
}
```

Where `REDIS_URL` is the URL used to connect to Redis. The format of the connection string is `redis[s]://[[username][:password]@][host][:port][/db-number]`.

If you omit this configuration, scheduled jobs will not work.

:::tip

By default, the Redis connection string should be `redis://localhost:6379` unless you made any changes to the default configurations during the installation.

:::

It is recommended to set the Redis URL as an environment variable:

```bash
REDIS_URL=<YOUR_REDIS_URL>
```

Where `<YOUR_REDIS_URL>` is the URL of your Redis backend.

---

## JWT Secret

Medusa uses JSON Web Token (JWT) to handle user authentication. To set the JWT secret:

```jsx
module.exports = {
  projectConfig: {
    // ...other configurations
    jwt_secret: "very secure string",
  },
}
```

Where `jwt_secret` is the secret used to create the tokens. The more secure it is the better.

It is recommended to set the JWT Secret as an environment variable:

```bash
JWT_SECRET=<YOUR_JWT_SECRET>
```

Where `<YOUR_JWT_SECRET>` is the JWT secret you want to use.

:::caution

In a development environment, if this option is not set the default secret is “supersecret”. However, in production, if this option is not set an error will be thrown and your backend will crash.

:::

---

## Cookie Secret

This configuration is used to sign the session ID cookie. To set the cookie secret:

```js
module.exports = {
  projectConfig: {
    // ...other configurations
    cookie_secret: "very secure string",
  },
}
```

Where `cookie_secret` is the secret used to create the tokens. The more secure it is the better.

It is recommended to set the Cookie secret as an environment variable:

```bash
COOKIE_SECRET=<YOUR_COOKIE_SECRET>
```

Where `<YOUR_COOKIE_SECRET>` is the Cookie secret you want to use.

:::caution

In a development environment, if this option is not set the default secret is “supersecret”. However, in production, if this option is not set an error will be thrown and your backend will crash.

:::

---

## CORS Configurations

Medusa uses Cross-Origin Resource Sharing (CORS) to only allow specific origins to access the backend.

The Admin and the Storefront have different CORS configurations that must be configured.

### Accepted Patterns

For both of the Admin and the Storefront CORS configurations, the value is expected to be a string. This string can be a comma-separated list of accepted origins. Every origin in that list can be of the following types:

1. The accepted origin as is. For example, `http://localhost:8000`.
2. A regular expression pattern that can match more than one origin. For example, `*.example.com`. The regex pattern that the backend tests for is `^([\/~@;%#'])(.*?)\1([gimsuy]*)$`.

Here are some examples of common use cases:

```bash
# Allow different ports locally starting with 700
ADMIN_CORS=/http:\/\/localhost:700\d+$/

# Allow any origin ending with vercel.app. For example, storefront.vercel.app
STORE_CORS=/vercel\.app$/

# Allow all HTTP requests
ADMIN_CORS=/http:\/\/*/
```

Although this is not recommended, but when setting these values directly in `medusa-config.json`, make sure to add an extra escaping `backslash` for every backslash in the pattern. For example:

```js
const ADMIN_CORS = process.env.ADMIN_CORS || 
  "/http:\\/\\/localhost:700\\d+$/"
```

:::tip

The examples above apply to both Admin and Store CORS.

:::

### Admin CORS

To make sure your Admin dashboard can access the Medusa backend’s admin endpoints, set this configuration:

```js
module.exports = {
  projectConfig: {
    // ...other configurations
    admin_cors: ADMIN_CORS,
  },
}
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

### Storefront CORS

To make sure your Storefront dashboard can access the Medusa backend, set this configuration:

```js
module.exports = {
  projectConfig: {
    // ...other configurations
    store_cors: STORE_CORS,
  },
}
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

---

## Plugins

On your Medusa backend, you can use Plugins to add custom features or integrate third-party services. For example, installing a plugin to use Stripe as a payment processor.

:::info

You can learn more about plugins in the [Plugins Overview documentation](../plugins/overview.mdx).

:::

Aside from installing the plugin with NPM, you need to pass the plugin you installed into the `plugins` array defined in `medusa-config.js`. This array is then exported along with other configurations you’ve added:

```jsx
module.exports = {
  projectConfig: {
    // previous configurations mentioned...
  },
  plugins,
}
```

### Add a Plugin Without Configuration

To add a plugin that doesn’t need any configurations, you can simply add its name to the `plugins` array:

```jsx
const plugins = [
  // other plugins...
  `medusa-my-plugin`,
]
```

### Add a Plugin With Configuration

To add a plugin with configurations, you need to add an object to the `plugins` array with the plugin’s name and configurations:

```jsx
const plugins = [
  // other plugins...
  {
    resolve: `medusa-my-plugin`,
    options: {
      apiKey: `test`,
    },
  },
]
```

:::tip

It is recommended to use environment variables to store values of options instead of hardcoding them in `medusa-config.js`.

:::

---

## Modules

In Medusa, commerce and core logic are modularized to allow developers to extend or replace certain modules with custom implementations.

:::tip

You can learn more about Modules in the [Modules Overview documentation](../modules/overview.mdx).

:::

Aside from installing the module with NPM, you need to add into the exported object in `medusa-config.js`. For example:

```js
module.exports = {
  // ...
  modules: { 
    // ...
    moduleType: {
      resolve: "<module_name>", 
      options: {
        // options if necessary
      },
    },
  },
}
```

`moduleType` and `<module_name>` are just placeholder that should be replaced based on the type of Module you're adding. For example, if you used the default Medusa starter to create your backend, you should have an `eventBus` module installed:

```js
module.exports = {
  // ...
  modules: {
    // ...
    eventBus: {
      resolve: "@medusajs/event-bus-local",
    },
  },
}
```

Each module can have its own options. You must refer to the module's documentation to learn about its options.

### Recommended Event Bus Modules

In the default Medusa starter, the local event bus module is used. This module is good for testing out Medusa and during development, but it's highly recommended to use the [Redis event module](../events/modules/redis.md) instead for better development experience and during production.

### Recommended Cache Modules

In the default Medusa starter, the in-memory cache module is used. This module is good for testing out Medusa and during development, but it's highly recommended to use the [Redis cache module](../cache/modules/redis.md) instead for better development experience and during production.

---

## See Also

- [Medusa architecture overview](../fundamentals/architecture-overview.md)
- [Plugins](../plugins/overview.mdx)
- [Modules](../modules/overview.mdx)
