import { indexTypes } from "medusa-core-utils"
import { SearchService } from "medusa-interfaces"
import { transformProduct } from "../utils/transform-product"

class TypesenseSearchService extends SearchService {
  constructor(container, options) {
    super()

    this.options_ = options
  }

  createIndex(indexName, options) {
    return Promise.resolve()
  }

  getIndex(indexName) {
    return Promise.resolve()
  }

  addDocuments(indexName, documents, type) {
    return Promise.resolve()
  }

  replaceDocuments(indexName, documents, type) {
    return Promise.resolve()
  }

  deleteDocument(indexName, document_id) {
    return Promise.resolve()
  }

  deleteAllDocuments(indexName) {
    return Promise.resolve()
  }

  search(indexName, query, options) {
    return Promise.resolve()
  }

  updateSettings(indexName, settings) {
    return Promise.resolve()
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
    return products.map(transformProduct)
  }
}

export default TypesenseSearchService
