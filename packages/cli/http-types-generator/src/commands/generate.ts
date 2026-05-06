import { Command } from "commander"
import { glob } from "glob"
import path from "path"
import chalk from "chalk"
import { ProgramFactory } from "../core/program-factory"
import { SchemaExtractor } from "../core/schema-extractor"
import { TypeResolver } from "../core/type-resolver"
import { TypeEmitter, type EmittedInterface } from "../core/type-emitter"
import { ImportTracker } from "../core/import-tracker"
import { PathMapper, type PathMapping } from "../mapping/path-mapper"
import { NameClassifier } from "../mapping/name-classifier"
import { NameRegistry } from "../mapping/name-registry"
import { FsHelpers } from "../utils/fs-helpers"
import { IndexManager } from "../utils/index-manager"
import { FileMerger } from "../utils/file-merger"

interface GenerateOptions {
  area: string
  domain?: string
  dryRun: boolean
  force: boolean
  verbose: boolean
}

interface FileGroup {
  mapping: PathMapping
  payloads: EmittedInterface[]
  queries: EmittedInterface[]
  payloadsImports: ImportTracker
  queriesImports: ImportTracker
}

/**
 * The `generate` command.
 *
 * Scans all validator files, extracts Zod schema exports, resolves their
 * TypeScript types, and emits TypeScript interface declarations into the
 * corresponding HTTP types files.
 */
export function generateCommand(): Command {
  const cmd = new Command("generate")

  cmd
    .description(
      "Generate TypeScript HTTP type interfaces from Zod validator schemas"
    )
    .option(
      "--area <area>",
      "Which API area to process: admin, store, or all",
      "all"
    )
    .option("--domain <domain>", "Limit generation to a specific domain name")
    .option("--dry-run", "Print what would be generated without writing files", false)
    .option(
      "--force",
      "Overwrite existing files (default: skip existing files)",
      false
    )
    .option("--verbose", "Print detailed output including each processed schema", false)
    .action(async (opts) => {
      const options: GenerateOptions = {
        area: opts.area as string,
        domain: opts.domain,
        dryRun: opts.dryRun,
        force: opts.force,
        verbose: opts.verbose,
      }
      await runGenerate(options)
    })

  return cmd
}

