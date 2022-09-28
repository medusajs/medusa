import { MedusaError } from "medusa-core-utils"
import { BaseService } from "medusa-interfaces"
import { EntityManager, In } from "typeorm"
import { DeepPartial } from "typeorm/common/DeepPartial"

import { CartRepository } from "../repositories/cart"
import { LineItemRepository } from "../repositories/line-item"
import { LineItemTaxLineRepository } from "../repositories/line-item-tax-line"
import { Cart, LineItemTaxLine, LineItem, LineItemAdjustment } from "../models"
import { FindConfig, Selector } from "../types/common"
import { FlagRouter } from "../utils/flag-router"
import LineItemAdjustmentService from "./line-item-adjustment"
import OrderEditingFeatureFlag from "../loaders/feature-flags/order-editing"
import TaxInclusivePricingFeatureFlag from "../loaders/feature-flags/tax-inclusive-pricing"
import {
  PricingService,
  ProductService,
  ProductVariantService,
  RegionService,
} from "./index"

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
  featureFlagRouter: FlagRouter
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
  protected readonly pricingService_: PricingService
  protected readonly regionService_: RegionService
  protected readonly featureFlagRouter_: FlagRouter
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
    featureFlagRouter,
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
    this.featureFlagRouter_ = featureFlagRouter
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
      featureFlagRouter: this.featureFlagRouter_,
    })

    cloned.transactionManager_ = transactionManager

    return cloned
  }

  async list(
    selector: Selector<LineItem>,
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
      includes_tax?: boolean
      metadata?: Record<string, unknown>
      customer_id?: string
      order_edit_id?: string
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

        let unitPriceIncludesTax = false

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

          unitPriceIncludesTax = !!variantPricing.calculated_price_includes_tax

          unit_price = variantPricing.calculated_price ?? undefined
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

        if (
          this.featureFlagRouter_.isFeatureEnabled(
            TaxInclusivePricingFeatureFlag.key
          )
        ) {
          rawLineItem.includes_tax = unitPriceIncludesTax
        }

        if (
          this.featureFlagRouter_.isFeatureEnabled(OrderEditingFeatureFlag.key)
        ) {
          rawLineItem.order_edit_id = context.order_edit_id || null
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

  /**
   * Create a line item tax line.
   * @param args - tax line partial passed to the repo create method
   * @return a new line item tax line
   */
  public createTaxLine(args: DeepPartial<LineItemTaxLine>): LineItemTaxLine {
    const itemTaxLineRepo = this.manager_.getCustomRepository(
      this.itemTaxLineRepo_
    )

    return itemTaxLineRepo.create(args)
  }

  async cloneTo(
    ids: string | string[],
    data: DeepPartial<LineItem> = {},
    options: { setOriginalLineItemId?: boolean } = {
      setOriginalLineItemId: true,
    }
  ): Promise<LineItem[]> {
    ids = typeof ids === "string" ? [ids] : ids
    return await this.atomicPhase_(async (manager) => {
      let lineItems: DeepPartial<LineItem>[] = await this.list(
        {
          id: In(ids as string[]),
        },
        {
          relations: ["tax_lines", "adjustments"],
        }
      )

      const lineItemRepository = manager.getCustomRepository(
        this.lineItemRepository_
      )

      const {
        order_id,
        swap_id,
        claim_order_id,
        cart_id,
        order_edit_id,
        ...lineItemData
      } = data

      if (
        !order_id &&
        !swap_id &&
        !claim_order_id &&
        !cart_id &&
        !order_edit_id
      ) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          "Unable to clone a line item that is not attached to at least one of: order_edit, order, swap, claim or cart."
        )
      }

      lineItems = lineItems.map((item) => ({
        ...item,
        ...lineItemData,
        id: undefined,
        order_id,
        swap_id,
        claim_order_id,
        cart_id,
        order_edit_id,
        original_item_id: options?.setOriginalLineItemId ? item.id : undefined,
        tax_lines: item.tax_lines?.map((tax_line) => ({
          ...tax_line,
          id: undefined,
          item_id: undefined,
        })),
        adjustments: item.adjustments?.map((adj) => ({
          ...adj,
          id: undefined,
          item_id: undefined,
        })),
      }))

      const clonedLineItemEntities = lineItemRepository.create(lineItems)
      return await lineItemRepository.save(clonedLineItemEntities)
    })
  }
}

export default LineItemService
