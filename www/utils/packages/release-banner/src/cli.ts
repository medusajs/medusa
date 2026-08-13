#!/usr/bin/env node
import { spawn } from "node:child_process"
import { mkdir, writeFile } from "node:fs/promises"
import { dirname, resolve } from "node:path"

import { Command } from "commander"

import {
  CLOUDINARY_FOLDER,
  uploadBanner,
  versionToPublicId,
} from "./cloudinary.js"
import { writePreview } from "./preview.js"
import { normalizeVersion, renderPng, renderSvg } from "./render.js"
import { SPEC } from "./spec.js"
import type { BannerSpecOverrides } from "./types.js"

const DEFAULT_OUT_DIR = "out"

/**
 * Opens a path in the OS's default application, detached so the CLI can exit
 * without waiting on the browser.
 *
 * Failing to open is not worth failing the command over — the page has already
 * been written by this point — so errors are reported and swallowed.
 */
function openInBrowser(target: string): void {
  const windows = process.platform === "win32"
  const command = windows
    ? "start"
    : process.platform === "darwin"
      ? "open"
      : "xdg-open"

  // `start` is a shell builtin, and takes a window title before the path.
  const args = windows ? ["", target] : [target]

  const child = spawn(command, args, {
    stdio: "ignore",
    detached: true,
    shell: windows,
  })

  child.on("error", (error: Error) => {
    process.stderr.write(`Could not open ${target}: ${error.message}\n`)
  })

  child.unref()
}

const program = new Command()

program
  .name("release-banner")
  .description("Generates the banner image used in Medusa release notes")

program
  .command("render")
  .description("Render a banner for a single version")
  .requiredOption(
    "-v, --version <version>",
    `version to render, with or without the leading "v"`
  )
  .option("-o, --out <path>", "output file; defaults to out/<version>.png")
  .option(
    "-f, --format <format>",
    `"png" or "svg"; inferred from --out when it ends in .svg`,
    "png"
  )
  .option("-w, --width <px>", "canvas width; the height scales with it")
  .option("--font-size <px>", "override the version text size")
  .option("--gap <px>", "override the space between logo and version text")
  .action(async (options) => {
    const version = normalizeVersion(options.version)
    const out = resolve(options.out ?? `${DEFAULT_OUT_DIR}/${version}.png`)
    const format = out.endsWith(".svg") ? "svg" : options.format

    const spec: BannerSpecOverrides = {}

    if (options.width) {
      const width = Number(options.width)

      // Hold the reference aspect ratio so the spec's proportions survive.
      spec.width = width
      spec.height = Math.round((width * SPEC.height) / SPEC.width)
    }

    if (options.fontSize) {
      spec.content = { ...spec.content, fontSize: Number(options.fontSize) }
    }

    if (options.gap) {
      spec.content = { ...spec.content, gap: Number(options.gap) }
    }

    const output =
      format === "svg"
        ? Buffer.from(await renderSvg({ version, spec }))
        : await renderPng({ version, spec })

    await mkdir(dirname(out), { recursive: true })
    await writeFile(out, output)

    process.stdout.write(`${out}\n`)
  })

program
  .command("preview")
  .description("Render a spread of versions and a page to review them on")
  .argument(
    "[versions...]",
    "versions to render alongside the reference; defaults to a set spread"
  )
  .option("-o, --out-dir <path>", "output directory", DEFAULT_OUT_DIR)
  .option("--no-open", "write the page without opening it")
  .action(async (versions: string[], options) => {
    const out = await writePreview({
      outDir: resolve(options.outDir),
      versions: versions.length ? versions : undefined,
      onRender: (file) => process.stdout.write(`rendered ${file}\n`),
    })

    process.stdout.write(`\n${out}\n`)

    // There is no browser to open the page in on CI, and nobody to look at it.
    if (options.open && !process.env.CI) {
      openInBrowser(out)
    }
  })

program
  .command("upload")
  .description("Render a banner and upload it to Cloudinary")
  .requiredOption(
    "-v, --version <version>",
    `version to render, with or without the leading "v"`
  )
  .option(
    "--folder <folder>",
    "Cloudinary folder to upload into",
    CLOUDINARY_FOLDER
  )
  .option(
    "--dry-run",
    "render and report the target public ID without uploading"
  )
  .action(async (options) => {
    const version = normalizeVersion(options.version)
    const png = await renderPng({ version })

    if (options.dryRun) {
      const publicId = `${options.folder}/${versionToPublicId(version)}`

      process.stdout.write(`would upload ${png.length} bytes to ${publicId}\n`)
      return
    }

    const { url } = await uploadBanner({
      png,
      version,
      folder: options.folder,
    })

    // The URL is the point of this command — keep it the only thing on stdout so
    // a caller can read it straight off.
    process.stdout.write(`${url}\n`)
  })

try {
  await program.parseAsync()
} catch (error) {
  // A missing credential or an upload rejection is an ordinary outcome to report,
  // not a crash to dump a stack trace for.
  const message = error instanceof Error ? error.message : String(error)

  process.stderr.write(`${message}\n`)
  process.exitCode = 1
}
