#!/usr/bin/env node
import { readFile, writeFile } from "fs/promises"
import path from "path"
import { parseArgs } from "util"

/**
 * Writes a banner URL into a changelog entry file's `image` property.
 *
 * The changelog pipeline renders and uploads the banner after Claude has
 * written the entry, so the URL has to be patched into a file that already
 * exists. The edit is textual rather than a rewrite of the whole module, so the
 * entry's Markdown content keeps the formatting it was written with.
 *
 * @example
 * node scripts/set-changelog-image.mjs --date 2026-08-17 --url https://res.cloudinary.com/...
 */

const IMAGE_LINE_REGEX = /^([ \t]*)image:.*$/m
const CONTENT_LINE_REGEX = /^([ \t]*)content:/m

const { values } = parseArgs({
  options: {
    date: { type: "string" },
    file: { type: "string" },
    url: { type: "string" },
  },
})

if (!values.url) {
  throw new Error("--url is required")
}

if (!values.date && !values.file) {
  throw new Error("one of --date or --file is required")
}

const file =
  values.file ??
  path.join(process.cwd(), "generated", "changelog", `${values.date}.mjs`)

const original = await readFile(file, "utf-8")
const line = `image: ${JSON.stringify(values.url)},`

const contentMatch = CONTENT_LINE_REGEX.exec(original)

if (!contentMatch) {
  throw new Error(
    `${file} has no \`content\` property to place the image before. ` +
      `Check that the entry follows the shape described in ` +
      `generated/changelog/README.md.`
  )
}

// `content` is a Markdown template literal that can hold anything, so only the
// properties declared before it are searched for an existing `image`.
const header = original.slice(0, contentMatch.index)
const rest = original.slice(contentMatch.index)
const indent = contentMatch[1]

// Re-running the pipeline for the same date overwrites the image in place, so
// the entry keeps one `image` rather than gaining another.
const updated = IMAGE_LINE_REGEX.test(header)
  ? header.replace(
      IMAGE_LINE_REGEX,
      (_match, existingIndent) => `${existingIndent}${line}`
    ) + rest
  : `${header}${indent}${line}\n${rest}`

await writeFile(file, updated, "utf-8")

process.stdout.write(
  `Set the image of ${path.basename(file)} to ${values.url}\n`
)
