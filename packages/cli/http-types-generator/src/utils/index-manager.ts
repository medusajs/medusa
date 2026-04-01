import { existsSync, readFileSync, writeFileSync } from "fs"
import path from "path"
import chalk from "chalk"
import { fromRoot, writeFile } from "./fs-helpers"
import { formatContent } from "./formatter"
import type { PathMapping } from "../mapping/path-mapper"

const HTTP_ROOT_INDEX = fromRoot("packages/core/types/src/http/index.ts")

/**
 * Ensures `export * from "./{stem}"` is present in `indexFile`.
 * Creates the file if it doesn't exist; appends the line if it's missing.
 * Returns true if a change was made (or would be made in dry-run).
 */
async function ensureExport(
  indexFile: string,
  stem: string,
  dryRun: boolean
): Promise<boolean> {
  const exportLine = `export * from "./${stem}"`

  if (!existsSync(indexFile)) {
    const content = await formatContent(`${exportLine}\n`, indexFile)
    if (!dryRun) {
      writeFile(indexFile, content)
    }
    return true
  }

  const existing = readFileSync(indexFile, "utf-8")
  // Use a loose check: the line may have trailing spaces or varying quote style
  const alreadyPresent = new RegExp(
    `export\\s+\\*\\s+from\\s+["']\\.\/${stem}["']`
  ).test(existing)

  if (alreadyPresent) {
    return false
  }

  const updated = existing.trimEnd() + "\n" + exportLine + "\n"
  const content = await formatContent(updated, indexFile)
  if (!dryRun) {
    writeFileSync(indexFile, content, "utf-8")
  }
  return true
}

/**
 * After a payloads.ts or queries.ts file is written, ensures all index files
 * in the chain are up to date:
 *
 * 1. `{domain}/{area}/index.ts`  — exports the written file stem
 * 2. `{domain}/index.ts`         — exports `./{area}`
 * 3. `packages/core/types/src/http/index.ts` — exports `./{domain}`
 *
 * In dry-run mode nothing is written; changes are only logged.
 */
export async function updateIndexFiles(
  mapping: PathMapping,
  writtenLabel: string,
  dryRun: boolean
): Promise<void> {
  const { outputDir, area, domain } = mapping
  const domainDir = path.dirname(outputDir) // one level up from the area dir
  const areaIndexFile = path.join(outputDir, "index.ts")
  const domainIndexFile = path.join(domainDir, "index.ts")

  const relArea = path.relative(process.cwd(), areaIndexFile)
  const relDomain = path.relative(process.cwd(), domainIndexFile)
  const relRoot = path.relative(process.cwd(), HTTP_ROOT_INDEX)

  // 1. Area index: export the written file (payloads / queries)
  const areaChanged = await ensureExport(areaIndexFile, writtenLabel, dryRun)
  if (areaChanged) {
    if (dryRun) {
      console.log(
        chalk.cyan(`  [dry-run] ${relArea}`) +
          chalk.gray(` ← add export * from "./${writtenLabel}"`)
      )
    } else {
      console.log(chalk.green(`  Update  ${relArea}`))
    }
  }

  // 2. Domain index: export the area (admin / store)
  const domainChanged = await ensureExport(domainIndexFile, area, dryRun)
  if (domainChanged) {
    if (dryRun) {
      console.log(
        chalk.cyan(`  [dry-run] ${relDomain}`) +
          chalk.gray(` ← add export * from "./${area}"`)
      )
    } else {
      console.log(chalk.green(`  Update  ${relDomain}`))
    }
  }

  // 3. Root HTTP index: export the domain
  const rootChanged = await ensureExport(HTTP_ROOT_INDEX, domain, dryRun)
  if (rootChanged) {
    if (dryRun) {
      console.log(
        chalk.cyan(`  [dry-run] ${relRoot}`) +
          chalk.gray(` ← add export * from "./${domain}"`)
      )
    } else {
      console.log(chalk.green(`  Update  ${relRoot}`))
    }
  }
}
