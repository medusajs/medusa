import { AdminPostBatchesReq } from "../api/routes/admin/batch/create-batch-job"
import { BatchJob } from "../models/batch-job"
import { BatchJobCreateProps } from "../types/batch-job"
import { TransactionBaseService } from "./transaction-base-service"

export interface IBatchJobStrategy<T extends TransactionBaseService<any>>
  extends TransactionBaseService<T> {
  /**
   * Method for preparing a batch job for processing
   */
  prepareBatchJobForProcessing(
    batchJobEntity: AdminPostBatchesReq,
    req: Express.Request
  ): Promise<BatchJobCreateProps>

  /**
   * Method for pre-processing a batch job
   */
  preProcessBatchJob(batchJobId: string): Promise<BatchJob>

  /**
   *  Method does the actual processing of the job. Should report back on the progress of the operation.
   */
  processJob(batchJobId: string): Promise<BatchJob>

  /**
   * Builds and returns a template file that can be downloaded and filled in
   */
  buildTemplate()
}

export abstract class AbstractBatchJobStrategy<
    T extends TransactionBaseService<any>
  >
  extends TransactionBaseService<T>
  implements IBatchJobStrategy<T>
{
  static identifier: string
  static batchType: string

  abstract prepareBatchJobForProcessing(
    batchJob: AdminPostBatchesReq,
    req: Express.Request
  ): Promise<BatchJobCreateProps>

  public abstract preProcessBatchJob(batchJobId: string): Promise<BatchJob>

  public abstract processJob(batchJobId: string): Promise<BatchJob>

  public abstract buildTemplate(): Promise<string>
}

export function isBatchJobStrategy(
  object: unknown
): object is IBatchJobStrategy<any> {
  return object instanceof AbstractBatchJobStrategy
}
