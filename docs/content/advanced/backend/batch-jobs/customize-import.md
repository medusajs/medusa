# Customize Import Strategy

In this document, you’ll learn how to create a custom product import strategy either by overwriting the default strategy or creating your own.

## Overview

Product Import Strategy is essentially a batch job strategy. Medusa provides the necessary mechanisms to overwrite or create your own strategy.

Although this documentation specifically targets import strategies, you can use the same steps to overwrite any batch job strategy in Medusa, including export strategies.

## Prerequisites

### Medusa Components

It's assumed that you already have a Medusa server installed and set up. If not, you can follow our [quickstart guide](../../../quickstart/quick-start.mdx) to get started.

### Redis

Redis is required for batch jobs to work. Make sure you [install Redis](../../../tutorial/0-set-up-your-development-environment.mdx#redis) and [configure it with your Medusa server](../../../usage/configurations.md#redis).

### PostgreSQL

If you use SQLite during your development, it’s highly recommended that you use PostgreSQL when working with batch jobs. Learn how to [install PostgreSQL](../../../tutorial/0-set-up-your-development-environment.mdx#postgresql) and [configure it with your Medusa server](../../../usage/configurations.md#postgresql-configurations).

## Overwrite Batch Job Strategy

The steps required for overwriting a batch job strategy are essentially the same steps required to create a batch job strategy with a minor difference. For that reason, this documentation does not cover the basics of a batch job strategy.

If you’re interested to learn more about batch job strategies and how they work, please check out the [Create Batch Job Strategy documentation](./create.md).

### 1. Create a File

You must store batch job strategies in the `src/strategies` directory of your Medusa server. They are either TypeScript or JavaScript files.

So, for example, you can create the file `src/strategies/import.ts`.

### 2. Create a Class

The batch job strategy class must extend the `AbstractBatchJobStrategy` class which you can import from Medusa’s core repository.

For example, you can define the following class in the file you created:

```typescript title=src/strategies/import.ts
import { AbstractBatchJobStrategy, BatchJobService } from '@medusajs/medusa'
import { EntityManager } from 'typeorm'

class MyImportStrategy extends AbstractBatchJobStrategy {
  protected batchJobService_: BatchJobService
  protected manager_: EntityManager
  protected transactionManager_: EntityManager

  processJob(batchJobId: string): Promise<void> {
    throw new Error('Method not implemented.')
  }
  buildTemplate(): Promise<string> {
    throw new Error('Method not implemented.')
  }
}

export default MyImportStrategy
```

:::note

This is the base implementation of a batch job strategy. You can learn about all the different methods and properties in [this documentation](./create.md#3-define-required-properties).

:::

### 3. Set the batchType Property

Every batch job strategy class must have the static property `batchType` defined. It determines the type of batch job this strategy handles.

Since only one batch job strategy can handle a batch job type, you can overwrite Medusa’s default batch job strategies by using the same `batchType` value in your custom strategy.

So, for example, to overwrite the product import strategy set the `batchType` property in your strategy to `product-import`:

```typescript
class MyImportStrategy extends AbstractBatchJobStrategy {
  static batchType = 'product-import'
  //...
}
```

### 4. Define your Custom Functionality

You can now define your custom functionality in your batch job strategy. For example, you can create custom import logic to import products.

Refer to the [Create a Batch Job documentation](./create.md#3-define-required-properties) to understand what properties and methods are required in your batch job strategy and how you can use them to implement your custom functionality.

### 5. Run Build Command

Before you can test out your batch job strategy, you must run the `build` command:

```bash npm2yarn
npm run build
```

### 6. Test your Functionality

Since you didn’t create a new batch job type and overwrote the functionality of the strategy, you can test out your functionality using the [same steps used with the default strategy](./create.md#test-your-batch-job-strategy).

Specifically, since you create batch jobs using the [Create Batch Job](https://docs.medusajs.com/api/admin/#tag/Batch-Job/operation/PostBatchJobs) endpoint which accepts the batch job type as a body parameter, you just need to send the same type you used for this field. In the example of this documentation, the `type` would be `product-import`.

If you overwrote the import functionality, you can follow [these steps to learn how to import products using the Admin APIs](../../admin/import-products.mdx).

## Create Custom Batch Job Strategy

If you don’t want to overwrite Medusa’s batch job strategy, you can create a custom batch job strategy with a different `batchType` value. Then, use that type when you send a request to [Create a Batch Job](https://docs.medusajs.com/api/admin/#tag/Batch-Job).

For more details on creating custom batch job strategies, please check out the [Create Batch Job Strategy documentation](create.md).

## What’s Next

- Learn more about [batch jobs](./index.md).
- Learn [how to use the Import Product APIs](../../admin/import-products.mdx).
