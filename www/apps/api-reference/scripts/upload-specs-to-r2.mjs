/* eslint-disable no-console */
/**
 * Uploads specs/ to Cloudflare R2.
 *
 * Every `openapi.full.yaml` is additionally uploaded as `openapi.full.json`.
 * The JSON isn't committed to the repository, it only exists in R2.
 *
 * Usage:
 *   node ./scripts/upload-specs-to-r2.mjs
 *     Full upload of specs/ directory.
 *
 *   node ./scripts/upload-specs-to-r2.mjs --upload specs/admin/paths/foo.yaml specs/store/paths/bar.yaml
 *     Upload only the listed files (paths relative to app root).
 *
 *   node ./scripts/upload-specs-to-r2.mjs --remove specs/admin/paths/old.yaml
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
import { parse as parseYaml } from "yaml"

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

// Full OAS documents are also stored as JSON in R2 for consumers that can't
// parse YAML. The JSON isn't kept in the repository, so it's derived here.
const FULL_SPEC_FILE_NAME = "openapi.full.yaml"

function isFullSpec(fileOrKey) {
  return path.basename(fileOrKey) === FULL_SPEC_FILE_NAME
}

function toJsonKey(r2Key) {
  return r2Key.replace(/\.yaml$/, ".json")
}

async function putObject(r2Key, body, contentType) {
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

async function uploadFile(localPath, r2Key) {
  const body = await readFile(localPath)
  const contentType =
    mimeLookup(path.basename(localPath)) || "application/octet-stream"
  await putObject(r2Key, body, contentType)

  if (isFullSpec(localPath)) {
    const json = JSON.stringify(parseYaml(body.toString("utf-8")))
    await putObject(toJsonKey(r2Key), json, "application/json")
  }
}

async function removeFile(r2Key) {
  await client.send(new DeleteObjectCommand({ Bucket: bucket, Key: r2Key }))
  console.log(`  removed: ${r2Key}`)

  if (isFullSpec(r2Key)) {
    const jsonKey = toJsonKey(r2Key)
    await client.send(new DeleteObjectCommand({ Bucket: bucket, Key: jsonKey }))
    console.log(`  removed: ${jsonKey}`)
  }
}

async function uploadDir(localDir, r2Prefix) {
  const entries = await readdir(localDir, { withFileTypes: true })
  for (const entry of entries) {
    const localPath = path.join(localDir, entry.name)
    const r2Key = `${r2Prefix}/${entry.name}`
    if (entry.isDirectory()) {
      await uploadDir(localPath, r2Key)
    } else if (entry.isFile()) {
      await uploadFile(localPath, r2Key)
    }
  }
}

if (isSelective) {
  for (const relPath of filesToUpload) {
    await uploadFile(
      path.join(process.cwd(), relPath),
      `api-reference/${relPath}`
    )
  }
  for (const relPath of filesToRemove) {
    await removeFile(`api-reference/${relPath}`)
  }
} else {
  const specsDir = path.join(process.cwd(), "specs")
  console.log(`Uploading ${specsDir} → r2://${bucket}/api-reference/specs`)
  await uploadDir(specsDir, "api-reference/specs")
}

console.log("Done.")
