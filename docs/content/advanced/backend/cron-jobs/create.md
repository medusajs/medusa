# How to Create a Cron Job

In this document, you’ll learn how to create a cron job in Medusa.

## Overview

Medusa allows you to create cron jobs that run at specific times during your server’s lifetime. For example, you can synchronize your inventory with an Enterprise Resource Planning (ERP) system once a day.

This guide explains how to create a cron job on your Medusa server. The cron job in this example will simply change the status of draft products to `published`.

## Prerequisites

### Medusa Components

It is assumed that you already have a Medusa server installed and set up. If not, you can follow the [quickstart guide](../../../quickstart/quick-start.md) to get started.

### Redis

Redis is required for cron jobs to work. Make sure you [install Redis](../../../tutorial/0-set-up-your-development-environment.mdx#redis) and [configure it with your Medusa server](../../../usage/configurations.md#redis).

## 1. Create a File

Each cron job should reside in a file under the `src/loaders` directory.

Start by creating the `src/loaders` directory. Then, inside that directory, create the JavaScript or TypeScript file that you’ll add the cron job in. You can use any name for the file.

For the example in this tutorial, you can create the file `src/loaders/publish.js`.

## 2. Create Cron Job

To create a cron job, add the following code in the file you created, which is `src/loaders/publish.js` in this example:

```jsx
const publishJob = async (container, options) => {
  const eventBus = container.resolve("eventBusService");
  eventBus.createCronJob("publish-products", {}, "0 0 * * *", async () => {
    //job to execute
    const productService = container.resolve("productService");
    const draftProducts = await productService.list({
      status: 'draft'
    });

    for (const product of draftProducts) {
      await productService.update(product.id, {
        status: 'published'
      });
    }
  })
}

export default publishJob;
```

This file should export a function that accepts a `container` and `options` parameters. `container` is the dependency container that you can use to resolve services, such as the [EventBusService](../../../references/services/classes/EventBusService.md). `options` are the plugin’s options if this cron job is created in a plugin.

You then resolve the `EventBusService` and use the `eventBus.createCronJob` method to create the cron job. This method accepts four parameters:

- The first parameter is a unique name to give to the cron job. In the example above, you use the name `publish-products`;
- The second parameter is an object which can be used to [pass data to the job](#pass-data-to-the-cron-job);
- The third parameter is the cron job expression pattern. In this example, it will execute the cron job once a day at 12 AM.
- The fourth parameter is the function to execute. This is where you add the code to execute once the cron job runs. In this example, you retrieve the draft products using the [ProductService](../../../references/services/classes/ProductService.md) and update the status of each of these products to `published`.

:::tip

You can see examples of cron job expression patterns on [crontab guru](https://crontab.guru/examples.html).

:::

### Pass Data to the Cron Job

To pass data to your cron job, you can add them to the object passed as a second parameter under the `data` property. This is helpful if you use one function to handle multiple cron jobs.

For example:

```jsx
eventBus.createCronJob("publish-products", {
    data: {
      productId
    }
  }, "0 0 * * *", async (job) => {
    console.log(job.data); // {productId: 'prod_124...'}
    //...
});
```

## 3. Run Medusa Server

:::info

Cron Jobs only run while the Medusa server is running.

:::

In your terminal run the following command to run your Medusa server:

```bash npm2yarn
npm run start
```

This builds your code under the `src` directory into the `dist` directory, then runs the Medusa server.

If the cron job was registered successfully, you should see a message similar to this logged on your Medusa server:

```bash
Registering publish-products
```

Where `publish-products` is the unique name you provided to the cron job.

Once it is time to run your cron job based on the cron job expression pattern, the cron job will run and you can see it logged on your Medusa server.

For example, the above cron job will run at 12 AM and, when it runs, you can see the following logged on your Medusa server:

```bash
info:    Processing cron job: publish-products
```

If you log anything in the cron job, for example using `console.log`, or if any errors are thrown, it’ll also be logged on your Medusa server.

:::tip

To test the previous example out instantly, you can change the cron job expression pattern passed as the third parameter to `eventBus.createCronJob` to `* * * * *`. This will run the cron job every minute.

:::

## What’s Next

- Learn more about [services and how you can use them](../services/overview.md).
