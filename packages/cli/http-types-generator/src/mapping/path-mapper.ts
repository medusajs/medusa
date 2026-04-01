import path from "path"
import pluralize from "pluralize"
import { FsHelpers } from "../utils/fs-helpers"

export interface PathMapping {
  /** "admin" or "store" */
  area: "admin" | "store"
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

  /** Base directory for HTTP types in the types package. */
  private static readonly HTTP_TYPES_BASE = "packages/core/types/src/http"

  /** Base directory for validator files in the medusa package. */
  private static readonly VALIDATORS_BASE_ADMIN = "packages/medusa/src/api/admin"
  private static readonly VALIDATORS_BASE_STORE = "packages/medusa/src/api/store"

  /** Patterns for validator file paths */
  private static readonly VALIDATOR_ADMIN_PATTERN =
    /\/api\/admin\/([^/]+)\/validators\.ts$/
  private static readonly VALIDATOR_STORE_PATTERN =
    /\/api\/store\/([^/]+)\/validators\.ts$/

  private static readonly DOMAIN_FILTER_RE =
    /\/api\/(admin|store)\/([^/]+)\/validators\.ts$/

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

    let area: "admin" | "store" | undefined
    let routeDirName: string | undefined

    const adminMatch = normalized.match(PathMapper.VALIDATOR_ADMIN_PATTERN)
    const storeMatch = normalized.match(PathMapper.VALIDATOR_STORE_PATTERN)

    if (adminMatch) {
      area = "admin"
      routeDirName = adminMatch[1]
    } else if (storeMatch) {
      area = "store"
      routeDirName = storeMatch[1]
    }

    if (!area || !routeDirName) {
      return undefined
    }

    const domain = PathMapper.resolveHttpDomain(routeDirName)
    const outputDir = FsHelpers.fromRoot(PathMapper.HTTP_TYPES_BASE, domain, area)

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
   */
  static getValidatorGlobs(area: "admin" | "store" | "all"): string[] {
    const monorepoRoot = FsHelpers.fromRoot()
    const globs: string[] = []

    if (area === "admin" || area === "all") {
      globs.push(
        path.join(
          monorepoRoot,
          PathMapper.VALIDATORS_BASE_ADMIN,
          "*",
          "validators.ts"
        )
      )
    }
    if (area === "store" || area === "all") {
      globs.push(
        path.join(
          monorepoRoot,
          PathMapper.VALIDATORS_BASE_STORE,
          "*",
          "validators.ts"
        )
      )
    }

    return globs
  }

  /**
   * Returns the absolute path to the HTTP types directory for a given domain.
   */
  static getHttpTypesDir(domain: string): string {
    return FsHelpers.fromRoot(PathMapper.HTTP_TYPES_BASE, domain)
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
    return files.filter((f) => {
      const match = f.match(PathMapper.DOMAIN_FILTER_RE)
      return match && match[2] === domain
    })
  }
}
