import { EntityManager } from "typeorm"
import { BaseService } from "medusa-interfaces"
import { MedusaError } from "medusa-core-utils"
import { LineItemAdjustmentRepository } from "../repositories/line-item-adjustment"
import { FindConfig } from "../types/common"
import { LineItemAdjustment } from "../models/line-item-adjustment"
import { FilterableLineItemAdjustmentProps } from "../types/line-item-adjustment"
import { LineItem } from "../models/line-item"
import { Cart } from "../models/cart"

type LineItemAdjustmentServiceProps = {
  manager: EntityManager
  lineItemAdjustmentRepository: typeof LineItemAdjustmentRepository
}

/**
 * Provides layer to manipulate line item adjustments.
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
    config: FindConfig<LineItemAdjustment> = {}
  ): Promise<LineItemAdjustment> {
    const lineItemAdjustmentRepo: LineItemAdjustmentRepository =
      this.manager_.getCustomRepository(this.lineItemAdjustmentRepo_)

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
      const lineItemAdjustmentRepo: LineItemAdjustmentRepository =
        manager.getCustomRepository(this.lineItemAdjustmentRepo_)

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
      const lineItemAdjustmentRepo: LineItemAdjustmentRepository =
        manager.getCustomRepository(this.lineItemAdjustmentRepo_)

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
    selector: FilterableLineItemAdjustmentProps = {},
    config: FindConfig<LineItemAdjustment> = { skip: 0, take: 20 }
  ): Promise<LineItemAdjustment[]> {
    const lineItemAdjustmentRepo = this.manager_.getCustomRepository(
      this.lineItemAdjustmentRepo_
    )

    const query = this.buildQuery_(selector, config)
    return await lineItemAdjustmentRepo.find(query)
  }

  /**
   * Deletes line item adjustments matching a selector
   * @param selectorOrId - the query object for find or the line item adjustment id
   * @return the result of the delete operation
   */
  async delete(
    selectorOrId: string | FilterableLineItemAdjustmentProps
  ): Promise<void> {
    return this.atomicPhase_(async (manager) => {
      const lineItemAdjustmentRepo: LineItemAdjustmentRepository =
        manager.getCustomRepository(this.lineItemAdjustmentRepo_)

      if (typeof selectorOrId === "string") {
        return await this.delete({ id: selectorOrId })
      }

      const query = this.buildQuery_(selectorOrId)

      const lineItemAdjustments = await lineItemAdjustmentRepo.find(query)

      await lineItemAdjustmentRepo.remove(lineItemAdjustments)

      return Promise.resolve()
    })
  }

  /**
   * Creates adjustment for a line item
   * @param cart - the cart object holding discounts
   * @param lineItem - the line item for which a line item adjustment might be created
   * @return a line item adjustment or undefined if no adjustment was created
   */
  async createAdjustmentForLineItem(
    cart: Cart,
    lineItem: LineItem
  ): Promise<LineItemAdjustment | undefined> {
    const discount = await this.discountService.validateDiscountsForLineItem(
      cart.discounts,
      lineItem
    )

    if (!discount) {
      return
    }

    const amount = await this.discountService.calculateDiscountApplied(discount)

    const lineItemAdjustment = await this.create({
      item_id: lineItem.id,
      amount,
      discount_id: discount.id,
      description: "discount",
    })

    return lineItemAdjustment
  }

  /**
   * Creates adjustment for a line item
   * @param cart - the cart object holding discounts
   * @param lineItem - the line item for which a line item adjustment might be created
   * @return if a lineItem was given, returns a line item adjustment or undefined if no adjustment was created
   * otherwise returns an array of line item adjustments for each line item in the cart
   */
  async createAdjustments(
    cart: Cart,
    lineItem?: LineItem
  ): Promise<
    LineItemAdjustment | undefined | (LineItemAdjustment | undefined)[]
  > {
    if (lineItem) {
      return await this.createAdjustmentForLineItem(cart, lineItem)
    }

    return await Promise.all(
      cart.items.map((li) => this.createAdjustmentForLineItem(cart, li))
    )
  }
}

export default LineItemAdjustmentService
