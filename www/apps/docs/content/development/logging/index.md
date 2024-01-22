# Logging

In this document, you’ll learn about how you can log messages in the Medusa backend and available logging configurations.

## Overview

In the Medusa backend, the `Logger` class is registered in the [dependency container](../fundamentals/dependency-injection.md). This class provides helper methods to log messages in the console while the Medusa backend is running.

You can resolve this class in your resources, such as services or loaders, to show a message in the console. You can also configure how and where logs are shown in your backend using environment variables.

---

## How to Log a Message

To log a message, resolve the `logger` registration name using dependency injection in your resource.

For example, to log a message in a [loader](../loaders/overview.mdx):

```ts title="src/loaders/my-loader.ts"
import { 
  ProductService, 
  ConfigModule, 
  Logger,
  MedusaContainer,
} from "@medusajs/medusa"

export default async (
  container: MedusaContainer,
  config: ConfigModule
): Promise<void> => {
  const logger = container.resolve<Logger>("logger")

  logger.info("Starting loader...")

  const productService = container.resolve<ProductService>(
    "productService"
  )

  logger.info(`Products count: ${
    await productService.count()
  }`)
  
  logger.info("Ending loader")
}
```

In the example above, you resolve the `logger` from the dependency container and then use its `info` method to show an info message in the console.

If you start your backend, you should see the messages in the loader logged in the console.

:::note

Learn how to resolve dependencies within other types of resources in the [dependency container guide](../fundamentals/dependency-injection.md#resolve-resources).

:::

---

## Log Levels

The following `Logger` methods accept a string parameter that should be logged in the console with a specific level:

- `info`: The message is logged with level `info`.
- `warn`: The message is logged with level `warn`.
- `error`: The message is logged with level `error`.
- `debug`: The message is logged with level `debug`.

---

## Show Log with Progress

The `activity` method is used to log a message of level `info`. If the Medusa backend is running in a development environment, a spinner starts that can be used to show progress and succeed or fail the progress.

The `activity` method returns the ID of the started activity. This ID can then be passed to one of the following methods:

- `progress`: Log a message of level `info` that indicates progress within that same activity.
- `failure`: Log a message of level `error` that indicates that the activity has failed. This also ends the associated activity.
- `success`: Log a message of level `info` that indicates that activity has succeeded. This also ends the associated activity.

:::note

If you configured the `LOG_LEVEL` environment variable to a level higher than those associated with the above methods, their messages won’t be logged.

:::

For example:

```ts title="src/loaders/my-loader.ts"
import { 
  ProductService, 
  ConfigModule, 
  Logger,
  MedusaContainer,
} from "@medusajs/medusa"

export default async (
  container: MedusaContainer,
  config: ConfigModule
): Promise<void> => {
  const logger = container.resolve<Logger>("logger")

  const activityId = logger.activity("Starting loader...")

  const productService = container.resolve<ProductService>(
    "productService"
  )

  try {
    logger.progress(activityId, `Products count: ${
      await productService.count()
    }`)
  } catch (e) {
    logger.failure(activityId, `An error occurred: ${e}`)
  }
  
  logger.success(activityId, "Ending loader")
}
```

---

## Logging Configuration

### Log Level

By default, the minimum logged level is `silly`, meaning that messages of all levels are logged.

You can change that by setting the `LOG_LEVEL` environment variable to the minimum level you want to be logged.

The available log levels, from lowest to highest levels, are:

1. `silly`: this is used to indicate that messages of all levels should be logged.
2. `debug`
3. `info`
4. `warn`
5. `error`

For example, to log only `error` messages set the `LOG_LEVEL` environment variable to `error`:

```bash
LOG_LEVEL=error
```

:::note

The environment variable must be set as a system environment variable and not in `.env`.

:::

### Save Logs in File

Aside from showing the logs in the Medusa backend’s console, you can save the backend’s logs in a file by setting the `LOG_FILE` environment variable to the path of the file relative to the Medusa backend’s root directory.

:::note

This doesn’t save logs of requests sent to the Medusa backend.

:::

For example:

```bash
LOG_FILE=all.log
```

Your logs are now saved in the `all.log` file at the root of your Medusa backend.

:::note

The environment variable must be set as a system environment variable and not in `.env`.

:::
