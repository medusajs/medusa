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

  async upsertVariants(existingProduct, fromImport) {
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

  async upsertTags_(tags) {
    const productTagRepository = this.manager_.getCustomRepository(
      this.productTagRepository_
    )

    let productTags = []
    for (const tag of tags) {
      const existing = await productTagRepository.findOne({
        where: { value: tag },
      })

      if (existing) {
        productTags.push(existing)
      } else {
        const created = productTagRepository.create({ value: tag })
        productTags.push(created)
      }
    }

    return productTags
  }

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

  async upsertType_(type) {
    const productTypeRepository = this.manager_.getCustomRepository(
      this.productTypeRepository_
    )

    const existing = await productTypeRepository.findOne({
      where: { value: type },
    })

    if (existing) {
      return existing
    } else {
      return productTypeRepository.create({ value: type })
    }
  }

  async upsertCollection_(collection) {
    const collectionRepository = this.manager_.getCustomRepository(
      this.productCollectionRepository_
    )

    const existingCol = await collectionRepository.findOne({
      where: { title: collection },
    })

    if (existingCol) {
      return existingCol
    } else {
      return collectionRepository.create({
        title: collection,
      })
    }
  }

  async updateProduct(existingProduct, newProduct) {
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

      if (collection) {
        existingProduct.collection = await this.upsertCollection_(collection)
      }

      if (metadata) {
        existingProduct.metadata = this.productService_
          .withTransaction(manager)
          .setMetadata_(existingProduct, metadata)
      }

      if (tags) {
        existingProduct.tags = await this.upsertTags_(tags)
      }

      if (typeof type !== `undefined`) {
        existingProduct.type = await this.upsertType_(type)
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
        existingProduct.variants = await this.upsertVariants(
          existingProduct,
          variants
        )
      }

      for (const [key, value] of Object.entries(rest)) {
        existingProduct[key] = value
      }

      const updated = { ...rest, ...existingProduct }
      return updated
    })
  }

  async createProduct_(toCreate) {
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

      if (collection) {
        created.collection = await this.upsertCollection_(collection)
      }

      if (tags) {
        created.tags = await this.upsertTags_(tags)
      }

      if (typeof type !== `undefined` && type !== null) {
        created.type = await this.upsertType_(type)
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

  async importProducts(products, defaultShippingProfileId) {
    return this.atomicPhase_(async manager => {
      const productRepository = manager.getCustomRepository(
        this.productRepository_
      )

      let toSave = []

      await Promise.all(
        products.map(async product => {
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
            const updated = await this.updateProduct(exists, product)

            toSave.push(updated)
          } else {
            const created = await this.createProduct_({
              ...product,
              profile_id: defaultShippingProfileId,
            })

            toSave.push(created)
          }
        })
      )

      // Save all imported products and return ids
      let result = await productRepository.save(toSave)
      return result.map(res => res.id)
    })
  }
}

export default ImportService
