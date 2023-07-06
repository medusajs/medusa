interface MedusaPluginOptions {
  storeUrl: string
  apiKey: string
}

interface MedusaProductImage {
  url: string
  metadata: Record<string, unknown> | null
  id: string
  created_at: string
  updated_at: string
  deleted_at: string | null
}

interface IMedusaOperation {
  execute: () => Promise<any[]>
  name: string
}

interface IOperations {
  createProductsOperation: IMedusaOperation
  createCollectionsOperation: IMedusaOperation
  createRegionsOperation: IMedusaOperation
  createOrdersOperation: IMedusaOperation
  incrementalProductsOperation: (date: string) => IMedusaOperation
  incrementalCollectionsOperation: (date: string) => IMedusaOperation
  incrementalRegionsOperation: (date: string) => IMedusaOperation
  incrementalOrdersOperation: (date: string) => IMedusaOperation
}
