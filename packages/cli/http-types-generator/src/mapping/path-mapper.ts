import path from "path"
import pluralize from "pluralize"
import { FsHelpers } from "../utils/fs-helpers"
import { Config } from "../config"

export interface PathMapping {
  /** The API area (e.g. "admin", "store") */
  area: string
  /** Domain name in kebab-case as it appears in the HTTP types directory. e.g. "product" */
  domain: string
  /** Absolute path to the HTTP types directory for this domain+area */
  outputDir: string
  /** Absolute path to the output payloads.ts file */
  payloadsFile: string
  /** Absolute path to the output queries.ts file */
  queriesFile: string
}

/**
 * Maps validator file paths to HTTP types output paths and resolves domain names.
 */
export class PathMapper {
  /**
   * Maps route directory names to HTTP types domain names only when the mapping
   * cannot be derived by singularizing the last hyphen-segment.
   *
   * Most route dirs (e.g. "products" → "product", "sales-channels" → "sales-channel")
   * are handled automatically by `singularizeRouteName`. Only entries with a
   * fundamentally different domain belong here.
   *
   * This list is only meant to remain backward-compatible with existing schemas that predate this tool.
   * When adding new validator schemas, prefer structuring the route and domain names
   * to fit the automatic singularization logic and avoid adding to this registry.
   */
  private static readonly ENTITY_NAME_OVERRIDES: Record<string, string> = {
    addresses: "customer", // part of customer
    "auth-providers": "auth",
    "inventory-items": "inventory",
    "order-changes": "order", // part of order
    "payment-collections": "payment",
    plugins: "plugins", // intentionally stays plural
    "product-variants": "product", // variants live under product
    "stock-locations": "stock-locations", // intentionally stays plural
    uploads: "file",
    "workflows-executions": "workflow-execution", // both segments are plural
  }

  /**
   * Derives the domain name from a route directory name by singularizing its
   * last hyphen-separated segment (e.g. "sales-channels" → "sales-channel",
   * "product-categories" → "product-category").
   */
  private static singularizeRouteName(routeDirName: string): string {
    const parts = routeDirName.split("-")
    parts[parts.length - 1] = pluralize.singular(parts[parts.length - 1])
    return parts.join("-")
  }

  /**
   * Computes the PathMapping for a given validator file path.
   *
   * @param validatorFilePath - Absolute path to the validators.ts file.
   * @returns PathMapping or undefined if the path cannot be mapped.
   */
  static mapValidatorToHttpTypes(
    validatorFilePath: string
  ): PathMapping | undefined {
    const normalized = validatorFilePath.replace(/\\/g, "/")
    const pattern = new RegExp(Config.get().validatorPathPattern)
    const match = normalized.match(pattern)

    if (!match || !match[1] || !match[2]) {
      return undefined
    }

    const area = match[1]
    const routeDirName = match[2]
    const domain = PathMapper.resolveHttpDomain(routeDirName)
    const outputDir = FsHelpers.fromRoot(Config.get().outputBase, domain, area)

    return {
      area,
      domain,
      outputDir,
      payloadsFile: path.join(outputDir, "payloads.ts"),
      queriesFile: path.join(outputDir, "queries.ts"),
    }
  }

  /**
   * Returns glob patterns for all validator files in the given area(s).
   * Pass `"all"` to get globs for every configured area.
   */
  static getValidatorGlobs(area: string): string[] {
    const globs = Config.get().validatorGlobs
    const root = FsHelpers.fromRoot()

    if (area === "all") {
      return Object.values(globs).map((g) => path.join(root, g))
    }

    const pattern = globs[area]
    if (!pattern) {
      return []
    }
    return [path.join(root, pattern)]
  }

  /**
   * Returns the absolute path to the HTTP types directory for a given domain.
   */
  static getHttpTypesDir(domain: string): string {
    return FsHelpers.fromRoot(Config.get().outputBase, domain)
  }

  /**
   * Resolves the HTTP types domain name for a given validator route directory name,
   * applying overrides and singularization as needed.
   */
  static resolveHttpDomain(routeDirName: string): string {
    return (
      PathMapper.ENTITY_NAME_OVERRIDES[routeDirName] ??
      PathMapper.singularizeRouteName(routeDirName)
    )
  }

  /**
   * Filters a list of validator file paths to only those matching the given domain name.
   */
  static filterValidatorsByDomain(files: string[], domain: string): string[] {
    const pattern = new RegExp(Config.get().validatorPathPattern)
    return files.filter((f) => {
      const match = f.replace(/\\/g, "/").match(pattern)
      return match && match[2] === domain
    })
  }
}
