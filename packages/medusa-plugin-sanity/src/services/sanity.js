import _ from "lodash"
import { BaseService } from "medusa-interfaces"
import sanityClient from "@sanity/client"
import { createReadStream } from "fs" 
import { basename } from "path" 


const IGNORE_THRESHOLD = 2 // seconds

class SanityService extends BaseService {
  constructor(
    {
      regionService,
      productService,
      redisClient,
      productVariantService,
      eventBusService,
    },
    options
  ) {
    super()

    this.productService_ = productService

    this.productVariantService_ = productVariantService

    this.regionService_ = regionService

    this.eventBus_ = eventBusService

    this.options_ = options

    this.sanity_ = sanityClient(options) 

    this.redis_ = redisClient
  }

  async addIgnore_(id, side) {
    const key = `${id}_ignore_${side}`
    return await this.redis_.set(
      key,
      1,
      "EX",
      this.options_.ignore_threshold || IGNORE_THRESHOLD
    )
  }

  async shouldIgnore_(id, side) {
    const key = `${id}_ignore_${side}`
    return await this.redis_.get(key)
  }

  async getVariantEntries_(variants) {
    try {
      const sanityVariants = await Promise.all(
        variants.map(async (variant) => {
          let updated = await this.updateProductVariantInSanity(variant)
          return updated
        })
      )

      return sanityVariants
    } catch (error) {
      throw error
    }
  }

  getVariantLinks_(variantEntries) {
    return variantEntries.map((v) => ({
      _type: 'image',
      asset: {
        _type: 'reference',
        _ref: v.id
      }
    }))
  }

