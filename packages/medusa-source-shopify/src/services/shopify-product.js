import { BaseService } from "medusa-interfaces"
import _ from "lodash"
import { parsePrice } from "../utils/parse-price"
import { INCLUDE_PRESENTMENT_PRICES } from "../utils/const"

class ShopifyProductService extends BaseService {
  constructor(
    {
      manager,
      productService,
      productVariantService,
      shippingProfileService,
      shopifyClientService,
      shopifyRedisService,
    },
    options
  ) {
    super()

    this.options = options

    /** @private @const {EntityManager} */
    this.manager_ = manager
    /** @private @const {ProductService} */
    this.productService_ = productService
    /** @private @const {ProductVariantService} */
    this.productVariantService_ = productVariantService
    /** @private @const {ShippingProfileService} */
    this.shippingProfileService_ = shippingProfileService
    /** @private @const {ShopifyRestClient} */
    this.client_ = shopifyClientService

    this.redis_ = shopifyRedisService
  }

  withTransaction(transactionManager) {
    if (!transactionManager) {
      return this
    }

    const cloned = new ShopifyProductService({
      manager: transactionManager,
      options: this.options,
      shippingProfileService: this.shippingProfileService_,
      productVariantService: this.productVariantService_,
      productService: this.productService_,
      shopifyClientService: this.shopifyClientService,
      shopifyRedisService: this.redis_,
    })

    cloned.transactionManager_ = transactionManager

    return cloned
  }

  /**
   * Creates a product based on an event in Shopify.
   * Also adds the product to a collection if a collection id is provided
   * @param {object} data
   * @param {string} collectionId optional
   * @returns the created product
   */
  async create(data, collectionId) {
    return this.atomicPhase_(async (manager) => {
      const ignore = await this.redis_.shouldIgnore(data.id, "product.created")
      if (ignore) {
        return
      }

      let existingProduct = await this.productService_
        .withTransaction(manager)
        .retrieveByExternalId(data.id)
        .catch((_) => undefined)

      if (existingProduct) {
        return existingProduct
      }

      const normalizedProduct = this.normalizeProduct_(data, collectionId)
      normalizedProduct.profile_id = await this.getShippingProfile_(
        normalizedProduct.is_giftcard
      )

      let variants = normalizedProduct.variants
      delete normalizedProduct.variants

      const product = await this.productService_
        .withTransaction(manager)
        .create(normalizedProduct)

      if (variants) {
        variants = variants.map((v) =>
          this.addVariantOptions_(v, product.options)
        )

        for (const variant of variants) {
          await this.productVariantService_
            .withTransaction(manager)
            .create(product.id, variant)
        }
      }

      await this.redis_.addIgnore(data.id, "product.created")

      return product
    })
  }

  async update(data) {
    return this.atomicPhase_(async (manager) => {
      const ignore = await this.redis_.shouldIgnore(data.id, "product_update")
      if (ignore) {
        return
      }

      let existing = await this.productService_
        .retrieveByExternalId(data.id, {
          relations: ["variants", "options"],
        })
        .catch((_) => undefined)

      if (!existing) {
        return await this.create(data)
      }

      /**
       * Variants received from webhook do not include
       * presentment prices. Therefore, we fetch them
       * separately, and add to the data object.
       */
      const { variants } = await this.client_
        .get({
          path: `products/${data.id}`,
          extraHeaders: INCLUDE_PRESENTMENT_PRICES,
        })
        .then((res) => {
          return res.body.product
        })

      data.variants = variants || []
      const normalized = this.normalizeProduct_(data)

      existing = await this.addProductOptions_(existing, normalized.options)

      await this.updateVariants_(existing, normalized.variants)
      await this.deleteVariants_(existing, normalized.variants)
      delete normalized.variants

      const update = {}

      for (const key of Object.keys(normalized)) {
        if (normalized[key] !== existing[key]) {
          update[key] = normalized[key]
        }
      }

      if (!_.isEmpty(update)) {
        return await this.productService_
          .withTransaction(manager)
          .update(existing.id, update)
      }

      await this.redis_.addIgnore(data.id, "product.updated")

      return Promise.resolve()
    })
  }

  /**
   * Deletes a product based on an event in Shopify
   * @param {string} id
   * @returns
   */
  async delete(id) {
    return this.atomicPhase_(async (manager) => {
      const product = await this.productService_.retrieveByExternalId(id)

      return await this.productService_
        .withTransaction(manager)
        .delete(product.id)
    })
  }

  async updateCollectionId(productId, collectionId) {
    return this.atomicPhase_(async (manager) => {
      return await this.productService_
        .withTransaction(manager)
        .update(productId, { collection_id: collectionId })
    })
  }

