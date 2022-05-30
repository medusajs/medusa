import { BatchJob } from "../models/batch-job"
import { TransactionBaseService } from "./transaction-base-service"

export interface IBatchJobStrategy<T extends TransactionBaseService<any>>
  extends TransactionBaseService<T> {
  /*
   * Used in the API controller to verify that the `context` param is valid
   */
  validateContext(
    context: Record<string, unknown>
  ): Promise<Record<string, unknown>>

  /*
   *  Method does the actual processing of the job. Should report back on the progress of the operation.
   */
  processJob(batchJobId: string): Promise<BatchJob>

  /*
   *  Method performs the completion of the job. Will not be run if `processJob` has already moved the BatchJob to a `complete` status.
   */
  completeJob(batchJobId: string): Promise<BatchJob>

  /**
   * Validates that the file can be used for processJob
   */
  validateFile(fileLocation: string)

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

  public abstract validateContext(
    context: Record<string, unknown>
  ): Promise<Record<string, unknown>>

  public abstract processJob(batchJobId: string): Promise<BatchJob>

  public abstract completeJob(batchJobId: string): Promise<BatchJob>

  public abstract validateFile(fileLocation: string): Promise<boolean>

  public abstract buildTemplate(): Promise<string>
}

export function isBatchJobStrategy(
  object: unknown
): object is IBatchJobStrategy<any> {
  return object instanceof AbstractBatchJobStrategy
}
