---
description: 'Learn how to create a scheduled job in Medusa. The scheduled job in this example will simply change the status of draft products to published.'
addHowToData: true
---

# How to Create a Scheduled Job

In this document, you’ll learn how to create a scheduled job in Medusa.

:::tip

v1.18 of `@medusajs/medusa` introduced a new approach to create a scheduled job. If you're looking for the old guide, you can find it [here](./create-deprecated.md). However, it's highly recommended you follow this new approach, as the old one is deprecated.

:::

## Overview

Medusa allows you to create scheduled jobs that run at specific times during your backend's lifetime. For example, you can synchronize your inventory with an Enterprise Resource Planning (ERP) system once a day.

This guide explains how to create a scheduled job on your Medusa backend. The scheduled job in this example will simply change the status of draft products to `published`.

---

## Prerequisites

To use scheduled jobs, you must configure Redis in your Medusa backend. Learn more in the [Configurations documentation](../../references/medusa_config/interfaces/medusa_config.ConfigModule.mdx#redis_url).

---

## Create Scheduled Job

Scheduled jobs are TypeScript or JavaScript guides placed under the `src/jobs` directory. It can be created under subdirectories of `src/jobs` as well.

The scheduled job file exports a default handler function, and the scheduled job's configurations.

For example:

```ts title="src/jobs/publish.ts"
import { 
  type ProductService, 
  type ScheduledJobConfig, 
  type ScheduledJobArgs,
  ProductStatus,
}  from "@medusajs/medusa"

export default async function handler({ 
  container, 
  data, 
  pluginOptions,
}: ScheduledJobArgs) {
  const productService: ProductService = container.resolve(
    "productService"
  )
  const draftProducts = await productService.list({
    status: ProductStatus.DRAFT,
  })

  for (const product of draftProducts) {
    await productService.update(product.id, {
      status: ProductStatus.PUBLISHED,
    })
  }
}

export const config: ScheduledJobConfig = {
  name: "publish-once-a-day",
  schedule: "0 0 * * *",
  data: {},
}
```

### Scheduled Job Configuration

The exported configuration object of type `ScheduledJobConfig` must include the following properties:

- `name`: a string indicating a unique name to give to the scheduled job. If another scheduled job has the same name, your custom scheduled job will replace it.
- `schedule`: a string indicating a [cron schedule](https://crontab.guru/#0_0_*_*_*) that determines when the job should run. In this example, it will execute the scheduled job once a day at 12 AM.
- `data`: Optional data you want to pass to the job.

:::tip

You can see examples of scheduled job expression patterns on [crontab guru](https://crontab.guru/examples.html).

:::

### Scheduled Job Handler Function

The default-export of the scheduled job file is a handler function that is executed when the events specified in the exported configuration is triggered.

The function accepts a parameter of type `ScheduledJobArgs`, which has the following properties:

- `container`: The [dependency container](../fundamentals/dependency-injection.md) that allows you to resolve Medusa resources, such as services.
- `data`: The data passed in the [configuration object](#scheduled-job-configuration).
- `pluginOptions`: When the scheduled job is created within a plugin, this object holds the plugin's options defined in the [Medusa configurations](../../references/medusa_config/interfaces/medusa_config.ConfigModule.mdx).

---

## Test it Out

:::info

Scheduled Jobs only run while the Medusa backend is running.

:::

Before you run the Medusa backend, make sure to build your code that's under the `src` directory into the `dist` directory with the following command:

```bash npm2yarn
npm run build
```

Then, run the following command to start your Medusa backend:

```bash npm2yarn
npx medusa develop
```

If the scheduled job is registered successfully, you should see a message similar to this logged on your Medusa backend:

```bash
Registering publish-once-a-day
```

Where `publish-once-a-day` is the unique name you provided to the scheduled job.

Once it's time to run your scheduled job based on the `schedule` configuration, the scheduled job will run and you can see it logged on your Medusa backend.

For example, the above scheduled job will run at 12 AM and, when it runs, you can see the following logged on your Medusa backend:

```bash noReport
info:    Processing scheduled job: publish-once-a-day
```

If you log anything in the scheduled job, for example using `console.log`, or if any errors are thrown, it’ll also be logged on your Medusa backend.

:::tip

To test the previous example out instantly, you can change the value of `schedule` in the exported configuration object to `* * * * *`. This will run the scheduled job every minute.

:::

---

## See Also

- [Create a Plugin](../plugins/create.mdx)