  async updateVariants_(product, updateVariants) {
    return this.atomicPhase_(async (manager) => {
      const { id, variants, options } = product
      for (let variant of updateVariants) {
        const ignore = await this.redis_.shouldIgnore(
          variant.metadata.sh_id,
          "product-variant.updated"
        )
        if (ignore) {
          continue
        }

        variant = this.addVariantOptions_(variant, options)
        let match = variants.find((v) => v.sku === variant.sku)
        if (match) {
          await this.productVariantService_
            .withTransaction(manager)
            .update(match.id, variant)
          await this.redis_.addIgnore(
            variant.metadata.sh_id,
            "product-variant.updated"
          )
        } else {
          await this.productVariantService_
            .withTransaction(manager)
            .create(id, variant)
          await this.redis_.addIgnore(
            variant.metadata.sh_id,
            "product-variant.created"
          )
        }
      }
    })
  }

  async deleteVariants_(product, updateVariants) {
    return this.atomicPhase_(async (manager) => {
      const { variants } = product
      for (let variant of variants) {
        const ignore = await this.redis_.shouldIgnore(
          variant.metadata.sh_id,
          "product-variant.deleted"
        )
        if (ignore) {
          continue
        }

        let match = updateVariants.find((v) => v.sku === variant.sku)
        if (!match) {
          await this.productVariantService_
            .withTransaction(manager)
            .delete(variant.id)
          await this.redis_.addIgnore(
            variant.metadata.sh_id,
            "product-variant.deleted"
          )
        }
      }
    })
  }

  addVariantOptions_(variant, productOptions) {
    const options = productOptions.map((o, i) => ({
      option_id: o.id,
      ...variant.options[i],
    }))
    variant.options = options

    return variant
  }

  async addProductOptions_(product, updateOptions) {
    return this.atomicPhase_(async (manager) => {
      const { id, options } = product

      for (const option of updateOptions) {
        const match = options.find((o) => o.title === option.title)
        if (!match) {
          await this.productService_
            .withTransaction(manager)
            .addOption(id, option.title)
        }
      }

      const result = await this.productService_.retrieve(id, {
        relations: ["variants", "options"],
      })
      return result
    })
  }

  async getShippingProfile_(isGiftCard) {
    let shippingProfile
    if (isGiftCard) {
      shippingProfile = await this.shippingProfileService_.retrieveGiftCardDefault()
    } else {
      shippingProfile = await this.shippingProfileService_.retrieveDefault()
    }

    return shippingProfile
  }

  /**
   * Normalizes a product, with a possible optional collection id
   * @param {object} product
   * @param {string} collectionId optional
   * @returns
   */
  normalizeProduct_(product, collectionId) {
    return {
      title: product.title,
      handle: product.handle,
      description: product.body_html,
      product_type: {
        value: product.product_type,
      },
      is_giftcard: product.product_type === "Gift Cards",
      options:
        product.options.map((option) => this.normalizeProductOption_(option)) ||
        [],
      variants:
        product.variants.map((variant) => this.normalizeVariant_(variant)) ||
        [],
      tags: product.tags.split(",").map((tag) => this.normalizeTag_(tag)) || [],
      images: product.images.map((img) => img.src) || [],
      thumbnail: product.image?.src || null,
      collection_id: collectionId || null,
      external_id: product.id,
      status: "proposed",
    }
  }

  /**
   * Normalizes a product option
   * @param {object} option
   * @returns
   */
  normalizeProductOption_(option) {
    return {
      title: option.name,
      values: option.values.map((v) => {
        return { value: v }
      }),
    }
  }

  /**
   * Normalizes a product variant
   * @param {object} variant
   * @returns
   */
  normalizeVariant_(variant) {
    return {
      title: variant.title,
      prices: this.normalizePrices_(variant.presentment_prices),
      sku: variant.sku || null,
      barcode: variant.barcode || null,
      upc: variant.barcode || null,
      inventory_quantity: variant.inventory_quantity,
      variant_rank: variant.position,
      allow_backorder: variant.inventory_policy === "continue",
      manage_inventory: variant.inventory_management === "shopify",
      weight: variant.grams,
      options: this.normalizeVariantOptions_(
        variant.option1,
        variant.option2,
        variant.option3
      ),
      metadata: {
        sh_id: variant.id,
      },
    }
  }

  /**
   * Normalizes an array of presentment prices
   * @param {array} presentmentPrices
   * @returns
   */
  normalizePrices_(presentmentPrices) {
    return presentmentPrices.map((p) => {
      return {
        amount: parsePrice(p.price.amount),
        currency_code: p.price.currency_code.toLowerCase(),
      }
    })
  }

  /**
   * Normalizes the three possble variant options
   * @param {string} option1
   * @param {string} option2
   * @param {string} option3
   * @returns
   */
  normalizeVariantOptions_(option1, option2, option3) {
    let opts = []
    if (option1) {
      opts.push({
        value: option1,
      })
    }

    if (option2) {
      opts.push({
        value: option2,
      })
    }

    if (option3) {
      opts.push({
        value: option3,
      })
    }

    return opts
  }

  /**
   * Normalizes a tag
   * @param {string} tag
   * @returns
   */
  normalizeTag_(tag) {
    return {
      value: tag,
    }
  }
}

export default ShopifyProductService
