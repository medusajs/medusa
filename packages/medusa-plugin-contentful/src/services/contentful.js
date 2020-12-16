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

    this.redis_ = redis.createClient({
      url: options.redis_url,
    })
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

  async getVariantEntries_(productId) {
    try {
      const productVariants = await this.productService_.retrieveVariants(
        productId
      )

      const contentfulVariants = await Promise.all(
        productVariants.map((variant) =>
          this.updateProductVariantInContentful(variant)
        )
      )

      return contentfulVariants
    } catch (error) {
      console.log(error)
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

  async createProductInContentful(product) {
    try {
      const environment = await this.getContentfulEnvironment_()
      const variantEntries = await this.getVariantEntries_(product._id)
      const variantLinks = this.getVariantLinks_(variantEntries)

      const fieldsObject = {
        title: {
          "en-US": product.title,
        },
        variants: {
          "en-US": variantLinks,
        },
        options: {
          "en-US": product.options,
        },
        objectId: {
          "en-US": product._id,
        },
      }

      if (product.images.length > 0) {
        const imageLinks = await this.createImageAssets(product)

        const thumbnailAsset = await environment.createAsset({
          fields: {
            title: {
              "en-US": `${product.title}`,
            },
            description: {
              "en-US": "",
            },
            file: {
              "en-US": {
                contentType: "image/xyz",
                fileName: product.thumbnail,
                upload: product.thumbnail,
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

        fieldsObject.thumbnail = {
          "en-US": thumbnailLink,
        }

        if (imageLinks) {
          fieldsObject.images = {
            "en-US": imageLinks,
          }
        }
      }

      const result = await environment.createEntryWithId(
        "product",
        product._id,
        {
          fields: {
            ...fieldsObject,
          },
        }
      )

      const ignoreIds = (await this.getIgnoreIds_("product")) || []
      ignoreIds.push(product._id)
      this.redis_.set("product_ignore_ids", JSON.stringify(ignoreIds))
      return result
    } catch (error) {
      throw error
    }
  }

  async createProductVariantInContentful(variant) {
    try {
      const environment = await this.getContentfulEnvironment_()
      const result = await environment.createEntryWithId(
        "productVariant",
        variant._id,
        {
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
            options: {
              "en-US": variant.options,
            },
            objectId: {
              "en-US": variant._id,
            },
          },
        }
      )

      const ignoreIds = (await this.getIgnoreIds_("product_variant")) || []
      ignoreIds.push(variant._id)
      this.redis_.set("product_variant_ignore_ids", JSON.stringify(ignoreIds))
      return result
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

      const variantEntries = await this.getVariantEntries_(product._id)
      const variantLinks = this.getVariantLinks_(variantEntries)

      const productEntryFields = {
        ...productEntry.fields,
        title: {
          "en-US": product.title,
        },
        options: {
          "en-US": product.options,
        },
        variants: {
          "en-US": variantLinks,
        },
        objectId: {
          "en-US": product._id,
        },
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

      if (ignoreIds.includes(variant._id)) {
        const newIgnoreIds = ignoreIds.filter((id) => id !== variant._id)
        this.redis_.set(
          "product_variant_ignore_ids",
          JSON.stringify(newIgnoreIds)
        )
        return
      } else {
        ignoreIds.push(variant._id)
        this.redis_.set("product_variant_ignore_ids", JSON.stringify(ignoreIds))
      }

      const environment = await this.getContentfulEnvironment_()
      // check if product exists
      let variantEntry = undefined
      // if not, we create a new one
      try {
        variantEntry = await environment.getEntry(variant._id)
      } catch (error) {
        return this.createProductVariantInContentful(variant)
      }

      const cleanPrices = variant.prices.map((price) => ({
        ...price,
        sale_amount: price.sale_amount || undefined,
      }))

      const variantEntryFields = {
        ...variantEntry.fields,
        title: {
          "en-US": variant.title,
        },
        sku: {
          "en-US": variant.sku,
        },
        options: {
          "en-US": variant.options,
        },
        prices: {
          "en-US": cleanPrices,
        },
        objectId: {
          "en-US": variant._id,
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
        title: productEntry.fields.title["en-US"],
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
          title: variantEntry.fields.title["en-US"],
        }
      )

      return updatedVariant
    } catch (error) {
      throw error
    }
  }
}

export default ContentfulService
