import { BaseService } from "medusa-interfaces"
import { MeiliSearch } from "meilisearch"

class MeilisearchService extends BaseService {
  constructor({ eventBusService }, options) {
    super()

    this.eventBus_ = eventBusService

    this.options_ = options

    this.client_ = new MeiliSearch(options.config).index("products")
  }

  deleteAllDocuments() {
    return this.client_.deleteAllDocuments()
  }

  addDocuments(documents) {
    return this.client_.addDocuments(documents)
  }

  deleteDocument(document_id) {
    return this.client_.deleteDocument(document_id)
  }

  search(query, options) {
    return this.client_.search(query, options)
  }

  updateSettings() {
    return this.client_.updateSettings(this.options_.settings)
  }
}

export default MeilisearchService
