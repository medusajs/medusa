import { MedusaError } from "medusa-core-utils"
import { EntityManager } from "typeorm"
import { formatException } from "../utils/exception-formatter"
import { ProductOptionRepository } from "../repositories/product-option"
import {
  FindWithRelationsOptions,
  ProductRepository,
} from "../repositories/product"
import { ProductVariantRepository } from "../repositories/product-variant"
import ProductVariantService from "./product-variant"
import ProductCollectionService from "./product-collection"
import { ProductTypeRepository } from "../repositories/product-type"
import { ProductTagRepository } from "../repositories/product-tag"
import { ImageRepository } from "../repositories/image"
import { CartRepository } from "../repositories/cart"
import { SearchService } from "."
import PriceSelectionStrategy from "../strategies/price-selection"
import EventBusService from "./event-bus"
import { TransactionBaseService } from "../interfaces"
import {
  CreateProductDTO,
  CreateProductProductTagDTO,
  CreateProductProductTypeDTO,
  FilterableProductProps,
  ProductOptionDTO,
  UpdateProductDTO,
} from "../types/product"
import { FindConfig, Selector } from "../types/common"
import {
  Image,
  Product,
  ProductTag,
  ProductType,
  ProductVariant,
} from "../models"
import { buildQuery, setMetadata, validateId } from "../utils"
import { PriceSelectionContext } from "../interfaces/price-selection-strategy"

type InjectedDependencies = {
  manager: EntityManager
  productOptionRepository: typeof ProductOptionRepository
  productRepository: typeof ProductRepository
  productVariantRepository: typeof ProductVariantRepository
  productTypeRepository: typeof ProductTypeRepository
  productTagRepository: typeof ProductTagRepository
  imageRepository: typeof ImageRepository
  cartRepository: typeof CartRepository
  productVariantService: ProductVariantService
  productCollectionService: ProductCollectionService
  searchService: SearchService
  eventBusService: EventBusService
  priceSelectionStrategy: PriceSelectionStrategy
}

type PriceListLoadConfig = {
  include_discount_prices?: boolean
  customer_id?: string
  cart_id?: string
  region_id?: string
  currency_code?: string
}

type ListProductConfig = FindConfig<FilterableProductProps> &
  PriceListLoadConfig

type FindProductConfig = FindConfig<Product> & PriceListLoadConfig

class ProductService extends TransactionBaseService<ProductService> {
  protected manager_: EntityManager
  protected transactionManager_: EntityManager | undefined

  protected readonly productOptionRepository_: typeof ProductOptionRepository
  protected readonly productRepository_: typeof ProductRepository
  protected readonly productVariantRepository_: typeof ProductVariantRepository
  protected readonly productTypeRepository_: typeof ProductTypeRepository
  protected readonly productTagRepository_: typeof ProductTagRepository
  protected readonly imageRepository_: typeof ImageRepository
  protected readonly cartRepository_: typeof CartRepository
  protected readonly productVariantService_: ProductVariantService
  protected readonly productCollectionService_: ProductCollectionService
  protected readonly searchService_: SearchService
  protected readonly eventBus_: EventBusService
  protected readonly priceSelectionStrategy_: PriceSelectionStrategy

