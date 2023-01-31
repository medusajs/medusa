import { BaseService } from "medusa-interfaces"
import { buildClient } from "@datocms/cma-client-node";

const IGNORE_THRESHOLD = 2 // seconds

class DatoCMSService extends BaseService {
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

    this.datoCMS_ = buildClient({
      apiToken: options.apiToken,
      environment: options.environment,
    })

    this.redis_ = redisClient
  }

  async getModel(model) {
    return this.datoCMS_.itemTypes.find(model)
      .then((m) => m)
      .catch(() => false)
  }

  getCustomField(field, type) {
    const customOptions = this.options_[`custom_${type}_fields`]

    if (customOptions) {
      return customOptions[field] || field
    } else {
      return field
    }
  }

  async shouldIgnore_(id, side) {
    const key = `${id}_ignore_${side}`
    return await this.redis_.get(key)
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

  async findItemByMedusaId_(id, type) {
    try {
      const results = await this.datoCMS_.items.list({
        filter: {
          type: type,
          fields: {
            medusa_id: {
              eq: id
            }
          }
        }
      })
      if (results.length === 0) {
        return false
      }
      return results[0]
    } catch (error) {
      throw error
    }
  }

  async getRegionFields(id) {
    const region = await this.regionService_.retrieve(id, {
      relations: ["countries", "payment_providers", "fulfillment_providers"],
    })

    const fields = {
      [this.getCustomField("name", "region")]: region.name,
      [this.getCustomField("currency_code", "region")]: region.currency_code,
      [this.getCustomField("countries", "region")]: JSON.stringify(region.countries),
      [this.getCustomField("payment_providers", "region")]: JSON.stringify(region.payment_providers),
      [this.getCustomField("fulfillment_providers", "region")]: JSON.stringify(region.fulfillment_providers),
    }

    return { region, fields }
  }

  async createRegionInDatoCMS(data) {
    const model = await this.getModel("region")
    if (!model) {
      return
    }

    try {
      const { fields } = await this.getRegionFields(data.id)

      const entry = await this.datoCMS_.items.create({
        item_type: { type: 'item_type', id: model.id },
        ...fields,
      })

      return entry
    } catch (error) {
      throw error
    }
  }

  async updateRegionInDatoCMS(data) {
    const model = await this.getModel("region")
    if (!model) {
      return
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
      // const ignore = await this.shouldIgnore_(data.id, "datoCMS")
      // if (ignore) {
      //   return
      // }

      const regionEntry = await this.findItemByMedusaId_(data.id, "region")
      if (!regionEntry) {
        return this.createRegionInDatoCMS(r)
      }

      const { fields } = await this.getRegionFields(data.id)

      const entry = await this.datoCMS_.items.update(regionEntry.id, fields)

      // await this.addIgnore_(data.id, "datoCMS")

      return entry
    } catch (error) {
      throw error
    }
  }

  async deleteRegionInDatoCMS(data) {
    const model = await this.getModel("region")
    if (!model) {
      return
    }

    try {
      const region = await this.findItemByMedusaId_(data.id, "region")
      if (!region) {
        return
      }
      await this.datoCMS_.items.destroy(region.id)
    } catch (error) {
      throw error
    }
  }

  async getVariantEntries_(variants) {
    try {
      const datoCMSVariants = await Promise.all(
        variants.map((variant) => this.updateProductVariantInDatoCMS(variant))
      )
      return datoCMSVariants
    } catch (error) {
      throw error
    }
  }

  async getProductFields(id) {
    const product = await this.productService_.retrieve(id, {
      relations: [
        "options",
        "variants",
        "type",
        "collection",
        "tags",
      ],
    })

    const variants = await this.getVariantEntries_(product.variants)

    const fields = {
      [this.getCustomField("title", "product")]: product.title,
      [this.getCustomField("subtitle", "product")]: product.subtitle,
      [this.getCustomField("description", "product")]: product.description,
      [this.getCustomField("variants", "product")]: variants.map(el => el.id),
      [this.getCustomField("options", "product")]: JSON.stringify(this.transformMedusaIds(product.options)),
      [this.getCustomField("medusa_id", "product")]: product.id,
    }

    if (product.type) {
      fields[this.getCustomField("product_type", "product")] = product.type.value
    }

    if (product.collection) {
      fields[this.getCustomField("collection", "product")] = product.collection.title
    }

    if (product.tags) {
      fields[this.getCustomField("tags", "product")] = JSON.stringify(product.tags)
    }

    if (product.handle) {
      fields[this.getCustomField("handle", "product")] = product.handle
    }

    // TODO: missing collection and type fields for replicate contentful plugin

    return { product, fields, variants }
  }

  async createProductInDatoCMS(data) {
    const model = await this.getModel("product")
    if (!model) {
      return
    }

    try {
      const { fields } = await this.getProductFields(data.id)

      // TODO: thumbnail

      const entry = await this.datoCMS_.items.create({
        item_type: { type: 'item_type', id: model.id },
        ...fields,
      })

      await this.datoCMS_.items.publish(entry.id, { recursive: true })

      return entry
    } catch (error) {
      throw error
    }
  }

  async updateProductInDatoCMS(data) {
    const model = await this.getModel("product")
    if (!model) {
      return
    }

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
      return
    }

    try {
      // const ignore = await this.shouldIgnore_(data.id, "contentful")
      // if (ignore) {
      //   return Promise.resolve()
      // }

      const productEntry = await this.findItemByMedusaId_(data.id, "product")
      if (!productEntry) {
        return this.createProductInDatoCMS(data)
      }

      const { fields } = await this.getProductFields(data.id)

      // TODO: thumbnail

      const entry = await this.datoCMS_.items.update(productEntry.id, fields)

      await this.datoCMS_.items.publish(entry.id, { recursive: true })

      // await this.addIgnore_(data.id, "medusa")

      return entry  
    } catch (error) {
      throw error
    }
  }

  async deleteProductInDatoCMS(data) {
    const model = await this.getModel("product")
    if (!model) {
      return
    }

    try {
      const product = await this.findItemByMedusaId_(data.id, "product")
      if (!product) {
        return
      }
      await this.datoCMS_.items.destroy(product.id)
      for (const variant of product.variants) {
        await this.datoCMS_.items.destroy(variant)
      }
    } catch (error) {
      throw error
    }
  }

  async getProductVariantFields(id) {
    const variant = await this.productVariantService_.retrieve(id, {
      relations: ["prices", "options"],
    })

    const fields = {
      [this.getCustomField("title", "variant")]: variant.title,
      [this.getCustomField("sku", "variant")]: variant.sku,
      [this.getCustomField("prices", "variant")]: JSON.stringify(this.transformMedusaIds(variant.prices)),
      [this.getCustomField("options", "variant")]: JSON.stringify(this.transformMedusaIds(variant.options)),
      [this.getCustomField("medusa_id", "variant")]: variant.id,
    }

    return { variant, fields }
  }

  async createProductVariantInDatoCMS(data, fromSubcribe = false) {
    const model = await this.getModel("product_variant")
    if (!model) {
      return
    }

    try {
      const { fields } = await this.getProductVariantFields(data.id)

      const entry = await this.datoCMS_.items.create({
        item_type: { type: 'item_type', id: model.id },
        ...fields,
      })

      if (fromSubcribe) {
        const product = await this.findItemByMedusaId_(data.product_id, "product")
        if (product) {
          await this.datoCMS_.items.update(product.id, {
            variants: [...product.variants, entry.id]
          })
          await this.datoCMS_.items.publish(product.id, { recursive: true })
        } else {
          // TODO: check if variant created is not duplicate
          await this.createProductInDatoCMS({ id: data.product_id })
        }
      } 

      return entry
    } catch (error) {
      throw error
    }
  }

  async updateProductVariantInDatoCMS(data) {
    const model = await this.getModel("product_variant")
    if (!model) {
      return
    }

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

    if (data.fields) {
      const found = data.fields.find((f) => updateFields.includes(f))
      if (!found) {
        return
      }
    }

    try {
      // const ignore = await this.shouldIgnore_(data.id, "contentful")
      // if (ignore) {
      //   return Promise.resolve()
      // }

      const variantEntry = await this.findItemByMedusaId_(data.id, "product_variant")
      if (!variantEntry) {
        return this.createProductVariantInDatoCMS(data)
      }

      const { fields } = await this.getProductVariantFields(data.id)

      const entry = await this.datoCMS_.items.update(variantEntry.id, fields)

      await this.datoCMS_.items.publish(entry.id, { recursive: true })

      // await this.addIgnore_(variant.id, "medusa")

      return entry
    } catch (error) {
      console.log(error)
      throw error
    }
  }

  async deleteProductVariantInDatoCMS(data) {
    const model = await this.getModel("product_variant")
    if (!model) {
      return
    }

    try {
      const variant = await this.findItemByMedusaId_(data.id, "product_variant")
      if (!variant) {
        return
      }
      await this.datoCMS_.items.destroy(variant.id)
    } catch (error) {
      throw error
    }
  }

  async updateProductFromDatoCMSToMedusa(entityId) {
    try {
      const productDatoCMS = await this.datoCMS_.items.find(entityId)
      // const ignore = await this.shouldIgnore_(productDatoCMS.medusa_id, "medusa")
      // if (ignore) {
      //   return
      // }
      const itemType = await this.datoCMS_.itemTypes.find(product.item_type)
      if (itemType.api_key !== "product") {
        throw new Error("Not a product")
      }

      const productMedusa = await this.productService_.retrieve(productDatoCMS.medusa_id, {
        select: [
          "id",
          "handle",
          "title",
          "subtitle",
          "description",
          "thumbnail",
        ],
      })

      const fields = ['title', 'subtitle', 'description', 'handle']
      const updateFields = {}
      for (const field of fields) {
        const customField = this.getCustomField(field, "product")
        if (productDatoCMS[customField] !== productMedusa[field]) {
          updateFields[field] = productDatoCMS[customField]
        }
      }

      // TODO update thumbnail

      if (Object.keys(updateFields).length > 0) {
        await this.productService_.update(productMedusa.id, updateFields)
      }
    } catch (error) {
      throw error
    }
  }

  async updateProductVariantFromDatoCMSToMedusa(entityId) {
    try {
      const productVariantDatoCMS = await this.datoCMS_.items.find(entityId)
      // const ignore = await this.shouldIgnore_(productVariantDatoCMS.medusa_id, "medusa")
      // if (ignore) {
      //   return
      // }
      const itemType = await this.datoCMS_.itemTypes.find(product.item_type)
      if (itemType.api_key !== "product_variant") {
        throw new Error("Not a product variant")
      }

      const productVariantMedusa = await this.productVariantService_.retrieve(productVariantDatoCMS.medusa_id, {
        select: [
          "id",
          "title",
        ],
      })

      const fields = ['title']
      const updateFields = {}
      for (const field of fields) {
        const customField = this.getCustomField(field, "product")
        if (productVariantDatoCMS[customField] !== productVariantMedusa[field]) {
          updateFields[field] = productVariantDatoCMS[customField]
        }
      }

      if (Object.keys(updateFields).length > 0) {
        await this.productService_.update(productMedusa.id, updateFields)
      }
    } catch (error) {
      throw error
    }
  }
}

export default DatoCMSService