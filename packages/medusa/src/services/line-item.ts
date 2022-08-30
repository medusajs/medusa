import { MedusaError } from "medusa-core-utils"
import { BaseService } from "medusa-interfaces"
import { EntityManager } from "typeorm"
import { LineItemRepository } from "../repositories/line-item"
import { LineItemTaxLineRepository } from "../repositories/line-item-tax-line"
import {
  PricingService,
  ProductService,
  RegionService,
  ProductVariantService,
} from "./index"
import { CartRepository } from "../repositories/cart"
import { LineItem } from "../models/line-item"
import LineItemAdjustmentService from "./line-item-adjustment"
import { Cart } from "../models/cart"
import { LineItemAdjustment } from "../models/line-item-adjustment"
import { FindConfig } from "../types/common"

type InjectedDependencies = {
  manager: EntityManager
  lineItemRepository: typeof LineItemRepository
  lineItemTaxLineRepository: typeof LineItemTaxLineRepository
  cartRepository: typeof CartRepository
  productVariantService: ProductVariantService
  productService: ProductService
  pricingService: PricingService
  regionService: RegionService
  lineItemAdjustmentService: LineItemAdjustmentService
}

/**
 * Provides layer to manipulate line items.
 * @extends BaseService
 */
class LineItemService extends BaseService {
  protected readonly manager_: EntityManager
  protected readonly lineItemRepository_: typeof LineItemRepository
  protected readonly itemTaxLineRepo_: typeof LineItemTaxLineRepository
  protected readonly cartRepository_: typeof CartRepository
  protected readonly productVariantService_: ProductVariantService
  protected readonly productService_: ProductService
  protected readonly regionService_: RegionService
  protected readonly lineItemAdjustmentService_: LineItemAdjustmentService

  constructor({
    manager,
    lineItemRepository,
    lineItemTaxLineRepository,
    productVariantService,
    productService,
    pricingService,
    regionService,
    cartRepository,
    lineItemAdjustmentService,
  }: InjectedDependencies) {
    super()

    this.manager_ = manager
    this.lineItemRepository_ = lineItemRepository
    this.itemTaxLineRepo_ = lineItemTaxLineRepository
    this.productVariantService_ = productVariantService
    this.productService_ = productService
    this.pricingService_ = pricingService
    this.regionService_ = regionService
    this.cartRepository_ = cartRepository
    this.lineItemAdjustmentService_ = lineItemAdjustmentService
  }

  withTransaction(transactionManager: EntityManager): LineItemService {
    if (!transactionManager) {
      return this
    }

    const cloned = new LineItemService({
      manager: transactionManager,
      lineItemRepository: this.lineItemRepository_,
      lineItemTaxLineRepository: this.itemTaxLineRepo_,
      productVariantService: this.productVariantService_,
      productService: this.productService_,
      pricingService: this.pricingService_,
      regionService: this.regionService_,
      cartRepository: this.cartRepository_,
      lineItemAdjustmentService: this.lineItemAdjustmentService_,
    })

    cloned.transactionManager_ = transactionManager

    return cloned
  }

  async list(
    selector,
    config: FindConfig<LineItem> = {
      skip: 0,
      take: 50,
      order: { created_at: "DESC" },
    }
  ): Promise<LineItem[]> {
    const manager = this.manager_
    const lineItemRepo = manager.getCustomRepository(this.lineItemRepository_)
    const query = this.buildQuery_(selector, config)
    return await lineItemRepo.find(query)
  }

