import { isDefined, MedusaError } from "medusa-core-utils"
import { EntityManager } from "typeorm"
import { ProductVariantService, SearchService } from "."
import { TransactionBaseService } from "../interfaces"
import SalesChannelFeatureFlag from "../loaders/feature-flags/sales-channels"
import {
  Product,
  ProductCategory,
  ProductOption,
  ProductTag,
  ProductType,
  ProductVariant,
  SalesChannel,
} from "../models"
import { ImageRepository } from "../repositories/image"
import { ProductRepository } from "../repositories/product"
import { ProductCategoryRepository } from "../repositories/product-category"
import { ProductOptionRepository } from "../repositories/product-option"
import { ProductTagRepository } from "../repositories/product-tag"
import { ProductTypeRepository } from "../repositories/product-type"
import { ProductVariantRepository } from "../repositories/product-variant"
import { ExtendedFindConfig, FindConfig, Selector } from "../types/common"
import {
  CreateProductInput,
  FindProductConfig,
  ProductFilterOptions,
  ProductOptionInput,
  ProductSelector,
  UpdateProductInput,
} from "../types/product"
import { buildQuery, isString, setMetadata } from "../utils"
import { FlagRouter } from "../utils/flag-router"
import EventBusService from "./event-bus"

type InjectedDependencies = {
  manager: EntityManager
  productOptionRepository: typeof ProductOptionRepository
  productRepository: typeof ProductRepository
  productVariantRepository: typeof ProductVariantRepository
  productTypeRepository: typeof ProductTypeRepository
  productTagRepository: typeof ProductTagRepository
  imageRepository: typeof ImageRepository
  productCategoryRepository: typeof ProductCategoryRepository
  productVariantService: ProductVariantService
  searchService: SearchService
  eventBusService: EventBusService
  featureFlagRouter: FlagRouter
}

class ProductService extends TransactionBaseService {
  protected readonly productOptionRepository_: typeof ProductOptionRepository
  protected readonly productRepository_: typeof ProductRepository
  protected readonly productVariantRepository_: typeof ProductVariantRepository
  protected readonly productTypeRepository_: typeof ProductTypeRepository
  protected readonly productTagRepository_: typeof ProductTagRepository
  protected readonly imageRepository_: typeof ImageRepository
  // eslint-disable-next-line max-len
  protected readonly productCategoryRepository_: typeof ProductCategoryRepository
  protected readonly productVariantService_: ProductVariantService
  protected readonly searchService_: SearchService
  protected readonly eventBus_: EventBusService
  protected readonly featureFlagRouter_: FlagRouter

  static readonly IndexName = `products`
  static readonly Events = {
    UPDATED: "product.updated",
    CREATED: "product.created",
    DELETED: "product.deleted",
  }

  constructor({
    productOptionRepository,
    productRepository,
    productVariantRepository,
    eventBusService,
    productVariantService,
    productTypeRepository,
    productTagRepository,
    productCategoryRepository,
    imageRepository,
    searchService,
    featureFlagRouter,
  }: InjectedDependencies) {
    // eslint-disable-next-line prefer-rest-params
    super(arguments[0])

    this.productOptionRepository_ = productOptionRepository
    this.productRepository_ = productRepository
    this.productVariantRepository_ = productVariantRepository
    this.eventBus_ = eventBusService
    this.productVariantService_ = productVariantService
    this.productCategoryRepository_ = productCategoryRepository
    this.productTypeRepository_ = productTypeRepository
    this.productTagRepository_ = productTagRepository
    this.imageRepository_ = imageRepository
    this.searchService_ = searchService
    this.featureFlagRouter_ = featureFlagRouter
  }

  /**
   * Lists products based on the provided parameters.
   * @param selector - an object that defines rules to filter products
   *   by
   * @param config - object that defines the scope for what should be
   *   returned
   * @return the result of the find operation
   */
  async list(
    selector: ProductSelector,
    config: FindProductConfig = {
      relations: [],
      skip: 0,
      take: 20,
      include_discount_prices: false,
    }
  ): Promise<Product[]> {
    const [products] = await this.listAndCount(selector, config)
    return products
  }

