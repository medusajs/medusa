import { indexTypes } from "medusa-core-utils"
import { SearchService } from "medusa-interfaces"
import { transformProduct } from "../utils/transform-product"
import { Client as Typesense } from "typesense"

class TypesenseSearchService extends SearchService {
  constructor(container, options) {
    super()

    this.options_ = options

    // options.config should be the same format used to initialize the Typesense Client
    //  as described here: https://typesense.org/docs/0.22.1/api/authentication.html
    this.client_ = new Typesense(options.config)
  }

  createIndex(indexName, options) {
    // options.settings.{indexName} should be the schema of the collection
    //  as described here: https://typesense.org/docs/0.22.1/api/collections.html#create-a-collection

    return this.client_.collections().create(options.settings[indexName])
  }

  getIndex(indexName) {
    return this.client_.collections(indexName).retrieve()
  }

  addDocuments(indexName, documents, type) {
    const transformedDocuments = this.getTransformedDocuments(type, documents)
    return this.client_.collections(indexName).documents().import(transformedDocuments)
  }

  replaceDocuments(indexName, documents, type) {
    const transformedDocuments = this.getTransformedDocuments(type, documents)
    return this.client_.collections(indexName).documents().import(transformedDocuments, {action: "upsert"})
  }

  deleteDocument(indexName, documentId) {
    return this.client_.collections(indexName).documents(documentId).delete()
  }

  // TODO: Can we access "options" here?
  async deleteAllDocuments(indexName, options) {
    await this.client_.collections(indexName).delete();
    return this.createIndex(indexName, options)
  }

  search(indexName, query, options) {
    // TODO: What is the format of `filter` below?
    // Need to convert that into Typesense's filter_by format

    const { paginationOptions, filter, additionalOptions } = options

    return this.client_.collections(indexName).documents().search({
      per_page: paginationOptions.limit,
      page: Math.floor(paginationOptions.offset / paginationOptions.limit),
      filter_by: filter,
      ...additionalOptions
    })
  }

  updateSettings(indexName, settings) {
    // No-op in Typesense, since settings are controlled at search time
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
