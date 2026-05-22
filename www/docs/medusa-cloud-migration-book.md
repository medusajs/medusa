# Medusa Cloud Migration: `book` App

Step-by-step changes to apply to `www/apps/book` (and two workspace packages) to make it deployable on Medusa Cloud (Cloudflare Workers via `@opennextjs/cloudflare`).

**Context:**
- Medusa Cloud uses `MC_ENV=1` (not `VERCEL_ENV` or `CLOUDFLARE_ENV`) to signal the cloud runtime.
- Medusa Cloud runs `turbo prune --scope=book` before install, removing all sibling apps from disk.
- Medusa Cloud runs `cloud:prebuild` then `build` scripts from `package.json`.
- Cloudflare Workers V8 isolates have no `fs` at runtime — files must be served as static assets and fetched via HTTP.

---

## 1. `apps/book/package.json`

**Add `cloud:prebuild` script and `next-mdx-remote` dependency.**

In `scripts`, add:
```json
"cloud:prebuild": "node ./scripts/cloud-prepare.mjs"
```

In `dependencies`, add:
```json
"next-mdx-remote": "^5.0.0"
```

`next-mdx-remote` is imported in `components/MDXContent/index.tsx` but was missing as a declared dependency. It was previously available transitively but is absent after turbo prune.

---

## 2. `apps/book/next.config.mjs`

**Four changes in this file.**

### 2a. Disable `brokenLinkCheckerPlugin` in cloud builds

The plugin reads sibling app file systems which don't exist after turbo prune. Disable it entirely when `MC_ENV` is set (CI handles broken-link validation separately).

Replace:
```js
[
  brokenLinkCheckerPlugin,
  {
    crossProjects: {
      bloom: { projectPath: path.resolve("..", "bloom") },
      resources: { projectPath: path.resolve("..", "resources"), hasGeneratedSlugs: true },
      ui: { projectPath: path.resolve("..", "ui") },
      "user-guide": { projectPath: path.resolve("..", "user-guide") },
      api: { projectPath: path.resolve("..", "api-reference"), skipSlugValidation: true },
      cloud: { projectPath: path.resolve("..", "cloud") },
    },
  },
],
```

With:
```js
...(!process.env.MC_ENV
  ? [
      [
        brokenLinkCheckerPlugin,
        {
          crossProjects: {
            bloom: { projectPath: path.resolve("..", "bloom") },
            resources: { projectPath: path.resolve("..", "resources"), hasGeneratedSlugs: true },
            ui: { projectPath: path.resolve("..", "ui") },
            "user-guide": { projectPath: path.resolve("..", "user-guide") },
            api: { projectPath: path.resolve("..", "api-reference"), skipSlugValidation: true },
            cloud: { projectPath: path.resolve("..", "cloud") },
          },
        },
      ],
    ]
  : []),
```

### 2b. Fix `useBaseUrl` in `crossProjectLinksPlugin`

Replace:
```js
useBaseUrl:
  process.env.NODE_ENV === "production" ||
  process.env.VERCEL_ENV === "production",
```

With:
```js
useBaseUrl:
  process.env.NODE_ENV === "production" ||
  !!process.env.MC_ENV,
```

### 2c. Fix `beforeFiles` rewrite rules for OpenNext compatibility

OpenNext uses path-to-regexp to encode destination URLs. The original regex-based captures (`/:path((?!resources|...).*)`) capture slash-containing strings, which path-to-regexp rejects with `TypeError: Expected 'path' to match '[^\/#\?]+?'`.

Replace the entire `beforeFiles` array:

