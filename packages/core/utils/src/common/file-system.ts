import { dirname, join } from "path"
import {
  promises,
  constants,
  type Dirent,
  type RmOptions,
  type StatOptions,
  type WriteFileOptions,
  type MakeDirectoryOptions,
} from "fs"

const { rm, stat, mkdir, access, readdir, readFile, writeFile } = promises

export type JSONFileOptions = WriteFileOptions & {
  spaces?: number | string
  replacer?: (this: any, key: string, value: any) => any
}

/**
 * File system abstraction to create and cleanup files during
 * tests
 */
export class FileSystem {
  constructor(public basePath: string) {}

  private makePath(filePath: string) {
    return join(this.basePath, filePath)
  }

  /**
   * Cleanup directory
   */
  async cleanup(options?: RmOptions) {
    return rm(this.basePath, {
      recursive: true,
      maxRetries: 10,
      force: true,
      ...options,
    })
  }

  /**
   * Creates a directory inside the root of the filesystem
   * path. You may use this method to create nested
   * directories as well.
   */
  mkdir(dirPath: string, options?: MakeDirectoryOptions) {
    return mkdir(this.makePath(dirPath), { recursive: true, ...options })
  }

  /**
   * Create a new file
   */
  async create(filePath: string, contents: string, options?: WriteFileOptions) {
    const absolutePath = this.makePath(filePath)
    await mkdir(dirname(absolutePath), { recursive: true })
    return writeFile(this.makePath(filePath), contents, options)
  }

  /**
   * Remove a file
   */
  async remove(filePath: string, options?: RmOptions) {
    return rm(this.makePath(filePath), {
      recursive: true,
      force: true,
      maxRetries: 2,
      ...options,
    })
  }

  /**
   * Check if the root of the filesystem exists
   */
  async rootExists() {
    try {
      await access(this.basePath, constants.F_OK)
      return true
    } catch (error) {
      if (error.code === "ENOENT") {
        return false
      }
      throw error
    }
  }

  /**
   * Check if a file exists
   */
  async exists(filePath: string) {
    try {
      await access(this.makePath(filePath), constants.F_OK)
      return true
    } catch (error) {
      if (error.code === "ENOENT") {
        return false
      }
      throw error
    }
  }

  /**
   * Returns file contents
   */
  async contents(filePath: string) {
    return readFile(this.makePath(filePath), "utf-8")
  }

  /**
   * Dumps file contents to the stdout
   */
  async dump(filePath: string) {
    console.log("------------------------------------------------------------")
    console.log(`file path => "${filePath}"`)
    console.log(`contents => "${await this.contents(filePath)}"`)
  }

  /**
   * Returns stats for a file
   */
  async stats(filePath: string, options?: StatOptions) {
    return stat(this.makePath(filePath), options)
  }

  /**
   * Recursively reads files from a given directory
   */
  readDir(dirPath?: string): Promise<Dirent[]> {
    const location = dirPath ? this.makePath(dirPath) : this.basePath
    return readdir(location, {
      recursive: true,
      withFileTypes: true,
    })
  }

  /**
   * Create a json file
   */
  async createJson(filePath: string, contents: any, options?: JSONFileOptions) {
    if (options && typeof options === "object") {
      const { replacer, spaces, ...rest } = options
      return this.create(
        filePath,
        JSON.stringify(contents, replacer, spaces),
        rest
      )
    }

    return this.create(filePath, JSON.stringify(contents), options)
  }

  /**
   * Read and parse a json file
   */
  async contentsJson(filePath: string) {
    const contents = await readFile(this.makePath(filePath), "utf-8")
    return JSON.parse(contents)
  }
}
