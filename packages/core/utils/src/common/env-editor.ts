import { join } from "path"
import { writeFile, readFile } from "fs/promises"

/**
 * Exposes the API to edit Env files
 */
export class EnvEditor {
  #appRoot: string
  #files: {
    exists: boolean
    contents: string[]
    filePath: string
  }[] = []

  constructor(appRoot: string) {
    this.#appRoot = appRoot
  }

  /**
   * Reads a file and returns with contents. Ignores error
   * when file is missing
   */
  async #readFile(filePath: string) {
    try {
      const contents = await readFile(filePath, "utf-8")
      return {
        exists: true,
        contents: contents.split(/\r?\n/),
        filePath,
      }
    } catch (error) {
      if (error.code === "ENOENT") {
        return {
          exists: false,
          contents: [],
          filePath,
        }
      }
      throw error
    }
  }

  /**
   * Loads .env and .env.template files for editing.
   */
  async load() {
    this.#files = await Promise.all(
      [join(this.#appRoot, ".env"), join(this.#appRoot, ".env.template")].map(
        (filePath) => this.#readFile(filePath)
      )
    )
  }

  /**
   * Returns the value for an existing key from the
   * ".env" file
   */
  get(key: string): string | null {
    const envFile = this.#files.find((file) => file.filePath.endsWith(".env"))
    if (!envFile) {
      return null
    }
    const matchingLine = envFile.contents.find((line) =>
      line.startsWith(`${key}=`)
    )
    if (!matchingLine) {
      return null
    }

    const [_, ...rest] = matchingLine.split("=")
    return rest.join("=")
  }

  /**
   * Set key-value pair to the dot-env files.
   *
   * If `withEmptyTemplateValue` is true then the key will be added with an empty value
   * to the `.env.template` file.
   */
  set(
    key: string,
    value: string | number | boolean,
    options?: {
      withEmptyTemplateValue: boolean
    }
  ) {
    const withEmptyTemplateValue = options?.withEmptyTemplateValue ?? false
    this.#files.forEach((file) => {
      let entryIndex = file.contents.findIndex((line) =>
        line.startsWith(`${key}=`)
      )
      const writeIndex = entryIndex === -1 ? file.contents.length : entryIndex

      if (withEmptyTemplateValue && file.filePath.endsWith(".env.template")) {
        /**
         * Do not remove existing template value (if any)
         */
        if (entryIndex === -1) {
          file.contents[writeIndex] = `${key}=`
        }
      } else {
        file.contents[writeIndex] = `${key}=${value}`
      }
    })
  }

  /**
   * Get files and their contents as JSON
   */
  toJSON() {
    return this.#files
  }

  /**
   * Save changes back to the disk
   */
  async save() {
    await Promise.all(
      this.#files.map((file) => {
        return writeFile(file.filePath, file.contents.join("\n"))
      })
    )
  }
}
