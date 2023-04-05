import _ from "lodash"
import { BaseService } from "medusa-interfaces"
import { createClient } from "contentful-management"

const IGNORE_THRESHOLD = 2 // seconds

class ContentfulService extends BaseService {
  constructor(
    {
      regionService,
      productService,
      cacheService,
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

    this.contentful_ = createClient({
      accessToken: options.access_token,
    })

    this.cacheService_ = cacheService

    this.capab_ = {}
  }

  async addIgnore_(id, side) {
    const key = `${id}_ignore_${side}`
    return await this.cacheService_.set(
      key,
      1,
      this.options_.ignore_threshold || IGNORE_THRESHOLD
    )
  }

  async shouldIgnore_(id, side) {
    const key = `${id}_ignore_${side}`
    return await this.cacheService_.get(key)
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

  async getVariantEntries_(variants, config = { publish: false }) {
    try {
      const contentfulVariants = await Promise.all(
        variants.map(async (variant) => {
          let updated = await this.updateProductVariantInContentful(variant)
          if (config.publish) {
            updated = updated.publish()
          }

          return updated
        })
      )

      return contentfulVariants
    } catch (error) {
      throw error
    }
  }

  getLink_(fromEntry) {
    return {
      sys: {
        type: "Link",
        linkType: "Entry",
        id: fromEntry.sys.id,
      },
    }
  }

  getVariantLinks_(variantEntries) {
    return variantEntries.map((v) => this.getLink_(v))
  }

  async createImageAssets(product) {
    const environment = await this.getContentfulEnvironment_()

    const assets = []
    await Promise.all(
      product.images
        .filter((image) => image.url !== product.thumbnail)
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
                  fileName: image.url,
                  upload: image.url,
                },
              },
            },
          })

          const finalAsset = await asset
            .processForAllLocales()
            .then((ast) => ast.publish())

          assets.push({
            sys: {
              type: "Link",
              linkType: "Asset",
              id: finalAsset.sys.id,
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
      const variantEntries = await this.getVariantEntries_(p.variants, {
        publish: true,
      })
      const variantLinks = this.getVariantLinks_(variantEntries)

      const fields = {
        [this.getCustomField("title", "product")]: {
          "en-US": p.title,
        },
        [this.getCustomField("subtitle", "product")]: {
          "en-US": p.subtitle,
        },
        [this.getCustomField("description", "product")]: {
          "en-US": p.description,
        },
        [this.getCustomField("variants", "product")]: {
          "en-US": variantLinks,
        },
        [this.getCustomField("options", "product")]: {
          "en-US": this.transformMedusaIds(p.options),
        },
        [this.getCustomField("medusaId", "product")]: {
          "en-US": p.id,
        },
      }

      if (p.images.length > 0) {
        const imageLinks = await this.createImageAssets(product)
        if (imageLinks) {
          fields.images = {
            "en-US": imageLinks,
          }
        }
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

        await thumbnailAsset.processForAllLocales().then((a) => a.publish())

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
      }

      await this.createSpecialProductFields(fields, p)

      const result = await environment.createEntryWithId("product", p.id, {
        fields,
      })

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

  async createRegionInContentful(region) {
    const hasType = await this.getType("region")
      .then(() => true)
      .catch(() => false)
    if (!hasType) {
      return Promise.resolve()
    }
    try {
      const r = await this.regionService_.retrieve(region.id, {
        relations: ["countries", "payment_providers", "fulfillment_providers"],
      })

      const environment = await this.getContentfulEnvironment_()

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

      const result = await environment.createEntryWithId("region", r.id, {
        fields,
      })

      return result
    } catch (error) {
      throw error
    }
  }

  async updateRegionInContentful(data) {
    const hasType = await this.getType("region")
      .then(() => true)
      .catch(() => false)
    if (!hasType) {
      return Promise.resolve()
    }

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
      const ignore = await this.shouldIgnore_(data.id, "contentful")
      if (ignore) {
        return
      }

      const r = await this.regionService_.retrieve(data.id, {
        relations: ["countries", "payment_providers", "fulfillment_providers"],
      })

      const environment = await this.getContentfulEnvironment_()

      // check if region exists
      let regionEntry = undefined
      try {
        regionEntry = await environment.getEntry(data.id)
      } catch (error) {
        return this.createRegionInContentful(r)
      }

      const regionEntryFields = {
        ...regionEntry.fields,
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

      regionEntry.fields = regionEntryFields

      const updatedEntry = await regionEntry.update()
      const publishedEntry = await updatedEntry.publish()

      await this.addIgnore_(data.id, "medusa")

      return publishedEntry
    } catch (error) {
      throw error
    }
  }

  async createCollectionInContentful(collection) {
    const hasType = await this.getType("collection")
      .then(() => true)
      .catch(() => false)

    if (!hasType) {
      return Promise.resolve()
    }

    const environment = await this.getContentfulEnvironment_()

    const fields = {
      [this.getCustomField("medusaId", "collection")]: {
        "en-US": collection.id,
      },
      [this.getCustomField("title", "collection")]: {
        "en-US": collection.title,
      },
    }

    const result = await environment.createEntryWithId(
      "collection",
      collection.id,
      {
        fields,
      }
    )

    return result
  }

  async createTypeInContentful(type) {
    const hasType = await this.getType("productType")
      .then(() => true)
      .catch(() => false)

    if (!hasType) {
      return Promise.resolve()
    }

    const environment = await this.getContentfulEnvironment_()

    const fields = {
      [this.getCustomField("medusaId", "type")]: {
        "en-US": type.id,
      },
      [this.getCustomField("name", "type")]: {
        "en-US": type.value,
      },
    }

    const result = await environment.createEntryWithId("productType", type.id, {
      fields,
    })

    return result
  }

  async upsertTypeEntry(type) {
    const hasType = await this.getType("productType")
      .then(() => true)
      .catch(() => false)

    if (!hasType) {
      return Promise.resolve()
    }

    const environment = await this.getContentfulEnvironment_()

    // check if type exists
    let typeEntry = undefined
    try {
      typeEntry = await environment.getEntry(type.id)
    } catch (error) {
      return this.createTypeInContentful(type)
    }

    const typeEntryFields = {
      ...typeEntry.fields,
      [this.getCustomField("name", "type")]: {
        "en-US": type.value,
      },
    }

    typeEntry.fields = typeEntryFields

    return await typeEntry.update()
  }

  async upsertCollectionEntry(collection) {
    const hasType = await this.getType("collection")
      .then(() => true)
      .catch(() => false)

    if (!hasType) {
      return Promise.resolve()
    }

    const environment = await this.getContentfulEnvironment_()

    // check if collection exists
    let collectionEntry = undefined
    try {
      collectionEntry = await environment.getEntry(collection.id)
    } catch (error) {
      return this.createCollectionInContentful(collection)
    }

    const collectionEntryFields = {
      ...collectionEntry.fields,
      [this.getCustomField("title", "collection")]: {
        "en-US": collection.title,
      },
    }

    collectionEntry.fields = collectionEntryFields
    return await collectionEntry.update()
  }

  async updateProductInContentful(data) {
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
      const ignore = await this.shouldIgnore_(data.id, "contentful")
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

      const environment = await this.getContentfulEnvironment_()

      // check if product exists
      let productEntry = undefined
      try {
        productEntry = await environment.getEntry(data.id)
      } catch (error) {
        return this.createProductInContentful(p)
      }

      const variantEntries = await this.getVariantEntries_(p.variants)
      const variantLinks = this.getVariantLinks_(variantEntries)

      const productEntryFields = {
        ...productEntry.fields,
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
                fileName: url,
                upload: url,
              },
            },
          },
        })

        await thumbnailAsset.processForAllLocales().then((a) => a.publish())

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

      await this.createSpecialProductFields(productEntryFields, p)

      productEntry.fields = productEntryFields

      const updatedEntry = await productEntry.update()
      const publishedEntry = await updatedEntry.publish()

      await this.addIgnore_(data.id, "medusa")

      return publishedEntry
    } catch (error) {
      throw error
    }
  }

  async createSpecialProductFields(fields, p) {
    const capabilities = await this.checkCapabilities("product")

    if (p.type) {
      if (capabilities.type) {
        const val = {
          "en-US": this.getLink_(await this.upsertTypeEntry(p.type)),
        }

        fields[this.getCustomField("type", "product")] = val
      } else {
        const type = {
          "en-US": p.type.value,
        }

        fields[this.getCustomField("type", "product")] = type
      }
    }

    if (p.collection) {
      if (capabilities.collection) {
        const val = {
          "en-US": this.getLink_(
            await this.upsertCollectionEntry(p.collection)
          ),
        }
        fields[this.getCustomField("collection", "product")] = val
      } else {
        const collection = {
          "en-US": p.collection.title,
        }

        fields[this.getCustomField("collection", "product")] = collection
      }
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
  }

  async updateProductVariantInContentful(variant) {
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
      const ignore = await this.shouldIgnore_(variant.id, "contentful")
      if (ignore) {
        return Promise.resolve()
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
          "en-US": this.transformMedusaIds(v.options),
        },
        [this.getCustomField("prices", "variant")]: {
          "en-US": this.transformMedusaIds(v.prices),
        },
        [this.getCustomField("medusaId", "variant")]: {
          "en-US": v.id,
        },
      }

      variantEntry.fields = variantEntryFields

      const updatedEntry = await variantEntry.update()
      const publishedEntry = await updatedEntry.publish()

      await this.addIgnore_(variant.id, "medusa")

      return publishedEntry
    } catch (error) {
      throw error
    }
  }

  async archiveProductVariantInContentful(variant) {
    let variantEntity
    try {
      const ignore = await this.shouldIgnore_(variant.id, "contentful")
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

  async archiveProductInContentful(product) {
    let productEntity
    try {
      const ignore = await this.shouldIgnore_(product.id, "contentful")
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

  async archiveRegionInContentful(region) {
    let regionEntity
    try {
      const ignore = await this.shouldIgnore_(region.id, "contentful")
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
    const environment = await this.getContentfulEnvironment_()
    // check if product exists
    let entry = undefined
    try {
      entry = await environment.getEntry(id)
    } catch (error) {
      return Promise.resolve()
    }

    const unpublishEntry = await entry.unpublish()
    const archivedEntry = await entry.archive()

    await this.addIgnore_(id, "medusa")

    return archivedEntry
  }

  async sendContentfulProductToAdmin(productId) {
    const ignore = await this.shouldIgnore_(productId, "medusa")
    if (ignore) {
      return
    }

    try {
      const environment = await this.getContentfulEnvironment_()
      const productEntry = await environment.getEntry(productId)

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
        const thumb = await environment.getAsset(
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
          return await this.addIgnore_(productId, "contentful")
        })
      }
    } catch (error) {
      throw error
    }
  }

  async sendContentfulProductVariantToAdmin(variantId) {
    const ignore = this.shouldIgnore_(variantId, "medusa")
    if (ignore) {
      return
    }

    try {
      const environment = await this.getContentfulEnvironment_()
      const variantEntry = await environment.getEntry(variantId)

      const updatedVariant = await this.productVariantService_
        .update(variantId, {
          title:
            variantEntry.fields[this.getCustomField("title", "variant")][
              "en-US"
            ],
        })
        .then(async () => {
          return await this.addIgnore_(variantId, "contentful")
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

  async getType(type) {
    const environment = await this.getContentfulEnvironment_()
    return environment.getContentType(type)
  }

  async checkCapabilities(type) {
    switch (type) {
      case "product":
        return this.checkProductCapabilities()
      default:
        return {}
    }
  }

  async checkProductCapabilities() {
    if (this.capab_["product"]) {
      return this.capab_["product"]
    }

    const product = await this.getType("product")
    const capabilities = {
      collection: false,
      type: false,
    }

    if (product.fields) {
      const typeField = product.fields.find((f) => f.id === "type")
      if (typeField) {
        capabilities.type = typeField.linkType === "Entry"
      }

      const collectionField = product.fields.find((f) => f.id === "collection")
      if (collectionField) {
        capabilities.collection = collectionField.linkType === "Entry"
      }
    }

    this.capab_["product"] = capabilities

    return capabilities
  }
}

export default ContentfulService
