import {
  copyFile as __copyFile,
  mkdirp as __mkdirp,
  pathExists as __pathExists,
  readFile as __readFile,
  remove as __remove,
  writeFile as __writeFile,
} from "fs-extra"

// Export calls (needed for mocking)
export const readFile = __readFile
export const writeFile = __writeFile
export const copyFile = __copyFile
export const exists = __pathExists
export const mkdir = __mkdirp
export const rmdir = __remove
