import _ from "lodash"
import { BaseService } from "medusa-interfaces"
import { createClient } from "contentful-management"

class ContentfulService extends BaseService {
  constructor(
    { productService, redisClient, productVariantService, eventBusService },
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

    this.redis_ = redisClient
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

  async getVariantEntries_(variants) {
    try {
      const contentfulVariants = await Promise.all(
        variants.map((variant) =>
          this.updateProductVariantInContentful(variant)
        )
      )

      return contentfulVariants
    } catch (error) {
      throw error
    }
  }

  getVariantLinks_(variantEntries) {
    return variantEntries.map((v) => ({
      sys: {
        type: "Link",
        linkType: "Entry",
        id: v.sys.id,
      },
    }))
  }

  async createImageAssets(product) {
    const environment = await this.getContentfulEnvironment_()

    let assets = []
    await Promise.all(
      product.images
        .filter((image) => image !== product.thumbnail)
        .map(async (image, i) => {
          const asset = await environment.createAsset({
            fields: {
              title: {
                "en-US": `${product.title} - ${i}`,
              },
              description: {
                "en-US": "",
              },
              file: {
                "en-US": {
                  contentType: "image/xyz",
                  fileName: image,
                  upload: image,
                },
              },
            },
          })

          await asset.processForAllLocales()

          assets.push({
            sys: {
              type: "Link",
              linkType: "Asset",
              id: asset.sys.id,
            },
          })
        })
    )

    return assets
  }

  getCustomField(field, type) {
    const customOptions = this.options_[`custom_${type}_fields`]

    if (customOptions) {
      return customOptions[field] || field
    } else {
      return field
    }
  }

  async createProductInContentful(product) {
    try {
      const p = await this.productService_.retrieve(product.id, {
        relations: [
          "variants",
          "options",
          "tags",
          "type",
          "collection",
          "images",
        ],
      })

      const environment = await this.getContentfulEnvironment_()
      const variantEntries = await this.getVariantEntries_(p.variants)
      const variantLinks = this.getVariantLinks_(variantEntries)

      const fields = {
        [this.getCustomField("title", "product")]: {
          "en-US": p.title,
        },
        [this.getCustomField("variants", "product")]: {
          "en-US": variantLinks,
        },
        [this.getCustomField("options", "product")]: {
          "en-US": p.options,
        },
        [this.getCustomField("medusaId", "product")]: {
          "en-US": p.id,
        },
      }

      if (p.images.length > 0) {
        const imageLinks = await this.createImageAssets(product)

        const thumbnailAsset = await environment.createAsset({
          fields: {
            title: {
              "en-US": `${p.title}`,
            },
            description: {
              "en-US": "",
            },
            file: {
              "en-US": {
                contentType: "image/xyz",
                fileName: p.thumbnail,
                upload: p.thumbnail,
              },
            },
          },
        })

        await thumbnailAsset.processForAllLocales()

        const thumbnailLink = {
          sys: {
            type: "Link",
            linkType: "Asset",
            id: thumbnailAsset.sys.id,
          },
        }

        fields.thumbnail = {
          "en-US": thumbnailLink,
        }

        if (imageLinks) {
          fields.images = {
            "en-US": imageLinks,
          }
        }
      }

      if (p.type) {
        const type = {
          "en-US": p.type.value,
        }

        fields[this.getCustomField("type", "product")] = type
      }

      if (p.collection) {
        const collection = {
          "en-US": p.collection.title,
        }

        fields[this.getCustomField("collection", "product")] = collection
      }

      if (p.tags) {
        const tags = {
          "en-US": p.tags,
        }

        fields[this.getCustomField("tags", "product")] = tags
      }

      if (p.handle) {
        const handle = {
          "en-US": p.handle,
        }

        fields[this.getCustomField("handle", "product")] = handle
      }

      const result = await environment.createEntryWithId("product", p.id, {
        fields,
      })

      const ignoreIds = (await this.getIgnoreIds_("product")) || []
      ignoreIds.push(product.id)
      this.redis_.set("product_ignore_ids", JSON.stringify(ignoreIds))
      return result
    } catch (error) {
      throw error
    }
  }

  async createProductVariantInContentful(variant) {
    try {
      const v = await this.productVariantService_.retrieve(variant.id, {
        relations: ["prices", "options"],
      })

      const environment = await this.getContentfulEnvironment_()
      const result = await environment.createEntryWithId(
        "productVariant",
        v.id,
        {
          fields: {
            [this.getCustomField("title", "variant")]: {
              "en-US": v.title,
            },
            [this.getCustomField("sku", "variant")]: {
              "en-US": v.sku,
            },
            [this.getCustomField("prices", "variant")]: {
              "en-US": v.prices,
            },
            [this.getCustomField("options", "variant")]: {
              "en-US": v.options,
            },
            [this.getCustomField("medusaId", "variant")]: {
              "en-US": v.id,
            },
          },
        }
      )

      const ignoreIds = (await this.getIgnoreIds_("product_variant")) || []
      ignoreIds.push(v.id)
      this.redis_.set("product_variant_ignore_ids", JSON.stringify(ignoreIds))
      return result
    } catch (error) {
      throw error
    }
  }

  async updateProductInContentful(product) {
    try {
      const ignoreIds = (await this.getIgnoreIds_("product")) || []

      if (ignoreIds.includes(product.id)) {
        const newIgnoreIds = ignoreIds.filter((id) => id !== product.id)
        this.redis_.set("product_ignore_ids", JSON.stringify(newIgnoreIds))
        return
      } else {
        ignoreIds.push(product.id)
        this.redis_.set("product_ignore_ids", JSON.stringify(ignoreIds))
      }

      const environment = await this.getContentfulEnvironment_()
      // check if product exists
      let productEntry = undefined
      try {
        productEntry = await environment.getEntry(product.id)
      } catch (error) {
        return this.createProductInContentful(product)
      }

      const p = await this.productService_.retrieve(product.id, {
        relations: [
          "options",
          "variants",
          "type",
          "collection",
          "tags",
          "images",
        ],
      })

      const variantEntries = await this.getVariantEntries_(p.variants)
      const variantLinks = this.getVariantLinks_(variantEntries)

      const productEntryFields = {
        ...productEntry.fields,
        [this.getCustomField("title", "product")]: {
          "en-US": p.title,
        },
        [this.getCustomField("options", "product")]: {
          "en-US": p.options,
        },
        [this.getCustomField("variants", "product")]: {
          "en-US": variantLinks,
        },
        [this.getCustomField("medusaId", "product")]: {
          "en-US": p.id,
        },
      }

      if (p.thumbnail) {
        const thumbnailAsset = await environment.createAsset({
          fields: {
            title: {
              "en-US": `${p.title}`,
            },
            description: {
              "en-US": "",
            },
            file: {
              "en-US": {
                contentType: "image/xyz",
                fileName: p.thumbnail,
                upload: p.thumbnail,
              },
            },
          },
        })

        await thumbnailAsset.processForAllLocales()

        const thumbnailLink = {
          sys: {
            type: "Link",
            linkType: "Asset",
            id: thumbnailAsset.sys.id,
          },
        }

        productEntryFields.thumbnail = {
          "en-US": thumbnailLink,
        }
      }

      if (p.type) {
        const type = {
          "en-US": p.type.value,
        }

        productEntryFields[this.getCustomField("type", "product")] = type
      }

      if (p.collection) {
        const collection = {
          "en-US": p.collection.title,
        }

        productEntryFields[
          this.getCustomField("collection", "product")
        ] = collection
      }

      if (p.tags) {
        const tags = {
          "en-US": p.tags,
        }

        productEntryFields[this.getCustomField("tags", "product")] = tags
      }

      if (p.handle) {
        const handle = {
          "en-US": p.handle,
        }

        productEntryFields[this.getCustomField("handle", "product")] = handle
      }

      productEntry.fields = productEntryFields

      const updatedEntry = await productEntry.update()
      const publishedEntry = await updatedEntry.publish()

      return publishedEntry
    } catch (error) {
      throw error
    }
  }

  async updateProductVariantInContentful(variant) {
    try {
      const ignoreIds = (await this.getIgnoreIds_("product_variant")) || []

      if (ignoreIds.includes(variant.id)) {
        const newIgnoreIds = ignoreIds.filter((id) => id !== variant.id)
        this.redis_.set(
          "product_variant_ignore_ids",
          JSON.stringify(newIgnoreIds)
        )
        return
      } else {
        ignoreIds.push(variant.id)
        this.redis_.set("product_variant_ignore_ids", JSON.stringify(ignoreIds))
      }

      const environment = await this.getContentfulEnvironment_()
      // check if product exists
      let variantEntry = undefined
      // if not, we create a new one
      try {
        variantEntry = await environment.getEntry(variant.id)
      } catch (error) {
        return this.createProductVariantInContentful(variant)
      }

      const v = await this.productVariantService_.retrieve(variant.id, {
        relations: ["prices", "options"],
      })

      const variantEntryFields = {
        ...variantEntry.fields,
        [this.getCustomField("title", "variant")]: {
          "en-US": v.title,
        },
        [this.getCustomField("sku", "variant")]: {
          "en-US": v.sku,
        },
        [this.getCustomField("options", "variant")]: {
          "en-US": v.options,
        },
        [this.getCustomField("prices", "variant")]: {
          "en-US": v.prices,
        },
        [this.getCustomField("medusaId", "variant")]: {
          "en-US": v.id,
        },
      }

      variantEntry.fields = variantEntryFields

      const updatedEntry = await variantEntry.update()
      const publishedEntry = await updatedEntry.publish()

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
        this.redis_.set("product_ignore_ids", JSON.stringify(ignoreIds))
      }

      let update = {
        title:
          productEntry.fields[this.getCustomField("title", "product")]["en-US"],
      }

      // Get the thumbnail, if present
      if (productEntry.fields.thumbnail) {
        const thumb = await environment.getAsset(
          productEntry.fields.thumbnail["en-US"].sys.id
        )

        update.thumbnail = thumb.fields.file["en-US"].url
      }

      const updatedProduct = await this.productService_.update(
        productId,
        update
      )

      return updatedProduct
    } catch (error) {
      throw error
    }
  }

  async sendContentfulProductVariantToAdmin(variantId) {
    try {
      const environment = await this.getContentfulEnvironment_()
      const variantEntry = await environment.getEntry(variantId)

      const ignoreIds = (await this.getIgnoreIds_("product_variant")) || []
      if (ignoreIds.includes(variantId)) {
        const newIgnoreIds = ignoreIds.filter((id) => id !== variantId)
        this.redis_.set(
          "product_variant_ignore_ids",
          JSON.stringify(newIgnoreIds)
        )
        return
      } else {
        ignoreIds.push(variantId)
        this.redis_.set("product_variant_ignore_ids", JSON.stringify(ignoreIds))
      }

      const updatedVariant = await this.productVariantService_.update(
        variantId,
        {
          title:
            variantEntry.fields[this.getCustomField("title", "variant")][
              "en-US"
            ],
        }
      )

      return updatedVariant
    } catch (error) {
      throw error
    }
  }

  async getType(type) {
    const environment = await this.getContentfulEnvironment_()
    return environment.getContentType(type)
  }
}

export default ContentfulService
