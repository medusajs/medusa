import { IEventBusService, ISearchService } from "@medusajs/types"
import { defaultSearchIndexingProductRelations } from "@medusajs/utils"
import { indexTypes } from "medusa-core-utils"
import { isSearchEngineInstalledResolutionKey } from "../loaders/plugins"
import ProductService from "../services/product"
import ProductVariantService from "../services/product-variant"

type InjectedDependencies = {
  eventBusService: IEventBusService
  searchService: ISearchService
  productService: ProductService
}

class ProductSearchSubscriber {
  private readonly eventBusService_: IEventBusService
  private readonly searchService_: ISearchService
  private readonly productService_: ProductService

  constructor(container: InjectedDependencies) {
    this.eventBusService_ = container.eventBusService
    this.searchService_ = container.searchService
    this.productService_ = container.productService

    /**
     * Do not subscribe to any event in case no search engine have been installed.
     * If some events need to be subscribed out of the search engine reason, they can be subscribed above this comment
     */

    try {
      container[isSearchEngineInstalledResolutionKey]
    } catch (e) {
      return this
    }

    this.eventBusService_
      .subscribe(ProductService.Events.CREATED, this.handleProductCreation)
      .subscribe(ProductService.Events.UPDATED, this.handleProductUpdate)
      .subscribe(ProductService.Events.DELETED, this.handleProductDeletion)
      .subscribe(
        ProductVariantService.Events.CREATED,
        this.handleProductVariantChange
      )
      .subscribe(
        ProductVariantService.Events.UPDATED,
        this.handleProductVariantChange
      )
      .subscribe(
        ProductVariantService.Events.DELETED,
        this.handleProductVariantChange
      )
  }

  handleProductCreation = async (data) => {
    const product = await this.productService_.retrieve(data.id, {
      relations: defaultSearchIndexingProductRelations,
    })
    await this.searchService_.addDocuments(
      ProductService.IndexName,
      [product],
      indexTypes.products
    )
  }

  handleProductUpdate = async (data) => {
    const product = await this.productService_.retrieve(data.id, {
      relations: defaultSearchIndexingProductRelations,
    })
    await this.searchService_.addDocuments(
      ProductService.IndexName,
      [product],
      indexTypes.products
    )
  }

  handleProductDeletion = async (data) => {
    await this.searchService_.deleteDocument(ProductService.IndexName, data.id)
  }

  handleProductVariantChange = async (data) => {
    const product = await this.productService_.retrieve(data.product_id, {
      relations: defaultSearchIndexingProductRelations,
    })
    await this.searchService_.addDocuments(
      ProductService.IndexName,
      [product],
      indexTypes.products
    )
  }
}

export default ProductSearchSubscriber
