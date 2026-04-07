import prettier from "prettier"

export class Formatter {
  /**
   * Formats `content` using the Prettier config resolved for `filePath`.
   * The `filePath` is used both to resolve the nearest `.prettierrc` and
   * to let Prettier pick the correct parser (e.g. `typescript` for `.ts`).
   *
   * Returns the formatted content, or the original content if Prettier
   * cannot parse or format it.
   */
  static async format(content: string, filePath: string): Promise<string> {
    try {
      const config = (await prettier.resolveConfig(filePath)) || undefined
      if (config && !config.parser) {
        config.parser = "babel-ts"
      }
      return await prettier.format(content, config)
    } catch {
      return content
    }
  }
}
