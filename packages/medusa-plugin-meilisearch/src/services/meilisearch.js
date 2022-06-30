import { indexTypes } from "medusa-core-utils"
import { SearchService } from "medusa-interfaces"
import { MeiliSearch } from "meilisearch"
import { transformProduct } from "../utils/transform-product"

class MeiliSearchService extends SearchService {
  constructor(container, options) {
    super()

    this.options_ = options

    this.client_ = new MeiliSearch(options.config)
  }

  createIndex(indexName, options) {
    return this.client_.createIndex(indexName, options)
  }

  getIndex(indexName) {
    return this.client_.index(indexName)
  }

  addDocuments(indexName, documents, type) {
    const transformedDocuments = this.getTransformedDocuments(type, documents)
    return this.client_.index(indexName).addDocuments(transformedDocuments)
  }

  replaceDocuments(indexName, documents, type) {
    const transformedDocuments = this.getTransformedDocuments(type, documents)
    return this.client_.index(indexName).addDocuments(transformedDocuments)
  }

  deleteDocument(indexName, document_id) {
    return this.client_.index(indexName).deleteDocument(document_id)
  }

  deleteAllDocuments(indexName) {
    return this.client_.index(indexName).deleteAllDocuments()
  }

  search(indexName, query, options) {
    const { paginationOptions, filter, additionalOptions } = options
    return this.client_
      .index(indexName)
      .search(query, { filter, ...paginationOptions, ...additionalOptions })
  }

  updateSettings(indexName, settings) {
    return this.client_.index(indexName).updateSettings(settings)
  }

  getTransformedDocuments(type, documents) {
    switch (type) {
      case indexTypes.products:
        return this.transformProducts(documents)
      default:
        return documents
    }
  }

  transformProducts(products) {
    if (!products) {
      return []
    }
    return products.map(transformProduct)
  }
}

export default MeiliSearchService
