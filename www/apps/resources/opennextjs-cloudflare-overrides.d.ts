/**
 * Custom bindings from wrangler.jsonc, merged into the CloudflareEnv
 * interface that `getCloudflareContext().env` is typed with. The R2 binding
 * is typed structurally because `@cloudflare/workers-types` isn't installed.
 */
interface CloudflareEnv {
  REFERENCES_R2_BUCKET?: {
    get(key: string): Promise<{ text(): Promise<string> } | null>
  }
  ASSETS?: {
    fetch(url: string | URL): Promise<Response>
  }
}
