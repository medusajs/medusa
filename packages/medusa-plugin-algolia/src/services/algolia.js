import algoliasearch from "algoliasearch"
import { indexTypes } from "medusa-core-utils"
import { SearchService } from "medusa-interfaces"
import { transformProduct } from "../utils/transform-product"

class AlgoliaService extends SearchService {
  constructor(container, options) {
    super()

    this.options_ = options
    const { application_id, admin_api_key } = this.options_

    if (!application_id) {
      throw new Error("Please provide a valid Application ID")
    }

    if (!admin_api_key) {
      throw new Error("Please provide a valid Admin Api Key")
    }

    this.client_ = algoliasearch(application_id, admin_api_key)
  }

  /**
   * Add two numbers.
   * @param {string} indexName - The name of the index
   * @param {*} options - not required just to match the schema we are used it
   * @return {*}
   */
  createIndex(indexName, options = {}) {
    return this.client_.initIndex(indexName)
  }

  /**
   * Used to get an index
   * @param {string} indexName  - the index name.
   * @return {Promise<{object}>} - returns response from search engine provider
   */
  getIndex(indexName) {
    let hits = []
    return this.client_
      .initIndex(indexName)
      .browseObjects({
        query: indexName,
        batch: (batch) => {
          hits = hits.concat(batch)
        },
      })
      .then(() => hits)
  }

  /**
   *
   * @param {string} indexName
   * @param {Array} documents - products list array
   * @param {*} type
   * @return {*}
   */
  addDocuments(indexName, documents, type) {
    const transformedDocuments = this.getTransformedDocuments(type, documents)
    return this.client_.initIndex(indexName).saveObjects(transformedDocuments)
  }

  /**
   * Used to replace documents
   * @param {string} indexName  - the index name.
   * @param {Object} documents  - array of document objects that will replace existing documents
   * @param {Array.<Object>} type  - type of documents to be replaced (e.g: products, regions, orders, etc)
   * @return {Promise<{object}>} - returns response from search engine provider
   */
  replaceDocuments(indexName, documents, type) {
    const transformedDocuments = this.getTransformedDocuments(type, documents)
    return this.client_
      .initIndex(indexName)
      .replaceAllObjects(transformedDocuments)
  }

  /**
   * Used to delete document
   * @param {string} indexName  - the index name
   * @param {string} document_id  - the id of the document
   * @return {Promise<{object}>} - returns response from search engine provider
   */
  deleteDocument(indexName, document_id) {
    return this.client_.initIndex(indexName).deleteObject(document_id)
  }

  /**
   * Used to delete all documents
   * @param {string} indexName  - the index name
   * @return {Promise<{object}>} - returns response from search engine provider
   */
  deleteAllDocuments(indexName) {
    return this.client_.initIndex(indexName).delete()
  }

  /**
   * Used to search for a document in an index
   * @param {string} indexName - the index name
   * @param {string} query  - the search query
   * @param {*} options
   * - any options passed to the request object other than the query and indexName
   * - additionalOptions contain any provider specific options
   * @return {*} - returns response from search engine provider
   */
  search(indexName, query, options) {
    const { paginationOptions, filter, additionalOptions } = options
    if ("limit" in paginationOptions) {
      paginationOptions["length"] = paginationOptions.limit
      delete paginationOptions.limit 
    }
    
    return this.client_.initIndex(indexName).search(query, {
      filters: filter,
      ...paginationOptions,
      ...additionalOptions
    })
  }

  /**
   * Used to update the settings of an index
   * @param  {string} indexName - the index name
   * @param {object} settings  - settings object
   * @return {Promise<{object}>} - returns response from search engine provider
   */
  updateSettings(indexName, settings) {
    return this.client_.initIndex(indexName).setSettings(settings)
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

export default AlgoliaService
