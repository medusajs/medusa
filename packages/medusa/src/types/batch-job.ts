export enum BatchJobStatus {
  CREATED = "created",
  PROCESSING = "processing",
  AWAITING_CONFIRMATION = "awaiting_confirmation",
  COMPLETED = "completed",
}

export enum BatchJobType {
  PRODUCT_IMPORT = "product_import",
  PRODUCT_EXPORT = "product_export",
}
