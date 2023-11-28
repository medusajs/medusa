---
description: 'Learn about the different configurations available in a Medusa backend. This includes configurations related to the database, CORS, plugins, and more.'
---

# Configure Medusa Backend

This document provides a reference of all accepted Medusa configurations in `medusa-config.js`.

## Prerequisites

This document assumes you already followed along with the [Prepare Environment documentation](./prepare-environment.mdx) and have [installed a Medusa backend](./install.mdx#create-a-medusa-backend).

---

## Medusa Configurations File

The configurations for your Medusa backend are in `medusa-config.js` located in the root of your Medusa project. The configurations include database, modules, and plugin configurations, among other configurations.

`medusa-config.js` exports an object having the following properties:

| Property Name | Description | Required |
| --- | --- | --- |
| [projectConfig](#projectconfig) | An object that holds general configurations related to the Medusa backend, such as database or CORS configurations. | Yes |
| [plugins](#plugins) | An array of plugin configurations that defines what plugins are installed and optionally specifies each of their configurations. | No |
| [modules](#modules) | An object that defines what modules are installed and optionally specifies each of their configurations. | No |
| [featureFlags](#featureflags) | An object that enables or disables features guarded by a feature flag. | No |

For example:

```js title="medusa-config.js"
module.exports = {
  projectConfig,
  plugins,
  modules,
  featureFlags,
}
```

---

## Environment Variables

Many of the configurations mentioned in this guide are recommended to have their values set in environment variables and referenced within `medusa-config.js`.

During development, you can set your environment variables in the `.env` file at the root of your Medusa backend project. In production, setting the environment variables depends on the hosting provider.

---

## projectConfig

This section includes all configurations that belong to the `projectConfig` property in the configuration object exported by `medusa-config.js`. The `projectConfig` property is an object, and each of the configurations in this section is added to this object as key-value pairs.

### admin_cors and store_cors

The Medusa backend’s API Routes are protected by Cross-Origin Resource Sharing (CORS). So, only allowed URLs or URLs matching a specified pattern can send requests to the backend’s API Routes.

`admin_cors` is used to specify the accepted URLs or patterns for admin API Routes, and `store_cors` is used to specify the accepted URLs or patterns for store API Routes.

For both the `admin_cors` and `store_cors`, the value is expected to be a string. This string can be a comma-separated list of accepted origins. Every origin in that list can be of the following types:

1. A URL. For example, `http://localhost:8000`. The URL shouldn’t end with a backslash.
2. A regular expression pattern that can match more than one origin. For example, `.example.com`. The regex pattern that the backend tests for is `^([\/~@;%#'])(.*?)\1([gimsuy]*)$`.

Here are some examples of common use cases:

```bash
# Allow different ports locally starting with 700
ADMIN_CORS=/http:\/\/localhost:700\d+$/

# Allow any origin ending with vercel.app. For example, storefront.vercel.app
STORE_CORS=/vercel\.app$/

# Allow all HTTP requests
ADMIN_CORS=/http:\/\/*/
```

Typically, the value of these configurations would be set in an environment variable and referenced in `medusa-config.js`:

```js title="medusa-config.js"
module.exports = {
  projectConfig: {
    admin_cors: process.env.ADMIN_CORS,
    store_cors: process.env.STORE_CORS,
    // ...
  },
  // ...
}
```

If you’re adding the value directly within `medusa-config.js`, make sure to add an extra escaping `/` for every backslash in the pattern. For example:

```js title="medusa-config.js"
module.exports = {
  projectConfig: {
    admin_cors: "/http:\\/\\/localhost:700\\d+$/",
    store_cors: "/vercel\\.app$/",
    // ...
  },
  // ...
}
```

### cookie_secret

A string that is used to create cookie tokens. Although this configuration option is not required, it’s highly recommended to set it for better security. It’s also recommended to generate a random string.

In a development environment, if this option is not set the default secret is `supersecret` However, in production, if this configuration is not set an error will be thrown and your backend will crash.

Typically, the value of this configuration would be set in an environment variable and referenced in `medusa-config.js`.

```js title="medusa-config.js"
module.exports = {
  projectConfig: {
    cookie_secret: process.env.COOKIE_SECRET,
    // ...
  },
  // ...
}
```

### http_compression

This configuration enables HTTP compression from the application layer. If you have access to the HTTP server, the recommended approach would be to enable it there. However, some platforms don't offer access to the HTTP layer and in those cases, this is a good alternative.

Its value is an object that has the following properties:

- `enabled`: A boolean flag that indicates whether HTTP compression is enabled. It is disabled by default.
- `level`: A `number` value that indicates the level of zlib compression to apply to responses. A higher level will result in better compression but will take longer to complete. A lower level will result in less compression but will be much faster. The default value is 6.
- `memLevel`: A `number` value that specifies how much memory should be allocated to the internal compression state. It's an integer in the range of 1 (minimum level) and 9 (maximum level). The default value is `8`.
- `threshold`: A `number` or a `string` value in bytes that specifies the minimum response body size that compression is applied on. This is the number of bytes or any string accepted by the bytes module. The default value is `1024`.

If you enable HTTP compression and you want to disable it for specific API Routes, you can pass in the request header `"x-no-compression": true`.

```js title="medusa-config.js"
module.exports = {
  projectConfig: {
    http_compression: {
      enabled: true,
      level: 6,
      memLevel: 8,
      threshold: 1024,
    },
    // ...
  },
  // ...
}
```

### jwt_secret

A string that is used to create authentication tokens. Although this configuration option is not required, it’s highly recommended to set it for better security. It’s also recommended to generate a random string.

In a development environment, if this option is not set the default secret is `supersecret` However, in production, if this configuration is not set an error will be thrown and your backend will crash.

Typically, the value of this configuration would be set in an environment variable and referenced in `medusa-config.js`.

```js title="medusa-config.js"
module.exports = {
  projectConfig: {
    jwt_secret: process.env.JWT_SECRET,
    // ...
  },
  // ...
}
```

### database_database

The name of the database to connect to. If provided in `database_url`, then it’s not necessary to include it.

Make sure to create the PostgreSQL database before using it. You can check how to create a database in [PostgreSQL's documentation](https://www.postgresql.org/docs/current/sql-createdatabase.html).

```js title="medusa-config.js"
module.exports = {
  projectConfig: {
    database_database: "medusa-store",
    // ...
  },
  // ...
}
```

### database_extra

An object that includes additional configurations to pass to the database connection. You can pass any configuration. One defined configuration to pass is `ssl` which enables support for TLS/SSL connections.

This is useful for production databases, which can be supported by setting the `rejectUnauthorized` attribute of `ssl` object to `false`. During development, it’s recommended not to pass this option.

```js title="medusa-config.js"
module.exports = {
  projectConfig: {
    database_extra: 
      process.env.NODE_ENV !== "development"
        ? { ssl: { rejectUnauthorized: false } }
        : {},
    // ...
  },
  // ...
}
```

### database_logging

This configuration specifies what messages to log. Its value can be one of the following:

- (default) A boolean value that indicates whether any messages should be logged or not. By default, if no value is provided, the value will be `false`.
- The string value `all` that indicates all types of messages should be logged.
- An array of log-level strings to indicate which type of messages to show in the logs. The strings can be `query`, `schema`, `error`, `warn`, `info`, `log`, or `migration`. Refer to [Typeorm’s documentation](https://typeorm.io/logging#logging-options) for more details on what each of these values means.

```js title="medusa-config.js"
module.exports = {
  projectConfig: {
    database_logging: [
      "query", "error",
    ],
    // ...
  },
  // ...
}
```

### database_schema

A string indicating the database schema to connect to. This is not necessary to provide if you’re using the default schema, which is `public`.

```js title="medusa-config.js"
module.exports = {
  projectConfig: {
    database_schema: "custom",
    // ...
  },
  // ...
}
```

### database_type

A string indicating the type of database to connect to. At the moment, only `postgres` is accepted, which is also the default value.

```js title="medusa-config.js"
module.exports = {
  projectConfig: {
    database_type: "postgres",
    // ...
  },
  // ...
}
```

### database_url

A string indicating the connection URL of the database. Typically, the connection URL would be set in an environment variable, and the variable would be referenced in `medusa-config.js`.

The format of the connection URL for PostgreSQL is:

```bash
postgres://[user][:password]@[host][:port]/[dbname]
```

Where:

- `[user]`: (required) your PostgreSQL username. If not specified, the system's username is used by default. The database user that you use must have create privileges. If you're using the `postgres` superuser, then it should have these privileges by default. Otherwise, make sure to grant your user create privileges. You can learn how to do that in [PostgreSQL's documentation](https://www.postgresql.org/docs/current/ddl-priv.html).
- `[:password]`: an optional password for the user. When provided, make sure to put `:` before the password.
- `[host]`: (required) your PostgreSQL host. When run locally, it should be `localhost`.
- `[:post]`: an optional port that the PostgreSQL server is listening on. By default, it's `5432`. When provided, make sure to put `:` before the port.
- `[dbname]`: (required) the name of the database.

For example, you can set the following database URL in your environment variables:

```bash
DATABASE_URL=postgres://postgres@localhost/medusa-store
```

You can learn more about the connection URL format in [PostgreSQL’s documentation](https://www.postgresql.org/docs/current/libpq-connect.html).

```js title="medusa-config.js"
module.exports = {
  projectConfig: {
    database_url: process.env.DATABASE_URL,
    // ...
  },
  // ...
}
```

### redis_url

This configuration is used to specify the URL to connect to Redis. This is only used for scheduled jobs. If you omit this configuration, scheduled jobs will not work.

:::note

You must first have Redis installed. You can refer to [Redis's installation guide](https://redis.io/docs/getting-started/installation/).

:::

The Redis connection URL has the following format:

```bash
redis[s]://[[username][:password]@][host][:port][/db-number]
```

For a local Redis installation, the connection URL should be `redis://localhost:6379` unless you’ve made any changes to the Redis configuration during installation.

Typically, the value would be added as an environment variable and referenced in `medusa-config.js`.

```js title="medusa-config.js"
module.exports = {
  projectConfig: {
    redis_url: process.env.REDIS_URL,
    // ...
  },
  // ...
}
```

### redis_prefix

The prefix set on all keys stored in Redis. The default value is `sess:`. If this configuration option is provided, it is prepended to `sess:`.

```js title="medusa-config.js"
module.exports = {
  projectConfig: {
    redis_prefix: "medusa:",
    // ...
  },
  // ...
}
```

### redis_options

An object of options to pass ioredis. You can refer to [ioredis’s RedisOptions documentation](https://redis.github.io/ioredis/index.html#RedisOptions) for the list of available options.

```js title="medusa-config.js"
module.exports = {
  projectConfig: {
    redis_options: {
      connectionName: "medusa",
    },
    // ...
  },
  // ...
}
```

### session_options

An object of options to pass to `express-session`. The object can have the following properties:

- `name`: A string indicating the name of the session ID cookie to set in the response (and read from in the request). The default value is `connect.sid`. Refer to [express-session’s documentation](https://www.npmjs.com/package/express-session#name) for more details.
- `resave`: A boolean value that indicates whether the session should be saved back to the session store, even if the session was never modified during the request. The default value is `true`. Refer to [express-session’s documentation](https://www.npmjs.com/package/express-session#resave) for more details.
- `rolling`: A boolean value that indicates whether the session identifier cookie should be force-set on every response. The default value is `false`. Refer to [express-session’s documentation](https://www.npmjs.com/package/express-session#rolling) for more details.
- `saveUninitialized`: A boolean value that indicates whether a session that is "uninitialized" is forced to be saved to the store. The default value is `true`. Refer to [express-session’s documentation](https://www.npmjs.com/package/express-session#saveUninitialized) for more details.
- `secret`: A string that indicates the secret to sign the session ID cookie. By default, the value of [cookie_secret](#cookie_secret) will be used. Refer to [express-session’s documentation](https://www.npmjs.com/package/express-session#secret) for details.
- `ttl`: A number is used when calculating the `Expires` `Set-Cookie` attribute of cookies. By default, it’ll be `10 * 60 * 60 * 1000`. Refer to [express-session’s documentation](https://www.npmjs.com/package/express-session#cookiemaxage) for details.

```js title="medusa-config.js"
module.exports = {
  projectConfig: {
    session_options: {
      name: "custom",
    },
    // ...
  },
  // ...
}
```

---

## plugins

On your Medusa backend, you can use Plugins to add custom features or integrate third-party services. For example, installing a plugin to use Stripe as a payment processor.

Aside from installing the plugin with NPM, you need to pass the plugin you installed into the `plugins` array defined in `medusa-config.js`.

The items in the array can either be:

- A string, which is the name of the plugin to add. You can pass a plugin as a string if it doesn’t require any configurations.
- An object having the following properties:
    - `resolve`: A string indicating the name of the plugin.
    - `options`: An object that includes the plugin’s options. These options vary for each plugin, and you should refer to the plugin’s documentation for details on them.

For example:

```js title="medusa-config.js"
module.exports = {
  plugins: [
    `medusa-my-plugin-1`,
    {
      resolve: `medusa-my-plugin`,
      options: {
        apiKey: `test`, // or use env variables
      },
    },
    // ...
  ],
  // ...
}
```

You can refer to the [Plugins Overview documentation](../../plugins/overview.mdx) for a list of available official plugins.

---

## modules

In Medusa, commerce and core logic are modularized to allow developers to extend or replace certain modules with custom implementations.

Aside from installing the module with NPM, you need to add it to the exported object in `medusa-config.js`.

The keys of the `modules` configuration object refer to the type of module. Its value can be one of the following:

1. A boolean value that indicates whether the module type is enabled.
2. A string value that indicates the name of the module to be used for the module type. This can be used if the module does not require any options.
3. An object having the following properties, but typically you would mainly use the `resolve` and `options` properties only:
    1. `resolve`: a string indicating the name of the module.
    2. `options`: an object indicating the options to pass to the module. These options vary for each module, and you should refer to the module’s documentation for details on them.
    3. `resources`: a string indicating whether the module shares the dependency container with the Medusa core. Its value can either be `shared` or `isolated`. Refer to the [Modules documentation](../modules/create.mdx#module-scope) for more details.
    4. `alias`: a string indicating a unique alias to register the module under. Other modules can’t use the same alias.
    5. `main`: a boolean value indicating whether this module is the main registered module. This is useful when an alias is used.

For example:

```js title="medusa-config.js"
module.exports = {
  modules: {
    eventBus: {
      resolve: "@medusajs/event-bus-local",
    },
    cacheService: {
      resolve: "@medusajs/cache-redis",
      options: { 
        redisUrl: process.env.CACHE_REDIS_URL,
        ttl: 30,
      },
    },
    // ...
  },
  // ...
}
```

Learn more about [Modules and how to create and use them](../modules/overview.mdx).

---

## featureFlags

Some features in the Medusa backend are guarded by a feature flag. This ensures constant shipping of new features while maintaining the engine’s stability.

You can specify whether a feature should or shouldn’t be used in your backend by enabling its feature flag. Feature flags can be enabled through environment variables or through this configuration exported in `medusa-config.js`. If you want to use the environment variables method, learn more about it in the [Feature Flags documentation](../feature-flags/toggle.md#method-one-using-environment-variables).

The `featureFlags` configuration is an object. Its properties are the names of the different feature flags. Each property’s value is a boolean indicating whether the feature flag is enabled.

You can find available feature flags and their key name [here](https://github.com/medusajs/medusa/tree/master/packages/medusa/src/loaders/feature-flags).

For example:

```js title="medusa-config.js"
module.exports = {
  featureFlags: {
    product_categories: true,
    // ...
  },
  // ...
}
```

Learn more about [Feature flags and how to toggle them](../feature-flags/overview.mdx).

:::note

After enabling a feature flag, make sure to [run migrations](../entities/migrations/overview.mdx#migrate-command) as it may require making changes to the database.

:::