```js
beforeFiles: [
  {
    source: "/:path*/index.html.md",
    destination: "/md-content/:path*/",
  },
  {
    source: "/:path*/index.md",
    destination: "/md-content/:path*/",
  },
  {
    source: "/:path*.md",
    destination: "/md-content/:path*",
  },
  {
    source:
      "/:first((?!resources|api|ui|user-guide|cloud|md-content)[^/]+)/:rest*/",
    has: [
      {
        type: "header",
        key: "Accept",
        value: ".*(text/markdown|text/plain).*",
      },
    ],
    destination: "/md-content/:first/:rest*",
  },
  {
    source: "/",
    has: [
      {
        type: "header",
        key: "Accept",
        value: ".*(text/markdown|text/plain).*",
      },
    ],
    destination: "/md-content",
  },
  {
    source:
      "/:first((?!resources|api|ui|user-guide|cloud|md-content)[^/]+)/:rest*",
    has: [
      {
        type: "header",
        key: "Accept",
        value: ".*(text/markdown|text/plain).*",
      },
    ],
    destination: "/md-content/:first/:rest*",
  },
],
```

### 2d. Update `outputFileTracingRoot` / `outputFileTracingExcludes`

Replace:
```js
outputFileTracingIncludes: {
  "/md\\-content/\\[\\.\\.\\.slug\\]": ["./app/**/*.mdx"],
},
outputFileTracingExcludes: {
  "*": ["node_modules/@medusajs/icons"],
},
```

With:
```js
outputFileTracingRoot: new URL("../../", import.meta.url).pathname,
outputFileTracingExcludes: {
  "*": [
    "node_modules/@medusajs/icons",
    "../**/.open-next/**",
    "../!(book)/.next/**",
  ],
},
```

`outputFileTracingIncludes` for MDX files is removed because MDX files are now served as static assets from `public/raw-mdx/` (copied there by `cloud-prepare.mjs` at build time), not bundled via file tracing.

---

## 3. `apps/book/utils/get-clean-md-cached.ts`

**Two bugs to fix, plus add `content` option.**

### 3a. Fix `projectUrls` — all entries incorrectly pointed to `NEXT_PUBLIC_RESOURCES_URL`

Replace:
```typescript
projectUrls: {
  resources: {
    url: process.env.NEXT_PUBLIC_RESOURCES_URL,
  },
  "user-guide": {
    url: process.env.NEXT_PUBLIC_RESOURCES_URL,
  },
  ui: {
    url: process.env.NEXT_PUBLIC_RESOURCES_URL,
  },
  api: {
    url: process.env.NEXT_PUBLIC_RESOURCES_URL,
  },
},
```

With:
```typescript
projectUrls: {
  resources: {
    url: process.env.NEXT_PUBLIC_RESOURCES_URL,
  },
  "user-guide": {
    url: process.env.NEXT_PUBLIC_USER_GUIDE_URL,
  },
  ui: {
    url: process.env.NEXT_PUBLIC_UI_URL,
  },
  api: {
    url: process.env.NEXT_PUBLIC_API_URL,
  },
},
```

### 3b. Fix `useBaseUrl` — replace `VERCEL_ENV` with `MC_ENV`

Replace:
```typescript
useBaseUrl:
  process.env.NODE_ENV === "production" ||
  process.env.VERCEL_ENV === "production",
```

With:
```typescript
useBaseUrl:
  process.env.NODE_ENV === "production" ||
  !!process.env.MC_ENV,
```

### 3c. Add `content` option to support passing raw MDX strings

Replace:
```typescript
type Options = {
  removeExtra?: boolean
}

export const getCleanMdCached = unstable_cache(
  async (filePath: string, options: Options = {}) => {
    const { removeExtra } = options
    const md = await getCleanMd({
      file: filePath,
```

With:
```typescript
type Options = {
  removeExtra?: boolean
  content?: string
}

export const getCleanMdCached = unstable_cache(
  async (filePathOrKey: string, options: Options = {}) => {
    const { removeExtra, content } = options
    const md = await getCleanMd({
      file: content ?? filePathOrKey,
      type: content ? "content" : "file",
```

Also update the import at the top — `getCleanMd` is already imported from `docs-utils`, no change needed there.

---

## 4. `apps/book/utils/fetch-raw-mdx.ts` (new file)

Create this file. It fetches `_md-content.mdx` (override) or `page.mdx` for a given slug, using HTTP on cloud and `fs.readFile` locally.

