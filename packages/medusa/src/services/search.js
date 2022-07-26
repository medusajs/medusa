import { SearchService } from "medusa-interfaces"

/**
 * Default class that implements SearchService but provides stuv implementation for all methods
 * @extends SearchService
 */
class DefaultSearchService extends SearchService {
  constructor(container, options) {
    super()

    this.isDefault = true

    this.logger_ = container.logger
    this.options_ = options
  }

  get options() {
    return this.options_
  }

  createIndex(indexName, options) {
    this.logger_.warn(
      "This is an empty method: createIndex must be overridden by a child class"
    )
  }

  getIndex(indexName) {
    this.logger_.warn(
      "This is an empty method: getIndex must be overridden by a child class"
    )
  }

  addDocuments(indexName, documents, type) {
    this.logger_.warn(
      "This is an empty method: addDocuments must be overridden by a child class"
    )
  }

  replaceDocuments(indexName, documents, type) {
    this.logger_.warn(
      "This is an empty method: replaceDocuments must be overridden by a child class"
    )
  }

  deleteDocument(indexName, document_id) {
    this.logger_.warn(
      "This is an empty method: deleteDocument must be overridden by a child class"
    )
  }

  deleteAllDocuments(indexName) {
    this.logger_.warn(
      "This is an empty method: deleteAllDocuments must be overridden by a child class"
    )
  }

  search(indexName, query, options) {
    this.logger_.warn(
      "This is an empty method: search must be overridden a the child class"
    )
    return { hits: [] }
  }

  updateSettings(indexName, settings) {
    this.logger_.warn(
      "This is an empty method: updateSettings must be overridden by a child class"
    )
  }
}

export default DefaultSearchService
