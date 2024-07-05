import getMonorepoRoot from "../../utils/get-monorepo-root.js"
import { ESLint, Linter } from "eslint"
import path from "path"
import dirname from "../../utils/dirname.js"
import { minimatch } from "minimatch"
import { existsSync } from "fs"
import * as prettier from "prettier"
import getRelativePaths from "../../utils/get-relative-paths.js"

/**
 * A class used to apply formatting to files using ESLint and other formatting options.
 */
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

  /**
   * Adds new lines before and after a comment if it's preceeded/followed immediately by a word (not by an empty line).
   *
   * @param {string} content - The content to format.
   * @returns {string} The returned formatted content.
   */
  normalizeCommentNewLine(content: string): string {
    return content
      .replaceAll(/(.)\n(\s*)\/\*\*/g, "$1\n\n$2/**")
      .replaceAll(/\*\/\s*(.)/g, "*/\n$1")
  }

  /**
   * Normalizes an ESLint overrides configuration object. If a file name is specified, the configuration are normalized to
   * include the `tsconfig` related to the file. If a file name isn't specified, the tsconfig file path names
   * in the `parserConfig.project` array are normalized to have a full relative path (as that is required by ESLint).
   *
   * @param {Linter.ConfigOverride<Linter.RulesRecord>} config - The original configuration object.
   * @param {string} fileName - The file name that
   * @returns {Linter.ConfigOverride<Linter.RulesRecord>} The normalized and cloned configuration object.
   */
  normalizeOverridesConfigObject(
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
          existsSync(tsConfigPath)
            ? tsConfigPath
            : existsSync(tsConfigSpecPath)
              ? tsConfigSpecPath
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

  /**
   * Retrieves the general ESLint configuration and sets it to the `eslintConfig` class property, if it's not already set.
   * It also tries to set the `generalESLintConfig` class property to the override configuration in the `eslintConfig`
   * whose `files` array includes `*.ts`.
   */
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
      this.generalESLintConfig = this.normalizeOverridesConfigObject(
        this.generalESLintConfig
      )
    }
  }

  /**
   * Retrieves the normalized ESLint overrides configuration for a specific file.
   *
   * @param {string} filePath - The file's path.
   * @returns {Promise<Linter.ConfigOverride<Linter.RulesRecord> | undefined>} The normalized configuration object or `undefined` if not found.
   */
  async getESLintOverridesConfigForFile(
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

    relevantConfig = this.normalizeOverridesConfigObject(
      structuredClone(relevantConfig || this.generalESLintConfig!),
      filePath
    )

    relevantConfig!.files = [path.relative(this.cwd, filePath)]

    this.configForFile.set(filePath, relevantConfig)

    return relevantConfig
  }

  /**
   * Formats a string with ESLint.
   *
   * @param {string} content - The content to format.
   * @param {string} fileName - The path to the file that the content belongs to.
   * @returns {Promise<string>} The formatted content.
   */
  async formatStrWithEslint(
    content: string,
    fileName: string
  ): Promise<string> {
    const prettifiedContent = await this.formatStrWithPrettier(
      content,
      fileName
    )
    const relevantConfig = await this.getESLintOverridesConfigForFile(fileName)

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

    let newContent = prettifiedContent
    const result = await eslint.lintText(prettifiedContent, {
      filePath: fileName,
    })

    if (result.length) {
      newContent = result[0].output || newContent
    }

    return newContent
  }

  /**
   * Format a file's content with prettier.
   *
   * @param content - The content to format.
   * @param fileName - The name of the file the content belongs to.
   * @returns The formatted content
   */
  async formatStrWithPrettier(
    content: string,
    fileName: string
  ): Promise<string> {
    // load config of the file
    const prettierConfig = (await prettier.resolveConfig(fileName)) || undefined

    if (prettierConfig && !prettierConfig.parser) {
      prettierConfig.parser = "babel-ts"
    }

    return await prettier.format(content, prettierConfig)
  }

  /**
   * Applies all formatting types to a string.
   *
   * @param {string} content - The content to format.
   * @param {string} fileName - The path to the file that holds the content.
   * @returns {Promise<string>} The formatted content.
   */
  async formatStr(content: string, fileName: string): Promise<string> {
    const newContent = await this.formatStrWithEslint(content, fileName)

    let normalizedContent = this.normalizeCommentNewLine(newContent)

    if (normalizedContent !== newContent) {
      /**
       * Since adding the new lines after comments as done in {@link normalizeCommentNewLine} method may lead to linting errors,
       * we have to rerun the {@link formatStrWithEslint}. It's not possible to run {@link normalizeCommentNewLine} the first time
       * and provide the expected result.
       */
      normalizedContent = await this.formatStrWithEslint(
        normalizedContent,
        fileName
      )
    }

    return normalizedContent
  }

  /**
   * Adds comments of a source file to the top of the file's content. It should have additional extra line after the comment.
   * If the comment's length is 0, the `content` is returned as is.
   *
   * @param {string} comment - The comments of the source file.
   * @param {string} content - The source file's comments.
   * @returns {string} The full content with the comments.
   */
  addCommentsToSourceFile(comment: string, content: string): string {
    return comment.length ? `/**\n ${comment}*/\n\n${content}` : content
  }
}

export default Formatter