  /**
   * Lists products based on the provided parameters and includes the count of
   * products that match the query.
   * @param selector - an object that defines rules to filter products
   *   by
   * @param config - object that defines the scope for what should be
   *   returned
   * @return an array containing the products as
   *   the first element and the total count of products that matches the query
   *   as the second element.
   */
  async listAndCount(
    selector: ProductSelector,
    config: FindProductConfig = {
      relations: [],
      skip: 0,
      take: 20,
      include_discount_prices: false,
    }
  ): Promise<[Product[], number]> {
    const productRepo = this.activeManager_.withRepository(
      this.productRepository_
    )

    const { q, ...productSelector } = selector
    const query = buildQuery(productSelector, config) as ExtendedFindConfig<
      Product & ProductFilterOptions
    >

    return await productRepo.findAndCount(query, q)
  }

  /**
   * Return the total number of documents in database
   * @param {object} selector - the selector to choose products by
   * @return {Promise} the result of the count operation
   */
  async count(selector: Selector<Product> = {}): Promise<number> {
    const productRepo = this.activeManager_.withRepository(
      this.productRepository_
    )
    const query = buildQuery(selector)
    return await productRepo.count(query)
  }

  /**
   * Gets a product by id.
   * Throws in case of DB Error and if product was not found.
   * @param productId - id of the product to get.
   * @param config - object that defines what should be included in the
   *   query response
   * @return the result of the find one operation.
   */
  async retrieve(
    productId: string,
    config: FindProductConfig = {
      include_discount_prices: false,
    }
  ): Promise<Product> {
    if (!isDefined(productId)) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `"productId" must be defined`
      )
    }

    return await this.retrieve_({ id: productId }, config)
  }

  /**
   * Gets a product by handle.
   * Throws in case of DB Error and if product was not found.
   * @param productHandle - handle of the product to get.
   * @param config - details about what to get from the product
   * @return the result of the find one operation.
   */
  async retrieveByHandle(
    productHandle: string,
    config: FindProductConfig = {}
  ): Promise<Product> {
    if (!isDefined(productHandle)) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `"productHandle" must be defined`
      )
    }

    return await this.retrieve_({ handle: productHandle }, config)
  }

  /**
   * Gets a product by external id.
   * Throws in case of DB Error and if product was not found.
   * @param externalId - handle of the product to get.
   * @param config - details about what to get from the product
   * @return the result of the find one operation.
   */
  async retrieveByExternalId(
    externalId: string,
    config: FindProductConfig = {}
  ): Promise<Product> {
    if (!isDefined(externalId)) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `"externalId" must be defined`
      )
    }

    return await this.retrieve_({ external_id: externalId }, config)
  }

  /**
   * Gets a product by selector.
   * Throws in case of DB Error and if product was not found.
   * @param selector - selector object
   * @param config - object that defines what should be included in the
   *   query response
   * @return the result of the find one operation.
   */
  async retrieve_(
    selector: Selector<Product>,
    config: FindProductConfig = {
      include_discount_prices: false, // TODO: this seams to be unused from the repository
    }
  ): Promise<Product> {
    const productRepo = this.activeManager_.withRepository(
      this.productRepository_
    )
    const query = buildQuery(selector, config as FindConfig<Product>)
    const product = await productRepo.findOne(query)

    if (!product) {
      const selectorConstraints = Object.entries(selector)
        .map(([key, value]) => `${key}: ${value}`)
        .join(", ")

      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Product with ${selectorConstraints} was not found`
      )
    }

    return product
  }

  /**
   * Gets all variants belonging to a product.
   * @param productId - the id of the product to get variants from.
   * @param config - The config to select and configure relations etc...
   * @return an array of variants
   */
  async retrieveVariants(
    productId: string,
    config: FindProductConfig = {
      skip: 0,
      take: 50,
    }
  ): Promise<ProductVariant[]> {
    const givenRelations = config.relations ?? []
    const requiredRelations = ["variants"]
    const relationsSet = new Set([...givenRelations, ...requiredRelations])

    const product = await this.retrieve(productId, {
      ...config,
      relations: [...relationsSet],
    })
    return product.variants
  }

  async filterProductsBySalesChannel(
    productIds: string[],
    salesChannelId: string,
    config: FindProductConfig = {
      skip: 0,
      take: 50,
    }
  ): Promise<Product[]> {
    const givenRelations = config.relations ?? []
    const requiredRelations = ["sales_channels"]
    const relationsSet = new Set([...givenRelations, ...requiredRelations])

    const products = await this.list(
      {
        id: productIds,
      },
      {
        ...config,
        relations: [...relationsSet],
      }
    )
    const productSalesChannelsMap = new Map<string, SalesChannel[]>(
      products.map((product) => [product.id, product.sales_channels])
    )
    return products.filter((product) => {
      return productSalesChannelsMap
        .get(product.id)
        ?.some((sc) => sc.id === salesChannelId)
    })
  }

  async listTypes(): Promise<ProductType[]> {
    const productTypeRepository = this.activeManager_.withRepository(
      this.productTypeRepository_
    )

    return await productTypeRepository.find({})
  }

  async listTagsByUsage(count = 10): Promise<ProductTag[]> {
    const productTagRepo = this.activeManager_.withRepository(
      this.productTagRepository_
    )

    return await productTagRepo.listTagsByUsage(count)
  }

  /**
   * Check if the product is assigned to at least one of the provided sales channels.
   *
   * @param id - product id
   * @param salesChannelIds - an array of sales channel ids
   */
  async isProductInSalesChannels(
    id: string,
    salesChannelIds: string[]
  ): Promise<boolean> {
    const product = await this.retrieve_(
      { id },
      { relations: ["sales_channels"] }
    )

    // TODO: reimplement this to use db level check
    const productsSalesChannels = product.sales_channels.map(
      (channel) => channel.id
    )

    return productsSalesChannels.some((id) => salesChannelIds.includes(id))
  }

  /**
   * Creates a product.
   * @param productObject - the product to create
   * @return resolves to the creation result.
   */
  async create(productObject: CreateProductInput): Promise<Product> {
    return await this.atomicPhase_(async (manager) => {
      const productRepo = manager.withRepository(this.productRepository_)
      const productTagRepo = manager.withRepository(this.productTagRepository_)
      const productTypeRepo = manager.withRepository(
        this.productTypeRepository_
      )
      const imageRepo = manager.withRepository(this.imageRepository_)
      const optionRepo = manager.withRepository(this.productOptionRepository_)

      const {
        options,
        tags,
        type,
        images,
        sales_channels: salesChannels,
        categories: categories,
        ...rest
      } = productObject

      if (!rest.thumbnail && images?.length) {
        rest.thumbnail = images[0]
      }

      // if product is a giftcard, we should disallow discounts
      if (rest.is_giftcard) {
        rest.discountable = false
      }

      let product = productRepo.create(rest)

      if (images?.length) {
        product.images = await imageRepo.upsertImages(images)
      }

      if (tags?.length) {
        product.tags = await productTagRepo.upsertTags(tags)
      }

      if (typeof type !== `undefined`) {
        product.type_id = (await productTypeRepo.upsertType(type))?.id || null
      }

      if (
        this.featureFlagRouter_.isFeatureEnabled(SalesChannelFeatureFlag.key)
      ) {
        if (isDefined(salesChannels)) {
          product.sales_channels = []
          if (salesChannels?.length) {
            const salesChannelIds = salesChannels?.map((sc) => sc.id)
            product.sales_channels = salesChannelIds?.map(
              (id) => ({ id } as SalesChannel)
            )
          }
        }
      }

      if (isDefined(categories)) {
        product.categories = []

        if (categories?.length) {
          const categoryIds = categories.map((c) => c.id)
          const categoryRecords = categoryIds.map(
            (id) => ({ id } as ProductCategory)
          )

          product.categories = categoryRecords
        }
      }

      product = await productRepo.save(product)

      product.options = await Promise.all(
        (options ?? []).map(async (option) => {
          const res = optionRepo.create({
            ...option,
            product_id: product.id,
          })
          await optionRepo.save(res)
          return res
        })
      )

      const result = await this.retrieve(product.id, {
        relations: ["options"],
      })

      await this.eventBus_
        .withTransaction(manager)
        .emit(ProductService.Events.CREATED, {
          id: result.id,
        })
      return result
    })
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
  async update(
    productId: string,
    update: UpdateProductInput
  ): Promise<Product> {
    return await this.atomicPhase_(async (manager) => {
      const productRepo = manager.withRepository(this.productRepository_)
      const productTagRepo = manager.withRepository(this.productTagRepository_)
      const productTypeRepo = manager.withRepository(
        this.productTypeRepository_
      )
      const imageRepo = manager.withRepository(this.imageRepository_)

      const relations = ["tags", "images"]

      if (
        this.featureFlagRouter_.isFeatureEnabled(SalesChannelFeatureFlag.key)
      ) {
        if (isDefined(update.sales_channels)) {
          relations.push("sales_channels")
        }
      } else {
        if (isDefined(update.sales_channels)) {
          throw new MedusaError(
            MedusaError.Types.INVALID_DATA,
            "the property sales_channels should no appears as part of the payload"
          )
        }
      }

      const product = await this.retrieve(productId, {
        relations,
      })

      const {
        metadata,
        images,
        tags,
        type,
        sales_channels: salesChannels,
        categories: categories,
        ...rest
      } = update

      if (!product.thumbnail && !update.thumbnail && images?.length) {
        product.thumbnail = images[0]
      }

      const promises: Promise<any>[] = []

      if (images) {
        promises.push(
          imageRepo
            .upsertImages(images)
            .then((image) => (product.images = image))
        )
      }

      if (metadata) {
        product.metadata = setMetadata(product, metadata)
      }

      if (isDefined(type)) {
        promises.push(
          productTypeRepo
            .upsertType(type)
            .then((type) => (product.type_id = type?.id ?? null))
        )
      }

      if (tags) {
        promises.push(
          productTagRepo.upsertTags(tags).then((tags) => (product.tags = tags))
        )
      }

      if (isDefined(categories)) {
        product.categories = []

        if (categories?.length) {
          const categoryIds = categories.map((c) => c.id)
          product.categories = categoryIds.map(
            (id) => ({ id } as ProductCategory)
          )
        }
      }

      if (
        this.featureFlagRouter_.isFeatureEnabled(SalesChannelFeatureFlag.key)
      ) {
        if (isDefined(salesChannels)) {
          product.sales_channels = []
          if (salesChannels?.length) {
            const salesChannelIds = salesChannels?.map((sc) => sc.id)
            product.sales_channels = salesChannelIds?.map(
              (id) => ({ id } as SalesChannel)
            )
          }
        }
      }

      for (const [key, value] of Object.entries(rest)) {
        if (isDefined(value)) {
          product[key] = value
        }
      }

      await Promise.all(promises)

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
   * @param productId - the id of the product to delete. Must be
   *   castable as an ObjectId
   * @return empty promise
   */
  async delete(productId: string): Promise<void> {
    return await this.atomicPhase_(async (manager) => {
      const productRepo = manager.withRepository(this.productRepository_)

      // Should not fail, if product does not exist, since delete is idempotent
      const product = await productRepo.findOne({
        where: { id: productId },
        relations: {
          variants: {
            prices: true,
            options: true,
          },
        },
      })

      if (!product) {
        return
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
   * @param productId - the product to apply the new option to
   * @param optionTitle - the display title of the option, e.g. "Size"
   * @return the result of the model update operation
   */
  async addOption(productId: string, optionTitle: string): Promise<Product> {
    return await this.atomicPhase_(async (manager) => {
      const productOptionRepo = manager.withRepository(
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

      const option = productOptionRepo.create({
        title: optionTitle,
        product_id: productId,
      })

      await productOptionRepo.save(option)

      const productVariantServiceTx =
        this.productVariantService_.withTransaction(manager)
      for (const variant of product.variants) {
        await productVariantServiceTx.addOptionValue(
          variant.id,
          option.id,
          "Default Value"
        )
      }

      const result = await this.retrieve(productId)

      await this.eventBus_
        .withTransaction(manager)
        .emit(ProductService.Events.UPDATED, result)
      return result
    })
  }

  async reorderVariants(
    productId: string,
    variantOrder: string[]
  ): Promise<Product> {
    return await this.atomicPhase_(async (manager) => {
      const productRepo = manager.withRepository(this.productRepository_)

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
   * Updates a product's option. Throws if the call tries to update an option
   * not associated with the product. Throws if the updated title already exists.
   * @param productId - the product whose option we are updating
   * @param optionId - the id of the option we are updating
   * @param data - the data to update the option with
   * @return the updated product
   */
  async updateOption(
    productId: string,
    optionId: string,
    data: ProductOptionInput
  ): Promise<Product> {
    return await this.atomicPhase_(async (manager) => {
      const productOptionRepo = manager.withRepository(
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
      if (values) {
        productOption.values = values
      }

      await productOptionRepo.save(productOption)

      await this.eventBus_
        .withTransaction(manager)
        .emit(ProductService.Events.UPDATED, product)
      return product
    })
  }

  /**
   * Retrieve product's option by title.
   *
   * @param title - title of the option
   * @param productId - id of a product
   * @return product option
   */
  async retrieveOptionByTitle(
    title: string,
    productId: string
  ): Promise<ProductOption | null> {
    const productOptionRepo = this.activeManager_.withRepository(
      this.productOptionRepository_
    )

    return productOptionRepo.findOne({
      where: { title, product_id: productId },
    })
  }

  /**
   * Delete an option from a product.
   * @param productId - the product to delete an option from
   * @param optionId - the option to delete
   * @return the updated product
   */
  async deleteOption(
    productId: string,
    optionId: string
  ): Promise<Product | void> {
    return await this.atomicPhase_(async (manager) => {
      const productOptionRepo = manager.withRepository(
        this.productOptionRepository_
      )

      const product = await this.retrieve(productId, {
        relations: ["variants", "variants.options"],
      })

      const productOption = await productOptionRepo.findOne({
        where: { id: optionId, product_id: productId },
        relations: ["values"],
      })

      if (!productOption) {
        return Promise.resolve()
      }

      // In case the product does not contain variants, we can safely delete the option
      // If it does contain variants, we need to make sure no variant exist for the
      // product option to delete
      if (product?.variants?.length) {
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
        )?.value

        const equalsFirst = await Promise.all(
          product.variants.map(async (v) => {
            const option = v.options.find((o) => o.option_id === optionId)
            return option?.value === valueToMatch
          })
        )

        if (!equalsFirst.every((v) => v)) {
          throw new MedusaError(
            MedusaError.Types.INVALID_DATA,
            `To delete an option, first delete all variants, such that when an option is deleted, no duplicate variants will exist.`
          )
        }
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
   *
   * @param productIds ID or IDs of the products to update
   * @param profileId Shipping profile ID to update the shipping options with
   * @returns updated shipping options
   */
  async updateShippingProfile(
    productIds: string | string[],
    profileId: string
  ): Promise<Product[]> {
    return await this.atomicPhase_(async (manager) => {
      const productRepo = manager.withRepository(this.productRepository_)

      const ids = isString(productIds) ? [productIds] : productIds

      const products = await productRepo.upsertShippingProfile(ids, profileId)

      await this.eventBus_
        .withTransaction(manager)
        .emit(ProductService.Events.UPDATED, products)

      return products
    })
  }
}

export default ProductService
