import { SearchTypes } from "@medusajs/types"

type TypeSenseNode = {
  host: string
  port: number
  protocol: string
}

export type TypesensePluginOptions = {
  /**
   * Typesense client configuration
   */
  config: {
    nodes: TypeSenseNode[]
    apiKey: string
    [key: string]: any
  }
  /**
   * Collection schema settings
   */
  settings?: {
    [key: string]: SearchTypes.IndexSettings
  }
}