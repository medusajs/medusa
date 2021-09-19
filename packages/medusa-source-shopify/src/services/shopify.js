import { MedusaError } from "medusa-core-utils"
import { BaseService } from "medusa-interfaces"

class ShopifyService extends BaseService {
  constructor({ manager, productService, collectionService }, options) {
    super()

    this.options = options

    /** @private @const {EntityManager} */
    this.manager_ = manager
    /** @private @const {ProductService} */
    this.productService_ = productService
    /** @private @const {ProductCollectionService} */
    this.collectionService_ = collectionService
  }

  async createCollection(collection) {
    const normalizedCollection = this.normalizeCollection(collection)
    return await this.collectionService_.create(normalizedCollection)
  }

  async createProduct(product, collection_id) {
    const normalizedProduct = this.normalizeProduct(product, collection_id)
    return await this.productService_.create(normalizedProduct)
  }

  normalizeProduct(product, collection_id) {
    return {
      title: product.title,
      handle: product.handle,
      options:
        product.options.map((option) => normalizeProductOption(option)) || [],
      variants:
        product.variants.map((variant) => normalizeVariant(variant)) || [],
      tags: product.tags.split(",").map((tag) => normalizeTag(tag)) || [],
      images: product.images.map((img) => img.src) || [],
      thumbnail: product.image?.src || null,
      collection_id: collection_id,
      metadata: {
        sh_id: product.id,
      },
      status: "proposed", //products from Shopify should always be proposed
    }
  }

  normalizeProductOption(option) {
    return {
      title: option.name,
      values: option.values.map((v) => {
        return { value: v }
      }),
    }
  }

  normalizePrices(presentment_prices) {
    return presentment_prices.map((p) => {
      return {
        amount: p.price.amount,
        currency_code: p.price.currency_code.toLowerCase(),
      }
    })
  }

  normalizeVariant(variant) {
    return {
      title: variant.title,
      prices: normalizePrices(variant.presentment_prices),
      sku: variant.sku,
      barcode: variant.barcode,
      upc: variant.barcode,
      inventory_quantity: variant.inventory_quantity,
      variant_rank: variant.position,
      allow_backorder: variant.inventory_policy === "continue",
      manage_inventory: variant.inventory_management === "shopify", //if customer previously managed inventory either through Shopify or another fulfillment provider then true
      weight: variant.weight,
      options: normalizeVariantOptions(
        variant.option1,
        variant.option2,
        variant.option3
      ),
    }
  }

  normalizeVariantOptions(option1, option2, option3) {
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

  normalizeTag(tag) {
    return {
      value: tag,
    }
  }

  normalizeCollection(shopifyCollection) {
    return {
      title: shopifyCollection.title,
      handle: shopifyCollection.handle,
      metadata: {
        sh_id: shopifyCollection.id,
        sh_body_html: shopifyCollection.body_html,
      },
    }
  }
}
