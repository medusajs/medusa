diff --git a/.github/workflows/algolia-api-indexer.yml b/.github/workflows/algolia-api-indexer.yml
new file mode 100644
index 0000000000000..3c639f57f7651
--- /dev/null
+++ b/.github/workflows/algolia-api-indexer.yml
@@ -0,0 +1,33 @@
+name: Index API Reference to Algolia
+
+on:
+  schedule:
+    - cron: "0 0 * * *" # Every day at 00:00 UTC
+  workflow_dispatch: # Allow manual trigger
+
+jobs:
+  index:
+    name: Index to Algolia
+    runs-on: ubuntu-latest
+    steps:
+      - name: Checkout repository
+        uses: actions/checkout@v4
+
+      - name: Setup Node.js
+        uses: actions/setup-node@v4
+        with:
+          node-version: 20
+          cache: yarn
+
+      - name: Install dependencies
+        run: yarn install --frozen-lockfile
+
+      - name: Run Algolia indexer
+        working-directory: www/apps/api-reference
+        run: node scripts/index-algolia.mjs
+        env:
+          NEXT_PUBLIC_ALGOLIA_APP_ID: ${{ secrets.NEXT_PUBLIC_ALGOLIA_APP_ID }}
+          ALGOLIA_WRITE_API_KEY: ${{ secrets.ALGOLIA_WRITE_API_KEY }}
+          NEXT_PUBLIC_API_ALGOLIA_INDEX_NAME: ${{ secrets.NEXT_PUBLIC_API_ALGOLIA_INDEX_NAME }}
+          NEXT_PUBLIC_BASE_URL: ${{ secrets.NEXT_PUBLIC_BASE_URL }}
+          NEXT_PUBLIC_BASE_PATH: /api
diff --git a/.github/workflows/sync-api-reference-specs-to-r2.yml b/.github/workflows/sync-api-reference-specs-to-r2.yml
new file mode 100644
index 0000000000000..74dc2c0f4c555
--- /dev/null
+++ b/.github/workflows/sync-api-reference-specs-to-r2.yml
@@ -0,0 +1,61 @@
+name: Sync API Reference Specs to R2
+
+on:
+  push:
+    branches:
+      - develop
+    paths:
+      - "www/apps/api-reference/specs/**"
+
+jobs:
+  sync:
+    name: Sync changed spec files to R2
+    runs-on: ubuntu-latest
+    defaults:
+      run:
+        working-directory: www/apps/api-reference
+
+    steps:
+      - uses: actions/checkout@v4
+        with:
+          fetch-depth: 2
+
+      - uses: actions/setup-node@v4
+        with:
+          node-version: "20"
+          cache: "yarn"
+
+      - name: Install dependencies
+        run: yarn install --immutable
+        working-directory: .
+
+      - name: Get changed spec files
+        id: changed
+        uses: tj-actions/changed-files@9426d40962ed5378910ee2e21d5f8c6fcbf2dd96
+        with:
+          files: "www/apps/api-reference/specs/**"
+          separator: " "
+
+      - name: Upload added/modified specs
+        if: steps.changed.outputs.any_changed == 'true'
+        env:
+          CHANGED_FILES: ${{ steps.changed.outputs.all_changed_files }}
+          CLOUDFLARE_ACCOUNT_ID: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
+          CLOUDFLARE_R2_ACCESS_KEY_ID: ${{ secrets.CLOUDFLARE_R2_ACCESS_KEY_ID }}
+          CLOUDFLARE_R2_SECRET_ACCESS_KEY: ${{ secrets.CLOUDFLARE_R2_SECRET_ACCESS_KEY }}
+          R2_BUCKET_NAME: ${{ vars.R2_BUCKET_NAME }}
+        run: |
+          STRIPPED=$(echo "$CHANGED_FILES" | tr ' ' '\n' | sed 's|^www/apps/api-reference/||' | tr '\n' ' ')
+          node ./scripts/upload-specs-to-r2.mjs --upload $STRIPPED
+
+      - name: Remove deleted specs
+        if: steps.changed.outputs.any_deleted == 'true'
+        env:
+          DELETED_FILES: ${{ steps.changed.outputs.deleted_files }}
+          CLOUDFLARE_ACCOUNT_ID: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
+          CLOUDFLARE_R2_ACCESS_KEY_ID: ${{ secrets.CLOUDFLARE_R2_ACCESS_KEY_ID }}
+          CLOUDFLARE_R2_SECRET_ACCESS_KEY: ${{ secrets.CLOUDFLARE_R2_SECRET_ACCESS_KEY }}
+          R2_BUCKET_NAME: ${{ vars.R2_BUCKET_NAME }}
+        run: |
+          STRIPPED=$(echo "$DELETED_FILES" | tr ' ' '\n' | sed 's|^www/apps/api-reference/||' | tr '\n' ' ')
+          node ./scripts/upload-specs-to-r2.mjs --remove $STRIPPED
diff --git a/.github/workflows/sync-resources-references-to-r2.yml b/.github/workflows/sync-resources-references-to-r2.yml
new file mode 100644
index 0000000000000..218e25a35c7a3
--- /dev/null
+++ b/.github/workflows/sync-resources-references-to-r2.yml
@@ -0,0 +1,61 @@
+name: Sync Resources References to R2
+
+on:
+  push:
+    branches:
+      - develop
+    paths:
+      - "www/apps/resources/references/**"
+
+jobs:
+  sync:
+    name: Sync changed reference files to R2
+    runs-on: ubuntu-latest
+    defaults:
+      run:
+        working-directory: www/apps/resources
+
+    steps:
+      - uses: actions/checkout@v4
+        with:
+          fetch-depth: 2
+
+      - uses: actions/setup-node@v4
+        with:
+          node-version: "20"
+          cache: "yarn"
+
+      - name: Install dependencies
+        run: yarn install --immutable
+        working-directory: .
+
+      - name: Get changed reference files
+        id: changed
+        uses: tj-actions/changed-files@9426d40962ed5378910ee2e21d5f8c6fcbf2dd96
+        with:
+          files: "www/apps/resources/references/**"
+          separator: " "
+
+      - name: Upload added/modified references
+        if: steps.changed.outputs.any_changed == 'true'
+        env:
+          CHANGED_FILES: ${{ steps.changed.outputs.all_changed_files }}
+          CLOUDFLARE_ACCOUNT_ID: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
+          CLOUDFLARE_R2_ACCESS_KEY_ID: ${{ secrets.CLOUDFLARE_R2_ACCESS_KEY_ID }}
+          CLOUDFLARE_R2_SECRET_ACCESS_KEY: ${{ secrets.CLOUDFLARE_R2_SECRET_ACCESS_KEY }}
+          R2_BUCKET_NAME: ${{ vars.R2_BUCKET_NAME }}
+        run: |
+          STRIPPED=$(echo "$CHANGED_FILES" | tr ' ' '\n' | grep '/page\.mdx$' | sed 's|^www/apps/resources/||' | tr '\n' ' ')
+          [ -n "$STRIPPED" ] && node ./scripts/upload-references-to-r2.mjs --upload $STRIPPED || echo "No page.mdx files to upload."
+
+      - name: Remove deleted references
+        if: steps.changed.outputs.any_deleted == 'true'
+        env:
+          DELETED_FILES: ${{ steps.changed.outputs.deleted_files }}
+          CLOUDFLARE_ACCOUNT_ID: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
+          CLOUDFLARE_R2_ACCESS_KEY_ID: ${{ secrets.CLOUDFLARE_R2_ACCESS_KEY_ID }}
+          CLOUDFLARE_R2_SECRET_ACCESS_KEY: ${{ secrets.CLOUDFLARE_R2_SECRET_ACCESS_KEY }}
+          R2_BUCKET_NAME: ${{ vars.R2_BUCKET_NAME }}
+        run: |
+          STRIPPED=$(echo "$DELETED_FILES" | tr ' ' '\n' | grep '/page\.mdx$' | sed 's|^www/apps/resources/||' | tr '\n' ' ')
+          [ -n "$STRIPPED" ] && node ./scripts/upload-references-to-r2.mjs --remove $STRIPPED || echo "No page.mdx files to remove."
diff --git a/.github/workflows/sync-ui-specs-to-r2.yml b/.github/workflows/sync-ui-specs-to-r2.yml
new file mode 100644
index 0000000000000..e14a9873bbc3b
--- /dev/null
+++ b/.github/workflows/sync-ui-specs-to-r2.yml
@@ -0,0 +1,61 @@
+name: Sync UI Specs to R2
+
+on:
+  push:
+    branches:
+      - develop
+    paths:
+      - "www/apps/ui/specs/**"
+
+jobs:
+  sync:
+    name: Sync changed spec files to R2
+    runs-on: ubuntu-latest
+    defaults:
+      run:
+        working-directory: www/apps/ui
+
+    steps:
+      - uses: actions/checkout@v4
+        with:
+          fetch-depth: 2
+
+      - uses: actions/setup-node@v4
+        with:
+          node-version: "20"
+          cache: "yarn"
+
+      - name: Install dependencies
+        run: yarn install --immutable
+        working-directory: .
+
+      - name: Get changed spec files
+        id: changed
+        uses: tj-actions/changed-files@9426d40962ed5378910ee2e21d5f8c6fcbf2dd96
+        with:
+          files: "www/apps/ui/specs/**"
+          separator: " "
+
+      - name: Upload added/modified specs
+        if: steps.changed.outputs.any_changed == 'true'
+        env:
+          CHANGED_FILES: ${{ steps.changed.outputs.all_changed_files }}
+          CLOUDFLARE_ACCOUNT_ID: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
+          CLOUDFLARE_R2_ACCESS_KEY_ID: ${{ secrets.CLOUDFLARE_R2_ACCESS_KEY_ID }}
+          CLOUDFLARE_R2_SECRET_ACCESS_KEY: ${{ secrets.CLOUDFLARE_R2_SECRET_ACCESS_KEY }}
+          R2_BUCKET_NAME: ${{ vars.R2_BUCKET_NAME }}
+        run: |
+          STRIPPED=$(echo "$CHANGED_FILES" | tr ' ' '\n' | sed 's|^www/apps/ui/||' | tr '\n' ' ')
+          node ./scripts/upload-specs-to-r2.mjs --upload $STRIPPED
+
+      - name: Remove deleted specs
+        if: steps.changed.outputs.any_deleted == 'true'
+        env:
+          DELETED_FILES: ${{ steps.changed.outputs.deleted_files }}
+          CLOUDFLARE_ACCOUNT_ID: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
+          CLOUDFLARE_R2_ACCESS_KEY_ID: ${{ secrets.CLOUDFLARE_R2_ACCESS_KEY_ID }}
+          CLOUDFLARE_R2_SECRET_ACCESS_KEY: ${{ secrets.CLOUDFLARE_R2_SECRET_ACCESS_KEY }}
+          R2_BUCKET_NAME: ${{ vars.R2_BUCKET_NAME }}
+        run: |
+          STRIPPED=$(echo "$DELETED_FILES" | tr ' ' '\n' | sed 's|^www/apps/ui/||' | tr '\n' ' ')
+          node ./scripts/upload-specs-to-r2.mjs --remove $STRIPPED
diff --git a/www/apps/api-reference/.env.sample b/www/apps/api-reference/.env.sample
index 0a3d68b737971..34bdaa560d046 100644
--- a/www/apps/api-reference/.env.sample
+++ b/www/apps/api-reference/.env.sample
@@ -25,4 +25,14 @@ NEXT_PUBLIC_INTEGRATION_ID=
 NEXT_PUBLIC_GA_ID=
 NEXT_PUBLIC_REO_DEV_CLIENT_ID=
 NEXT_PUBLIC_POSTHOG_KEY=
-NEXT_PUBLIC_POSTHOG_HOST=
\ No newline at end of file
+NEXT_PUBLIC_POSTHOG_HOST=
+
+# CLOUDFLARE DEPLOYMENT
+# Base URL of the R2 bucket where specs/ are uploaded (e.g. https://pub-xxx.r2.dev/api-reference)
+# Required when deploying to Cloudflare; falls back to local filesystem in dev
+SPECS_R2_BASE_URL=
+# R2 credentials for the upload:r2 script
+CLOUDFLARE_ACCOUNT_ID=
+CLOUDFLARE_R2_ACCESS_KEY_ID=
+CLOUDFLARE_R2_SECRET_ACCESS_KEY=
+R2_BUCKET_NAME=docs-assets
\ No newline at end of file
diff --git a/www/apps/api-reference/.gitignore b/www/apps/api-reference/.gitignore
index 1e67bf4da64f7..e9f7719bdd18d 100644
--- a/www/apps/api-reference/.gitignore
+++ b/www/apps/api-reference/.gitignore
@@ -27,6 +27,7 @@ yarn-error.log*
 # local env files
 .env*.local
 .env.test
+.dev.vars
 
 # vercel
 .vercel
@@ -40,4 +41,8 @@ specs/admin.oas.json
 specs/store.oas.json
 
 # analyzer
-analyze
\ No newline at end of file
+analyze
+
+# cloudflare
+.open-next
+.wrangler
\ No newline at end of file
diff --git a/www/apps/api-reference/README.md b/www/apps/api-reference/README.md
index 57127d8bd160d..06d4a2d9f517a 100644
--- a/www/apps/api-reference/README.md
+++ b/www/apps/api-reference/README.md
@@ -5,3 +5,4 @@ The Medusa API Reference website is built with Next.js 13. You can learn more ab
 ## Note About OpenAPI Specs
 
 The OpenAPI Specs under the directory `specs` are automatically generated by our OAS CLI tool. So, contributions should be made in the files under `packages/medusa/src/api` instead of directly making changes to the generated spec files.
+
diff --git a/www/apps/api-reference/app/algolia/route.ts b/www/apps/api-reference/app/algolia/route.ts
deleted file mode 100644
index 17cb03b163b24..0000000000000
--- a/www/apps/api-reference/app/algolia/route.ts
+++ /dev/null
@@ -1,151 +0,0 @@
-import OpenAPIParser from "@readme/openapi-parser"
-import algoliasearch from "algoliasearch"
-import type { OpenAPI } from "types"
-import path from "path"
-import { NextResponse } from "next/server"
-import { JSDOM } from "jsdom"
-import getUrl from "../../utils/get-url"
-import { capitalize } from "docs-ui"
-import { getSectionId } from "docs-utils"
-
-export async function GET() {
-  const algoliaClient = algoliasearch(
-    process.env.NEXT_PUBLIC_ALGOLIA_APP_ID || "",
-    process.env.ALGOLIA_WRITE_API_KEY || ""
-  )
-  const index = algoliaClient.initIndex(
-    process.env.NEXT_PUBLIC_API_ALGOLIA_INDEX_NAME || ""
-  )
-
-  // retrieve tags and their operations to index them
-  const indices: Record<string, any>[] = []
-  for (const area of ["store", "admin"]) {
-    const defaultIndexData = {
-      version: ["current"],
-      lang: "en",
-      _tags: ["api", `${area}-v2`],
-    }
-    // find and parse static headers from pages
-    const dom = await JSDOM.fromURL(getUrl(area))
-    const headers = dom.window.document.querySelectorAll("h2")
-    headers.forEach((header) => {
-      if (!header.textContent || !header.nextSibling?.textContent) {
-        return
-      }
-      const normalizedHeaderContent = header.textContent.replaceAll("#", "")
-      const description = header.nextSibling?.textContent
-
-      const objectID = getSectionId([normalizedHeaderContent])
-      const url = getUrl(area, objectID)
-      indices.push({
-        objectID: getObjectId(area, `${objectID}-mdx-section`),
-        hierarchy: getHierarchy(area, [normalizedHeaderContent]),
-        type: `content`,
-        content: description || "",
-        url,
-        url_without_variables: url,
-        url_without_anchor: url,
-        ...defaultIndexData,
-      })
-    })
-
-    // find and index tag and operations
-    const baseSpecs = (await OpenAPIParser.parse(
-      path.join(process.cwd(), `specs/${area}/openapi.full.yaml`)
-    )) as OpenAPI.ExpandedDocument
-
-    baseSpecs.tags?.map((tag) => {
-      const tagName = getSectionId([tag.name])
-      const url = getUrl(area, tagName)
-      indices.push({
-        objectID: getObjectId(area, tagName),
-        hierarchy: getHierarchy(area, [tag.name]),
-        type: "lvl1",
-        content: null,
-        description: tag.description,
-        url,
-        url_without_variables: url,
-        url_without_anchor: url,
-        ...defaultIndexData,
-      })
-    })
-
-    const paths = baseSpecs.paths
-
-    Object.values(paths).forEach((path) => {
-      Object.values(path).forEach((op) => {
-        const operation = op as OpenAPI.Operation
-        const tag = operation.tags?.[0]
-        const operationName = getSectionId([tag || "", operation.operationId])
-        const url = getUrl(area, operationName)
-        indices.push({
-          objectID: getObjectId(area, operationName),
-          hierarchy: getHierarchy(area, [operation.summary]),
-          type: "content",
-          content: operation.summary,
-          content_camel: operation.summary,
-          url,
-          url_without_variables: url,
-          url_without_anchor: url,
-          ...defaultIndexData,
-        })
-
-        // index its description
-        const operationDescriptionId = getSectionId([
-          tag || "",
-          operation.operationId,
-          operation.description.substring(
-            0,
-            Math.min(20, operation.description.length)
-          ),
-        ])
-
-        indices.push({
-          objectID: getObjectId(area, operationDescriptionId),
-          hierarchy: getHierarchy(area, [
-            operation.summary,
-            operation.description,
-          ]),
-          type: "content",
-          content: operation.description,
-          content_camel: operation.description,
-          url,
-          url_without_variables: url,
-          url_without_anchor: url,
-          ...defaultIndexData,
-        })
-      })
-    })
-  }
-
-  if (indices.length) {
-    await index.saveObjects(indices, {
-      autoGenerateObjectIDIfNotExist: true,
-    })
-  }
-
-  return NextResponse.json({
-    message: "done",
-    total: indices.length,
-  })
-}
-
-function getObjectId(area: string, objectName: string): string {
-  return `${area}_${objectName}`
-}
-
-function getHierarchy(area: string, levels: string[]): Record<string, string> {
-  const heirarchy: Record<string, string> = {
-    lvl0: `${capitalize(area)} API Reference`,
-  }
-
-  let counter = 1
-  levels.forEach((level) => {
-    heirarchy[`lvl${counter}`] = level
-    counter++
-  })
-
-  return heirarchy
-}
-
-export const dynamic = "force-dynamic"
diff --git a/www/apps/api-reference/app/assets/sitemap.ts b/www/apps/api-reference/app/assets/sitemap.ts
index 109b44e6ef919..f58b2d1fe4009 100644
--- a/www/apps/api-reference/app/assets/sitemap.ts
+++ b/www/apps/api-reference/app/assets/sitemap.ts
@@ -1,58 +1,30 @@
 import { MetadataRoute } from "next"
-import OpenAPIParser from "@readme/openapi-parser"
-import path from "path"
-import type { OpenAPI } from "types"
 import getUrl from "../../utils/get-url"
-import getPathsOfTag from "../../utils/get-paths-of-tag"
 import { config } from "../../config"
-import { getSectionId } from "docs-utils"
+import { specsSitemapData } from "@/generated/specs-sitemap-data.mjs"
 
-export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
+export default function sitemap(): MetadataRoute.Sitemap {
   const baseUrl = config.baseUrl
 
-  const results = [
-    {
-      url: `${baseUrl}/api/admin`,
-      lastModified: new Date(),
-    },
-    {
-      url: `${baseUrl}/api/store`,
-      lastModified: new Date(),
-    },
+  const results: MetadataRoute.Sitemap = [
+    { url: `${baseUrl}/api/admin`, lastModified: new Date() },
+    { url: `${baseUrl}/api/store`, lastModified: new Date() },
   ]
 
-  for (const area of ["store", "admin"]) {
-    const baseSpecs = (await OpenAPIParser.parse(
-      path.join(process.cwd(), `specs/${area}/openapi.yaml`)
-    )) as OpenAPI.ExpandedDocument
-
-    await Promise.all(
-      baseSpecs.tags?.map(async (tag) => {
-        const tagName = getSectionId([tag.name])
-        const url = getUrl(area, tagName)
+  for (const area of ["store", "admin"] as const) {
+    const tags = specsSitemapData[area] ?? []
+    for (const { tagSectionId, operationSectionIds } of tags) {
+      results.push({
+        url: getUrl(area, tagSectionId),
+        lastModified: new Date(),
+      })
+      for (const opSectionId of operationSectionIds) {
         results.push({
-          url,
+          url: getUrl(area, opSectionId),
           lastModified: new Date(),
         })
-
-        const paths = await getPathsOfTag(tagName, area)
-
-        Object.values(paths.paths).forEach((path) => {
-          Object.values(path).forEach((op) => {
-            const operation = op as OpenAPI.Operation
-            const operationName = getSectionId([
-              tag.name,
-              operation.operationId,
-            ])
-            const url = getUrl(area, operationName)
-            results.push({
-              url,
-              lastModified: new Date(),
-            })
-          })
-        })
-      }) || []
-    )
+      }
+    }
   }
 
   return results
diff --git a/www/apps/api-reference/app/base-specs/route.ts b/www/apps/api-reference/app/base-specs/route.ts
index b0942e5820293..c9d4b0e46cbd0 100644
--- a/www/apps/api-reference/app/base-specs/route.ts
+++ b/www/apps/api-reference/app/base-specs/route.ts
@@ -3,6 +3,8 @@ import path from "path"
 import OpenAPIParser from "@readme/openapi-parser"
 import getPathsOfTag from "@/utils/get-paths-of-tag"
 import type { OpenAPI } from "types"
+import { workerCompatibleFetch } from "docs-utils"
+import { parse as parseYaml } from "yaml"
 
 export async function GET(request: Request) {
   const { searchParams } = new URL(request.url)
@@ -19,9 +21,24 @@ export async function GET(request: Request) {
       }
     )
   }
-  const baseSpecs = (await OpenAPIParser.parse(
-    path.join(process.cwd(), "specs", area, "openapi.yaml")
-  )) as OpenAPI.ExpandedDocument
+  const r2Base = process.env.SPECS_R2_BASE_URL
+  const specPath = r2Base
+    ? `${r2Base}/specs/${area}/openapi.yaml`
+    : path.join(process.cwd(), "specs", area, "openapi.yaml")
+  const baseSpecs = await workerCompatibleFetch<OpenAPI.ExpandedDocument>({
+    url: specPath,
+    responseTransformer: async (res) => {
+      if (!res.ok) {
+        throw new Error(`Failed to fetch spec: ${specPath} (${res.status})`)
+      }
+      const text = await res.text()
+      return (await parseYaml(text)) as OpenAPI.ExpandedDocument
+    },
+    fallbackAction: async () => {
+      // In local development, we can read the spec directly from the filesystem
+      return (await OpenAPIParser.parse(specPath)) as OpenAPI.ExpandedDocument
+    },
+  })
 
   if (expand) {
     const paths = await getPathsOfTag(expand, area)
diff --git a/www/apps/api-reference/app/download/[area]/route.ts b/www/apps/api-reference/app/download/[area]/route.ts
index 282e0d23812a4..2af5b5057229a 100644
--- a/www/apps/api-reference/app/download/[area]/route.ts
+++ b/www/apps/api-reference/app/download/[area]/route.ts
@@ -1,6 +1,6 @@
-import { existsSync, readFileSync } from "fs"
-import { NextResponse } from "next/server"
 import path from "path"
+import { workerCompatibleFetch } from "docs-utils"
+import { getPathForEnv } from "../../../utils/get-path-for-env"
 
 type DownloadParams = {
   params: Promise<{
@@ -14,32 +14,37 @@ export async function GET(request: Request, props: DownloadParams) {
   const { searchParams } = new URL(request.url)
   const version = searchParams.get("version")
 
-  const defaultPath = path.join(
-    process.cwd(),
-    "specs",
-    area,
-    "openapi.full.yaml"
-  )
-  const versionedPath = version
-    ? path.join(
-        process.cwd(),
-        "specs",
-        "versions",
-        version,
-        area,
-        "openapi.full.yaml"
-      )
+  const r2Base = process.env.SPECS_R2_BASE_URL
+  const basePath = r2Base
+    ? `${r2Base}/specs`
+    : path.join(process.cwd(), "specs")
+
+  // Try versioned path first, fall back to default
+  const defaultUrl = getPathForEnv(basePath, area, "openapi.full.yaml")
+  const versionedUrl = version
+    ? getPathForEnv(basePath, "versions", version, area, "openapi.full.yaml")
     : null
-  const filePath =
-    versionedPath && existsSync(versionedPath) ? versionedPath : defaultPath
 
-  if (!existsSync(filePath)) {
-    return new NextResponse(null, {
-      status: 404,
-    })
-  }
+  const fileContent: string = await workerCompatibleFetch<string>({
+    url: versionedUrl || defaultUrl,
+    responseTransformer: async (res) => {
+      if (!res.ok) {
+        throw new Error(`Failed to fetch spec: ${res.status}`)
+      }
+      return await res.text()
+    },
+    fallbackAction: async () => {
+      // In local development, we can read the spec directly from the filesystem
+      const { readFileSync, existsSync } = await import("fs")
 
-  const fileContent = readFileSync(filePath)
+      const filePath =
+        versionedUrl && existsSync(versionedUrl) ? versionedUrl : defaultUrl
+      if (!existsSync(filePath)) {
+        throw new Error(`Spec file not found: ${filePath}`)
+      }
+      return readFileSync(filePath, "utf-8")
+    },
+  })
 
   return new Response(fileContent, {
     headers: {
diff --git a/www/apps/api-reference/app/schema/route.ts b/www/apps/api-reference/app/schema/route.ts
index 77ff9027e1875..79c800803f31a 100644
--- a/www/apps/api-reference/app/schema/route.ts
+++ b/www/apps/api-reference/app/schema/route.ts
@@ -1,7 +1,6 @@
 import { NextResponse } from "next/server"
-import path from "path"
-import { existsSync } from "fs"
 import getSchemaContent from "../../utils/get-schema-content"
+import { getPathForEnv } from "../../utils/get-path-for-env"
 
 export async function GET(request: Request) {
   const { searchParams } = new URL(request.url)
@@ -36,38 +35,40 @@ export async function GET(request: Request) {
     .replace("#/components/schemas/", "")
     .replaceAll("./components/schemas/", "")
 
-  const baseSchemasPath = path.join(
-    process.cwd(),
+  const r2Base = process.env.SPECS_R2_BASE_URL
+
+  const baseSchemasUrl = getPathForEnv(
+    r2Base || process.cwd(),
     "specs",
     area,
     "components",
     "schemas"
   )
-  const schemaPath = path.join(baseSchemasPath, name)
+  const schemaUrl = getPathForEnv(baseSchemasUrl, name)
+
+  try {
+    const { dereferencedDocument, originalSchema: schema } =
+      await getSchemaContent(schemaUrl, baseSchemasUrl)
 
-  if (!existsSync(schemaPath)) {
+    return NextResponse.json(
+      {
+        schema: dereferencedDocument.components?.schemas
+          ? Object.values(dereferencedDocument.components?.schemas)[0]
+          : schema,
+      },
+      {
+        status: 200,
+      }
+    )
+  } catch (error) {
     return NextResponse.json(
       {
         success: false,
-        message: `Schema ${name} doesn't exist.`,
+        message: `Failed to fetch schema: ${error}`,
       },
       {
-        status: 404,
+        status: 500,
       }
     )
   }
-
-  const { dereferencedDocument, originalSchema: schema } =
-    await getSchemaContent(schemaPath, baseSchemasPath)
-
-  return NextResponse.json(
-    {
-      schema: dereferencedDocument.components?.schemas
-        ? Object.values(dereferencedDocument.components?.schemas)[0]
-        : schema,
-    },
-    {
-      status: 200,
-    }
-  )
 }
diff --git a/www/apps/api-reference/app/tag/route.ts b/www/apps/api-reference/app/tag/route.ts
index 7c4afd5125900..ccaa6029454a6 100644
--- a/www/apps/api-reference/app/tag/route.ts
+++ b/www/apps/api-reference/app/tag/route.ts
@@ -1,5 +1,4 @@
 import { NextResponse } from "next/server"
-import path from "path"
 import getPathsOfTag from "@/utils/get-paths-of-tag"
 
 export async function GET(request: Request) {
@@ -19,9 +18,6 @@ export async function GET(request: Request) {
     )
   }
 
-  // this is just to ensure that vercel picks up these files on build
-  path.join(process.cwd(), "specs")
-
   // get path files
   const paths = await getPathsOfTag(tagName, area)
 
diff --git a/www/apps/api-reference/generated/generated-admin-sidebar.mjs b/www/apps/api-reference/generated/generated-admin-sidebar.mjs
index 7eee4a235fa46..927ea75715a93 100644
--- a/www/apps/api-reference/generated/generated-admin-sidebar.mjs
+++ b/www/apps/api-reference/generated/generated-admin-sidebar.mjs
@@ -621,6 +621,24 @@ const generatedgeneratedAdminSidebarSidebar = {
       "loaded": false,
       "showLoadingIfEmpty": true
     },
+    {
+      "type": "category",
+      "title": "Property Labels",
+      "children": [
+        {
+          "type": "link",
+          "path": "property-labels_propertylabel_schema",
+          "title": "PropertyLabel Object",
+          "loaded": true,
+          "badge": {
+            "variant": "neutral",
+            "text": "Schema"
+          }
+        }
+      ],
+      "loaded": false,
+      "showLoadingIfEmpty": true
+    },
     {
       "type": "category",
       "title": "Refund Reasons",
diff --git a/www/apps/api-reference/generated/specs-sitemap-data.mjs b/www/apps/api-reference/generated/specs-sitemap-data.mjs
new file mode 100644
index 0000000000000..b81e68f9ef082
--- /dev/null
+++ b/www/apps/api-reference/generated/specs-sitemap-data.mjs
@@ -0,0 +1,825 @@
+export const specsSitemapData = {
+  "admin": [
+    {
+      "tagSectionId": "api-keys",
+      "operationSectionIds": [
+        "api-keys_getapikeys",
+        "api-keys_postapikeys",
+        "api-keys_getapikeysid",
+        "api-keys_postapikeysid",
+        "api-keys_deleteapikeysid",
+        "api-keys_postapikeysidrevoke",
+        "api-keys_postapikeysidsaleschannels"
+      ]
+    },
+    {
+      "tagSectionId": "auth",
+      "operationSectionIds": [
+        "auth_postsession",
+        "auth_deletesession",
+        "auth_postadminauthtokenrefresh",
+        "auth_postactor_typeauth_provider",
+        "auth_postactor_typeauth_providercallback",
+        "auth_postactor_typeauth_provider_register",
+        "auth_postactor_typeauth_providerresetpassword",
+        "auth_postactor_typeauth_providerupdate"
+      ]
+    },
+    {
+      "tagSectionId": "campaigns",
+      "operationSectionIds": [
+        "campaigns_getcampaigns",
+        "campaigns_postcampaigns",
+        "campaigns_getcampaignsid",
+        "campaigns_postcampaignsid",
+        "campaigns_deletecampaignsid",
+        "campaigns_postcampaignsidpromotions"
+      ]
+    },
+    {
+      "tagSectionId": "claims",
+      "operationSectionIds": [
+        "claims_getclaimsid",
+        "claims_postclaimsidcancel",
+        "claims_postclaimsidinbounditems",
+        "claims_getclaims",
+        "claims_postclaims",
+        "claims_postclaimsidinboundshippingmethod",
+        "claims_postclaimsidclaimitemsaction_id",
+        "claims_deleteclaimsidclaimitemsaction_id",
+        "claims_postclaimsidclaimitems",
+        "claims_postclaimsidoutbounditems",
+        "claims_postclaimsidinbounditemsaction_id",
+        "claims_deleteclaimsidinbounditemsaction_id",
+        "claims_postclaimsidinboundshippingmethodaction_id",
+        "claims_deleteclaimsidinboundshippingmethodaction_id",
+        "claims_postclaimsidoutbounditemsaction_id",
+        "claims_deleteclaimsidoutbounditemsaction_id",
+        "claims_postclaimsidoutboundshippingmethod",
+        "claims_postclaimsidoutboundshippingmethodaction_id",
+        "claims_deleteclaimsidoutboundshippingmethodaction_id",
+        "claims_postclaimsidrequest",
+        "claims_deleteclaimsidrequest"
+      ]
+    },
+    {
+      "tagSectionId": "collections",
+      "operationSectionIds": [
+        "collections_getcollections",
+        "collections_postcollections",
+        "collections_getcollectionsid",
+        "collections_postcollectionsid",
+        "collections_deletecollectionsid",
+        "collections_postcollectionsidproducts"
+      ]
+    },
+    {
+      "tagSectionId": "currencies",
+      "operationSectionIds": [
+        "currencies_getcurrenciescode",
+        "currencies_getcurrencies"
+      ]
+    },
+    {
+      "tagSectionId": "customer-groups",
+      "operationSectionIds": [
+        "customer-groups_getcustomergroups",
+        "customer-groups_postcustomergroups",
+        "customer-groups_getcustomergroupsid",
+        "customer-groups_postcustomergroupsid",
+        "customer-groups_deletecustomergroupsid",
+        "customer-groups_postcustomergroupsidcustomers"
+      ]
+    },
+    {
+      "tagSectionId": "customers",
+      "operationSectionIds": [
+        "customers_getcustomersid",
+        "customers_postcustomersid",
+        "customers_deletecustomersid",
+        "customers_getcustomers",
+        "customers_postcustomers",
+        "customers_getcustomersidaddresses",
+        "customers_postcustomersidaddresses",
+        "customers_postcustomersidcustomergroups",
+        "customers_getcustomersidaddressesaddress_id",
+        "customers_postcustomersidaddressesaddress_id",
+        "customers_deletecustomersidaddressesaddress_id"
+      ]
+    },
+    {
+      "tagSectionId": "draft-orders",
+      "operationSectionIds": [
+        "draft-orders_getdraftorders",
+        "draft-orders_postdraftorders",
+        "draft-orders_getdraftordersid",
+        "draft-orders_postdraftordersid",
+        "draft-orders_deletedraftordersid",
+        "draft-orders_postdraftordersidedititemsitemitem_id",
+        "draft-orders_postdraftordersidedititems",
+        "draft-orders_postdraftordersidconverttoorder",
+        "draft-orders_postdraftordersidedit",
+        "draft-orders_deletedraftordersidedit",
+        "draft-orders_postdraftordersideditpromotions",
+        "draft-orders_deletedraftordersideditpromotions",
+        "draft-orders_postdraftordersideditrequest",
+        "draft-orders_postdraftordersideditshippingmethodsmethodmethod_id",
+        "draft-orders_deletedraftordersideditshippingmethodsmethodmethod_id",
+        "draft-orders_postdraftordersideditshippingmethodsaction_id",
+        "draft-orders_deletedraftordersideditshippingmethodsaction_id",
+        "draft-orders_postdraftordersidedititemsaction_id",
+        "draft-orders_deletedraftordersidedititemsaction_id",
+        "draft-orders_postdraftordersideditshippingmethods",
+        "draft-orders_postdraftordersideditconfirm"
+      ]
+    },
+    {
+      "tagSectionId": "exchanges",
+      "operationSectionIds": [
+        "exchanges_getexchanges",
+        "exchanges_postexchanges",
+        "exchanges_getexchangesid",
+        "exchanges_postexchangesidinbounditems",
+        "exchanges_postexchangesidcancel",
+        "exchanges_postexchangesidinbounditemsaction_id",
+        "exchanges_deleteexchangesidinbounditemsaction_id",
+        "exchanges_postexchangesidinboundshippingmethodaction_id",
+        "exchanges_deleteexchangesidinboundshippingmethodaction_id",
+        "exchanges_postexchangesidoutbounditemsaction_id",
+        "exchanges_deleteexchangesidoutbounditemsaction_id",
+        "exchanges_postexchangesidoutbounditems",
+        "exchanges_postexchangesidrequest",
+        "exchanges_deleteexchangesidrequest",
+        "exchanges_postexchangesidoutboundshippingmethod",
+        "exchanges_postexchangesidinboundshippingmethod",
+        "exchanges_postexchangesidoutboundshippingmethodaction_id",
+        "exchanges_deleteexchangesidoutboundshippingmethodaction_id"
+      ]
+    },
+    {
+      "tagSectionId": "feature-flags",
+      "operationSectionIds": [
+        "feature-flags_getfeatureflags"
+      ]
+    },
+    {
+      "tagSectionId": "fulfillment-providers",
+      "operationSectionIds": [
+        "fulfillment-providers_getfulfillmentproviders",
+        "fulfillment-providers_getfulfillmentprovidersidoptions"
+      ]
+    },
+    {
+      "tagSectionId": "fulfillment-sets",
+      "operationSectionIds": [
+        "fulfillment-sets_deletefulfillmentsetsid",
+        "fulfillment-sets_postfulfillmentsetsidservicezones",
+        "fulfillment-sets_getfulfillmentsetsidservicezoneszone_id",
+        "fulfillment-sets_postfulfillmentsetsidservicezoneszone_id",
+        "fulfillment-sets_deletefulfillmentsetsidservicezoneszone_id"
+      ]
+    },
+    {
+      "tagSectionId": "fulfillments",
+      "operationSectionIds": [
+        "fulfillments_postfulfillments",
+        "fulfillments_postfulfillmentsidcancel",
+        "fulfillments_postfulfillmentsidshipment"
+      ]
+    },
+    {
+      "tagSectionId": "gift-cards",
+      "operationSectionIds": [
+        "gift-cards_getgiftcards",
+        "gift-cards_postgiftcards",
+        "gift-cards_getgiftcardsid",
+        "gift-cards_postgiftcardsid",
+        "gift-cards_getgiftcardsidorders"
+      ]
+    },
+    {
+      "tagSectionId": "index",
+      "operationSectionIds": [
+        "index_getindexdetails",
+        "index_postindexsync"
+      ]
+    },
+    {
+      "tagSectionId": "inventory-items",
+      "operationSectionIds": [
+        "inventory-items_postinventoryitemslocationlevelsbatch",
+        "inventory-items_getinventoryitems",
+        "inventory-items_postinventoryitems",
+        "inventory-items_postinventoryitemsidlocationlevelsbatch",
+        "inventory-items_getinventoryitemsid",
+        "inventory-items_postinventoryitemsid",
+        "inventory-items_deleteinventoryitemsid",
+        "inventory-items_getinventoryitemsidlocationlevels",
+        "inventory-items_postinventoryitemsidlocationlevels",
+        "inventory-items_postinventoryitemsidlocationlevelslocation_id",
+        "inventory-items_deleteinventoryitemsidlocationlevelslocation_id"
+      ]
+    },
+    {
+      "tagSectionId": "invites",
+      "operationSectionIds": [
+        "invites_getinvitesid",
+        "invites_deleteinvitesid",
+        "invites_postinvitesidresend",
+        "invites_postinvitesaccept",
+        "invites_getinvites",
+        "invites_postinvites"
+      ]
+    },
+    {
+      "tagSectionId": "locales",
+      "operationSectionIds": [
+        "locales_getlocales",
+        "locales_getlocalescode"
+      ]
+    },
+    {
+      "tagSectionId": "notifications",
+      "operationSectionIds": [
+        "notifications_getnotificationsid",
+        "notifications_getnotifications"
+      ]
+    },
+    {
+      "tagSectionId": "order-changes",
+      "operationSectionIds": [
+        "order-changes_postorderchangesid"
+      ]
+    },
+    {
+      "tagSectionId": "order-edits",
+      "operationSectionIds": [
+        "order-edits_postorderedits",
+        "order-edits_deleteordereditsid",
+        "order-edits_postordereditsiditems",
+        "order-edits_postordereditsidconfirm",
+        "order-edits_postordereditsiditemsitemitem_id",
+        "order-edits_postordereditsidrequest",
+        "order-edits_postordereditsidshippingmethodaction_id",
+        "order-edits_deleteordereditsidshippingmethodaction_id",
+        "order-edits_postordereditsidshippingmethod",
+        "order-edits_postordereditsiditemsaction_id",
+        "order-edits_deleteordereditsiditemsaction_id"
+      ]
+    },
+    {
+      "tagSectionId": "orders",
+      "operationSectionIds": [
+        "orders_getordersid",
+        "orders_postordersid",
+        "orders_postordersidcancel",
+        "orders_postordersidarchive",
+        "orders_postordersidcomplete",
+        "orders_postordersidfulfillmentsfulfillment_idcancel",
+        "orders_postordersidcreditlines",
+        "orders_getorders",
+        "orders_postordersidfulfillmentsfulfillment_idmarkasdelivered",
+        "orders_getordersidchanges",
+        "orders_getordersidlineitems",
+        "orders_getordersidpreview",
+        "orders_postordersidtransfer",
+        "orders_postordersidfulfillmentsfulfillment_idshipments",
+        "orders_getordersidshippingoptions",
+        "orders_postordersexport",
+        "orders_postordersidtransfercancel",
+        "orders_postordersidfulfillments"
+      ]
+    },
+    {
+      "tagSectionId": "payment-collections",
+      "operationSectionIds": [
+        "payment-collections_deletepaymentcollectionsid",
+        "payment-collections_postpaymentcollections",
+        "payment-collections_postpaymentcollectionsidmarkaspaid",
+        "payment-collections_postpaymentcollectionsidpaymentsessions"
+      ]
+    },
+    {
+      "tagSectionId": "payments",
+      "operationSectionIds": [
+        "payments_getpaymentspaymentproviders",
+        "payments_getpaymentsid",
+        "payments_postpaymentsidcapture",
+        "payments_postpaymentsidrefund",
+        "payments_getpayments"
+      ]
+    },
+    {
+      "tagSectionId": "plugins",
+      "operationSectionIds": [
+        "plugins_getplugins"
+      ]
+    },
+    {
+      "tagSectionId": "price-lists",
+      "operationSectionIds": [
+        "price-lists_getpricelistsid",
+        "price-lists_postpricelistsid",
+        "price-lists_deletepricelistsid",
+        "price-lists_getpricelists",
+        "price-lists_postpricelists",
+        "price-lists_getpricelistsidprices",
+        "price-lists_postpricelistsidproducts",
+        "price-lists_postpricelistsidpricesbatch"
+      ]
+    },
+    {
+      "tagSectionId": "price-preferences",
+      "operationSectionIds": [
+        "price-preferences_getpricepreferencesid",
+        "price-preferences_postpricepreferencesid",
+        "price-preferences_deletepricepreferencesid",
+        "price-preferences_getpricepreferences",
+        "price-preferences_postpricepreferences"
+      ]
+    },
+    {
+      "tagSectionId": "product-categories",
+      "operationSectionIds": [
+        "product-categories_postproductcategoriesidproducts",
+        "product-categories_getproductcategories",
+        "product-categories_postproductcategories",
+        "product-categories_getproductcategoriesid",
+        "product-categories_postproductcategoriesid",
+        "product-categories_deleteproductcategoriesid"
+      ]
+    },
+    {
+      "tagSectionId": "product-tags",
+      "operationSectionIds": [
+        "product-tags_getproducttagsid",
+        "product-tags_postproducttagsid",
+        "product-tags_deleteproducttagsid",
+        "product-tags_getproducttags",
+        "product-tags_postproducttags"
+      ]
+    },
+    {
+      "tagSectionId": "product-types",
+      "operationSectionIds": [
+        "product-types_getproducttypesid",
+        "product-types_postproducttypesid",
+        "product-types_deleteproducttypesid",
+        "product-types_getproducttypes",
+        "product-types_postproducttypes"
+      ]
+    },
+    {
+      "tagSectionId": "product-variants",
+      "operationSectionIds": [
+        "product-variants_getproductvariants"
+      ]
+    },
+    {
+      "tagSectionId": "products",
+      "operationSectionIds": [
+        "products_postproductsimport",
+        "products_getproductsid",
+        "products_postproductsid",
+        "products_deleteproductsid",
+        "products_getproducts",
+        "products_postproducts",
+        "products_postproductsbatch",
+        "products_postproductsimportstransaction_idconfirm",
+        "products_postproductsimports",
+        "products_postproductsidimagesimage_idvariantsbatch",
+        "products_getproductsidoptionsoption_id",
+        "products_postproductsidoptionsoption_id",
+        "products_deleteproductsidoptionsoption_id",
+        "products_postproductsexport",
+        "products_postproductsidvariantsbatch",
+        "products_getproductsidoptions",
+        "products_postproductsidoptions",
+        "products_getproductsidvariantsvariant_id",
+        "products_postproductsidvariantsvariant_id",
+        "products_deleteproductsidvariantsvariant_id",
+        "products_postproductsidvariantsinventoryitemsbatch",
+        "products_postproductsidvariantsvariant_idinventoryitems",
+        "products_postproductsidvariantsvariant_idimagesbatch",
+        "products_postproductsidvariantsvariant_idinventoryitemsinventory_item_id",
+        "products_deleteproductsidvariantsvariant_idinventoryitemsinventory_item_id",
+        "products_getproductsidvariants",
+        "products_postproductsidvariants",
+        "products_postproductsimporttransaction_idconfirm"
+      ]
+    },
+    {
+      "tagSectionId": "promotions",
+      "operationSectionIds": [
+        "promotions_getpromotionsruleattributeoptionsrule_type",
+        "promotions_getpromotionsrulevalueoptionsrule_typerule_attribute_id",
+        "promotions_postpromotionsidbuyrulesbatch",
+        "promotions_postpromotionsidtargetrulesbatch",
+        "promotions_getpromotionsid",
+        "promotions_postpromotionsid",
+        "promotions_deletepromotionsid",
+        "promotions_getpromotionsidrule_type",
+        "promotions_getpromotions",
+        "promotions_postpromotions",
+        "promotions_postpromotionsidrulesbatch"
+      ]
+    },
+    {
+      "tagSectionId": "property-labels",
+      "operationSectionIds": [
+        "property-labels_getpropertylabelsid",
+        "property-labels_postpropertylabelsid",
+        "property-labels_deletepropertylabelsid",
+        "property-labels_postpropertylabelsbatch",
+        "property-labels_getpropertylabels",
+        "property-labels_postpropertylabels"
+      ]
+    },
+    {
+      "tagSectionId": "refund-reasons",
+      "operationSectionIds": [
+        "refund-reasons_getrefundreasonsid",
+        "refund-reasons_postrefundreasonsid",
+        "refund-reasons_deleterefundreasonsid",
+        "refund-reasons_getrefundreasons",
+        "refund-reasons_postrefundreasons"
+      ]
+    },
+    {
+      "tagSectionId": "regions",
+      "operationSectionIds": [
+        "regions_getregions",
+        "regions_postregions",
+        "regions_getregionsid",
+        "regions_postregionsid",
+        "regions_deleteregionsid"
+      ]
+    },
+    {
+      "tagSectionId": "reservations",
+      "operationSectionIds": [
+        "reservations_getreservationsid",
+        "reservations_postreservationsid",
+        "reservations_deletereservationsid",
+        "reservations_getreservations",
+        "reservations_postreservations"
+      ]
+    },
+    {
+      "tagSectionId": "return-reasons",
+      "operationSectionIds": [
+        "return-reasons_getreturnreasonsid",
+        "return-reasons_postreturnreasonsid",
+        "return-reasons_deletereturnreasonsid",
+        "return-reasons_getreturnreasons",
+        "return-reasons_postreturnreasons"
+      ]
+    },
+    {
+      "tagSectionId": "returns",
+      "operationSectionIds": [
+        "returns_getreturnsid",
+        "returns_postreturnsid",
+        "returns_postreturnsiddismissitems",
+        "returns_postreturnsidcancel",
+        "returns_postreturnsidreceiveitems",
+        "returns_postreturnsidreceive",
+        "returns_deletereturnsidreceive",
+        "returns_postreturnsidreceiveconfirm",
+        "returns_postreturnsiddismissitemsaction_id",
+        "returns_deletereturnsiddismissitemsaction_id",
+        "returns_postreturnsidrequestitems",
+        "returns_postreturnsidreceiveitemsaction_id",
+        "returns_deletereturnsidreceiveitemsaction_id",
+        "returns_postreturnsidshippingmethod",
+        "returns_postreturnsidrequest",
+        "returns_deletereturnsidrequest",
+        "returns_getreturns",
+        "returns_postreturns",
+        "returns_postreturnsidrequestitemsaction_id",
+        "returns_deletereturnsidrequestitemsaction_id",
+        "returns_postreturnsidshippingmethodaction_id",
+        "returns_deletereturnsidshippingmethodaction_id"
+      ]
+    },
+    {
+      "tagSectionId": "sales-channels",
+      "operationSectionIds": [
+        "sales-channels_postsaleschannelsidproducts",
+        "sales-channels_getsaleschannelsid",
+        "sales-channels_postsaleschannelsid",
+        "sales-channels_deletesaleschannelsid",
+        "sales-channels_getsaleschannels",
+        "sales-channels_postsaleschannels"
+      ]
+    },
+    {
+      "tagSectionId": "shipping-option-types",
+      "operationSectionIds": [
+        "shipping-option-types_getshippingoptiontypesid",
+        "shipping-option-types_postshippingoptiontypesid",
+        "shipping-option-types_deleteshippingoptiontypesid",
+        "shipping-option-types_getshippingoptiontypes",
+        "shipping-option-types_postshippingoptiontypes"
+      ]
+    },
+    {
+      "tagSectionId": "shipping-options",
+      "operationSectionIds": [
+        "shipping-options_getshippingoptions",
+        "shipping-options_postshippingoptions",
+        "shipping-options_postshippingoptionsidrulesbatch",
+        "shipping-options_getshippingoptionsid",
+        "shipping-options_postshippingoptionsid",
+        "shipping-options_deleteshippingoptionsid"
+      ]
+    },
+    {
+      "tagSectionId": "shipping-profiles",
+      "operationSectionIds": [
+        "shipping-profiles_getshippingprofiles",
+        "shipping-profiles_postshippingprofiles",
+        "shipping-profiles_getshippingprofilesid",
+        "shipping-profiles_postshippingprofilesid",
+        "shipping-profiles_deleteshippingprofilesid"
+      ]
+    },
+    {
+      "tagSectionId": "stock-locations",
+      "operationSectionIds": [
+        "stock-locations_getstocklocations",
+        "stock-locations_poststocklocations",
+        "stock-locations_getstocklocationsid",
+        "stock-locations_poststocklocationsid",
+        "stock-locations_deletestocklocationsid",
+        "stock-locations_poststocklocationsidfulfillmentproviders",
+        "stock-locations_poststocklocationsidsaleschannels",
+        "stock-locations_poststocklocationsidfulfillmentsets"
+      ]
+    },
+    {
+      "tagSectionId": "store-credit-accounts",
+      "operationSectionIds": [
+        "store-credit-accounts_getstorecreditaccountsid",
+        "store-credit-accounts_getstorecreditaccounts",
+        "store-credit-accounts_poststorecreditaccounts",
+        "store-credit-accounts_poststorecreditaccountsidcredit",
+        "store-credit-accounts_getstorecreditaccountsidtransactions"
+      ]
+    },
+    {
+      "tagSectionId": "stores",
+      "operationSectionIds": [
+        "stores_getstoresid",
+        "stores_poststoresid",
+        "stores_getstores"
+      ]
+    },
+    {
+      "tagSectionId": "tax-providers",
+      "operationSectionIds": [
+        "tax-providers_gettaxproviders"
+      ]
+    },
+    {
+      "tagSectionId": "tax-rates",
+      "operationSectionIds": [
+        "tax-rates_gettaxrates",
+        "tax-rates_posttaxrates",
+        "tax-rates_posttaxratesidrules",
+        "tax-rates_gettaxratesid",
+        "tax-rates_posttaxratesid",
+        "tax-rates_deletetaxratesid",
+        "tax-rates_deletetaxratesidrulesrule_id"
+      ]
+    },
+    {
+      "tagSectionId": "tax-regions",
+      "operationSectionIds": [
+        "tax-regions_gettaxregions",
+        "tax-regions_posttaxregions",
+        "tax-regions_gettaxregionsid",
+        "tax-regions_posttaxregionsid",
+        "tax-regions_deletetaxregionsid"
+      ]
+    },
+    {
+      "tagSectionId": "translations",
+      "operationSectionIds": [
+        "translations_gettranslations",
+        "translations_gettranslationsentities",
+        "translations_posttranslationsbatch",
+        "translations_gettranslationssettings",
+        "translations_gettranslationsstatistics",
+        "translations_posttranslationssettingsbatch"
+      ]
+    },
+    {
+      "tagSectionId": "uploads",
+      "operationSectionIds": [
+        "uploads_postuploads",
+        "uploads_postuploadspresignedurls",
+        "uploads_getuploadsid",
+        "uploads_deleteuploadsid"
+      ]
+    },
+    {
+      "tagSectionId": "users",
+      "operationSectionIds": [
+        "users_getusersme",
+        "users_getusersid",
+        "users_postusersid",
+        "users_deleteusersid",
+        "users_getusers"
+      ]
+    },
+    {
+      "tagSectionId": "views",
+      "operationSectionIds": [
+        "views_getviewsentitycolumns",
+        "views_getviewsentityconfigurationsactive",
+        "views_postviewsentityconfigurationsactive",
+        "views_getviewsentityconfigurationsid",
+        "views_postviewsentityconfigurationsid",
+        "views_deleteviewsentityconfigurationsid",
+        "views_getviewsentities",
+        "views_getviewsentityconfigurations",
+        "views_postviewsentityconfigurations"
+      ]
+    },
+    {
+      "tagSectionId": "workflows-executions",
+      "operationSectionIds": [
+        "workflows-executions_getworkflowsexecutionsid",
+        "workflows-executions_postworkflowsexecutionsworkflow_idstepsfailure",
+        "workflows-executions_postworkflowsexecutionsworkflow_idrun",
+        "workflows-executions_getworkflowsexecutionsworkflow_idsubscribe",
+        "workflows-executions_postworkflowsexecutionsworkflow_idstepssuccess",
+        "workflows-executions_getworkflowsexecutions",
+        "workflows-executions_getworkflowsexecutionsworkflow_idtransaction_id",
+        "workflows-executions_getworkflowsexecutionsworkflow_idtransaction_idsubscribe"
+      ]
+    }
+  ],
+  "store": [
+    {
+      "tagSectionId": "auth",
+      "operationSectionIds": [
+        "auth_postactor_typeauth_provider",
+        "auth_postactor_typeauth_providercallback",
+        "auth_postactor_typeauth_providerresetpassword",
+        "auth_postsession",
+        "auth_deletesession",
+        "auth_postactor_typeauth_provider_register",
+        "auth_postadminauthtokenrefresh",
+        "auth_postactor_typeauth_providerupdate"
+      ]
+    },
+    {
+      "tagSectionId": "carts",
+      "operationSectionIds": [
+        "carts_postcarts",
+        "carts_postcartsidgiftcards",
+        "carts_deletecartsidgiftcards",
+        "carts_postcartsidcomplete",
+        "carts_postcartsidlineitems",
+        "carts_postcartsidpromotions",
+        "carts_deletecartsidpromotions",
+        "carts_postcartsidstorecredits",
+        "carts_postcartsidshippingmethods",
+        "carts_postcartsidlineitemsline_id",
+        "carts_deletecartsidlineitemsline_id",
+        "carts_getcartsid",
+        "carts_postcartsid",
+        "carts_postcartsidtaxes",
+        "carts_postcartsidcustomer"
+      ]
+    },
+    {
+      "tagSectionId": "collections",
+      "operationSectionIds": [
+        "collections_getcollectionsid",
+        "collections_getcollections"
+      ]
+    },
+    {
+      "tagSectionId": "currencies",
+      "operationSectionIds": [
+        "currencies_getcurrencies",
+        "currencies_getcurrenciescode"
+      ]
+    },
+    {
+      "tagSectionId": "customers",
+      "operationSectionIds": [
+        "customers_postcustomers",
+        "customers_getcustomersme",
+        "customers_postcustomersme",
+        "customers_getcustomersmeaddresses",
+        "customers_postcustomersmeaddresses",
+        "customers_getcustomersmeaddressesaddress_id",
+        "customers_postcustomersmeaddressesaddress_id",
+        "customers_deletecustomersmeaddressesaddress_id"
+      ]
+    },
+    {
+      "tagSectionId": "gift-cards",
+      "operationSectionIds": [
+        "gift-cards_getgiftcardsidorcode"
+      ]
+    },
+    {
+      "tagSectionId": "locales",
+      "operationSectionIds": [
+        "locales_getlocales"
+      ]
+    },
+    {
+      "tagSectionId": "orders",
+      "operationSectionIds": [
+        "orders_getordersid",
+        "orders_getorders",
+        "orders_postordersidtransferaccept",
+        "orders_postordersidtransfercancel",
+        "orders_postordersidtransferdecline",
+        "orders_postordersidtransferrequest"
+      ]
+    },
+    {
+      "tagSectionId": "payment-collections",
+      "operationSectionIds": [
+        "payment-collections_postpaymentcollections",
+        "payment-collections_postpaymentcollectionsidpaymentsessions"
+      ]
+    },
+    {
+      "tagSectionId": "payment-providers",
+      "operationSectionIds": [
+        "payment-providers_getpaymentproviders"
+      ]
+    },
+    {
+      "tagSectionId": "product-categories",
+      "operationSectionIds": [
+        "product-categories_getproductcategoriesid",
+        "product-categories_getproductcategories"
+      ]
+    },
+    {
+      "tagSectionId": "product-tags",
+      "operationSectionIds": [
+        "product-tags_getproducttagsid",
+        "product-tags_getproducttags"
+      ]
+    },
+    {
+      "tagSectionId": "product-types",
+      "operationSectionIds": [
+        "product-types_getproducttypesid",
+        "product-types_getproducttypes"
+      ]
+    },
+    {
+      "tagSectionId": "products",
+      "operationSectionIds": [
+        "products_getproducts",
+        "products_getproductsid"
+      ]
+    },
+    {
+      "tagSectionId": "regions",
+      "operationSectionIds": [
+        "regions_getregionsid",
+        "regions_getregions"
+      ]
+    },
+    {
+      "tagSectionId": "return-reasons",
+      "operationSectionIds": [
+        "return-reasons_getreturnreasonsid",
+        "return-reasons_getreturnreasons"
+      ]
+    },
+    {
+      "tagSectionId": "returns",
+      "operationSectionIds": [
+        "returns_postreturns"
+      ]
+    },
+    {
+      "tagSectionId": "shipping-options",
+      "operationSectionIds": [
+        "shipping-options_postshippingoptionsidcalculate",
+        "shipping-options_getshippingoptions"
+      ]
+    },
+    {
+      "tagSectionId": "store-credit-accounts",
+      "operationSectionIds": [
+        "store-credit-accounts_getstorecreditaccountsid",
+        "store-credit-accounts_getstorecreditaccounts",
+        "store-credit-accounts_poststorecreditaccountsclaim"
+      ]
+    }
+  ]
+}
diff --git a/www/apps/api-reference/generated/specs-tag-index.mjs b/www/apps/api-reference/generated/specs-tag-index.mjs
new file mode 100644
index 0000000000000..67aec8c1e7205
--- /dev/null
+++ b/www/apps/api-reference/generated/specs-tag-index.mjs
@@ -0,0 +1,459 @@
+export const specsTagIndex = {
+  "admin": {
+    "api-keys": [
+      "admin_api-keys.yaml",
+      "admin_api-keys_{id}.yaml",
+      "admin_api-keys_{id}_revoke.yaml",
+      "admin_api-keys_{id}_sales-channels.yaml"
+    ],
+    "campaigns": [
+      "admin_campaigns.yaml",
+      "admin_campaigns_{id}.yaml",
+      "admin_campaigns_{id}_promotions.yaml"
+    ],
+    "claims": [
+      "admin_claims_{id}.yaml",
+      "admin_claims_{id}_cancel.yaml",
+      "admin_claims_{id}_inbound_items.yaml",
+      "admin_claims.yaml",
+      "admin_claims_{id}_inbound_shipping-method.yaml",
+      "admin_claims_{id}_claim-items_{action_id}.yaml",
+      "admin_claims_{id}_claim-items.yaml",
+      "admin_claims_{id}_outbound_items.yaml",
+      "admin_claims_{id}_inbound_items_{action_id}.yaml",
+      "admin_claims_{id}_inbound_shipping-method_{action_id}.yaml",
+      "admin_claims_{id}_outbound_items_{action_id}.yaml",
+      "admin_claims_{id}_outbound_shipping-method.yaml",
+      "admin_claims_{id}_outbound_shipping-method_{action_id}.yaml",
+      "admin_claims_{id}_request.yaml"
+    ],
+    "currencies": [
+      "admin_currencies_{code}.yaml",
+      "admin_currencies.yaml"
+    ],
+    "customer-groups": [
+      "admin_customer-groups.yaml",
+      "admin_customer-groups_{id}.yaml",
+      "admin_customer-groups_{id}_customers.yaml"
+    ],
+    "collections": [
+      "admin_collections.yaml",
+      "admin_collections_{id}.yaml",
+      "admin_collections_{id}_products.yaml"
+    ],
+    "customers": [
+      "admin_customers_{id}.yaml",
+      "admin_customers.yaml",
+      "admin_customers_{id}_addresses.yaml",
+      "admin_customers_{id}_customer-groups.yaml",
+      "admin_customers_{id}_addresses_{address_id}.yaml"
+    ],
+    "draft-orders": [
+      "admin_draft-orders.yaml",
+      "admin_draft-orders_{id}.yaml",
+      "admin_draft-orders_{id}_edit_items_item_{item_id}.yaml",
+      "admin_draft-orders_{id}_edit_items.yaml",
+      "admin_draft-orders_{id}_convert-to-order.yaml",
+      "admin_draft-orders_{id}_edit.yaml",
+      "admin_draft-orders_{id}_edit_promotions.yaml",
+      "admin_draft-orders_{id}_edit_request.yaml",
+      "admin_draft-orders_{id}_edit_shipping-methods_method_{method_id}.yaml",
+      "admin_draft-orders_{id}_edit_shipping-methods_{action_id}.yaml",
+      "admin_draft-orders_{id}_edit_items_{action_id}.yaml",
+      "admin_draft-orders_{id}_edit_shipping-methods.yaml",
+      "admin_draft-orders_{id}_edit_confirm.yaml"
+    ],
+    "exchanges": [
+      "admin_exchanges.yaml",
+      "admin_exchanges_{id}.yaml",
+      "admin_exchanges_{id}_inbound_items.yaml",
+      "admin_exchanges_{id}_cancel.yaml",
+      "admin_exchanges_{id}_inbound_items_{action_id}.yaml",
+      "admin_exchanges_{id}_inbound_shipping-method_{action_id}.yaml",
+      "admin_exchanges_{id}_outbound_items_{action_id}.yaml",
+      "admin_exchanges_{id}_outbound_items.yaml",
+      "admin_exchanges_{id}_request.yaml",
+      "admin_exchanges_{id}_outbound_shipping-method.yaml",
+      "admin_exchanges_{id}_inbound_shipping-method.yaml",
+      "admin_exchanges_{id}_outbound_shipping-method_{action_id}.yaml"
+    ],
+    "fulfillment-sets": [
+      "admin_fulfillment-sets_{id}.yaml",
+      "admin_fulfillment-sets_{id}_service-zones.yaml",
+      "admin_fulfillment-sets_{id}_service-zones_{zone_id}.yaml"
+    ],
+    "fulfillments": [
+      "admin_fulfillments.yaml",
+      "admin_fulfillments_{id}_cancel.yaml",
+      "admin_fulfillments_{id}_shipment.yaml"
+    ],
+    "fulfillment-providers": [
+      "admin_fulfillment-providers.yaml",
+      "admin_fulfillment-providers_{id}_options.yaml"
+    ],
+    "feature-flags": [
+      "admin_feature-flags.yaml"
+    ],
+    "index": [
+      "admin_index_details.yaml",
+      "admin_index_sync.yaml"
+    ],
+    "gift-cards": [
+      "admin_gift-cards.yaml",
+      "admin_gift-cards_{id}.yaml",
+      "admin_gift-cards_{id}_orders.yaml"
+    ],
+    "inventory-items": [
+      "admin_inventory-items_location-levels_batch.yaml",
+      "admin_inventory-items.yaml",
+      "admin_inventory-items_{id}_location-levels_batch.yaml",
+      "admin_inventory-items_{id}.yaml",
+      "admin_inventory-items_{id}_location-levels.yaml",
+      "admin_inventory-items_{id}_location-levels_{location_id}.yaml"
+    ],
+    "invites": [
+      "admin_invites_{id}.yaml",
+      "admin_invites_{id}_resend.yaml",
+      "admin_invites_accept.yaml",
+      "admin_invites.yaml"
+    ],
+    "locales": [
+      "admin_locales.yaml",
+      "admin_locales_{code}.yaml"
+    ],
+    "notifications": [
+      "admin_notifications_{id}.yaml",
+      "admin_notifications.yaml"
+    ],
+    "order-edits": [
+      "admin_order-edits.yaml",
+      "admin_order-edits_{id}.yaml",
+      "admin_order-edits_{id}_items.yaml",
+      "admin_order-edits_{id}_confirm.yaml",
+      "admin_order-edits_{id}_items_item_{item_id}.yaml",
+      "admin_order-edits_{id}_request.yaml",
+      "admin_order-edits_{id}_shipping-method_{action_id}.yaml",
+      "admin_order-edits_{id}_shipping-method.yaml",
+      "admin_order-edits_{id}_items_{action_id}.yaml"
+    ],
+    "order-changes": [
+      "admin_order-changes_{id}.yaml"
+    ],
+    "orders": [
+      "admin_orders_{id}.yaml",
+      "admin_orders_{id}_cancel.yaml",
+      "admin_orders_{id}_archive.yaml",
+      "admin_orders_{id}_complete.yaml",
+      "admin_orders_{id}_fulfillments_{fulfillment_id}_cancel.yaml",
+      "admin_orders_{id}_credit-lines.yaml",
+      "admin_orders.yaml",
+      "admin_orders_{id}_fulfillments_{fulfillment_id}_mark-as-delivered.yaml",
+      "admin_orders_{id}_changes.yaml",
+      "admin_orders_{id}_line-items.yaml",
+      "admin_orders_{id}_preview.yaml",
+      "admin_orders_{id}_transfer.yaml",
+      "admin_orders_{id}_fulfillments_{fulfillment_id}_shipments.yaml",
+      "admin_orders_{id}_shipping-options.yaml",
+      "admin_orders_export.yaml",
+      "admin_orders_{id}_transfer_cancel.yaml",
+      "admin_orders_{id}_fulfillments.yaml"
+    ],
+    "payment-collections": [
+      "admin_payment-collections_{id}.yaml",
+      "admin_payment-collections.yaml",
+      "admin_payment-collections_{id}_mark-as-paid.yaml",
+      "admin_payment-collections_{id}_payment-sessions.yaml"
+    ],
+    "payments": [
+      "admin_payments_payment-providers.yaml",
+      "admin_payments_{id}.yaml",
+      "admin_payments_{id}_capture.yaml",
+      "admin_payments_{id}_refund.yaml",
+      "admin_payments.yaml"
+    ],
+    "price-lists": [
+      "admin_price-lists_{id}.yaml",
+      "admin_price-lists.yaml",
+      "admin_price-lists_{id}_prices.yaml",
+      "admin_price-lists_{id}_products.yaml",
+      "admin_price-lists_{id}_prices_batch.yaml"
+    ],
+    "plugins": [
+      "admin_plugins.yaml"
+    ],
+    "price-preferences": [
+      "admin_price-preferences_{id}.yaml",
+      "admin_price-preferences.yaml"
+    ],
+    "product-tags": [
+      "admin_product-tags_{id}.yaml",
+      "admin_product-tags.yaml"
+    ],
+    "product-categories": [
+      "admin_product-categories_{id}_products.yaml",
+      "admin_product-categories.yaml",
+      "admin_product-categories_{id}.yaml"
+    ],
+    "product-types": [
+      "admin_product-types_{id}.yaml",
+      "admin_product-types.yaml"
+    ],
+    "product-variants": [
+      "admin_product-variants.yaml"
+    ],
+    "products": [
+      "admin_products_import.yaml",
+      "admin_products_{id}.yaml",
+      "admin_products.yaml",
+      "admin_products_batch.yaml",
+      "admin_products_imports_{transaction_id}_confirm.yaml",
+      "admin_products_imports.yaml",
+      "admin_products_{id}_images_{image_id}_variants_batch.yaml",
+      "admin_products_{id}_options_{option_id}.yaml",
+      "admin_products_export.yaml",
+      "admin_products_{id}_variants_batch.yaml",
+      "admin_products_{id}_options.yaml",
+      "admin_products_{id}_variants_{variant_id}.yaml",
+      "admin_products_{id}_variants_inventory-items_batch.yaml",
+      "admin_products_{id}_variants_{variant_id}_inventory-items.yaml",
+      "admin_products_{id}_variants_{variant_id}_images_batch.yaml",
+      "admin_products_{id}_variants_{variant_id}_inventory-items_{inventory_item_id}.yaml",
+      "admin_products_{id}_variants.yaml",
+      "admin_products_import_{transaction_id}_confirm.yaml"
+    ],
+    "promotions": [
+      "admin_promotions_rule-attribute-options_{rule_type}.yaml",
+      "admin_promotions_rule-value-options_{rule_type}_{rule_attribute_id}.yaml",
+      "admin_promotions_{id}_buy-rules_batch.yaml",
+      "admin_promotions_{id}_target-rules_batch.yaml",
+      "admin_promotions_{id}.yaml",
+      "admin_promotions_{id}_{rule_type}.yaml",
+      "admin_promotions.yaml",
+      "admin_promotions_{id}_rules_batch.yaml"
+    ],
+    "property-labels": [
+      "admin_property-labels_{id}.yaml",
+      "admin_property-labels_batch.yaml",
+      "admin_property-labels.yaml"
+    ],
+    "refund-reasons": [
+      "admin_refund-reasons_{id}.yaml",
+      "admin_refund-reasons.yaml"
+    ],
+    "regions": [
+      "admin_regions.yaml",
+      "admin_regions_{id}.yaml"
+    ],
+    "reservations": [
+      "admin_reservations_{id}.yaml",
+      "admin_reservations.yaml"
+    ],
+    "return-reasons": [
+      "admin_return-reasons_{id}.yaml",
+      "admin_return-reasons.yaml"
+    ],
+    "returns": [
+      "admin_returns_{id}.yaml",
+      "admin_returns_{id}_dismiss-items.yaml",
+      "admin_returns_{id}_cancel.yaml",
+      "admin_returns_{id}_receive-items.yaml",
+      "admin_returns_{id}_receive.yaml",
+      "admin_returns_{id}_receive_confirm.yaml",
+      "admin_returns_{id}_dismiss-items_{action_id}.yaml",
+      "admin_returns_{id}_request-items.yaml",
+      "admin_returns_{id}_receive-items_{action_id}.yaml",
+      "admin_returns_{id}_shipping-method.yaml",
+      "admin_returns_{id}_request.yaml",
+      "admin_returns.yaml",
+      "admin_returns_{id}_request-items_{action_id}.yaml",
+      "admin_returns_{id}_shipping-method_{action_id}.yaml"
+    ],
+    "sales-channels": [
+      "admin_sales-channels_{id}_products.yaml",
+      "admin_sales-channels_{id}.yaml",
+      "admin_sales-channels.yaml"
+    ],
+    "shipping-options": [
+      "admin_shipping-options.yaml",
+      "admin_shipping-options_{id}_rules_batch.yaml",
+      "admin_shipping-options_{id}.yaml"
+    ],
+    "shipping-option-types": [
+      "admin_shipping-option-types_{id}.yaml",
+      "admin_shipping-option-types.yaml"
+    ],
+    "shipping-profiles": [
+      "admin_shipping-profiles.yaml",
+      "admin_shipping-profiles_{id}.yaml"
+    ],
+    "stock-locations": [
+      "admin_stock-locations.yaml",
+      "admin_stock-locations_{id}.yaml",
+      "admin_stock-locations_{id}_fulfillment-providers.yaml",
+      "admin_stock-locations_{id}_sales-channels.yaml",
+      "admin_stock-locations_{id}_fulfillment-sets.yaml"
+    ],
+    "store-credit-accounts": [
+      "admin_store-credit-accounts_{id}.yaml",
+      "admin_store-credit-accounts.yaml",
+      "admin_store-credit-accounts_{id}_credit.yaml",
+      "admin_store-credit-accounts_{id}_transactions.yaml"
+    ],
+    "tax-rates": [
+      "admin_tax-rates.yaml",
+      "admin_tax-rates_{id}_rules.yaml",
+      "admin_tax-rates_{id}.yaml",
+      "admin_tax-rates_{id}_rules_{rule_id}.yaml"
+    ],
+    "tax-providers": [
+      "admin_tax-providers.yaml"
+    ],
+    "stores": [
+      "admin_stores_{id}.yaml",
+      "admin_stores.yaml"
+    ],
+    "tax-regions": [
+      "admin_tax-regions.yaml",
+      "admin_tax-regions_{id}.yaml"
+    ],
+    "translations": [
+      "admin_translations.yaml",
+      "admin_translations_entities.yaml",
+      "admin_translations_batch.yaml",
+      "admin_translations_settings.yaml",
+      "admin_translations_statistics.yaml",
+      "admin_translations_settings_batch.yaml"
+    ],
+    "uploads": [
+      "admin_uploads.yaml",
+      "admin_uploads_presigned-urls.yaml",
+      "admin_uploads_{id}.yaml"
+    ],
+    "users": [
+      "admin_users_me.yaml",
+      "admin_users_{id}.yaml",
+      "admin_users.yaml"
+    ],
+    "views": [
+      "admin_views_{entity}_columns.yaml",
+      "admin_views_{entity}_configurations_active.yaml",
+      "admin_views_{entity}_configurations_{id}.yaml",
+      "admin_views_entities.yaml",
+      "admin_views_{entity}_configurations.yaml"
+    ],
+    "workflows-executions": [
+      "admin_workflows-executions_{id}.yaml",
+      "admin_workflows-executions_{workflow_id}_steps_failure.yaml",
+      "admin_workflows-executions_{workflow_id}_run.yaml",
+      "admin_workflows-executions_{workflow_id}_subscribe.yaml",
+      "admin_workflows-executions_{workflow_id}_steps_success.yaml",
+      "admin_workflows-executions.yaml",
+      "admin_workflows-executions_{workflow_id}_{transaction_id}.yaml",
+      "admin_workflows-executions_{workflow_id}_{transaction_id}_subscribe.yaml"
+    ],
+    "auth": [
+      "auth_session.yaml",
+      "auth_token_refresh.yaml",
+      "auth_user_{auth_provider}.yaml",
+      "auth_user_{auth_provider}_callback.yaml",
+      "auth_user_{auth_provider}_register.yaml",
+      "auth_user_{auth_provider}_reset-password.yaml",
+      "auth_user_{auth_provider}_update.yaml"
+    ]
+  },
+  "store": {
+    "auth": [
+      "auth_customer_{auth_provider}.yaml",
+      "auth_customer_{auth_provider}_callback.yaml",
+      "auth_customer_{auth_provider}_reset-password.yaml",
+      "auth_session.yaml",
+      "auth_customer_{auth_provider}_register.yaml",
+      "auth_token_refresh.yaml",
+      "auth_customer_{auth_provider}_update.yaml"
+    ],
+    "carts": [
+      "store_carts.yaml",
+      "store_carts_{id}_gift-cards.yaml",
+      "store_carts_{id}_complete.yaml",
+      "store_carts_{id}_line-items.yaml",
+      "store_carts_{id}_promotions.yaml",
+      "store_carts_{id}_store-credits.yaml",
+      "store_carts_{id}_shipping-methods.yaml",
+      "store_carts_{id}_line-items_{line_id}.yaml",
+      "store_carts_{id}.yaml",
+      "store_carts_{id}_taxes.yaml",
+      "store_carts_{id}_customer.yaml"
+    ],
+    "currencies": [
+      "store_currencies.yaml",
+      "store_currencies_{code}.yaml"
+    ],
+    "collections": [
+      "store_collections_{id}.yaml",
+      "store_collections.yaml"
+    ],
+    "customers": [
+      "store_customers.yaml",
+      "store_customers_me.yaml",
+      "store_customers_me_addresses.yaml",
+      "store_customers_me_addresses_{address_id}.yaml"
+    ],
+    "gift-cards": [
+      "store_gift-cards_{idOrCode}.yaml"
+    ],
+    "orders": [
+      "store_orders_{id}.yaml",
+      "store_orders.yaml",
+      "store_orders_{id}_transfer_accept.yaml",
+      "store_orders_{id}_transfer_cancel.yaml",
+      "store_orders_{id}_transfer_decline.yaml",
+      "store_orders_{id}_transfer_request.yaml"
+    ],
+    "locales": [
+      "store_locales.yaml"
+    ],
+    "payment-collections": [
+      "store_payment-collections.yaml",
+      "store_payment-collections_{id}_payment-sessions.yaml"
+    ],
+    "payment-providers": [
+      "store_payment-providers.yaml"
+    ],
+    "product-tags": [
+      "store_product-tags_{id}.yaml",
+      "store_product-tags.yaml"
+    ],
+    "product-categories": [
+      "store_product-categories_{id}.yaml",
+      "store_product-categories.yaml"
+    ],
+    "product-types": [
+      "store_product-types_{id}.yaml",
+      "store_product-types.yaml"
+    ],
+    "products": [
+      "store_products.yaml",
+      "store_products_{id}.yaml"
+    ],
+    "regions": [
+      "store_regions_{id}.yaml",
+      "store_regions.yaml"
+    ],
+    "returns": [
+      "store_returns.yaml"
+    ],
+    "return-reasons": [
+      "store_return-reasons_{id}.yaml",
+      "store_return-reasons.yaml"
+    ],
+    "shipping-options": [
+      "store_shipping-options_{id}_calculate.yaml",
+      "store_shipping-options.yaml"
+    ],
+    "store-credit-accounts": [
+      "store_store-credit-accounts_{id}.yaml",
+      "store_store-credit-accounts.yaml",
+      "store_store-credit-accounts_claim.yaml"
+    ]
+  }
+}
diff --git a/www/apps/api-reference/next.config.mjs b/www/apps/api-reference/next.config.mjs
index 96337d5877f7c..f03f165043300 100644
--- a/www/apps/api-reference/next.config.mjs
+++ b/www/apps/api-reference/next.config.mjs
@@ -15,6 +15,13 @@ const nextConfig = {
   // Configure `pageExtensions` to include MDX files
   pageExtensions: ["js", "jsx", "mdx", "ts", "tsx"],
   basePath: process.env.NEXT_PUBLIC_BASE_PATH || "/api",
+  outputFileTracingRoot: new URL("../../", import.meta.url).pathname,
+  outputFileTracingExcludes: {
+    "*": [
+      "../**/.open-next/**",
+      "../!(api-reference)/.next/**",
+    ],
+  },
   webpack: (config) => {
     config.ignoreWarnings = [{ module: /node_modules\/keyv\/src\/index\.js/ }]
 
@@ -91,7 +98,8 @@ const withMDX = createMDX({
           },
           useBaseUrl:
             process.env.NODE_ENV === "production" ||
-            process.env.VERCEL_ENV === "production",
+            process.env.VERCEL_ENV === "production" ||
+            !!process.env.CLOUDFLARE_ENV,
         },
       ],
       [
diff --git a/www/apps/api-reference/open-next.config.ts b/www/apps/api-reference/open-next.config.ts
new file mode 100644
index 0000000000000..136ed5f038c45
--- /dev/null
+++ b/www/apps/api-reference/open-next.config.ts
@@ -0,0 +1,3 @@
+import { defineCloudflareConfig } from "@opennextjs/cloudflare"
+
+export default defineCloudflareConfig()
diff --git a/www/apps/api-reference/package.json b/www/apps/api-reference/package.json
index 5a68a4ccbc21a..ba76be3b03af1 100644
--- a/www/apps/api-reference/package.json
+++ b/www/apps/api-reference/package.json
@@ -4,22 +4,29 @@
   "private": true,
   "scripts": {
     "dev": "NODE_OPTIONS='--inspect' next dev",
+    "dev:wrangler": "wrangler dev --port 3000",
     "dev:monorepo": "yarn dev -p 3000",
     "build": "next build",
+    "build:cloudflare": "node ./scripts/prepare.mjs && opennextjs-cloudflare build",
     "build:dev": "NODE_ENV=test next build",
     "build:prod": "NEXT_PUBLIC_ENV=production next build",
     "start": "next start",
     "start:monorepo": "yarn start -p 3000",
     "lint": "next lint --fix",
     "prep": "node ./scripts/prepare.mjs",
-    "test": "vitest"
+    "upload:r2": "node ./scripts/upload-specs-to-r2.mjs",
+    "test": "vitest",
+    "preview": "yarn build:cloudflare && opennextjs-cloudflare preview",
+    "deploy": "opennextjs-cloudflare deploy",
+    "upload": "opennextjs-cloudflare upload",
+    "cf-typegen": "wrangler types --env-interface CloudflareEnv cloudflare-env.d.ts"
   },
   "dependencies": {
     "@mdx-js/loader": "^3.1.0",
     "@mdx-js/react": "^3.1.0",
     "@medusajs/icons": "2.15.1",
     "@medusajs/ui": "4.1.11",
-    "@next/mdx": "15.3.9",
+    "@next/mdx": "15.5.18",
     "@react-hook/resize-observer": "^2.0.2",
     "@readme/openapi-parser": "^2.5.0",
     "algoliasearch": "4",
@@ -30,7 +37,7 @@
     "jsdom": "^27.1.0",
     "json-schema": "^0.4.0",
     "json-stringify-pretty-compact": "^4.0.0",
-    "next": "15.3.9",
+    "next": "15.5.18",
     "next-mdx-remote": "5.0.0",
     "openapi-sampler": "^1.3.1",
     "pluralize": "^8.0.0",
@@ -53,7 +60,9 @@
     "yaml": "^2.3.1"
   },
   "devDependencies": {
-    "@next/bundle-analyzer": "15.3.9",
+    "@aws-sdk/client-s3": "^3",
+    "@next/bundle-analyzer": "15.5.18",
+    "@opennextjs/cloudflare": "1.19.9",
     "@types/jsdom": "^27.0.0",
     "@types/mapbox__rehype-prism": "^0.8.0",
     "@types/mdx": "^2.0.13",
@@ -65,9 +74,11 @@
     "eslint": "^9.13.0",
     "eslint-plugin-prettier": "^5.2.1",
     "eslint-plugin-react-hooks": "^5.0.0",
+    "mime-types": "^3",
     "types": "*",
     "vite-tsconfig-paths": "^5.1.4",
-    "vitest": "^2.1.8"
+    "vitest": "^2.1.8",
+    "wrangler": "^4.90.0"
   },
   "engines": {
     "node": ">=20"
diff --git a/www/apps/api-reference/public/_headers b/www/apps/api-reference/public/_headers
new file mode 100644
index 0000000000000..3b460e68fd44e
--- /dev/null
+++ b/www/apps/api-reference/public/_headers
@@ -0,0 +1,2 @@
+/_next/static/*
+  Cache-Control: public,max-age=31536000,immutable
diff --git a/www/apps/api-reference/scripts/generate-specs-manifest.mjs b/www/apps/api-reference/scripts/generate-specs-manifest.mjs
new file mode 100644
index 0000000000000..23660c2aaff1a
--- /dev/null
+++ b/www/apps/api-reference/scripts/generate-specs-manifest.mjs
@@ -0,0 +1,105 @@
+import { promises as fs } from "fs"
+import path from "path"
+import { fileURLToPath } from "url"
+import { parse as parseYaml } from "yaml"
+import { getSectionId } from "docs-utils"
+
+const __dirname = path.dirname(fileURLToPath(import.meta.url))
+const appDir = path.join(__dirname, "..")
+
+const HTTP_METHODS = [
+  "get",
+  "post",
+  "put",
+  "patch",
+  "delete",
+  "head",
+  "options",
+]
+
+export async function generateSpecsPathsManifest() {
+  const tagIndex = {}
+  // operationsByTag[area][tagName] = [operationId, ...]  (tagName = original, not slugified)
+  const operationsByTag = {}
+
+  for (const area of ["admin", "store"]) {
+    const pathsDir = path.join(appDir, "specs", area, "paths")
+    let files = []
+    try {
+      const allFiles = await fs.readdir(pathsDir)
+      files = allFiles.filter((f) => f.endsWith(".yaml"))
+    } catch {
+      // paths dir doesn't exist yet
+    }
+    tagIndex[area] = {}
+    operationsByTag[area] = {}
+
+    await Promise.all(
+      files.map(async (file) => {
+        const filePath = path.join(pathsDir, file)
+        try {
+          const content = await fs.readFile(filePath, "utf-8")
+          const parsed = parseYaml(content)
+          for (const method of HTTP_METHODS) {
+            const operation = parsed?.[method]
+            if (!operation?.tags) {
+              continue
+            }
+            for (const tag of operation.tags) {
+              const sectionId = getSectionId([tag])
+              if (!tagIndex[area][sectionId]) {
+                tagIndex[area][sectionId] = []
+              }
+              if (!tagIndex[area][sectionId].includes(file)) {
+                tagIndex[area][sectionId].push(file)
+              }
+              if (!operationsByTag[area][tag]) {
+                operationsByTag[area][tag] = []
+              }
+              if (operation.operationId) {
+                operationsByTag[area][tag].push(operation.operationId)
+              }
+            }
+          }
+        } catch {
+          // skip unreadable files
+        }
+      })
+    )
+  }
+
+  // Build sitemap data: ordered by openapi.yaml tags, with precomputed section IDs
+  const sitemapData = {}
+  for (const area of ["admin", "store"]) {
+    const specPath = path.join(appDir, "specs", area, "openapi.yaml")
+    let orderedTags = []
+    try {
+      const specContent = await fs.readFile(specPath, "utf-8")
+      const spec = parseYaml(specContent)
+      orderedTags = spec.tags ?? []
+    } catch {
+      // fall back to whatever tags we found in path files
+      orderedTags = Object.keys(operationsByTag[area]).map((name) => ({ name }))
+    }
+
+    sitemapData[area] = orderedTags.map((tag) => ({
+      tagSectionId: getSectionId([tag.name]),
+      operationSectionIds: (operationsByTag[area][tag.name] ?? []).map((opId) =>
+        getSectionId([tag.name, opId])
+      ),
+    }))
+  }
+
+  const generatedDir = path.join(appDir, "generated")
+  await fs.mkdir(generatedDir, { recursive: true })
+
+  await fs.writeFile(
+    path.join(generatedDir, "specs-tag-index.mjs"),
+    `export const specsTagIndex = ${JSON.stringify(tagIndex, null, 2)}\n`
+  )
+
+  await fs.writeFile(
+    path.join(generatedDir, "specs-sitemap-data.mjs"),
+    `export const specsSitemapData = ${JSON.stringify(sitemapData, null, 2)}\n`
+  )
+}
diff --git a/www/apps/api-reference/scripts/index-algolia.mjs b/www/apps/api-reference/scripts/index-algolia.mjs
new file mode 100644
index 0000000000000..9713414d5151a
--- /dev/null
+++ b/www/apps/api-reference/scripts/index-algolia.mjs
@@ -0,0 +1,169 @@
+/* eslint-disable no-console */
+import OpenAPIParser from "@readme/openapi-parser"
+import algoliasearch from "algoliasearch"
+import { JSDOM } from "jsdom"
+import path from "path"
+import { fileURLToPath } from "url"
+import slugify from "slugify"
+
+const __dirname = path.dirname(fileURLToPath(import.meta.url))
+const appDir = path.resolve(__dirname, "..")
+
+const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || ""
+const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "/api"
+
+function getUrl(area, tagName) {
+  const anchor = tagName ? `#${tagName}` : ""
+  return `${baseUrl}${basePath}/${area}${anchor}`
+}
+
+function getSectionId(parts) {
+  return parts
+    .map((p) => slugify(p.trim().toLowerCase()))
+    .join("_")
+}
+
+function capitalize(str) {
+  return str.charAt(0).toUpperCase() + str.slice(1)
+}
+
+function getObjectId(area, objectName) {
+  return `${area}_${objectName}`
+}
+
+function getHierarchy(area, levels) {
+  const hierarchy = { lvl0: `${capitalize(area)} API Reference` }
+  levels.forEach((level, i) => {
+    hierarchy[`lvl${i + 1}`] = level
+  })
+  return hierarchy
+}
+
+async function main() {
+  const algoliaClient = algoliasearch(
+    process.env.NEXT_PUBLIC_ALGOLIA_APP_ID || "",
+    process.env.ALGOLIA_WRITE_API_KEY || ""
+  )
+  const index = algoliaClient.initIndex(
+    process.env.NEXT_PUBLIC_API_ALGOLIA_INDEX_NAME || ""
+  )
+
+  /**
+   * @type {Record<string, any>[]}
+   */
+  const indices = []
+
+  for (const area of ["store", "admin"]) {
+    const defaultIndexData = {
+      version: ["current"],
+      lang: "en",
+      _tags: ["api", `${area}-v2`],
+    }
+
+    // Index static MDX section headers from the live page
+    const pageUrl = getUrl(area)
+    console.log(`Scraping page headers from ${pageUrl}...`)
+    try {
+      const dom = await JSDOM.fromURL(pageUrl)
+      const headers = dom.window.document.querySelectorAll("h2")
+      headers.forEach((header) => {
+        if (!header.textContent || !header.nextSibling?.textContent) {
+          return
+        }
+        const normalizedHeaderContent = header.textContent.replaceAll("#", "")
+        const description = header.nextSibling?.textContent
+        const objectID = getSectionId([normalizedHeaderContent])
+        const url = getUrl(area, objectID)
+        indices.push({
+          objectID: getObjectId(area, `${objectID}-mdx-section`),
+          hierarchy: getHierarchy(area, [normalizedHeaderContent]),
+          type: "content",
+          content: description || "",
+          url,
+          url_without_variables: url,
+          url_without_anchor: url,
+          ...defaultIndexData,
+        })
+      })
+    } catch (e) {
+      console.warn(`Failed to scrape ${pageUrl}: ${e.message}`)
+    }
+
+    // Parse OpenAPI spec and index tags + operations
+    const specPath = path.join(appDir, `specs/${area}/openapi.full.yaml`)
+    console.log(`Parsing spec at ${specPath}...`)
+    const baseSpecs = await OpenAPIParser.parse(specPath)
+
+    baseSpecs.tags?.forEach((tag) => {
+      const tagName = getSectionId([tag.name])
+      const url = getUrl(area, tagName)
+      indices.push({
+        objectID: getObjectId(area, tagName),
+        hierarchy: getHierarchy(area, [tag.name]),
+        type: "lvl1",
+        content: null,
+        description: tag.description,
+        url,
+        url_without_variables: url,
+        url_without_anchor: url,
+        ...defaultIndexData,
+      })
+    })
+
+    Object.values(baseSpecs.paths).forEach((pathItem) => {
+      Object.values(pathItem).forEach((operation) => {
+        const tag = operation.tags?.[0]
+        const operationName = getSectionId([tag || "", operation.operationId])
+        const url = getUrl(area, operationName)
+
+        indices.push({
+          objectID: getObjectId(area, operationName),
+          hierarchy: getHierarchy(area, [operation.summary]),
+          type: "content",
+          content: operation.summary,
+          content_camel: operation.summary,
+          url,
+          url_without_variables: url,
+          url_without_anchor: url,
+          ...defaultIndexData,
+        })
+
+        if (operation.description) {
+          const operationDescriptionId = getSectionId([
+            tag || "",
+            operation.operationId,
+            operation.description.substring(
+              0,
+              Math.min(20, operation.description.length)
+            ),
+          ])
+          indices.push({
+            objectID: getObjectId(area, operationDescriptionId),
+            hierarchy: getHierarchy(area, [
+              operation.summary,
+              operation.description,
+            ]),
+            type: "content",
+            content: operation.description,
+            content_camel: operation.description,
+            url,
+            url_without_variables: url,
+            url_without_anchor: url,
+            ...defaultIndexData,
+          })
+        }
+      })
+    })
+  }
+
+  console.log(`Saving ${indices.length} records to Algolia...`)
+  if (indices.length) {
+    await index.saveObjects(indices, { autoGenerateObjectIDIfNotExist: true })
+  }
+  console.log("Done.")
+}
+
+main().catch((err) => {
+  console.error(err)
+  process.exit(1)
+})
diff --git a/www/apps/api-reference/scripts/prepare.mjs b/www/apps/api-reference/scripts/prepare.mjs
index 9d6f496faffb4..8ad4583756248 100644
--- a/www/apps/api-reference/scripts/prepare.mjs
+++ b/www/apps/api-reference/scripts/prepare.mjs
@@ -1,6 +1,8 @@
 import { generateSplitSidebars } from "build-scripts"
+import { generateSpecsPathsManifest } from "./generate-specs-manifest.mjs"
 
 async function main() {
+  await generateSpecsPathsManifest()
   await generateSplitSidebars({
     sidebars: [
       {
diff --git a/www/apps/api-reference/scripts/upload-specs-to-r2.mjs b/www/apps/api-reference/scripts/upload-specs-to-r2.mjs
new file mode 100644
index 0000000000000..eff4088e79c22
--- /dev/null
+++ b/www/apps/api-reference/scripts/upload-specs-to-r2.mjs
@@ -0,0 +1,136 @@
+/* eslint-disable no-console */
+/**
+ * Uploads specs/ to Cloudflare R2.
+ *
+ * Usage:
+ *   node ./scripts/upload-specs-to-r2.mjs
+ *     Full upload of specs/ directory.
+ *
+ *   node ./scripts/upload-specs-to-r2.mjs --upload specs/admin/paths/foo.yaml specs/store/paths/bar.yaml
+ *     Upload only the listed files (paths relative to app root).
+ *
+ *   node ./scripts/upload-specs-to-r2.mjs --remove specs/admin/paths/old.yaml
+ *     Remove the listed keys from R2 (paths relative to app root).
+ *
+ *   --upload and --remove can be combined in a single invocation.
+ *
+ * Required env vars:
+ *   CLOUDFLARE_ACCOUNT_ID
+ *   CLOUDFLARE_R2_ACCESS_KEY_ID
+ *   CLOUDFLARE_R2_SECRET_ACCESS_KEY
+ *   R2_BUCKET_NAME (default: docs-assets)
+ */
+
+// Load .env if present; silently skip if not (e.g. CI injects vars directly)
+try {
+  process.loadEnvFile()
+} catch {
+  /* no .env file */
+}
+
+import {
+  S3Client,
+  PutObjectCommand,
+  DeleteObjectCommand,
+} from "@aws-sdk/client-s3"
+import { readFile, readdir } from "fs/promises"
+import path from "path"
+import { lookup as mimeLookup } from "mime-types"
+
+const accountId = process.env.CLOUDFLARE_ACCOUNT_ID
+const accessKeyId = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID
+const secretAccessKey = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY
+const bucket = process.env.R2_BUCKET_NAME || "docs-assets"
+
+if (!accountId || !accessKeyId || !secretAccessKey) {
+  console.error(
+    "Missing required env vars: CLOUDFLARE_ACCOUNT_ID, CLOUDFLARE_R2_ACCESS_KEY_ID, CLOUDFLARE_R2_SECRET_ACCESS_KEY"
+  )
+  process.exit(1)
+}
+
+const client = new S3Client({
+  region: "auto",
+  endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
+  credentials: { accessKeyId, secretAccessKey },
+})
+
+// Parse --upload and --remove CLI flags
+const args = process.argv.slice(2)
+const filesToUpload = []
+const filesToRemove = []
+let mode = null
+
+for (const arg of args) {
+  if (arg === "--upload") {
+    mode = "upload"
+    continue
+  }
+  if (arg === "--remove") {
+    mode = "remove"
+    continue
+  }
+  if (arg.startsWith("--")) {
+    mode = null
+    continue
+  }
+  if (mode === "upload") {
+    filesToUpload.push(arg)
+  }
+  if (mode === "remove") {
+    filesToRemove.push(arg)
+  }
+}
+
+const isSelective = filesToUpload.length > 0 || filesToRemove.length > 0
+
+async function uploadFile(localPath, r2Key) {
+  const body = await readFile(localPath)
+  const contentType =
+    mimeLookup(path.basename(localPath)) || "application/octet-stream"
+  await client.send(
+    new PutObjectCommand({
+      Bucket: bucket,
+      Key: r2Key,
+      Body: body,
+      ContentType: contentType,
+    })
+  )
+  console.log(`  uploaded: ${r2Key}`)
+}
+
+async function removeFile(r2Key) {
+  await client.send(new DeleteObjectCommand({ Bucket: bucket, Key: r2Key }))
+  console.log(`  removed: ${r2Key}`)
+}
+
+async function uploadDir(localDir, r2Prefix) {
+  const entries = await readdir(localDir, { withFileTypes: true })
+  for (const entry of entries) {
+    const localPath = path.join(localDir, entry.name)
+    const r2Key = `${r2Prefix}/${entry.name}`
+    if (entry.isDirectory()) {
+      await uploadDir(localPath, r2Key)
+    } else if (entry.isFile()) {
+      await uploadFile(localPath, r2Key)
+    }
+  }
+}
+
+if (isSelective) {
+  for (const relPath of filesToUpload) {
+    await uploadFile(
+      path.join(process.cwd(), relPath),
+      `api-reference/${relPath}`
+    )
+  }
+  for (const relPath of filesToRemove) {
+    await removeFile(`api-reference/${relPath}`)
+  }
+} else {
+  const specsDir = path.join(process.cwd(), "specs")
+  console.log(`Uploading ${specsDir} → r2://${bucket}/api-reference/specs`)
+  await uploadDir(specsDir, "api-reference/specs")
+}
+
+console.log("Done.")
diff --git a/www/apps/api-reference/utils/dereference.ts b/www/apps/api-reference/utils/dereference.ts
index 5dcef89b1e8d2..a0788482c65d7 100644
--- a/www/apps/api-reference/utils/dereference.ts
+++ b/www/apps/api-reference/utils/dereference.ts
@@ -1,5 +1,33 @@
 import { OpenAPI } from "types"
 import OpenAPIParser from "@readme/openapi-parser"
+import { workerCompatibleFetch } from "docs-utils"
+
+// @readme/openapi-parser uses Node.js https.get internally, which is not
+// available in Cloudflare Workers. Override the HTTP resolver to use
+// the global fetch() API instead.
+const fetchHttpResolver = {
+  order: 1,
+  canRead: /^https?:\/\//,
+  async read(file: { url: string }) {
+    const res = await workerCompatibleFetch<string>({
+      url: file.url,
+      responseTransformer: async (res) => {
+        if (!res.ok) throw new Error(`Failed to fetch ${file.url}: ${res.status}`)
+        return await res.text()
+      },
+      fallbackAction: async () => {
+        // In local development, we can read the spec directly from the filesystem
+        const { readFileSync, existsSync } = await import("fs")
+
+        if (!existsSync(file.url)) {
+          throw new Error(`Spec file not found: ${file.url}`)
+        }
+        return readFileSync(file.url, "utf-8")
+      },
+    })
+    return res
+  },
+}
 
 type Options = {
   basePath: string
@@ -45,6 +73,9 @@ export default async function dereference({
 
   // resolve references in paths
   document = (await OpenAPIParser.dereference(`${basePath}/`, document, {
+    resolve: {
+      http: fetchHttpResolver,
+    },
     parse: {
       text: {
         // This ensures that all files are parsed as expected
diff --git a/www/apps/api-reference/utils/get-path-for-env.ts b/www/apps/api-reference/utils/get-path-for-env.ts
new file mode 100644
index 0000000000000..e71f308fa70ce
--- /dev/null
+++ b/www/apps/api-reference/utils/get-path-for-env.ts
@@ -0,0 +1,11 @@
+import path from "path"
+
+export function getPathForEnv(...pathSegments: string[]): string {
+  const isCloudflare = !!process.env.SPECS_R2_BASE_URL
+
+  if (isCloudflare) {
+    return pathSegments.join("/")
+  }
+
+  return path.join(...pathSegments)
+}
diff --git a/www/apps/api-reference/utils/get-paths-of-tag.ts b/www/apps/api-reference/utils/get-paths-of-tag.ts
index 23cd7da47dc3b..09636b39d24da 100644
--- a/www/apps/api-reference/utils/get-paths-of-tag.ts
+++ b/www/apps/api-reference/utils/get-paths-of-tag.ts
@@ -1,25 +1,33 @@
 import path from "path"
-import { promises as fs } from "fs"
 import type { OpenAPI } from "types"
 import readSpecDocument from "./read-spec-document"
 import dereference from "./dereference"
 import { unstable_cache } from "next/cache"
-import { getSectionId, oasFileToPath } from "docs-utils"
+import { oasFileToPath } from "docs-utils"
+import { specsTagIndex } from "@/generated/specs-tag-index.mjs"
+import { getPathForEnv } from "./get-path-for-env"
 
 async function getPathsOfTag_(
   tagName: string,
-  area: string
+  area: "admin" | "store"
 ): Promise<OpenAPI.Document> {
-  // get path files
-  const basePath = path.join(process.cwd(), "specs", `${area}/paths`)
-
-  const files = await fs.readdir(basePath)
+  const r2Base = process.env.SPECS_R2_BASE_URL
+  const areaIndex = (specsTagIndex[area] ?? {}) as Record<string, string[]>
+  const files: string[] = areaIndex[tagName] ?? []
+
+  const basePath = getPathForEnv(
+    r2Base || process.cwd(),
+    "specs",
+    area,
+    "paths"
+  )
 
-  // read the path documents
-  let documents: OpenAPI.ParsedPathItemObject[] = await Promise.all(
+  const documents: OpenAPI.ParsedPathItemObject[] = await Promise.all(
     files.map(async (file) => {
+      const filePath = getPathForEnv(basePath, file)
+
       const fileContent = (await readSpecDocument(
-        path.join(basePath, file)
+        filePath
       )) as OpenAPI.OpenAPIV3.PathItemObject<OpenAPI.Operation>
 
       return {
@@ -29,17 +37,6 @@ async function getPathsOfTag_(
     })
   )
 
-  // filter out operations not related to the passed tag
-  documents = documents.filter((document) =>
-    Object.values(document).some((operation) => {
-      if (typeof operation !== "object" || !("tags" in operation)) {
-        return false
-      }
-
-      return operation.tags?.some((tag) => getSectionId([tag]) === tagName)
-    })
-  )
-
   return dereference({
     basePath,
     paths: documents,
@@ -47,7 +44,8 @@ async function getPathsOfTag_(
 }
 
 const getPathsOfTag = unstable_cache(
-  async (tagName: string, area: string) => getPathsOfTag_(tagName, area),
+  async (tagName: string, area: "admin" | "store") =>
+    getPathsOfTag_(tagName, area),
   ["tag-paths"],
   {
     revalidate: 3600,
diff --git a/www/apps/api-reference/utils/get-schema-content.ts b/www/apps/api-reference/utils/get-schema-content.ts
index 620d811f4d0ca..f9c44df6e2f04 100644
--- a/www/apps/api-reference/utils/get-schema-content.ts
+++ b/www/apps/api-reference/utils/get-schema-content.ts
@@ -1,16 +1,31 @@
-import { promises as fs } from "fs"
 import { parseDocument } from "yaml"
 import { OpenAPI } from "types"
 import dereference from "./dereference"
 import { unstable_cache } from "next/cache"
+import { workerCompatibleFetch } from "docs-utils"
 
-async function getSchemaContent_(schemaPath: string, baseSchemasPath: string) {
-  const schemaContent = await fs.readFile(schemaPath, "utf-8")
+async function getSchemaContent_(schemaUrl: string, baseSchemasUrl: string) {
+  const schemaContent = await workerCompatibleFetch<string>({
+    url: schemaUrl,
+    responseTransformer: async (res) => {
+      if (!res.ok) throw new Error(`Failed to fetch schema: ${schemaUrl} (${res.status})`)
+      return await res.text()
+    },
+    fallbackAction: async () => {
+      // In local development, we can read the schema directly from the filesystem
+      const { readFileSync, existsSync } = await import("fs")
+
+      if (!existsSync(schemaUrl)) {
+        throw new Error(`Schema file not found: ${schemaUrl}`)
+      }
+      return readFileSync(schemaUrl, "utf-8")
+    },
+  })
   const schema = parseDocument(schemaContent).toJS() as OpenAPI.SchemaObject
 
   // resolve references in schema
   const dereferencedDocument = await dereference({
-    basePath: baseSchemasPath,
+    basePath: baseSchemasUrl,
     schemas: [schema],
   })
 
@@ -21,8 +36,8 @@ async function getSchemaContent_(schemaPath: string, baseSchemasPath: string) {
 }
 
 const getSchemaContent = unstable_cache(
-  async (schemaPath: string, baseSchemasPath: string) =>
-    getSchemaContent_(schemaPath, baseSchemasPath),
+  async (schemaUrl: string, baseSchemasUrl: string) =>
+    getSchemaContent_(schemaUrl, baseSchemasUrl),
   ["tag-schema"]
 )
 
diff --git a/www/apps/api-reference/utils/read-spec-document.ts b/www/apps/api-reference/utils/read-spec-document.ts
index fbb833ac86955..95921b678a5ac 100644
--- a/www/apps/api-reference/utils/read-spec-document.ts
+++ b/www/apps/api-reference/utils/read-spec-document.ts
@@ -1,8 +1,23 @@
-import { promises as fs } from "fs"
 import { OpenAPI } from "types"
 import { parseDocument } from "yaml"
+import { workerCompatibleFetch } from "docs-utils"
 
 export default async function readSpecDocument(filePath: string) {
-  const fileContent = await fs.readFile(filePath, "utf-8")
+  const fileContent = await workerCompatibleFetch<string>({
+    url: filePath,
+    responseTransformer: async (res) => {
+      if (!res.ok) throw new Error(`Failed to fetch spec: ${filePath} (${res.status})`)
+      return await res.text()
+    },
+    fallbackAction: async () => {
+      // In local development, we can read the spec directly from the filesystem
+      const { readFileSync, existsSync } = await import("fs")
+
+      if (!existsSync(filePath)) {
+        throw new Error(`Spec file not found: ${filePath}`)
+      }
+      return readFileSync(filePath, "utf-8")
+    },
+  })
   return parseDocument(fileContent).toJS() as OpenAPI.OpenAPIV3.PathItemObject
 }
diff --git a/www/apps/api-reference/vercel.json b/www/apps/api-reference/vercel.json
deleted file mode 100644
index 9ffa8062a39a3..0000000000000
--- a/www/apps/api-reference/vercel.json
+++ /dev/null
@@ -1,10 +0,0 @@
-{
-  "crons": [{
-    "path": "/api/algolia",
-    "schedule": "0 0 * * 4"
-  }],
-  "framework": "nextjs",
-  "installCommand": "yarn install",
-  "buildCommand": "turbo run build",
-  "outputDirectory": ".next"
-}
diff --git a/www/apps/api-reference/wrangler.jsonc b/www/apps/api-reference/wrangler.jsonc
new file mode 100644
index 0000000000000..2668a003d44db
--- /dev/null
+++ b/www/apps/api-reference/wrangler.jsonc
@@ -0,0 +1,20 @@
+{
+  "$schema": "../../node_modules/wrangler/config-schema.json",
+  "name": "medusa-docs-api-reference",
+  "main": ".open-next/worker.js",
+  "compatibility_date": "2024-12-30",
+  "compatibility_flags": ["nodejs_compat", "global_fetch_strictly_public"],
+  "assets": {
+    "directory": ".open-next/assets",
+    "binding": "ASSETS"
+  },
+  "services": [
+    {
+      "binding": "WORKER_SELF_REFERENCE",
+      "service": "medusa-docs-api-reference"
+    }
+  ],
+  "images": {
+    "binding": "IMAGES"
+  }
+}
diff --git a/www/apps/bloom/.gitignore b/www/apps/bloom/.gitignore
index fd3dbb571a12a..90a891ec6c294 100644
--- a/www/apps/bloom/.gitignore
+++ b/www/apps/bloom/.gitignore
@@ -27,6 +27,7 @@ yarn-error.log*
 
 # local env files
 .env*.local
+.dev.vars
 
 # vercel
 .vercel
@@ -34,3 +35,8 @@ yarn-error.log*
 # typescript
 *.tsbuildinfo
 next-env.d.ts
+
+# cloudflare
+.open-next
+.wrangler
+public/raw-mdx
\ No newline at end of file
diff --git a/www/apps/bloom/app/md-content/[[...slug]]/route.ts b/www/apps/bloom/app/md-content/[[...slug]]/route.ts
index 3a5591547c311..3bcd89bec18dd 100644
--- a/www/apps/bloom/app/md-content/[[...slug]]/route.ts
+++ b/www/apps/bloom/app/md-content/[[...slug]]/route.ts
@@ -1,5 +1,4 @@
-import { addExtraToMd, getCleanMd } from "docs-utils"
-import { existsSync } from "fs"
+import { addExtraToMd, getCleanMd, workerCompatibleFetch } from "docs-utils"
 import { unstable_cache } from "next/cache"
 import { notFound } from "next/navigation"
 import { NextRequest, NextResponse } from "next/server"
@@ -13,21 +12,42 @@ import {
 import type { Plugin } from "unified"
 
 type Params = {
-  params: Promise<{ slug: string[] }>
+  params: Promise<{ slug?: string[] }>
 }
 
 export async function GET(req: NextRequest, { params }: Params) {
-  const { slug = ["/"] } = await params
+  const { slug: rawSlug } = await params
+  const slug = rawSlug?.filter(Boolean) ?? []
+  const origin = process.env.NEXT_PUBLIC_BASE_URL || new URL(req.url).origin
+  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ""
 
-  // keep this so that Vercel keeps the files in deployment
-  const basePath = path.join(process.cwd(), "app")
-  const filePath = path.join(basePath, ...slug, "page.mdx")
+  const fileContent = await workerCompatibleFetch<string | null>({
+    url: `${origin}${basePath}/raw-mdx/${[...slug, "page.mdx"].join("/")}`,
+    responseTransformer: async (res) => {
+      if (!res.ok) {
+        return null
+      }
+      return await res.text()
+    },
+    fallbackAction: async () => {
+      try {
+        const { promises: fs } = await import("fs")
+        return await fs.readFile(
+          path.join(process.cwd(), "app", ...slug, "page.mdx"),
+          "utf-8"
+        )
+      } catch {
+        return null
+      }
+    },
+    useRemote: !!process.env.CLOUDFLARE_ENV,
+  })
 
-  if (!existsSync(filePath)) {
+  if (!fileContent) {
     return notFound()
   }
 
-  const cleanMdContent = await getCleanMd_(filePath, {
+  const cleanMdContent = await getCleanMd_(fileContent, {
     before: [
       [
         crossProjectLinksPlugin,
@@ -56,7 +76,8 @@ export async function GET(req: NextRequest, { params }: Params) {
           },
           useBaseUrl:
             process.env.NODE_ENV === "production" ||
-            process.env.VERCEL_ENV === "production",
+            process.env.VERCEL_ENV === "production" ||
+            !!process.env.CLOUDFLARE_ENV,
         },
       ],
       [localLinksRehypePlugin],
@@ -106,8 +127,8 @@ export async function GET(req: NextRequest, { params }: Params) {
 }
 
 const getCleanMd_ = unstable_cache(
-  async (filePath: string, plugins?: { before?: Plugin[]; after?: Plugin[] }) =>
-    getCleanMd({ file: filePath, plugins }),
+  async (content: string, plugins?: { before?: Plugin[]; after?: Plugin[] }) =>
+    getCleanMd({ file: content, type: "content", plugins }),
   ["clean-md"],
   {
     revalidate: 3600,
diff --git a/www/apps/bloom/generated/edit-dates.mjs b/www/apps/bloom/generated/edit-dates.mjs
index 07fd0228aded7..61ea8e2455b4d 100644
--- a/www/apps/bloom/generated/edit-dates.mjs
+++ b/www/apps/bloom/generated/edit-dates.mjs
@@ -47,5 +47,46 @@ export const generatedEditDates = {
   "app/features/integrations/guides/klaviyo/page.mdx": "2026-03-18T08:33:25.354Z",
   "app/features/integrations/guides/slack/page.mdx": "2026-03-18T08:33:20.171Z",
   "app/features/integrations/guides/stripe/page.mdx": "2026-03-18T08:34:10.941Z",
-  "app/features/integrations/page.mdx": "2026-03-18T08:45:24.081Z"
+  "app/features/integrations/page.mdx": "2026-03-18T08:45:24.081Z",
+  "public/raw-mdx/credits-and-plans/page.mdx": "2026-05-12T08:31:06.409Z",
+  "public/raw-mdx/custom-domains/page.mdx": "2026-05-12T08:31:06.410Z",
+  "public/raw-mdx/developers/code-editor/page.mdx": "2026-05-12T08:31:06.410Z",
+  "public/raw-mdx/developers/email-templates/page.mdx": "2026-05-12T08:31:06.411Z",
+  "public/raw-mdx/developers/environment-variables/page.mdx": "2026-05-12T08:31:06.411Z",
+  "public/raw-mdx/developers/export-to-github/page.mdx": "2026-05-12T08:31:06.412Z",
+  "public/raw-mdx/faq/page.mdx": "2026-05-12T08:31:06.412Z",
+  "public/raw-mdx/features/commerce-features/page.mdx": "2026-05-12T08:31:06.413Z",
+  "public/raw-mdx/features/demo-data/page.mdx": "2026-05-12T08:31:06.413Z",
+  "public/raw-mdx/features/design-from-media/page.mdx": "2026-05-12T08:31:06.413Z",
+  "public/raw-mdx/features/emails/page.mdx": "2026-05-12T08:31:06.414Z",
+  "public/raw-mdx/features/integrations/guides/cookiebot/page.mdx": "2026-05-12T08:31:06.414Z",
+  "public/raw-mdx/features/integrations/guides/klaviyo/page.mdx": "2026-05-12T08:31:06.414Z",
+  "public/raw-mdx/features/integrations/guides/slack/page.mdx": "2026-05-12T08:31:06.414Z",
+  "public/raw-mdx/features/integrations/guides/stripe/page.mdx": "2026-05-12T08:31:06.415Z",
+  "public/raw-mdx/features/integrations/page.mdx": "2026-05-12T08:31:06.415Z",
+  "public/raw-mdx/features/pull-from-urls/page.mdx": "2026-05-12T08:31:06.415Z",
+  "public/raw-mdx/features/responsive-view/page.mdx": "2026-05-12T08:31:06.415Z",
+  "public/raw-mdx/features/restore-changes/page.mdx": "2026-05-12T08:31:06.416Z",
+  "public/raw-mdx/features/selection-mode/page.mdx": "2026-05-12T08:31:06.416Z",
+  "public/raw-mdx/features/team-collaboration/page.mdx": "2026-05-12T08:31:06.416Z",
+  "public/raw-mdx/features/view-switcher/page.mdx": "2026-05-12T08:31:06.417Z",
+  "public/raw-mdx/first-store/page.mdx": "2026-05-12T08:31:06.417Z",
+  "public/raw-mdx/going-live/page.mdx": "2026-05-12T08:31:06.417Z",
+  "public/raw-mdx/help-and-feedback/page.mdx": "2026-05-12T08:31:06.418Z",
+  "public/raw-mdx/manage-billing/page.mdx": "2026-05-12T08:31:06.418Z",
+  "public/raw-mdx/manage-projects/page.mdx": "2026-05-12T08:31:06.418Z",
+  "public/raw-mdx/organization-management/team/page.mdx": "2026-05-12T08:31:06.419Z",
+  "public/raw-mdx/page.mdx": "2026-05-12T08:31:06.419Z",
+  "public/raw-mdx/organization-management/page.mdx": "2026-05-12T08:31:06.418Z",
+  "public/raw-mdx/preview-tabs/page.mdx": "2026-05-12T08:31:06.419Z",
+  "public/raw-mdx/profile-management/page.mdx": "2026-05-12T08:31:06.419Z",
+  "public/raw-mdx/prompting/custom-features-prompting/page.mdx": "2026-05-12T08:31:06.419Z",
+  "public/raw-mdx/prompting/ecommerce-operations-prompting/page.mdx": "2026-05-12T08:31:06.419Z",
+  "public/raw-mdx/prompting/fix-errors-and-issues/page.mdx": "2026-05-12T08:31:06.420Z",
+  "public/raw-mdx/prompting/service-integrations-prompting/guides/algolia/page.mdx": "2026-05-12T08:31:06.420Z",
+  "public/raw-mdx/prompting/service-integrations-prompting/guides/avalara/page.mdx": "2026-05-12T08:31:06.420Z",
+  "public/raw-mdx/prompting/service-integrations-prompting/guides/shipstation/page.mdx": "2026-05-12T08:31:06.420Z",
+  "public/raw-mdx/prompting/service-integrations-prompting/page.mdx": "2026-05-12T08:31:06.420Z",
+  "public/raw-mdx/prompting/store-design-prompting/page.mdx": "2026-05-12T08:31:06.421Z",
+  "public/raw-mdx/starters/page.mdx": "2026-05-12T08:31:06.421Z"
 }
\ No newline at end of file
diff --git a/www/apps/bloom/next.config.mjs b/www/apps/bloom/next.config.mjs
index 149261a9dfbd7..3c5e319139232 100644
--- a/www/apps/bloom/next.config.mjs
+++ b/www/apps/bloom/next.config.mjs
@@ -76,7 +76,8 @@ const withMDX = mdx({
           },
           useBaseUrl:
             process.env.NODE_ENV === "production" ||
-            process.env.VERCEL_ENV === "production",
+            process.env.VERCEL_ENV === "production" ||
+            !!process.env.CLOUDFLARE_ENV,
         },
       ],
       [localLinksRehypePlugin],
@@ -128,18 +129,40 @@ const nextConfig = {
 
   transpilePackages: ["docs-ui"],
   basePath: process.env.NEXT_PUBLIC_BASE_PATH || "",
+  outputFileTracingRoot: new URL("../../", import.meta.url).pathname,
   outputFileTracingIncludes: {
     "/md\\-content/\\[\\[\\.\\.\\.slug\\]\\]": ["./app/**/*.mdx"],
   },
   outputFileTracingExcludes: {
-    "*": ["node_modules/@medusajs/icons"],
+    "*": [
+      "node_modules/@medusajs/icons",
+      "../**/.open-next/**",
+      "../!(bloom)/.next/**",
+    ],
   },
   experimental: {
     optimizePackageImports: ["@medusajs/icons", "@medusajs/ui"],
   },
+  redirects: async () => {
+    return [
+      {
+        source: "/prompting/service-integrations-prompting/guides/stripe",
+        destination: "/features/integrations/guides/stripe",
+        permanent: true,
+      },
+    ]
+  },
   rewrites: async () => {
     return {
       beforeFiles: [
+        {
+          source: "/index.html.md",
+          destination: "/md-content",
+        },
+        {
+          source: "/index.md",
+          destination: "/md-content",
+        },
         {
           source: "/:path*/index.html.md",
           destination: "/md-content/:path*",
@@ -153,7 +176,7 @@ const nextConfig = {
           destination: "/md-content/:path*",
         },
         {
-          source: "/:path((?!md-content).+)/",
+          source: "/:first((?!md-content)[^/]+)/:rest*/",
           has: [
             {
               type: "header",
@@ -161,7 +184,7 @@ const nextConfig = {
               value: ".*(text/markdown|text/plain).*",
             },
           ],
-          destination: "/md-content/:path",
+          destination: "/md-content/:first/:rest*",
         },
         {
           source: "/",
@@ -175,7 +198,7 @@ const nextConfig = {
           destination: "/md-content",
         },
         {
-          source: "/:path((?!md-content).+)",
+          source: "/:first((?!md-content)[^/]+)/:rest*",
           has: [
             {
               type: "header",
@@ -183,20 +206,11 @@ const nextConfig = {
               value: ".*(text/markdown|text/plain).*",
             },
           ],
-          destination: "/md-content/:path",
+          destination: "/md-content/:first/:rest*",
         },
       ],
     }
   },
-  redirects: async () => {
-    return [
-      {
-        source: "/prompting/service-integrations-prompting/guides/stripe",
-        destination: "/features/integrations/guides/stripe",
-        permanent: true,
-      },
-    ]
-  },
 }
 
 const withBundleAnalyzer = bundleAnalyzer({
diff --git a/www/apps/bloom/open-next.config.ts b/www/apps/bloom/open-next.config.ts
new file mode 100644
index 0000000000000..136ed5f038c45
--- /dev/null
+++ b/www/apps/bloom/open-next.config.ts
@@ -0,0 +1,3 @@
+import { defineCloudflareConfig } from "@opennextjs/cloudflare"
+
+export default defineCloudflareConfig()
diff --git a/www/apps/bloom/package.json b/www/apps/bloom/package.json
index 75ee88718eaf7..af4ecb6585ada 100644
--- a/www/apps/bloom/package.json
+++ b/www/apps/bloom/package.json
@@ -5,23 +5,29 @@
   "scripts": {
     "dev": "yarn prep && next dev",
     "dev:monorepo": "yarn prep && yarn dev -p 3005",
+    "dev:wrangler": "wrangler dev --port 3000",
     "build": "yarn prep && next build",
+    "build:cloudflare": "CF_PAGES=1 yarn prep && opennextjs-cloudflare build",
     "build:dev": "NODE_ENV=test yarn build",
     "start": "next start",
     "start:monorepo": "yarn start -p 3005",
     "lint": "next lint --fix",
     "lint:content": "eslint --no-config-lookup -c .content.eslintrc.mjs app/**/*.mdx --fix",
-    "prep": "node ./scripts/prepare.mjs"
+    "prep": "node ./scripts/prepare.mjs",
+    "preview": "yarn build:cloudflare && opennextjs-cloudflare preview",
+    "deploy": "opennextjs-cloudflare deploy",
+    "upload": "yarn build:cloudflare && opennextjs-cloudflare upload",
+    "cf-typegen": "wrangler types --env-interface CloudflareEnv cloudflare-env.d.ts"
   },
   "dependencies": {
     "@mdx-js/loader": "^3.1.0",
     "@mdx-js/react": "^3.1.0",
     "@medusajs/icons": "2.15.1",
-    "@next/mdx": "15.3.9",
+    "@next/mdx": "15.5.18",
     "@stefanprobst/rehype-extract-toc": "^3.0.0",
     "clsx": "^2.1.0",
     "docs-ui": "*",
-    "next": "15.3.9",
+    "next": "15.5.18",
     "posthog-js": "^1.298.1",
     "posthog-node": "^5.29.0",
     "react": "19.2.5",
@@ -34,6 +40,7 @@
     "slugify": "^1.6.6"
   },
   "devDependencies": {
+    "@opennextjs/cloudflare": "^1.19.9",
     "@types/mdx": "^2.0.13",
     "@types/node": "^20",
     "@types/react": "19.2.9",
@@ -48,7 +55,8 @@
     "tailwindcss": "^3.3.0",
     "tsconfig": "*",
     "types": "*",
-    "typescript": "^5"
+    "typescript": "^5",
+    "wrangler": "^4.90.0"
   },
   "engines": {
     "node": ">=20"
diff --git a/www/apps/bloom/public/_headers b/www/apps/bloom/public/_headers
new file mode 100644
index 0000000000000..3b460e68fd44e
--- /dev/null
+++ b/www/apps/bloom/public/_headers
@@ -0,0 +1,2 @@
+/_next/static/*
+  Cache-Control: public,max-age=31536000,immutable
diff --git a/www/apps/bloom/scripts/prepare.mjs b/www/apps/bloom/scripts/prepare.mjs
index 325404f5a8d79..49a6da6c8f807 100644
--- a/www/apps/bloom/scripts/prepare.mjs
+++ b/www/apps/bloom/scripts/prepare.mjs
@@ -1,9 +1,20 @@
-import { generateEditedDates, generateSidebar } from "build-scripts"
+import {
+  generateEditedDates,
+  generateSidebar,
+  copyMdxToPublic,
+} from "build-scripts"
 import { sidebar } from "../sidebar.mjs"
+import path from "path"
 
 async function main() {
   await generateSidebar(sidebar)
   await generateEditedDates()
+  if (process.env.CLOUDFLARE_ENV) {
+    await copyMdxToPublic({
+      srcDir: path.join(process.cwd(), "app"),
+      destDir: path.join(process.cwd(), "public", "raw-mdx"),
+    })
+  }
 }
 
 void main()
diff --git a/www/apps/bloom/vercel.json b/www/apps/bloom/vercel.json
deleted file mode 100644
index fbfe88003a577..0000000000000
--- a/www/apps/bloom/vercel.json
+++ /dev/null
@@ -1,7 +0,0 @@
-{
-  "framework": "nextjs",
-  "installCommand": "yarn install",
-  "buildCommand": "turbo run build",
-  "outputDirectory": ".next",
-  "ignoreCommand": "bash ../../ignore-build-script.sh bloom"
-}
\ No newline at end of file
diff --git a/www/apps/bloom/wrangler.jsonc b/www/apps/bloom/wrangler.jsonc
new file mode 100644
index 0000000000000..e30b1bed96b6c
--- /dev/null
+++ b/www/apps/bloom/wrangler.jsonc
@@ -0,0 +1,20 @@
+{
+  "$schema": "../../node_modules/wrangler/config-schema.json",
+  "name": "medusa-docs-bloom",
+  "main": ".open-next/worker.js",
+  "compatibility_date": "2024-12-30",
+  "compatibility_flags": ["nodejs_compat", "global_fetch_strictly_public"],
+  "assets": {
+    "directory": ".open-next/assets",
+    "binding": "ASSETS"
+  },
+  "services": [
+    {
+      "binding": "WORKER_SELF_REFERENCE",
+      "service": "medusa-docs-bloom"
+    }
+  ],
+  "images": {
+    "binding": "IMAGES"
+  }
+}
diff --git a/www/apps/book/.env.sample b/www/apps/book/.env.sample
index 1c1c5a59c5b70..0b123cfe63cb8 100644
--- a/www/apps/book/.env.sample
+++ b/www/apps/book/.env.sample
@@ -28,4 +28,5 @@ NEXT_PUBLIC_INTEGRATION_ID=
 NEXT_MCP_SERVER_URL=
 NEXT_PUBLIC_REO_DEV_CLIENT_ID=
 NEXT_PUBLIC_POSTHOG_KEY=
-NEXT_PUBLIC_POSTHOG_HOST=
\ No newline at end of file
+NEXT_PUBLIC_POSTHOG_HOST=
+CF_PAGES=
\ No newline at end of file
diff --git a/www/apps/book/.gitignore b/www/apps/book/.gitignore
index 98297a172f7b0..00a59e30c37f2 100644
--- a/www/apps/book/.gitignore
+++ b/www/apps/book/.gitignore
@@ -28,6 +28,7 @@ yarn-error.log*
 
 # local env files
 .env*.local
+.dev.vars
 
 # vercel
 .vercel
@@ -36,4 +37,9 @@ yarn-error.log*
 *.tsbuildinfo
 next-env.d.ts
 
-sidebar.full.mjs
\ No newline at end of file
+sidebar.full.mjs
+
+# cloudflare
+.open-next
+.wrangler
+public/raw-mdx
\ No newline at end of file
diff --git a/www/apps/book/app/md-content/[[...slug]]/route.ts b/www/apps/book/app/md-content/[[...slug]]/route.ts
index 448fb9dc49f26..bc66e86278785 100644
--- a/www/apps/book/app/md-content/[[...slug]]/route.ts
+++ b/www/apps/book/app/md-content/[[...slug]]/route.ts
@@ -1,26 +1,45 @@
-import { addExtraToMd } from "docs-utils"
-import { existsSync, readFileSync } from "fs"
+import { addExtraToMd, workerCompatibleFetch } from "docs-utils"
 import { notFound } from "next/navigation"
 import { NextRequest, NextResponse } from "next/server"
 import path from "path"
 import { PostHog } from "posthog-node"
 import { getCleanMdCached } from "../../../utils/get-clean-md-cached"
+import { fetchRawMdx } from "../../../utils/fetch-raw-mdx"
 
 type Params = {
-  params: Promise<{ slug: string[] }>
+  params: Promise<{ slug?: string[] }>
 }
 
 export async function GET(req: NextRequest, { params }: Params) {
-  const { slug = ["/"] } = await params
+  const { slug: rawSlug } = await params
+  const slug = rawSlug?.filter(Boolean) ?? []
+  const origin = process.env.NEXT_PUBLIC_BASE_URL || new URL(req.url).origin
 
-  if (slug[0] === "/") {
-    const homepageFile = readFileSync(
-      path.join(process.cwd(), "public", "homepage.md"),
-      "utf-8"
-    )
+  if (slug.length === 0) {
+    const homepageContent = await workerCompatibleFetch<string | null>({
+      url: `${origin}/homepage.md`,
+      responseTransformer: async (res) => {
+        return res.ok ? res.text() : null
+      },
+      fallbackAction: async () => {
+        try {
+          const { promises: fs } = await import("fs")
+          return await fs.readFile(
+            path.join(process.cwd(), "public", "homepage.md"),
+            "utf-8"
+          )
+        } catch {
+          return null
+        }
+      },
+    })
+
+    if (!homepageContent) {
+      return notFound()
+    }
 
     return new NextResponse(
-      addExtraToMd(homepageFile, {
+      addExtraToMd(homepageContent, {
         baseUrl: process.env.NEXT_PUBLIC_BASE_URL || "",
       }),
       {
@@ -33,23 +52,15 @@ export async function GET(req: NextRequest, { params }: Params) {
     )
   }
 
-  // keep this so that Vercel keeps the files in deployment
-  const basePath = path.join(process.cwd(), "app")
-  const filePath = path.join(basePath, ...slug, "page.mdx")
-  const mdContentFilePath = path.join(basePath, ...slug, "_md-content.mdx")
-  // An `_md-content.mdx` file overrides the `page.mdx` file if it exists.
-  const existingPath = existsSync(mdContentFilePath)
-    ? mdContentFilePath
-    : existsSync(filePath)
-      ? filePath
-      : null
-
-  if (!existingPath) {
+  const result = await fetchRawMdx(origin, slug)
+  if (!result) {
     return notFound()
   }
 
-  const cleanMdContent = await getCleanMdCached(existingPath, {
-    removeExtra: existingPath === mdContentFilePath,
+  const { content, isOverride } = result
+
+  const cleanMdContent = await getCleanMdCached(content, {
+    removeExtra: isOverride,
   })
 
   const acceptHeader = req.headers.get("accept") || ""
diff --git a/www/apps/book/config/index.ts b/www/apps/book/config/index.ts
index 3df407a59a57c..38cac88e01d34 100644
--- a/www/apps/book/config/index.ts
+++ b/www/apps/book/config/index.ts
@@ -11,7 +11,7 @@ export const config: DocsConfig = {
   description:
     "Explore and learn how to use Medusa. Learn how to get started, the fundamental concepts, how to customize Medusa, and more.",
   baseUrl,
-  basePath: process.env.NEXT_PUBLIC_BASE_PATH,
+  basePath: process.env.NEXT_PUBLIC_BASE_PATH || "",
   sidebars: generatedSidebars as Sidebar.Sidebar[],
   project: {
     title: "Documentation",
diff --git a/www/apps/book/middleware.ts b/www/apps/book/middleware.ts
index 1778f628cdddd..03bf4ad1dd654 100644
--- a/www/apps/book/middleware.ts
+++ b/www/apps/book/middleware.ts
@@ -56,9 +56,7 @@ export async function middleware(request: NextRequest) {
 
   const response =
     variant === "ai"
-      ? NextResponse.rewrite(
-          new URL(AB_TEST_PAGES[pathname], request.url)
-        )
+      ? NextResponse.rewrite(new URL(AB_TEST_PAGES[pathname], request.url))
       : NextResponse.next()
 
   // Set cookies if needed
diff --git a/www/apps/book/next.config.mjs b/www/apps/book/next.config.mjs
index d6076d530f37e..67e5a023e1bf1 100644
--- a/www/apps/book/next.config.mjs
+++ b/www/apps/book/next.config.mjs
@@ -75,7 +75,8 @@ const withMDX = mdx({
           },
           useBaseUrl:
             process.env.NODE_ENV === "production" ||
-            process.env.VERCEL_ENV === "production",
+            process.env.VERCEL_ENV === "production" ||
+            !!process.env.CLOUDFLARE_ENV,
         },
       ],
       [localLinksRehypePlugin],
@@ -125,20 +126,28 @@ const nextConfig = {
     return {
       beforeFiles: [
         {
-          source:
-            "/:path((?!resources|api|ui|user-guide|cloud).*)index.html.md",
+          source: "/index.html.md",
+          destination: "/md-content",
+        },
+        {
+          source: "/index.md",
+          destination: "/md-content",
+        },
+        {
+          source: "/:path*/index.html.md",
           destination: "/md-content/:path*",
         },
         {
-          source: "/:path((?!resources|api|ui|user-guide|cloud).*)index.md",
+          source: "/:path*/index.md",
           destination: "/md-content/:path*",
         },
         {
-          source: "/:path((?!resources|api|ui|user-guide|cloud).*).md",
+          source: "/:path*.md",
           destination: "/md-content/:path*",
         },
         {
-          source: "/:path((?!resources|api|ui|user-guide|cloud|md-content).+)/",
+          source:
+            "/:first((?!resources|api|ui|user-guide|cloud|md-content)[^/]+)/:rest*/",
           has: [
             {
               type: "header",
@@ -146,7 +155,7 @@ const nextConfig = {
               value: ".*(text/markdown|text/plain).*",
             },
           ],
-          destination: "/md-content/:path",
+          destination: "/md-content/:first/:rest*",
         },
         {
           source: "/",
@@ -160,7 +169,8 @@ const nextConfig = {
           destination: "/md-content",
         },
         {
-          source: "/:path((?!resources|api|ui|user-guide|cloud|md-content).+)",
+          source:
+            "/:first((?!resources|api|ui|user-guide|cloud|md-content)[^/]+)/:rest*",
           has: [
             {
               type: "header",
@@ -168,7 +178,7 @@ const nextConfig = {
               value: ".*(text/markdown|text/plain).*",
             },
           ],
-          destination: "/md-content/:path",
+          destination: "/md-content/:first/:rest*",
         },
       ],
       fallback: [
@@ -334,11 +344,16 @@ const nextConfig = {
 
     return catchBadRedirects(result)
   },
+  outputFileTracingRoot: new URL("../../", import.meta.url).pathname,
   outputFileTracingIncludes: {
     "/md\\-content/\\[\\.\\.\\.slug\\]": ["./app/**/*.mdx"],
   },
   outputFileTracingExcludes: {
-    "*": ["node_modules/@medusajs/icons"],
+    "*": [
+      "node_modules/@medusajs/icons",
+      "../**/.open-next/**",
+      "../!(book)/.next/**",
+    ],
   },
   experimental: {
     optimizePackageImports: ["@medusajs/icons", "@medusajs/ui"],
diff --git a/www/apps/book/open-next.config.ts b/www/apps/book/open-next.config.ts
new file mode 100644
index 0000000000000..136ed5f038c45
--- /dev/null
+++ b/www/apps/book/open-next.config.ts
@@ -0,0 +1,3 @@
+import { defineCloudflareConfig } from "@opennextjs/cloudflare"
+
+export default defineCloudflareConfig()
diff --git a/www/apps/book/package.json b/www/apps/book/package.json
index 33518e78f24f3..4b38c0258e6ec 100644
--- a/www/apps/book/package.json
+++ b/www/apps/book/package.json
@@ -5,26 +5,32 @@
   "scripts": {
     "dev": "next dev",
     "dev:monorepo": "yarn dev -p 3001",
+    "dev:wrangler": "wrangler dev --port 3000",
     "build": "next build",
+    "build:cloudflare": "CF_PAGES=1 node ./scripts/prepare.mjs && opennextjs-cloudflare build",
     "build:dev": "NODE_ENV=test next build",
     "start": "next start",
     "start:monorepo": "yarn start -p 3001",
     "lint": "next lint --fix",
     "lint:content": "eslint --no-config-lookup -c .content.eslint.mjs app/**/*.mdx --fix",
     "prep": "node ./scripts/prepare.mjs",
-    "test:agent-docs": "npx vitest run --config vitest.config.ts"
+    "test:agent-docs": "npx vitest run --config vitest.config.ts",
+    "preview": "yarn build:cloudflare && opennextjs-cloudflare preview",
+    "deploy": "opennextjs-cloudflare deploy",
+    "upload": "opennextjs-cloudflare upload",
+    "cf-typegen": "wrangler types --env-interface CloudflareEnv cloudflare-env.d.ts"
   },
   "dependencies": {
     "@mdx-js/loader": "^3.1.0",
     "@mdx-js/react": "^3.1.0",
     "@medusajs/icons": "2.15.1",
-    "@next/mdx": "15.3.9",
+    "@next/mdx": "15.5.18",
     "@stefanprobst/rehype-extract-toc": "^3.0.0",
     "clsx": "^2.1.0",
     "docs-ui": "*",
     "docs-utils": "*",
     "loops": "^6.0.1",
-    "next": "15.3.9",
+    "next": "15.5.18",
     "posthog-js": "^1.298.1",
     "posthog-node": "^5.29.0",
     "react": "19.2.5",
@@ -35,6 +41,7 @@
     "remark-rehype-plugins": "*"
   },
   "devDependencies": {
+    "@opennextjs/cloudflare": "^1.19.9",
     "@types/mdx": "^2.0.13",
     "@types/node": "^20",
     "@types/react": "19.2.9",
@@ -51,7 +58,8 @@
     "tailwindcss": "^3.3.0",
     "tsconfig": "*",
     "types": "*",
-    "typescript": "^5"
+    "typescript": "^5",
+    "wrangler": "^4.90.0"
   },
   "engines": {
     "node": ">=20"
diff --git a/www/apps/book/public/_headers b/www/apps/book/public/_headers
new file mode 100644
index 0000000000000..3b460e68fd44e
--- /dev/null
+++ b/www/apps/book/public/_headers
@@ -0,0 +1,2 @@
+/_next/static/*
+  Cache-Control: public,max-age=31536000,immutable
diff --git a/www/apps/book/scripts/prepare.mjs b/www/apps/book/scripts/prepare.mjs
index 1834d37f5009b..02314792d87bf 100644
--- a/www/apps/book/scripts/prepare.mjs
+++ b/www/apps/book/scripts/prepare.mjs
@@ -5,6 +5,7 @@ import {
   generateEditedDates,
   generateLlmsFull,
   generateSidebar,
+  copyMdxToPublic,
 } from "build-scripts"
 import {
   addUrlToRelativeLink,
@@ -47,6 +48,12 @@ async function main() {
     ],
     after: [[addUrlToRelativeLink, { url: baseUrl }]],
   }
+  if (process.env.CLOUDFLARE_ENV) {
+    await copyMdxToPublic({
+      srcDir: path.join(process.cwd(), "app"),
+      destDir: path.join(process.cwd(), "public", "raw-mdx"),
+    })
+  }
   await generateLlmsFull({
     outputPath: path.join(process.cwd(), "public", "llms-full.txt"),
     plugins: {
diff --git a/www/apps/book/utils/fetch-raw-mdx.ts b/www/apps/book/utils/fetch-raw-mdx.ts
new file mode 100644
index 0000000000000..597c134b36417
--- /dev/null
+++ b/www/apps/book/utils/fetch-raw-mdx.ts
@@ -0,0 +1,54 @@
+import { workerCompatibleFetch } from "docs-utils"
+import path from "path"
+
+export async function fetchRawMdx(
+  origin: string,
+  slug: string[]
+): Promise<{ content: string; isOverride: boolean } | null> {
+  const isCloudflare = !!process.env.CLOUDFLARE_ENV
+
+  // An `_md-content.mdx` file overrides `page.mdx` if it exists.
+  const overrideContent = await workerCompatibleFetch<string | null>({
+    url: `${origin}/raw-mdx/${[...slug, "_md-content.mdx"].join("/")}`,
+    responseTransformer: async (res) => {
+      return res.ok ? res.text() : null
+    },
+    fallbackAction: async () => {
+      try {
+        const { promises: fs } = await import("fs")
+        return await fs.readFile(
+          path.join(process.cwd(), "app", ...slug, "_md-content.mdx"),
+          "utf-8"
+        )
+      } catch {
+        return null
+      }
+    },
+    useRemote: isCloudflare,
+  })
+
+  if (overrideContent) {
+    return { content: overrideContent, isOverride: true }
+  }
+
+  const pageContent = await workerCompatibleFetch<string | null>({
+    url: `${origin}/raw-mdx/${[...slug, "page.mdx"].join("/")}`,
+    responseTransformer: async (res) => {
+      return res.ok ? res.text() : null
+    },
+    fallbackAction: async () => {
+      try {
+        const { promises: fs } = await import("fs")
+        return await fs.readFile(
+          path.join(process.cwd(), "app", ...slug, "page.mdx"),
+          "utf-8"
+        )
+      } catch {
+        return null
+      }
+    },
+    useRemote: isCloudflare,
+  })
+
+  return pageContent ? { content: pageContent, isOverride: false } : null
+}
diff --git a/www/apps/book/utils/get-clean-md-cached.ts b/www/apps/book/utils/get-clean-md-cached.ts
index 7ed08dbcadac4..c1004dd59d4a1 100644
--- a/www/apps/book/utils/get-clean-md-cached.ts
+++ b/www/apps/book/utils/get-clean-md-cached.ts
@@ -11,11 +11,13 @@ type Options = {
   removeExtra?: boolean
 }
 
+// slug is used as the cache key; content is the MDX source fetched from /raw-mdx/
 export const getCleanMdCached = unstable_cache(
-  async (filePath: string, options: Options = {}) => {
+  async (content: string, options: Options = {}) => {
     const { removeExtra } = options
     const md = await getCleanMd({
-      file: filePath,
+      file: content,
+      type: "content",
       plugins: {
         before: [
           [
@@ -38,7 +40,8 @@ export const getCleanMdCached = unstable_cache(
               },
               useBaseUrl:
                 process.env.NODE_ENV === "production" ||
-                process.env.VERCEL_ENV === "production",
+                process.env.VERCEL_ENV === "production" ||
+                !!process.env.CLOUDFLARE_ENV,
             },
           ],
           [localLinksRehypePlugin],
diff --git a/www/apps/book/vercel.json b/www/apps/book/vercel.json
deleted file mode 100644
index 4f0cfed39eb8f..0000000000000
--- a/www/apps/book/vercel.json
+++ /dev/null
@@ -1,7 +0,0 @@
-{
-  "framework": "nextjs",
-  "installCommand": "yarn install",
-  "buildCommand": "turbo run build",
-  "outputDirectory": ".next",
-  "ignoreCommand": "bash ../../ignore-build-script.sh book"
-}
\ No newline at end of file
diff --git a/www/apps/book/wrangler.jsonc b/www/apps/book/wrangler.jsonc
new file mode 100644
index 0000000000000..0d7a203ebdbac
--- /dev/null
+++ b/www/apps/book/wrangler.jsonc
@@ -0,0 +1,20 @@
+{
+  "$schema": "../../node_modules/wrangler/config-schema.json",
+  "name": "medusa-docs-book",
+  "main": ".open-next/worker.js",
+  "compatibility_date": "2024-12-30",
+  "compatibility_flags": ["nodejs_compat", "global_fetch_strictly_public"],
+  "assets": {
+    "directory": ".open-next/assets",
+    "binding": "ASSETS"
+  },
+  "services": [
+    {
+      "binding": "WORKER_SELF_REFERENCE",
+      "service": "medusa-docs-book"
+    }
+  ],
+  "images": {
+    "binding": "IMAGES"
+  }
+}
diff --git a/www/apps/cloud/.gitignore b/www/apps/cloud/.gitignore
index fd3dbb571a12a..6927538c1efb6 100644
--- a/www/apps/cloud/.gitignore
+++ b/www/apps/cloud/.gitignore
@@ -27,6 +27,7 @@ yarn-error.log*
 
 # local env files
 .env*.local
+.dev.vars
 
 # vercel
 .vercel
@@ -34,3 +35,10 @@ yarn-error.log*
 # typescript
 *.tsbuildinfo
 next-env.d.ts
+
+sidebar.full.mjs
+
+# cloudflare
+.open-next
+.wrangler
+public/raw-mdx
\ No newline at end of file
diff --git a/www/apps/cloud/app/md-content/[[...slug]]/route.ts b/www/apps/cloud/app/md-content/[[...slug]]/route.ts
index dd48000275ff7..fc07d84d2d360 100644
--- a/www/apps/cloud/app/md-content/[[...slug]]/route.ts
+++ b/www/apps/cloud/app/md-content/[[...slug]]/route.ts
@@ -1,5 +1,4 @@
-import { addExtraToMd, getCleanMd } from "docs-utils"
-import { existsSync } from "fs"
+import { addExtraToMd, getCleanMd, workerCompatibleFetch } from "docs-utils"
 import { unstable_cache } from "next/cache"
 import { notFound } from "next/navigation"
 import { NextRequest, NextResponse } from "next/server"
@@ -13,21 +12,45 @@ import {
 import type { Plugin } from "unified"
 
 type Params = {
-  params: Promise<{ slug: string[] }>
+  params: Promise<{ slug?: string[] }>
 }
 
 export async function GET(req: NextRequest, { params }: Params) {
-  const { slug = ["/"] } = await params
+  const { slug: rawSlug } = await params
+  const slug = rawSlug?.filter(Boolean) ?? []
+  const origin = process.env.NEXT_PUBLIC_BASE_URL || new URL(req.url).origin
+  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ""
+  const isCloudflare = !!process.env.CLOUDFLARE_ENV
 
-  // keep this so that Vercel keeps the files in deployment
-  const basePath = path.join(process.cwd(), "app")
-  const filePath = path.join(basePath, ...slug, "page.mdx")
+  const fileContent = await workerCompatibleFetch<string | null>({
+    url: `${origin}${basePath}/raw-mdx/${[...slug, "page.mdx"].join("/")}`,
+    responseTransformer: async (res) => {
+      return res.ok ? res.text() : null
+    },
+    fallbackAction: async () => {
+      try {
+        const { promises: fs } = await import("fs")
+        // eslint-disable-next-line no-console
+        console.log(
+          "Attempting to read file from filesystem for slug:",
+          path.join(process.cwd(), "app", ...slug, "page.mdx")
+        )
+        return await fs.readFile(
+          path.join(process.cwd(), "app", ...slug, "page.mdx"),
+          "utf-8"
+        )
+      } catch {
+        return null
+      }
+    },
+    useRemote: isCloudflare,
+  })
 
-  if (!existsSync(filePath)) {
+  if (!fileContent) {
     return notFound()
   }
 
-  const cleanMdContent = await getCleanMd_(filePath, {
+  const cleanMdContent = await getCleanMd_(fileContent, {
     before: [
       [
         crossProjectLinksPlugin,
@@ -53,7 +76,8 @@ export async function GET(req: NextRequest, { params }: Params) {
           },
           useBaseUrl:
             process.env.NODE_ENV === "production" ||
-            process.env.VERCEL_ENV === "production",
+            process.env.VERCEL_ENV === "production" ||
+            isCloudflare,
         },
       ],
       [localLinksRehypePlugin],
@@ -103,8 +127,8 @@ export async function GET(req: NextRequest, { params }: Params) {
 }
 
 const getCleanMd_ = unstable_cache(
-  async (filePath: string, plugins?: { before?: Plugin[]; after?: Plugin[] }) =>
-    getCleanMd({ file: filePath, plugins }),
+  async (content: string, plugins?: { before?: Plugin[]; after?: Plugin[] }) =>
+    getCleanMd({ file: content, type: "content", plugins }),
   ["clean-md"],
   {
     revalidate: 3600,
diff --git a/www/apps/cloud/app/pricing/content.tsx b/www/apps/cloud/app/pricing/content.tsx
index 537cfa110b086..d48d888febcf6 100644
--- a/www/apps/cloud/app/pricing/content.tsx
+++ b/www/apps/cloud/app/pricing/content.tsx
@@ -8,7 +8,9 @@ import { H2, Hr } from "docs-ui"
 export default async function PricingPage() {
   if (
     process.env.NEXT_PUBLIC_ENV === "CI" ||
-    process.env.NEXT_PUBLIC_VERCEL_ENV === "preview"
+    process.env.NEXT_PUBLIC_ENV === "preview" ||
+    process.env.NEXT_PUBLIC_VERCEL_ENV === "preview" ||
+    process.env.CLOUDFLARE_ENV !== "production"
   ) {
     return (
       <div>Pricing page is not available in the CI / Preview environment.</div>
diff --git a/www/apps/cloud/generated/edit-dates.mjs b/www/apps/cloud/generated/edit-dates.mjs
index 0725591d3c8be..b0a2943fe9841 100644
--- a/www/apps/cloud/generated/edit-dates.mjs
+++ b/www/apps/cloud/generated/edit-dates.mjs
@@ -55,5 +55,61 @@ export const generatedEditDates = {
   "app/cli/commands/whoami/page.mdx": "2026-04-29T08:27:22.781Z",
   "app/access-keys/page.mdx": "2026-04-29T09:09:42.629Z",
   "app/cli/agents/page.mdx": "2026-05-05T10:47:21.287Z",
-  "app/navigation/page.mdx": "2026-05-06T10:14:13.715Z"
+  "app/navigation/page.mdx": "2026-05-06T10:14:13.715Z",
+  "public/raw-mdx/access-keys/page.mdx": "2026-05-12T10:49:54.264Z",
+  "public/raw-mdx/billing/manage/page.mdx": "2026-05-12T10:49:54.265Z",
+  "public/raw-mdx/billing/page.mdx": "2026-05-12T10:49:54.265Z",
+  "public/raw-mdx/billing/plans/page.mdx": "2026-05-12T10:49:54.265Z",
+  "public/raw-mdx/cache/page.mdx": "2026-05-12T10:49:54.266Z",
+  "public/raw-mdx/cli/agents/page.mdx": "2026-05-12T10:49:54.266Z",
+  "public/raw-mdx/cli/commands/deployments/page.mdx": "2026-05-12T10:49:54.267Z",
+  "public/raw-mdx/cli/commands/environments/page.mdx": "2026-05-12T10:49:54.267Z",
+  "public/raw-mdx/cli/commands/login/page.mdx": "2026-05-12T10:49:54.268Z",
+  "public/raw-mdx/cli/commands/logout/page.mdx": "2026-05-12T10:49:54.268Z",
+  "public/raw-mdx/cli/commands/logs/page.mdx": "2026-05-12T10:49:54.268Z",
+  "public/raw-mdx/cli/commands/organizations/page.mdx": "2026-05-12T10:49:54.271Z",
+  "public/raw-mdx/cli/commands/projects/page.mdx": "2026-05-12T10:49:54.272Z",
+  "public/raw-mdx/cli/commands/signup/page.mdx": "2026-05-12T10:49:54.273Z",
+  "public/raw-mdx/cli/commands/use/page.mdx": "2026-05-12T10:49:54.274Z",
+  "public/raw-mdx/cli/commands/variables/page.mdx": "2026-05-12T10:49:54.275Z",
+  "public/raw-mdx/cli/commands/version/page.mdx": "2026-05-12T10:49:54.275Z",
+  "public/raw-mdx/cli/commands/whoami/page.mdx": "2026-05-12T10:49:54.275Z",
+  "public/raw-mdx/cli/page.mdx": "2026-05-12T10:49:54.276Z",
+  "public/raw-mdx/command-palette/page.mdx": "2026-05-12T10:49:54.276Z",
+  "public/raw-mdx/comparison/page.mdx": "2026-05-12T10:49:54.277Z",
+  "public/raw-mdx/connect-storefront/page.mdx": "2026-05-12T10:49:54.277Z",
+  "public/raw-mdx/database/page.mdx": "2026-05-12T10:49:54.277Z",
+  "public/raw-mdx/deployments/access/page.mdx": "2026-05-12T10:49:54.278Z",
+  "public/raw-mdx/deployments/page.mdx": "2026-05-12T10:49:54.278Z",
+  "public/raw-mdx/deployments/troubleshooting/page.mdx": "2026-05-12T10:49:54.278Z",
+  "public/raw-mdx/emails/page.mdx": "2026-05-12T10:49:54.279Z",
+  "public/raw-mdx/emails/react-email/page.mdx": "2026-05-12T10:49:54.279Z",
+  "public/raw-mdx/environments/custom-domains/page.mdx": "2026-05-12T10:49:54.280Z",
+  "public/raw-mdx/environments/environment-variables/page.mdx": "2026-05-12T10:49:54.280Z",
+  "public/raw-mdx/environments/long-lived/page.mdx": "2026-05-12T10:49:54.280Z",
+  "public/raw-mdx/environments/page.mdx": "2026-05-12T10:49:54.281Z",
+  "public/raw-mdx/environments/preview/page.mdx": "2026-05-12T10:49:54.281Z",
+  "public/raw-mdx/environments/subdomains/page.mdx": "2026-05-12T10:49:54.281Z",
+  "public/raw-mdx/faq/page.mdx": "2026-05-12T10:49:54.282Z",
+  "public/raw-mdx/ip-addresses/page.mdx": "2026-05-12T10:49:54.282Z",
+  "public/raw-mdx/logs/page.mdx": "2026-05-12T10:49:54.282Z",
+  "public/raw-mdx/monitoring/http/page.mdx": "2026-05-12T10:49:54.283Z",
+  "public/raw-mdx/monitoring/page.mdx": "2026-05-12T10:49:54.283Z",
+  "public/raw-mdx/monitoring/servers/page.mdx": "2026-05-12T10:49:54.284Z",
+  "public/raw-mdx/monitoring/workers/page.mdx": "2026-05-12T10:49:54.284Z",
+  "public/raw-mdx/navigation/page.mdx": "2026-05-12T10:49:54.284Z",
+  "public/raw-mdx/notifications/page.mdx": "2026-05-12T10:49:54.285Z",
+  "public/raw-mdx/organizations/page.mdx": "2026-05-12T10:49:54.285Z",
+  "public/raw-mdx/page.mdx": "2026-05-12T10:49:54.286Z",
+  "public/raw-mdx/pricing/page.mdx": "2026-05-12T10:49:54.286Z",
+  "public/raw-mdx/projects/page.mdx": "2026-05-12T10:49:54.287Z",
+  "public/raw-mdx/projects/prerequisites/page.mdx": "2026-05-12T10:49:54.287Z",
+  "public/raw-mdx/projects/rename-repo-branch/page.mdx": "2026-05-12T10:49:54.288Z",
+  "public/raw-mdx/redis/page.mdx": "2026-05-12T10:49:54.288Z",
+  "public/raw-mdx/s3/page.mdx": "2026-05-12T10:49:54.288Z",
+  "public/raw-mdx/sign-up/page.mdx": "2026-05-12T10:49:54.289Z",
+  "public/raw-mdx/storefront/page.mdx": "2026-05-12T10:49:54.289Z",
+  "public/raw-mdx/update-medusa/page.mdx": "2026-05-12T10:49:54.290Z",
+  "public/raw-mdx/usage/page.mdx": "2026-05-12T10:49:54.290Z",
+  "public/raw-mdx/user/page.mdx": "2026-05-12T10:49:54.291Z"
 }
\ No newline at end of file
diff --git a/www/apps/cloud/next.config.mjs b/www/apps/cloud/next.config.mjs
index 245f7fe605636..37ad6c668d12a 100644
--- a/www/apps/cloud/next.config.mjs
+++ b/www/apps/cloud/next.config.mjs
@@ -76,7 +76,8 @@ const withMDX = mdx({
           },
           useBaseUrl:
             process.env.NODE_ENV === "production" ||
-            process.env.VERCEL_ENV === "production",
+            process.env.VERCEL_ENV === "production" ||
+            !!process.env.CLOUDFLARE_ENV,
         },
       ],
       [localLinksRehypePlugin],
@@ -128,11 +129,16 @@ const nextConfig = {
 
   transpilePackages: ["docs-ui"],
   basePath: process.env.NEXT_PUBLIC_BASE_PATH || "/cloud",
+  outputFileTracingRoot: new URL("../../", import.meta.url).pathname,
   outputFileTracingIncludes: {
     "/md\\-content/\\[\\[\\.\\.\\.slug\\]\\]": ["./app/**/*.mdx"],
   },
   outputFileTracingExcludes: {
-    "*": ["node_modules/@medusajs/icons"],
+    "*": [
+      "node_modules/@medusajs/icons",
+      "../**/.open-next/**",
+      "../!(cloud)/.next/**",
+    ],
   },
   experimental: {
     optimizePackageImports: ["@medusajs/icons", "@medusajs/ui"],
@@ -169,6 +175,14 @@ const nextConfig = {
   rewrites: async () => {
     return {
       beforeFiles: [
+        {
+          source: "/index.html.md",
+          destination: "/md-content",
+        },
+        {
+          source: "/index.md",
+          destination: "/md-content",
+        },
         {
           source: "/:path*/index.html.md",
           destination: "/md-content/:path*",
@@ -182,7 +196,7 @@ const nextConfig = {
           destination: "/md-content/:path*",
         },
         {
-          source: "/:path((?!md-content).+)/",
+          source: "/:first((?!md-content)[^/]+)/:rest*/",
           has: [
             {
               type: "header",
@@ -190,7 +204,7 @@ const nextConfig = {
               value: ".*(text/markdown|text/plain).*",
             },
           ],
-          destination: "/md-content/:path",
+          destination: "/md-content/:first/:rest*",
         },
         {
           source: "/",
@@ -204,7 +218,7 @@ const nextConfig = {
           destination: "/md-content",
         },
         {
-          source: "/:path((?!md-content).+)",
+          source: "/:first((?!md-content)[^/]+)/:rest*",
           has: [
             {
               type: "header",
@@ -212,7 +226,7 @@ const nextConfig = {
               value: ".*(text/markdown|text/plain).*",
             },
           ],
-          destination: "/md-content/:path",
+          destination: "/md-content/:first/:rest*",
         },
       ],
     }
diff --git a/www/apps/cloud/open-next.config.ts b/www/apps/cloud/open-next.config.ts
new file mode 100644
index 0000000000000..136ed5f038c45
--- /dev/null
+++ b/www/apps/cloud/open-next.config.ts
@@ -0,0 +1,3 @@
+import { defineCloudflareConfig } from "@opennextjs/cloudflare"
+
+export default defineCloudflareConfig()
diff --git a/www/apps/cloud/package.json b/www/apps/cloud/package.json
index d2584a7f62958..160976ba3bec9 100644
--- a/www/apps/cloud/package.json
+++ b/www/apps/cloud/package.json
@@ -5,24 +5,30 @@
   "scripts": {
     "dev": "yarn prep && next dev",
     "dev:monorepo": "yarn prep && yarn dev -p 3005",
+    "dev:wrangler": "wrangler dev --port 3000",
     "build": "yarn prep && next build",
+    "build:cloudflare": "CF_PAGES=1 yarn prep && opennextjs-cloudflare build",
     "build:dev": "NODE_ENV=test yarn build",
     "start": "next start",
     "start:monorepo": "yarn start -p 3005",
     "lint": "next lint --fix",
     "lint:content": "eslint --no-config-lookup -c .content.eslintrc.mjs app/**/*.mdx --fix",
-    "prep": "node ./scripts/prepare.mjs"
+    "prep": "node ./scripts/prepare.mjs",
+    "preview": "yarn build:cloudflare && opennextjs-cloudflare preview",
+    "deploy": "opennextjs-cloudflare deploy",
+    "upload": "opennextjs-cloudflare upload",
+    "cf-typegen": "wrangler types --env-interface CloudflareEnv cloudflare-env.d.ts"
   },
   "dependencies": {
     "@mdx-js/loader": "^3.1.0",
     "@mdx-js/react": "^3.1.0",
     "@medusajs/icons": "2.15.1",
-    "@next/mdx": "15.3.9",
+    "@next/mdx": "15.5.18",
     "@sanity/client": "^7.11.0",
     "@stefanprobst/rehype-extract-toc": "^3.0.0",
     "clsx": "^2.1.0",
     "docs-ui": "*",
-    "next": "15.3.9",
+    "next": "15.5.18",
     "posthog-js": "^1.298.1",
     "posthog-node": "^5.29.0",
     "react": "19.2.5",
@@ -35,6 +41,7 @@
     "slugify": "^1.6.6"
   },
   "devDependencies": {
+    "@opennextjs/cloudflare": "^1.19.9",
     "@types/mdx": "^2.0.13",
     "@types/node": "^20",
     "@types/react": "19.2.9",
@@ -49,7 +56,8 @@
     "tailwindcss": "^3.3.0",
     "tsconfig": "*",
     "types": "*",
-    "typescript": "^5"
+    "typescript": "^5",
+    "wrangler": "^4.90.0"
   },
   "engines": {
     "node": ">=20"
diff --git a/www/apps/cloud/public/_headers b/www/apps/cloud/public/_headers
new file mode 100644
index 0000000000000..3b460e68fd44e
--- /dev/null
+++ b/www/apps/cloud/public/_headers
@@ -0,0 +1,2 @@
+/_next/static/*
+  Cache-Control: public,max-age=31536000,immutable
diff --git a/www/apps/cloud/scripts/prepare.mjs b/www/apps/cloud/scripts/prepare.mjs
index 325404f5a8d79..49a6da6c8f807 100644
--- a/www/apps/cloud/scripts/prepare.mjs
+++ b/www/apps/cloud/scripts/prepare.mjs
@@ -1,9 +1,20 @@
-import { generateEditedDates, generateSidebar } from "build-scripts"
+import {
+  generateEditedDates,
+  generateSidebar,
+  copyMdxToPublic,
+} from "build-scripts"
 import { sidebar } from "../sidebar.mjs"
+import path from "path"
 
 async function main() {
   await generateSidebar(sidebar)
   await generateEditedDates()
+  if (process.env.CLOUDFLARE_ENV) {
+    await copyMdxToPublic({
+      srcDir: path.join(process.cwd(), "app"),
+      destDir: path.join(process.cwd(), "public", "raw-mdx"),
+    })
+  }
 }
 
 void main()
diff --git a/www/apps/cloud/vercel.json b/www/apps/cloud/vercel.json
deleted file mode 100644
index 2e7064bbe6999..0000000000000
--- a/www/apps/cloud/vercel.json
+++ /dev/null
@@ -1,7 +0,0 @@
-{
-  "framework": "nextjs",
-  "installCommand": "yarn install",
-  "buildCommand": "turbo run build",
-  "outputDirectory": ".next",
-  "ignoreCommand": "bash ../../ignore-build-script.sh cloud"
-}
\ No newline at end of file
diff --git a/www/apps/cloud/wrangler.jsonc b/www/apps/cloud/wrangler.jsonc
new file mode 100644
index 0000000000000..68c0ecdae8489
--- /dev/null
+++ b/www/apps/cloud/wrangler.jsonc
@@ -0,0 +1,20 @@
+{
+  "$schema": "../../node_modules/wrangler/config-schema.json",
+  "name": "medusa-docs-cloud",
+  "main": ".open-next/worker.js",
+  "compatibility_date": "2024-12-30",
+  "compatibility_flags": ["nodejs_compat", "global_fetch_strictly_public"],
+  "assets": {
+    "directory": ".open-next/assets",
+    "binding": "ASSETS"
+  },
+  "services": [
+    {
+      "binding": "WORKER_SELF_REFERENCE",
+      "service": "medusa-docs-cloud"
+    }
+  ],
+  "images": {
+    "binding": "IMAGES"
+  }
+}
diff --git a/www/apps/resources/.env.sample b/www/apps/resources/.env.sample
index 013bf8c619d6f..f8c6e071af36a 100644
--- a/www/apps/resources/.env.sample
+++ b/www/apps/resources/.env.sample
@@ -28,4 +28,14 @@ NEXT_PUBLIC_GA_ID=
 NEXT_PUBLIC_INTEGRATION_ID=
 NEXT_PUBLIC_REO_DEV_CLIENT_ID=
 NEXT_PUBLIC_POSTHOG_KEY=
-NEXT_PUBLIC_POSTHOG_HOST=
\ No newline at end of file
+NEXT_PUBLIC_POSTHOG_HOST=
+
+# CLOUDFLARE DEPLOYMENT
+# Base URL of the R2 bucket where references/ are uploaded (e.g. https://pub-xxx.r2.dev/resources)
+# Required when deploying to Cloudflare; falls back to local filesystem in dev
+REFERENCES_R2_BASE_URL=
+# R2 credentials for the upload:r2 script
+CLOUDFLARE_ACCOUNT_ID=
+CLOUDFLARE_R2_ACCESS_KEY_ID=
+CLOUDFLARE_R2_SECRET_ACCESS_KEY=
+R2_BUCKET_NAME=docs-assets
\ No newline at end of file
diff --git a/www/apps/resources/.gitignore b/www/apps/resources/.gitignore
index d2d32a8843102..11443eb07ea6c 100644
--- a/www/apps/resources/.gitignore
+++ b/www/apps/resources/.gitignore
@@ -28,6 +28,7 @@ yarn-error.log*
 
 # local env files
 .env*.local
+.dev.vars
 
 # vercel
 .vercel
@@ -35,3 +36,10 @@ yarn-error.log*
 # typescript
 *.tsbuildinfo
 next-env.d.ts
+
+sidebar.full.mjs
+
+# cloudflare
+.open-next
+.wrangler
+public/raw-mdx
\ No newline at end of file
diff --git a/www/apps/resources/app/api/references/[...slug]/route.ts b/www/apps/resources/app/api/references/[...slug]/route.ts
index 75873e3625158..939f584871940 100644
--- a/www/apps/resources/app/api/references/[...slug]/route.ts
+++ b/www/apps/resources/app/api/references/[...slug]/route.ts
@@ -1,6 +1,4 @@
 import { unstable_cache } from "next/cache"
-import path from "path"
-import fs from "fs/promises"
 import mdxOptions from "@/mdx-options.mjs"
 import {
   typeListLinkFixerPlugin,
@@ -10,6 +8,8 @@ import {
   recmaInjectMdxDataPlugin,
 } from "remark-rehype-plugins"
 import { serialize } from "next-mdx-remote-client/serialize"
+import path from "path"
+import { workerCompatibleFetch } from "docs-utils"
 
 type GetRouteProps = {
   params: Promise<{
@@ -47,7 +47,7 @@ export async function GET(request: Request, { params }: GetRouteProps) {
 }
 
 const loadReferencesFile = unstable_cache(async (slug: string[]) => {
-  path.join(process.cwd(), "references")
+  const r2Base = process.env.NEXT_PUBLIC_REFERENCES_R2_BASE_URL
   const monoRepoPath = path.resolve("..", "..", "..")
 
   const pathname = `/references/${slug.join("/")}`
@@ -59,14 +59,48 @@ const loadReferencesFile = unstable_cache(async (slug: string[]) => {
   if (!fileDetails) {
     return undefined
   }
-  const fullPath = path.join(monoRepoPath, fileDetails.filePath)
 
-  const fileContent = await fs.readFile(fullPath, "utf-8")
+  // fileDetails.filePath is like /www/apps/resources/references/some/path/page.mdx
+  const relPath = fileDetails.filePath.replace(/^.*\/references\//, "")
+  const r2Url = `${r2Base}/references/${relPath}`
+  const localPath = path.join(monoRepoPath, fileDetails.filePath)
+
+  const fileContent = await workerCompatibleFetch<string | null>({
+    url: r2Url,
+    responseTransformer: async (res) => {
+      return res.ok ? res.text() : null
+    },
+    fallbackAction: async () => {
+      try {
+        const { promises: fs } = await import("fs")
+        return await fs.readFile(localPath, "utf-8")
+      } catch (e) {
+        console.error(e)
+        return null
+      }
+    },
+    useRemote: !!r2Base,
+  })
 
-  const pluginOptions = {
-    filePath: fullPath,
-    basePath: process.cwd(),
+  if (!fileContent) {
+    return undefined
   }
+
+  // On Cloudflare, monoRepoPath is unreliable; use fileDetails.filePath directly
+  // (it starts with /www/...) so path math in the link-fixer plugins is correct.
+  // getFileSlugSync failures are now caught in fixLinkUtil, so fs unavailability
+  // in Workers degrades gracefully to path-based URLs instead of throwing.
+  const pluginOptions = process.env.CLOUDFLARE_ENV
+    ? {
+        filePath: fileDetails.filePath,
+        basePath: "/www/apps/resources",
+        r2BaseUrl: process.env.NEXT_PUBLIC_REFERENCES_R2_BASE_URL,
+      }
+    : {
+        filePath: localPath,
+        basePath: process.cwd(),
+      }
+
   const serialized = await serialize({
     source: fileContent,
     options: {
@@ -109,10 +143,10 @@ const loadReferencesFile = unstable_cache(async (slug: string[]) => {
       },
     },
   })
+
   return {
     serialized,
     content: fileContent,
-    path: fullPath,
   }
 })
 
diff --git a/www/apps/resources/app/md-content/[[...slug]]/route.ts b/www/apps/resources/app/md-content/[[...slug]]/route.ts
index 0e47afa0cd081..e4d16c584361b 100644
--- a/www/apps/resources/app/md-content/[[...slug]]/route.ts
+++ b/www/apps/resources/app/md-content/[[...slug]]/route.ts
@@ -1,9 +1,7 @@
 import { addExtraToMd, getCleanMd } from "docs-utils"
-import { existsSync } from "fs"
 import { unstable_cache } from "next/cache"
 import { notFound } from "next/navigation"
 import { NextRequest, NextResponse } from "next/server"
-import path from "path"
 import {
   addUrlToRelativeLink,
   crossProjectLinksPlugin,
@@ -13,32 +11,33 @@ import type { Plugin } from "unified"
 import { filesMap } from "../../../generated/files-map.mjs"
 import { slugChanges } from "../../../generated/slug-changes.mjs"
 import { PostHog } from "posthog-node"
+import { fetchMdxContent } from "../../../utils/fetch-mdx-content"
 
 type Params = {
-  params: Promise<{ slug: string[] }>
+  params: Promise<{ slug?: string[] }>
 }
 
 export async function GET(req: NextRequest, { params }: Params) {
-  const { slug = ["/"] } = await params
+  const { slug: rawSlug } = await params
+  const slug = rawSlug?.filter(Boolean) ?? []
+  const origin = process.env.NEXT_PUBLIC_BASE_URL || new URL(req.url).origin
+  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ""
 
-  // keep this so that Vercel keeps the files in deployment
-  path.join(process.cwd(), "app")
-  path.join(process.cwd(), "references")
+  const filePathFromMap = await getFileFromMaps(`/${slug.join("/")}`)
 
-  const filePathFromMap = await getFileFromMaps(
-    `/${slug.join("/")}`.replace("//", "/")
-  )
   if (!filePathFromMap) {
     return notFound()
   }
 
-  const filePath = path.join(process.cwd(), "..", "..", "..", filePathFromMap)
-
-  if (!existsSync(filePath)) {
+  const fileContent = await fetchMdxContent(
+    `${origin}${basePath}`,
+    filePathFromMap
+  )
+  if (!fileContent) {
     return notFound()
   }
 
-  const cleanMdContent = await getCleanMd_(filePath, {
+  const cleanMdContent = await getCleanMd_(fileContent, {
     before: [
       [
         crossProjectLinksPlugin,
@@ -61,7 +60,8 @@ export async function GET(req: NextRequest, { params }: Params) {
           },
           useBaseUrl:
             process.env.NODE_ENV === "production" ||
-            process.env.VERCEL_ENV === "production",
+            process.env.VERCEL_ENV === "production" ||
+            !!process.env.CLOUDFLARE_ENV,
         },
       ],
       [localLinksRehypePlugin],
@@ -111,8 +111,8 @@ export async function GET(req: NextRequest, { params }: Params) {
 }
 
 const getCleanMd_ = unstable_cache(
-  async (filePath: string, plugins?: { before?: Plugin[]; after?: Plugin[] }) =>
-    getCleanMd({ file: filePath, plugins }),
+  async (content: string, plugins?: { before?: Plugin[]; after?: Plugin[] }) =>
+    getCleanMd({ file: content, type: "content", plugins }),
   ["clean-md"],
   {
     revalidate: 3600,
diff --git a/www/apps/resources/app/references/[...slug]/page.tsx b/www/apps/resources/app/references/[...slug]/page.tsx
index 27b50c81d2251..5a74af81d1000 100644
--- a/www/apps/resources/app/references/[...slug]/page.tsx
+++ b/www/apps/resources/app/references/[...slug]/page.tsx
@@ -1,9 +1,8 @@
 import { cache } from "react"
-import path from "path"
-import fs from "fs/promises"
 import { ReferenceMDX } from "../../../components/ReferenceMDX"
 import { Metadata } from "next"
-import { getFrontMatterFromString } from "docs-utils"
+import { getFrontMatterFromString, workerCompatibleFetch } from "docs-utils"
+import path from "path"
 
 type PageProps = {
   params: Promise<{
@@ -45,12 +44,10 @@ export async function generateMetadata({
 
 export type LoadedReferenceFile = {
   content: string
-  path: string
 }
 
 const loadReferencesFile = cache(
   async (slug: string[]): Promise<LoadedReferenceFile | undefined> => {
-    path.join(process.cwd(), "references")
     const monoRepoPath = path.resolve("..", "..", "..")
 
     const pathname = `/references/${slug.join("/")}`
@@ -63,13 +60,34 @@ const loadReferencesFile = cache(
     if (!fileDetails) {
       return undefined
     }
-    const fullPath = path.join(monoRepoPath, fileDetails.filePath)
 
-    const fileContent = await fs.readFile(fullPath, "utf-8")
+    const r2Base = process.env.NEXT_PUBLIC_REFERENCES_R2_BASE_URL
+    const fileContent = await workerCompatibleFetch<string | null>({
+      url: `${r2Base}/references/${fileDetails.filePath.replace(
+        /^.*\/references\//,
+        ""
+      )}`,
+      responseTransformer: async (res) => {
+        return res.ok ? res.text() : null
+      },
+      fallbackAction: async () => {
+        try {
+          const { promises: fs } = await import("fs")
+          const fullPath = path.join(monoRepoPath, fileDetails.filePath)
+          return await fs.readFile(fullPath, "utf-8")
+        } catch {
+          return null
+        }
+      },
+      useRemote: !!r2Base,
+    })
+
+    if (!fileContent) {
+      return undefined
+    }
 
     return {
       content: fileContent,
-      path: fullPath,
     }
   }
 )
diff --git a/www/apps/resources/mdx-options.mjs b/www/apps/resources/mdx-options.mjs
index 8f226a29ce72a..b30c76d52134c 100644
--- a/www/apps/resources/mdx-options.mjs
+++ b/www/apps/resources/mdx-options.mjs
@@ -41,7 +41,8 @@ const mdxPluginOptions = {
           },
           useBaseUrl:
             process.env.NODE_ENV === "production" ||
-            process.env.VERCEL_ENV === "production",
+            process.env.VERCEL_ENV === "production" ||
+            !!process.env.CLOUDFLARE_ENV,
         },
       ],
       [
diff --git a/www/apps/resources/next.config.mjs b/www/apps/resources/next.config.mjs
index a32359d3dd833..4d8d80e2717a2 100644
--- a/www/apps/resources/next.config.mjs
+++ b/www/apps/resources/next.config.mjs
@@ -281,8 +281,13 @@ const nextConfig = {
       },
     ])
   },
+  outputFileTracingRoot: new URL("../../", import.meta.url).pathname,
   outputFileTracingExcludes: {
-    "*": ["node_modules/@medusajs/icons"],
+    "*": [
+      "node_modules/@medusajs/icons",
+      "../**/.open-next/**",
+      "../!(resources)/.next/**",
+    ],
   },
   outputFileTracingIncludes: {
     "/md\\-content/\\[\\[\\.\\.\\.slug\\]\\]": ["./app/**/*.mdx"],
@@ -294,6 +299,14 @@ const nextConfig = {
   rewrites: async () => {
     return {
       beforeFiles: [
+        {
+          source: "/index.html.md",
+          destination: "/md-content",
+        },
+        {
+          source: "/index.md",
+          destination: "/md-content",
+        },
         {
           source: "/:path*/index.html.md",
           destination: "/md-content/:path*",
@@ -307,7 +320,7 @@ const nextConfig = {
           destination: "/md-content/:path*",
         },
         {
-          source: "/:path((?!md-content).+)/",
+          source: "/:first((?!md-content)[^/]+)/:rest*/",
           has: [
             {
               type: "header",
@@ -315,7 +328,7 @@ const nextConfig = {
               value: ".*(text/markdown|text/plain).*",
             },
           ],
-          destination: "/md-content/:path",
+          destination: "/md-content/:first/:rest*",
         },
         {
           source: "/",
@@ -329,7 +342,7 @@ const nextConfig = {
           destination: "/md-content",
         },
         {
-          source: "/:path((?!md-content).+)",
+          source: "/:first((?!md-content)[^/]+)/:rest*",
           has: [
             {
               type: "header",
@@ -337,7 +350,7 @@ const nextConfig = {
               value: ".*(text/markdown|text/plain).*",
             },
           ],
-          destination: "/md-content/:path",
+          destination: "/md-content/:first/:rest*",
         },
       ],
     }
diff --git a/www/apps/resources/open-next.config.ts b/www/apps/resources/open-next.config.ts
new file mode 100644
index 0000000000000..136ed5f038c45
--- /dev/null
+++ b/www/apps/resources/open-next.config.ts
@@ -0,0 +1,3 @@
+import { defineCloudflareConfig } from "@opennextjs/cloudflare"
+
+export default defineCloudflareConfig()
diff --git a/www/apps/resources/package.json b/www/apps/resources/package.json
index 3236af41acecb..1972e584f0e42 100644
--- a/www/apps/resources/package.json
+++ b/www/apps/resources/package.json
@@ -5,23 +5,30 @@
   "scripts": {
     "dev": "next dev",
     "dev:monorepo": "yarn dev -p 3003",
+    "dev:wrangler": "wrangler dev --port 3000",
     "build": "next build",
+    "build:cloudflare": "CF_PAGES=1 yarn prep && NEXT_PUBLIC_ENV=production opennextjs-cloudflare build",
     "start": "next start",
     "start:monorepo": "yarn start -p 3003",
     "lint": "next lint --fix",
     "lint:content": "eslint --no-config-lookup -c .content.eslintrc.mjs app/**/*.mdx --fix",
     "prep": "node ./scripts/prepare.mjs",
-    "prep:turbo": "npx turbo run prep"
+    "prep:turbo": "npx turbo run prep",
+    "upload:r2": "node ./scripts/upload-references-to-r2.mjs",
+    "preview": "yarn build:cloudflare && opennextjs-cloudflare preview",
+    "deploy": "opennextjs-cloudflare deploy",
+    "upload": "opennextjs-cloudflare upload",
+    "cf-typegen": "wrangler types --env-interface CloudflareEnv cloudflare-env.d.ts"
   },
   "dependencies": {
     "@mdx-js/loader": "^3.1.0",
     "@mdx-js/react": "^3.1.0",
     "@medusajs/icons": "2.15.1",
-    "@next/mdx": "15.3.9",
+    "@next/mdx": "15.5.18",
     "@stefanprobst/rehype-extract-toc": "^3.0.0",
     "clsx": "^2.1.0",
     "docs-ui": "*",
-    "next": "15.3.9",
+    "next": "15.5.18",
     "next-mdx-remote-client": "2",
     "posthog-js": "^1.298.1",
     "posthog-node": "^5.29.0",
@@ -33,7 +40,9 @@
     "swr": "^2.3.6"
   },
   "devDependencies": {
-    "@next/bundle-analyzer": "15.3.9",
+    "@aws-sdk/client-s3": "^3",
+    "@next/bundle-analyzer": "15.5.18",
+    "@opennextjs/cloudflare": "^1.19.9",
     "@types/mdx": "^2.0.13",
     "@types/node": "^20",
     "@types/react": "19.2.9",
@@ -44,6 +53,7 @@
     "eslint": "^9.13.0",
     "eslint-plugin-prettier": "^5.2.1",
     "eslint-plugin-react-hooks": "^5.0.0",
+    "mime-types": "^3",
     "postcss": "^8",
     "remark-rehype-plugins": "*",
     "tags": "*",
@@ -52,7 +62,8 @@
     "ts-node": "^10.9.2",
     "tsconfig": "*",
     "types": "*",
-    "typescript": "^5"
+    "typescript": "^5",
+    "wrangler": "^4.90.0"
   },
   "engines": {
     "node": ">=20"
diff --git a/www/apps/resources/public/_headers b/www/apps/resources/public/_headers
new file mode 100644
index 0000000000000..3b460e68fd44e
--- /dev/null
+++ b/www/apps/resources/public/_headers
@@ -0,0 +1,2 @@
+/_next/static/*
+  Cache-Control: public,max-age=31536000,immutable
diff --git a/www/apps/resources/scripts/prepare.mjs b/www/apps/resources/scripts/prepare.mjs
index 4cc090e641ae3..cc39155e32b5a 100644
--- a/www/apps/resources/scripts/prepare.mjs
+++ b/www/apps/resources/scripts/prepare.mjs
@@ -1,7 +1,12 @@
-import { generateEditedDates, generateSplitSidebars } from "build-scripts"
+import {
+  generateEditedDates,
+  generateSplitSidebars,
+  copyMdxToPublic,
+} from "build-scripts"
 import { main as generateSlugChanges } from "./generate-slug-changes.mjs"
 import { main as generateFilesMap } from "./generate-files-map.mjs"
 import { sidebar } from "../sidebar.mjs"
+import path from "path"
 
 async function main() {
   await generateSplitSidebars({
@@ -10,6 +15,12 @@ async function main() {
   await generateSlugChanges()
   await generateFilesMap()
   await generateEditedDates()
+  if (!!process.env.CLOUDFLARE_ENV) {
+    await copyMdxToPublic({
+      srcDir: path.join(process.cwd(), "app"),
+      destDir: path.join(process.cwd(), "public", "raw-mdx"),
+    })
+  }
 }
 
 void main()
diff --git a/www/apps/resources/scripts/upload-references-to-r2.mjs b/www/apps/resources/scripts/upload-references-to-r2.mjs
new file mode 100644
index 0000000000000..3d68d68b02c6e
--- /dev/null
+++ b/www/apps/resources/scripts/upload-references-to-r2.mjs
@@ -0,0 +1,149 @@
+/* eslint-disable no-console */
+/**
+ * Uploads references/ to Cloudflare R2.
+ *
+ * Usage:
+ *   node ./scripts/upload-references-to-r2.mjs
+ *     Full upload of references/ directory.
+ *
+ *   node ./scripts/upload-references-to-r2.mjs --upload references/js-client/foo.mdx
+ *     Upload only the listed files (paths relative to app root).
+ *
+ *   node ./scripts/upload-references-to-r2.mjs --remove references/js-client/old.mdx
+ *     Remove the listed keys from R2 (paths relative to app root).
+ *
+ *   --upload and --remove can be combined in a single invocation.
+ *
+ * Required env vars:
+ *   CLOUDFLARE_ACCOUNT_ID
+ *   CLOUDFLARE_R2_ACCESS_KEY_ID
+ *   CLOUDFLARE_R2_SECRET_ACCESS_KEY
+ *   R2_BUCKET_NAME (default: docs-assets)
+ */
+
+// Load .env if present; silently skip if not (e.g. CI injects vars directly)
+try {
+  process.loadEnvFile()
+} catch {
+  /* no .env file */
+}
+
+import {
+  S3Client,
+  PutObjectCommand,
+  DeleteObjectCommand,
+} from "@aws-sdk/client-s3"
+import { readFile, readdir } from "fs/promises"
+import path from "path"
+import { lookup as mimeLookup } from "mime-types"
+
+const accountId = process.env.CLOUDFLARE_ACCOUNT_ID
+const accessKeyId = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID
+const secretAccessKey = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY
+const bucket = process.env.R2_BUCKET_NAME || "docs-assets"
+
+if (!accountId || !accessKeyId || !secretAccessKey) {
+  console.error(
+    "Missing required env vars: CLOUDFLARE_ACCOUNT_ID, CLOUDFLARE_R2_ACCESS_KEY_ID, CLOUDFLARE_R2_SECRET_ACCESS_KEY"
+  )
+  process.exit(1)
+}
+
+const client = new S3Client({
+  region: "auto",
+  endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
+  credentials: { accessKeyId, secretAccessKey },
+})
+
+// Parse --upload and --remove CLI flags
+const args = process.argv.slice(2)
+const filesToUpload = []
+const filesToRemove = []
+let mode = null
+
+for (const arg of args) {
+  if (arg === "--upload") {
+    mode = "upload"
+    continue
+  }
+  if (arg === "--remove") {
+    mode = "remove"
+    continue
+  }
+  if (arg.startsWith("--")) {
+    mode = null
+    continue
+  }
+  if (mode === "upload") {
+    filesToUpload.push(arg)
+  }
+  if (mode === "remove") {
+    filesToRemove.push(arg)
+  }
+}
+
+const isSelective = filesToUpload.length > 0 || filesToRemove.length > 0
+
+// --- helpers ---
+
+async function uploadFile(localPath, r2Key) {
+  const body = await readFile(localPath)
+  const contentType = mimeLookup(path.basename(localPath)) || "text/plain"
+  await client.send(
+    new PutObjectCommand({
+      Bucket: bucket,
+      Key: r2Key,
+      Body: body,
+      ContentType: contentType,
+    })
+  )
+  console.log(`  uploaded: ${r2Key}`)
+}
+
+async function removeFile(r2Key) {
+  await client.send(new DeleteObjectCommand({ Bucket: bucket, Key: r2Key }))
+  console.log(`  removed: ${r2Key}`)
+}
+
+async function uploadDir(localDir, r2Prefix) {
+  const entries = await readdir(localDir, { withFileTypes: true })
+  for (const entry of entries) {
+    if (entry.isFile() && entry.name !== "page.mdx") {
+      continue
+    }
+    const localPath = path.join(localDir, entry.name)
+    const r2Key = `${r2Prefix}/${entry.name}`
+    if (entry.isDirectory()) {
+      await uploadDir(localPath, r2Key)
+    } else {
+      await uploadFile(localPath, r2Key)
+    }
+  }
+}
+
+// --- main ---
+
+if (isSelective) {
+  for (const relPath of filesToUpload) {
+    if (path.basename(relPath) !== "page.mdx") {
+      console.log(`  skipped (not page.mdx): ${relPath}`)
+      continue
+    }
+    await uploadFile(path.join(process.cwd(), relPath), `resources/${relPath}`)
+  }
+  for (const relPath of filesToRemove) {
+    if (path.basename(relPath) !== "page.mdx") {
+      console.log(`  skipped (not page.mdx): ${relPath}`)
+      continue
+    }
+    await removeFile(`resources/${relPath}`)
+  }
+} else {
+  const referencesDir = path.join(process.cwd(), "references")
+  console.log(
+    `Uploading ${referencesDir} → r2://${bucket}/resources/references`
+  )
+  await uploadDir(referencesDir, "resources/references")
+}
+
+console.log("Done.")
diff --git a/www/apps/resources/utils/fetch-mdx-content.ts b/www/apps/resources/utils/fetch-mdx-content.ts
new file mode 100644
index 0000000000000..51833bc79375f
--- /dev/null
+++ b/www/apps/resources/utils/fetch-mdx-content.ts
@@ -0,0 +1,54 @@
+import { workerCompatibleFetch } from "docs-utils"
+import path from "path"
+
+export async function fetchMdxContent(
+  baseUrl: string,
+  filePathFromMap: string
+): Promise<string | null> {
+  const isCloudflare = !!process.env.CLOUDFLARE_ENV
+  // References files come from R2, so we need to fetch them directly from R2 instead of going through the app route
+  if (filePathFromMap.includes("/references/")) {
+    const r2Base = process.env.REFERENCES_R2_BASE_URL
+    const relPath = filePathFromMap.replace(/^.*\/references\//, "")
+    return await workerCompatibleFetch<string | null>({
+      url: `${r2Base}/references/${relPath}`,
+      responseTransformer: async (res) => {
+        return res.ok ? res.text() : null
+      },
+      fallbackAction: async () => {
+        try {
+          const { promises: fs } = await import("fs")
+          const relPath = filePathFromMap.replace(/^.*\/references\//, "")
+          return await fs.readFile(
+            path.join(process.cwd(), "references", relPath),
+            "utf-8"
+          )
+        } catch {
+          return null
+        }
+      },
+      useRemote: isCloudflare,
+    })
+  }
+
+  // app/ pages: derive app-relative path and use workerCompatibleFetch
+  const relPath = filePathFromMap.replace(/^.*\/app\//, "")
+  return workerCompatibleFetch<string | null>({
+    url: `${baseUrl}/raw-mdx/${relPath}`,
+    responseTransformer: async (res) => {
+      return res.ok ? res.text() : null
+    },
+    fallbackAction: async () => {
+      try {
+        const { promises: fs } = await import("fs")
+        return await fs.readFile(
+          path.join(process.cwd(), "app", relPath),
+          "utf-8"
+        )
+      } catch {
+        return null
+      }
+    },
+    useRemote: isCloudflare,
+  })
+}
diff --git a/www/apps/resources/vercel.json b/www/apps/resources/vercel.json
deleted file mode 100644
index 63d5392e2e0f3..0000000000000
--- a/www/apps/resources/vercel.json
+++ /dev/null
@@ -1,7 +0,0 @@
-{
-  "framework": "nextjs",
-  "installCommand": "yarn install",
-  "buildCommand": "turbo run build",
-  "outputDirectory": ".next",
-  "ignoreCommand": "bash ../../ignore-build-script.sh resources"
-}
\ No newline at end of file
diff --git a/www/apps/resources/wrangler.jsonc b/www/apps/resources/wrangler.jsonc
new file mode 100644
index 0000000000000..1e170efa5ab5b
--- /dev/null
+++ b/www/apps/resources/wrangler.jsonc
@@ -0,0 +1,20 @@
+{
+  "$schema": "../../node_modules/wrangler/config-schema.json",
+  "name": "medusa-docs-resources",
+  "main": ".open-next/worker.js",
+  "compatibility_date": "2024-12-30",
+  "compatibility_flags": ["nodejs_compat", "global_fetch_strictly_public"],
+  "assets": {
+    "directory": ".open-next/assets",
+    "binding": "ASSETS"
+  },
+  "services": [
+    {
+      "binding": "WORKER_SELF_REFERENCE",
+      "service": "medusa-docs-resources"
+    }
+  ],
+  "images": {
+    "binding": "IMAGES"
+  }
+}
diff --git a/www/apps/ui/.env.example b/www/apps/ui/.env.example
index ba4add29dcb0c..54767ff49043c 100644
--- a/www/apps/ui/.env.example
+++ b/www/apps/ui/.env.example
@@ -24,4 +24,14 @@ NEXT_PUBLIC_GA_ID=
 NEXT_PUBLIC_INTEGRATION_ID=
 NEXT_PUBLIC_REO_DEV_CLIENT_ID=
 NEXT_PUBLIC_POSTHOG_KEY=
-NEXT_PUBLIC_POSTHOG_HOST=
\ No newline at end of file
+NEXT_PUBLIC_POSTHOG_HOST=
+
+# CLOUDFLARE DEPLOYMENT
+# Base URL of the R2 bucket where specs/ are uploaded (e.g. https://pub-xxx.r2.dev/ui)
+# Required when deploying to Cloudflare; falls back to local filesystem in dev
+UI_SPECS_R2_BASE_URL=
+# R2 credentials for the upload:r2 script
+CLOUDFLARE_ACCOUNT_ID=
+CLOUDFLARE_R2_ACCESS_KEY_ID=
+CLOUDFLARE_R2_SECRET_ACCESS_KEY=
+R2_BUCKET_NAME=docs-assets
\ No newline at end of file
diff --git a/www/apps/ui/.gitignore b/www/apps/ui/.gitignore
index fd3dbb571a12a..6927538c1efb6 100644
--- a/www/apps/ui/.gitignore
+++ b/www/apps/ui/.gitignore
@@ -27,6 +27,7 @@ yarn-error.log*
 
 # local env files
 .env*.local
+.dev.vars
 
 # vercel
 .vercel
@@ -34,3 +35,10 @@ yarn-error.log*
 # typescript
 *.tsbuildinfo
 next-env.d.ts
+
+sidebar.full.mjs
+
+# cloudflare
+.open-next
+.wrangler
+public/raw-mdx
\ No newline at end of file
diff --git a/www/apps/ui/app/md-content/[[...slug]]/route.ts b/www/apps/ui/app/md-content/[[...slug]]/route.ts
index 5c98b3c896e94..725f1eb4db444 100644
--- a/www/apps/ui/app/md-content/[[...slug]]/route.ts
+++ b/www/apps/ui/app/md-content/[[...slug]]/route.ts
@@ -1,5 +1,4 @@
-import { addExtraToMd, getCleanMd } from "docs-utils"
-import { existsSync } from "fs"
+import { addExtraToMd, getCleanMd, workerCompatibleFetch } from "docs-utils"
 import { unstable_cache } from "next/cache"
 import { notFound } from "next/navigation"
 import { NextRequest, NextResponse } from "next/server"
@@ -12,25 +11,51 @@ import { colors as allColors } from "@/config/colors"
 import { PostHog } from "posthog-node"
 
 type Params = {
-  params: Promise<{ slug: string[] }>
+  params: Promise<{ slug?: string[] }>
 }
 
 export async function GET(req: NextRequest, { params }: Params) {
-  const { slug = ["/"] } = await params
+  const { slug: rawSlug } = await params
+  const slug = rawSlug?.filter(Boolean) ?? []
 
-  // keep this so that Vercel keeps the files in deployment
-  const basePath = path.join(process.cwd(), "app")
-  const componentSpecsPath = path.join(process.cwd(), "specs", "components")
-  const examplesPath = path.join(process.cwd(), "specs", "examples")
-  const filePath = path.join(basePath, ...slug, "page.mdx")
+  const origin = process.env.NEXT_PUBLIC_BASE_URL || new URL(req.url).origin
+  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ""
 
-  if (!existsSync(filePath)) {
+  const fileContent = await workerCompatibleFetch<string | null>({
+    url: `${origin}${basePath}/raw-mdx/${[...slug, "page.mdx"].join("/")}`,
+    responseTransformer: async (res) => {
+      return res.ok ? res.text() : null
+    },
+    fallbackAction: async () => {
+      try {
+        const { promises: fs } = await import("fs")
+        return await fs.readFile(
+          path.join(process.cwd(), "app", ...slug, "page.mdx"),
+          "utf-8"
+        )
+      } catch {
+        return null
+      }
+    },
+    useRemote: !!process.env.CLOUDFLARE_ENV,
+  })
+
+  if (!fileContent) {
     return notFound()
   }
 
+  const specsR2Base = process.env.UI_SPECS_R2_BASE_URL
+
   const cleanMdContent = await getCleanMd_(
-    filePath,
-    { examplesPath, specsPath: componentSpecsPath },
+    fileContent,
+    {
+      examplesPath: specsR2Base
+        ? `${specsR2Base}/specs/examples`
+        : path.join(process.cwd(), "specs", "examples"),
+      specsPath: specsR2Base
+        ? `${specsR2Base}/specs/components`
+        : path.join(process.cwd(), "specs", "components"),
+    },
     {
       after: [
         [addUrlToRelativeLink, { url: process.env.NEXT_PUBLIC_BASE_URL }],
@@ -79,7 +104,7 @@ export async function GET(req: NextRequest, { params }: Params) {
 
 const getCleanMd_ = unstable_cache(
   async (
-    filePath: string,
+    content: string,
     parserOptions: {
       examplesPath: string
       specsPath: string
@@ -89,7 +114,8 @@ const getCleanMd_ = unstable_cache(
     const iconNames = Object.keys(Icons).filter((name) => name !== "default")
 
     return getCleanMd({
-      file: filePath,
+      file: content,
+      type: "content",
       plugins,
       parserOptions: {
         ComponentExample: {
diff --git a/www/apps/ui/generated/components-index.mjs b/www/apps/ui/generated/components-index.mjs
new file mode 100644
index 0000000000000..5b4dcd45eb784
--- /dev/null
+++ b/www/apps/ui/generated/components-index.mjs
@@ -0,0 +1,83 @@
+/**
+ * @type {Record<string, string[]>}
+ */
+export const ComponentSpecsIndex = {
+  "Alert": ["Alert.json"],
+  "Avatar": ["Avatar.json"],
+  "Badge": ["Badge.json"],
+  "Button": ["Button.json"],
+  "Calendar": ["Calendar.json"],
+  "CalendarButton": ["CalendarButton.json"],
+  "CalendarCell": ["CalendarCell.json"],
+  "CalendarGrid": ["CalendarGrid.json"],
+  "Checkbox": ["Checkbox.json"],
+  "Code": ["Code.json"],
+  "CodeBlock": ["CodeBlock.Body.json", "CodeBlock.Header.Meta.json", "CodeBlock.Header.json", "CodeBlock.json"],
+  "Command": ["Command.Copy.json", "Command.json"],
+  "CommandBar": ["CommandBar.Bar.json", "CommandBar.Command.json", "CommandBar.Seperator.json", "CommandBar.Value.json", "CommandBar.json"],
+  "Container": ["Container.json"],
+  "Copy": ["Copy.json"],
+  "CurrencyInput": ["CurrencyInput.json"],
+  "DataTable": ["DataTable.ActionCell.json", "DataTable.CommandBar.json", "DataTable.Filter.json", "DataTable.FilterBar.json", "DataTable.FilterMenu.json", "DataTable.Pagination.json", "DataTable.Search.json", "DataTable.SelectCell.json", "DataTable.SortingIcon.json", "DataTable.SortingMenu.json", "DataTable.Table.json", "DataTable.json"],
+  "DataTableColumnVisibilityMenu": ["DataTableColumnVisibilityMenu.json"],
+  "DataTableContextProvider": ["DataTableContextProvider.json"],
+  "DataTableEmptyStateDisplay": ["DataTableEmptyStateDisplay.json"],
+  "DataTableFilterBarSkeleton": ["DataTableFilterBarSkeleton.json"],
+  "DataTableFilterCustomContent": ["DataTableFilterCustomContent.json"],
+  "DataTableFilterDateContent": ["DataTableFilterDateContent.json"],
+  "DataTableFilterMenuSkeleton": ["DataTableFilterMenuSkeleton.json"],
+  "DataTableFilterMultiselectContent": ["DataTableFilterMultiselectContent.json"],
+  "DataTableFilterNumberContent": ["DataTableFilterNumberContent.json"],
+  "DataTableFilterRadioContent": ["DataTableFilterRadioContent.json"],
+  "DataTableFilterSelectContent": ["DataTableFilterSelectContent.json"],
+  "DataTableFilterStringContent": ["DataTableFilterStringContent.json"],
+  "DataTableNonSortableHeaderCell": ["DataTableNonSortableHeaderCell.json"],
+  "DataTablePaginationSkeleton": ["DataTablePaginationSkeleton.json"],
+  "DataTableSearchSkeleton": ["DataTableSearchSkeleton.json"],
+  "DataTableSelectHeader": ["DataTableSelectHeader.json"],
+  "DataTableSortableHeaderCell": ["DataTableSortableHeaderCell.json"],
+  "DataTableSortingMenuSkeleton": ["DataTableSortingMenuSkeleton.json"],
+  "DataTableTableSkeleton": ["DataTableTableSkeleton.json"],
+  "DataTableToolbar": ["DataTableToolbar.json"],
+  "DatePicker": ["DatePicker.json"],
+  "DatePickerButton": ["DatePickerButton.json"],
+  "DatePickerClearButton": ["DatePickerClearButton.json"],
+  "DatePickerField": ["DatePickerField.json"],
+  "DateSegment": ["DateSegment.json"],
+  "DefaultEmptyStateContent": ["DefaultEmptyStateContent.json"],
+  "Divider": ["Divider.json"],
+  "Drawer": ["Drawer.Body.json", "Drawer.Close.json", "Drawer.Content.json", "Drawer.Description.json", "Drawer.Footer.json", "Drawer.Header.json", "Drawer.Overlay.json", "Drawer.Portal.json", "Drawer.Title.json", "Drawer.Trigger.json", "Drawer.json"],
+  "DropdownMenu": ["DropdownMenu.CheckboxItem.json", "DropdownMenu.Content.json", "DropdownMenu.Group.json", "DropdownMenu.Hint.json", "DropdownMenu.Item.json", "DropdownMenu.Label.json", "DropdownMenu.RadioGroup.json", "DropdownMenu.RadioItem.json", "DropdownMenu.Separator.json", "DropdownMenu.Shortcut.json", "DropdownMenu.SubMenu.json", "DropdownMenu.SubMenuContent.json", "DropdownMenu.SubMenuTrigger.json", "DropdownMenu.Trigger.json", "DropdownMenu.json"],
+  "FocusModal": ["FocusModal.Body.json", "FocusModal.Close.json", "FocusModal.Content.json", "FocusModal.Description.json", "FocusModal.Footer.json", "FocusModal.Header.json", "FocusModal.Overlay.json", "FocusModal.Portal.json", "FocusModal.Title.json", "FocusModal.Trigger.json", "FocusModal.json"],
+  "Heading": ["Heading.json"],
+  "Hint": ["Hint.json"],
+  "I18nProvider": ["I18nProvider.json"],
+  "IconBadge": ["IconBadge.json"],
+  "IconButton": ["IconButton.json"],
+  "InlineTip": ["InlineTip.json"],
+  "Input": ["Input.json"],
+  "InternalCalendar": ["InternalCalendar.json"],
+  "Kbd": ["Kbd.json"],
+  "Label": ["Label.json"],
+  "OptionButton": ["OptionButton.json"],
+  "Popover": ["Popover.Anchor.json", "Popover.Close.json", "Popover.Content.json", "Popover.Seperator.json", "Popover.Trigger.json", "Popover.json"],
+  "ProgressAccordion": ["ProgressAccordion.Content.json", "ProgressAccordion.Header.json", "ProgressAccordion.Item.json", "ProgressAccordion.ProgressIndicator.json", "ProgressAccordion.json"],
+  "ProgressTabs": ["ProgressTabs.Content.json", "ProgressTabs.List.json", "ProgressTabs.ProgressIndicator.json", "ProgressTabs.Trigger.json", "ProgressTabs.json"],
+  "Prompt": ["Prompt.Action.json", "Prompt.Cancel.json", "Prompt.Content.json", "Prompt.Description.json", "Prompt.Footer.json", "Prompt.Header.json", "Prompt.Overlay.json", "Prompt.Portal.json", "Prompt.Title.json", "Prompt.Trigger.json", "Prompt.json"],
+  "PromptProvider": ["PromptProvider.json"],
+  "RadioGroup": ["RadioGroup.ChoiceBox.json", "RadioGroup.Indicator.json", "RadioGroup.Item.json", "RadioGroup.json"],
+  "RenderPrompt": ["RenderPrompt.json"],
+  "Select": ["Select.Content.json", "Select.Group.json", "Select.Item.json", "Select.Label.json", "Select.Separator.json", "Select.Trigger.json", "Select.Value.json", "Select.json"],
+  "Skeleton": ["Skeleton.json"],
+  "StatusBadge": ["StatusBadge.json"],
+  "Switch": ["Switch.json"],
+  "Table": ["Table.Body.json", "Table.Cell.json", "Table.Header.json", "Table.HeaderCell.json", "Table.Pagination.json", "Table.Row.json", "Table.json"],
+  "Tabs": ["Tabs.Content.json", "Tabs.List.json", "Tabs.Trigger.json", "Tabs.json"],
+  "Text": ["Text.json"],
+  "Textarea": ["Textarea.json"],
+  "TimeInput": ["TimeInput.json"],
+  "Toast": ["Toast.json"],
+  "Toaster": ["Toaster.json"],
+  "Tooltip": ["Tooltip.json"],
+  "TooltipProvider": ["TooltipProvider.json"],
+}
diff --git a/www/apps/ui/next.config.mjs b/www/apps/ui/next.config.mjs
index 0516c88a5d198..5c746d691cd5a 100644
--- a/www/apps/ui/next.config.mjs
+++ b/www/apps/ui/next.config.mjs
@@ -19,6 +19,7 @@ import {
 import bundleAnalyzer from "@next/bundle-analyzer"
 import withExtractedTableOfContents from "@stefanprobst/rehype-extract-toc"
 import { ExampleRegistry } from "./specs/examples.mjs"
+import { ComponentSpecsIndex } from "./generated/components-index.mjs"
 
 const withMDX = mdx({
   extension: /\.mdx?$/,
@@ -78,7 +79,8 @@ const withMDX = mdx({
           },
           useBaseUrl:
             process.env.NODE_ENV === "production" ||
-            process.env.VERCEL_ENV === "production",
+            process.env.VERCEL_ENV === "production" ||
+            !!process.env.CLOUDFLARE_ENV,
         },
       ],
       [localLinksRehypePlugin],
@@ -115,6 +117,8 @@ const withMDX = mdx({
         uiRehypePlugin,
         {
           exampleRegistry: ExampleRegistry,
+          specsIndex: ComponentSpecsIndex,
+          specsBaseUrl: process.env.UI_SPECS_R2_BASE_URL,
         },
       ],
     ],
@@ -136,6 +140,7 @@ const nextConfig = {
 
   transpilePackages: ["docs-ui"],
   basePath: process.env.NEXT_PUBLIC_BASE_PATH || "/ui",
+  outputFileTracingRoot: new URL("../../", import.meta.url).pathname,
   outputFileTracingIncludes: {
     "/md\\-content/\\[\\[\\.\\.\\.slug\\]\\]": [
       "./app/**/*.mdx",
@@ -144,7 +149,11 @@ const nextConfig = {
     ],
   },
   outputFileTracingExcludes: {
-    "*": ["node_modules/@medusajs/icons"],
+    "*": [
+      "node_modules/@medusajs/icons",
+      "../**/.open-next/**",
+      "../!(ui)/.next/**",
+    ],
   },
   experimental: {
     optimizePackageImports: ["@medusajs/icons", "@medusajs/ui"],
@@ -152,6 +161,14 @@ const nextConfig = {
   rewrites: async () => {
     return {
       beforeFiles: [
+        {
+          source: "/index.html.md",
+          destination: "/md-content",
+        },
+        {
+          source: "/index.md",
+          destination: "/md-content",
+        },
         {
           source: "/:path*/index.html.md",
           destination: "/md-content/:path*",
@@ -165,7 +182,7 @@ const nextConfig = {
           destination: "/md-content/:path*",
         },
         {
-          source: "/:path((?!md-content).+)/",
+          source: "/:first((?!md-content)[^/]+)/:rest*/",
           has: [
             {
               type: "header",
@@ -173,7 +190,7 @@ const nextConfig = {
               value: ".*(text/markdown|text/plain).*",
             },
           ],
-          destination: "/md-content/:path",
+          destination: "/md-content/:first/:rest*",
         },
         {
           source: "/",
@@ -187,7 +204,7 @@ const nextConfig = {
           destination: "/md-content",
         },
         {
-          source: "/:path((?!md-content).+)",
+          source: "/:first((?!md-content)[^/]+)/:rest*",
           has: [
             {
               type: "header",
@@ -195,7 +212,7 @@ const nextConfig = {
               value: ".*(text/markdown|text/plain).*",
             },
           ],
-          destination: "/md-content/:path",
+          destination: "/md-content/:first/:rest*",
         },
       ],
     }
diff --git a/www/apps/ui/open-next.config.ts b/www/apps/ui/open-next.config.ts
new file mode 100644
index 0000000000000..136ed5f038c45
--- /dev/null
+++ b/www/apps/ui/open-next.config.ts
@@ -0,0 +1,3 @@
+import { defineCloudflareConfig } from "@opennextjs/cloudflare"
+
+export default defineCloudflareConfig()
diff --git a/www/apps/ui/package.json b/www/apps/ui/package.json
index 413865d3b4d08..90694e9041aa0 100644
--- a/www/apps/ui/package.json
+++ b/www/apps/ui/package.json
@@ -6,12 +6,19 @@
     "dev": "next dev",
     "dev:monorepo": "yarn prep && yarn dev -p 3005",
     "build": "yarn prep && next build",
+    "dev:wrangler": "wrangler dev --port 3000",
+    "build:cloudflare": "CF_PAGES=1 yarn prep && opennextjs-cloudflare build",
     "build:dev": "NODE_ENV=test yarn build",
     "start": "next start",
     "start:monorepo": "yarn start -p 3005",
     "lint": "next lint --fix",
     "lint:content": "eslint --no-config-lookup -c .content.eslintrc.mjs app/**/*.mdx --fix",
-    "prep": "node ./scripts/prepare.mjs"
+    "prep": "node ./scripts/prepare.mjs",
+    "upload:r2": "node ./scripts/upload-specs-to-r2.mjs",
+    "preview": "yarn build:cloudflare && opennextjs-cloudflare preview",
+    "deploy": "opennextjs-cloudflare deploy",
+    "upload": "opennextjs-cloudflare upload",
+    "cf-typegen": "wrangler types --env-interface CloudflareEnv cloudflare-env.d.ts"
   },
   "dependencies": {
     "@mdx-js/loader": "^3.1.0",
@@ -19,11 +26,11 @@
     "@medusajs/icons": "2.15.1",
     "@medusajs/ui": "4.1.11",
     "@medusajs/ui-preset": "2.15.1",
-    "@next/mdx": "15.3.9",
+    "@next/mdx": "15.5.18",
     "@stefanprobst/rehype-extract-toc": "^3.0.0",
     "clsx": "^2.1.0",
     "docs-ui": "*",
-    "next": "15.3.9",
+    "next": "15.5.18",
     "posthog-js": "^1.298.1",
     "posthog-node": "^5.29.0",
     "react": "19.2.5",
@@ -36,6 +43,8 @@
     "slugify": "^1.6.6"
   },
   "devDependencies": {
+    "@aws-sdk/client-s3": "^3",
+    "@opennextjs/cloudflare": "^1.19.9",
     "@types/mdx": "^2.0.13",
     "@types/node": "^20",
     "@types/react": "19.2.9",
@@ -45,12 +54,14 @@
     "eslint": "^9.13.0",
     "eslint-plugin-prettier": "^5.2.1",
     "eslint-plugin-react-hooks": "^5.0.0",
+    "mime-types": "^3",
     "postcss": "^8",
     "tailwind": "*",
     "tailwindcss": "^3.3.0",
     "tsconfig": "*",
     "types": "*",
-    "typescript": "^5"
+    "typescript": "^5",
+    "wrangler": "^4.90.0"
   },
   "engines": {
     "node": ">=20"
diff --git a/www/apps/ui/public/_headers b/www/apps/ui/public/_headers
new file mode 100644
index 0000000000000..3b460e68fd44e
--- /dev/null
+++ b/www/apps/ui/public/_headers
@@ -0,0 +1,2 @@
+/_next/static/*
+  Cache-Control: public,max-age=31536000,immutable
diff --git a/www/apps/ui/scripts/generate-specs-index.mjs b/www/apps/ui/scripts/generate-specs-index.mjs
new file mode 100644
index 0000000000000..7e086e81f2c17
--- /dev/null
+++ b/www/apps/ui/scripts/generate-specs-index.mjs
@@ -0,0 +1,42 @@
+/* eslint-disable no-console */
+import { readdirSync, writeFileSync } from "fs"
+import path from "path"
+import { fileURLToPath } from "url"
+
+const __dirname = path.dirname(fileURLToPath(import.meta.url))
+const specsDir = path.resolve(__dirname, "../specs/components")
+const outputPath = path.resolve(__dirname, "../generated/components-index.mjs")
+
+export function generateSpecsIndex() {
+  const componentDirs = readdirSync(specsDir, { withFileTypes: true }).filter(
+    (entry) => entry.isDirectory()
+  )
+
+  /** @type {Record<string, string[]>} */
+  const index = {}
+
+  for (const dir of componentDirs) {
+    const files = readdirSync(path.join(specsDir, dir.name)).filter((f) =>
+      f.endsWith(".json")
+    )
+    index[dir.name] = files
+  }
+
+  const entries = Object.entries(index)
+    .map(([component, files]) => {
+      const filesStr = files.map((f) => `"${f}"`).join(", ")
+      return `  "${component}": [${filesStr}]`
+    })
+    .join(",\n")
+
+  const content = `/**
+ * @type {Record<string, string[]>}
+ */
+export const ComponentSpecsIndex = {
+${entries},
+}
+`
+
+  writeFileSync(outputPath, content)
+  console.log(`Generated specs index at ${outputPath}`)
+}
diff --git a/www/apps/ui/scripts/prepare.mjs b/www/apps/ui/scripts/prepare.mjs
index acb2a475157b1..c453238ce6c03 100644
--- a/www/apps/ui/scripts/prepare.mjs
+++ b/www/apps/ui/scripts/prepare.mjs
@@ -1,14 +1,26 @@
 /* eslint-disable no-console */
-import { generateEditedDates, generateSidebar } from "build-scripts"
+import {
+  generateEditedDates,
+  generateSidebar,
+  copyMdxToPublic,
+} from "build-scripts"
 import { sidebar } from "../sidebar.mjs"
 import path from "path"
 import { copyFileSync } from "fs"
 import { execSync } from "child_process"
 import { fileURLToPath } from "url"
+import { generateSpecsIndex } from "./generate-specs-index.mjs"
 
 async function main() {
+  generateSpecsIndex()
   await generateSidebar(sidebar)
   await generateEditedDates()
+  if (process.env.CLOUDFLARE_ENV) {
+    await copyMdxToPublic({
+      srcDir: path.join(process.cwd(), "app"),
+      destDir: path.join(process.cwd(), "public", "raw-mdx"),
+    })
+  }
 
   // copy colors from the `@medusajs/ui-preset` package
   const resolvedURL = import.meta.resolve("@medusajs/ui-preset")
diff --git a/www/apps/ui/scripts/upload-specs-to-r2.mjs b/www/apps/ui/scripts/upload-specs-to-r2.mjs
new file mode 100644
index 0000000000000..43cf68375fa0a
--- /dev/null
+++ b/www/apps/ui/scripts/upload-specs-to-r2.mjs
@@ -0,0 +1,137 @@
+/* eslint-disable no-console */
+/**
+ * Uploads specs/ to Cloudflare R2.
+ *
+ * Usage:
+ *   node ./scripts/upload-specs-to-r2.mjs
+ *     Full upload of specs/ directory.
+ *
+ *   node ./scripts/upload-specs-to-r2.mjs --upload specs/components/foo.json
+ *     Upload only the listed files (paths relative to app root).
+ *
+ *   node ./scripts/upload-specs-to-r2.mjs --remove specs/components/old.json
+ *     Remove the listed keys from R2 (paths relative to app root).
+ *
+ *   --upload and --remove can be combined in a single invocation.
+ *
+ * Required env vars:
+ *   CLOUDFLARE_ACCOUNT_ID
+ *   CLOUDFLARE_R2_ACCESS_KEY_ID
+ *   CLOUDFLARE_R2_SECRET_ACCESS_KEY
+ *   R2_BUCKET_NAME (default: docs-assets)
+ */
+
+// Load .env if present; silently skip if not (e.g. CI injects vars directly)
+try {
+  process.loadEnvFile()
+} catch {
+  /* no .env file */
+}
+
+import {
+  S3Client,
+  PutObjectCommand,
+  DeleteObjectCommand,
+} from "@aws-sdk/client-s3"
+import { readFile, readdir } from "fs/promises"
+import path from "path"
+import { lookup as mimeLookup } from "mime-types"
+
+const accountId = process.env.CLOUDFLARE_ACCOUNT_ID
+const accessKeyId = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID
+const secretAccessKey = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY
+const bucket = process.env.R2_BUCKET_NAME || "docs-assets"
+
+if (!accountId || !accessKeyId || !secretAccessKey) {
+  console.error(
+    "Missing required env vars: CLOUDFLARE_ACCOUNT_ID, CLOUDFLARE_R2_ACCESS_KEY_ID, CLOUDFLARE_R2_SECRET_ACCESS_KEY"
+  )
+  process.exit(1)
+}
+
+const client = new S3Client({
+  region: "auto",
+  endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
+  credentials: { accessKeyId, secretAccessKey },
+})
+
+// Parse --upload and --remove CLI flags
+const args = process.argv.slice(2)
+const filesToUpload = []
+const filesToRemove = []
+let mode = null
+
+for (const arg of args) {
+  if (arg === "--upload") {
+    mode = "upload"
+    continue
+  }
+  if (arg === "--remove") {
+    mode = "remove"
+    continue
+  }
+  if (arg.startsWith("--")) {
+    mode = null
+    continue
+  }
+  if (mode === "upload") {
+    filesToUpload.push(arg)
+  }
+  if (mode === "remove") {
+    filesToRemove.push(arg)
+  }
+}
+
+const isSelective = filesToUpload.length > 0 || filesToRemove.length > 0
+
+// --- helpers ---
+
+async function uploadFile(localPath, r2Key) {
+  const body = await readFile(localPath)
+  const contentType =
+    mimeLookup(path.basename(localPath)) || "application/octet-stream"
+  await client.send(
+    new PutObjectCommand({
+      Bucket: bucket,
+      Key: r2Key,
+      Body: body,
+      ContentType: contentType,
+    })
+  )
+  console.log(`  uploaded: ${r2Key}`)
+}
+
+async function removeFile(r2Key) {
+  await client.send(new DeleteObjectCommand({ Bucket: bucket, Key: r2Key }))
+  console.log(`  removed: ${r2Key}`)
+}
+
+async function uploadDir(localDir, r2Prefix) {
+  const entries = await readdir(localDir, { withFileTypes: true })
+  for (const entry of entries) {
+    const localPath = path.join(localDir, entry.name)
+    const r2Key = `${r2Prefix}/${entry.name}`
+    if (entry.isDirectory()) {
+      await uploadDir(localPath, r2Key)
+    } else if (entry.isFile()) {
+      await uploadFile(localPath, r2Key)
+    }
+  }
+}
+
+// --- main ---
+
+if (isSelective) {
+  for (const relPath of filesToUpload) {
+    await uploadFile(path.join(process.cwd(), relPath), `ui/${relPath}`)
+  }
+  for (const relPath of filesToRemove) {
+    await removeFile(`ui/${relPath}`)
+  }
+} else {
+  const specsDir = path.join(process.cwd(), "specs")
+  console.log(`Uploading ${specsDir} → r2://${bucket}/ui/specs`)
+  await uploadDir(specsDir, "ui/specs")
+}
+
+console.log("Done.")
diff --git a/www/apps/ui/vercel.json b/www/apps/ui/vercel.json
deleted file mode 100644
index be3b478f40742..0000000000000
--- a/www/apps/ui/vercel.json
+++ /dev/null
@@ -1,7 +0,0 @@
-{
-  "framework": "nextjs",
-  "installCommand": "yarn install",
-  "buildCommand": "turbo run build",
-  "outputDirectory": ".next",
-  "ignoreCommand": "bash ../../ignore-build-script.sh ui"
-}
\ No newline at end of file
diff --git a/www/apps/ui/wrangler.jsonc b/www/apps/ui/wrangler.jsonc
new file mode 100644
index 0000000000000..74b174af840df
--- /dev/null
+++ b/www/apps/ui/wrangler.jsonc
@@ -0,0 +1,20 @@
+{
+  "$schema": "../../node_modules/wrangler/config-schema.json",
+  "name": "medusa-docs-ui",
+  "main": ".open-next/worker.js",
+  "compatibility_date": "2024-12-30",
+  "compatibility_flags": ["nodejs_compat", "global_fetch_strictly_public"],
+  "assets": {
+    "directory": ".open-next/assets",
+    "binding": "ASSETS"
+  },
+  "services": [
+    {
+      "binding": "WORKER_SELF_REFERENCE",
+      "service": "medusa-docs-ui"
+    }
+  ],
+  "images": {
+    "binding": "IMAGES"
+  }
+}
diff --git a/www/apps/user-guide/.gitignore b/www/apps/user-guide/.gitignore
index fd3dbb571a12a..6927538c1efb6 100644
--- a/www/apps/user-guide/.gitignore
+++ b/www/apps/user-guide/.gitignore
@@ -27,6 +27,7 @@ yarn-error.log*
 
 # local env files
 .env*.local
+.dev.vars
 
 # vercel
 .vercel
@@ -34,3 +35,10 @@ yarn-error.log*
 # typescript
 *.tsbuildinfo
 next-env.d.ts
+
+sidebar.full.mjs
+
+# cloudflare
+.open-next
+.wrangler
+public/raw-mdx
\ No newline at end of file
diff --git a/www/apps/user-guide/app/md-content/[[...slug]]/route.ts b/www/apps/user-guide/app/md-content/[[...slug]]/route.ts
index 99e9090b7732e..6d2583745cadf 100644
--- a/www/apps/user-guide/app/md-content/[[...slug]]/route.ts
+++ b/www/apps/user-guide/app/md-content/[[...slug]]/route.ts
@@ -1,5 +1,4 @@
-import { addExtraToMd, getCleanMd } from "docs-utils"
-import { existsSync } from "fs"
+import { addExtraToMd, getCleanMd, workerCompatibleFetch } from "docs-utils"
 import { unstable_cache } from "next/cache"
 import { notFound } from "next/navigation"
 import { NextRequest, NextResponse } from "next/server"
@@ -13,21 +12,39 @@ import {
 import type { Plugin } from "unified"
 
 type Params = {
-  params: Promise<{ slug: string[] }>
+  params: Promise<{ slug?: string[] }>
 }
 
 export async function GET(req: NextRequest, { params }: Params) {
-  const { slug = ["/"] } = await params
+  const { slug: rawSlug } = await params
+  const slug = rawSlug?.filter(Boolean) ?? []
+  const origin = process.env.NEXT_PUBLIC_BASE_URL || new URL(req.url).origin
+  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ""
 
-  // keep this so that Vercel keeps the files in deployment
-  const basePath = path.join(process.cwd(), "app")
-  const filePath = path.join(basePath, ...slug, "page.mdx")
+  const fileContent = await workerCompatibleFetch<string | null>({
+    url: `${origin}${basePath}/raw-mdx/${[...slug, "page.mdx"].join("/")}`,
+    responseTransformer: async (res) => {
+      return res.ok ? res.text() : null
+    },
+    fallbackAction: async () => {
+      try {
+        const { promises: fs } = await import("fs")
+        return await fs.readFile(
+          path.join(process.cwd(), "app", ...slug, "page.mdx"),
+          "utf-8"
+        )
+      } catch {
+        return null
+      }
+    },
+    useRemote: !!process.env.CLOUDFLARE_ENV,
+  })
 
-  if (!existsSync(filePath)) {
+  if (!fileContent) {
     return notFound()
   }
 
-  const cleanMdContent = await getCleanMd_(filePath, {
+  const cleanMdContent = await getCleanMd_(fileContent, {
     before: [
       [
         crossProjectLinksPlugin,
@@ -50,7 +67,8 @@ export async function GET(req: NextRequest, { params }: Params) {
           },
           useBaseUrl:
             process.env.NODE_ENV === "production" ||
-            process.env.VERCEL_ENV === "production",
+            process.env.VERCEL_ENV === "production" ||
+            !!process.env.CLOUDFLARE_ENV,
         },
       ],
       [localLinksRehypePlugin],
@@ -100,8 +118,8 @@ export async function GET(req: NextRequest, { params }: Params) {
 }
 
 const getCleanMd_ = unstable_cache(
-  async (filePath: string, plugins?: { before?: Plugin[]; after?: Plugin[] }) =>
-    getCleanMd({ file: filePath, plugins }),
+  async (content: string, plugins?: { before?: Plugin[]; after?: Plugin[] }) =>
+    getCleanMd({ file: content, type: "content", plugins }),
   ["clean-md"],
   {
     revalidate: 3600,
diff --git a/www/apps/user-guide/next.config.mjs b/www/apps/user-guide/next.config.mjs
index 6593c2c3db3e1..78c73a62d1922 100644
--- a/www/apps/user-guide/next.config.mjs
+++ b/www/apps/user-guide/next.config.mjs
@@ -76,7 +76,8 @@ const withMDX = mdx({
           },
           useBaseUrl:
             process.env.NODE_ENV === "production" ||
-            process.env.VERCEL_ENV === "production",
+            process.env.VERCEL_ENV === "production" ||
+            !!process.env.CLOUDFLARE_ENV,
         },
       ],
       [localLinksRehypePlugin],
@@ -128,11 +129,16 @@ const nextConfig = {
 
   transpilePackages: ["docs-ui"],
   basePath: process.env.NEXT_PUBLIC_BASE_PATH || "/user-guide",
+  outputFileTracingRoot: new URL("../../", import.meta.url).pathname,
   outputFileTracingIncludes: {
     "/md\\-content/\\[\\[\\.\\.\\.slug\\]\\]": ["./app/**/*.mdx"],
   },
   outputFileTracingExcludes: {
-    "*": ["node_modules/@medusajs/icons"],
+    "*": [
+      "node_modules/@medusajs/icons",
+      "../**/.open-next/**",
+      "../!(user-guide)/.next/**",
+    ],
   },
   experimental: {
     optimizePackageImports: ["@medusajs/icons", "@medusajs/ui"],
@@ -140,6 +146,14 @@ const nextConfig = {
   rewrites: async () => {
     return {
       beforeFiles: [
+        {
+          source: "/index.html.md",
+          destination: "/md-content",
+        },
+        {
+          source: "/index.md",
+          destination: "/md-content",
+        },
         {
           source: "/:path*/index.html.md",
           destination: "/md-content/:path*",
@@ -153,7 +167,7 @@ const nextConfig = {
           destination: "/md-content/:path*",
         },
         {
-          source: "/:path((?!md-content).+)/",
+          source: "/:first((?!md-content)[^/]+)/:rest*/",
           has: [
             {
               type: "header",
@@ -161,7 +175,7 @@ const nextConfig = {
               value: ".*(text/markdown|text/plain).*",
             },
           ],
-          destination: "/md-content/:path",
+          destination: "/md-content/:first/:rest*",
         },
         {
           source: "/",
@@ -175,7 +189,7 @@ const nextConfig = {
           destination: "/md-content",
         },
         {
-          source: "/:path((?!md-content).+)",
+          source: "/:first((?!md-content)[^/]+)/:rest*",
           has: [
             {
               type: "header",
@@ -183,7 +197,7 @@ const nextConfig = {
               value: ".*(text/markdown|text/plain).*",
             },
           ],
-          destination: "/md-content/:path",
+          destination: "/md-content/:first/:rest*",
         },
       ],
     }
diff --git a/www/apps/user-guide/open-next.config.ts b/www/apps/user-guide/open-next.config.ts
new file mode 100644
index 0000000000000..136ed5f038c45
--- /dev/null
+++ b/www/apps/user-guide/open-next.config.ts
@@ -0,0 +1,3 @@
+import { defineCloudflareConfig } from "@opennextjs/cloudflare"
+
+export default defineCloudflareConfig()
diff --git a/www/apps/user-guide/package.json b/www/apps/user-guide/package.json
index 24cf86dd68f36..3e48f6d257cca 100644
--- a/www/apps/user-guide/package.json
+++ b/www/apps/user-guide/package.json
@@ -6,22 +6,28 @@
     "dev": "yarn prep && next dev",
     "dev:monorepo": "yarn prep && yarn dev -p 3004",
     "build": "yarn prep && next build",
+    "dev:wrangler": "wrangler dev --port 3000",
+    "build:cloudflare": "CF_PAGES=1 yarn prep && opennextjs-cloudflare build",
     "build:dev": "NODE_ENV=test yarn build",
     "start": "next start",
     "start:monorepo": "yarn start -p 3004",
     "lint": "next lint --fix",
     "lint:content": "eslint --no-config-lookup -c .content.eslintrc.mjs app/**/*.mdx --fix",
-    "prep": "node ./scripts/prepare.mjs"
+    "prep": "node ./scripts/prepare.mjs",
+    "preview": "yarn build:cloudflare && opennextjs-cloudflare preview",
+    "deploy": "opennextjs-cloudflare deploy",
+    "upload": "opennextjs-cloudflare upload",
+    "cf-typegen": "wrangler types --env-interface CloudflareEnv cloudflare-env.d.ts"
   },
   "dependencies": {
     "@mdx-js/loader": "^3.1.0",
     "@mdx-js/react": "^3.1.0",
     "@medusajs/icons": "2.15.1",
-    "@next/mdx": "15.3.9",
+    "@next/mdx": "15.5.18",
     "@stefanprobst/rehype-extract-toc": "^3.0.0",
     "clsx": "^2.1.0",
     "docs-ui": "*",
-    "next": "15.3.9",
+    "next": "15.5.18",
     "posthog-js": "^1.298.1",
     "posthog-node": "^5.29.0",
     "react": "19.2.5",
@@ -33,6 +39,7 @@
     "remark-rehype-plugins": "*"
   },
   "devDependencies": {
+    "@opennextjs/cloudflare": "^1.19.9",
     "@types/mdx": "^2.0.13",
     "@types/node": "^20",
     "@types/react": "19.2.9",
@@ -47,7 +54,8 @@
     "tailwindcss": "^3.3.0",
     "tsconfig": "*",
     "types": "*",
-    "typescript": "^5"
+    "typescript": "^5",
+    "wrangler": "^4.90.0"
   },
   "engines": {
     "node": ">=20"
diff --git a/www/apps/user-guide/public/_headers b/www/apps/user-guide/public/_headers
new file mode 100644
index 0000000000000..3b460e68fd44e
--- /dev/null
+++ b/www/apps/user-guide/public/_headers
@@ -0,0 +1,2 @@
+/_next/static/*
+  Cache-Control: public,max-age=31536000,immutable
diff --git a/www/apps/user-guide/scripts/prepare.mjs b/www/apps/user-guide/scripts/prepare.mjs
index 325404f5a8d79..49a6da6c8f807 100644
--- a/www/apps/user-guide/scripts/prepare.mjs
+++ b/www/apps/user-guide/scripts/prepare.mjs
@@ -1,9 +1,20 @@
-import { generateEditedDates, generateSidebar } from "build-scripts"
+import {
+  generateEditedDates,
+  generateSidebar,
+  copyMdxToPublic,
+} from "build-scripts"
 import { sidebar } from "../sidebar.mjs"
+import path from "path"
 
 async function main() {
   await generateSidebar(sidebar)
   await generateEditedDates()
+  if (process.env.CLOUDFLARE_ENV) {
+    await copyMdxToPublic({
+      srcDir: path.join(process.cwd(), "app"),
+      destDir: path.join(process.cwd(), "public", "raw-mdx"),
+    })
+  }
 }
 
 void main()
diff --git a/www/apps/user-guide/vercel.json b/www/apps/user-guide/vercel.json
deleted file mode 100644
index 52ce477a25042..0000000000000
--- a/www/apps/user-guide/vercel.json
+++ /dev/null
@@ -1,7 +0,0 @@
-{
-  "framework": "nextjs",
-  "installCommand": "yarn install",
-  "buildCommand": "turbo run build",
-  "outputDirectory": ".next",
-  "ignoreCommand": "bash ../../ignore-build-script.sh user-guide"
-}
\ No newline at end of file
diff --git a/www/apps/user-guide/wrangler.jsonc b/www/apps/user-guide/wrangler.jsonc
new file mode 100644
index 0000000000000..e408936e28ca3
--- /dev/null
+++ b/www/apps/user-guide/wrangler.jsonc
@@ -0,0 +1,20 @@
+{
+  "$schema": "../../node_modules/wrangler/config-schema.json",
+  "name": "medusa-docs-user-guide",
+  "main": ".open-next/worker.js",
+  "compatibility_date": "2024-12-30",
+  "compatibility_flags": ["nodejs_compat", "global_fetch_strictly_public"],
+  "assets": {
+    "directory": ".open-next/assets",
+    "binding": "ASSETS"
+  },
+  "services": [
+    {
+      "binding": "WORKER_SELF_REFERENCE",
+      "service": "medusa-docs-user-guide"
+    }
+  ],
+  "images": {
+    "binding": "IMAGES"
+  }
+}
diff --git a/www/ignore-build-script.sh b/www/ignore-build-script.sh
deleted file mode 100644
index 05a1b064ec5b7..0000000000000
--- a/www/ignore-build-script.sh
+++ /dev/null
@@ -1,77 +0,0 @@
-#!/bin/bash
-
-if [[ "$1" == "docs-old" ]]; then
-  echo "🛑 - Build cancelled: Can't build old docs"
-  exit 0;
-fi
-
-PROJECT_NAME="$1"
-
-echo "PROJECT_NAME: $PROJECT_NAME"
-echo "VERCEL_ENV: $VERCEL_ENV"
-echo "VERCEL_GIT_COMMIT_REF: $VERCEL_GIT_COMMIT_REF"
-
-SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )
-echo "SCRIPT_DIR: $SCRIPT_DIR"
-
-# Check for changes in the www directory (original logic)
-$(git diff HEAD^ HEAD --quiet ${SCRIPT_DIR})
-diffResult=$?
-
-echo "DIFF RESULT (www): $diffResult"
-
-
-# Check for production build condition before preview checks
-if [[ "$VERCEL_ENV" == "production" && $diffResult -eq 1 ]] ; then
-  # Proceed with the build for production with changes
-  echo "✅ - Build can proceed (production with changes)"
-  exit 1;
-fi
-
-# Exit early if the PR branch doesn't start with 'docs/'
-if [[ ! "$VERCEL_GIT_COMMIT_REF" =~ ^docs/ ]]; then
-  echo "🛑 - Build cancelled: Branch does not start with 'docs/'"
-  exit 0;
-fi
-
-# For preview environments, check project-specific directories
-if [[ "$VERCEL_ENV" == "preview" && -n "$PROJECT_NAME" ]]; then
-  # Check for changes in the specific project directory
-  PROJECT_DIR="${SCRIPT_DIR}/apps/${PROJECT_NAME}"
-  if [[ -d "$PROJECT_DIR" ]]; then
-    $(git diff HEAD^ HEAD --quiet ${PROJECT_DIR})
-    projectDiffResult=$?
-    echo "DIFF RESULT (project ${PROJECT_NAME}): $projectDiffResult"
-  else
-    projectDiffResult=0
-    echo "Project directory ${PROJECT_DIR} does not exist"
-  fi
-  
-  # Check for changes in www/packages directory
-  PACKAGES_DIR="${SCRIPT_DIR}/packages"
-  if [[ -d "$PACKAGES_DIR" ]]; then
-    $(git diff HEAD^ HEAD --quiet ${PACKAGES_DIR})
-    packagesDiffResult=$?
-    echo "DIFF RESULT (packages): $packagesDiffResult"
-  else
-    packagesDiffResult=0
-    echo "Packages directory ${PACKAGES_DIR} does not exist"
-  fi
-  
-  # For preview, build if there are changes in project dir OR packages dir
-  previewShouldBuild=$((projectDiffResult + packagesDiffResult))
-  if [[ $previewShouldBuild -gt 0 ]]; then
-    previewShouldBuild=1
-  fi
-  echo "PREVIEW SHOULD BUILD: $previewShouldBuild"
-
-  if [[ $previewShouldBuild -eq 1 ]]; then
-    # Proceed with the build for preview if there are changes in project or packages directory
-    echo "✅ - Build can proceed (preview with project/packages changes)"
-    exit 1;
-  fi
-fi
-
-# Don't build
-echo "🛑 - Build cancelled: Conditions don't match"
-exit 0;
\ No newline at end of file
diff --git a/www/package.json b/www/package.json
index 72088f0b837c8..09136bc972513 100644
--- a/www/package.json
+++ b/www/package.json
@@ -20,7 +20,21 @@
     "watch": "turbo run watch",
     "prep": "turbo run prep",
     "test": "turbo run test -- run",
-    "up:medusa": "yarn workspaces foreach -v --topological-dev --recursive exec yarn up @medusajs/icons @medusajs/ui @medusajs/ui-preset --exact"
+    "up:medusa": "yarn workspaces foreach -v --topological-dev --recursive exec yarn up @medusajs/icons @medusajs/ui @medusajs/ui-preset --exact",
+    "build:cf:book": "cd apps/book && npx @opennextjs/cloudflare@latest build",
+    "build:cf:resources": "cd apps/resources && npx @opennextjs/cloudflare@latest build",
+    "build:cf:api-reference": "cd apps/api-reference && npx @opennextjs/cloudflare@latest build",
+    "build:cf:ui": "cd apps/ui && npx @opennextjs/cloudflare@latest build",
+    "build:cf:user-guide": "cd apps/user-guide && npx @opennextjs/cloudflare@latest build",
+    "build:cf:cloud": "cd apps/cloud && npx @opennextjs/cloudflare@latest build",
+    "build:cf:bloom": "cd apps/bloom && npx @opennextjs/cloudflare@latest build",
+    "deploy:cf:book": "cd apps/book && npx @opennextjs/cloudflare@latest build && wrangler deploy",
+    "deploy:cf:resources": "cd apps/resources && npx @opennextjs/cloudflare@latest build && wrangler deploy",
+    "deploy:cf:api-reference": "cd apps/api-reference && npx @opennextjs/cloudflare@latest build && wrangler deploy",
+    "deploy:cf:ui": "cd apps/ui && npx @opennextjs/cloudflare@latest build && wrangler deploy",
+    "deploy:cf:user-guide": "cd apps/user-guide && npx @opennextjs/cloudflare@latest build && wrangler deploy",
+    "deploy:cf:cloud": "cd apps/cloud && npx @opennextjs/cloudflare@latest build && wrangler deploy",
+    "deploy:cf:bloom": "cd apps/bloom && npx @opennextjs/cloudflare@latest build && wrangler deploy"
   },
   "dependencies": {
     "autoprefixer": "10.4.14",
@@ -52,5 +66,8 @@
   },
   "engines": {
     "node": ">=18.17.0"
+  },
+  "resolutions": {
+    "esbuild": "^0.27.0"
   }
 }
diff --git a/www/packages/build-scripts/src/copy-mdx-to-public.ts b/www/packages/build-scripts/src/copy-mdx-to-public.ts
new file mode 100644
index 0000000000000..97057fe332a5f
--- /dev/null
+++ b/www/packages/build-scripts/src/copy-mdx-to-public.ts
@@ -0,0 +1,31 @@
+import { promises as fs } from "fs"
+import path from "path"
+
+type Options = {
+  srcDir: string
+  destDir: string
+}
+
+async function copyDir(src: string, dest: string): Promise<void> {
+  const entries = await fs.readdir(src, { withFileTypes: true })
+
+  await fs.mkdir(dest, { recursive: true })
+
+  for (const entry of entries) {
+    const srcPath = path.join(src, entry.name)
+    const destPath = path.join(dest, entry.name)
+
+    if (entry.isDirectory()) {
+      await copyDir(srcPath, destPath)
+    } else if (
+      entry.isFile() &&
+      (entry.name === "page.mdx" || entry.name === "_md-content.mdx")
+    ) {
+      await fs.copyFile(srcPath, destPath)
+    }
+  }
+}
+
+export async function copyMdxToPublic({ srcDir, destDir }: Options): Promise<void> {
+  await copyDir(srcDir, destDir)
+}
diff --git a/www/packages/build-scripts/src/index.ts b/www/packages/build-scripts/src/index.ts
index 0fdada8299892..74ce4005681b9 100644
--- a/www/packages/build-scripts/src/index.ts
+++ b/www/packages/build-scripts/src/index.ts
@@ -1,3 +1,4 @@
+export * from "./copy-mdx-to-public.js"
 export * from "./generate-edited-dates.js"
 export * from "./generate-llms-full.js"
 export * from "./generate-sidebar.js"
diff --git a/www/packages/docs-ui/package.json b/www/packages/docs-ui/package.json
index d8fc9091187a8..e89f2836efc22 100644
--- a/www/packages/docs-ui/package.json
+++ b/www/packages/docs-ui/package.json
@@ -40,13 +40,12 @@
     "clsx": "^2.0.0",
     "cpy-cli": "^5.0.0",
     "eslint": "^9.13.0",
-    "next": "15.3.9",
+    "next": "15.5.18",
     "rimraf": "^5.0.1",
     "schema-dts": "^1.1.5",
     "tailwind": "*",
     "tailwindcss": "^3.3.3",
     "tsc-alias": "^1.8.7",
-    "tsup": "^5.10.1",
     "types": "*",
     "typescript": "^5.1.6",
     "vite-tsconfig-paths": "^5.1.4",
@@ -65,7 +64,7 @@
     "@kapaai/react-sdk": "^0.9.0",
     "@medusajs/icons": "2.15.1",
     "@medusajs/ui": "4.1.11",
-    "@next/third-parties": "15.3.9",
+    "@next/third-parties": "15.5.18",
     "@react-hook/resize-observer": "^1.2.6",
     "@segment/analytics-next": "^1.75.0",
     "@uidotdev/usehooks": "^2.4.1",
diff --git a/www/packages/docs-ui/src/components/ContentMenu/Actions/index.tsx b/www/packages/docs-ui/src/components/ContentMenu/Actions/index.tsx
index 8f96d7cc2a377..322d1a773c726 100644
--- a/www/packages/docs-ui/src/components/ContentMenu/Actions/index.tsx
+++ b/www/packages/docs-ui/src/components/ContentMenu/Actions/index.tsx
@@ -20,7 +20,7 @@ export const ContentMenuActions = () => {
     () => isGeneratingAnswer || isPreparingAnswer,
     [isGeneratingAnswer, isPreparingAnswer]
   )
-  const pageUrl = `${baseUrl}${basePath}${pathname}`.replace(/\/$/, "")
+  const pageUrl = `${baseUrl}${basePath || ""}${pathname}`.replace(/\/$/, "")
 
   const handleAiAssistantClick = () => {
     if (loading) {
diff --git a/www/packages/docs-utils/src/get-clean-md.ts b/www/packages/docs-utils/src/get-clean-md.ts
index 139d7ec8354ca..b892883c991f3 100644
--- a/www/packages/docs-utils/src/get-clean-md.ts
+++ b/www/packages/docs-utils/src/get-clean-md.ts
@@ -3,7 +3,7 @@ import remarkParse from "remark-parse"
 import remarkStringify from "remark-stringify"
 import { FrontMatter, UnistNode, UnistNodeWithData, UnistTree } from "types"
 import { Plugin, Transformer, unified } from "unified"
-import { SKIP } from "unist-util-visit"
+import { SKIP, VisitorResult } from "unist-util-visit"
 import type { VFile } from "vfile"
 import {
   ComponentParser,
@@ -52,6 +52,8 @@ const parsers: Record<string, ComponentParser> = {
   EventHeader: parseEventHeader,
 }
 
+const asyncParserNames = new Set(["ComponentExample", "ComponentReference"])
+
 const isComponentAllowed = (nodeName: string): boolean => {
   return Object.keys(parsers).includes(nodeName)
 }
@@ -66,6 +68,13 @@ const parseComponentsPlugin = (options: ParserPluginOptions): Transformer => {
 
     let pageTitle = ""
 
+    type AsyncParserTask = {
+      node: UnistNodeWithData
+      parent: UnistTree
+      parserName: string
+    }
+    const asyncTasks: AsyncParserTask[] = []
+
     visit(
       tree as UnistTree,
       ["mdxJsxFlowElement", "element", "mdxjsEsm", "heading"],
@@ -119,13 +128,40 @@ const parseComponentsPlugin = (options: ParserPluginOptions): Transformer => {
           return
         }
 
+        if (asyncParserNames.has(node.name)) {
+          asyncTasks.push({
+            node: node as UnistNodeWithData,
+            parent: parent as UnistTree,
+            parserName: node.name,
+          })
+          return
+        }
+
         const parser = parsers[node.name]
         if (parser) {
           const parserOptions = options[node.name] || {}
-          return parser(node as UnistNodeWithData, index, parent, parserOptions)
+          return parser(
+            node as UnistNodeWithData,
+            index,
+            parent,
+            parserOptions
+          ) as VisitorResult
         }
       }
     )
+
+    for (const { node, parent, parserName } of asyncTasks) {
+      const currentIndex = (parent as UnistTree).children.indexOf(
+        node as UnistNode
+      )
+      if (currentIndex === -1) {
+        continue
+      }
+      const parser = parsers[parserName]
+      if (parser) {
+        await parser(node, currentIndex, parent, options[parserName] || {})
+      }
+    }
   }
 }
 
diff --git a/www/packages/docs-utils/src/index.ts b/www/packages/docs-utils/src/index.ts
index bd8c3f9c5e721..e546a5b34758e 100644
--- a/www/packages/docs-utils/src/index.ts
+++ b/www/packages/docs-utils/src/index.ts
@@ -8,3 +8,4 @@ export * from "./get-file-slug.js"
 export * from "./get-front-matter.js"
 export * from "./oas-file-to-path.js"
 export * from "./sidebar-utils.js"
+export * from "./worker-compatible-fetch.js"
diff --git a/www/packages/docs-utils/src/utils/parsers.ts b/www/packages/docs-utils/src/utils/parsers.ts
index 652da5a69ae10..75c2c27a91754 100644
--- a/www/packages/docs-utils/src/utils/parsers.ts
+++ b/www/packages/docs-utils/src/utils/parsers.ts
@@ -8,13 +8,14 @@ import {
 import path from "path"
 import { readFileSync } from "fs"
 import type { Documentation } from "react-docgen"
+import { workerCompatibleFetch } from "../worker-compatible-fetch.js"
 
 export type ComponentParser<TOptions = any> = (
   node: UnistNodeWithData,
   index: number,
   parent: UnistTree,
   options?: TOptions
-) => VisitorResult
+) => VisitorResult | Promise<VisitorResult>
 
 export const parseCard: ComponentParser = (
   node: UnistNodeWithData,
@@ -573,12 +574,12 @@ export const parseWorkflowDiagram: ComponentParser = (
 
 export const parseComponentExample: ComponentParser<{
   examplesBasePath: string
-}> = (
+}> = async (
   node: UnistNodeWithData,
   index: number,
   parent: UnistTree,
   options
-): VisitorResult => {
+): Promise<VisitorResult> => {
   if (!options?.examplesBasePath) {
     return
   }
@@ -588,10 +589,27 @@ export const parseComponentExample: ComponentParser<{
     return
   }
 
-  const fileContent = readFileSync(
-    path.join(options.examplesBasePath, `${exampleName.value as string}.tsx`),
-    "utf-8"
-  )
+  const name = exampleName.value as string
+  const fileContent = await workerCompatibleFetch<string | null>({
+    url: `${options.examplesBasePath}/${name}.tsx`,
+    responseTransformer: async (res) => {
+      return res.ok ? res.text() : null
+    },
+    fallbackAction: async () => {
+      try {
+        return readFileSync(
+          path.join(options.examplesBasePath, `${name}.tsx`),
+          "utf-8"
+        )
+      } catch {
+        return null
+      }
+    },
+  })
+
+  if (!fileContent) {
+    return
+  }
 
   parent.children?.splice(index, 1, {
     type: "code",
@@ -601,12 +619,14 @@ export const parseComponentExample: ComponentParser<{
   return [SKIP, index]
 }
 
-export const parseComponentReference: ComponentParser<{ specsPath: string }> = (
+export const parseComponentReference: ComponentParser<{
+  specsPath: string
+}> = async (
   node: UnistNodeWithData,
   index: number,
   parent: UnistTree,
   options
-): VisitorResult => {
+): Promise<VisitorResult> => {
   if (!options?.specsPath) {
     return
   }
@@ -648,16 +668,33 @@ export const parseComponentReference: ComponentParser<{ specsPath: string }> = (
     componentNames.push(mainComponent)
   }
 
-  const getComponentNodes = (componentName: string): UnistNode[] => {
-    const componentSpecsFile = path.join(
-      options.specsPath,
-      mainComponent,
-      `${componentName}.json`
-    )
+  const getComponentNodes = async (
+    componentName: string
+  ): Promise<UnistNode[]> => {
+    const componentSpecs = await workerCompatibleFetch<Documentation | null>({
+      url: `${options.specsPath}/${mainComponent}/${componentName}.json`,
+      responseTransformer: async (res) => {
+        return res.ok ? ((await res.json()) as Documentation) : null
+      },
+      fallbackAction: async () => {
+        try {
+          const componentSpecsFile = path.join(
+            options.specsPath,
+            mainComponent,
+            `${componentName}.json`
+          )
+          return JSON.parse(
+            readFileSync(componentSpecsFile, "utf-8")
+          ) as Documentation
+        } catch {
+          return null
+        }
+      },
+    })
 
-    const componentSpecs: Documentation = JSON.parse(
-      readFileSync(componentSpecsFile, "utf-8")
-    )
+    if (!componentSpecs) {
+      return []
+    }
 
     const componentNodes: UnistNode[] = [
       {
@@ -716,11 +753,8 @@ export const parseComponentReference: ComponentParser<{ specsPath: string }> = (
     return componentNodes
   }
 
-  parent.children?.splice(
-    index,
-    1,
-    ...componentNames.flatMap(getComponentNodes)
-  )
+  const nodeArrays = await Promise.all(componentNames.map(getComponentNodes))
+  parent.children?.splice(index, 1, ...nodeArrays.flat())
 }
 
 export const parsePackageInstall: ComponentParser = (
diff --git a/www/packages/docs-utils/src/worker-compatible-fetch.ts b/www/packages/docs-utils/src/worker-compatible-fetch.ts
new file mode 100644
index 0000000000000..86c05851b8885
--- /dev/null
+++ b/www/packages/docs-utils/src/worker-compatible-fetch.ts
@@ -0,0 +1,37 @@
+type Options<T> = {
+  url: string
+  responseTransformer: (response: Response) => Promise<T>
+  fallbackAction: () => Promise<T>
+  /**
+   * When enabled, overrides the default URL-based check.
+   * Pass `!!process.env.CLOUDFLARE_ENV` for routes that always receive
+   * an HTTP URL but should only fetch remotely on Cloudflare.
+   */
+  useRemote?: boolean
+}
+
+/**
+ * Cloudflare Workers don't support the Node.js http/https modules. This
+ * utility abstracts fetch vs. filesystem access so the same code works in
+ * both Cloudflare Workers and local development / Vercel.
+ *
+ * Default behaviour: use `fetch()` when `url` starts with http(s), otherwise
+ * call `fallbackAction` (e.g. read from the local filesystem).
+ *
+ * Pass `useRemote` to override the default check — useful when the URL is
+ * always HTTP but remote fetching should only happen on Cloudflare.
+ */
+export async function workerCompatibleFetch<T>({
+  url,
+  responseTransformer,
+  fallbackAction,
+  useRemote,
+}: Options<T>): Promise<T> {
+  const shouldFetch = useRemote || /^https?:\/\//.test(url)
+  if (shouldFetch) {
+    const res = await fetch(url)
+    return await responseTransformer(res)
+  }
+
+  return fallbackAction()
+}
diff --git a/www/packages/remark-rehype-plugins/src/local-links.ts b/www/packages/remark-rehype-plugins/src/local-links.ts
index cd3263253c88a..578fd04697d35 100644
--- a/www/packages/remark-rehype-plugins/src/local-links.ts
+++ b/www/packages/remark-rehype-plugins/src/local-links.ts
@@ -4,7 +4,7 @@ import type { LocalLinkOptions, UnistNode, UnistTree } from "types"
 import { fixLinkUtil } from "./index.js"
 
 export function localLinksRehypePlugin(options: LocalLinkOptions): Transformer {
-  const { filePath, basePath } = options || {}
+  const { filePath, basePath, r2BaseUrl } = options || {}
   return async (tree, file) => {
     if (!file.cwd) {
       return
@@ -25,28 +25,36 @@ export function localLinksRehypePlugin(options: LocalLinkOptions): Transformer {
       ""
     )
     const appsPath = basePath || path.join(file.cwd, "app")
+
+    const nodesToProcess: { node: UnistNode; type: "a" | "link" }[] = []
     visit(tree as UnistTree, ["element", "link"], (node: UnistNode) => {
       if (node.tagName === "a") {
-        if (!node.properties?.href?.match(/page\.mdx?/)) {
-          return
+        if (node.properties?.href?.match(/page\.mdx?/)) {
+          nodesToProcess.push({ node, type: "a" })
+        }
+      } else if (node.type === "link") {
+        if (node.url?.match(/page\.mdx?/)) {
+          nodesToProcess.push({ node, type: "link" })
         }
+      }
+    })
 
-        node.properties.href = fixLinkUtil({
+    for (const { node, type } of nodesToProcess) {
+      if (type === "a") {
+        node.properties!.href = await fixLinkUtil({
           currentPageFilePath,
-          linkedPath: node.properties.href,
+          linkedPath: node.properties!.href,
           appsPath,
+          r2BaseUrl,
         })
-      } else if (node.type === "link") {
-        if (!node.url?.match(/page\.mdx?/)) {
-          return
-        }
-
-        node.url = fixLinkUtil({
+      } else {
+        node.url = await fixLinkUtil({
           currentPageFilePath,
-          linkedPath: node.url,
+          linkedPath: node.url!,
           appsPath,
+          r2BaseUrl,
         })
       }
-    })
+    }
   }
 }
diff --git a/www/packages/remark-rehype-plugins/src/ui-rehype-plugin.ts b/www/packages/remark-rehype-plugins/src/ui-rehype-plugin.ts
index 57786a17abe9d..b6b6f2a537125 100644
--- a/www/packages/remark-rehype-plugins/src/ui-rehype-plugin.ts
+++ b/www/packages/remark-rehype-plugins/src/ui-rehype-plugin.ts
@@ -4,76 +4,125 @@ import { u } from "unist-builder"
 import { visit } from "unist-util-visit"
 import { Documentation } from "react-docgen"
 import { ExampleRegistry, UnistNode, UnistTree } from "types"
+import { workerCompatibleFetch } from "docs-utils"
 
 type Options = {
   exampleRegistry: ExampleRegistry
+  specsIndex: Record<string, string[]>
+  specsBaseUrl?: string
 }
 
-export function uiRehypePlugin({ exampleRegistry }: Options) {
+export function uiRehypePlugin({
+  exampleRegistry,
+  specsIndex,
+  specsBaseUrl,
+}: Options) {
   return async (tree: UnistTree) => {
+    const exampleNodes: UnistNode[] = []
+    const referenceNodes: UnistNode[] = []
+
     visit(tree, (node: UnistNode) => {
       if (node.name === "ComponentExample") {
-        const name = getNodeAttributeByName(node, "name")?.value as string
+        exampleNodes.push(node)
+      } else if (node.name === "ComponentReference") {
+        referenceNodes.push(node)
+      }
+    })
+
+    for (const node of exampleNodes) {
+      const name = getNodeAttributeByName(node, "name")?.value as string
+      if (!name) {
+        continue
+      }
+
+      try {
+        const component = exampleRegistry[name]
+        const src = component.file
 
-        if (!name) {
-          return null
+        let source = await workerCompatibleFetch<string | null>({
+          url: `${specsBaseUrl}/${src}`,
+          responseTransformer: async (res) => {
+            return res.ok ? res.text() : null
+          },
+          fallbackAction: async () => {
+            const filePath = path.join(process.cwd(), src)
+            return fs.promises.readFile(filePath, "utf8")
+          },
+          useRemote: !!specsBaseUrl,
+        })
+
+        if (!source) {
+          continue
         }
 
+        source = source.replaceAll("export default", "export")
+
+        // Trim newline at the end of file. It's correct, but it makes source display look off
+        if (source.endsWith("\n")) {
+          source = source.substring(0, source.length - 1)
+        }
+
+        node.children?.push(
+          u("element", {
+            tagName: "span",
+            properties: {
+              __src__: src,
+              codeLinesJSON: JSON.stringify(source.split("\n")),
+            },
+          })
+        )
+      } catch (error) {
+        console.error(error)
+      }
+    }
+
+    for (const node of referenceNodes) {
+      const mainComponent = getNodeAttributeByName(node, "mainComponent")
+        ?.value as string
+
+      if (!mainComponent) {
+        continue
+      }
+
+      const specs: Documentation[] = []
+      const specFiles = specsIndex[mainComponent] ?? []
+
+      if (specsBaseUrl) {
         try {
-          const component = exampleRegistry[name]
-          const src = component.file
-
-          const filePath = path.join(process.cwd(), src)
-          let source = fs.readFileSync(filePath, "utf8")
-
-          source = source.replaceAll("export default", "export")
-
-          // Trim newline at the end of file. It's correct, but it makes source display look off
-          if (source.endsWith("\n")) {
-            source = source.substring(0, source.length - 1)
-          }
-
-          node.children?.push(
-            u("element", {
-              tagName: "span",
-              properties: {
-                __src__: src,
-                codeLinesJSON: JSON.stringify(source.split("\n")),
-              },
+          const specResults = await Promise.all(
+            specFiles.map(async (fileName) => {
+              const r = await fetch(
+                `${specsBaseUrl}/specs/components/${mainComponent}/${fileName}`
+              )
+              return r.ok ? ((await r.json()) as Documentation) : null
             })
           )
+          specs.push(...(specResults.filter(Boolean) as Documentation[]))
         } catch (error) {
           console.error(error)
         }
-      } else if (node.name === "ComponentReference") {
-        const mainComponent = getNodeAttributeByName(node, "mainComponent")
-          ?.value as string
-
-        if (!mainComponent) {
-          return null
-        }
-
-        const mainSpecsDir = path.join(process.cwd(), "specs", "components")
-        const componentSpecsDir = path.join(mainSpecsDir, mainComponent)
-        const specs: Documentation[] = []
-
-        const specFiles = fs.readdirSync(componentSpecsDir)
-        specFiles.map((specFileName) => {
-          // read spec file
+      } else {
+        const componentSpecsDir = path.join(
+          process.cwd(),
+          "specs",
+          "components",
+          mainComponent
+        )
+        specFiles.forEach((specFileName) => {
           const specFile = fs.readFileSync(
             path.join(componentSpecsDir, specFileName),
             "utf-8"
           )
           specs.push(JSON.parse(specFile) as Documentation)
         })
-
-        node.attributes?.push({
-          name: "specsSrc",
-          value: JSON.stringify(specs),
-          type: "mdxJsxAttribute",
-        })
       }
-    })
+
+      node.attributes?.push({
+        name: "specsSrc",
+        value: JSON.stringify(specs),
+        type: "mdxJsxAttribute",
+      })
+    }
   }
 }
 
diff --git a/www/packages/remark-rehype-plugins/src/utils/component-link-fixer.ts b/www/packages/remark-rehype-plugins/src/utils/component-link-fixer.ts
index f8b773805c62a..5e53fb2e8c2a0 100644
--- a/www/packages/remark-rehype-plugins/src/utils/component-link-fixer.ts
+++ b/www/packages/remark-rehype-plugins/src/utils/component-link-fixer.ts
@@ -1,6 +1,11 @@
 import path from "path"
 import { Transformer } from "unified"
-import { UnistNodeWithData, UnistTree, ComponentLinkFixerOptions } from "types"
+import {
+  UnistNodeWithData,
+  UnistTree,
+  ComponentLinkFixerOptions,
+  ExpressionJsVarLiteral,
+} from "types"
 import { FixLinkOptions, fixLinkUtil } from "../index.js"
 import getAttribute from "../utils/get-attribute.js"
 import { estreeToJs } from "docs-utils"
@@ -9,7 +14,7 @@ import { MD_LINK_REGEX } from "../constants.js"
 
 const VALUE_LINK_REGEX = /^(![a-z]+!|\.)/gm
 
-function matchMdLinks(
+async function matchMdLinks(
   str: string,
   linkOptions: Omit<FixLinkOptions, "linkedPath">
 ) {
@@ -21,7 +26,7 @@ function matchMdLinks(
       return
     }
 
-    const newUrl = fixLinkUtil({
+    const newUrl = await fixLinkUtil({
       ...linkOptions,
       linkedPath: linkMatches.groups.link,
     })
@@ -34,7 +39,7 @@ function matchMdLinks(
   return str
 }
 
-function matchValueLink(
+async function matchValueLink(
   str: string,
   linkOptions: Omit<FixLinkOptions, "linkedPath">
 ) {
@@ -55,7 +60,7 @@ export function componentLinkFixer(
   attributeName: string,
   options?: ComponentLinkFixerOptions
 ): Transformer {
-  const { filePath, basePath, checkLinksType = "md" } = options || {}
+  const { filePath, basePath, checkLinksType = "md", r2BaseUrl } = options || {}
   return async (tree, file) => {
     if (!file.cwd) {
       return
@@ -77,42 +82,62 @@ export function componentLinkFixer(
     )
     const appsPath = basePath || path.join(file.cwd, "app")
     const linkFn = checkLinksType === "md" ? matchMdLinks : matchValueLink
+
+    const nodesToProcess: UnistNodeWithData[] = []
     visit(tree as UnistTree, "mdxJsxFlowElement", (node: UnistNodeWithData) => {
-      if (node.name !== componentName) {
-        return
+      if (node.name === componentName) {
+        nodesToProcess.push(node)
       }
+    })
+
+    const linkOptions = {
+      currentPageFilePath,
+      appsPath,
+      r2BaseUrl,
+    }
 
+    for (const node of nodesToProcess) {
       const attribute = getAttribute(node, attributeName)
 
       if (!attribute) {
-        return
-      }
-
-      const linkOptions = {
-        currentPageFilePath,
-        appsPath,
+        continue
       }
 
       if (typeof attribute.value === "string") {
         attribute.value =
-          linkFn(attribute.value, linkOptions) || attribute.value
-        return
+          (await linkFn(attribute.value, linkOptions)) || attribute.value
+        continue
       }
 
       if (!attribute.value.data?.estree) {
-        return
+        continue
       }
 
       const itemJsVar = estreeToJs(attribute.value.data.estree)
 
-      if (!itemJsVar || "name" in itemJsVar) {
-        return
+      if (
+        !itemJsVar ||
+        ("name" in itemJsVar &&
+          typeof (itemJsVar as Record<string, unknown>).name === "string")
+      ) {
+        continue
       }
 
+      const literals: ExpressionJsVarLiteral[] = []
       performActionOnLiteral(itemJsVar, (item) => {
-        item.original.value = linkFn(item.original.value as string, linkOptions)
-        item.original.raw = JSON.stringify(item.original.value)
+        literals.push(item)
       })
-    })
+
+      for (const item of literals) {
+        const newValue = await linkFn(
+          item.original.value as string,
+          linkOptions
+        )
+        if (newValue !== undefined) {
+          item.original.value = newValue
+          item.original.raw = JSON.stringify(newValue)
+        }
+      }
+    }
   }
 }
diff --git a/www/packages/remark-rehype-plugins/src/utils/fix-link.ts b/www/packages/remark-rehype-plugins/src/utils/fix-link.ts
index 1ad1b68b262c2..896fa7e0f5e2a 100644
--- a/www/packages/remark-rehype-plugins/src/utils/fix-link.ts
+++ b/www/packages/remark-rehype-plugins/src/utils/fix-link.ts
@@ -1,16 +1,18 @@
 import path from "path"
-import { getFileSlugSync } from "docs-utils"
+import { getFrontMatterFromString, getFileSlugSync } from "docs-utils"
 
 export type FixLinkOptions = {
   currentPageFilePath: string
   linkedPath: string
   appsPath: string
+  r2BaseUrl?: string
 }
 
-export function fixLinkUtil({
+export async function fixLinkUtil({
   currentPageFilePath,
   linkedPath,
   appsPath: basePath,
+  r2BaseUrl,
 }: FixLinkOptions) {
   let fullLinkedFilePath = path.resolve(currentPageFilePath, linkedPath)
   // persist hash in new URL
@@ -20,7 +22,19 @@ export function fixLinkUtil({
   fullLinkedFilePath = fullLinkedFilePath.replace(hash, "")
   // get absolute path of the URL
   const linkedFilePath = fullLinkedFilePath.replace(basePath, "")
-  const linkedFileSlug = getFileSlugSync(fullLinkedFilePath)
+  let linkedFileSlug: string | undefined
+  try {
+    if (r2BaseUrl) {
+      const res = await fetch(`${r2BaseUrl}${linkedFilePath}`)
+      if (res.ok) {
+        linkedFileSlug = (await getFrontMatterFromString(await res.text()))?.slug
+      }
+    } else {
+      linkedFileSlug = getFileSlugSync(fullLinkedFilePath)
+    }
+  } catch {
+    // fetch failed — fall back to path-based URL
+  }
 
   const newLink =
     linkedFileSlug ||
diff --git a/www/packages/remark-rehype-plugins/src/utils/perform-action-on-literal.ts b/www/packages/remark-rehype-plugins/src/utils/perform-action-on-literal.ts
index 5fee7746ad017..4449be738b37d 100644
--- a/www/packages/remark-rehype-plugins/src/utils/perform-action-on-literal.ts
+++ b/www/packages/remark-rehype-plugins/src/utils/perform-action-on-literal.ts
@@ -2,7 +2,12 @@ import { ExpressionJsVar, ExpressionJsVarLiteral } from "types"
 import { isExpressionJsVarLiteral, isExpressionJsVarObj } from "docs-utils"
 
 export const performActionOnLiteral = (
-  item: ExpressionJsVar[] | ExpressionJsVar,
+  item: ExpressionJsVar[] | ExpressionJsVar | {
+    // handle the case when the literal has a name property,
+    // such as for workflow diagram links
+    name: string
+    value?: ExpressionJsVar | ExpressionJsVar[]
+  },
   action: (item: ExpressionJsVarLiteral) => void
 ) => {
   if (Array.isArray(item)) {
diff --git a/www/packages/tags/src/tags/step.ts b/www/packages/tags/src/tags/step.ts
index fb05cd154bf80..a7e006e59b575 100644
--- a/www/packages/tags/src/tags/step.ts
+++ b/www/packages/tags/src/tags/step.ts
@@ -127,6 +127,10 @@ export const step = [
     "title": "validateAndReturnShippingMethodsDataStep",
     "path": "https://docs.medusajs.com/resources/references/medusa-workflows/steps/validateAndReturnShippingMethodsDataStep"
   },
+  {
+    "title": "validateCartItemsStep",
+    "path": "https://docs.medusajs.com/resources/references/medusa-workflows/steps/validateCartItemsStep"
+  },
   {
     "title": "validateCartPaymentsStep",
     "path": "https://docs.medusajs.com/resources/references/medusa-workflows/steps/validateCartPaymentsStep"
@@ -1403,6 +1407,10 @@ export const step = [
     "title": "validateClaimStoreCreditAccountInputStep",
     "path": "https://docs.medusajs.com/resources/references/medusa-workflows/validateClaimStoreCreditAccountInputStep"
   },
+  {
+    "title": "validateSourceStoreCreditAccountsStep",
+    "path": "https://docs.medusajs.com/resources/references/medusa-workflows/validateSourceStoreCreditAccountsStep"
+  },
   {
     "title": "validateStoreCreditAccountInputStep",
     "path": "https://docs.medusajs.com/resources/references/medusa-workflows/validateStoreCreditAccountInputStep"
diff --git a/www/packages/types/src/remark-rehype.ts b/www/packages/types/src/remark-rehype.ts
index bfb10484b876c..854235e04baee 100644
--- a/www/packages/types/src/remark-rehype.ts
+++ b/www/packages/types/src/remark-rehype.ts
@@ -267,11 +267,13 @@ export declare type ComponentLinkFixerOptions = {
   filePath?: string
   basePath?: string
   checkLinksType: ComponentLinkFixerLinkType
+  r2BaseUrl?: string
 }
 
 export declare type LocalLinkOptions = {
   filePath?: string
   basePath?: string
+  r2BaseUrl?: string
 }
 
 export type ExpressionJsVarItem = {
diff --git a/www/yarn.lock b/www/yarn.lock
index 979dce2aba19f..61cef07b58dbe 100644
--- a/www/yarn.lock
+++ b/www/yarn.lock
@@ -352,2423 +352,4373 @@ __metadata:
   languageName: node
   linkType: hard
 
-"@babel/code-frame@npm:^7.10.4, @babel/code-frame@npm:^7.27.1":
-  version: 7.27.1
-  resolution: "@babel/code-frame@npm:7.27.1"
-  dependencies:
-    "@babel/helper-validator-identifier": ^7.27.1
-    js-tokens: ^4.0.0
-    picocolors: ^1.1.1
-  checksum: 5dd9a18baa5fce4741ba729acc3a3272c49c25cb8736c4b18e113099520e7ef7b545a4096a26d600e4416157e63e87d66db46aa3fbf0a5f2286da2705c12da00
+"@ast-grep/napi-darwin-arm64@npm:0.40.5":
+  version: 0.40.5
+  resolution: "@ast-grep/napi-darwin-arm64@npm:0.40.5"
+  conditions: os=darwin & cpu=arm64
   languageName: node
   linkType: hard
 
-"@babel/code-frame@npm:^7.16.0, @babel/code-frame@npm:^7.23.5":
-  version: 7.23.5
-  resolution: "@babel/code-frame@npm:7.23.5"
-  dependencies:
-    "@babel/highlight": ^7.23.4
-    chalk: ^2.4.2
-  checksum: a10e843595ddd9f97faa99917414813c06214f4d9205294013e20c70fbdf4f943760da37dec1d998bf3e6fc20fa2918a47c0e987a7e458663feb7698063ad7c6
+"@ast-grep/napi-darwin-x64@npm:0.40.5":
+  version: 0.40.5
+  resolution: "@ast-grep/napi-darwin-x64@npm:0.40.5"
+  conditions: os=darwin & cpu=x64
   languageName: node
   linkType: hard
 
-"@babel/code-frame@npm:^7.22.5":
-  version: 7.26.2
-  resolution: "@babel/code-frame@npm:7.26.2"
-  dependencies:
-    "@babel/helper-validator-identifier": ^7.25.9
-    js-tokens: ^4.0.0
-    picocolors: ^1.0.0
-  checksum: 7d79621a6849183c415486af99b1a20b84737e8c11cd55b6544f688c51ce1fd710e6d869c3dd21232023da272a79b91efb3e83b5bc2dc65c1187c5fcd1b72ea8
+"@ast-grep/napi-linux-arm64-gnu@npm:0.40.5":
+  version: 0.40.5
+  resolution: "@ast-grep/napi-linux-arm64-gnu@npm:0.40.5"
+  conditions: os=linux & cpu=arm64 & libc=glibc
   languageName: node
   linkType: hard
 
-"@babel/compat-data@npm:^7.23.5":
-  version: 7.23.5
-  resolution: "@babel/compat-data@npm:7.23.5"
-  checksum: 081278ed46131a890ad566a59c61600a5f9557bd8ee5e535890c8548192532ea92590742fd74bd9db83d74c669ef8a04a7e1c85cdea27f960233e3b83c3a957c
+"@ast-grep/napi-linux-arm64-musl@npm:0.40.5":
+  version: 0.40.5
+  resolution: "@ast-grep/napi-linux-arm64-musl@npm:0.40.5"
+  conditions: os=linux & cpu=arm64 & libc=musl
   languageName: node
   linkType: hard
 
-"@babel/compat-data@npm:^7.27.2":
-  version: 7.28.5
-  resolution: "@babel/compat-data@npm:7.28.5"
-  checksum: 702a25de73087b0eba325c1d10979eed7c9b6662677386ba7b5aa6eace0fc0676f78343bae080a0176ae26f58bd5535d73b9d0fbb547fef377692e8b249353a7
+"@ast-grep/napi-linux-x64-gnu@npm:0.40.5":
+  version: 0.40.5
+  resolution: "@ast-grep/napi-linux-x64-gnu@npm:0.40.5"
+  conditions: os=linux & cpu=x64 & libc=glibc
   languageName: node
   linkType: hard
 
-"@babel/core@npm:^7.18.9":
-  version: 7.23.9
-  resolution: "@babel/core@npm:7.23.9"
-  dependencies:
-    "@ampproject/remapping": ^2.2.0
-    "@babel/code-frame": ^7.23.5
-    "@babel/generator": ^7.23.6
-    "@babel/helper-compilation-targets": ^7.23.6
-    "@babel/helper-module-transforms": ^7.23.3
-    "@babel/helpers": ^7.23.9
-    "@babel/parser": ^7.23.9
-    "@babel/template": ^7.23.9
-    "@babel/traverse": ^7.23.9
-    "@babel/types": ^7.23.9
-    convert-source-map: ^2.0.0
-    debug: ^4.1.0
-    gensync: ^1.0.0-beta.2
-    json5: ^2.2.3
-    semver: ^6.3.1
-  checksum: 03883300bf1252ab4c9ba5b52f161232dd52873dbe5cde9289bb2bb26e935c42682493acbac9194a59a3b6cbd17f4c4c84030db8d6d482588afe64531532ff9b
+"@ast-grep/napi-linux-x64-musl@npm:0.40.5":
+  version: 0.40.5
+  resolution: "@ast-grep/napi-linux-x64-musl@npm:0.40.5"
+  conditions: os=linux & cpu=x64 & libc=musl
   languageName: node
   linkType: hard
 
-"@babel/core@npm:^7.28.0":
-  version: 7.28.5
-  resolution: "@babel/core@npm:7.28.5"
-  dependencies:
-    "@babel/code-frame": ^7.27.1
-    "@babel/generator": ^7.28.5
-    "@babel/helper-compilation-targets": ^7.27.2
-    "@babel/helper-module-transforms": ^7.28.3
-    "@babel/helpers": ^7.28.4
-    "@babel/parser": ^7.28.5
-    "@babel/template": ^7.27.2
-    "@babel/traverse": ^7.28.5
-    "@babel/types": ^7.28.5
-    "@jridgewell/remapping": ^2.3.5
-    convert-source-map: ^2.0.0
-    debug: ^4.1.0
-    gensync: ^1.0.0-beta.2
-    json5: ^2.2.3
-    semver: ^6.3.1
-  checksum: 535f82238027621da6bdffbdbe896ebad3558b311d6f8abc680637a9859b96edbf929ab010757055381570b29cf66c4a295b5618318d27a4273c0e2033925e72
+"@ast-grep/napi-win32-arm64-msvc@npm:0.40.5":
+  version: 0.40.5
+  resolution: "@ast-grep/napi-win32-arm64-msvc@npm:0.40.5"
+  conditions: os=win32 & cpu=arm64
   languageName: node
   linkType: hard
 
-"@babel/eslint-parser@npm:^7.25.9":
-  version: 7.25.9
-  resolution: "@babel/eslint-parser@npm:7.25.9"
-  dependencies:
-    "@nicolo-ribaudo/eslint-scope-5-internals": 5.1.1-v1
-    eslint-visitor-keys: ^2.1.0
-    semver: ^6.3.1
-  peerDependencies:
-    "@babel/core": ^7.11.0
-    eslint: ^7.5.0 || ^8.0.0 || ^9.0.0
-  checksum: 7dc525da9a076906aff562f82373765785732edf306e2be6497e347ed73be80d3544f2f845a77c2376bfa1c7c8c3580ea7346b12b78d8ddf4365c44fe9c35c4b
+"@ast-grep/napi-win32-ia32-msvc@npm:0.40.5":
+  version: 0.40.5
+  resolution: "@ast-grep/napi-win32-ia32-msvc@npm:0.40.5"
+  conditions: os=win32 & cpu=ia32
   languageName: node
   linkType: hard
 
-"@babel/generator@npm:^7.23.6":
-  version: 7.23.6
-  resolution: "@babel/generator@npm:7.23.6"
+"@ast-grep/napi-win32-x64-msvc@npm:0.40.5":
+  version: 0.40.5
+  resolution: "@ast-grep/napi-win32-x64-msvc@npm:0.40.5"
+  conditions: os=win32 & cpu=x64
+  languageName: node
+  linkType: hard
+
+"@ast-grep/napi@npm:^0.40.5":
+  version: 0.40.5
+  resolution: "@ast-grep/napi@npm:0.40.5"
   dependencies:
-    "@babel/types": ^7.23.6
-    "@jridgewell/gen-mapping": ^0.3.2
-    "@jridgewell/trace-mapping": ^0.3.17
-    jsesc: ^2.5.1
-  checksum: 53540e905cd10db05d9aee0a5304e36927f455ce66f95d1253bb8a179f286b88fa7062ea0db354c566fe27f8bb96567566084ffd259f8feaae1de5eccc8afbda
+    "@ast-grep/napi-darwin-arm64": 0.40.5
+    "@ast-grep/napi-darwin-x64": 0.40.5
+    "@ast-grep/napi-linux-arm64-gnu": 0.40.5
+    "@ast-grep/napi-linux-arm64-musl": 0.40.5
+    "@ast-grep/napi-linux-x64-gnu": 0.40.5
+    "@ast-grep/napi-linux-x64-musl": 0.40.5
+    "@ast-grep/napi-win32-arm64-msvc": 0.40.5
+    "@ast-grep/napi-win32-ia32-msvc": 0.40.5
+    "@ast-grep/napi-win32-x64-msvc": 0.40.5
+  dependenciesMeta:
+    "@ast-grep/napi-darwin-arm64":
+      optional: true
+    "@ast-grep/napi-darwin-x64":
+      optional: true
+    "@ast-grep/napi-linux-arm64-gnu":
+      optional: true
+    "@ast-grep/napi-linux-arm64-musl":
+      optional: true
+    "@ast-grep/napi-linux-x64-gnu":
+      optional: true
+    "@ast-grep/napi-linux-x64-musl":
+      optional: true
+    "@ast-grep/napi-win32-arm64-msvc":
+      optional: true
+    "@ast-grep/napi-win32-ia32-msvc":
+      optional: true
+    "@ast-grep/napi-win32-x64-msvc":
+      optional: true
+  checksum: 43a710fc4907fba2f2ff0570cfc798ecb26589e52b672ddf7761604e9cb5a62752d8ae439984035efeef049df0aeea2c33c450e00eb348797bc1309a69e68b16
   languageName: node
   linkType: hard
 
-"@babel/generator@npm:^7.28.5":
-  version: 7.28.5
-  resolution: "@babel/generator@npm:7.28.5"
+"@aws-crypto/crc32@npm:5.2.0":
+  version: 5.2.0
+  resolution: "@aws-crypto/crc32@npm:5.2.0"
   dependencies:
-    "@babel/parser": ^7.28.5
-    "@babel/types": ^7.28.5
-    "@jridgewell/gen-mapping": ^0.3.12
-    "@jridgewell/trace-mapping": ^0.3.28
-    jsesc: ^3.0.2
-  checksum: 9f219fe1d5431b6919f1a5c60db8d5d34fe546c0d8f5a8511b32f847569234ffc8032beb9e7404649a143f54e15224ecb53a3d11b6bb85c3203e573d91fca752
+    "@aws-crypto/util": ^5.2.0
+    "@aws-sdk/types": ^3.222.0
+    tslib: ^2.6.2
+  checksum: eab9581d3363af5ea498ae0e72de792f54d8890360e14a9d8261b7b5c55ebe080279fb2556e07994d785341cdaa99ab0b1ccf137832b53b5904cd6928f2b094b
   languageName: node
   linkType: hard
 
-"@babel/helper-compilation-targets@npm:^7.23.6":
-  version: 7.23.6
-  resolution: "@babel/helper-compilation-targets@npm:7.23.6"
+"@aws-crypto/crc32c@npm:5.2.0":
+  version: 5.2.0
+  resolution: "@aws-crypto/crc32c@npm:5.2.0"
   dependencies:
-    "@babel/compat-data": ^7.23.5
-    "@babel/helper-validator-option": ^7.23.5
-    browserslist: ^4.22.2
-    lru-cache: ^5.1.1
-    semver: ^6.3.1
-  checksum: ba38506d11185f48b79abf439462ece271d3eead1673dd8814519c8c903c708523428806f05f2ec5efd0c56e4e278698fac967e5a4b5ee842c32415da54bc6fa
+    "@aws-crypto/util": ^5.2.0
+    "@aws-sdk/types": ^3.222.0
+    tslib: ^2.6.2
+  checksum: 223efac396cdebaf5645568fa9a38cd0c322c960ae1f4276bedfe2e1031d0112e49d7d39225d386354680ecefae29f39af469a84b2ddfa77cb6692036188af77
   languageName: node
   linkType: hard
 
-"@babel/helper-compilation-targets@npm:^7.27.2":
-  version: 7.27.2
-  resolution: "@babel/helper-compilation-targets@npm:7.27.2"
+"@aws-crypto/sha1-browser@npm:5.2.0":
+  version: 5.2.0
+  resolution: "@aws-crypto/sha1-browser@npm:5.2.0"
   dependencies:
-    "@babel/compat-data": ^7.27.2
-    "@babel/helper-validator-option": ^7.27.1
-    browserslist: ^4.24.0
-    lru-cache: ^5.1.1
-    semver: ^6.3.1
-  checksum: f338fa00dcfea931804a7c55d1a1c81b6f0a09787e528ec580d5c21b3ecb3913f6cb0f361368973ce953b824d910d3ac3e8a8ee15192710d3563826447193ad1
+    "@aws-crypto/supports-web-crypto": ^5.2.0
+    "@aws-crypto/util": ^5.2.0
+    "@aws-sdk/types": ^3.222.0
+    "@aws-sdk/util-locate-window": ^3.0.0
+    "@smithy/util-utf8": ^2.0.0
+    tslib: ^2.6.2
+  checksum: 51fed0bf078c10322d910af179871b7d299dde5b5897873ffbeeb036f427e5d11d23db9794439226544b73901920fd19f4d86bbc103ed73cc0cfdea47a83c6ac
   languageName: node
   linkType: hard
 
-"@babel/helper-environment-visitor@npm:^7.22.20":
-  version: 7.22.20
-  resolution: "@babel/helper-environment-visitor@npm:7.22.20"
-  checksum: e762c2d8f5d423af89bd7ae9abe35bd4836d2eb401af868a63bbb63220c513c783e25ef001019418560b3fdc6d9a6fb67e6c0b650bcdeb3a2ac44b5c3d2bdd94
+"@aws-crypto/sha256-browser@npm:5.2.0":
+  version: 5.2.0
+  resolution: "@aws-crypto/sha256-browser@npm:5.2.0"
+  dependencies:
+    "@aws-crypto/sha256-js": ^5.2.0
+    "@aws-crypto/supports-web-crypto": ^5.2.0
+    "@aws-crypto/util": ^5.2.0
+    "@aws-sdk/types": ^3.222.0
+    "@aws-sdk/util-locate-window": ^3.0.0
+    "@smithy/util-utf8": ^2.0.0
+    tslib: ^2.6.2
+  checksum: 05f6d256794df800fe9aef5f52f2ac7415f7f3117d461f85a6aecaa4e29e91527b6fd503681a17136fa89e9dd3d916e9c7e4cfb5eba222875cb6c077bdc1d00d
   languageName: node
   linkType: hard
 
-"@babel/helper-function-name@npm:^7.23.0":
-  version: 7.23.0
-  resolution: "@babel/helper-function-name@npm:7.23.0"
+"@aws-crypto/sha256-js@npm:5.2.0, @aws-crypto/sha256-js@npm:^5.2.0":
+  version: 5.2.0
+  resolution: "@aws-crypto/sha256-js@npm:5.2.0"
   dependencies:
-    "@babel/template": ^7.22.15
-    "@babel/types": ^7.23.0
-  checksum: d771dd1f3222b120518176733c52b7cadac1c256ff49b1889dbbe5e3fed81db855b8cc4e40d949c9d3eae0e795e8229c1c8c24c0e83f27cfa6ee3766696c6428
+    "@aws-crypto/util": ^5.2.0
+    "@aws-sdk/types": ^3.222.0
+    tslib: ^2.6.2
+  checksum: 6c48701f8336341bb104dfde3d0050c89c288051f6b5e9bdfeb8091cf3ffc86efcd5c9e6ff2a4a134406b019c07aca9db608128f8d9267c952578a3108db9fd1
   languageName: node
   linkType: hard
 
-"@babel/helper-globals@npm:^7.28.0":
-  version: 7.28.0
-  resolution: "@babel/helper-globals@npm:7.28.0"
-  checksum: 5a0cd0c0e8c764b5f27f2095e4243e8af6fa145daea2b41b53c0c1414fe6ff139e3640f4e2207ae2b3d2153a1abd346f901c26c290ee7cb3881dd922d4ee9232
+"@aws-crypto/supports-web-crypto@npm:^5.2.0":
+  version: 5.2.0
+  resolution: "@aws-crypto/supports-web-crypto@npm:5.2.0"
+  dependencies:
+    tslib: ^2.6.2
+  checksum: 4d2118e29d68ca3f5947f1e37ce1fbb3239a0c569cc938cdc8ab8390d595609b5caf51a07c9e0535105b17bf5c52ea256fed705a07e9681118120ab64ee73af2
   languageName: node
   linkType: hard
 
-"@babel/helper-hoist-variables@npm:^7.22.5":
-  version: 7.22.5
-  resolution: "@babel/helper-hoist-variables@npm:7.22.5"
+"@aws-crypto/util@npm:5.2.0, @aws-crypto/util@npm:^5.2.0":
+  version: 5.2.0
+  resolution: "@aws-crypto/util@npm:5.2.0"
   dependencies:
-    "@babel/types": ^7.22.5
-  checksum: 60a3077f756a1cd9f14eb89f0037f487d81ede2b7cfe652ea6869cd4ec4c782b0fb1de01b8494b9a2d2050e3d154d7d5ad3be24806790acfb8cbe2073bf1e208
+    "@aws-sdk/types": ^3.222.0
+    "@smithy/util-utf8": ^2.0.0
+    tslib: ^2.6.2
+  checksum: 0362d4c197b1fd64b423966945130207d1fe23e1bb2878a18e361f7743c8d339dad3f8729895a29aa34fff6a86c65f281cf5167c4bf253f21627ae80b6dd2951
+  languageName: node
+  linkType: hard
+
+"@aws-sdk/client-cloudfront@npm:3.984.0":
+  version: 3.984.0
+  resolution: "@aws-sdk/client-cloudfront@npm:3.984.0"
+  dependencies:
+    "@aws-crypto/sha256-browser": 5.2.0
+    "@aws-crypto/sha256-js": 5.2.0
+    "@aws-sdk/core": ^3.973.6
+    "@aws-sdk/credential-provider-node": ^3.972.5
+    "@aws-sdk/middleware-host-header": ^3.972.3
+    "@aws-sdk/middleware-logger": ^3.972.3
+    "@aws-sdk/middleware-recursion-detection": ^3.972.3
+    "@aws-sdk/middleware-user-agent": ^3.972.6
+    "@aws-sdk/region-config-resolver": ^3.972.3
+    "@aws-sdk/types": ^3.973.1
+    "@aws-sdk/util-endpoints": 3.984.0
+    "@aws-sdk/util-user-agent-browser": ^3.972.3
+    "@aws-sdk/util-user-agent-node": ^3.972.4
+    "@smithy/config-resolver": ^4.4.6
+    "@smithy/core": ^3.22.0
+    "@smithy/fetch-http-handler": ^5.3.9
+    "@smithy/hash-node": ^4.2.8
+    "@smithy/invalid-dependency": ^4.2.8
+    "@smithy/middleware-content-length": ^4.2.8
+    "@smithy/middleware-endpoint": ^4.4.12
+    "@smithy/middleware-retry": ^4.4.29
+    "@smithy/middleware-serde": ^4.2.9
+    "@smithy/middleware-stack": ^4.2.8
+    "@smithy/node-config-provider": ^4.3.8
+    "@smithy/node-http-handler": ^4.4.8
+    "@smithy/protocol-http": ^5.3.8
+    "@smithy/smithy-client": ^4.11.1
+    "@smithy/types": ^4.12.0
+    "@smithy/url-parser": ^4.2.8
+    "@smithy/util-base64": ^4.3.0
+    "@smithy/util-body-length-browser": ^4.2.0
+    "@smithy/util-body-length-node": ^4.2.1
+    "@smithy/util-defaults-mode-browser": ^4.3.28
+    "@smithy/util-defaults-mode-node": ^4.2.31
+    "@smithy/util-endpoints": ^3.2.8
+    "@smithy/util-middleware": ^4.2.8
+    "@smithy/util-retry": ^4.2.8
+    "@smithy/util-stream": ^4.5.10
+    "@smithy/util-utf8": ^4.2.0
+    "@smithy/util-waiter": ^4.2.8
+    tslib: ^2.6.2
+  checksum: 18e4e2dc0d02f79d7eb31f058544736645a9f406fe6b4d1d0f0b6dfb88c111c09f8d6fae86940dfe712760e259172152afc985dfc31ebf5d2e2162e882e92e49
+  languageName: node
+  linkType: hard
+
+"@aws-sdk/client-dynamodb@npm:3.984.0":
+  version: 3.984.0
+  resolution: "@aws-sdk/client-dynamodb@npm:3.984.0"
+  dependencies:
+    "@aws-crypto/sha256-browser": 5.2.0
+    "@aws-crypto/sha256-js": 5.2.0
+    "@aws-sdk/core": ^3.973.6
+    "@aws-sdk/credential-provider-node": ^3.972.5
+    "@aws-sdk/dynamodb-codec": ^3.972.7
+    "@aws-sdk/middleware-endpoint-discovery": ^3.972.3
+    "@aws-sdk/middleware-host-header": ^3.972.3
+    "@aws-sdk/middleware-logger": ^3.972.3
+    "@aws-sdk/middleware-recursion-detection": ^3.972.3
+    "@aws-sdk/middleware-user-agent": ^3.972.6
+    "@aws-sdk/region-config-resolver": ^3.972.3
+    "@aws-sdk/types": ^3.973.1
+    "@aws-sdk/util-endpoints": 3.984.0
+    "@aws-sdk/util-user-agent-browser": ^3.972.3
+    "@aws-sdk/util-user-agent-node": ^3.972.4
+    "@smithy/config-resolver": ^4.4.6
+    "@smithy/core": ^3.22.0
+    "@smithy/fetch-http-handler": ^5.3.9
+    "@smithy/hash-node": ^4.2.8
+    "@smithy/invalid-dependency": ^4.2.8
+    "@smithy/middleware-content-length": ^4.2.8
+    "@smithy/middleware-endpoint": ^4.4.12
+    "@smithy/middleware-retry": ^4.4.29
+    "@smithy/middleware-serde": ^4.2.9
+    "@smithy/middleware-stack": ^4.2.8
+    "@smithy/node-config-provider": ^4.3.8
+    "@smithy/node-http-handler": ^4.4.8
+    "@smithy/protocol-http": ^5.3.8
+    "@smithy/smithy-client": ^4.11.1
+    "@smithy/types": ^4.12.0
+    "@smithy/url-parser": ^4.2.8
+    "@smithy/util-base64": ^4.3.0
+    "@smithy/util-body-length-browser": ^4.2.0
+    "@smithy/util-body-length-node": ^4.2.1
+    "@smithy/util-defaults-mode-browser": ^4.3.28
+    "@smithy/util-defaults-mode-node": ^4.2.31
+    "@smithy/util-endpoints": ^3.2.8
+    "@smithy/util-middleware": ^4.2.8
+    "@smithy/util-retry": ^4.2.8
+    "@smithy/util-utf8": ^4.2.0
+    "@smithy/util-waiter": ^4.2.8
+    tslib: ^2.6.2
+  checksum: e0b0b97bff0855b4b17b7435d20c211c0cb095f71e665e7b123abb90a0caa13217d376956aab7253428e366395226ce04bcd6e3750f0435ca8a91b7a31e96e7c
+  languageName: node
+  linkType: hard
+
+"@aws-sdk/client-lambda@npm:3.984.0":
+  version: 3.984.0
+  resolution: "@aws-sdk/client-lambda@npm:3.984.0"
+  dependencies:
+    "@aws-crypto/sha256-browser": 5.2.0
+    "@aws-crypto/sha256-js": 5.2.0
+    "@aws-sdk/core": ^3.973.6
+    "@aws-sdk/credential-provider-node": ^3.972.5
+    "@aws-sdk/middleware-host-header": ^3.972.3
+    "@aws-sdk/middleware-logger": ^3.972.3
+    "@aws-sdk/middleware-recursion-detection": ^3.972.3
+    "@aws-sdk/middleware-user-agent": ^3.972.6
+    "@aws-sdk/region-config-resolver": ^3.972.3
+    "@aws-sdk/types": ^3.973.1
+    "@aws-sdk/util-endpoints": 3.984.0
+    "@aws-sdk/util-user-agent-browser": ^3.972.3
+    "@aws-sdk/util-user-agent-node": ^3.972.4
+    "@smithy/config-resolver": ^4.4.6
+    "@smithy/core": ^3.22.0
+    "@smithy/eventstream-serde-browser": ^4.2.8
+    "@smithy/eventstream-serde-config-resolver": ^4.3.8
+    "@smithy/eventstream-serde-node": ^4.2.8
+    "@smithy/fetch-http-handler": ^5.3.9
+    "@smithy/hash-node": ^4.2.8
+    "@smithy/invalid-dependency": ^4.2.8
+    "@smithy/middleware-content-length": ^4.2.8
+    "@smithy/middleware-endpoint": ^4.4.12
+    "@smithy/middleware-retry": ^4.4.29
+    "@smithy/middleware-serde": ^4.2.9
+    "@smithy/middleware-stack": ^4.2.8
+    "@smithy/node-config-provider": ^4.3.8
+    "@smithy/node-http-handler": ^4.4.8
+    "@smithy/protocol-http": ^5.3.8
+    "@smithy/smithy-client": ^4.11.1
+    "@smithy/types": ^4.12.0
+    "@smithy/url-parser": ^4.2.8
+    "@smithy/util-base64": ^4.3.0
+    "@smithy/util-body-length-browser": ^4.2.0
+    "@smithy/util-body-length-node": ^4.2.1
+    "@smithy/util-defaults-mode-browser": ^4.3.28
+    "@smithy/util-defaults-mode-node": ^4.2.31
+    "@smithy/util-endpoints": ^3.2.8
+    "@smithy/util-middleware": ^4.2.8
+    "@smithy/util-retry": ^4.2.8
+    "@smithy/util-stream": ^4.5.10
+    "@smithy/util-utf8": ^4.2.0
+    "@smithy/util-waiter": ^4.2.8
+    tslib: ^2.6.2
+  checksum: 9daf19ef23941a724f8cc59e832b5f6953db2ad41f5a0cdbe4d68ba4a8a8452d068ed33e88a1d139892f82516b8de11818acb065938d36d520cc9f4117ed0156
+  languageName: node
+  linkType: hard
+
+"@aws-sdk/client-s3@npm:3.984.0":
+  version: 3.984.0
+  resolution: "@aws-sdk/client-s3@npm:3.984.0"
+  dependencies:
+    "@aws-crypto/sha1-browser": 5.2.0
+    "@aws-crypto/sha256-browser": 5.2.0
+    "@aws-crypto/sha256-js": 5.2.0
+    "@aws-sdk/core": ^3.973.6
+    "@aws-sdk/credential-provider-node": ^3.972.5
+    "@aws-sdk/middleware-bucket-endpoint": ^3.972.3
+    "@aws-sdk/middleware-expect-continue": ^3.972.3
+    "@aws-sdk/middleware-flexible-checksums": ^3.972.4
+    "@aws-sdk/middleware-host-header": ^3.972.3
+    "@aws-sdk/middleware-location-constraint": ^3.972.3
+    "@aws-sdk/middleware-logger": ^3.972.3
+    "@aws-sdk/middleware-recursion-detection": ^3.972.3
+    "@aws-sdk/middleware-sdk-s3": ^3.972.6
+    "@aws-sdk/middleware-ssec": ^3.972.3
+    "@aws-sdk/middleware-user-agent": ^3.972.6
+    "@aws-sdk/region-config-resolver": ^3.972.3
+    "@aws-sdk/signature-v4-multi-region": 3.984.0
+    "@aws-sdk/types": ^3.973.1
+    "@aws-sdk/util-endpoints": 3.984.0
+    "@aws-sdk/util-user-agent-browser": ^3.972.3
+    "@aws-sdk/util-user-agent-node": ^3.972.4
+    "@smithy/config-resolver": ^4.4.6
+    "@smithy/core": ^3.22.0
+    "@smithy/eventstream-serde-browser": ^4.2.8
+    "@smithy/eventstream-serde-config-resolver": ^4.3.8
+    "@smithy/eventstream-serde-node": ^4.2.8
+    "@smithy/fetch-http-handler": ^5.3.9
+    "@smithy/hash-blob-browser": ^4.2.9
+    "@smithy/hash-node": ^4.2.8
+    "@smithy/hash-stream-node": ^4.2.8
+    "@smithy/invalid-dependency": ^4.2.8
+    "@smithy/md5-js": ^4.2.8
+    "@smithy/middleware-content-length": ^4.2.8
+    "@smithy/middleware-endpoint": ^4.4.12
+    "@smithy/middleware-retry": ^4.4.29
+    "@smithy/middleware-serde": ^4.2.9
+    "@smithy/middleware-stack": ^4.2.8
+    "@smithy/node-config-provider": ^4.3.8
+    "@smithy/node-http-handler": ^4.4.8
+    "@smithy/protocol-http": ^5.3.8
+    "@smithy/smithy-client": ^4.11.1
+    "@smithy/types": ^4.12.0
+    "@smithy/url-parser": ^4.2.8
+    "@smithy/util-base64": ^4.3.0
+    "@smithy/util-body-length-browser": ^4.2.0
+    "@smithy/util-body-length-node": ^4.2.1
+    "@smithy/util-defaults-mode-browser": ^4.3.28
+    "@smithy/util-defaults-mode-node": ^4.2.31
+    "@smithy/util-endpoints": ^3.2.8
+    "@smithy/util-middleware": ^4.2.8
+    "@smithy/util-retry": ^4.2.8
+    "@smithy/util-stream": ^4.5.10
+    "@smithy/util-utf8": ^4.2.0
+    "@smithy/util-waiter": ^4.2.8
+    tslib: ^2.6.2
+  checksum: 285b912e985fad794fb11b6d22c5f2505929b783c9b13c344a6b4a3dc0838f7b201ef8c88256fcbce921cb0173eab8ec6b599689951bf89279fcda987d16ad63
+  languageName: node
+  linkType: hard
+
+"@aws-sdk/client-s3@npm:^3":
+  version: 3.1045.0
+  resolution: "@aws-sdk/client-s3@npm:3.1045.0"
+  dependencies:
+    "@aws-crypto/sha1-browser": 5.2.0
+    "@aws-crypto/sha256-browser": 5.2.0
+    "@aws-crypto/sha256-js": 5.2.0
+    "@aws-sdk/core": ^3.974.8
+    "@aws-sdk/credential-provider-node": ^3.972.39
+    "@aws-sdk/middleware-bucket-endpoint": ^3.972.10
+    "@aws-sdk/middleware-expect-continue": ^3.972.10
+    "@aws-sdk/middleware-flexible-checksums": ^3.974.16
+    "@aws-sdk/middleware-host-header": ^3.972.10
+    "@aws-sdk/middleware-location-constraint": ^3.972.10
+    "@aws-sdk/middleware-logger": ^3.972.10
+    "@aws-sdk/middleware-recursion-detection": ^3.972.11
+    "@aws-sdk/middleware-sdk-s3": ^3.972.37
+    "@aws-sdk/middleware-ssec": ^3.972.10
+    "@aws-sdk/middleware-user-agent": ^3.972.38
+    "@aws-sdk/region-config-resolver": ^3.972.13
+    "@aws-sdk/signature-v4-multi-region": ^3.996.25
+    "@aws-sdk/types": ^3.973.8
+    "@aws-sdk/util-endpoints": ^3.996.8
+    "@aws-sdk/util-user-agent-browser": ^3.972.10
+    "@aws-sdk/util-user-agent-node": ^3.973.24
+    "@smithy/config-resolver": ^4.4.17
+    "@smithy/core": ^3.23.17
+    "@smithy/eventstream-serde-browser": ^4.2.14
+    "@smithy/eventstream-serde-config-resolver": ^4.3.14
+    "@smithy/eventstream-serde-node": ^4.2.14
+    "@smithy/fetch-http-handler": ^5.3.17
+    "@smithy/hash-blob-browser": ^4.2.15
+    "@smithy/hash-node": ^4.2.14
+    "@smithy/hash-stream-node": ^4.2.14
+    "@smithy/invalid-dependency": ^4.2.14
+    "@smithy/md5-js": ^4.2.14
+    "@smithy/middleware-content-length": ^4.2.14
+    "@smithy/middleware-endpoint": ^4.4.32
+    "@smithy/middleware-retry": ^4.5.7
+    "@smithy/middleware-serde": ^4.2.20
+    "@smithy/middleware-stack": ^4.2.14
+    "@smithy/node-config-provider": ^4.3.14
+    "@smithy/node-http-handler": ^4.6.1
+    "@smithy/protocol-http": ^5.3.14
+    "@smithy/smithy-client": ^4.12.13
+    "@smithy/types": ^4.14.1
+    "@smithy/url-parser": ^4.2.14
+    "@smithy/util-base64": ^4.3.2
+    "@smithy/util-body-length-browser": ^4.2.2
+    "@smithy/util-body-length-node": ^4.2.3
+    "@smithy/util-defaults-mode-browser": ^4.3.49
+    "@smithy/util-defaults-mode-node": ^4.2.54
+    "@smithy/util-endpoints": ^3.4.2
+    "@smithy/util-middleware": ^4.2.14
+    "@smithy/util-retry": ^4.3.6
+    "@smithy/util-stream": ^4.5.25
+    "@smithy/util-utf8": ^4.2.2
+    "@smithy/util-waiter": ^4.3.0
+    tslib: ^2.6.2
+  checksum: e1c017dd5ee22f57658f0527fcc736e6a240de0e836d49b125b2cde120cd7ff017c7d2e9ac172cca404ffa4c853048079221db068a49ab0faf5e2d6b7a2f93fa
+  languageName: node
+  linkType: hard
+
+"@aws-sdk/client-sqs@npm:3.984.0":
+  version: 3.984.0
+  resolution: "@aws-sdk/client-sqs@npm:3.984.0"
+  dependencies:
+    "@aws-crypto/sha256-browser": 5.2.0
+    "@aws-crypto/sha256-js": 5.2.0
+    "@aws-sdk/core": ^3.973.6
+    "@aws-sdk/credential-provider-node": ^3.972.5
+    "@aws-sdk/middleware-host-header": ^3.972.3
+    "@aws-sdk/middleware-logger": ^3.972.3
+    "@aws-sdk/middleware-recursion-detection": ^3.972.3
+    "@aws-sdk/middleware-sdk-sqs": ^3.972.5
+    "@aws-sdk/middleware-user-agent": ^3.972.6
+    "@aws-sdk/region-config-resolver": ^3.972.3
+    "@aws-sdk/types": ^3.973.1
+    "@aws-sdk/util-endpoints": 3.984.0
+    "@aws-sdk/util-user-agent-browser": ^3.972.3
+    "@aws-sdk/util-user-agent-node": ^3.972.4
+    "@smithy/config-resolver": ^4.4.6
+    "@smithy/core": ^3.22.0
+    "@smithy/fetch-http-handler": ^5.3.9
+    "@smithy/hash-node": ^4.2.8
+    "@smithy/invalid-dependency": ^4.2.8
+    "@smithy/md5-js": ^4.2.8
+    "@smithy/middleware-content-length": ^4.2.8
+    "@smithy/middleware-endpoint": ^4.4.12
+    "@smithy/middleware-retry": ^4.4.29
+    "@smithy/middleware-serde": ^4.2.9
+    "@smithy/middleware-stack": ^4.2.8
+    "@smithy/node-config-provider": ^4.3.8
+    "@smithy/node-http-handler": ^4.4.8
+    "@smithy/protocol-http": ^5.3.8
+    "@smithy/smithy-client": ^4.11.1
+    "@smithy/types": ^4.12.0
+    "@smithy/url-parser": ^4.2.8
+    "@smithy/util-base64": ^4.3.0
+    "@smithy/util-body-length-browser": ^4.2.0
+    "@smithy/util-body-length-node": ^4.2.1
+    "@smithy/util-defaults-mode-browser": ^4.3.28
+    "@smithy/util-defaults-mode-node": ^4.2.31
+    "@smithy/util-endpoints": ^3.2.8
+    "@smithy/util-middleware": ^4.2.8
+    "@smithy/util-retry": ^4.2.8
+    "@smithy/util-utf8": ^4.2.0
+    tslib: ^2.6.2
+  checksum: 77c13192ddfa3e0646c623d8e703f501240f0709bc723920ae01c761f5d3d805e15f361b17c4e44911635128cfc2ee13e7ab2129344ba3d0e16010bc8c8de24c
+  languageName: node
+  linkType: hard
+
+"@aws-sdk/core@npm:^3.973.6, @aws-sdk/core@npm:^3.974.8":
+  version: 3.974.8
+  resolution: "@aws-sdk/core@npm:3.974.8"
+  dependencies:
+    "@aws-sdk/types": ^3.973.8
+    "@aws-sdk/xml-builder": ^3.972.22
+    "@smithy/core": ^3.23.17
+    "@smithy/node-config-provider": ^4.3.14
+    "@smithy/property-provider": ^4.2.14
+    "@smithy/protocol-http": ^5.3.14
+    "@smithy/signature-v4": ^5.3.14
+    "@smithy/smithy-client": ^4.12.13
+    "@smithy/types": ^4.14.1
+    "@smithy/util-base64": ^4.3.2
+    "@smithy/util-middleware": ^4.2.14
+    "@smithy/util-retry": ^4.3.6
+    "@smithy/util-utf8": ^4.2.2
+    tslib: ^2.6.2
+  checksum: 7b7e01e01e8b5f28b5d1b3d6f263bcf1b395600c2401009ad2b398a39b43ade33eacd59371c1e960c969f8164bfa9aff3ce950a5ba527a73c82eedc21456850f
   languageName: node
   linkType: hard
 
-"@babel/helper-module-imports@npm:^7.22.15":
-  version: 7.22.15
-  resolution: "@babel/helper-module-imports@npm:7.22.15"
+"@aws-sdk/crc64-nvme@npm:^3.972.7":
+  version: 3.972.7
+  resolution: "@aws-sdk/crc64-nvme@npm:3.972.7"
   dependencies:
-    "@babel/types": ^7.22.15
-  checksum: 4e0d7fc36d02c1b8c8b3006dfbfeedf7a367d3334a04934255de5128115ea0bafdeb3e5736a2559917f0653e4e437400d54542da0468e08d3cbc86d3bbfa8f30
+    "@smithy/types": ^4.14.1
+    tslib: ^2.6.2
+  checksum: c6f23e4e4c06b98009264b511567bb808d4c4f53c1da9b41f5c975f5f9f5e4b11af16e7add850e7bba29731b6efb145eb4dc0538d9639d6a5daaceadb4acf35d
   languageName: node
   linkType: hard
 
-"@babel/helper-module-imports@npm:^7.27.1":
-  version: 7.27.1
-  resolution: "@babel/helper-module-imports@npm:7.27.1"
+"@aws-sdk/credential-provider-env@npm:^3.972.34":
+  version: 3.972.34
+  resolution: "@aws-sdk/credential-provider-env@npm:3.972.34"
   dependencies:
-    "@babel/traverse": ^7.27.1
-    "@babel/types": ^7.27.1
-  checksum: e00aace096e4e29290ff8648455c2bc4ed982f0d61dbf2db1b5e750b9b98f318bf5788d75a4f974c151bd318fd549e81dbcab595f46b14b81c12eda3023f51e8
+    "@aws-sdk/core": ^3.974.8
+    "@aws-sdk/types": ^3.973.8
+    "@smithy/property-provider": ^4.2.14
+    "@smithy/types": ^4.14.1
+    tslib: ^2.6.2
+  checksum: 2f75940784b92ff71292b6dc5e660982f80bcfb4c3fcd0f0a04b0ff7de0a5b91000505b947434813b1104647d05678c3504560a7937aa82639e0042cb4597705
   languageName: node
   linkType: hard
 
-"@babel/helper-module-transforms@npm:^7.23.3":
-  version: 7.23.3
-  resolution: "@babel/helper-module-transforms@npm:7.23.3"
+"@aws-sdk/credential-provider-http@npm:^3.972.36":
+  version: 3.972.36
+  resolution: "@aws-sdk/credential-provider-http@npm:3.972.36"
   dependencies:
-    "@babel/helper-environment-visitor": ^7.22.20
-    "@babel/helper-module-imports": ^7.22.15
-    "@babel/helper-simple-access": ^7.22.5
-    "@babel/helper-split-export-declaration": ^7.22.6
-    "@babel/helper-validator-identifier": ^7.22.20
-  peerDependencies:
-    "@babel/core": ^7.0.0
-  checksum: 211e1399d0c4993671e8e5c2b25383f08bee40004ace5404ed4065f0e9258cc85d99c1b82fd456c030ce5cfd4d8f310355b54ef35de9924eabfc3dff1331d946
+    "@aws-sdk/core": ^3.974.8
+    "@aws-sdk/types": ^3.973.8
+    "@smithy/fetch-http-handler": ^5.3.17
+    "@smithy/node-http-handler": ^4.6.1
+    "@smithy/property-provider": ^4.2.14
+    "@smithy/protocol-http": ^5.3.14
+    "@smithy/smithy-client": ^4.12.13
+    "@smithy/types": ^4.14.1
+    "@smithy/util-stream": ^4.5.25
+    tslib: ^2.6.2
+  checksum: b3dd17e4403b3ef026a65da15cc3d08fdfddd42449f6d10edc6a4b016ed05306f7d4fe1fe286abd00bcf6cf3817ed19556fd97db9b2449deb0182569980dcd01
+  languageName: node
+  linkType: hard
+
+"@aws-sdk/credential-provider-ini@npm:^3.972.38":
+  version: 3.972.38
+  resolution: "@aws-sdk/credential-provider-ini@npm:3.972.38"
+  dependencies:
+    "@aws-sdk/core": ^3.974.8
+    "@aws-sdk/credential-provider-env": ^3.972.34
+    "@aws-sdk/credential-provider-http": ^3.972.36
+    "@aws-sdk/credential-provider-login": ^3.972.38
+    "@aws-sdk/credential-provider-process": ^3.972.34
+    "@aws-sdk/credential-provider-sso": ^3.972.38
+    "@aws-sdk/credential-provider-web-identity": ^3.972.38
+    "@aws-sdk/nested-clients": ^3.997.6
+    "@aws-sdk/types": ^3.973.8
+    "@smithy/credential-provider-imds": ^4.2.14
+    "@smithy/property-provider": ^4.2.14
+    "@smithy/shared-ini-file-loader": ^4.4.9
+    "@smithy/types": ^4.14.1
+    tslib: ^2.6.2
+  checksum: 198c7e3f88f525f814f599f6a1bc3a63c84ed046140017786f23de255adcb5c90f0bbcf9ec167c8c6771d63270f7ed9ac061713884ecddebc01da74be88ee6ea
   languageName: node
   linkType: hard
 
-"@babel/helper-module-transforms@npm:^7.28.3":
-  version: 7.28.3
-  resolution: "@babel/helper-module-transforms@npm:7.28.3"
+"@aws-sdk/credential-provider-login@npm:^3.972.38":
+  version: 3.972.38
+  resolution: "@aws-sdk/credential-provider-login@npm:3.972.38"
   dependencies:
-    "@babel/helper-module-imports": ^7.27.1
-    "@babel/helper-validator-identifier": ^7.27.1
-    "@babel/traverse": ^7.28.3
-  peerDependencies:
-    "@babel/core": ^7.0.0
-  checksum: 549be62515a6d50cd4cfefcab1b005c47f89bd9135a22d602ee6a5e3a01f27571868ada10b75b033569f24dc4a2bb8d04bfa05ee75c16da7ade2d0db1437fcdb
+    "@aws-sdk/core": ^3.974.8
+    "@aws-sdk/nested-clients": ^3.997.6
+    "@aws-sdk/types": ^3.973.8
+    "@smithy/property-provider": ^4.2.14
+    "@smithy/protocol-http": ^5.3.14
+    "@smithy/shared-ini-file-loader": ^4.4.9
+    "@smithy/types": ^4.14.1
+    tslib: ^2.6.2
+  checksum: f84ab04b8fec3355dce3d2a0f9bd63e79ef04915f019f2b6731a267e853f7cfb066baf67a22c955e58aa86f5b6eded6acdfdfd67532cc923edeefb8e88f46d63
   languageName: node
   linkType: hard
 
-"@babel/helper-plugin-utils@npm:^7.27.1":
-  version: 7.27.1
-  resolution: "@babel/helper-plugin-utils@npm:7.27.1"
-  checksum: 94cf22c81a0c11a09b197b41ab488d416ff62254ce13c57e62912c85700dc2e99e555225787a4099ff6bae7a1812d622c80fbaeda824b79baa10a6c5ac4cf69b
+"@aws-sdk/credential-provider-node@npm:^3.972.39, @aws-sdk/credential-provider-node@npm:^3.972.5":
+  version: 3.972.39
+  resolution: "@aws-sdk/credential-provider-node@npm:3.972.39"
+  dependencies:
+    "@aws-sdk/credential-provider-env": ^3.972.34
+    "@aws-sdk/credential-provider-http": ^3.972.36
+    "@aws-sdk/credential-provider-ini": ^3.972.38
+    "@aws-sdk/credential-provider-process": ^3.972.34
+    "@aws-sdk/credential-provider-sso": ^3.972.38
+    "@aws-sdk/credential-provider-web-identity": ^3.972.38
+    "@aws-sdk/types": ^3.973.8
+    "@smithy/credential-provider-imds": ^4.2.14
+    "@smithy/property-provider": ^4.2.14
+    "@smithy/shared-ini-file-loader": ^4.4.9
+    "@smithy/types": ^4.14.1
+    tslib: ^2.6.2
+  checksum: e21808419372f95c842ed6f893d15599565a1fa9dffed81256a374f98ef3a3c276ab4be30fbaac963e5c4761b676fe10482f5a6b1fb2b03273b18e9ecd30c12d
   languageName: node
   linkType: hard
 
-"@babel/helper-simple-access@npm:^7.22.5":
-  version: 7.22.5
-  resolution: "@babel/helper-simple-access@npm:7.22.5"
+"@aws-sdk/credential-provider-process@npm:^3.972.34":
+  version: 3.972.34
+  resolution: "@aws-sdk/credential-provider-process@npm:3.972.34"
   dependencies:
-    "@babel/types": ^7.22.5
-  checksum: f0cf81a30ba3d09a625fd50e5a9069e575c5b6719234e04ee74247057f8104beca89ed03e9217b6e9b0493434cedc18c5ecca4cea6244990836f1f893e140369
+    "@aws-sdk/core": ^3.974.8
+    "@aws-sdk/types": ^3.973.8
+    "@smithy/property-provider": ^4.2.14
+    "@smithy/shared-ini-file-loader": ^4.4.9
+    "@smithy/types": ^4.14.1
+    tslib: ^2.6.2
+  checksum: f65dbaaa40a81ba8e84d314e8ac0528f6d807b63b98820102ffccb38f47b1aa52f0c6dd4d7e4e8df186cef9cd57041e1d2d929c0e692804a8af0d06497f38a6a
   languageName: node
   linkType: hard
 
-"@babel/helper-split-export-declaration@npm:^7.22.6":
-  version: 7.22.6
-  resolution: "@babel/helper-split-export-declaration@npm:7.22.6"
+"@aws-sdk/credential-provider-sso@npm:^3.972.38":
+  version: 3.972.38
+  resolution: "@aws-sdk/credential-provider-sso@npm:3.972.38"
   dependencies:
-    "@babel/types": ^7.22.5
-  checksum: d83e4b623eaa9622c267d3c83583b72f3aac567dc393dda18e559d79187961cb29ae9c57b2664137fc3d19508370b12ec6a81d28af73a50e0846819cb21c6e44
+    "@aws-sdk/core": ^3.974.8
+    "@aws-sdk/nested-clients": ^3.997.6
+    "@aws-sdk/token-providers": 3.1041.0
+    "@aws-sdk/types": ^3.973.8
+    "@smithy/property-provider": ^4.2.14
+    "@smithy/shared-ini-file-loader": ^4.4.9
+    "@smithy/types": ^4.14.1
+    tslib: ^2.6.2
+  checksum: 4919362e1b8f6b73b8ec8ed0e0cc8f7a33db9b0d3ef63346a03047a024910d1acc6d80428a51444f6f15d58534dd535bc461b8505dd8f1cd6dc4fd8f863f956d
   languageName: node
   linkType: hard
 
-"@babel/helper-string-parser@npm:^7.23.4":
-  version: 7.23.4
-  resolution: "@babel/helper-string-parser@npm:7.23.4"
-  checksum: f348d5637ad70b6b54b026d6544bd9040f78d24e7ec245a0fc42293968181f6ae9879c22d89744730d246ce8ec53588f716f102addd4df8bbc79b73ea10004ac
+"@aws-sdk/credential-provider-web-identity@npm:^3.972.38":
+  version: 3.972.38
+  resolution: "@aws-sdk/credential-provider-web-identity@npm:3.972.38"
+  dependencies:
+    "@aws-sdk/core": ^3.974.8
+    "@aws-sdk/nested-clients": ^3.997.6
+    "@aws-sdk/types": ^3.973.8
+    "@smithy/property-provider": ^4.2.14
+    "@smithy/shared-ini-file-loader": ^4.4.9
+    "@smithy/types": ^4.14.1
+    tslib: ^2.6.2
+  checksum: 7a235d693dae5578c15448c8484d68ca7749ffd327b4e3784e3a1c6784a14535b398cc09c6be26e97042779acc261adedc7064681b930d93ebcda26da17c1f72
   languageName: node
   linkType: hard
 
-"@babel/helper-string-parser@npm:^7.27.1":
-  version: 7.27.1
-  resolution: "@babel/helper-string-parser@npm:7.27.1"
-  checksum: 8bda3448e07b5583727c103560bcf9c4c24b3c1051a4c516d4050ef69df37bb9a4734a585fe12725b8c2763de0a265aa1e909b485a4e3270b7cfd3e4dbe4b602
+"@aws-sdk/dynamodb-codec@npm:^3.972.7":
+  version: 3.973.8
+  resolution: "@aws-sdk/dynamodb-codec@npm:3.973.8"
+  dependencies:
+    "@aws-sdk/core": ^3.974.8
+    "@smithy/core": ^3.23.17
+    "@smithy/types": ^4.14.1
+    "@smithy/util-base64": ^4.3.2
+    tslib: ^2.6.2
+  checksum: 1dda9949eb0ed0c5993f587a8e6e32aab5552c0013b6ded5322ac29815c8dc1bfc023bc4bd324c3beeac66681321b4630f208a305325a716477e27206632f01e
   languageName: node
   linkType: hard
 
-"@babel/helper-validator-identifier@npm:^7.22.20":
-  version: 7.22.20
-  resolution: "@babel/helper-validator-identifier@npm:7.22.20"
-  checksum: dcad63db345fb110e032de46c3688384b0008a42a4845180ce7cd62b1a9c0507a1bed727c4d1060ed1a03ae57b4d918570259f81724aaac1a5b776056f37504e
+"@aws-sdk/endpoint-cache@npm:^3.972.5":
+  version: 3.972.5
+  resolution: "@aws-sdk/endpoint-cache@npm:3.972.5"
+  dependencies:
+    mnemonist: 0.38.3
+    tslib: ^2.6.2
+  checksum: 10707330728ef1f9ca74134ed19a5d93c28d9af4cf785d53ced74a645ae3f6ccc7cb75ffda552dad49ad3ef1aaa27f829431851f530be2c914b61399dd5342b6
   languageName: node
   linkType: hard
 
-"@babel/helper-validator-identifier@npm:^7.25.9":
-  version: 7.25.9
-  resolution: "@babel/helper-validator-identifier@npm:7.25.9"
-  checksum: 4fc6f830177b7b7e887ad3277ddb3b91d81e6c4a24151540d9d1023e8dc6b1c0505f0f0628ae653601eb4388a8db45c1c14b2c07a9173837aef7e4116456259d
+"@aws-sdk/middleware-bucket-endpoint@npm:^3.972.10, @aws-sdk/middleware-bucket-endpoint@npm:^3.972.3":
+  version: 3.972.10
+  resolution: "@aws-sdk/middleware-bucket-endpoint@npm:3.972.10"
+  dependencies:
+    "@aws-sdk/types": ^3.973.8
+    "@aws-sdk/util-arn-parser": ^3.972.3
+    "@smithy/node-config-provider": ^4.3.14
+    "@smithy/protocol-http": ^5.3.14
+    "@smithy/types": ^4.14.1
+    "@smithy/util-config-provider": ^4.2.2
+    tslib: ^2.6.2
+  checksum: 5529288142e0ebfbd985a257dbbb0f3510981a6ef56ce449465458ca12f7bcbbb9bfba9e1788c925329443604d4a438275f30254ef1d47e7931da798fb6e6765
   languageName: node
   linkType: hard
 
-"@babel/helper-validator-identifier@npm:^7.27.1":
-  version: 7.27.1
-  resolution: "@babel/helper-validator-identifier@npm:7.27.1"
-  checksum: c558f11c4871d526498e49d07a84752d1800bf72ac0d3dad100309a2eaba24efbf56ea59af5137ff15e3a00280ebe588560534b0e894a4750f8b1411d8f78b84
+"@aws-sdk/middleware-endpoint-discovery@npm:^3.972.3":
+  version: 3.972.11
+  resolution: "@aws-sdk/middleware-endpoint-discovery@npm:3.972.11"
+  dependencies:
+    "@aws-sdk/endpoint-cache": ^3.972.5
+    "@aws-sdk/types": ^3.973.8
+    "@smithy/node-config-provider": ^4.3.14
+    "@smithy/protocol-http": ^5.3.14
+    "@smithy/types": ^4.14.1
+    tslib: ^2.6.2
+  checksum: c448ec87dafdba2f25d3e28baf64942779e3f98bb4bb426566dc53accaf1b8e46225a375ffcb877bf6a3849e59f4ea843fd1e181c4e0ae86dc946182fa51a465
   languageName: node
   linkType: hard
 
-"@babel/helper-validator-identifier@npm:^7.28.5":
-  version: 7.28.5
-  resolution: "@babel/helper-validator-identifier@npm:7.28.5"
-  checksum: 42aaebed91f739a41f3d80b72752d1f95fd7c72394e8e4bd7cdd88817e0774d80a432451bcba17c2c642c257c483bf1d409dd4548883429ea9493a3bc4ab0847
+"@aws-sdk/middleware-expect-continue@npm:^3.972.10, @aws-sdk/middleware-expect-continue@npm:^3.972.3":
+  version: 3.972.10
+  resolution: "@aws-sdk/middleware-expect-continue@npm:3.972.10"
+  dependencies:
+    "@aws-sdk/types": ^3.973.8
+    "@smithy/protocol-http": ^5.3.14
+    "@smithy/types": ^4.14.1
+    tslib: ^2.6.2
+  checksum: c91588169621597bed09aa53f9bf858b83a0c8b8b84d6838ed3729c8222a7b7d5819595fd2617ca8f859e8471ca7e7132bb7d1694d5ada17039dea53cc707e4b
+  languageName: node
+  linkType: hard
+
+"@aws-sdk/middleware-flexible-checksums@npm:^3.972.4, @aws-sdk/middleware-flexible-checksums@npm:^3.974.16":
+  version: 3.974.16
+  resolution: "@aws-sdk/middleware-flexible-checksums@npm:3.974.16"
+  dependencies:
+    "@aws-crypto/crc32": 5.2.0
+    "@aws-crypto/crc32c": 5.2.0
+    "@aws-crypto/util": 5.2.0
+    "@aws-sdk/core": ^3.974.8
+    "@aws-sdk/crc64-nvme": ^3.972.7
+    "@aws-sdk/types": ^3.973.8
+    "@smithy/is-array-buffer": ^4.2.2
+    "@smithy/node-config-provider": ^4.3.14
+    "@smithy/protocol-http": ^5.3.14
+    "@smithy/types": ^4.14.1
+    "@smithy/util-middleware": ^4.2.14
+    "@smithy/util-stream": ^4.5.25
+    "@smithy/util-utf8": ^4.2.2
+    tslib: ^2.6.2
+  checksum: 0725e497e2ebd4201682a786b28da90acc9c86459bfd6a3a29591021b7be4e5e17aee2628b71921eba003740d49b88d48eab8bd80220dfc5aa16dc7c50488775
   languageName: node
   linkType: hard
 
-"@babel/helper-validator-option@npm:^7.23.5":
-  version: 7.23.5
-  resolution: "@babel/helper-validator-option@npm:7.23.5"
-  checksum: af45d5c0defb292ba6fd38979e8f13d7da63f9623d8ab9ededc394f67eb45857d2601278d151ae9affb6e03d5d608485806cd45af08b4468a0515cf506510e94
+"@aws-sdk/middleware-host-header@npm:^3.972.10, @aws-sdk/middleware-host-header@npm:^3.972.3":
+  version: 3.972.10
+  resolution: "@aws-sdk/middleware-host-header@npm:3.972.10"
+  dependencies:
+    "@aws-sdk/types": ^3.973.8
+    "@smithy/protocol-http": ^5.3.14
+    "@smithy/types": ^4.14.1
+    tslib: ^2.6.2
+  checksum: e631b48f8d8fd40f8977da8d1fc012208f953000dd5645dc0a700c7283af8fafb996c9c1c50e40b8392c402ad98d11e0ddddb949896db5163a7f06e2385e619a
   languageName: node
   linkType: hard
 
-"@babel/helper-validator-option@npm:^7.27.1":
-  version: 7.27.1
-  resolution: "@babel/helper-validator-option@npm:7.27.1"
-  checksum: 6fec5f006eba40001a20f26b1ef5dbbda377b7b68c8ad518c05baa9af3f396e780bdfded24c4eef95d14bb7b8fd56192a6ed38d5d439b97d10efc5f1a191d148
+"@aws-sdk/middleware-location-constraint@npm:^3.972.10, @aws-sdk/middleware-location-constraint@npm:^3.972.3":
+  version: 3.972.10
+  resolution: "@aws-sdk/middleware-location-constraint@npm:3.972.10"
+  dependencies:
+    "@aws-sdk/types": ^3.973.8
+    "@smithy/types": ^4.14.1
+    tslib: ^2.6.2
+  checksum: ef8ef1f3cf7d28e5b02edcc2b62cab07a380f7a02983bdfcaf24fbea35129c53ac5a1f5846ab28212b649d6c81f437e2a846f1f954fb374509ea174201bf09d4
   languageName: node
   linkType: hard
 
-"@babel/helpers@npm:^7.23.9":
-  version: 7.23.9
-  resolution: "@babel/helpers@npm:7.23.9"
+"@aws-sdk/middleware-logger@npm:^3.972.10, @aws-sdk/middleware-logger@npm:^3.972.3":
+  version: 3.972.10
+  resolution: "@aws-sdk/middleware-logger@npm:3.972.10"
   dependencies:
-    "@babel/template": ^7.23.9
-    "@babel/traverse": ^7.23.9
-    "@babel/types": ^7.23.9
-  checksum: f69fd0aca96a6fb8bd6dd044cd8a5c0f1851072d4ce23355345b9493c4032e76d1217f86b70df795e127553cf7f3fcd1587ede9d1b03b95e8b62681ca2165b87
+    "@aws-sdk/types": ^3.973.8
+    "@smithy/types": ^4.14.1
+    tslib: ^2.6.2
+  checksum: a24e0c98b3cf6c9b7960bf8979d2ab8f839fb89294ba8943136d99dbe7370cc45b010460ed7f5bf14ab6ad8e113ccec6387cf1bda655bcbdb58722df21d9b713
   languageName: node
   linkType: hard
 
-"@babel/helpers@npm:^7.28.4":
-  version: 7.28.4
-  resolution: "@babel/helpers@npm:7.28.4"
+"@aws-sdk/middleware-recursion-detection@npm:^3.972.11, @aws-sdk/middleware-recursion-detection@npm:^3.972.3":
+  version: 3.972.11
+  resolution: "@aws-sdk/middleware-recursion-detection@npm:3.972.11"
   dependencies:
-    "@babel/template": ^7.27.2
-    "@babel/types": ^7.28.4
-  checksum: aaa5fb8098926dfed5f223adf2c5e4c7fbba4b911b73dfec2d7d3083f8ba694d201a206db673da2d9b3ae8c01793e795767654558c450c8c14b4c2175b4fcb44
+    "@aws-sdk/types": ^3.973.8
+    "@aws/lambda-invoke-store": ^0.2.2
+    "@smithy/protocol-http": ^5.3.14
+    "@smithy/types": ^4.14.1
+    tslib: ^2.6.2
+  checksum: e52501b00e79e714218897ddec9edd40ecf33fdb43c19b00195c8ed71c8295d0d148f07465465d464f103a23aa535dc1daf60bbb5b95303e330767a5eba78f54
+  languageName: node
+  linkType: hard
+
+"@aws-sdk/middleware-sdk-s3@npm:^3.972.37, @aws-sdk/middleware-sdk-s3@npm:^3.972.6":
+  version: 3.972.37
+  resolution: "@aws-sdk/middleware-sdk-s3@npm:3.972.37"
+  dependencies:
+    "@aws-sdk/core": ^3.974.8
+    "@aws-sdk/types": ^3.973.8
+    "@aws-sdk/util-arn-parser": ^3.972.3
+    "@smithy/core": ^3.23.17
+    "@smithy/node-config-provider": ^4.3.14
+    "@smithy/protocol-http": ^5.3.14
+    "@smithy/signature-v4": ^5.3.14
+    "@smithy/smithy-client": ^4.12.13
+    "@smithy/types": ^4.14.1
+    "@smithy/util-config-provider": ^4.2.2
+    "@smithy/util-middleware": ^4.2.14
+    "@smithy/util-stream": ^4.5.25
+    "@smithy/util-utf8": ^4.2.2
+    tslib: ^2.6.2
+  checksum: c8d4ad6aa908eca70ef085ac2c55362229071caa9518ed538574cc4d317d9f1f4e2173d6b01259dd83f77356ad4b68656b5720a31b3effe01f7fe10aec265aed
   languageName: node
   linkType: hard
 
-"@babel/highlight@npm:^7.23.4":
-  version: 7.23.4
-  resolution: "@babel/highlight@npm:7.23.4"
+"@aws-sdk/middleware-sdk-sqs@npm:^3.972.5":
+  version: 3.972.22
+  resolution: "@aws-sdk/middleware-sdk-sqs@npm:3.972.22"
   dependencies:
-    "@babel/helper-validator-identifier": ^7.22.20
-    chalk: ^2.4.2
-    js-tokens: ^4.0.0
-  checksum: fbff9fcb2f5539289c3c097d130e852afd10d89a3a08ac0b5ebebbc055cc84a4bcc3dcfed463d488cde12dd0902ef1858279e31d7349b2e8cee43913744bda33
+    "@aws-sdk/types": ^3.973.8
+    "@smithy/smithy-client": ^4.12.13
+    "@smithy/types": ^4.14.1
+    "@smithy/util-hex-encoding": ^4.2.2
+    "@smithy/util-utf8": ^4.2.2
+    tslib: ^2.6.2
+  checksum: 75e4dbfec9c33ba737493f7c8ca27f83adedbd1f8127ea958fabfc9583b4693b127d30893232d301b6d47d14b06c2991e5d4d79570414dae043404700339f32b
   languageName: node
   linkType: hard
 
-"@babel/parser@npm:^7.1.0, @babel/parser@npm:^7.20.7, @babel/parser@npm:^7.23.9":
-  version: 7.23.9
-  resolution: "@babel/parser@npm:7.23.9"
-  bin:
-    parser: ./bin/babel-parser.js
-  checksum: 7df97386431366d4810538db4b9ec538f4377096f720c0591c7587a16f6810e62747e9fbbfa1ff99257fd4330035e4fb1b5b77c7bd3b97ce0d2e3780a6618975
+"@aws-sdk/middleware-ssec@npm:^3.972.10, @aws-sdk/middleware-ssec@npm:^3.972.3":
+  version: 3.972.10
+  resolution: "@aws-sdk/middleware-ssec@npm:3.972.10"
+  dependencies:
+    "@aws-sdk/types": ^3.973.8
+    "@smithy/types": ^4.14.1
+    tslib: ^2.6.2
+  checksum: 13e11c485e63d6b3d8a5f14888c6b8aea1c0a96a99826e840840b6974b9605b5f528f8869b021036e8615995d9e5ecd33d6e67af1561ed673d37292d356ca441
   languageName: node
   linkType: hard
 
-"@babel/parser@npm:^7.27.2, @babel/parser@npm:^7.28.5":
-  version: 7.28.5
-  resolution: "@babel/parser@npm:7.28.5"
+"@aws-sdk/middleware-user-agent@npm:^3.972.38, @aws-sdk/middleware-user-agent@npm:^3.972.6":
+  version: 3.972.38
+  resolution: "@aws-sdk/middleware-user-agent@npm:3.972.38"
   dependencies:
-    "@babel/types": ^7.28.5
-  bin:
-    parser: ./bin/babel-parser.js
-  checksum: 5bbe48bf2c79594ac02b490a41ffde7ef5aa22a9a88ad6bcc78432a6ba8a9d638d531d868bd1f104633f1f6bba9905746e15185b8276a3756c42b765d131b1ef
+    "@aws-sdk/core": ^3.974.8
+    "@aws-sdk/types": ^3.973.8
+    "@aws-sdk/util-endpoints": ^3.996.8
+    "@smithy/core": ^3.23.17
+    "@smithy/protocol-http": ^5.3.14
+    "@smithy/types": ^4.14.1
+    "@smithy/util-retry": ^4.3.6
+    tslib: ^2.6.2
+  checksum: b9cf9416bc276b4abf42513515de5ee45ee419255b5953c9e53b44010500fcc486de988351683ecae52bf00c6bb5819c67375261afe1375b8a2a44196a8b9884
+  languageName: node
+  linkType: hard
+
+"@aws-sdk/nested-clients@npm:^3.997.6":
+  version: 3.997.6
+  resolution: "@aws-sdk/nested-clients@npm:3.997.6"
+  dependencies:
+    "@aws-crypto/sha256-browser": 5.2.0
+    "@aws-crypto/sha256-js": 5.2.0
+    "@aws-sdk/core": ^3.974.8
+    "@aws-sdk/middleware-host-header": ^3.972.10
+    "@aws-sdk/middleware-logger": ^3.972.10
+    "@aws-sdk/middleware-recursion-detection": ^3.972.11
+    "@aws-sdk/middleware-user-agent": ^3.972.38
+    "@aws-sdk/region-config-resolver": ^3.972.13
+    "@aws-sdk/signature-v4-multi-region": ^3.996.25
+    "@aws-sdk/types": ^3.973.8
+    "@aws-sdk/util-endpoints": ^3.996.8
+    "@aws-sdk/util-user-agent-browser": ^3.972.10
+    "@aws-sdk/util-user-agent-node": ^3.973.24
+    "@smithy/config-resolver": ^4.4.17
+    "@smithy/core": ^3.23.17
+    "@smithy/fetch-http-handler": ^5.3.17
+    "@smithy/hash-node": ^4.2.14
+    "@smithy/invalid-dependency": ^4.2.14
+    "@smithy/middleware-content-length": ^4.2.14
+    "@smithy/middleware-endpoint": ^4.4.32
+    "@smithy/middleware-retry": ^4.5.7
+    "@smithy/middleware-serde": ^4.2.20
+    "@smithy/middleware-stack": ^4.2.14
+    "@smithy/node-config-provider": ^4.3.14
+    "@smithy/node-http-handler": ^4.6.1
+    "@smithy/protocol-http": ^5.3.14
+    "@smithy/smithy-client": ^4.12.13
+    "@smithy/types": ^4.14.1
+    "@smithy/url-parser": ^4.2.14
+    "@smithy/util-base64": ^4.3.2
+    "@smithy/util-body-length-browser": ^4.2.2
+    "@smithy/util-body-length-node": ^4.2.3
+    "@smithy/util-defaults-mode-browser": ^4.3.49
+    "@smithy/util-defaults-mode-node": ^4.2.54
+    "@smithy/util-endpoints": ^3.4.2
+    "@smithy/util-middleware": ^4.2.14
+    "@smithy/util-retry": ^4.3.6
+    "@smithy/util-utf8": ^4.2.2
+    tslib: ^2.6.2
+  checksum: 05c74c7362be74c723b64667763bd1e635c8d566456f70b64fa26546e7c605a49bf1bede7c2f5c293a0677b737093bbdc9b957a26124b9e1de5acf715dc57bb4
   languageName: node
   linkType: hard
 
-"@babel/plugin-transform-react-jsx-self@npm:^7.27.1":
-  version: 7.27.1
-  resolution: "@babel/plugin-transform-react-jsx-self@npm:7.27.1"
+"@aws-sdk/region-config-resolver@npm:^3.972.13, @aws-sdk/region-config-resolver@npm:^3.972.3":
+  version: 3.972.13
+  resolution: "@aws-sdk/region-config-resolver@npm:3.972.13"
   dependencies:
-    "@babel/helper-plugin-utils": ^7.27.1
-  peerDependencies:
-    "@babel/core": ^7.0.0-0
-  checksum: 00a4f917b70a608f9aca2fb39aabe04a60aa33165a7e0105fd44b3a8531630eb85bf5572e9f242f51e6ad2fa38c2e7e780902176c863556c58b5ba6f6e164031
+    "@aws-sdk/types": ^3.973.8
+    "@smithy/config-resolver": ^4.4.17
+    "@smithy/node-config-provider": ^4.3.14
+    "@smithy/types": ^4.14.1
+    tslib: ^2.6.2
+  checksum: 8cc3e5433ccf9ec4efb6d12ccd924701cfd6fb018124c9e5106486da10402ea1b83b0855353dae5e0f31ad2c7b6d962ac832350a5cdbeda59a30231525fd1118
   languageName: node
   linkType: hard
 
-"@babel/plugin-transform-react-jsx-source@npm:^7.27.1":
-  version: 7.27.1
-  resolution: "@babel/plugin-transform-react-jsx-source@npm:7.27.1"
+"@aws-sdk/signature-v4-multi-region@npm:3.984.0":
+  version: 3.984.0
+  resolution: "@aws-sdk/signature-v4-multi-region@npm:3.984.0"
   dependencies:
-    "@babel/helper-plugin-utils": ^7.27.1
-  peerDependencies:
-    "@babel/core": ^7.0.0-0
-  checksum: 5e67b56c39c4d03e59e03ba80692b24c5a921472079b63af711b1d250fc37c1733a17069b63537f750f3e937ec44a42b1ee6a46cd23b1a0df5163b17f741f7f2
+    "@aws-sdk/middleware-sdk-s3": ^3.972.6
+    "@aws-sdk/types": ^3.973.1
+    "@smithy/protocol-http": ^5.3.8
+    "@smithy/signature-v4": ^5.3.8
+    "@smithy/types": ^4.12.0
+    tslib: ^2.6.2
+  checksum: 181ba83561b331955b63483bb91f13231e25b9e367ae910f34f46aa99a82f693e71fe807b886b4a16361dcac258d33d5a5fff83f5696eca0345b83818595c751
   languageName: node
   linkType: hard
 
-"@babel/runtime@npm:^7.1.2, @babel/runtime@npm:^7.21.0, @babel/runtime@npm:^7.23.7, @babel/runtime@npm:^7.5.5, @babel/runtime@npm:^7.8.7":
-  version: 7.23.9
-  resolution: "@babel/runtime@npm:7.23.9"
+"@aws-sdk/signature-v4-multi-region@npm:^3.996.25":
+  version: 3.996.25
+  resolution: "@aws-sdk/signature-v4-multi-region@npm:3.996.25"
   dependencies:
-    regenerator-runtime: ^0.14.0
-  checksum: e71205fdd7082b2656512cc98e647d9ea7e222e4fe5c36e9e5adc026446fcc3ba7b3cdff8b0b694a0b78bb85db83e7b1e3d4c56ef90726682b74f13249cf952d
+    "@aws-sdk/middleware-sdk-s3": ^3.972.37
+    "@aws-sdk/types": ^3.973.8
+    "@smithy/protocol-http": ^5.3.14
+    "@smithy/signature-v4": ^5.3.14
+    "@smithy/types": ^4.14.1
+    tslib: ^2.6.2
+  checksum: 05196c85d265e5e59df621c7844235a449a940ebc8264578c0f87d76b6fbb741650a5634433589b9223a05003198be214068eef7d6e50596196de0f1d1954b5d
   languageName: node
   linkType: hard
 
-"@babel/runtime@npm:^7.12.5":
-  version: 7.28.4
-  resolution: "@babel/runtime@npm:7.28.4"
-  checksum: 792ce7af9750fb9b93879cc9d1db175701c4689da890e6ced242ea0207c9da411ccf16dc04e689cc01158b28d7898c40d75598f4559109f761c12ce01e959bf7
+"@aws-sdk/token-providers@npm:3.1041.0":
+  version: 3.1041.0
+  resolution: "@aws-sdk/token-providers@npm:3.1041.0"
+  dependencies:
+    "@aws-sdk/core": ^3.974.8
+    "@aws-sdk/nested-clients": ^3.997.6
+    "@aws-sdk/types": ^3.973.8
+    "@smithy/property-provider": ^4.2.14
+    "@smithy/shared-ini-file-loader": ^4.4.9
+    "@smithy/types": ^4.14.1
+    tslib: ^2.6.2
+  checksum: af70f8e23a98a750dcb661b43bbd896e4a2425f553336c491b118a058e46691689ac4fa980f69d2dae42d1488f3b859adbd2f347d73ac1261f44b421d2041101
   languageName: node
   linkType: hard
 
-"@babel/runtime@npm:^7.17.9":
-  version: 7.27.6
-  resolution: "@babel/runtime@npm:7.27.6"
-  checksum: 89726be83f356f511dcdb74d3ea4d873a5f0cf0017d4530cb53aa27380c01ca102d573eff8b8b77815e624b1f8c24e7f0311834ad4fb632c90a770fda00bd4c8
+"@aws-sdk/types@npm:^3.222.0, @aws-sdk/types@npm:^3.973.1, @aws-sdk/types@npm:^3.973.8":
+  version: 3.973.8
+  resolution: "@aws-sdk/types@npm:3.973.8"
+  dependencies:
+    "@smithy/types": ^4.14.1
+    tslib: ^2.6.2
+  checksum: 4823579e7dd0f6dcce9e9fea9630091eb46e3596bc468614a072f682b1eab6f048854ccf5e9398459ada175c13dfc636ffa8c1d3aa655cf6f22447f9c1a02f7f
   languageName: node
   linkType: hard
 
-"@babel/runtime@npm:^7.22.5":
-  version: 7.26.10
-  resolution: "@babel/runtime@npm:7.26.10"
+"@aws-sdk/util-arn-parser@npm:^3.972.3":
+  version: 3.972.3
+  resolution: "@aws-sdk/util-arn-parser@npm:3.972.3"
   dependencies:
-    regenerator-runtime: ^0.14.0
-  checksum: 6dc6d88c7908f505c4f7770fb4677dfa61f68f659b943c2be1f2a99cb6680343462867abf2d49822adc435932919b36c77ac60125793e719ea8745f2073d3745
+    tslib: ^2.6.2
+  checksum: 75c94dcd5d99a60375ce3474b0ee4f1ca17abdcd46ffbf34ce9d2e15238d77903c8993dddd46f1f328a7989c5aaec0c7dfef8b3eaa3e1125bea777399cfc46f2
   languageName: node
   linkType: hard
 
-"@babel/template@npm:^7.22.15, @babel/template@npm:^7.23.9":
-  version: 7.23.9
-  resolution: "@babel/template@npm:7.23.9"
+"@aws-sdk/util-endpoints@npm:3.984.0":
+  version: 3.984.0
+  resolution: "@aws-sdk/util-endpoints@npm:3.984.0"
   dependencies:
-    "@babel/code-frame": ^7.23.5
-    "@babel/parser": ^7.23.9
-    "@babel/types": ^7.23.9
-  checksum: 0e8b60119433787742bc08ae762bbd8d6755611c4cabbcb7627b292ec901a55af65d93d1c88572326069efb64136ef151ec91ffb74b2df7689bbab237030833a
+    "@aws-sdk/types": ^3.973.1
+    "@smithy/types": ^4.12.0
+    "@smithy/url-parser": ^4.2.8
+    "@smithy/util-endpoints": ^3.2.8
+    tslib: ^2.6.2
+  checksum: 5b49c27e11b94f3a505920b41e7a96be6cd3f370ccf2921d322f65f93ba4d50f99a0c32d9adc0d27500caa1b0ebd4491d6efe773d8f124c8272c9857a0ae4f1a
   languageName: node
   linkType: hard
 
-"@babel/template@npm:^7.27.2":
-  version: 7.27.2
-  resolution: "@babel/template@npm:7.27.2"
+"@aws-sdk/util-endpoints@npm:^3.996.8":
+  version: 3.996.8
+  resolution: "@aws-sdk/util-endpoints@npm:3.996.8"
   dependencies:
-    "@babel/code-frame": ^7.27.1
-    "@babel/parser": ^7.27.2
-    "@babel/types": ^7.27.1
-  checksum: ed9e9022651e463cc5f2cc21942f0e74544f1754d231add6348ff1b472985a3b3502041c0be62dc99ed2d12cfae0c51394bf827452b98a2f8769c03b87aadc81
+    "@aws-sdk/types": ^3.973.8
+    "@smithy/types": ^4.14.1
+    "@smithy/url-parser": ^4.2.14
+    "@smithy/util-endpoints": ^3.4.2
+    tslib: ^2.6.2
+  checksum: 66f17e85357ab8e265ab7d1c9a69a064ad3bea99420c786be9ef1f92bc71dca22d328bbceeaf6c64b4a3c37161b78318a3e4a424bf247dcb211d7ae29344db2f
   languageName: node
   linkType: hard
 
-"@babel/traverse@npm:^7.18.9, @babel/traverse@npm:^7.23.9":
-  version: 7.23.9
-  resolution: "@babel/traverse@npm:7.23.9"
+"@aws-sdk/util-locate-window@npm:^3.0.0":
+  version: 3.965.5
+  resolution: "@aws-sdk/util-locate-window@npm:3.965.5"
   dependencies:
-    "@babel/code-frame": ^7.23.5
-    "@babel/generator": ^7.23.6
-    "@babel/helper-environment-visitor": ^7.22.20
-    "@babel/helper-function-name": ^7.23.0
-    "@babel/helper-hoist-variables": ^7.22.5
-    "@babel/helper-split-export-declaration": ^7.22.6
-    "@babel/parser": ^7.23.9
-    "@babel/types": ^7.23.9
-    debug: ^4.3.1
-    globals: ^11.1.0
-  checksum: d1615d1d02f04d47111a7ea4446a1a6275668ca39082f31d51f08380de9502e19862be434eaa34b022ce9a17dbb8f9e2b73a746c654d9575f3a680a7ffdf5630
+    tslib: ^2.6.2
+  checksum: f5e33a4d7cbfd832ce4bf35b0e532bcabb4084e9b17d45903bccd43f0e221366a423b6acdea8c705ec66b9776f1e624fd640ad716f7446d014e698249d091e83
   languageName: node
   linkType: hard
 
-"@babel/traverse@npm:^7.27.1, @babel/traverse@npm:^7.28.3, @babel/traverse@npm:^7.28.5":
-  version: 7.28.5
-  resolution: "@babel/traverse@npm:7.28.5"
+"@aws-sdk/util-user-agent-browser@npm:^3.972.10, @aws-sdk/util-user-agent-browser@npm:^3.972.3":
+  version: 3.972.10
+  resolution: "@aws-sdk/util-user-agent-browser@npm:3.972.10"
   dependencies:
-    "@babel/code-frame": ^7.27.1
-    "@babel/generator": ^7.28.5
-    "@babel/helper-globals": ^7.28.0
-    "@babel/parser": ^7.28.5
-    "@babel/template": ^7.27.2
-    "@babel/types": ^7.28.5
-    debug: ^4.3.1
-  checksum: f6c4a595993ae2b73f2d4cd9c062f2e232174d293edd4abe1d715bd6281da8d99e47c65857e8d0917d9384c65972f4acdebc6749a7c40a8fcc38b3c7fb3e706f
+    "@aws-sdk/types": ^3.973.8
+    "@smithy/types": ^4.14.1
+    bowser: ^2.11.0
+    tslib: ^2.6.2
+  checksum: e139dda2cb51a0a3553c80ec6f89c39cb1292876c116f8449f21a7fdbe39bd7b545ef8ea69a447dd9fa2aa43c99f625ee6a55cbf6d8e6cf2094d0ef00ceb1e36
   languageName: node
   linkType: hard
 
-"@babel/types@npm:^7.0.0, @babel/types@npm:^7.18.9, @babel/types@npm:^7.20.7, @babel/types@npm:^7.22.15, @babel/types@npm:^7.22.5, @babel/types@npm:^7.23.0, @babel/types@npm:^7.23.6, @babel/types@npm:^7.23.9, @babel/types@npm:^7.8.3":
-  version: 7.23.9
-  resolution: "@babel/types@npm:7.23.9"
+"@aws-sdk/util-user-agent-node@npm:^3.972.4, @aws-sdk/util-user-agent-node@npm:^3.973.24":
+  version: 3.973.24
+  resolution: "@aws-sdk/util-user-agent-node@npm:3.973.24"
   dependencies:
-    "@babel/helper-string-parser": ^7.23.4
-    "@babel/helper-validator-identifier": ^7.22.20
-    to-fast-properties: ^2.0.0
-  checksum: edc7bb180ce7e4d2aea10c6972fb10474341ac39ba8fdc4a27ffb328368dfdfbf40fca18e441bbe7c483774500d5c05e222cec276c242e952853dcaf4eb884f7
+    "@aws-sdk/middleware-user-agent": ^3.972.38
+    "@aws-sdk/types": ^3.973.8
+    "@smithy/node-config-provider": ^4.3.14
+    "@smithy/types": ^4.14.1
+    "@smithy/util-config-provider": ^4.2.2
+    tslib: ^2.6.2
+  peerDependencies:
+    aws-crt: ">=1.0.0"
+  peerDependenciesMeta:
+    aws-crt:
+      optional: true
+  checksum: 859c6441d1d24594d73a125c2a335faeb412a5cc3ab318005ce2e4904c3f9a0c6781437ae0fb2e3a1eb2343146dafbb9ac037ea88fbd8e78d50f7153732c5bb4
   languageName: node
   linkType: hard
 
-"@babel/types@npm:^7.27.1, @babel/types@npm:^7.28.4, @babel/types@npm:^7.28.5":
-  version: 7.28.5
-  resolution: "@babel/types@npm:7.28.5"
+"@aws-sdk/xml-builder@npm:^3.972.22":
+  version: 3.972.22
+  resolution: "@aws-sdk/xml-builder@npm:3.972.22"
   dependencies:
-    "@babel/helper-string-parser": ^7.27.1
-    "@babel/helper-validator-identifier": ^7.28.5
-  checksum: a5a483d2100befbf125793640dec26b90b95fd233a94c19573325898a5ce1e52cdfa96e495c7dcc31b5eca5b66ce3e6d4a0f5a4a62daec271455959f208ab08a
+    "@nodable/entities": 2.1.0
+    "@smithy/types": ^4.14.1
+    fast-xml-parser: 5.7.2
+    tslib: ^2.6.2
+  checksum: 4d9a7056a8ce6af639a9fa354f70a5a895b2e23c06c027776849d32ba18aa0d7f174133f1bc15756b79ac2bfdb9d990f092fb76a3891a7d1f6b03a424a8a6735
   languageName: node
   linkType: hard
 
-"@braintree/sanitize-url@npm:^6.0.1":
-  version: 6.0.4
-  resolution: "@braintree/sanitize-url@npm:6.0.4"
-  checksum: 5d7bac57f3e49931db83f65aaa4fd22f96caa323bf0c7fcf6851fdbed179a8cf29eaa5dd372d340fc51ca5f44345ea5bc0196b36c8b16179888a7c9044313420
+"@aws/lambda-invoke-store@npm:^0.2.2":
+  version: 0.2.4
+  resolution: "@aws/lambda-invoke-store@npm:0.2.4"
+  checksum: 29d874d7c1a2d971e0c02980594204f89cda718f215f2fc52b6c56eacbdad1fa5f6ce1b358e5811f5cd35d04c76299a67a8aff95318446af2bdfb4910f213e13
   languageName: node
   linkType: hard
 
-"@cloudinary/transformation-builder-sdk@npm:^1.12.1":
-  version: 1.12.1
-  resolution: "@cloudinary/transformation-builder-sdk@npm:1.12.1"
+"@babel/code-frame@npm:^7.10.4, @babel/code-frame@npm:^7.27.1":
+  version: 7.27.1
+  resolution: "@babel/code-frame@npm:7.27.1"
   dependencies:
-    "@cloudinary/url-gen": ^1.7.0
-  checksum: 3de50b6ac1a31af72cfef14cdd4e76d4795652570bb79a8665215a72f362ff7067de57b62599d22d276272aca1f67f0fb97acc329bc80fbf3d4f8e4b37beabf0
+    "@babel/helper-validator-identifier": ^7.27.1
+    js-tokens: ^4.0.0
+    picocolors: ^1.1.1
+  checksum: 5dd9a18baa5fce4741ba729acc3a3272c49c25cb8736c4b18e113099520e7ef7b545a4096a26d600e4416157e63e87d66db46aa3fbf0a5f2286da2705c12da00
   languageName: node
   linkType: hard
 
-"@cloudinary/url-gen@npm:^1.17.0, @cloudinary/url-gen@npm:^1.7.0":
-  version: 1.17.0
-  resolution: "@cloudinary/url-gen@npm:1.17.0"
+"@babel/code-frame@npm:^7.16.0, @babel/code-frame@npm:^7.23.5":
+  version: 7.23.5
+  resolution: "@babel/code-frame@npm:7.23.5"
   dependencies:
-    "@cloudinary/transformation-builder-sdk": ^1.12.1
-  checksum: 5b01cbbf2a423eb246df5fd0c15ad9e4e607bc08fbfd3ab2f800381224b2064c0c96731d2046544959023fa285f4e01aadeac69ffd43c48d99939f158fa408fc
+    "@babel/highlight": ^7.23.4
+    chalk: ^2.4.2
+  checksum: a10e843595ddd9f97faa99917414813c06214f4d9205294013e20c70fbdf4f943760da37dec1d998bf3e6fc20fa2918a47c0e987a7e458663feb7698063ad7c6
   languageName: node
   linkType: hard
 
-"@cspotcode/source-map-support@npm:^0.8.0":
-  version: 0.8.1
-  resolution: "@cspotcode/source-map-support@npm:0.8.1"
+"@babel/code-frame@npm:^7.22.5":
+  version: 7.26.2
+  resolution: "@babel/code-frame@npm:7.26.2"
   dependencies:
-    "@jridgewell/trace-mapping": 0.3.9
-  checksum: 05c5368c13b662ee4c122c7bfbe5dc0b613416672a829f3e78bc49a357a197e0218d6e74e7c66cfcd04e15a179acab080bd3c69658c9fbefd0e1ccd950a07fc6
+    "@babel/helper-validator-identifier": ^7.25.9
+    js-tokens: ^4.0.0
+    picocolors: ^1.0.0
+  checksum: 7d79621a6849183c415486af99b1a20b84737e8c11cd55b6544f688c51ce1fd710e6d869c3dd21232023da272a79b91efb3e83b5bc2dc65c1187c5fcd1b72ea8
   languageName: node
   linkType: hard
 
-"@csstools/color-helpers@npm:^5.1.0":
-  version: 5.1.0
-  resolution: "@csstools/color-helpers@npm:5.1.0"
-  checksum: b7f99d2e455cf1c9b41a67a5327d5d02888cd5c8802a68b1887dffef537d9d4bc66b3c10c1e62b40bbed638b6c1d60b85a232f904ed7b39809c4029cb36567db
+"@babel/compat-data@npm:^7.23.5":
+  version: 7.23.5
+  resolution: "@babel/compat-data@npm:7.23.5"
+  checksum: 081278ed46131a890ad566a59c61600a5f9557bd8ee5e535890c8548192532ea92590742fd74bd9db83d74c669ef8a04a7e1c85cdea27f960233e3b83c3a957c
   languageName: node
   linkType: hard
 
-"@csstools/css-calc@npm:^2.1.3, @csstools/css-calc@npm:^2.1.4":
-  version: 2.1.4
-  resolution: "@csstools/css-calc@npm:2.1.4"
-  peerDependencies:
-    "@csstools/css-parser-algorithms": ^3.0.5
-    "@csstools/css-tokenizer": ^3.0.4
-  checksum: 42ce5793e55ec4d772083808a11e9fb2dfe36db3ec168713069a276b4c3882205b3507c4680224c28a5d35fe0bc2d308c77f8f2c39c7c09aad8747708eb8ddd8
+"@babel/compat-data@npm:^7.27.2":
+  version: 7.28.5
+  resolution: "@babel/compat-data@npm:7.28.5"
+  checksum: 702a25de73087b0eba325c1d10979eed7c9b6662677386ba7b5aa6eace0fc0676f78343bae080a0176ae26f58bd5535d73b9d0fbb547fef377692e8b249353a7
   languageName: node
   linkType: hard
 
-"@csstools/css-color-parser@npm:^3.0.9, @csstools/css-color-parser@npm:^3.1.0":
-  version: 3.1.0
-  resolution: "@csstools/css-color-parser@npm:3.1.0"
+"@babel/core@npm:^7.18.9":
+  version: 7.23.9
+  resolution: "@babel/core@npm:7.23.9"
   dependencies:
-    "@csstools/color-helpers": ^5.1.0
-    "@csstools/css-calc": ^2.1.4
-  peerDependencies:
-    "@csstools/css-parser-algorithms": ^3.0.5
-    "@csstools/css-tokenizer": ^3.0.4
-  checksum: 0e0c670ad54ec8ec4d9b07568b80defd83b9482191f5e8ca84ab546b7be6db5d7cc2ba7ac9fae54488b129a4be235d6183d3aab4416fec5e89351f73af4222c5
+    "@ampproject/remapping": ^2.2.0
+    "@babel/code-frame": ^7.23.5
+    "@babel/generator": ^7.23.6
+    "@babel/helper-compilation-targets": ^7.23.6
+    "@babel/helper-module-transforms": ^7.23.3
+    "@babel/helpers": ^7.23.9
+    "@babel/parser": ^7.23.9
+    "@babel/template": ^7.23.9
+    "@babel/traverse": ^7.23.9
+    "@babel/types": ^7.23.9
+    convert-source-map: ^2.0.0
+    debug: ^4.1.0
+    gensync: ^1.0.0-beta.2
+    json5: ^2.2.3
+    semver: ^6.3.1
+  checksum: 03883300bf1252ab4c9ba5b52f161232dd52873dbe5cde9289bb2bb26e935c42682493acbac9194a59a3b6cbd17f4c4c84030db8d6d482588afe64531532ff9b
   languageName: node
   linkType: hard
 
-"@csstools/css-parser-algorithms@npm:^3.0.4, @csstools/css-parser-algorithms@npm:^3.0.5":
-  version: 3.0.5
-  resolution: "@csstools/css-parser-algorithms@npm:3.0.5"
-  peerDependencies:
-    "@csstools/css-tokenizer": ^3.0.4
-  checksum: d9a1c888bd43849ae3437ca39251d5c95d2c8fd6b5ccdb7c45491dfd2c1cbdc3075645e80901d120e4d2c1993db9a5b2d83793b779dbbabcfb132adb142eb7f7
-  languageName: node
-  linkType: hard
-
-"@csstools/css-syntax-patches-for-csstree@npm:^1.0.14":
-  version: 1.0.15
-  resolution: "@csstools/css-syntax-patches-for-csstree@npm:1.0.15"
-  checksum: 67949c5a09b8144ae5e87334c1698add2e1e2cfee4e4b43396905c7fbb74bdf759ca0300ba909f8946b3111036a8c863903fa46f1a880992b248306d6cd8b126
-  languageName: node
-  linkType: hard
-
-"@csstools/css-tokenizer@npm:^3.0.3, @csstools/css-tokenizer@npm:^3.0.4":
-  version: 3.0.4
-  resolution: "@csstools/css-tokenizer@npm:3.0.4"
-  checksum: 3b589f8e9942075a642213b389bab75a2d50d05d203727fcdac6827648a5572674caff07907eff3f9a2389d86a4ee47308fafe4f8588f4a77b7167c588d2559f
+"@babel/core@npm:^7.28.0":
+  version: 7.28.5
+  resolution: "@babel/core@npm:7.28.5"
+  dependencies:
+    "@babel/code-frame": ^7.27.1
+    "@babel/generator": ^7.28.5
+    "@babel/helper-compilation-targets": ^7.27.2
+    "@babel/helper-module-transforms": ^7.28.3
+    "@babel/helpers": ^7.28.4
+    "@babel/parser": ^7.28.5
+    "@babel/template": ^7.27.2
+    "@babel/traverse": ^7.28.5
+    "@babel/types": ^7.28.5
+    "@jridgewell/remapping": ^2.3.5
+    convert-source-map: ^2.0.0
+    debug: ^4.1.0
+    gensync: ^1.0.0-beta.2
+    json5: ^2.2.3
+    semver: ^6.3.1
+  checksum: 535f82238027621da6bdffbdbe896ebad3558b311d6f8abc680637a9859b96edbf929ab010757055381570b29cf66c4a295b5618318d27a4273c0e2033925e72
   languageName: node
   linkType: hard
 
-"@discoveryjs/json-ext@npm:0.5.7":
-  version: 0.5.7
-  resolution: "@discoveryjs/json-ext@npm:0.5.7"
-  checksum: e10f1b02b78e4812646ddf289b7d9f2cb567d336c363b266bd50cd223cf3de7c2c74018d91cd2613041568397ef3a4a2b500aba588c6e5bd78c38374ba68f38c
+"@babel/eslint-parser@npm:^7.25.9":
+  version: 7.25.9
+  resolution: "@babel/eslint-parser@npm:7.25.9"
+  dependencies:
+    "@nicolo-ribaudo/eslint-scope-5-internals": 5.1.1-v1
+    eslint-visitor-keys: ^2.1.0
+    semver: ^6.3.1
+  peerDependencies:
+    "@babel/core": ^7.11.0
+    eslint: ^7.5.0 || ^8.0.0 || ^9.0.0
+  checksum: 7dc525da9a076906aff562f82373765785732edf306e2be6497e347ed73be80d3544f2f845a77c2376bfa1c7c8c3580ea7346b12b78d8ddf4365c44fe9c35c4b
   languageName: node
   linkType: hard
 
-"@dnd-kit/accessibility@npm:^3.1.1":
-  version: 3.1.1
-  resolution: "@dnd-kit/accessibility@npm:3.1.1"
+"@babel/generator@npm:^7.23.6":
+  version: 7.23.6
+  resolution: "@babel/generator@npm:7.23.6"
   dependencies:
-    tslib: ^2.0.0
-  peerDependencies:
-    react: ">=16.8.0"
-  checksum: be0bf41716dc58f9386bc36906ec1ce72b7b42b6d1d0e631d347afe9bd8714a829bd6f58a346dd089b1519e93918ae2f94497411a61a4f5e4d9247c6cfd1fef8
+    "@babel/types": ^7.23.6
+    "@jridgewell/gen-mapping": ^0.3.2
+    "@jridgewell/trace-mapping": ^0.3.17
+    jsesc: ^2.5.1
+  checksum: 53540e905cd10db05d9aee0a5304e36927f455ce66f95d1253bb8a179f286b88fa7062ea0db354c566fe27f8bb96567566084ffd259f8feaae1de5eccc8afbda
   languageName: node
   linkType: hard
 
-"@dnd-kit/core@npm:^6.1.0":
-  version: 6.3.1
-  resolution: "@dnd-kit/core@npm:6.3.1"
+"@babel/generator@npm:^7.28.5":
+  version: 7.28.5
+  resolution: "@babel/generator@npm:7.28.5"
   dependencies:
-    "@dnd-kit/accessibility": ^3.1.1
-    "@dnd-kit/utilities": ^3.2.2
-    tslib: ^2.0.0
-  peerDependencies:
-    react: ">=16.8.0"
-    react-dom: ">=16.8.0"
-  checksum: 196db95d81096d9dc248983533eab91ba83591770fa5c894b1ac776f42af0d99522b3fd5bb3923411470e4733fcfa103e6ee17adc17b9b7eb54c7fbec5ff7c52
+    "@babel/parser": ^7.28.5
+    "@babel/types": ^7.28.5
+    "@jridgewell/gen-mapping": ^0.3.12
+    "@jridgewell/trace-mapping": ^0.3.28
+    jsesc: ^3.0.2
+  checksum: 9f219fe1d5431b6919f1a5c60db8d5d34fe546c0d8f5a8511b32f847569234ffc8032beb9e7404649a143f54e15224ecb53a3d11b6bb85c3203e573d91fca752
   languageName: node
   linkType: hard
 
-"@dnd-kit/sortable@npm:^8.0.0":
-  version: 8.0.0
-  resolution: "@dnd-kit/sortable@npm:8.0.0"
+"@babel/helper-compilation-targets@npm:^7.23.6":
+  version: 7.23.6
+  resolution: "@babel/helper-compilation-targets@npm:7.23.6"
   dependencies:
-    "@dnd-kit/utilities": ^3.2.2
-    tslib: ^2.0.0
-  peerDependencies:
-    "@dnd-kit/core": ^6.1.0
-    react: ">=16.8.0"
-  checksum: a6066c652b892c6a11320c7d8f5c18fdf723e721e8eea37f4ab657dee1ac5e7ca710ac32ce0712a57fe968bc07c13bcea5d5599d90dfdd95619e162befd4d2fb
+    "@babel/compat-data": ^7.23.5
+    "@babel/helper-validator-option": ^7.23.5
+    browserslist: ^4.22.2
+    lru-cache: ^5.1.1
+    semver: ^6.3.1
+  checksum: ba38506d11185f48b79abf439462ece271d3eead1673dd8814519c8c903c708523428806f05f2ec5efd0c56e4e278698fac967e5a4b5ee842c32415da54bc6fa
   languageName: node
   linkType: hard
 
-"@dnd-kit/utilities@npm:^3.2.2":
-  version: 3.2.2
-  resolution: "@dnd-kit/utilities@npm:3.2.2"
+"@babel/helper-compilation-targets@npm:^7.27.2":
+  version: 7.27.2
+  resolution: "@babel/helper-compilation-targets@npm:7.27.2"
   dependencies:
-    tslib: ^2.0.0
-  peerDependencies:
-    react: ">=16.8.0"
-  checksum: 9aa90526f3e3fd567b5acc1b625a63177b9e8d00e7e50b2bd0e08fa2bf4dba7e19529777e001fdb8f89a7ce69f30b190c8364d390212634e0afdfa8c395e85a0
+    "@babel/compat-data": ^7.27.2
+    "@babel/helper-validator-option": ^7.27.1
+    browserslist: ^4.24.0
+    lru-cache: ^5.1.1
+    semver: ^6.3.1
+  checksum: f338fa00dcfea931804a7c55d1a1c81b6f0a09787e528ec580d5c21b3ecb3913f6cb0f361368973ce953b824d910d3ac3e8a8ee15192710d3563826447193ad1
   languageName: node
   linkType: hard
 
-"@emnapi/runtime@npm:^1.4.0":
-  version: 1.4.3
-  resolution: "@emnapi/runtime@npm:1.4.3"
-  dependencies:
-    tslib: ^2.4.0
-  checksum: 3b7ab72d21cb4e034f07df80165265f85f445ef3f581d1bc87b67e5239428baa00200b68a7d5e37a0425c3a78320b541b07f76c5530f6f6f95336a6294ebf30b
+"@babel/helper-environment-visitor@npm:^7.22.20":
+  version: 7.22.20
+  resolution: "@babel/helper-environment-visitor@npm:7.22.20"
+  checksum: e762c2d8f5d423af89bd7ae9abe35bd4836d2eb401af868a63bbb63220c513c783e25ef001019418560b3fdc6d9a6fb67e6c0b650bcdeb3a2ac44b5c3d2bdd94
   languageName: node
   linkType: hard
 
-"@emotion/is-prop-valid@npm:^1.3.1":
-  version: 1.3.1
-  resolution: "@emotion/is-prop-valid@npm:1.3.1"
+"@babel/helper-function-name@npm:^7.23.0":
+  version: 7.23.0
+  resolution: "@babel/helper-function-name@npm:7.23.0"
   dependencies:
-    "@emotion/memoize": ^0.9.0
-  checksum: 123215540c816ff510737ec68dcc499c53ea4deb0bb6c2c27c03ed21046e2e69f6ad07a7a174d271c6cfcbcc9ea44e1763e0cf3875c92192f7689216174803cd
+    "@babel/template": ^7.22.15
+    "@babel/types": ^7.23.0
+  checksum: d771dd1f3222b120518176733c52b7cadac1c256ff49b1889dbbe5e3fed81db855b8cc4e40d949c9d3eae0e795e8229c1c8c24c0e83f27cfa6ee3766696c6428
   languageName: node
   linkType: hard
 
-"@emotion/memoize@npm:^0.9.0":
-  version: 0.9.0
-  resolution: "@emotion/memoize@npm:0.9.0"
-  checksum: 13f474a9201c7f88b543e6ea42f55c04fb2fdc05e6c5a3108aced2f7e7aa7eda7794c56bba02985a46d8aaa914fcdde238727a98341a96e2aec750d372dadd15
+"@babel/helper-globals@npm:^7.28.0":
+  version: 7.28.0
+  resolution: "@babel/helper-globals@npm:7.28.0"
+  checksum: 5a0cd0c0e8c764b5f27f2095e4243e8af6fa145daea2b41b53c0c1414fe6ff139e3640f4e2207ae2b3d2153a1abd346f901c26c290ee7cb3881dd922d4ee9232
   languageName: node
   linkType: hard
 
-"@esbuild/aix-ppc64@npm:0.21.5":
-  version: 0.21.5
-  resolution: "@esbuild/aix-ppc64@npm:0.21.5"
-  conditions: os=aix & cpu=ppc64
+"@babel/helper-hoist-variables@npm:^7.22.5":
+  version: 7.22.5
+  resolution: "@babel/helper-hoist-variables@npm:7.22.5"
+  dependencies:
+    "@babel/types": ^7.22.5
+  checksum: 60a3077f756a1cd9f14eb89f0037f487d81ede2b7cfe652ea6869cd4ec4c782b0fb1de01b8494b9a2d2050e3d154d7d5ad3be24806790acfb8cbe2073bf1e208
   languageName: node
   linkType: hard
 
-"@esbuild/android-arm64@npm:0.21.5":
-  version: 0.21.5
-  resolution: "@esbuild/android-arm64@npm:0.21.5"
-  conditions: os=android & cpu=arm64
+"@babel/helper-module-imports@npm:^7.22.15":
+  version: 7.22.15
+  resolution: "@babel/helper-module-imports@npm:7.22.15"
+  dependencies:
+    "@babel/types": ^7.22.15
+  checksum: 4e0d7fc36d02c1b8c8b3006dfbfeedf7a367d3334a04934255de5128115ea0bafdeb3e5736a2559917f0653e4e437400d54542da0468e08d3cbc86d3bbfa8f30
   languageName: node
   linkType: hard
 
-"@esbuild/android-arm@npm:0.21.5":
-  version: 0.21.5
-  resolution: "@esbuild/android-arm@npm:0.21.5"
-  conditions: os=android & cpu=arm
+"@babel/helper-module-imports@npm:^7.27.1":
+  version: 7.27.1
+  resolution: "@babel/helper-module-imports@npm:7.27.1"
+  dependencies:
+    "@babel/traverse": ^7.27.1
+    "@babel/types": ^7.27.1
+  checksum: e00aace096e4e29290ff8648455c2bc4ed982f0d61dbf2db1b5e750b9b98f318bf5788d75a4f974c151bd318fd549e81dbcab595f46b14b81c12eda3023f51e8
   languageName: node
   linkType: hard
 
-"@esbuild/android-x64@npm:0.21.5":
-  version: 0.21.5
-  resolution: "@esbuild/android-x64@npm:0.21.5"
-  conditions: os=android & cpu=x64
+"@babel/helper-module-transforms@npm:^7.23.3":
+  version: 7.23.3
+  resolution: "@babel/helper-module-transforms@npm:7.23.3"
+  dependencies:
+    "@babel/helper-environment-visitor": ^7.22.20
+    "@babel/helper-module-imports": ^7.22.15
+    "@babel/helper-simple-access": ^7.22.5
+    "@babel/helper-split-export-declaration": ^7.22.6
+    "@babel/helper-validator-identifier": ^7.22.20
+  peerDependencies:
+    "@babel/core": ^7.0.0
+  checksum: 211e1399d0c4993671e8e5c2b25383f08bee40004ace5404ed4065f0e9258cc85d99c1b82fd456c030ce5cfd4d8f310355b54ef35de9924eabfc3dff1331d946
   languageName: node
   linkType: hard
 
-"@esbuild/darwin-arm64@npm:0.21.5":
-  version: 0.21.5
-  resolution: "@esbuild/darwin-arm64@npm:0.21.5"
-  conditions: os=darwin & cpu=arm64
+"@babel/helper-module-transforms@npm:^7.28.3":
+  version: 7.28.3
+  resolution: "@babel/helper-module-transforms@npm:7.28.3"
+  dependencies:
+    "@babel/helper-module-imports": ^7.27.1
+    "@babel/helper-validator-identifier": ^7.27.1
+    "@babel/traverse": ^7.28.3
+  peerDependencies:
+    "@babel/core": ^7.0.0
+  checksum: 549be62515a6d50cd4cfefcab1b005c47f89bd9135a22d602ee6a5e3a01f27571868ada10b75b033569f24dc4a2bb8d04bfa05ee75c16da7ade2d0db1437fcdb
   languageName: node
   linkType: hard
 
-"@esbuild/darwin-x64@npm:0.21.5":
-  version: 0.21.5
-  resolution: "@esbuild/darwin-x64@npm:0.21.5"
-  conditions: os=darwin & cpu=x64
+"@babel/helper-plugin-utils@npm:^7.27.1":
+  version: 7.27.1
+  resolution: "@babel/helper-plugin-utils@npm:7.27.1"
+  checksum: 94cf22c81a0c11a09b197b41ab488d416ff62254ce13c57e62912c85700dc2e99e555225787a4099ff6bae7a1812d622c80fbaeda824b79baa10a6c5ac4cf69b
   languageName: node
   linkType: hard
 
-"@esbuild/freebsd-arm64@npm:0.21.5":
-  version: 0.21.5
-  resolution: "@esbuild/freebsd-arm64@npm:0.21.5"
-  conditions: os=freebsd & cpu=arm64
+"@babel/helper-simple-access@npm:^7.22.5":
+  version: 7.22.5
+  resolution: "@babel/helper-simple-access@npm:7.22.5"
+  dependencies:
+    "@babel/types": ^7.22.5
+  checksum: f0cf81a30ba3d09a625fd50e5a9069e575c5b6719234e04ee74247057f8104beca89ed03e9217b6e9b0493434cedc18c5ecca4cea6244990836f1f893e140369
   languageName: node
   linkType: hard
 
-"@esbuild/freebsd-x64@npm:0.21.5":
-  version: 0.21.5
-  resolution: "@esbuild/freebsd-x64@npm:0.21.5"
-  conditions: os=freebsd & cpu=x64
+"@babel/helper-split-export-declaration@npm:^7.22.6":
+  version: 7.22.6
+  resolution: "@babel/helper-split-export-declaration@npm:7.22.6"
+  dependencies:
+    "@babel/types": ^7.22.5
+  checksum: d83e4b623eaa9622c267d3c83583b72f3aac567dc393dda18e559d79187961cb29ae9c57b2664137fc3d19508370b12ec6a81d28af73a50e0846819cb21c6e44
   languageName: node
   linkType: hard
 
-"@esbuild/linux-arm64@npm:0.21.5":
-  version: 0.21.5
-  resolution: "@esbuild/linux-arm64@npm:0.21.5"
-  conditions: os=linux & cpu=arm64
+"@babel/helper-string-parser@npm:^7.23.4":
+  version: 7.23.4
+  resolution: "@babel/helper-string-parser@npm:7.23.4"
+  checksum: f348d5637ad70b6b54b026d6544bd9040f78d24e7ec245a0fc42293968181f6ae9879c22d89744730d246ce8ec53588f716f102addd4df8bbc79b73ea10004ac
   languageName: node
   linkType: hard
 
-"@esbuild/linux-arm@npm:0.21.5":
-  version: 0.21.5
-  resolution: "@esbuild/linux-arm@npm:0.21.5"
-  conditions: os=linux & cpu=arm
+"@babel/helper-string-parser@npm:^7.27.1":
+  version: 7.27.1
+  resolution: "@babel/helper-string-parser@npm:7.27.1"
+  checksum: 8bda3448e07b5583727c103560bcf9c4c24b3c1051a4c516d4050ef69df37bb9a4734a585fe12725b8c2763de0a265aa1e909b485a4e3270b7cfd3e4dbe4b602
   languageName: node
   linkType: hard
 
-"@esbuild/linux-ia32@npm:0.21.5":
-  version: 0.21.5
-  resolution: "@esbuild/linux-ia32@npm:0.21.5"
-  conditions: os=linux & cpu=ia32
+"@babel/helper-validator-identifier@npm:^7.22.20":
+  version: 7.22.20
+  resolution: "@babel/helper-validator-identifier@npm:7.22.20"
+  checksum: dcad63db345fb110e032de46c3688384b0008a42a4845180ce7cd62b1a9c0507a1bed727c4d1060ed1a03ae57b4d918570259f81724aaac1a5b776056f37504e
   languageName: node
   linkType: hard
 
-"@esbuild/linux-loong64@npm:0.14.54":
-  version: 0.14.54
-  resolution: "@esbuild/linux-loong64@npm:0.14.54"
-  conditions: os=linux & cpu=loong64
+"@babel/helper-validator-identifier@npm:^7.25.9":
+  version: 7.25.9
+  resolution: "@babel/helper-validator-identifier@npm:7.25.9"
+  checksum: 4fc6f830177b7b7e887ad3277ddb3b91d81e6c4a24151540d9d1023e8dc6b1c0505f0f0628ae653601eb4388a8db45c1c14b2c07a9173837aef7e4116456259d
   languageName: node
   linkType: hard
 
-"@esbuild/linux-loong64@npm:0.21.5":
-  version: 0.21.5
-  resolution: "@esbuild/linux-loong64@npm:0.21.5"
-  conditions: os=linux & cpu=loong64
+"@babel/helper-validator-identifier@npm:^7.27.1":
+  version: 7.27.1
+  resolution: "@babel/helper-validator-identifier@npm:7.27.1"
+  checksum: c558f11c4871d526498e49d07a84752d1800bf72ac0d3dad100309a2eaba24efbf56ea59af5137ff15e3a00280ebe588560534b0e894a4750f8b1411d8f78b84
   languageName: node
   linkType: hard
 
-"@esbuild/linux-mips64el@npm:0.21.5":
-  version: 0.21.5
-  resolution: "@esbuild/linux-mips64el@npm:0.21.5"
-  conditions: os=linux & cpu=mips64el
+"@babel/helper-validator-identifier@npm:^7.28.5":
+  version: 7.28.5
+  resolution: "@babel/helper-validator-identifier@npm:7.28.5"
+  checksum: 42aaebed91f739a41f3d80b72752d1f95fd7c72394e8e4bd7cdd88817e0774d80a432451bcba17c2c642c257c483bf1d409dd4548883429ea9493a3bc4ab0847
   languageName: node
   linkType: hard
 
-"@esbuild/linux-ppc64@npm:0.21.5":
-  version: 0.21.5
-  resolution: "@esbuild/linux-ppc64@npm:0.21.5"
-  conditions: os=linux & cpu=ppc64
+"@babel/helper-validator-option@npm:^7.23.5":
+  version: 7.23.5
+  resolution: "@babel/helper-validator-option@npm:7.23.5"
+  checksum: af45d5c0defb292ba6fd38979e8f13d7da63f9623d8ab9ededc394f67eb45857d2601278d151ae9affb6e03d5d608485806cd45af08b4468a0515cf506510e94
   languageName: node
   linkType: hard
 
-"@esbuild/linux-riscv64@npm:0.21.5":
-  version: 0.21.5
-  resolution: "@esbuild/linux-riscv64@npm:0.21.5"
-  conditions: os=linux & cpu=riscv64
+"@babel/helper-validator-option@npm:^7.27.1":
+  version: 7.27.1
+  resolution: "@babel/helper-validator-option@npm:7.27.1"
+  checksum: 6fec5f006eba40001a20f26b1ef5dbbda377b7b68c8ad518c05baa9af3f396e780bdfded24c4eef95d14bb7b8fd56192a6ed38d5d439b97d10efc5f1a191d148
   languageName: node
   linkType: hard
 
-"@esbuild/linux-s390x@npm:0.21.5":
-  version: 0.21.5
-  resolution: "@esbuild/linux-s390x@npm:0.21.5"
-  conditions: os=linux & cpu=s390x
+"@babel/helpers@npm:^7.23.9":
+  version: 7.23.9
+  resolution: "@babel/helpers@npm:7.23.9"
+  dependencies:
+    "@babel/template": ^7.23.9
+    "@babel/traverse": ^7.23.9
+    "@babel/types": ^7.23.9
+  checksum: f69fd0aca96a6fb8bd6dd044cd8a5c0f1851072d4ce23355345b9493c4032e76d1217f86b70df795e127553cf7f3fcd1587ede9d1b03b95e8b62681ca2165b87
   languageName: node
   linkType: hard
 
-"@esbuild/linux-x64@npm:0.21.5":
-  version: 0.21.5
-  resolution: "@esbuild/linux-x64@npm:0.21.5"
-  conditions: os=linux & cpu=x64
+"@babel/helpers@npm:^7.28.4":
+  version: 7.28.4
+  resolution: "@babel/helpers@npm:7.28.4"
+  dependencies:
+    "@babel/template": ^7.27.2
+    "@babel/types": ^7.28.4
+  checksum: aaa5fb8098926dfed5f223adf2c5e4c7fbba4b911b73dfec2d7d3083f8ba694d201a206db673da2d9b3ae8c01793e795767654558c450c8c14b4c2175b4fcb44
   languageName: node
   linkType: hard
 
-"@esbuild/netbsd-x64@npm:0.21.5":
-  version: 0.21.5
-  resolution: "@esbuild/netbsd-x64@npm:0.21.5"
-  conditions: os=netbsd & cpu=x64
+"@babel/highlight@npm:^7.23.4":
+  version: 7.23.4
+  resolution: "@babel/highlight@npm:7.23.4"
+  dependencies:
+    "@babel/helper-validator-identifier": ^7.22.20
+    chalk: ^2.4.2
+    js-tokens: ^4.0.0
+  checksum: fbff9fcb2f5539289c3c097d130e852afd10d89a3a08ac0b5ebebbc055cc84a4bcc3dcfed463d488cde12dd0902ef1858279e31d7349b2e8cee43913744bda33
   languageName: node
   linkType: hard
 
-"@esbuild/openbsd-x64@npm:0.21.5":
-  version: 0.21.5
-  resolution: "@esbuild/openbsd-x64@npm:0.21.5"
-  conditions: os=openbsd & cpu=x64
+"@babel/parser@npm:^7.1.0, @babel/parser@npm:^7.20.7, @babel/parser@npm:^7.23.9":
+  version: 7.23.9
+  resolution: "@babel/parser@npm:7.23.9"
+  bin:
+    parser: ./bin/babel-parser.js
+  checksum: 7df97386431366d4810538db4b9ec538f4377096f720c0591c7587a16f6810e62747e9fbbfa1ff99257fd4330035e4fb1b5b77c7bd3b97ce0d2e3780a6618975
   languageName: node
   linkType: hard
 
-"@esbuild/sunos-x64@npm:0.21.5":
-  version: 0.21.5
-  resolution: "@esbuild/sunos-x64@npm:0.21.5"
-  conditions: os=sunos & cpu=x64
+"@babel/parser@npm:^7.27.2, @babel/parser@npm:^7.28.5":
+  version: 7.28.5
+  resolution: "@babel/parser@npm:7.28.5"
+  dependencies:
+    "@babel/types": ^7.28.5
+  bin:
+    parser: ./bin/babel-parser.js
+  checksum: 5bbe48bf2c79594ac02b490a41ffde7ef5aa22a9a88ad6bcc78432a6ba8a9d638d531d868bd1f104633f1f6bba9905746e15185b8276a3756c42b765d131b1ef
   languageName: node
   linkType: hard
 
-"@esbuild/win32-arm64@npm:0.21.5":
-  version: 0.21.5
-  resolution: "@esbuild/win32-arm64@npm:0.21.5"
-  conditions: os=win32 & cpu=arm64
+"@babel/plugin-transform-react-jsx-self@npm:^7.27.1":
+  version: 7.27.1
+  resolution: "@babel/plugin-transform-react-jsx-self@npm:7.27.1"
+  dependencies:
+    "@babel/helper-plugin-utils": ^7.27.1
+  peerDependencies:
+    "@babel/core": ^7.0.0-0
+  checksum: 00a4f917b70a608f9aca2fb39aabe04a60aa33165a7e0105fd44b3a8531630eb85bf5572e9f242f51e6ad2fa38c2e7e780902176c863556c58b5ba6f6e164031
   languageName: node
   linkType: hard
 
-"@esbuild/win32-ia32@npm:0.21.5":
-  version: 0.21.5
-  resolution: "@esbuild/win32-ia32@npm:0.21.5"
-  conditions: os=win32 & cpu=ia32
+"@babel/plugin-transform-react-jsx-source@npm:^7.27.1":
+  version: 7.27.1
+  resolution: "@babel/plugin-transform-react-jsx-source@npm:7.27.1"
+  dependencies:
+    "@babel/helper-plugin-utils": ^7.27.1
+  peerDependencies:
+    "@babel/core": ^7.0.0-0
+  checksum: 5e67b56c39c4d03e59e03ba80692b24c5a921472079b63af711b1d250fc37c1733a17069b63537f750f3e937ec44a42b1ee6a46cd23b1a0df5163b17f741f7f2
   languageName: node
   linkType: hard
 
-"@esbuild/win32-x64@npm:0.21.5":
-  version: 0.21.5
-  resolution: "@esbuild/win32-x64@npm:0.21.5"
-  conditions: os=win32 & cpu=x64
+"@babel/runtime@npm:^7.1.2, @babel/runtime@npm:^7.21.0, @babel/runtime@npm:^7.23.7, @babel/runtime@npm:^7.5.5, @babel/runtime@npm:^7.8.7":
+  version: 7.23.9
+  resolution: "@babel/runtime@npm:7.23.9"
+  dependencies:
+    regenerator-runtime: ^0.14.0
+  checksum: e71205fdd7082b2656512cc98e647d9ea7e222e4fe5c36e9e5adc026446fcc3ba7b3cdff8b0b694a0b78bb85db83e7b1e3d4c56ef90726682b74f13249cf952d
   languageName: node
   linkType: hard
 
-"@eslint-community/eslint-utils@npm:^4.2.0, @eslint-community/eslint-utils@npm:^4.4.0":
-  version: 4.4.0
-  resolution: "@eslint-community/eslint-utils@npm:4.4.0"
-  dependencies:
-    eslint-visitor-keys: ^3.3.0
-  peerDependencies:
-    eslint: ^6.0.0 || ^7.0.0 || >=8.0.0
-  checksum: 7e559c4ce59cd3a06b1b5a517b593912e680a7f981ae7affab0d01d709e99cd5647019be8fafa38c350305bc32f1f7d42c7073edde2ab536c745e365f37b607e
+"@babel/runtime@npm:^7.12.5":
+  version: 7.28.4
+  resolution: "@babel/runtime@npm:7.28.4"
+  checksum: 792ce7af9750fb9b93879cc9d1db175701c4689da890e6ced242ea0207c9da411ccf16dc04e689cc01158b28d7898c40d75598f4559109f761c12ce01e959bf7
   languageName: node
   linkType: hard
 
-"@eslint-community/regexpp@npm:^4.10.0, @eslint-community/regexpp@npm:^4.11.0":
-  version: 4.11.1
-  resolution: "@eslint-community/regexpp@npm:4.11.1"
-  checksum: fbcc1cb65ef5ed5b92faa8dc542e035269065e7ebcc0b39c81a4fe98ad35cfff20b3c8df048641de15a7757e07d69f85e2579c1a5055f993413ba18c055654f8
+"@babel/runtime@npm:^7.17.9":
+  version: 7.27.6
+  resolution: "@babel/runtime@npm:7.27.6"
+  checksum: 89726be83f356f511dcdb74d3ea4d873a5f0cf0017d4530cb53aa27380c01ca102d573eff8b8b77815e624b1f8c24e7f0311834ad4fb632c90a770fda00bd4c8
   languageName: node
   linkType: hard
 
-"@eslint/config-array@npm:^0.18.0":
-  version: 0.18.0
-  resolution: "@eslint/config-array@npm:0.18.0"
+"@babel/runtime@npm:^7.22.5":
+  version: 7.26.10
+  resolution: "@babel/runtime@npm:7.26.10"
   dependencies:
-    "@eslint/object-schema": ^2.1.4
-    debug: ^4.3.1
-    minimatch: ^3.1.2
-  checksum: 0234aeb3e6b052ad2402a647d0b4f8a6aa71524bafe1adad0b8db1dfe94d7f5f26d67c80f79bb37ac61361a1d4b14bb8fb475efe501de37263cf55eabb79868f
+    regenerator-runtime: ^0.14.0
+  checksum: 6dc6d88c7908f505c4f7770fb4677dfa61f68f659b943c2be1f2a99cb6680343462867abf2d49822adc435932919b36c77ac60125793e719ea8745f2073d3745
   languageName: node
   linkType: hard
 
-"@eslint/core@npm:^0.7.0":
-  version: 0.7.0
-  resolution: "@eslint/core@npm:0.7.0"
-  checksum: 3cdee8bc6cbb96ac6103d3ead42e59830019435839583c9eb352b94ed558bd78e7ffad5286dc710df21ec1e7bd8f52aa6574c62457a4dd0f01f3736fa4a7d87a
+"@babel/template@npm:^7.22.15, @babel/template@npm:^7.23.9":
+  version: 7.23.9
+  resolution: "@babel/template@npm:7.23.9"
+  dependencies:
+    "@babel/code-frame": ^7.23.5
+    "@babel/parser": ^7.23.9
+    "@babel/types": ^7.23.9
+  checksum: 0e8b60119433787742bc08ae762bbd8d6755611c4cabbcb7627b292ec901a55af65d93d1c88572326069efb64136ef151ec91ffb74b2df7689bbab237030833a
   languageName: node
   linkType: hard
 
-"@eslint/eslintrc@npm:^3.1.0":
-  version: 3.1.0
-  resolution: "@eslint/eslintrc@npm:3.1.0"
+"@babel/template@npm:^7.27.2":
+  version: 7.27.2
+  resolution: "@babel/template@npm:7.27.2"
   dependencies:
-    ajv: ^6.12.4
-    debug: ^4.3.2
-    espree: ^10.0.1
-    globals: ^14.0.0
-    ignore: ^5.2.0
-    import-fresh: ^3.2.1
-    js-yaml: ^4.1.0
-    minimatch: ^3.1.2
-    strip-json-comments: ^3.1.1
-  checksum: 5b7332ed781edcfc98caa8dedbbb843abfb9bda2e86538529c843473f580e40c69eb894410eddc6702f487e9ee8f8cfa8df83213d43a8fdb549f23ce06699167
+    "@babel/code-frame": ^7.27.1
+    "@babel/parser": ^7.27.2
+    "@babel/types": ^7.27.1
+  checksum: ed9e9022651e463cc5f2cc21942f0e74544f1754d231add6348ff1b472985a3b3502041c0be62dc99ed2d12cfae0c51394bf827452b98a2f8769c03b87aadc81
   languageName: node
   linkType: hard
 
-"@eslint/js@npm:9.13.0":
-  version: 9.13.0
-  resolution: "@eslint/js@npm:9.13.0"
-  checksum: 672257bffe17777b8a98bd80438702904cc7a0b98b9c2e426a8a10929198b3553edf8a3fc20feed4133c02e7c8f7331a0ef1b23e5dab8e4469f7f1791beff1e0
+"@babel/traverse@npm:^7.18.9, @babel/traverse@npm:^7.23.9":
+  version: 7.23.9
+  resolution: "@babel/traverse@npm:7.23.9"
+  dependencies:
+    "@babel/code-frame": ^7.23.5
+    "@babel/generator": ^7.23.6
+    "@babel/helper-environment-visitor": ^7.22.20
+    "@babel/helper-function-name": ^7.23.0
+    "@babel/helper-hoist-variables": ^7.22.5
+    "@babel/helper-split-export-declaration": ^7.22.6
+    "@babel/parser": ^7.23.9
+    "@babel/types": ^7.23.9
+    debug: ^4.3.1
+    globals: ^11.1.0
+  checksum: d1615d1d02f04d47111a7ea4446a1a6275668ca39082f31d51f08380de9502e19862be434eaa34b022ce9a17dbb8f9e2b73a746c654d9575f3a680a7ffdf5630
   languageName: node
   linkType: hard
 
-"@eslint/object-schema@npm:^2.1.4":
-  version: 2.1.4
-  resolution: "@eslint/object-schema@npm:2.1.4"
-  checksum: e9885532ea70e483fb007bf1275968b05bb15ebaa506d98560c41a41220d33d342e19023d5f2939fed6eb59676c1bda5c847c284b4b55fce521d282004da4dda
+"@babel/traverse@npm:^7.27.1, @babel/traverse@npm:^7.28.3, @babel/traverse@npm:^7.28.5":
+  version: 7.28.5
+  resolution: "@babel/traverse@npm:7.28.5"
+  dependencies:
+    "@babel/code-frame": ^7.27.1
+    "@babel/generator": ^7.28.5
+    "@babel/helper-globals": ^7.28.0
+    "@babel/parser": ^7.28.5
+    "@babel/template": ^7.27.2
+    "@babel/types": ^7.28.5
+    debug: ^4.3.1
+  checksum: f6c4a595993ae2b73f2d4cd9c062f2e232174d293edd4abe1d715bd6281da8d99e47c65857e8d0917d9384c65972f4acdebc6749a7c40a8fcc38b3c7fb3e706f
   languageName: node
   linkType: hard
 
-"@eslint/plugin-kit@npm:^0.2.0":
-  version: 0.2.1
-  resolution: "@eslint/plugin-kit@npm:0.2.1"
+"@babel/types@npm:^7.0.0, @babel/types@npm:^7.18.9, @babel/types@npm:^7.20.7, @babel/types@npm:^7.22.15, @babel/types@npm:^7.22.5, @babel/types@npm:^7.23.0, @babel/types@npm:^7.23.6, @babel/types@npm:^7.23.9, @babel/types@npm:^7.8.3":
+  version: 7.23.9
+  resolution: "@babel/types@npm:7.23.9"
   dependencies:
-    levn: ^0.4.1
-  checksum: 34b1ecb35df97b0adeb6a43366fc1b8aa1a54d23fc9753019277e80a7295724fddb547a795fd59c9eb56d690bbf0d76d7f2286cb0f5db367a86a763d5acbde5f
+    "@babel/helper-string-parser": ^7.23.4
+    "@babel/helper-validator-identifier": ^7.22.20
+    to-fast-properties: ^2.0.0
+  checksum: edc7bb180ce7e4d2aea10c6972fb10474341ac39ba8fdc4a27ffb328368dfdfbf40fca18e441bbe7c483774500d5c05e222cec276c242e952853dcaf4eb884f7
   languageName: node
   linkType: hard
 
-"@fingerprintjs/fingerprintjs-pro-react@npm:^2.7.0":
-  version: 2.7.1
-  resolution: "@fingerprintjs/fingerprintjs-pro-react@npm:2.7.1"
+"@babel/types@npm:^7.27.1, @babel/types@npm:^7.28.4, @babel/types@npm:^7.28.5":
+  version: 7.28.5
+  resolution: "@babel/types@npm:7.28.5"
   dependencies:
-    "@fingerprintjs/fingerprintjs-pro-spa": ^1.3.3
-    fast-deep-equal: 3.1.3
-  checksum: b815f631be86cc9ff86be4f50b365b041af23e635661c44e37953d8c4c2e3add627c4314a38bf72176ccbd8c608b417da97b7396bf58cda5973121fafcb81efc
+    "@babel/helper-string-parser": ^7.27.1
+    "@babel/helper-validator-identifier": ^7.28.5
+  checksum: a5a483d2100befbf125793640dec26b90b95fd233a94c19573325898a5ce1e52cdfa96e495c7dcc31b5eca5b66ce3e6d4a0f5a4a62daec271455959f208ab08a
   languageName: node
   linkType: hard
 
-"@fingerprintjs/fingerprintjs-pro-spa@npm:^1.3.3":
-  version: 1.3.3
-  resolution: "@fingerprintjs/fingerprintjs-pro-spa@npm:1.3.3"
-  dependencies:
-    "@fingerprintjs/fingerprintjs-pro": ^3.12.0
-    tslib: ^2.7.0
-  checksum: 1049753761ed0fe25085b874529d9dfa377326fb82aa6e1c09cdfacd2d059b5d8b5f5e27d1c56ed3b08ea39ce36de5746e793d3294eba124d8f91af7ca394b76
+"@braintree/sanitize-url@npm:^6.0.1":
+  version: 6.0.4
+  resolution: "@braintree/sanitize-url@npm:6.0.4"
+  checksum: 5d7bac57f3e49931db83f65aaa4fd22f96caa323bf0c7fcf6851fdbed179a8cf29eaa5dd372d340fc51ca5f44345ea5bc0196b36c8b16179888a7c9044313420
   languageName: node
   linkType: hard
 
-"@fingerprintjs/fingerprintjs-pro@npm:^3.12.0":
-  version: 3.12.3
-  resolution: "@fingerprintjs/fingerprintjs-pro@npm:3.12.3"
-  checksum: 660790bbf6cecfdf00f00b93cab60385d6bc959f46c3d31933dc92585afd16e3c48e8300e8df925ba774ffa66b6e1fb7d909fea2c44fd1608c62aefed4791871
+"@cloudflare/kv-asset-handler@npm:0.5.0":
+  version: 0.5.0
+  resolution: "@cloudflare/kv-asset-handler@npm:0.5.0"
+  checksum: 46863066ff1628aa76946db6ecb5088ae64ba15d7bda7e4935bd1ab1dcf080cef9cd0920205c9508721153365ef1305984e3584e7ad2dd1c9454df984f441edb
   languageName: node
   linkType: hard
 
-"@floating-ui/core@npm:^1.0.0":
-  version: 1.6.0
-  resolution: "@floating-ui/core@npm:1.6.0"
-  dependencies:
-    "@floating-ui/utils": ^0.2.1
-  checksum: 667a68036f7dd5ed19442c7792a6002ca02d1799221c4396691bbe0b6008b48f6ccad581225e81fa266bb91232f6c66838a5f825f554217e1ec886178b93381b
+"@cloudflare/unenv-preset@npm:2.16.1":
+  version: 2.16.1
+  resolution: "@cloudflare/unenv-preset@npm:2.16.1"
+  peerDependencies:
+    unenv: 2.0.0-rc.24
+    workerd: ">1.20260305.0 <2.0.0-0"
+  peerDependenciesMeta:
+    workerd:
+      optional: true
+  checksum: 08c9bd9ef488a14fd5330eb2c0829fc221f97f12295f8263dc8e3a6816ebd1a629e7255a3619b8bb688f1f58deafe28042c4e90ea84c926438c768f235f82ad9
   languageName: node
   linkType: hard
 
-"@floating-ui/dom@npm:^1.6.1":
-  version: 1.6.3
-  resolution: "@floating-ui/dom@npm:1.6.3"
-  dependencies:
-    "@floating-ui/core": ^1.0.0
-    "@floating-ui/utils": ^0.2.0
-  checksum: d6cac10877918ce5a8d1a24b21738d2eb130a0191043d7c0dd43bccac507844d3b4dc5d4107d3891d82f6007945ca8fb4207a1252506e91c37e211f0f73cf77e
+"@cloudflare/workerd-darwin-64@npm:1.20260507.1":
+  version: 1.20260507.1
+  resolution: "@cloudflare/workerd-darwin-64@npm:1.20260507.1"
+  conditions: os=darwin & cpu=x64
   languageName: node
   linkType: hard
 
-"@floating-ui/react-dom@npm:^2.0.0":
-  version: 2.0.8
-  resolution: "@floating-ui/react-dom@npm:2.0.8"
-  dependencies:
-    "@floating-ui/dom": ^1.6.1
-  peerDependencies:
-    react: ">=16.8.0"
-    react-dom: ">=16.8.0"
-  checksum: 4d87451e2dcc54b4753a0d81181036e47821cfd0d4c23f7e9c31590c7c91fb15fb0a5a458969a5ddabd61601eca5875ebd4e40bff37cee31f373b8f1ccc64518
+"@cloudflare/workerd-darwin-arm64@npm:1.20260507.1":
+  version: 1.20260507.1
+  resolution: "@cloudflare/workerd-darwin-arm64@npm:1.20260507.1"
+  conditions: os=darwin & cpu=arm64
   languageName: node
   linkType: hard
 
-"@floating-ui/utils@npm:^0.2.0, @floating-ui/utils@npm:^0.2.1":
-  version: 0.2.1
-  resolution: "@floating-ui/utils@npm:0.2.1"
-  checksum: ee77756712cf5b000c6bacf11992ffb364f3ea2d0d51cc45197a7e646a17aeb86ea4b192c0b42f3fbb29487aee918a565e84f710b8c3645827767f406a6b4cc9
+"@cloudflare/workerd-linux-64@npm:1.20260507.1":
+  version: 1.20260507.1
+  resolution: "@cloudflare/workerd-linux-64@npm:1.20260507.1"
+  conditions: os=linux & cpu=x64
   languageName: node
   linkType: hard
 
-"@formatjs/ecma402-abstract@npm:1.18.2":
-  version: 1.18.2
-  resolution: "@formatjs/ecma402-abstract@npm:1.18.2"
-  dependencies:
-    "@formatjs/intl-localematcher": 0.5.4
-    tslib: ^2.4.0
-  checksum: 87afb37dd937555e712ca85d5142a9083d617c491d1dddf8d660fdfb6186272d2bc75b78809b076388d26f016200c8bddbce73281fd707eb899da2bf3bc9b7ca
+"@cloudflare/workerd-linux-arm64@npm:1.20260507.1":
+  version: 1.20260507.1
+  resolution: "@cloudflare/workerd-linux-arm64@npm:1.20260507.1"
+  conditions: os=linux & cpu=arm64
   languageName: node
   linkType: hard
 
-"@formatjs/fast-memoize@npm:2.2.0":
-  version: 2.2.0
-  resolution: "@formatjs/fast-memoize@npm:2.2.0"
-  dependencies:
-    tslib: ^2.4.0
-  checksum: ae88c5a93b96235aba4bd9b947d0310d2ec013687a99133413361b24122b5cdea8c9bf2e04a4a2a8b61f1f4ee5419ef6416ca4796554226b5050e05a9ce6ef49
+"@cloudflare/workerd-windows-64@npm:1.20260507.1":
+  version: 1.20260507.1
+  resolution: "@cloudflare/workerd-windows-64@npm:1.20260507.1"
+  conditions: os=win32 & cpu=x64
   languageName: node
   linkType: hard
 
-"@formatjs/icu-messageformat-parser@npm:2.7.6":
-  version: 2.7.6
-  resolution: "@formatjs/icu-messageformat-parser@npm:2.7.6"
-  dependencies:
-    "@formatjs/ecma402-abstract": 1.18.2
-    "@formatjs/icu-skeleton-parser": 1.8.0
-    tslib: ^2.4.0
-  checksum: 9fc72c2075333a969601e2be4260638940b1abefd1a5fc15b93b0b10d2319c9df5778aa51fc2a173ce66ca5e8a47b4b64caca85a32d0eb6095e16e8d65cb4b00
+"@cloudinary/transformation-builder-sdk@npm:^1.12.1":
+  version: 1.12.1
+  resolution: "@cloudinary/transformation-builder-sdk@npm:1.12.1"
+  dependencies:
+    "@cloudinary/url-gen": ^1.7.0
+  checksum: 3de50b6ac1a31af72cfef14cdd4e76d4795652570bb79a8665215a72f362ff7067de57b62599d22d276272aca1f67f0fb97acc329bc80fbf3d4f8e4b37beabf0
   languageName: node
   linkType: hard
 
-"@formatjs/icu-skeleton-parser@npm:1.8.0":
-  version: 1.8.0
-  resolution: "@formatjs/icu-skeleton-parser@npm:1.8.0"
+"@cloudinary/url-gen@npm:^1.17.0, @cloudinary/url-gen@npm:^1.7.0":
+  version: 1.17.0
+  resolution: "@cloudinary/url-gen@npm:1.17.0"
   dependencies:
-    "@formatjs/ecma402-abstract": 1.18.2
-    tslib: ^2.4.0
-  checksum: 10956732d70cc67049d216410b5dc3ef048935d1ea2ae76f5755bb9d0243af37ddeabd5d140ddbf5f6c7047068c3d02a05f93c68a89cedfaf7488d5062885ea4
+    "@cloudinary/transformation-builder-sdk": ^1.12.1
+  checksum: 5b01cbbf2a423eb246df5fd0c15ad9e4e607bc08fbfd3ab2f800381224b2064c0c96731d2046544959023fa285f4e01aadeac69ffd43c48d99939f158fa408fc
   languageName: node
   linkType: hard
 
-"@formatjs/intl-localematcher@npm:0.5.4":
-  version: 0.5.4
-  resolution: "@formatjs/intl-localematcher@npm:0.5.4"
+"@cspotcode/source-map-support@npm:0.8.1, @cspotcode/source-map-support@npm:^0.8.0":
+  version: 0.8.1
+  resolution: "@cspotcode/source-map-support@npm:0.8.1"
   dependencies:
-    tslib: ^2.4.0
-  checksum: c9ff5d34ca8b6fe59f8f303a3cc31a92d343e095a6987e273e5cc23f0fe99feb557a392a05da95931c7d24106acb6988e588d00ddd05b0934005aafd7fdbafe6
+    "@jridgewell/trace-mapping": 0.3.9
+  checksum: 05c5368c13b662ee4c122c7bfbe5dc0b613416672a829f3e78bc49a357a197e0218d6e74e7c66cfcd04e15a179acab080bd3c69658c9fbefd0e1ccd950a07fc6
   languageName: node
   linkType: hard
 
-"@hcaptcha/loader@npm:^2.0.0":
-  version: 2.0.0
-  resolution: "@hcaptcha/loader@npm:2.0.0"
-  checksum: c69c8e62ccf41cc5cce8f25721b9bd8284e201da608022476dc6d69afbd70512a6f272dd2bfe558c4b5fdbc0ee20fb5f062033c4d556e6d523ecb2448203298f
+"@csstools/color-helpers@npm:^5.1.0":
+  version: 5.1.0
+  resolution: "@csstools/color-helpers@npm:5.1.0"
+  checksum: b7f99d2e455cf1c9b41a67a5327d5d02888cd5c8802a68b1887dffef537d9d4bc66b3c10c1e62b40bbed638b6c1d60b85a232f904ed7b39809c4029cb36567db
   languageName: node
   linkType: hard
 
-"@hcaptcha/react-hcaptcha@npm:^1.12.0":
-  version: 1.12.0
-  resolution: "@hcaptcha/react-hcaptcha@npm:1.12.0"
+"@csstools/css-calc@npm:^2.1.3, @csstools/css-calc@npm:^2.1.4":
+  version: 2.1.4
+  resolution: "@csstools/css-calc@npm:2.1.4"
+  peerDependencies:
+    "@csstools/css-parser-algorithms": ^3.0.5
+    "@csstools/css-tokenizer": ^3.0.4
+  checksum: 42ce5793e55ec4d772083808a11e9fb2dfe36db3ec168713069a276b4c3882205b3507c4680224c28a5d35fe0bc2d308c77f8f2c39c7c09aad8747708eb8ddd8
+  languageName: node
+  linkType: hard
+
+"@csstools/css-color-parser@npm:^3.0.9, @csstools/css-color-parser@npm:^3.1.0":
+  version: 3.1.0
+  resolution: "@csstools/css-color-parser@npm:3.1.0"
   dependencies:
-    "@babel/runtime": ^7.17.9
-    "@hcaptcha/loader": ^2.0.0
+    "@csstools/color-helpers": ^5.1.0
+    "@csstools/css-calc": ^2.1.4
   peerDependencies:
-    react: ">= 16.3.0"
-    react-dom: ">= 16.3.0"
-  checksum: 58fddf7cbbeb1c9d784a90a4ee76604efd8d0c968d1d256f72d112d95c8d68bbb1255dd4184148e7e43e38491c5614b3747f4d17393a17d320e28935da47f8e8
+    "@csstools/css-parser-algorithms": ^3.0.5
+    "@csstools/css-tokenizer": ^3.0.4
+  checksum: 0e0c670ad54ec8ec4d9b07568b80defd83b9482191f5e8ca84ab546b7be6db5d7cc2ba7ac9fae54488b129a4be235d6183d3aab4416fec5e89351f73af4222c5
   languageName: node
   linkType: hard
 
-"@humanfs/core@npm:^0.19.0":
-  version: 0.19.0
-  resolution: "@humanfs/core@npm:0.19.0"
-  checksum: f87952d5caba6ae427a620eff783c5d0b6cef0cfc256dec359cdaa636c5f161edb8d8dad576742b3de7f0b2f222b34aad6870248e4b7d2177f013426cbcda232
+"@csstools/css-parser-algorithms@npm:^3.0.4, @csstools/css-parser-algorithms@npm:^3.0.5":
+  version: 3.0.5
+  resolution: "@csstools/css-parser-algorithms@npm:3.0.5"
+  peerDependencies:
+    "@csstools/css-tokenizer": ^3.0.4
+  checksum: d9a1c888bd43849ae3437ca39251d5c95d2c8fd6b5ccdb7c45491dfd2c1cbdc3075645e80901d120e4d2c1993db9a5b2d83793b779dbbabcfb132adb142eb7f7
   languageName: node
   linkType: hard
 
-"@humanfs/node@npm:^0.16.5":
-  version: 0.16.5
-  resolution: "@humanfs/node@npm:0.16.5"
-  dependencies:
-    "@humanfs/core": ^0.19.0
-    "@humanwhocodes/retry": ^0.3.0
-  checksum: 41c365ab09e7c9eaeed373d09243195aef616d6745608a36fc3e44506148c28843872f85e69e2bf5f1e992e194286155a1c1cecfcece6a2f43875e37cd243935
+"@csstools/css-syntax-patches-for-csstree@npm:^1.0.14":
+  version: 1.0.15
+  resolution: "@csstools/css-syntax-patches-for-csstree@npm:1.0.15"
+  checksum: 67949c5a09b8144ae5e87334c1698add2e1e2cfee4e4b43396905c7fbb74bdf759ca0300ba909f8946b3111036a8c863903fa46f1a880992b248306d6cd8b126
   languageName: node
   linkType: hard
 
-"@humanwhocodes/module-importer@npm:^1.0.1":
-  version: 1.0.1
-  resolution: "@humanwhocodes/module-importer@npm:1.0.1"
-  checksum: 909b69c3b86d482c26b3359db16e46a32e0fb30bd306a3c176b8313b9e7313dba0f37f519de6aa8b0a1921349e505f259d19475e123182416a506d7f87e7f529
+"@csstools/css-tokenizer@npm:^3.0.3, @csstools/css-tokenizer@npm:^3.0.4":
+  version: 3.0.4
+  resolution: "@csstools/css-tokenizer@npm:3.0.4"
+  checksum: 3b589f8e9942075a642213b389bab75a2d50d05d203727fcdac6827648a5572674caff07907eff3f9a2389d86a4ee47308fafe4f8588f4a77b7167c588d2559f
   languageName: node
   linkType: hard
 
-"@humanwhocodes/momoa@npm:^2.0.3":
-  version: 2.0.4
-  resolution: "@humanwhocodes/momoa@npm:2.0.4"
-  checksum: ff081fb5239eb23ae40c59bd51e8128d34b043be3b7c2adb2522cdff51b01ec3129e57d5a24a1eb3a082159d5b41fddfbaffc4cf46cae4fe11a51393f60424fd
+"@discoveryjs/json-ext@npm:0.5.7":
+  version: 0.5.7
+  resolution: "@discoveryjs/json-ext@npm:0.5.7"
+  checksum: e10f1b02b78e4812646ddf289b7d9f2cb567d336c363b266bd50cd223cf3de7c2c74018d91cd2613041568397ef3a4a2b500aba588c6e5bd78c38374ba68f38c
   languageName: node
   linkType: hard
 
-"@humanwhocodes/retry@npm:^0.3.0, @humanwhocodes/retry@npm:^0.3.1":
-  version: 0.3.1
-  resolution: "@humanwhocodes/retry@npm:0.3.1"
-  checksum: f0da1282dfb45e8120480b9e2e275e2ac9bbe1cf016d046fdad8e27cc1285c45bb9e711681237944445157b430093412b4446c1ab3fc4bb037861b5904101d3b
+"@dnd-kit/accessibility@npm:^3.1.1":
+  version: 3.1.1
+  resolution: "@dnd-kit/accessibility@npm:3.1.1"
+  dependencies:
+    tslib: ^2.0.0
+  peerDependencies:
+    react: ">=16.8.0"
+  checksum: be0bf41716dc58f9386bc36906ec1ce72b7b42b6d1d0e631d347afe9bd8714a829bd6f58a346dd089b1519e93918ae2f94497411a61a4f5e4d9247c6cfd1fef8
   languageName: node
   linkType: hard
 
-"@img/sharp-darwin-arm64@npm:0.34.1":
-  version: 0.34.1
-  resolution: "@img/sharp-darwin-arm64@npm:0.34.1"
+"@dnd-kit/core@npm:^6.1.0":
+  version: 6.3.1
+  resolution: "@dnd-kit/core@npm:6.3.1"
   dependencies:
-    "@img/sharp-libvips-darwin-arm64": 1.1.0
-  dependenciesMeta:
-    "@img/sharp-libvips-darwin-arm64":
-      optional: true
-  conditions: os=darwin & cpu=arm64
+    "@dnd-kit/accessibility": ^3.1.1
+    "@dnd-kit/utilities": ^3.2.2
+    tslib: ^2.0.0
+  peerDependencies:
+    react: ">=16.8.0"
+    react-dom: ">=16.8.0"
+  checksum: 196db95d81096d9dc248983533eab91ba83591770fa5c894b1ac776f42af0d99522b3fd5bb3923411470e4733fcfa103e6ee17adc17b9b7eb54c7fbec5ff7c52
   languageName: node
   linkType: hard
 
-"@img/sharp-darwin-x64@npm:0.34.1":
-  version: 0.34.1
-  resolution: "@img/sharp-darwin-x64@npm:0.34.1"
+"@dnd-kit/sortable@npm:^8.0.0":
+  version: 8.0.0
+  resolution: "@dnd-kit/sortable@npm:8.0.0"
   dependencies:
-    "@img/sharp-libvips-darwin-x64": 1.1.0
-  dependenciesMeta:
-    "@img/sharp-libvips-darwin-x64":
-      optional: true
-  conditions: os=darwin & cpu=x64
+    "@dnd-kit/utilities": ^3.2.2
+    tslib: ^2.0.0
+  peerDependencies:
+    "@dnd-kit/core": ^6.1.0
+    react: ">=16.8.0"
+  checksum: a6066c652b892c6a11320c7d8f5c18fdf723e721e8eea37f4ab657dee1ac5e7ca710ac32ce0712a57fe968bc07c13bcea5d5599d90dfdd95619e162befd4d2fb
   languageName: node
   linkType: hard
 
-"@img/sharp-libvips-darwin-arm64@npm:1.1.0":
-  version: 1.1.0
-  resolution: "@img/sharp-libvips-darwin-arm64@npm:1.1.0"
-  conditions: os=darwin & cpu=arm64
+"@dnd-kit/utilities@npm:^3.2.2":
+  version: 3.2.2
+  resolution: "@dnd-kit/utilities@npm:3.2.2"
+  dependencies:
+    tslib: ^2.0.0
+  peerDependencies:
+    react: ">=16.8.0"
+  checksum: 9aa90526f3e3fd567b5acc1b625a63177b9e8d00e7e50b2bd0e08fa2bf4dba7e19529777e001fdb8f89a7ce69f30b190c8364d390212634e0afdfa8c395e85a0
   languageName: node
   linkType: hard
 
-"@img/sharp-libvips-darwin-x64@npm:1.1.0":
-  version: 1.1.0
-  resolution: "@img/sharp-libvips-darwin-x64@npm:1.1.0"
-  conditions: os=darwin & cpu=x64
+"@dotenvx/dotenvx@npm:1.31.0":
+  version: 1.31.0
+  resolution: "@dotenvx/dotenvx@npm:1.31.0"
+  dependencies:
+    commander: ^11.1.0
+    dotenv: ^16.4.5
+    eciesjs: ^0.4.10
+    execa: ^5.1.1
+    fdir: ^6.2.0
+    ignore: ^5.3.0
+    object-treeify: 1.1.33
+    picomatch: ^4.0.2
+    which: ^4.0.0
+  bin:
+    dotenvx: src/cli/dotenvx.js
+    git-dotenvx: src/cli/dotenvx.js
+  checksum: 951c08c9be60aaece43b261ab6cbd1dc51ae38622d4f0911c9a22f279abff4dd3e4bd23e522cb71dbb69343121d67552d01c4f481b5def9b187c71e2166b2858
   languageName: node
   linkType: hard
 
-"@img/sharp-libvips-linux-arm64@npm:1.1.0":
-  version: 1.1.0
-  resolution: "@img/sharp-libvips-linux-arm64@npm:1.1.0"
-  conditions: os=linux & cpu=arm64 & libc=glibc
+"@ecies/ciphers@npm:^0.2.5":
+  version: 0.2.6
+  resolution: "@ecies/ciphers@npm:0.2.6"
+  peerDependencies:
+    "@noble/ciphers": ^1.0.0
+  checksum: 31cbfbaedae690e12344e49eb1b7fd0697f36cf4d03100df52b925e1f19d02a6f445834938ecdd1cd74154496a74fa9147cdda6209255512220e45eb9c693ca0
   languageName: node
   linkType: hard
 
-"@img/sharp-libvips-linux-arm@npm:1.1.0":
-  version: 1.1.0
-  resolution: "@img/sharp-libvips-linux-arm@npm:1.1.0"
-  conditions: os=linux & cpu=arm & libc=glibc
+"@emnapi/runtime@npm:^1.4.0":
+  version: 1.4.3
+  resolution: "@emnapi/runtime@npm:1.4.3"
+  dependencies:
+    tslib: ^2.4.0
+  checksum: 3b7ab72d21cb4e034f07df80165265f85f445ef3f581d1bc87b67e5239428baa00200b68a7d5e37a0425c3a78320b541b07f76c5530f6f6f95336a6294ebf30b
   languageName: node
   linkType: hard
 
-"@img/sharp-libvips-linux-ppc64@npm:1.1.0":
-  version: 1.1.0
-  resolution: "@img/sharp-libvips-linux-ppc64@npm:1.1.0"
-  conditions: os=linux & cpu=ppc64 & libc=glibc
+"@emnapi/runtime@npm:^1.7.0":
+  version: 1.10.0
+  resolution: "@emnapi/runtime@npm:1.10.0"
+  dependencies:
+    tslib: ^2.4.0
+  checksum: 953f14991d1aefb92ee6f8eb27dea725e484791a53a0cb5f47d9e0087b9a2c929ff2e92adf95af15d6ad456db6300c6b761ebf72b50a875b874a83520b3ba093
   languageName: node
   linkType: hard
 
-"@img/sharp-libvips-linux-s390x@npm:1.1.0":
-  version: 1.1.0
-  resolution: "@img/sharp-libvips-linux-s390x@npm:1.1.0"
-  conditions: os=linux & cpu=s390x & libc=glibc
+"@emotion/is-prop-valid@npm:^1.3.1":
+  version: 1.3.1
+  resolution: "@emotion/is-prop-valid@npm:1.3.1"
+  dependencies:
+    "@emotion/memoize": ^0.9.0
+  checksum: 123215540c816ff510737ec68dcc499c53ea4deb0bb6c2c27c03ed21046e2e69f6ad07a7a174d271c6cfcbcc9ea44e1763e0cf3875c92192f7689216174803cd
   languageName: node
   linkType: hard
 
-"@img/sharp-libvips-linux-x64@npm:1.1.0":
-  version: 1.1.0
-  resolution: "@img/sharp-libvips-linux-x64@npm:1.1.0"
-  conditions: os=linux & cpu=x64 & libc=glibc
+"@emotion/memoize@npm:^0.9.0":
+  version: 0.9.0
+  resolution: "@emotion/memoize@npm:0.9.0"
+  checksum: 13f474a9201c7f88b543e6ea42f55c04fb2fdc05e6c5a3108aced2f7e7aa7eda7794c56bba02985a46d8aaa914fcdde238727a98341a96e2aec750d372dadd15
   languageName: node
   linkType: hard
 
-"@img/sharp-libvips-linuxmusl-arm64@npm:1.1.0":
-  version: 1.1.0
-  resolution: "@img/sharp-libvips-linuxmusl-arm64@npm:1.1.0"
-  conditions: os=linux & cpu=arm64 & libc=musl
+"@esbuild/aix-ppc64@npm:0.27.7":
+  version: 0.27.7
+  resolution: "@esbuild/aix-ppc64@npm:0.27.7"
+  conditions: os=aix & cpu=ppc64
   languageName: node
   linkType: hard
 
-"@img/sharp-libvips-linuxmusl-x64@npm:1.1.0":
-  version: 1.1.0
-  resolution: "@img/sharp-libvips-linuxmusl-x64@npm:1.1.0"
-  conditions: os=linux & cpu=x64 & libc=musl
+"@esbuild/android-arm64@npm:0.27.7":
+  version: 0.27.7
+  resolution: "@esbuild/android-arm64@npm:0.27.7"
+  conditions: os=android & cpu=arm64
   languageName: node
   linkType: hard
 
-"@img/sharp-linux-arm64@npm:0.34.1":
-  version: 0.34.1
-  resolution: "@img/sharp-linux-arm64@npm:0.34.1"
-  dependencies:
-    "@img/sharp-libvips-linux-arm64": 1.1.0
-  dependenciesMeta:
-    "@img/sharp-libvips-linux-arm64":
-      optional: true
-  conditions: os=linux & cpu=arm64 & libc=glibc
+"@esbuild/android-arm@npm:0.27.7":
+  version: 0.27.7
+  resolution: "@esbuild/android-arm@npm:0.27.7"
+  conditions: os=android & cpu=arm
   languageName: node
   linkType: hard
 
-"@img/sharp-linux-arm@npm:0.34.1":
-  version: 0.34.1
-  resolution: "@img/sharp-linux-arm@npm:0.34.1"
-  dependencies:
-    "@img/sharp-libvips-linux-arm": 1.1.0
-  dependenciesMeta:
-    "@img/sharp-libvips-linux-arm":
-      optional: true
-  conditions: os=linux & cpu=arm & libc=glibc
+"@esbuild/android-x64@npm:0.27.7":
+  version: 0.27.7
+  resolution: "@esbuild/android-x64@npm:0.27.7"
+  conditions: os=android & cpu=x64
   languageName: node
   linkType: hard
 
-"@img/sharp-linux-s390x@npm:0.34.1":
-  version: 0.34.1
-  resolution: "@img/sharp-linux-s390x@npm:0.34.1"
-  dependencies:
-    "@img/sharp-libvips-linux-s390x": 1.1.0
-  dependenciesMeta:
-    "@img/sharp-libvips-linux-s390x":
-      optional: true
-  conditions: os=linux & cpu=s390x & libc=glibc
+"@esbuild/darwin-arm64@npm:0.27.7":
+  version: 0.27.7
+  resolution: "@esbuild/darwin-arm64@npm:0.27.7"
+  conditions: os=darwin & cpu=arm64
   languageName: node
   linkType: hard
 
-"@img/sharp-linux-x64@npm:0.34.1":
-  version: 0.34.1
-  resolution: "@img/sharp-linux-x64@npm:0.34.1"
-  dependencies:
-    "@img/sharp-libvips-linux-x64": 1.1.0
-  dependenciesMeta:
-    "@img/sharp-libvips-linux-x64":
-      optional: true
-  conditions: os=linux & cpu=x64 & libc=glibc
+"@esbuild/darwin-x64@npm:0.27.7":
+  version: 0.27.7
+  resolution: "@esbuild/darwin-x64@npm:0.27.7"
+  conditions: os=darwin & cpu=x64
   languageName: node
   linkType: hard
 
-"@img/sharp-linuxmusl-arm64@npm:0.34.1":
-  version: 0.34.1
-  resolution: "@img/sharp-linuxmusl-arm64@npm:0.34.1"
-  dependencies:
-    "@img/sharp-libvips-linuxmusl-arm64": 1.1.0
-  dependenciesMeta:
-    "@img/sharp-libvips-linuxmusl-arm64":
-      optional: true
-  conditions: os=linux & cpu=arm64 & libc=musl
+"@esbuild/freebsd-arm64@npm:0.27.7":
+  version: 0.27.7
+  resolution: "@esbuild/freebsd-arm64@npm:0.27.7"
+  conditions: os=freebsd & cpu=arm64
   languageName: node
   linkType: hard
 
-"@img/sharp-linuxmusl-x64@npm:0.34.1":
-  version: 0.34.1
-  resolution: "@img/sharp-linuxmusl-x64@npm:0.34.1"
-  dependencies:
-    "@img/sharp-libvips-linuxmusl-x64": 1.1.0
-  dependenciesMeta:
-    "@img/sharp-libvips-linuxmusl-x64":
-      optional: true
-  conditions: os=linux & cpu=x64 & libc=musl
+"@esbuild/freebsd-x64@npm:0.27.7":
+  version: 0.27.7
+  resolution: "@esbuild/freebsd-x64@npm:0.27.7"
+  conditions: os=freebsd & cpu=x64
   languageName: node
   linkType: hard
 
-"@img/sharp-wasm32@npm:0.34.1":
-  version: 0.34.1
-  resolution: "@img/sharp-wasm32@npm:0.34.1"
-  dependencies:
-    "@emnapi/runtime": ^1.4.0
-  conditions: cpu=wasm32
+"@esbuild/linux-arm64@npm:0.27.7":
+  version: 0.27.7
+  resolution: "@esbuild/linux-arm64@npm:0.27.7"
+  conditions: os=linux & cpu=arm64
   languageName: node
   linkType: hard
 
-"@img/sharp-win32-ia32@npm:0.34.1":
-  version: 0.34.1
-  resolution: "@img/sharp-win32-ia32@npm:0.34.1"
-  conditions: os=win32 & cpu=ia32
+"@esbuild/linux-arm@npm:0.27.7":
+  version: 0.27.7
+  resolution: "@esbuild/linux-arm@npm:0.27.7"
+  conditions: os=linux & cpu=arm
   languageName: node
   linkType: hard
 
-"@img/sharp-win32-x64@npm:0.34.1":
-  version: 0.34.1
-  resolution: "@img/sharp-win32-x64@npm:0.34.1"
-  conditions: os=win32 & cpu=x64
+"@esbuild/linux-ia32@npm:0.27.7":
+  version: 0.27.7
+  resolution: "@esbuild/linux-ia32@npm:0.27.7"
+  conditions: os=linux & cpu=ia32
   languageName: node
   linkType: hard
 
-"@internationalized/date@npm:^3.5.6":
-  version: 3.5.6
-  resolution: "@internationalized/date@npm:3.5.6"
-  dependencies:
-    "@swc/helpers": ^0.5.0
-  checksum: 25d3150247175892705aeaf8e1a78295717d420c37cb3065a766c4058a1aed460a69dc5362f7073425c95095c27036c7ed65f0ce5fbb32b20f917132e8dc543f
+"@esbuild/linux-loong64@npm:0.27.7":
+  version: 0.27.7
+  resolution: "@esbuild/linux-loong64@npm:0.27.7"
+  conditions: os=linux & cpu=loong64
   languageName: node
   linkType: hard
 
-"@internationalized/message@npm:^3.1.5":
-  version: 3.1.5
-  resolution: "@internationalized/message@npm:3.1.5"
-  dependencies:
-    "@swc/helpers": ^0.5.0
-    intl-messageformat: ^10.1.0
-  checksum: 81a2ef21154d0b00796fd2ecfb5365248fe50f64a7ad1616dbe4e491555e7e018557b061df145d0ab5b68cb1e757ac203d3892c42f791f169360b98d77fa5091
+"@esbuild/linux-mips64el@npm:0.27.7":
+  version: 0.27.7
+  resolution: "@esbuild/linux-mips64el@npm:0.27.7"
+  conditions: os=linux & cpu=mips64el
   languageName: node
   linkType: hard
 
-"@internationalized/number@npm:^3.5.4":
-  version: 3.5.4
-  resolution: "@internationalized/number@npm:3.5.4"
-  dependencies:
-    "@swc/helpers": ^0.5.0
-  checksum: d01a1845ad9815756ceb59eeb75792ee89105d073ce232350c0644453a3470e3ebaffc2b00ebd2dd8238957b0ae12d1551633308897fa9c332dda82f2af8c5cf
+"@esbuild/linux-ppc64@npm:0.27.7":
+  version: 0.27.7
+  resolution: "@esbuild/linux-ppc64@npm:0.27.7"
+  conditions: os=linux & cpu=ppc64
   languageName: node
   linkType: hard
 
-"@internationalized/string@npm:^3.2.4":
-  version: 3.2.4
-  resolution: "@internationalized/string@npm:3.2.4"
-  dependencies:
-    "@swc/helpers": ^0.5.0
-  checksum: 5a03ff3d7bea1eb0e7ef8f7b00d148b6b8afa90600434db61389e6a8a83e3ca89e469c730eb02ef6284e7b559ce4be8f46cb446387e137931bc47acb8cbcd841
+"@esbuild/linux-riscv64@npm:0.27.7":
+  version: 0.27.7
+  resolution: "@esbuild/linux-riscv64@npm:0.27.7"
+  conditions: os=linux & cpu=riscv64
   languageName: node
   linkType: hard
 
-"@isaacs/cliui@npm:^8.0.2":
-  version: 8.0.2
-  resolution: "@isaacs/cliui@npm:8.0.2"
-  dependencies:
-    string-width: ^5.1.2
-    string-width-cjs: "npm:string-width@^4.2.0"
-    strip-ansi: ^7.0.1
-    strip-ansi-cjs: "npm:strip-ansi@^6.0.1"
-    wrap-ansi: ^8.1.0
-    wrap-ansi-cjs: "npm:wrap-ansi@^7.0.0"
-  checksum: b1bf42535d49f11dc137f18d5e4e63a28c5569de438a221c369483731e9dac9fb797af554e8bf02b6192d1e5eba6e6402cf93900c3d0ac86391d00d04876789e
+"@esbuild/linux-s390x@npm:0.27.7":
+  version: 0.27.7
+  resolution: "@esbuild/linux-s390x@npm:0.27.7"
+  conditions: os=linux & cpu=s390x
   languageName: node
   linkType: hard
 
-"@jridgewell/gen-mapping@npm:^0.3.0, @jridgewell/gen-mapping@npm:^0.3.2":
-  version: 0.3.4
-  resolution: "@jridgewell/gen-mapping@npm:0.3.4"
-  dependencies:
-    "@jridgewell/set-array": ^1.0.1
-    "@jridgewell/sourcemap-codec": ^1.4.10
-    "@jridgewell/trace-mapping": ^0.3.9
-  checksum: dd6c48341ad01a75bd93bae17fcc888120d063bdf927d4c496b663aa68e22b9e51e898ba38abe7457b28efd3fa5cde43723dba4dc5f94281119fa709cb5046be
+"@esbuild/linux-x64@npm:0.27.7":
+  version: 0.27.7
+  resolution: "@esbuild/linux-x64@npm:0.27.7"
+  conditions: os=linux & cpu=x64
   languageName: node
   linkType: hard
 
-"@jridgewell/gen-mapping@npm:^0.3.12, @jridgewell/gen-mapping@npm:^0.3.5":
-  version: 0.3.13
-  resolution: "@jridgewell/gen-mapping@npm:0.3.13"
-  dependencies:
-    "@jridgewell/sourcemap-codec": ^1.5.0
-    "@jridgewell/trace-mapping": ^0.3.24
-  checksum: 9a7d65fb13bd9aec1fbab74cda08496839b7e2ceb31f5ab922b323e94d7c481ce0fc4fd7e12e2610915ed8af51178bdc61e168e92a8c8b8303b030b03489b13b
+"@esbuild/netbsd-arm64@npm:0.27.7":
+  version: 0.27.7
+  resolution: "@esbuild/netbsd-arm64@npm:0.27.7"
+  conditions: os=netbsd & cpu=arm64
   languageName: node
   linkType: hard
 
-"@jridgewell/remapping@npm:^2.3.5":
-  version: 2.3.5
-  resolution: "@jridgewell/remapping@npm:2.3.5"
-  dependencies:
-    "@jridgewell/gen-mapping": ^0.3.5
-    "@jridgewell/trace-mapping": ^0.3.24
-  checksum: 3de494219ffeb2c5c38711d0d7bb128097edf91893090a2dbc8ee0b55d092bb7347b1fd0f478486c5eab010e855c73927b1666f2107516d472d24a73017d1194
+"@esbuild/netbsd-x64@npm:0.27.7":
+  version: 0.27.7
+  resolution: "@esbuild/netbsd-x64@npm:0.27.7"
+  conditions: os=netbsd & cpu=x64
   languageName: node
   linkType: hard
 
-"@jridgewell/resolve-uri@npm:^3.0.3, @jridgewell/resolve-uri@npm:^3.1.0":
-  version: 3.1.2
-  resolution: "@jridgewell/resolve-uri@npm:3.1.2"
-  checksum: d502e6fb516b35032331406d4e962c21fe77cdf1cbdb49c6142bcbd9e30507094b18972778a6e27cbad756209cfe34b1a27729e6fa08a2eb92b33943f680cf1e
+"@esbuild/openbsd-arm64@npm:0.27.7":
+  version: 0.27.7
+  resolution: "@esbuild/openbsd-arm64@npm:0.27.7"
+  conditions: os=openbsd & cpu=arm64
   languageName: node
   linkType: hard
 
-"@jridgewell/set-array@npm:^1.0.1":
-  version: 1.1.2
-  resolution: "@jridgewell/set-array@npm:1.1.2"
-  checksum: bc7ab4c4c00470de4e7562ecac3c0c84f53e7ee8a711e546d67c47da7febe7c45cd67d4d84ee3c9b2c05ae8e872656cdded8a707a283d30bd54fbc65aef821ab
+"@esbuild/openbsd-x64@npm:0.27.7":
+  version: 0.27.7
+  resolution: "@esbuild/openbsd-x64@npm:0.27.7"
+  conditions: os=openbsd & cpu=x64
   languageName: node
   linkType: hard
 
-"@jridgewell/sourcemap-codec@npm:^1.4.10, @jridgewell/sourcemap-codec@npm:^1.4.14":
-  version: 1.4.15
-  resolution: "@jridgewell/sourcemap-codec@npm:1.4.15"
-  checksum: 0c6b5ae663087558039052a626d2d7ed5208da36cfd707dcc5cea4a07cfc918248403dcb5989a8f7afaf245ce0573b7cc6fd94c4a30453bd10e44d9363940ba5
+"@esbuild/openharmony-arm64@npm:0.27.7":
+  version: 0.27.7
+  resolution: "@esbuild/openharmony-arm64@npm:0.27.7"
+  conditions: os=openharmony & cpu=arm64
   languageName: node
   linkType: hard
 
-"@jridgewell/sourcemap-codec@npm:^1.5.0, @jridgewell/sourcemap-codec@npm:^1.5.5":
-  version: 1.5.5
-  resolution: "@jridgewell/sourcemap-codec@npm:1.5.5"
-  checksum: f9e538f302b63c0ebc06eecb1dd9918dd4289ed36147a0ddce35d6ea4d7ebbda243cda7b2213b6a5e1d8087a298d5cf630fb2bd39329cdecb82017023f6081a0
+"@esbuild/sunos-x64@npm:0.27.7":
+  version: 0.27.7
+  resolution: "@esbuild/sunos-x64@npm:0.27.7"
+  conditions: os=sunos & cpu=x64
   languageName: node
   linkType: hard
 
-"@jridgewell/trace-mapping@npm:0.3.9":
-  version: 0.3.9
-  resolution: "@jridgewell/trace-mapping@npm:0.3.9"
-  dependencies:
-    "@jridgewell/resolve-uri": ^3.0.3
-    "@jridgewell/sourcemap-codec": ^1.4.10
-  checksum: fa425b606d7c7ee5bfa6a31a7b050dd5814b4082f318e0e4190f991902181b4330f43f4805db1dd4f2433fd0ed9cc7a7b9c2683f1deeab1df1b0a98b1e24055b
+"@esbuild/win32-arm64@npm:0.27.7":
+  version: 0.27.7
+  resolution: "@esbuild/win32-arm64@npm:0.27.7"
+  conditions: os=win32 & cpu=arm64
   languageName: node
   linkType: hard
 
-"@jridgewell/trace-mapping@npm:^0.3.17, @jridgewell/trace-mapping@npm:^0.3.9":
-  version: 0.3.23
-  resolution: "@jridgewell/trace-mapping@npm:0.3.23"
-  dependencies:
-    "@jridgewell/resolve-uri": ^3.1.0
-    "@jridgewell/sourcemap-codec": ^1.4.14
-  checksum: 26190e09129b184a41c83ce896ce41c0636ddc1285a22627a48ec7981829346ced655d5774bdca30446250baf0e4fb519c47732760d128edda51a6222b40397a
+"@esbuild/win32-ia32@npm:0.27.7":
+  version: 0.27.7
+  resolution: "@esbuild/win32-ia32@npm:0.27.7"
+  conditions: os=win32 & cpu=ia32
   languageName: node
   linkType: hard
 
-"@jridgewell/trace-mapping@npm:^0.3.24, @jridgewell/trace-mapping@npm:^0.3.28":
-  version: 0.3.31
-  resolution: "@jridgewell/trace-mapping@npm:0.3.31"
+"@esbuild/win32-x64@npm:0.27.7":
+  version: 0.27.7
+  resolution: "@esbuild/win32-x64@npm:0.27.7"
+  conditions: os=win32 & cpu=x64
+  languageName: node
+  linkType: hard
+
+"@eslint-community/eslint-utils@npm:^4.2.0, @eslint-community/eslint-utils@npm:^4.4.0":
+  version: 4.4.0
+  resolution: "@eslint-community/eslint-utils@npm:4.4.0"
   dependencies:
-    "@jridgewell/resolve-uri": ^3.1.0
-    "@jridgewell/sourcemap-codec": ^1.4.14
-  checksum: 4b30ec8cd56c5fd9a661f088230af01e0c1a3888d11ffb6b47639700f71225be21d1f7e168048d6d4f9449207b978a235c07c8f15c07705685d16dc06280e9d9
+    eslint-visitor-keys: ^3.3.0
+  peerDependencies:
+    eslint: ^6.0.0 || ^7.0.0 || >=8.0.0
+  checksum: 7e559c4ce59cd3a06b1b5a517b593912e680a7f981ae7affab0d01d709e99cd5647019be8fafa38c350305bc32f1f7d42c7073edde2ab536c745e365f37b607e
   languageName: node
   linkType: hard
 
-"@jsdevtools/ono@npm:^7.1.3":
-  version: 7.1.3
-  resolution: "@jsdevtools/ono@npm:7.1.3"
-  checksum: a9f7e3e8e3bc315a34959934a5e2f874c423cf4eae64377d3fc9de0400ed9f36cb5fd5ebce3300d2e8f4085f557c4a8b591427a583729a87841fda46e6c216b9
+"@eslint-community/regexpp@npm:^4.10.0, @eslint-community/regexpp@npm:^4.11.0":
+  version: 4.11.1
+  resolution: "@eslint-community/regexpp@npm:4.11.1"
+  checksum: fbcc1cb65ef5ed5b92faa8dc542e035269065e7ebcc0b39c81a4fe98ad35cfff20b3c8df048641de15a7757e07d69f85e2579c1a5055f993413ba18c055654f8
   languageName: node
   linkType: hard
 
-"@juggle/resize-observer@npm:^3.3.1":
-  version: 3.4.0
-  resolution: "@juggle/resize-observer@npm:3.4.0"
-  checksum: 12930242357298c6f2ad5d4ec7cf631dfb344ca7c8c830ab7f64e6ac11eb1aae486901d8d880fd08fb1b257800c160a0da3aee1e7ed9adac0ccbb9b7c5d93347
+"@eslint/config-array@npm:^0.18.0":
+  version: 0.18.0
+  resolution: "@eslint/config-array@npm:0.18.0"
+  dependencies:
+    "@eslint/object-schema": ^2.1.4
+    debug: ^4.3.1
+    minimatch: ^3.1.2
+  checksum: 0234aeb3e6b052ad2402a647d0b4f8a6aa71524bafe1adad0b8db1dfe94d7f5f26d67c80f79bb37ac61361a1d4b14bb8fb475efe501de37263cf55eabb79868f
   languageName: node
   linkType: hard
 
-"@kapaai/react-sdk@npm:^0.9.0":
-  version: 0.9.0
-  resolution: "@kapaai/react-sdk@npm:0.9.0"
+"@eslint/core@npm:^0.7.0":
+  version: 0.7.0
+  resolution: "@eslint/core@npm:0.7.0"
+  checksum: 3cdee8bc6cbb96ac6103d3ead42e59830019435839583c9eb352b94ed558bd78e7ffad5286dc710df21ec1e7bd8f52aa6574c62457a4dd0f01f3736fa4a7d87a
+  languageName: node
+  linkType: hard
+
+"@eslint/eslintrc@npm:^3.1.0":
+  version: 3.1.0
+  resolution: "@eslint/eslintrc@npm:3.1.0"
   dependencies:
-    "@fingerprintjs/fingerprintjs-pro-react": ^2.7.0
-    "@hcaptcha/react-hcaptcha": ^1.12.0
-    "@tanstack/react-query": ^5.74.3
-    js-cookie: ^3.0.5
-    tldts: ^7.0.7
-  peerDependencies:
-    react: ">=17.0.0"
-    react-dom: ">=17.0.0"
-  checksum: d3fc9de9b2b5e176d2905ef75d012b130320be281cab236154e8faac8b5e0cc574c4b23c07da7ffd2bdccbf2ea281828ec222c2d80d6214092ec4295896f5c09
+    ajv: ^6.12.4
+    debug: ^4.3.2
+    espree: ^10.0.1
+    globals: ^14.0.0
+    ignore: ^5.2.0
+    import-fresh: ^3.2.1
+    js-yaml: ^4.1.0
+    minimatch: ^3.1.2
+    strip-json-comments: ^3.1.1
+  checksum: 5b7332ed781edcfc98caa8dedbbb843abfb9bda2e86538529c843473f580e40c69eb894410eddc6702f487e9ee8f8cfa8df83213d43a8fdb549f23ce06699167
   languageName: node
   linkType: hard
 
-"@lukeed/csprng@npm:^1.1.0":
-  version: 1.1.0
-  resolution: "@lukeed/csprng@npm:1.1.0"
-  checksum: 5d6dcf478af732972083ab2889c294b57f1028fa13c2c240d7a4aaa079c2c75df7ef0dcbdda5419147fc6704b4adf96b2de92f1a9a72ac21c6350c4014fffe6c
+"@eslint/js@npm:9.13.0":
+  version: 9.13.0
+  resolution: "@eslint/js@npm:9.13.0"
+  checksum: 672257bffe17777b8a98bd80438702904cc7a0b98b9c2e426a8a10929198b3553edf8a3fc20feed4133c02e7c8f7331a0ef1b23e5dab8e4469f7f1791beff1e0
   languageName: node
   linkType: hard
 
-"@lukeed/uuid@npm:^2.0.0":
-  version: 2.0.1
-  resolution: "@lukeed/uuid@npm:2.0.1"
+"@eslint/object-schema@npm:^2.1.4":
+  version: 2.1.4
+  resolution: "@eslint/object-schema@npm:2.1.4"
+  checksum: e9885532ea70e483fb007bf1275968b05bb15ebaa506d98560c41a41220d33d342e19023d5f2939fed6eb59676c1bda5c847c284b4b55fce521d282004da4dda
+  languageName: node
+  linkType: hard
+
+"@eslint/plugin-kit@npm:^0.2.0":
+  version: 0.2.1
+  resolution: "@eslint/plugin-kit@npm:0.2.1"
   dependencies:
-    "@lukeed/csprng": ^1.1.0
-  checksum: f9cc0385021f352f444d96dd101afd2a0efd3b2e85a61ac67deb8220409f75a6a426ed6525d297d97746f7931e3079ac6218777551a7c82686de7d292220cb1f
+    levn: ^0.4.1
+  checksum: 34b1ecb35df97b0adeb6a43366fc1b8aa1a54d23fc9753019277e80a7295724fddb547a795fd59c9eb56d690bbf0d76d7f2286cb0f5db367a86a763d5acbde5f
   languageName: node
   linkType: hard
 
-"@mdx-js/loader@npm:^3.1.0":
-  version: 3.1.0
-  resolution: "@mdx-js/loader@npm:3.1.0"
+"@fingerprintjs/fingerprintjs-pro-react@npm:^2.7.0":
+  version: 2.7.1
+  resolution: "@fingerprintjs/fingerprintjs-pro-react@npm:2.7.1"
   dependencies:
-    "@mdx-js/mdx": ^3.0.0
-    source-map: ^0.7.0
-  peerDependencies:
-    webpack: ">=5"
-  peerDependenciesMeta:
-    webpack:
-      optional: true
-  checksum: 0f301dcc1dbc0f7aa0060fdeabf9efbc6218f3660562c4c97f273fa3e74a6259d231468a38998b4739cf3ea9bc7cf9f23d5b3deda919af2ac9c10b4580bd142c
+    "@fingerprintjs/fingerprintjs-pro-spa": ^1.3.3
+    fast-deep-equal: 3.1.3
+  checksum: b815f631be86cc9ff86be4f50b365b041af23e635661c44e37953d8c4c2e3add627c4314a38bf72176ccbd8c608b417da97b7396bf58cda5973121fafcb81efc
   languageName: node
   linkType: hard
 
-"@mdx-js/mdx@npm:^3.0.0":
-  version: 3.0.1
-  resolution: "@mdx-js/mdx@npm:3.0.1"
+"@fingerprintjs/fingerprintjs-pro-spa@npm:^1.3.3":
+  version: 1.3.3
+  resolution: "@fingerprintjs/fingerprintjs-pro-spa@npm:1.3.3"
   dependencies:
-    "@types/estree": ^1.0.0
-    "@types/estree-jsx": ^1.0.0
-    "@types/hast": ^3.0.0
-    "@types/mdx": ^2.0.0
-    collapse-white-space: ^2.0.0
-    devlop: ^1.0.0
-    estree-util-build-jsx: ^3.0.0
-    estree-util-is-identifier-name: ^3.0.0
-    estree-util-to-js: ^2.0.0
-    estree-walker: ^3.0.0
-    hast-util-to-estree: ^3.0.0
-    hast-util-to-jsx-runtime: ^2.0.0
-    markdown-extensions: ^2.0.0
-    periscopic: ^3.0.0
-    remark-mdx: ^3.0.0
-    remark-parse: ^11.0.0
-    remark-rehype: ^11.0.0
-    source-map: ^0.7.0
-    unified: ^11.0.0
-    unist-util-position-from-estree: ^2.0.0
-    unist-util-stringify-position: ^4.0.0
-    unist-util-visit: ^5.0.0
-    vfile: ^6.0.0
-  checksum: 8cd7084f1242209bbeef81f69ea670ffffa0656dda2893bbd46b1b2b26078a57f9d993f8f82ad8ba16bc969189235140007185276d7673471827331521eae2e0
-  languageName: node
-  linkType: hard
-
-"@mdx-js/mdx@npm:^3.0.1, @mdx-js/mdx@npm:^3.1.0":
-  version: 3.1.0
-  resolution: "@mdx-js/mdx@npm:3.1.0"
-  dependencies:
-    "@types/estree": ^1.0.0
-    "@types/estree-jsx": ^1.0.0
-    "@types/hast": ^3.0.0
-    "@types/mdx": ^2.0.0
-    collapse-white-space: ^2.0.0
-    devlop: ^1.0.0
-    estree-util-is-identifier-name: ^3.0.0
-    estree-util-scope: ^1.0.0
-    estree-walker: ^3.0.0
-    hast-util-to-jsx-runtime: ^2.0.0
-    markdown-extensions: ^2.0.0
-    recma-build-jsx: ^1.0.0
-    recma-jsx: ^1.0.0
-    recma-stringify: ^1.0.0
-    rehype-recma: ^1.0.0
-    remark-mdx: ^3.0.0
-    remark-parse: ^11.0.0
-    remark-rehype: ^11.0.0
-    source-map: ^0.7.0
-    unified: ^11.0.0
-    unist-util-position-from-estree: ^2.0.0
-    unist-util-stringify-position: ^4.0.0
-    unist-util-visit: ^5.0.0
-    vfile: ^6.0.0
-  checksum: e586ab772dcfee2bab334d5aac54c711e6d6d550085271c38a49c629b3e3954b5f41f488060761284a5e00649d0638d6aba6c0a7c66f91db80dee0ccc304ab32
+    "@fingerprintjs/fingerprintjs-pro": ^3.12.0
+    tslib: ^2.7.0
+  checksum: 1049753761ed0fe25085b874529d9dfa377326fb82aa6e1c09cdfacd2d059b5d8b5f5e27d1c56ed3b08ea39ce36de5746e793d3294eba124d8f91af7ca394b76
   languageName: node
   linkType: hard
 
-"@mdx-js/mdx@npm:^3.1.1":
-  version: 3.1.1
-  resolution: "@mdx-js/mdx@npm:3.1.1"
-  dependencies:
-    "@types/estree": ^1.0.0
-    "@types/estree-jsx": ^1.0.0
-    "@types/hast": ^3.0.0
-    "@types/mdx": ^2.0.0
-    acorn: ^8.0.0
-    collapse-white-space: ^2.0.0
-    devlop: ^1.0.0
-    estree-util-is-identifier-name: ^3.0.0
-    estree-util-scope: ^1.0.0
-    estree-walker: ^3.0.0
-    hast-util-to-jsx-runtime: ^2.0.0
-    markdown-extensions: ^2.0.0
-    recma-build-jsx: ^1.0.0
-    recma-jsx: ^1.0.0
-    recma-stringify: ^1.0.0
-    rehype-recma: ^1.0.0
-    remark-mdx: ^3.0.0
-    remark-parse: ^11.0.0
-    remark-rehype: ^11.0.0
-    source-map: ^0.7.0
-    unified: ^11.0.0
-    unist-util-position-from-estree: ^2.0.0
-    unist-util-stringify-position: ^4.0.0
-    unist-util-visit: ^5.0.0
-    vfile: ^6.0.0
-  checksum: 371ed95e2bee7731f30a7ce57db66383a0b7470e66c38139427174cb456d6a40bf7d259f3652716370c1de64acfba50a1ba27eb8c556e7a431dc7940b04cb1a1
+"@fingerprintjs/fingerprintjs-pro@npm:^3.12.0":
+  version: 3.12.3
+  resolution: "@fingerprintjs/fingerprintjs-pro@npm:3.12.3"
+  checksum: 660790bbf6cecfdf00f00b93cab60385d6bc959f46c3d31933dc92585afd16e3c48e8300e8df925ba774ffa66b6e1fb7d909fea2c44fd1608c62aefed4791871
   languageName: node
   linkType: hard
 
-"@mdx-js/react@npm:^3.0.1":
-  version: 3.0.1
-  resolution: "@mdx-js/react@npm:3.0.1"
+"@floating-ui/core@npm:^1.0.0":
+  version: 1.6.0
+  resolution: "@floating-ui/core@npm:1.6.0"
   dependencies:
-    "@types/mdx": ^2.0.0
-  peerDependencies:
-    "@types/react": ">=16"
-    react: ">=16"
-  checksum: d210d926ef488d39ad65f04d821936b668eadcdde3b6421e94ec4200ca7ad17f17d24c5cbc543882586af9f08b10e2eea715c728ce6277487945e05c5199f532
+    "@floating-ui/utils": ^0.2.1
+  checksum: 667a68036f7dd5ed19442c7792a6002ca02d1799221c4396691bbe0b6008b48f6ccad581225e81fa266bb91232f6c66838a5f825f554217e1ec886178b93381b
   languageName: node
   linkType: hard
 
-"@mdx-js/react@npm:^3.1.0":
-  version: 3.1.0
-  resolution: "@mdx-js/react@npm:3.1.0"
+"@floating-ui/dom@npm:^1.6.1":
+  version: 1.6.3
+  resolution: "@floating-ui/dom@npm:1.6.3"
   dependencies:
-    "@types/mdx": ^2.0.0
-  peerDependencies:
-    "@types/react": ">=16"
-    react: ">=16"
-  checksum: 381ed1211ba2b8491bf0ad9ef0d8d1badcdd114e1931d55d44019d4b827cc2752586708f9c7d2f9c3244150ed81f1f671a6ca95fae0edd5797fb47a22e06ceca
+    "@floating-ui/core": ^1.0.0
+    "@floating-ui/utils": ^0.2.0
+  checksum: d6cac10877918ce5a8d1a24b21738d2eb130a0191043d7c0dd43bccac507844d3b4dc5d4107d3891d82f6007945ca8fb4207a1252506e91c37e211f0f73cf77e
   languageName: node
   linkType: hard
 
-"@mdx-js/react@npm:^3.1.1":
-  version: 3.1.1
-  resolution: "@mdx-js/react@npm:3.1.1"
+"@floating-ui/react-dom@npm:^2.0.0":
+  version: 2.0.8
+  resolution: "@floating-ui/react-dom@npm:2.0.8"
   dependencies:
-    "@types/mdx": ^2.0.0
+    "@floating-ui/dom": ^1.6.1
   peerDependencies:
-    "@types/react": ">=16"
-    react: ">=16"
-  checksum: 34ca98bc2a0f969894ea144dc5c8a5294690505458cd24965cd9be854d779c193ad9192bf9143c4c18438fafd1902e100d99067e045c69319288562d497558c6
+    react: ">=16.8.0"
+    react-dom: ">=16.8.0"
+  checksum: 4d87451e2dcc54b4753a0d81181036e47821cfd0d4c23f7e9c31590c7c91fb15fb0a5a458969a5ddabd61601eca5875ebd4e40bff37cee31f373b8f1ccc64518
   languageName: node
   linkType: hard
 
-"@medusajs/icons@npm:2.15.1":
-  version: 2.15.1
-  resolution: "@medusajs/icons@npm:2.15.1"
-  peerDependencies:
-    react: ^19.2.5
-  checksum: 8d4668cdff95a24dcd67ccd08d4f379eb1dd7b05dbb8b5c6a969af4124cdff2236d57878610f5b4649124049229f3175d82678efb6502c9d418bc74ce0e1caeb
+"@floating-ui/utils@npm:^0.2.0, @floating-ui/utils@npm:^0.2.1":
+  version: 0.2.1
+  resolution: "@floating-ui/utils@npm:0.2.1"
+  checksum: ee77756712cf5b000c6bacf11992ffb364f3ea2d0d51cc45197a7e646a17aeb86ea4b192c0b42f3fbb29487aee918a565e84f710b8c3645827767f406a6b4cc9
   languageName: node
   linkType: hard
 
-"@medusajs/ui-preset@npm:2.15.1":
-  version: 2.15.1
-  resolution: "@medusajs/ui-preset@npm:2.15.1"
+"@formatjs/ecma402-abstract@npm:1.18.2":
+  version: 1.18.2
+  resolution: "@formatjs/ecma402-abstract@npm:1.18.2"
   dependencies:
-    "@tailwindcss/forms": ^0.5.3
-    tailwindcss-animate: ^1.0.6
-  peerDependencies:
-    tailwindcss: ^3.4.3
-  checksum: 5e3ca365b7c84c141e49f702e631e0fd196935d3d0cf066740629639125b91c2fc566099f8fc73418fbf9b80ed897fd62ee806ea5e2054b4aeab3e3588d2751d
+    "@formatjs/intl-localematcher": 0.5.4
+    tslib: ^2.4.0
+  checksum: 87afb37dd937555e712ca85d5142a9083d617c491d1dddf8d660fdfb6186272d2bc75b78809b076388d26f016200c8bddbce73281fd707eb899da2bf3bc9b7ca
   languageName: node
   linkType: hard
 
-"@medusajs/ui@npm:4.1.11":
-  version: 4.1.11
-  resolution: "@medusajs/ui@npm:4.1.11"
+"@formatjs/fast-memoize@npm:2.2.0":
+  version: 2.2.0
+  resolution: "@formatjs/fast-memoize@npm:2.2.0"
   dependencies:
-    "@dnd-kit/core": ^6.1.0
-    "@dnd-kit/sortable": ^8.0.0
-    "@dnd-kit/utilities": ^3.2.2
-    "@medusajs/icons": 2.15.1
-    "@radix-ui/react-dialog": 1.1.4
-    "@radix-ui/react-dismissable-layer": 1.1.4
-    "@tanstack/react-table": 8.20.5
-    clsx: ^1.2.1
-    copy-to-clipboard: ^3.3.3
-    cva: 1.0.0-beta.1
-    lodash.isequal: ^4.5.0
-    prism-react-renderer: ^2.0.6
-    prismjs: ^1.30.0
-    radix-ui: 1.1.2
-    react-aria: ^3.33.1
-    react-currency-input-field: ^3.6.11
-    react-stately: ^3.31.1
-    sonner: ^1.5.0
-    tailwind-merge: ^2.2.1
-  peerDependencies:
-    react: ^18.3.1
-    react-dom: ^18.3.1
-  checksum: 5a751dd0216ec7772956f89e463a71c9c212c77df1c75726c11db395d53fd04f65206a4b9644397779d0eb0b58d34be55939fd5c5e8a1dbee9ebe493d275fd32
+    tslib: ^2.4.0
+  checksum: ae88c5a93b96235aba4bd9b947d0310d2ec013687a99133413361b24122b5cdea8c9bf2e04a4a2a8b61f1f4ee5419ef6416ca4796554226b5050e05a9ce6ef49
   languageName: node
   linkType: hard
 
-"@mixmark-io/domino@npm:^2.2.0":
-  version: 2.2.0
-  resolution: "@mixmark-io/domino@npm:2.2.0"
-  checksum: aa468a15f9217d425220fe6a4b3f9416cbe8e566ee14efc191c6d5cc04fe39338b16a90bbac190f28d44e69465db5f2cf95f479c621ce38060ca6b2a3d346e9d
+"@formatjs/icu-messageformat-parser@npm:2.7.6":
+  version: 2.7.6
+  resolution: "@formatjs/icu-messageformat-parser@npm:2.7.6"
+  dependencies:
+    "@formatjs/ecma402-abstract": 1.18.2
+    "@formatjs/icu-skeleton-parser": 1.8.0
+    tslib: ^2.4.0
+  checksum: 9fc72c2075333a969601e2be4260638940b1abefd1a5fc15b93b0b10d2319c9df5778aa51fc2a173ce66ca5e8a47b4b64caca85a32d0eb6095e16e8d65cb4b00
   languageName: node
   linkType: hard
 
-"@next/bundle-analyzer@npm:15.3.9":
-  version: 15.3.9
-  resolution: "@next/bundle-analyzer@npm:15.3.9"
+"@formatjs/icu-skeleton-parser@npm:1.8.0":
+  version: 1.8.0
+  resolution: "@formatjs/icu-skeleton-parser@npm:1.8.0"
   dependencies:
-    webpack-bundle-analyzer: 4.10.1
-  checksum: 4717abea978b9e0c32f10dc7a806d77606655b8a2b729f76b7545a3db80e06c563812f64b09902868c7261408e1f0a668167c2c36e109c1c7fb41a8cc2024e55
+    "@formatjs/ecma402-abstract": 1.18.2
+    tslib: ^2.4.0
+  checksum: 10956732d70cc67049d216410b5dc3ef048935d1ea2ae76f5755bb9d0243af37ddeabd5d140ddbf5f6c7047068c3d02a05f93c68a89cedfaf7488d5062885ea4
   languageName: node
   linkType: hard
 
-"@next/env@npm:15.3.9":
-  version: 15.3.9
-  resolution: "@next/env@npm:15.3.9"
-  checksum: 8ae01f6b8b7bb9210ddac461eb6d59a41a048deaabed1a5e45850b7d0506e751e5d3d15c113a73963e134b846b4002c98562d119d0793fd162129f003f448d5f
+"@formatjs/intl-localematcher@npm:0.5.4":
+  version: 0.5.4
+  resolution: "@formatjs/intl-localematcher@npm:0.5.4"
+  dependencies:
+    tslib: ^2.4.0
+  checksum: c9ff5d34ca8b6fe59f8f303a3cc31a92d343e095a6987e273e5cc23f0fe99feb557a392a05da95931c7d24106acb6988e588d00ddd05b0934005aafd7fdbafe6
   languageName: node
   linkType: hard
 
-"@next/eslint-plugin-next@npm:15.3.6":
-  version: 15.3.6
-  resolution: "@next/eslint-plugin-next@npm:15.3.6"
-  dependencies:
-    fast-glob: 3.3.1
-  checksum: 05fb82e25e46f8bf713e0db3c94846b32512cbe19050d8141ba7d74ecb036e34afd732955e3978cdb98b799cc88d186628fe720bdb4996b881be702c0b327168
+"@hcaptcha/loader@npm:^2.0.0":
+  version: 2.0.0
+  resolution: "@hcaptcha/loader@npm:2.0.0"
+  checksum: c69c8e62ccf41cc5cce8f25721b9bd8284e201da608022476dc6d69afbd70512a6f272dd2bfe558c4b5fdbc0ee20fb5f062033c4d556e6d523ecb2448203298f
   languageName: node
   linkType: hard
 
-"@next/mdx@npm:15.3.9":
-  version: 15.3.9
-  resolution: "@next/mdx@npm:15.3.9"
+"@hcaptcha/react-hcaptcha@npm:^1.12.0":
+  version: 1.12.0
+  resolution: "@hcaptcha/react-hcaptcha@npm:1.12.0"
   dependencies:
-    source-map: ^0.7.0
+    "@babel/runtime": ^7.17.9
+    "@hcaptcha/loader": ^2.0.0
   peerDependencies:
-    "@mdx-js/loader": ">=0.15.0"
-    "@mdx-js/react": ">=0.15.0"
-  peerDependenciesMeta:
-    "@mdx-js/loader":
-      optional: true
-    "@mdx-js/react":
-      optional: true
-  checksum: 2bd3ad465d2f12ac77c5e017f9ea359532b319ac6635539fe3a2be266b87c3150a4641ece72813c9ff3b0ab8712c817920bd18706e5ea6449b6c3cec4a43ac88
+    react: ">= 16.3.0"
+    react-dom: ">= 16.3.0"
+  checksum: 58fddf7cbbeb1c9d784a90a4ee76604efd8d0c968d1d256f72d112d95c8d68bbb1255dd4184148e7e43e38491c5614b3747f4d17393a17d320e28935da47f8e8
   languageName: node
   linkType: hard
 
-"@next/swc-darwin-arm64@npm:15.3.5":
-  version: 15.3.5
-  resolution: "@next/swc-darwin-arm64@npm:15.3.5"
-  conditions: os=darwin & cpu=arm64
+"@humanfs/core@npm:^0.19.0":
+  version: 0.19.0
+  resolution: "@humanfs/core@npm:0.19.0"
+  checksum: f87952d5caba6ae427a620eff783c5d0b6cef0cfc256dec359cdaa636c5f161edb8d8dad576742b3de7f0b2f222b34aad6870248e4b7d2177f013426cbcda232
   languageName: node
   linkType: hard
 
-"@next/swc-darwin-x64@npm:15.3.5":
-  version: 15.3.5
-  resolution: "@next/swc-darwin-x64@npm:15.3.5"
-  conditions: os=darwin & cpu=x64
-  languageName: node
+"@humanfs/node@npm:^0.16.5":
+  version: 0.16.5
+  resolution: "@humanfs/node@npm:0.16.5"
+  dependencies:
+    "@humanfs/core": ^0.19.0
+    "@humanwhocodes/retry": ^0.3.0
+  checksum: 41c365ab09e7c9eaeed373d09243195aef616d6745608a36fc3e44506148c28843872f85e69e2bf5f1e992e194286155a1c1cecfcece6a2f43875e37cd243935
+  languageName: node
   linkType: hard
 
-"@next/swc-linux-arm64-gnu@npm:15.3.5":
-  version: 15.3.5
-  resolution: "@next/swc-linux-arm64-gnu@npm:15.3.5"
-  conditions: os=linux & cpu=arm64 & libc=glibc
+"@humanwhocodes/module-importer@npm:^1.0.1":
+  version: 1.0.1
+  resolution: "@humanwhocodes/module-importer@npm:1.0.1"
+  checksum: 909b69c3b86d482c26b3359db16e46a32e0fb30bd306a3c176b8313b9e7313dba0f37f519de6aa8b0a1921349e505f259d19475e123182416a506d7f87e7f529
   languageName: node
   linkType: hard
 
-"@next/swc-linux-arm64-musl@npm:15.3.5":
-  version: 15.3.5
-  resolution: "@next/swc-linux-arm64-musl@npm:15.3.5"
-  conditions: os=linux & cpu=arm64 & libc=musl
+"@humanwhocodes/momoa@npm:^2.0.3":
+  version: 2.0.4
+  resolution: "@humanwhocodes/momoa@npm:2.0.4"
+  checksum: ff081fb5239eb23ae40c59bd51e8128d34b043be3b7c2adb2522cdff51b01ec3129e57d5a24a1eb3a082159d5b41fddfbaffc4cf46cae4fe11a51393f60424fd
   languageName: node
   linkType: hard
 
-"@next/swc-linux-x64-gnu@npm:15.3.5":
-  version: 15.3.5
-  resolution: "@next/swc-linux-x64-gnu@npm:15.3.5"
-  conditions: os=linux & cpu=x64 & libc=glibc
+"@humanwhocodes/retry@npm:^0.3.0, @humanwhocodes/retry@npm:^0.3.1":
+  version: 0.3.1
+  resolution: "@humanwhocodes/retry@npm:0.3.1"
+  checksum: f0da1282dfb45e8120480b9e2e275e2ac9bbe1cf016d046fdad8e27cc1285c45bb9e711681237944445157b430093412b4446c1ab3fc4bb037861b5904101d3b
   languageName: node
   linkType: hard
 
-"@next/swc-linux-x64-musl@npm:15.3.5":
-  version: 15.3.5
-  resolution: "@next/swc-linux-x64-musl@npm:15.3.5"
-  conditions: os=linux & cpu=x64 & libc=musl
+"@img/colour@npm:^1.0.0":
+  version: 1.1.0
+  resolution: "@img/colour@npm:1.1.0"
+  checksum: 2ebea2c0bbaee73b99badcefa04e1e71d83f36e5369337d3121dca841f4569533c4e2faddda6d62dd247f0d5cca143711f9446c59bcce81e427ba433a7a94a17
   languageName: node
   linkType: hard
 
-"@next/swc-win32-arm64-msvc@npm:15.3.5":
-  version: 15.3.5
-  resolution: "@next/swc-win32-arm64-msvc@npm:15.3.5"
-  conditions: os=win32 & cpu=arm64
+"@img/sharp-darwin-arm64@npm:0.34.1":
+  version: 0.34.1
+  resolution: "@img/sharp-darwin-arm64@npm:0.34.1"
+  dependencies:
+    "@img/sharp-libvips-darwin-arm64": 1.1.0
+  dependenciesMeta:
+    "@img/sharp-libvips-darwin-arm64":
+      optional: true
+  conditions: os=darwin & cpu=arm64
   languageName: node
   linkType: hard
 
-"@next/swc-win32-x64-msvc@npm:15.3.5":
-  version: 15.3.5
-  resolution: "@next/swc-win32-x64-msvc@npm:15.3.5"
-  conditions: os=win32 & cpu=x64
+"@img/sharp-darwin-arm64@npm:0.34.5":
+  version: 0.34.5
+  resolution: "@img/sharp-darwin-arm64@npm:0.34.5"
+  dependencies:
+    "@img/sharp-libvips-darwin-arm64": 1.2.4
+  dependenciesMeta:
+    "@img/sharp-libvips-darwin-arm64":
+      optional: true
+  conditions: os=darwin & cpu=arm64
   languageName: node
   linkType: hard
 
-"@next/third-parties@npm:15.3.9":
-  version: 15.3.9
-  resolution: "@next/third-parties@npm:15.3.9"
+"@img/sharp-darwin-x64@npm:0.34.1":
+  version: 0.34.1
+  resolution: "@img/sharp-darwin-x64@npm:0.34.1"
   dependencies:
-    third-party-capital: 1.0.20
-  peerDependencies:
-    next: ^13.0.0 || ^14.0.0 || ^15.0.0
-    react: ^18.2.0 || 19.0.0-rc-de68d2f4-20241204 || ^19.0.0
-  checksum: 493c07567626d163d27bfb1e576b1b61178d985e04d4015b26e0db0d32101e80cc1efcdbe34acfbadb74ab6b86494a3632ed276f3483d0c242ae72a9165eab7d
+    "@img/sharp-libvips-darwin-x64": 1.1.0
+  dependenciesMeta:
+    "@img/sharp-libvips-darwin-x64":
+      optional: true
+  conditions: os=darwin & cpu=x64
   languageName: node
   linkType: hard
 
-"@nicolo-ribaudo/eslint-scope-5-internals@npm:5.1.1-v1":
-  version: 5.1.1-v1
-  resolution: "@nicolo-ribaudo/eslint-scope-5-internals@npm:5.1.1-v1"
+"@img/sharp-darwin-x64@npm:0.34.5":
+  version: 0.34.5
+  resolution: "@img/sharp-darwin-x64@npm:0.34.5"
   dependencies:
-    eslint-scope: 5.1.1
-  checksum: 75dda3e623b8ad7369ca22552d6beee337a814b2d0e8a32d23edd13fcb65c8082b32c5d86e436f3860dd7ade30d91d5db55d4ef9a08fb5a976c718ecc0d88a74
+    "@img/sharp-libvips-darwin-x64": 1.2.4
+  dependenciesMeta:
+    "@img/sharp-libvips-darwin-x64":
+      optional: true
+  conditions: os=darwin & cpu=x64
   languageName: node
   linkType: hard
 
-"@nodelib/fs.scandir@npm:2.1.5":
-  version: 2.1.5
-  resolution: "@nodelib/fs.scandir@npm:2.1.5"
-  dependencies:
-    "@nodelib/fs.stat": 2.0.5
-    run-parallel: ^1.1.9
-  checksum: 732c3b6d1b1e967440e65f284bd06e5821fedf10a1bea9ed2bb75956ea1f30e08c44d3def9d6a230666574edbaf136f8cfd319c14fd1f87c66e6a44449afb2eb
+"@img/sharp-libvips-darwin-arm64@npm:1.1.0":
+  version: 1.1.0
+  resolution: "@img/sharp-libvips-darwin-arm64@npm:1.1.0"
+  conditions: os=darwin & cpu=arm64
   languageName: node
   linkType: hard
 
-"@nodelib/fs.stat@npm:2.0.5, @nodelib/fs.stat@npm:^2.0.2":
-  version: 2.0.5
-  resolution: "@nodelib/fs.stat@npm:2.0.5"
-  checksum: 88dafe5e3e29a388b07264680dc996c17f4bda48d163a9d4f5c1112979f0ce8ec72aa7116122c350b4e7976bc5566dc3ddb579be1ceaacc727872eb4ed93926d
+"@img/sharp-libvips-darwin-arm64@npm:1.2.4":
+  version: 1.2.4
+  resolution: "@img/sharp-libvips-darwin-arm64@npm:1.2.4"
+  conditions: os=darwin & cpu=arm64
   languageName: node
   linkType: hard
 
-"@nodelib/fs.walk@npm:^1.2.3":
-  version: 1.2.8
-  resolution: "@nodelib/fs.walk@npm:1.2.8"
-  dependencies:
-    "@nodelib/fs.scandir": 2.1.5
-    fastq: ^1.6.0
-  checksum: db9de047c3bb9b51f9335a7bb46f4fcfb6829fb628318c12115fbaf7d369bfce71c15b103d1fc3b464812d936220ee9bc1c8f762d032c9f6be9acc99249095b1
+"@img/sharp-libvips-darwin-x64@npm:1.1.0":
+  version: 1.1.0
+  resolution: "@img/sharp-libvips-darwin-x64@npm:1.1.0"
+  conditions: os=darwin & cpu=x64
   languageName: node
   linkType: hard
 
-"@npmcli/agent@npm:^2.0.0":
-  version: 2.2.1
-  resolution: "@npmcli/agent@npm:2.2.1"
-  dependencies:
-    agent-base: ^7.1.0
-    http-proxy-agent: ^7.0.0
-    https-proxy-agent: ^7.0.1
-    lru-cache: ^10.0.1
-    socks-proxy-agent: ^8.0.1
-  checksum: 38ee5cbe8f3cde13be916e717bfc54fd1a7605c07af056369ff894e244c221e0b56b08ca5213457477f9bc15bca9e729d51a4788829b5c3cf296b3c996147f76
+"@img/sharp-libvips-darwin-x64@npm:1.2.4":
+  version: 1.2.4
+  resolution: "@img/sharp-libvips-darwin-x64@npm:1.2.4"
+  conditions: os=darwin & cpu=x64
   languageName: node
   linkType: hard
 
-"@npmcli/fs@npm:^3.1.0":
-  version: 3.1.0
-  resolution: "@npmcli/fs@npm:3.1.0"
-  dependencies:
-    semver: ^7.3.5
-  checksum: 162b4a0b8705cd6f5c2470b851d1dc6cd228c86d2170e1769d738c1fbb69a87160901411c3c035331e9e99db72f1f1099a8b734bf1637cc32b9a5be1660e4e1e
+"@img/sharp-libvips-linux-arm64@npm:1.1.0":
+  version: 1.1.0
+  resolution: "@img/sharp-libvips-linux-arm64@npm:1.1.0"
+  conditions: os=linux & cpu=arm64 & libc=glibc
   languageName: node
   linkType: hard
 
-"@pkgjs/parseargs@npm:^0.11.0":
-  version: 0.11.0
-  resolution: "@pkgjs/parseargs@npm:0.11.0"
-  checksum: 5bd7576bb1b38a47a7fc7b51ac9f38748e772beebc56200450c4a817d712232b8f1d3ef70532c80840243c657d491cf6a6be1e3a214cff907645819fdc34aadd
+"@img/sharp-libvips-linux-arm64@npm:1.2.4":
+  version: 1.2.4
+  resolution: "@img/sharp-libvips-linux-arm64@npm:1.2.4"
+  conditions: os=linux & cpu=arm64 & libc=glibc
   languageName: node
   linkType: hard
 
-"@pkgr/core@npm:^0.1.0":
-  version: 0.1.1
-  resolution: "@pkgr/core@npm:0.1.1"
-  checksum: 3f7536bc7f57320ab2cf96f8973664bef624710c403357429fbf680a5c3b4843c1dbd389bb43daa6b1f6f1f007bb082f5abcb76bb2b5dc9f421647743b71d3d8
+"@img/sharp-libvips-linux-arm@npm:1.1.0":
+  version: 1.1.0
+  resolution: "@img/sharp-libvips-linux-arm@npm:1.1.0"
+  conditions: os=linux & cpu=arm & libc=glibc
   languageName: node
   linkType: hard
 
-"@polka/url@npm:^1.0.0-next.24":
-  version: 1.0.0-next.24
-  resolution: "@polka/url@npm:1.0.0-next.24"
-  checksum: 97d98fa911857158514457bedad8c36084c1f608302458f580ab300a25c3abf456d1d54fcf2ea7927464bee0858baf5e8e5b374b95c3375b9eb3784d81411ebd
+"@img/sharp-libvips-linux-arm@npm:1.2.4":
+  version: 1.2.4
+  resolution: "@img/sharp-libvips-linux-arm@npm:1.2.4"
+  conditions: os=linux & cpu=arm & libc=glibc
   languageName: node
   linkType: hard
 
-"@posthog/core@npm:1.25.0":
-  version: 1.25.0
-  resolution: "@posthog/core@npm:1.25.0"
-  checksum: 6b94306fa07f54d60584218cf0a0ea3cb5cc288aff52e603016686801eec1288129e1d115e1d77b17d345835a4b3b7272e547b7604a44fd281f911479c633b72
+"@img/sharp-libvips-linux-ppc64@npm:1.1.0":
+  version: 1.1.0
+  resolution: "@img/sharp-libvips-linux-ppc64@npm:1.1.0"
+  conditions: os=linux & cpu=ppc64 & libc=glibc
   languageName: node
   linkType: hard
 
-"@posthog/core@npm:1.6.0":
-  version: 1.6.0
-  resolution: "@posthog/core@npm:1.6.0"
-  dependencies:
-    cross-spawn: ^7.0.6
-  checksum: 28aa907bb21b18587bc5f47c44349ebc834b37d9a4cedb1a18d7b673d4d7cdad2120dda80deceaee707b2f52333e9a08a8e591e1fc4066521ce05e820b76309f
+"@img/sharp-libvips-linux-ppc64@npm:1.2.4":
+  version: 1.2.4
+  resolution: "@img/sharp-libvips-linux-ppc64@npm:1.2.4"
+  conditions: os=linux & cpu=ppc64 & libc=glibc
   languageName: node
   linkType: hard
 
-"@radix-ui/number@npm:1.1.0":
+"@img/sharp-libvips-linux-riscv64@npm:1.2.4":
+  version: 1.2.4
+  resolution: "@img/sharp-libvips-linux-riscv64@npm:1.2.4"
+  conditions: os=linux & cpu=riscv64 & libc=glibc
+  languageName: node
+  linkType: hard
+
+"@img/sharp-libvips-linux-s390x@npm:1.1.0":
   version: 1.1.0
-  resolution: "@radix-ui/number@npm:1.1.0"
-  checksum: a48e34d5ff1484de1b7cf5d7317fefc831d49e96a2229f300fd37b657bd8cfb59c922830c00ec02838ab21de3b299a523474592e4f30882153412ed47edce6a4
+  resolution: "@img/sharp-libvips-linux-s390x@npm:1.1.0"
+  conditions: os=linux & cpu=s390x & libc=glibc
   languageName: node
   linkType: hard
 
-"@radix-ui/primitive@npm:1.1.1":
-  version: 1.1.1
-  resolution: "@radix-ui/primitive@npm:1.1.1"
-  checksum: 6457bd8d1aa4ecb948e5d2a2484fc570698b2ab472db6d915a8f1eec04823f80423efa60b5ba840f0693bec2ca380333cc5f3b52586b40f407d9f572f9261f8d
+"@img/sharp-libvips-linux-s390x@npm:1.2.4":
+  version: 1.2.4
+  resolution: "@img/sharp-libvips-linux-s390x@npm:1.2.4"
+  conditions: os=linux & cpu=s390x & libc=glibc
   languageName: node
   linkType: hard
 
-"@radix-ui/react-accessible-icon@npm:1.1.1":
-  version: 1.1.1
-  resolution: "@radix-ui/react-accessible-icon@npm:1.1.1"
-  dependencies:
-    "@radix-ui/react-visually-hidden": 1.1.1
-  peerDependencies:
-    "@types/react": "*"
-    "@types/react-dom": "*"
-    react: ^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc
-    react-dom: ^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc
-  peerDependenciesMeta:
-    "@types/react":
-      optional: true
-    "@types/react-dom":
-      optional: true
-  checksum: f5d75ec8d76c39a387736f045f7fb279399fc0322fd09843fcaa76d6e5fae5d38b2b2c2ee159fa05f7b67de32ad5953fc7b9d2d6e35255ba7eb45e4096e36b8e
+"@img/sharp-libvips-linux-x64@npm:1.1.0":
+  version: 1.1.0
+  resolution: "@img/sharp-libvips-linux-x64@npm:1.1.0"
+  conditions: os=linux & cpu=x64 & libc=glibc
   languageName: node
   linkType: hard
 
-"@radix-ui/react-accordion@npm:1.2.2":
-  version: 1.2.2
-  resolution: "@radix-ui/react-accordion@npm:1.2.2"
-  dependencies:
-    "@radix-ui/primitive": 1.1.1
-    "@radix-ui/react-collapsible": 1.1.2
-    "@radix-ui/react-collection": 1.1.1
-    "@radix-ui/react-compose-refs": 1.1.1
-    "@radix-ui/react-context": 1.1.1
-    "@radix-ui/react-direction": 1.1.0
-    "@radix-ui/react-id": 1.1.0
-    "@radix-ui/react-primitive": 2.0.1
-    "@radix-ui/react-use-controllable-state": 1.1.0
-  peerDependencies:
-    "@types/react": "*"
-    "@types/react-dom": "*"
-    react: ^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc
-    react-dom: ^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc
-  peerDependenciesMeta:
-    "@types/react":
-      optional: true
-    "@types/react-dom":
-      optional: true
-  checksum: 2279c24de3296714ad14e0b83e7ea55f1b0d1585650b48ddb9295a44e6f0ab4e860526e9263c8f18cbdfa702648644d1bfa50f18c22e6f9de303b4b19ebef63a
+"@img/sharp-libvips-linux-x64@npm:1.2.4":
+  version: 1.2.4
+  resolution: "@img/sharp-libvips-linux-x64@npm:1.2.4"
+  conditions: os=linux & cpu=x64 & libc=glibc
   languageName: node
   linkType: hard
 
-"@radix-ui/react-alert-dialog@npm:1.1.5":
-  version: 1.1.5
-  resolution: "@radix-ui/react-alert-dialog@npm:1.1.5"
-  dependencies:
-    "@radix-ui/primitive": 1.1.1
-    "@radix-ui/react-compose-refs": 1.1.1
-    "@radix-ui/react-context": 1.1.1
-    "@radix-ui/react-dialog": 1.1.5
-    "@radix-ui/react-primitive": 2.0.1
-    "@radix-ui/react-slot": 1.1.1
-  peerDependencies:
-    "@types/react": "*"
-    "@types/react-dom": "*"
-    react: ^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc
-    react-dom: ^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc
-  peerDependenciesMeta:
-    "@types/react":
-      optional: true
-    "@types/react-dom":
-      optional: true
-  checksum: 5af5d2aad24bce15119e9485e02d7dd735ff78e43a979c1242f17160de8483cb429539dbc24b5a55bad42fd0b88b112e613915cb0622271c4a905c462b45ba60
+"@img/sharp-libvips-linuxmusl-arm64@npm:1.1.0":
+  version: 1.1.0
+  resolution: "@img/sharp-libvips-linuxmusl-arm64@npm:1.1.0"
+  conditions: os=linux & cpu=arm64 & libc=musl
   languageName: node
   linkType: hard
 
-"@radix-ui/react-arrow@npm:1.1.1":
-  version: 1.1.1
-  resolution: "@radix-ui/react-arrow@npm:1.1.1"
+"@img/sharp-libvips-linuxmusl-arm64@npm:1.2.4":
+  version: 1.2.4
+  resolution: "@img/sharp-libvips-linuxmusl-arm64@npm:1.2.4"
+  conditions: os=linux & cpu=arm64 & libc=musl
+  languageName: node
+  linkType: hard
+
+"@img/sharp-libvips-linuxmusl-x64@npm:1.1.0":
+  version: 1.1.0
+  resolution: "@img/sharp-libvips-linuxmusl-x64@npm:1.1.0"
+  conditions: os=linux & cpu=x64 & libc=musl
+  languageName: node
+  linkType: hard
+
+"@img/sharp-libvips-linuxmusl-x64@npm:1.2.4":
+  version: 1.2.4
+  resolution: "@img/sharp-libvips-linuxmusl-x64@npm:1.2.4"
+  conditions: os=linux & cpu=x64 & libc=musl
+  languageName: node
+  linkType: hard
+
+"@img/sharp-linux-arm64@npm:0.34.1":
+  version: 0.34.1
+  resolution: "@img/sharp-linux-arm64@npm:0.34.1"
   dependencies:
-    "@radix-ui/react-primitive": 2.0.1
-  peerDependencies:
-    "@types/react": "*"
-    "@types/react-dom": "*"
-    react: ^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc
-    react-dom: ^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc
-  peerDependenciesMeta:
-    "@types/react":
-      optional: true
-    "@types/react-dom":
+    "@img/sharp-libvips-linux-arm64": 1.1.0
+  dependenciesMeta:
+    "@img/sharp-libvips-linux-arm64":
       optional: true
-  checksum: 714c8420ee4497775a1119ceba1391a9e4fed07185ba903ade571251400fd25cedb7bebf2292ce778e74956dfa079078b2afbb67d12001c6ea5080997bcf3612
+  conditions: os=linux & cpu=arm64 & libc=glibc
   languageName: node
   linkType: hard
 
-"@radix-ui/react-aspect-ratio@npm:1.1.1":
-  version: 1.1.1
-  resolution: "@radix-ui/react-aspect-ratio@npm:1.1.1"
+"@img/sharp-linux-arm64@npm:0.34.5":
+  version: 0.34.5
+  resolution: "@img/sharp-linux-arm64@npm:0.34.5"
   dependencies:
-    "@radix-ui/react-primitive": 2.0.1
-  peerDependencies:
-    "@types/react": "*"
-    "@types/react-dom": "*"
-    react: ^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc
-    react-dom: ^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc
-  peerDependenciesMeta:
-    "@types/react":
-      optional: true
-    "@types/react-dom":
+    "@img/sharp-libvips-linux-arm64": 1.2.4
+  dependenciesMeta:
+    "@img/sharp-libvips-linux-arm64":
       optional: true
-  checksum: e99ceebb32a743fd99bdae54480213de20580a194ebdf1ca5ca2046cecc964dec8f05d29cad00740f97a790bfa05d2374dd34e6abecbb98fd5cc90937407a25f
+  conditions: os=linux & cpu=arm64 & libc=glibc
   languageName: node
   linkType: hard
 
-"@radix-ui/react-avatar@npm:1.1.2":
-  version: 1.1.2
-  resolution: "@radix-ui/react-avatar@npm:1.1.2"
+"@img/sharp-linux-arm@npm:0.34.1":
+  version: 0.34.1
+  resolution: "@img/sharp-linux-arm@npm:0.34.1"
   dependencies:
-    "@radix-ui/react-context": 1.1.1
-    "@radix-ui/react-primitive": 2.0.1
-    "@radix-ui/react-use-callback-ref": 1.1.0
-    "@radix-ui/react-use-layout-effect": 1.1.0
-  peerDependencies:
-    "@types/react": "*"
-    "@types/react-dom": "*"
-    react: ^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc
-    react-dom: ^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc
-  peerDependenciesMeta:
-    "@types/react":
-      optional: true
-    "@types/react-dom":
+    "@img/sharp-libvips-linux-arm": 1.1.0
+  dependenciesMeta:
+    "@img/sharp-libvips-linux-arm":
       optional: true
-  checksum: 84a55872452e2ad07ae418d97231b4de547b176b8731541eb01f360ca1f306ae9fd2bfb6ec59ea47d90e16970db101476c3cb9c3282e4d444bf1c9d734d9c729
+  conditions: os=linux & cpu=arm & libc=glibc
   languageName: node
   linkType: hard
 
-"@radix-ui/react-checkbox@npm:1.1.3":
-  version: 1.1.3
-  resolution: "@radix-ui/react-checkbox@npm:1.1.3"
+"@img/sharp-linux-arm@npm:0.34.5":
+  version: 0.34.5
+  resolution: "@img/sharp-linux-arm@npm:0.34.5"
   dependencies:
-    "@radix-ui/primitive": 1.1.1
-    "@radix-ui/react-compose-refs": 1.1.1
-    "@radix-ui/react-context": 1.1.1
-    "@radix-ui/react-presence": 1.1.2
-    "@radix-ui/react-primitive": 2.0.1
-    "@radix-ui/react-use-controllable-state": 1.1.0
-    "@radix-ui/react-use-previous": 1.1.0
-    "@radix-ui/react-use-size": 1.1.0
-  peerDependencies:
-    "@types/react": "*"
-    "@types/react-dom": "*"
-    react: ^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc
-    react-dom: ^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc
-  peerDependenciesMeta:
-    "@types/react":
-      optional: true
-    "@types/react-dom":
+    "@img/sharp-libvips-linux-arm": 1.2.4
+  dependenciesMeta:
+    "@img/sharp-libvips-linux-arm":
       optional: true
-  checksum: 88a28be73b849f158a47e8ee9432dede92932fcda678ecd971de131efb805aff29e33f382afdc722ca3f54f7a3d262125814ee812d5e73cc85e61bca62963bb7
+  conditions: os=linux & cpu=arm & libc=glibc
   languageName: node
   linkType: hard
 
-"@radix-ui/react-collapsible@npm:1.1.2":
-  version: 1.1.2
-  resolution: "@radix-ui/react-collapsible@npm:1.1.2"
+"@img/sharp-linux-ppc64@npm:0.34.5":
+  version: 0.34.5
+  resolution: "@img/sharp-linux-ppc64@npm:0.34.5"
   dependencies:
-    "@radix-ui/primitive": 1.1.1
-    "@radix-ui/react-compose-refs": 1.1.1
-    "@radix-ui/react-context": 1.1.1
-    "@radix-ui/react-id": 1.1.0
-    "@radix-ui/react-presence": 1.1.2
-    "@radix-ui/react-primitive": 2.0.1
-    "@radix-ui/react-use-controllable-state": 1.1.0
-    "@radix-ui/react-use-layout-effect": 1.1.0
-  peerDependencies:
-    "@types/react": "*"
-    "@types/react-dom": "*"
-    react: ^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc
-    react-dom: ^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc
-  peerDependenciesMeta:
-    "@types/react":
-      optional: true
-    "@types/react-dom":
+    "@img/sharp-libvips-linux-ppc64": 1.2.4
+  dependenciesMeta:
+    "@img/sharp-libvips-linux-ppc64":
       optional: true
-  checksum: 8a725539c0c259ea53a0e35d4ddd3acca42cab5113fd537758450ad1e76f0b757423f18aca29364f963bef4f0624d57feb32bf9d12a3ea6b2c084b523ba65205
+  conditions: os=linux & cpu=ppc64 & libc=glibc
   languageName: node
   linkType: hard
 
-"@radix-ui/react-collection@npm:1.1.1":
-  version: 1.1.1
-  resolution: "@radix-ui/react-collection@npm:1.1.1"
+"@img/sharp-linux-riscv64@npm:0.34.5":
+  version: 0.34.5
+  resolution: "@img/sharp-linux-riscv64@npm:0.34.5"
   dependencies:
-    "@radix-ui/react-compose-refs": 1.1.1
-    "@radix-ui/react-context": 1.1.1
-    "@radix-ui/react-primitive": 2.0.1
-    "@radix-ui/react-slot": 1.1.1
-  peerDependencies:
-    "@types/react": "*"
-    "@types/react-dom": "*"
-    react: ^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc
-    react-dom: ^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc
-  peerDependenciesMeta:
-    "@types/react":
-      optional: true
-    "@types/react-dom":
+    "@img/sharp-libvips-linux-riscv64": 1.2.4
+  dependenciesMeta:
+    "@img/sharp-libvips-linux-riscv64":
       optional: true
-  checksum: f01bba02e11944fa98f588a0c8dc7657228c9e7dd32ef66acdec6a540385c1e9471ef9e7dfa6184b524fdf923cf5a08892ffda3fe6d60cee34c690d9914373ce
+  conditions: os=linux & cpu=riscv64 & libc=glibc
   languageName: node
   linkType: hard
 
-"@radix-ui/react-compose-refs@npm:1.1.1":
-  version: 1.1.1
-  resolution: "@radix-ui/react-compose-refs@npm:1.1.1"
-  peerDependencies:
-    "@types/react": "*"
-    react: ^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc
-  peerDependenciesMeta:
-    "@types/react":
+"@img/sharp-linux-s390x@npm:0.34.1":
+  version: 0.34.1
+  resolution: "@img/sharp-linux-s390x@npm:0.34.1"
+  dependencies:
+    "@img/sharp-libvips-linux-s390x": 1.1.0
+  dependenciesMeta:
+    "@img/sharp-libvips-linux-s390x":
       optional: true
-  checksum: 3e84580024e66e3cc5b9ae79355e787815c1d2a3c7d46e7f47900a29c33751ca24cf4ac8903314957ab1f7788aebe1687e2258641c188cf94653f7ddf8f70627
+  conditions: os=linux & cpu=s390x & libc=glibc
   languageName: node
   linkType: hard
 
-"@radix-ui/react-context-menu@npm:2.2.5":
-  version: 2.2.5
-  resolution: "@radix-ui/react-context-menu@npm:2.2.5"
+"@img/sharp-linux-s390x@npm:0.34.5":
+  version: 0.34.5
+  resolution: "@img/sharp-linux-s390x@npm:0.34.5"
   dependencies:
-    "@radix-ui/primitive": 1.1.1
-    "@radix-ui/react-context": 1.1.1
-    "@radix-ui/react-menu": 2.1.5
-    "@radix-ui/react-primitive": 2.0.1
-    "@radix-ui/react-use-callback-ref": 1.1.0
-    "@radix-ui/react-use-controllable-state": 1.1.0
-  peerDependencies:
-    "@types/react": "*"
-    "@types/react-dom": "*"
-    react: ^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc
-    react-dom: ^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc
-  peerDependenciesMeta:
-    "@types/react":
+    "@img/sharp-libvips-linux-s390x": 1.2.4
+  dependenciesMeta:
+    "@img/sharp-libvips-linux-s390x":
       optional: true
-    "@types/react-dom":
+  conditions: os=linux & cpu=s390x & libc=glibc
+  languageName: node
+  linkType: hard
+
+"@img/sharp-linux-x64@npm:0.34.1":
+  version: 0.34.1
+  resolution: "@img/sharp-linux-x64@npm:0.34.1"
+  dependencies:
+    "@img/sharp-libvips-linux-x64": 1.1.0
+  dependenciesMeta:
+    "@img/sharp-libvips-linux-x64":
       optional: true
-  checksum: 98ae3ce113fa1539b5af2bc8ea38844f209f7ec0203d25b5bd0b307f89e0b0d8f421384fcbcf81e60898ab9c5311dace0a2ceecb624978facce8b5977a6a79b6
+  conditions: os=linux & cpu=x64 & libc=glibc
   languageName: node
   linkType: hard
 
-"@radix-ui/react-context@npm:1.1.1":
-  version: 1.1.1
-  resolution: "@radix-ui/react-context@npm:1.1.1"
-  peerDependencies:
-    "@types/react": "*"
-    react: ^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc
-  peerDependenciesMeta:
-    "@types/react":
+"@img/sharp-linux-x64@npm:0.34.5":
+  version: 0.34.5
+  resolution: "@img/sharp-linux-x64@npm:0.34.5"
+  dependencies:
+    "@img/sharp-libvips-linux-x64": 1.2.4
+  dependenciesMeta:
+    "@img/sharp-libvips-linux-x64":
       optional: true
-  checksum: fc4ace9d79d7954c715ade765e06c95d7e1b12a63a536bcbe842fb904f03f88fc5bd6e38d44bd23243d37a270b4c44380fedddaeeae2d274f0b898a20665aba2
+  conditions: os=linux & cpu=x64 & libc=glibc
   languageName: node
   linkType: hard
 
-"@radix-ui/react-dialog@npm:1.1.4":
-  version: 1.1.4
-  resolution: "@radix-ui/react-dialog@npm:1.1.4"
+"@img/sharp-linuxmusl-arm64@npm:0.34.1":
+  version: 0.34.1
+  resolution: "@img/sharp-linuxmusl-arm64@npm:0.34.1"
   dependencies:
-    "@radix-ui/primitive": 1.1.1
-    "@radix-ui/react-compose-refs": 1.1.1
-    "@radix-ui/react-context": 1.1.1
-    "@radix-ui/react-dismissable-layer": 1.1.3
-    "@radix-ui/react-focus-guards": 1.1.1
-    "@radix-ui/react-focus-scope": 1.1.1
-    "@radix-ui/react-id": 1.1.0
-    "@radix-ui/react-portal": 1.1.3
-    "@radix-ui/react-presence": 1.1.2
-    "@radix-ui/react-primitive": 2.0.1
-    "@radix-ui/react-slot": 1.1.1
-    "@radix-ui/react-use-controllable-state": 1.1.0
-    aria-hidden: ^1.1.1
-    react-remove-scroll: ^2.6.1
-  peerDependencies:
-    "@types/react": "*"
-    "@types/react-dom": "*"
-    react: ^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc
-    react-dom: ^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc
-  peerDependenciesMeta:
-    "@types/react":
+    "@img/sharp-libvips-linuxmusl-arm64": 1.1.0
+  dependenciesMeta:
+    "@img/sharp-libvips-linuxmusl-arm64":
       optional: true
-    "@types/react-dom":
+  conditions: os=linux & cpu=arm64 & libc=musl
+  languageName: node
+  linkType: hard
+
+"@img/sharp-linuxmusl-arm64@npm:0.34.5":
+  version: 0.34.5
+  resolution: "@img/sharp-linuxmusl-arm64@npm:0.34.5"
+  dependencies:
+    "@img/sharp-libvips-linuxmusl-arm64": 1.2.4
+  dependenciesMeta:
+    "@img/sharp-libvips-linuxmusl-arm64":
       optional: true
-  checksum: d0ac8d85869b0d5a51823eb66503e41bab543807aa8702a2f1b2d5f720b1a2e4e9d0d83ca744aae06c6942a8759a1cd12bfa9b715d492868548254784969f78d
+  conditions: os=linux & cpu=arm64 & libc=musl
   languageName: node
   linkType: hard
 
-"@radix-ui/react-dialog@npm:1.1.5":
-  version: 1.1.5
-  resolution: "@radix-ui/react-dialog@npm:1.1.5"
+"@img/sharp-linuxmusl-x64@npm:0.34.1":
+  version: 0.34.1
+  resolution: "@img/sharp-linuxmusl-x64@npm:0.34.1"
   dependencies:
-    "@radix-ui/primitive": 1.1.1
-    "@radix-ui/react-compose-refs": 1.1.1
-    "@radix-ui/react-context": 1.1.1
-    "@radix-ui/react-dismissable-layer": 1.1.4
-    "@radix-ui/react-focus-guards": 1.1.1
-    "@radix-ui/react-focus-scope": 1.1.1
-    "@radix-ui/react-id": 1.1.0
-    "@radix-ui/react-portal": 1.1.3
-    "@radix-ui/react-presence": 1.1.2
-    "@radix-ui/react-primitive": 2.0.1
-    "@radix-ui/react-slot": 1.1.1
-    "@radix-ui/react-use-controllable-state": 1.1.0
-    aria-hidden: ^1.2.4
-    react-remove-scroll: ^2.6.2
-  peerDependencies:
-    "@types/react": "*"
-    "@types/react-dom": "*"
-    react: ^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc
-    react-dom: ^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc
-  peerDependenciesMeta:
-    "@types/react":
-      optional: true
-    "@types/react-dom":
+    "@img/sharp-libvips-linuxmusl-x64": 1.1.0
+  dependenciesMeta:
+    "@img/sharp-libvips-linuxmusl-x64":
       optional: true
-  checksum: 486f1b6cb9de310ab03ec201701b79912eb38565175bbbd6b6399ff0d7ca5fd2ead7bb7f072a8d2acf07d0a53154e7292abee404ca9f9a26b826a649cee06a21
+  conditions: os=linux & cpu=x64 & libc=musl
   languageName: node
   linkType: hard
 
-"@radix-ui/react-direction@npm:1.1.0":
-  version: 1.1.0
-  resolution: "@radix-ui/react-direction@npm:1.1.0"
-  peerDependencies:
-    "@types/react": "*"
-    react: ^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc
-  peerDependenciesMeta:
-    "@types/react":
+"@img/sharp-linuxmusl-x64@npm:0.34.5":
+  version: 0.34.5
+  resolution: "@img/sharp-linuxmusl-x64@npm:0.34.5"
+  dependencies:
+    "@img/sharp-libvips-linuxmusl-x64": 1.2.4
+  dependenciesMeta:
+    "@img/sharp-libvips-linuxmusl-x64":
       optional: true
-  checksum: eb07d8cc3ae2388b824e0a11ae0e3b71fb0c49972b506e249cec9f27a5b7ef4305ee668c98b674833c92e842163549a83beb0a197dec1ec65774bdeeb61f932c
+  conditions: os=linux & cpu=x64 & libc=musl
   languageName: node
   linkType: hard
 
-"@radix-ui/react-dismissable-layer@npm:1.1.3":
-  version: 1.1.3
-  resolution: "@radix-ui/react-dismissable-layer@npm:1.1.3"
+"@img/sharp-wasm32@npm:0.34.1":
+  version: 0.34.1
+  resolution: "@img/sharp-wasm32@npm:0.34.1"
   dependencies:
-    "@radix-ui/primitive": 1.1.1
-    "@radix-ui/react-compose-refs": 1.1.1
-    "@radix-ui/react-primitive": 2.0.1
-    "@radix-ui/react-use-callback-ref": 1.1.0
-    "@radix-ui/react-use-escape-keydown": 1.1.0
-  peerDependencies:
-    "@types/react": "*"
-    "@types/react-dom": "*"
-    react: ^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc
-    react-dom: ^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc
-  peerDependenciesMeta:
-    "@types/react":
-      optional: true
-    "@types/react-dom":
-      optional: true
-  checksum: 1ab2ebddf3d450bf4efb1e846894824a0056d3fa3deec0858206bc7547857fe5fe37e42f0a34918072702ead6dedc388a5770c060b2596cd408e20db86c54253
+    "@emnapi/runtime": ^1.4.0
+  conditions: cpu=wasm32
   languageName: node
   linkType: hard
 
-"@radix-ui/react-dismissable-layer@npm:1.1.4":
-  version: 1.1.4
-  resolution: "@radix-ui/react-dismissable-layer@npm:1.1.4"
+"@img/sharp-wasm32@npm:0.34.5":
+  version: 0.34.5
+  resolution: "@img/sharp-wasm32@npm:0.34.5"
   dependencies:
-    "@radix-ui/primitive": 1.1.1
-    "@radix-ui/react-compose-refs": 1.1.1
-    "@radix-ui/react-primitive": 2.0.1
-    "@radix-ui/react-use-callback-ref": 1.1.0
-    "@radix-ui/react-use-escape-keydown": 1.1.0
-  peerDependencies:
-    "@types/react": "*"
-    "@types/react-dom": "*"
-    react: ^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc
-    react-dom: ^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc
-  peerDependenciesMeta:
-    "@types/react":
-      optional: true
-    "@types/react-dom":
-      optional: true
-  checksum: 8657bf3e7e9e6ffeec9b23fbea4ae4e35f0a8fb474b5562636c721be82a95df30da32b9957dfc3826caa0b2e0b79a1333e7589d64de44b3ea02a667c83622efb
+    "@emnapi/runtime": ^1.7.0
+  conditions: cpu=wasm32
   languageName: node
   linkType: hard
 
-"@radix-ui/react-dropdown-menu@npm:2.1.5":
-  version: 2.1.5
-  resolution: "@radix-ui/react-dropdown-menu@npm:2.1.5"
-  dependencies:
-    "@radix-ui/primitive": 1.1.1
-    "@radix-ui/react-compose-refs": 1.1.1
-    "@radix-ui/react-context": 1.1.1
-    "@radix-ui/react-id": 1.1.0
-    "@radix-ui/react-menu": 2.1.5
-    "@radix-ui/react-primitive": 2.0.1
-    "@radix-ui/react-use-controllable-state": 1.1.0
-  peerDependencies:
-    "@types/react": "*"
-    "@types/react-dom": "*"
-    react: ^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc
-    react-dom: ^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc
-  peerDependenciesMeta:
-    "@types/react":
-      optional: true
-    "@types/react-dom":
-      optional: true
-  checksum: 1b32444758058f97d8222029c66fb277405811b6ed42d02122b9d12953d484a04602778ccfcae29522216fc64c0a9d0b007c40074049928b9b034454cae548d6
+"@img/sharp-win32-arm64@npm:0.34.5":
+  version: 0.34.5
+  resolution: "@img/sharp-win32-arm64@npm:0.34.5"
+  conditions: os=win32 & cpu=arm64
   languageName: node
   linkType: hard
 
-"@radix-ui/react-focus-guards@npm:1.1.1":
-  version: 1.1.1
-  resolution: "@radix-ui/react-focus-guards@npm:1.1.1"
-  peerDependencies:
-    "@types/react": "*"
-    react: ^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc
-  peerDependenciesMeta:
-    "@types/react":
-      optional: true
-  checksum: 2e99750ca593083a530542a185d656b45b100752353a7a193a67566e3c256414a76fa9171d152f8c0167b8d6c1fdf62b2e07750d7af2974bf8ef39eb204aa537
+"@img/sharp-win32-ia32@npm:0.34.1":
+  version: 0.34.1
+  resolution: "@img/sharp-win32-ia32@npm:0.34.1"
+  conditions: os=win32 & cpu=ia32
   languageName: node
   linkType: hard
 
-"@radix-ui/react-focus-scope@npm:1.1.1":
-  version: 1.1.1
-  resolution: "@radix-ui/react-focus-scope@npm:1.1.1"
-  dependencies:
-    "@radix-ui/react-compose-refs": 1.1.1
-    "@radix-ui/react-primitive": 2.0.1
-    "@radix-ui/react-use-callback-ref": 1.1.0
-  peerDependencies:
-    "@types/react": "*"
-    "@types/react-dom": "*"
-    react: ^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc
-    react-dom: ^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc
-  peerDependenciesMeta:
-    "@types/react":
-      optional: true
-    "@types/react-dom":
-      optional: true
-  checksum: a430264a32e358c05dfa1c3abcf6c3d0481cbcbb2547532324c6d69fa7f9e3ed77b5eb2dd64d42808ec62c8d69abb573d6076907764af126d14ea18febf45d7b
+"@img/sharp-win32-ia32@npm:0.34.5":
+  version: 0.34.5
+  resolution: "@img/sharp-win32-ia32@npm:0.34.5"
+  conditions: os=win32 & cpu=ia32
   languageName: node
   linkType: hard
 
-"@radix-ui/react-form@npm:0.1.1":
-  version: 0.1.1
-  resolution: "@radix-ui/react-form@npm:0.1.1"
+"@img/sharp-win32-x64@npm:0.34.1":
+  version: 0.34.1
+  resolution: "@img/sharp-win32-x64@npm:0.34.1"
+  conditions: os=win32 & cpu=x64
+  languageName: node
+  linkType: hard
+
+"@img/sharp-win32-x64@npm:0.34.5":
+  version: 0.34.5
+  resolution: "@img/sharp-win32-x64@npm:0.34.5"
+  conditions: os=win32 & cpu=x64
+  languageName: node
+  linkType: hard
+
+"@internationalized/date@npm:^3.5.6":
+  version: 3.5.6
+  resolution: "@internationalized/date@npm:3.5.6"
   dependencies:
-    "@radix-ui/primitive": 1.1.1
-    "@radix-ui/react-compose-refs": 1.1.1
-    "@radix-ui/react-context": 1.1.1
-    "@radix-ui/react-id": 1.1.0
-    "@radix-ui/react-label": 2.1.1
-    "@radix-ui/react-primitive": 2.0.1
-  peerDependencies:
-    "@types/react": "*"
-    "@types/react-dom": "*"
-    react: ^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc
-    react-dom: ^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc
-  peerDependenciesMeta:
-    "@types/react":
-      optional: true
-    "@types/react-dom":
-      optional: true
-  checksum: 78c41d03abab2744fd4026c1b365b8977b00749b86085db5579eed3a57c91748b344d64014a4437204f3eecd334e8284b25f85b24192c9100178559bf3797d05
+    "@swc/helpers": ^0.5.0
+  checksum: 25d3150247175892705aeaf8e1a78295717d420c37cb3065a766c4058a1aed460a69dc5362f7073425c95095c27036c7ed65f0ce5fbb32b20f917132e8dc543f
   languageName: node
   linkType: hard
 
-"@radix-ui/react-hover-card@npm:1.1.5":
-  version: 1.1.5
-  resolution: "@radix-ui/react-hover-card@npm:1.1.5"
+"@internationalized/message@npm:^3.1.5":
+  version: 3.1.5
+  resolution: "@internationalized/message@npm:3.1.5"
   dependencies:
-    "@radix-ui/primitive": 1.1.1
-    "@radix-ui/react-compose-refs": 1.1.1
-    "@radix-ui/react-context": 1.1.1
-    "@radix-ui/react-dismissable-layer": 1.1.4
-    "@radix-ui/react-popper": 1.2.1
-    "@radix-ui/react-portal": 1.1.3
-    "@radix-ui/react-presence": 1.1.2
-    "@radix-ui/react-primitive": 2.0.1
-    "@radix-ui/react-use-controllable-state": 1.1.0
-  peerDependencies:
-    "@types/react": "*"
-    "@types/react-dom": "*"
-    react: ^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc
-    react-dom: ^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc
-  peerDependenciesMeta:
-    "@types/react":
-      optional: true
-    "@types/react-dom":
-      optional: true
-  checksum: 69b434a44eef9f47224a0d27980e4ecc7922029bbbe4ae8868a54d23a8c3bcdd495cd82eb9e0872c3df095cd65015c59f05f66de7a38cd00025d5a6feb046b77
+    "@swc/helpers": ^0.5.0
+    intl-messageformat: ^10.1.0
+  checksum: 81a2ef21154d0b00796fd2ecfb5365248fe50f64a7ad1616dbe4e491555e7e018557b061df145d0ab5b68cb1e757ac203d3892c42f791f169360b98d77fa5091
   languageName: node
   linkType: hard
 
-"@radix-ui/react-id@npm:1.1.0":
-  version: 1.1.0
-  resolution: "@radix-ui/react-id@npm:1.1.0"
+"@internationalized/number@npm:^3.5.4":
+  version: 3.5.4
+  resolution: "@internationalized/number@npm:3.5.4"
   dependencies:
-    "@radix-ui/react-use-layout-effect": 1.1.0
-  peerDependencies:
-    "@types/react": "*"
-    react: ^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc
-  peerDependenciesMeta:
-    "@types/react":
-      optional: true
-  checksum: acf13e29e51ee96336837fc0cfecc306328b20b0e0070f6f0f7aa7a621ded4a1ee5537cfad58456f64bae76caa7f8769231e88dc7dc106197347ee433c275a79
+    "@swc/helpers": ^0.5.0
+  checksum: d01a1845ad9815756ceb59eeb75792ee89105d073ce232350c0644453a3470e3ebaffc2b00ebd2dd8238957b0ae12d1551633308897fa9c332dda82f2af8c5cf
   languageName: node
   linkType: hard
 
-"@radix-ui/react-label@npm:2.1.1":
-  version: 2.1.1
-  resolution: "@radix-ui/react-label@npm:2.1.1"
+"@internationalized/string@npm:^3.2.4":
+  version: 3.2.4
+  resolution: "@internationalized/string@npm:3.2.4"
   dependencies:
-    "@radix-ui/react-primitive": 2.0.1
-  peerDependencies:
-    "@types/react": "*"
-    "@types/react-dom": "*"
-    react: ^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc
-    react-dom: ^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc
-  peerDependenciesMeta:
-    "@types/react":
-      optional: true
-    "@types/react-dom":
-      optional: true
-  checksum: 902628dc2c05610462a264feedc8c548d7ecad7f000efb9a4190e365ee2b7f75eccf98b43925fac6e1fa940c437abbce03ecc6868e06e0a197c779973ccc839d
+    "@swc/helpers": ^0.5.0
+  checksum: 5a03ff3d7bea1eb0e7ef8f7b00d148b6b8afa90600434db61389e6a8a83e3ca89e469c730eb02ef6284e7b559ce4be8f46cb446387e137931bc47acb8cbcd841
   languageName: node
   linkType: hard
 
-"@radix-ui/react-menu@npm:2.1.5":
-  version: 2.1.5
-  resolution: "@radix-ui/react-menu@npm:2.1.5"
+"@isaacs/cliui@npm:^8.0.2":
+  version: 8.0.2
+  resolution: "@isaacs/cliui@npm:8.0.2"
   dependencies:
-    "@radix-ui/primitive": 1.1.1
-    "@radix-ui/react-collection": 1.1.1
-    "@radix-ui/react-compose-refs": 1.1.1
-    "@radix-ui/react-context": 1.1.1
-    "@radix-ui/react-direction": 1.1.0
-    "@radix-ui/react-dismissable-layer": 1.1.4
-    "@radix-ui/react-focus-guards": 1.1.1
-    "@radix-ui/react-focus-scope": 1.1.1
-    "@radix-ui/react-id": 1.1.0
-    "@radix-ui/react-popper": 1.2.1
-    "@radix-ui/react-portal": 1.1.3
+    string-width: ^5.1.2
+    string-width-cjs: "npm:string-width@^4.2.0"
+    strip-ansi: ^7.0.1
+    strip-ansi-cjs: "npm:strip-ansi@^6.0.1"
+    wrap-ansi: ^8.1.0
+    wrap-ansi-cjs: "npm:wrap-ansi@^7.0.0"
+  checksum: b1bf42535d49f11dc137f18d5e4e63a28c5569de438a221c369483731e9dac9fb797af554e8bf02b6192d1e5eba6e6402cf93900c3d0ac86391d00d04876789e
+  languageName: node
+  linkType: hard
+
+"@isaacs/cliui@npm:^9.0.0":
+  version: 9.0.0
+  resolution: "@isaacs/cliui@npm:9.0.0"
+  checksum: 971063b7296419f85053dacd0a0285dcadaa3dfc139228b23e016c1a9848121ad4aa5e7fcca7522062014e1eb6239a7424188b9f2cba893a79c90aae5710319c
+  languageName: node
+  linkType: hard
+
+"@jridgewell/gen-mapping@npm:^0.3.0, @jridgewell/gen-mapping@npm:^0.3.2":
+  version: 0.3.4
+  resolution: "@jridgewell/gen-mapping@npm:0.3.4"
+  dependencies:
+    "@jridgewell/set-array": ^1.0.1
+    "@jridgewell/sourcemap-codec": ^1.4.10
+    "@jridgewell/trace-mapping": ^0.3.9
+  checksum: dd6c48341ad01a75bd93bae17fcc888120d063bdf927d4c496b663aa68e22b9e51e898ba38abe7457b28efd3fa5cde43723dba4dc5f94281119fa709cb5046be
+  languageName: node
+  linkType: hard
+
+"@jridgewell/gen-mapping@npm:^0.3.12, @jridgewell/gen-mapping@npm:^0.3.5":
+  version: 0.3.13
+  resolution: "@jridgewell/gen-mapping@npm:0.3.13"
+  dependencies:
+    "@jridgewell/sourcemap-codec": ^1.5.0
+    "@jridgewell/trace-mapping": ^0.3.24
+  checksum: 9a7d65fb13bd9aec1fbab74cda08496839b7e2ceb31f5ab922b323e94d7c481ce0fc4fd7e12e2610915ed8af51178bdc61e168e92a8c8b8303b030b03489b13b
+  languageName: node
+  linkType: hard
+
+"@jridgewell/remapping@npm:^2.3.5":
+  version: 2.3.5
+  resolution: "@jridgewell/remapping@npm:2.3.5"
+  dependencies:
+    "@jridgewell/gen-mapping": ^0.3.5
+    "@jridgewell/trace-mapping": ^0.3.24
+  checksum: 3de494219ffeb2c5c38711d0d7bb128097edf91893090a2dbc8ee0b55d092bb7347b1fd0f478486c5eab010e855c73927b1666f2107516d472d24a73017d1194
+  languageName: node
+  linkType: hard
+
+"@jridgewell/resolve-uri@npm:^3.0.3, @jridgewell/resolve-uri@npm:^3.1.0":
+  version: 3.1.2
+  resolution: "@jridgewell/resolve-uri@npm:3.1.2"
+  checksum: d502e6fb516b35032331406d4e962c21fe77cdf1cbdb49c6142bcbd9e30507094b18972778a6e27cbad756209cfe34b1a27729e6fa08a2eb92b33943f680cf1e
+  languageName: node
+  linkType: hard
+
+"@jridgewell/set-array@npm:^1.0.1":
+  version: 1.1.2
+  resolution: "@jridgewell/set-array@npm:1.1.2"
+  checksum: bc7ab4c4c00470de4e7562ecac3c0c84f53e7ee8a711e546d67c47da7febe7c45cd67d4d84ee3c9b2c05ae8e872656cdded8a707a283d30bd54fbc65aef821ab
+  languageName: node
+  linkType: hard
+
+"@jridgewell/source-map@npm:^0.3.2":
+  version: 0.3.11
+  resolution: "@jridgewell/source-map@npm:0.3.11"
+  dependencies:
+    "@jridgewell/gen-mapping": ^0.3.5
+    "@jridgewell/trace-mapping": ^0.3.25
+  checksum: 50a4fdafe0b8f655cb2877e59fe81320272eaa4ccdbe6b9b87f10614b2220399ae3e05c16137a59db1f189523b42c7f88bd097ee991dbd7bc0e01113c583e844
+  languageName: node
+  linkType: hard
+
+"@jridgewell/sourcemap-codec@npm:^1.4.10, @jridgewell/sourcemap-codec@npm:^1.4.14":
+  version: 1.4.15
+  resolution: "@jridgewell/sourcemap-codec@npm:1.4.15"
+  checksum: 0c6b5ae663087558039052a626d2d7ed5208da36cfd707dcc5cea4a07cfc918248403dcb5989a8f7afaf245ce0573b7cc6fd94c4a30453bd10e44d9363940ba5
+  languageName: node
+  linkType: hard
+
+"@jridgewell/sourcemap-codec@npm:^1.5.0, @jridgewell/sourcemap-codec@npm:^1.5.5":
+  version: 1.5.5
+  resolution: "@jridgewell/sourcemap-codec@npm:1.5.5"
+  checksum: f9e538f302b63c0ebc06eecb1dd9918dd4289ed36147a0ddce35d6ea4d7ebbda243cda7b2213b6a5e1d8087a298d5cf630fb2bd39329cdecb82017023f6081a0
+  languageName: node
+  linkType: hard
+
+"@jridgewell/trace-mapping@npm:0.3.9":
+  version: 0.3.9
+  resolution: "@jridgewell/trace-mapping@npm:0.3.9"
+  dependencies:
+    "@jridgewell/resolve-uri": ^3.0.3
+    "@jridgewell/sourcemap-codec": ^1.4.10
+  checksum: fa425b606d7c7ee5bfa6a31a7b050dd5814b4082f318e0e4190f991902181b4330f43f4805db1dd4f2433fd0ed9cc7a7b9c2683f1deeab1df1b0a98b1e24055b
+  languageName: node
+  linkType: hard
+
+"@jridgewell/trace-mapping@npm:^0.3.17, @jridgewell/trace-mapping@npm:^0.3.9":
+  version: 0.3.23
+  resolution: "@jridgewell/trace-mapping@npm:0.3.23"
+  dependencies:
+    "@jridgewell/resolve-uri": ^3.1.0
+    "@jridgewell/sourcemap-codec": ^1.4.14
+  checksum: 26190e09129b184a41c83ce896ce41c0636ddc1285a22627a48ec7981829346ced655d5774bdca30446250baf0e4fb519c47732760d128edda51a6222b40397a
+  languageName: node
+  linkType: hard
+
+"@jridgewell/trace-mapping@npm:^0.3.24, @jridgewell/trace-mapping@npm:^0.3.25, @jridgewell/trace-mapping@npm:^0.3.28":
+  version: 0.3.31
+  resolution: "@jridgewell/trace-mapping@npm:0.3.31"
+  dependencies:
+    "@jridgewell/resolve-uri": ^3.1.0
+    "@jridgewell/sourcemap-codec": ^1.4.14
+  checksum: 4b30ec8cd56c5fd9a661f088230af01e0c1a3888d11ffb6b47639700f71225be21d1f7e168048d6d4f9449207b978a235c07c8f15c07705685d16dc06280e9d9
+  languageName: node
+  linkType: hard
+
+"@jsdevtools/ono@npm:^7.1.3":
+  version: 7.1.3
+  resolution: "@jsdevtools/ono@npm:7.1.3"
+  checksum: a9f7e3e8e3bc315a34959934a5e2f874c423cf4eae64377d3fc9de0400ed9f36cb5fd5ebce3300d2e8f4085f557c4a8b591427a583729a87841fda46e6c216b9
+  languageName: node
+  linkType: hard
+
+"@juggle/resize-observer@npm:^3.3.1":
+  version: 3.4.0
+  resolution: "@juggle/resize-observer@npm:3.4.0"
+  checksum: 12930242357298c6f2ad5d4ec7cf631dfb344ca7c8c830ab7f64e6ac11eb1aae486901d8d880fd08fb1b257800c160a0da3aee1e7ed9adac0ccbb9b7c5d93347
+  languageName: node
+  linkType: hard
+
+"@kapaai/react-sdk@npm:^0.9.0":
+  version: 0.9.0
+  resolution: "@kapaai/react-sdk@npm:0.9.0"
+  dependencies:
+    "@fingerprintjs/fingerprintjs-pro-react": ^2.7.0
+    "@hcaptcha/react-hcaptcha": ^1.12.0
+    "@tanstack/react-query": ^5.74.3
+    js-cookie: ^3.0.5
+    tldts: ^7.0.7
+  peerDependencies:
+    react: ">=17.0.0"
+    react-dom: ">=17.0.0"
+  checksum: d3fc9de9b2b5e176d2905ef75d012b130320be281cab236154e8faac8b5e0cc574c4b23c07da7ffd2bdccbf2ea281828ec222c2d80d6214092ec4295896f5c09
+  languageName: node
+  linkType: hard
+
+"@lukeed/csprng@npm:^1.1.0":
+  version: 1.1.0
+  resolution: "@lukeed/csprng@npm:1.1.0"
+  checksum: 5d6dcf478af732972083ab2889c294b57f1028fa13c2c240d7a4aaa079c2c75df7ef0dcbdda5419147fc6704b4adf96b2de92f1a9a72ac21c6350c4014fffe6c
+  languageName: node
+  linkType: hard
+
+"@lukeed/uuid@npm:^2.0.0":
+  version: 2.0.1
+  resolution: "@lukeed/uuid@npm:2.0.1"
+  dependencies:
+    "@lukeed/csprng": ^1.1.0
+  checksum: f9cc0385021f352f444d96dd101afd2a0efd3b2e85a61ac67deb8220409f75a6a426ed6525d297d97746f7931e3079ac6218777551a7c82686de7d292220cb1f
+  languageName: node
+  linkType: hard
+
+"@mdx-js/loader@npm:^3.1.0":
+  version: 3.1.0
+  resolution: "@mdx-js/loader@npm:3.1.0"
+  dependencies:
+    "@mdx-js/mdx": ^3.0.0
+    source-map: ^0.7.0
+  peerDependencies:
+    webpack: ">=5"
+  peerDependenciesMeta:
+    webpack:
+      optional: true
+  checksum: 0f301dcc1dbc0f7aa0060fdeabf9efbc6218f3660562c4c97f273fa3e74a6259d231468a38998b4739cf3ea9bc7cf9f23d5b3deda919af2ac9c10b4580bd142c
+  languageName: node
+  linkType: hard
+
+"@mdx-js/mdx@npm:^3.0.0":
+  version: 3.0.1
+  resolution: "@mdx-js/mdx@npm:3.0.1"
+  dependencies:
+    "@types/estree": ^1.0.0
+    "@types/estree-jsx": ^1.0.0
+    "@types/hast": ^3.0.0
+    "@types/mdx": ^2.0.0
+    collapse-white-space: ^2.0.0
+    devlop: ^1.0.0
+    estree-util-build-jsx: ^3.0.0
+    estree-util-is-identifier-name: ^3.0.0
+    estree-util-to-js: ^2.0.0
+    estree-walker: ^3.0.0
+    hast-util-to-estree: ^3.0.0
+    hast-util-to-jsx-runtime: ^2.0.0
+    markdown-extensions: ^2.0.0
+    periscopic: ^3.0.0
+    remark-mdx: ^3.0.0
+    remark-parse: ^11.0.0
+    remark-rehype: ^11.0.0
+    source-map: ^0.7.0
+    unified: ^11.0.0
+    unist-util-position-from-estree: ^2.0.0
+    unist-util-stringify-position: ^4.0.0
+    unist-util-visit: ^5.0.0
+    vfile: ^6.0.0
+  checksum: 8cd7084f1242209bbeef81f69ea670ffffa0656dda2893bbd46b1b2b26078a57f9d993f8f82ad8ba16bc969189235140007185276d7673471827331521eae2e0
+  languageName: node
+  linkType: hard
+
+"@mdx-js/mdx@npm:^3.0.1, @mdx-js/mdx@npm:^3.1.0":
+  version: 3.1.0
+  resolution: "@mdx-js/mdx@npm:3.1.0"
+  dependencies:
+    "@types/estree": ^1.0.0
+    "@types/estree-jsx": ^1.0.0
+    "@types/hast": ^3.0.0
+    "@types/mdx": ^2.0.0
+    collapse-white-space: ^2.0.0
+    devlop: ^1.0.0
+    estree-util-is-identifier-name: ^3.0.0
+    estree-util-scope: ^1.0.0
+    estree-walker: ^3.0.0
+    hast-util-to-jsx-runtime: ^2.0.0
+    markdown-extensions: ^2.0.0
+    recma-build-jsx: ^1.0.0
+    recma-jsx: ^1.0.0
+    recma-stringify: ^1.0.0
+    rehype-recma: ^1.0.0
+    remark-mdx: ^3.0.0
+    remark-parse: ^11.0.0
+    remark-rehype: ^11.0.0
+    source-map: ^0.7.0
+    unified: ^11.0.0
+    unist-util-position-from-estree: ^2.0.0
+    unist-util-stringify-position: ^4.0.0
+    unist-util-visit: ^5.0.0
+    vfile: ^6.0.0
+  checksum: e586ab772dcfee2bab334d5aac54c711e6d6d550085271c38a49c629b3e3954b5f41f488060761284a5e00649d0638d6aba6c0a7c66f91db80dee0ccc304ab32
+  languageName: node
+  linkType: hard
+
+"@mdx-js/mdx@npm:^3.1.1":
+  version: 3.1.1
+  resolution: "@mdx-js/mdx@npm:3.1.1"
+  dependencies:
+    "@types/estree": ^1.0.0
+    "@types/estree-jsx": ^1.0.0
+    "@types/hast": ^3.0.0
+    "@types/mdx": ^2.0.0
+    acorn: ^8.0.0
+    collapse-white-space: ^2.0.0
+    devlop: ^1.0.0
+    estree-util-is-identifier-name: ^3.0.0
+    estree-util-scope: ^1.0.0
+    estree-walker: ^3.0.0
+    hast-util-to-jsx-runtime: ^2.0.0
+    markdown-extensions: ^2.0.0
+    recma-build-jsx: ^1.0.0
+    recma-jsx: ^1.0.0
+    recma-stringify: ^1.0.0
+    rehype-recma: ^1.0.0
+    remark-mdx: ^3.0.0
+    remark-parse: ^11.0.0
+    remark-rehype: ^11.0.0
+    source-map: ^0.7.0
+    unified: ^11.0.0
+    unist-util-position-from-estree: ^2.0.0
+    unist-util-stringify-position: ^4.0.0
+    unist-util-visit: ^5.0.0
+    vfile: ^6.0.0
+  checksum: 371ed95e2bee7731f30a7ce57db66383a0b7470e66c38139427174cb456d6a40bf7d259f3652716370c1de64acfba50a1ba27eb8c556e7a431dc7940b04cb1a1
+  languageName: node
+  linkType: hard
+
+"@mdx-js/react@npm:^3.0.1":
+  version: 3.0.1
+  resolution: "@mdx-js/react@npm:3.0.1"
+  dependencies:
+    "@types/mdx": ^2.0.0
+  peerDependencies:
+    "@types/react": ">=16"
+    react: ">=16"
+  checksum: d210d926ef488d39ad65f04d821936b668eadcdde3b6421e94ec4200ca7ad17f17d24c5cbc543882586af9f08b10e2eea715c728ce6277487945e05c5199f532
+  languageName: node
+  linkType: hard
+
+"@mdx-js/react@npm:^3.1.0":
+  version: 3.1.0
+  resolution: "@mdx-js/react@npm:3.1.0"
+  dependencies:
+    "@types/mdx": ^2.0.0
+  peerDependencies:
+    "@types/react": ">=16"
+    react: ">=16"
+  checksum: 381ed1211ba2b8491bf0ad9ef0d8d1badcdd114e1931d55d44019d4b827cc2752586708f9c7d2f9c3244150ed81f1f671a6ca95fae0edd5797fb47a22e06ceca
+  languageName: node
+  linkType: hard
+
+"@mdx-js/react@npm:^3.1.1":
+  version: 3.1.1
+  resolution: "@mdx-js/react@npm:3.1.1"
+  dependencies:
+    "@types/mdx": ^2.0.0
+  peerDependencies:
+    "@types/react": ">=16"
+    react: ">=16"
+  checksum: 34ca98bc2a0f969894ea144dc5c8a5294690505458cd24965cd9be854d779c193ad9192bf9143c4c18438fafd1902e100d99067e045c69319288562d497558c6
+  languageName: node
+  linkType: hard
+
+"@medusajs/icons@npm:2.15.1":
+  version: 2.15.1
+  resolution: "@medusajs/icons@npm:2.15.1"
+  peerDependencies:
+    react: ^19.2.5
+  checksum: 8d4668cdff95a24dcd67ccd08d4f379eb1dd7b05dbb8b5c6a969af4124cdff2236d57878610f5b4649124049229f3175d82678efb6502c9d418bc74ce0e1caeb
+  languageName: node
+  linkType: hard
+
+"@medusajs/ui-preset@npm:2.15.1":
+  version: 2.15.1
+  resolution: "@medusajs/ui-preset@npm:2.15.1"
+  dependencies:
+    "@tailwindcss/forms": ^0.5.3
+    tailwindcss-animate: ^1.0.6
+  peerDependencies:
+    tailwindcss: ^3.4.3
+  checksum: 5e3ca365b7c84c141e49f702e631e0fd196935d3d0cf066740629639125b91c2fc566099f8fc73418fbf9b80ed897fd62ee806ea5e2054b4aeab3e3588d2751d
+  languageName: node
+  linkType: hard
+
+"@medusajs/ui@npm:4.1.11":
+  version: 4.1.11
+  resolution: "@medusajs/ui@npm:4.1.11"
+  dependencies:
+    "@dnd-kit/core": ^6.1.0
+    "@dnd-kit/sortable": ^8.0.0
+    "@dnd-kit/utilities": ^3.2.2
+    "@medusajs/icons": 2.15.1
+    "@radix-ui/react-dialog": 1.1.4
+    "@radix-ui/react-dismissable-layer": 1.1.4
+    "@tanstack/react-table": 8.20.5
+    clsx: ^1.2.1
+    copy-to-clipboard: ^3.3.3
+    cva: 1.0.0-beta.1
+    lodash.isequal: ^4.5.0
+    prism-react-renderer: ^2.0.6
+    prismjs: ^1.30.0
+    radix-ui: 1.1.2
+    react-aria: ^3.33.1
+    react-currency-input-field: ^3.6.11
+    react-stately: ^3.31.1
+    sonner: ^1.5.0
+    tailwind-merge: ^2.2.1
+  peerDependencies:
+    react: ^18.3.1
+    react-dom: ^18.3.1
+  checksum: 5a751dd0216ec7772956f89e463a71c9c212c77df1c75726c11db395d53fd04f65206a4b9644397779d0eb0b58d34be55939fd5c5e8a1dbee9ebe493d275fd32
+  languageName: node
+  linkType: hard
+
+"@mixmark-io/domino@npm:^2.2.0":
+  version: 2.2.0
+  resolution: "@mixmark-io/domino@npm:2.2.0"
+  checksum: aa468a15f9217d425220fe6a4b3f9416cbe8e566ee14efc191c6d5cc04fe39338b16a90bbac190f28d44e69465db5f2cf95f479c621ce38060ca6b2a3d346e9d
+  languageName: node
+  linkType: hard
+
+"@next/bundle-analyzer@npm:15.5.18":
+  version: 15.5.18
+  resolution: "@next/bundle-analyzer@npm:15.5.18"
+  dependencies:
+    webpack-bundle-analyzer: 4.10.1
+  checksum: 82d69ead22fe0988254610e405ae9be6990b7528be409ccb9cf8c0702824fbcd6ddf204aa5cec7fb9c9480d85d53b058d9f1d84d1f56598b02d3412555b9636b
+  languageName: node
+  linkType: hard
+
+"@next/env@npm:15.3.9":
+  version: 15.3.9
+  resolution: "@next/env@npm:15.3.9"
+  checksum: 8ae01f6b8b7bb9210ddac461eb6d59a41a048deaabed1a5e45850b7d0506e751e5d3d15c113a73963e134b846b4002c98562d119d0793fd162129f003f448d5f
+  languageName: node
+  linkType: hard
+
+"@next/env@npm:15.5.18":
+  version: 15.5.18
+  resolution: "@next/env@npm:15.5.18"
+  checksum: cfb628f88b903b2593a778658abd2eed8a35ca91807ef19c08461543ed3ba9143e6f0ea4f29b98693f806f9498d1e6ca7c1efd1e0c3a0595991e2bac202e545a
+  languageName: node
+  linkType: hard
+
+"@next/eslint-plugin-next@npm:15.3.6":
+  version: 15.3.6
+  resolution: "@next/eslint-plugin-next@npm:15.3.6"
+  dependencies:
+    fast-glob: 3.3.1
+  checksum: 05fb82e25e46f8bf713e0db3c94846b32512cbe19050d8141ba7d74ecb036e34afd732955e3978cdb98b799cc88d186628fe720bdb4996b881be702c0b327168
+  languageName: node
+  linkType: hard
+
+"@next/mdx@npm:15.5.18":
+  version: 15.5.18
+  resolution: "@next/mdx@npm:15.5.18"
+  dependencies:
+    source-map: ^0.7.0
+  peerDependencies:
+    "@mdx-js/loader": ">=0.15.0"
+    "@mdx-js/react": ">=0.15.0"
+  peerDependenciesMeta:
+    "@mdx-js/loader":
+      optional: true
+    "@mdx-js/react":
+      optional: true
+  checksum: 80a101c4cbb6840d224a2369539976e758c76e4cf0f606db6de94cf7dd67b8392053df9ef4db6314a976fe4cf9a51c24e2b8280e266c236eb359bc9b616c8f60
+  languageName: node
+  linkType: hard
+
+"@next/swc-darwin-arm64@npm:15.3.5":
+  version: 15.3.5
+  resolution: "@next/swc-darwin-arm64@npm:15.3.5"
+  conditions: os=darwin & cpu=arm64
+  languageName: node
+  linkType: hard
+
+"@next/swc-darwin-arm64@npm:15.5.18":
+  version: 15.5.18
+  resolution: "@next/swc-darwin-arm64@npm:15.5.18"
+  conditions: os=darwin & cpu=arm64
+  languageName: node
+  linkType: hard
+
+"@next/swc-darwin-x64@npm:15.3.5":
+  version: 15.3.5
+  resolution: "@next/swc-darwin-x64@npm:15.3.5"
+  conditions: os=darwin & cpu=x64
+  languageName: node
+  linkType: hard
+
+"@next/swc-darwin-x64@npm:15.5.18":
+  version: 15.5.18
+  resolution: "@next/swc-darwin-x64@npm:15.5.18"
+  conditions: os=darwin & cpu=x64
+  languageName: node
+  linkType: hard
+
+"@next/swc-linux-arm64-gnu@npm:15.3.5":
+  version: 15.3.5
+  resolution: "@next/swc-linux-arm64-gnu@npm:15.3.5"
+  conditions: os=linux & cpu=arm64 & libc=glibc
+  languageName: node
+  linkType: hard
+
+"@next/swc-linux-arm64-gnu@npm:15.5.18":
+  version: 15.5.18
+  resolution: "@next/swc-linux-arm64-gnu@npm:15.5.18"
+  conditions: os=linux & cpu=arm64 & libc=glibc
+  languageName: node
+  linkType: hard
+
+"@next/swc-linux-arm64-musl@npm:15.3.5":
+  version: 15.3.5
+  resolution: "@next/swc-linux-arm64-musl@npm:15.3.5"
+  conditions: os=linux & cpu=arm64 & libc=musl
+  languageName: node
+  linkType: hard
+
+"@next/swc-linux-arm64-musl@npm:15.5.18":
+  version: 15.5.18
+  resolution: "@next/swc-linux-arm64-musl@npm:15.5.18"
+  conditions: os=linux & cpu=arm64 & libc=musl
+  languageName: node
+  linkType: hard
+
+"@next/swc-linux-x64-gnu@npm:15.3.5":
+  version: 15.3.5
+  resolution: "@next/swc-linux-x64-gnu@npm:15.3.5"
+  conditions: os=linux & cpu=x64 & libc=glibc
+  languageName: node
+  linkType: hard
+
+"@next/swc-linux-x64-gnu@npm:15.5.18":
+  version: 15.5.18
+  resolution: "@next/swc-linux-x64-gnu@npm:15.5.18"
+  conditions: os=linux & cpu=x64 & libc=glibc
+  languageName: node
+  linkType: hard
+
+"@next/swc-linux-x64-musl@npm:15.3.5":
+  version: 15.3.5
+  resolution: "@next/swc-linux-x64-musl@npm:15.3.5"
+  conditions: os=linux & cpu=x64 & libc=musl
+  languageName: node
+  linkType: hard
+
+"@next/swc-linux-x64-musl@npm:15.5.18":
+  version: 15.5.18
+  resolution: "@next/swc-linux-x64-musl@npm:15.5.18"
+  conditions: os=linux & cpu=x64 & libc=musl
+  languageName: node
+  linkType: hard
+
+"@next/swc-win32-arm64-msvc@npm:15.3.5":
+  version: 15.3.5
+  resolution: "@next/swc-win32-arm64-msvc@npm:15.3.5"
+  conditions: os=win32 & cpu=arm64
+  languageName: node
+  linkType: hard
+
+"@next/swc-win32-arm64-msvc@npm:15.5.18":
+  version: 15.5.18
+  resolution: "@next/swc-win32-arm64-msvc@npm:15.5.18"
+  conditions: os=win32 & cpu=arm64
+  languageName: node
+  linkType: hard
+
+"@next/swc-win32-x64-msvc@npm:15.3.5":
+  version: 15.3.5
+  resolution: "@next/swc-win32-x64-msvc@npm:15.3.5"
+  conditions: os=win32 & cpu=x64
+  languageName: node
+  linkType: hard
+
+"@next/swc-win32-x64-msvc@npm:15.5.18":
+  version: 15.5.18
+  resolution: "@next/swc-win32-x64-msvc@npm:15.5.18"
+  conditions: os=win32 & cpu=x64
+  languageName: node
+  linkType: hard
+
+"@next/third-parties@npm:15.5.18":
+  version: 15.5.18
+  resolution: "@next/third-parties@npm:15.5.18"
+  dependencies:
+    third-party-capital: 1.0.20
+  peerDependencies:
+    next: ^13.0.0 || ^14.0.0 || ^15.0.0
+    react: ^18.2.0 || 19.0.0-rc-de68d2f4-20241204 || ^19.0.0
+  checksum: d0d26ae5ad16db19a1b822cfbe3ed53f984db0ce2c394c3a64a77df7bf7cc182fa311208cc2fe2806f5dc71c21b8a0191b6d45a24d33eadebc92ea0ccdf724a0
+  languageName: node
+  linkType: hard
+
+"@nicolo-ribaudo/eslint-scope-5-internals@npm:5.1.1-v1":
+  version: 5.1.1-v1
+  resolution: "@nicolo-ribaudo/eslint-scope-5-internals@npm:5.1.1-v1"
+  dependencies:
+    eslint-scope: 5.1.1
+  checksum: 75dda3e623b8ad7369ca22552d6beee337a814b2d0e8a32d23edd13fcb65c8082b32c5d86e436f3860dd7ade30d91d5db55d4ef9a08fb5a976c718ecc0d88a74
+  languageName: node
+  linkType: hard
+
+"@noble/ciphers@npm:^1.3.0":
+  version: 1.3.0
+  resolution: "@noble/ciphers@npm:1.3.0"
+  checksum: 3ba6da645ce45e2f35e3b2e5c87ceba86b21dfa62b9466ede9edfb397f8116dae284f06652c0cd81d99445a2262b606632e868103d54ecc99fd946ae1af8cd37
+  languageName: node
+  linkType: hard
+
+"@noble/curves@npm:^1.9.7":
+  version: 1.9.7
+  resolution: "@noble/curves@npm:1.9.7"
+  dependencies:
+    "@noble/hashes": 1.8.0
+  checksum: 150014751ebe8ca06a8654ca2525108452ea9ee0be23430332769f06808cddabfe84f248b6dbf836916bc869c27c2092957eec62c7506d68a1ed0a624017c2a3
+  languageName: node
+  linkType: hard
+
+"@noble/hashes@npm:1.8.0, @noble/hashes@npm:^1.8.0":
+  version: 1.8.0
+  resolution: "@noble/hashes@npm:1.8.0"
+  checksum: 06a0b52c81a6fa7f04d67762e08b2c476a00285858150caeaaff4037356dd5e119f45b2a530f638b77a5eeca013168ec1b655db41bae3236cb2e9d511484fc77
+  languageName: node
+  linkType: hard
+
+"@nodable/entities@npm:2.1.0, @nodable/entities@npm:^2.1.0":
+  version: 2.1.0
+  resolution: "@nodable/entities@npm:2.1.0"
+  checksum: 5a4cba2b61a5b6c726328b18b1de6d033cae4a658a118644bf31e0bcbda126ea7b69385043dc556cf1ed859b9ca220e82b81b5e5c48ef1b519fb8ec104575dee
+  languageName: node
+  linkType: hard
+
+"@node-minify/core@npm:^8.0.6":
+  version: 8.0.6
+  resolution: "@node-minify/core@npm:8.0.6"
+  dependencies:
+    "@node-minify/utils": 8.0.6
+    glob: 9.3.5
+    mkdirp: 1.0.4
+  checksum: 1098aac1f72071a02ce1d1847e60e06b8a25015203f6a8e4b64e067ae8e54e2edd4df81a71edc5c9ef334035ca48e55c0f7d9311d28dfe8d89cdc9d83e70d866
+  languageName: node
+  linkType: hard
+
+"@node-minify/terser@npm:^8.0.6":
+  version: 8.0.6
+  resolution: "@node-minify/terser@npm:8.0.6"
+  dependencies:
+    "@node-minify/utils": 8.0.6
+    terser: 5.16.9
+  checksum: f763e1a10b0a0181fae204111164bf575e1aadf8ebc5b48a7bea539f44a0a37985b713513d0c93bfd3fbbccb8cefc95f22dd8c9371451afad34153a052a6a53e
+  languageName: node
+  linkType: hard
+
+"@node-minify/utils@npm:8.0.6":
+  version: 8.0.6
+  resolution: "@node-minify/utils@npm:8.0.6"
+  dependencies:
+    gzip-size: 6.0.0
+  checksum: 76e75e2da6273a816241d0816c824c4df7410518b00a6859d271e7fb0a2b1b298559d458708dc281866749261ea30a4a8a5fbe120c6fee1fed460a28527d1b19
+  languageName: node
+  linkType: hard
+
+"@nodelib/fs.scandir@npm:2.1.5":
+  version: 2.1.5
+  resolution: "@nodelib/fs.scandir@npm:2.1.5"
+  dependencies:
+    "@nodelib/fs.stat": 2.0.5
+    run-parallel: ^1.1.9
+  checksum: 732c3b6d1b1e967440e65f284bd06e5821fedf10a1bea9ed2bb75956ea1f30e08c44d3def9d6a230666574edbaf136f8cfd319c14fd1f87c66e6a44449afb2eb
+  languageName: node
+  linkType: hard
+
+"@nodelib/fs.stat@npm:2.0.5, @nodelib/fs.stat@npm:^2.0.2":
+  version: 2.0.5
+  resolution: "@nodelib/fs.stat@npm:2.0.5"
+  checksum: 88dafe5e3e29a388b07264680dc996c17f4bda48d163a9d4f5c1112979f0ce8ec72aa7116122c350b4e7976bc5566dc3ddb579be1ceaacc727872eb4ed93926d
+  languageName: node
+  linkType: hard
+
+"@nodelib/fs.walk@npm:^1.2.3":
+  version: 1.2.8
+  resolution: "@nodelib/fs.walk@npm:1.2.8"
+  dependencies:
+    "@nodelib/fs.scandir": 2.1.5
+    fastq: ^1.6.0
+  checksum: db9de047c3bb9b51f9335a7bb46f4fcfb6829fb628318c12115fbaf7d369bfce71c15b103d1fc3b464812d936220ee9bc1c8f762d032c9f6be9acc99249095b1
+  languageName: node
+  linkType: hard
+
+"@npmcli/agent@npm:^2.0.0":
+  version: 2.2.1
+  resolution: "@npmcli/agent@npm:2.2.1"
+  dependencies:
+    agent-base: ^7.1.0
+    http-proxy-agent: ^7.0.0
+    https-proxy-agent: ^7.0.1
+    lru-cache: ^10.0.1
+    socks-proxy-agent: ^8.0.1
+  checksum: 38ee5cbe8f3cde13be916e717bfc54fd1a7605c07af056369ff894e244c221e0b56b08ca5213457477f9bc15bca9e729d51a4788829b5c3cf296b3c996147f76
+  languageName: node
+  linkType: hard
+
+"@npmcli/fs@npm:^3.1.0":
+  version: 3.1.0
+  resolution: "@npmcli/fs@npm:3.1.0"
+  dependencies:
+    semver: ^7.3.5
+  checksum: 162b4a0b8705cd6f5c2470b851d1dc6cd228c86d2170e1769d738c1fbb69a87160901411c3c035331e9e99db72f1f1099a8b734bf1637cc32b9a5be1660e4e1e
+  languageName: node
+  linkType: hard
+
+"@opennextjs/aws@npm:4.0.2":
+  version: 4.0.2
+  resolution: "@opennextjs/aws@npm:4.0.2"
+  dependencies:
+    "@ast-grep/napi": ^0.40.5
+    "@aws-sdk/client-cloudfront": 3.984.0
+    "@aws-sdk/client-dynamodb": 3.984.0
+    "@aws-sdk/client-lambda": 3.984.0
+    "@aws-sdk/client-s3": 3.984.0
+    "@aws-sdk/client-sqs": 3.984.0
+    "@node-minify/core": ^8.0.6
+    "@node-minify/terser": ^8.0.6
+    "@tsconfig/node18": ^1.0.3
+    aws4fetch: ^1.0.20
+    chalk: ^5.6.2
+    cookie: ^1.0.2
+    esbuild: 0.25.4
+    express: ^5.1.0
+    path-to-regexp: ^6.3.0
+    urlpattern-polyfill: ^10.1.0
+    yaml: ^2.8.1
+  peerDependencies:
+    next: ">=15.5.18 <16 || >=16.2.6"
+  bin:
+    open-next: dist/index.js
+  checksum: d0b157429c42f6f2a82a92367af06cee58eae8752af645b9ae9ee5eabb173f02f5e324e0ee127894f002889d87cc878a17f019677974ee6c9a5fab8e77fe6fc3
+  languageName: node
+  linkType: hard
+
+"@opennextjs/cloudflare@npm:1.19.9, @opennextjs/cloudflare@npm:^1.19.9":
+  version: 1.19.9
+  resolution: "@opennextjs/cloudflare@npm:1.19.9"
+  dependencies:
+    "@ast-grep/napi": ^0.40.5
+    "@dotenvx/dotenvx": 1.31.0
+    "@opennextjs/aws": 4.0.2
+    ci-info: ^4.2.0
+    cloudflare: ^4.4.1
+    comment-json: ^4.5.1
+    enquirer: ^2.4.1
+    glob: ^12.0.0
+    ts-tqdm: ^0.8.6
+    yargs: ^18.0.0
+  peerDependencies:
+    next: ">=15.5.18 <16 || >=16.2.6"
+    wrangler: ^4.86.0
+  bin:
+    opennextjs-cloudflare: dist/cli/index.js
+  checksum: c560da7656483dbfdd26d272e07acf5bdb524dc71c53ba680119461ee8947897bf9828176b8c57ed1cc206abb4a90fc74eb3663659df64d1e474c19ab736698d
+  languageName: node
+  linkType: hard
+
+"@pkgjs/parseargs@npm:^0.11.0":
+  version: 0.11.0
+  resolution: "@pkgjs/parseargs@npm:0.11.0"
+  checksum: 5bd7576bb1b38a47a7fc7b51ac9f38748e772beebc56200450c4a817d712232b8f1d3ef70532c80840243c657d491cf6a6be1e3a214cff907645819fdc34aadd
+  languageName: node
+  linkType: hard
+
+"@pkgr/core@npm:^0.1.0":
+  version: 0.1.1
+  resolution: "@pkgr/core@npm:0.1.1"
+  checksum: 3f7536bc7f57320ab2cf96f8973664bef624710c403357429fbf680a5c3b4843c1dbd389bb43daa6b1f6f1f007bb082f5abcb76bb2b5dc9f421647743b71d3d8
+  languageName: node
+  linkType: hard
+
+"@polka/url@npm:^1.0.0-next.24":
+  version: 1.0.0-next.24
+  resolution: "@polka/url@npm:1.0.0-next.24"
+  checksum: 97d98fa911857158514457bedad8c36084c1f608302458f580ab300a25c3abf456d1d54fcf2ea7927464bee0858baf5e8e5b374b95c3375b9eb3784d81411ebd
+  languageName: node
+  linkType: hard
+
+"@poppinss/colors@npm:^4.1.5":
+  version: 4.1.6
+  resolution: "@poppinss/colors@npm:4.1.6"
+  dependencies:
+    kleur: ^4.1.5
+  checksum: 5c2cec5393e33294465873002f4c570adf36b5405b9f06551485162a6fb422d01de90ac20cb00800be6ab2f0d93da26e67302e95691dff2e0aa339cf93e5bf7f
+  languageName: node
+  linkType: hard
+
+"@poppinss/dumper@npm:^0.6.4":
+  version: 0.6.5
+  resolution: "@poppinss/dumper@npm:0.6.5"
+  dependencies:
+    "@poppinss/colors": ^4.1.5
+    "@sindresorhus/is": ^7.0.2
+    supports-color: ^10.0.0
+  checksum: 7a0916fe4ce543cac1e61f09218e5c88b903ad0d853301b790686c772b7f5c595a04beccbf13172e0c77dc64b132b27ad438b888816fd7f6128c816290f9dc1f
+  languageName: node
+  linkType: hard
+
+"@poppinss/exception@npm:^1.2.2":
+  version: 1.2.3
+  resolution: "@poppinss/exception@npm:1.2.3"
+  checksum: 44e48400c9f2d33a4904bee99321b89239774bb9210049f1c55864725fd524ff55bc78a5a94a13d5edea93b84e13023c229c88ebba8c2dc717fb4b2205e42ac7
+  languageName: node
+  linkType: hard
+
+"@posthog/core@npm:1.25.0":
+  version: 1.25.0
+  resolution: "@posthog/core@npm:1.25.0"
+  checksum: 6b94306fa07f54d60584218cf0a0ea3cb5cc288aff52e603016686801eec1288129e1d115e1d77b17d345835a4b3b7272e547b7604a44fd281f911479c633b72
+  languageName: node
+  linkType: hard
+
+"@posthog/core@npm:1.6.0":
+  version: 1.6.0
+  resolution: "@posthog/core@npm:1.6.0"
+  dependencies:
+    cross-spawn: ^7.0.6
+  checksum: 28aa907bb21b18587bc5f47c44349ebc834b37d9a4cedb1a18d7b673d4d7cdad2120dda80deceaee707b2f52333e9a08a8e591e1fc4066521ce05e820b76309f
+  languageName: node
+  linkType: hard
+
+"@radix-ui/number@npm:1.1.0":
+  version: 1.1.0
+  resolution: "@radix-ui/number@npm:1.1.0"
+  checksum: a48e34d5ff1484de1b7cf5d7317fefc831d49e96a2229f300fd37b657bd8cfb59c922830c00ec02838ab21de3b299a523474592e4f30882153412ed47edce6a4
+  languageName: node
+  linkType: hard
+
+"@radix-ui/primitive@npm:1.1.1":
+  version: 1.1.1
+  resolution: "@radix-ui/primitive@npm:1.1.1"
+  checksum: 6457bd8d1aa4ecb948e5d2a2484fc570698b2ab472db6d915a8f1eec04823f80423efa60b5ba840f0693bec2ca380333cc5f3b52586b40f407d9f572f9261f8d
+  languageName: node
+  linkType: hard
+
+"@radix-ui/react-accessible-icon@npm:1.1.1":
+  version: 1.1.1
+  resolution: "@radix-ui/react-accessible-icon@npm:1.1.1"
+  dependencies:
+    "@radix-ui/react-visually-hidden": 1.1.1
+  peerDependencies:
+    "@types/react": "*"
+    "@types/react-dom": "*"
+    react: ^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc
+    react-dom: ^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc
+  peerDependenciesMeta:
+    "@types/react":
+      optional: true
+    "@types/react-dom":
+      optional: true
+  checksum: f5d75ec8d76c39a387736f045f7fb279399fc0322fd09843fcaa76d6e5fae5d38b2b2c2ee159fa05f7b67de32ad5953fc7b9d2d6e35255ba7eb45e4096e36b8e
+  languageName: node
+  linkType: hard
+
+"@radix-ui/react-accordion@npm:1.2.2":
+  version: 1.2.2
+  resolution: "@radix-ui/react-accordion@npm:1.2.2"
+  dependencies:
+    "@radix-ui/primitive": 1.1.1
+    "@radix-ui/react-collapsible": 1.1.2
+    "@radix-ui/react-collection": 1.1.1
+    "@radix-ui/react-compose-refs": 1.1.1
+    "@radix-ui/react-context": 1.1.1
+    "@radix-ui/react-direction": 1.1.0
+    "@radix-ui/react-id": 1.1.0
+    "@radix-ui/react-primitive": 2.0.1
+    "@radix-ui/react-use-controllable-state": 1.1.0
+  peerDependencies:
+    "@types/react": "*"
+    "@types/react-dom": "*"
+    react: ^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc
+    react-dom: ^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc
+  peerDependenciesMeta:
+    "@types/react":
+      optional: true
+    "@types/react-dom":
+      optional: true
+  checksum: 2279c24de3296714ad14e0b83e7ea55f1b0d1585650b48ddb9295a44e6f0ab4e860526e9263c8f18cbdfa702648644d1bfa50f18c22e6f9de303b4b19ebef63a
+  languageName: node
+  linkType: hard
+
+"@radix-ui/react-alert-dialog@npm:1.1.5":
+  version: 1.1.5
+  resolution: "@radix-ui/react-alert-dialog@npm:1.1.5"
+  dependencies:
+    "@radix-ui/primitive": 1.1.1
+    "@radix-ui/react-compose-refs": 1.1.1
+    "@radix-ui/react-context": 1.1.1
+    "@radix-ui/react-dialog": 1.1.5
+    "@radix-ui/react-primitive": 2.0.1
+    "@radix-ui/react-slot": 1.1.1
+  peerDependencies:
+    "@types/react": "*"
+    "@types/react-dom": "*"
+    react: ^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc
+    react-dom: ^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc
+  peerDependenciesMeta:
+    "@types/react":
+      optional: true
+    "@types/react-dom":
+      optional: true
+  checksum: 5af5d2aad24bce15119e9485e02d7dd735ff78e43a979c1242f17160de8483cb429539dbc24b5a55bad42fd0b88b112e613915cb0622271c4a905c462b45ba60
+  languageName: node
+  linkType: hard
+
+"@radix-ui/react-arrow@npm:1.1.1":
+  version: 1.1.1
+  resolution: "@radix-ui/react-arrow@npm:1.1.1"
+  dependencies:
+    "@radix-ui/react-primitive": 2.0.1
+  peerDependencies:
+    "@types/react": "*"
+    "@types/react-dom": "*"
+    react: ^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc
+    react-dom: ^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc
+  peerDependenciesMeta:
+    "@types/react":
+      optional: true
+    "@types/react-dom":
+      optional: true
+  checksum: 714c8420ee4497775a1119ceba1391a9e4fed07185ba903ade571251400fd25cedb7bebf2292ce778e74956dfa079078b2afbb67d12001c6ea5080997bcf3612
+  languageName: node
+  linkType: hard
+
+"@radix-ui/react-aspect-ratio@npm:1.1.1":
+  version: 1.1.1
+  resolution: "@radix-ui/react-aspect-ratio@npm:1.1.1"
+  dependencies:
+    "@radix-ui/react-primitive": 2.0.1
+  peerDependencies:
+    "@types/react": "*"
+    "@types/react-dom": "*"
+    react: ^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc
+    react-dom: ^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc
+  peerDependenciesMeta:
+    "@types/react":
+      optional: true
+    "@types/react-dom":
+      optional: true
+  checksum: e99ceebb32a743fd99bdae54480213de20580a194ebdf1ca5ca2046cecc964dec8f05d29cad00740f97a790bfa05d2374dd34e6abecbb98fd5cc90937407a25f
+  languageName: node
+  linkType: hard
+
+"@radix-ui/react-avatar@npm:1.1.2":
+  version: 1.1.2
+  resolution: "@radix-ui/react-avatar@npm:1.1.2"
+  dependencies:
+    "@radix-ui/react-context": 1.1.1
+    "@radix-ui/react-primitive": 2.0.1
+    "@radix-ui/react-use-callback-ref": 1.1.0
+    "@radix-ui/react-use-layout-effect": 1.1.0
+  peerDependencies:
+    "@types/react": "*"
+    "@types/react-dom": "*"
+    react: ^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc
+    react-dom: ^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc
+  peerDependenciesMeta:
+    "@types/react":
+      optional: true
+    "@types/react-dom":
+      optional: true
+  checksum: 84a55872452e2ad07ae418d97231b4de547b176b8731541eb01f360ca1f306ae9fd2bfb6ec59ea47d90e16970db101476c3cb9c3282e4d444bf1c9d734d9c729
+  languageName: node
+  linkType: hard
+
+"@radix-ui/react-checkbox@npm:1.1.3":
+  version: 1.1.3
+  resolution: "@radix-ui/react-checkbox@npm:1.1.3"
+  dependencies:
+    "@radix-ui/primitive": 1.1.1
+    "@radix-ui/react-compose-refs": 1.1.1
+    "@radix-ui/react-context": 1.1.1
+    "@radix-ui/react-presence": 1.1.2
+    "@radix-ui/react-primitive": 2.0.1
+    "@radix-ui/react-use-controllable-state": 1.1.0
+    "@radix-ui/react-use-previous": 1.1.0
+    "@radix-ui/react-use-size": 1.1.0
+  peerDependencies:
+    "@types/react": "*"
+    "@types/react-dom": "*"
+    react: ^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc
+    react-dom: ^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc
+  peerDependenciesMeta:
+    "@types/react":
+      optional: true
+    "@types/react-dom":
+      optional: true
+  checksum: 88a28be73b849f158a47e8ee9432dede92932fcda678ecd971de131efb805aff29e33f382afdc722ca3f54f7a3d262125814ee812d5e73cc85e61bca62963bb7
+  languageName: node
+  linkType: hard
+
+"@radix-ui/react-collapsible@npm:1.1.2":
+  version: 1.1.2
+  resolution: "@radix-ui/react-collapsible@npm:1.1.2"
+  dependencies:
+    "@radix-ui/primitive": 1.1.1
+    "@radix-ui/react-compose-refs": 1.1.1
+    "@radix-ui/react-context": 1.1.1
+    "@radix-ui/react-id": 1.1.0
+    "@radix-ui/react-presence": 1.1.2
+    "@radix-ui/react-primitive": 2.0.1
+    "@radix-ui/react-use-controllable-state": 1.1.0
+    "@radix-ui/react-use-layout-effect": 1.1.0
+  peerDependencies:
+    "@types/react": "*"
+    "@types/react-dom": "*"
+    react: ^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc
+    react-dom: ^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc
+  peerDependenciesMeta:
+    "@types/react":
+      optional: true
+    "@types/react-dom":
+      optional: true
+  checksum: 8a725539c0c259ea53a0e35d4ddd3acca42cab5113fd537758450ad1e76f0b757423f18aca29364f963bef4f0624d57feb32bf9d12a3ea6b2c084b523ba65205
+  languageName: node
+  linkType: hard
+
+"@radix-ui/react-collection@npm:1.1.1":
+  version: 1.1.1
+  resolution: "@radix-ui/react-collection@npm:1.1.1"
+  dependencies:
+    "@radix-ui/react-compose-refs": 1.1.1
+    "@radix-ui/react-context": 1.1.1
+    "@radix-ui/react-primitive": 2.0.1
+    "@radix-ui/react-slot": 1.1.1
+  peerDependencies:
+    "@types/react": "*"
+    "@types/react-dom": "*"
+    react: ^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc
+    react-dom: ^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc
+  peerDependenciesMeta:
+    "@types/react":
+      optional: true
+    "@types/react-dom":
+      optional: true
+  checksum: f01bba02e11944fa98f588a0c8dc7657228c9e7dd32ef66acdec6a540385c1e9471ef9e7dfa6184b524fdf923cf5a08892ffda3fe6d60cee34c690d9914373ce
+  languageName: node
+  linkType: hard
+
+"@radix-ui/react-compose-refs@npm:1.1.1":
+  version: 1.1.1
+  resolution: "@radix-ui/react-compose-refs@npm:1.1.1"
+  peerDependencies:
+    "@types/react": "*"
+    react: ^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc
+  peerDependenciesMeta:
+    "@types/react":
+      optional: true
+  checksum: 3e84580024e66e3cc5b9ae79355e787815c1d2a3c7d46e7f47900a29c33751ca24cf4ac8903314957ab1f7788aebe1687e2258641c188cf94653f7ddf8f70627
+  languageName: node
+  linkType: hard
+
+"@radix-ui/react-context-menu@npm:2.2.5":
+  version: 2.2.5
+  resolution: "@radix-ui/react-context-menu@npm:2.2.5"
+  dependencies:
+    "@radix-ui/primitive": 1.1.1
+    "@radix-ui/react-context": 1.1.1
+    "@radix-ui/react-menu": 2.1.5
+    "@radix-ui/react-primitive": 2.0.1
+    "@radix-ui/react-use-callback-ref": 1.1.0
+    "@radix-ui/react-use-controllable-state": 1.1.0
+  peerDependencies:
+    "@types/react": "*"
+    "@types/react-dom": "*"
+    react: ^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc
+    react-dom: ^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc
+  peerDependenciesMeta:
+    "@types/react":
+      optional: true
+    "@types/react-dom":
+      optional: true
+  checksum: 98ae3ce113fa1539b5af2bc8ea38844f209f7ec0203d25b5bd0b307f89e0b0d8f421384fcbcf81e60898ab9c5311dace0a2ceecb624978facce8b5977a6a79b6
+  languageName: node
+  linkType: hard
+
+"@radix-ui/react-context@npm:1.1.1":
+  version: 1.1.1
+  resolution: "@radix-ui/react-context@npm:1.1.1"
+  peerDependencies:
+    "@types/react": "*"
+    react: ^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc
+  peerDependenciesMeta:
+    "@types/react":
+      optional: true
+  checksum: fc4ace9d79d7954c715ade765e06c95d7e1b12a63a536bcbe842fb904f03f88fc5bd6e38d44bd23243d37a270b4c44380fedddaeeae2d274f0b898a20665aba2
+  languageName: node
+  linkType: hard
+
+"@radix-ui/react-dialog@npm:1.1.4":
+  version: 1.1.4
+  resolution: "@radix-ui/react-dialog@npm:1.1.4"
+  dependencies:
+    "@radix-ui/primitive": 1.1.1
+    "@radix-ui/react-compose-refs": 1.1.1
+    "@radix-ui/react-context": 1.1.1
+    "@radix-ui/react-dismissable-layer": 1.1.3
+    "@radix-ui/react-focus-guards": 1.1.1
+    "@radix-ui/react-focus-scope": 1.1.1
+    "@radix-ui/react-id": 1.1.0
+    "@radix-ui/react-portal": 1.1.3
+    "@radix-ui/react-presence": 1.1.2
+    "@radix-ui/react-primitive": 2.0.1
+    "@radix-ui/react-slot": 1.1.1
+    "@radix-ui/react-use-controllable-state": 1.1.0
+    aria-hidden: ^1.1.1
+    react-remove-scroll: ^2.6.1
+  peerDependencies:
+    "@types/react": "*"
+    "@types/react-dom": "*"
+    react: ^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc
+    react-dom: ^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc
+  peerDependenciesMeta:
+    "@types/react":
+      optional: true
+    "@types/react-dom":
+      optional: true
+  checksum: d0ac8d85869b0d5a51823eb66503e41bab543807aa8702a2f1b2d5f720b1a2e4e9d0d83ca744aae06c6942a8759a1cd12bfa9b715d492868548254784969f78d
+  languageName: node
+  linkType: hard
+
+"@radix-ui/react-dialog@npm:1.1.5":
+  version: 1.1.5
+  resolution: "@radix-ui/react-dialog@npm:1.1.5"
+  dependencies:
+    "@radix-ui/primitive": 1.1.1
+    "@radix-ui/react-compose-refs": 1.1.1
+    "@radix-ui/react-context": 1.1.1
+    "@radix-ui/react-dismissable-layer": 1.1.4
+    "@radix-ui/react-focus-guards": 1.1.1
+    "@radix-ui/react-focus-scope": 1.1.1
+    "@radix-ui/react-id": 1.1.0
+    "@radix-ui/react-portal": 1.1.3
+    "@radix-ui/react-presence": 1.1.2
+    "@radix-ui/react-primitive": 2.0.1
+    "@radix-ui/react-slot": 1.1.1
+    "@radix-ui/react-use-controllable-state": 1.1.0
+    aria-hidden: ^1.2.4
+    react-remove-scroll: ^2.6.2
+  peerDependencies:
+    "@types/react": "*"
+    "@types/react-dom": "*"
+    react: ^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc
+    react-dom: ^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc
+  peerDependenciesMeta:
+    "@types/react":
+      optional: true
+    "@types/react-dom":
+      optional: true
+  checksum: 486f1b6cb9de310ab03ec201701b79912eb38565175bbbd6b6399ff0d7ca5fd2ead7bb7f072a8d2acf07d0a53154e7292abee404ca9f9a26b826a649cee06a21
+  languageName: node
+  linkType: hard
+
+"@radix-ui/react-direction@npm:1.1.0":
+  version: 1.1.0
+  resolution: "@radix-ui/react-direction@npm:1.1.0"
+  peerDependencies:
+    "@types/react": "*"
+    react: ^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc
+  peerDependenciesMeta:
+    "@types/react":
+      optional: true
+  checksum: eb07d8cc3ae2388b824e0a11ae0e3b71fb0c49972b506e249cec9f27a5b7ef4305ee668c98b674833c92e842163549a83beb0a197dec1ec65774bdeeb61f932c
+  languageName: node
+  linkType: hard
+
+"@radix-ui/react-dismissable-layer@npm:1.1.3":
+  version: 1.1.3
+  resolution: "@radix-ui/react-dismissable-layer@npm:1.1.3"
+  dependencies:
+    "@radix-ui/primitive": 1.1.1
+    "@radix-ui/react-compose-refs": 1.1.1
+    "@radix-ui/react-primitive": 2.0.1
+    "@radix-ui/react-use-callback-ref": 1.1.0
+    "@radix-ui/react-use-escape-keydown": 1.1.0
+  peerDependencies:
+    "@types/react": "*"
+    "@types/react-dom": "*"
+    react: ^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc
+    react-dom: ^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc
+  peerDependenciesMeta:
+    "@types/react":
+      optional: true
+    "@types/react-dom":
+      optional: true
+  checksum: 1ab2ebddf3d450bf4efb1e846894824a0056d3fa3deec0858206bc7547857fe5fe37e42f0a34918072702ead6dedc388a5770c060b2596cd408e20db86c54253
+  languageName: node
+  linkType: hard
+
+"@radix-ui/react-dismissable-layer@npm:1.1.4":
+  version: 1.1.4
+  resolution: "@radix-ui/react-dismissable-layer@npm:1.1.4"
+  dependencies:
+    "@radix-ui/primitive": 1.1.1
+    "@radix-ui/react-compose-refs": 1.1.1
+    "@radix-ui/react-primitive": 2.0.1
+    "@radix-ui/react-use-callback-ref": 1.1.0
+    "@radix-ui/react-use-escape-keydown": 1.1.0
+  peerDependencies:
+    "@types/react": "*"
+    "@types/react-dom": "*"
+    react: ^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc
+    react-dom: ^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc
+  peerDependenciesMeta:
+    "@types/react":
+      optional: true
+    "@types/react-dom":
+      optional: true
+  checksum: 8657bf3e7e9e6ffeec9b23fbea4ae4e35f0a8fb474b5562636c721be82a95df30da32b9957dfc3826caa0b2e0b79a1333e7589d64de44b3ea02a667c83622efb
+  languageName: node
+  linkType: hard
+
+"@radix-ui/react-dropdown-menu@npm:2.1.5":
+  version: 2.1.5
+  resolution: "@radix-ui/react-dropdown-menu@npm:2.1.5"
+  dependencies:
+    "@radix-ui/primitive": 1.1.1
+    "@radix-ui/react-compose-refs": 1.1.1
+    "@radix-ui/react-context": 1.1.1
+    "@radix-ui/react-id": 1.1.0
+    "@radix-ui/react-menu": 2.1.5
+    "@radix-ui/react-primitive": 2.0.1
+    "@radix-ui/react-use-controllable-state": 1.1.0
+  peerDependencies:
+    "@types/react": "*"
+    "@types/react-dom": "*"
+    react: ^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc
+    react-dom: ^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc
+  peerDependenciesMeta:
+    "@types/react":
+      optional: true
+    "@types/react-dom":
+      optional: true
+  checksum: 1b32444758058f97d8222029c66fb277405811b6ed42d02122b9d12953d484a04602778ccfcae29522216fc64c0a9d0b007c40074049928b9b034454cae548d6
+  languageName: node
+  linkType: hard
+
+"@radix-ui/react-focus-guards@npm:1.1.1":
+  version: 1.1.1
+  resolution: "@radix-ui/react-focus-guards@npm:1.1.1"
+  peerDependencies:
+    "@types/react": "*"
+    react: ^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc
+  peerDependenciesMeta:
+    "@types/react":
+      optional: true
+  checksum: 2e99750ca593083a530542a185d656b45b100752353a7a193a67566e3c256414a76fa9171d152f8c0167b8d6c1fdf62b2e07750d7af2974bf8ef39eb204aa537
+  languageName: node
+  linkType: hard
+
+"@radix-ui/react-focus-scope@npm:1.1.1":
+  version: 1.1.1
+  resolution: "@radix-ui/react-focus-scope@npm:1.1.1"
+  dependencies:
+    "@radix-ui/react-compose-refs": 1.1.1
+    "@radix-ui/react-primitive": 2.0.1
+    "@radix-ui/react-use-callback-ref": 1.1.0
+  peerDependencies:
+    "@types/react": "*"
+    "@types/react-dom": "*"
+    react: ^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc
+    react-dom: ^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc
+  peerDependenciesMeta:
+    "@types/react":
+      optional: true
+    "@types/react-dom":
+      optional: true
+  checksum: a430264a32e358c05dfa1c3abcf6c3d0481cbcbb2547532324c6d69fa7f9e3ed77b5eb2dd64d42808ec62c8d69abb573d6076907764af126d14ea18febf45d7b
+  languageName: node
+  linkType: hard
+
+"@radix-ui/react-form@npm:0.1.1":
+  version: 0.1.1
+  resolution: "@radix-ui/react-form@npm:0.1.1"
+  dependencies:
+    "@radix-ui/primitive": 1.1.1
+    "@radix-ui/react-compose-refs": 1.1.1
+    "@radix-ui/react-context": 1.1.1
+    "@radix-ui/react-id": 1.1.0
+    "@radix-ui/react-label": 2.1.1
+    "@radix-ui/react-primitive": 2.0.1
+  peerDependencies:
+    "@types/react": "*"
+    "@types/react-dom": "*"
+    react: ^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc
+    react-dom: ^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc
+  peerDependenciesMeta:
+    "@types/react":
+      optional: true
+    "@types/react-dom":
+      optional: true
+  checksum: 78c41d03abab2744fd4026c1b365b8977b00749b86085db5579eed3a57c91748b344d64014a4437204f3eecd334e8284b25f85b24192c9100178559bf3797d05
+  languageName: node
+  linkType: hard
+
+"@radix-ui/react-hover-card@npm:1.1.5":
+  version: 1.1.5
+  resolution: "@radix-ui/react-hover-card@npm:1.1.5"
+  dependencies:
+    "@radix-ui/primitive": 1.1.1
+    "@radix-ui/react-compose-refs": 1.1.1
+    "@radix-ui/react-context": 1.1.1
+    "@radix-ui/react-dismissable-layer": 1.1.4
+    "@radix-ui/react-popper": 1.2.1
+    "@radix-ui/react-portal": 1.1.3
+    "@radix-ui/react-presence": 1.1.2
+    "@radix-ui/react-primitive": 2.0.1
+    "@radix-ui/react-use-controllable-state": 1.1.0
+  peerDependencies:
+    "@types/react": "*"
+    "@types/react-dom": "*"
+    react: ^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc
+    react-dom: ^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc
+  peerDependenciesMeta:
+    "@types/react":
+      optional: true
+    "@types/react-dom":
+      optional: true
+  checksum: 69b434a44eef9f47224a0d27980e4ecc7922029bbbe4ae8868a54d23a8c3bcdd495cd82eb9e0872c3df095cd65015c59f05f66de7a38cd00025d5a6feb046b77
+  languageName: node
+  linkType: hard
+
+"@radix-ui/react-id@npm:1.1.0":
+  version: 1.1.0
+  resolution: "@radix-ui/react-id@npm:1.1.0"
+  dependencies:
+    "@radix-ui/react-use-layout-effect": 1.1.0
+  peerDependencies:
+    "@types/react": "*"
+    react: ^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc
+  peerDependenciesMeta:
+    "@types/react":
+      optional: true
+  checksum: acf13e29e51ee96336837fc0cfecc306328b20b0e0070f6f0f7aa7a621ded4a1ee5537cfad58456f64bae76caa7f8769231e88dc7dc106197347ee433c275a79
+  languageName: node
+  linkType: hard
+
+"@radix-ui/react-label@npm:2.1.1":
+  version: 2.1.1
+  resolution: "@radix-ui/react-label@npm:2.1.1"
+  dependencies:
+    "@radix-ui/react-primitive": 2.0.1
+  peerDependencies:
+    "@types/react": "*"
+    "@types/react-dom": "*"
+    react: ^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc
+    react-dom: ^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc
+  peerDependenciesMeta:
+    "@types/react":
+      optional: true
+    "@types/react-dom":
+      optional: true
+  checksum: 902628dc2c05610462a264feedc8c548d7ecad7f000efb9a4190e365ee2b7f75eccf98b43925fac6e1fa940c437abbce03ecc6868e06e0a197c779973ccc839d
+  languageName: node
+  linkType: hard
+
+"@radix-ui/react-menu@npm:2.1.5":
+  version: 2.1.5
+  resolution: "@radix-ui/react-menu@npm:2.1.5"
+  dependencies:
+    "@radix-ui/primitive": 1.1.1
+    "@radix-ui/react-collection": 1.1.1
+    "@radix-ui/react-compose-refs": 1.1.1
+    "@radix-ui/react-context": 1.1.1
+    "@radix-ui/react-direction": 1.1.0
+    "@radix-ui/react-dismissable-layer": 1.1.4
+    "@radix-ui/react-focus-guards": 1.1.1
+    "@radix-ui/react-focus-scope": 1.1.1
+    "@radix-ui/react-id": 1.1.0
+    "@radix-ui/react-popper": 1.2.1
+    "@radix-ui/react-portal": 1.1.3
+    "@radix-ui/react-presence": 1.1.2
+    "@radix-ui/react-primitive": 2.0.1
+    "@radix-ui/react-roving-focus": 1.1.1
+    "@radix-ui/react-slot": 1.1.1
+    "@radix-ui/react-use-callback-ref": 1.1.0
+    aria-hidden: ^1.2.4
+    react-remove-scroll: ^2.6.2
+  peerDependencies:
+    "@types/react": "*"
+    "@types/react-dom": "*"
+    react: ^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc
+    react-dom: ^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc
+  peerDependenciesMeta:
+    "@types/react":
+      optional: true
+    "@types/react-dom":
+      optional: true
+  checksum: 45a246efaecf2de16d748eaa515be089ab8f55f8e375887e3b7e4b89faf0555429cb934aa4dda1fe380a12b1c962dd8e32458e84465be5652e7be879c6889095
+  languageName: node
+  linkType: hard
+
+"@radix-ui/react-menubar@npm:1.1.5":
+  version: 1.1.5
+  resolution: "@radix-ui/react-menubar@npm:1.1.5"
+  dependencies:
+    "@radix-ui/primitive": 1.1.1
+    "@radix-ui/react-collection": 1.1.1
+    "@radix-ui/react-compose-refs": 1.1.1
+    "@radix-ui/react-context": 1.1.1
+    "@radix-ui/react-direction": 1.1.0
+    "@radix-ui/react-id": 1.1.0
+    "@radix-ui/react-menu": 2.1.5
+    "@radix-ui/react-primitive": 2.0.1
+    "@radix-ui/react-roving-focus": 1.1.1
+    "@radix-ui/react-use-controllable-state": 1.1.0
+  peerDependencies:
+    "@types/react": "*"
+    "@types/react-dom": "*"
+    react: ^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc
+    react-dom: ^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc
+  peerDependenciesMeta:
+    "@types/react":
+      optional: true
+    "@types/react-dom":
+      optional: true
+  checksum: 1f5d6f42189a0ac3608b85a6f5cae4ca278bcb792f11d6134bb060c80c69008b1b31f82fa32ca83595a3f0968fb898353428f574d2017f9a999c9d945b718237
+  languageName: node
+  linkType: hard
+
+"@radix-ui/react-navigation-menu@npm:1.2.4":
+  version: 1.2.4
+  resolution: "@radix-ui/react-navigation-menu@npm:1.2.4"
+  dependencies:
+    "@radix-ui/primitive": 1.1.1
+    "@radix-ui/react-collection": 1.1.1
+    "@radix-ui/react-compose-refs": 1.1.1
+    "@radix-ui/react-context": 1.1.1
+    "@radix-ui/react-direction": 1.1.0
+    "@radix-ui/react-dismissable-layer": 1.1.4
+    "@radix-ui/react-id": 1.1.0
+    "@radix-ui/react-presence": 1.1.2
+    "@radix-ui/react-primitive": 2.0.1
+    "@radix-ui/react-use-callback-ref": 1.1.0
+    "@radix-ui/react-use-controllable-state": 1.1.0
+    "@radix-ui/react-use-layout-effect": 1.1.0
+    "@radix-ui/react-use-previous": 1.1.0
+    "@radix-ui/react-visually-hidden": 1.1.1
+  peerDependencies:
+    "@types/react": "*"
+    "@types/react-dom": "*"
+    react: ^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc
+    react-dom: ^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc
+  peerDependenciesMeta:
+    "@types/react":
+      optional: true
+    "@types/react-dom":
+      optional: true
+  checksum: 7b32dc6fb7a685ca1ab1b948b739d1c7e71835e92307da6735bb6afd39f31dd7c8fdea30168ab3f860dea60f73b136ce8db2dbb9d120205d6ae6c1e146036b75
+  languageName: node
+  linkType: hard
+
+"@radix-ui/react-popover@npm:1.1.5":
+  version: 1.1.5
+  resolution: "@radix-ui/react-popover@npm:1.1.5"
+  dependencies:
+    "@radix-ui/primitive": 1.1.1
+    "@radix-ui/react-compose-refs": 1.1.1
+    "@radix-ui/react-context": 1.1.1
+    "@radix-ui/react-dismissable-layer": 1.1.4
+    "@radix-ui/react-focus-guards": 1.1.1
+    "@radix-ui/react-focus-scope": 1.1.1
+    "@radix-ui/react-id": 1.1.0
+    "@radix-ui/react-popper": 1.2.1
+    "@radix-ui/react-portal": 1.1.3
+    "@radix-ui/react-presence": 1.1.2
+    "@radix-ui/react-primitive": 2.0.1
+    "@radix-ui/react-slot": 1.1.1
+    "@radix-ui/react-use-controllable-state": 1.1.0
+    aria-hidden: ^1.2.4
+    react-remove-scroll: ^2.6.2
+  peerDependencies:
+    "@types/react": "*"
+    "@types/react-dom": "*"
+    react: ^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc
+    react-dom: ^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc
+  peerDependenciesMeta:
+    "@types/react":
+      optional: true
+    "@types/react-dom":
+      optional: true
+  checksum: 95265a40ed7055a34b9b4d54fc644d3ea9d9e4e532f7562b6eb92c9923a8ce2a5bec8945f1c611ff59a9af741a403ce5a2a7e26736629b54a1c325300d47aab9
+  languageName: node
+  linkType: hard
+
+"@radix-ui/react-popper@npm:1.2.1":
+  version: 1.2.1
+  resolution: "@radix-ui/react-popper@npm:1.2.1"
+  dependencies:
+    "@floating-ui/react-dom": ^2.0.0
+    "@radix-ui/react-arrow": 1.1.1
+    "@radix-ui/react-compose-refs": 1.1.1
+    "@radix-ui/react-context": 1.1.1
+    "@radix-ui/react-primitive": 2.0.1
+    "@radix-ui/react-use-callback-ref": 1.1.0
+    "@radix-ui/react-use-layout-effect": 1.1.0
+    "@radix-ui/react-use-rect": 1.1.0
+    "@radix-ui/react-use-size": 1.1.0
+    "@radix-ui/rect": 1.1.0
+  peerDependencies:
+    "@types/react": "*"
+    "@types/react-dom": "*"
+    react: ^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc
+    react-dom: ^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc
+  peerDependenciesMeta:
+    "@types/react":
+      optional: true
+    "@types/react-dom":
+      optional: true
+  checksum: 514468b51e66ff2da3400fa782f4b52f9bad60517e3047cccf56488aa17a3c3f62ff2650b0216be31345dc3be6035999c7160788c92e35c7f8d53ddde2fb92f1
+  languageName: node
+  linkType: hard
+
+"@radix-ui/react-portal@npm:1.1.3":
+  version: 1.1.3
+  resolution: "@radix-ui/react-portal@npm:1.1.3"
+  dependencies:
+    "@radix-ui/react-primitive": 2.0.1
+    "@radix-ui/react-use-layout-effect": 1.1.0
+  peerDependencies:
+    "@types/react": "*"
+    "@types/react-dom": "*"
+    react: ^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc
+    react-dom: ^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc
+  peerDependenciesMeta:
+    "@types/react":
+      optional: true
+    "@types/react-dom":
+      optional: true
+  checksum: b3cd1a81513e528d261599cffda8d7d6094a8598750eaa32bac0d64dbc9a3b4d4e1c10f5bdadf7051b5fd77033b759dbeb4838dae325b94bf8251804c61508c5
+  languageName: node
+  linkType: hard
+
+"@radix-ui/react-presence@npm:1.1.2":
+  version: 1.1.2
+  resolution: "@radix-ui/react-presence@npm:1.1.2"
+  dependencies:
+    "@radix-ui/react-compose-refs": 1.1.1
+    "@radix-ui/react-use-layout-effect": 1.1.0
+  peerDependencies:
+    "@types/react": "*"
+    "@types/react-dom": "*"
+    react: ^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc
+    react-dom: ^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc
+  peerDependenciesMeta:
+    "@types/react":
+      optional: true
+    "@types/react-dom":
+      optional: true
+  checksum: 0c6fa281368636308044df3be4c1f02733094b5e35ba04f26e610dd1c4315a245ffc758e0e176c444742a7a46f4328af1a9d8181e860175ec39338d06525a78d
+  languageName: node
+  linkType: hard
+
+"@radix-ui/react-primitive@npm:2.0.1":
+  version: 2.0.1
+  resolution: "@radix-ui/react-primitive@npm:2.0.1"
+  dependencies:
+    "@radix-ui/react-slot": 1.1.1
+  peerDependencies:
+    "@types/react": "*"
+    "@types/react-dom": "*"
+    react: ^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc
+    react-dom: ^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc
+  peerDependenciesMeta:
+    "@types/react":
+      optional: true
+    "@types/react-dom":
+      optional: true
+  checksum: 6a562bec14f8e9fbfe0012d6c2932b0e54518fed898fa0622300c463611e77a4ca28a969f0cd484efd6570c01c5665dd6151f736262317d01715bc4da1a7dea6
+  languageName: node
+  linkType: hard
+
+"@radix-ui/react-progress@npm:1.1.1":
+  version: 1.1.1
+  resolution: "@radix-ui/react-progress@npm:1.1.1"
+  dependencies:
+    "@radix-ui/react-context": 1.1.1
+    "@radix-ui/react-primitive": 2.0.1
+  peerDependencies:
+    "@types/react": "*"
+    "@types/react-dom": "*"
+    react: ^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc
+    react-dom: ^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc
+  peerDependenciesMeta:
+    "@types/react":
+      optional: true
+    "@types/react-dom":
+      optional: true
+  checksum: dcf4ab20ff3a19a4be5a6e2502c42cd2c2770c6356b86301a548f725d33b8054dafe411b3c0f2b0b9465b225a31e8eb9f6bcc338d1936fb89312b517e1e7f2ec
+  languageName: node
+  linkType: hard
+
+"@radix-ui/react-radio-group@npm:1.2.2":
+  version: 1.2.2
+  resolution: "@radix-ui/react-radio-group@npm:1.2.2"
+  dependencies:
+    "@radix-ui/primitive": 1.1.1
+    "@radix-ui/react-compose-refs": 1.1.1
+    "@radix-ui/react-context": 1.1.1
+    "@radix-ui/react-direction": 1.1.0
     "@radix-ui/react-presence": 1.1.2
     "@radix-ui/react-primitive": 2.0.1
     "@radix-ui/react-roving-focus": 1.1.1
+    "@radix-ui/react-use-controllable-state": 1.1.0
+    "@radix-ui/react-use-previous": 1.1.0
+    "@radix-ui/react-use-size": 1.1.0
+  peerDependencies:
+    "@types/react": "*"
+    "@types/react-dom": "*"
+    react: ^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc
+    react-dom: ^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc
+  peerDependenciesMeta:
+    "@types/react":
+      optional: true
+    "@types/react-dom":
+      optional: true
+  checksum: 450592e3a5aa1f9d53f21aefafb977e04b5a0c3a8a8080653f9d9c8117a381b4489bbb4fb4743bd52f043f6aff6e4b279926352c1dd9589fd541cb924533fc17
+  languageName: node
+  linkType: hard
+
+"@radix-ui/react-roving-focus@npm:1.1.1":
+  version: 1.1.1
+  resolution: "@radix-ui/react-roving-focus@npm:1.1.1"
+  dependencies:
+    "@radix-ui/primitive": 1.1.1
+    "@radix-ui/react-collection": 1.1.1
+    "@radix-ui/react-compose-refs": 1.1.1
+    "@radix-ui/react-context": 1.1.1
+    "@radix-ui/react-direction": 1.1.0
+    "@radix-ui/react-id": 1.1.0
+    "@radix-ui/react-primitive": 2.0.1
+    "@radix-ui/react-use-callback-ref": 1.1.0
+    "@radix-ui/react-use-controllable-state": 1.1.0
+  peerDependencies:
+    "@types/react": "*"
+    "@types/react-dom": "*"
+    react: ^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc
+    react-dom: ^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc
+  peerDependenciesMeta:
+    "@types/react":
+      optional: true
+    "@types/react-dom":
+      optional: true
+  checksum: ee41eb60b0c300ef3bb130f7ca6c7333148669f2a50b841027910158c06be215967880da932ac14b83d130a9ca5ffb33d6a1a0f067d5048f8db2c3884bbd9b85
+  languageName: node
+  linkType: hard
+
+"@radix-ui/react-scroll-area@npm:1.2.2":
+  version: 1.2.2
+  resolution: "@radix-ui/react-scroll-area@npm:1.2.2"
+  dependencies:
+    "@radix-ui/number": 1.1.0
+    "@radix-ui/primitive": 1.1.1
+    "@radix-ui/react-compose-refs": 1.1.1
+    "@radix-ui/react-context": 1.1.1
+    "@radix-ui/react-direction": 1.1.0
+    "@radix-ui/react-presence": 1.1.2
+    "@radix-ui/react-primitive": 2.0.1
+    "@radix-ui/react-use-callback-ref": 1.1.0
+    "@radix-ui/react-use-layout-effect": 1.1.0
+  peerDependencies:
+    "@types/react": "*"
+    "@types/react-dom": "*"
+    react: ^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc
+    react-dom: ^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc
+  peerDependenciesMeta:
+    "@types/react":
+      optional: true
+    "@types/react-dom":
+      optional: true
+  checksum: a959c199780d5ef931a4bc9323a009dff8207ccb21ea42131e259cd32fdea035ccddca7f161e3ac1eb93691644b39a6a274329637234d525c2543ceb299493fb
+  languageName: node
+  linkType: hard
+
+"@radix-ui/react-select@npm:2.1.5":
+  version: 2.1.5
+  resolution: "@radix-ui/react-select@npm:2.1.5"
+  dependencies:
+    "@radix-ui/number": 1.1.0
+    "@radix-ui/primitive": 1.1.1
+    "@radix-ui/react-collection": 1.1.1
+    "@radix-ui/react-compose-refs": 1.1.1
+    "@radix-ui/react-context": 1.1.1
+    "@radix-ui/react-direction": 1.1.0
+    "@radix-ui/react-dismissable-layer": 1.1.4
+    "@radix-ui/react-focus-guards": 1.1.1
+    "@radix-ui/react-focus-scope": 1.1.1
+    "@radix-ui/react-id": 1.1.0
+    "@radix-ui/react-popper": 1.2.1
+    "@radix-ui/react-portal": 1.1.3
+    "@radix-ui/react-primitive": 2.0.1
     "@radix-ui/react-slot": 1.1.1
     "@radix-ui/react-use-callback-ref": 1.1.0
+    "@radix-ui/react-use-controllable-state": 1.1.0
+    "@radix-ui/react-use-layout-effect": 1.1.0
+    "@radix-ui/react-use-previous": 1.1.0
+    "@radix-ui/react-visually-hidden": 1.1.1
     aria-hidden: ^1.2.4
     react-remove-scroll: ^2.6.2
   peerDependencies:
@@ -2781,24 +4731,44 @@ __metadata:
       optional: true
     "@types/react-dom":
       optional: true
-  checksum: 45a246efaecf2de16d748eaa515be089ab8f55f8e375887e3b7e4b89faf0555429cb934aa4dda1fe380a12b1c962dd8e32458e84465be5652e7be879c6889095
+  checksum: adbaffbe7f7d4662adb10c5af8da279d380f310647a0412a6eb733426881239ac4bca78479b11211dca1ecb3dd1f7eeb6d042d6d8a107c25bc2440606f093758
   languageName: node
   linkType: hard
 
-"@radix-ui/react-menubar@npm:1.1.5":
-  version: 1.1.5
-  resolution: "@radix-ui/react-menubar@npm:1.1.5"
+"@radix-ui/react-separator@npm:1.1.1":
+  version: 1.1.1
+  resolution: "@radix-ui/react-separator@npm:1.1.1"
+  dependencies:
+    "@radix-ui/react-primitive": 2.0.1
+  peerDependencies:
+    "@types/react": "*"
+    "@types/react-dom": "*"
+    react: ^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc
+    react-dom: ^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc
+  peerDependenciesMeta:
+    "@types/react":
+      optional: true
+    "@types/react-dom":
+      optional: true
+  checksum: 4b0dc0db4e31d4d71a2a688581707dedb19a9e13378e86dbbab467970c5b271afc189ebba0e340495e15ce0fbbc42445d0be43ff8104de5f5c96cf3b822e801d
+  languageName: node
+  linkType: hard
+
+"@radix-ui/react-slider@npm:1.2.2":
+  version: 1.2.2
+  resolution: "@radix-ui/react-slider@npm:1.2.2"
   dependencies:
+    "@radix-ui/number": 1.1.0
     "@radix-ui/primitive": 1.1.1
     "@radix-ui/react-collection": 1.1.1
     "@radix-ui/react-compose-refs": 1.1.1
     "@radix-ui/react-context": 1.1.1
     "@radix-ui/react-direction": 1.1.0
-    "@radix-ui/react-id": 1.1.0
-    "@radix-ui/react-menu": 2.1.5
     "@radix-ui/react-primitive": 2.0.1
-    "@radix-ui/react-roving-focus": 1.1.1
     "@radix-ui/react-use-controllable-state": 1.1.0
+    "@radix-ui/react-use-layout-effect": 1.1.0
+    "@radix-ui/react-use-previous": 1.1.0
+    "@radix-ui/react-use-size": 1.1.0
   peerDependencies:
     "@types/react": "*"
     "@types/react-dom": "*"
@@ -2809,28 +4779,36 @@ __metadata:
       optional: true
     "@types/react-dom":
       optional: true
-  checksum: 1f5d6f42189a0ac3608b85a6f5cae4ca278bcb792f11d6134bb060c80c69008b1b31f82fa32ca83595a3f0968fb898353428f574d2017f9a999c9d945b718237
+  checksum: cd57454a20739523cba8762a6cc0a5beeaa1393e7aed5cb00ce1fdaa5b821c710865d2e746a639feac69025a4e02ff0b211cf515b02bfcf37dc9b633aa63ed70
   languageName: node
   linkType: hard
 
-"@radix-ui/react-navigation-menu@npm:1.2.4":
-  version: 1.2.4
-  resolution: "@radix-ui/react-navigation-menu@npm:1.2.4"
+"@radix-ui/react-slot@npm:1.1.1":
+  version: 1.1.1
+  resolution: "@radix-ui/react-slot@npm:1.1.1"
+  dependencies:
+    "@radix-ui/react-compose-refs": 1.1.1
+  peerDependencies:
+    "@types/react": "*"
+    react: ^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc
+  peerDependenciesMeta:
+    "@types/react":
+      optional: true
+  checksum: f3cc71c16529c67a8407a89e0ac13a868cafa0cd05ca185b464db609aa5996a3f00588695518e420bd47ffdb4cc2f76c14cc12ea5a38fc2ca3578a30d2ca58b9
+  languageName: node
+  linkType: hard
+
+"@radix-ui/react-switch@npm:1.1.2":
+  version: 1.1.2
+  resolution: "@radix-ui/react-switch@npm:1.1.2"
   dependencies:
     "@radix-ui/primitive": 1.1.1
-    "@radix-ui/react-collection": 1.1.1
     "@radix-ui/react-compose-refs": 1.1.1
     "@radix-ui/react-context": 1.1.1
-    "@radix-ui/react-direction": 1.1.0
-    "@radix-ui/react-dismissable-layer": 1.1.4
-    "@radix-ui/react-id": 1.1.0
-    "@radix-ui/react-presence": 1.1.2
     "@radix-ui/react-primitive": 2.0.1
-    "@radix-ui/react-use-callback-ref": 1.1.0
     "@radix-ui/react-use-controllable-state": 1.1.0
-    "@radix-ui/react-use-layout-effect": 1.1.0
     "@radix-ui/react-use-previous": 1.1.0
-    "@radix-ui/react-visually-hidden": 1.1.1
+    "@radix-ui/react-use-size": 1.1.0
   peerDependencies:
     "@types/react": "*"
     "@types/react-dom": "*"
@@ -2841,29 +4819,22 @@ __metadata:
       optional: true
     "@types/react-dom":
       optional: true
-  checksum: 7b32dc6fb7a685ca1ab1b948b739d1c7e71835e92307da6735bb6afd39f31dd7c8fdea30168ab3f860dea60f73b136ce8db2dbb9d120205d6ae6c1e146036b75
+  checksum: 5ae76c25ab6e9b401a562818b9507acb5994d4b8db828a21fde3d415fde8196c86f7f4025e5bccf72991a4e6801f008e05de02216be20e1f36b6f6411cd27939
   languageName: node
   linkType: hard
 
-"@radix-ui/react-popover@npm:1.1.5":
-  version: 1.1.5
-  resolution: "@radix-ui/react-popover@npm:1.1.5"
+"@radix-ui/react-tabs@npm:1.1.2":
+  version: 1.1.2
+  resolution: "@radix-ui/react-tabs@npm:1.1.2"
   dependencies:
     "@radix-ui/primitive": 1.1.1
-    "@radix-ui/react-compose-refs": 1.1.1
     "@radix-ui/react-context": 1.1.1
-    "@radix-ui/react-dismissable-layer": 1.1.4
-    "@radix-ui/react-focus-guards": 1.1.1
-    "@radix-ui/react-focus-scope": 1.1.1
+    "@radix-ui/react-direction": 1.1.0
     "@radix-ui/react-id": 1.1.0
-    "@radix-ui/react-popper": 1.2.1
-    "@radix-ui/react-portal": 1.1.3
     "@radix-ui/react-presence": 1.1.2
     "@radix-ui/react-primitive": 2.0.1
-    "@radix-ui/react-slot": 1.1.1
+    "@radix-ui/react-roving-focus": 1.1.1
     "@radix-ui/react-use-controllable-state": 1.1.0
-    aria-hidden: ^1.2.4
-    react-remove-scroll: ^2.6.2
   peerDependencies:
     "@types/react": "*"
     "@types/react-dom": "*"
@@ -2874,24 +4845,26 @@ __metadata:
       optional: true
     "@types/react-dom":
       optional: true
-  checksum: 95265a40ed7055a34b9b4d54fc644d3ea9d9e4e532f7562b6eb92c9923a8ce2a5bec8945f1c611ff59a9af741a403ce5a2a7e26736629b54a1c325300d47aab9
+  checksum: 035db9d439d41e60218ea64c8c4cf4a8496eb885aa1caa3cace545a941766dbab7faa1a670ffb49389c55345028203927b424b8cbaa8f2f0cd0cda9974c2fcc6
   languageName: node
   linkType: hard
 
-"@radix-ui/react-popper@npm:1.2.1":
-  version: 1.2.1
-  resolution: "@radix-ui/react-popper@npm:1.2.1"
+"@radix-ui/react-toast@npm:1.2.5":
+  version: 1.2.5
+  resolution: "@radix-ui/react-toast@npm:1.2.5"
   dependencies:
-    "@floating-ui/react-dom": ^2.0.0
-    "@radix-ui/react-arrow": 1.1.1
+    "@radix-ui/primitive": 1.1.1
+    "@radix-ui/react-collection": 1.1.1
     "@radix-ui/react-compose-refs": 1.1.1
     "@radix-ui/react-context": 1.1.1
+    "@radix-ui/react-dismissable-layer": 1.1.4
+    "@radix-ui/react-portal": 1.1.3
+    "@radix-ui/react-presence": 1.1.2
     "@radix-ui/react-primitive": 2.0.1
     "@radix-ui/react-use-callback-ref": 1.1.0
+    "@radix-ui/react-use-controllable-state": 1.1.0
     "@radix-ui/react-use-layout-effect": 1.1.0
-    "@radix-ui/react-use-rect": 1.1.0
-    "@radix-ui/react-use-size": 1.1.0
-    "@radix-ui/rect": 1.1.0
+    "@radix-ui/react-visually-hidden": 1.1.1
   peerDependencies:
     "@types/react": "*"
     "@types/react-dom": "*"
@@ -2902,16 +4875,21 @@ __metadata:
       optional: true
     "@types/react-dom":
       optional: true
-  checksum: 514468b51e66ff2da3400fa782f4b52f9bad60517e3047cccf56488aa17a3c3f62ff2650b0216be31345dc3be6035999c7160788c92e35c7f8d53ddde2fb92f1
+  checksum: 8f3f03355fdbf49d6705205357f17dd4f0f5ad874dd753da09f46bfb2145ac63780d4445dd1b1f70337185b4f34b43e33e82c4be988eee3fccae62cfc26b2d00
   languageName: node
   linkType: hard
 
-"@radix-ui/react-portal@npm:1.1.3":
-  version: 1.1.3
-  resolution: "@radix-ui/react-portal@npm:1.1.3"
+"@radix-ui/react-toggle-group@npm:1.1.1":
+  version: 1.1.1
+  resolution: "@radix-ui/react-toggle-group@npm:1.1.1"
   dependencies:
+    "@radix-ui/primitive": 1.1.1
+    "@radix-ui/react-context": 1.1.1
+    "@radix-ui/react-direction": 1.1.0
     "@radix-ui/react-primitive": 2.0.1
-    "@radix-ui/react-use-layout-effect": 1.1.0
+    "@radix-ui/react-roving-focus": 1.1.1
+    "@radix-ui/react-toggle": 1.1.1
+    "@radix-ui/react-use-controllable-state": 1.1.0
   peerDependencies:
     "@types/react": "*"
     "@types/react-dom": "*"
@@ -2922,16 +4900,17 @@ __metadata:
       optional: true
     "@types/react-dom":
       optional: true
-  checksum: b3cd1a81513e528d261599cffda8d7d6094a8598750eaa32bac0d64dbc9a3b4d4e1c10f5bdadf7051b5fd77033b759dbeb4838dae325b94bf8251804c61508c5
+  checksum: 730403b34ab2578fb660d6704ae56a11ea34a708ff5289bf828dc128286c6b7755f35186b7e4865bf41a11563f49dbc6cacb1ff2261ca8606394893f52ac86a7
   languageName: node
   linkType: hard
 
-"@radix-ui/react-presence@npm:1.1.2":
-  version: 1.1.2
-  resolution: "@radix-ui/react-presence@npm:1.1.2"
+"@radix-ui/react-toggle@npm:1.1.1":
+  version: 1.1.1
+  resolution: "@radix-ui/react-toggle@npm:1.1.1"
   dependencies:
-    "@radix-ui/react-compose-refs": 1.1.1
-    "@radix-ui/react-use-layout-effect": 1.1.0
+    "@radix-ui/primitive": 1.1.1
+    "@radix-ui/react-primitive": 2.0.1
+    "@radix-ui/react-use-controllable-state": 1.1.0
   peerDependencies:
     "@types/react": "*"
     "@types/react-dom": "*"
@@ -2942,15 +4921,21 @@ __metadata:
       optional: true
     "@types/react-dom":
       optional: true
-  checksum: 0c6fa281368636308044df3be4c1f02733094b5e35ba04f26e610dd1c4315a245ffc758e0e176c444742a7a46f4328af1a9d8181e860175ec39338d06525a78d
+  checksum: c38e6221fb0eb533dfe866cebf9ba3feceaf323ace799042161fe5246407199e4ceecbde27625955fcce894f902c2350f849cb4b924d59f91b5b41de49cd41e6
   languageName: node
   linkType: hard
 
-"@radix-ui/react-primitive@npm:2.0.1":
-  version: 2.0.1
-  resolution: "@radix-ui/react-primitive@npm:2.0.1"
+"@radix-ui/react-toolbar@npm:1.1.1":
+  version: 1.1.1
+  resolution: "@radix-ui/react-toolbar@npm:1.1.1"
   dependencies:
-    "@radix-ui/react-slot": 1.1.1
+    "@radix-ui/primitive": 1.1.1
+    "@radix-ui/react-context": 1.1.1
+    "@radix-ui/react-direction": 1.1.0
+    "@radix-ui/react-primitive": 2.0.1
+    "@radix-ui/react-roving-focus": 1.1.1
+    "@radix-ui/react-separator": 1.1.1
+    "@radix-ui/react-toggle-group": 1.1.1
   peerDependencies:
     "@types/react": "*"
     "@types/react-dom": "*"
@@ -2961,71 +4946,144 @@ __metadata:
       optional: true
     "@types/react-dom":
       optional: true
-  checksum: 6a562bec14f8e9fbfe0012d6c2932b0e54518fed898fa0622300c463611e77a4ca28a969f0cd484efd6570c01c5665dd6151f736262317d01715bc4da1a7dea6
+  checksum: 003ea69d55dc3e05cd152096920ee04d46568fc76e682254666ba2cfcc7bb1a90fa38c41c08b0a8e08035ce5349497811c1f8786f2c5d662b98a93557fe261b9
   languageName: node
   linkType: hard
 
-"@radix-ui/react-progress@npm:1.1.1":
-  version: 1.1.1
-  resolution: "@radix-ui/react-progress@npm:1.1.1"
+"@radix-ui/react-tooltip@npm:1.1.7":
+  version: 1.1.7
+  resolution: "@radix-ui/react-tooltip@npm:1.1.7"
   dependencies:
+    "@radix-ui/primitive": 1.1.1
+    "@radix-ui/react-compose-refs": 1.1.1
     "@radix-ui/react-context": 1.1.1
+    "@radix-ui/react-dismissable-layer": 1.1.4
+    "@radix-ui/react-id": 1.1.0
+    "@radix-ui/react-popper": 1.2.1
+    "@radix-ui/react-portal": 1.1.3
+    "@radix-ui/react-presence": 1.1.2
     "@radix-ui/react-primitive": 2.0.1
+    "@radix-ui/react-slot": 1.1.1
+    "@radix-ui/react-use-controllable-state": 1.1.0
+    "@radix-ui/react-visually-hidden": 1.1.1
+  peerDependencies:
+    "@types/react": "*"
+    "@types/react-dom": "*"
+    react: ^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc
+    react-dom: ^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc
+  peerDependenciesMeta:
+    "@types/react":
+      optional: true
+    "@types/react-dom":
+      optional: true
+  checksum: 25c11cbc8b6aa4115c5fd10aa6fb414e5f4169d83334bd7711fd597dad938122839b801a4b4c13bd0295131db4b0527e18338a203cc6281721342251d01a2d48
+  languageName: node
+  linkType: hard
+
+"@radix-ui/react-use-callback-ref@npm:1.1.0":
+  version: 1.1.0
+  resolution: "@radix-ui/react-use-callback-ref@npm:1.1.0"
+  peerDependencies:
+    "@types/react": "*"
+    react: ^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc
+  peerDependenciesMeta:
+    "@types/react":
+      optional: true
+  checksum: e954863f3baa151faf89ac052a5468b42650efca924417470efd1bd254b411a94c69c30de2fdbb90187b38cb984795978e12e30423dc41e4309d93d53b66d819
+  languageName: node
+  linkType: hard
+
+"@radix-ui/react-use-controllable-state@npm:1.1.0":
+  version: 1.1.0
+  resolution: "@radix-ui/react-use-controllable-state@npm:1.1.0"
+  dependencies:
+    "@radix-ui/react-use-callback-ref": 1.1.0
+  peerDependencies:
+    "@types/react": "*"
+    react: ^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc
+  peerDependenciesMeta:
+    "@types/react":
+      optional: true
+  checksum: 2af883b5b25822ac226e60a6bfde647c0123a76345052a90219026059b3f7225844b2c13a9a16fba859c1cda5fb3d057f2a04503f71780e607516492db4eb3a1
+  languageName: node
+  linkType: hard
+
+"@radix-ui/react-use-escape-keydown@npm:1.1.0":
+  version: 1.1.0
+  resolution: "@radix-ui/react-use-escape-keydown@npm:1.1.0"
+  dependencies:
+    "@radix-ui/react-use-callback-ref": 1.1.0
+  peerDependencies:
+    "@types/react": "*"
+    react: ^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc
+  peerDependenciesMeta:
+    "@types/react":
+      optional: true
+  checksum: 910fd696e5a0994b0e06b9cb68def8a865f47951a013ec240c77db2a9e1e726105602700ef5e5f01af49f2f18fe0e73164f9a9651021f28538ef8a30d91f3fbb
+  languageName: node
+  linkType: hard
+
+"@radix-ui/react-use-layout-effect@npm:1.1.0":
+  version: 1.1.0
+  resolution: "@radix-ui/react-use-layout-effect@npm:1.1.0"
+  peerDependencies:
+    "@types/react": "*"
+    react: ^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc
+  peerDependenciesMeta:
+    "@types/react":
+      optional: true
+  checksum: 9bf87ece1845c038ed95863cfccf9d75f557c2400d606343bab0ab3192b9806b9840e6aa0a0333fdf3e83cf9982632852192f3e68d7d8367bc8c788dfdf8e62b
+  languageName: node
+  linkType: hard
+
+"@radix-ui/react-use-previous@npm:1.1.0":
+  version: 1.1.0
+  resolution: "@radix-ui/react-use-previous@npm:1.1.0"
+  peerDependencies:
+    "@types/react": "*"
+    react: ^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc
+  peerDependenciesMeta:
+    "@types/react":
+      optional: true
+  checksum: 9787d24790d4e330715127f2f4db56c4cbed9b0a47f97e11a68582c08a356a53c1ec41c7537382f6fb8d0db25de152770f17430e8eaf0fa59705be97760acbad
+  languageName: node
+  linkType: hard
+
+"@radix-ui/react-use-rect@npm:1.1.0":
+  version: 1.1.0
+  resolution: "@radix-ui/react-use-rect@npm:1.1.0"
+  dependencies:
+    "@radix-ui/rect": 1.1.0
   peerDependencies:
     "@types/react": "*"
-    "@types/react-dom": "*"
     react: ^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc
-    react-dom: ^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc
   peerDependenciesMeta:
     "@types/react":
       optional: true
-    "@types/react-dom":
-      optional: true
-  checksum: dcf4ab20ff3a19a4be5a6e2502c42cd2c2770c6356b86301a548f725d33b8054dafe411b3c0f2b0b9465b225a31e8eb9f6bcc338d1936fb89312b517e1e7f2ec
+  checksum: c2e30150ab49e2cec238cda306fd748c3d47fb96dcff69a3b08e1d19108d80bac239d48f1747a25dadca614e3e967267d43b91e60ea59db2befbc7bea913ff84
   languageName: node
   linkType: hard
 
-"@radix-ui/react-radio-group@npm:1.2.2":
-  version: 1.2.2
-  resolution: "@radix-ui/react-radio-group@npm:1.2.2"
+"@radix-ui/react-use-size@npm:1.1.0":
+  version: 1.1.0
+  resolution: "@radix-ui/react-use-size@npm:1.1.0"
   dependencies:
-    "@radix-ui/primitive": 1.1.1
-    "@radix-ui/react-compose-refs": 1.1.1
-    "@radix-ui/react-context": 1.1.1
-    "@radix-ui/react-direction": 1.1.0
-    "@radix-ui/react-presence": 1.1.2
-    "@radix-ui/react-primitive": 2.0.1
-    "@radix-ui/react-roving-focus": 1.1.1
-    "@radix-ui/react-use-controllable-state": 1.1.0
-    "@radix-ui/react-use-previous": 1.1.0
-    "@radix-ui/react-use-size": 1.1.0
+    "@radix-ui/react-use-layout-effect": 1.1.0
   peerDependencies:
     "@types/react": "*"
-    "@types/react-dom": "*"
     react: ^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc
-    react-dom: ^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc
   peerDependenciesMeta:
     "@types/react":
       optional: true
-    "@types/react-dom":
-      optional: true
-  checksum: 450592e3a5aa1f9d53f21aefafb977e04b5a0c3a8a8080653f9d9c8117a381b4489bbb4fb4743bd52f043f6aff6e4b279926352c1dd9589fd541cb924533fc17
+  checksum: 4c8b89037597fdc1824d009e0c941b510c7c6c30f83024cc02c934edd748886786e7d9f36f57323b02ad29833e7fa7e8974d81969b4ab33d8f41661afa4f30a6
   languageName: node
   linkType: hard
 
-"@radix-ui/react-roving-focus@npm:1.1.1":
+"@radix-ui/react-visually-hidden@npm:1.1.1":
   version: 1.1.1
-  resolution: "@radix-ui/react-roving-focus@npm:1.1.1"
+  resolution: "@radix-ui/react-visually-hidden@npm:1.1.1"
   dependencies:
-    "@radix-ui/primitive": 1.1.1
-    "@radix-ui/react-collection": 1.1.1
-    "@radix-ui/react-compose-refs": 1.1.1
-    "@radix-ui/react-context": 1.1.1
-    "@radix-ui/react-direction": 1.1.0
-    "@radix-ui/react-id": 1.1.0
     "@radix-ui/react-primitive": 2.0.1
-    "@radix-ui/react-use-callback-ref": 1.1.0
-    "@radix-ui/react-use-controllable-state": 1.1.0
   peerDependencies:
     "@types/react": "*"
     "@types/react-dom": "*"
@@ -3036,2276 +5094,2295 @@ __metadata:
       optional: true
     "@types/react-dom":
       optional: true
-  checksum: ee41eb60b0c300ef3bb130f7ca6c7333148669f2a50b841027910158c06be215967880da932ac14b83d130a9ca5ffb33d6a1a0f067d5048f8db2c3884bbd9b85
+  checksum: 9a34b8e09dc79983626194fdfb4bd24c79060034a226153a2bd9f726f056139316e7a6360583567c6ccd5d9589e6d230fe2c436abea455f73e2d27b73412c412
   languageName: node
   linkType: hard
 
-"@radix-ui/react-scroll-area@npm:1.2.2":
-  version: 1.2.2
-  resolution: "@radix-ui/react-scroll-area@npm:1.2.2"
+"@radix-ui/rect@npm:1.1.0":
+  version: 1.1.0
+  resolution: "@radix-ui/rect@npm:1.1.0"
+  checksum: a26ff7f8708fb5f2f7949baad70a6b2a597d761ee4dd4aadaf1c1a33ea82ea23dfef6ce6366a08310c5d008cdd60b2e626e4ee03fa342bd5f246ddd9d427f6be
+  languageName: node
+  linkType: hard
+
+"@react-aria/breadcrumbs@npm:^3.5.18":
+  version: 3.5.18
+  resolution: "@react-aria/breadcrumbs@npm:3.5.18"
   dependencies:
-    "@radix-ui/number": 1.1.0
-    "@radix-ui/primitive": 1.1.1
-    "@radix-ui/react-compose-refs": 1.1.1
-    "@radix-ui/react-context": 1.1.1
-    "@radix-ui/react-direction": 1.1.0
-    "@radix-ui/react-presence": 1.1.2
-    "@radix-ui/react-primitive": 2.0.1
-    "@radix-ui/react-use-callback-ref": 1.1.0
-    "@radix-ui/react-use-layout-effect": 1.1.0
+    "@react-aria/i18n": ^3.12.3
+    "@react-aria/link": ^3.7.6
+    "@react-aria/utils": ^3.25.3
+    "@react-types/breadcrumbs": ^3.7.8
+    "@react-types/shared": ^3.25.0
+    "@swc/helpers": ^0.5.0
   peerDependencies:
-    "@types/react": "*"
-    "@types/react-dom": "*"
-    react: ^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc
-    react-dom: ^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc
-  peerDependenciesMeta:
-    "@types/react":
-      optional: true
-    "@types/react-dom":
-      optional: true
-  checksum: a959c199780d5ef931a4bc9323a009dff8207ccb21ea42131e259cd32fdea035ccddca7f161e3ac1eb93691644b39a6a274329637234d525c2543ceb299493fb
+    react: ^16.8.0 || ^17.0.0-rc.1 || ^18.0.0 || ^19.0.0
+  checksum: 33e50a04c1d2b8efb91194ecac6f087051f4138c13fd182675eab311175bb637c09aa1f7ee1fedaf87e24b7b601b7d5d3ff4bb23d87d70c776eeff84006d5388
   languageName: node
   linkType: hard
 
-"@radix-ui/react-select@npm:2.1.5":
-  version: 2.1.5
-  resolution: "@radix-ui/react-select@npm:2.1.5"
+"@react-aria/button@npm:^3.10.1":
+  version: 3.10.1
+  resolution: "@react-aria/button@npm:3.10.1"
   dependencies:
-    "@radix-ui/number": 1.1.0
-    "@radix-ui/primitive": 1.1.1
-    "@radix-ui/react-collection": 1.1.1
-    "@radix-ui/react-compose-refs": 1.1.1
-    "@radix-ui/react-context": 1.1.1
-    "@radix-ui/react-direction": 1.1.0
-    "@radix-ui/react-dismissable-layer": 1.1.4
-    "@radix-ui/react-focus-guards": 1.1.1
-    "@radix-ui/react-focus-scope": 1.1.1
-    "@radix-ui/react-id": 1.1.0
-    "@radix-ui/react-popper": 1.2.1
-    "@radix-ui/react-portal": 1.1.3
-    "@radix-ui/react-primitive": 2.0.1
-    "@radix-ui/react-slot": 1.1.1
-    "@radix-ui/react-use-callback-ref": 1.1.0
-    "@radix-ui/react-use-controllable-state": 1.1.0
-    "@radix-ui/react-use-layout-effect": 1.1.0
-    "@radix-ui/react-use-previous": 1.1.0
-    "@radix-ui/react-visually-hidden": 1.1.1
-    aria-hidden: ^1.2.4
-    react-remove-scroll: ^2.6.2
+    "@react-aria/focus": ^3.18.4
+    "@react-aria/interactions": ^3.22.4
+    "@react-aria/utils": ^3.25.3
+    "@react-stately/toggle": ^3.7.8
+    "@react-types/button": ^3.10.0
+    "@react-types/shared": ^3.25.0
+    "@swc/helpers": ^0.5.0
+  peerDependencies:
+    react: ^16.8.0 || ^17.0.0-rc.1 || ^18.0.0 || ^19.0.0
+  checksum: 9d35405c008043a7e7314d79c23805642d96742f32e464c05d3bf5417c04e8d70cc395e675dd4133849e08939fdd42eb757168124b0f8a713800eca501c22809
+  languageName: node
+  linkType: hard
+
+"@react-aria/calendar@npm:^3.5.13":
+  version: 3.5.13
+  resolution: "@react-aria/calendar@npm:3.5.13"
+  dependencies:
+    "@internationalized/date": ^3.5.6
+    "@react-aria/i18n": ^3.12.3
+    "@react-aria/interactions": ^3.22.4
+    "@react-aria/live-announcer": ^3.4.0
+    "@react-aria/utils": ^3.25.3
+    "@react-stately/calendar": ^3.5.5
+    "@react-types/button": ^3.10.0
+    "@react-types/calendar": ^3.4.10
+    "@react-types/shared": ^3.25.0
+    "@swc/helpers": ^0.5.0
+  peerDependencies:
+    react: ^16.8.0 || ^17.0.0-rc.1 || ^18.0.0 || ^19.0.0
+    react-dom: ^16.8.0 || ^17.0.0-rc.1 || ^18.0.0 || ^19.0.0
+  checksum: 10f30f6cfdf81d38b48cb40368b141b50cc270ed39bf0240e501b207433bd7324293123bd8d0f49e868e51702b6eed9fc6da9601eb90354bb5e2db631c7089d9
+  languageName: node
+  linkType: hard
+
+"@react-aria/checkbox@npm:^3.14.8":
+  version: 3.14.8
+  resolution: "@react-aria/checkbox@npm:3.14.8"
+  dependencies:
+    "@react-aria/form": ^3.0.10
+    "@react-aria/interactions": ^3.22.4
+    "@react-aria/label": ^3.7.12
+    "@react-aria/toggle": ^3.10.9
+    "@react-aria/utils": ^3.25.3
+    "@react-stately/checkbox": ^3.6.9
+    "@react-stately/form": ^3.0.6
+    "@react-stately/toggle": ^3.7.8
+    "@react-types/checkbox": ^3.8.4
+    "@react-types/shared": ^3.25.0
+    "@swc/helpers": ^0.5.0
+  peerDependencies:
+    react: ^16.8.0 || ^17.0.0-rc.1 || ^18.0.0 || ^19.0.0
+  checksum: 96ac21b5c6ede1ce0545e27dbefb20df88cd06f24c0ed2c2fb44383bcf632aa33096c70ffca59f8bc68c7e5e4f71293a975e6bd5dc65077ca70991f651a56992
+  languageName: node
+  linkType: hard
+
+"@react-aria/color@npm:^3.0.1":
+  version: 3.0.1
+  resolution: "@react-aria/color@npm:3.0.1"
+  dependencies:
+    "@react-aria/i18n": ^3.12.3
+    "@react-aria/interactions": ^3.22.4
+    "@react-aria/numberfield": ^3.11.8
+    "@react-aria/slider": ^3.7.13
+    "@react-aria/spinbutton": ^3.6.9
+    "@react-aria/textfield": ^3.14.10
+    "@react-aria/utils": ^3.25.3
+    "@react-aria/visually-hidden": ^3.8.17
+    "@react-stately/color": ^3.8.0
+    "@react-stately/form": ^3.0.6
+    "@react-types/color": ^3.0.0
+    "@react-types/shared": ^3.25.0
+    "@swc/helpers": ^0.5.0
+  peerDependencies:
+    react: ^16.8.0 || ^17.0.0-rc.1 || ^18.0.0 || ^19.0.0
+    react-dom: ^16.8.0 || ^17.0.0-rc.1 || ^18.0.0 || ^19.0.0
+  checksum: ee4969e6f28a765abee0ba519ad9c77b9910d76ec3c327403d8b901db750ed4daa32be2d1ea62d760f0e4dc4f51aa02c02c0481f4b00a40380d4dccf7a895a38
+  languageName: node
+  linkType: hard
+
+"@react-aria/combobox@npm:^3.10.5":
+  version: 3.10.5
+  resolution: "@react-aria/combobox@npm:3.10.5"
+  dependencies:
+    "@react-aria/i18n": ^3.12.3
+    "@react-aria/listbox": ^3.13.5
+    "@react-aria/live-announcer": ^3.4.0
+    "@react-aria/menu": ^3.15.5
+    "@react-aria/overlays": ^3.23.4
+    "@react-aria/selection": ^3.20.1
+    "@react-aria/textfield": ^3.14.10
+    "@react-aria/utils": ^3.25.3
+    "@react-stately/collections": ^3.11.0
+    "@react-stately/combobox": ^3.10.0
+    "@react-stately/form": ^3.0.6
+    "@react-types/button": ^3.10.0
+    "@react-types/combobox": ^3.13.0
+    "@react-types/shared": ^3.25.0
+    "@swc/helpers": ^0.5.0
+  peerDependencies:
+    react: ^16.8.0 || ^17.0.0-rc.1 || ^18.0.0 || ^19.0.0
+    react-dom: ^16.8.0 || ^17.0.0-rc.1 || ^18.0.0 || ^19.0.0
+  checksum: 420c3de273014e4de38f823b0e7415f8eb648b97293e7169967ffce35133a37eca94288bd2adc636f892ed2da42150bc5b41d85b97a6a545c141cf2ad8ca1cbc
+  languageName: node
+  linkType: hard
+
+"@react-aria/datepicker@npm:^3.11.4":
+  version: 3.11.4
+  resolution: "@react-aria/datepicker@npm:3.11.4"
+  dependencies:
+    "@internationalized/date": ^3.5.6
+    "@internationalized/number": ^3.5.4
+    "@internationalized/string": ^3.2.4
+    "@react-aria/focus": ^3.18.4
+    "@react-aria/form": ^3.0.10
+    "@react-aria/i18n": ^3.12.3
+    "@react-aria/interactions": ^3.22.4
+    "@react-aria/label": ^3.7.12
+    "@react-aria/spinbutton": ^3.6.9
+    "@react-aria/utils": ^3.25.3
+    "@react-stately/datepicker": ^3.10.3
+    "@react-stately/form": ^3.0.6
+    "@react-types/button": ^3.10.0
+    "@react-types/calendar": ^3.4.10
+    "@react-types/datepicker": ^3.8.3
+    "@react-types/dialog": ^3.5.13
+    "@react-types/shared": ^3.25.0
+    "@swc/helpers": ^0.5.0
+  peerDependencies:
+    react: ^16.8.0 || ^17.0.0-rc.1 || ^18.0.0 || ^19.0.0
+    react-dom: ^16.8.0 || ^17.0.0-rc.1 || ^18.0.0 || ^19.0.0
+  checksum: 4df110dcc84f22948210dc0d996569593283017857fa848c553a7848849609922c6ba34e44698390fe192a29f9c6bf428c8beb49f449c83640c62442b86014cd
+  languageName: node
+  linkType: hard
+
+"@react-aria/dialog@npm:^3.5.19":
+  version: 3.5.19
+  resolution: "@react-aria/dialog@npm:3.5.19"
+  dependencies:
+    "@react-aria/focus": ^3.18.4
+    "@react-aria/overlays": ^3.23.4
+    "@react-aria/utils": ^3.25.3
+    "@react-types/dialog": ^3.5.13
+    "@react-types/shared": ^3.25.0
+    "@swc/helpers": ^0.5.0
+  peerDependencies:
+    react: ^16.8.0 || ^17.0.0-rc.1 || ^18.0.0 || ^19.0.0
+    react-dom: ^16.8.0 || ^17.0.0-rc.1 || ^18.0.0 || ^19.0.0
+  checksum: a93699d76c0756fe9723f86a5b4db3af10f2bd042e769c5907cca430e49eee0ccac56859c61736eead8a67d0c8a254f0244d29a5773d603ef6bb53f5bf92fba6
+  languageName: node
+  linkType: hard
+
+"@react-aria/dnd@npm:^3.7.4":
+  version: 3.7.4
+  resolution: "@react-aria/dnd@npm:3.7.4"
+  dependencies:
+    "@internationalized/string": ^3.2.4
+    "@react-aria/i18n": ^3.12.3
+    "@react-aria/interactions": ^3.22.4
+    "@react-aria/live-announcer": ^3.4.0
+    "@react-aria/overlays": ^3.23.4
+    "@react-aria/utils": ^3.25.3
+    "@react-stately/dnd": ^3.4.3
+    "@react-types/button": ^3.10.0
+    "@react-types/shared": ^3.25.0
+    "@swc/helpers": ^0.5.0
   peerDependencies:
-    "@types/react": "*"
-    "@types/react-dom": "*"
-    react: ^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc
-    react-dom: ^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc
-  peerDependenciesMeta:
-    "@types/react":
-      optional: true
-    "@types/react-dom":
-      optional: true
-  checksum: adbaffbe7f7d4662adb10c5af8da279d380f310647a0412a6eb733426881239ac4bca78479b11211dca1ecb3dd1f7eeb6d042d6d8a107c25bc2440606f093758
+    react: ^16.8.0 || ^17.0.0-rc.1 || ^18.0.0 || ^19.0.0
+    react-dom: ^16.8.0 || ^17.0.0-rc.1 || ^18.0.0 || ^19.0.0
+  checksum: 2c3619b2297d4f3f2974565835a15b853d9fe8631d6c02db664d3bad21e3b6126026999541fc98dc8f253684747406fcb55ac28f4ab3acac6f18de152ae4c1c6
   languageName: node
   linkType: hard
 
-"@radix-ui/react-separator@npm:1.1.1":
-  version: 1.1.1
-  resolution: "@radix-ui/react-separator@npm:1.1.1"
+"@react-aria/focus@npm:^3.18.4":
+  version: 3.18.4
+  resolution: "@react-aria/focus@npm:3.18.4"
   dependencies:
-    "@radix-ui/react-primitive": 2.0.1
+    "@react-aria/interactions": ^3.22.4
+    "@react-aria/utils": ^3.25.3
+    "@react-types/shared": ^3.25.0
+    "@swc/helpers": ^0.5.0
+    clsx: ^2.0.0
   peerDependencies:
-    "@types/react": "*"
-    "@types/react-dom": "*"
-    react: ^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc
-    react-dom: ^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc
-  peerDependenciesMeta:
-    "@types/react":
-      optional: true
-    "@types/react-dom":
-      optional: true
-  checksum: 4b0dc0db4e31d4d71a2a688581707dedb19a9e13378e86dbbab467970c5b271afc189ebba0e340495e15ce0fbbc42445d0be43ff8104de5f5c96cf3b822e801d
+    react: ^16.8.0 || ^17.0.0-rc.1 || ^18.0.0 || ^19.0.0
+  checksum: 141f8ef80060c5b58384af4af9446c0792618671e9f963942c3edc29bb15b7eb0ebb62cbe118135c7379c2732e86071aa7d7c890903a0ae411be07f2ec854e6a
   languageName: node
   linkType: hard
 
-"@radix-ui/react-slider@npm:1.2.2":
-  version: 1.2.2
-  resolution: "@radix-ui/react-slider@npm:1.2.2"
+"@react-aria/form@npm:^3.0.10":
+  version: 3.0.10
+  resolution: "@react-aria/form@npm:3.0.10"
   dependencies:
-    "@radix-ui/number": 1.1.0
-    "@radix-ui/primitive": 1.1.1
-    "@radix-ui/react-collection": 1.1.1
-    "@radix-ui/react-compose-refs": 1.1.1
-    "@radix-ui/react-context": 1.1.1
-    "@radix-ui/react-direction": 1.1.0
-    "@radix-ui/react-primitive": 2.0.1
-    "@radix-ui/react-use-controllable-state": 1.1.0
-    "@radix-ui/react-use-layout-effect": 1.1.0
-    "@radix-ui/react-use-previous": 1.1.0
-    "@radix-ui/react-use-size": 1.1.0
+    "@react-aria/interactions": ^3.22.4
+    "@react-aria/utils": ^3.25.3
+    "@react-stately/form": ^3.0.6
+    "@react-types/shared": ^3.25.0
+    "@swc/helpers": ^0.5.0
   peerDependencies:
-    "@types/react": "*"
-    "@types/react-dom": "*"
-    react: ^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc
-    react-dom: ^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc
-  peerDependenciesMeta:
-    "@types/react":
-      optional: true
-    "@types/react-dom":
-      optional: true
-  checksum: cd57454a20739523cba8762a6cc0a5beeaa1393e7aed5cb00ce1fdaa5b821c710865d2e746a639feac69025a4e02ff0b211cf515b02bfcf37dc9b633aa63ed70
+    react: ^16.8.0 || ^17.0.0-rc.1 || ^18.0.0 || ^19.0.0
+  checksum: 31ed3c2a2eb8340f38e9164bf2730ece07563178975aaff55c2e58ed307943071b105dd0503bf31a9fe17e085ef3db52f935636b04365e26194649f0c87f8c5e
   languageName: node
   linkType: hard
 
-"@radix-ui/react-slot@npm:1.1.1":
-  version: 1.1.1
-  resolution: "@radix-ui/react-slot@npm:1.1.1"
+"@react-aria/grid@npm:^3.10.5":
+  version: 3.10.5
+  resolution: "@react-aria/grid@npm:3.10.5"
   dependencies:
-    "@radix-ui/react-compose-refs": 1.1.1
+    "@react-aria/focus": ^3.18.4
+    "@react-aria/i18n": ^3.12.3
+    "@react-aria/interactions": ^3.22.4
+    "@react-aria/live-announcer": ^3.4.0
+    "@react-aria/selection": ^3.20.1
+    "@react-aria/utils": ^3.25.3
+    "@react-stately/collections": ^3.11.0
+    "@react-stately/grid": ^3.9.3
+    "@react-stately/selection": ^3.17.0
+    "@react-types/checkbox": ^3.8.4
+    "@react-types/grid": ^3.2.9
+    "@react-types/shared": ^3.25.0
+    "@swc/helpers": ^0.5.0
   peerDependencies:
-    "@types/react": "*"
-    react: ^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc
-  peerDependenciesMeta:
-    "@types/react":
-      optional: true
-  checksum: f3cc71c16529c67a8407a89e0ac13a868cafa0cd05ca185b464db609aa5996a3f00588695518e420bd47ffdb4cc2f76c14cc12ea5a38fc2ca3578a30d2ca58b9
+    react: ^16.8.0 || ^17.0.0-rc.1 || ^18.0.0 || ^19.0.0
+    react-dom: ^16.8.0 || ^17.0.0-rc.1 || ^18.0.0 || ^19.0.0
+  checksum: d85110a3df794a8df38ea1b52b7f575c1a4e31a4f4f6989c80c25099e6a020e1a290436febc846dbd0397db42b55a5d1e4028341808a9cbc82e92401acde5973
   languageName: node
   linkType: hard
 
-"@radix-ui/react-switch@npm:1.1.2":
-  version: 1.1.2
-  resolution: "@radix-ui/react-switch@npm:1.1.2"
+"@react-aria/gridlist@npm:^3.9.5":
+  version: 3.9.5
+  resolution: "@react-aria/gridlist@npm:3.9.5"
   dependencies:
-    "@radix-ui/primitive": 1.1.1
-    "@radix-ui/react-compose-refs": 1.1.1
-    "@radix-ui/react-context": 1.1.1
-    "@radix-ui/react-primitive": 2.0.1
-    "@radix-ui/react-use-controllable-state": 1.1.0
-    "@radix-ui/react-use-previous": 1.1.0
-    "@radix-ui/react-use-size": 1.1.0
+    "@react-aria/focus": ^3.18.4
+    "@react-aria/grid": ^3.10.5
+    "@react-aria/i18n": ^3.12.3
+    "@react-aria/interactions": ^3.22.4
+    "@react-aria/selection": ^3.20.1
+    "@react-aria/utils": ^3.25.3
+    "@react-stately/collections": ^3.11.0
+    "@react-stately/list": ^3.11.0
+    "@react-stately/tree": ^3.8.5
+    "@react-types/shared": ^3.25.0
+    "@swc/helpers": ^0.5.0
   peerDependencies:
-    "@types/react": "*"
-    "@types/react-dom": "*"
-    react: ^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc
-    react-dom: ^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc
-  peerDependenciesMeta:
-    "@types/react":
-      optional: true
-    "@types/react-dom":
-      optional: true
-  checksum: 5ae76c25ab6e9b401a562818b9507acb5994d4b8db828a21fde3d415fde8196c86f7f4025e5bccf72991a4e6801f008e05de02216be20e1f36b6f6411cd27939
+    react: ^16.8.0 || ^17.0.0-rc.1 || ^18.0.0 || ^19.0.0
+    react-dom: ^16.8.0 || ^17.0.0-rc.1 || ^18.0.0 || ^19.0.0
+  checksum: d9ceb8df29f9d6f9cae123b6227313915aea9fd40543afb83ddee3f8a31fc5bceae4eb28a64fa5345dc7285b64adcc1dddfc60c28cc071782e681adf717b7879
   languageName: node
   linkType: hard
 
-"@radix-ui/react-tabs@npm:1.1.2":
-  version: 1.1.2
-  resolution: "@radix-ui/react-tabs@npm:1.1.2"
+"@react-aria/i18n@npm:^3.12.3":
+  version: 3.12.3
+  resolution: "@react-aria/i18n@npm:3.12.3"
   dependencies:
-    "@radix-ui/primitive": 1.1.1
-    "@radix-ui/react-context": 1.1.1
-    "@radix-ui/react-direction": 1.1.0
-    "@radix-ui/react-id": 1.1.0
-    "@radix-ui/react-presence": 1.1.2
-    "@radix-ui/react-primitive": 2.0.1
-    "@radix-ui/react-roving-focus": 1.1.1
-    "@radix-ui/react-use-controllable-state": 1.1.0
+    "@internationalized/date": ^3.5.6
+    "@internationalized/message": ^3.1.5
+    "@internationalized/number": ^3.5.4
+    "@internationalized/string": ^3.2.4
+    "@react-aria/ssr": ^3.9.6
+    "@react-aria/utils": ^3.25.3
+    "@react-types/shared": ^3.25.0
+    "@swc/helpers": ^0.5.0
   peerDependencies:
-    "@types/react": "*"
-    "@types/react-dom": "*"
-    react: ^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc
-    react-dom: ^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc
-  peerDependenciesMeta:
-    "@types/react":
-      optional: true
-    "@types/react-dom":
-      optional: true
-  checksum: 035db9d439d41e60218ea64c8c4cf4a8496eb885aa1caa3cace545a941766dbab7faa1a670ffb49389c55345028203927b424b8cbaa8f2f0cd0cda9974c2fcc6
+    react: ^16.8.0 || ^17.0.0-rc.1 || ^18.0.0 || ^19.0.0
+  checksum: 98210abb15d598a6e4a35eae6df1d70ae6376ef9a5e1c3d298e03f4cc006df696785006323fa97ac57ce14c5b5c8d108690a5c2b187624cad5956778ffc25ca9
   languageName: node
   linkType: hard
 
-"@radix-ui/react-toast@npm:1.2.5":
-  version: 1.2.5
-  resolution: "@radix-ui/react-toast@npm:1.2.5"
+"@react-aria/interactions@npm:^3.22.4":
+  version: 3.22.4
+  resolution: "@react-aria/interactions@npm:3.22.4"
   dependencies:
-    "@radix-ui/primitive": 1.1.1
-    "@radix-ui/react-collection": 1.1.1
-    "@radix-ui/react-compose-refs": 1.1.1
-    "@radix-ui/react-context": 1.1.1
-    "@radix-ui/react-dismissable-layer": 1.1.4
-    "@radix-ui/react-portal": 1.1.3
-    "@radix-ui/react-presence": 1.1.2
-    "@radix-ui/react-primitive": 2.0.1
-    "@radix-ui/react-use-callback-ref": 1.1.0
-    "@radix-ui/react-use-controllable-state": 1.1.0
-    "@radix-ui/react-use-layout-effect": 1.1.0
-    "@radix-ui/react-visually-hidden": 1.1.1
+    "@react-aria/ssr": ^3.9.6
+    "@react-aria/utils": ^3.25.3
+    "@react-types/shared": ^3.25.0
+    "@swc/helpers": ^0.5.0
   peerDependencies:
-    "@types/react": "*"
-    "@types/react-dom": "*"
-    react: ^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc
-    react-dom: ^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc
-  peerDependenciesMeta:
-    "@types/react":
-      optional: true
-    "@types/react-dom":
-      optional: true
-  checksum: 8f3f03355fdbf49d6705205357f17dd4f0f5ad874dd753da09f46bfb2145ac63780d4445dd1b1f70337185b4f34b43e33e82c4be988eee3fccae62cfc26b2d00
+    react: ^16.8.0 || ^17.0.0-rc.1 || ^18.0.0 || ^19.0.0
+  checksum: 8455a68540a4085b71ed034cad5c349a7e756e44cd30d69d340d7f7a66ce1886882021fbcc8049a5d8aeba54b47cd2ca49a7bc4e6910aab2d13b41703d55c7a5
   languageName: node
   linkType: hard
 
-"@radix-ui/react-toggle-group@npm:1.1.1":
-  version: 1.1.1
-  resolution: "@radix-ui/react-toggle-group@npm:1.1.1"
+"@react-aria/label@npm:^3.7.12":
+  version: 3.7.12
+  resolution: "@react-aria/label@npm:3.7.12"
   dependencies:
-    "@radix-ui/primitive": 1.1.1
-    "@radix-ui/react-context": 1.1.1
-    "@radix-ui/react-direction": 1.1.0
-    "@radix-ui/react-primitive": 2.0.1
-    "@radix-ui/react-roving-focus": 1.1.1
-    "@radix-ui/react-toggle": 1.1.1
-    "@radix-ui/react-use-controllable-state": 1.1.0
+    "@react-aria/utils": ^3.25.3
+    "@react-types/shared": ^3.25.0
+    "@swc/helpers": ^0.5.0
   peerDependencies:
-    "@types/react": "*"
-    "@types/react-dom": "*"
-    react: ^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc
-    react-dom: ^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc
-  peerDependenciesMeta:
-    "@types/react":
-      optional: true
-    "@types/react-dom":
-      optional: true
-  checksum: 730403b34ab2578fb660d6704ae56a11ea34a708ff5289bf828dc128286c6b7755f35186b7e4865bf41a11563f49dbc6cacb1ff2261ca8606394893f52ac86a7
+    react: ^16.8.0 || ^17.0.0-rc.1 || ^18.0.0 || ^19.0.0
+  checksum: 28a8a04c788df9fb776565974a1c20bf01067d3d9a1f6cbeb184859c7e8893a64809bbcd1af9d765039ee30da96ecbce75c7d2d37bddb54cf4e709ab2d7afcca
   languageName: node
   linkType: hard
 
-"@radix-ui/react-toggle@npm:1.1.1":
-  version: 1.1.1
-  resolution: "@radix-ui/react-toggle@npm:1.1.1"
+"@react-aria/link@npm:^3.7.6":
+  version: 3.7.6
+  resolution: "@react-aria/link@npm:3.7.6"
   dependencies:
-    "@radix-ui/primitive": 1.1.1
-    "@radix-ui/react-primitive": 2.0.1
-    "@radix-ui/react-use-controllable-state": 1.1.0
+    "@react-aria/focus": ^3.18.4
+    "@react-aria/interactions": ^3.22.4
+    "@react-aria/utils": ^3.25.3
+    "@react-types/link": ^3.5.8
+    "@react-types/shared": ^3.25.0
+    "@swc/helpers": ^0.5.0
   peerDependencies:
-    "@types/react": "*"
-    "@types/react-dom": "*"
-    react: ^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc
-    react-dom: ^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc
-  peerDependenciesMeta:
-    "@types/react":
-      optional: true
-    "@types/react-dom":
-      optional: true
-  checksum: c38e6221fb0eb533dfe866cebf9ba3feceaf323ace799042161fe5246407199e4ceecbde27625955fcce894f902c2350f849cb4b924d59f91b5b41de49cd41e6
+    react: ^16.8.0 || ^17.0.0-rc.1 || ^18.0.0 || ^19.0.0
+  checksum: 81e3f3b53648ac4223e3c673a13c592c24895202b39255bb16bd2b39bcc9dff4b5ad2f6ed69029228ada20941eefd89060fe1761e6658eefcdbb28019fa1818a
   languageName: node
   linkType: hard
 
-"@radix-ui/react-toolbar@npm:1.1.1":
-  version: 1.1.1
-  resolution: "@radix-ui/react-toolbar@npm:1.1.1"
+"@react-aria/listbox@npm:^3.13.5":
+  version: 3.13.5
+  resolution: "@react-aria/listbox@npm:3.13.5"
   dependencies:
-    "@radix-ui/primitive": 1.1.1
-    "@radix-ui/react-context": 1.1.1
-    "@radix-ui/react-direction": 1.1.0
-    "@radix-ui/react-primitive": 2.0.1
-    "@radix-ui/react-roving-focus": 1.1.1
-    "@radix-ui/react-separator": 1.1.1
-    "@radix-ui/react-toggle-group": 1.1.1
+    "@react-aria/interactions": ^3.22.4
+    "@react-aria/label": ^3.7.12
+    "@react-aria/selection": ^3.20.1
+    "@react-aria/utils": ^3.25.3
+    "@react-stately/collections": ^3.11.0
+    "@react-stately/list": ^3.11.0
+    "@react-types/listbox": ^3.5.2
+    "@react-types/shared": ^3.25.0
+    "@swc/helpers": ^0.5.0
   peerDependencies:
-    "@types/react": "*"
-    "@types/react-dom": "*"
-    react: ^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc
-    react-dom: ^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc
-  peerDependenciesMeta:
-    "@types/react":
-      optional: true
-    "@types/react-dom":
-      optional: true
-  checksum: 003ea69d55dc3e05cd152096920ee04d46568fc76e682254666ba2cfcc7bb1a90fa38c41c08b0a8e08035ce5349497811c1f8786f2c5d662b98a93557fe261b9
+    react: ^16.8.0 || ^17.0.0-rc.1 || ^18.0.0 || ^19.0.0
+    react-dom: ^16.8.0 || ^17.0.0-rc.1 || ^18.0.0 || ^19.0.0
+  checksum: 877c86bfe63b4b75a3bf75db7c275006d7341a4933b37dc57f996d1c9f230c4ca0a6f68960938b445bb5ed3af23787b1f7a818d783d4e7188a0b891b74215bdc
   languageName: node
   linkType: hard
 
-"@radix-ui/react-tooltip@npm:1.1.7":
-  version: 1.1.7
-  resolution: "@radix-ui/react-tooltip@npm:1.1.7"
+"@react-aria/live-announcer@npm:^3.4.0":
+  version: 3.4.0
+  resolution: "@react-aria/live-announcer@npm:3.4.0"
   dependencies:
-    "@radix-ui/primitive": 1.1.1
-    "@radix-ui/react-compose-refs": 1.1.1
-    "@radix-ui/react-context": 1.1.1
-    "@radix-ui/react-dismissable-layer": 1.1.4
-    "@radix-ui/react-id": 1.1.0
-    "@radix-ui/react-popper": 1.2.1
-    "@radix-ui/react-portal": 1.1.3
-    "@radix-ui/react-presence": 1.1.2
-    "@radix-ui/react-primitive": 2.0.1
-    "@radix-ui/react-slot": 1.1.1
-    "@radix-ui/react-use-controllable-state": 1.1.0
-    "@radix-ui/react-visually-hidden": 1.1.1
-  peerDependencies:
-    "@types/react": "*"
-    "@types/react-dom": "*"
-    react: ^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc
-    react-dom: ^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc
-  peerDependenciesMeta:
-    "@types/react":
-      optional: true
-    "@types/react-dom":
-      optional: true
-  checksum: 25c11cbc8b6aa4115c5fd10aa6fb414e5f4169d83334bd7711fd597dad938122839b801a4b4c13bd0295131db4b0527e18338a203cc6281721342251d01a2d48
+    "@swc/helpers": ^0.5.0
+  checksum: d4815bbe453765013042299c295cba362147fe7634d4bdcfecffc3f7efbe84b83c820e9737ac90e127b4f8980aaea16f7f9876de516a6c05a42de0b5bf606b92
   languageName: node
   linkType: hard
 
-"@radix-ui/react-use-callback-ref@npm:1.1.0":
-  version: 1.1.0
-  resolution: "@radix-ui/react-use-callback-ref@npm:1.1.0"
+"@react-aria/menu@npm:^3.15.5":
+  version: 3.15.5
+  resolution: "@react-aria/menu@npm:3.15.5"
+  dependencies:
+    "@react-aria/focus": ^3.18.4
+    "@react-aria/i18n": ^3.12.3
+    "@react-aria/interactions": ^3.22.4
+    "@react-aria/overlays": ^3.23.4
+    "@react-aria/selection": ^3.20.1
+    "@react-aria/utils": ^3.25.3
+    "@react-stately/collections": ^3.11.0
+    "@react-stately/menu": ^3.8.3
+    "@react-stately/tree": ^3.8.5
+    "@react-types/button": ^3.10.0
+    "@react-types/menu": ^3.9.12
+    "@react-types/shared": ^3.25.0
+    "@swc/helpers": ^0.5.0
   peerDependencies:
-    "@types/react": "*"
-    react: ^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc
-  peerDependenciesMeta:
-    "@types/react":
-      optional: true
-  checksum: e954863f3baa151faf89ac052a5468b42650efca924417470efd1bd254b411a94c69c30de2fdbb90187b38cb984795978e12e30423dc41e4309d93d53b66d819
+    react: ^16.8.0 || ^17.0.0-rc.1 || ^18.0.0 || ^19.0.0
+    react-dom: ^16.8.0 || ^17.0.0-rc.1 || ^18.0.0 || ^19.0.0
+  checksum: 466bfeb1e76056556c502b274bd69637fb06b02f43c28c076b47476e4289eeb30d1120a17d41fe11bdcb972cc4c1119b7f0efb1aad28efc570dc7524fc7c8b59
   languageName: node
   linkType: hard
 
-"@radix-ui/react-use-controllable-state@npm:1.1.0":
-  version: 1.1.0
-  resolution: "@radix-ui/react-use-controllable-state@npm:1.1.0"
+"@react-aria/meter@npm:^3.4.17":
+  version: 3.4.17
+  resolution: "@react-aria/meter@npm:3.4.17"
   dependencies:
-    "@radix-ui/react-use-callback-ref": 1.1.0
+    "@react-aria/progress": ^3.4.17
+    "@react-types/meter": ^3.4.4
+    "@react-types/shared": ^3.25.0
+    "@swc/helpers": ^0.5.0
   peerDependencies:
-    "@types/react": "*"
-    react: ^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc
-  peerDependenciesMeta:
-    "@types/react":
-      optional: true
-  checksum: 2af883b5b25822ac226e60a6bfde647c0123a76345052a90219026059b3f7225844b2c13a9a16fba859c1cda5fb3d057f2a04503f71780e607516492db4eb3a1
+    react: ^16.8.0 || ^17.0.0-rc.1 || ^18.0.0 || ^19.0.0
+  checksum: d5b648664416f50448c34567df5f6c0c706014ab3d487869958e9f9b8d4a4fae5f5bc173edf4dd734d91ea9f6b7f7e853679baaf48926326d96ff8be2150ba0c
   languageName: node
   linkType: hard
 
-"@radix-ui/react-use-escape-keydown@npm:1.1.0":
-  version: 1.1.0
-  resolution: "@radix-ui/react-use-escape-keydown@npm:1.1.0"
+"@react-aria/numberfield@npm:^3.11.8":
+  version: 3.11.8
+  resolution: "@react-aria/numberfield@npm:3.11.8"
   dependencies:
-    "@radix-ui/react-use-callback-ref": 1.1.0
+    "@react-aria/i18n": ^3.12.3
+    "@react-aria/interactions": ^3.22.4
+    "@react-aria/spinbutton": ^3.6.9
+    "@react-aria/textfield": ^3.14.10
+    "@react-aria/utils": ^3.25.3
+    "@react-stately/form": ^3.0.6
+    "@react-stately/numberfield": ^3.9.7
+    "@react-types/button": ^3.10.0
+    "@react-types/numberfield": ^3.8.6
+    "@react-types/shared": ^3.25.0
+    "@swc/helpers": ^0.5.0
   peerDependencies:
-    "@types/react": "*"
-    react: ^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc
-  peerDependenciesMeta:
-    "@types/react":
-      optional: true
-  checksum: 910fd696e5a0994b0e06b9cb68def8a865f47951a013ec240c77db2a9e1e726105602700ef5e5f01af49f2f18fe0e73164f9a9651021f28538ef8a30d91f3fbb
+    react: ^16.8.0 || ^17.0.0-rc.1 || ^18.0.0 || ^19.0.0
+    react-dom: ^16.8.0 || ^17.0.0-rc.1 || ^18.0.0 || ^19.0.0
+  checksum: a1f6e5d90e150f40902546212687850a9c50889726db0f28f0ec73a1fd8f427048f464677b389d620350817749e5d96b90e51bca639705ff141543adbe3b82e3
   languageName: node
   linkType: hard
 
-"@radix-ui/react-use-layout-effect@npm:1.1.0":
-  version: 1.1.0
-  resolution: "@radix-ui/react-use-layout-effect@npm:1.1.0"
+"@react-aria/overlays@npm:^3.23.4":
+  version: 3.23.4
+  resolution: "@react-aria/overlays@npm:3.23.4"
+  dependencies:
+    "@react-aria/focus": ^3.18.4
+    "@react-aria/i18n": ^3.12.3
+    "@react-aria/interactions": ^3.22.4
+    "@react-aria/ssr": ^3.9.6
+    "@react-aria/utils": ^3.25.3
+    "@react-aria/visually-hidden": ^3.8.17
+    "@react-stately/overlays": ^3.6.11
+    "@react-types/button": ^3.10.0
+    "@react-types/overlays": ^3.8.10
+    "@react-types/shared": ^3.25.0
+    "@swc/helpers": ^0.5.0
   peerDependencies:
-    "@types/react": "*"
-    react: ^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc
-  peerDependenciesMeta:
-    "@types/react":
-      optional: true
-  checksum: 9bf87ece1845c038ed95863cfccf9d75f557c2400d606343bab0ab3192b9806b9840e6aa0a0333fdf3e83cf9982632852192f3e68d7d8367bc8c788dfdf8e62b
+    react: ^16.8.0 || ^17.0.0-rc.1 || ^18.0.0 || ^19.0.0
+    react-dom: ^16.8.0 || ^17.0.0-rc.1 || ^18.0.0 || ^19.0.0
+  checksum: 174c8ef7d52123e8d979044dd36373314328086b2dc37a8b4f1fab8344be74c77925595dca86f720fd661eeffd5b632261f9a57e813d0f91460d1f08a090504e
   languageName: node
   linkType: hard
 
-"@radix-ui/react-use-previous@npm:1.1.0":
-  version: 1.1.0
-  resolution: "@radix-ui/react-use-previous@npm:1.1.0"
+"@react-aria/progress@npm:^3.4.17":
+  version: 3.4.17
+  resolution: "@react-aria/progress@npm:3.4.17"
+  dependencies:
+    "@react-aria/i18n": ^3.12.3
+    "@react-aria/label": ^3.7.12
+    "@react-aria/utils": ^3.25.3
+    "@react-types/progress": ^3.5.7
+    "@react-types/shared": ^3.25.0
+    "@swc/helpers": ^0.5.0
   peerDependencies:
-    "@types/react": "*"
-    react: ^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc
-  peerDependenciesMeta:
-    "@types/react":
-      optional: true
-  checksum: 9787d24790d4e330715127f2f4db56c4cbed9b0a47f97e11a68582c08a356a53c1ec41c7537382f6fb8d0db25de152770f17430e8eaf0fa59705be97760acbad
+    react: ^16.8.0 || ^17.0.0-rc.1 || ^18.0.0 || ^19.0.0
+  checksum: 5eae2b0693cbb349242993bee9bcc82b59bf53b9429a5101736695ae64ab55be6b37e38fb26ac7288fb12e6ec2436da0a0aaddb2e11ffd3b3f06348a43edd5c4
   languageName: node
   linkType: hard
 
-"@radix-ui/react-use-rect@npm:1.1.0":
-  version: 1.1.0
-  resolution: "@radix-ui/react-use-rect@npm:1.1.0"
+"@react-aria/radio@npm:^3.10.9":
+  version: 3.10.9
+  resolution: "@react-aria/radio@npm:3.10.9"
   dependencies:
-    "@radix-ui/rect": 1.1.0
+    "@react-aria/focus": ^3.18.4
+    "@react-aria/form": ^3.0.10
+    "@react-aria/i18n": ^3.12.3
+    "@react-aria/interactions": ^3.22.4
+    "@react-aria/label": ^3.7.12
+    "@react-aria/utils": ^3.25.3
+    "@react-stately/radio": ^3.10.8
+    "@react-types/radio": ^3.8.4
+    "@react-types/shared": ^3.25.0
+    "@swc/helpers": ^0.5.0
   peerDependencies:
-    "@types/react": "*"
-    react: ^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc
-  peerDependenciesMeta:
-    "@types/react":
-      optional: true
-  checksum: c2e30150ab49e2cec238cda306fd748c3d47fb96dcff69a3b08e1d19108d80bac239d48f1747a25dadca614e3e967267d43b91e60ea59db2befbc7bea913ff84
+    react: ^16.8.0 || ^17.0.0-rc.1 || ^18.0.0 || ^19.0.0
+  checksum: 1b6251b8c020f16b8d4ce0710323f52efd4bbc408789757a54dde2cd59fe5601b76c571b8f1f5b00e7680457e2f6766e1a3f55d4153685c4880e09b5933e63a0
   languageName: node
   linkType: hard
 
-"@radix-ui/react-use-size@npm:1.1.0":
-  version: 1.1.0
-  resolution: "@radix-ui/react-use-size@npm:1.1.0"
+"@react-aria/searchfield@npm:^3.7.10":
+  version: 3.7.10
+  resolution: "@react-aria/searchfield@npm:3.7.10"
   dependencies:
-    "@radix-ui/react-use-layout-effect": 1.1.0
-  peerDependencies:
-    "@types/react": "*"
-    react: ^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc
-  peerDependenciesMeta:
-    "@types/react":
-      optional: true
-  checksum: 4c8b89037597fdc1824d009e0c941b510c7c6c30f83024cc02c934edd748886786e7d9f36f57323b02ad29833e7fa7e8974d81969b4ab33d8f41661afa4f30a6
+    "@react-aria/i18n": ^3.12.3
+    "@react-aria/textfield": ^3.14.10
+    "@react-aria/utils": ^3.25.3
+    "@react-stately/searchfield": ^3.5.7
+    "@react-types/button": ^3.10.0
+    "@react-types/searchfield": ^3.5.9
+    "@react-types/shared": ^3.25.0
+    "@swc/helpers": ^0.5.0
+  peerDependencies:
+    react: ^16.8.0 || ^17.0.0-rc.1 || ^18.0.0 || ^19.0.0
+  checksum: 1ae7fab9f6bc473ccc8d2762c4d07ffbbdd45366b1fe7fa282c14354eac8e427bebb0dde20e1cb92e4a2cd769f9f3872a5712c53763706b6414d024fa5275732
   languageName: node
   linkType: hard
 
-"@radix-ui/react-visually-hidden@npm:1.1.1":
-  version: 1.1.1
-  resolution: "@radix-ui/react-visually-hidden@npm:1.1.1"
+"@react-aria/select@npm:^3.14.11":
+  version: 3.14.11
+  resolution: "@react-aria/select@npm:3.14.11"
   dependencies:
-    "@radix-ui/react-primitive": 2.0.1
+    "@react-aria/form": ^3.0.10
+    "@react-aria/i18n": ^3.12.3
+    "@react-aria/interactions": ^3.22.4
+    "@react-aria/label": ^3.7.12
+    "@react-aria/listbox": ^3.13.5
+    "@react-aria/menu": ^3.15.5
+    "@react-aria/selection": ^3.20.1
+    "@react-aria/utils": ^3.25.3
+    "@react-aria/visually-hidden": ^3.8.17
+    "@react-stately/select": ^3.6.8
+    "@react-types/button": ^3.10.0
+    "@react-types/select": ^3.9.7
+    "@react-types/shared": ^3.25.0
+    "@swc/helpers": ^0.5.0
   peerDependencies:
-    "@types/react": "*"
-    "@types/react-dom": "*"
-    react: ^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc
-    react-dom: ^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc
-  peerDependenciesMeta:
-    "@types/react":
-      optional: true
-    "@types/react-dom":
-      optional: true
-  checksum: 9a34b8e09dc79983626194fdfb4bd24c79060034a226153a2bd9f726f056139316e7a6360583567c6ccd5d9589e6d230fe2c436abea455f73e2d27b73412c412
+    react: ^16.8.0 || ^17.0.0-rc.1 || ^18.0.0 || ^19.0.0
+    react-dom: ^16.8.0 || ^17.0.0-rc.1 || ^18.0.0 || ^19.0.0
+  checksum: b8c2e24a2713367938514c1d47817943bf1677bf4a29e5f5f695e1e9e708a93dde465de8d06babf276bc7face7938b280fd603af4b77d1068e9ce5b85a7cefd6
   languageName: node
   linkType: hard
 
-"@radix-ui/rect@npm:1.1.0":
-  version: 1.1.0
-  resolution: "@radix-ui/rect@npm:1.1.0"
-  checksum: a26ff7f8708fb5f2f7949baad70a6b2a597d761ee4dd4aadaf1c1a33ea82ea23dfef6ce6366a08310c5d008cdd60b2e626e4ee03fa342bd5f246ddd9d427f6be
+"@react-aria/selection@npm:^3.20.1":
+  version: 3.20.1
+  resolution: "@react-aria/selection@npm:3.20.1"
+  dependencies:
+    "@react-aria/focus": ^3.18.4
+    "@react-aria/i18n": ^3.12.3
+    "@react-aria/interactions": ^3.22.4
+    "@react-aria/utils": ^3.25.3
+    "@react-stately/selection": ^3.17.0
+    "@react-types/shared": ^3.25.0
+    "@swc/helpers": ^0.5.0
+  peerDependencies:
+    react: ^16.8.0 || ^17.0.0-rc.1 || ^18.0.0 || ^19.0.0
+    react-dom: ^16.8.0 || ^17.0.0-rc.1 || ^18.0.0 || ^19.0.0
+  checksum: 44e10f4e4952e5fbb15071bbaa1ccafcb91b6168a8ac6eb1e0f4e1036014527ea3c0e363a7f552ca923b6929f9a5e2495bb454ad9cd4c64003d650115b5e637a
   languageName: node
   linkType: hard
 
-"@react-aria/breadcrumbs@npm:^3.5.18":
-  version: 3.5.18
-  resolution: "@react-aria/breadcrumbs@npm:3.5.18"
+"@react-aria/separator@npm:^3.4.3":
+  version: 3.4.3
+  resolution: "@react-aria/separator@npm:3.4.3"
   dependencies:
-    "@react-aria/i18n": ^3.12.3
-    "@react-aria/link": ^3.7.6
     "@react-aria/utils": ^3.25.3
-    "@react-types/breadcrumbs": ^3.7.8
     "@react-types/shared": ^3.25.0
     "@swc/helpers": ^0.5.0
   peerDependencies:
     react: ^16.8.0 || ^17.0.0-rc.1 || ^18.0.0 || ^19.0.0
-  checksum: 33e50a04c1d2b8efb91194ecac6f087051f4138c13fd182675eab311175bb637c09aa1f7ee1fedaf87e24b7b601b7d5d3ff4bb23d87d70c776eeff84006d5388
+  checksum: 322b7135944d0a941e65cc5756153e8e0aa60af102572f988d14add4cdfd7e727a133f0c3a86b69333f08da2f606f03d6d590483e986b79e649562f46cdb4836
   languageName: node
   linkType: hard
 
-"@react-aria/button@npm:^3.10.1":
-  version: 3.10.1
-  resolution: "@react-aria/button@npm:3.10.1"
+"@react-aria/slider@npm:^3.7.13":
+  version: 3.7.13
+  resolution: "@react-aria/slider@npm:3.7.13"
   dependencies:
     "@react-aria/focus": ^3.18.4
+    "@react-aria/i18n": ^3.12.3
     "@react-aria/interactions": ^3.22.4
+    "@react-aria/label": ^3.7.12
     "@react-aria/utils": ^3.25.3
-    "@react-stately/toggle": ^3.7.8
-    "@react-types/button": ^3.10.0
+    "@react-stately/slider": ^3.5.8
     "@react-types/shared": ^3.25.0
+    "@react-types/slider": ^3.7.6
     "@swc/helpers": ^0.5.0
   peerDependencies:
     react: ^16.8.0 || ^17.0.0-rc.1 || ^18.0.0 || ^19.0.0
-  checksum: 9d35405c008043a7e7314d79c23805642d96742f32e464c05d3bf5417c04e8d70cc395e675dd4133849e08939fdd42eb757168124b0f8a713800eca501c22809
+  checksum: 6256790404e7ab67ea64c613b491fad3e9cd4315a6fe2fa72b2271eb5f0254bb39c5cbd5f9896119714fcb94f515c33c3c6ca8195aaf3b0fd5e5f6d49d7c8bd3
   languageName: node
   linkType: hard
 
-"@react-aria/calendar@npm:^3.5.13":
-  version: 3.5.13
-  resolution: "@react-aria/calendar@npm:3.5.13"
+"@react-aria/spinbutton@npm:^3.6.9":
+  version: 3.6.9
+  resolution: "@react-aria/spinbutton@npm:3.6.9"
   dependencies:
-    "@internationalized/date": ^3.5.6
     "@react-aria/i18n": ^3.12.3
-    "@react-aria/interactions": ^3.22.4
     "@react-aria/live-announcer": ^3.4.0
     "@react-aria/utils": ^3.25.3
-    "@react-stately/calendar": ^3.5.5
     "@react-types/button": ^3.10.0
-    "@react-types/calendar": ^3.4.10
     "@react-types/shared": ^3.25.0
     "@swc/helpers": ^0.5.0
   peerDependencies:
     react: ^16.8.0 || ^17.0.0-rc.1 || ^18.0.0 || ^19.0.0
     react-dom: ^16.8.0 || ^17.0.0-rc.1 || ^18.0.0 || ^19.0.0
-  checksum: 10f30f6cfdf81d38b48cb40368b141b50cc270ed39bf0240e501b207433bd7324293123bd8d0f49e868e51702b6eed9fc6da9601eb90354bb5e2db631c7089d9
+  checksum: c15434d8c7c058ca39634b9a2350915967cf8d59e19101fc5e243f6a0b3b6971e9bb265aee07b3bbfb68ce207a3affea8924db2bd850705a7b2163f946d82f34
   languageName: node
   linkType: hard
 
-"@react-aria/checkbox@npm:^3.14.8":
-  version: 3.14.8
-  resolution: "@react-aria/checkbox@npm:3.14.8"
+"@react-aria/ssr@npm:^3.9.6":
+  version: 3.9.6
+  resolution: "@react-aria/ssr@npm:3.9.6"
+  dependencies:
+    "@swc/helpers": ^0.5.0
+  peerDependencies:
+    react: ^16.8.0 || ^17.0.0-rc.1 || ^18.0.0 || ^19.0.0
+  checksum: be52f2909035e093d3f72cccde15b66b4eef2dc30c71dac46a1ea43d3847dace1a709114640bfa3e9aa72ba716749635fb72116f4da16f7d80248ca348146456
+  languageName: node
+  linkType: hard
+
+"@react-aria/switch@npm:^3.6.9":
+  version: 3.6.9
+  resolution: "@react-aria/switch@npm:3.6.9"
   dependencies:
-    "@react-aria/form": ^3.0.10
-    "@react-aria/interactions": ^3.22.4
-    "@react-aria/label": ^3.7.12
     "@react-aria/toggle": ^3.10.9
-    "@react-aria/utils": ^3.25.3
-    "@react-stately/checkbox": ^3.6.9
-    "@react-stately/form": ^3.0.6
     "@react-stately/toggle": ^3.7.8
-    "@react-types/checkbox": ^3.8.4
     "@react-types/shared": ^3.25.0
+    "@react-types/switch": ^3.5.6
     "@swc/helpers": ^0.5.0
   peerDependencies:
     react: ^16.8.0 || ^17.0.0-rc.1 || ^18.0.0 || ^19.0.0
-  checksum: 96ac21b5c6ede1ce0545e27dbefb20df88cd06f24c0ed2c2fb44383bcf632aa33096c70ffca59f8bc68c7e5e4f71293a975e6bd5dc65077ca70991f651a56992
+  checksum: 94000e6527b3889433d96571f8d7ce32a64b978fc7640d2a8f43ee38cebd3a13149a66512d54485c5f7c8769d5a7de2d4847ffc6130655f37cc7fbd70bd99bc0
   languageName: node
   linkType: hard
 
-"@react-aria/color@npm:^3.0.1":
-  version: 3.0.1
-  resolution: "@react-aria/color@npm:3.0.1"
+"@react-aria/table@npm:^3.15.5":
+  version: 3.15.5
+  resolution: "@react-aria/table@npm:3.15.5"
   dependencies:
+    "@react-aria/focus": ^3.18.4
+    "@react-aria/grid": ^3.10.5
     "@react-aria/i18n": ^3.12.3
     "@react-aria/interactions": ^3.22.4
-    "@react-aria/numberfield": ^3.11.8
-    "@react-aria/slider": ^3.7.13
-    "@react-aria/spinbutton": ^3.6.9
-    "@react-aria/textfield": ^3.14.10
+    "@react-aria/live-announcer": ^3.4.0
     "@react-aria/utils": ^3.25.3
     "@react-aria/visually-hidden": ^3.8.17
-    "@react-stately/color": ^3.8.0
-    "@react-stately/form": ^3.0.6
-    "@react-types/color": ^3.0.0
+    "@react-stately/collections": ^3.11.0
+    "@react-stately/flags": ^3.0.4
+    "@react-stately/table": ^3.12.3
+    "@react-types/checkbox": ^3.8.4
+    "@react-types/grid": ^3.2.9
     "@react-types/shared": ^3.25.0
+    "@react-types/table": ^3.10.2
     "@swc/helpers": ^0.5.0
   peerDependencies:
     react: ^16.8.0 || ^17.0.0-rc.1 || ^18.0.0 || ^19.0.0
     react-dom: ^16.8.0 || ^17.0.0-rc.1 || ^18.0.0 || ^19.0.0
-  checksum: ee4969e6f28a765abee0ba519ad9c77b9910d76ec3c327403d8b901db750ed4daa32be2d1ea62d760f0e4dc4f51aa02c02c0481f4b00a40380d4dccf7a895a38
+  checksum: 54a8794f9842082aef5ce9b36e21cb125b02e6792c38c40d1a65f25ba62362c4adc17a7db220672e1b65f515aedfe1a55eb9b70b7ce7d9c0fb75f4da16e4a8eb
   languageName: node
   linkType: hard
 
-"@react-aria/combobox@npm:^3.10.5":
-  version: 3.10.5
-  resolution: "@react-aria/combobox@npm:3.10.5"
+"@react-aria/tabs@npm:^3.9.7":
+  version: 3.9.7
+  resolution: "@react-aria/tabs@npm:3.9.7"
   dependencies:
+    "@react-aria/focus": ^3.18.4
     "@react-aria/i18n": ^3.12.3
-    "@react-aria/listbox": ^3.13.5
-    "@react-aria/live-announcer": ^3.4.0
-    "@react-aria/menu": ^3.15.5
-    "@react-aria/overlays": ^3.23.4
     "@react-aria/selection": ^3.20.1
-    "@react-aria/textfield": ^3.14.10
     "@react-aria/utils": ^3.25.3
-    "@react-stately/collections": ^3.11.0
-    "@react-stately/combobox": ^3.10.0
-    "@react-stately/form": ^3.0.6
-    "@react-types/button": ^3.10.0
-    "@react-types/combobox": ^3.13.0
+    "@react-stately/tabs": ^3.6.10
     "@react-types/shared": ^3.25.0
+    "@react-types/tabs": ^3.3.10
     "@swc/helpers": ^0.5.0
   peerDependencies:
     react: ^16.8.0 || ^17.0.0-rc.1 || ^18.0.0 || ^19.0.0
     react-dom: ^16.8.0 || ^17.0.0-rc.1 || ^18.0.0 || ^19.0.0
-  checksum: 420c3de273014e4de38f823b0e7415f8eb648b97293e7169967ffce35133a37eca94288bd2adc636f892ed2da42150bc5b41d85b97a6a545c141cf2ad8ca1cbc
+  checksum: 0e079c0e803b94efcb5f30444a888322d614e577c462eb2e7a4a0170aa92fea6e21cdbf041d5efdfab0b0c50ec287dc8032afe4b52b4f77489fa9ec4866837a2
   languageName: node
   linkType: hard
 
-"@react-aria/datepicker@npm:^3.11.4":
-  version: 3.11.4
-  resolution: "@react-aria/datepicker@npm:3.11.4"
+"@react-aria/tag@npm:^3.4.7":
+  version: 3.4.7
+  resolution: "@react-aria/tag@npm:3.4.7"
   dependencies:
-    "@internationalized/date": ^3.5.6
-    "@internationalized/number": ^3.5.4
-    "@internationalized/string": ^3.2.4
-    "@react-aria/focus": ^3.18.4
-    "@react-aria/form": ^3.0.10
+    "@react-aria/gridlist": ^3.9.5
     "@react-aria/i18n": ^3.12.3
     "@react-aria/interactions": ^3.22.4
     "@react-aria/label": ^3.7.12
-    "@react-aria/spinbutton": ^3.6.9
+    "@react-aria/selection": ^3.20.1
     "@react-aria/utils": ^3.25.3
-    "@react-stately/datepicker": ^3.10.3
-    "@react-stately/form": ^3.0.6
+    "@react-stately/list": ^3.11.0
     "@react-types/button": ^3.10.0
-    "@react-types/calendar": ^3.4.10
-    "@react-types/datepicker": ^3.8.3
-    "@react-types/dialog": ^3.5.13
     "@react-types/shared": ^3.25.0
     "@swc/helpers": ^0.5.0
   peerDependencies:
     react: ^16.8.0 || ^17.0.0-rc.1 || ^18.0.0 || ^19.0.0
     react-dom: ^16.8.0 || ^17.0.0-rc.1 || ^18.0.0 || ^19.0.0
-  checksum: 4df110dcc84f22948210dc0d996569593283017857fa848c553a7848849609922c6ba34e44698390fe192a29f9c6bf428c8beb49f449c83640c62442b86014cd
+  checksum: 869e26288a2d3c90cc8027342f70dc1ec0146d6ec5ebe62c7b06eb48390e1d1a71083ca6de7147353764bc566a7f6dfad2666e6d378afa6cf53acb586e1019b1
   languageName: node
   linkType: hard
 
-"@react-aria/dialog@npm:^3.5.19":
-  version: 3.5.19
-  resolution: "@react-aria/dialog@npm:3.5.19"
+"@react-aria/textfield@npm:^3.14.10":
+  version: 3.14.10
+  resolution: "@react-aria/textfield@npm:3.14.10"
   dependencies:
     "@react-aria/focus": ^3.18.4
-    "@react-aria/overlays": ^3.23.4
+    "@react-aria/form": ^3.0.10
+    "@react-aria/label": ^3.7.12
     "@react-aria/utils": ^3.25.3
-    "@react-types/dialog": ^3.5.13
+    "@react-stately/form": ^3.0.6
+    "@react-stately/utils": ^3.10.4
     "@react-types/shared": ^3.25.0
+    "@react-types/textfield": ^3.9.7
     "@swc/helpers": ^0.5.0
   peerDependencies:
     react: ^16.8.0 || ^17.0.0-rc.1 || ^18.0.0 || ^19.0.0
-    react-dom: ^16.8.0 || ^17.0.0-rc.1 || ^18.0.0 || ^19.0.0
-  checksum: a93699d76c0756fe9723f86a5b4db3af10f2bd042e769c5907cca430e49eee0ccac56859c61736eead8a67d0c8a254f0244d29a5773d603ef6bb53f5bf92fba6
+  checksum: 91b4d6ae47c6bf355ae9ff53626d6195afc3fe5852a7aa930b286fbe0804c13b79649ff1b220706cc7808b0e8c4ad3f4f1c04261b4a90abb79f3bb83c033c5e5
   languageName: node
   linkType: hard
 
-"@react-aria/dnd@npm:^3.7.4":
-  version: 3.7.4
-  resolution: "@react-aria/dnd@npm:3.7.4"
+"@react-aria/toggle@npm:^3.10.9":
+  version: 3.10.9
+  resolution: "@react-aria/toggle@npm:3.10.9"
   dependencies:
-    "@internationalized/string": ^3.2.4
-    "@react-aria/i18n": ^3.12.3
+    "@react-aria/focus": ^3.18.4
     "@react-aria/interactions": ^3.22.4
-    "@react-aria/live-announcer": ^3.4.0
-    "@react-aria/overlays": ^3.23.4
     "@react-aria/utils": ^3.25.3
-    "@react-stately/dnd": ^3.4.3
-    "@react-types/button": ^3.10.0
+    "@react-stately/toggle": ^3.7.8
+    "@react-types/checkbox": ^3.8.4
     "@react-types/shared": ^3.25.0
     "@swc/helpers": ^0.5.0
   peerDependencies:
     react: ^16.8.0 || ^17.0.0-rc.1 || ^18.0.0 || ^19.0.0
-    react-dom: ^16.8.0 || ^17.0.0-rc.1 || ^18.0.0 || ^19.0.0
-  checksum: 2c3619b2297d4f3f2974565835a15b853d9fe8631d6c02db664d3bad21e3b6126026999541fc98dc8f253684747406fcb55ac28f4ab3acac6f18de152ae4c1c6
+  checksum: 057302ef08413cc7bfdde96102da734610294aef19c91d6bae8accf2dfc3ffd976dd531c5d42c6aa955e44da92b46f51667488ae0a48718370d449b6dc0f84e4
   languageName: node
   linkType: hard
 
-"@react-aria/focus@npm:^3.18.4":
-  version: 3.18.4
-  resolution: "@react-aria/focus@npm:3.18.4"
+"@react-aria/tooltip@npm:^3.7.9":
+  version: 3.7.9
+  resolution: "@react-aria/tooltip@npm:3.7.9"
   dependencies:
+    "@react-aria/focus": ^3.18.4
     "@react-aria/interactions": ^3.22.4
     "@react-aria/utils": ^3.25.3
+    "@react-stately/tooltip": ^3.4.13
+    "@react-types/shared": ^3.25.0
+    "@react-types/tooltip": ^3.4.12
+    "@swc/helpers": ^0.5.0
+  peerDependencies:
+    react: ^16.8.0 || ^17.0.0-rc.1 || ^18.0.0 || ^19.0.0
+  checksum: 1db345fe35462ddce880ea28bf0dcf6d320ed5e7ce96d0b836a8d3a00c35a88eef037e0e9e1601bdf516ae8c5c6ea0e9190b849499ee9146b7de9b70062f8d13
+  languageName: node
+  linkType: hard
+
+"@react-aria/utils@npm:^3.25.3":
+  version: 3.25.3
+  resolution: "@react-aria/utils@npm:3.25.3"
+  dependencies:
+    "@react-aria/ssr": ^3.9.6
+    "@react-stately/utils": ^3.10.4
     "@react-types/shared": ^3.25.0
     "@swc/helpers": ^0.5.0
     clsx: ^2.0.0
   peerDependencies:
     react: ^16.8.0 || ^17.0.0-rc.1 || ^18.0.0 || ^19.0.0
-  checksum: 141f8ef80060c5b58384af4af9446c0792618671e9f963942c3edc29bb15b7eb0ebb62cbe118135c7379c2732e86071aa7d7c890903a0ae411be07f2ec854e6a
+  checksum: dc86ea48c24232f5c51d0b5317d947c4ccf01a8afb3bdc89cb880a7b0a695a04c8a7c615fb190664f4f3c7da8669ab2bd2f7cdfb2861339f5816cbd600249a84
   languageName: node
   linkType: hard
 
-"@react-aria/form@npm:^3.0.10":
-  version: 3.0.10
-  resolution: "@react-aria/form@npm:3.0.10"
+"@react-aria/visually-hidden@npm:^3.8.17":
+  version: 3.8.17
+  resolution: "@react-aria/visually-hidden@npm:3.8.17"
   dependencies:
     "@react-aria/interactions": ^3.22.4
     "@react-aria/utils": ^3.25.3
-    "@react-stately/form": ^3.0.6
     "@react-types/shared": ^3.25.0
     "@swc/helpers": ^0.5.0
   peerDependencies:
     react: ^16.8.0 || ^17.0.0-rc.1 || ^18.0.0 || ^19.0.0
-  checksum: 31ed3c2a2eb8340f38e9164bf2730ece07563178975aaff55c2e58ed307943071b105dd0503bf31a9fe17e085ef3db52f935636b04365e26194649f0c87f8c5e
+  checksum: 411699c167686509583debc659e734ec3c123198570104abbd4fe74a5a60d93a305d73f6d761ec67846c672d1076d8f089a6f90d2e2653e1a334fe7344088bd5
   languageName: node
   linkType: hard
 
-"@react-aria/grid@npm:^3.10.5":
-  version: 3.10.5
-  resolution: "@react-aria/grid@npm:3.10.5"
+"@react-hook/latest@npm:^1.0.2":
+  version: 1.0.3
+  resolution: "@react-hook/latest@npm:1.0.3"
+  peerDependencies:
+    react: ">=16.8"
+  checksum: d6a166c21121da519a516e8089ba28a2779d37b6017732ab55476c0d354754ad215394135765254f8752a7c6661c3fb868d088769a644848602f00f8821248ed
+  languageName: node
+  linkType: hard
+
+"@react-hook/passive-layout-effect@npm:^1.2.0":
+  version: 1.2.1
+  resolution: "@react-hook/passive-layout-effect@npm:1.2.1"
+  peerDependencies:
+    react: ">=16.8"
+  checksum: 5c9e6b3df1c91fc2b1d4f711ca96b5f8cb3f6a13a2e97dac7cce623e58d7ee57999c45db3778d0af0b2522b3a5b7463232ef21cb3ee9900437172d48f766d933
+  languageName: node
+  linkType: hard
+
+"@react-hook/resize-observer@npm:^1.2.6":
+  version: 1.2.6
+  resolution: "@react-hook/resize-observer@npm:1.2.6"
   dependencies:
-    "@react-aria/focus": ^3.18.4
-    "@react-aria/i18n": ^3.12.3
-    "@react-aria/interactions": ^3.22.4
-    "@react-aria/live-announcer": ^3.4.0
-    "@react-aria/selection": ^3.20.1
-    "@react-aria/utils": ^3.25.3
-    "@react-stately/collections": ^3.11.0
-    "@react-stately/grid": ^3.9.3
-    "@react-stately/selection": ^3.17.0
-    "@react-types/checkbox": ^3.8.4
-    "@react-types/grid": ^3.2.9
-    "@react-types/shared": ^3.25.0
-    "@swc/helpers": ^0.5.0
+    "@juggle/resize-observer": ^3.3.1
+    "@react-hook/latest": ^1.0.2
+    "@react-hook/passive-layout-effect": ^1.2.0
   peerDependencies:
-    react: ^16.8.0 || ^17.0.0-rc.1 || ^18.0.0 || ^19.0.0
-    react-dom: ^16.8.0 || ^17.0.0-rc.1 || ^18.0.0 || ^19.0.0
-  checksum: d85110a3df794a8df38ea1b52b7f575c1a4e31a4f4f6989c80c25099e6a020e1a290436febc846dbd0397db42b55a5d1e4028341808a9cbc82e92401acde5973
+    react: ">=16.8"
+  checksum: 6ebe4ded4dc4602906c4c727871f93ea73754dd5758f90d50e5fc7382b1844324a46a4c2e0842d8ad5bf95886091ba8a0c9d3a1ef0f10bd0c9e011ecd7aeea42
   languageName: node
   linkType: hard
 
-"@react-aria/gridlist@npm:^3.9.5":
-  version: 3.9.5
-  resolution: "@react-aria/gridlist@npm:3.9.5"
+"@react-hook/resize-observer@npm:^2.0.2":
+  version: 2.0.2
+  resolution: "@react-hook/resize-observer@npm:2.0.2"
   dependencies:
-    "@react-aria/focus": ^3.18.4
-    "@react-aria/grid": ^3.10.5
-    "@react-aria/i18n": ^3.12.3
-    "@react-aria/interactions": ^3.22.4
-    "@react-aria/selection": ^3.20.1
-    "@react-aria/utils": ^3.25.3
-    "@react-stately/collections": ^3.11.0
-    "@react-stately/list": ^3.11.0
-    "@react-stately/tree": ^3.8.5
-    "@react-types/shared": ^3.25.0
-    "@swc/helpers": ^0.5.0
+    "@react-hook/latest": ^1.0.2
+    "@react-hook/passive-layout-effect": ^1.2.0
   peerDependencies:
-    react: ^16.8.0 || ^17.0.0-rc.1 || ^18.0.0 || ^19.0.0
-    react-dom: ^16.8.0 || ^17.0.0-rc.1 || ^18.0.0 || ^19.0.0
-  checksum: d9ceb8df29f9d6f9cae123b6227313915aea9fd40543afb83ddee3f8a31fc5bceae4eb28a64fa5345dc7285b64adcc1dddfc60c28cc071782e681adf717b7879
+    react: ">=18"
+  checksum: a88f088bd5b87fea80daca391bdea9823dc38651bd112f0c607b057d9c8381f37395cf5a01a79ba7ab24369c4b48acf912cfef0244e6610d72ea3074415e9c32
   languageName: node
   linkType: hard
 
-"@react-aria/i18n@npm:^3.12.3":
-  version: 3.12.3
-  resolution: "@react-aria/i18n@npm:3.12.3"
+"@react-stately/calendar@npm:^3.5.5":
+  version: 3.5.5
+  resolution: "@react-stately/calendar@npm:3.5.5"
   dependencies:
     "@internationalized/date": ^3.5.6
-    "@internationalized/message": ^3.1.5
-    "@internationalized/number": ^3.5.4
-    "@internationalized/string": ^3.2.4
-    "@react-aria/ssr": ^3.9.6
-    "@react-aria/utils": ^3.25.3
+    "@react-stately/utils": ^3.10.4
+    "@react-types/calendar": ^3.4.10
     "@react-types/shared": ^3.25.0
     "@swc/helpers": ^0.5.0
   peerDependencies:
     react: ^16.8.0 || ^17.0.0-rc.1 || ^18.0.0 || ^19.0.0
-  checksum: 98210abb15d598a6e4a35eae6df1d70ae6376ef9a5e1c3d298e03f4cc006df696785006323fa97ac57ce14c5b5c8d108690a5c2b187624cad5956778ffc25ca9
+  checksum: ff38c8fb4178d965db8569980756d864e9a0341fca60bccc76d4fe34645375a2ed32a533097426f9f1892fe99bce32d5ec00a3e8ce9acbdfc6b7f2e82012d4de
   languageName: node
   linkType: hard
 
-"@react-aria/interactions@npm:^3.22.4":
-  version: 3.22.4
-  resolution: "@react-aria/interactions@npm:3.22.4"
+"@react-stately/checkbox@npm:^3.6.9":
+  version: 3.6.9
+  resolution: "@react-stately/checkbox@npm:3.6.9"
   dependencies:
-    "@react-aria/ssr": ^3.9.6
-    "@react-aria/utils": ^3.25.3
+    "@react-stately/form": ^3.0.6
+    "@react-stately/utils": ^3.10.4
+    "@react-types/checkbox": ^3.8.4
     "@react-types/shared": ^3.25.0
     "@swc/helpers": ^0.5.0
   peerDependencies:
     react: ^16.8.0 || ^17.0.0-rc.1 || ^18.0.0 || ^19.0.0
-  checksum: 8455a68540a4085b71ed034cad5c349a7e756e44cd30d69d340d7f7a66ce1886882021fbcc8049a5d8aeba54b47cd2ca49a7bc4e6910aab2d13b41703d55c7a5
+  checksum: 068be8d5c743b0ac3f0a96863568401027035b20a32caaa220600172f6ed0f93a49d58cfc4a960befd4762aa1eab18e2c30bd3656157729b4e3944156aeebd6c
   languageName: node
   linkType: hard
 
-"@react-aria/label@npm:^3.7.12":
-  version: 3.7.12
-  resolution: "@react-aria/label@npm:3.7.12"
+"@react-stately/collections@npm:^3.11.0":
+  version: 3.11.0
+  resolution: "@react-stately/collections@npm:3.11.0"
   dependencies:
-    "@react-aria/utils": ^3.25.3
     "@react-types/shared": ^3.25.0
     "@swc/helpers": ^0.5.0
   peerDependencies:
     react: ^16.8.0 || ^17.0.0-rc.1 || ^18.0.0 || ^19.0.0
-  checksum: 28a8a04c788df9fb776565974a1c20bf01067d3d9a1f6cbeb184859c7e8893a64809bbcd1af9d765039ee30da96ecbce75c7d2d37bddb54cf4e709ab2d7afcca
+  checksum: aba7d2194f4db8ee1ad5ad708a34d9bb336d3fd1fcb837cb237c6b63e1537003592eb6d33d80d1a6a313613e594d8d4a9da779c00d7fa3470f4adb5ff227150f
   languageName: node
   linkType: hard
 
-"@react-aria/link@npm:^3.7.6":
-  version: 3.7.6
-  resolution: "@react-aria/link@npm:3.7.6"
+"@react-stately/color@npm:^3.8.0":
+  version: 3.8.0
+  resolution: "@react-stately/color@npm:3.8.0"
   dependencies:
-    "@react-aria/focus": ^3.18.4
-    "@react-aria/interactions": ^3.22.4
-    "@react-aria/utils": ^3.25.3
-    "@react-types/link": ^3.5.8
+    "@internationalized/number": ^3.5.4
+    "@internationalized/string": ^3.2.4
+    "@react-aria/i18n": ^3.12.3
+    "@react-stately/form": ^3.0.6
+    "@react-stately/numberfield": ^3.9.7
+    "@react-stately/slider": ^3.5.8
+    "@react-stately/utils": ^3.10.4
+    "@react-types/color": ^3.0.0
     "@react-types/shared": ^3.25.0
     "@swc/helpers": ^0.5.0
   peerDependencies:
     react: ^16.8.0 || ^17.0.0-rc.1 || ^18.0.0 || ^19.0.0
-  checksum: 81e3f3b53648ac4223e3c673a13c592c24895202b39255bb16bd2b39bcc9dff4b5ad2f6ed69029228ada20941eefd89060fe1761e6658eefcdbb28019fa1818a
+  checksum: cb0acc88713c9a4271a1445c963c11a8d6cfaa2127894dc810783bc04cc288f1d143679a3b10612abf3cbb1a9871115f4e51745d707825879a454df2c7114609
   languageName: node
   linkType: hard
 
-"@react-aria/listbox@npm:^3.13.5":
-  version: 3.13.5
-  resolution: "@react-aria/listbox@npm:3.13.5"
+"@react-stately/combobox@npm:^3.10.0":
+  version: 3.10.0
+  resolution: "@react-stately/combobox@npm:3.10.0"
   dependencies:
-    "@react-aria/interactions": ^3.22.4
-    "@react-aria/label": ^3.7.12
-    "@react-aria/selection": ^3.20.1
-    "@react-aria/utils": ^3.25.3
     "@react-stately/collections": ^3.11.0
+    "@react-stately/form": ^3.0.6
     "@react-stately/list": ^3.11.0
-    "@react-types/listbox": ^3.5.2
+    "@react-stately/overlays": ^3.6.11
+    "@react-stately/select": ^3.6.8
+    "@react-stately/utils": ^3.10.4
+    "@react-types/combobox": ^3.13.0
     "@react-types/shared": ^3.25.0
     "@swc/helpers": ^0.5.0
   peerDependencies:
     react: ^16.8.0 || ^17.0.0-rc.1 || ^18.0.0 || ^19.0.0
-    react-dom: ^16.8.0 || ^17.0.0-rc.1 || ^18.0.0 || ^19.0.0
-  checksum: 877c86bfe63b4b75a3bf75db7c275006d7341a4933b37dc57f996d1c9f230c4ca0a6f68960938b445bb5ed3af23787b1f7a818d783d4e7188a0b891b74215bdc
+  checksum: a9ce1a4fd03d40d43f4914c8d079b1bfc40a73643067ca57c8fbc84faa5818217df2c842e4c5e94bfb79c014ba55fc185c92c7b359fbfe84ff4078104361fab7
   languageName: node
   linkType: hard
 
-"@react-aria/live-announcer@npm:^3.4.0":
-  version: 3.4.0
-  resolution: "@react-aria/live-announcer@npm:3.4.0"
+"@react-stately/data@npm:^3.11.7":
+  version: 3.11.7
+  resolution: "@react-stately/data@npm:3.11.7"
   dependencies:
+    "@react-types/shared": ^3.25.0
     "@swc/helpers": ^0.5.0
-  checksum: d4815bbe453765013042299c295cba362147fe7634d4bdcfecffc3f7efbe84b83c820e9737ac90e127b4f8980aaea16f7f9876de516a6c05a42de0b5bf606b92
+  peerDependencies:
+    react: ^16.8.0 || ^17.0.0-rc.1 || ^18.0.0 || ^19.0.0
+  checksum: bd5d81e62a251501d71ed87c1e2869d22fb0fbe80d617e70fdba4755eea79c6f51a2f9aafacf99145a2a0bbac8f5aa082096e08b930f63a7196e83c18dab3d99
   languageName: node
   linkType: hard
 
-"@react-aria/menu@npm:^3.15.5":
-  version: 3.15.5
-  resolution: "@react-aria/menu@npm:3.15.5"
+"@react-stately/datepicker@npm:^3.10.3":
+  version: 3.10.3
+  resolution: "@react-stately/datepicker@npm:3.10.3"
   dependencies:
-    "@react-aria/focus": ^3.18.4
-    "@react-aria/i18n": ^3.12.3
-    "@react-aria/interactions": ^3.22.4
-    "@react-aria/overlays": ^3.23.4
-    "@react-aria/selection": ^3.20.1
-    "@react-aria/utils": ^3.25.3
-    "@react-stately/collections": ^3.11.0
-    "@react-stately/menu": ^3.8.3
-    "@react-stately/tree": ^3.8.5
-    "@react-types/button": ^3.10.0
-    "@react-types/menu": ^3.9.12
+    "@internationalized/date": ^3.5.6
+    "@internationalized/string": ^3.2.4
+    "@react-stately/form": ^3.0.6
+    "@react-stately/overlays": ^3.6.11
+    "@react-stately/utils": ^3.10.4
+    "@react-types/datepicker": ^3.8.3
     "@react-types/shared": ^3.25.0
     "@swc/helpers": ^0.5.0
   peerDependencies:
     react: ^16.8.0 || ^17.0.0-rc.1 || ^18.0.0 || ^19.0.0
-    react-dom: ^16.8.0 || ^17.0.0-rc.1 || ^18.0.0 || ^19.0.0
-  checksum: 466bfeb1e76056556c502b274bd69637fb06b02f43c28c076b47476e4289eeb30d1120a17d41fe11bdcb972cc4c1119b7f0efb1aad28efc570dc7524fc7c8b59
+  checksum: 74fa89a4b9d80343dc07a7bbabcf88962ea0afbddcfb5e24b5c97fffcb9596ec097fa4ddaf7c534c8ba96c83101f88237413d2b6f65a979653007c463c8e09c0
   languageName: node
   linkType: hard
 
-"@react-aria/meter@npm:^3.4.17":
-  version: 3.4.17
-  resolution: "@react-aria/meter@npm:3.4.17"
+"@react-stately/dnd@npm:^3.4.3":
+  version: 3.4.3
+  resolution: "@react-stately/dnd@npm:3.4.3"
   dependencies:
-    "@react-aria/progress": ^3.4.17
-    "@react-types/meter": ^3.4.4
+    "@react-stately/selection": ^3.17.0
     "@react-types/shared": ^3.25.0
     "@swc/helpers": ^0.5.0
   peerDependencies:
     react: ^16.8.0 || ^17.0.0-rc.1 || ^18.0.0 || ^19.0.0
-  checksum: d5b648664416f50448c34567df5f6c0c706014ab3d487869958e9f9b8d4a4fae5f5bc173edf4dd734d91ea9f6b7f7e853679baaf48926326d96ff8be2150ba0c
+  checksum: 06356b2f1c9e1e4f77135d79a00a7ddbceed6b09bf6d1681ddf710c88aab0063f1ca96afc814693f049e2f4e38b5c4071d1a47cde6e2b7ef676c0a0e838b74ea
   languageName: node
   linkType: hard
 
-"@react-aria/numberfield@npm:^3.11.8":
-  version: 3.11.8
-  resolution: "@react-aria/numberfield@npm:3.11.8"
+"@react-stately/flags@npm:^3.0.4":
+  version: 3.0.4
+  resolution: "@react-stately/flags@npm:3.0.4"
   dependencies:
-    "@react-aria/i18n": ^3.12.3
-    "@react-aria/interactions": ^3.22.4
-    "@react-aria/spinbutton": ^3.6.9
-    "@react-aria/textfield": ^3.14.10
-    "@react-aria/utils": ^3.25.3
-    "@react-stately/form": ^3.0.6
-    "@react-stately/numberfield": ^3.9.7
-    "@react-types/button": ^3.10.0
-    "@react-types/numberfield": ^3.8.6
-    "@react-types/shared": ^3.25.0
     "@swc/helpers": ^0.5.0
-  peerDependencies:
-    react: ^16.8.0 || ^17.0.0-rc.1 || ^18.0.0 || ^19.0.0
-    react-dom: ^16.8.0 || ^17.0.0-rc.1 || ^18.0.0 || ^19.0.0
-  checksum: a1f6e5d90e150f40902546212687850a9c50889726db0f28f0ec73a1fd8f427048f464677b389d620350817749e5d96b90e51bca639705ff141543adbe3b82e3
+  checksum: 363aacb4c8a9c091689a4fba2e1f0c0ca9040c9c722dae6388cbfde1952db0c808fe98e4ada6ecea89a9bf6288cf351f3f1cd54434fa6a8dccf8903e8b2085b9
   languageName: node
   linkType: hard
 
-"@react-aria/overlays@npm:^3.23.4":
-  version: 3.23.4
-  resolution: "@react-aria/overlays@npm:3.23.4"
+"@react-stately/form@npm:^3.0.6":
+  version: 3.0.6
+  resolution: "@react-stately/form@npm:3.0.6"
   dependencies:
-    "@react-aria/focus": ^3.18.4
-    "@react-aria/i18n": ^3.12.3
-    "@react-aria/interactions": ^3.22.4
-    "@react-aria/ssr": ^3.9.6
-    "@react-aria/utils": ^3.25.3
-    "@react-aria/visually-hidden": ^3.8.17
-    "@react-stately/overlays": ^3.6.11
-    "@react-types/button": ^3.10.0
-    "@react-types/overlays": ^3.8.10
     "@react-types/shared": ^3.25.0
     "@swc/helpers": ^0.5.0
   peerDependencies:
     react: ^16.8.0 || ^17.0.0-rc.1 || ^18.0.0 || ^19.0.0
-    react-dom: ^16.8.0 || ^17.0.0-rc.1 || ^18.0.0 || ^19.0.0
-  checksum: 174c8ef7d52123e8d979044dd36373314328086b2dc37a8b4f1fab8344be74c77925595dca86f720fd661eeffd5b632261f9a57e813d0f91460d1f08a090504e
+  checksum: ba8439dfb606abeedf4b90e0f3fa77d05ae1f0a898d800af419a3aaaf0b388259d09d109c138dbf6768120213870a63f6e604886fc6c11233f8da1668c086b22
   languageName: node
   linkType: hard
 
-"@react-aria/progress@npm:^3.4.17":
-  version: 3.4.17
-  resolution: "@react-aria/progress@npm:3.4.17"
+"@react-stately/grid@npm:^3.9.3":
+  version: 3.9.3
+  resolution: "@react-stately/grid@npm:3.9.3"
   dependencies:
-    "@react-aria/i18n": ^3.12.3
-    "@react-aria/label": ^3.7.12
-    "@react-aria/utils": ^3.25.3
-    "@react-types/progress": ^3.5.7
+    "@react-stately/collections": ^3.11.0
+    "@react-stately/selection": ^3.17.0
+    "@react-types/grid": ^3.2.9
     "@react-types/shared": ^3.25.0
     "@swc/helpers": ^0.5.0
   peerDependencies:
     react: ^16.8.0 || ^17.0.0-rc.1 || ^18.0.0 || ^19.0.0
-  checksum: 5eae2b0693cbb349242993bee9bcc82b59bf53b9429a5101736695ae64ab55be6b37e38fb26ac7288fb12e6ec2436da0a0aaddb2e11ffd3b3f06348a43edd5c4
+  checksum: cc8d420f1148dda47ed12b9cc318f4633c252abd99d88c75294ba6c4641dd5c39b3ccd8e21350768629b942d8762e08052d8b23ab80fbe5e1ed248faa719a647
   languageName: node
   linkType: hard
 
-"@react-aria/radio@npm:^3.10.9":
-  version: 3.10.9
-  resolution: "@react-aria/radio@npm:3.10.9"
+"@react-stately/list@npm:^3.11.0":
+  version: 3.11.0
+  resolution: "@react-stately/list@npm:3.11.0"
   dependencies:
-    "@react-aria/focus": ^3.18.4
-    "@react-aria/form": ^3.0.10
-    "@react-aria/i18n": ^3.12.3
-    "@react-aria/interactions": ^3.22.4
-    "@react-aria/label": ^3.7.12
-    "@react-aria/utils": ^3.25.3
-    "@react-stately/radio": ^3.10.8
-    "@react-types/radio": ^3.8.4
+    "@react-stately/collections": ^3.11.0
+    "@react-stately/selection": ^3.17.0
+    "@react-stately/utils": ^3.10.4
     "@react-types/shared": ^3.25.0
     "@swc/helpers": ^0.5.0
   peerDependencies:
     react: ^16.8.0 || ^17.0.0-rc.1 || ^18.0.0 || ^19.0.0
-  checksum: 1b6251b8c020f16b8d4ce0710323f52efd4bbc408789757a54dde2cd59fe5601b76c571b8f1f5b00e7680457e2f6766e1a3f55d4153685c4880e09b5933e63a0
+  checksum: 64731450c5d93997c8b1ce51b3eedc1fc9b1eb7814324d56fc459bf708dbb4e052f880bb02d116af6c0544ff4e9f1c347acd99878efa501614e74fd910409a32
   languageName: node
   linkType: hard
 
-"@react-aria/searchfield@npm:^3.7.10":
-  version: 3.7.10
-  resolution: "@react-aria/searchfield@npm:3.7.10"
+"@react-stately/menu@npm:^3.8.3":
+  version: 3.8.3
+  resolution: "@react-stately/menu@npm:3.8.3"
   dependencies:
-    "@react-aria/i18n": ^3.12.3
-    "@react-aria/textfield": ^3.14.10
-    "@react-aria/utils": ^3.25.3
-    "@react-stately/searchfield": ^3.5.7
-    "@react-types/button": ^3.10.0
-    "@react-types/searchfield": ^3.5.9
+    "@react-stately/overlays": ^3.6.11
+    "@react-types/menu": ^3.9.12
     "@react-types/shared": ^3.25.0
     "@swc/helpers": ^0.5.0
   peerDependencies:
     react: ^16.8.0 || ^17.0.0-rc.1 || ^18.0.0 || ^19.0.0
-  checksum: 1ae7fab9f6bc473ccc8d2762c4d07ffbbdd45366b1fe7fa282c14354eac8e427bebb0dde20e1cb92e4a2cd769f9f3872a5712c53763706b6414d024fa5275732
+  checksum: b222962aa9fb9935032756d2d3406ccfb56391a70d2bc2d968b06cab2d1a838443c8e6779032e197f2628bb5183d67851a0020ae70ef0cb74e1f7096bbd82fdf
   languageName: node
   linkType: hard
 
-"@react-aria/select@npm:^3.14.11":
-  version: 3.14.11
-  resolution: "@react-aria/select@npm:3.14.11"
+"@react-stately/numberfield@npm:^3.9.7":
+  version: 3.9.7
+  resolution: "@react-stately/numberfield@npm:3.9.7"
   dependencies:
-    "@react-aria/form": ^3.0.10
-    "@react-aria/i18n": ^3.12.3
-    "@react-aria/interactions": ^3.22.4
-    "@react-aria/label": ^3.7.12
-    "@react-aria/listbox": ^3.13.5
-    "@react-aria/menu": ^3.15.5
-    "@react-aria/selection": ^3.20.1
-    "@react-aria/utils": ^3.25.3
-    "@react-aria/visually-hidden": ^3.8.17
-    "@react-stately/select": ^3.6.8
-    "@react-types/button": ^3.10.0
-    "@react-types/select": ^3.9.7
-    "@react-types/shared": ^3.25.0
+    "@internationalized/number": ^3.5.4
+    "@react-stately/form": ^3.0.6
+    "@react-stately/utils": ^3.10.4
+    "@react-types/numberfield": ^3.8.6
     "@swc/helpers": ^0.5.0
   peerDependencies:
     react: ^16.8.0 || ^17.0.0-rc.1 || ^18.0.0 || ^19.0.0
-    react-dom: ^16.8.0 || ^17.0.0-rc.1 || ^18.0.0 || ^19.0.0
-  checksum: b8c2e24a2713367938514c1d47817943bf1677bf4a29e5f5f695e1e9e708a93dde465de8d06babf276bc7face7938b280fd603af4b77d1068e9ce5b85a7cefd6
+  checksum: f956674792c5bb6a893d15c45b3ca4c2d0757e09a3acc4ee90efae179d6e6245d1dedd23125030f5e07f1edf7ced547a988c7d233a2eb4fcc8ea673cd4bfe942
   languageName: node
   linkType: hard
 
-"@react-aria/selection@npm:^3.20.1":
-  version: 3.20.1
-  resolution: "@react-aria/selection@npm:3.20.1"
+"@react-stately/overlays@npm:^3.6.11":
+  version: 3.6.11
+  resolution: "@react-stately/overlays@npm:3.6.11"
   dependencies:
-    "@react-aria/focus": ^3.18.4
-    "@react-aria/i18n": ^3.12.3
-    "@react-aria/interactions": ^3.22.4
-    "@react-aria/utils": ^3.25.3
-    "@react-stately/selection": ^3.17.0
-    "@react-types/shared": ^3.25.0
+    "@react-stately/utils": ^3.10.4
+    "@react-types/overlays": ^3.8.10
     "@swc/helpers": ^0.5.0
   peerDependencies:
     react: ^16.8.0 || ^17.0.0-rc.1 || ^18.0.0 || ^19.0.0
-    react-dom: ^16.8.0 || ^17.0.0-rc.1 || ^18.0.0 || ^19.0.0
-  checksum: 44e10f4e4952e5fbb15071bbaa1ccafcb91b6168a8ac6eb1e0f4e1036014527ea3c0e363a7f552ca923b6929f9a5e2495bb454ad9cd4c64003d650115b5e637a
+  checksum: 559efc68bdb4512b8049f31a83e15404f7a306e960763570d876a08aee165656fdfbef4533251709e0576b1a7d6fd1f4e575ebfabc93738deb686c52571d36f9
   languageName: node
   linkType: hard
 
-"@react-aria/separator@npm:^3.4.3":
-  version: 3.4.3
-  resolution: "@react-aria/separator@npm:3.4.3"
+"@react-stately/radio@npm:^3.10.8":
+  version: 3.10.8
+  resolution: "@react-stately/radio@npm:3.10.8"
   dependencies:
-    "@react-aria/utils": ^3.25.3
+    "@react-stately/form": ^3.0.6
+    "@react-stately/utils": ^3.10.4
+    "@react-types/radio": ^3.8.4
     "@react-types/shared": ^3.25.0
     "@swc/helpers": ^0.5.0
   peerDependencies:
     react: ^16.8.0 || ^17.0.0-rc.1 || ^18.0.0 || ^19.0.0
-  checksum: 322b7135944d0a941e65cc5756153e8e0aa60af102572f988d14add4cdfd7e727a133f0c3a86b69333f08da2f606f03d6d590483e986b79e649562f46cdb4836
+  checksum: c918b134af1cb336dd687f92143df06c66b38ada10e9def7c5738e1ff0490f31563a8c20471d70d83eb8c5ad99757a7669a4d250f4f144821641b1670e6cb57d
   languageName: node
   linkType: hard
 
-"@react-aria/slider@npm:^3.7.13":
-  version: 3.7.13
-  resolution: "@react-aria/slider@npm:3.7.13"
+"@react-stately/searchfield@npm:^3.5.7":
+  version: 3.5.7
+  resolution: "@react-stately/searchfield@npm:3.5.7"
   dependencies:
-    "@react-aria/focus": ^3.18.4
-    "@react-aria/i18n": ^3.12.3
-    "@react-aria/interactions": ^3.22.4
-    "@react-aria/label": ^3.7.12
-    "@react-aria/utils": ^3.25.3
-    "@react-stately/slider": ^3.5.8
-    "@react-types/shared": ^3.25.0
-    "@react-types/slider": ^3.7.6
+    "@react-stately/utils": ^3.10.4
+    "@react-types/searchfield": ^3.5.9
     "@swc/helpers": ^0.5.0
   peerDependencies:
     react: ^16.8.0 || ^17.0.0-rc.1 || ^18.0.0 || ^19.0.0
-  checksum: 6256790404e7ab67ea64c613b491fad3e9cd4315a6fe2fa72b2271eb5f0254bb39c5cbd5f9896119714fcb94f515c33c3c6ca8195aaf3b0fd5e5f6d49d7c8bd3
+  checksum: 855457c63a684d724bcaea19d043c0e99a1fb91c6587e9dc263ee4d6ce2f7a7ded2c5cb1cb957063c141323775cf490e93b20004ae19940d5036c1744641d0ba
   languageName: node
   linkType: hard
 
-"@react-aria/spinbutton@npm:^3.6.9":
-  version: 3.6.9
-  resolution: "@react-aria/spinbutton@npm:3.6.9"
+"@react-stately/select@npm:^3.6.8":
+  version: 3.6.8
+  resolution: "@react-stately/select@npm:3.6.8"
   dependencies:
-    "@react-aria/i18n": ^3.12.3
-    "@react-aria/live-announcer": ^3.4.0
-    "@react-aria/utils": ^3.25.3
-    "@react-types/button": ^3.10.0
+    "@react-stately/form": ^3.0.6
+    "@react-stately/list": ^3.11.0
+    "@react-stately/overlays": ^3.6.11
+    "@react-types/select": ^3.9.7
     "@react-types/shared": ^3.25.0
     "@swc/helpers": ^0.5.0
   peerDependencies:
     react: ^16.8.0 || ^17.0.0-rc.1 || ^18.0.0 || ^19.0.0
-    react-dom: ^16.8.0 || ^17.0.0-rc.1 || ^18.0.0 || ^19.0.0
-  checksum: c15434d8c7c058ca39634b9a2350915967cf8d59e19101fc5e243f6a0b3b6971e9bb265aee07b3bbfb68ce207a3affea8924db2bd850705a7b2163f946d82f34
+  checksum: 2d76055fb4f7130224e1a746e43a37f0f70700fb0dd07c7a404b255a62a148ec704e9ddf9bbcc2188096dae231216738147b11587c68933a9234153b9497bde3
   languageName: node
   linkType: hard
 
-"@react-aria/ssr@npm:^3.9.6":
-  version: 3.9.6
-  resolution: "@react-aria/ssr@npm:3.9.6"
+"@react-stately/selection@npm:^3.17.0":
+  version: 3.17.0
+  resolution: "@react-stately/selection@npm:3.17.0"
   dependencies:
+    "@react-stately/collections": ^3.11.0
+    "@react-stately/utils": ^3.10.4
+    "@react-types/shared": ^3.25.0
     "@swc/helpers": ^0.5.0
   peerDependencies:
     react: ^16.8.0 || ^17.0.0-rc.1 || ^18.0.0 || ^19.0.0
-  checksum: be52f2909035e093d3f72cccde15b66b4eef2dc30c71dac46a1ea43d3847dace1a709114640bfa3e9aa72ba716749635fb72116f4da16f7d80248ca348146456
+  checksum: 3d0cac8fa729ca9b2d083d305e533ebdc229808d34505a52e1791d916fbe08d32413216efa3ae1c322da1cf9e59024bf9b2d9b7b68e3cb0d7d30fd4da4f0be42
   languageName: node
   linkType: hard
 
-"@react-aria/switch@npm:^3.6.9":
-  version: 3.6.9
-  resolution: "@react-aria/switch@npm:3.6.9"
+"@react-stately/slider@npm:^3.5.8":
+  version: 3.5.8
+  resolution: "@react-stately/slider@npm:3.5.8"
   dependencies:
-    "@react-aria/toggle": ^3.10.9
-    "@react-stately/toggle": ^3.7.8
+    "@react-stately/utils": ^3.10.4
     "@react-types/shared": ^3.25.0
-    "@react-types/switch": ^3.5.6
+    "@react-types/slider": ^3.7.6
     "@swc/helpers": ^0.5.0
   peerDependencies:
     react: ^16.8.0 || ^17.0.0-rc.1 || ^18.0.0 || ^19.0.0
-  checksum: 94000e6527b3889433d96571f8d7ce32a64b978fc7640d2a8f43ee38cebd3a13149a66512d54485c5f7c8769d5a7de2d4847ffc6130655f37cc7fbd70bd99bc0
+  checksum: 47a8887a4732a5a0503632cc83c36f61793bd34893989e0f23d15268b8776b30754de43559e2e962ac60125dc1816d297c09e15ec7ecadd78595b1e05ac4c5cc
   languageName: node
   linkType: hard
 
-"@react-aria/table@npm:^3.15.5":
-  version: 3.15.5
-  resolution: "@react-aria/table@npm:3.15.5"
+"@react-stately/table@npm:^3.12.3":
+  version: 3.12.3
+  resolution: "@react-stately/table@npm:3.12.3"
   dependencies:
-    "@react-aria/focus": ^3.18.4
-    "@react-aria/grid": ^3.10.5
-    "@react-aria/i18n": ^3.12.3
-    "@react-aria/interactions": ^3.22.4
-    "@react-aria/live-announcer": ^3.4.0
-    "@react-aria/utils": ^3.25.3
-    "@react-aria/visually-hidden": ^3.8.17
     "@react-stately/collections": ^3.11.0
     "@react-stately/flags": ^3.0.4
-    "@react-stately/table": ^3.12.3
-    "@react-types/checkbox": ^3.8.4
+    "@react-stately/grid": ^3.9.3
+    "@react-stately/selection": ^3.17.0
+    "@react-stately/utils": ^3.10.4
     "@react-types/grid": ^3.2.9
     "@react-types/shared": ^3.25.0
     "@react-types/table": ^3.10.2
     "@swc/helpers": ^0.5.0
   peerDependencies:
     react: ^16.8.0 || ^17.0.0-rc.1 || ^18.0.0 || ^19.0.0
-    react-dom: ^16.8.0 || ^17.0.0-rc.1 || ^18.0.0 || ^19.0.0
-  checksum: 54a8794f9842082aef5ce9b36e21cb125b02e6792c38c40d1a65f25ba62362c4adc17a7db220672e1b65f515aedfe1a55eb9b70b7ce7d9c0fb75f4da16e4a8eb
+  checksum: 736f62ed831416212f836525408ad17ce396633620136786025cff47571461b97e047f9321ebfd8db889b02cda73a401b76108529314b74e7b88e44bd2909f59
   languageName: node
   linkType: hard
 
-"@react-aria/tabs@npm:^3.9.7":
-  version: 3.9.7
-  resolution: "@react-aria/tabs@npm:3.9.7"
+"@react-stately/tabs@npm:^3.6.10":
+  version: 3.6.10
+  resolution: "@react-stately/tabs@npm:3.6.10"
   dependencies:
-    "@react-aria/focus": ^3.18.4
-    "@react-aria/i18n": ^3.12.3
-    "@react-aria/selection": ^3.20.1
-    "@react-aria/utils": ^3.25.3
-    "@react-stately/tabs": ^3.6.10
+    "@react-stately/list": ^3.11.0
     "@react-types/shared": ^3.25.0
     "@react-types/tabs": ^3.3.10
     "@swc/helpers": ^0.5.0
   peerDependencies:
     react: ^16.8.0 || ^17.0.0-rc.1 || ^18.0.0 || ^19.0.0
-    react-dom: ^16.8.0 || ^17.0.0-rc.1 || ^18.0.0 || ^19.0.0
-  checksum: 0e079c0e803b94efcb5f30444a888322d614e577c462eb2e7a4a0170aa92fea6e21cdbf041d5efdfab0b0c50ec287dc8032afe4b52b4f77489fa9ec4866837a2
+  checksum: 308521c0810c7653b6015bfd4c6c2393dee1ef7780718e9322dc42a670a195b940440ecaed8acceccccf720d05e67efef789a12929778549f93697bd263540fb
   languageName: node
   linkType: hard
 
-"@react-aria/tag@npm:^3.4.7":
-  version: 3.4.7
-  resolution: "@react-aria/tag@npm:3.4.7"
+"@react-stately/toggle@npm:^3.7.8":
+  version: 3.7.8
+  resolution: "@react-stately/toggle@npm:3.7.8"
   dependencies:
-    "@react-aria/gridlist": ^3.9.5
-    "@react-aria/i18n": ^3.12.3
-    "@react-aria/interactions": ^3.22.4
-    "@react-aria/label": ^3.7.12
-    "@react-aria/selection": ^3.20.1
-    "@react-aria/utils": ^3.25.3
-    "@react-stately/list": ^3.11.0
-    "@react-types/button": ^3.10.0
-    "@react-types/shared": ^3.25.0
+    "@react-stately/utils": ^3.10.4
+    "@react-types/checkbox": ^3.8.4
     "@swc/helpers": ^0.5.0
   peerDependencies:
     react: ^16.8.0 || ^17.0.0-rc.1 || ^18.0.0 || ^19.0.0
-    react-dom: ^16.8.0 || ^17.0.0-rc.1 || ^18.0.0 || ^19.0.0
-  checksum: 869e26288a2d3c90cc8027342f70dc1ec0146d6ec5ebe62c7b06eb48390e1d1a71083ca6de7147353764bc566a7f6dfad2666e6d378afa6cf53acb586e1019b1
+  checksum: 765bb5e0c40a999b4a49babdcabf9cc9be81f9c967ee80345607ae77dc606cfb4ae730ea71af18298f636c5edb334801d2d3e2e6b123655cba67b4751d00e492
   languageName: node
   linkType: hard
 
-"@react-aria/textfield@npm:^3.14.10":
-  version: 3.14.10
-  resolution: "@react-aria/textfield@npm:3.14.10"
+"@react-stately/tooltip@npm:^3.4.13":
+  version: 3.4.13
+  resolution: "@react-stately/tooltip@npm:3.4.13"
   dependencies:
-    "@react-aria/focus": ^3.18.4
-    "@react-aria/form": ^3.0.10
-    "@react-aria/label": ^3.7.12
-    "@react-aria/utils": ^3.25.3
-    "@react-stately/form": ^3.0.6
-    "@react-stately/utils": ^3.10.4
-    "@react-types/shared": ^3.25.0
-    "@react-types/textfield": ^3.9.7
+    "@react-stately/overlays": ^3.6.11
+    "@react-types/tooltip": ^3.4.12
     "@swc/helpers": ^0.5.0
   peerDependencies:
     react: ^16.8.0 || ^17.0.0-rc.1 || ^18.0.0 || ^19.0.0
-  checksum: 91b4d6ae47c6bf355ae9ff53626d6195afc3fe5852a7aa930b286fbe0804c13b79649ff1b220706cc7808b0e8c4ad3f4f1c04261b4a90abb79f3bb83c033c5e5
+  checksum: b4322cf62ad87888898676e4cf19a75d56594851a2ca8035421e69d45b02486ea36bd7b977b7596621165b771f47c4fe1a7b23d785771f26afcd16fecad1ab8b
   languageName: node
   linkType: hard
 
-"@react-aria/toggle@npm:^3.10.9":
-  version: 3.10.9
-  resolution: "@react-aria/toggle@npm:3.10.9"
+"@react-stately/tree@npm:^3.8.5":
+  version: 3.8.5
+  resolution: "@react-stately/tree@npm:3.8.5"
   dependencies:
-    "@react-aria/focus": ^3.18.4
-    "@react-aria/interactions": ^3.22.4
-    "@react-aria/utils": ^3.25.3
-    "@react-stately/toggle": ^3.7.8
-    "@react-types/checkbox": ^3.8.4
+    "@react-stately/collections": ^3.11.0
+    "@react-stately/selection": ^3.17.0
+    "@react-stately/utils": ^3.10.4
     "@react-types/shared": ^3.25.0
     "@swc/helpers": ^0.5.0
   peerDependencies:
     react: ^16.8.0 || ^17.0.0-rc.1 || ^18.0.0 || ^19.0.0
-  checksum: 057302ef08413cc7bfdde96102da734610294aef19c91d6bae8accf2dfc3ffd976dd531c5d42c6aa955e44da92b46f51667488ae0a48718370d449b6dc0f84e4
+  checksum: 6df95aa9c75ef87fed004641f73e1889950724fdd521e2447310d645b666da79ed7a67dd80b5db6c5b75903b03aa61b1ac3f84d39117d2951c115b9b19aae03f
   languageName: node
   linkType: hard
 
-"@react-aria/tooltip@npm:^3.7.9":
-  version: 3.7.9
-  resolution: "@react-aria/tooltip@npm:3.7.9"
+"@react-stately/utils@npm:^3.10.4":
+  version: 3.10.4
+  resolution: "@react-stately/utils@npm:3.10.4"
   dependencies:
-    "@react-aria/focus": ^3.18.4
-    "@react-aria/interactions": ^3.22.4
-    "@react-aria/utils": ^3.25.3
-    "@react-stately/tooltip": ^3.4.13
-    "@react-types/shared": ^3.25.0
-    "@react-types/tooltip": ^3.4.12
     "@swc/helpers": ^0.5.0
   peerDependencies:
     react: ^16.8.0 || ^17.0.0-rc.1 || ^18.0.0 || ^19.0.0
-  checksum: 1db345fe35462ddce880ea28bf0dcf6d320ed5e7ce96d0b836a8d3a00c35a88eef037e0e9e1601bdf516ae8c5c6ea0e9190b849499ee9146b7de9b70062f8d13
+  checksum: 875c11424fadf4419caceeee13e5bfdee2b0c330fe0220c0ea9d68d570cc9a34525f2f124d977e519b397a738cd2f8e36b7b03a046e3e7da99460e99282977a4
+  languageName: node
+  linkType: hard
+
+"@react-types/breadcrumbs@npm:^3.7.8":
+  version: 3.7.8
+  resolution: "@react-types/breadcrumbs@npm:3.7.8"
+  dependencies:
+    "@react-types/link": ^3.5.8
+    "@react-types/shared": ^3.25.0
+  peerDependencies:
+    react: ^16.8.0 || ^17.0.0-rc.1 || ^18.0.0 || ^19.0.0
+  checksum: 886f7c3b9e7196d8516814dcf8dfcaa437107c4e2e7d6db1b83adadbdab16fb3a12edb9e1b01b6f0524307394735766487d1129b1c8d4172e50eb8e3e0bae31a
   languageName: node
   linkType: hard
 
-"@react-aria/utils@npm:^3.25.3":
-  version: 3.25.3
-  resolution: "@react-aria/utils@npm:3.25.3"
+"@react-types/button@npm:^3.10.0":
+  version: 3.10.0
+  resolution: "@react-types/button@npm:3.10.0"
   dependencies:
-    "@react-aria/ssr": ^3.9.6
-    "@react-stately/utils": ^3.10.4
     "@react-types/shared": ^3.25.0
-    "@swc/helpers": ^0.5.0
-    clsx: ^2.0.0
   peerDependencies:
     react: ^16.8.0 || ^17.0.0-rc.1 || ^18.0.0 || ^19.0.0
-  checksum: dc86ea48c24232f5c51d0b5317d947c4ccf01a8afb3bdc89cb880a7b0a695a04c8a7c615fb190664f4f3c7da8669ab2bd2f7cdfb2861339f5816cbd600249a84
+  checksum: 89395334f286f1a97a584715bbb87e7bb017d7366aa73ce0cec36ec8cb59059dec1f5afe3ab44f3972e0c50f44daeb2d531b10191d6f2b7f70c3ce7d3c94c0da
   languageName: node
   linkType: hard
 
-"@react-aria/visually-hidden@npm:^3.8.17":
-  version: 3.8.17
-  resolution: "@react-aria/visually-hidden@npm:3.8.17"
+"@react-types/calendar@npm:^3.4.10":
+  version: 3.4.10
+  resolution: "@react-types/calendar@npm:3.4.10"
   dependencies:
-    "@react-aria/interactions": ^3.22.4
-    "@react-aria/utils": ^3.25.3
+    "@internationalized/date": ^3.5.6
     "@react-types/shared": ^3.25.0
-    "@swc/helpers": ^0.5.0
   peerDependencies:
     react: ^16.8.0 || ^17.0.0-rc.1 || ^18.0.0 || ^19.0.0
-  checksum: 411699c167686509583debc659e734ec3c123198570104abbd4fe74a5a60d93a305d73f6d761ec67846c672d1076d8f089a6f90d2e2653e1a334fe7344088bd5
-  languageName: node
-  linkType: hard
-
-"@react-hook/latest@npm:^1.0.2":
-  version: 1.0.3
-  resolution: "@react-hook/latest@npm:1.0.3"
-  peerDependencies:
-    react: ">=16.8"
-  checksum: d6a166c21121da519a516e8089ba28a2779d37b6017732ab55476c0d354754ad215394135765254f8752a7c6661c3fb868d088769a644848602f00f8821248ed
+  checksum: e4768b09c86739724f7fbdde41496859bfc6ba1d09071667da82f8914e8a5eef50cd168dc79d44782b8f2143547ea1326b476f0cce1cbbf667acecf5500bce95
   languageName: node
   linkType: hard
 
-"@react-hook/passive-layout-effect@npm:^1.2.0":
-  version: 1.2.1
-  resolution: "@react-hook/passive-layout-effect@npm:1.2.1"
+"@react-types/checkbox@npm:^3.8.4":
+  version: 3.8.4
+  resolution: "@react-types/checkbox@npm:3.8.4"
+  dependencies:
+    "@react-types/shared": ^3.25.0
   peerDependencies:
-    react: ">=16.8"
-  checksum: 5c9e6b3df1c91fc2b1d4f711ca96b5f8cb3f6a13a2e97dac7cce623e58d7ee57999c45db3778d0af0b2522b3a5b7463232ef21cb3ee9900437172d48f766d933
+    react: ^16.8.0 || ^17.0.0-rc.1 || ^18.0.0 || ^19.0.0
+  checksum: e2970200658c2035f3fd8d82e805ddd5cf402cf523e293a76a7e181c0b4234e657471c34c9eb0d4f421ed494e98214160efedc8c358d9bfa63ae4b3012d73b6e
   languageName: node
   linkType: hard
 
-"@react-hook/resize-observer@npm:^1.2.6":
-  version: 1.2.6
-  resolution: "@react-hook/resize-observer@npm:1.2.6"
+"@react-types/color@npm:^3.0.0":
+  version: 3.0.0
+  resolution: "@react-types/color@npm:3.0.0"
   dependencies:
-    "@juggle/resize-observer": ^3.3.1
-    "@react-hook/latest": ^1.0.2
-    "@react-hook/passive-layout-effect": ^1.2.0
+    "@react-types/shared": ^3.25.0
+    "@react-types/slider": ^3.7.6
   peerDependencies:
-    react: ">=16.8"
-  checksum: 6ebe4ded4dc4602906c4c727871f93ea73754dd5758f90d50e5fc7382b1844324a46a4c2e0842d8ad5bf95886091ba8a0c9d3a1ef0f10bd0c9e011ecd7aeea42
+    react: ^16.8.0 || ^17.0.0-rc.1 || ^18.0.0 || ^19.0.0
+  checksum: 77e69841a7b3d692c4b71594f58a3b0184ca1e1bc34d3e9a7a1d58e66ee2c4a93109977739fd19c8aca80edbf667b4fd3f8be03d9c6f2eb5587ee6550509cfbc
   languageName: node
   linkType: hard
 
-"@react-hook/resize-observer@npm:^2.0.2":
-  version: 2.0.2
-  resolution: "@react-hook/resize-observer@npm:2.0.2"
+"@react-types/combobox@npm:^3.13.0":
+  version: 3.13.0
+  resolution: "@react-types/combobox@npm:3.13.0"
   dependencies:
-    "@react-hook/latest": ^1.0.2
-    "@react-hook/passive-layout-effect": ^1.2.0
+    "@react-types/shared": ^3.25.0
   peerDependencies:
-    react: ">=18"
-  checksum: a88f088bd5b87fea80daca391bdea9823dc38651bd112f0c607b057d9c8381f37395cf5a01a79ba7ab24369c4b48acf912cfef0244e6610d72ea3074415e9c32
+    react: ^16.8.0 || ^17.0.0-rc.1 || ^18.0.0 || ^19.0.0
+  checksum: 0eb33769279d76d2043833d2bbc36d3357d5dd92a00807980d95d5c4198060d06e3146355f31287c6b678c8b5d80c8e57084a55de71ab5174a8e8794e4702dfe
   languageName: node
   linkType: hard
 
-"@react-stately/calendar@npm:^3.5.5":
-  version: 3.5.5
-  resolution: "@react-stately/calendar@npm:3.5.5"
+"@react-types/datepicker@npm:^3.8.3":
+  version: 3.8.3
+  resolution: "@react-types/datepicker@npm:3.8.3"
   dependencies:
     "@internationalized/date": ^3.5.6
-    "@react-stately/utils": ^3.10.4
     "@react-types/calendar": ^3.4.10
+    "@react-types/overlays": ^3.8.10
     "@react-types/shared": ^3.25.0
-    "@swc/helpers": ^0.5.0
   peerDependencies:
     react: ^16.8.0 || ^17.0.0-rc.1 || ^18.0.0 || ^19.0.0
-  checksum: ff38c8fb4178d965db8569980756d864e9a0341fca60bccc76d4fe34645375a2ed32a533097426f9f1892fe99bce32d5ec00a3e8ce9acbdfc6b7f2e82012d4de
+  checksum: c6b3c2c6757329d1fd636e40b0024a20875bf7f2c895e521d9941b9469b5a8ca19b2773ae8bd1adc35b1a5f9f9946b04cfc2032cd7e4fd99cbf2947f86a06d51
   languageName: node
   linkType: hard
 
-"@react-stately/checkbox@npm:^3.6.9":
-  version: 3.6.9
-  resolution: "@react-stately/checkbox@npm:3.6.9"
+"@react-types/dialog@npm:^3.5.13":
+  version: 3.5.13
+  resolution: "@react-types/dialog@npm:3.5.13"
   dependencies:
-    "@react-stately/form": ^3.0.6
-    "@react-stately/utils": ^3.10.4
-    "@react-types/checkbox": ^3.8.4
+    "@react-types/overlays": ^3.8.10
     "@react-types/shared": ^3.25.0
-    "@swc/helpers": ^0.5.0
   peerDependencies:
     react: ^16.8.0 || ^17.0.0-rc.1 || ^18.0.0 || ^19.0.0
-  checksum: 068be8d5c743b0ac3f0a96863568401027035b20a32caaa220600172f6ed0f93a49d58cfc4a960befd4762aa1eab18e2c30bd3656157729b4e3944156aeebd6c
+  checksum: 9cb9043694a1e48fbf0221effd28da602c314c64d653455d5616d8384adf93c78c87453a5b210ff587a221836adb5e2e7f9cb5b3f9a04c3522ad35dadba5d39a
   languageName: node
   linkType: hard
 
-"@react-stately/collections@npm:^3.11.0":
-  version: 3.11.0
-  resolution: "@react-stately/collections@npm:3.11.0"
+"@react-types/grid@npm:^3.2.9":
+  version: 3.2.9
+  resolution: "@react-types/grid@npm:3.2.9"
   dependencies:
     "@react-types/shared": ^3.25.0
-    "@swc/helpers": ^0.5.0
   peerDependencies:
     react: ^16.8.0 || ^17.0.0-rc.1 || ^18.0.0 || ^19.0.0
-  checksum: aba7d2194f4db8ee1ad5ad708a34d9bb336d3fd1fcb837cb237c6b63e1537003592eb6d33d80d1a6a313613e594d8d4a9da779c00d7fa3470f4adb5ff227150f
+  checksum: 2645c4dafef3d10fe866a2a2ee9c17bce6fef9bf166bdf98e1de5bb6ed4cefc390eda87ea79ed8846cc94a9f57eb530577122d6063a14747ff3df2a08ec700cb
   languageName: node
   linkType: hard
 
-"@react-stately/color@npm:^3.8.0":
-  version: 3.8.0
-  resolution: "@react-stately/color@npm:3.8.0"
+"@react-types/link@npm:^3.5.8":
+  version: 3.5.8
+  resolution: "@react-types/link@npm:3.5.8"
   dependencies:
-    "@internationalized/number": ^3.5.4
-    "@internationalized/string": ^3.2.4
-    "@react-aria/i18n": ^3.12.3
-    "@react-stately/form": ^3.0.6
-    "@react-stately/numberfield": ^3.9.7
-    "@react-stately/slider": ^3.5.8
-    "@react-stately/utils": ^3.10.4
-    "@react-types/color": ^3.0.0
     "@react-types/shared": ^3.25.0
-    "@swc/helpers": ^0.5.0
   peerDependencies:
     react: ^16.8.0 || ^17.0.0-rc.1 || ^18.0.0 || ^19.0.0
-  checksum: cb0acc88713c9a4271a1445c963c11a8d6cfaa2127894dc810783bc04cc288f1d143679a3b10612abf3cbb1a9871115f4e51745d707825879a454df2c7114609
+  checksum: 39ac4827bb791d481bcf394429effc53dd446cf7e260ee1900c09327581b36650aa68f573d5002ac7d9e39ac5dbbb08e0d39cf0eeb408c2a3bfc2c8ce77a5cb7
   languageName: node
   linkType: hard
 
-"@react-stately/combobox@npm:^3.10.0":
-  version: 3.10.0
-  resolution: "@react-stately/combobox@npm:3.10.0"
+"@react-types/listbox@npm:^3.5.2":
+  version: 3.5.2
+  resolution: "@react-types/listbox@npm:3.5.2"
   dependencies:
-    "@react-stately/collections": ^3.11.0
-    "@react-stately/form": ^3.0.6
-    "@react-stately/list": ^3.11.0
-    "@react-stately/overlays": ^3.6.11
-    "@react-stately/select": ^3.6.8
-    "@react-stately/utils": ^3.10.4
-    "@react-types/combobox": ^3.13.0
     "@react-types/shared": ^3.25.0
-    "@swc/helpers": ^0.5.0
   peerDependencies:
     react: ^16.8.0 || ^17.0.0-rc.1 || ^18.0.0 || ^19.0.0
-  checksum: a9ce1a4fd03d40d43f4914c8d079b1bfc40a73643067ca57c8fbc84faa5818217df2c842e4c5e94bfb79c014ba55fc185c92c7b359fbfe84ff4078104361fab7
+  checksum: a4145e0290e79c7ac0ae97f64384949f5156e75f4f05b1db17c36c1c31233dbfa7bc8509601dbb8782c24f77142a625db9e087b8a911acd385742f23d3d931bd
   languageName: node
   linkType: hard
 
-"@react-stately/data@npm:^3.11.7":
-  version: 3.11.7
-  resolution: "@react-stately/data@npm:3.11.7"
+"@react-types/menu@npm:^3.9.12":
+  version: 3.9.12
+  resolution: "@react-types/menu@npm:3.9.12"
   dependencies:
+    "@react-types/overlays": ^3.8.10
     "@react-types/shared": ^3.25.0
-    "@swc/helpers": ^0.5.0
   peerDependencies:
     react: ^16.8.0 || ^17.0.0-rc.1 || ^18.0.0 || ^19.0.0
-  checksum: bd5d81e62a251501d71ed87c1e2869d22fb0fbe80d617e70fdba4755eea79c6f51a2f9aafacf99145a2a0bbac8f5aa082096e08b930f63a7196e83c18dab3d99
+  checksum: c0f5be96e7fce99143ee564bf2debfc61c43ce5459dc4dc60118d4d873877cae9796c736dea88a1da892ea633fadd179c156c37b070a44eb4060f85a3007eb81
   languageName: node
   linkType: hard
 
-"@react-stately/datepicker@npm:^3.10.3":
-  version: 3.10.3
-  resolution: "@react-stately/datepicker@npm:3.10.3"
+"@react-types/meter@npm:^3.4.4":
+  version: 3.4.4
+  resolution: "@react-types/meter@npm:3.4.4"
   dependencies:
-    "@internationalized/date": ^3.5.6
-    "@internationalized/string": ^3.2.4
-    "@react-stately/form": ^3.0.6
-    "@react-stately/overlays": ^3.6.11
-    "@react-stately/utils": ^3.10.4
-    "@react-types/datepicker": ^3.8.3
-    "@react-types/shared": ^3.25.0
-    "@swc/helpers": ^0.5.0
+    "@react-types/progress": ^3.5.7
   peerDependencies:
     react: ^16.8.0 || ^17.0.0-rc.1 || ^18.0.0 || ^19.0.0
-  checksum: 74fa89a4b9d80343dc07a7bbabcf88962ea0afbddcfb5e24b5c97fffcb9596ec097fa4ddaf7c534c8ba96c83101f88237413d2b6f65a979653007c463c8e09c0
+  checksum: 0fa94ee35264e3d600e424aba3b21dd6b0896c6877d723381ea5a34c7594e8079b81ce3b2115d6420695ed0004d7251e4d5dc93b6ad8c06c8de8fb30c085ee45
   languageName: node
   linkType: hard
 
-"@react-stately/dnd@npm:^3.4.3":
-  version: 3.4.3
-  resolution: "@react-stately/dnd@npm:3.4.3"
+"@react-types/numberfield@npm:^3.8.6":
+  version: 3.8.6
+  resolution: "@react-types/numberfield@npm:3.8.6"
   dependencies:
-    "@react-stately/selection": ^3.17.0
     "@react-types/shared": ^3.25.0
-    "@swc/helpers": ^0.5.0
   peerDependencies:
     react: ^16.8.0 || ^17.0.0-rc.1 || ^18.0.0 || ^19.0.0
-  checksum: 06356b2f1c9e1e4f77135d79a00a7ddbceed6b09bf6d1681ddf710c88aab0063f1ca96afc814693f049e2f4e38b5c4071d1a47cde6e2b7ef676c0a0e838b74ea
+  checksum: f15d30246d8e33e360f4c3398ffc287aa8bb9e133e7b3368cd3c05a80c18df4cbf46fe4dbaafd7cb18bb268632a291030e7e71d1c4ea794d366afb7a75512c32
   languageName: node
   linkType: hard
 
-"@react-stately/flags@npm:^3.0.4":
-  version: 3.0.4
-  resolution: "@react-stately/flags@npm:3.0.4"
+"@react-types/overlays@npm:^3.8.10":
+  version: 3.8.10
+  resolution: "@react-types/overlays@npm:3.8.10"
   dependencies:
-    "@swc/helpers": ^0.5.0
-  checksum: 363aacb4c8a9c091689a4fba2e1f0c0ca9040c9c722dae6388cbfde1952db0c808fe98e4ada6ecea89a9bf6288cf351f3f1cd54434fa6a8dccf8903e8b2085b9
+    "@react-types/shared": ^3.25.0
+  peerDependencies:
+    react: ^16.8.0 || ^17.0.0-rc.1 || ^18.0.0 || ^19.0.0
+  checksum: 753fd637dab9e189403cab8567a88fce183de8013dcec705fe3ed813facaa7a95fa754af5a45f364787c4351132d27ebaf3184e0e14955c47bf80b82560c3539
   languageName: node
   linkType: hard
 
-"@react-stately/form@npm:^3.0.6":
-  version: 3.0.6
-  resolution: "@react-stately/form@npm:3.0.6"
+"@react-types/progress@npm:^3.5.7":
+  version: 3.5.7
+  resolution: "@react-types/progress@npm:3.5.7"
   dependencies:
     "@react-types/shared": ^3.25.0
-    "@swc/helpers": ^0.5.0
   peerDependencies:
     react: ^16.8.0 || ^17.0.0-rc.1 || ^18.0.0 || ^19.0.0
-  checksum: ba8439dfb606abeedf4b90e0f3fa77d05ae1f0a898d800af419a3aaaf0b388259d09d109c138dbf6768120213870a63f6e604886fc6c11233f8da1668c086b22
+  checksum: 8780f97a5e3400e2381ed6659511a74fdfa8a3aa21499c8fe1fcd92386460569c56032d60297dd0786744d460cd515ebf4f663ea4b1a1f57e717e2da977dd581
   languageName: node
   linkType: hard
 
-"@react-stately/grid@npm:^3.9.3":
-  version: 3.9.3
-  resolution: "@react-stately/grid@npm:3.9.3"
+"@react-types/radio@npm:^3.8.4":
+  version: 3.8.4
+  resolution: "@react-types/radio@npm:3.8.4"
   dependencies:
-    "@react-stately/collections": ^3.11.0
-    "@react-stately/selection": ^3.17.0
-    "@react-types/grid": ^3.2.9
     "@react-types/shared": ^3.25.0
-    "@swc/helpers": ^0.5.0
   peerDependencies:
     react: ^16.8.0 || ^17.0.0-rc.1 || ^18.0.0 || ^19.0.0
-  checksum: cc8d420f1148dda47ed12b9cc318f4633c252abd99d88c75294ba6c4641dd5c39b3ccd8e21350768629b942d8762e08052d8b23ab80fbe5e1ed248faa719a647
+  checksum: 2a7395f07810b3ae128c329f31d00f0bda3ecc03a8203e17cda7fbc0be019bb01113b8af6d0f73334168ae2fd13763ef4d1138c3f8b3d49ef2c858e33df2f3ae
   languageName: node
   linkType: hard
 
-"@react-stately/list@npm:^3.11.0":
-  version: 3.11.0
-  resolution: "@react-stately/list@npm:3.11.0"
+"@react-types/searchfield@npm:^3.5.9":
+  version: 3.5.9
+  resolution: "@react-types/searchfield@npm:3.5.9"
   dependencies:
-    "@react-stately/collections": ^3.11.0
-    "@react-stately/selection": ^3.17.0
-    "@react-stately/utils": ^3.10.4
     "@react-types/shared": ^3.25.0
-    "@swc/helpers": ^0.5.0
+    "@react-types/textfield": ^3.9.7
   peerDependencies:
     react: ^16.8.0 || ^17.0.0-rc.1 || ^18.0.0 || ^19.0.0
-  checksum: 64731450c5d93997c8b1ce51b3eedc1fc9b1eb7814324d56fc459bf708dbb4e052f880bb02d116af6c0544ff4e9f1c347acd99878efa501614e74fd910409a32
+  checksum: 5e7d644e86a6ffb41c6230ef57e2ccdcfc1ad045a035a1c88aeb476054854fdc0542bfd62a8b3d23d4f19adf7e117c90ca9d8afd5726d7b039ed52f9ebed0639
   languageName: node
   linkType: hard
 
-"@react-stately/menu@npm:^3.8.3":
-  version: 3.8.3
-  resolution: "@react-stately/menu@npm:3.8.3"
+"@react-types/select@npm:^3.9.7":
+  version: 3.9.7
+  resolution: "@react-types/select@npm:3.9.7"
   dependencies:
-    "@react-stately/overlays": ^3.6.11
-    "@react-types/menu": ^3.9.12
     "@react-types/shared": ^3.25.0
-    "@swc/helpers": ^0.5.0
   peerDependencies:
     react: ^16.8.0 || ^17.0.0-rc.1 || ^18.0.0 || ^19.0.0
-  checksum: b222962aa9fb9935032756d2d3406ccfb56391a70d2bc2d968b06cab2d1a838443c8e6779032e197f2628bb5183d67851a0020ae70ef0cb74e1f7096bbd82fdf
+  checksum: 438a23b9be9469d81f2c0da0904ac76ce163ea41b03ca05c744a0d96b323837f1f0270b58dde83303970b2755202cc6dbbc109d8c9cce9c69100c56dfca967ab
   languageName: node
   linkType: hard
 
-"@react-stately/numberfield@npm:^3.9.7":
-  version: 3.9.7
-  resolution: "@react-stately/numberfield@npm:3.9.7"
-  dependencies:
-    "@internationalized/number": ^3.5.4
-    "@react-stately/form": ^3.0.6
-    "@react-stately/utils": ^3.10.4
-    "@react-types/numberfield": ^3.8.6
-    "@swc/helpers": ^0.5.0
+"@react-types/shared@npm:^3.25.0":
+  version: 3.25.0
+  resolution: "@react-types/shared@npm:3.25.0"
   peerDependencies:
     react: ^16.8.0 || ^17.0.0-rc.1 || ^18.0.0 || ^19.0.0
-  checksum: f956674792c5bb6a893d15c45b3ca4c2d0757e09a3acc4ee90efae179d6e6245d1dedd23125030f5e07f1edf7ced547a988c7d233a2eb4fcc8ea673cd4bfe942
+  checksum: d168f6b404c345928ef8ead94f0cecd3831d8f6df708dbe897ac62d566949a0931c3b0d95ef6dd02bc5af05b183781b531e6f041ffd1d320bc2cab7697fd27d0
   languageName: node
   linkType: hard
 
-"@react-stately/overlays@npm:^3.6.11":
-  version: 3.6.11
-  resolution: "@react-stately/overlays@npm:3.6.11"
+"@react-types/slider@npm:^3.7.6":
+  version: 3.7.6
+  resolution: "@react-types/slider@npm:3.7.6"
   dependencies:
-    "@react-stately/utils": ^3.10.4
-    "@react-types/overlays": ^3.8.10
-    "@swc/helpers": ^0.5.0
+    "@react-types/shared": ^3.25.0
   peerDependencies:
     react: ^16.8.0 || ^17.0.0-rc.1 || ^18.0.0 || ^19.0.0
-  checksum: 559efc68bdb4512b8049f31a83e15404f7a306e960763570d876a08aee165656fdfbef4533251709e0576b1a7d6fd1f4e575ebfabc93738deb686c52571d36f9
+  checksum: 06efeb2076380eafe0ac2b20d72fa4c2072f1dd85346a49388bd7fae76fd78d143c457fd1732c5dbccd34e2e16593d1672a76b51fa986554343319cfc996042e
   languageName: node
   linkType: hard
 
-"@react-stately/radio@npm:^3.10.8":
-  version: 3.10.8
-  resolution: "@react-stately/radio@npm:3.10.8"
+"@react-types/switch@npm:^3.5.6":
+  version: 3.5.6
+  resolution: "@react-types/switch@npm:3.5.6"
   dependencies:
-    "@react-stately/form": ^3.0.6
-    "@react-stately/utils": ^3.10.4
-    "@react-types/radio": ^3.8.4
     "@react-types/shared": ^3.25.0
-    "@swc/helpers": ^0.5.0
   peerDependencies:
     react: ^16.8.0 || ^17.0.0-rc.1 || ^18.0.0 || ^19.0.0
-  checksum: c918b134af1cb336dd687f92143df06c66b38ada10e9def7c5738e1ff0490f31563a8c20471d70d83eb8c5ad99757a7669a4d250f4f144821641b1670e6cb57d
+  checksum: 9c32a3306adf1afd103b3187e01be475f6e3f42391a2fe652312eb5fd89cc83087ceb6b9ea510f9f894593a695cb70ce00063aba6d808f6bc1cbbaa93f47f38b
   languageName: node
   linkType: hard
 
-"@react-stately/searchfield@npm:^3.5.7":
-  version: 3.5.7
-  resolution: "@react-stately/searchfield@npm:3.5.7"
+"@react-types/table@npm:^3.10.2":
+  version: 3.10.2
+  resolution: "@react-types/table@npm:3.10.2"
   dependencies:
-    "@react-stately/utils": ^3.10.4
-    "@react-types/searchfield": ^3.5.9
-    "@swc/helpers": ^0.5.0
+    "@react-types/grid": ^3.2.9
+    "@react-types/shared": ^3.25.0
   peerDependencies:
     react: ^16.8.0 || ^17.0.0-rc.1 || ^18.0.0 || ^19.0.0
-  checksum: 855457c63a684d724bcaea19d043c0e99a1fb91c6587e9dc263ee4d6ce2f7a7ded2c5cb1cb957063c141323775cf490e93b20004ae19940d5036c1744641d0ba
+  checksum: e25e393192a2d272b5a35a864b566c0f86ad923b5420df37c161d5f8e39b333f0759caaa6e94fb166fadd22ddf07a3da57f57f8e47843ce1f5fc296be305e879
   languageName: node
   linkType: hard
 
-"@react-stately/select@npm:^3.6.8":
-  version: 3.6.8
-  resolution: "@react-stately/select@npm:3.6.8"
+"@react-types/tabs@npm:^3.3.10":
+  version: 3.3.10
+  resolution: "@react-types/tabs@npm:3.3.10"
   dependencies:
-    "@react-stately/form": ^3.0.6
-    "@react-stately/list": ^3.11.0
-    "@react-stately/overlays": ^3.6.11
-    "@react-types/select": ^3.9.7
     "@react-types/shared": ^3.25.0
-    "@swc/helpers": ^0.5.0
   peerDependencies:
     react: ^16.8.0 || ^17.0.0-rc.1 || ^18.0.0 || ^19.0.0
-  checksum: 2d76055fb4f7130224e1a746e43a37f0f70700fb0dd07c7a404b255a62a148ec704e9ddf9bbcc2188096dae231216738147b11587c68933a9234153b9497bde3
+  checksum: f0da42c6334b4b7715bed6c555d6866c03c8c8bbedd014d886c869baa1572b4b14012f1b62a25906ab09061c1d332326c9e56e10ca5278f415918be381a2e544
   languageName: node
   linkType: hard
 
-"@react-stately/selection@npm:^3.17.0":
-  version: 3.17.0
-  resolution: "@react-stately/selection@npm:3.17.0"
+"@react-types/textfield@npm:^3.9.7":
+  version: 3.9.7
+  resolution: "@react-types/textfield@npm:3.9.7"
   dependencies:
-    "@react-stately/collections": ^3.11.0
-    "@react-stately/utils": ^3.10.4
     "@react-types/shared": ^3.25.0
-    "@swc/helpers": ^0.5.0
   peerDependencies:
     react: ^16.8.0 || ^17.0.0-rc.1 || ^18.0.0 || ^19.0.0
-  checksum: 3d0cac8fa729ca9b2d083d305e533ebdc229808d34505a52e1791d916fbe08d32413216efa3ae1c322da1cf9e59024bf9b2d9b7b68e3cb0d7d30fd4da4f0be42
+  checksum: e547b784c295f842f106652ef1ba301c335c05cfe6fc1367c3870d3b0e51eed8e5cd04572d3b1f056fa74f32bb23f4c75d2e821be3729313ff64a9989e4f5ff9
   languageName: node
   linkType: hard
 
-"@react-stately/slider@npm:^3.5.8":
-  version: 3.5.8
-  resolution: "@react-stately/slider@npm:3.5.8"
+"@react-types/tooltip@npm:^3.4.12":
+  version: 3.4.12
+  resolution: "@react-types/tooltip@npm:3.4.12"
   dependencies:
-    "@react-stately/utils": ^3.10.4
+    "@react-types/overlays": ^3.8.10
     "@react-types/shared": ^3.25.0
-    "@react-types/slider": ^3.7.6
-    "@swc/helpers": ^0.5.0
   peerDependencies:
     react: ^16.8.0 || ^17.0.0-rc.1 || ^18.0.0 || ^19.0.0
-  checksum: 47a8887a4732a5a0503632cc83c36f61793bd34893989e0f23d15268b8776b30754de43559e2e962ac60125dc1816d297c09e15ec7ecadd78595b1e05ac4c5cc
+  checksum: cc1dd4effeddeb768b256537e8b7ed492d77ac10245d936eac0a2d1e202c36a179c194bd50188fdee2c3caaf502dbc3c7861886746a12a1795f5ee26b8935180
   languageName: node
   linkType: hard
 
-"@react-stately/table@npm:^3.12.3":
-  version: 3.12.3
-  resolution: "@react-stately/table@npm:3.12.3"
+"@readme/better-ajv-errors@npm:^1.6.0":
+  version: 1.6.0
+  resolution: "@readme/better-ajv-errors@npm:1.6.0"
   dependencies:
-    "@react-stately/collections": ^3.11.0
-    "@react-stately/flags": ^3.0.4
-    "@react-stately/grid": ^3.9.3
-    "@react-stately/selection": ^3.17.0
-    "@react-stately/utils": ^3.10.4
-    "@react-types/grid": ^3.2.9
-    "@react-types/shared": ^3.25.0
-    "@react-types/table": ^3.10.2
-    "@swc/helpers": ^0.5.0
+    "@babel/code-frame": ^7.16.0
+    "@babel/runtime": ^7.21.0
+    "@humanwhocodes/momoa": ^2.0.3
+    chalk: ^4.1.2
+    json-to-ast: ^2.0.3
+    jsonpointer: ^5.0.0
+    leven: ^3.1.0
   peerDependencies:
-    react: ^16.8.0 || ^17.0.0-rc.1 || ^18.0.0 || ^19.0.0
-  checksum: 736f62ed831416212f836525408ad17ce396633620136786025cff47571461b97e047f9321ebfd8db889b02cda73a401b76108529314b74e7b88e44bd2909f59
+    ajv: 4.11.8 - 8
+  checksum: 2ff413ec6eb32f398d347a9e8be533f7a0f7dc897021d418efd5fd1d548bc66d760c4d2e583ab72598dc5c70f3901ee27265630418e7ae17fe94819d57295441
   languageName: node
   linkType: hard
 
-"@react-stately/tabs@npm:^3.6.10":
-  version: 3.6.10
-  resolution: "@react-stately/tabs@npm:3.6.10"
+"@readme/better-ajv-errors@npm:^2.3.2":
+  version: 2.3.2
+  resolution: "@readme/better-ajv-errors@npm:2.3.2"
   dependencies:
-    "@react-stately/list": ^3.11.0
-    "@react-types/shared": ^3.25.0
-    "@react-types/tabs": ^3.3.10
-    "@swc/helpers": ^0.5.0
+    "@babel/code-frame": ^7.22.5
+    "@babel/runtime": ^7.22.5
+    "@humanwhocodes/momoa": ^2.0.3
+    jsonpointer: ^5.0.0
+    leven: ^3.1.0
+    picocolors: ^1.1.1
   peerDependencies:
-    react: ^16.8.0 || ^17.0.0-rc.1 || ^18.0.0 || ^19.0.0
-  checksum: 308521c0810c7653b6015bfd4c6c2393dee1ef7780718e9322dc42a670a195b940440ecaed8acceccccf720d05e67efef789a12929778549f93697bd263540fb
+    ajv: 4.11.8 - 8
+  checksum: 0c16c686a5663e557321cb04f1ff26699b7f69cb38e47f8f7e78310178131d2423328201b74816f63a427dc814ba74d711f879e1b63581c8a82f9bbaacdad5f1
   languageName: node
   linkType: hard
 
-"@react-stately/toggle@npm:^3.7.8":
-  version: 3.7.8
-  resolution: "@react-stately/toggle@npm:3.7.8"
+"@readme/json-schema-ref-parser@npm:^1.2.0":
+  version: 1.2.1
+  resolution: "@readme/json-schema-ref-parser@npm:1.2.1"
   dependencies:
-    "@react-stately/utils": ^3.10.4
-    "@react-types/checkbox": ^3.8.4
-    "@swc/helpers": ^0.5.0
+    "@jsdevtools/ono": ^7.1.3
+    "@types/json-schema": ^7.0.12
+    call-me-maybe: ^1.0.1
+    js-yaml: ^4.1.0
+  checksum: e9487c8af051733dd4e54648009cd9dd43be2abcfc6fd0abe19bae788f944153df67caff560898c1d6bdf90ec2d3b63a24596dc7c4b37baa6293fa982eb8335c
+  languageName: node
+  linkType: hard
+
+"@readme/openapi-parser@npm:^2.5.0":
+  version: 2.5.0
+  resolution: "@readme/openapi-parser@npm:2.5.0"
+  dependencies:
+    "@apidevtools/openapi-schemas": ^2.1.0
+    "@apidevtools/swagger-methods": ^3.0.2
+    "@jsdevtools/ono": ^7.1.3
+    "@readme/better-ajv-errors": ^1.6.0
+    "@readme/json-schema-ref-parser": ^1.2.0
+    ajv: ^8.12.0
+    ajv-draft-04: ^1.0.0
+    call-me-maybe: ^1.0.1
   peerDependencies:
-    react: ^16.8.0 || ^17.0.0-rc.1 || ^18.0.0 || ^19.0.0
-  checksum: 765bb5e0c40a999b4a49babdcabf9cc9be81f9c967ee80345607ae77dc606cfb4ae730ea71af18298f636c5edb334801d2d3e2e6b123655cba67b4751d00e492
+    openapi-types: ">=7"
+  checksum: 4a70eae10c79f5a26ca0df8c558daf6547d0089c111b6b68e4bf6ee251be6f4fe0c4b6c7cbb731a90aaccdee4c21ed89a081bc28cbc464dce2fd7fa4add87661
   languageName: node
   linkType: hard
 
-"@react-stately/tooltip@npm:^3.4.13":
-  version: 3.4.13
-  resolution: "@react-stately/tooltip@npm:3.4.13"
+"@readme/openapi-parser@npm:^3.0.1":
+  version: 3.0.1
+  resolution: "@readme/openapi-parser@npm:3.0.1"
   dependencies:
-    "@react-stately/overlays": ^3.6.11
-    "@react-types/tooltip": ^3.4.12
-    "@swc/helpers": ^0.5.0
+    "@apidevtools/json-schema-ref-parser": ^11.9.2
+    "@readme/better-ajv-errors": ^2.3.2
+    "@readme/openapi-schemas": ^3.1.0
+    "@types/json-schema": ^7.0.15
+    ajv: ^8.12.0
+    ajv-draft-04: ^1.0.0
   peerDependencies:
-    react: ^16.8.0 || ^17.0.0-rc.1 || ^18.0.0 || ^19.0.0
-  checksum: b4322cf62ad87888898676e4cf19a75d56594851a2ca8035421e69d45b02486ea36bd7b977b7596621165b771f47c4fe1a7b23d785771f26afcd16fecad1ab8b
+    openapi-types: ">=7"
+  checksum: 447360bfc1f49b217569f76d084f508d6353463a80069ccf877115da7cd5d1ffcaba637bc1353154239c6bdf18cd5a3efb374d13495eb3254b6bc5afec20da74
+  languageName: node
+  linkType: hard
+
+"@readme/openapi-schemas@npm:^3.1.0":
+  version: 3.1.0
+  resolution: "@readme/openapi-schemas@npm:3.1.0"
+  checksum: 88d28d181b463b296c98bc288f2fc8975c302ec488edd1018ce8843c3eedbf3bb423ced934c6fd09bce4a0203fe9ea050bf2b3fa39a1bf665e41f87224dd71c5
+  languageName: node
+  linkType: hard
+
+"@rolldown/pluginutils@npm:1.0.0-beta.27":
+  version: 1.0.0-beta.27
+  resolution: "@rolldown/pluginutils@npm:1.0.0-beta.27"
+  checksum: 9658f235b345201d4f6bfb1f32da9754ca164f892d1cb68154fe5f53c1df42bd675ecd409836dff46884a7847d6c00bdc38af870f7c81e05bba5c2645eb4ab9c
+  languageName: node
+  linkType: hard
+
+"@rollup/rollup-android-arm-eabi@npm:4.54.0":
+  version: 4.54.0
+  resolution: "@rollup/rollup-android-arm-eabi@npm:4.54.0"
+  conditions: os=android & cpu=arm
+  languageName: node
+  linkType: hard
+
+"@rollup/rollup-android-arm64@npm:4.54.0":
+  version: 4.54.0
+  resolution: "@rollup/rollup-android-arm64@npm:4.54.0"
+  conditions: os=android & cpu=arm64
+  languageName: node
+  linkType: hard
+
+"@rollup/rollup-darwin-arm64@npm:4.54.0":
+  version: 4.54.0
+  resolution: "@rollup/rollup-darwin-arm64@npm:4.54.0"
+  conditions: os=darwin & cpu=arm64
+  languageName: node
+  linkType: hard
+
+"@rollup/rollup-darwin-x64@npm:4.54.0":
+  version: 4.54.0
+  resolution: "@rollup/rollup-darwin-x64@npm:4.54.0"
+  conditions: os=darwin & cpu=x64
+  languageName: node
+  linkType: hard
+
+"@rollup/rollup-freebsd-arm64@npm:4.54.0":
+  version: 4.54.0
+  resolution: "@rollup/rollup-freebsd-arm64@npm:4.54.0"
+  conditions: os=freebsd & cpu=arm64
+  languageName: node
+  linkType: hard
+
+"@rollup/rollup-freebsd-x64@npm:4.54.0":
+  version: 4.54.0
+  resolution: "@rollup/rollup-freebsd-x64@npm:4.54.0"
+  conditions: os=freebsd & cpu=x64
+  languageName: node
+  linkType: hard
+
+"@rollup/rollup-linux-arm-gnueabihf@npm:4.54.0":
+  version: 4.54.0
+  resolution: "@rollup/rollup-linux-arm-gnueabihf@npm:4.54.0"
+  conditions: os=linux & cpu=arm & libc=glibc
+  languageName: node
+  linkType: hard
+
+"@rollup/rollup-linux-arm-musleabihf@npm:4.54.0":
+  version: 4.54.0
+  resolution: "@rollup/rollup-linux-arm-musleabihf@npm:4.54.0"
+  conditions: os=linux & cpu=arm & libc=musl
+  languageName: node
+  linkType: hard
+
+"@rollup/rollup-linux-arm64-gnu@npm:4.54.0":
+  version: 4.54.0
+  resolution: "@rollup/rollup-linux-arm64-gnu@npm:4.54.0"
+  conditions: os=linux & cpu=arm64 & libc=glibc
+  languageName: node
+  linkType: hard
+
+"@rollup/rollup-linux-arm64-musl@npm:4.54.0":
+  version: 4.54.0
+  resolution: "@rollup/rollup-linux-arm64-musl@npm:4.54.0"
+  conditions: os=linux & cpu=arm64 & libc=musl
+  languageName: node
+  linkType: hard
+
+"@rollup/rollup-linux-loong64-gnu@npm:4.54.0":
+  version: 4.54.0
+  resolution: "@rollup/rollup-linux-loong64-gnu@npm:4.54.0"
+  conditions: os=linux & cpu=loong64 & libc=glibc
   languageName: node
   linkType: hard
 
-"@react-stately/tree@npm:^3.8.5":
-  version: 3.8.5
-  resolution: "@react-stately/tree@npm:3.8.5"
-  dependencies:
-    "@react-stately/collections": ^3.11.0
-    "@react-stately/selection": ^3.17.0
-    "@react-stately/utils": ^3.10.4
-    "@react-types/shared": ^3.25.0
-    "@swc/helpers": ^0.5.0
-  peerDependencies:
-    react: ^16.8.0 || ^17.0.0-rc.1 || ^18.0.0 || ^19.0.0
-  checksum: 6df95aa9c75ef87fed004641f73e1889950724fdd521e2447310d645b666da79ed7a67dd80b5db6c5b75903b03aa61b1ac3f84d39117d2951c115b9b19aae03f
+"@rollup/rollup-linux-ppc64-gnu@npm:4.54.0":
+  version: 4.54.0
+  resolution: "@rollup/rollup-linux-ppc64-gnu@npm:4.54.0"
+  conditions: os=linux & cpu=ppc64 & libc=glibc
   languageName: node
   linkType: hard
 
-"@react-stately/utils@npm:^3.10.4":
-  version: 3.10.4
-  resolution: "@react-stately/utils@npm:3.10.4"
-  dependencies:
-    "@swc/helpers": ^0.5.0
-  peerDependencies:
-    react: ^16.8.0 || ^17.0.0-rc.1 || ^18.0.0 || ^19.0.0
-  checksum: 875c11424fadf4419caceeee13e5bfdee2b0c330fe0220c0ea9d68d570cc9a34525f2f124d977e519b397a738cd2f8e36b7b03a046e3e7da99460e99282977a4
+"@rollup/rollup-linux-riscv64-gnu@npm:4.54.0":
+  version: 4.54.0
+  resolution: "@rollup/rollup-linux-riscv64-gnu@npm:4.54.0"
+  conditions: os=linux & cpu=riscv64 & libc=glibc
   languageName: node
   linkType: hard
 
-"@react-types/breadcrumbs@npm:^3.7.8":
-  version: 3.7.8
-  resolution: "@react-types/breadcrumbs@npm:3.7.8"
-  dependencies:
-    "@react-types/link": ^3.5.8
-    "@react-types/shared": ^3.25.0
-  peerDependencies:
-    react: ^16.8.0 || ^17.0.0-rc.1 || ^18.0.0 || ^19.0.0
-  checksum: 886f7c3b9e7196d8516814dcf8dfcaa437107c4e2e7d6db1b83adadbdab16fb3a12edb9e1b01b6f0524307394735766487d1129b1c8d4172e50eb8e3e0bae31a
+"@rollup/rollup-linux-riscv64-musl@npm:4.54.0":
+  version: 4.54.0
+  resolution: "@rollup/rollup-linux-riscv64-musl@npm:4.54.0"
+  conditions: os=linux & cpu=riscv64 & libc=musl
   languageName: node
   linkType: hard
 
-"@react-types/button@npm:^3.10.0":
-  version: 3.10.0
-  resolution: "@react-types/button@npm:3.10.0"
-  dependencies:
-    "@react-types/shared": ^3.25.0
-  peerDependencies:
-    react: ^16.8.0 || ^17.0.0-rc.1 || ^18.0.0 || ^19.0.0
-  checksum: 89395334f286f1a97a584715bbb87e7bb017d7366aa73ce0cec36ec8cb59059dec1f5afe3ab44f3972e0c50f44daeb2d531b10191d6f2b7f70c3ce7d3c94c0da
+"@rollup/rollup-linux-s390x-gnu@npm:4.54.0":
+  version: 4.54.0
+  resolution: "@rollup/rollup-linux-s390x-gnu@npm:4.54.0"
+  conditions: os=linux & cpu=s390x & libc=glibc
   languageName: node
   linkType: hard
 
-"@react-types/calendar@npm:^3.4.10":
-  version: 3.4.10
-  resolution: "@react-types/calendar@npm:3.4.10"
-  dependencies:
-    "@internationalized/date": ^3.5.6
-    "@react-types/shared": ^3.25.0
-  peerDependencies:
-    react: ^16.8.0 || ^17.0.0-rc.1 || ^18.0.0 || ^19.0.0
-  checksum: e4768b09c86739724f7fbdde41496859bfc6ba1d09071667da82f8914e8a5eef50cd168dc79d44782b8f2143547ea1326b476f0cce1cbbf667acecf5500bce95
+"@rollup/rollup-linux-x64-gnu@npm:4.54.0":
+  version: 4.54.0
+  resolution: "@rollup/rollup-linux-x64-gnu@npm:4.54.0"
+  conditions: os=linux & cpu=x64 & libc=glibc
   languageName: node
   linkType: hard
 
-"@react-types/checkbox@npm:^3.8.4":
-  version: 3.8.4
-  resolution: "@react-types/checkbox@npm:3.8.4"
-  dependencies:
-    "@react-types/shared": ^3.25.0
-  peerDependencies:
-    react: ^16.8.0 || ^17.0.0-rc.1 || ^18.0.0 || ^19.0.0
-  checksum: e2970200658c2035f3fd8d82e805ddd5cf402cf523e293a76a7e181c0b4234e657471c34c9eb0d4f421ed494e98214160efedc8c358d9bfa63ae4b3012d73b6e
+"@rollup/rollup-linux-x64-musl@npm:4.54.0":
+  version: 4.54.0
+  resolution: "@rollup/rollup-linux-x64-musl@npm:4.54.0"
+  conditions: os=linux & cpu=x64 & libc=musl
   languageName: node
   linkType: hard
 
-"@react-types/color@npm:^3.0.0":
-  version: 3.0.0
-  resolution: "@react-types/color@npm:3.0.0"
-  dependencies:
-    "@react-types/shared": ^3.25.0
-    "@react-types/slider": ^3.7.6
-  peerDependencies:
-    react: ^16.8.0 || ^17.0.0-rc.1 || ^18.0.0 || ^19.0.0
-  checksum: 77e69841a7b3d692c4b71594f58a3b0184ca1e1bc34d3e9a7a1d58e66ee2c4a93109977739fd19c8aca80edbf667b4fd3f8be03d9c6f2eb5587ee6550509cfbc
+"@rollup/rollup-openharmony-arm64@npm:4.54.0":
+  version: 4.54.0
+  resolution: "@rollup/rollup-openharmony-arm64@npm:4.54.0"
+  conditions: os=openharmony & cpu=arm64
   languageName: node
   linkType: hard
 
-"@react-types/combobox@npm:^3.13.0":
-  version: 3.13.0
-  resolution: "@react-types/combobox@npm:3.13.0"
-  dependencies:
-    "@react-types/shared": ^3.25.0
-  peerDependencies:
-    react: ^16.8.0 || ^17.0.0-rc.1 || ^18.0.0 || ^19.0.0
-  checksum: 0eb33769279d76d2043833d2bbc36d3357d5dd92a00807980d95d5c4198060d06e3146355f31287c6b678c8b5d80c8e57084a55de71ab5174a8e8794e4702dfe
+"@rollup/rollup-win32-arm64-msvc@npm:4.54.0":
+  version: 4.54.0
+  resolution: "@rollup/rollup-win32-arm64-msvc@npm:4.54.0"
+  conditions: os=win32 & cpu=arm64
   languageName: node
   linkType: hard
 
-"@react-types/datepicker@npm:^3.8.3":
-  version: 3.8.3
-  resolution: "@react-types/datepicker@npm:3.8.3"
-  dependencies:
-    "@internationalized/date": ^3.5.6
-    "@react-types/calendar": ^3.4.10
-    "@react-types/overlays": ^3.8.10
-    "@react-types/shared": ^3.25.0
-  peerDependencies:
-    react: ^16.8.0 || ^17.0.0-rc.1 || ^18.0.0 || ^19.0.0
-  checksum: c6b3c2c6757329d1fd636e40b0024a20875bf7f2c895e521d9941b9469b5a8ca19b2773ae8bd1adc35b1a5f9f9946b04cfc2032cd7e4fd99cbf2947f86a06d51
+"@rollup/rollup-win32-ia32-msvc@npm:4.54.0":
+  version: 4.54.0
+  resolution: "@rollup/rollup-win32-ia32-msvc@npm:4.54.0"
+  conditions: os=win32 & cpu=ia32
   languageName: node
   linkType: hard
 
-"@react-types/dialog@npm:^3.5.13":
-  version: 3.5.13
-  resolution: "@react-types/dialog@npm:3.5.13"
-  dependencies:
-    "@react-types/overlays": ^3.8.10
-    "@react-types/shared": ^3.25.0
-  peerDependencies:
-    react: ^16.8.0 || ^17.0.0-rc.1 || ^18.0.0 || ^19.0.0
-  checksum: 9cb9043694a1e48fbf0221effd28da602c314c64d653455d5616d8384adf93c78c87453a5b210ff587a221836adb5e2e7f9cb5b3f9a04c3522ad35dadba5d39a
+"@rollup/rollup-win32-x64-gnu@npm:4.54.0":
+  version: 4.54.0
+  resolution: "@rollup/rollup-win32-x64-gnu@npm:4.54.0"
+  conditions: os=win32 & cpu=x64
   languageName: node
   linkType: hard
 
-"@react-types/grid@npm:^3.2.9":
-  version: 3.2.9
-  resolution: "@react-types/grid@npm:3.2.9"
-  dependencies:
-    "@react-types/shared": ^3.25.0
-  peerDependencies:
-    react: ^16.8.0 || ^17.0.0-rc.1 || ^18.0.0 || ^19.0.0
-  checksum: 2645c4dafef3d10fe866a2a2ee9c17bce6fef9bf166bdf98e1de5bb6ed4cefc390eda87ea79ed8846cc94a9f57eb530577122d6063a14747ff3df2a08ec700cb
+"@rollup/rollup-win32-x64-msvc@npm:4.54.0":
+  version: 4.54.0
+  resolution: "@rollup/rollup-win32-x64-msvc@npm:4.54.0"
+  conditions: os=win32 & cpu=x64
   languageName: node
   linkType: hard
 
-"@react-types/link@npm:^3.5.8":
-  version: 3.5.8
-  resolution: "@react-types/link@npm:3.5.8"
-  dependencies:
-    "@react-types/shared": ^3.25.0
-  peerDependencies:
-    react: ^16.8.0 || ^17.0.0-rc.1 || ^18.0.0 || ^19.0.0
-  checksum: 39ac4827bb791d481bcf394429effc53dd446cf7e260ee1900c09327581b36650aa68f573d5002ac7d9e39ac5dbbb08e0d39cf0eeb408c2a3bfc2c8ce77a5cb7
+"@rtsao/scc@npm:^1.1.0":
+  version: 1.1.0
+  resolution: "@rtsao/scc@npm:1.1.0"
+  checksum: b5bcfb0d87f7d1c1c7c0f7693f53b07866ed9fec4c34a97a8c948fb9a7c0082e416ce4d3b60beb4f5e167cbe04cdeefbf6771320f3ede059b9ce91188c409a5b
   languageName: node
   linkType: hard
 
-"@react-types/listbox@npm:^3.5.2":
-  version: 3.5.2
-  resolution: "@react-types/listbox@npm:3.5.2"
-  dependencies:
-    "@react-types/shared": ^3.25.0
-  peerDependencies:
-    react: ^16.8.0 || ^17.0.0-rc.1 || ^18.0.0 || ^19.0.0
-  checksum: a4145e0290e79c7ac0ae97f64384949f5156e75f4f05b1db17c36c1c31233dbfa7bc8509601dbb8782c24f77142a625db9e087b8a911acd385742f23d3d931bd
+"@rushstack/eslint-patch@npm:^1.10.3":
+  version: 1.10.4
+  resolution: "@rushstack/eslint-patch@npm:1.10.4"
+  checksum: de312bd7a3cb0f313c9720029eb719d8762fe54946cce2d33ac142b1cbb5817c4a5a92518dfa476c26311602d37f5a8f7caa90a0c73e3d6a56f9a05d2799c172
   languageName: node
   linkType: hard
 
-"@react-types/menu@npm:^3.9.12":
-  version: 3.9.12
-  resolution: "@react-types/menu@npm:3.9.12"
+"@sanity/client@npm:^7.11.0":
+  version: 7.11.0
+  resolution: "@sanity/client@npm:7.11.0"
   dependencies:
-    "@react-types/overlays": ^3.8.10
-    "@react-types/shared": ^3.25.0
-  peerDependencies:
-    react: ^16.8.0 || ^17.0.0-rc.1 || ^18.0.0 || ^19.0.0
-  checksum: c0f5be96e7fce99143ee564bf2debfc61c43ce5459dc4dc60118d4d873877cae9796c736dea88a1da892ea633fadd179c156c37b070a44eb4060f85a3007eb81
+    "@sanity/eventsource": ^5.0.2
+    get-it: ^8.6.9
+    nanoid: ^3.3.11
+    rxjs: ^7.0.0
+  checksum: a171aa5248838096ea55a6cd04038d8f662fa1eb06f3653a0f58d47f26beff9740f896693e2b06ba0feb1f4eaccbb0abf03aa5547162e958e1d0e7077c6c31d4
   languageName: node
   linkType: hard
 
-"@react-types/meter@npm:^3.4.4":
-  version: 3.4.4
-  resolution: "@react-types/meter@npm:3.4.4"
+"@sanity/eventsource@npm:^5.0.2":
+  version: 5.0.2
+  resolution: "@sanity/eventsource@npm:5.0.2"
   dependencies:
-    "@react-types/progress": ^3.5.7
-  peerDependencies:
-    react: ^16.8.0 || ^17.0.0-rc.1 || ^18.0.0 || ^19.0.0
-  checksum: 0fa94ee35264e3d600e424aba3b21dd6b0896c6877d723381ea5a34c7594e8079b81ce3b2115d6420695ed0004d7251e4d5dc93b6ad8c06c8de8fb30c085ee45
+    "@types/event-source-polyfill": 1.0.5
+    "@types/eventsource": 1.1.15
+    event-source-polyfill: 1.0.31
+    eventsource: 2.0.2
+  checksum: 7896e5bf1afd1811db22479ea6c529bf2042c2ef1d17fede26b5eafba839235cff35a53fdb68fa53b90975dba993f884d13a262ca9a729e9d97020f958743cee
   languageName: node
   linkType: hard
 
-"@react-types/numberfield@npm:^3.8.6":
-  version: 3.8.6
-  resolution: "@react-types/numberfield@npm:3.8.6"
+"@segment/analytics-core@npm:1.8.0":
+  version: 1.8.0
+  resolution: "@segment/analytics-core@npm:1.8.0"
   dependencies:
-    "@react-types/shared": ^3.25.0
-  peerDependencies:
-    react: ^16.8.0 || ^17.0.0-rc.1 || ^18.0.0 || ^19.0.0
-  checksum: f15d30246d8e33e360f4c3398ffc287aa8bb9e133e7b3368cd3c05a80c18df4cbf46fe4dbaafd7cb18bb268632a291030e7e71d1c4ea794d366afb7a75512c32
+    "@lukeed/uuid": ^2.0.0
+    "@segment/analytics-generic-utils": 1.2.0
+    dset: ^3.1.4
+    tslib: ^2.4.1
+  checksum: ca7040a726cb17c46374409192bef1cac458fc6c17ea3694f0f1a5bc6bbeefaccd7cdcc66720949971b77b8ed482e2c43ca838341679259111cc76b3f8ee115c
   languageName: node
   linkType: hard
 
-"@react-types/overlays@npm:^3.8.10":
-  version: 3.8.10
-  resolution: "@react-types/overlays@npm:3.8.10"
+"@segment/analytics-generic-utils@npm:1.2.0":
+  version: 1.2.0
+  resolution: "@segment/analytics-generic-utils@npm:1.2.0"
   dependencies:
-    "@react-types/shared": ^3.25.0
-  peerDependencies:
-    react: ^16.8.0 || ^17.0.0-rc.1 || ^18.0.0 || ^19.0.0
-  checksum: 753fd637dab9e189403cab8567a88fce183de8013dcec705fe3ed813facaa7a95fa754af5a45f364787c4351132d27ebaf3184e0e14955c47bf80b82560c3539
+    tslib: ^2.4.1
+  checksum: 2f9aebc1027ed2d1afcb02338ed4971f774ce25250c499cac6c1c0020a7376e05b56411d38d36ee1cf0cec49cfdb82e68cd3f5d868b47b9e61b3b668bd27e122
   languageName: node
   linkType: hard
 
-"@react-types/progress@npm:^3.5.7":
-  version: 3.5.7
-  resolution: "@react-types/progress@npm:3.5.7"
+"@segment/analytics-next@npm:^1.75.0":
+  version: 1.75.0
+  resolution: "@segment/analytics-next@npm:1.75.0"
   dependencies:
-    "@react-types/shared": ^3.25.0
-  peerDependencies:
-    react: ^16.8.0 || ^17.0.0-rc.1 || ^18.0.0 || ^19.0.0
-  checksum: 8780f97a5e3400e2381ed6659511a74fdfa8a3aa21499c8fe1fcd92386460569c56032d60297dd0786744d460cd515ebf4f663ea4b1a1f57e717e2da977dd581
+    "@lukeed/uuid": ^2.0.0
+    "@segment/analytics-core": 1.8.0
+    "@segment/analytics-generic-utils": 1.2.0
+    "@segment/analytics.js-video-plugins": ^0.2.1
+    "@segment/facade": ^3.4.9
+    dset: ^3.1.4
+    js-cookie: 3.0.1
+    node-fetch: ^2.6.7
+    tslib: ^2.4.1
+    unfetch: ^4.1.0
+  checksum: ff1a0c551cf94f37faa784317680fb5175045646579afe125282b6aa232174afa60472a6d3dba872f27b4dda57ad692a5b8fc23f227a24889d0ee610ba85dc17
   languageName: node
   linkType: hard
 
-"@react-types/radio@npm:^3.8.4":
-  version: 3.8.4
-  resolution: "@react-types/radio@npm:3.8.4"
-  dependencies:
-    "@react-types/shared": ^3.25.0
-  peerDependencies:
-    react: ^16.8.0 || ^17.0.0-rc.1 || ^18.0.0 || ^19.0.0
-  checksum: 2a7395f07810b3ae128c329f31d00f0bda3ecc03a8203e17cda7fbc0be019bb01113b8af6d0f73334168ae2fd13763ef4d1138c3f8b3d49ef2c858e33df2f3ae
+"@segment/analytics.js-video-plugins@npm:^0.2.1":
+  version: 0.2.1
+  resolution: "@segment/analytics.js-video-plugins@npm:0.2.1"
+  dependencies:
+    unfetch: ^3.1.1
+  checksum: 6c41cb6c78f5db5bff22504dc0f6564bfc89ad0725c112d13001197ba26274fbdebac8defe51de24d1a74da3102beebd852bab884041b965b38732ceda553af5
   languageName: node
   linkType: hard
 
-"@react-types/searchfield@npm:^3.5.9":
-  version: 3.5.9
-  resolution: "@react-types/searchfield@npm:3.5.9"
+"@segment/facade@npm:^3.4.9":
+  version: 3.4.10
+  resolution: "@segment/facade@npm:3.4.10"
   dependencies:
-    "@react-types/shared": ^3.25.0
-    "@react-types/textfield": ^3.9.7
-  peerDependencies:
-    react: ^16.8.0 || ^17.0.0-rc.1 || ^18.0.0 || ^19.0.0
-  checksum: 5e7d644e86a6ffb41c6230ef57e2ccdcfc1ad045a035a1c88aeb476054854fdc0542bfd62a8b3d23d4f19adf7e117c90ca9d8afd5726d7b039ed52f9ebed0639
+    "@segment/isodate-traverse": ^1.1.1
+    inherits: ^2.0.4
+    new-date: ^1.0.3
+    obj-case: 0.2.1
+  checksum: bfbde4e3270a9d47f50b6bc764ae145fbb9d35e6d9cb6a969af95da94fd33ec5c9952d6c9b9105a087d9a96e2c0a304f0ec86281e8fce40f49c3b32ab58f188c
   languageName: node
   linkType: hard
 
-"@react-types/select@npm:^3.9.7":
-  version: 3.9.7
-  resolution: "@react-types/select@npm:3.9.7"
+"@segment/isodate-traverse@npm:^1.1.1":
+  version: 1.1.1
+  resolution: "@segment/isodate-traverse@npm:1.1.1"
   dependencies:
-    "@react-types/shared": ^3.25.0
-  peerDependencies:
-    react: ^16.8.0 || ^17.0.0-rc.1 || ^18.0.0 || ^19.0.0
-  checksum: 438a23b9be9469d81f2c0da0904ac76ce163ea41b03ca05c744a0d96b323837f1f0270b58dde83303970b2755202cc6dbbc109d8c9cce9c69100c56dfca967ab
+    "@segment/isodate": ^1.0.3
+  checksum: 37f78eb7b8e2b57715bd4a7b396961b7d19d1be9e5c02bec539da8643ddd34dbcc223f08c2924e882a43ca149fe3f2f0586a8d6a53f418829068549404b21981
   languageName: node
   linkType: hard
 
-"@react-types/shared@npm:^3.25.0":
-  version: 3.25.0
-  resolution: "@react-types/shared@npm:3.25.0"
-  peerDependencies:
-    react: ^16.8.0 || ^17.0.0-rc.1 || ^18.0.0 || ^19.0.0
-  checksum: d168f6b404c345928ef8ead94f0cecd3831d8f6df708dbe897ac62d566949a0931c3b0d95ef6dd02bc5af05b183781b531e6f041ffd1d320bc2cab7697fd27d0
+"@segment/isodate@npm:1.0.3, @segment/isodate@npm:^1.0.3":
+  version: 1.0.3
+  resolution: "@segment/isodate@npm:1.0.3"
+  checksum: 0b2e9e580fe505e617d7dfbd2d046a3f3bcc7f1f1d1fbaba7728ad1c9da9e47d13a60ec344e2d80b0694d3ed93129d168108e91d4ce2f48012f87dbb40925e8d
   languageName: node
   linkType: hard
 
-"@react-types/slider@npm:^3.7.6":
-  version: 3.7.6
-  resolution: "@react-types/slider@npm:3.7.6"
-  dependencies:
-    "@react-types/shared": ^3.25.0
-  peerDependencies:
-    react: ^16.8.0 || ^17.0.0-rc.1 || ^18.0.0 || ^19.0.0
-  checksum: 06efeb2076380eafe0ac2b20d72fa4c2072f1dd85346a49388bd7fae76fd78d143c457fd1732c5dbccd34e2e16593d1672a76b51fa986554343319cfc996042e
+"@sindresorhus/is@npm:^7.0.2":
+  version: 7.2.0
+  resolution: "@sindresorhus/is@npm:7.2.0"
+  checksum: 0040c17d7826414363f99f5d56077c200789d51e6dfe5542920bfb29ab3828ec0ebf2845e8bae796bee461debb646b5e4c0a623140131cf3143471e915b50b54
   languageName: node
   linkType: hard
 
-"@react-types/switch@npm:^3.5.6":
-  version: 3.5.6
-  resolution: "@react-types/switch@npm:3.5.6"
+"@smithy/config-resolver@npm:^4.4.17, @smithy/config-resolver@npm:^4.4.6":
+  version: 4.5.0
+  resolution: "@smithy/config-resolver@npm:4.5.0"
   dependencies:
-    "@react-types/shared": ^3.25.0
-  peerDependencies:
-    react: ^16.8.0 || ^17.0.0-rc.1 || ^18.0.0 || ^19.0.0
-  checksum: 9c32a3306adf1afd103b3187e01be475f6e3f42391a2fe652312eb5fd89cc83087ceb6b9ea510f9f894593a695cb70ce00063aba6d808f6bc1cbbaa93f47f38b
+    "@smithy/core": ^3.24.0
+    tslib: ^2.6.2
+  checksum: d85777a1ee614c4574cf269ace4bde4ebf7dadf2d6bfc853d6e916246cb7679a47056d1a1f91f6c5f4eab01cdadc49a7f56b0c889e4f2e3929a06efbaa8e19ec
   languageName: node
   linkType: hard
 
-"@react-types/table@npm:^3.10.2":
-  version: 3.10.2
-  resolution: "@react-types/table@npm:3.10.2"
+"@smithy/core@npm:^3.22.0, @smithy/core@npm:^3.23.17, @smithy/core@npm:^3.24.0":
+  version: 3.24.0
+  resolution: "@smithy/core@npm:3.24.0"
   dependencies:
-    "@react-types/grid": ^3.2.9
-    "@react-types/shared": ^3.25.0
-  peerDependencies:
-    react: ^16.8.0 || ^17.0.0-rc.1 || ^18.0.0 || ^19.0.0
-  checksum: e25e393192a2d272b5a35a864b566c0f86ad923b5420df37c161d5f8e39b333f0759caaa6e94fb166fadd22ddf07a3da57f57f8e47843ce1f5fc296be305e879
+    "@aws-crypto/crc32": 5.2.0
+    "@smithy/types": ^4.14.1
+    tslib: ^2.6.2
+  checksum: f317e449a193e9e12afd76719ea58cdfb316d03fc46e6452b20a089665c86941a76f30e7c7a0bc9e2232334e673d432c08f647ca6651a2c145a33198ec0ee0d6
   languageName: node
   linkType: hard
 
-"@react-types/tabs@npm:^3.3.10":
-  version: 3.3.10
-  resolution: "@react-types/tabs@npm:3.3.10"
+"@smithy/credential-provider-imds@npm:^4.2.14":
+  version: 4.3.0
+  resolution: "@smithy/credential-provider-imds@npm:4.3.0"
   dependencies:
-    "@react-types/shared": ^3.25.0
-  peerDependencies:
-    react: ^16.8.0 || ^17.0.0-rc.1 || ^18.0.0 || ^19.0.0
-  checksum: f0da42c6334b4b7715bed6c555d6866c03c8c8bbedd014d886c869baa1572b4b14012f1b62a25906ab09061c1d332326c9e56e10ca5278f415918be381a2e544
+    "@smithy/core": ^3.24.0
+    "@smithy/types": ^4.14.1
+    tslib: ^2.6.2
+  checksum: b3bc4c5f3123dee1043fe3ff22c1c24d8e00cad66f41739a6ab8489d1571167444bd0d4568c3b10ad624adb35c73f39a6fa1cfaf6d830aa3b0dbb4f8c654253c
   languageName: node
   linkType: hard
 
-"@react-types/textfield@npm:^3.9.7":
-  version: 3.9.7
-  resolution: "@react-types/textfield@npm:3.9.7"
+"@smithy/eventstream-serde-browser@npm:^4.2.14, @smithy/eventstream-serde-browser@npm:^4.2.8":
+  version: 4.3.0
+  resolution: "@smithy/eventstream-serde-browser@npm:4.3.0"
   dependencies:
-    "@react-types/shared": ^3.25.0
-  peerDependencies:
-    react: ^16.8.0 || ^17.0.0-rc.1 || ^18.0.0 || ^19.0.0
-  checksum: e547b784c295f842f106652ef1ba301c335c05cfe6fc1367c3870d3b0e51eed8e5cd04572d3b1f056fa74f32bb23f4c75d2e821be3729313ff64a9989e4f5ff9
+    "@smithy/core": ^3.24.0
+    tslib: ^2.6.2
+  checksum: a08f3f52a352b7a9011fe9383707f6b2bf13ca62f2aeda38043305acce75e821a8b6cb9779be370ecbae1dc7b8c61b5847aaf425e5ed296cfa8a81a7ff370c97
   languageName: node
   linkType: hard
 
-"@react-types/tooltip@npm:^3.4.12":
-  version: 3.4.12
-  resolution: "@react-types/tooltip@npm:3.4.12"
+"@smithy/eventstream-serde-config-resolver@npm:^4.3.14, @smithy/eventstream-serde-config-resolver@npm:^4.3.8":
+  version: 4.4.0
+  resolution: "@smithy/eventstream-serde-config-resolver@npm:4.4.0"
   dependencies:
-    "@react-types/overlays": ^3.8.10
-    "@react-types/shared": ^3.25.0
-  peerDependencies:
-    react: ^16.8.0 || ^17.0.0-rc.1 || ^18.0.0 || ^19.0.0
-  checksum: cc1dd4effeddeb768b256537e8b7ed492d77ac10245d936eac0a2d1e202c36a179c194bd50188fdee2c3caaf502dbc3c7861886746a12a1795f5ee26b8935180
+    "@smithy/core": ^3.24.0
+    tslib: ^2.6.2
+  checksum: bbfa08ebdd1e85d1fd88cac12718a4a6287f0dd9d07bf28f2c951bc6d9059dca7a1568abee3b87efc929df8d9579b81cdbe730594dde84a6c2aaac791e607b45
   languageName: node
   linkType: hard
 
-"@readme/better-ajv-errors@npm:^1.6.0":
-  version: 1.6.0
-  resolution: "@readme/better-ajv-errors@npm:1.6.0"
+"@smithy/eventstream-serde-node@npm:^4.2.14, @smithy/eventstream-serde-node@npm:^4.2.8":
+  version: 4.3.0
+  resolution: "@smithy/eventstream-serde-node@npm:4.3.0"
   dependencies:
-    "@babel/code-frame": ^7.16.0
-    "@babel/runtime": ^7.21.0
-    "@humanwhocodes/momoa": ^2.0.3
-    chalk: ^4.1.2
-    json-to-ast: ^2.0.3
-    jsonpointer: ^5.0.0
-    leven: ^3.1.0
-  peerDependencies:
-    ajv: 4.11.8 - 8
-  checksum: 2ff413ec6eb32f398d347a9e8be533f7a0f7dc897021d418efd5fd1d548bc66d760c4d2e583ab72598dc5c70f3901ee27265630418e7ae17fe94819d57295441
+    "@smithy/core": ^3.24.0
+    tslib: ^2.6.2
+  checksum: 6bd23367e6d797f1f1fb56ad59ffdb1bdce0e37bca178ad26a11c7fbefb28b2e0dd9ace39343afb374beb0e20c63185179c0463dd764ffb9a7085fd38247538e
   languageName: node
   linkType: hard
 
-"@readme/better-ajv-errors@npm:^2.3.2":
-  version: 2.3.2
-  resolution: "@readme/better-ajv-errors@npm:2.3.2"
+"@smithy/fetch-http-handler@npm:^5.3.17, @smithy/fetch-http-handler@npm:^5.3.9":
+  version: 5.4.0
+  resolution: "@smithy/fetch-http-handler@npm:5.4.0"
   dependencies:
-    "@babel/code-frame": ^7.22.5
-    "@babel/runtime": ^7.22.5
-    "@humanwhocodes/momoa": ^2.0.3
-    jsonpointer: ^5.0.0
-    leven: ^3.1.0
-    picocolors: ^1.1.1
-  peerDependencies:
-    ajv: 4.11.8 - 8
-  checksum: 0c16c686a5663e557321cb04f1ff26699b7f69cb38e47f8f7e78310178131d2423328201b74816f63a427dc814ba74d711f879e1b63581c8a82f9bbaacdad5f1
+    "@smithy/core": ^3.24.0
+    "@smithy/types": ^4.14.1
+    tslib: ^2.6.2
+  checksum: d043f9cf9055eb44da8ac932bc5f04f313a69a43c60bdc5daaf0777ce724fab6f760717c62f385f1d44dc183e1211e333ea673d10c1b5c1afe56a912e17dd800
   languageName: node
   linkType: hard
 
-"@readme/json-schema-ref-parser@npm:^1.2.0":
-  version: 1.2.1
-  resolution: "@readme/json-schema-ref-parser@npm:1.2.1"
+"@smithy/hash-blob-browser@npm:^4.2.15, @smithy/hash-blob-browser@npm:^4.2.9":
+  version: 4.3.0
+  resolution: "@smithy/hash-blob-browser@npm:4.3.0"
   dependencies:
-    "@jsdevtools/ono": ^7.1.3
-    "@types/json-schema": ^7.0.12
-    call-me-maybe: ^1.0.1
-    js-yaml: ^4.1.0
-  checksum: e9487c8af051733dd4e54648009cd9dd43be2abcfc6fd0abe19bae788f944153df67caff560898c1d6bdf90ec2d3b63a24596dc7c4b37baa6293fa982eb8335c
+    "@smithy/core": ^3.24.0
+    tslib: ^2.6.2
+  checksum: a5cfc9e1b46e63f89d54f90acdcebff350b67a179fa6299ab2b95d6486f1f6c5da84817ed4ea50eeb93fae3399f9d8d79c7fa91dc8546eb5901cf20ca5c6a8e2
   languageName: node
   linkType: hard
 
-"@readme/openapi-parser@npm:^2.5.0":
-  version: 2.5.0
-  resolution: "@readme/openapi-parser@npm:2.5.0"
+"@smithy/hash-node@npm:^4.2.14, @smithy/hash-node@npm:^4.2.8":
+  version: 4.3.0
+  resolution: "@smithy/hash-node@npm:4.3.0"
   dependencies:
-    "@apidevtools/openapi-schemas": ^2.1.0
-    "@apidevtools/swagger-methods": ^3.0.2
-    "@jsdevtools/ono": ^7.1.3
-    "@readme/better-ajv-errors": ^1.6.0
-    "@readme/json-schema-ref-parser": ^1.2.0
-    ajv: ^8.12.0
-    ajv-draft-04: ^1.0.0
-    call-me-maybe: ^1.0.1
-  peerDependencies:
-    openapi-types: ">=7"
-  checksum: 4a70eae10c79f5a26ca0df8c558daf6547d0089c111b6b68e4bf6ee251be6f4fe0c4b6c7cbb731a90aaccdee4c21ed89a081bc28cbc464dce2fd7fa4add87661
+    "@smithy/core": ^3.24.0
+    tslib: ^2.6.2
+  checksum: 2b0618a249fb659d5ecb926a1dfa80c91af167e8f762c78704a5cc4150a722c41b0fb7ff8e5f506fcfc7798606fea0f73e80f62e428666c4d03d4be86a6c7ec6
   languageName: node
   linkType: hard
 
-"@readme/openapi-parser@npm:^3.0.1":
-  version: 3.0.1
-  resolution: "@readme/openapi-parser@npm:3.0.1"
+"@smithy/hash-stream-node@npm:^4.2.14, @smithy/hash-stream-node@npm:^4.2.8":
+  version: 4.3.0
+  resolution: "@smithy/hash-stream-node@npm:4.3.0"
   dependencies:
-    "@apidevtools/json-schema-ref-parser": ^11.9.2
-    "@readme/better-ajv-errors": ^2.3.2
-    "@readme/openapi-schemas": ^3.1.0
-    "@types/json-schema": ^7.0.15
-    ajv: ^8.12.0
-    ajv-draft-04: ^1.0.0
-  peerDependencies:
-    openapi-types: ">=7"
-  checksum: 447360bfc1f49b217569f76d084f508d6353463a80069ccf877115da7cd5d1ffcaba637bc1353154239c6bdf18cd5a3efb374d13495eb3254b6bc5afec20da74
-  languageName: node
-  linkType: hard
-
-"@readme/openapi-schemas@npm:^3.1.0":
-  version: 3.1.0
-  resolution: "@readme/openapi-schemas@npm:3.1.0"
-  checksum: 88d28d181b463b296c98bc288f2fc8975c302ec488edd1018ce8843c3eedbf3bb423ced934c6fd09bce4a0203fe9ea050bf2b3fa39a1bf665e41f87224dd71c5
+    "@smithy/core": ^3.24.0
+    tslib: ^2.6.2
+  checksum: 11dbab69600f54618e95baaf510c462146a8ba08a79351b8328125f11b430bc1792c42c3502c6fe88c36fca4e0fda364dd1a0e265261a6f04e9ef2d95016e6a2
   languageName: node
   linkType: hard
 
-"@rolldown/pluginutils@npm:1.0.0-beta.27":
-  version: 1.0.0-beta.27
-  resolution: "@rolldown/pluginutils@npm:1.0.0-beta.27"
-  checksum: 9658f235b345201d4f6bfb1f32da9754ca164f892d1cb68154fe5f53c1df42bd675ecd409836dff46884a7847d6c00bdc38af870f7c81e05bba5c2645eb4ab9c
+"@smithy/invalid-dependency@npm:^4.2.14, @smithy/invalid-dependency@npm:^4.2.8":
+  version: 4.3.0
+  resolution: "@smithy/invalid-dependency@npm:4.3.0"
+  dependencies:
+    "@smithy/core": ^3.24.0
+    tslib: ^2.6.2
+  checksum: 26a9ffba4d89a05aa71837d4f869d39920de24765542699b980269bf2a4e296d7c02f97ca4c8a3fb8e939100d0209c9d41d5d05c4ff5ea3d0d8f4855437437ef
   languageName: node
   linkType: hard
 
-"@rollup/rollup-android-arm-eabi@npm:4.54.0":
-  version: 4.54.0
-  resolution: "@rollup/rollup-android-arm-eabi@npm:4.54.0"
-  conditions: os=android & cpu=arm
+"@smithy/is-array-buffer@npm:^2.2.0":
+  version: 2.2.0
+  resolution: "@smithy/is-array-buffer@npm:2.2.0"
+  dependencies:
+    tslib: ^2.6.2
+  checksum: 2f2523cd8cc4538131e408eb31664983fecb0c8724956788b015aaf3ab85a0c976b50f4f09b176f1ed7bbe79f3edf80743be7a80a11f22cd9ce1285d77161aaf
   languageName: node
   linkType: hard
 
-"@rollup/rollup-android-arm64@npm:4.54.0":
-  version: 4.54.0
-  resolution: "@rollup/rollup-android-arm64@npm:4.54.0"
-  conditions: os=android & cpu=arm64
+"@smithy/is-array-buffer@npm:^4.2.2":
+  version: 4.3.0
+  resolution: "@smithy/is-array-buffer@npm:4.3.0"
+  dependencies:
+    "@smithy/core": ^3.24.0
+    tslib: ^2.6.2
+  checksum: 091afb4f7b240f30f3a169bc2ceec8d4f398d0a56a6125e1a5df540531f888bcff280d965069464ddc20fafb3bfe14d2f3a66703ae3980abf52ca9a31bdac8b6
   languageName: node
   linkType: hard
 
-"@rollup/rollup-darwin-arm64@npm:4.54.0":
-  version: 4.54.0
-  resolution: "@rollup/rollup-darwin-arm64@npm:4.54.0"
-  conditions: os=darwin & cpu=arm64
+"@smithy/md5-js@npm:^4.2.14, @smithy/md5-js@npm:^4.2.8":
+  version: 4.3.0
+  resolution: "@smithy/md5-js@npm:4.3.0"
+  dependencies:
+    "@smithy/core": ^3.24.0
+    tslib: ^2.6.2
+  checksum: 24d33ac9a7b64af46c643602f79756221043e7b982f8db29ddccdf66ca917d0bd44f0a7b83423680eefea0d8a8bea8f11560e317337e92a4a498b7cb52f9a247
   languageName: node
   linkType: hard
 
-"@rollup/rollup-darwin-x64@npm:4.54.0":
-  version: 4.54.0
-  resolution: "@rollup/rollup-darwin-x64@npm:4.54.0"
-  conditions: os=darwin & cpu=x64
+"@smithy/middleware-content-length@npm:^4.2.14, @smithy/middleware-content-length@npm:^4.2.8":
+  version: 4.3.0
+  resolution: "@smithy/middleware-content-length@npm:4.3.0"
+  dependencies:
+    "@smithy/core": ^3.24.0
+    tslib: ^2.6.2
+  checksum: a21bacf4ea019abdb9aee6d57df8be6f3943ca8f0208a1bb13ba9d77dae60f56391b0201028a5e89b75172c6b01f304ff22c6eb7cb99d62ff52e3c765fde6e51
   languageName: node
   linkType: hard
 
-"@rollup/rollup-freebsd-arm64@npm:4.54.0":
-  version: 4.54.0
-  resolution: "@rollup/rollup-freebsd-arm64@npm:4.54.0"
-  conditions: os=freebsd & cpu=arm64
+"@smithy/middleware-endpoint@npm:^4.4.12, @smithy/middleware-endpoint@npm:^4.4.32":
+  version: 4.5.0
+  resolution: "@smithy/middleware-endpoint@npm:4.5.0"
+  dependencies:
+    "@smithy/core": ^3.24.0
+    tslib: ^2.6.2
+  checksum: 7e2dced85eda01cc4590a63d9c9f7c157a8a4bd6c08e6229a37cd68830e8ab0e902e9769fddf2f052bca640c70c911d9ea46300a9de3afbfd3b30f5ba21bec41
   languageName: node
   linkType: hard
 
-"@rollup/rollup-freebsd-x64@npm:4.54.0":
-  version: 4.54.0
-  resolution: "@rollup/rollup-freebsd-x64@npm:4.54.0"
-  conditions: os=freebsd & cpu=x64
+"@smithy/middleware-retry@npm:^4.4.29, @smithy/middleware-retry@npm:^4.5.7":
+  version: 4.6.0
+  resolution: "@smithy/middleware-retry@npm:4.6.0"
+  dependencies:
+    "@smithy/core": ^3.24.0
+    tslib: ^2.6.2
+  checksum: fb94a3643833802e7c54c3e125b381a3445f1f6550355d8283480f13097bfaa9cd79fc77d6cd58dd42a4173430e244a892efbe8118a3aaec3f6fca504c04a5c4
   languageName: node
   linkType: hard
 
-"@rollup/rollup-linux-arm-gnueabihf@npm:4.54.0":
-  version: 4.54.0
-  resolution: "@rollup/rollup-linux-arm-gnueabihf@npm:4.54.0"
-  conditions: os=linux & cpu=arm & libc=glibc
+"@smithy/middleware-serde@npm:^4.2.20, @smithy/middleware-serde@npm:^4.2.9":
+  version: 4.3.0
+  resolution: "@smithy/middleware-serde@npm:4.3.0"
+  dependencies:
+    "@smithy/core": ^3.24.0
+    tslib: ^2.6.2
+  checksum: e493ac0119d833eb1095ed3fda81e64a68397f64fc978da1390f7fb46d2d027b1caf5278fb47c18c3779ba46a05f6187a6678b204789f8dd9df044b5abbaa410
   languageName: node
   linkType: hard
 
-"@rollup/rollup-linux-arm-musleabihf@npm:4.54.0":
-  version: 4.54.0
-  resolution: "@rollup/rollup-linux-arm-musleabihf@npm:4.54.0"
-  conditions: os=linux & cpu=arm & libc=musl
+"@smithy/middleware-stack@npm:^4.2.14, @smithy/middleware-stack@npm:^4.2.8":
+  version: 4.3.0
+  resolution: "@smithy/middleware-stack@npm:4.3.0"
+  dependencies:
+    "@smithy/core": ^3.24.0
+    tslib: ^2.6.2
+  checksum: af46e3955eea01fb16110c0b27984dc59eb927980b4b0273f11c7e77523500308fb3d0ad080e3befe5f0df1d4b3ca669dad800dc0cc3f1b7875bbf8a7742d980
   languageName: node
   linkType: hard
 
-"@rollup/rollup-linux-arm64-gnu@npm:4.54.0":
-  version: 4.54.0
-  resolution: "@rollup/rollup-linux-arm64-gnu@npm:4.54.0"
-  conditions: os=linux & cpu=arm64 & libc=glibc
+"@smithy/node-config-provider@npm:^4.3.14, @smithy/node-config-provider@npm:^4.3.8":
+  version: 4.4.0
+  resolution: "@smithy/node-config-provider@npm:4.4.0"
+  dependencies:
+    "@smithy/core": ^3.24.0
+    tslib: ^2.6.2
+  checksum: 30842eedc192179cf7ceb93ae7d1fa28d2fe40417b713e1dcdec927256937d635f9c3167a4e9252f8c6c24450a361be1234e86b30d216477a09f2598bd1caf65
   languageName: node
   linkType: hard
 
-"@rollup/rollup-linux-arm64-musl@npm:4.54.0":
-  version: 4.54.0
-  resolution: "@rollup/rollup-linux-arm64-musl@npm:4.54.0"
-  conditions: os=linux & cpu=arm64 & libc=musl
+"@smithy/node-http-handler@npm:^4.4.8, @smithy/node-http-handler@npm:^4.6.1":
+  version: 4.7.0
+  resolution: "@smithy/node-http-handler@npm:4.7.0"
+  dependencies:
+    "@smithy/core": ^3.24.0
+    "@smithy/types": ^4.14.1
+    tslib: ^2.6.2
+  checksum: bc0fc552675d0d74137b43cf6c7b1ec2a7f9a4d12e506b00aa1ab204d9e31fa5fe0904eb949c3a0be8d8209f8fd2ca658fe7b3561f979b3ed376e212c5122e10
   languageName: node
   linkType: hard
 
-"@rollup/rollup-linux-loong64-gnu@npm:4.54.0":
-  version: 4.54.0
-  resolution: "@rollup/rollup-linux-loong64-gnu@npm:4.54.0"
-  conditions: os=linux & cpu=loong64 & libc=glibc
+"@smithy/property-provider@npm:^4.2.14":
+  version: 4.3.0
+  resolution: "@smithy/property-provider@npm:4.3.0"
+  dependencies:
+    "@smithy/core": ^3.24.0
+    tslib: ^2.6.2
+  checksum: 2d4cc5fd3fd3279a99ff4cbb9d3eba673b83122231a4cb1826254023d7d0fc4cf6973c7c3c57561538c95093822a19bd94e5a55852a6a8e0ca29ae3921832f3a
   languageName: node
   linkType: hard
 
-"@rollup/rollup-linux-ppc64-gnu@npm:4.54.0":
-  version: 4.54.0
-  resolution: "@rollup/rollup-linux-ppc64-gnu@npm:4.54.0"
-  conditions: os=linux & cpu=ppc64 & libc=glibc
+"@smithy/protocol-http@npm:^5.3.14, @smithy/protocol-http@npm:^5.3.8":
+  version: 5.4.0
+  resolution: "@smithy/protocol-http@npm:5.4.0"
+  dependencies:
+    "@smithy/core": ^3.24.0
+    tslib: ^2.6.2
+  checksum: 92b0a4d6e9fc58523e410c93aef9903e1a384fa54d794b4cab069e11df68366494204d248a9cc88070d7d73a4d8b562406cc48091fff1219edcc8348750a42ce
   languageName: node
   linkType: hard
 
-"@rollup/rollup-linux-riscv64-gnu@npm:4.54.0":
-  version: 4.54.0
-  resolution: "@rollup/rollup-linux-riscv64-gnu@npm:4.54.0"
-  conditions: os=linux & cpu=riscv64 & libc=glibc
+"@smithy/shared-ini-file-loader@npm:^4.4.9":
+  version: 4.5.0
+  resolution: "@smithy/shared-ini-file-loader@npm:4.5.0"
+  dependencies:
+    "@smithy/core": ^3.24.0
+    tslib: ^2.6.2
+  checksum: 722c47bf11e99531d6bc1fa2f8c3179f6f0269d95a0b2d49a16e74eadb42c0c78f0bbef27f23665fde4d7760b8a75e1412d00502174ec501927324cff43f74e8
   languageName: node
   linkType: hard
 
-"@rollup/rollup-linux-riscv64-musl@npm:4.54.0":
-  version: 4.54.0
-  resolution: "@rollup/rollup-linux-riscv64-musl@npm:4.54.0"
-  conditions: os=linux & cpu=riscv64 & libc=musl
+"@smithy/signature-v4@npm:^5.3.14, @smithy/signature-v4@npm:^5.3.8":
+  version: 5.4.0
+  resolution: "@smithy/signature-v4@npm:5.4.0"
+  dependencies:
+    "@smithy/core": ^3.24.0
+    "@smithy/types": ^4.14.1
+    tslib: ^2.6.2
+  checksum: 55763bf28e0a5f6b75b4598713db8abfa3b2588c71d1ca4518fa58321e2f91ae4193fa5a1e2cbe5e0d1c0bfc05d37f9da8b11528af186b27078f3910d5c11ab2
   languageName: node
   linkType: hard
 
-"@rollup/rollup-linux-s390x-gnu@npm:4.54.0":
-  version: 4.54.0
-  resolution: "@rollup/rollup-linux-s390x-gnu@npm:4.54.0"
-  conditions: os=linux & cpu=s390x & libc=glibc
+"@smithy/smithy-client@npm:^4.11.1, @smithy/smithy-client@npm:^4.12.13":
+  version: 4.13.0
+  resolution: "@smithy/smithy-client@npm:4.13.0"
+  dependencies:
+    "@smithy/core": ^3.24.0
+    "@smithy/types": ^4.14.1
+    tslib: ^2.6.2
+  checksum: 2f9aadfcfea48d3892a9ccac66bfb5b335231376d0c9f99d0fa0628ca126a3c6d9aa375db0ce0d28f347a15be49d74c75a8991c097664ebefa630fdd77a20c77
   languageName: node
   linkType: hard
 
-"@rollup/rollup-linux-x64-gnu@npm:4.54.0":
-  version: 4.54.0
-  resolution: "@rollup/rollup-linux-x64-gnu@npm:4.54.0"
-  conditions: os=linux & cpu=x64 & libc=glibc
+"@smithy/types@npm:^4.12.0, @smithy/types@npm:^4.14.1":
+  version: 4.14.1
+  resolution: "@smithy/types@npm:4.14.1"
+  dependencies:
+    tslib: ^2.6.2
+  checksum: 9e6209770a25582a11ca67d4750865de0b7732bf3f353ba9260f49e9c4b2adf3274d64057a2bda93da7025e33a54e51bd78c529307efc2b75b429bc45a6ad64c
   languageName: node
   linkType: hard
 
-"@rollup/rollup-linux-x64-musl@npm:4.54.0":
-  version: 4.54.0
-  resolution: "@rollup/rollup-linux-x64-musl@npm:4.54.0"
-  conditions: os=linux & cpu=x64 & libc=musl
+"@smithy/url-parser@npm:^4.2.14, @smithy/url-parser@npm:^4.2.8":
+  version: 4.3.0
+  resolution: "@smithy/url-parser@npm:4.3.0"
+  dependencies:
+    "@smithy/core": ^3.24.0
+    tslib: ^2.6.2
+  checksum: 41c0a784fb4a7cb2d5ee371900ea543e28d6b144af382c6f5d69cef24f042d67ec9a713a8551ac81c38664f0767fe7feebaf2520121a4ffeca1d0741c80d88cf
   languageName: node
   linkType: hard
 
-"@rollup/rollup-openharmony-arm64@npm:4.54.0":
-  version: 4.54.0
-  resolution: "@rollup/rollup-openharmony-arm64@npm:4.54.0"
-  conditions: os=openharmony & cpu=arm64
+"@smithy/util-base64@npm:^4.3.0, @smithy/util-base64@npm:^4.3.2":
+  version: 4.4.0
+  resolution: "@smithy/util-base64@npm:4.4.0"
+  dependencies:
+    "@smithy/core": ^3.24.0
+    tslib: ^2.6.2
+  checksum: b22850ad39a38b8081a30ea33bee84c384d41eb6424f5b3068f8d05deed5cc8f4f645fe9644867b0a16cd7378cde4a6f01352b74481a127b9e629c1455ca31a7
   languageName: node
   linkType: hard
 
-"@rollup/rollup-win32-arm64-msvc@npm:4.54.0":
-  version: 4.54.0
-  resolution: "@rollup/rollup-win32-arm64-msvc@npm:4.54.0"
-  conditions: os=win32 & cpu=arm64
+"@smithy/util-body-length-browser@npm:^4.2.0, @smithy/util-body-length-browser@npm:^4.2.2":
+  version: 4.3.0
+  resolution: "@smithy/util-body-length-browser@npm:4.3.0"
+  dependencies:
+    "@smithy/core": ^3.24.0
+    tslib: ^2.6.2
+  checksum: 88f0c18db8d8574ce955b697c5335d587680ee30673c01aae7fa96c2c87d09257d967ca734fdf5cea5788a8b4ef9786810dec5c69722a29407877ebeb96846d4
   languageName: node
   linkType: hard
 
-"@rollup/rollup-win32-ia32-msvc@npm:4.54.0":
-  version: 4.54.0
-  resolution: "@rollup/rollup-win32-ia32-msvc@npm:4.54.0"
-  conditions: os=win32 & cpu=ia32
+"@smithy/util-body-length-node@npm:^4.2.1, @smithy/util-body-length-node@npm:^4.2.3":
+  version: 4.3.0
+  resolution: "@smithy/util-body-length-node@npm:4.3.0"
+  dependencies:
+    "@smithy/core": ^3.24.0
+    tslib: ^2.6.2
+  checksum: 47056e78a72d7d16b681489b9404e45deeb75fa86b684eee1bc0735cad8ee5487b25e7438eb7d3b28df597e98400ef4878e39274fd606d1765ffa5591ca46c5f
   languageName: node
   linkType: hard
 
-"@rollup/rollup-win32-x64-gnu@npm:4.54.0":
-  version: 4.54.0
-  resolution: "@rollup/rollup-win32-x64-gnu@npm:4.54.0"
-  conditions: os=win32 & cpu=x64
+"@smithy/util-buffer-from@npm:^2.2.0":
+  version: 2.2.0
+  resolution: "@smithy/util-buffer-from@npm:2.2.0"
+  dependencies:
+    "@smithy/is-array-buffer": ^2.2.0
+    tslib: ^2.6.2
+  checksum: 223d6a508b52ff236eea01cddc062b7652d859dd01d457a4e50365af3de1e24a05f756e19433f6ccf1538544076b4215469e21a4ea83dc1d58d829725b0dbc5a
   languageName: node
   linkType: hard
 
-"@rollup/rollup-win32-x64-msvc@npm:4.54.0":
-  version: 4.54.0
-  resolution: "@rollup/rollup-win32-x64-msvc@npm:4.54.0"
-  conditions: os=win32 & cpu=x64
+"@smithy/util-config-provider@npm:^4.2.2":
+  version: 4.3.0
+  resolution: "@smithy/util-config-provider@npm:4.3.0"
+  dependencies:
+    "@smithy/core": ^3.24.0
+    tslib: ^2.6.2
+  checksum: 7a88a7dedd3a68564c0aec73bdc1e1a7b385fd3aab61188a997294435f7514ff49b4710c01dd515474fe7ffadb1b0d444319d9144c6023760fd935dfe3df0321
   languageName: node
   linkType: hard
 
-"@rtsao/scc@npm:^1.1.0":
-  version: 1.1.0
-  resolution: "@rtsao/scc@npm:1.1.0"
-  checksum: b5bcfb0d87f7d1c1c7c0f7693f53b07866ed9fec4c34a97a8c948fb9a7c0082e416ce4d3b60beb4f5e167cbe04cdeefbf6771320f3ede059b9ce91188c409a5b
+"@smithy/util-defaults-mode-browser@npm:^4.3.28, @smithy/util-defaults-mode-browser@npm:^4.3.49":
+  version: 4.4.0
+  resolution: "@smithy/util-defaults-mode-browser@npm:4.4.0"
+  dependencies:
+    "@smithy/core": ^3.24.0
+    tslib: ^2.6.2
+  checksum: d85bae5eeeda85db720426490a079802f9432dd06b4bf8b0475deca1b3d8c724e8eee947fab9d6aa2a048a321a7ed393405c9bab7a992bf86b603f473de718da
   languageName: node
   linkType: hard
 
-"@rushstack/eslint-patch@npm:^1.10.3":
-  version: 1.10.4
-  resolution: "@rushstack/eslint-patch@npm:1.10.4"
-  checksum: de312bd7a3cb0f313c9720029eb719d8762fe54946cce2d33ac142b1cbb5817c4a5a92518dfa476c26311602d37f5a8f7caa90a0c73e3d6a56f9a05d2799c172
+"@smithy/util-defaults-mode-node@npm:^4.2.31, @smithy/util-defaults-mode-node@npm:^4.2.54":
+  version: 4.3.0
+  resolution: "@smithy/util-defaults-mode-node@npm:4.3.0"
+  dependencies:
+    "@smithy/core": ^3.24.0
+    tslib: ^2.6.2
+  checksum: a22cd4a14e79a9eb8ac30d59a78f165977ac755adc7851cec084efdafc29918af1075fb5c7398577871d26bdab4c53650182fc887eb48e07b7b0da896d7efa64
   languageName: node
   linkType: hard
 
-"@sanity/client@npm:^7.11.0":
-  version: 7.11.0
-  resolution: "@sanity/client@npm:7.11.0"
+"@smithy/util-endpoints@npm:^3.2.8, @smithy/util-endpoints@npm:^3.4.2":
+  version: 3.5.0
+  resolution: "@smithy/util-endpoints@npm:3.5.0"
   dependencies:
-    "@sanity/eventsource": ^5.0.2
-    get-it: ^8.6.9
-    nanoid: ^3.3.11
-    rxjs: ^7.0.0
-  checksum: a171aa5248838096ea55a6cd04038d8f662fa1eb06f3653a0f58d47f26beff9740f896693e2b06ba0feb1f4eaccbb0abf03aa5547162e958e1d0e7077c6c31d4
+    "@smithy/core": ^3.24.0
+    tslib: ^2.6.2
+  checksum: b1598ad5424b4648be5df8f3ddea99c02b301cac56445ffd7fff66dca7f3a851578c86c9bb0b3e3332589103fc823a7f0a14157683de19b02d76fd299241cb04
   languageName: node
   linkType: hard
 
-"@sanity/eventsource@npm:^5.0.2":
-  version: 5.0.2
-  resolution: "@sanity/eventsource@npm:5.0.2"
+"@smithy/util-hex-encoding@npm:^4.2.2":
+  version: 4.3.0
+  resolution: "@smithy/util-hex-encoding@npm:4.3.0"
   dependencies:
-    "@types/event-source-polyfill": 1.0.5
-    "@types/eventsource": 1.1.15
-    event-source-polyfill: 1.0.31
-    eventsource: 2.0.2
-  checksum: 7896e5bf1afd1811db22479ea6c529bf2042c2ef1d17fede26b5eafba839235cff35a53fdb68fa53b90975dba993f884d13a262ca9a729e9d97020f958743cee
+    "@smithy/core": ^3.24.0
+    tslib: ^2.6.2
+  checksum: 8c3846ff3d3d801f1bcb2f371dcd37c639891b7421ca77d829115358b58fcabf4a453080386a7bb06f5bcb87758ef9dd9109900bdc7cee599fd72dbf1f78b3bd
   languageName: node
   linkType: hard
 
-"@segment/analytics-core@npm:1.8.0":
-  version: 1.8.0
-  resolution: "@segment/analytics-core@npm:1.8.0"
+"@smithy/util-middleware@npm:^4.2.14, @smithy/util-middleware@npm:^4.2.8":
+  version: 4.3.0
+  resolution: "@smithy/util-middleware@npm:4.3.0"
   dependencies:
-    "@lukeed/uuid": ^2.0.0
-    "@segment/analytics-generic-utils": 1.2.0
-    dset: ^3.1.4
-    tslib: ^2.4.1
-  checksum: ca7040a726cb17c46374409192bef1cac458fc6c17ea3694f0f1a5bc6bbeefaccd7cdcc66720949971b77b8ed482e2c43ca838341679259111cc76b3f8ee115c
+    "@smithy/core": ^3.24.0
+    tslib: ^2.6.2
+  checksum: 9fbd24674413a275768c323cb03f83f82c24a127026c31c58e1448b61ed9179a0473279f63c73a158b424ae11b0c268892b2a0546db7ce290d2d3c40af56a6eb
   languageName: node
   linkType: hard
 
-"@segment/analytics-generic-utils@npm:1.2.0":
-  version: 1.2.0
-  resolution: "@segment/analytics-generic-utils@npm:1.2.0"
+"@smithy/util-retry@npm:^4.2.8, @smithy/util-retry@npm:^4.3.6":
+  version: 4.4.0
+  resolution: "@smithy/util-retry@npm:4.4.0"
   dependencies:
-    tslib: ^2.4.1
-  checksum: 2f9aebc1027ed2d1afcb02338ed4971f774ce25250c499cac6c1c0020a7376e05b56411d38d36ee1cf0cec49cfdb82e68cd3f5d868b47b9e61b3b668bd27e122
+    "@smithy/core": ^3.24.0
+    tslib: ^2.6.2
+  checksum: c4e3a31331234f55f7473ad6c7165ff6f6a456b53f3a641e934bd8fa4591cf0fc2bc6a1c14a0ba44a5a9bb4565e7de61eccb2e5b5fb10dcf6dd61bdf71e2e8a8
   languageName: node
   linkType: hard
 
-"@segment/analytics-next@npm:^1.75.0":
-  version: 1.75.0
-  resolution: "@segment/analytics-next@npm:1.75.0"
+"@smithy/util-stream@npm:^4.5.10, @smithy/util-stream@npm:^4.5.25":
+  version: 4.6.0
+  resolution: "@smithy/util-stream@npm:4.6.0"
   dependencies:
-    "@lukeed/uuid": ^2.0.0
-    "@segment/analytics-core": 1.8.0
-    "@segment/analytics-generic-utils": 1.2.0
-    "@segment/analytics.js-video-plugins": ^0.2.1
-    "@segment/facade": ^3.4.9
-    dset: ^3.1.4
-    js-cookie: 3.0.1
-    node-fetch: ^2.6.7
-    tslib: ^2.4.1
-    unfetch: ^4.1.0
-  checksum: ff1a0c551cf94f37faa784317680fb5175045646579afe125282b6aa232174afa60472a6d3dba872f27b4dda57ad692a5b8fc23f227a24889d0ee610ba85dc17
+    "@smithy/core": ^3.24.0
+    tslib: ^2.6.2
+  checksum: 283ae66729690496a191bc92726f8423acbad6773622fa93293d14263d90845b32a9bff68369b08fe35a5875a06d9c8828621a125126738bc59a2834d6fd4f4e
   languageName: node
   linkType: hard
 
-"@segment/analytics.js-video-plugins@npm:^0.2.1":
-  version: 0.2.1
-  resolution: "@segment/analytics.js-video-plugins@npm:0.2.1"
+"@smithy/util-utf8@npm:^2.0.0":
+  version: 2.3.0
+  resolution: "@smithy/util-utf8@npm:2.3.0"
   dependencies:
-    unfetch: ^3.1.1
-  checksum: 6c41cb6c78f5db5bff22504dc0f6564bfc89ad0725c112d13001197ba26274fbdebac8defe51de24d1a74da3102beebd852bab884041b965b38732ceda553af5
+    "@smithy/util-buffer-from": ^2.2.0
+    tslib: ^2.6.2
+  checksum: e18840c58cc507ca57fdd624302aefd13337ee982754c9aa688463ffcae598c08461e8620e9852a424d662ffa948fc64919e852508028d09e89ced459bd506ab
   languageName: node
   linkType: hard
 
-"@segment/facade@npm:^3.4.9":
-  version: 3.4.10
-  resolution: "@segment/facade@npm:3.4.10"
+"@smithy/util-utf8@npm:^4.2.0, @smithy/util-utf8@npm:^4.2.2":
+  version: 4.3.0
+  resolution: "@smithy/util-utf8@npm:4.3.0"
   dependencies:
-    "@segment/isodate-traverse": ^1.1.1
-    inherits: ^2.0.4
-    new-date: ^1.0.3
-    obj-case: 0.2.1
-  checksum: bfbde4e3270a9d47f50b6bc764ae145fbb9d35e6d9cb6a969af95da94fd33ec5c9952d6c9b9105a087d9a96e2c0a304f0ec86281e8fce40f49c3b32ab58f188c
+    "@smithy/core": ^3.24.0
+    tslib: ^2.6.2
+  checksum: 80df3505b2e3e2d974ab2496dc3ad3a512cb0129dce0ab59cd4d44d89b69aba82a8a9188dc4614e528ed385c49de10a32bf856a779761e1b50a845e994e2beaf
   languageName: node
   linkType: hard
 
-"@segment/isodate-traverse@npm:^1.1.1":
-  version: 1.1.1
-  resolution: "@segment/isodate-traverse@npm:1.1.1"
+"@smithy/util-waiter@npm:^4.2.8, @smithy/util-waiter@npm:^4.3.0":
+  version: 4.4.0
+  resolution: "@smithy/util-waiter@npm:4.4.0"
   dependencies:
-    "@segment/isodate": ^1.0.3
-  checksum: 37f78eb7b8e2b57715bd4a7b396961b7d19d1be9e5c02bec539da8643ddd34dbcc223f08c2924e882a43ca149fe3f2f0586a8d6a53f418829068549404b21981
+    "@smithy/core": ^3.24.0
+    tslib: ^2.6.2
+  checksum: f04d481d880ffaf18014ccaae6e776c0f39b0bd85f74620b5059d73183e81296ded8c8466033f1fb10d28f70b21f00edff8f25b270da06a5eecb9ac2a45a513a
   languageName: node
   linkType: hard
 
-"@segment/isodate@npm:1.0.3, @segment/isodate@npm:^1.0.3":
-  version: 1.0.3
-  resolution: "@segment/isodate@npm:1.0.3"
-  checksum: 0b2e9e580fe505e617d7dfbd2d046a3f3bcc7f1f1d1fbaba7728ad1c9da9e47d13a60ec344e2d80b0694d3ed93129d168108e91d4ce2f48012f87dbb40925e8d
+"@speed-highlight/core@npm:^1.2.7":
+  version: 1.2.15
+  resolution: "@speed-highlight/core@npm:1.2.15"
+  checksum: 1e069429a46aa1d1c15afde27ee94f78073c948357abccb17ddab71fe7cad0eb2fc761d553a918d30a13723e5c30a0374304844297e9bd37dd01953466cb93bb
   languageName: node
   linkType: hard
 
@@ -5473,6 +7550,13 @@ __metadata:
   languageName: node
   linkType: hard
 
+"@tsconfig/node18@npm:^1.0.3":
+  version: 1.0.3
+  resolution: "@tsconfig/node18@npm:1.0.3"
+  checksum: 7cbe70d4c0b2b3f9942f598cec952b4bebcc8a61073582fe650eabbe978eeae3ed081697f3cf51bf88d570450a50297d9311545b2b1654e84372498d7838ca04
+  languageName: node
+  linkType: hard
+
 "@types/acorn@npm:^4.0.0":
   version: 4.0.6
   resolution: "@types/acorn@npm:4.0.6"
@@ -5763,6 +7847,16 @@ __metadata:
   languageName: node
   linkType: hard
 
+"@types/node-fetch@npm:^2.6.4":
+  version: 2.6.13
+  resolution: "@types/node-fetch@npm:2.6.13"
+  dependencies:
+    "@types/node": "*"
+    form-data: ^4.0.4
+  checksum: 6313c89f62c50bd0513a6839cdff0a06727ac5495ccbb2eeda51bb2bbbc4f3c0a76c0393a491b7610af703d3d2deb6cf60e37e59c81ceeca803ffde745dbf309
+  languageName: node
+  linkType: hard
+
 "@types/node@npm:*, @types/node@npm:^20":
   version: 20.11.20
   resolution: "@types/node@npm:20.11.20"
@@ -5779,6 +7873,15 @@ __metadata:
   languageName: node
   linkType: hard
 
+"@types/node@npm:^18.11.18":
+  version: 18.19.130
+  resolution: "@types/node@npm:18.19.130"
+  dependencies:
+    undici-types: ~5.26.4
+  checksum: 22ba2bc9f8863101a7e90a56aaeba1eb3ebdc51e847cef4a6d188967ab1acbce9b4f92251372fd0329ecb924bbf610509e122c3dfe346c04dbad04013d4ad7d0
+  languageName: node
+  linkType: hard
+
 "@types/node@npm:^20.11.20":
   version: 20.11.27
   resolution: "@types/node@npm:20.11.27"
@@ -6099,6 +8202,25 @@ __metadata:
   languageName: node
   linkType: hard
 
+"abort-controller@npm:^3.0.0":
+  version: 3.0.0
+  resolution: "abort-controller@npm:3.0.0"
+  dependencies:
+    event-target-shim: ^5.0.0
+  checksum: 90ccc50f010250152509a344eb2e71977fbf8db0ab8f1061197e3275ddf6c61a41a6edfd7b9409c664513131dd96e962065415325ef23efa5db931b382d24ca5
+  languageName: node
+  linkType: hard
+
+"accepts@npm:^2.0.0":
+  version: 2.0.0
+  resolution: "accepts@npm:2.0.0"
+  dependencies:
+    mime-types: ^3.0.0
+    negotiator: ^1.0.0
+  checksum: 98374742097e140891546076215f90c32644feacf652db48412329de4c2a529178a81aa500fbb13dd3e6cbf6e68d829037b123ac037fc9a08bcec4b87b358eef
+  languageName: node
+  linkType: hard
+
 "acorn-jsx@npm:^5.0.0, acorn-jsx@npm:^5.3.2":
   version: 5.3.2
   resolution: "acorn-jsx@npm:5.3.2"
@@ -6133,6 +8255,15 @@ __metadata:
   languageName: node
   linkType: hard
 
+"acorn@npm:^8.5.0":
+  version: 8.16.0
+  resolution: "acorn@npm:8.16.0"
+  bin:
+    acorn: bin/acorn
+  checksum: c9c52697227661b68d0debaf972222d4f622aa06b185824164e153438afa7b08273432ca43ea792cadb24dada1d46f6f6bb1ef8de9956979288cc1b96bf9914e
+  languageName: node
+  linkType: hard
+
 "afdocs@npm:latest":
   version: 0.9.2
   resolution: "afdocs@npm:0.9.2"
@@ -6164,6 +8295,15 @@ __metadata:
   languageName: node
   linkType: hard
 
+"agentkeepalive@npm:^4.2.1":
+  version: 4.6.0
+  resolution: "agentkeepalive@npm:4.6.0"
+  dependencies:
+    humanize-ms: ^1.2.1
+  checksum: 235c182432f75046835b05f239708107138a40103deee23b6a08caee5136873709155753b394ec212e49e60e94a378189562cb01347765515cff61b692c69187
+  languageName: node
+  linkType: hard
+
 "aggregate-error@npm:^3.0.0":
   version: 3.1.0
   resolution: "aggregate-error@npm:3.1.0"
@@ -6270,6 +8410,13 @@ __metadata:
   languageName: node
   linkType: hard
 
+"ansi-colors@npm:^4.1.1":
+  version: 4.1.3
+  resolution: "ansi-colors@npm:4.1.3"
+  checksum: ec87a2f59902f74e61eada7f6e6fe20094a628dab765cfdbd03c3477599368768cffccdb5d3bb19a1b6c99126783a143b1fee31aab729b31ffe5836c7e5e28b9
+  languageName: node
+  linkType: hard
+
 "ansi-regex@npm:^5.0.1":
   version: 5.0.1
   resolution: "ansi-regex@npm:5.0.1"
@@ -6284,6 +8431,13 @@ __metadata:
   languageName: node
   linkType: hard
 
+"ansi-regex@npm:^6.2.2":
+  version: 6.2.2
+  resolution: "ansi-regex@npm:6.2.2"
+  checksum: 05d4acb1d2f59ab2cf4b794339c7b168890d44dda4bf0ce01152a8da0213aca207802f930442ce8cd22d7a92f44907664aac6508904e75e038fa944d2601b30f
+  languageName: node
+  linkType: hard
+
 "ansi-styles@npm:^3.2.1":
   version: 3.2.1
   resolution: "ansi-styles@npm:3.2.1"
@@ -6316,6 +8470,13 @@ __metadata:
   languageName: node
   linkType: hard
 
+"ansi-styles@npm:^6.2.1":
+  version: 6.2.3
+  resolution: "ansi-styles@npm:6.2.3"
+  checksum: 23b8a4ce14e18fb854693b95351e286b771d23d8844057ed2e7d083cd3e708376c3323707ec6a24365f7d7eda3ca00327fe04092e29e551499ec4c8b7bfac868
+  languageName: node
+  linkType: hard
+
 "any-promise@npm:^1.0.0":
   version: 1.3.0
   resolution: "any-promise@npm:1.3.0"
@@ -6337,12 +8498,14 @@ __metadata:
   version: 0.0.0-use.local
   resolution: "api-reference@workspace:apps/api-reference"
   dependencies:
+    "@aws-sdk/client-s3": ^3
     "@mdx-js/loader": ^3.1.0
     "@mdx-js/react": ^3.1.0
     "@medusajs/icons": 2.15.1
     "@medusajs/ui": 4.1.11
-    "@next/bundle-analyzer": 15.3.9
-    "@next/mdx": 15.3.9
+    "@next/bundle-analyzer": 15.5.18
+    "@next/mdx": 15.5.18
+    "@opennextjs/cloudflare": 1.19.9
     "@react-hook/resize-observer": ^2.0.2
     "@readme/openapi-parser": ^2.5.0
     "@types/jsdom": ^27.0.0
@@ -6364,7 +8527,8 @@ __metadata:
     jsdom: ^27.1.0
     json-schema: ^0.4.0
     json-stringify-pretty-compact: ^4.0.0
-    next: 15.3.9
+    mime-types: ^3
+    next: 15.5.18
     next-mdx-remote: 5.0.0
     openapi-sampler: ^1.3.1
     pluralize: ^8.0.0
@@ -6387,6 +8551,7 @@ __metadata:
     typescript: 5.1.6
     vite-tsconfig-paths: ^5.1.4
     vitest: ^2.1.8
+    wrangler: ^4.90.0
     yaml: ^2.3.1
   languageName: unknown
   linkType: soft
@@ -6493,6 +8658,13 @@ __metadata:
   languageName: node
   linkType: hard
 
+"array-timsort@npm:^1.0.3":
+  version: 1.0.3
+  resolution: "array-timsort@npm:1.0.3"
+  checksum: bd3a1707b621947265c89867e67c9102b9b9f4c50f5b3974220112290d8b60d26ce60595edec5deed3325207b759d70b758bed3cd310b5ddadb835657ffb6d12
+  languageName: node
+  linkType: hard
+
 "array-union@npm:^2.1.0":
   version: 2.1.0
   resolution: "array-union@npm:2.1.0"
@@ -6690,6 +8862,13 @@ __metadata:
   languageName: node
   linkType: hard
 
+"aws4fetch@npm:^1.0.20":
+  version: 1.0.20
+  resolution: "aws4fetch@npm:1.0.20"
+  checksum: a4eac7bd0d1c3e611c17ed1ef41ac0b48c0a8e74a985ad968c071e74d94586d3572edc943b43fa5ca756c686ea73baa2f48e264d657bb8c2e95c8e0037d48a87
+  languageName: node
+  linkType: hard
+
 "axe-core@npm:^4.10.0":
   version: 4.10.2
   resolution: "axe-core@npm:4.10.2"
@@ -6718,6 +8897,13 @@ __metadata:
   languageName: node
   linkType: hard
 
+"balanced-match@npm:^4.0.2":
+  version: 4.0.4
+  resolution: "balanced-match@npm:4.0.4"
+  checksum: 07e86102a3eb2ee2a6a1a89164f29d0dbaebd28f2ca3f5ca786f36b8b23d9e417eb3be45a4acf754f837be5ac0a2317de90d3fcb7f4f4dc95720a1f36b26a17b
+  languageName: node
+  linkType: hard
+
 "baseline-browser-mapping@npm:^2.9.0":
   version: 2.9.11
   resolution: "baseline-browser-mapping@npm:2.9.11"
@@ -6743,6 +8929,13 @@ __metadata:
   languageName: node
   linkType: hard
 
+"blake3-wasm@npm:2.1.5":
+  version: 2.1.5
+  resolution: "blake3-wasm@npm:2.1.5"
+  checksum: 5dc729d8e3a9d1d7ab016b36cdda264a327ada0239716df48435163e11d2bf6df25d6e421655a1f52649098ae49555268a654729b7d02768f77c571ab37ef814
+  languageName: node
+  linkType: hard
+
 "bloom@workspace:apps/bloom":
   version: 0.0.0-use.local
   resolution: "bloom@workspace:apps/bloom"
@@ -6750,7 +8943,8 @@ __metadata:
     "@mdx-js/loader": ^3.1.0
     "@mdx-js/react": ^3.1.0
     "@medusajs/icons": 2.15.1
-    "@next/mdx": 15.3.9
+    "@next/mdx": 15.5.18
+    "@opennextjs/cloudflare": ^1.19.9
     "@stefanprobst/rehype-extract-toc": ^3.0.0
     "@types/mdx": ^2.0.13
     "@types/node": ^20
@@ -6763,7 +8957,7 @@ __metadata:
     eslint: ^9.13.0
     eslint-plugin-prettier: ^5.2.1
     eslint-plugin-react-hooks: ^5.0.0
-    next: 15.3.9
+    next: 15.5.18
     postcss: ^8
     posthog-js: ^1.298.1
     posthog-node: ^5.29.0
@@ -6780,9 +8974,27 @@ __metadata:
     tsconfig: "*"
     types: "*"
     typescript: ^5
+    wrangler: ^4.90.0
   languageName: unknown
   linkType: soft
 
+"body-parser@npm:^2.2.1":
+  version: 2.2.2
+  resolution: "body-parser@npm:2.2.2"
+  dependencies:
+    bytes: ^3.1.2
+    content-type: ^1.0.5
+    debug: ^4.4.3
+    http-errors: ^2.0.0
+    iconv-lite: ^0.7.0
+    on-finished: ^2.4.1
+    qs: ^6.14.1
+    raw-body: ^3.0.1
+    type-is: ^2.0.1
+  checksum: 95a830a003b38654b75166ca765358aa92ee3d561bf0e41d6ccdde0e1a0c9783cab6b90b20eb635d23172c010b59d3563a137a738e74da4ba714463510d05137
+  languageName: node
+  linkType: hard
+
 "book@workspace:apps/book":
   version: 0.0.0-use.local
   resolution: "book@workspace:apps/book"
@@ -6790,7 +9002,8 @@ __metadata:
     "@mdx-js/loader": ^3.1.0
     "@mdx-js/react": ^3.1.0
     "@medusajs/icons": 2.15.1
-    "@next/mdx": 15.3.9
+    "@next/mdx": 15.5.18
+    "@opennextjs/cloudflare": ^1.19.9
     "@stefanprobst/rehype-extract-toc": ^3.0.0
     "@types/mdx": ^2.0.13
     "@types/node": ^20
@@ -6806,7 +9019,7 @@ __metadata:
     eslint-plugin-prettier: ^5.2.1
     eslint-plugin-react-hooks: ^5.0.0
     loops: ^6.0.1
-    next: 15.3.9
+    next: 15.5.18
     postcss: ^8
     posthog-js: ^1.298.1
     posthog-node: ^5.29.0
@@ -6822,6 +9035,7 @@ __metadata:
     tsconfig: "*"
     types: "*"
     typescript: ^5
+    wrangler: ^4.90.0
   languageName: unknown
   linkType: soft
 
@@ -6832,6 +9046,13 @@ __metadata:
   languageName: node
   linkType: hard
 
+"bowser@npm:^2.11.0":
+  version: 2.14.1
+  resolution: "bowser@npm:2.14.1"
+  checksum: bb69b55ba7f0456e3dc07d0cfd9467f985581f640ba8fd426b08754a6737ee0d6cf3b50607941e5255f04c83075b952ece0599f978dd4d20f1e95461104c5ffd
+  languageName: node
+  linkType: hard
+
 "brace-expansion@npm:^1.1.7":
   version: 1.1.11
   resolution: "brace-expansion@npm:1.1.11"
@@ -6851,6 +9072,15 @@ __metadata:
   languageName: node
   linkType: hard
 
+"brace-expansion@npm:^5.0.5":
+  version: 5.0.6
+  resolution: "brace-expansion@npm:5.0.6"
+  dependencies:
+    balanced-match: ^4.0.2
+  checksum: 8c919869b90f61d533b341d3340be5ee4413232ea89b8246cbc2f38eb014f1d8182785c98a006eaf6111d02dc9eeffefdc240d5ac158625b2ed084dccd4bbf9b
+  languageName: node
+  linkType: hard
+
 "braces@npm:^3.0.2, braces@npm:~3.0.2":
   version: 3.0.2
   resolution: "braces@npm:3.0.2"
@@ -6889,6 +9119,13 @@ __metadata:
   languageName: node
   linkType: hard
 
+"buffer-from@npm:^1.0.0":
+  version: 1.1.2
+  resolution: "buffer-from@npm:1.1.2"
+  checksum: 124fff9d66d691a86d3b062eff4663fe437a9d9ee4b47b1b9e97f5a5d14f6d5399345db80f796827be7c95e70a8e765dd404b7c3ff3b3324f98e9b0c8826cc34
+  languageName: node
+  linkType: hard
+
 "build-scripts@*, build-scripts@workspace:packages/build-scripts":
   version: 0.0.0-use.local
   resolution: "build-scripts@workspace:packages/build-scripts"
@@ -6911,17 +9148,6 @@ __metadata:
   languageName: unknown
   linkType: soft
 
-"bundle-require@npm:^3.0.2":
-  version: 3.1.2
-  resolution: "bundle-require@npm:3.1.2"
-  dependencies:
-    load-tsconfig: ^0.2.0
-  peerDependencies:
-    esbuild: ">=0.13"
-  checksum: 73f77df391a46f2cefc3bfc4777cd0169a47db1e69a64a16cb6a37208a03992ef68f02921e18ae4fba3387e076f37bcac8388077cba316ce9fd96105aec43f89
-  languageName: node
-  linkType: hard
-
 "busboy@npm:1.6.0":
   version: 1.6.0
   resolution: "busboy@npm:1.6.0"
@@ -6931,7 +9157,14 @@ __metadata:
   languageName: node
   linkType: hard
 
-"cac@npm:^6.7.12, cac@npm:^6.7.14":
+"bytes@npm:^3.1.2, bytes@npm:~3.1.2":
+  version: 3.1.2
+  resolution: "bytes@npm:3.1.2"
+  checksum: 76d1c43cbd602794ad8ad2ae94095cddeb1de78c5dddaa7005c51af10b0176c69971a6d88e805a90c2b6550d76636e43c40d8427a808b8645ede885de4a0358e
+  languageName: node
+  linkType: hard
+
+"cac@npm:^6.7.14":
   version: 6.7.14
   resolution: "cac@npm:6.7.14"
   checksum: 4ee06aaa7bab8981f0d54e5f5f9d4adcd64058e9697563ce336d8a3878ed018ee18ebe5359b2430eceae87e0758e62ea2019c3f52ae6e211b1bd2e133856cd10
@@ -7079,7 +9312,7 @@ __metadata:
   languageName: node
   linkType: hard
 
-"chalk@npm:^5.4.1":
+"chalk@npm:^5.4.1, chalk@npm:^5.6.2":
   version: 5.6.2
   resolution: "chalk@npm:5.6.2"
   checksum: 99a4b0f0e7991796b1e7e3f52dceb9137cae2a9dfc8fc0784a550dc4c558e15ab32ed70b14b21b52beb2679b4892b41a0aa44249bcb996f01e125d58477c6976
@@ -7142,7 +9375,7 @@ __metadata:
   languageName: node
   linkType: hard
 
-"chokidar@npm:^3.5.1, chokidar@npm:^3.5.3":
+"chokidar@npm:^3.5.3":
   version: 3.6.0
   resolution: "chokidar@npm:3.6.0"
   dependencies:
@@ -7168,6 +9401,13 @@ __metadata:
   languageName: node
   linkType: hard
 
+"ci-info@npm:^4.2.0":
+  version: 4.4.0
+  resolution: "ci-info@npm:4.4.0"
+  checksum: 44156201545b8dde01aa8a09ee2fe9fc7a73b1bef9adbd4606c9f61c8caeeb73fb7a575c88b0443f7b4edb5ee45debaa59ed54ba5f99698339393ca01349eb3a
+  languageName: node
+  linkType: hard
+
 "classnames@npm:^2.3.0":
   version: 2.5.1
   resolution: "classnames@npm:2.5.1"
@@ -7198,6 +9438,17 @@ __metadata:
   languageName: node
   linkType: hard
 
+"cliui@npm:^9.0.1":
+  version: 9.0.1
+  resolution: "cliui@npm:9.0.1"
+  dependencies:
+    string-width: ^7.2.0
+    strip-ansi: ^7.1.0
+    wrap-ansi: ^9.0.0
+  checksum: 13441832e9efe7c7a76bd2b8e683555c478d461a9f249dc5db9b17fe8d4b47fa9277b503914b90bd00e4a151abb6b9b02b2288972ffe2e5e3ca40bcb1c2330d3
+  languageName: node
+  linkType: hard
+
 "cloud@workspace:apps/cloud":
   version: 0.0.0-use.local
   resolution: "cloud@workspace:apps/cloud"
@@ -7205,7 +9456,8 @@ __metadata:
     "@mdx-js/loader": ^3.1.0
     "@mdx-js/react": ^3.1.0
     "@medusajs/icons": 2.15.1
-    "@next/mdx": 15.3.9
+    "@next/mdx": 15.5.18
+    "@opennextjs/cloudflare": ^1.19.9
     "@sanity/client": ^7.11.0
     "@stefanprobst/rehype-extract-toc": ^3.0.0
     "@types/mdx": ^2.0.13
@@ -7219,7 +9471,7 @@ __metadata:
     eslint: ^9.13.0
     eslint-plugin-prettier: ^5.2.1
     eslint-plugin-react-hooks: ^5.0.0
-    next: 15.3.9
+    next: 15.5.18
     postcss: ^8
     posthog-js: ^1.298.1
     posthog-node: ^5.29.0
@@ -7236,9 +9488,25 @@ __metadata:
     tsconfig: "*"
     types: "*"
     typescript: ^5
+    wrangler: ^4.90.0
   languageName: unknown
   linkType: soft
 
+"cloudflare@npm:^4.4.1":
+  version: 4.5.0
+  resolution: "cloudflare@npm:4.5.0"
+  dependencies:
+    "@types/node": ^18.11.18
+    "@types/node-fetch": ^2.6.4
+    abort-controller: ^3.0.0
+    agentkeepalive: ^4.2.1
+    form-data-encoder: 1.7.2
+    formdata-node: ^4.3.2
+    node-fetch: ^2.6.7
+  checksum: 376ca8cde08878e383a151626c40f702160565776cdb455f6091009b6733628bae266bf47d61c8e2ff21fb94388f0a609af24872dea7c01a1b3e26d76deec8db
+  languageName: node
+  linkType: hard
+
 "clsx@npm:2.0.0":
   version: 2.0.0
   resolution: "clsx@npm:2.0.0"
@@ -7349,6 +9617,13 @@ __metadata:
   languageName: node
   linkType: hard
 
+"commander@npm:^11.1.0":
+  version: 11.1.0
+  resolution: "commander@npm:11.1.0"
+  checksum: 13cc6ac875e48780250f723fb81c1c1178d35c5decb1abb1b628b3177af08a8554e76b2c0f29de72d69eef7c864d12613272a71fabef8047922bc622ab75a179
+  languageName: node
+  linkType: hard
+
 "commander@npm:^13.1.0":
   version: 13.1.0
   resolution: "commander@npm:13.1.0"
@@ -7356,6 +9631,13 @@ __metadata:
   languageName: node
   linkType: hard
 
+"commander@npm:^2.20.0":
+  version: 2.20.3
+  resolution: "commander@npm:2.20.3"
+  checksum: 74c781a5248c2402a0a3e966a0a2bba3c054aad144f5c023364be83265e796b20565aa9feff624132ff629aa64e16999fa40a743c10c12f7c61e96a794b99288
+  languageName: node
+  linkType: hard
+
 "commander@npm:^4.0.0":
   version: 4.1.1
   resolution: "commander@npm:4.1.1"
@@ -7377,6 +9659,16 @@ __metadata:
   languageName: node
   linkType: hard
 
+"comment-json@npm:^4.5.1":
+  version: 4.6.2
+  resolution: "comment-json@npm:4.6.2"
+  dependencies:
+    array-timsort: ^1.0.3
+    esprima: ^4.0.1
+  checksum: 8965ec6c40612aa0cc66d4324ff5819cf205c997f3a84dd82dffe4e6398449e37bbc5765184bc9149e95d15994f0c2740cee82284828fa1c0f733a669022d3dd
+  languageName: node
+  linkType: hard
+
 "concat-map@npm:0.0.1":
   version: 0.0.1
   resolution: "concat-map@npm:0.0.1"
@@ -7384,6 +9676,20 @@ __metadata:
   languageName: node
   linkType: hard
 
+"content-disposition@npm:^1.0.0":
+  version: 1.1.0
+  resolution: "content-disposition@npm:1.1.0"
+  checksum: 94e0aef65873e69330f5f187fbc44ebce593bdcb8013dd8a68b7d0f159ca089bd30db3f8095d829f81c341695b60a6085ee6e15e6d775c4a325b586cc8d91974
+  languageName: node
+  linkType: hard
+
+"content-type@npm:^1.0.5":
+  version: 1.0.5
+  resolution: "content-type@npm:1.0.5"
+  checksum: b76ebed15c000aee4678c3707e0860cb6abd4e680a598c0a26e17f0bfae723ec9cc2802f0ff1bc6e4d80603719010431d2231018373d4dde10f9ccff9dadf5af
+  languageName: node
+  linkType: hard
+
 "convert-source-map@npm:^2.0.0":
   version: 2.0.0
   resolution: "convert-source-map@npm:2.0.0"
@@ -7391,6 +9697,27 @@ __metadata:
   languageName: node
   linkType: hard
 
+"cookie-signature@npm:^1.2.1":
+  version: 1.2.2
+  resolution: "cookie-signature@npm:1.2.2"
+  checksum: 54e05df1a293b3ce81589b27dddc445f462f6fa6812147c033350cd3561a42bc14481674e05ed14c7bd0ce1e8bb3dc0e40851bad75415733711294ddce0b7bc6
+  languageName: node
+  linkType: hard
+
+"cookie@npm:^0.7.1":
+  version: 0.7.2
+  resolution: "cookie@npm:0.7.2"
+  checksum: 9596e8ccdbf1a3a88ae02cf5ee80c1c50959423e1022e4e60b91dd87c622af1da309253d8abdb258fb5e3eacb4f08e579dc58b4897b8087574eee0fd35dfa5d2
+  languageName: node
+  linkType: hard
+
+"cookie@npm:^1.0.2":
+  version: 1.1.1
+  resolution: "cookie@npm:1.1.1"
+  checksum: 79c4ddc0fcad9c4f045f826f42edf54bcc921a29586a4558b0898277fa89fb47be95bc384c2253f493af7b29500c830da28341274527328f18eba9f58afa112c
+  languageName: node
+  linkType: hard
+
 "copy-to-clipboard@npm:^3.3.3":
   version: 3.3.3
   resolution: "copy-to-clipboard@npm:3.3.3"
@@ -8091,7 +10418,7 @@ __metadata:
   languageName: node
   linkType: hard
 
-"debug@npm:^4.1.1, debug@npm:^4.3.7":
+"debug@npm:^4.1.1, debug@npm:^4.3.7, debug@npm:^4.4.0, debug@npm:^4.4.3":
   version: 4.4.3
   resolution: "debug@npm:4.4.3"
   dependencies:
@@ -8180,6 +10507,13 @@ __metadata:
   languageName: node
   linkType: hard
 
+"depd@npm:^2.0.0, depd@npm:~2.0.0":
+  version: 2.0.0
+  resolution: "depd@npm:2.0.0"
+  checksum: 58bd06ec20e19529b06f7ad07ddab60e504d9e0faca4bd23079fac2d279c3594334d736508dc350e06e510aba5e22e4594483b3a6562ce7c17dd797f4cc4ad2c
+  languageName: node
+  linkType: hard
+
 "dequal@npm:^2.0.0, dequal@npm:^2.0.3":
   version: 2.0.3
   resolution: "dequal@npm:2.0.3"
@@ -8194,6 +10528,13 @@ __metadata:
   languageName: node
   linkType: hard
 
+"detect-libc@npm:^2.1.2":
+  version: 2.1.2
+  resolution: "detect-libc@npm:2.1.2"
+  checksum: acc675c29a5649fa1fb6e255f993b8ee829e510b6b56b0910666949c80c364738833417d0edb5f90e4e46be17228b0f2b66a010513984e18b15deeeac49369c4
+  languageName: node
+  linkType: hard
+
 "detect-node-es@npm:^1.1.0":
   version: 1.1.0
   resolution: "detect-node-es@npm:1.1.0"
@@ -8286,7 +10627,7 @@ __metadata:
     "@kapaai/react-sdk": ^0.9.0
     "@medusajs/icons": 2.15.1
     "@medusajs/ui": 4.1.11
-    "@next/third-parties": 15.3.9
+    "@next/third-parties": 15.5.18
     "@react-hook/resize-observer": ^1.2.6
     "@segment/analytics-next": ^1.75.0
     "@types/react": 19.2.9
@@ -8300,7 +10641,7 @@ __metadata:
     mermaid: ^10.9.0
     minisearch: ^7.1.1
     motion: ^12.29.2
-    next: 15.3.9
+    next: 15.5.18
     npm-to-yarn: ^2.1.0
     prism-react-renderer: 2.4.0
     react: 19.2.5
@@ -8318,7 +10659,6 @@ __metadata:
     tailwind: "*"
     tailwindcss: ^3.3.3
     tsc-alias: ^1.8.7
-    tsup: ^5.10.1
     types: "*"
     typescript: ^5.1.6
     vite-tsconfig-paths: ^5.1.4
@@ -8451,6 +10791,13 @@ __metadata:
   languageName: node
   linkType: hard
 
+"dotenv@npm:^16.4.5":
+  version: 16.6.1
+  resolution: "dotenv@npm:16.6.1"
+  checksum: 15ce56608326ea0d1d9414a5c8ee6dcf0fffc79d2c16422b4ac2268e7e2d76ff5a572d37ffe747c377de12005f14b3cc22361e79fc7f1061cce81f77d2c973dc
+  languageName: node
+  linkType: hard
+
 "dset@npm:^3.1.4":
   version: 3.1.4
   resolution: "dset@npm:3.1.4"
@@ -8483,6 +10830,25 @@ __metadata:
   languageName: node
   linkType: hard
 
+"eciesjs@npm:^0.4.10":
+  version: 0.4.18
+  resolution: "eciesjs@npm:0.4.18"
+  dependencies:
+    "@ecies/ciphers": ^0.2.5
+    "@noble/ciphers": ^1.3.0
+    "@noble/curves": ^1.9.7
+    "@noble/hashes": ^1.8.0
+  checksum: ecccb17b2fd33c143cf9b78014cca4cb00db1615ef8bd20fb6c835b62ef744ff772dd1545aff2cc215a2924bd9cadb2abd8c06a408e85c78b91efcb1712bc1eb
+  languageName: node
+  linkType: hard
+
+"ee-first@npm:1.1.1":
+  version: 1.1.1
+  resolution: "ee-first@npm:1.1.1"
+  checksum: b5bb125ee93161bc16bfe6e56c6b04de5ad2aa44234d8f644813cc95d861a6910903132b05093706de2b706599367c4130eb6d170f6b46895686b95f87d017b7
+  languageName: node
+  linkType: hard
+
 "electron-to-chromium@npm:^1.4.668":
   version: 1.4.681
   resolution: "electron-to-chromium@npm:1.4.681"
@@ -8504,6 +10870,13 @@ __metadata:
   languageName: node
   linkType: hard
 
+"emoji-regex@npm:^10.3.0":
+  version: 10.6.0
+  resolution: "emoji-regex@npm:10.6.0"
+  checksum: 1e4aa097bb007301c3b4b1913879ae27327fdc48e93eeefefe3b87e495eb33c5af155300be951b4349ff6ac084f4403dc9eff970acba7c1c572d89396a9a32d7
+  languageName: node
+  linkType: hard
+
 "emoji-regex@npm:^8.0.0":
   version: 8.0.0
   resolution: "emoji-regex@npm:8.0.0"
@@ -8518,6 +10891,13 @@ __metadata:
   languageName: node
   linkType: hard
 
+"encodeurl@npm:^2.0.0":
+  version: 2.0.0
+  resolution: "encodeurl@npm:2.0.0"
+  checksum: 5d317306acb13e6590e28e27924c754163946a2480de11865c991a3a7eed4315cd3fba378b543ca145829569eefe9b899f3d84bb09870f675ae60bc924b01ceb
+  languageName: node
+  linkType: hard
+
 "encoding@npm:^0.1.13":
   version: 0.1.13
   resolution: "encoding@npm:0.1.13"
@@ -8537,6 +10917,16 @@ __metadata:
   languageName: node
   linkType: hard
 
+"enquirer@npm:^2.4.1":
+  version: 2.4.1
+  resolution: "enquirer@npm:2.4.1"
+  dependencies:
+    ansi-colors: ^4.1.1
+    strip-ansi: ^6.0.1
+  checksum: 43850479d7a51d36a9c924b518dcdc6373b5a8ae3401097d336b7b7e258324749d0ad37a1fcaa5706f04799baa05585cd7af19ebdf7667673e7694435fcea918
+  languageName: node
+  linkType: hard
+
 "entities@npm:^4.2.0, entities@npm:^4.4.0":
   version: 4.5.0
   resolution: "entities@npm:4.5.0"
@@ -8565,6 +10955,13 @@ __metadata:
   languageName: node
   linkType: hard
 
+"error-stack-parser-es@npm:^1.0.5":
+  version: 1.0.5
+  resolution: "error-stack-parser-es@npm:1.0.5"
+  checksum: 040665eb87a42fe068c0da501bc258f3d15d3a03963c0723d7a2741e251d400c9776a52d2803afdc5709def99554cdb5a5d99c203c7eaf4885d3fbc217e2e8f7
+  languageName: node
+  linkType: hard
+
 "es-abstract@npm:^1.17.5, es-abstract@npm:^1.23.0, es-abstract@npm:^1.23.2, es-abstract@npm:^1.23.3":
   version: 1.23.3
   resolution: "es-abstract@npm:1.23.3"
@@ -8899,247 +11296,36 @@ __metadata:
   languageName: node
   linkType: hard
 
-"esbuild-android-64@npm:0.14.54":
-  version: 0.14.54
-  resolution: "esbuild-android-64@npm:0.14.54"
-  conditions: os=android & cpu=x64
-  languageName: node
-  linkType: hard
-
-"esbuild-android-arm64@npm:0.14.54":
-  version: 0.14.54
-  resolution: "esbuild-android-arm64@npm:0.14.54"
-  conditions: os=android & cpu=arm64
-  languageName: node
-  linkType: hard
-
-"esbuild-darwin-64@npm:0.14.54":
-  version: 0.14.54
-  resolution: "esbuild-darwin-64@npm:0.14.54"
-  conditions: os=darwin & cpu=x64
-  languageName: node
-  linkType: hard
-
-"esbuild-darwin-arm64@npm:0.14.54":
-  version: 0.14.54
-  resolution: "esbuild-darwin-arm64@npm:0.14.54"
-  conditions: os=darwin & cpu=arm64
-  languageName: node
-  linkType: hard
-
-"esbuild-freebsd-64@npm:0.14.54":
-  version: 0.14.54
-  resolution: "esbuild-freebsd-64@npm:0.14.54"
-  conditions: os=freebsd & cpu=x64
-  languageName: node
-  linkType: hard
-
-"esbuild-freebsd-arm64@npm:0.14.54":
-  version: 0.14.54
-  resolution: "esbuild-freebsd-arm64@npm:0.14.54"
-  conditions: os=freebsd & cpu=arm64
-  languageName: node
-  linkType: hard
-
-"esbuild-linux-32@npm:0.14.54":
-  version: 0.14.54
-  resolution: "esbuild-linux-32@npm:0.14.54"
-  conditions: os=linux & cpu=ia32
-  languageName: node
-  linkType: hard
-
-"esbuild-linux-64@npm:0.14.54":
-  version: 0.14.54
-  resolution: "esbuild-linux-64@npm:0.14.54"
-  conditions: os=linux & cpu=x64
-  languageName: node
-  linkType: hard
-
-"esbuild-linux-arm64@npm:0.14.54":
-  version: 0.14.54
-  resolution: "esbuild-linux-arm64@npm:0.14.54"
-  conditions: os=linux & cpu=arm64
-  languageName: node
-  linkType: hard
-
-"esbuild-linux-arm@npm:0.14.54":
-  version: 0.14.54
-  resolution: "esbuild-linux-arm@npm:0.14.54"
-  conditions: os=linux & cpu=arm
-  languageName: node
-  linkType: hard
-
-"esbuild-linux-mips64le@npm:0.14.54":
-  version: 0.14.54
-  resolution: "esbuild-linux-mips64le@npm:0.14.54"
-  conditions: os=linux & cpu=mips64el
-  languageName: node
-  linkType: hard
-
-"esbuild-linux-ppc64le@npm:0.14.54":
-  version: 0.14.54
-  resolution: "esbuild-linux-ppc64le@npm:0.14.54"
-  conditions: os=linux & cpu=ppc64
-  languageName: node
-  linkType: hard
-
-"esbuild-linux-riscv64@npm:0.14.54":
-  version: 0.14.54
-  resolution: "esbuild-linux-riscv64@npm:0.14.54"
-  conditions: os=linux & cpu=riscv64
-  languageName: node
-  linkType: hard
-
-"esbuild-linux-s390x@npm:0.14.54":
-  version: 0.14.54
-  resolution: "esbuild-linux-s390x@npm:0.14.54"
-  conditions: os=linux & cpu=s390x
-  languageName: node
-  linkType: hard
-
-"esbuild-netbsd-64@npm:0.14.54":
-  version: 0.14.54
-  resolution: "esbuild-netbsd-64@npm:0.14.54"
-  conditions: os=netbsd & cpu=x64
-  languageName: node
-  linkType: hard
-
-"esbuild-openbsd-64@npm:0.14.54":
-  version: 0.14.54
-  resolution: "esbuild-openbsd-64@npm:0.14.54"
-  conditions: os=openbsd & cpu=x64
-  languageName: node
-  linkType: hard
-
-"esbuild-sunos-64@npm:0.14.54":
-  version: 0.14.54
-  resolution: "esbuild-sunos-64@npm:0.14.54"
-  conditions: os=sunos & cpu=x64
-  languageName: node
-  linkType: hard
-
-"esbuild-windows-32@npm:0.14.54":
-  version: 0.14.54
-  resolution: "esbuild-windows-32@npm:0.14.54"
-  conditions: os=win32 & cpu=ia32
-  languageName: node
-  linkType: hard
-
-"esbuild-windows-64@npm:0.14.54":
-  version: 0.14.54
-  resolution: "esbuild-windows-64@npm:0.14.54"
-  conditions: os=win32 & cpu=x64
-  languageName: node
-  linkType: hard
-
-"esbuild-windows-arm64@npm:0.14.54":
-  version: 0.14.54
-  resolution: "esbuild-windows-arm64@npm:0.14.54"
-  conditions: os=win32 & cpu=arm64
-  languageName: node
-  linkType: hard
-
-"esbuild@npm:^0.14.25":
-  version: 0.14.54
-  resolution: "esbuild@npm:0.14.54"
-  dependencies:
-    "@esbuild/linux-loong64": 0.14.54
-    esbuild-android-64: 0.14.54
-    esbuild-android-arm64: 0.14.54
-    esbuild-darwin-64: 0.14.54
-    esbuild-darwin-arm64: 0.14.54
-    esbuild-freebsd-64: 0.14.54
-    esbuild-freebsd-arm64: 0.14.54
-    esbuild-linux-32: 0.14.54
-    esbuild-linux-64: 0.14.54
-    esbuild-linux-arm: 0.14.54
-    esbuild-linux-arm64: 0.14.54
-    esbuild-linux-mips64le: 0.14.54
-    esbuild-linux-ppc64le: 0.14.54
-    esbuild-linux-riscv64: 0.14.54
-    esbuild-linux-s390x: 0.14.54
-    esbuild-netbsd-64: 0.14.54
-    esbuild-openbsd-64: 0.14.54
-    esbuild-sunos-64: 0.14.54
-    esbuild-windows-32: 0.14.54
-    esbuild-windows-64: 0.14.54
-    esbuild-windows-arm64: 0.14.54
-  dependenciesMeta:
-    "@esbuild/linux-loong64":
-      optional: true
-    esbuild-android-64:
-      optional: true
-    esbuild-android-arm64:
-      optional: true
-    esbuild-darwin-64:
-      optional: true
-    esbuild-darwin-arm64:
-      optional: true
-    esbuild-freebsd-64:
-      optional: true
-    esbuild-freebsd-arm64:
-      optional: true
-    esbuild-linux-32:
-      optional: true
-    esbuild-linux-64:
-      optional: true
-    esbuild-linux-arm:
-      optional: true
-    esbuild-linux-arm64:
-      optional: true
-    esbuild-linux-mips64le:
-      optional: true
-    esbuild-linux-ppc64le:
-      optional: true
-    esbuild-linux-riscv64:
-      optional: true
-    esbuild-linux-s390x:
-      optional: true
-    esbuild-netbsd-64:
-      optional: true
-    esbuild-openbsd-64:
-      optional: true
-    esbuild-sunos-64:
-      optional: true
-    esbuild-windows-32:
-      optional: true
-    esbuild-windows-64:
-      optional: true
-    esbuild-windows-arm64:
-      optional: true
-  bin:
-    esbuild: bin/esbuild
-  checksum: 1df3cf7c5175ebee284fd027f287385a07ce8a0f0460a4412881aeff707577d91e55302f220ee8397b3b5aa17f4ceeb80eac16f36fc676532ff1b744e5965f2d
-  languageName: node
-  linkType: hard
-
-"esbuild@npm:^0.21.3":
-  version: 0.21.5
-  resolution: "esbuild@npm:0.21.5"
-  dependencies:
-    "@esbuild/aix-ppc64": 0.21.5
-    "@esbuild/android-arm": 0.21.5
-    "@esbuild/android-arm64": 0.21.5
-    "@esbuild/android-x64": 0.21.5
-    "@esbuild/darwin-arm64": 0.21.5
-    "@esbuild/darwin-x64": 0.21.5
-    "@esbuild/freebsd-arm64": 0.21.5
-    "@esbuild/freebsd-x64": 0.21.5
-    "@esbuild/linux-arm": 0.21.5
-    "@esbuild/linux-arm64": 0.21.5
-    "@esbuild/linux-ia32": 0.21.5
-    "@esbuild/linux-loong64": 0.21.5
-    "@esbuild/linux-mips64el": 0.21.5
-    "@esbuild/linux-ppc64": 0.21.5
-    "@esbuild/linux-riscv64": 0.21.5
-    "@esbuild/linux-s390x": 0.21.5
-    "@esbuild/linux-x64": 0.21.5
-    "@esbuild/netbsd-x64": 0.21.5
-    "@esbuild/openbsd-x64": 0.21.5
-    "@esbuild/sunos-x64": 0.21.5
-    "@esbuild/win32-arm64": 0.21.5
-    "@esbuild/win32-ia32": 0.21.5
-    "@esbuild/win32-x64": 0.21.5
+"esbuild@npm:^0.27.0":
+  version: 0.27.7
+  resolution: "esbuild@npm:0.27.7"
+  dependencies:
+    "@esbuild/aix-ppc64": 0.27.7
+    "@esbuild/android-arm": 0.27.7
+    "@esbuild/android-arm64": 0.27.7
+    "@esbuild/android-x64": 0.27.7
+    "@esbuild/darwin-arm64": 0.27.7
+    "@esbuild/darwin-x64": 0.27.7
+    "@esbuild/freebsd-arm64": 0.27.7
+    "@esbuild/freebsd-x64": 0.27.7
+    "@esbuild/linux-arm": 0.27.7
+    "@esbuild/linux-arm64": 0.27.7
+    "@esbuild/linux-ia32": 0.27.7
+    "@esbuild/linux-loong64": 0.27.7
+    "@esbuild/linux-mips64el": 0.27.7
+    "@esbuild/linux-ppc64": 0.27.7
+    "@esbuild/linux-riscv64": 0.27.7
+    "@esbuild/linux-s390x": 0.27.7
+    "@esbuild/linux-x64": 0.27.7
+    "@esbuild/netbsd-arm64": 0.27.7
+    "@esbuild/netbsd-x64": 0.27.7
+    "@esbuild/openbsd-arm64": 0.27.7
+    "@esbuild/openbsd-x64": 0.27.7
+    "@esbuild/openharmony-arm64": 0.27.7
+    "@esbuild/sunos-x64": 0.27.7
+    "@esbuild/win32-arm64": 0.27.7
+    "@esbuild/win32-ia32": 0.27.7
+    "@esbuild/win32-x64": 0.27.7
   dependenciesMeta:
     "@esbuild/aix-ppc64":
       optional: true
@@ -9175,10 +11361,16 @@ __metadata:
       optional: true
     "@esbuild/linux-x64":
       optional: true
+    "@esbuild/netbsd-arm64":
+      optional: true
     "@esbuild/netbsd-x64":
       optional: true
+    "@esbuild/openbsd-arm64":
+      optional: true
     "@esbuild/openbsd-x64":
       optional: true
+    "@esbuild/openharmony-arm64":
+      optional: true
     "@esbuild/sunos-x64":
       optional: true
     "@esbuild/win32-arm64":
@@ -9189,7 +11381,7 @@ __metadata:
       optional: true
   bin:
     esbuild: bin/esbuild
-  checksum: fa08508adf683c3f399e8a014a6382a6b65542213431e26206c0720e536b31c09b50798747c2a105a4bbba1d9767b8d3615a74c2f7bf1ddf6d836cd11eb672de
+  checksum: ccd51f0555708bc9ff4ec9dc3ac92d3daacd45ecaac949ca8645984c5c323bf8cefe98c2df307418685e0b4ce37f9a3bdbfe8e3651fe632a0059a436195a17d4
   languageName: node
   linkType: hard
 
@@ -9207,6 +11399,13 @@ __metadata:
   languageName: node
   linkType: hard
 
+"escape-html@npm:^1.0.3":
+  version: 1.0.3
+  resolution: "escape-html@npm:1.0.3"
+  checksum: 524c739d776b36c3d29fa08a22e03e8824e3b2fd57500e5e44ecf3cc4707c34c60f9ca0781c0e33d191f2991161504c295e98f68c78fe7baa6e57081ec6ac0a3
+  languageName: node
+  linkType: hard
+
 "escape-string-regexp@npm:5.0.0, escape-string-regexp@npm:^5.0.0":
   version: 5.0.0
   resolution: "escape-string-regexp@npm:5.0.0"
@@ -9591,6 +11790,16 @@ __metadata:
   languageName: node
   linkType: hard
 
+"esprima@npm:^4.0.1":
+  version: 4.0.1
+  resolution: "esprima@npm:4.0.1"
+  bin:
+    esparse: ./bin/esparse.js
+    esvalidate: ./bin/esvalidate.js
+  checksum: ad4bab9ead0808cf56501750fd9d3fb276f6b105f987707d059005d57e182d18a7c9ec7f3a01794ebddcca676773e42ca48a32d67a250c9d35e009ca613caba3
+  languageName: node
+  linkType: hard
+
 "esquery@npm:^1.5.0":
   version: 1.6.0
   resolution: "esquery@npm:1.6.0"
@@ -9716,6 +11925,13 @@ __metadata:
   languageName: node
   linkType: hard
 
+"etag@npm:^1.8.1":
+  version: 1.8.1
+  resolution: "etag@npm:1.8.1"
+  checksum: 12be11ef62fb9817314d790089a0a49fae4e1b50594135dcb8076312b7d7e470884b5100d249b28c18581b7fd52f8b485689ffae22a11ed9ec17377a33a08f84
+  languageName: node
+  linkType: hard
+
 "event-source-polyfill@npm:1.0.31":
   version: 1.0.31
   resolution: "event-source-polyfill@npm:1.0.31"
@@ -9723,6 +11939,13 @@ __metadata:
   languageName: node
   linkType: hard
 
+"event-target-shim@npm:^5.0.0":
+  version: 5.0.1
+  resolution: "event-target-shim@npm:5.0.1"
+  checksum: 0255d9f936215fd206156fd4caa9e8d35e62075d720dc7d847e89b417e5e62cf1ce6c9b4e0a1633a9256de0efefaf9f8d26924b1f3c8620cffb9db78e7d3076b
+  languageName: node
+  linkType: hard
+
 "eventsource@npm:2.0.2":
   version: 2.0.2
   resolution: "eventsource@npm:2.0.2"
@@ -9730,7 +11953,7 @@ __metadata:
   languageName: node
   linkType: hard
 
-"execa@npm:^5.0.0":
+"execa@npm:^5.1.1":
   version: 5.1.1
   resolution: "execa@npm:5.1.1"
   dependencies:
@@ -9761,6 +11984,42 @@ __metadata:
   languageName: node
   linkType: hard
 
+"express@npm:^5.1.0":
+  version: 5.2.1
+  resolution: "express@npm:5.2.1"
+  dependencies:
+    accepts: ^2.0.0
+    body-parser: ^2.2.1
+    content-disposition: ^1.0.0
+    content-type: ^1.0.5
+    cookie: ^0.7.1
+    cookie-signature: ^1.2.1
+    debug: ^4.4.0
+    depd: ^2.0.0
+    encodeurl: ^2.0.0
+    escape-html: ^1.0.3
+    etag: ^1.8.1
+    finalhandler: ^2.1.0
+    fresh: ^2.0.0
+    http-errors: ^2.0.0
+    merge-descriptors: ^2.0.0
+    mime-types: ^3.0.0
+    on-finished: ^2.4.1
+    once: ^1.4.0
+    parseurl: ^1.3.3
+    proxy-addr: ^2.0.7
+    qs: ^6.14.0
+    range-parser: ^1.2.1
+    router: ^2.2.0
+    send: ^1.1.0
+    serve-static: ^2.2.0
+    statuses: ^2.0.1
+    type-is: ^2.0.1
+    vary: ^1.1.2
+  checksum: 45e8c841ad188a41402ddcd1294901e861ee0819f632fb494f2ed344ef9c43315d294d443fb48d594e6586a3b779785120f43321417adaef8567316a55072949
+  languageName: node
+  linkType: hard
+
 "extend@npm:^3.0.0":
   version: 3.0.2
   resolution: "extend@npm:3.0.2"
@@ -9822,6 +12081,30 @@ __metadata:
   languageName: node
   linkType: hard
 
+"fast-xml-builder@npm:^1.1.5":
+  version: 1.2.0
+  resolution: "fast-xml-builder@npm:1.2.0"
+  dependencies:
+    path-expression-matcher: ^1.5.0
+    xml-naming: ^0.1.0
+  checksum: 84bb105cd04e91d6dcb746c4dbaeb12903b510e7ab9a06ffde55b5a582e005559a87d84467f18a655c6c4baf098f696fd74cee3cbe1aea9d01385907768ba32d
+  languageName: node
+  linkType: hard
+
+"fast-xml-parser@npm:5.7.2":
+  version: 5.7.2
+  resolution: "fast-xml-parser@npm:5.7.2"
+  dependencies:
+    "@nodable/entities": ^2.1.0
+    fast-xml-builder: ^1.1.5
+    path-expression-matcher: ^1.5.0
+    strnum: ^2.2.3
+  bin:
+    fxparser: src/cli/cli.js
+  checksum: d48439ce0700add82f5e7c6ccc5a1f06483beb7cd8e88caa83c6406843e52f14988e60d05cbb3a86ffe07e073807674c807e0764d94a280e1c96d7e2011dae8e
+  languageName: node
+  linkType: hard
+
 "fastq@npm:^1.6.0":
   version: 1.17.1
   resolution: "fastq@npm:1.17.1"
@@ -9840,6 +12123,18 @@ __metadata:
   languageName: node
   linkType: hard
 
+"fdir@npm:^6.2.0":
+  version: 6.5.0
+  resolution: "fdir@npm:6.5.0"
+  peerDependencies:
+    picomatch: ^3 || ^4
+  peerDependenciesMeta:
+    picomatch:
+      optional: true
+  checksum: e345083c4306b3aed6cb8ec551e26c36bab5c511e99ea4576a16750ddc8d3240e63826cc624f5ae17ad4dc82e68a253213b60d556c11bfad064b7607847ed07f
+  languageName: node
+  linkType: hard
+
 "fdir@npm:^6.4.3":
   version: 6.4.3
   resolution: "fdir@npm:6.4.3"
@@ -9877,6 +12172,20 @@ __metadata:
   languageName: node
   linkType: hard
 
+"finalhandler@npm:^2.1.0":
+  version: 2.1.1
+  resolution: "finalhandler@npm:2.1.1"
+  dependencies:
+    debug: ^4.4.0
+    encodeurl: ^2.0.0
+    escape-html: ^1.0.3
+    on-finished: ^2.4.1
+    parseurl: ^1.3.3
+    statuses: ^2.0.1
+  checksum: 6bd664e21b7b2e79efcaace7d1a427169f61cce048fae68eb56290e6934e676b78e55d89f5998c5508871345bc59a61f47002dc505dc7288be68cceac1b701e2
+  languageName: node
+  linkType: hard
+
 "find-up@npm:^5.0.0":
   version: 5.0.0
   resolution: "find-up@npm:5.0.0"
@@ -9949,7 +12258,24 @@ __metadata:
   languageName: node
   linkType: hard
 
-"form-data@npm:^4.0.0":
+"foreground-child@npm:^3.3.1":
+  version: 3.3.1
+  resolution: "foreground-child@npm:3.3.1"
+  dependencies:
+    cross-spawn: ^7.0.6
+    signal-exit: ^4.0.1
+  checksum: 8986e4af2430896e65bc2788d6679067294d6aee9545daefc84923a0a4b399ad9c7a3ea7bd8c0b2b80fdf4a92de4c69df3f628233ff3224260e9c1541a9e9ed3
+  languageName: node
+  linkType: hard
+
+"form-data-encoder@npm:1.7.2":
+  version: 1.7.2
+  resolution: "form-data-encoder@npm:1.7.2"
+  checksum: 56553768037b6d55d9de524f97fe70555f0e415e781cb56fc457a68263de3d40fadea2304d4beef2d40b1a851269bd7854e42c362107071892cb5238debe9464
+  languageName: node
+  linkType: hard
+
+"form-data@npm:^4.0.0, form-data@npm:^4.0.4":
   version: 4.0.5
   resolution: "form-data@npm:4.0.5"
   dependencies:
@@ -9962,10 +12288,27 @@ __metadata:
   languageName: node
   linkType: hard
 
-"format@npm:^0.2.0":
-  version: 0.2.2
-  resolution: "format@npm:0.2.2"
-  checksum: 6032ba747541a43abf3e37b402b2f72ee08ebcb58bf84d816443dd228959837f1cddf1e8775b29fa27ff133f4bd146d041bfca5f9cf27f048edf3d493cf8fee6
+"format@npm:^0.2.0":
+  version: 0.2.2
+  resolution: "format@npm:0.2.2"
+  checksum: 6032ba747541a43abf3e37b402b2f72ee08ebcb58bf84d816443dd228959837f1cddf1e8775b29fa27ff133f4bd146d041bfca5f9cf27f048edf3d493cf8fee6
+  languageName: node
+  linkType: hard
+
+"formdata-node@npm:^4.3.2":
+  version: 4.4.1
+  resolution: "formdata-node@npm:4.4.1"
+  dependencies:
+    node-domexception: 1.0.0
+    web-streams-polyfill: 4.0.0-beta.3
+  checksum: 74151e7b228ffb33b565cec69182694ad07cc3fdd9126a8240468bb70a8ba66e97e097072b60bcb08729b24c7ce3fd3e0bd7f1f80df6f9f662b9656786e76f6a
+  languageName: node
+  linkType: hard
+
+"forwarded@npm:0.2.0":
+  version: 0.2.0
+  resolution: "forwarded@npm:0.2.0"
+  checksum: 9b67c3fac86acdbc9ae47ba1ddd5f2f81526fa4c8226863ede5600a3f7c7416ef451f6f1e240a3cc32d0fd79fcfe6beb08fd0da454f360032bde70bf80afbb33
   languageName: node
   linkType: hard
 
@@ -10018,6 +12361,13 @@ __metadata:
   languageName: node
   linkType: hard
 
+"fresh@npm:^2.0.0":
+  version: 2.0.0
+  resolution: "fresh@npm:2.0.0"
+  checksum: 0557548194cb9a809a435bf92bcfbc20c89e8b5eb38861b73ced36750437251e39a111fc3a18b98531be9dd91fe1411e4969f229dc579ec0251ce6c5d4900bbc
+  languageName: node
+  linkType: hard
+
 "fs-minipass@npm:^2.0.0":
   version: 2.1.0
   resolution: "fs-minipass@npm:2.1.0"
@@ -10036,6 +12386,13 @@ __metadata:
   languageName: node
   linkType: hard
 
+"fs.realpath@npm:^1.0.0":
+  version: 1.0.0
+  resolution: "fs.realpath@npm:1.0.0"
+  checksum: 444cf1291d997165dfd4c0d58b69f0e4782bfd9149fd72faa4fe299e68e0e93d6db941660b37dd29153bf7186672ececa3b50b7e7249477b03fdf850f287c948
+  languageName: node
+  linkType: hard
+
 "fsevents@npm:~2.3.2, fsevents@npm:~2.3.3":
   version: 2.3.3
   resolution: "fsevents@npm:2.3.3"
@@ -10102,6 +12459,20 @@ __metadata:
   languageName: node
   linkType: hard
 
+"get-caller-file@npm:^2.0.5":
+  version: 2.0.5
+  resolution: "get-caller-file@npm:2.0.5"
+  checksum: c6c7b60271931fa752aeb92f2b47e355eac1af3a2673f47c9589e8f8a41adc74d45551c1bc57b5e66a80609f10ffb72b6f575e4370d61cc3f7f3aaff01757cde
+  languageName: node
+  linkType: hard
+
+"get-east-asian-width@npm:^1.0.0":
+  version: 1.6.0
+  resolution: "get-east-asian-width@npm:1.6.0"
+  checksum: 7e72e9550fd49ca5b246f9af6bb2afc129c96412845ff6556b3274fd44817a381702ca17028efe9866b261a3d44254cbf21e6c90cf05b4b61675630af776d431
+  languageName: node
+  linkType: hard
+
 "get-intrinsic@npm:^1.1.1, get-intrinsic@npm:^1.1.3, get-intrinsic@npm:^1.2.1, get-intrinsic@npm:^1.2.2, get-intrinsic@npm:^1.2.3, get-intrinsic@npm:^1.2.4":
   version: 1.2.4
   resolution: "get-intrinsic@npm:1.2.4"
@@ -10227,6 +12598,18 @@ __metadata:
   languageName: node
   linkType: hard
 
+"glob@npm:9.3.5":
+  version: 9.3.5
+  resolution: "glob@npm:9.3.5"
+  dependencies:
+    fs.realpath: ^1.0.0
+    minimatch: ^8.0.2
+    minipass: ^4.2.4
+    path-scurry: ^1.6.1
+  checksum: 2f6c2b9ee019ee21dc258ae97a88719614591e4c979cb4580b1b9df6f0f778a3cb38b4bdaf18dfa584637ea10f89a3c5f2533a5e449cf8741514ad18b0951f2e
+  languageName: node
+  linkType: hard
+
 "glob@npm:^10.2.2, glob@npm:^10.3.10, glob@npm:^10.3.7":
   version: 10.3.10
   resolution: "glob@npm:10.3.10"
@@ -10242,6 +12625,22 @@ __metadata:
   languageName: node
   linkType: hard
 
+"glob@npm:^12.0.0":
+  version: 12.0.0
+  resolution: "glob@npm:12.0.0"
+  dependencies:
+    foreground-child: ^3.3.1
+    jackspeak: ^4.1.1
+    minimatch: ^10.1.1
+    minipass: ^7.1.2
+    package-json-from-dist: ^1.0.0
+    path-scurry: ^2.0.0
+  bin:
+    glob: dist/esm/bin.mjs
+  checksum: 923fbb7e30913496dc1c30191edb7ebb610a26edac81710a5f697c718b08694bce7fb0245baceba5383472778a8431ff7c36571703507cc6563602d3c139c993
+  languageName: node
+  linkType: hard
+
 "globals@npm:^11.1.0":
   version: 11.12.0
   resolution: "globals@npm:11.12.0"
@@ -10275,7 +12674,7 @@ __metadata:
   languageName: node
   linkType: hard
 
-"globby@npm:^11.0.3, globby@npm:^11.0.4":
+"globby@npm:^11.0.4":
   version: 11.1.0
   resolution: "globby@npm:11.1.0"
   dependencies:
@@ -10346,7 +12745,7 @@ __metadata:
   languageName: node
   linkType: hard
 
-"gzip-size@npm:^6.0.0":
+"gzip-size@npm:6.0.0, gzip-size@npm:^6.0.0":
   version: 6.0.0
   resolution: "gzip-size@npm:6.0.0"
   dependencies:
@@ -10606,6 +13005,19 @@ __metadata:
   languageName: node
   linkType: hard
 
+"http-errors@npm:^2.0.0, http-errors@npm:^2.0.1, http-errors@npm:~2.0.1":
+  version: 2.0.1
+  resolution: "http-errors@npm:2.0.1"
+  dependencies:
+    depd: ~2.0.0
+    inherits: ~2.0.4
+    setprototypeof: ~1.2.0
+    statuses: ~2.0.2
+    toidentifier: ~1.0.1
+  checksum: fb38906cef4f5c83952d97661fe14dc156cb59fe54812a42cd448fa57b5c5dfcb38a40a916957737bd6b87aab257c0648d63eb5b6a9ca9f548e105b6072712d4
+  languageName: node
+  linkType: hard
+
 "http-proxy-agent@npm:^7.0.0, http-proxy-agent@npm:^7.0.2":
   version: 7.0.2
   resolution: "http-proxy-agent@npm:7.0.2"
@@ -10643,6 +13055,15 @@ __metadata:
   languageName: node
   linkType: hard
 
+"humanize-ms@npm:^1.2.1":
+  version: 1.2.1
+  resolution: "humanize-ms@npm:1.2.1"
+  dependencies:
+    ms: ^2.0.0
+  checksum: f34a2c20161d02303c2807badec2f3b49cbfbbb409abd4f95a07377ae01cfe6b59e3d15ac609cffcd8f2521f0eb37b7e1091acf65da99aa2a4f1ad63c21e7e7a
+  languageName: node
+  linkType: hard
+
 "iconv-lite@npm:0.6, iconv-lite@npm:0.6.3, iconv-lite@npm:^0.6.2":
   version: 0.6.3
   resolution: "iconv-lite@npm:0.6.3"
@@ -10652,6 +13073,15 @@ __metadata:
   languageName: node
   linkType: hard
 
+"iconv-lite@npm:^0.7.0, iconv-lite@npm:~0.7.0":
+  version: 0.7.2
+  resolution: "iconv-lite@npm:0.7.2"
+  dependencies:
+    safer-buffer: ">= 2.1.2 < 3.0.0"
+  checksum: 3c228920f3bd307f56bf8363706a776f4a060eb042f131cd23855ceca962951b264d0997ab38a1ad340e1c5df8499ed26e1f4f0db6b2a2ad9befaff22f14b722
+  languageName: node
+  linkType: hard
+
 "ignore@npm:^5.2.0, ignore@npm:^5.2.4":
   version: 5.3.1
   resolution: "ignore@npm:5.3.1"
@@ -10659,7 +13089,7 @@ __metadata:
   languageName: node
   linkType: hard
 
-"ignore@npm:^5.3.1":
+"ignore@npm:^5.3.0, ignore@npm:^5.3.1":
   version: 5.3.2
   resolution: "ignore@npm:5.3.2"
   checksum: f9f652c957983634ded1e7f02da3b559a0d4cc210fca3792cb67f1b153623c9c42efdc1c4121af171e295444459fc4a9201101fb041b1104a3c000bccb188337
@@ -10697,7 +13127,7 @@ __metadata:
   languageName: node
   linkType: hard
 
-"inherits@npm:^2.0.3, inherits@npm:^2.0.4":
+"inherits@npm:^2.0.3, inherits@npm:^2.0.4, inherits@npm:~2.0.4":
   version: 2.0.4
   resolution: "inherits@npm:2.0.4"
   checksum: 4e531f648b29039fb7426fb94075e6545faa1eb9fe83c29f0b6d9e7263aceb4289d2d4557db0d428188eeb449cc7c5e77b0a0b2c4e248ff2a65933a0dee49ef2
@@ -10814,6 +13244,13 @@ __metadata:
   languageName: node
   linkType: hard
 
+"ipaddr.js@npm:1.9.1":
+  version: 1.9.1
+  resolution: "ipaddr.js@npm:1.9.1"
+  checksum: 0486e775047971d3fdb5fb4f063829bac45af299ae0b82dcf3afa2145338e08290563a2a70f34b732d795ecc8311902e541a8530eeb30d75860a78ff4e94ce2a
+  languageName: node
+  linkType: hard
+
 "is-alphabetical@npm:^1.0.0":
   version: 1.0.4
   resolution: "is-alphabetical@npm:1.0.4"
@@ -11156,6 +13593,13 @@ __metadata:
   languageName: node
   linkType: hard
 
+"is-promise@npm:^4.0.0":
+  version: 4.0.0
+  resolution: "is-promise@npm:4.0.0"
+  checksum: ebd5c672d73db781ab33ccb155fb9969d6028e37414d609b115cc534654c91ccd061821d5b987eefaa97cf4c62f0b909bb2f04db88306de26e91bfe8ddc01503
+  languageName: node
+  linkType: hard
+
 "is-reference@npm:^3.0.0":
   version: 3.0.2
   resolution: "is-reference@npm:3.0.2"
@@ -11403,6 +13847,15 @@ __metadata:
   languageName: node
   linkType: hard
 
+"jackspeak@npm:^4.1.1":
+  version: 4.2.3
+  resolution: "jackspeak@npm:4.2.3"
+  dependencies:
+    "@isaacs/cliui": ^9.0.0
+  checksum: b5c0c414f1607c2aa0597f4bf2c03b8443897fccd5fd3c2b3e4f77d556b2bc7c3d3413828ba91e0789f6fb40ad90242f7f89fb20aee9e9d705bc1681f7564f67
+  languageName: node
+  linkType: hard
+
 "jiti@npm:^1.18.2, jiti@npm:^1.19.1":
   version: 1.21.0
   resolution: "jiti@npm:1.21.0"
@@ -11412,13 +13865,6 @@ __metadata:
   languageName: node
   linkType: hard
 
-"joycon@npm:^3.0.1":
-  version: 3.1.1
-  resolution: "joycon@npm:3.1.1"
-  checksum: 131fb1e98c9065d067fd49b6e685487ac4ad4d254191d7aa2c9e3b90f4e9ca70430c43cad001602bdbdabcf58717d3b5c5b7461c1bd8e39478c8de706b3fe6ae
-  languageName: node
-  linkType: hard
-
 "js-cookie@npm:3.0.1":
   version: 3.0.1
   resolution: "js-cookie@npm:3.0.1"
@@ -11677,7 +14123,7 @@ __metadata:
   languageName: node
   linkType: hard
 
-"kleur@npm:^4.0.3":
+"kleur@npm:^4.0.3, kleur@npm:^4.1.5":
   version: 4.1.5
   resolution: "kleur@npm:4.1.5"
   checksum: e9de6cb49657b6fa70ba2d1448fd3d691a5c4370d8f7bbf1c2f64c24d461270f2117e1b0afe8cb3114f13bbd8e51de158c2a224953960331904e636a5e4c0f2a
@@ -11724,7 +14170,7 @@ __metadata:
   languageName: node
   linkType: hard
 
-"lilconfig@npm:^2.0.5, lilconfig@npm:^2.1.0":
+"lilconfig@npm:^2.1.0":
   version: 2.1.0
   resolution: "lilconfig@npm:2.1.0"
   checksum: 64645641aa8d274c99338e130554abd6a0190533c0d9eb2ce7ebfaf2e05c7d9961f3ffe2bfa39efd3b60c521ba3dd24fa236fe2775fc38501bf82bf49d4678b8
@@ -11745,13 +14191,6 @@ __metadata:
   languageName: node
   linkType: hard
 
-"load-tsconfig@npm:^0.2.0":
-  version: 0.2.5
-  resolution: "load-tsconfig@npm:0.2.5"
-  checksum: bf2823dd26389d3497b6567f07435c5a7a58d9df82e879b0b3892f87d8db26900f84c85bc329ef41c0540c0d6a448d1c23ddc64a80f3ff6838b940f3915a3fcb
-  languageName: node
-  linkType: hard
-
 "locate-path@npm:^6.0.0":
   version: 6.0.0
   resolution: "locate-path@npm:6.0.0"
@@ -11782,13 +14221,6 @@ __metadata:
   languageName: node
   linkType: hard
 
-"lodash.sortby@npm:^4.7.0":
-  version: 4.7.0
-  resolution: "lodash.sortby@npm:4.7.0"
-  checksum: fc48fb54ff7669f33bb32997cab9460757ee99fafaf72400b261c3e10fde21538e47d8cfcbe6a25a31bcb5b7b727c27d52626386fc2de24eb059a6d64a89cdf5
-  languageName: node
-  linkType: hard
-
 "lodash@npm:^4.17.21":
   version: 4.17.21
   resolution: "lodash@npm:4.17.21"
@@ -11835,13 +14267,20 @@ __metadata:
   languageName: node
   linkType: hard
 
-"lru-cache@npm:^10.4.3":
+"lru-cache@npm:^10.2.0, lru-cache@npm:^10.4.3":
   version: 10.4.3
   resolution: "lru-cache@npm:10.4.3"
   checksum: ebd04fbca961e6c1d6c0af3799adcc966a1babe798f685bb84e6599266599cd95d94630b10262f5424539bc4640107e8a33aa28585374abf561d30d16f4b39fb
   languageName: node
   linkType: hard
 
+"lru-cache@npm:^11.0.0":
+  version: 11.3.6
+  resolution: "lru-cache@npm:11.3.6"
+  checksum: 3afe3e3000e424c18b640dcea5776b5c1de8684b7dac9718d58792dff1a4692b38cc14e263cbb41bdab98ffcf5408f003b33133b179ce5d271284be72a3ff2a9
+  languageName: node
+  linkType: hard
+
 "lru-cache@npm:^11.2.1, lru-cache@npm:^11.2.2":
   version: 11.2.2
   resolution: "lru-cache@npm:11.2.2"
@@ -12145,6 +14584,13 @@ __metadata:
   languageName: node
   linkType: hard
 
+"media-typer@npm:^1.1.0":
+  version: 1.1.0
+  resolution: "media-typer@npm:1.1.0"
+  checksum: 7b4baa40b25964bb90e2121ee489ec38642127e48d0cc2b6baa442688d3fde6262bfdca86d6bbf6ba708784afcac168c06840c71facac70e390f5f759ac121b9
+  languageName: node
+  linkType: hard
+
 "meow@npm:^12.0.1":
   version: 12.1.1
   resolution: "meow@npm:12.1.1"
@@ -12152,6 +14598,13 @@ __metadata:
   languageName: node
   linkType: hard
 
+"merge-descriptors@npm:^2.0.0":
+  version: 2.0.0
+  resolution: "merge-descriptors@npm:2.0.0"
+  checksum: 95389b7ced3f9b36fbdcf32eb946dc3dd1774c2fdf164609e55b18d03aa499b12bd3aae3a76c1c7185b96279e9803525550d3eb292b5224866060a288f335cb3
+  languageName: node
+  linkType: hard
+
 "merge-stream@npm:^2.0.0":
   version: 2.0.0
   resolution: "merge-stream@npm:2.0.0"
@@ -12828,6 +15281,13 @@ __metadata:
   languageName: node
   linkType: hard
 
+"mime-db@npm:^1.54.0":
+  version: 1.54.0
+  resolution: "mime-db@npm:1.54.0"
+  checksum: 8d907917bc2a90fa2df842cdf5dfeaf509adc15fe0531e07bb2f6ab15992416479015828d6a74200041c492e42cce3ebf78e5ce714388a0a538ea9c53eece284
+  languageName: node
+  linkType: hard
+
 "mime-types@npm:^2.1.12":
   version: 2.1.35
   resolution: "mime-types@npm:2.1.35"
@@ -12837,6 +15297,15 @@ __metadata:
   languageName: node
   linkType: hard
 
+"mime-types@npm:^3, mime-types@npm:^3.0.0, mime-types@npm:^3.0.2":
+  version: 3.0.2
+  resolution: "mime-types@npm:3.0.2"
+  dependencies:
+    mime-db: ^1.54.0
+  checksum: 35a0dd1035d14d185664f346efcdb72e93ef7a9b6e9ae808bd1f6358227010267fab52657b37562c80fc888ff76becb2b2938deb5e730818b7983bf8bd359767
+  languageName: node
+  linkType: hard
+
 "mimic-fn@npm:^2.1.0":
   version: 2.1.0
   resolution: "mimic-fn@npm:2.1.0"
@@ -12867,6 +15336,31 @@ __metadata:
   languageName: node
   linkType: hard
 
+"miniflare@npm:4.20260507.1":
+  version: 4.20260507.1
+  resolution: "miniflare@npm:4.20260507.1"
+  dependencies:
+    "@cspotcode/source-map-support": 0.8.1
+    sharp: ^0.34.5
+    undici: 7.24.8
+    workerd: 1.20260507.1
+    ws: 8.18.0
+    youch: 4.1.0-beta.10
+  bin:
+    miniflare: bootstrap.js
+  checksum: b74b74a5ddd6b5bb2fda190029cd07fcf1bace3085f34a60af7f4408e0d31736a042008fd7059c9831e49bf3249b02b28d60683b3ce39c921c00fe76ccc59056
+  languageName: node
+  linkType: hard
+
+"minimatch@npm:^10.1.1":
+  version: 10.2.5
+  resolution: "minimatch@npm:10.2.5"
+  dependencies:
+    brace-expansion: ^5.0.5
+  checksum: 6bb058bd6324104b9ec2f763476a35386d05079c1f5fe4fbf1f324a25237cd4534d6813ecd71f48208f4e635c1221899bef94c3c89f7df55698fe373aaae20fd
+  languageName: node
+  linkType: hard
+
 "minimatch@npm:^3.1.2":
   version: 3.1.2
   resolution: "minimatch@npm:3.1.2"
@@ -12876,6 +15370,15 @@ __metadata:
   languageName: node
   linkType: hard
 
+"minimatch@npm:^8.0.2":
+  version: 8.0.7
+  resolution: "minimatch@npm:8.0.7"
+  dependencies:
+    brace-expansion: ^2.0.1
+  checksum: 46d9dee24174f8a9eadec97ba36cba2e63f1fff8b36324e1825229bd9307ffee7ffd2f5a2749b29ba796eda877cd9c1687f9d1b399a10b290346561f2a8145f8
+  languageName: node
+  linkType: hard
+
 "minimatch@npm:^9.0.1":
   version: 9.0.3
   resolution: "minimatch@npm:9.0.3"
@@ -12961,6 +15464,13 @@ __metadata:
   languageName: node
   linkType: hard
 
+"minipass@npm:^4.2.4":
+  version: 4.2.8
+  resolution: "minipass@npm:4.2.8"
+  checksum: 4ea76b030d97079f4429d6e8a8affd90baf1b6a1898977c8ccce4701c5a2ba2792e033abc6709373f25c2c4d4d95440d9d5e9464b46b7b76ca44d2ce26d939ce
+  languageName: node
+  linkType: hard
+
 "minipass@npm:^5.0.0":
   version: 5.0.0
   resolution: "minipass@npm:5.0.0"
@@ -12975,6 +15485,13 @@ __metadata:
   languageName: node
   linkType: hard
 
+"minipass@npm:^7.1.2":
+  version: 7.1.3
+  resolution: "minipass@npm:7.1.3"
+  checksum: 539da88daca16533211ea5a9ee98dc62ff5742f531f54640dd34429e621955e91cc280a91a776026264b7f9f6735947629f920944e9c1558369e8bf22eb33fbb
+  languageName: node
+  linkType: hard
+
 "minisearch@npm:^7.1.1":
   version: 7.1.1
   resolution: "minisearch@npm:7.1.1"
@@ -12999,7 +15516,7 @@ __metadata:
   languageName: node
   linkType: hard
 
-"mkdirp@npm:^1.0.3":
+"mkdirp@npm:1.0.4, mkdirp@npm:^1.0.3":
   version: 1.0.4
   resolution: "mkdirp@npm:1.0.4"
   bin:
@@ -13008,6 +15525,15 @@ __metadata:
   languageName: node
   linkType: hard
 
+"mnemonist@npm:0.38.3":
+  version: 0.38.3
+  resolution: "mnemonist@npm:0.38.3"
+  dependencies:
+    obliterator: ^1.6.1
+  checksum: 064aa1ee1a89fce2754423b3617c598fd65bc34311eb3c01dc063976f6b819b073bd23532415cf8c92240157b4c8fbb7ec5d79d717f2bd4fcd95d8131cb23acb
+  languageName: node
+  linkType: hard
+
 "motion-dom@npm:^12.29.2":
   version: 12.29.2
   resolution: "motion-dom@npm:12.29.2"
@@ -13066,7 +15592,7 @@ __metadata:
   languageName: node
   linkType: hard
 
-"ms@npm:^2.1.1, ms@npm:^2.1.3":
+"ms@npm:^2.0.0, ms@npm:^2.1.1, ms@npm:^2.1.3":
   version: 2.1.3
   resolution: "ms@npm:2.1.3"
   checksum: d924b57e7312b3b63ad21fc5b3dc0af5e78d61a1fc7cfb5457edaf26326bf62be5307cc87ffb6862ef1c2b33b0233cdb5d4f01c4c958cc0d660948b65a287a48
@@ -13123,6 +15649,13 @@ __metadata:
   languageName: node
   linkType: hard
 
+"negotiator@npm:^1.0.0":
+  version: 1.0.0
+  resolution: "negotiator@npm:1.0.0"
+  checksum: 4c559dd52669ea48e1914f9d634227c561221dd54734070791f999c52ed0ff36e437b2e07d5c1f6e32909fc625fe46491c16e4a8f0572567d4dd15c3a4fda04b
+  languageName: node
+  linkType: hard
+
 "nested-error-stacks@npm:^2.1.1":
   version: 2.1.1
   resolution: "nested-error-stacks@npm:2.1.1"
@@ -13234,6 +15767,72 @@ __metadata:
   languageName: node
   linkType: hard
 
+"next@npm:15.5.18":
+  version: 15.5.18
+  resolution: "next@npm:15.5.18"
+  dependencies:
+    "@next/env": 15.5.18
+    "@next/swc-darwin-arm64": 15.5.18
+    "@next/swc-darwin-x64": 15.5.18
+    "@next/swc-linux-arm64-gnu": 15.5.18
+    "@next/swc-linux-arm64-musl": 15.5.18
+    "@next/swc-linux-x64-gnu": 15.5.18
+    "@next/swc-linux-x64-musl": 15.5.18
+    "@next/swc-win32-arm64-msvc": 15.5.18
+    "@next/swc-win32-x64-msvc": 15.5.18
+    "@swc/helpers": 0.5.15
+    caniuse-lite: ^1.0.30001579
+    postcss: 8.4.31
+    sharp: ^0.34.3
+    styled-jsx: 5.1.6
+  peerDependencies:
+    "@opentelemetry/api": ^1.1.0
+    "@playwright/test": ^1.51.1
+    babel-plugin-react-compiler: "*"
+    react: ^18.2.0 || 19.0.0-rc-de68d2f4-20241204 || ^19.0.0
+    react-dom: ^18.2.0 || 19.0.0-rc-de68d2f4-20241204 || ^19.0.0
+    sass: ^1.3.0
+  dependenciesMeta:
+    "@next/swc-darwin-arm64":
+      optional: true
+    "@next/swc-darwin-x64":
+      optional: true
+    "@next/swc-linux-arm64-gnu":
+      optional: true
+    "@next/swc-linux-arm64-musl":
+      optional: true
+    "@next/swc-linux-x64-gnu":
+      optional: true
+    "@next/swc-linux-x64-musl":
+      optional: true
+    "@next/swc-win32-arm64-msvc":
+      optional: true
+    "@next/swc-win32-x64-msvc":
+      optional: true
+    sharp:
+      optional: true
+  peerDependenciesMeta:
+    "@opentelemetry/api":
+      optional: true
+    "@playwright/test":
+      optional: true
+    babel-plugin-react-compiler:
+      optional: true
+    sass:
+      optional: true
+  bin:
+    next: dist/bin/next
+  checksum: 94c3be1ee04240913ab9d46e70fde3b26a73cedf6c76e946cfd2580d7ddd494b7da66260fe3a9a2be187652f5a10b1d9a6a555f10744d350be7f6ae05157d893
+  languageName: node
+  linkType: hard
+
+"node-domexception@npm:1.0.0":
+  version: 1.0.0
+  resolution: "node-domexception@npm:1.0.0"
+  checksum: 5e5d63cda29856402df9472335af4bb13875e1927ad3be861dc5ebde38917aecbf9ae337923777af52a48c426b70148815e890a5d72760f1b4d758cc671b1a2b
+  languageName: node
+  linkType: hard
+
 "node-fetch@npm:^2.6.7":
   version: 2.7.0
   resolution: "node-fetch@npm:2.7.0"
@@ -13409,6 +16008,13 @@ __metadata:
   languageName: node
   linkType: hard
 
+"object-treeify@npm:1.1.33":
+  version: 1.1.33
+  resolution: "object-treeify@npm:1.1.33"
+  checksum: 5b735ac552200bf14f9892ce58295303e8d15a8cc7a0fd4fe6ff99923ab0c196fb70a870ab2a0eefc6820c4acb49e614b88c72d344b9c6bd22584a3efbd386fe
+  languageName: node
+  linkType: hard
+
 "object.assign@npm:^4.1.4, object.assign@npm:^4.1.5":
   version: 4.1.5
   resolution: "object.assign@npm:4.1.5"
@@ -13515,6 +16121,31 @@ __metadata:
   languageName: node
   linkType: hard
 
+"obliterator@npm:^1.6.1":
+  version: 1.6.1
+  resolution: "obliterator@npm:1.6.1"
+  checksum: 5fad57319aae0ef6e34efa640541d41c2dd9790a7ab808f17dcb66c83a81333963fc2dfcfa6e1b62158e5cef6291cdcf15c503ad6c3de54b2227dd4c3d7e1b55
+  languageName: node
+  linkType: hard
+
+"on-finished@npm:^2.4.1":
+  version: 2.4.1
+  resolution: "on-finished@npm:2.4.1"
+  dependencies:
+    ee-first: 1.1.1
+  checksum: 46fb11b9063782f2d9968863d9cbba33d77aa13c17f895f56129c274318b86500b22af3a160fe9995aa41317efcd22941b6eba747f718ced08d9a73afdb087b4
+  languageName: node
+  linkType: hard
+
+"once@npm:^1.4.0":
+  version: 1.4.0
+  resolution: "once@npm:1.4.0"
+  dependencies:
+    wrappy: 1
+  checksum: 5d48aca287dfefabd756621c5dfce5c91a549a93e9fdb7b8246bc4c4790aa2ec17b34a260530474635147aeb631a2dcc8b32c613df0675f96041cbb8244517d0
+  languageName: node
+  linkType: hard
+
 "onetime@npm:^5.1.2":
   version: 5.1.2
   resolution: "onetime@npm:5.1.2"
@@ -13643,6 +16274,13 @@ __metadata:
   languageName: node
   linkType: hard
 
+"package-json-from-dist@npm:^1.0.0":
+  version: 1.0.1
+  resolution: "package-json-from-dist@npm:1.0.1"
+  checksum: 62ba2785eb655fec084a257af34dbe24292ab74516d6aecef97ef72d4897310bc6898f6c85b5cd22770eaa1ce60d55a0230e150fb6a966e3ecd6c511e23d164b
+  languageName: node
+  linkType: hard
+
 "parent-module@npm:^1.0.0":
   version: 1.0.1
   resolution: "parent-module@npm:1.0.1"
@@ -13709,6 +16347,13 @@ __metadata:
   languageName: node
   linkType: hard
 
+"parseurl@npm:^1.3.3":
+  version: 1.3.3
+  resolution: "parseurl@npm:1.3.3"
+  checksum: 90dd4760d6f6174adb9f20cf0965ae12e23879b5f5464f38e92fce8073354341e4b3b76fa3d878351efe7d01e617121955284cfd002ab087fba1a0726ec0b4f5
+  languageName: node
+  linkType: hard
+
 "path-exists@npm:^4.0.0":
   version: 4.0.0
   resolution: "path-exists@npm:4.0.0"
@@ -13716,6 +16361,13 @@ __metadata:
   languageName: node
   linkType: hard
 
+"path-expression-matcher@npm:^1.5.0":
+  version: 1.5.0
+  resolution: "path-expression-matcher@npm:1.5.0"
+  checksum: 646cb5bc66cd7d809a52288336f3ac1e6223f156fd8e912936e490e590f7f93e8056d4fd25fcbcc7da61bb698fa520112cb050372a3f65e7b79bd4afa0f77610
+  languageName: node
+  linkType: hard
+
 "path-key@npm:^3.0.0, path-key@npm:^3.1.0":
   version: 3.1.1
   resolution: "path-key@npm:3.1.1"
@@ -13740,6 +16392,40 @@ __metadata:
   languageName: node
   linkType: hard
 
+"path-scurry@npm:^1.6.1":
+  version: 1.11.1
+  resolution: "path-scurry@npm:1.11.1"
+  dependencies:
+    lru-cache: ^10.2.0
+    minipass: ^5.0.0 || ^6.0.2 || ^7.0.0
+  checksum: 32a13711a2a505616ae1cc1b5076801e453e7aae6ac40ab55b388bb91b9d0547a52f5aaceff710ea400205f18691120d4431e520afbe4266b836fadede15872d
+  languageName: node
+  linkType: hard
+
+"path-scurry@npm:^2.0.0":
+  version: 2.0.2
+  resolution: "path-scurry@npm:2.0.2"
+  dependencies:
+    lru-cache: ^11.0.0
+    minipass: ^7.1.2
+  checksum: b35ad37cf6557a87fd057121ce2be7695380c9138d93e87ae928609da259ea0a170fac6f3ef1eb3ece8a068e8b7f2f3adf5bb2374cf4d4a57fe484954fcc9482
+  languageName: node
+  linkType: hard
+
+"path-to-regexp@npm:6.3.0, path-to-regexp@npm:^6.3.0":
+  version: 6.3.0
+  resolution: "path-to-regexp@npm:6.3.0"
+  checksum: 73b67f4638b41cde56254e6354e46ae3a2ebc08279583f6af3d96fe4664fc75788f74ed0d18ca44fa4a98491b69434f9eee73b97bb5314bd1b5adb700f5c18d6
+  languageName: node
+  linkType: hard
+
+"path-to-regexp@npm:^8.0.0":
+  version: 8.4.2
+  resolution: "path-to-regexp@npm:8.4.2"
+  checksum: 05b115c49b47ad252ce05faa32930f643f23769c68b8bcfe78ad833545140c48bbffb3266986d6c8d5db13a64cf12e07e0d72d9882cab830efeefa553533ebaf
+  languageName: node
+  linkType: hard
+
 "path-type@npm:^4.0.0":
   version: 4.0.0
   resolution: "path-type@npm:4.0.0"
@@ -13754,6 +16440,13 @@ __metadata:
   languageName: node
   linkType: hard
 
+"pathe@npm:^2.0.3":
+  version: 2.0.3
+  resolution: "pathe@npm:2.0.3"
+  checksum: c118dc5a8b5c4166011b2b70608762e260085180bb9e33e80a50dcdb1e78c010b1624f4280c492c92b05fc276715a4c357d1f9edc570f8f1b3d90b6839ebaca1
+  languageName: node
+  linkType: hard
+
 "pathval@npm:^2.0.0":
   version: 2.0.1
   resolution: "pathval@npm:2.0.1"
@@ -13793,6 +16486,13 @@ __metadata:
   languageName: node
   linkType: hard
 
+"picomatch@npm:^4.0.2":
+  version: 4.0.4
+  resolution: "picomatch@npm:4.0.4"
+  checksum: e2c6023372cc7b5764719a5ffb9da0f8e781212fa7ca4bd0562db929df8e117460f00dff3cb7509dacfc06b86de924b247f504d0ce1806a37fac4633081466b0
+  languageName: node
+  linkType: hard
+
 "pify@npm:^2.3.0":
   version: 2.3.0
   resolution: "pify@npm:2.3.0"
@@ -13854,24 +16554,6 @@ __metadata:
   languageName: node
   linkType: hard
 
-"postcss-load-config@npm:^3.0.1":
-  version: 3.1.4
-  resolution: "postcss-load-config@npm:3.1.4"
-  dependencies:
-    lilconfig: ^2.0.5
-    yaml: ^1.10.2
-  peerDependencies:
-    postcss: ">=8.0.9"
-    ts-node: ">=9.0.0"
-  peerDependenciesMeta:
-    postcss:
-      optional: true
-    ts-node:
-      optional: true
-  checksum: 7d2cc6695c2fc063e4538316d651a687fdb55e48db453ff699de916a6ee55ab68eac2b120c28a6b8ca7aa746a588888351b810a215b5cd090eabea62c5762ede
-  languageName: node
-  linkType: hard
-
 "postcss-load-config@npm:^4.0.1":
   version: 4.0.2
   resolution: "postcss-load-config@npm:4.0.2"
@@ -14105,6 +16787,16 @@ __metadata:
   languageName: node
   linkType: hard
 
+"proxy-addr@npm:^2.0.7":
+  version: 2.0.7
+  resolution: "proxy-addr@npm:2.0.7"
+  dependencies:
+    forwarded: 0.2.0
+    ipaddr.js: 1.9.1
+  checksum: c3eed999781a35f7fd935f398b6d8920b6fb00bbc14287bc6de78128ccc1a02c89b95b56742bf7cf0362cc333c61d138532049c7dedc7a328ef13343eff81210
+  languageName: node
+  linkType: hard
+
 "punycode@npm:^2.1.0, punycode@npm:^2.3.1":
   version: 2.3.1
   resolution: "punycode@npm:2.3.1"
@@ -14112,6 +16804,15 @@ __metadata:
   languageName: node
   linkType: hard
 
+"qs@npm:^6.14.0, qs@npm:^6.14.1":
+  version: 6.15.1
+  resolution: "qs@npm:6.15.1"
+  dependencies:
+    side-channel: ^1.1.0
+  checksum: 19ee504f0ebff72598503e38cd6d9bd7b52a8ab62ae18b1e6bee3d4db58469bd65871ef1893a881bafb0f80ef2f9ab586e1f255cf25cc8d816c0f5a704721d97
+  languageName: node
+  linkType: hard
+
 "qs@npm:^6.5.1 < 6.10":
   version: 6.9.7
   resolution: "qs@npm:6.9.7"
@@ -14201,6 +16902,25 @@ __metadata:
   languageName: node
   linkType: hard
 
+"range-parser@npm:^1.2.1":
+  version: 1.2.1
+  resolution: "range-parser@npm:1.2.1"
+  checksum: 96c032ac2475c8027b7a4e9fe22dc0dfe0f6d90b85e496e0f016fbdb99d6d066de0112e680805075bd989905e2123b3b3d002765149294dce0c1f7f01fcc2ea0
+  languageName: node
+  linkType: hard
+
+"raw-body@npm:^3.0.1":
+  version: 3.0.2
+  resolution: "raw-body@npm:3.0.2"
+  dependencies:
+    bytes: ~3.1.2
+    http-errors: ~2.0.1
+    iconv-lite: ~0.7.0
+    unpipe: ~1.0.0
+  checksum: d266678d08e1e7abea62c0ce5864344e980fa81c64f6b481e9842c5beaed2cdcf975f658a3ccd67ad35fc919c1f6664ccc106067801850286a6cbe101de89f29
+  languageName: node
+  linkType: hard
+
 "react-aria@npm:^3.33.1":
   version: 3.35.1
   resolution: "react-aria@npm:3.35.1"
@@ -14867,13 +17587,6 @@ __metadata:
   languageName: node
   linkType: hard
 
-"resolve-from@npm:^5.0.0":
-  version: 5.0.0
-  resolution: "resolve-from@npm:5.0.0"
-  checksum: b21cb7f1fb746de8107b9febab60095187781137fd803e6a59a76d421444b1531b641bba5857f5dc011974d8a5c635d61cec49e6bd3b7fc20e01f0fafc4efbf2
-  languageName: node
-  linkType: hard
-
 "resolve-pkg-maps@npm:^1.0.0":
   version: 1.0.0
   resolution: "resolve-pkg-maps@npm:1.0.0"
@@ -14937,11 +17650,13 @@ __metadata:
   version: 0.0.0-use.local
   resolution: "resources@workspace:apps/resources"
   dependencies:
+    "@aws-sdk/client-s3": ^3
     "@mdx-js/loader": ^3.1.0
     "@mdx-js/react": ^3.1.0
     "@medusajs/icons": 2.15.1
-    "@next/bundle-analyzer": 15.3.9
-    "@next/mdx": 15.3.9
+    "@next/bundle-analyzer": 15.5.18
+    "@next/mdx": 15.5.18
+    "@opennextjs/cloudflare": ^1.19.9
     "@stefanprobst/rehype-extract-toc": ^3.0.0
     "@types/mdx": ^2.0.13
     "@types/node": ^20
@@ -14955,7 +17670,8 @@ __metadata:
     eslint: ^9.13.0
     eslint-plugin-prettier: ^5.2.1
     eslint-plugin-react-hooks: ^5.0.0
-    next: 15.3.9
+    mime-types: ^3
+    next: 15.5.18
     next-mdx-remote-client: 2
     postcss: ^8
     posthog-js: ^1.298.1
@@ -14974,6 +17690,7 @@ __metadata:
     tsconfig: "*"
     types: "*"
     typescript: ^5
+    wrangler: ^4.90.0
   languageName: unknown
   linkType: soft
 
@@ -15009,20 +17726,6 @@ __metadata:
   languageName: node
   linkType: hard
 
-"rollup@npm:^2.74.1":
-  version: 2.79.1
-  resolution: "rollup@npm:2.79.1"
-  dependencies:
-    fsevents: ~2.3.2
-  dependenciesMeta:
-    fsevents:
-      optional: true
-  bin:
-    rollup: dist/bin/rollup
-  checksum: 421418687f5dcd7324f4387f203c6bfc7118b7ace789e30f5da022471c43e037a76f5fd93837052754eeeae798a4fb266ac05ccee1e594406d912a59af98dde9
-  languageName: node
-  linkType: hard
-
 "rollup@npm:^4.20.0":
   version: 4.54.0
   resolution: "rollup@npm:4.54.0"
@@ -15104,6 +17807,19 @@ __metadata:
   languageName: node
   linkType: hard
 
+"router@npm:^2.2.0":
+  version: 2.2.0
+  resolution: "router@npm:2.2.0"
+  dependencies:
+    debug: ^4.4.0
+    depd: ^2.0.0
+    is-promise: ^4.0.0
+    parseurl: ^1.3.3
+    path-to-regexp: ^8.0.0
+  checksum: 3279de7450c8eae2f6e095e9edacbdeec0abb5cb7249c6e719faa0db2dba43574b4fff5892d9220631c9abaff52dd3cad648cfea2aaace845e1a071915ac8867
+  languageName: node
+  linkType: hard
+
 "rrweb-cssom@npm:^0.7.1":
   version: 0.7.1
   resolution: "rrweb-cssom@npm:0.7.1"
@@ -15303,6 +18019,34 @@ __metadata:
   languageName: node
   linkType: hard
 
+"semver@npm:^7.7.3":
+  version: 7.8.0
+  resolution: "semver@npm:7.8.0"
+  bin:
+    semver: bin/semver.js
+  checksum: 8f096ca9b80ffd47b308d03f9ce8c873e27e2983f36023c559cdc92c51e8433fc23ebbfe57ec9623fc155636a6961ee989501099841ae4bb1babc8d2b3f048cd
+  languageName: node
+  linkType: hard
+
+"send@npm:^1.1.0, send@npm:^1.2.0":
+  version: 1.2.1
+  resolution: "send@npm:1.2.1"
+  dependencies:
+    debug: ^4.4.3
+    encodeurl: ^2.0.0
+    escape-html: ^1.0.3
+    etag: ^1.8.1
+    fresh: ^2.0.0
+    http-errors: ^2.0.1
+    mime-types: ^3.0.2
+    ms: ^2.1.3
+    on-finished: ^2.4.1
+    range-parser: ^1.2.1
+    statuses: ^2.0.2
+  checksum: fbbbbdc902a913d65605274be23f3d604065cfc3ee3d78bf9fc8af1dc9fc82667c50d3d657f5e601ac657bac9b396b50ee97bd29cd55436320cf1cddebdcec72
+  languageName: node
+  linkType: hard
+
 "serialize-error@npm:^12.0.0":
   version: 12.0.0
   resolution: "serialize-error@npm:12.0.0"
@@ -15312,6 +18056,18 @@ __metadata:
   languageName: node
   linkType: hard
 
+"serve-static@npm:^2.2.0":
+  version: 2.2.1
+  resolution: "serve-static@npm:2.2.1"
+  dependencies:
+    encodeurl: ^2.0.0
+    escape-html: ^1.0.3
+    parseurl: ^1.3.3
+    send: ^1.2.0
+  checksum: 37986096e8572e2dfaad35a3925fa8da0c0969f8814fd7788e84d4d388bc068cf0c06d1658509788e55bed942a6b6d040a8a267fa92bb9ffb1179f8bacde5fd7
+  languageName: node
+  linkType: hard
+
 "set-function-length@npm:^1.2.1":
   version: 1.2.1
   resolution: "set-function-length@npm:1.2.1"
@@ -15363,6 +18119,13 @@ __metadata:
   languageName: node
   linkType: hard
 
+"setprototypeof@npm:~1.2.0":
+  version: 1.2.0
+  resolution: "setprototypeof@npm:1.2.0"
+  checksum: 68733173026766fa0d9ecaeb07f0483f4c2dc70ca376b3b7c40b7cda909f94b0918f6c5ad5ce27a9160bdfb475efaa9d5e705a11d8eaae18f9835d20976028bc
+  languageName: node
+  linkType: hard
+
 "sharp@npm:^0.34.1":
   version: 0.34.1
   resolution: "sharp@npm:0.34.1"
@@ -15435,6 +18198,90 @@ __metadata:
   languageName: node
   linkType: hard
 
+"sharp@npm:^0.34.3, sharp@npm:^0.34.5":
+  version: 0.34.5
+  resolution: "sharp@npm:0.34.5"
+  dependencies:
+    "@img/colour": ^1.0.0
+    "@img/sharp-darwin-arm64": 0.34.5
+    "@img/sharp-darwin-x64": 0.34.5
+    "@img/sharp-libvips-darwin-arm64": 1.2.4
+    "@img/sharp-libvips-darwin-x64": 1.2.4
+    "@img/sharp-libvips-linux-arm": 1.2.4
+    "@img/sharp-libvips-linux-arm64": 1.2.4
+    "@img/sharp-libvips-linux-ppc64": 1.2.4
+    "@img/sharp-libvips-linux-riscv64": 1.2.4
+    "@img/sharp-libvips-linux-s390x": 1.2.4
+    "@img/sharp-libvips-linux-x64": 1.2.4
+    "@img/sharp-libvips-linuxmusl-arm64": 1.2.4
+    "@img/sharp-libvips-linuxmusl-x64": 1.2.4
+    "@img/sharp-linux-arm": 0.34.5
+    "@img/sharp-linux-arm64": 0.34.5
+    "@img/sharp-linux-ppc64": 0.34.5
+    "@img/sharp-linux-riscv64": 0.34.5
+    "@img/sharp-linux-s390x": 0.34.5
+    "@img/sharp-linux-x64": 0.34.5
+    "@img/sharp-linuxmusl-arm64": 0.34.5
+    "@img/sharp-linuxmusl-x64": 0.34.5
+    "@img/sharp-wasm32": 0.34.5
+    "@img/sharp-win32-arm64": 0.34.5
+    "@img/sharp-win32-ia32": 0.34.5
+    "@img/sharp-win32-x64": 0.34.5
+    detect-libc: ^2.1.2
+    semver: ^7.7.3
+  dependenciesMeta:
+    "@img/sharp-darwin-arm64":
+      optional: true
+    "@img/sharp-darwin-x64":
+      optional: true
+    "@img/sharp-libvips-darwin-arm64":
+      optional: true
+    "@img/sharp-libvips-darwin-x64":
+      optional: true
+    "@img/sharp-libvips-linux-arm":
+      optional: true
+    "@img/sharp-libvips-linux-arm64":
+      optional: true
+    "@img/sharp-libvips-linux-ppc64":
+      optional: true
+    "@img/sharp-libvips-linux-riscv64":
+      optional: true
+    "@img/sharp-libvips-linux-s390x":
+      optional: true
+    "@img/sharp-libvips-linux-x64":
+      optional: true
+    "@img/sharp-libvips-linuxmusl-arm64":
+      optional: true
+    "@img/sharp-libvips-linuxmusl-x64":
+      optional: true
+    "@img/sharp-linux-arm":
+      optional: true
+    "@img/sharp-linux-arm64":
+      optional: true
+    "@img/sharp-linux-ppc64":
+      optional: true
+    "@img/sharp-linux-riscv64":
+      optional: true
+    "@img/sharp-linux-s390x":
+      optional: true
+    "@img/sharp-linux-x64":
+      optional: true
+    "@img/sharp-linuxmusl-arm64":
+      optional: true
+    "@img/sharp-linuxmusl-x64":
+      optional: true
+    "@img/sharp-wasm32":
+      optional: true
+    "@img/sharp-win32-arm64":
+      optional: true
+    "@img/sharp-win32-ia32":
+      optional: true
+    "@img/sharp-win32-x64":
+      optional: true
+  checksum: fd79e29df0597a7d5704b8461c51f944ead91a5243691697be6e8243b966402beda53ddc6f0a53b96ea3cb8221f0b244aa588114d3ebf8734fb4aefd41ab802f
+  languageName: node
+  linkType: hard
+
 "shebang-command@npm:^2.0.0":
   version: 2.0.0
   resolution: "shebang-command@npm:2.0.0"
@@ -15637,12 +18484,20 @@ __metadata:
   languageName: node
   linkType: hard
 
-"source-map@npm:0.8.0-beta.0":
-  version: 0.8.0-beta.0
-  resolution: "source-map@npm:0.8.0-beta.0"
+"source-map-support@npm:~0.5.20":
+  version: 0.5.21
+  resolution: "source-map-support@npm:0.5.21"
   dependencies:
-    whatwg-url: ^7.0.0
-  checksum: fb4d9bde9a9fdb2c29b10e5eae6c71d10e09ef467e1afb75fdec2eb7e11fa5b343a2af553f74f18b695dbc0b81f9da2e9fa3d7a317d5985e9939499ec6087835
+    buffer-from: ^1.0.0
+    source-map: ^0.6.0
+  checksum: 9ee09942f415e0f721d6daad3917ec1516af746a8120bba7bb56278707a37f1eb8642bde456e98454b8a885023af81a16e646869975f06afc1a711fb90484e7d
+  languageName: node
+  linkType: hard
+
+"source-map@npm:^0.6.0":
+  version: 0.6.1
+  resolution: "source-map@npm:0.6.1"
+  checksum: ab55398007c5e5532957cb0beee2368529618ac0ab372d789806f5718123cc4367d57de3904b4e6a4170eb5a0b0f41373066d02ca0735a0c4d75c7d328d3e011
   languageName: node
   linkType: hard
 
@@ -15683,6 +18538,13 @@ __metadata:
   languageName: node
   linkType: hard
 
+"statuses@npm:^2.0.1, statuses@npm:^2.0.2, statuses@npm:~2.0.2":
+  version: 2.0.2
+  resolution: "statuses@npm:2.0.2"
+  checksum: a9947d98ad60d01f6b26727570f3bcceb6c8fa789da64fe6889908fe2e294d57503b14bf2b5af7605c2d36647259e856635cd4c49eab41667658ec9d0080ec3f
+  languageName: node
+  linkType: hard
+
 "std-env@npm:^3.8.0":
   version: 3.10.0
   resolution: "std-env@npm:3.10.0"
@@ -15719,6 +18581,17 @@ __metadata:
   languageName: node
   linkType: hard
 
+"string-width@npm:^7.0.0, string-width@npm:^7.2.0":
+  version: 7.2.0
+  resolution: "string-width@npm:7.2.0"
+  dependencies:
+    emoji-regex: ^10.3.0
+    get-east-asian-width: ^1.0.0
+    strip-ansi: ^7.1.0
+  checksum: eb0430dd43f3199c7a46dcbf7a0b34539c76fe3aa62763d0b0655acdcbdf360b3f66f3d58ca25ba0205f42ea3491fa00f09426d3b7d3040e506878fc7664c9b9
+  languageName: node
+  linkType: hard
+
 "string.prototype.includes@npm:^2.0.1":
   version: 2.0.1
   resolution: "string.prototype.includes@npm:2.0.1"
@@ -15912,6 +18785,15 @@ __metadata:
   languageName: node
   linkType: hard
 
+"strip-ansi@npm:^7.1.0":
+  version: 7.2.0
+  resolution: "strip-ansi@npm:7.2.0"
+  dependencies:
+    ansi-regex: ^6.2.2
+  checksum: 544d13b7582f8254811ea97db202f519e189e59d35740c46095897e254e4f1aa9fe1524a83ad6bc5ad67d4dd6c0281d2e0219ed62b880a6238a16a17d375f221
+  languageName: node
+  linkType: hard
+
 "strip-bom@npm:^3.0.0":
   version: 3.0.0
   resolution: "strip-bom@npm:3.0.0"
@@ -15951,6 +18833,13 @@ __metadata:
   languageName: node
   linkType: hard
 
+"strnum@npm:^2.2.3":
+  version: 2.3.0
+  resolution: "strnum@npm:2.3.0"
+  checksum: 8d29ea0789df22dfa6101153573c76ce12fb065ed0807eb99cc64624cd7f3d67a5aa0db507e75ab985ca23908cc4f02c65f3359ad762cb3659e3d6456e76e143
+  languageName: node
+  linkType: hard
+
 "style-to-js@npm:^1.0.0":
   version: 1.1.16
   resolution: "style-to-js@npm:1.1.16"
@@ -16010,7 +18899,7 @@ __metadata:
   languageName: node
   linkType: hard
 
-"sucrase@npm:^3.20.3, sucrase@npm:^3.32.0":
+"sucrase@npm:^3.32.0":
   version: 3.35.0
   resolution: "sucrase@npm:3.35.0"
   dependencies:
@@ -16028,6 +18917,13 @@ __metadata:
   languageName: node
   linkType: hard
 
+"supports-color@npm:^10.0.0":
+  version: 10.2.2
+  resolution: "supports-color@npm:10.2.2"
+  checksum: fb28dd7e0cdf80afb3f2a41df5e068d60c8b4f97f7140de2eaed5b42e075d82a0e980b20a2c0efd2b6d73cfacb55555285d8cc719fa0472220715aefeaa1da7c
+  languageName: node
+  linkType: hard
+
 "supports-color@npm:^5.3.0":
   version: 5.5.0
   resolution: "supports-color@npm:5.5.0"
@@ -16224,6 +19120,20 @@ __metadata:
   languageName: node
   linkType: hard
 
+"terser@npm:5.16.9":
+  version: 5.16.9
+  resolution: "terser@npm:5.16.9"
+  dependencies:
+    "@jridgewell/source-map": ^0.3.2
+    acorn: ^8.5.0
+    commander: ^2.20.0
+    source-map-support: ~0.5.20
+  bin:
+    terser: bin/terser
+  checksum: eb883b606aa698e314957aa2cf6e70c1dc632d0d2dcda13e7a2cc73569a05034721826c0d6f9b31c6bb08bbc4fc633b6591871814dada71da9d34af9e284dc4f
+  languageName: node
+  linkType: hard
+
 "text-table@npm:^0.2.0":
   version: 0.2.0
   resolution: "text-table@npm:0.2.0"
@@ -16386,6 +19296,13 @@ __metadata:
   languageName: node
   linkType: hard
 
+"toidentifier@npm:~1.0.1":
+  version: 1.0.1
+  resolution: "toidentifier@npm:1.0.1"
+  checksum: 93937279934bd66cc3270016dd8d0afec14fb7c94a05c72dc57321f8bd1fa97e5bea6d1f7c89e728d077ca31ea125b78320a616a6c6cd0e6b9cb94cb864381c1
+  languageName: node
+  linkType: hard
+
 "totalist@npm:^3.0.0":
   version: 3.0.1
   resolution: "totalist@npm:3.0.1"
@@ -16411,15 +19328,6 @@ __metadata:
   languageName: node
   linkType: hard
 
-"tr46@npm:^1.0.1":
-  version: 1.0.1
-  resolution: "tr46@npm:1.0.1"
-  dependencies:
-    punycode: ^2.1.0
-  checksum: 41525c2ccce86e3ef30af6fa5e1464e6d8bb4286a58ea8db09228f598889581ef62347153f6636cd41553dc41685bdfad0a9d032ef58df9fbb0792b3447d0f04
-  languageName: node
-  linkType: hard
-
 "tr46@npm:^5.1.0":
   version: 5.1.1
   resolution: "tr46@npm:5.1.1"
@@ -16445,15 +19353,6 @@ __metadata:
   languageName: node
   linkType: hard
 
-"tree-kill@npm:^1.2.2":
-  version: 1.2.2
-  resolution: "tree-kill@npm:1.2.2"
-  bin:
-    tree-kill: cli.js
-  checksum: 7b1b7c7f17608a8f8d20a162e7957ac1ef6cd1636db1aba92f4e072dc31818c2ff0efac1e3d91064ede67ed5dc57c565420531a8134090a12ac10cf792ab14d2
-  languageName: node
-  linkType: hard
-
 "trim-lines@npm:^3.0.0":
   version: 3.0.1
   resolution: "trim-lines@npm:3.0.1"
@@ -16529,6 +19428,13 @@ __metadata:
   languageName: node
   linkType: hard
 
+"ts-tqdm@npm:^0.8.6":
+  version: 0.8.6
+  resolution: "ts-tqdm@npm:0.8.6"
+  checksum: f91574e4ee71a007987bcdbb21036c76499f2141c2190e0c1100bbc7e0908862935bb43762e7df2ab13e2838cba8bd371e5601aa5468098f3872dcea3fe54a0a
+  languageName: node
+  linkType: hard
+
 "tsc-alias@npm:^1.8.7":
   version: 1.8.8
   resolution: "tsc-alias@npm:1.8.8"
@@ -16598,42 +19504,6 @@ __metadata:
   languageName: node
   linkType: hard
 
-"tsup@npm:^5.10.1":
-  version: 5.12.9
-  resolution: "tsup@npm:5.12.9"
-  dependencies:
-    bundle-require: ^3.0.2
-    cac: ^6.7.12
-    chokidar: ^3.5.1
-    debug: ^4.3.1
-    esbuild: ^0.14.25
-    execa: ^5.0.0
-    globby: ^11.0.3
-    joycon: ^3.0.1
-    postcss-load-config: ^3.0.1
-    resolve-from: ^5.0.0
-    rollup: ^2.74.1
-    source-map: 0.8.0-beta.0
-    sucrase: ^3.20.3
-    tree-kill: ^1.2.2
-  peerDependencies:
-    "@swc/core": ^1
-    postcss: ^8.4.12
-    typescript: ^4.1.0
-  peerDependenciesMeta:
-    "@swc/core":
-      optional: true
-    postcss:
-      optional: true
-    typescript:
-      optional: true
-  bin:
-    tsup: dist/cli-default.js
-    tsup-node: dist/cli-node.js
-  checksum: f1ab754974001ef7cccd2cc1322f718e4b29902edae6ea629cad13d104596b9c7372e4d1140e32bed9a586a33cb121f1f399bd63d08195337053efe951949fdd
-  languageName: node
-  linkType: hard
-
 "tunnel-agent@npm:^0.6.0":
   version: 0.6.0
   resolution: "tunnel-agent@npm:0.6.0"
@@ -16739,6 +19609,17 @@ turbo@latest:
   languageName: node
   linkType: hard
 
+"type-is@npm:^2.0.1":
+  version: 2.0.1
+  resolution: "type-is@npm:2.0.1"
+  dependencies:
+    content-type: ^1.0.5
+    media-typer: ^1.1.0
+    mime-types: ^3.0.0
+  checksum: 7f7ec0a060b16880bdad36824ab37c26019454b67d73e8a465ed5a3587440fbe158bc765f0da68344498235c877e7dbbb1600beccc94628ed05599d667951b99
+  languageName: node
+  linkType: hard
+
 "typed-array-buffer@npm:^1.0.1, typed-array-buffer@npm:^1.0.2":
   version: 1.0.2
   resolution: "typed-array-buffer@npm:1.0.2"
@@ -16949,12 +19830,14 @@ turbo@latest:
   version: 0.0.0-use.local
   resolution: "ui@workspace:apps/ui"
   dependencies:
+    "@aws-sdk/client-s3": ^3
     "@mdx-js/loader": ^3.1.0
     "@mdx-js/react": ^3.1.0
     "@medusajs/icons": 2.15.1
     "@medusajs/ui": 4.1.11
     "@medusajs/ui-preset": 2.15.1
-    "@next/mdx": 15.3.9
+    "@next/mdx": 15.5.18
+    "@opennextjs/cloudflare": ^1.19.9
     "@stefanprobst/rehype-extract-toc": ^3.0.0
     "@types/mdx": ^2.0.13
     "@types/node": ^20
@@ -16967,7 +19850,8 @@ turbo@latest:
     eslint: ^9.13.0
     eslint-plugin-prettier: ^5.2.1
     eslint-plugin-react-hooks: ^5.0.0
-    next: 15.3.9
+    mime-types: ^3
+    next: 15.5.18
     postcss: ^8
     posthog-js: ^1.298.1
     posthog-node: ^5.29.0
@@ -16984,6 +19868,7 @@ turbo@latest:
     tsconfig: "*"
     types: "*"
     typescript: ^5
+    wrangler: ^4.90.0
   languageName: unknown
   linkType: soft
 
@@ -17018,6 +19903,22 @@ turbo@latest:
   languageName: node
   linkType: hard
 
+"undici@npm:7.24.8":
+  version: 7.24.8
+  resolution: "undici@npm:7.24.8"
+  checksum: 5b3cb18b1c6ccff564c37390547b2f137c666ada5083af6d5b5671dc12f73530ae2872e16fab1e3948b46013fed7c81ed10bce23f7dbf21b73794244b70b7eea
+  languageName: node
+  linkType: hard
+
+"unenv@npm:2.0.0-rc.24":
+  version: 2.0.0-rc.24
+  resolution: "unenv@npm:2.0.0-rc.24"
+  dependencies:
+    pathe: ^2.0.3
+  checksum: e8556b4287fcf647f23db790eea2782cc79f182370718680e3aba4753d5fb7177abf5d6df489c8f74f7e3ad6cd554b8623cc01caf3e6f2d5548e69178adb1691
+  languageName: node
+  linkType: hard
+
 "unfetch@npm:^3.1.1":
   version: 3.1.2
   resolution: "unfetch@npm:3.1.2"
@@ -17226,6 +20127,13 @@ turbo@latest:
   languageName: node
   linkType: hard
 
+"unpipe@npm:~1.0.0":
+  version: 1.0.0
+  resolution: "unpipe@npm:1.0.0"
+  checksum: 193400255bd48968e5c5383730344fbb4fa114cdedfab26e329e50dd2d81b134244bb8a72c6ac1b10ab0281a58b363d06405632c9d49ca9dfd5e90cbd7d0f32c
+  languageName: node
+  linkType: hard
+
 "update-browserslist-db@npm:^1.0.13":
   version: 1.0.13
   resolution: "update-browserslist-db@npm:1.0.13"
@@ -17263,6 +20171,13 @@ turbo@latest:
   languageName: node
   linkType: hard
 
+"urlpattern-polyfill@npm:^10.1.0":
+  version: 10.1.0
+  resolution: "urlpattern-polyfill@npm:10.1.0"
+  checksum: 5b124fd8d0ae920aa2a48b49a7a3b9ad1643b5ce7217b808fb6877826e751cabc01897fd4c85cd1989c4e729072b63aad5c3ba1c1325e4433e0d2f6329156bf1
+  languageName: node
+  linkType: hard
+
 "use-callback-ref@npm:^1.3.3":
   version: 1.3.3
   resolution: "use-callback-ref@npm:1.3.3"
@@ -17319,7 +20234,8 @@ turbo@latest:
     "@mdx-js/loader": ^3.1.0
     "@mdx-js/react": ^3.1.0
     "@medusajs/icons": 2.15.1
-    "@next/mdx": 15.3.9
+    "@next/mdx": 15.5.18
+    "@opennextjs/cloudflare": ^1.19.9
     "@stefanprobst/rehype-extract-toc": ^3.0.0
     "@types/mdx": ^2.0.13
     "@types/node": ^20
@@ -17332,7 +20248,7 @@ turbo@latest:
     eslint: ^9.13.0
     eslint-plugin-prettier: ^5.2.1
     eslint-plugin-react-hooks: ^5.0.0
-    next: 15.3.9
+    next: 15.5.18
     postcss: ^8
     posthog-js: ^1.298.1
     posthog-node: ^5.29.0
@@ -17348,6 +20264,7 @@ turbo@latest:
     tsconfig: "*"
     types: "*"
     typescript: ^5
+    wrangler: ^4.90.0
   languageName: unknown
   linkType: soft
 
@@ -17388,6 +20305,13 @@ turbo@latest:
   languageName: node
   linkType: hard
 
+"vary@npm:^1.1.2":
+  version: 1.1.2
+  resolution: "vary@npm:1.1.2"
+  checksum: f15d588d79f3675135ba783c91a4083dcd290a2a5be9fcb6514220a1634e23df116847b1cc51f66bfb0644cf9353b2abb7815ae499bab06e46dd33c1a6bf1f4f
+  languageName: node
+  linkType: hard
+
 "vfile-matter@npm:^5.0.0":
   version: 5.0.0
   resolution: "vfile-matter@npm:5.0.0"
@@ -17594,6 +20518,13 @@ turbo@latest:
   languageName: node
   linkType: hard
 
+"web-streams-polyfill@npm:4.0.0-beta.3":
+  version: 4.0.0-beta.3
+  resolution: "web-streams-polyfill@npm:4.0.0-beta.3"
+  checksum: a9596779db2766990117ed3a158e0b0e9f69b887a6d6ba0779940259e95f99dc3922e534acc3e5a117b5f5905300f527d6fbf8a9f0957faf1d8e585ce3452e8e
+  languageName: node
+  linkType: hard
+
 "web-vitals@npm:^4.2.4":
   version: 4.2.4
   resolution: "web-vitals@npm:4.2.4"
@@ -17615,13 +20546,6 @@ turbo@latest:
   languageName: node
   linkType: hard
 
-"webidl-conversions@npm:^4.0.2":
-  version: 4.0.2
-  resolution: "webidl-conversions@npm:4.0.2"
-  checksum: def5c5ac3479286dffcb604547628b2e6b46c5c5b8a8cfaa8c71dc3bafc85859bde5fbe89467ff861f571ab38987cf6ab3d6e7c80b39b999e50e803c12f3164f
-  languageName: node
-  linkType: hard
-
 "webidl-conversions@npm:^7.0.0":
   version: 7.0.0
   resolution: "webidl-conversions@npm:7.0.0"
@@ -17705,17 +20629,6 @@ turbo@latest:
   languageName: node
   linkType: hard
 
-"whatwg-url@npm:^7.0.0":
-  version: 7.1.0
-  resolution: "whatwg-url@npm:7.1.0"
-  dependencies:
-    lodash.sortby: ^4.7.0
-    tr46: ^1.0.1
-    webidl-conversions: ^4.0.2
-  checksum: 2785fe4647690e5a0225a79509ba5e21fdf4a71f9de3eabdba1192483fe006fc79961198e0b99f82751557309f17fc5a07d4d83c251aa5b2f85ba71e674cbee9
-  languageName: node
-  linkType: hard
-
 "which-boxed-primitive@npm:^1.0.2":
   version: 1.0.2
   resolution: "which-boxed-primitive@npm:1.0.2"
@@ -17882,6 +20795,60 @@ turbo@latest:
   languageName: node
   linkType: hard
 
+"workerd@npm:1.20260507.1":
+  version: 1.20260507.1
+  resolution: "workerd@npm:1.20260507.1"
+  dependencies:
+    "@cloudflare/workerd-darwin-64": 1.20260507.1
+    "@cloudflare/workerd-darwin-arm64": 1.20260507.1
+    "@cloudflare/workerd-linux-64": 1.20260507.1
+    "@cloudflare/workerd-linux-arm64": 1.20260507.1
+    "@cloudflare/workerd-windows-64": 1.20260507.1
+  dependenciesMeta:
+    "@cloudflare/workerd-darwin-64":
+      optional: true
+    "@cloudflare/workerd-darwin-arm64":
+      optional: true
+    "@cloudflare/workerd-linux-64":
+      optional: true
+    "@cloudflare/workerd-linux-arm64":
+      optional: true
+    "@cloudflare/workerd-windows-64":
+      optional: true
+  bin:
+    workerd: bin/workerd
+  checksum: 5b17cb73e4c4245abec64e5400d4101aaccbf50f7ae378f843ba0d56c214a891126291e35efa4ee99420f65571f16fe78b47276e0c72ab6871526d13d01bb382
+  languageName: node
+  linkType: hard
+
+"wrangler@npm:^4.90.0":
+  version: 4.90.0
+  resolution: "wrangler@npm:4.90.0"
+  dependencies:
+    "@cloudflare/kv-asset-handler": 0.5.0
+    "@cloudflare/unenv-preset": 2.16.1
+    blake3-wasm: 2.1.5
+    esbuild: 0.27.3
+    fsevents: ~2.3.2
+    miniflare: 4.20260507.1
+    path-to-regexp: 6.3.0
+    unenv: 2.0.0-rc.24
+    workerd: 1.20260507.1
+  peerDependencies:
+    "@cloudflare/workers-types": ^4.20260507.1
+  dependenciesMeta:
+    fsevents:
+      optional: true
+  peerDependenciesMeta:
+    "@cloudflare/workers-types":
+      optional: true
+  bin:
+    wrangler: bin/wrangler.js
+    wrangler2: bin/wrangler.js
+  checksum: c8bbab061fc51cdbd500b34aeb7a3a938984085edf7c8da0f0924ef4b7454c3e05937978c8f2a6bd426506f06dd7b09869be5735915d645f5320263f854766e3
+  languageName: node
+  linkType: hard
+
 "wrap-ansi-cjs@npm:wrap-ansi@^7.0.0":
   version: 7.0.0
   resolution: "wrap-ansi@npm:7.0.0"
@@ -17904,6 +20871,39 @@ turbo@latest:
   languageName: node
   linkType: hard
 
+"wrap-ansi@npm:^9.0.0":
+  version: 9.0.2
+  resolution: "wrap-ansi@npm:9.0.2"
+  dependencies:
+    ansi-styles: ^6.2.1
+    string-width: ^7.0.0
+    strip-ansi: ^7.1.0
+  checksum: 3305839b9a0d6fb930cb63a52f34d3936013d8b0682ff3ec133c9826512620f213800ffa19ea22904876d5b7e9a3c1f40682f03597d986a4ca881fa7b033688c
+  languageName: node
+  linkType: hard
+
+"wrappy@npm:1":
+  version: 1.0.2
+  resolution: "wrappy@npm:1.0.2"
+  checksum: 56fece1a4018c6a6c8e28fbc88c87e0fbf4ea8fd64fc6c63b18f4acc4bd13e0ad2515189786dd2c30d3eec9663d70f4ecf699330002f8ccb547e4a18231fc9f0
+  languageName: node
+  linkType: hard
+
+"ws@npm:8.18.0":
+  version: 8.18.0
+  resolution: "ws@npm:8.18.0"
+  peerDependencies:
+    bufferutil: ^4.0.1
+    utf-8-validate: ">=5.0.2"
+  peerDependenciesMeta:
+    bufferutil:
+      optional: true
+    utf-8-validate:
+      optional: true
+  checksum: 25eb33aff17edcb90721ed6b0eb250976328533ad3cd1a28a274bd263682e7296a6591ff1436d6cbc50fa67463158b062f9d1122013b361cec99a05f84680e06
+  languageName: node
+  linkType: hard
+
 "ws@npm:^7.3.1":
   version: 7.5.9
   resolution: "ws@npm:7.5.9"
@@ -17941,6 +20941,13 @@ turbo@latest:
   languageName: node
   linkType: hard
 
+"xml-naming@npm:^0.1.0":
+  version: 0.1.0
+  resolution: "xml-naming@npm:0.1.0"
+  checksum: 8c7614865361bcb7e53e3e091dac21c567e2b92d447919b2f072775aa9dcfc94a5255bd52fbaa0fd53c93513e53a23a6a835218ad2af512451dbc678392f85fe
+  languageName: node
+  linkType: hard
+
 "xmlchars@npm:^2.2.0":
   version: 2.2.0
   resolution: "xmlchars@npm:2.2.0"
@@ -17948,6 +20955,13 @@ turbo@latest:
   languageName: node
   linkType: hard
 
+"y18n@npm:^5.0.5":
+  version: 5.0.8
+  resolution: "y18n@npm:5.0.8"
+  checksum: 4df2842c36e468590c3691c894bc9cdbac41f520566e76e24f59401ba7d8b4811eb1e34524d57e54bc6d864bcb66baab7ffd9ca42bf1eda596618f9162b91249
+  languageName: node
+  linkType: hard
+
 "yallist@npm:^3.0.2":
   version: 3.1.1
   resolution: "yallist@npm:3.1.1"
@@ -17962,13 +20976,6 @@ turbo@latest:
   languageName: node
   linkType: hard
 
-"yaml@npm:^1.10.2":
-  version: 1.10.2
-  resolution: "yaml@npm:1.10.2"
-  checksum: 5c28b9eb7adc46544f28d9a8d20c5b3cb1215a886609a2fd41f51628d8aaa5878ccd628b755dbcd29f6bb4921bd04ffbc6dcc370689bb96e594e2f9813d2605f
-  languageName: node
-  linkType: hard
-
 "yaml@npm:^2.0.0, yaml@npm:^2.3.1, yaml@npm:^2.3.4":
   version: 2.4.0
   resolution: "yaml@npm:2.4.0"
@@ -17987,6 +20994,36 @@ turbo@latest:
   languageName: node
   linkType: hard
 
+"yaml@npm:^2.8.1":
+  version: 2.9.0
+  resolution: "yaml@npm:2.9.0"
+  bin:
+    yaml: bin.mjs
+  checksum: f340718df45e97a9551b9bf9dac61c80050bc464513b710debfb5067c380c8472e3b67809cffacb4ab5ffb5e66ef9310816c88b05f371cec60abfedd8c88e0a2
+  languageName: node
+  linkType: hard
+
+"yargs-parser@npm:^22.0.0":
+  version: 22.0.0
+  resolution: "yargs-parser@npm:22.0.0"
+  checksum: cb7ef81759c4271cb1d96b9351dbbc9a9ce35d3e1122d2b739bf6c432603824fa02c67cc12dcef6ea80283379d63495686e8f41cc7b06c6576e792aba4d33e1c
+  languageName: node
+  linkType: hard
+
+"yargs@npm:^18.0.0":
+  version: 18.0.0
+  resolution: "yargs@npm:18.0.0"
+  dependencies:
+    cliui: ^9.0.1
+    escalade: ^3.1.1
+    get-caller-file: ^2.0.5
+    string-width: ^7.2.0
+    y18n: ^5.0.5
+    yargs-parser: ^22.0.0
+  checksum: bf290e4723876ea9c638c786a5c42ac28e03c9ca2325e1424bf43b94e5876456292d3ed905b853ebbba6daf43ed29e772ac2a6b3c5fb1b16533245d6211778f3
+  languageName: node
+  linkType: hard
+
 "yn@npm:3.1.1":
   version: 3.1.1
   resolution: "yn@npm:3.1.1"
@@ -18001,6 +21038,29 @@ turbo@latest:
   languageName: node
   linkType: hard
 
+"youch-core@npm:^0.3.3":
+  version: 0.3.3
+  resolution: "youch-core@npm:0.3.3"
+  dependencies:
+    "@poppinss/exception": ^1.2.2
+    error-stack-parser-es: ^1.0.5
+  checksum: fe101a037a6cfaaa4e80e3d062ff33d4b087b65e3407e65220b453c9b2a66c87ea348a7da0239b61623d929d8fa0a9e139486eaa690ef5605bb49947a2fa82f6
+  languageName: node
+  linkType: hard
+
+"youch@npm:4.1.0-beta.10":
+  version: 4.1.0-beta.10
+  resolution: "youch@npm:4.1.0-beta.10"
+  dependencies:
+    "@poppinss/colors": ^4.1.5
+    "@poppinss/dumper": ^0.6.4
+    "@speed-highlight/core": ^1.2.7
+    cookie: ^1.0.2
+    youch-core: ^0.3.3
+  checksum: 588d65aa5837a46c8473cf57a9129115383f57aad5899915d37005950decfefc66bec85b8a1262dbefd623a122c279095074655889317311a554f9c2e290a5b3
+  languageName: node
+  linkType: hard
+
 "zwitch@npm:^2.0.0":
   version: 2.0.4
   resolution: "zwitch@npm:2.0.4"
