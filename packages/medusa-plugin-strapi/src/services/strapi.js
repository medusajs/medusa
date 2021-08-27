import _ from "lodash"
import { BaseService } from "medusa-interfaces"
import axios from "axios"

const IGNORE_THRESHOLD = 2 // seconds

class StrapiService extends BaseService {
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

    // init Strapi client
    this.strapi_ = this.createClient()

    this.redis_ = redisClient
  }

  createClient() {
    const client = axios.create({
      baseURL: process.env.STRAPI_URL || "http://localhost:1337",
    })

    return client
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

  async getVariantEntries_(variants, config = { publish: false }) {
    try {
      const strapiVariants = await Promise.all(
        variants.map(async (variant) => {
          // update product variant in strapi
          let updated = await this.updateProductVariantInContentful(variant)
          return updated
        })
      )

      return strapiVariants
    } catch (error) {
      throw error
    }
  }

  async createImageAssets(product) {
    let assets = []
    await Promise.all(
      product.images
        .filter((image) => image.url !== product.thumbnail)
        .map(async (image, i) => {
          // create image in Strapi
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

  async createProductInStrapi(product) {
    const hasType = await this.getType("product")
      .then(() => true)
      .catch(() => false)
    if (!hasType) {
      return Promise.resolve()
    }

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

      // update or create all variants for the product
      const variantEntries = await this.getVariantEntries_(p.variants, {
        publish: true,
      })

      // initiate the fields for the product in Strapi
      const fields = {}

      if (p.images.length > 0) {
        const images = await this.createImageAssets(product)
        // add images to Strapi product
      }

      if (p.thumbnail) {
        // create thumbnail image in Strapi
        const thumbnail = null
      }

      if (p.type) {
        // add type to product
      }

      if (p.collection) {
        // add collection to product
      }

      if (p.tags) {
        // add tags to product
      }

      if (p.handle) {
        // add handle to product
      }

      // create product in Strapi with product id and fields object
      const result = null

      return result
    } catch (error) {
      throw error
    }
  }

  async createProductVariantInStrapi(variant) {
    const hasType = await this.getType("productVariant")
      .then(() => true)
      .catch(() => false)

    if (!hasType) {
      return Promise.resolve()
    }

    try {
      const v = await this.productVariantService_.retrieve(variant.id, {
        relations: ["prices", "options"],
      })

      // create variant in Strapi with variant id and variant properties
      const result = null

      return result
    } catch (error) {
      throw error
    }
  }

  async createRegionInStrapi(region) {
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

      // initiate the fields for the region in Strapi
      const fields = {}

      // create the region in Strapi with region id and fields object
      const result = null

      return result
    } catch (error) {
      throw error
    }
  }

  async updateRegionInStrapi(data) {
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

    // check if update contains any fields in Strapi to minimize runs
    const found = data.find((f) => updateFields.includes(f))
    if (!found) {
      return
    }

    try {
      const ignore = await this.shouldIgnore_(data.id, "strapi")
      if (ignore) {
        return
      }

      const r = await this.regionService_.retrieve(data.id, {
        relations: ["countries", "payment_providers", "fulfillment_providers"],
      })

      // check if region exists
      let regionEntry = undefined
      try {
        // fetch from Strapi
        regionEntry = null
      } catch (error) {
        return this.createRegionInContentful(r)
      }

      const regionEntryFields = {
        // previous fields and new fields
      }

      // update entry in Strapi
      const updatedEntry = null

      await this.addIgnore_(data.id, "medusa-strapi")

      return updatedEntry
    } catch (error) {
      throw error
    }
  }

  async updateProductInStrapi(data) {
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

    // check if update contains any fields in Strapi to minimize runs
    const found = data.find((f) => updateFields.includes(f))
    if (!found) {
      return Promise.resolve()
    }

    try {
      const ignore = await this.shouldIgnore_(data.id, "strapi")
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
        // fetch entry in Strapi
        productEntry = null
      } catch (error) {
        return this.createProductInStrapi(p)
      }

      // update or create all variants for the product
      const variantEntries = await this.getVariantEntries_(p.variants)

      const productEntryFields = {
        // previous fields and new fields
      }

      // if data contains thumbnail, we update it
      if (data.includes("thumbnail") && p.thumbnail) {
        let thumbnail = null
      }

      if (p.type) {
        // add type to product
      }

      if (p.collection) {
        // add collection to product
      }

      if (p.tags) {
        // add tags to product
      }

      if (p.handle) {
        // add handle to product
      }

      // update entry in Strapi
      const updatedEntry = null

      await this.addIgnore_(data.id, "medusa-strapi")

      return updatedEntry
    } catch (error) {
      throw error
    }
  }

  async updateProductVariantInStrapi(variant) {
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
      const ignore = await this.shouldIgnore_(variant.id, "strapi")
      if (ignore) {
        return Promise.resolve()
      }

      // check if variant exists
      let variantEntry = undefined
      // if not, we create a new one
      try {
        // fetch variant in Strapi
        variantEntry = null
      } catch (error) {
        // if we fail to find the variant, we create it
        return this.createProductVariantInStrapi(variant)
      }

      const v = await this.productVariantService_.retrieve(variant.id, {
        relations: ["prices", "options"],
      })

      const variantEntryFields = {
        // previous fields and new fields
      }

      // update entry in Strapi
      const updatedEntry = null

      await this.addIgnore_(variant.id, "medusa-strapi")

      return updatedEntry
    } catch (error) {
      throw error
    }
  }

  async sendStrapiProductToAdmin(productId) {
    const ignore = await this.shouldIgnore_(productId, "medusa-strapi")
    if (ignore) {
      return
    }

    try {
      // get entry from Strapi
      const productEntry = null

      const product = await this.productService_.retrieve(productId)

      let update = {}

      // update Medusa product with Strapi product fields
      const title = ""
      const subtitle = ""
      const description = ""

      if (product.title !== title) {
        update.title = title
      }

      if (product.subtitle !== subtitle) {
        update.subtitle = subtitle
      }

      if (product.description !== description) {
        update.description = description
      }

      // Get the thumbnail, if present
      if (productEntry.thumbnail) {
        const thumb = null
        update.thumbnail = thumb
      }

      if (!_.isEmpty(update)) {
        await this.productService_.update(productId, update).then(async () => {
          return await this.addIgnore_(productId, "strapi")
        })
      }
    } catch (error) {
      throw error
    }
  }

  async sendStrapiProductVariantToAdmin(variantId) {
    const ignore = this.shouldIgnore_(variantId, "medusa-strapi")
    if (ignore) {
      return
    }

    try {
      // get entry from Strapi
      const variantEntry = null

      const updatedVariant = await this.productVariantService_
        .update(variantId, {
          title: "", // update variant title in Medusa
        })
        .then(async () => {
          return await this.addIgnore_(variantId, "strapi")
        })

      return updatedVariant
    } catch (error) {
      throw error
    }
  }

  async getType(type) {
    // fetch type from Strapi to validate that it exists
  }
}

export default StrapiService
