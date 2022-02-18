import { MedusaError } from "medusa-core-utils"
import { BaseService } from "medusa-interfaces"
import { Brackets } from "typeorm"

/**
 * Provides layer to manipulate products.
 * @extends BaseService
 */
class ProductService extends BaseService {
  static IndexName = `products`
  static Events = {
    UPDATED: "product.updated",
    CREATED: "product.created",
    DELETED: "product.deleted",
  }

  constructor({
    manager,
    productRepository,
    productVariantRepository,
    productOptionRepository,
    eventBusService,
    productVariantService,
    productCollectionService,
    productTypeRepository,
    productTagRepository,
    imageRepository,
    searchService,
  }) {
    super()

    /** @private @const {EntityManager} */
    this.manager_ = manager

    /** @private @const {ProductOption} */
    this.productOptionRepository_ = productOptionRepository

    /** @private @const {Product} */
    this.productRepository_ = productRepository

    /** @private @const {ProductVariant} */
    this.productVariantRepository_ = productVariantRepository

    /** @private @const {EventBus} */
    this.eventBus_ = eventBusService

    /** @private @const {ProductVariantService} */
    this.productVariantService_ = productVariantService

    /** @private @const {ProductCollectionService} */
    this.productCollectionService_ = productCollectionService

    /** @private @const {ProductCollectionService} */
    this.productTypeRepository_ = productTypeRepository

    /** @private @const {ProductCollectionService} */
    this.productTagRepository_ = productTagRepository

    /** @private @const {ImageRepository} */
    this.imageRepository_ = imageRepository

    /** @private @const {SearchService} */
    this.searchService_ = searchService
  }

  withTransaction(transactionManager) {
    if (!transactionManager) {
      return this
    }

    const cloned = new ProductService({
      manager: transactionManager,
      productRepository: this.productRepository_,
      productVariantRepository: this.productVariantRepository_,
      productOptionRepository: this.productOptionRepository_,
      eventBusService: this.eventBus_,
      productVariantService: this.productVariantService_,
      productCollectionService: this.productCollectionService_,
      productTagRepository: this.productTagRepository_,
      productTypeRepository: this.productTypeRepository_,
      imageRepository: this.imageRepository_,
    })

    cloned.transactionManager_ = transactionManager

    return cloned
  }

  /**
   * Lists products based on the provided parameters.
   * @param {object} selector - an object that defines rules to filter products
   *   by
   * @param {object} config - object that defines the scope for what should be
   *   returned
   * @return {Promise<Product[]>} the result of the find operation
   */
  async list(selector = {}, config = { relations: [], skip: 0, take: 20 }) {
    const productRepo = this.manager_.getCustomRepository(
      this.productRepository_
    )

    const { q, query, relations } = this.prepareListQuery_(selector, config)

    if (q) {
      const qb = this.getFreeTextQueryBuilder_(productRepo, query, q)
      const raw = await qb.getMany()
      return productRepo.findWithRelations(
        relations,
        raw.map((i) => i.id),
        query.withDeleted ?? false
      )
    }

    return productRepo.findWithRelations(relations, query)
  }

  /**
   * Lists products based on the provided parameters and includes the count of
   * products that match the query.
   * @param {object} selector - an object that defines rules to filter products
   *   by
   * @param {object} config - object that defines the scope for what should be
   *   returned
   * @return {[Promise<Product[]>, number]} an array containing the products as
   *   the first element and the total count of products that matches the query
   *   as the second element.
   */
  async listAndCount(
    selector = {},
    config = { relations: [], skip: 0, take: 20 }
  ) {
    const productRepo = this.manager_.getCustomRepository(
      this.productRepository_
    )

    const { q, query, relations } = this.prepareListQuery_(selector, config)

    if (q) {
      const qb = this.getFreeTextQueryBuilder_(productRepo, query, q)
      const [raw, count] = await qb.getManyAndCount()

      const products = await productRepo.findWithRelations(
        relations,
        raw.map((i) => i.id),
        query.withDeleted ?? false
      )
      return [products, count]
    }

    return await productRepo.findWithRelationsAndCount(relations, query)
  }

  /**
   * Return the total number of documents in database
   * @param {object} selector - the selector to choose products by
   * @return {Promise} the result of the count operation
   */
  count(selector = {}) {
    const productRepo = this.manager_.getCustomRepository(
      this.productRepository_
    )
    const query = this.buildQuery_(selector)
    return productRepo.count(query)
  }

