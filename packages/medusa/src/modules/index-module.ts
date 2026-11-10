import IndexModule from "@medusajs/index"

export * from "@medusajs/index"

/**
 * @deprecated The Index Module is deprecated and will be removed in a future release. Use `query.graph()` instead, which filters across linked modules: https://docs.medusajs.com/learn/fundamentals/query#filter-by-linked-data-models-property
 */
export default IndexModule
export const discoveryPath = require.resolve("@medusajs/index")
