import type { Resolver } from "react-hook-form"

/**
 * A minimal, Zod-v4-correct react-hook-form resolver.
 *
 * The installed `@hookform/resolvers@3.4.2` predates Zod 4 support and *throws*
 * the ZodError instead of mapping it to field errors, so validation failures
 * surface as an uncaught promise rejection and the user sees nothing. This
 * resolver `safeParse`s and maps each issue onto the RHF error tree so messages
 * render inline under their field.
 */
export function zodV4Resolver<TSchema extends { safeParse: (v: unknown) => any }>(
  schema: TSchema
): Resolver<any> {
  return async (values) => {
    const result = schema.safeParse(values)

    if (result.success) {
      return { values: result.data, errors: {} }
    }

    const errors: Record<string, any> = {}

    for (const issue of result.error.issues ?? []) {
      const path: Array<string | number> = issue.path ?? []

      if (path.length === 0) {
        errors.root = errors.root ?? { type: issue.code, message: issue.message }
        continue
      }

      let cursor: Record<string, any> = errors
      for (let i = 0; i < path.length - 1; i++) {
        const key = String(path[i])
        // Replace a leaf placeholder with a branch if a deeper path needs it.
        if (
          cursor[key] == null ||
          typeof cursor[key] !== "object" ||
          "message" in cursor[key]
        ) {
          cursor[key] = {}
        }
        cursor = cursor[key]
      }

      const leaf = String(path[path.length - 1])
      if (cursor[leaf] == null) {
        cursor[leaf] = { type: issue.code, message: issue.message }
      }
    }

    return { values: {}, errors }
  }
}