  /**
   * Gets a product by id.
   * Throws in case of DB Error and if product was not found.
   * @param {string} productId - id of the product to get.
   * @param {object} config - object that defines what should be included in the
   *   query response
   * @return {Promise<Product>} the result of the find one operation.
   */
  async retrieve(productId, config = {}) {
    const productRepo = this.manager_.getCustomRepository(
      this.productRepository_
    )
    const validatedId = this.validateId_(productId)

    const query = { where: { id: validatedId } }

    if (config.relations && config.relations.length > 0) {
      query.relations = config.relations
    }

    if (config.select && config.select.length > 0) {
      query.select = config.select
    }

    const rels = query.relations
    delete query.relations
    const product = await productRepo.findOneWithRelations(rels, query)

    if (!product) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Product with id: ${productId} was not found`
      )
    }

    return product
  }

  /**
   * Gets a product by handle.
   * Throws in case of DB Error and if product was not found.
   * @param {string} productHandle - handle of the product to get.
   * @param {object} config - details about what to get from the product
   * @return {Promise<Product>} the result of the find one operation.
   */
  async retrieveByHandle(productHandle, config = {}) {
    const productRepo = this.manager_.getCustomRepository(
      this.productRepository_
    )

    const query = { where: { handle: productHandle } }

    if (config.relations && config.relations.length > 0) {
      query.relations = config.relations
    }

    if (config.select && config.select.length > 0) {
      query.select = config.select
    }

    const rels = query.relations
    delete query.relations
    const product = await productRepo.findOneWithRelations(rels, query)

    if (!product) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Product with handle: ${productHandle} was not found`
      )
    }

    return product
  }

  /**
   * Gets a product by external id.
   * Throws in case of DB Error and if product was not found.
   * @param {string} externalId - handle of the product to get.
   * @param {object} config - details about what to get from the product
   * @return {Promise<Product>} the result of the find one operation.
   */
  async retrieveByExternalId(externalId, config = {}) {
    const productRepo = this.manager_.getCustomRepository(
      this.productRepository_
    )

    const query = { where: { external_id: externalId } }

    if (config.relations && config.relations.length > 0) {
      query.relations = config.relations
    }

    if (config.select && config.select.length > 0) {
      query.select = config.select
    }

    const rels = query.relations
    delete query.relations
    const product = await productRepo.findOneWithRelations(rels, query)

    if (!product) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Product with exteral_id: ${externalId} was not found`
      )
    }

    return product
  }

  /**
   * Gets all variants belonging to a product.
   * @param {string} productId - the id of the product to get variants from.
   * @return {Promise} an array of variants
   */
  async retrieveVariants(productId) {
    const product = await this.retrieve(productId, { relations: ["variants"] })
    return product.variants
  }

  async listTypes() {
    const productTypeRepository = this.manager_.getCustomRepository(
      this.productTypeRepository_
    )

    return await productTypeRepository.find({})
  }

  async listTagsByUsage(count = 10) {
    const tags = await this.manager_.query(
      `
      SELECT ID, O.USAGE_COUNT, PT.VALUE
      FROM PRODUCT_TAG PT
      LEFT JOIN
        (SELECT COUNT(*) AS USAGE_COUNT,
          PRODUCT_TAG_ID
          FROM PRODUCT_TAGS
          GROUP BY PRODUCT_TAG_ID) O ON O.PRODUCT_TAG_ID = PT.ID
      ORDER BY O.USAGE_COUNT DESC
      LIMIT $1`,
      [count]
    )

    return tags
  }

  async upsertProductType_(type) {
    const productTypeRepository = this.manager_.getCustomRepository(
      this.productTypeRepository_
    )

    if (type === null) {
      return null
    }

    const existing = await productTypeRepository.findOne({
      where: { value: type.value },
    })

    if (existing) {
      return existing.id
    }

    const created = productTypeRepository.create(type)
    const result = await productTypeRepository.save(created)

    return result.id
  }

  async upsertProductTags_(tags) {
    const productTagRepository = this.manager_.getCustomRepository(
      this.productTagRepository_
    )

    const newTags = []
    for (const tag of tags) {
      const existing = await productTagRepository.findOne({
        where: { value: tag.value },
      })

      if (existing) {
        newTags.push(existing)
      } else {
        const created = productTagRepository.create(tag)
        const result = await productTagRepository.save(created)
        newTags.push(result)
      }
    }

    return newTags
  }

  /**
   * Creates a product.
   * @param {object} productObject - the product to create
   * @return {Promise} resolves to the creation result.
   */
  async create(productObject) {
    return this.atomicPhase_(async (manager) => {
      const productRepo = manager.getCustomRepository(this.productRepository_)
      const optionRepo = manager.getCustomRepository(
        this.productOptionRepository_
      )

      const { options, tags, type, images, ...rest } = productObject

      if (!rest.thumbnail && images && images.length) {
        rest.thumbnail = images[0]
      }

      // if product is a giftcard, we should disallow discounts
      if (rest.is_giftcard) {
        rest.discountable = false
      }

      let product = productRepo.create(rest)

      if (images) {
        product.images = await this.upsertImages_(images)
      }

      if (tags) {
        product.tags = await this.upsertProductTags_(tags)
      }

      if (typeof type !== `undefined`) {
        product.type_id = await this.upsertProductType_(type)
      }

      product = await productRepo.save(product)

      product.options = await Promise.all(
        options.map(async (o) => {
          const res = optionRepo.create({ ...o, product_id: product.id })
          await optionRepo.save(res)
          return res
        })
      )

      const result = await this.retrieve(product.id, { relations: ["options"] })

      await this.eventBus_
        .withTransaction(manager)
        .emit(ProductService.Events.CREATED, {
          id: result.id,
        })
      return result
    })
  }

  async upsertImages_(images) {
    const imageRepository = this.manager_.getCustomRepository(
      this.imageRepository_
    )

    const productImages = []
    for (const img of images) {
      const existing = await imageRepository.findOne({
        where: { url: img },
      })

      if (existing) {
        productImages.push(existing)
      } else {
        const created = imageRepository.create({ url: img })
        productImages.push(created)
      }
    }

    return productImages
  }

  /**
   * Updates a product. Product variant updates should use dedicated methods,
   * e.g. `addVariant`, etc. The function will throw errors if metadata or
   * product variant updates are attempted.
   * @param {string} productId - the id of the product. Must be a string that
   *   can be casted to an ObjectId
   * @param {object} update - an object with the update values.
   * @return {Promise} resolves to the update result.
   */
  async update(productId, update) {
    return this.atomicPhase_(async (manager) => {
      const productRepo = manager.getCustomRepository(this.productRepository_)
      const productVariantRepo = manager.getCustomRepository(
        this.productVariantRepository_
      )

      const product = await this.retrieve(productId, {
        relations: ["variants", "tags", "images"],
      })

      const { variants, metadata, images, tags, type, ...rest } = update

      if (!product.thumbnail && !update.thumbnail && images?.length) {
        product.thumbnail = images[0]
      }

      if (images) {
        product.images = await this.upsertImages_(images)
      }

      if (metadata) {
        product.metadata = this.setMetadata_(product, metadata)
      }

      if (typeof type !== `undefined`) {
        product.type_id = await this.upsertProductType_(type)
      }

      if (tags) {
        product.tags = await this.upsertProductTags_(tags)
      }

      if (variants) {
        // Iterate product variants and update their properties accordingly
        for (const variant of product.variants) {
          const exists = variants.find((v) => v.id && variant.id === v.id)
          if (!exists) {
            await productVariantRepo.remove(variant)
          }
        }

        const newVariants = []
        for (const [i, newVariant] of variants.entries()) {
          newVariant.variant_rank = i

          if (newVariant.id) {
            const variant = product.variants.find((v) => v.id === newVariant.id)

            if (!variant) {
              throw new MedusaError(
                MedusaError.Types.NOT_FOUND,
                `Variant with id: ${newVariant.id} is not associated with this product`
              )
            }

            const saved = await this.productVariantService_
              .withTransaction(manager)
              .update(variant, newVariant)

            newVariants.push(saved)
          } else {
            // If the provided variant does not have an id, we assume that it
            // should be created
            const created = await this.productVariantService_
              .withTransaction(manager)
              .create(product.id, newVariant)

            newVariants.push(created)
          }
        }

        product.variants = newVariants
      }

      for (const [key, value] of Object.entries(rest)) {
        if (typeof value !== `undefined`) {
          product[key] = value
        }
      }

      const result = await productRepo.save(product)
      await this.eventBus_
        .withTransaction(manager)
        .emit(ProductService.Events.UPDATED, {
          id: result.id,
          fields: Object.keys(update),
        })
      return result
    })
  }

  /**
   * Deletes a product from a given product id. The product's associated
   * variants will also be deleted.
   * @param {string} productId - the id of the product to delete. Must be
   *   castable as an ObjectId
   * @return {Promise} empty promise
   */
  async delete(productId) {
    return this.atomicPhase_(async (manager) => {
      const productRepo = manager.getCustomRepository(this.productRepository_)

      // Should not fail, if product does not exist, since delete is idempotent
      const product = await productRepo.findOne(
        { id: productId },
        { relations: ["variants"] }
      )

      if (!product) {
        return Promise.resolve()
      }

      await productRepo.softRemove(product)

      await this.eventBus_
        .withTransaction(manager)
        .emit(ProductService.Events.DELETED, {
          id: productId,
        })

      return Promise.resolve()
    })
  }

  /**
   * Adds an option to a product. Options can, for example, be "Size", "Color",
   * etc. Will update all the products variants with a dummy value for the newly
   * created option. The same option cannot be added more than once.
   * @param {string} productId - the product to apply the new option to
   * @param {string} optionTitle - the display title of the option, e.g. "Size"
   * @return {Promise} the result of the model update operation
   */
  async addOption(productId, optionTitle) {
    return this.atomicPhase_(async (manager) => {
      const productOptionRepo = manager.getCustomRepository(
        this.productOptionRepository_
      )

      const product = await this.retrieve(productId, {
        relations: ["options", "variants"],
      })

      if (product.options.find((o) => o.title === optionTitle)) {
        throw new MedusaError(
          MedusaError.Types.DUPLICATE_ERROR,
          `An option with the title: ${optionTitle} already exists`
        )
      }

      const option = await productOptionRepo.create({
        title: optionTitle,
        product_id: productId,
      })

      await productOptionRepo.save(option)

      for (const variant of product.variants) {
        this.productVariantService_
          .withTransaction(manager)
          .addOptionValue(variant.id, option.id, "Default Value")
      }

      const result = await this.retrieve(productId)

      await this.eventBus_
        .withTransaction(manager)
        .emit(ProductService.Events.UPDATED, result)
      return result
    })
  }

  async reorderVariants(productId, variantOrder) {
    return this.atomicPhase_(async (manager) => {
      const productRepo = manager.getCustomRepository(this.productRepository_)

      const product = await this.retrieve(productId, {
        relations: ["variants"],
      })

      if (product.variants.length !== variantOrder.length) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          `Product variants and new variant order differ in length.`
        )
      }

      product.variants = variantOrder.map((vId) => {
        const variant = product.variants.find((v) => v.id === vId)
        if (!variant) {
          throw new MedusaError(
            MedusaError.Types.INVALID_DATA,
            `Product has no variant with id: ${vId}`
          )
        }

        return variant
      })

      const result = productRepo.save(product)
      await this.eventBus_
        .withTransaction(manager)
        .emit(ProductService.Events.UPDATED, result)
      return result
    })
  }

  /**
   * Changes the order of a product's options. Will throw if the length of
   * optionOrder and the length of the product's options are different. Will
   * throw optionOrder contains an id not associated with the product.
   * @param {string} productId - the product whose options we are reordering
   * @param {string[]} optionOrder - the ids of the product's options in the
   *    new order
   * @return {Promise} the result of the update operation
   */
  async reorderOptions(productId, optionOrder) {
    return this.atomicPhase_(async (manager) => {
      const productRepo = manager.getCustomRepository(this.productRepository_)

      const product = await this.retrieve(productId, { relations: ["options"] })

      if (product.options.length !== optionOrder.length) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          `Product options and new options order differ in length.`
        )
      }

      product.options = optionOrder.map((oId) => {
        const option = product.options.find((o) => o.id === oId)
        if (!option) {
          throw new MedusaError(
            MedusaError.Types.INVALID_DATA,
            `Product has no option with id: ${oId}`
          )
        }

        return option
      })

      const result = productRepo.save(product)
      await this.eventBus_
        .withTransaction(manager)
        .emit(ProductService.Events.UPDATED, result)
      return result
    })
  }

  /**
   * Updates a product's option. Throws if the call tries to update an option
   * not associated with the product. Throws if the updated title already exists.
   * @param {string} productId - the product whose option we are updating
   * @param {string} optionId - the id of the option we are updating
   * @param {object} data - the data to update the option with
   * @return {Promise} the updated product
   */
  async updateOption(productId, optionId, data) {
    return this.atomicPhase_(async (manager) => {
      const productOptionRepo = manager.getCustomRepository(
        this.productOptionRepository_
      )

      const product = await this.retrieve(productId, { relations: ["options"] })

      const { title, values } = data

      const optionExists = product.options.some(
        (o) =>
          o.title.toUpperCase() === title.toUpperCase() && o.id !== optionId
      )
      if (optionExists) {
        throw new MedusaError(
          MedusaError.Types.NOT_FOUND,
          `An option with title ${title} already exists`
        )
      }

      const productOption = await productOptionRepo.findOne({
        where: { id: optionId },
      })

      if (!productOption) {
        throw new MedusaError(
          MedusaError.Types.NOT_FOUND,
          `Option with id: ${optionId} does not exist`
        )
      }

      productOption.title = title
      productOption.values = values

      await productOptionRepo.save(productOption)

      await this.eventBus_
        .withTransaction(manager)
        .emit(ProductService.Events.UPDATED, product)
      return product
    })
  }

  /**
   * Delete an option from a product.
   * @param {string} productId - the product to delete an option from
   * @param {string} optionId - the option to delete
   * @return {Promise} the updated product
   */
  async deleteOption(productId, optionId) {
    return this.atomicPhase_(async (manager) => {
      const productOptionRepo = manager.getCustomRepository(
        this.productOptionRepository_
      )

      const product = await this.retrieve(productId, {
        relations: ["variants", "variants.options"],
      })

      const productOption = await productOptionRepo.findOne({
        where: { id: optionId, product_id: productId },
      })

      if (!productOption) {
        return Promise.resolve()
      }

      // For the option we want to delete, make sure that all variants have the
      // same option values. The reason for doing is, that we want to avoid
      // duplicate variants. For example, if we have a product with size and
      // color options, that has four variants: (black, 1), (black, 2),
      // (blue, 1), (blue, 2) and we delete the size option from the product,
      // we would end up with four variants: (black), (black), (blue), (blue).
      // We now have two duplicate variants. To ensure that this does not
      // happen, we will force the user to select which variants to keep.
      const firstVariant = product.variants[0]

      const valueToMatch = firstVariant.options.find(
        (o) => o.option_id === optionId
      ).value

      const equalsFirst = await Promise.all(
        product.variants.map(async (v) => {
          const option = v.options.find((o) => o.option_id === optionId)
          return option.value === valueToMatch
        })
      )

      if (!equalsFirst.every((v) => v)) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          `To delete an option, first delete all variants, such that when an option is deleted, no duplicate variants will exist.`
        )
      }

      // If we reach this point, we can safely delete the product option
      await productOptionRepo.softRemove(productOption)

      await this.eventBus_
        .withTransaction(manager)
        .emit(ProductService.Events.UPDATED, product)
      return product
    })
  }

  /**
   * Decorates a product with product variants.
   * @param {string} productId - the productId to decorate.
   * @param {string[]} fields - the fields to include.
   * @param {string[]} expandFields - fields to expand.
   * @return {Product} return the decorated product.
   */
  async decorate(productId, fields = [], expandFields = []) {
    const requiredFields = ["id", "metadata"]

    fields = fields.concat(requiredFields)

    const product = await this.retrieve(productId, {
      select: fields,
      relations: expandFields,
    })

    // const final = await this.runDecorators_(decorated)
    return product
  }

  /**
   * Creates a query object to be used for list queries.
   * @param {object} selector - the selector to create the query from
   * @param {object} config - the config to use for the query
   * @return {object} an object containing the query, relations and free-text
   *   search param.
   */
  prepareListQuery_(selector, config) {
    let q
    if ("q" in selector) {
      q = selector.q
      delete selector.q
    }

    const query = this.buildQuery_(selector, config)

    if (config.relations && config.relations.length > 0) {
      query.relations = config.relations
    }

    if (config.select && config.select.length > 0) {
      query.select = config.select
    }

    const rels = query.relations
    delete query.relations

    return {
      query,
      relations: rels,
      q,
    }
  }

  /**
   * Creates a QueryBuilder that can fetch products based on free text.
   * @param {ProductRepository} productRepo - an instance of a ProductRepositry
   * @param {FindOptions<Product>} query - the query to get products by
   * @param {string} q - the text to perform free text search from
   * @return {QueryBuilder<Product>} a query builder that can fetch products
   */
  getFreeTextQueryBuilder_(productRepo, query, q) {
    const where = query.where

    delete where.description
    delete where.title

    let qb = productRepo
      .createQueryBuilder("product")
      .leftJoinAndSelect("product.variants", "variant")
      .leftJoinAndSelect("product.collection", "collection")
      .select(["product.id"])
      .where(where)
      .andWhere(
        new Brackets((qb) => {
          qb.where(`product.description ILIKE :q`, { q: `%${q}%` })
            .orWhere(`product.title ILIKE :q`, { q: `%${q}%` })
            .orWhere(`variant.title ILIKE :q`, { q: `%${q}%` })
            .orWhere(`variant.sku ILIKE :q`, { q: `%${q}%` })
            .orWhere(`collection.title ILIKE :q`, { q: `%${q}%` })
        })
      )
      .skip(query.skip)
      .take(query.take)

    if (query.withDeleted) {
      qb = qb.withDeleted()
    }

    return qb
  }
}

export default ProductService