  static readonly IndexName = `products`
  static readonly Events = {
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
    productTypeRepository,
    productTagRepository,
    imageRepository,
    searchService,
    cartRepository,
    priceSelectionStrategy,
  }: InjectedDependencies) {
    super({
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
      cartRepository,
      priceSelectionStrategy,
    })

    this.manager_ = manager

    this.productOptionRepository_ = productOptionRepository

    this.productRepository_ = productRepository

    this.productVariantRepository_ = productVariantRepository

    this.eventBus_ = eventBusService

    this.productVariantService_ = productVariantService

    this.productCollectionService_ = productCollectionService

    this.productTypeRepository_ = productTypeRepository

    this.productTagRepository_ = productTagRepository

    this.imageRepository_ = imageRepository

    this.searchService_ = searchService

    this.cartRepository_ = cartRepository

    this.priceSelectionStrategy_ = priceSelectionStrategy
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
    selector: FilterableProductProps | Selector<Product> = {},
    config: FindProductConfig = {
      relations: [],
      skip: 0,
      take: 20,
      include_discount_prices: false,
    }
  ): Promise<Product[]> {
    return await this.atomicPhase_(async (manager) => {
      const productRepo = manager.getCustomRepository(this.productRepository_)

      const priceIndex = config.relations?.indexOf("variants.prices") ?? -1
      if (priceIndex >= 0 && config.relations) {
        config.relations = [...config.relations]
        config.relations.splice(priceIndex, 1)
      }

      const { q, query, relations } = this.prepareListQuery_(selector, config)

      if (q) {
        const [products] = await productRepo.getFreeTextSearchResultsAndCount(
          q,
          query,
          relations
        )

        return products
      }

      const products = await productRepo.findWithRelations(relations, query)

      return priceIndex > -1
        ? await this.setAdditionalPrices(products, {
            cart_id: config.cart_id,
            currency_code: config.currency_code,
            customer_id: config.customer_id,
            include_discount_prices: config.include_discount_prices,
            region_id: config.region_id,
          })
        : products
    })
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
    selector: FilterableProductProps | Selector<Product>,
    config: FindProductConfig = {
      relations: [],
      skip: 0,
      take: 20,
      include_discount_prices: false,
    }
  ): Promise<[Product[], number]> {
    return await this.atomicPhase_(async (manager) => {
      const productRepo = manager.getCustomRepository(this.productRepository_)

      const priceIndex = config.relations?.indexOf("variants.prices") ?? -1
      if (priceIndex >= 0 && config.relations) {
        config.relations = [...config.relations]
        config.relations.splice(priceIndex, 1)
      }

      const { q, query, relations } = this.prepareListQuery_(selector, config)

      let products
      let count
      if (q) {
        ;[products, count] = await productRepo.getFreeTextSearchResultsAndCount(
          q,
          query,
          relations
        )
      } else {
        ;[products, count] = await productRepo.findWithRelationsAndCount(
          relations,
          query
        )
      }

      if (priceIndex > -1) {
        const productsWithAdditionalPrices = await this.setAdditionalPrices(
          products,
          {
            cart_id: config.cart_id,
            currency_code: config.currency_code,
            customer_id: config.customer_id,
            include_discount_prices: config.include_discount_prices,
            region_id: config.region_id,
          }
        )

        return [productsWithAdditionalPrices, count]
      } else {
        return [products, count]
      }
    })
  }

  /**
   * Return the total number of documents in database
   * @param {object} selector - the selector to choose products by
   * @return {Promise} the result of the count operation
   */
  async count(selector: Selector<Product> = {}): Promise<number> {
    return await this.atomicPhase_(async (manager) => {
      const productRepo = manager.getCustomRepository(this.productRepository_)
      /** revisit */
      const query = buildQuery(selector)
      return await productRepo.count(query)
    })
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
    config: FindProductConfig = { include_discount_prices: false }
  ): Promise<Product> {
    return await this.atomicPhase_(async (manager) => {
      const productRepo = manager.getCustomRepository(this.productRepository_)
      const validatedId = validateId(productId)

      const priceIndex = config.relations?.indexOf("variants.prices") ?? -1
      if (priceIndex >= 0 && config.relations) {
        config.relations = [...config.relations]
        config.relations.splice(priceIndex, 1)
      }

      const { relations, ...query } = buildQuery({ id: validatedId }, config)

      const product = await productRepo.findOneWithRelations(relations, query)

      if (!product) {
        throw new MedusaError(
          MedusaError.Types.NOT_FOUND,
          `Product with id: ${productId} was not found`
        )
      }

      return priceIndex > -1
        ? await this.setAdditionalPrices(product, {
            cart_id: config.cart_id,
            currency_code: config.currency_code,
            customer_id: config.customer_id,
            include_discount_prices: config.include_discount_prices,
            region_id: config.region_id,
          })
        : product
    })
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
    return await this.atomicPhase_(async (manager) => {
      const productRepo = manager.getCustomRepository(this.productRepository_)

      const priceIndex = config.relations?.indexOf("variants.prices") ?? -1
      if (priceIndex >= 0 && config.relations) {
        config.relations = [...config.relations]
        config.relations.splice(priceIndex, 1)
      }

      const { relations, ...query } = buildQuery(
        { handle: productHandle },
        config
      )

      const product = await productRepo.findOneWithRelations(relations, query)

      if (!product) {
        throw new MedusaError(
          MedusaError.Types.NOT_FOUND,
          `Product with handle: ${productHandle} was not found`
        )
      }

      return priceIndex > -1
        ? await this.setAdditionalPrices(product, {
            cart_id: config.cart_id,
            currency_code: config.currency_code,
            customer_id: config.customer_id,
            include_discount_prices: config.include_discount_prices,
            region_id: config.region_id,
          })
        : product
    })
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
    return await this.atomicPhase_(async (manager) => {
      const productRepo = manager.getCustomRepository(this.productRepository_)

      const priceIndex = config.relations?.indexOf("variants.prices") ?? -1
      if (priceIndex >= 0 && config.relations) {
        config.relations = [...config.relations]
        config.relations.splice(priceIndex, 1)
      }

      const { relations, ...query } = buildQuery(
        { external_id: externalId },
        config
      )

      const product = await productRepo.findOneWithRelations(relations, query)

      if (!product) {
        throw new MedusaError(
          MedusaError.Types.NOT_FOUND,
          `Product with exteral_id: ${externalId} was not found`
        )
      }

      return priceIndex > -1
        ? await this.setAdditionalPrices(product, {
            cart_id: config.cart_id,
            currency_code: config.currency_code,
            customer_id: config.customer_id,
            include_discount_prices: config.include_discount_prices,
            region_id: config.region_id,
          })
        : product
    })
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
    const relations = config.relations ?? []
    const product = await this.retrieve(productId, {
      ...config,
      relations: [...relations, "variants"],
    })
    return product.variants
  }

  async listTypes(): Promise<ProductType[]> {
    return await this.atomicPhase_(async (manager) => {
      const productTypeRepository = manager.getCustomRepository(
        this.productTypeRepository_
      )

      return await productTypeRepository.find({})
    })
  }

  async listTagsByUsage(count = 10): Promise<ProductTag[]> {
    return await this.atomicPhase_(async (manager) => {
      const productTagRepo = manager.getCustomRepository(
        this.productTagRepository_
      )

      return await productTagRepo.listTagsByUsage(count)
    })
  }

  protected async upsertProductType_(
    type: CreateProductProductTypeDTO
  ): Promise<string | null> {
    const transactionManager = this.transactionManager_ ?? this.manager_
    const productTypeRepository = transactionManager.getCustomRepository(
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

    const created = productTypeRepository.create({
      value: type.value,
    })
    const result = await productTypeRepository.save(created)

    return result.id
  }

  protected async upsertProductTags_(
    tags: CreateProductProductTagDTO[]
  ): Promise<ProductTag[]> {
    const transactionManager = this.transactionManager_ ?? this.manager_
    const productTagRepository = transactionManager.getCustomRepository(
      this.productTagRepository_
    )

    const newTags: ProductTag[] = []
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
   * @param productObject - the product to create
   * @return resolves to the creation result.
   */
  async create(productObject: CreateProductDTO): Promise<Product> {
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

      try {
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
          (options ?? []).map(async (option) => {
            const res = optionRepo.create({ ...option, product_id: product.id })
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
      } catch (error) {
        throw formatException(error)
      }
    })
  }

  async upsertImages_(images: string[]): Promise<Image[]> {
    return await this.atomicPhase_(async (manager) => {
      const imageRepository = manager.getCustomRepository(this.imageRepository_)

      const productImages: Image[] = []
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
  async update(productId: string, update: UpdateProductDTO): Promise<Product> {
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
        product.metadata = setMetadata(product, metadata)
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

        const newVariants: ProductVariant[] = []
        for (const [i, newVariant] of variants.entries()) {
          const variant_rank = i

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
              .update(variant, {
                ...newVariant,
                variant_rank,
              })

            newVariants.push(saved)
          } else {
            // If the provided variant does not have an id, we assume that it
            // should be created
            const created = await this.productVariantService_
              .withTransaction(manager)
              .create(product.id, {
                ...newVariant,
                variant_rank,
                options: newVariant.options || [],
                prices: newVariant.prices || [],
              })

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
   * @param productId - the id of the product to delete. Must be
   *   castable as an ObjectId
   * @return empty promise
   */
  async delete(productId: string): Promise<void> {
    return this.atomicPhase_(async (manager) => {
      const productRepo = manager.getCustomRepository(this.productRepository_)

      // Should not fail, if product does not exist, since delete is idempotent
      const product = await productRepo.findOne(
        { id: productId },
        { relations: ["variants", "variants.prices", "variants.options"] }
      )

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

  async reorderVariants(
    productId: string,
    variantOrder: string[]
  ): Promise<Product> {
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
   * @param productId - the product whose options we are reordering
   * @param optionOrder - the ids of the product's options in the
   *    new order
   * @return the result of the update operation
   */
  async reorderOptions(
    productId: string,
    optionOrder: string[]
  ): Promise<Product> {
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
   * @param productId - the product whose option we are updating
   * @param optionId - the id of the option we are updating
   * @param data - the data to update the option with
   * @return the updated product
   */
  async updateOption(
    productId: string,
    optionId: string,
    data: ProductOptionDTO
  ): Promise<Product> {
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
   * @param productId - the productId to decorate.
   * @param fields - the fields to include.
   * @param expandFields - fields to expand.
   * @param config - retrieve config for price calculation.
   * @return return the decorated product.
   */
  async decorate(
    productId: string,
    fields: (keyof Product)[] = [],
    expandFields: string[] = [],
    config: FindProductConfig = {}
  ): Promise<Product> {
    const requiredFields: (keyof Product)[] = ["id", "metadata"]

    fields = fields.concat(requiredFields)

    return await this.retrieve(productId, {
      select: fields,
      relations: expandFields,
    })

    return priceIndex > -1
      ? await this.setAdditionalPrices(product, {
          cart_id: config.cart_id,
          currency_code: config.currency_code,
          customer_id: config.customer_id,
          include_discount_prices: config.include_discount_prices,
          region_id: config.region_id,
        })
      : product
  }

  /**
   * Creates a query object to be used for list queries.
   * @param selector - the selector to create the query from
   * @param config - the config to use for the query
   * @return an object containing the query, relations and free-text
   *   search param.
   */
  protected prepareListQuery_(
    selector: FilterableProductProps | Selector<Product>,
    config: FindProductConfig
  ): {
    q: string
    relations: (keyof Product)[]
    query: Omit<FindWithRelationsOptions, "relations">
  } {
    let q
    if ("q" in selector) {
      q = selector.q
      delete selector.q
    }

    const query = buildQuery(selector, config)

    if (config.relations && config.relations.length > 0) {
      query.relations = config.relations
    }

    if (config.select && config.select.length > 0) {
      query.select = config.select
    }

    const rels = query.relations
    delete query.relations

    return {
      query: query as Omit<FindWithRelationsOptions, "relations">,
      relations: rels as (keyof Product)[],
      q,
    }
  }

  /**
   * Set additional prices on a list of products.
   * @param products list of products on which to set additional prices
   * @param context price list selection context used when calculating the variant price
   * @return A list of products with variants decorated with "additional_prices"
   */
  async setAdditionalPrices<T extends Product | Product[]>(
    products: T,
    context: PriceSelectionContext
  ): Promise<T> {
    const {
      region_id,
      include_discount_prices,
      currency_code,
      cart_id,
      customer_id,
    } = context
    return await this.atomicPhase_(async (manager) => {
      const cartRepo = this.manager_.getCustomRepository(this.cartRepository_)

      let regionId = region_id
      let currencyCode = currency_code

      if (cart_id) {
        const cart = await cartRepo.findOne({
          where: { id: cart_id },
          relations: ["region"],
        })

        if (!cart) {
          throw new MedusaError(
            MedusaError.Types.NOT_FOUND,
            `Cart with id: ${cart_id} was not found`
          )
        }

        regionId = cart?.region.id
        currencyCode = cart?.region.currency_code
      }

      const productArray = Array.isArray(products) ? products : [products]

      const priceSelectionStrategy = this.priceSelectionStrategy_.withTransaction(
        manager
      )

      const productsWithPrices = await Promise.all(
        productArray.map(async (p) => {
          if (p.variants?.length) {
            p.variants = await Promise.all(
              p.variants.map(async (v) => {
                const prices = await priceSelectionStrategy.calculateVariantPrice(
                  v.id,
                  {
                    region_id: regionId,
                    currency_code: currencyCode,
                    cart_id: cart_id,
                    customer_id: customer_id,
                    include_discount_prices,
                  }
                )

                return {
                  ...v,
                  prices: prices.prices,
                  original_price: prices.originalPrice,
                  calculated_price: prices.calculatedPrice,
                  calculated_price_type: prices.calculatedPriceType,
                }
              })
            )
          }

          return p
        })
      )

      return Array.isArray(products)
        ? productsWithPrices
        : productsWithPrices[0]
    })
  }
}

export default ProductService