async function runGenerate(options: GenerateOptions): Promise<void> {
  const { area, domain, dryRun, force, verbose } = options

  console.log(
    chalk.bold(`\nGenerating HTTP types (area: ${area}${domain ? `, domain: ${domain}` : ""})\n`)
  )

  // Discover validator files
  const globs = PathMapper.getValidatorGlobs(area)
  let validatorFiles: string[] = []

  for (const pattern of globs) {
    const matches = await glob(pattern)
    validatorFiles.push(...matches)
  }

  if (domain) {
    validatorFiles = PathMapper.filterValidatorsByDomain(validatorFiles, domain)
  }

  if (validatorFiles.length === 0) {
    console.log(chalk.yellow("No validator files found."))
    if (domain) {
      console.log(
        chalk.yellow(`  Hint: make sure "${domain}" matches a route directory name in your configured validator paths.`)
      )
    }
    return
  }

  if (verbose) {
    console.log(chalk.gray(`Found ${validatorFiles.length} validator file(s)`))
  }

  // Create TypeScript program with all validator files
  const { program, checker } = ProgramFactory.create(validatorFiles)

  const extractor = new SchemaExtractor(checker)
  const resolver = new TypeResolver(checker)
  const emitter = new TypeEmitter(checker)
  const merger = new FileMerger()
  const indexManager = new IndexManager()

  // Group schemas by output file
  const fileGroups = new Map<string, FileGroup>()

  let totalSchemas = 0
  let skippedSchemas = 0

  for (const validatorFile of validatorFiles) {
    const mapping = PathMapper.mapValidatorToHttpTypes(validatorFile)
    if (!mapping) {
      if (verbose) {
        console.log(
          chalk.gray(`  Skipping unmapped validator: ${path.basename(path.dirname(validatorFile))}`)
        )
      }
      continue
    }

    const sourceFile = program.getSourceFile(validatorFile)
    if (!sourceFile) {
      console.log(chalk.yellow(`  Warning: could not load source file: ${validatorFile}. Skipping.`))
      continue
    }

    const schemas = extractor.extract(sourceFile)

    for (const schema of schemas) {
      totalSchemas++

      // Apply name registry override (pass domain so DOMAIN_SCOPED_OVERRIDES take effect)
      const httpTypeName =
        schema.httpTypeName !== schema.exportName
          ? schema.httpTypeName // already set via @http-type-name annotation
          : NameRegistry.resolveHttpTypeName(schema.exportName, mapping.domain)

      // Skip when the registry maps this export to "skip" (e.g. single-item select params
      // that duplicate a list params schema, or embedded schemas used within payloads)
      if (httpTypeName === "skip") {
        skippedSchemas++
        if (verbose) {
          console.log(chalk.gray(`  Skip  ${schema.exportName}`))
        }
        continue
      }

      const targetFile = NameClassifier.classify(schema.exportName)
      if (targetFile === "skip") {
        skippedSchemas++
        if (verbose) {
          console.log(chalk.gray(`  Skip  ${schema.exportName}`))
        }
        continue
      }

      const resolved = resolver.resolveSchemaType({
        ...schema,
        httpTypeName,
      })

      if (!resolved) {
        console.log(
          chalk.yellow(`  Warning: could not resolve type for ${schema.exportName}. Skipping.`)
        )
        skippedSchemas++
        continue
      }

      // Get or create the file group
      const groupKey = `${mapping.outputDir}`
      if (!fileGroups.has(groupKey)) {
        fileGroups.set(groupKey, {
          mapping,
          payloads: [],
          queries: [],
          payloadsImports: new ImportTracker(),
          queriesImports: new ImportTracker(),
        })
      }

      const group = fileGroups.get(groupKey)!
      const importTracker =
        targetFile === "payloads"
          ? group.payloadsImports
          : group.queriesImports

      // Emit the interface
      const code = emitter.emitInterface(httpTypeName, resolved, importTracker)

      const emitted: EmittedInterface = { name: httpTypeName, code }

      if (targetFile === "payloads") {
        group.payloads.push(emitted)
      } else {
        group.queries.push(emitted)
      }

      if (verbose) {
        console.log(
          chalk.green(`  Generate  ${httpTypeName}`) +
            chalk.gray(` → ${targetFile}.ts`)
        )
      }
    }
  }

  // Write (or dry-run) the output files
  let written = 0
  let updated = 0
  let skippedFiles = 0

  for (const [, group] of fileGroups) {
    const filesToWrite: Array<{
      file: string
      interfaces: EmittedInterface[]
      imports: ImportTracker
      label: string
    }> = []

    if (group.payloads.length > 0) {
      filesToWrite.push({
        file: group.mapping.payloadsFile,
        interfaces: group.payloads,
        imports: group.payloadsImports,
        label: "payloads",
      })
    }

    if (group.queries.length > 0) {
      filesToWrite.push({
        file: group.mapping.queriesFile,
        interfaces: group.queries,
        imports: group.queriesImports,
        label: "queries",
      })
    }

    for (const { file, interfaces, imports, label } of filesToWrite) {
      const relPath = path.relative(process.cwd(), file)

      const result = await merger.resolveFileContent(file, interfaces, imports, force)

      if (dryRun) {
        if (result.status === "skipped") {
          console.log(chalk.gray(`  Skip  ${relPath}  (all types already present)`))
        } else {
          const tag =
            result.status === "created"
              ? "[dry-run] Create"
              : result.status === "overwritten"
                ? "[dry-run] Overwrite"
                : `[dry-run] Update (+${result.added} interface(s))`
          console.log(chalk.cyan(`\n--- ${tag}: ${relPath} ---`))
          console.log(result.content)
          await indexManager.updateIndexFiles(group.mapping, label, true)
        }
        continue
      }

      if (result.status === "skipped") {
        console.log(chalk.gray(`  Skip  ${relPath}  (all types already present)`))
        skippedFiles++
        continue
      }

      FsHelpers.writeFile(file, result.content)

      if (result.status === "created" || result.status === "overwritten") {
        written++
        console.log(
          chalk.green(`  Write  ${relPath}`) +
            chalk.gray(` (${interfaces.length} interface(s))`)
        )
      } else {
        updated++
        console.log(
          chalk.green(`  Update  ${relPath}`) +
            chalk.gray(` (+${result.added} interface(s))`)
        )
      }

      await indexManager.updateIndexFiles(group.mapping, label, false)
    }
  }

  console.log()
  console.log(
    chalk.bold(
      `Done. ${totalSchemas - skippedSchemas} schema(s) processed, ` +
        `${written} file(s) written, ${updated} file(s) updated, ${skippedFiles} file(s) skipped.`
    )
  )
}