  async createImageAssets(product) {

    const assets = []
    await Promise.all(
      product.images
        .filter((image) => image.url !== product.thumbnail)
        .map(async (image, i) => {
          const asset = await this.sanity_.upload('image', createReadStream(image.url), {
            filename: basename(image.url)
          }).then(imageAsset => {
            return this.sanity_.createOrReplace({
              title: `${product.title} - ${i}`,
              description: '',
              file: {
                _type: 'image',
                asset: {
                  _type: 'reference',
                  _ref: imageAsset._id
                }
              }
            })
          }) 

          assets.push({
            asset
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

  async createProductInSanity(product) {
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

      const variantEntries = await this.getVariantEntries_(p.variants)
      const variantLinks = this.getVariantLinks_(variantEntries)

      const fields = {
        [this.getCustomField("title", "product")]: p.title,
    
        [this.getCustomField("subtitle", "product")]: p.subtitle,
    
        [this.getCustomField("description", "product")]: p.description,
    
        [this.getCustomField("variants", "product")]: variantLinks,
    
        [this.getCustomField("options", "product")]: this.transformMedusaIds(p.options),
    
        [this.getCustomField("medusaId", "product")]: p.id,
      }

      if (p.images.length > 0) {
        const imageLinks = await this.createImageAssets(product)
        if (imageLinks) {
          fields.images = imageLinks
        }
      }
      
      if (p.thumbnail) {
        const thumbnailAsset = await this.sanity_.assets.upload('image', createReadStream(p.thumbnail), {
          filename: basename(p.thumbnail)
        }).then(() => {
          this.sanity_.createOrReplace({
            title: `${p.title}`,
            description: '',
            file: {
              _type: 'image',
              asset: {
                _type: 'reference',
                _ref: imageAsset._id
              }
            }
          })
        })

        const thumbnailLink = {
          _type: 'image',
          asset: {  
            _type: 'reference',
            _ref: thumbnailAsset._id
          }
          
        }

        fields.thumbnail = thumbnailLink
      }

      if (p.type) {
        const type = p.type.value

        fields[this.getCustomField("type", "product")] = type
      }

      if (p.collection) {
        const collection = p.collection.title

        fields[this.getCustomField("collection", "product")] = collection
      }

      if (p.tags) {
        const tags = p.tags

        fields[this.getCustomField("tags", "product")] = tags
      }

      if (p.handle) {
        const handle = p.handle

        fields[this.getCustomField("handle", "product")] = handle
      }

      const result = await this.sanity_.createOrReplace({
        _id: p.id,
        fields,
      })

      return result
    } catch (error) {
      throw error
    }
  }

  async createProductVariantInSanity(variant) {
    try {
      const v = await this.productVariantService_.retrieve(variant.id, {
        relations: ["prices", "options"],
      })

      const result = await this.sanity_.createOrReplace(
        {
          _type: "productVarient",
          _id: v.id,
          fields: {
            [this.getCustomField("title", "variant")]: {
              "en-US": v.title,
            },
            [this.getCustomField("sku", "variant")]: {
              "en-US": v.sku,
            },
            [this.getCustomField("prices", "variant")]: {
              "en-US": this.transformMedusaIds(v.prices),
            },
            [this.getCustomField("options", "variant")]: {
              "en-US": this.transformMedusaIds(v.options),
            },
            [this.getCustomField("medusaId", "variant")]: {
              "en-US": v.id,
            },
          },
        }
      )

      return result
    } catch (error) {
      throw error
    }
  }

  async createRegionInSanity(region) {
    
    try {
      const r = await this.regionService_.retrieve(region.id, {
        relations: ["countries", "payment_providers", "fulfillment_providers"],
      })
      const fields = {
        [this.getCustomField("medusaId", "region")]: {
          "en-US": r.id,
        },
        [this.getCustomField("name", "region")]: {
          "en-US": r.name,
        },
        [this.getCustomField("countries", "region")]: {
          "en-US": r.countries,
        },
        [this.getCustomField("paymentProviders", "region")]: {
          "en-US": r.payment_providers,
        },
        [this.getCustomField("fulfillmentProviders", "region")]: {
          "en-US": r.fulfillment_providers,
        },
      }

      const result = await this.sanity_.createOrReplace({
        _type: "region",
        _id: r.id,
        fields,
      })

      return result
    } catch (error) {
      throw error
    }
  }

  async updateRegionInSanity(data) {

    const updateFields = [
      "name",
      "currency_code",
      "countries",
      "payment_providers",
      "fulfillment_providers",
    ]

    const found = data.fields.find((f) => updateFields.includes(f))
    if (!found) {
      return
    }

    try {
      const ignore = await this.shouldIgnore_(data.id, "sanity")
      if (ignore) {
        return
      }

      const r = await this.regionService_.retrieve(data.id, {
        relations: ["countries", "payment_providers", "fulfillment_providers"],
      })


      // check if region exists
      let regionEntry = undefined
      try {
        regionEntry = await this.sanity_.getDocument(data.id)
      } catch (error) {
        return this.createRegionInSanity(r)
      }

      const regionEntryFields = {
        [this.getCustomField("name", "region")]: {
          "en-US": r.name,
        },
        [this.getCustomField("countries", "region")]: {
          "en-US": r.countries,
        },
        [this.getCustomField("paymentProviders", "region")]: {
          "en-US": r.payment_providers,
        },
        [this.getCustomField("fulfillmentProviders", "region")]: {
          "en-US": r.fulfillment_providers,
        },
      }

      this.sanity_.patch(data.id).set(regionEntryFields)

      await this.addIgnore_(data.id, "medusa")

      return publishedEntry
    } catch (error) {
      throw error
    }
  }

  async updateProductInSanity(data) {
    const updateFields = [
      "variants",
      "options",
      "tags",
      "title",
      "subtitle",
      "tags",
      "type",
      "type_id",
      "collection",
      "collection_id",
      "thumbnail",
    ]

    const found = data.fields.find((f) => updateFields.includes(f))
    if (!found) {
      return Promise.resolve()
    }

    try {
      const ignore = await this.shouldIgnore_(data.id, "sanity")
      if (ignore) {
        return Promise.resolve()
      }

      const p = await this.productService_.retrieve(data.id, {
        relations: [
          "options",
          "variants",
          "type",
          "collection",
          "tags",
          "images",
        ],
      })

      // check if product exists
      let productEntry = undefined
      try {
        productEntry = await this.sanity_.getDocument(data.id)
      } catch (error) {
        return this.createProductIn(p)
      }

      const variantEntries = await this.getVariantEntries_(p.variants)
      const variantLinks = this.getVariantLinks_(variantEntries)

      const productEntryFields = {
        [this.getCustomField("title", "product")]: {
          "en-US": p.title,
        },
        [this.getCustomField("subtitle", "product")]: {
          "en-US": p.subtitle,
        },
        [this.getCustomField("description", "product")]: {
          "en-US": p.description,
        },
        [this.getCustomField("options", "product")]: {
          "en-US": this.transformMedusaIds(p.options),
        },
        [this.getCustomField("variants", "product")]: {
          "en-US": variantLinks,
        },
        [this.getCustomField("medusaId", "product")]: {
          "en-US": p.id,
        },
      }

      if (data.fields.includes("thumbnail") && p.thumbnail) {
        let url = p.thumbnail
        if (p.thumbnail.startsWith("//")) {
          url = `https:${url}`
        }

        const thumbnailAsset = await this.sanity_.upload('image', createReadStream(url), {
            filename: basename(url)
        }).then(imageAsset => {
          this.sanity_.createOrReplace({
            fields: {
              title: {
                "en-US": `${p.title}`,
              },
              description: {
                "en-US": "",
              },
              file: {
                _type: 'image',
                asset: {
                  _type: 'reference',
                  _ref: imageAsset._id
                }
              }
            }
          })
        })

        const thumbnailLink = {
          _type: 'image',
          asset: {  
            _type: 'reference',
            _ref: thumbnailAsset._id
          }
        }

        productEntryFields.thumbnail = thumbnailLink
      }

      if (p.type) {
        const type = p.type.value

        productEntryFields[this.getCustomField("type", "product")] = type
      }

      if (p.collection) {
        const collection = p.collection.title

        productEntryFields[this.getCustomField("collection", "product")] =
          collection
      }

      if (p.tags) {
        const tags = p.tags

        productEntryFields[this.getCustomField("tags", "product")] = tags
      }

      if (p.handle) {
        const handle = p.handle
        productEntryFields[this.getCustomField("handle", "product")] = handle
      }

      this.sanity_.patch(data.id).set(productEntryFields) 

      await this.addIgnore_(data.id, "medusa")

      return publishedEntry
    } catch (error) {
      throw error
    }
  }

  async updateProductVariantInSanity(variant) {
    const updateFields = [
      "title",
      "prices",
      "sku",
      "material",
      "weight",
      "length",
      "height",
      "origin_country",
      "options",
    ]

    // Update came directly from product variant service so only act on a couple
    // of fields. When the update comes from the product we want to ensure
    // references are set up correctly so we run through everything.
    if (variant.fields) {
      const found = variant.fields.find((f) => updateFields.includes(f))
      if (!found) {
        return Promise.resolve()
      }
    }

    try {
      const ignore = await this.shouldIgnore_(variant.id, "sanity")
      if (ignore) {
        return Promise.resolve()
      }

      // check if product exists
      let variantEntry = undefined
      // if not, we create a new one
      try {
        variantEntry = await this.sanity_.getDocument(variant.id)
      } catch (error) {
        return this.createProductVariantIn(variant)
      }

      const v = await this.productVariantService_.retrieve(variant.id, {
        relations: ["prices", "options"],
      })

      const variantEntryFields = {
        [this.getCustomField("title", "variant")]: {
          "en-US": v.title,
        },
        [this.getCustomField("sku", "variant")]: {
          "en-US": v.sku,
        },
        [this.getCustomField("options", "variant")]: {
          "en-US": this.transformMedusaIds(v.options),
        },
        [this.getCustomField("prices", "variant")]: {
          "en-US": this.transformMedusaIds(v.prices),
        },
        [this.getCustomField("medusaId", "variant")]: {
          "en-US": v.id,
        },
      }

      this.sanity_.patch(variant.id).set(variantEntryFields)
      await this.addIgnore_(variant.id, "medusa")

      return publishedEntry
    } catch (error) {
      throw error
    }
  }

  async archiveProductVariantInSanity(variant) {
    let variantEntity
    try {
      const ignore = await this.shouldIgnore_(variant.id, "sanity")
      if (ignore) {
        return Promise.resolve()
      }

      try {
        variantEntity = await this.productVariantService_.retrieve(variant.id)
      } catch (err) {
        // ignore
      }

      if (variantEntity) {
        return Promise.resolve()
      }

      return await this.archiveEntryWidthId(variant.id)
    } catch (error) {
      throw error
    }
  }

  async archiveProductInSanity(product) {
    let productEntity
    try {
      const ignore = await this.shouldIgnore_(product.id, "sanity")
      if (ignore) {
        return Promise.resolve()
      }

      try {
        productEntity = await this.productService_.retrieve(product.id)
      } catch (err) {}

      if (productEntity) {
        return Promise.resolve()
      }

      return await this.archiveEntryWidthId(product.id)
    } catch (error) {
      throw error
    }
  }

  async archiveRegionInSanity(region) {
    let regionEntity
    try {
      const ignore = await this.shouldIgnore_(region.id, "sanity")
      if (ignore) {
        return Promise.resolve()
      }

      try {
        regionEntity = await this.regionService_.retrieve(region.id)
      } catch (err) {}

      if (regionEntity) {
        return Promise.resolve()
      }

      return await this.archiveEntryWidthId(region.id)
    } catch (error) {
      throw error
    }
  }

  async archiveEntryWidthId(id) {
    // check if product exists
    let document = undefined
    try {
      document = await this.sanity_.getDocument(id)
    } catch (error) {
      return Promise.resolve()
    }

    const archivedEntry = await this.sanity_.delete(id)
    await this.addIgnore_(id, "medusa")

    return archivedEntry
  }

  async sendSanityProductToAdmin(productId) {
    const ignore = await this.shouldIgnore_(productId, "medusa")
    if (ignore) {
      return
    }

    try {
   
      const productEntry = await this.sanity_.fetch('*[type == "product"]').then(doc => doc[0])

      const product = await this.productService_.retrieve(productId, {
        select: [
          "id",
          "handle",
          "title",
          "subtitle",
          "description",
          "thumbnail",
        ],
      })

      const update = {}
      const title =
        productEntry.fields[this.getCustomField("title", "product")]?.["en-US"]

      const subtitle =
        productEntry.fields[this.getCustomField("subtitle", "product")]?.[
          "en-US"
        ]

      const description =
        productEntry.fields[this.getCustomField("description", "product")]?.[
          "en-US"
        ]

      const handle =
        productEntry.fields[this.getCustomField("handle", "product")]?.["en-US"]

      if (product.title !== title) {
        update.title = title
      }

      if (product.subtitle !== subtitle) {
        update.subtitle = subtitle
      }

      if (product.description !== description) {
        update.description = description
      }

      if (product.handle !== handle) {
        update.handle = handle
      }

      // Get the thumbnail, if present
      if (productEntry.fields.thumbnail) {
        const thumb = await this.sanity_.getDocument(
          productEntry.fields.thumbnail["en-US"].sys.id
        )

        if (thumb.fields.file["en-US"].url) {
          if (!product.thumbnail?.includes(thumb.fields.file["en-US"].url)) {
            update.thumbnail = thumb.fields.file["en-US"].url
          }
        }
      }

      if (!_.isEmpty(update)) {
        await this.productService_.update(productId, update).then(async () => {
          return await this.addIgnore_(productId, "sanity")
        })
      }
    } catch (error) {
      throw error
    }
  }

  async sendSanityProductVariantToAdmin(variantId) {
    const ignore = this.shouldIgnore_(variantId, "medusa")
    if (ignore) {
      return
    }

    try {

      //TODO: change to fetch with query
      const variantEntry = await this.sanity_.fetch(`*[_id == ${variantId}]`).then(doc => doc[0]) 

      const updatedVariant = await this.productVariantService_
        .update(variantId, {
          title:
            variantEntry.fields[this.getCustomField("title", "variant")][
              "en-US"
            ],
        })
        .then(async () => {
          return await this.addIgnore_(variantId, "sanity")
        })

      return updatedVariant
    } catch (error) {
      throw error
    }
  }

  transformMedusaIds(objOrArray) {
    let input = objOrArray
    let isArray = true
    if (!Array.isArray(objOrArray)) {
      input = [objOrArray]
      isArray = false
    }

    const output = []
    for (const obj of input) {
      const transformed = Object.assign({}, obj)
      transformed.medusaId = obj.id
      output.push(transformed)
    }

    if (!isArray) {
      return output[0]
    }

    return output
  }

}

export default SanityService
