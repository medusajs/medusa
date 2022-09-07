# Batch Jobs

In this document, you’ll learn what Batch Jobs are and how they work in Medusa.

## What are Batch Jobs?

Batch Jobs are tasks that can be performed asynchronously and iteratively. They can be [created using the Admin API](https://docs.medusajs.com/api/admin/#tag/Batch-Job/operation/PostBatchJobs), then, once confirmed, they are processed asynchronously.

Batch jobs require Redis, which Medusa uses as a queuing system to register and handle events. Every status change of a batch job triggers an event that can be handled using [subscribers](../subscribers/overview.md).

Medusa uses batch jobs in its core to perform some asynchronous tasks. For example, the Export Products functionality uses batch jobs.

You can also create a custom batch job or overwrite Medusa’s batch jobs.

### BatchJob Entity Overview

A batch job is stored in the database as a [BatchJob](https://docs.medusajs.com/references/entities/classes/BatchJob) entity. Some of its important attributes are:

- `status`: A string that determines the current status of the Batch Job.
- `context`: An object that can be used to store configurations related to the batch job. For example, you can use it to store listing configurations such as the limit or offset of the list to be retrieved during the processing of the batch job.
- `dry_run`: A boolean value that indicates whether this batch job should actually produce an output. By default it’s false, meaning that by default it produces an output. It can be used to simulate a batch job.
- `type`: A string that is used to later resolve the batch job strategy that should be used to handle the batch job.
- `result`: An object that includes important properties related to the result of the batch job. Some of these properties are:
  - `errors`: An error object that contains any errors that occur during the batch job’s execution.
  - `progress`: A numeric value indicating the progress of the batch job.
  - `count`: A number that includes the total count of records related to the operation. For example, in the case of product exports, it is used to indicate the total number of products exported.
  - `advancement_count`: A number that indicates the number of records processed so far. Can be helpful when retrying a batch job.

## What are Batch Job Strategies

Batch jobs are handled by batch job strategies. A batch job strategy is a class that extends the `AbstractBatchJobStrategy` abstract class and implements the methods defined in that class to handle the different states of a batch job.

A batch job strategy must implement the necessary methods to handle the preparation of a batch job before it is created, the preparation of the processing of the batch job after it is created, and the processing of the batch job once it is confirmed.

When you create a batch job strategy, the `batchType` class property indicates the batch job types this strategy handles. Then, when you create a new batch job, you set the batch job’s type to the value of `batchType` in your strategy.

## How Batch Jobs Work

A batch job’s flow from creation to completion is:

1. A batch job is created using the [Create Batch Job API endpoint](https://docs.medusajs.com/api/admin/#tag/Batch-Job/operation/PostBatchJobs).
2. Once the batch job is created, the batch job’s status is changed to `created` and the `batch.created` event is triggered by the `BatchJobService`.
3. The `BatchJobSubscriber` handles the `created` event. It resolves the batch job strategy based on the `type` of the batch job, then uses it to pre-process the batch job. After this, the batch job’s status is changed to `pre_processed`. Only when the batch job has the status `pre_processed` can be confirmed.
4. The batch job can be confirmed using the [Confirm Batch Job API](https://docs.medusajs.com/api/admin/#tag/Batch-Job/operation/PostBatchJobsBatchJobConfirmProcessing) endpoint.
5. Once the batch job is confirmed, the batch job’s status is changed to `confirmed` and the `batch.confirmed` event is triggered by the `BatchJobService`.
6. The `BatchJobSubscriber` handles the `confirmed` event. It resolves the batch job strategy, then uses it to process the batch job. 
7. Once the batch job is processed succesfully, the batch job has the status `completed`.

You can track the progress of the batch job at any point using the [Retrieve Batch Job](https://docs.medusajs.com/api/admin/#tag/Batch-Job/operation/GetBatchJobsBatchJob) endpoint.

:::info

If the batch job fails at any point in this flow, its status is changed to `failed`.

:::

![Flowchart summarizing the batch job's flow from creation to completion](https://i.imgur.com/Qja0kAz.png)

## What’s Next?

- Learn about the [Batch Job’s events](../subscribers/events-list.md#batch-jobs-events).
