#!/usr/bin/env node
// Loaded before anything reads the environment, so a local `.env` can hold the
// Cloudinary credentials. It never overwrites a variable that is already set,
// which leaves CI — where they arrive as real environment variables — alone.
import "dotenv/config"

import { spawn } from "node:child_process"
import { mkdir, writeFile } from "node:fs/promises"
import { dirname, resolve } from "node:path"

import { Command, InvalidArgumentError } from "commander"

import {
  bannerOf,
  BANNER_TYPES,
  DEFAULT_BANNER_TYPE,
  type BannerInput,
  type BannerType,
} from "./banners/index.js"
import { uploadBanner } from "./cloudinary.js"
import { writePreview } from "./preview.js"
import { withRandomSuffix } from "./public-id.js"
import { renderPng, renderSvg } from "./render.js"

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

function parseType(value: string): BannerType {
  if (!(BANNER_TYPES as string[]).includes(value)) {
    throw new InvalidArgumentError(`expected one of ${BANNER_TYPES.join(", ")}`)
  }

  return value as BannerType
}

type ContentOptions = {
  type: BannerType
  version?: string
  date?: string
}

/**
 * Builds a banner input from the flags that describe its content.
 *
 * This is the one place that knows which flags belong to which type; everything
 * downstream goes through the type's definition.
 */
function inputFrom(options: ContentOptions): BannerInput {
  switch (options.type) {
    case "release":
      if (!options.version) {
        throw new Error("--version is required for the release banner")
      }

      return { type: "release", version: options.version }

    case "cloud-changelog":
      if (!options.date) {
        throw new Error("--date is required for the cloud-changelog banner")
      }

      return { type: "cloud-changelog", date: options.date }
  }
}

/** Builds an input from a bare positional value, for the preview command. */
function inputFromValue(type: BannerType, value: string): BannerInput {
  switch (type) {
    case "release":
      return { type, version: value }
    case "cloud-changelog":
      return { type, date: value }
  }
}

type SpecOptions = {
  type: BannerType
  width?: string
  fontSize?: string
  gap?: string
}

/**
 * Turns the design flags into spec overrides.
 *
 * The values are checked against the spec the type actually declares, so a flag
 * that means nothing for a type is reported instead of silently ignored.
 */
function specFrom(options: SpecOptions): BannerInput["spec"] {
  const { spec: defaults } = bannerOf(options.type)
  const overrides: Record<string, unknown> = {}
  const content: Record<string, unknown> = {}

  if (options.width) {
    const width = Number(options.width)

    // Hold the reference aspect ratio so the spec's proportions survive.
    overrides.width = width
    overrides.height = Math.round((width * defaults.height) / defaults.width)
  }

  if (options.fontSize) {
    content.fontSize = Number(options.fontSize)
  }

  if (options.gap) {
    content.gap = Number(options.gap)
  }

  if (Object.keys(content).length) {
    if (!defaults.content) {
      throw new Error(
        `the ${options.type} banner has no content section to override`
      )
    }

    overrides.content = content
  }

  return overrides as BannerInput["spec"]
}

const program = new Command()

program
  .name("release-banner")
  .description("Generates the banner images used in Medusa release notes")

/** Flags shared by every command that renders a banner from content. */
function withContentOptions(command: Command): Command {
  return command
    .option(
      "--type <type>",
      `banner type: ${BANNER_TYPES.join(" | ")}`,
      parseType,
      DEFAULT_BANNER_TYPE
    )
    .option(
      "-v, --version <version>",
      `release: version to render, with or without the leading "v"`
    )
    .option(
      "-d, --date <date>",
      "cloud-changelog: date shown after the wordmark, rendered as given"
    )
}

withContentOptions(
  program.command("render").description("Render a single banner")
)
  .option("-o, --out <path>", "output file; defaults to out/<label>.png")
  .option(
    "-f, --format <format>",
    `"png" or "svg"; inferred from --out when it ends in .svg`,
    "png"
  )
  .option("-w, --width <px>", "canvas width; the height scales with it")
  .option("--font-size <px>", "override the main text size")
  .option("--gap <px>", "override the space between the logo and the text")
  .action(async (options) => {
    const definition = bannerOf(options.type)
    const input = definition.normalize(inputFrom(options)) as BannerInput
    const out = resolve(
      options.out ?? `${DEFAULT_OUT_DIR}/${definition.label(input)}.png`
    )
    const format = out.endsWith(".svg") ? "svg" : options.format

    const withSpec = { ...input, spec: specFrom(options) } as BannerInput

    const output =
      format === "svg"
        ? Buffer.from(await renderSvg(withSpec))
        : await renderPng(withSpec)

    await mkdir(dirname(out), { recursive: true })
    await writeFile(out, output)

    process.stdout.write(`${out}\n`)
  })

program
  .command("preview")
  .description("Render a spread of banners and a page to review them on")
  .argument(
    "[values...]",
    "versions or titles to render; defaults to a set spread"
  )
  .option(
    "--type <type>",
    `banner type: ${BANNER_TYPES.join(" | ")}`,
    parseType,
    DEFAULT_BANNER_TYPE
  )
  .option("-o, --out-dir <path>", "output directory", DEFAULT_OUT_DIR)
  .option("--no-open", "write the page without opening it")
  .action(async (values: string[], options) => {
    const out = await writePreview({
      type: options.type,
      outDir: resolve(options.outDir),
      inputs: values.map((value) => inputFromValue(options.type, value)),
      onRender: (file) => process.stdout.write(`rendered ${file}\n`),
    })

    process.stdout.write(`\n${out}\n`)

    // There is no browser to open the page in on CI, and nobody to look at it.
    if (options.open && !process.env.CI) {
      openInBrowser(out)
    }
  })

withContentOptions(
  program
    .command("upload")
    .description("Render a banner and upload it to Cloudinary")
)
  .option(
    "--folder <folder>",
    "Cloudinary folder to upload into; defaults to the type's own folder"
  )
  .option(
    "--dry-run",
    "render and report the target public ID without uploading"
  )
  .action(async (options) => {
    const definition = bannerOf(options.type)
    const input = definition.normalize(inputFrom(options)) as BannerInput
    const folder = options.folder ?? definition.folder
    const publicId = withRandomSuffix(definition.publicId(input))
    const png = await renderPng(input)

    if (options.dryRun) {
      // The suffix is drawn fresh every run, so this reports the shape of the
      // target rather than the ID a real upload would end up at.
      process.stdout.write(
        `would upload ${png.length} bytes to ${folder}/${publicId}\n`
      )
      return
    }

    const { url } = await uploadBanner({ png, folder, publicId })

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
