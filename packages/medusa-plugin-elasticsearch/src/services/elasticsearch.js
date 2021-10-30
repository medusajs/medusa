import { SearchService } from "medusa-interfaces"
import { Client } from "elasticsearch"
import { indexTypes } from "medusa-core-utils"
import { transformProduct } from "../utils/transform-product"

class ElasticSearchService extends SearchService {
    constructor(container, options) {
        super()

        this.options_ = options

        this.client_ = new Client(options.config)
    }

    createIndex(indexName, options) {
        return this.client_.indices.create({ index: indexName, ...options })
    }

    getIndex(indexName) {
        return this.client_.indices.get({ index: indexName })
    }

    addDocuments(indexName, documents, type) {
        const transformedDocuments = this.getTransformedDocuments(type, documents)
        return this.client_.index({ index: indexName, type: type, body: transformedDocuments })
    }

    replaceDocuments(indexName, documents, type) {
        const transformedDocuments = this.getTransformedDocuments(type, documents)
        return this.client_.index({ index: indexName, type: type, body: transformedDocuments })
    }

    deleteDocument(indexName, document_id) {
        return this.client_.delete({ id: document_id, index: indexName })
    }

    deleteAllDocuments(indexName) {
        return this.client_.deleteByQuery({
            index: indexName,
            body: {
                "query": {
                    "match_all": {}
                }
            }
        })
    }

    search(indexName, query, options) {
        const { paginationOptions, filter, additionalOptions } = options
        return this.client_.search({
            index: indexName,
            q: query,
            body: {
                "query": filter
            },
            ...additionalOptions,
            from: paginationOptions.offset,
            size: paginationOptions.limit
        })
    }

    updateSettings(indexName, settings) {
        return this.client_.indices.
        putSettings({ index: indexName, body: { "settings": settings } })
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

export default ElasticSearchService