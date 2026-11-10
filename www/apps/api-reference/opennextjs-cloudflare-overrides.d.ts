/**
 * Custom bindings from wrangler.jsonc, merged into the CloudflareEnv
 * interface that `getCloudflareContext().env` is typed with. The R2 binding
 * is typed structurally because `@cloudflare/workers-types` isn't installed.
 */
interface CloudflareEnv {
  SPECS_R2_BUCKET?: {
    get(key: string): Promise<{ text(): Promise<string> } | null>
    list(options?: {
      prefix?: string
      delimiter?: string
      cursor?: string
      limit?: number
    }): Promise<{
      objects: { key: string }[]
      delimitedPrefixes: string[]
      truncated: boolean
      cursor?: string
    }>
  }
}
