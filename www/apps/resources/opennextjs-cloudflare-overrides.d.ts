/**
 * The `@opennextjs/cloudflare/overrides/*` specifiers are defined through the
 * package's `exports` map, which the `node` (node10) moduleResolution used by
 * this app can't read. These shims point TypeScript at the physical files;
 * the OpenNext build resolves the real specifiers through the exports map.
 */
declare module "@opennextjs/cloudflare/overrides/incremental-cache/r2-incremental-cache" {
  export * from "@opennextjs/cloudflare/dist/api/overrides/incremental-cache/r2-incremental-cache"
  export { default } from "@opennextjs/cloudflare/dist/api/overrides/incremental-cache/r2-incremental-cache"
}

declare module "@opennextjs/cloudflare/overrides/incremental-cache/regional-cache" {
  export * from "@opennextjs/cloudflare/dist/api/overrides/incremental-cache/regional-cache"
}

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
