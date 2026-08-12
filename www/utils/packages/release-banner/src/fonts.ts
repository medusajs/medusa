import { existsSync } from "node:fs"
import { readFile } from "node:fs/promises"
import { dirname, join, resolve } from "node:path"
import { fileURLToPath } from "node:url"

/**
 * Inter is read from the copy the admin dashboard already vendors, so the banner
 * needs no font download at render time and there is no second copy of the
 * typeface to keep in step.
 */
const FONT_DIR = join(
  "packages",
  "admin",
  "dashboard",
  "src",
  "assets",
  "fonts"
)

const FONT_FILES: { file: string; weight: FontWeight }[] = [
  { file: "Inter-Regular.ttf", weight: 400 },
  { file: "Inter-Medium.ttf", weight: 500 },
]

/** The weights satori accepts. */
type FontWeight = 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900

export type LoadedFont = {
  name: string
  weight: FontWeight
  style: "normal"
  data: Buffer
}

/**
 * Walks up from this module until it finds the monorepo root, identified by the
 * dashboard's font directory.
 *
 * Walking rather than counting `..` segments keeps this working from both `src`
 * (under ts-node) and `dist`, which sit at different depths.
 */
function findRepoRoot(): string {
  let dir = dirname(fileURLToPath(import.meta.url))

  for (;;) {
    if (existsSync(join(dir, FONT_DIR))) {
      return dir
    }

    const parent = resolve(dir, "..")

    if (parent === dir) {
      throw new Error(
        `Could not locate the monorepo root: no ancestor of ` +
          `${dirname(fileURLToPath(import.meta.url))} contains ${FONT_DIR}`
      )
    }

    dir = parent
  }
}

let cache: LoadedFont[] | undefined

/** Loads Inter, once per process. */
export async function loadFonts(): Promise<LoadedFont[]> {
  if (!cache) {
    const fontDir = join(findRepoRoot(), FONT_DIR)

    cache = await Promise.all(
      FONT_FILES.map(async ({ file, weight }) => ({
        name: "Inter",
        weight,
        style: "normal" as const,
        data: await readFile(join(fontDir, file)),
      }))
    )
  }

  return cache
}
