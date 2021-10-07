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
      let existingProduct = await this.productService_
        .withTransaction(manager)
        .retrieveByExternalId(data.id)
        .catch((_) => undefined)

      if (existingProduct) {
        return existingProduct
      }

      let shippingProfile

      const normalizedProduct = this.normalizeProduct_(data, collectionId)
      // Get default shipping profile
      if (normalizedProduct.is_giftcard) {
        shippingProfile = await this.shippingProfileService_.retrieveGiftCardDefault()
      } else {
        shippingProfile = await this.shippingProfileService_.retrieveDefault()
      }

      const variants = normalizedProduct.variants
      delete normalizedProduct.variants

      normalizedProduct.profile_id = shippingProfile

      const product = await this.productService_
        .withTransaction(manager)
        .create(normalizedProduct)

      if (variants && variants.length) {
        const optionIds = normalizedProduct.options.map(
          (option) =>
            product.options.find(
              (newOption) => newOption.title === option.title
            ).id
        )

        for (const v of variants) {
          const variant = {
            ...v,
            options: v.options.map((option, index) => ({
              ...option,
              option_id: optionIds[index],
            })),
          }

          await this.productVariantService_
            .withTransaction(manager)
            .create(product.id, variant)
        }
      }

      return product
    })
  }

  /**
   * Updates a product based on an event in Shopify
   * @param {object} product
   * @returns
   */
  async update(product) {
    return this.atomicPhase_(async (manager) => {
      const medusaProduct = await this.productService_.retrieveByHandle(
        product.handle,
        {
          relations: ["variants"],
        }
      )

      const { variants } = await this.client_
        .get({
          path: `products/${product.id}`,
          extraHeaders: INCLUDE_PRESENTMENT_PRICES,
        })
        .then((res) => {
          return res.body.product
        })

      product.variants = variants || []

      const normalizedUpdate = this.normalizeProduct_(product)
      const updates = _.pickBy(normalizedUpdate, Boolean)

      updates.variants = await Promise.all(
        updates.variants.map(async (v) => {
          const match = medusaProduct.variants.find((mv) => mv.sku === v.sku)

          if (match) {
            let variant = await this.productVariantService_
              .withTransaction(manager)
              .retrieve(match.id, { relations: ["options"] })
            let options = variant.options.map((option, i) => {
              return { ...option, ...v.options[i] }
            })
            v.options = options
            v.id = variant.id
          }
          //errors on update with new variant
          return v
        })
      )

      return await this.productService_
        .withTransaction(manager)
        .update(medusaProduct.id, updates)
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
