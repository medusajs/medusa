export interface ISearchService {
    options: Record<string, unknown>
  
    /**
     * Used to create an index
     * @param indexName the index name
     * @param options the options
     * @return returns response from search engine provider
     */
    createIndex(indexName: string, options: unknown): unknown
  
    /**
     * Used to get an index
     * @param indexName - the index name.
     * @return returns response from search engine provider
     */
    getIndex(indexName: string): unknown
  
    /**
     * Used to index documents by the search engine provider
     * @param indexName the index name
     * @param documents documents array to be indexed
     * @param type of documents to be added (e.g: products, regions, orders, etc)
     * @return returns response from search engine provider
     */
    addDocuments(indexName: string, documents: unknown, type: string): unknown
  
    /**
     * Used to replace documents
     * @param indexName the index name.
     * @param documents array of document objects that will replace existing documents
     * @param type type of documents to be replaced (e.g: products, regions, orders, etc)
     * @return returns response from search engine provider
     */
    replaceDocuments(indexName: string, documents: unknown, type: string): unknown
  
    /**
     * Used to delete document
     * @param indexName the index name
     * @param document_id the id of the document
     * @return returns response from search engine provider
     */
    deleteDocument(indexName: string, document_id: string | number): unknown
  
    /**
     * Used to delete all documents
     * @param indexName the index name
     * @return returns response from search engine provider
     */
    deleteAllDocuments(indexName: string): unknown
  
    /**
     * Used to search for a document in an index
     * @param indexName the index name
     * @param query the search query
     * @param options
     * - any options passed to the request object other than the query and indexName
     * - additionalOptions contain any provider specific options
     * @return returns response from search engine provider
     */
    search(indexName: string, query: string | null, options: unknown): unknown
  
    /**
     * Used to update the settings of an index
     * @param indexName the index name
     * @param settings settings object
     * @return returns response from search engine provider
     */
    updateSettings(indexName: string, settings: unknown): unknown
  }