import { Command } from "commander"
import { glob } from "glob"
import path from "path"
import chalk from "chalk"
import { createProgramContext } from "../core/program-factory"
import { extractSchemasFromFile } from "../core/schema-extractor"
import { resolveSchemaType } from "../core/type-resolver"
import {
  checkCompatibility,
  formatCompatibilityResult,
  type CheckPair,
} from "../core/compatibility-checker"
import {
  mapValidatorToHttpTypes,
  getValidatorGlobs,
  filterValidatorsByDomain,
  resolveHttpDomain,
} from "../mapping/path-mapper"
import { classifySchemaName } from "../mapping/name-classifier"
import { resolveHttpTypeName } from "../mapping/name-registry"
import { fromRoot } from "../utils/fs-helpers"

interface ValidateOptions {
  area: "admin" | "store" | "all"
  domain?: string
  changedFiles?: string
  lenient: boolean
  ci: boolean
  verbose: boolean
}

/**
 * The `validate` command.
 *
 * Checks that existing HTTP TypeScript types in `packages/core/types/src/http/`
 * are structurally compatible with the Zod schemas in
 * `packages/medusa/src/api/`.
 *
 * Exit codes:
 * - 0: All types are compatible (or --ci is false)
 * - 1: One or more types are incompatible (when --ci is set)
 */
export function validateCommand(): Command {
  const cmd = new Command("validate")

  cmd
    .description(
      "Validate that existing HTTP types are compatible with Zod validator schemas"
    )
    .option(
      "--area <area>",
      "Which API area to validate: admin, store, or all",
      "all"
    )
    .option("--domain <domain>", "Limit validation to a specific domain name")
    .option(
      "--changed-files <paths>",
      "Comma-separated list of changed validator files (CI optimization)"
    )
    .option(
      "--fix",
      "Auto-generate types for schemas that fail validation",
      false
    )
    .option(
      "--lenient",
      "Treat T|null|undefined as compatible with T|null (for legacy types)",
      false
    )
    .option(
      "--ci",
      "Exit with non-zero code if any validation failures are found",
      false
    )
    .option("--verbose", "Show passing types in addition to failures", false)
    .action(async (opts) => {
      const isCI =
        opts.ci ||
        process.env.CI === "true" ||
        process.env.GITHUB_ACTIONS === "true"

      const options: ValidateOptions = {
        area: opts.area as "admin" | "store" | "all",
        domain: opts.domain,
        changedFiles: opts.changedFiles,
        lenient: opts.lenient,
        ci: isCI,
        verbose: opts.verbose,
      }
      await runValidate(options)
    })

  return cmd
}

