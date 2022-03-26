import { MedusaError } from "medusa-core-utils"
import { BaseService } from "medusa-interfaces"
import { EntityManager } from "typeorm"
import { LineItemRepository } from "../repositories/line-item"
import { LineItemTaxLineRepository } from "../repositories/line-item-tax-line"
import { ProductService, RegionService, ProductVariantService } from "./index"
import { CartRepository } from "../repositories/cart"
import { LineItem } from "../models/line-item"

type InjectedDependencies = {
  manager: EntityManager;
  lineItemRepository: typeof LineItemRepository;
  lineItemTaxLineRepository: typeof LineItemTaxLineRepository;
  cartRepository: typeof CartRepository;
  productVariantService: ProductVariantService;
  productService: ProductService;
  regionService: RegionService;
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

  constructor(
    {
      manager,
      lineItemRepository,
      lineItemTaxLineRepository,
      productVariantService,
      productService,
      regionService,
      cartRepository
    }: InjectedDependencies
  ) {
    super()

    this.manager_ = manager
    this.lineItemRepository_ = lineItemRepository
    this.itemTaxLineRepo_ = lineItemTaxLineRepository
    this.productVariantService_ = productVariantService
    this.productService_ = productService
    this.regionService_ = regionService
    this.cartRepository_ = cartRepository
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
      regionService: this.regionService_,
      cartRepository: this.cartRepository_
    })

    cloned.transactionManager_ = transactionManager

    return cloned
  }

  async list(
    selector,
    config = { skip: 0, take: 50, order: { created_at: "DESC" } },
  ): Promise<LineItem[]> {
    const lineItemRepo = this.manager_.getCustomRepository(this.lineItemRepository_)
    const query = this.buildQuery_(selector, config)
    return lineItemRepo.find(query)
  }

  /**
   * Retrieves a line item by its id.
   * @param {string} id - the id of the line item to retrieve
   * @param {object} config - the config to be used at query building
   * @return {Promise<LineItem | never>} the line item
   */
  async retrieve(id: string, config = {}): Promise<LineItem | never> {
    const lineItemRepository = this.manager_.getCustomRepository(
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
  async createReturnLines(returnId: string, cartId: string): Promise<LineItem[]> {
    const lineItemRepo = this.manager_.getCustomRepository(
      this.lineItemRepository_
    )

    const itemTaxLineRepo = this.manager_.getCustomRepository(
      this.itemTaxLineRepo_
    )

    const returnLineItems = await lineItemRepo.findByReturn(returnId)
      .then(lineItems => {
        return lineItems.map(lineItem =>
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
          })
        )
      })

    return await lineItemRepo.save(returnLineItems)
  }

  async generate(
    variantId: string,
    regionId: string,
    quantity: number,
    config: {
      unit_price?: number;
      metadata?: Record<string, unknown>;
      customer_id?: string
    } = {}
  ): Promise<LineItem> {
    return this.atomicPhase_(async (manager: EntityManager) => {
      const [variant, region] = await Promise.all([
        this.productVariantService_.withTransaction(manager).retrieve(variantId, {
          relations: ["product"],
          include_discount_prices: true,
        }),
        this.regionService_.withTransaction(manager).retrieve(regionId),
      ])

      let unit_price = Number(config.unit_price) < 0 ? 0 : config.unit_price
      let shouldMerge = false

      if (config.unit_price === undefined || config.unit_price === null) {
        shouldMerge = true;
        unit_price = await this.productVariantService_
          .withTransaction(manager)
          .getRegionPrice(variant.id, {
            regionId: region.id,
            quantity: quantity,
            customer_id: config?.customer_id,
            include_discount_prices: true,
          })
      }

      return {
        unit_price,
        title: variant.product.title,
        description: variant.title,
        thumbnail: variant.product.thumbnail,
        variant_id: variant.id,
        quantity: quantity || 1,
        allow_discounts: variant.product.discountable,
        is_giftcard: variant.product.is_giftcard,
        metadata: config?.metadata || {},
        should_merge: shouldMerge,
      }
    })
  }

  /**
   * Create a line item
   * @param {Partial<LineItem>} data - the line item object to create
   * @return {Promise<LineItem>} the created line item
   */
  async create(data: Partial<LineItem>): Promise<LineItem> {
    return this.atomicPhase_(async (manager: EntityManager) => {
      const lineItemRepository = manager.getCustomRepository(
        this.lineItemRepository_
      )

      const lineItem = lineItemRepository.create(data)
      return await lineItemRepository.save(lineItem)
    })
  }

  /**
   * Updates a line item
   * @param {string} id - the id of the line item to update
   * @param {Partial<LineItem>} data - the properties to update on line item
   * @return {Promise<LineItem>} the update line item
   */
  async update(id: string, data: Partial<LineItem>): Promise<LineItem> {
    const { metadata, ...rest } = data

    return this.atomicPhase_(async (manager: EntityManager) => {
      const lineItemRepository = manager.getCustomRepository(
        this.lineItemRepository_
      )

      const lineItem = await this.retrieve(id)
        .then(lineItem => {
          const lineItemMetadata = !!metadata
              ? this.setMetadata_(lineItem, metadata)
              : lineItem.metadata

          return Object.assign(lineItem, {
            ...rest,
            metadata: lineItemMetadata
          });
        })
      return await lineItemRepository.save(lineItem)
    })
  }

  /**
   * Deletes a line item.
   * @param {string} id - the id of the line item to delete
   * @return {Promise<LineItem | undefined>} the result of the delete operation
   */
  async delete(id: string): Promise<LineItem | undefined> {
    return this.atomicPhase_(async (manager: EntityManager) => {
      const lineItemRepository = manager.getCustomRepository(
        this.lineItemRepository_
      )

      return await lineItemRepository
        .findOne({ where: { id } })
        .then(lineItem => lineItem && lineItemRepository.remove(lineItem))
    })
  }
}

export default LineItemService