  /**
   * Retrieves a line item by its id.
   * @param {string} id - the id of the line item to retrieve
   * @param {object} config - the config to be used at query building
   * @return {Promise<LineItem | never>} the line item
   */
  async retrieve(id: string, config = {}): Promise<LineItem | never> {
    const manager = this.manager_
    const lineItemRepository = manager.getCustomRepository(
      this.lineItemRepository_
    )

    const validatedId = this.validateId_(id)
    const query = this.buildQuery_({ id: validatedId }, config)

    const lineItem = await lineItemRepository.findOne(query)

    if (!lineItem) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Line item with ${id} was not found`
      )
    }

    return lineItem
  }

  /**
   * Creates return line items for a given cart based on the return items in a
   * return.
   * @param {string} returnId - the id to generate return items from.
   * @param {string} cartId - the cart to assign the return line items to.
   * @return {Promise<LineItem[]>} the created line items
   */
  async createReturnLines(
    returnId: string,
    cartId: string
  ): Promise<LineItem[]> {
    return await this.atomicPhase_(
      async (transactionManager: EntityManager) => {
        const lineItemRepo = transactionManager.getCustomRepository(
          this.lineItemRepository_
        )

        const itemTaxLineRepo = transactionManager.getCustomRepository(
          this.itemTaxLineRepo_
        )

        const returnLineItems = await lineItemRepo
          .findByReturn(returnId)
          .then((lineItems) => {
            return lineItems.map((lineItem) =>
              lineItemRepo.create({
                cart_id: cartId,
                thumbnail: lineItem.thumbnail,
                is_return: true,
                title: lineItem.title,
                variant_id: lineItem.variant_id,
                unit_price: -1 * lineItem.unit_price,
                quantity: lineItem.return_item.quantity,
                allow_discounts: lineItem.allow_discounts,
                tax_lines: lineItem.tax_lines.map((taxLine) => {
                  return itemTaxLineRepo.create({
                    name: taxLine.name,
                    code: taxLine.code,
                    rate: taxLine.rate,
                    metadata: taxLine.metadata,
                  })
                }),
                metadata: lineItem.metadata,
                adjustments: lineItem.adjustments.map((adjustment) => {
                  return {
                    amount: -1 * adjustment.amount,
                    description: adjustment.description,
                    discount_id: adjustment.discount_id,
                    metadata: adjustment.metadata,
                  }
                }),
              })
            )
          })

        return await lineItemRepo.save(returnLineItems)
      }
    )
  }

  async generate(
    variantId: string,
    regionId: string,
    quantity: number,
    context: {
      unit_price?: number
      metadata?: Record<string, unknown>
      customer_id?: string
      cart?: Cart
    } = {}
  ): Promise<LineItem> {
    return await this.atomicPhase_(
      async (transactionManager: EntityManager) => {
        const [variant, region] = await Promise.all([
          this.productVariantService_
            .withTransaction(transactionManager)
            .retrieve(variantId, {
              relations: ["product"],
            }),
          this.regionService_
            .withTransaction(transactionManager)
            .retrieve(regionId),
        ])

        let unit_price = Number(context.unit_price) < 0 ? 0 : context.unit_price
        let shouldMerge = false

        if (context.unit_price === undefined || context.unit_price === null) {
          shouldMerge = true
          const variantPricing = await this.pricingService_
            .withTransaction(transactionManager)
            .getProductVariantPricingById(variant.id, {
              region_id: region.id,
              quantity: quantity,
              customer_id: context?.customer_id,
              include_discount_prices: true,
            })
          unit_price = variantPricing.calculated_price
        }

        const rawLineItem: Partial<LineItem> = {
          unit_price: unit_price,
          title: variant.product.title,
          description: variant.title,
          thumbnail: variant.product.thumbnail,
          variant_id: variant.id,
          quantity: quantity || 1,
          allow_discounts: variant.product.discountable,
          is_giftcard: variant.product.is_giftcard,
          metadata: context?.metadata || {},
          should_merge: shouldMerge,
        }

        const lineItemRepo = transactionManager.getCustomRepository(
          this.lineItemRepository_
        )
        const lineItem = lineItemRepo.create(rawLineItem)

        if (context.cart) {
          const adjustments = await this.lineItemAdjustmentService_
            .withTransaction(transactionManager)
            .generateAdjustments(context.cart, lineItem, { variant })
          lineItem.adjustments = adjustments as unknown as LineItemAdjustment[]
        }

        return lineItem
      }
    )
  }

  /**
   * Create a line item
   * @param {Partial<LineItem>} data - the line item object to create
   * @return {Promise<LineItem>} the created line item
   */
  async create(data: Partial<LineItem>): Promise<LineItem> {
    return await this.atomicPhase_(
      async (transactionManager: EntityManager) => {
        const lineItemRepository = transactionManager.getCustomRepository(
          this.lineItemRepository_
        )

        const lineItem = lineItemRepository.create(data)
        return await lineItemRepository.save(lineItem)
      }
    )
  }

  /**
   * Updates a line item
   * @param {string} id - the id of the line item to update
   * @param {Partial<LineItem>} data - the properties to update on line item
   * @return {Promise<LineItem>} the update line item
   */
  async update(id: string, data: Partial<LineItem>): Promise<LineItem> {
    const { metadata, ...rest } = data

    return await this.atomicPhase_(
      async (transactionManager: EntityManager) => {
        const lineItemRepository = transactionManager.getCustomRepository(
          this.lineItemRepository_
        )

        const lineItem = await this.retrieve(id).then((lineItem) => {
          const lineItemMetadata = metadata
            ? this.setMetadata_(lineItem, metadata)
            : lineItem.metadata

          return Object.assign(lineItem, {
            ...rest,
            metadata: lineItemMetadata,
          })
        })
        return await lineItemRepository.save(lineItem)
      }
    )
  }

  /**
   * Deletes a line item.
   * @param {string} id - the id of the line item to delete
   * @return {Promise<LineItem | undefined>} the result of the delete operation
   */
  async delete(id: string): Promise<LineItem | undefined> {
    return await this.atomicPhase_(
      async (transactionManager: EntityManager) => {
        const lineItemRepository = transactionManager.getCustomRepository(
          this.lineItemRepository_
        )

        return await lineItemRepository
          .findOne({ where: { id } })
          .then((lineItem) => lineItem && lineItemRepository.remove(lineItem))
      }
    )
  }
}

export default LineItemService
