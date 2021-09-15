import ProductService from "../services/product"
import ProductVariantService from "../services/product-variant"
import { flattenField } from "../utils/flatten-field"

class SearchSubscriber {
  constructor({ eventBusService, searchService, productService }, options) {
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
      ProductVariantService.Events.CREATED,
      this.handleProductVariantChange
    )

    this.eventBus_.subscribe(
      ProductVariantService.Events.UPDATED,
      this.handleProductVariantChange
    )

    this.eventBus_.subscribe(
      ProductVariantService.Events.DELETED,
      this.handleProductVariantChange
    )
  }

  handleProductCreation = async data => {
    const product = await this.retrieveProduct_(data.id)
    await this.searchService_.addDocuments(ProductService.IndexName, [product])
  }

  retrieveProduct_ = async product_id => {
    const product = await this.productService_.retrieve(product_id, {
      select: [
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
      ],
      relations: ["variants", "tags", "type", "collection"],
    })
    const skus = flattenField(product.variants, "sku").filter(Boolean)
    product.sku = skus
    return product
  }

  handleProductUpdate = async data => {
    const product = await this.retrieveProduct_(data.id)
    await this.searchService_.addDocuments(ProductService.IndexName, [product])
  }

  handleProductDeletion = async data => {
    await this.searchService_.deleteDocument(ProductService.IndexName, data.id)
  }

  handleProductVariantChange = async data => {
    const product = await this.retrieveProduct_(data.product_id)
    await this.searchService_.addDocuments(ProductService.IndexName, [product])
  }
}

export default SearchSubscriber