```typescript
import { workerCompatibleFetch } from "docs-utils"
import path from "path"

type FetchRawMdxResult = {
  content: string
  isOverride: boolean
}

async function tryFetch(
  origin: string,
  slug: string[],
  filename: string,
  isCloud: boolean
): Promise<string | null> {
  return workerCompatibleFetch<string | null>({
    url: `${origin}/raw-mdx/${[...slug, filename].join("/")}`,
    responseTransformer: async (res) => (res.ok ? res.text() : null),
    fallbackAction: async () => {
      try {
        const { promises: fs } = await import("fs")
        return await fs.readFile(
          path.join(process.cwd(), "app", ...slug, filename),
          "utf-8"
        )
      } catch {
        return null
      }
    },
    useRemote: isCloud,
  })
}

export async function fetchRawMdx(
  origin: string,
  slug: string[]
): Promise<FetchRawMdxResult | null> {
  const isCloud = !!process.env.MC_ENV

  const overrideContent = await tryFetch(origin, slug, "_md-content.mdx", isCloud)
  if (overrideContent) {
    return { content: overrideContent, isOverride: true }
  }

  const pageContent = await tryFetch(origin, slug, "page.mdx", isCloud)
  return pageContent ? { content: pageContent, isOverride: false } : null
}
```

---

## 5. `apps/book/app/md-content/[[...slug]]/route.ts`

**Full rewrite.** Replace the entire file:

```typescript
import { addExtraToMd, workerCompatibleFetch } from "docs-utils"
import { readFileSync } from "fs"
import { notFound } from "next/navigation"
import { NextRequest, NextResponse } from "next/server"
import path from "path"
import { PostHog } from "posthog-node"
import { fetchRawMdx } from "../../../utils/fetch-raw-mdx"
import { getCleanMdCached } from "../../../utils/get-clean-md-cached"

type Params = {
  params: Promise<{ slug?: string[] }>
}

const EXTERNAL_PREFIXES = ["resources", "api", "ui", "user-guide", "cloud"]

export async function GET(req: NextRequest, { params }: Params) {
  const { slug: rawSlug } = await params
  const slug = rawSlug?.filter(Boolean) ?? []
  const origin = process.env.NEXT_PUBLIC_BASE_URL || new URL(req.url).origin

  if (slug.length > 0 && EXTERNAL_PREFIXES.includes(slug[0])) {
    return notFound()
  }

  if (slug.length === 0) {
    const homepageFile = await workerCompatibleFetch({
      url: `${origin}/homepage.md`,
      useRemote: !!process.env.MC_ENV,
      responseTransformer: async (res) => res.text(),
      fallbackAction: async () =>
        readFileSync(
          path.join(process.cwd(), "public", "homepage.md"),
          "utf-8"
        ),
    })

    return new NextResponse(
      addExtraToMd(homepageFile, {
        baseUrl: process.env.NEXT_PUBLIC_BASE_URL || "",
      }),
      {
        headers: {
          "content-type": "text/markdown",
          "cache-control": "public, max-age=3600, must-revalidate",
        },
        status: 200,
      }
    )
  }

  const rawMdx = await fetchRawMdx(origin, slug)

  if (!rawMdx) {
    return notFound()
  }

  const cleanMdContent = await getCleanMdCached(slug.join("/"), {
    content: rawMdx.content,
    removeExtra: rawMdx.isOverride,
  })

  const acceptHeader = req.headers.get("accept") || ""
  if (
    acceptHeader.includes("text/plain") ||
    acceptHeader.includes("text/markdown")
  ) {
    const client = new PostHog(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
      host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
    })

    const urlObj = new URL(req.url)
    const url = `${process.env.NEXT_PUBLIC_BASE_URL || ""}${process.env.NEXT_PUBLIC_BASE_PATH || ""}${urlObj.pathname}`

    client.capture({
      distinctId: "anonymous",
      event: "md_content_requested_agents",
      properties: {
        $current_url: url,
        $raw_user_agent: req.headers.get("user-agent") || undefined,
      },
    })

    await client.shutdown()
  }

  return new NextResponse(cleanMdContent, {
    headers: {
      "content-type": "text/markdown",
      "cache-control": "public, max-age=3600, must-revalidate",
    },
    status: 200,
  })
}
```

