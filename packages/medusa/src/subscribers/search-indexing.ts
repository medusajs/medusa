import EventBusService from "../services/event-bus"
import { SEARCH_INDEX_EVENT } from "../loaders/search-index"
import ProductService from "../services/product"
import { indexTypes } from "medusa-core-utils"
import { Product } from "../models"
import { ISearchService } from "../interfaces"

type InjectedDependencies = {
  eventBusService: EventBusService
  searchService: ISearchService
  productService: ProductService
}

class SearchIndexingSubscriber {
  private readonly eventBusService_: EventBusService
  private readonly searchService_: ISearchService
  private readonly productService_: ProductService

  constructor({
    eventBusService,
    searchService,
    productService,
  }: InjectedDependencies) {
    this.eventBusService_ = eventBusService
    this.searchService_ = searchService
    this.productService_ = productService

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
    return await this.productService_.list(
      { id: { gt: lastSeenId } },
      {
        select: [
          "id",
          "title",
          "status",
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
        relations: [
          "variants",
          "tags",
          "type",
          "collection",
          "variants.prices",
          "images",
          "variants.options",
          "options",
        ],
        take: take,
        order: { id: "ASC" },
      }
    )
  }
}

export default SearchIndexingSubscriber
