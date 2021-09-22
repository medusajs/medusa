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

  addDocuments(indexName, documents) {
    return this.client_.index(indexName).addDocuments(documents)
  }

  replaceDocuments(indexName, documents) {
    return this.client_.index(indexName).addDocuments(documents)
  }

  deleteDocument(indexName, document_id) {
    return this.client_.index(indexName).deleteDocument(document_id)
  }

  deleteAllDocuments(indexName) {
    return this.client_.index(indexName).deleteAllDocuments()
  }

  search(indexName, query, options) {
    return this.client_.index(indexName).search(query, options)
  }

  updateSettings(indexName, settings) {
    return this.client_.index(indexName).updateSettings(settings)
  }

  transformProducts(products) {
    if (!products) return []
    return products.map(transformProduct)
  }
}

export default MeiliSearchService
