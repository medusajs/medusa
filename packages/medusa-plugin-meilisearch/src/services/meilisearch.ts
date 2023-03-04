import { AbstractSearchService } from "@medusajs/medusa"
import { indexTypes } from "medusa-core-utils"
import { MeiliSearch, Settings } from "meilisearch"
import { MeilisearchPluginOptions } from "../types"
import { transformProduct } from "../utils/transform-product"

class MeiliSearchService extends AbstractSearchService {
  isDefault = false

  protected readonly config_: MeilisearchPluginOptions
  protected client_: MeiliSearch

  constructor(_, options: MeilisearchPluginOptions) {
    super(_, options)

    this.config_ = options

    this.client_ = new MeiliSearch(options.config)
  }

  async createIndex(
    indexName: string,
    options: Record<string, unknown> = { primaryKey: "id" }
  ) {
    return await this.client_.createIndex(indexName, options)
  }

  getIndex(indexName: string) {
    return this.client_.index(indexName)
  }

  async addDocuments(indexName: string, documents: any, type: string) {
    const transformedDocuments = this.getTransformedDocuments(type, documents)

    return await this.client_
      .index(indexName)
      .addDocuments(transformedDocuments)
  }

  async replaceDocuments(indexName: string, documents: any, type: string) {
    const transformedDocuments = this.getTransformedDocuments(type, documents)

    return await this.client_
      .index(indexName)
      .addDocuments(transformedDocuments)
  }

  async deleteDocument(indexName: string, documentId: string) {
    return await this.client_.index(indexName).deleteDocument(documentId)
  }

  async deleteAllDocuments(indexName: string) {
    return await this.client_.index(indexName).deleteAllDocuments()
  }

  async search(indexName: string, query: string, options: Record<string, any>) {
    const { paginationOptions, filter, additionalOptions } = options

    return await this.client_
      .index(indexName)
      .search(query, { filter, ...paginationOptions, ...additionalOptions })
  }

  async updateSettings(
    indexName: string,
    settings: { indexSettings: Settings; primaryKey?: string }
  ) {
    try {
      await this.client_.getIndex(indexName)
    } catch (error) {
      if (error.code === "index_not_found") {
        // create index, if it doesn't exist
        await this.createIndex(indexName, {
          primaryKey: settings?.primaryKey ?? "id",
        })
      }
    }

    return await this.client_
      .index(indexName)
      .updateSettings(settings.indexSettings)
  }

  getTransformedDocuments(type: string, documents: any[]) {
    switch (type) {
      case indexTypes.products:
        if (!documents?.length) {
          return []
        }
        
        const productsTransformer =
          this.config_.settings?.[indexTypes.products]
            ?.transformer ?? transformProduct
            
        return documents.map(productsTransformer)
      default:
        return documents
    }
  }
}

export default MeiliSearchService