async function runValidate(options: ValidateOptions): Promise<void> {
  const { area, domain, changedFiles, verbose, ci } = options

  console.log(
    chalk.bold(
      `\nValidating HTTP types (area: ${area}${domain ? `, domain: ${domain}` : ""})\n`
    )
  )

  // Determine which validator files to process
  let validatorFiles: string[] = []

  if (changedFiles) {
    // CI optimization: only validate changed files
    validatorFiles = changedFiles
      .split(",")
      .map((f) => f.trim())
      .filter(Boolean)
      .map((f) => (path.isAbsolute(f) ? f : path.resolve(f)))
  } else {
    const globs = getValidatorGlobs(area)
    for (const pattern of globs) {
      const matches = await glob(pattern)
      validatorFiles.push(...matches)
    }
  }

  if (domain) {
    validatorFiles = filterValidatorsByDomain(validatorFiles, domain)
  }

  if (validatorFiles.length === 0) {
    console.log(chalk.yellow("No validator files found."))
    if (domain) {
      console.log(
        chalk.yellow(`  Hint: make sure "${domain}" matches a route directory name under packages/medusa/src/api/.`)
      )
    }
    return
  }

  // Collect HTTP type files to check against — narrowed to the target domain
  // when --domain is set, so we don't load the entire types tree unnecessarily.
  const httpTypesBase = fromRoot("packages/core/types/src/http")
  const httpTypeFilesGlob = domain
    ? path.join(httpTypesBase, resolveHttpDomain(domain), "**", "*.ts")
    : path.join(httpTypesBase, "**", "*.ts")
  const httpTypeFiles = await glob(httpTypeFilesGlob)

  // Create TypeScript program with both validator files AND HTTP type files
  // so we can resolve both sides in one pass
  const allFiles = [...validatorFiles, ...httpTypeFiles]
  const { program, checker } = createProgramContext(allFiles)

  // Build check pairs
  const pairs: CheckPair[] = []
  let skippedCount = 0

  for (const validatorFile of validatorFiles) {
    const mapping = mapValidatorToHttpTypes(validatorFile)
    if (!mapping) {
      continue
    }

    const sourceFile = program.getSourceFile(validatorFile)
    if (!sourceFile) {
      console.log(
        chalk.yellow(`  Warning: could not load: ${path.basename(validatorFile)}`)
      )
      continue
    }

    const schemas = extractSchemasFromFile(sourceFile, checker)

    for (const schema of schemas) {
      const httpTypeName =
        schema.httpTypeName !== schema.exportName
          ? schema.httpTypeName
          : resolveHttpTypeName(schema.exportName, mapping.domain)

      if (httpTypeName === "skip") {
        skippedCount++
        continue
      }

      const targetFile = classifySchemaName(schema.exportName)
      if (targetFile === "skip") {
        skippedCount++
        continue
      }

      const resolved = resolveSchemaType(checker, {
        ...schema,
        httpTypeName,
      })

      if (!resolved) {
        continue
      }

      const httpTypeFile =
        targetFile === "payloads"
          ? mapping.payloadsFile
          : mapping.queriesFile

      pairs.push({
        validatorName: schema.exportName,
        validatorFile,
        httpTypeName,
        resolvedZodType: resolved.type,
        httpTypeFile,
        hasFindParams: resolved.hasFindParams,
        hasSelectParams: resolved.hasSelectParams,
      })
    }
  }

  if (pairs.length === 0) {
    console.log(chalk.yellow("No schemas found to validate."))
    return
  }

  console.log(
    chalk.gray(
      `Checking ${pairs.length} schema(s) against existing HTTP types...\n`
    )
  )

  // Run compatibility checks
  const results = checkCompatibility({ program, checker, pairs, httpTypeFiles, lenient: options.lenient })

  // Report results
  const failures = results.filter((r) => !r.passed)
  const passes = results.filter((r) => r.passed)

  // Group results by domain for cleaner output
  const byDomain = new Map<string, typeof results>()
  for (const result of results) {
    const domainMatch = result.httpTypeFile.match(
      /\/http\/([^/]+)\/(admin|store)\//
    )
    // e.g. "users/admin" or "products/store". If we can't parse it, group under "unknown".
    const domainKey = domainMatch ? `${domainMatch[1]}/${domainMatch[2]}` : "unknown"
    if (!byDomain.has(domainKey)) {
      byDomain.set(domainKey, [])
    }
    byDomain.get(domainKey)!.push(result)
  }

  for (const [domainKey, domainResults] of byDomain) {
    const domainFailures = domainResults.filter((r) => !r.passed)

    if (domainFailures.length === 0 && !verbose) {
      continue
    }

    console.log(chalk.bold(`  ${domainKey}`))

    for (const result of domainResults) {
      const line = formatCompatibilityResult(result, verbose)
      if (line) {
        console.log(line)
      }
    }
    console.log()
  }

  // Summary
  console.log(chalk.bold("Summary:"))
  console.log(
    chalk.green(`  Passed: ${passes.length}`) +
      "  " +
      (failures.length > 0
        ? chalk.red(`Failed: ${failures.length}`)
        : chalk.green(`Failed: 0`))
  )
  console.log()

  if (failures.length > 0) {
    console.log(
      chalk.yellow(
        "Run `yarn generate:http-types --dry-run` to preview what the correct types should look like.\n" +
          "Run `yarn generate:http-types --force` to overwrite existing types with generated ones."
      )
    )

    if (ci) {
      process.exit(1)
    }
  } else {
    console.log(chalk.green("All HTTP types are compatible with their Zod schemas."))
  }
}
