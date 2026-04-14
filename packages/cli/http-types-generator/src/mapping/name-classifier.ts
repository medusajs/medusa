import { Config } from "../config"

/**
 * Target file categories for schema outputs.
 * - `payloads` → `payloads.ts` (request body types: create, update, batch, etc.)
 * - `queries`  → `queries.ts` (query parameter types: list, filter, select params)
 * - `skip`     → do not generate a type for this schema
 */
export type FileTarget = "payloads" | "queries" | "skip"

/**
 * Classifies Zod schema export names into the appropriate output file category.
 */
export class NameClassifier {
  /**
   * Patterns in the schema name that indicate a query/filter type.
   * These go into `queries.ts`.
   */
  private static readonly QUERY_PATTERNS = [
    /Params$/,
    /Filters?$/,
    /ListParams$/,
    /FilterFields$/,
    /^StoreGet/,
    /^AdminGet/,
  ]

  /**
   * Patterns in the schema name that indicate a payload type.
   * These go into `payloads.ts`.
   */
  private static readonly PAYLOAD_PATTERNS = [
    /Create[A-Z]/,
    /Update[A-Z]/,
    /Batch[A-Z]/,
    /Import[A-Z]/,
    /Export[A-Z]/,
    /Link[A-Z]/,
    /[A-Z]Request$/,
    /[A-Z]Payload$/,
  ]

  /**
   * These intermediate/internal helper schemas should not generate HTTP types.
   */
  private static readonly SKIP_PATTERNS = [
    /ParamsFields$/,
    /ParamsDirectFields$/,
    /ParamsBase$/,
    /ParamsTransform$/,
    /Schema$/,
  ]

  /**
   * Classifies a Zod schema export name into the appropriate output file category.
   *
   * @param name - The exported variable name from the validator file.
   * @returns The target file category. Returns "skip" if no type should be generated for this schema.
   */
  static classify(name: string): FileTarget {
    if (name === "skip") {
      return "skip"
    }
    // Must have one of the configured public prefixes to be an HTTP type
    const prefixes = Config.get().publicPrefixes
    if (!prefixes.some((prefix) => name.startsWith(prefix))) {
      return "skip"
    }

    // Skip intermediate/helper schemas
    if (NameClassifier.SKIP_PATTERNS.some((p) => p.test(name))) {
      return "skip"
    }

    // Check if it's a query/filter type
    if (NameClassifier.QUERY_PATTERNS.some((p) => p.test(name))) {
      return "queries"
    }

    // Check if it's a payload type
    if (NameClassifier.PAYLOAD_PATTERNS.some((p) => p.test(name))) {
      return "payloads"
    }

    // Default: treat as a payload type
    return "payloads"
  }
}
