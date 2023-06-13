import { SearchTypes } from "@medusajs/types"
import { SearchUtils } from "@medusajs/utils"
import { AwilixContainer } from "awilix"
import { MeiliSearch, Settings } from "meilisearch"
import { meilisearchErrorCodes, MeilisearchPluginOptions } from "../types"
import { transformProduct } from "../utils/transformer"

class MeiliSearchService extends SearchUtils.AbstractSearchService {
  isDefault = false

  protected readonly config_: MeilisearchPluginOptions
  protected readonly client_: MeiliSearch
  protected readonly container_: AwilixContainer

  constructor(container: AwilixContainer, options: MeilisearchPluginOptions) {
    super(container, options)

    this.config_ = options
    this.container_ = container

    if (process.env.NODE_ENV !== "development") {
      if (!options.config?.apiKey) {
        throw Error(
          "Meilisearch API key is missing in plugin config. See https://docs.medusajs.com/add-plugins/meilisearch"
        )
      }
    }

    if (!options.config?.host) {
      throw Error(
        "Meilisearch host is missing in plugin config. See https://docs.medusajs.com/add-plugins/meilisearch"
      )
    }

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
    const transformedDocuments = await this.getTransformedDocuments(type, documents)

    return await this.client_
      .index(indexName)
      .addDocuments(transformedDocuments)
  }

  async replaceDocuments(indexName: string, documents: any, type: string) {
    const transformedDocuments = await this.getTransformedDocuments(type, documents)

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
    settings: SearchTypes.IndexSettings & Settings
  ) {
    // backward compatibility
    const indexSettings = settings.indexSettings ?? settings ?? {}

    await this.upsertIndex(indexName, settings)

    return await this.client_.index(indexName).updateSettings(indexSettings)
  }

  async upsertIndex(indexName: string, settings: SearchTypes.IndexSettings) {
    try {
      await this.client_.getIndex(indexName)
    } catch (error) {
      if (error.code === meilisearchErrorCodes.INDEX_NOT_FOUND) {
        await this.createIndex(indexName, {
          primaryKey: settings?.primaryKey ?? "id",
        })
      }
    }
  }

  async getTransformedDocuments(type: string, documents: any[]) {
    if (!documents?.length) {
      return []
    }

    switch (type) {
      case SearchTypes.indexTypes.PRODUCTS:
        const productsTransformer =
          this.config_.settings?.[SearchTypes.indexTypes.PRODUCTS]
            ?.transformer ?? transformProduct

        const transformed = await Promise.allSettled(documents.map(doc => productsTransformer(doc, this.container_)));
        const rejected = <T,>(p: PromiseSettledResult<T>): p is PromiseRejectedResult => p.status === 'rejected';

        const errors = transformed.filter(rejected);
        if (errors.length) {
          console.error('An error occurred while transforming some documents:', errors, `for index ${type}`);
        }

        const fulfilled = <T,>(p:PromiseSettledResult<T>): p is PromiseFulfilledResult<T> => p.status === 'fulfilled';

        return transformed.filter(fulfilled).map((r) => r.value);
      default:
        return documents
    }
  }
}

export default MeiliSearchService
