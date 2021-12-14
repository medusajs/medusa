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
  incrementalProductsOperation: (date: Date) => IMedusaOperation
  incrementalCollectionsOperation: (date: Date) => IMedusaOperation
  incrementalRegionsOperation: (date: Date) => IMedusaOperation
  incrementalOrdersOperation: (date: Date) => IMedusaOperation
}
