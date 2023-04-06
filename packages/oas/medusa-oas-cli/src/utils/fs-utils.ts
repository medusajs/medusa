import fs, { lstat } from "fs/promises"
import path from "path"
import os from "os"

export async function isFile(filePath: string): Promise<boolean> {
  try {
    return (await lstat(path.resolve(filePath))).isFile()
  } catch (err) {
    console.log(err)
    return false
  }
}

export const getTmpDirectory = async () => {
  /**
   * RUNNER_TEMP: GitHub action, the path to a temporary directory on the runner.
   */
  const tmpDir = process.env["RUNNER_TEMP"] ?? os.tmpdir()
  return await fs.mkdtemp(tmpDir)
}

export const copyFile = async (srcFile: string, outFile: string) => {
  await fs.copyFile(srcFile, outFile)
}
