import getMonorepoRoot from "../utils/get-monorepo-root.js"
import promiseExec from "../utils/promise-exec.js"
import ts from "typescript"
import { ESLint, Linter } from "eslint"
import path from "path"
import dirname from "../utils/dirname.js"
import { minimatch } from "minimatch"
import { existsSync } from "fs"
import getRelativePaths from "../utils/get-relative-paths.js"

class Formatter {
  protected cwd: string
  protected eslintConfig?: Linter.Config
  protected generalESLintConfig?: Linter.ConfigOverride<Linter.RulesRecord>
  protected configForFile: Map<
    string,
    Linter.ConfigOverride<Linter.RulesRecord>
  >

  constructor() {
    this.cwd = getMonorepoRoot()
    this.configForFile = new Map()
  }

  normalizeCommentNewLine(content: string) {
    return content.replaceAll(/\*\/\s*(.)/g, "*/\n$1")
  }

  normalizeConfigObject(
    config: Linter.ConfigOverride<Linter.RulesRecord>,
    fileName?: string
  ): Linter.ConfigOverride<Linter.RulesRecord> {
    // clone config
    const newConfig = structuredClone(config)
    if (!newConfig.parserOptions) {
      return newConfig
    }

    if (fileName) {
      const packagePattern = /^(?<packagePath>.*\/packages\/[^/]*).*$/
      // try to manually set the project of the parser options
      const matchFilePackage = packagePattern.exec(fileName)

      if (matchFilePackage?.groups?.packagePath) {
        const tsConfigPath = path.join(
          matchFilePackage.groups.packagePath,
          "tsconfig.json"
        )
        const tsConfigSpecPath = path.join(
          matchFilePackage.groups.packagePath,
          "tsconfig.spec.json"
        )

        newConfig.parserOptions.project = [
          existsSync(tsConfigSpecPath)
            ? tsConfigSpecPath
            : existsSync(tsConfigPath)
              ? tsConfigPath
              : [
                  ...getRelativePaths(
                    newConfig.parserOptions.project || [],
                    this.cwd
                  ),
                ],
        ]
      }
    } else if (newConfig.parserOptions.project?.length) {
      // fix parser projects paths to be relative to this script
      newConfig.parserOptions.project = getRelativePaths(
        newConfig.parserOptions.project as string[],
        this.cwd
      )
    }

    return newConfig
  }

  async getESLintConfig() {
    if (this.eslintConfig) {
      return
    }

    this.eslintConfig = (
      await import(
        path.relative(dirname(), path.join(this.cwd, ".eslintrc.js"))
      )
    ).default as Linter.Config

    this.generalESLintConfig = this.eslintConfig!.overrides?.find((item) =>
      item.files.includes("*.ts")
    )

    if (this.generalESLintConfig) {
      this.generalESLintConfig = this.normalizeConfigObject(
        this.generalESLintConfig
      )
    }
  }

  async getESLintConfigForFile(
    filePath: string
  ): Promise<Linter.ConfigOverride<Linter.RulesRecord> | undefined> {
    await this.getESLintConfig()

    if (this.configForFile.has(filePath)) {
      return this.configForFile.get(filePath)!
    }

    let relevantConfig = this.eslintConfig!.overrides?.find((item) => {
      if (typeof item.files === "string") {
        return minimatch(filePath, item.files)
      }

      return item.files.some((file) => minimatch(filePath, file))
    })

    if (!relevantConfig && !this.generalESLintConfig) {
      return undefined
    }

    relevantConfig = this.normalizeConfigObject(
      structuredClone(relevantConfig || this.generalESLintConfig!),
      filePath
    )

    relevantConfig!.files = [path.relative(this.cwd, filePath)]

    this.configForFile.set(filePath, relevantConfig)

    return relevantConfig
  }

  async formatFileWithEslint(filePath: string) {
    const cwd = getMonorepoRoot()

    try {
      await promiseExec(`yarn lint:path ${filePath} --fix`, {
        cwd,
      })
    } catch (e) {
      console.error(`Error while formatting with ESLint: ${e}`)
    }
  }

  async formatFile(path: string, content: string) {
    await this.formatFileWithEslint(path)

    const formattedContent = ts.sys.readFile(path)

    const normalizedFileContent = this.normalizeCommentNewLine(
      formattedContent || content
    )

    if (normalizedFileContent !== formattedContent) {
      ts.sys.writeFile(path, normalizedFileContent)

      await this.formatFileWithEslint(path)
    }
  }

  async formatStrWithEslint(content: string, fileName: string) {
    const relevantConfig = await this.getESLintConfigForFile(fileName)

    const eslint = new ESLint({
      overrideConfig: {
        ...this.eslintConfig,
        overrides: relevantConfig ? [relevantConfig] : undefined,
      },
      cwd: this.cwd,
      resolvePluginsRelativeTo: this.cwd,
      fix: true,
      ignore: false,
    })

    let newContent = content
    const result = await eslint.lintText(content, {
      filePath: fileName,
    })

    if (result.length) {
      newContent = result[0].output || newContent
    }

    return newContent
  }

  async formatStr(content: string, fileName: string) {
    const newContent = await this.formatStrWithEslint(content, fileName)

    let normalizedContent = this.normalizeCommentNewLine(newContent)

    if (normalizedContent !== newContent) {
      normalizedContent = await this.formatStrWithEslint(
        normalizedContent,
        fileName
      )
    }

    return normalizedContent
  }
}

export default Formatter
