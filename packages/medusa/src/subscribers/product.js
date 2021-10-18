import ProductService from "../services/product"
import { indexTypes } from "medusa-core-utils"

const searchFields = [
  "id",
  "title",
  "subtitle",
  "description",
  "handle",
  "is_giftcard",
  "discountable",
  "thumbnail",
  "profile_id",
  "collection_id",
  "type_id",
  "origin_country",
  "created_at",
  "updated_at",
]

const searchRelations = [
  "variants",
  "tags",
  "type",
  "collection",
  "variants.prices",
  "variants.options",
  "options",
]

class ProductSearchSubscriber {
  constructor({ eventBusService, searchService, productService }) {
    this.eventBus_ = eventBusService

    this.searchService_ = searchService

    this.productService_ = productService

    this.eventBus_.subscribe(
      ProductService.Events.CREATED,
      this.handleProductCreation
    )

    this.eventBus_.subscribe(
      ProductService.Events.UPDATED,
      this.handleProductUpdate
    )

    this.eventBus_.subscribe(
      ProductService.Events.DELETED,
      this.handleProductDeletion
    )

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
    await this.searchService.addDocuments(
      ProductService.IndexName,
      [product],
      indexTypes.products
    )
  }

  retrieveProduct_ = async (product_id) => {
    return await this.productService_.retrieve(product_id, {
      select: searchFields,
      relations: searchRelations,
    })
  }

  handleProductUpdate = async (data) => {
    const product = await this.retrieveProduct_(data.id)
    await this.meilisearchService_.addDocuments(
      ProductService.IndexName,
      [product],
      indexTypes.products
    )
  }

  handleProductDeletion = async (data) => {
    await this.meilisearchService_.deleteDocument(
      ProductService.IndexName,
      data.id
    )
  }

  handleProductVariantChange = async (data) => {
    const product = await this.retrieveProduct_(data.product_id)
    await this.meilisearchService_.addDocuments(
      ProductService.IndexName,
      [product],
      indexTypes.products
    )
  }
}

export default ProductSearchSubscriber
