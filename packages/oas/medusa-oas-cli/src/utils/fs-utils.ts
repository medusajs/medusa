import { access, lstat, mkdtemp } from "fs/promises"
import path from "path"
import { sep } from "path"
import { tmpdir } from "os"

export async function isFile(filePath: string): Promise<boolean> {
  try {
    return (await lstat(path.resolve(filePath))).isFile()
  } catch (err) {
    console.log(err)
    return false
  }
}

export async function exists(filePath: string): Promise<boolean> {
  try {
    await access(path.resolve(filePath))
    return true
  } catch (err) {
    return false
  }
}

export const getTmpDirectory = async () => {
  /**
   * RUNNER_TEMP: GitHub action, the path to a temporary directory on the runner.
   */
  const tmpDir = process.env["RUNNER_TEMP"] ?? tmpdir()
  return await mkdtemp(`${tmpDir}${sep}`)
}
