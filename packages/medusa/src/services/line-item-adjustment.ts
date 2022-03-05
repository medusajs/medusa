import { EntityManager } from "typeorm"
import { BaseService } from "medusa-interfaces"
import { MedusaError } from "medusa-core-utils"
import { LineItemAdjustmentRepository } from "../repositories/line-item-adjustment"
import { ProductTag } from "../models/product-tag"
import { FindConfig } from "../types/common"
import { FilterableProductTagProps } from "../types/product"
import { LineItemAdjustment } from "../models/line-item-adjustment"

type LineItemAdjustmentServiceProps = {
  manager: EntityManager
  lineItemAdjustmentRepository: typeof LineItemAdjustmentRepository
}

/**
 * Provides layer to manipulate product tags.
 * @extends BaseService
 */
class LineItemAdjustmentService extends BaseService {
  private manager_: EntityManager
  private lineItemAdjustmentRepo_: typeof LineItemAdjustmentRepository

  constructor({
    manager,
    lineItemAdjustmentRepository,
  }: LineItemAdjustmentServiceProps) {
    super()
    this.manager_ = manager
    this.lineItemAdjustmentRepo_ = lineItemAdjustmentRepository
  }

  withTransaction(
    transactionManager: EntityManager
  ): LineItemAdjustmentService {
    if (!transactionManager) {
      return this
    }

    const cloned = new LineItemAdjustmentService({
      manager: transactionManager,
      lineItemAdjustmentRepository: this.lineItemAdjustmentRepo_,
    })

    cloned.transactionManager_ = transactionManager

    return cloned
  }

  /**
   * Retrieves a line item adjustment by id.
   * @param id - the id of the line item adjustment to retrieve
   * @param config - the config to retrieve the line item adjustment by
   * @return the line item adjustment.
   */
  async retrieve(
    id: string,
    config: FindConfig<ProductTag> = {}
  ): Promise<LineItemAdjustment> {
    const lineItemAdjustmentRepo = this.manager_.getCustomRepository(
      this.lineItemAdjustmentRepo_
    )

    const query = this.buildQuery_({ id }, config)
    const lineItemAdjustment = await lineItemAdjustmentRepo.findOne(query)

    if (!lineItemAdjustment) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Line item adjustment with id: ${id} was not found`
      )
    }

    return lineItemAdjustment
  }

  /**
   * Creates a line item adjustment
   * @param data - the line item adjustment to create
   * @return line item adjustment
   */
  async create(data: Partial<LineItemAdjustment>): Promise<LineItemAdjustment> {
    return await this.atomicPhase_(async (manager: EntityManager) => {
      const lineItemAdjustmentRepo = manager.getCustomRepository(
        this.lineItemAdjustmentRepo_
      )

      const lineItemAdjustment = await lineItemAdjustmentRepo.create(data)

      return await lineItemAdjustmentRepo.save(lineItemAdjustment)
    })
  }

  /**
   * Creates a line item adjustment
   * @param id - the line item adjustment id to update
   * @param data - the line item adjustment to create
   * @return line item adjustment
   */
  async update(
    id: string,
    data: Partial<LineItemAdjustment>
  ): Promise<LineItemAdjustment> {
    return await this.atomicPhase_(async (manager: EntityManager) => {
      const lineItemAdjustmentRepo = manager.getCustomRepository(
        this.lineItemAdjustmentRepo_
      )

      const lineItemAdjustment = await this.retrieve(id)

      const { metadata, ...rest } = data

      if (metadata) {
        lineItemAdjustment.metadata = this.setMetadata_(
          lineItemAdjustment,
          metadata
        )
      }

      for (const [key, value] of Object.entries(rest)) {
        lineItemAdjustment[key] = value
      }

      const result = await lineItemAdjustmentRepo.save(lineItemAdjustment)
      return result
    })
  }

  /**
   * Lists line item adjustments
   * @param selector - the query object for find
   * @param config - the config to be used for find
   * @return the result of the find operation
   */
  async list(
    selector: FilterableProductTagProps = {},
    config: FindConfig<LineItemAdjustment> = { skip: 0, take: 20 }
  ): Promise<LineItemAdjustment[]> {
    const lineItemAdjustmentRepo = this.manager_.getCustomRepository(
      this.lineItemAdjustmentRepo_
    )

    const query = this.buildQuery_(selector, config)
    return await lineItemAdjustmentRepo.find(query)
  }

  /**
   * Deletes a line item adjustment
   * @param id - the id of the line item adjustment to delete
   * @return the result of the delete operation
   */
  async delete(id: string): Promise<void> {
    return this.atomicPhase_(async (manager) => {
      const lineItemAdjustmentRepo = manager.getCustomRepository(
        this.lineItemAdjustmentRepo_
      )

      const lineItemAdjustment = await lineItemAdjustmentRepo.findOne({
        where: { id },
      })

      if (!lineItemAdjustment) {
        return Promise.resolve()
      }

      await lineItemAdjustmentRepo.remove(lineItemAdjustment)

      return Promise.resolve()
    })
  }
}

export default LineItemAdjustmentService
