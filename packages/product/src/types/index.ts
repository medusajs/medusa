export type ProductServiceInitializeOptions = {
  database: {
    clientUrl: string
    schema?: string
    driverOptions?: Record<string, unknown>
  }
}
