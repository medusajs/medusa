---
description: 'Learn how to create a scheduled job in Medusa. The scheduled job in this example will simply change the status of draft products to published.'
addHowToData: true
---

# (Deprecated) How to Create a Scheduled Job

In this document, you’ll learn how to create a scheduled job in Medusa.

:::note

Following v1.18 of `@medusajs/medusa`, the approach in this guide is deprecated. It's recommended to follow [this guide](./create.md) instead.

:::

## Overview

Medusa allows you to create scheduled jobs that run at specific times during your backend's lifetime. For example, you can synchronize your inventory with an Enterprise Resource Planning (ERP) system once a day.

This guide explains how to create a scheduled job on your Medusa backend. The scheduled job in this example will simply change the status of draft products to `published`.

---

## Prerequisites

### Medusa Components

It is assumed that you already have a Medusa backend installed and set up. If not, you can follow the [quickstart guide](../backend/install.mdx) to get started. The Medusa backend must also have an event bus module installed, which is available when using the default Medusa backend starter.

---

## 1. Create a File

Each scheduled job should reside in a [loader](../loaders/overview.mdx), which is a TypeScript or JavaScript file located under the `src/loaders` directory.

Start by creating the `src/loaders` directory. Then, inside that directory, create the JavaScript or TypeScript file that you’ll add the scheduled job in. You can use any name for the file.

For the example in this tutorial, you can create the file `src/loaders/publish.ts`.

---

## 2. Create Scheduled Job

To create a scheduled job, add the following code in the file you created, which is `src/loaders/publish.ts` in this example:

```ts title="src/loaders/publish.ts"
import { MedusaContainer } from "@medusajs/medusa"

const publishJob = async (
  container: MedusaContainer,
  options: Record<string, any>
) => {
  const jobSchedulerService = 
    container.resolve("jobSchedulerService")
  jobSchedulerService.create(
    "publish-products", 
    {}, 
    "0 0 * * *", 
    async () => {
      // job to execute
      const productService = container.resolve("productService")
      const draftProducts = await productService.list({
        status: "draft",
      })

      for (const product of draftProducts) {
        await productService.update(product.id, {
          status: "published",
        })
      }
    }
  )
}

export default publishJob
```

:::info

The service taking care of background jobs was renamed in v1.7.1. If you are running a previous version, use `eventBusService` instead of `jobSchedulerService`.

:::

This file should export a function that accepts a `container` and `options` parameters. `container` is the dependency container that you can use to resolve services, such as the JobSchedulerService. `options` are the plugin’s options if this scheduled job is created in a plugin.

You then resolve the `JobSchedulerService` and use the `jobSchedulerService.create` method to create the scheduled job. This method accepts four parameters:

- The first parameter is a unique name to give to the scheduled job. In the example above, you use the name `publish-products`.
- The second parameter is an object which can be used to [pass data to the job](#pass-data-to-the-scheduled-job).
- The third parameter is the scheduled job expression pattern. In this example, it will execute the scheduled job once a day at 12 AM.
- The fourth parameter is the function to execute. This is where you add the code to execute once the scheduled job runs. In this example, you retrieve the draft products using the [ProductService](../../references/services/classes/services.ProductService.mdx) and update the status of each of these products to `published`.

:::tip

You can see examples of scheduled job expression patterns on [crontab guru](https://crontab.guru/examples.html).

:::

### Scheduled Job Name

As mentioned earlier, the first parameter of the `create` method is the name of the scheduled job. By default, if another scheduled job has the same name, your custom scheduled job will replace it.

If you want to ensure both scheduled jobs are registered and used, you can pass as a fifth parameter an options object with a `keepExisting` property set to `true`. For example:

```ts
jobSchedulerService.create(
  "publish-products", 
  {},
  "0 0 * * *", 
  async () => {
    // ...
  },
  {
    keepExisting: true,
  }
)
```

### Pass Data to the Scheduled Job

To pass data to your scheduled job, add the data to the object passed as a second parameter under the `data` property. This is helpful if you use one function to handle multiple scheduled jobs.

For example:

```ts
jobSchedulerService.create("publish-products", {
    data: {
      productId,
    },
  }, "0 0 * * *", async (job) => {
    console.log(job.data) // {productId: 'prod_124...'}
    // ...
})
```

---

## 3. Run Medusa Backend

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

If the scheduled job was registered successfully, you should see a message similar to this logged on your Medusa backend:

```bash
Registering publish-products
```

Where `publish-products` is the unique name you provided to the scheduled job.

Once it is time to run your scheduled job based on the scheduled job expression pattern, the scheduled job will run and you can see it logged on your Medusa backend.

For example, the above scheduled job will run at 12 AM and, when it runs, you can see the following logged on your Medusa backend:

```bash noReport
info:    Processing scheduled job: publish-products
```

If you log anything in the scheduled job, for example using `console.log`, or if any errors are thrown, it’ll also be logged on your Medusa backend.

:::tip

To test the previous example out instantly, you can change the scheduled job expression pattern passed as the third parameter to `jobSchedulerService.create` to `* * * * *`. This will run the scheduled job every minute.

:::

---

## See Also

- [Create a Plugin](../plugins/create.mdx)
