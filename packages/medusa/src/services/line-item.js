import { MedusaError } from "medusa-core-utils"
import { BaseService } from "medusa-interfaces"

/**
 * Provides layer to manipulate line items.
 * @extends BaseService
 */
class LineItemService extends BaseService {
  constructor({
    manager,
    lineItemRepository,
    lineItemTaxLineRepository,
    productVariantService,
    productService,
    regionService,
    cartRepository,
  }) {
    super()

    /** @private @const {EntityManager} */
    this.manager_ = manager

    /** @private @const {LineItemRepository} */
    this.lineItemRepository_ = lineItemRepository

    /** @private @const {typeof LineItemTaxLineRepository} */
    this.itemTaxLineRepo_ = lineItemTaxLineRepository

    /** @private @const {ProductVariantService} */
    this.productVariantService_ = productVariantService

    /** @private @const {ProductService} */
    this.productService_ = productService

    /** @private @const {RegionService} */
    this.regionService_ = regionService

    /** @private @const {CartRepository} */
    this.cartRepository_ = cartRepository
  }

  withTransaction(transactionManager) {
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
      cartRepository: this.cartRepository_,
    })

    cloned.transactionManager_ = transactionManager

    return cloned
  }

  async list(
    selector,
    config = { skip: 0, take: 50, order: { created_at: "DESC" } }
  ) {
    const liRepo = this.manager_.getCustomRepository(this.lineItemRepository_)
    const query = this.buildQuery_(selector, config)
    return liRepo.find(query)
  }

  /**
   * Retrieves a line item by its id.
   * @param {string} id - the id of the line item to retrieve
   * @param {object} config - the config to be used at query building
   * @return {LineItem} the line item
   */
  async retrieve(id, config = {}) {
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
  async createReturnLines(returnId, cartId) {
    const lineItemRepo = this.manager_.getCustomRepository(
      this.lineItemRepository_
    )

    const itemTaxLineRepo = this.manager_.getCustomRepository(
      this.itemTaxLineRepo_
    )

    const items = await lineItemRepo.findByReturn(returnId)

    const toCreate = items.map((i) =>
      lineItemRepo.create({
        cart_id: cartId,
        thumbnail: i.thumbnail,
        is_return: true,
        title: i.title,
        variant_id: i.variant_id,
        unit_price: -1 * i.unit_price,
        quantity: i.return_item.quantity,
        allow_discounts: i.allow_discounts,
        tax_lines: i.tax_lines.map((tl) => {
          return itemTaxLineRepo.create({
            name: tl.name,
            code: tl.code,
            rate: tl.rate,
            metadata: tl.metadata,
          })
        }),
        metadata: i.metadata,
      })
    )

    return await lineItemRepo.save(toCreate)
  }

  async generate(variantId, regionId, quantity, config = {}) {
    return this.atomicPhase_(async (manager) => {
      const variant = await this.productVariantService_
        .withTransaction(manager)
        .retrieve(variantId, {
          relations: ["product"],
        })

      const region = await this.regionService_
        .withTransaction(manager)
        .retrieve(regionId)

      let price
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
   * @param {LineItem} lineItem - the line item object to create
   * @return {LineItem} the created line item
   */
  async create(lineItem) {
    return this.atomicPhase_(async (manager) => {
      const lineItemRepository = manager.getCustomRepository(
        this.lineItemRepository_
      )

      const created = await lineItemRepository.create(lineItem)
      const result = await lineItemRepository.save(created)
      return result
    })
  }

  /**
   * Updates a line item
   * @param {string} id - the id of the line item to update
   * @param {object} update - the properties to update on line item
   * @return {LineItem} the update line item
   */
  async update(id, update) {
    return this.atomicPhase_(async (manager) => {
      const lineItemRepository = manager.getCustomRepository(
        this.lineItemRepository_
      )

      const lineItem = await this.retrieve(id)

      const { metadata, ...rest } = update

      if (metadata) {
        lineItem.metadata = this.setMetadata_(lineItem, metadata)
      }

      for (const [key, value] of Object.entries(rest)) {
        lineItem[key] = value
      }

      const result = await lineItemRepository.save(lineItem)
      return result
    })
  }

  /**
   * Deletes a line item.
   * @param {string} id - the id of the line item to delete
   * @return {Promise} the result of the delete operation
   */
  async delete(id) {
    return this.atomicPhase_(async (manager) => {
      const lineItemRepository = manager.getCustomRepository(
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
