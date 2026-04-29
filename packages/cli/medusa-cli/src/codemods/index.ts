import type { Codemod } from "./types"
import replaceZodImports from "./replace-zod-imports"

/**
 * Registry of available codemods
 */
const CODEMODS: Record<string, Codemod> = {
  "replace-zod-imports": replaceZodImports,
}

/**
 * Get a codemod by name
 * @param name - The name of the codemod to retrieve
 * @returns The codemod if found, null otherwise
 */
export function getCodemod(name: string): Codemod | null {
  return CODEMODS[name] || null
}

/**
 * List all available codemod names
 * @returns Array of codemod names
 */
export function listCodemods(): string[] {
  return Object.keys(CODEMODS)
}
