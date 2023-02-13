import { isDefined, MedusaError } from "medusa-core-utils"
import { EntityManager, FindOperator, In } from "typeorm"

import { Cart, DiscountRuleType, LineItem, LineItemAdjustment } from "../models"
import { LineItemAdjustmentRepository } from "../repositories/line-item-adjustment"
import { FindConfig } from "../types/common"
import { FilterableLineItemAdjustmentProps } from "../types/line-item-adjustment"
import DiscountService from "./discount"
import { TransactionBaseService } from "../interfaces"
import { buildQuery, setMetadata } from "../utils"
import { CalculationContextData } from "../types/totals"

type LineItemAdjustmentServiceProps = {
  manager: EntityManager
  lineItemAdjustmentRepository: typeof LineItemAdjustmentRepository
  discountService: DiscountService
}

type AdjustmentContext = {
  variant: { product_id: string }
}

type GeneratedAdjustment = {
  amount: number
  discount_id: string
  description: string
}

/**
 * Provides layer to manipulate line item adjustments.
 */
class LineItemAdjustmentService extends TransactionBaseService {
  protected readonly manager_: EntityManager
  protected transactionManager_: EntityManager | undefined

  private readonly lineItemAdjustmentRepo_: typeof LineItemAdjustmentRepository
  private readonly discountService: DiscountService

  constructor({
    manager,
    lineItemAdjustmentRepository,
    discountService,
  }: LineItemAdjustmentServiceProps) {
    // eslint-disable-next-line prefer-rest-params
    super(arguments[0])

    this.manager_ = manager
    this.lineItemAdjustmentRepo_ = lineItemAdjustmentRepository
    this.discountService = discountService
  }

  /**
   * Retrieves a line item adjustment by id.
   * @param lineItemAdjustmentId - the id of the line item adjustment to retrieve
   * @param config - the config to retrieve the line item adjustment by
   * @return the line item adjustment.
   */
  async retrieve(
    lineItemAdjustmentId: string,
    config: FindConfig<LineItemAdjustment> = {}
  ): Promise<LineItemAdjustment> {
    if (!isDefined(lineItemAdjustmentId)) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `"lineItemAdjustmentId" must be defined`
      )
    }

    const lineItemAdjustmentRepo: LineItemAdjustmentRepository =
      this.manager_.getCustomRepository(this.lineItemAdjustmentRepo_)

    const query = buildQuery({ id: lineItemAdjustmentId }, config)
    const lineItemAdjustment = await lineItemAdjustmentRepo.findOne(query)

    if (!lineItemAdjustment) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Line item adjustment with id: ${lineItemAdjustmentId} was not found`
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

      const lineItemAdjustment = lineItemAdjustmentRepo.create(data)

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
        lineItemAdjustment.metadata = setMetadata(lineItemAdjustment, metadata)
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

    const query = buildQuery(selector, config)
    return await lineItemAdjustmentRepo.find(query)
  }

  /**
   * Deletes line item adjustments matching a selector
   * @param selectorOrIds - the query object for find or the line item adjustment id
   * @return the result of the delete operation
   */
  async delete(
    selectorOrIds:
      | string
      | string[]
      | (FilterableLineItemAdjustmentProps & {
          discount_id?: FindOperator<string | null>
        })
  ): Promise<void> {
    return this.atomicPhase_(async (manager) => {
      const lineItemAdjustmentRepo: LineItemAdjustmentRepository =
        manager.getCustomRepository(this.lineItemAdjustmentRepo_)

      if (typeof selectorOrIds === "string" || Array.isArray(selectorOrIds)) {
        const ids =
          typeof selectorOrIds === "string" ? [selectorOrIds] : selectorOrIds
        await lineItemAdjustmentRepo.delete({ id: In(ids) })
        return
      }

      const query = buildQuery(selectorOrIds)

      const lineItemAdjustments = await lineItemAdjustmentRepo.find(query)

      await lineItemAdjustmentRepo.remove(lineItemAdjustments)
    })
  }

  /**
   * Creates adjustment for a line item
   * @param calculationContextData - the calculationContextData object holding discounts
   * @param generatedLineItem - the line item for which a line item adjustment might be created
   * @param context - the line item for which a line item adjustment might be created
   * @return a line item adjustment or undefined if no adjustment was created
   */
  async generateAdjustments(
    calculationContextData: CalculationContextData,
    generatedLineItem: LineItem,
    context: AdjustmentContext
  ): Promise<GeneratedAdjustment[]> {
    const lineItem = {
      ...generatedLineItem,
    } as LineItem

    return this.atomicPhase_(async (manager) => {
      // if lineItem should not be discounted
      // or lineItem is a return line item
      // or the cart does not have any discounts
      // then do nothing
      if (
        !lineItem.allow_discounts ||
        lineItem.is_return ||
        !calculationContextData?.discounts?.length
      ) {
        return []
      }

      const [discount] = calculationContextData.discounts.filter(
        (d) => d.rule.type !== DiscountRuleType.FREE_SHIPPING
      )

      // if no discount is applied to the cart then return
      if (!discount) {
        return []
      }

      const discountServiceTx = this.discountService.withTransaction(manager)

      const lineItemProduct = context.variant.product_id

      const isValid = await discountServiceTx.validateDiscountForProduct(
        discount.rule_id,
        lineItemProduct
      )

      // if discount is not valid for line item, then do nothing
      if (!isValid) {
        return []
      }

      // In case of a generated line item the id is not available, it is mocked instead to be used for totals calculations
      lineItem.id = lineItem.id ?? new Date().getTime()
      const amount = await discountServiceTx.calculateDiscountForLineItem(
        discount.id,
        lineItem,
        calculationContextData
      )

      // if discounted amount is 0, then do nothing
      if (amount === 0) {
        return []
      }

      return [
        {
          amount,
          discount_id: discount.id,
          description: "discount",
        },
      ]
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
  ): Promise<LineItemAdjustment[]> {
    const adjustments = await this.generateAdjustments(cart, lineItem, {
      variant: lineItem.variant,
    })

    const createdAdjustments: LineItemAdjustment[] = []
    for (const adjustment of adjustments) {
      const created = await this.create({
        item_id: lineItem.id,
        ...adjustment,
      })

      createdAdjustments.push(created)
    }

    return createdAdjustments
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
  ): Promise<LineItemAdjustment[] | LineItemAdjustment[][]> {
    if (lineItem) {
      return await this.createAdjustmentForLineItem(cart, lineItem)
    }

    if (!cart.items) {
      return []
    }

    return await Promise.all(
      cart.items.map(async (li) => this.createAdjustmentForLineItem(cart, li))
    )
  }
}

export default LineItemAdjustmentService
