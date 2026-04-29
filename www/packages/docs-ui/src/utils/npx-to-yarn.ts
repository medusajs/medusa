/**
 * Converts an npx command to its yarn or pnpm equivalent
 * Assumes the package is installed locally in node_modules
 * @param npxCommand - The npx command to convert (e.g., "npx medusa db:migrate")
 * @param packageManager - The target package manager ("yarn" or "pnpm")
 * @param isExecutable - Whether the command is being run as an executable (default: false)
 * @returns The converted command
 *
 * @example
 * npxToYarn("npx medusa db:migrate", "yarn") // "yarn medusa db:migrate"
 * npxToYarn("npx medusa db:migrate", "pnpm") // "pnpm medusa db:migrate"
 * npxToYarn("npx create-medusa-app@latest \\\n  --db-url postgres://localhost/medusa", "yarn", true)
 * // "yarn dlx create-medusa-app@latest \\\n  --db-url postgres://localhost/medusa"
 * npxToYarn("npx medusa db:migrate\nnpx medusa develop", "yarn")
 * // "yarn medusa db:migrate\nyarn medusa develop"
 */
export function npxToYarn(
  npxCommand: string,
  packageManager: "yarn" | "pnpm",
  isExecutable: boolean = false
): string {
  // Remove leading/trailing whitespace
  const trimmed = npxCommand.trim()

  // Split by lines to handle multiple commands
  const lines = trimmed.split("\n")

  const convertedLines = lines.map((line) => {
    const trimmedLine = line.trim()

    // Check if line starts with npx
    if (!trimmedLine.startsWith("npx ")) {
      return line
    }

    // Remove "npx " prefix and replace with the target package manager
    const command = trimmedLine.slice(4)
    const leadingWhitespace = line.match(/^(\s*)/)?.[1] || ""

    let converted: string
    if (packageManager === "yarn") {
      converted = isExecutable ? `yarn dlx ${command}` : `yarn ${command}`
    } else if (packageManager === "pnpm") {
      converted = isExecutable ? `pnpm dlx ${command}` : `pnpm ${command}`
    } else {
      converted = trimmedLine
    }

    return leadingWhitespace + converted
  })

  return convertedLines.join("\n")
}
