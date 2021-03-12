import _ from "lodash"
import { MedusaError } from "medusa-core-utils"
import { BaseService } from "medusa-interfaces"
import { IsNull } from "typeorm"

/**
 * Import service
 * @implements BaseService
 */
class ImportService extends BaseService {
  constructor({
    manager,
    productService,
    productRepository,
    productVariantRepository,
    productOptionRepository,
    imageRepository,
    productCollectionService,
    productCollectionRepository,
    productTypeRepository,
    productTagRepository,
    moneyAmountRepository,
    eventBusService,
  }) {
    super()

    /** @private @const {EntityManager} */
    this.manager_ = manager

    /** @private @const {ProductService} */
    this.productService_ = productService

    /** @private @const {Product} */
    this.productRepository_ = productRepository

    /** @private @const {ProductVariant} */
    this.productVariantRepository_ = productVariantRepository

    /** @private @const {ProductOption} */
    this.productOptionRepository_ = productOptionRepository

    /** @private @const {Image} */
    this.imageRepository_ = imageRepository

    /** @private @const {ProductCollectionService} */
    this.productCollectionService_ = productCollectionService

    /** @private @const {ProductCollectionRepository} */
    this.productCollectionRepository_ = productCollectionRepository

    /** @private @const {ProductCollectionService} */
    this.productTypeRepository_ = productTypeRepository

    /** @private @const {ProductCollectionService} */
    this.productTagRepository_ = productTagRepository

    /** @private @const {MoneyAmountRepository} */
    this.moneyAmountRepository_ = moneyAmountRepository

    /** @private @const {EventBus} */
    this.eventBus_ = eventBusService
  }

  withTransaction(transactionManager) {
    if (!transactionManager) {
      return this
    }

    const cloned = new ImportService({
      manager: transactionManager,
      productService: this.productService_,
      productVariantService: this.productVariantService_,
      productRepository: this.productRepository_,
      productVariantRepository: this.productVariantRepository_,
      productOptionRepository: this.productOptionRepository_,
      imageRepository: this.imageRepository_,
      productCollectionService: this.productCollectionService_,
      productTypeRepository: this.productTypeRepository_,
      productTagRepository: this.productTagRepository_,
      moneyAmountRepository: this.moneyAmountRepository_,
      eventBusService: this.eventBus_,
    })

    cloned.transactionManager_ = transactionManager

    return cloned
  }

  /**
   * Upserts product variant prices
   * @param {object[]} newPrices - list of new prices for the variant
   * @param {string} variantId - the variants to update prices for
   * @return {Promise<MoneyAmount[]>} update product variant prices
   */
  async upsertVariantPrices_(newPrices, variantId) {
    const moneyAmountRepo = this.manager_.getCustomRepository(
      this.moneyAmountRepository_
    )

    let vId = variantId || null

    let variantPrices = []
    for (const price of newPrices) {
      let moneyAmount
      moneyAmount = await moneyAmountRepo.findOne({
        where: {
          currency_code: price.currency_code.toLowerCase(),
          variant_id: vId,
          region_id: IsNull(),
        },
      })

      if (!moneyAmount) {
        moneyAmount = await moneyAmountRepo.create({
          amount: price.amount,
          currency_code: price.currency_code.toLowerCase(),
          variant_id: vId,
        })
      } else {
        moneyAmount.amount = price.amount
      }
      variantPrices.push(moneyAmount)
    }

    return variantPrices
  }

  /**
   * Upserts product variants
   * @param {Product} existingProduct - the existing product to update variants for
   * @param {object[]} fromImport - the variants from import
   * @return {Promise<ProductVariant[]>} upserted variants
   */
  async upsertVariants_(existingProduct, fromImport) {
    return this.atomicPhase_(async manager => {
      const productVariantRepository = manager.getCustomRepository(
        this.productVariantRepository_
      )

      const newVariants = [...existingProduct.variants]
      for (const newVariant of fromImport) {
        const newOpts = newVariant.options.map(o => o.value)

        // Check if variants with options already exists
        let exists = existingProduct.variants.find(v => {
          const opts = v.options.map(o2 => o2.value)
          if (_.isEqual(_.sortBy(opts), _.sortBy(newOpts))) {
            return v
          } else {
            return undefined
          }
        })

        const { prices, options, ...rest } = newVariant

        if (exists) {
          newVariants.filter(va => va.id !== exists.id)

          if (prices) {
            exists.prices = await this.upsertVariantPrices_(prices, exists.id)
          }

          for (const [key, value] of Object.entries(rest)) {
            exists[key] = value
          }

          newVariants.push(exists)
        } else {
          const optionIds = existingProduct.options.map(o => o.id)
          const toCreate = {
            ...rest,
            product: existingProduct,
            options: options.map((o, index) => ({
              ...o,
              option_id: optionIds[index],
            })),
          }

          if (prices) {
            toCreate.prices = await this.upsertVariantPrices_(prices)
          }

          const created = productVariantRepository.create(toCreate)

          newVariants.push(created)
        }
      }

      return newVariants
    })
  }

