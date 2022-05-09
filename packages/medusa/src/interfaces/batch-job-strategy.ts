import { EntityManager } from "typeorm"
import { BatchJob } from "../models/batch-job"

export interface IBatchJobStrategy {
  identifier: string
  batchType: string

  /**
   * Instantiate a new price selection strategy with the active transaction in
   * order to ensure reads are accurate.
   * @param manager EntityManager with the queryrunner of the active transaction
   * @returns a new price selection strategy
   */
  withTransaction(manager: EntityManager): IBatchJobStrategy

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

export abstract class AbstractBatchJobStrategy implements IBatchJobStrategy {
  public abstract identifier: string
  public abstract batchType: string

  public abstract withTransaction(manager: EntityManager): IBatchJobStrategy

  public abstract validateContext(
    context: Record<string, unknown>
  ): Promise<Record<string, unknown>>

  public abstract processJob(batchJobId: string): Promise<BatchJob>

  public abstract completeJob(batchJobId: string): Promise<BatchJob>

  public abstract validateFile(fileLocation: string): Promise<boolean>

  public abstract buildTemplate(): Promise<string>
}

export function isBatchJobStrategy(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  object: any
): object is IBatchJobStrategy {
  return (
    typeof object.validateContext === "function" &&
    typeof object.processJob === "function" &&
    typeof object.completeJob === "function" &&
    typeof object.validateFile === "function" &&
    typeof object.buildTemplate === "function"
  )
}
