import { promiseAll } from "@medusajs/utils"
import { logger } from "../logger"
import { access, readdir } from "fs/promises"
import { join } from "path"

export class WorkflowLoader {
  /**
   * The directory from which to load the workflows
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

  constructor(sourceDir: string | string[]) {
    this.#sourceDir = sourceDir
  }

  /**
   * Load workflows from the source paths, workflows are registering themselves,
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
        return
      }

      return await readdir(sourcePath, {
        recursive: true,
        withFileTypes: true,
      }).then(async (entries) => {
        const fileEntries = entries.filter((entry) => {
          return (
            !entry.isDirectory() &&
            !this.#excludes.some((exclude) => exclude.test(entry.name))
          )
        })

        logger.debug(`Registering workflows from ${sourcePath}.`)

        return await promiseAll(
          fileEntries.map(async (entry) => {
            const fullPath = join(entry.path, entry.name)
            return await import(fullPath)
          })
        )
      })
    })

    await promiseAll(promises)

    logger.debug(`Workflows registered.`)
  }
}