  /**
   * Upserts images
   * @param {string[]} images - list of images to upsert
   * @return {Promise<Image[]>} created or existing images
   */
  async upsertImages_(images) {
    const imageRepository = this.manager_.getCustomRepository(
      this.imageRepository_
    )

    let productImages = []
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
   * Upserts product tags
   * Everytime we create a new tag, we make sure to keep track, such
   * that it can be used for future products with the same tag.
   * @param {string[]} tags - list of tags
   * @param {ProductTag[]} createdTags - the previously created tags
   * @return {Promise<ProductTags[]>} created or existing product tags
   */
  async upsertTags_(tags, createdTags) {
    const productTagRepository = this.manager_.getCustomRepository(
      this.productTagRepository_
    )

    let productTags = []

    for (const tag of tags) {
      const alreadyCreated = createdTags.find(t => t.value === tag)

      if (alreadyCreated) {
        productTags.push(alreadyCreated)
        break
      }

      const existing = await productTagRepository.findOne({
        where: { value: tag },
      })

      if (existing) {
        productTags.push(existing)
      } else {
        const created = productTagRepository.create({ value: tag })
        createdTags.push(created)
        productTags.push(created)
      }
    }

    return productTags
  }

  /**
   * Upserts a product type
   * Everytime we create a new type, we make sure to keep track, such
   * that it can be used for future products with the same type.
   * @param {string} type - the value of a type
   * @param {ProductType[]} createdTypes - the previously created types
   * @return {Promise<ProductType>} created or existing product type
   */
  async upsertType_(type, createdTypes) {
    const productTypeRepository = this.manager_.getCustomRepository(
      this.productTypeRepository_
    )

    const alreadyCreated = createdTypes.find(t => t.value === type)

    if (alreadyCreated) {
      return alreadyCreated
    }

    const existing = await productTypeRepository.findOne({
      where: { value: type },
    })

    if (existing) {
      return existing
    } else {
      const created = productTypeRepository.create({ value: type })
      createdTypes.push(created)
      return created
    }
  }

  /**
   * Upserts a product collection
   * Everytime we create a new collection, we make sure to keep track, such
   * that it can be used for future products with the same collection.
   * @param {string} collection - the title of a collection
   * @param {ProductCollection[]} createdCollections - the previously created collections
   * @return {Promise<ProductCollection>} created or existing product collection
   */
  async upsertCollection_(collection, createdCollections) {
    const collectionRepository = this.manager_.getCustomRepository(
      this.productCollectionRepository_
    )

    const alreadyCreated = createdCollections.find(c => c.title === collection)

    if (alreadyCreated) {
      return alreadyCreated
    }

    const existingCol = await collectionRepository.findOne({
      where: { title: collection },
    })

    if (existingCol) {
      return existingCol
    } else {
      const created = collectionRepository.create({
        title: collection,
      })
      createdCollections.push(created)
      return created
    }
  }

  /**
   * Updates an existing product
   * @param {Product} existingProduct - the existing product to update
   * @param {object} newProduct - the product to update the existing with
   * @return {Promise<Product>} updated product
   */
  async updateProduct(existingProduct, newProduct, createdEntities) {
    return this.atomicPhase_(async manager => {
      const optionRepo = manager.getCustomRepository(
        this.productOptionRepository_
      )

      const {
        variants,
        metadata,
        options,
        images,
        tags,
        collection,
        type,
        ...rest
      } = newProduct

      if (
        !existingProduct.thumbnail &&
        !newProduct.thumbnail &&
        images &&
        images.length
      ) {
        existingProduct.thumbnail = images[0]
      }

      if (images && images.length) {
        existingProduct.images = await this.upsertImages_(images)
      }

      const { createdCols, createdTypes, createdTags } = createdEntities

      if (collection) {
        existingProduct.collection = await this.upsertCollection_(
          collection,
          createdCols
        )
      }

      if (tags) {
        existingProduct.tags = await this.upsertTags_(tags, createdTags)
      }

      if (typeof type !== `undefined` && type !== null) {
        existingProduct.type = await this.upsertType_(type, createdTypes)
      }

      existingProduct.options = await Promise.all(
        options.map(async o => {
          let existingOpt = await optionRepo.findOne({
            where: { title: o.title, product_id: existingProduct.id },
          })

          if (existingOpt) {
            return existingOpt
          } else {
            const created = optionRepo.create({
              title: o.title,
              product_id: existingProduct.id,
            })

            return optionRepo.save(created)
          }
        })
      )

      if (variants) {
        existingProduct.variants = await this.upsertVariants_(
          existingProduct,
          variants
        )
      }

      for (const [key, value] of Object.entries(rest)) {
        existingProduct[key] = value
      }

      return existingProduct
    })
  }

  /**
   * Creates a new product
   * @param {object} toCreate - the product to create
   * @param {object} createdEntities - the already created tags, types and collections
   * @return {Promise<Product>} created product
   */
  async createProduct_(toCreate, createdEntities) {
    return this.atomicPhase_(async manager => {
      const productRepository = manager.getCustomRepository(
        this.productRepository_
      )
      const optionRepo = manager.getCustomRepository(
        this.productOptionRepository_
      )
      const productVariantRepository = manager.getCustomRepository(
        this.productVariantRepository_
      )

      const {
        options,
        tags,
        type,
        variants,
        collection,
        images,
        ...rest
      } = toCreate

      if (!rest.thumbnail && images && images.length) {
        rest.thumbnail = images[0]
      }

      if (images && images.length) {
        existingProduct.images = await this.upsertImages_(images)
      }

      const created = productRepository.create(rest)

      const { createdCols, createdTypes, createdTags } = createdEntities

      if (collection) {
        created.collection = await this.upsertCollection_(
          collection,
          createdCols
        )
      }

      if (tags) {
        created.tags = await this.upsertTags_(tags, createdTags)
      }

      if (typeof type !== `undefined` && type !== null) {
        created.type = await this.upsertType_(type, createdTypes)
      }

      created.options = await Promise.all(
        options.map(async o => {
          let res = optionRepo.create(o)
          return optionRepo.save(res)
        })
      )

      const optionIds = options.map(
        po => created.options.find(newO => newO.title === po.title).id
      )

      if (variants) {
        let newVariants = []
        for (const newVariant of variants) {
          const { prices, options: variantOptions, ...rest } = newVariant

          if (options.length !== variantOptions.length) {
            throw new MedusaError(
              MedusaError.Types.INVALID_DATA,
              `Product options length does not match variant options length. Product has ${options.length} and variant has ${variantOptions.length}.`
            )
          }

          let toCreate = {
            ...rest,
            options: variantOptions.map((o, index) => ({
              ...o,
              option_id: optionIds[index],
            })),
          }

          if (prices) {
            toCreate.prices = await this.upsertVariantPrices_(prices)
          }

          const created = productVariantRepository.create(toCreate)
          newVariants.push(created)
        }

        created.variants = newVariants
      }

      return created
    })
  }

  /**
   * Imports products with upsert functionality.
   * If a product with a given handle already exists, the product will be updated.
   * Else, we created a new product.
   * Will keep track of created collections, tags and types, so these can be reused
   * for all products
   * @param {object[]} products - the products to import
   * @param {string} defaultShippingProfileId - the id of the default shipping profile
   * @return {string[]} ids of the imported products
   */
  async importProducts(products, defaultShippingProfileId) {
    return this.atomicPhase_(async manager => {
      const productRepository = manager.getCustomRepository(
        this.productRepository_
      )

      // Holds all the upserted products
      let toSave = []

      // Keep track of created entities, that could cause duplicate key errors
      let createdCols = []
      let createdTypes = []
      let createdTags = []

      for (const product of products) {
        const exists = await productRepository.findOne({
          where: { handle: product.handle },
          relations: [
            "variants",
            "variants.options",
            "variants.prices",
            "tags",
            "options",
          ],
        })

        if (exists) {
          const updated = await this.updateProduct(exists, product, {
            createdCols,
            createdTags,
            createdTypes,
          })

          toSave.push(updated)
        } else {
          const created = await this.createProduct_(
            {
              ...product,
              profile_id: defaultShippingProfileId,
            },
            {
              createdCols,
              createdTags,
              createdTypes,
            }
          )

          toSave.push(created)
        }
      }

      // Save all imported products and return ids
      let result = await productRepository.save(toSave)
      return result.map(res => res.id)
    })
  }
}

export default ImportService