Key changes from original:
- `slug` is now `rawSlug?.filter(Boolean) ?? []` (empty array for root instead of `["/"]`)
- Homepage check is `slug.length === 0` instead of `slug[0] === "/"`
- MDX files fetched via `fetchRawMdx` (HTTP on cloud, `fs` locally) instead of `existsSync`/`readFileSync`
- `getCleanMdCached` called with slug as cache key and `content` option
- `EXTERNAL_PREFIXES` guard returns 404 for sibling-app paths

---

## 6. `apps/book/scripts/cloud-prepare.mjs` (new file)

Create this file. It copies all `page.mdx` and `_md-content.mdx` files from `app/` into `public/raw-mdx/` so they are served as Cloudflare static assets. Runs only when `MC_ENV` is set.

```js
import "dotenv/config"
import path from "path"
import { copyMdxToPublic } from "build-scripts"

async function main() {
  if (!process.env.MC_ENV) {
    return
  }

  console.log("Copying MDX files to public/raw-mdx...")
  await copyMdxToPublic({
    srcDir: path.join(process.cwd(), "app"),
    destDir: path.join(process.cwd(), "public", "raw-mdx"),
  })
}

void main()
```

`copyMdxToPublic` is already exported from `packages/build-scripts`.

---

## 7. `apps/book/scripts/prepare.mjs`

**Wrap all sibling-app `scanDirs` entries with an `existsSync` guard.**

After turbo prune, sibling apps (`resources`, `api-reference`, `ui`, etc.) are absent from disk. Passing a non-existent directory to `generateLlmsFull` causes an ENOENT crash.

Add at the top of the file (after existing imports):
```js
import { existsSync } from "fs"
```

Add this helper function before `main()`:
```js
function scanDir(config) {
  const dir = typeof config === "string" ? config : config.dir
  return existsSync(dir) ? config : null
}
```

Then wrap every sibling-app entry in the `scanDirs` array with `scanDir(...)` and add `.filter(Boolean)` at the end of the array. For example:

```js
scanDirs: [
  {
    dir: path.join(process.cwd(), "app"),
  },
  scanDir({
    dir: path.join(process.cwd(), "..", "resources", "app", "commerce-modules"),
    // ...
  }),
  // ... all other sibling-app entries wrapped with scanDir(...)
].filter(Boolean),
```

The book app's own `app/` directory entry does NOT need `scanDir` (it always exists).

---

## 8. `apps/book/vercel.json`

**Delete this file.** It contains Vercel-specific build config that is not needed on Medusa Cloud.

---

## 9. `packages/tags/src/utils/generate-tags.ts`

**Add `existsSync` filter to skip absent sibling apps.**

The `tags` package scans `apps/resources`, `apps/ui`, and `apps/user-guide`. These are pruned away in cloud builds.

Add `existsSync` to imports:
```typescript
import { existsSync, statSync } from "fs"
```

Locate the `Promise.all` call at the bottom of `generateTags` and add a filter:
```typescript
await Promise.all(
  config
    .filter((item) => existsSync(item.path))
    .map(async (item) => {
      await getTags(item)
    })
)
```

---

## 10. `packages/build-scripts/package.json`

**Add missing `@types/pluralize` dev dependency.**

`build-scripts` uses `pluralize` but the package ships no TypeScript types. Without `@types/pluralize`, `tsc` fails with `TS7016: Could not find a declaration file for module 'pluralize'`.

Add to `devDependencies`:
```json
"@types/pluralize": "^0.0.33"
```

---

## Medusa Cloud Dashboard Configuration

Configure the following in the Medusa Cloud dashboard for the `book` frontend:

- **Root directory**: `apps/book`
- **Pre-build command**: `cd ../.. && yarn build:packages`
  - Compiles workspace packages before `next build`. Without this, `next.config.mjs` fails to import `remark-rehype-plugins`, `docs-utils`, etc.
- **Environment variables (build-time)**:
  - All existing `NEXT_PUBLIC_*` variables
  - `CLOUDINARY_CLOUD_NAME`
  - `MC_ENV=1`
- **Runtime secrets**:
  - `LOOPS_API_KEY`
