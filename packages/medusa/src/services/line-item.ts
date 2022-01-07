import { MedusaError } from "medusa-core-utils"
import { BaseService } from "medusa-interfaces"
import { DeepPartial, EntityManager } from "typeorm"
import { ProductService, ProductVariantService, RegionService } from "."
import { LineItem, ShippingMethod } from ".."
import { CartRepository } from "../repositories/cart"
import { LineItemRepository } from "../repositories/line-item"
import {
  CreateLineItemDto,
  GenerateConfig,
  UpdateLineItemDto,
} from "../types/line-item"
import { FindConfig } from "../types/common"
/**
 * Provides layer to manipulate line items.
 * @extends BaseService
 */

export type LineItemServiceProps = {
  manager: EntityManager
  lineItemRepository: typeof LineItemRepository
  productVariantService: ProductVariantService
  productService: ProductService
  regionService: RegionService
  cartRepository: typeof CartRepository
}
class LineItemService extends BaseService {
  private manager_: EntityManager
  private lineItemRepository_: typeof LineItemRepository
  private productVariantService_: ProductVariantService
  private productService_: ProductService
  private regionService_: RegionService
  private cartRepository_: typeof CartRepository

  constructor({
    manager,
    lineItemRepository,
    productVariantService,
    productService,
    regionService,
    cartRepository,
  }: LineItemServiceProps) {
    super()

    /** @private @const {EntityManager} */
    this.manager_ = manager

    /** @private @const {LineItemRepository} */
    this.lineItemRepository_ = lineItemRepository

    /** @private @const {ProductVariantService} */
    this.productVariantService_ = productVariantService

    /** @private @const {ProductService} */
    this.productService_ = productService

    /** @private @const {RegionService} */
    this.regionService_ = regionService

    /** @private @const {CartRepository} */
    this.cartRepository_ = cartRepository
  }

  withTransaction(transactionManager: EntityManager): LineItemService {
    if (!transactionManager) {
      return this
    }

    const cloned = new LineItemService({
      manager: transactionManager,
      lineItemRepository: this.lineItemRepository_,
      productVariantService: this.productVariantService_,
      productService: this.productService_,
      regionService: this.regionService_,
      cartRepository: this.cartRepository_,
    })

    cloned.transactionManager_ = transactionManager

    return cloned
  }

  async list(
    selector,
    config = { skip: 0, take: 50, order: { created_at: "DESC" } }
  ): Promise<LineItem[]> {
    const liRepo = this.manager_.getCustomRepository(this.lineItemRepository_)
    const query = this.buildQuery_(selector, config)
    return liRepo.find(query)
  }

  /**
   * Retrieves a line item by its id.
   * @param id - the id of the line item to retrieve
   * @param config - the config to be used at query building
   * @return the line item
   */
  async retrieve(
    id: string,
    config: FindConfig<LineItem> = {}
  ): Promise<LineItem> {
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
   * @param variantId the variant on the lineitem
   * @param regionId Region of the order
   * @param quantity quantity of the item on the lineitem
   * @param config configuration for generating the lineitem
   * @return the generated lineitem
   */
  async generate(
    variantId: string,
    regionId: string,
    quantity: number,
    config: GenerateConfig = {}
  ): Promise<LineItem> {
    return this.atomicPhase_(async (manager) => {
      const variant = await this.productVariantService_
        .withTransaction(manager)
        .retrieve(variantId, {
          relations: ["product"],
        })

      const region = await this.regionService_
        .withTransaction(manager)
        .retrieve(regionId)

      let price: number
      let shouldMerge = true

      if (config.unit_price !== undefined && config.unit_price !== null) {
        // if custom unit_price, we ensure positive values
        // and we choose to not merge the items
        shouldMerge = false
        if (config.unit_price < 0) {
          price = 0
        } else {
          price = config.unit_price
        }
      } else {
        price = await this.productVariantService_
          .withTransaction(manager)
          .getRegionPrice(variant.id, region.id)
      }

      const toCreate = {
        unit_price: price,
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

      return toCreate
    })
  }

  /**
   * Create a line item
   * @param lineItem - the line item object to create
   * @return the created line item
   */
  async create(lineItem: CreateLineItemDto): Promise<LineItem> {
    return this.atomicPhase_(async (manager) => {
      const lineItemRepository: LineItemRepository = manager.getCustomRepository(
        this.lineItemRepository_
      )

      const created = await lineItemRepository.create(lineItem)
      const result = await lineItemRepository.save(created)
      return result
    })
  }

  /**
   * Updates a line item
   * @param id - the id of the line item to update
   * @param update - the properties to update on line item
   * @return the update line item
   */
  async update(id: string, update: UpdateLineItemDto): Promise<LineItem> {
    return this.atomicPhase_(async (manager) => {
      const lineItemRepository: LineItemRepository = manager.getCustomRepository(
        this.lineItemRepository_
      )

      const lineItem = await this.retrieve(id)

      const { metadata, ...rest } = update

      if (metadata) {
        lineItem.metadata = this.setMetadata_(lineItem, metadata)
      }

      for (const [key, value] of Object.entries(rest)) {
        if (typeof value !== "undefined") {
          lineItem[key] = value
        }
      }

      const result = await lineItemRepository.save(lineItem)
      return result
    })
  }

  /**
   * Updates a line item
   * @param lineItems - the id of the line item to update
   * @param shippingMethods - the properties to update on line item
   * @return the update line item
   */
  async updateHasShipping(
    lineItems: LineItem[],
    shippingMethods: ShippingMethod[]
  ): Promise<LineItem[]> {
    return this.atomicPhase_(async (manager) => {
      const lineItemRepository: LineItemRepository = manager.getCustomRepository(
        this.lineItemRepository_
      )

      const shippingProfiles = shippingMethods.map(
        (sm) => sm.shipping_option.profile_id
      )

      lineItems.forEach((li) => {
        li.has_shipping =
          shippingProfiles.find(
            (sp) => sp === li.variant?.product?.profile_id
          ) !== undefined
      })

      const result = await lineItemRepository.save(lineItems)
      return result
    })
  }

  /**
   * Deletes a line item.
   * @param id - the id of the line item to delete
   * @return the result of the delete operation
   */
  async delete(id: string): Promise<void> {
    return this.atomicPhase_(async (manager) => {
      const lineItemRepository: LineItemRepository = manager.getCustomRepository(
        this.lineItemRepository_
      )

      const lineItem = await lineItemRepository.findOne({ where: { id } })

      if (!lineItem) {
        return Promise.resolve()
      }

      await lineItemRepository.remove(lineItem)

      return Promise.resolve()
    })
  }
}

export default LineItemService
