import { EntityManager } from "typeorm"

import { AbstractBatchJobStrategy } from "../interfaces"
import { BatchJob } from "../models"

class ProductImportStrategy extends AbstractBatchJobStrategy<ProductImportStrategy> {
  static identifier = "product-import"

  static batchType = "product_import"

  buildTemplate(): Promise<string> {
    return Promise.resolve("")
  }

  completeJob(batchJobId: string): Promise<BatchJob> {
    return Promise.resolve(undefined)
  }

  protected manager_: EntityManager

  prepareBatchJobForProcessing(
    batchJobId: string,
    req: Express.Request
  ): Promise<BatchJob> {
    return Promise.resolve(undefined)
  }

  processJob(batchJobId: string): Promise<BatchJob> {
    return Promise.resolve(undefined)
  }

  protected transactionManager_: EntityManager | undefined

  validateContext(
    context: Record<string, unknown>
  ): Promise<Record<string, unknown>> {
    return Promise.resolve(undefined)
  }

  validateFile(fileLocation: string): Promise<boolean> {
    return Promise.resolve(false)
  }
}

export default ProductImportStrategy
