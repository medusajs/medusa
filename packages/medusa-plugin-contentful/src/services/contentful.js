import _ from "lodash"
import { BaseService } from "medusa-interfaces"
import { createClient } from "contentful-management"
import redis from "redis"

class ContentfulService extends BaseService {
  constructor(
    { productService, productVariantService, eventBusService },
    options
  ) {
    super()

    this.productService_ = productService

    this.productVariantService_ = productVariantService

    this.eventBus_ = eventBusService

    this.options_ = options

    this.contentful_ = createClient({
      accessToken: options.access_token,
    })

    this.redis_ = redis.createClient()
  }

  async getIgnoreIds_(type) {
    return new Promise((resolve, reject) => {
      this.redis_.get(`${type}_ignore_ids`, (err, reply) => {
        if (err) {
          return reject(err)
        }

        return resolve(JSON.parse(reply))
      })
    })
  }

  async getContentfulEnvironment_() {
    try {
      const space = await this.contentful_.getSpace(this.options_.space_id)
      const environment = await space.getEnvironment(this.options_.environment)
      return environment
    } catch (error) {
      throw error
    }
  }

  async getVariantEntries_(variantEntryIds) {
    if (!variantEntryIds) {
      return []
    }

    try {
      const environment = await this.getContentfulEnvironment_()
      return Promise.all(variantEntryIds.map((v) => environment.getEntry(v)))
    } catch (error) {
      throw error
    }
  }

  async getVariantLinks_(variantEntries) {
    if (!variantEntries) {
      return []
    }

    return variantEntries.map((v) => ({
      sys: {
        type: "Link",
        linkType: "Entry",
        id: v.sys.id,
      },
    }))
  }

  async createProductInContentful(product) {
    try {
      const environment = await this.getContentfulEnvironment_()
      const variantEntries = await this.getVariantEntries_(product.variants)
      return environment.createEntryWithId("product", product._id, {
        fields: {
          title: {
            "en-US": product.title,
          },
          variants: {
            "en-US": [],
          },
          objectId: {
            "en-US": product._id,
          },
        },
      })
    } catch (error) {
      throw error
    }
  }

  async createProductVariantInContentful(variant) {
    try {
      const environment = await this.getContentfulEnvironment_()
      return environment.createEntryWithId("productVariant", variant._id, {
        fields: {
          title: {
            "en-US": variant.title,
          },
          sku: {
            "en-US": variant.sku,
          },
          prices: {
            "en-US": variant.prices,
          },
          objectId: {
            "en-US": variant._id,
          },
        },
      })
    } catch (error) {
      throw error
    }
  }

  async updateProductInContentful(product) {
    try {
      const ignoreIds = (await this.getIgnoreIds_("product")) || []

      if (ignoreIds.includes(product._id)) {
        const newIgnoreIds = ignoreIds.filter((id) => id !== product._id)
        this.redis_.set("product_ignore_ids", JSON.stringify(newIgnoreIds))
        return
      } else {
        ignoreIds.push(product._id)
        this.redis_.set("product_ignore_ids", JSON.stringify(ignoreIds))
      }

      const environment = await this.getContentfulEnvironment_()
      // check if product exists
      let productEntry = undefined
      try {
        productEntry = await environment.getEntry(product._id)
      } catch (error) {
        return this.createProductInContentful(product)
      }

      // const variantEntries = await this.getVariantEntries_(product.variants)
      productEntry.fields = _.assignIn(productEntry.fields, {
        title: {
          "en-US": product.title,
        },
        variants: {
          "en-US": [],
        },
      })

      const updatedEntry = await productEntry.update()
      const publishedEntry = await updatedEntry.publish()

      return publishedEntry
    } catch (error) {
      throw error
    }
  }

  async updateProductVariantInContentful(variant) {
    try {
      const environment = await this.getContentfulEnvironment_()
      // check if product exists
      let variantEntry = undefined
      variantEntry = await environment.getEntry(variant._id)
      // if not, we create a new one
      if (!variantEntry) {
        return this.createProductVariantInContentful(variant)
      }

      variantEntry.fields = _.assignIn(variantEntry.fields, {
        title: {
          "en-US": variant.title,
        },
        sku: {
          "en-US": variant.sku,
        },
        prices: {
          "en-US": variant.prices,
        },
        objectId: {
          "en-US": variant._id,
        },
      })

      await variantEntry.update()
      const publishedEntry = await variantEntry.publish()

      const ignoreIds = await this.getIgnoreIds_("product_variant")

      if (ignoreIds.includes(publishedEntry.sys.id)) {
        ignoreIds.filter((id) => id !== publishedEntry.sys.id)
      } else {
        this.eventBus_.emit("product-variant.updated", publishedEntry)
      }

      return publishedEntry
    } catch (error) {
      throw error
    }
  }

  async sendContentfulProductToAdmin(productId) {
    try {
      const environment = await this.getContentfulEnvironment_()
      const productEntry = await environment.getEntry(productId)

      const ignoreIds = (await this.getIgnoreIds_("product")) || []
      if (ignoreIds.includes(productId)) {
        const newIgnoreIds = ignoreIds.filter((id) => id !== productId)
        this.redis_.set("product_ignore_ids", JSON.stringify(newIgnoreIds))
        return
      } else {
        ignoreIds.push(productId)
        this.redis_.set("product_ignore_ids", JSON.stringify([productId]))
      }

      const updatedProduct = await this.productService_.update(productId, {
        title: productEntry.fields.title["en-US"],
        // variants: productEntry.fields.variants["en-US"],
      })

      return updatedProduct
    } catch (error) {
      console.log(error)
      throw error
    }
  }

  async sendContentfulProductVariantToAdmin(variant) {
    try {
      const environment = await this.getContentfulEnvironment_()
      const variantEntry = await environment.getEntry(variant.sys.id)

      const ignoreIds = await this.getIgnoreIds_("product_variant")
      ignoreIds.push(variant.sys.id)
      this.redis_.set("product_variant_ignore_ids", JSON.stringify(ignoreIds))

      const updatedVariant = await this.variantService_.update(
        variantEntry.objectId,
        {
          title: variantEntry.fields.title["en-US"],
          sku: variantEntry.fields.sku["en-US"],
          prices: variantEntry.fields.prices["en-US"],
        }
      )

      return updatedVariant
    } catch (error) {
      throw error
    }
  }
}

export default ContentfulService
