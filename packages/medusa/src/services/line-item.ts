import { MedusaError } from "medusa-core-utils"
import { EntityManager, In } from "typeorm"
import { DeepPartial } from "typeorm/common/DeepPartial"

import { CartRepository } from "../repositories/cart"
import { LineItemRepository } from "../repositories/line-item"
import { LineItemTaxLineRepository } from "../repositories/line-item-tax-line"
import {
  LineItem,
  LineItemAdjustment,
  LineItemTaxLine,
  ProductVariant,
} from "../models"
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
  TaxProviderService,
} from "./index"
import { buildQuery, isString, setMetadata } from "../utils"
import { TransactionBaseService } from "../interfaces"
import { GenerateContext, GenerateInputData } from "../types/line-item"

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
  taxProviderService: TaxProviderService
  featureFlagRouter: FlagRouter
}

class LineItemService extends TransactionBaseService {
  protected manager_: EntityManager
  protected transactionManager_: EntityManager | undefined

  protected readonly lineItemRepository_: typeof LineItemRepository
  protected readonly itemTaxLineRepo_: typeof LineItemTaxLineRepository
  protected readonly cartRepository_: typeof CartRepository
  protected readonly productVariantService_: ProductVariantService
  protected readonly productService_: ProductService
  protected readonly pricingService_: PricingService
  protected readonly regionService_: RegionService
  protected readonly featureFlagRouter_: FlagRouter
  protected readonly lineItemAdjustmentService_: LineItemAdjustmentService
  protected readonly taxProviderService_: TaxProviderService

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
    taxProviderService,
    featureFlagRouter,
  }: InjectedDependencies) {
    super(arguments[0])

    this.manager_ = manager
    this.lineItemRepository_ = lineItemRepository
    this.itemTaxLineRepo_ = lineItemTaxLineRepository
    this.productVariantService_ = productVariantService
    this.productService_ = productService
    this.pricingService_ = pricingService
    this.regionService_ = regionService
    this.cartRepository_ = cartRepository
    this.lineItemAdjustmentService_ = lineItemAdjustmentService
    this.taxProviderService_ = taxProviderService
    this.featureFlagRouter_ = featureFlagRouter
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
    const query = buildQuery(selector, config)
    return await lineItemRepo.find(query)
  }

  /**
   * Retrieves a line item by its id.
   * @param id - the id of the line item to retrieve
   * @param config - the config to be used at query building
   * @return the line item
   */
  async retrieve(id: string, config = {}): Promise<LineItem | never> {
    const manager = this.manager_
    const lineItemRepository = manager.getCustomRepository(
      this.lineItemRepository_
    )

    const query = buildQuery({ id }, config)

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
   * @param returnId - the id to generate return items from.
   * @param cartId - the cart to assign the return line items to.
   * @return the created line items
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

  async generate<
    T = string | GenerateInputData | GenerateInputData[],
    TResult = T extends string
      ? LineItem
      : T extends LineItem
      ? LineItem
      : LineItem[]
  >(
    variantIdOrData: string | T,
    regionIdOrContext: T extends string ? string : GenerateContext,
    quantity?: number,
    context: GenerateContext = {}
  ): Promise<TResult> {
    return await this.atomicPhase_(
      async (transactionManager: EntityManager) => {
        let data = variantIdOrData as unknown as GenerateInputData
        let resolvedContext = regionIdOrContext as GenerateContext

        if (isString(variantIdOrData)) {
          if (!quantity || !regionIdOrContext || !isString(regionIdOrContext)) {
            throw new MedusaError(
              MedusaError.Types.UNEXPECTED_STATE,
              "The generate method has been called with a variant id but one of the argument quantity or regionId is missing. Please, provide the variantId, quantity and regionId."
            )
          }

          data = {
            variantId: variantIdOrData,
            quantity: quantity,
            regionId: regionIdOrContext as string,
          }

          resolvedContext = context
        }

        const isDataAnArray = Array.isArray(data)
        const data_ = (isDataAnArray ? data : [data]) as GenerateInputData[]

        const variants = await this.productVariantService_.list(
          {
            id: data_.map((d) => d.variantId),
          },
          {
            relations: ["product"],
          }
        )

        const variantsMap = new Map<string, ProductVariant>()
        variants.forEach((variant) => {
          variantsMap.set(variant.id, variant)
        })

        const generatedItems: LineItem[] = []

        for (const generateData of data_) {
          const variant = variantsMap.get(
            generateData.variantId
          ) as ProductVariant
          const { quantity, regionId } = generateData

          let unit_price =
            Number(resolvedContext.unit_price) < 0
              ? 0
              : resolvedContext.unit_price

          let unitPriceIncludesTax = false

          let shouldMerge = false

          if (
            resolvedContext.unit_price === undefined ||
            resolvedContext.unit_price === null
          ) {
            shouldMerge = true
            const variantPricing = await this.pricingService_
              .withTransaction(transactionManager)
              .getProductVariantPricingById(variant.id, {
                region: resolvedContext.region,
                variant,
                region_id: regionId,
                quantity: quantity,
                customer_id: context?.customer_id,
                include_discount_prices: true,
              })

            unitPriceIncludesTax =
              !!variantPricing?.calculated_price_includes_tax

            unit_price = variantPricing?.calculated_price ?? undefined
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
            this.featureFlagRouter_.isFeatureEnabled(
              OrderEditingFeatureFlag.key
            )
          ) {
            rawLineItem.order_edit_id = resolvedContext.order_edit_id || null
          }

          const lineItemRepo = transactionManager.getCustomRepository(
            this.lineItemRepository_
          )

          const lineItem = lineItemRepo.create(rawLineItem)
          lineItem.variant = variant

          if (resolvedContext.cart) {
            const adjustments = await this.lineItemAdjustmentService_
              .withTransaction(transactionManager)
              .generateAdjustments(resolvedContext.cart, lineItem, { variant })
            lineItem.adjustments =
              adjustments as unknown as LineItemAdjustment[]
          }

          generatedItems.push(lineItem)
        }

        return (isDataAnArray
          ? generatedItems
          : generatedItems[0]) as unknown as TResult
      }
    )
  }

  /**
   * Create a line item
   * @param data - the line item object to create
   * @return the created line item
   */
  async create<
    T = LineItem | LineItem[],
    TResult = T extends LineItem ? LineItem : LineItem[]
  >(data: T): Promise<TResult> {
    return await this.atomicPhase_(
      async (transactionManager: EntityManager) => {
        const lineItemRepository = transactionManager.getCustomRepository(
          this.lineItemRepository_
        )

        const isDataAnArray = Array.isArray(data)
        const data_ = !isDataAnArray ? [data] : data

        const items = lineItemRepository.create(data_)
        const lineItems = await lineItemRepository.save(items)

        return (!isDataAnArray ? lineItems[0] : lineItems) as unknown as TResult
      }
    )
  }

  /**
   * Updates a line item
   * @param idOrSelector - the id or selector of the line item(s) to update
   * @param data - the properties to update the line item(s)
   * @return the updated line item(s)
   */
  async update(
    idOrSelector: string | Selector<LineItem>,
    data: Partial<LineItem>
  ): Promise<LineItem[]> {
    const { metadata, ...rest } = data

    return await this.atomicPhase_(
      async (transactionManager: EntityManager) => {
        const lineItemRepository = transactionManager.getCustomRepository(
          this.lineItemRepository_
        )

        const selector =
          typeof idOrSelector === "string" ? { id: idOrSelector } : idOrSelector

        let lineItems = await this.list(selector)

        if (!lineItems.length) {
          const selectorConstraints = Object.entries(selector)
            .map(([key, value]) => `${key}: ${value}`)
            .join(", ")

          throw new MedusaError(
            MedusaError.Types.NOT_FOUND,
            `Line item with ${selectorConstraints} was not found`
          )
        }

        lineItems = lineItems.map((item) => {
          item.metadata = metadata ? setMetadata(item, metadata) : item.metadata
          return Object.assign(item, rest)
        })

        return await lineItemRepository.save(lineItems)
      }
    )
  }

  /**
   * Deletes a line item.
   * @param id - the id of the line item to delete
   * @return the result of the delete operation
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
   * Deletes a line item with the tax lines.
   * @param id - the id of the line item to delete
   * @return the result of the delete operation
   */
  async deleteWithTaxLines(id: string): Promise<LineItem | undefined> {
    return await this.atomicPhase_(
      async (transactionManager: EntityManager) => {
        const lineItemRepository = transactionManager.getCustomRepository(
          this.lineItemRepository_
        )

        await this.taxProviderService_
          .withTransaction(transactionManager)
          .clearLineItemsTaxLines([id])

        return await this.delete(id)
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
