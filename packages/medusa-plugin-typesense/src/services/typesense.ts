import { SearchTypes } from "@medusajs/types"
import { SearchUtils } from "@medusajs/utils"
import { Client as Typesense } from "typesense"
import { CollectionCreateSchema } from "typesense/lib/Typesense/Collections"
import { TypesensePluginOptions } from "../types"
import { transformProduct } from "../utils/transformer"

class TypesenseSearchService extends SearchUtils.AbstractSearchService {
  isDefault = false

  protected readonly client_: Typesense
  protected readonly config_: TypesensePluginOptions

  constructor(_, options: TypesensePluginOptions) {
    super(_, options)

    this.config_ = options

    if (process.env.NODE_ENV !== "development") {
      if (!options.config?.apiKey) {
        throw Error("Typesense API key is missing in plugin config.")
      }
    }

    if (!options.config.nodes?.length) {
      throw Error("Typesense nodes config is missing in plugin config.")
    }

    // options.config should be the same format used to initialize the Typesense Client
    //  as described here: https://typesense.org/docs/latest/api/authentication.html
    this.client_ = new Typesense(options.config)
  }

  async createIndex(indexName: string, options: Record<string, unknown>) {
    // options.collectionSchemas.{indexName} should be the schema of the collection
    //  as described here: https://typesense.org/docs/latest/api/collections.html#create-a-collection
    const collectionSchema = this.config_.settings?.[indexName]
      ?.indexSettings as unknown as CollectionCreateSchema

    return await this.client_.collections().create(collectionSchema)
  }

  async getIndex(indexName: string) {
    return await this.client_.collections(indexName).retrieve()
  }

  async addDocuments(indexName: string, documents: any, type: string) {
    const transformedDocuments = this.getTransformedDocuments(type, documents)
    return await this.client_
      .collections(indexName)
      .documents()
      .import(transformedDocuments)
  }

  async replaceDocuments(indexName: string, documents: any, type: string) {
    const transformedDocuments = this.getTransformedDocuments(type, documents)
    return await this.client_
      .collections(indexName)
      .documents()
      .import(transformedDocuments, { action: "upsert" })
  }

  async deleteDocument(indexName: string, documentId: string) {
    return await this.client_
      .collections(indexName)
      .documents(documentId)
      .delete()
  }

  async deleteAllDocuments(indexName: string) {
    await this.client_.collections(indexName).delete()
    return await this.createIndex(indexName, {})
  }

  async search(indexName: string, query: string, options: any) {
    return this.client_
      .collections(indexName)
      .documents()
      .search({
        q: query,
        ...options,
      })
  }

  async updateSettings(indexName, settings) {
    // No-op in Typesense, since settings are controlled at search time
    return Promise.resolve()
  }

  getTransformedDocuments(type: string, documents: any[]) {
    if (!documents?.length) {
      return []
    }

    switch (type) {
      case SearchTypes.indexTypes.PRODUCTS:
        const productsTransformer =
          this.config_.settings?.[SearchTypes.indexTypes.PRODUCTS]
            ?.transformer ?? transformProduct

        return documents.map(productsTransformer)
      default:
        return documents
    }
  }
}

export default TypesenseSearchService
