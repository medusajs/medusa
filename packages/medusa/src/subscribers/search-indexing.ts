import { IEventBusService, ISearchService } from "@medusajs/types"
import { indexTypes } from "medusa-core-utils"
import ProductCategoryFeatureFlag from "../loaders/feature-flags/product-categories"
import { SEARCH_INDEX_EVENT } from "../loaders/search-index"
import { Product } from "../models"
import ProductService from "../services/product"
import { FlagRouter } from "../utils/flag-router"

type InjectedDependencies = {
  eventBusService: IEventBusService
  searchService: ISearchService
  productService: ProductService
  featureFlagRouter: FlagRouter
}

class SearchIndexingSubscriber {
  private readonly eventBusService_: IEventBusService
  private readonly searchService_: ISearchService
  private readonly productService_: ProductService
  private readonly featureFlagRouter_: FlagRouter

  constructor({
    eventBusService,
    searchService,
    productService,
    featureFlagRouter,
  }: InjectedDependencies) {
    this.eventBusService_ = eventBusService
    this.searchService_ = searchService
    this.productService_ = productService
    this.featureFlagRouter_ = featureFlagRouter

    this.eventBusService_.subscribe(SEARCH_INDEX_EVENT, this.indexDocuments)
  }

  indexDocuments = async (): Promise<void> => {
    const TAKE = (this.searchService_?.options?.batch_size as number) ?? 1000
    let hasMore = true

    let lastSeenId = ""

    while (hasMore) {
      const products = await this.retrieveNextProducts(lastSeenId, TAKE)

      if (products.length > 0) {
        await this.searchService_.addDocuments(
          ProductService.IndexName,
          products,
          indexTypes.products
        )
        lastSeenId = products[products.length - 1].id
      } else {
        hasMore = false
      }
    }
  }

  protected async retrieveNextProducts(
    lastSeenId: string,
    take: number
  ): Promise<Product[]> {
    const relations = [
      "variants",
      "tags",
      "type",
      "collection",
      "variants.prices",
      "images",
      "variants.options",
      "options",
    ]

    if (
      this.featureFlagRouter_.isFeatureEnabled(ProductCategoryFeatureFlag.key)
    ) {
      relations.push("categories")
    }

    return await this.productService_.list(
      { id: { gt: lastSeenId } },
      {
        relations,
        take: take,
        order: { id: "ASC" },
      }
    )
  }
}

export default SearchIndexingSubscriber
