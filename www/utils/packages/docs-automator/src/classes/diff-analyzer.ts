import { execSync } from "child_process"
import { ChangedPackage, PackageKind } from "../types/index.js"
import getMonorepoRoot from "../utils/get-monorepo-root.js"

const MAX_DIFF_LINES_PER_FILE = 500
const MAX_FILES_PER_PACKAGE = 10

// File patterns that are not doc-relevant regardless of content
const SKIP_FILE_PATTERNS = [
  /\.spec\.(ts|tsx|js|jsx)$/,
  /\.test\.(ts|tsx|js|jsx)$/,
  /\/__tests__\//,
  /\/fixtures\//,
  /\/migrations\//,
  /\/__mocks__\//,
]

// File patterns that are always doc-relevant
const DOC_RELEVANT_PATTERNS = [
  /\/src\/services\//,
  /\/src\/models\//,
  /\/src\/.*\/workflows\//,
  /\/src\/.*\/steps\//,
  /\.ts$/, // catch-all: TypeScript files may export public APIs
]

export class DiffAnalyzer {
  private monorepoRoot: string

  constructor() {
    this.monorepoRoot = getMonorepoRoot()
  }

  async analyze(commitSha: string): Promise<ChangedPackage[]> {
    const allFiles = this.getCommitFiles(commitSha)
    const packageFiles = allFiles.filter((f) => f.startsWith("packages/"))

    if (packageFiles.length === 0) {
      return []
    }

    const packageMap = this.groupByPackage(packageFiles)
    const result: ChangedPackage[] = []

    for (const [packagePath, files] of packageMap) {
      const kind = this.classifyKind(packagePath)

      const docRelevantFiles = files.filter((f) => this.isDocRelevant(f))
      // For known kinds, skip if no doc-relevant files.
      // For "other", include even without a relevance filter so Claude
      // can decide whether the change warrants documentation updates.
      if (docRelevantFiles.length === 0 && kind !== "other") {
        continue
      }

      const filesToDiff = kind === "other" ? files : docRelevantFiles
      const diff = this.getDiff(commitSha, filesToDiff)

      result.push({
        path: packagePath,
        name: packagePath.split("/").pop() ?? packagePath,
        kind,
        files: filesToDiff,
        diff,
      })
    }

    return result
  }

  private getCommitFiles(commitSha: string): string[] {
    try {
      const output = execSync(
        `git diff-tree --no-commit-id -r --name-only ${commitSha}`,
        { cwd: this.monorepoRoot }
      )
        .toString()
        .trim()

      return output.split("\n").filter(Boolean)
    } catch {
      return []
    }
  }

  private groupByPackage(files: string[]): Map<string, string[]> {
    const packageMap = new Map<string, string[]>()

    for (const file of files) {
      const parts = file.split("/")
      // Group by first 3 path segments: packages/<category>/<name>
      // e.g. "packages/modules/product" or "packages/core/framework"
      const packagePath = parts.slice(0, 3).join("/")
      if (!packageMap.has(packagePath)) {
        packageMap.set(packagePath, [])
      }
      packageMap.get(packagePath)!.push(file)
    }

    return packageMap
  }

  private classifyKind(packagePath: string): PackageKind {
    if (packagePath.startsWith("packages/modules/")) {
      return "module"
    }
    if (packagePath.startsWith("packages/core/core-flows")) {
      return "core-flow"
    }
    if (
      packagePath.startsWith("packages/core/framework") ||
      packagePath.startsWith("packages/core/utils") ||
      packagePath.startsWith("packages/core/")
    ) {
      return "framework"
    }
    if (packagePath.startsWith("packages/admin/")) {
      return "admin"
    }
    if (packagePath.startsWith("packages/design-system/")) {
      return "design-system"
    }
    if (packagePath.startsWith("packages/cli/")) {
      return "cli"
    }
    return "other"
  }

  private isDocRelevant(filePath: string): boolean {
    for (const pattern of SKIP_FILE_PATTERNS) {
      if (pattern.test(filePath)) {
        return false
      }
    }
    for (const pattern of DOC_RELEVANT_PATTERNS) {
      if (pattern.test(filePath)) {
        return true
      }
    }
    return false
  }

  private getDiff(commitSha: string, files: string[]): string {
    const filesToDiff = files.slice(0, MAX_FILES_PER_PACKAGE)
    let combined = ""

    for (const file of filesToDiff) {
      try {
        const raw = execSync(
          `git diff ${commitSha}~1 ${commitSha} -- "${file}"`,
          { cwd: this.monorepoRoot }
        ).toString()

        const lines = raw.split("\n")
        const truncated =
          lines.length > MAX_DIFF_LINES_PER_FILE
            ? [
                ...lines.slice(0, MAX_DIFF_LINES_PER_FILE),
                `... (${lines.length - MAX_DIFF_LINES_PER_FILE} more lines truncated)`,
              ]
            : lines

        combined += `### ${file}\n\`\`\`diff\n${truncated.join("\n")}\n\`\`\`\n\n`
      } catch {
        combined += `### ${file}\n(diff unavailable)\n\n`
      }
    }

    if (files.length > MAX_FILES_PER_PACKAGE) {
      combined += `... and ${files.length - MAX_FILES_PER_PACKAGE} more files not shown.\n`
    }

    return combined
  }
}
