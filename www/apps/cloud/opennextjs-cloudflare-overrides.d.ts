/**
 * Structural typing for the ASSETS binding, since `@cloudflare/workers-types`
 * isn't installed. Merged into the CloudflareEnv interface that
 * `getCloudflareContext().env` is typed with.
 */
interface CloudflareEnv {
  ASSETS?: {
    fetch(url: string | URL): Promise<Response>
  }
}
