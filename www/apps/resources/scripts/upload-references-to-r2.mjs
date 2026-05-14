/* eslint-disable no-console */
/**
 * Uploads references/ to Cloudflare R2.
 *
 * Usage:
 *   node ./scripts/upload-references-to-r2.mjs
 *     Full upload of references/ directory.
 *
 *   node ./scripts/upload-references-to-r2.mjs --upload references/js-client/foo.mdx
 *     Upload only the listed files (paths relative to app root).
 *
 *   node ./scripts/upload-references-to-r2.mjs --remove references/js-client/old.mdx
 *     Remove the listed keys from R2 (paths relative to app root).
 *
 *   --upload and --remove can be combined in a single invocation.
 *
 * Required env vars:
 *   CLOUDFLARE_ACCOUNT_ID
 *   CLOUDFLARE_R2_ACCESS_KEY_ID
 *   CLOUDFLARE_R2_SECRET_ACCESS_KEY
 *   R2_BUCKET_NAME (default: docs-assets)
 */

// Load .env if present; silently skip if not (e.g. CI injects vars directly)
try {
  process.loadEnvFile()
} catch {
  /* no .env file */
}

import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3"
import { readFile, readdir } from "fs/promises"
import path from "path"
import { lookup as mimeLookup } from "mime-types"

const accountId = process.env.CLOUDFLARE_ACCOUNT_ID
const accessKeyId = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID
const secretAccessKey = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY
const bucket = process.env.R2_BUCKET_NAME || "docs-assets"

if (!accountId || !accessKeyId || !secretAccessKey) {
  console.error(
    "Missing required env vars: CLOUDFLARE_ACCOUNT_ID, CLOUDFLARE_R2_ACCESS_KEY_ID, CLOUDFLARE_R2_SECRET_ACCESS_KEY"
  )
  process.exit(1)
}

const client = new S3Client({
  region: "auto",
  endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
  credentials: { accessKeyId, secretAccessKey },
})

// Parse --upload and --remove CLI flags
const args = process.argv.slice(2)
const filesToUpload = []
const filesToRemove = []
let mode = null

for (const arg of args) {
  if (arg === "--upload") {
    mode = "upload"
    continue
  }
  if (arg === "--remove") {
    mode = "remove"
    continue
  }
  if (arg.startsWith("--")) {
    mode = null
    continue
  }
  if (mode === "upload") {
    filesToUpload.push(arg)
  }
  if (mode === "remove") {
    filesToRemove.push(arg)
  }
}

const isSelective = filesToUpload.length > 0 || filesToRemove.length > 0

// --- helpers ---

async function uploadFile(localPath, r2Key) {
  const body = await readFile(localPath)
  const contentType = mimeLookup(path.basename(localPath)) || "text/plain"
  await client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: r2Key,
      Body: body,
      ContentType: contentType,
    })
  )
  console.log(`  uploaded: ${r2Key}`)
}

async function removeFile(r2Key) {
  await client.send(new DeleteObjectCommand({ Bucket: bucket, Key: r2Key }))
  console.log(`  removed: ${r2Key}`)
}

async function uploadDir(localDir, r2Prefix) {
  const entries = await readdir(localDir, { withFileTypes: true })
  for (const entry of entries) {
    if (entry.isFile() && entry.name !== "page.mdx") {
      continue
    }
    const localPath = path.join(localDir, entry.name)
    const r2Key = `${r2Prefix}/${entry.name}`
    if (entry.isDirectory()) {
      await uploadDir(localPath, r2Key)
    } else {
      await uploadFile(localPath, r2Key)
    }
  }
}

// --- main ---

if (isSelective) {
  for (const relPath of filesToUpload) {
    if (path.basename(relPath) !== "page.mdx") {
      console.log(`  skipped (not page.mdx): ${relPath}`)
      continue
    }
    await uploadFile(path.join(process.cwd(), relPath), `resources/${relPath}`)
  }
  for (const relPath of filesToRemove) {
    if (path.basename(relPath) !== "page.mdx") {
      console.log(`  skipped (not page.mdx): ${relPath}`)
      continue
    }
    await removeFile(`resources/${relPath}`)
  }
} else {
  const referencesDir = path.join(process.cwd(), "references")
  console.log(
    `Uploading ${referencesDir} → r2://${bucket}/resources/references`
  )
  await uploadDir(referencesDir, "resources/references")
}

console.log("Done.")
