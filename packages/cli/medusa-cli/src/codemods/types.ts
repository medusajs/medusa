/**
 * Options for running a codemod
 */
export interface CodemodOptions {
  /**
   * Run the codemod without making actual file changes
   */
  dryRun?: boolean
}

/**
 * Result of running a codemod
 */
export interface CodemodResult {
  /**
   * Total number of files scanned for changes
   */
  filesScanned: number
  /**
   * Number of files that were modified
   */
  filesModified: number
  /**
   * Number of errors encountered during execution
   */
  errors: number
}

/**
 * A codemod that can be executed to transform code
 */
export interface Codemod {
  /**
   * Unique identifier for the codemod
   */
  name: string
  /**
   * Human-readable description of what the codemod does
   */
  description: string
  /**
   * Function that executes the codemod
   */
  run: (options: CodemodOptions) => Promise<CodemodResult>
}
