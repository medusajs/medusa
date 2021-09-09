import {
  defaultProductRelations,
  defaultProductFields,
  flattenSkus,
} from "../utils"

class MeilisearchSubscriber {
  constructor(
    { eventBusService, meilisearchService, productService },
    options
  ) {
    this.eventBus_ = eventBusService

    this.meilisearchService_ = meilisearchService

    this.productService_ = productService

    this.eventBus_.subscribe("product.created", this.handleProductCreation)

    this.eventBus_.subscribe("product.updated", this.handleProductUpdate)

    this.eventBus_.subscribe("product.deleted", this.handleProductDeletion)

    this.eventBus_.subscribe(
      "product-variant.created",
      this.handleProductVariantChange
    )

    this.eventBus_.subscribe(
      "product-variant.updated",
      this.handleProductVariantChange
    )

    this.eventBus_.subscribe(
      "product-variant.deleted",
      this.handleProductVariantChange
    )
  }

  handleProductCreation = async (data) => {
    const product = await this.retrieveProduct_(data.id)
    await this.meilisearchService_.addDocuments([product])
  }

  retrieveProduct_ = async (product_id) => {
    const product = await this.productService_.retrieve(product_id, {
      relations: defaultProductRelations,
      select: defaultProductFields,
    })
    const flattenedProduct = flattenSkus(product)
    return flattenedProduct
  }

  handleProductUpdate = async (data) => {
    const product = await this.retrieveProduct_(data.id)
    await this.meilisearchService_.addDocuments([product])
  }

  handleProductDeletion = async (data) => {
    await this.meilisearchService_.deleteDocument(data.id)
  }

  handleProductVariantChange = async (data) => {
    const product = await this.retrieveProduct_(data.product_id)
    await this.meilisearchService_.addDocuments([product])
  }
}

export default MeilisearchSubscriber
