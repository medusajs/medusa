import BaseService from "./base-service"

/**
 * The interface that all search services must implement.
 * @interface
 */
class SearchService extends BaseService {
  constructor() {
    super()
  }

  get options() {
    return this.options_ ?? {}
  }

  /**
   * Used to create an index
   * @param indexName {string} - the index name
   * @param [options] {string} - the index name
   * @return {Promise<{object}>} - returns response from search engine provider
   */
  createIndex(indexName, options) {
    throw Error("createIndex must be overridden by a child class")
  }

  /**
   * Used to get an index
   * @param indexName {string} - the index name.
   * @return {Promise<{object}>} - returns response from search engine provider
   */
  getIndex(indexName) {
    throw Error("getIndex must be overridden by a child class")
  }

  /**
   * Used to index documents by the search engine provider
   * @param indexName {string} - the index name
   * @param documents {Array.<Object>} - documents array to be indexed
   * @param type {string} - type of documents to be added (e.g: products, regions, orders, etc)
   * @return {Promise<{object}>} - returns response from search engine provider
   */
  addDocuments(indexName, documents, type) {
    throw Error("addDocuments must be overridden by a child class")
  }

  /**
   * Used to replace documents
   * @param indexName {string} - the index name.
   * @param documents {Object} - array of document objects that will replace existing documents
   * @param type {Array.<Object>} - type of documents to be replaced (e.g: products, regions, orders, etc)
   * @return {Promise<{object}>} - returns response from search engine provider
   */
  replaceDocuments(indexName, documents, type) {
    throw Error("updateDocument must be overridden by a child class")
  }

  /**
   * Used to delete document
   * @param indexName {string} - the index name
   * @param document_id {string} - the id of the document
   * @return {Promise<{object}>} - returns response from search engine provider
   */
  deleteDocument(indexName, document_id) {
    throw Error("deleteDocument must be overridden by a child class")
  }

  /**
   * Used to delete all documents
   * @param indexName {string} - the index name
   * @return {Promise<{object}>} - returns response from search engine provider
   */
  deleteAllDocuments(indexName) {
    throw Error("deleteAllDocuments must be overridden by a child class")
  }

  /**
   * Used to search for a document in an index
   * @param indexName {string} - the index name
   * @param query {string} - the search query
   * @param options {{ paginationOptions: { limit: number, offset: number }, filter: any, additionalOptions: any}}
   * - any options passed to the request object other than the query and indexName
   * - additionalOptions contain any provider specific options
   * @return {Promise<{ hits: any[]; [k: string]: any; }>} returns response from search engine provider
   */
  search(indexName, query, options) {
    throw Error("search must be overridden by a child class")
  }

  /**
   * Used to update the settings of an index
   * @param indexName {string} - the index name
   * @param settings {object} - settings object
   * @return {Promise<{object}>} - returns response from search engine provider
   */
  updateSettings(indexName, settings) {
    throw Error("updateSettings must be overridden by a child class")
  }
}

export default SearchService
