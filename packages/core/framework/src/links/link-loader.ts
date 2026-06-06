import { Logger } from "@zjedene-medusa/types"
import { dynamicImport, promiseAll, readDirRecursive } from "@zjedene-medusa/utils"
import { Dirent } from "fs"
import { access } from "fs/promises"
import { join } from "path"
import { logger as defaultLogger } from "../logger"

export class LinkLoader {
  /**
   * The directory from which to load the links
   * @private
   */
  #sourceDir: string | string[]

  /**
   * The list of file names to exclude from the subscriber scan
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
   * Load links from the source paths, links are registering themselves,
   * therefore we only need to import them
   */
  async load() {
    const normalizedSourcePath = Array.isArray(this.#sourceDir)
      ? this.#sourceDir
      : [this.#sourceDir]

    const promises = normalizedSourcePath.map(async (sourcePath) => {
      try {
        await access(sourcePath)
      } catch {
        this.#logger.info(`No link to load from ${sourcePath}. skipped.`)
        return
      }

      return await readDirRecursive(sourcePath).then(async (entries) => {
        const fileEntries = entries.filter((entry: Dirent) => {
          return (
            !entry.isDirectory() &&
            !this.#excludes.some((exclude) => exclude.test(entry.name))
          )
        })

        this.#logger.debug(`Registering links from ${sourcePath}.`)

        return await promiseAll(
          fileEntries.map(async (entry: Dirent) => {
            const fullPath = join(entry.path, entry.name)
            return await dynamicImport(fullPath)
          })
        )
      })
    })

    await promiseAll(promises)

    this.#logger.debug(`Links registered.`)
  }
}
