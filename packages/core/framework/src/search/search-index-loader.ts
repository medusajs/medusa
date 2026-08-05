import { Logger } from "@medusajs/types"
import { dynamicImport, promiseAll, readDirRecursive } from "@medusajs/utils"
import { Dirent } from "fs"
import { access } from "fs/promises"
import { join } from "path"
import { logger as defaultLogger } from "../logger"

export class SearchIndexLoader {
  /**
   * The directory from which to load the search index definitions
   * @private
   */
  #sourceDir: string | string[]

  /**
   * The list of file names to exclude from the search index scan
   * @private
   */
  #excludes: RegExp[] = [
    /index\.js/,
    /index\.ts/,
    /\.DS_Store/,
    /(\.ts\.map|\.js\.map|\.d\.ts|\.md)/,
    /^_[^/\\]*(\.[^/\\]+)?$/,
  ]

  #logger: Logger

  constructor(sourceDir: string | string[], logger?: Logger) {
    this.#sourceDir = sourceDir
    this.#logger = logger ?? defaultLogger
  }

  /**
   * Load the search index definitions from the source paths. `defineSearchIndex`
   * registers them, so importing the files is all there is to do. What was
   * registered reaches the Search Module as its `indexes` option when the app
   * boots, which is why this has to run before `MedusaApp`.
   */
  async load() {
    const normalizedSourcePath = Array.isArray(this.#sourceDir)
      ? this.#sourceDir
      : [this.#sourceDir]

    const promises = normalizedSourcePath.map(async (sourcePath) => {
      try {
        await access(sourcePath)
      } catch {
        this.#logger.debug(
          `No search index to load from ${sourcePath}. skipped.`
        )
        return
      }

      return await readDirRecursive(sourcePath).then(async (entries) => {
        const fileEntries = entries.filter((entry: Dirent) => {
          return (
            !entry.isDirectory() &&
            !this.#excludes.some((exclude) => exclude.test(entry.name))
          )
        })

        this.#logger.debug(`Registering search indexes from ${sourcePath}.`)

        return await promiseAll(
          fileEntries.map(async (entry: Dirent) => {
            const fullPath = join(entry.path, entry.name)
            return await dynamicImport(fullPath)
          })
        )
      })
    })

    await promiseAll(promises)

    this.#logger.debug(`Search indexes registered.`)
  }
}
