import execa from "execa"
import os from "os"
import fs from "fs/promises"
import path from "path"
import { sep } from "path"

const basePath = path.resolve(__dirname, `../`)

async function run() {
  const tmpDirPath = await getTmpDirectory()
  await generateOASSources(tmpDirPath)

  const oasFilePath = path.resolve(tmpDirPath, `combined.oas.json`)
  const outDirPath = path.resolve(basePath, "src/lib/")
  await generateClientTypes(oasFilePath, outDirPath, true)
}

const generateOASSources = async (outDir: string) => {
  const params = ["oas", `--out-dir=${outDir}`, "--type=combined", "--local"]
  const { all: logs } = await execa("medusa-oas", params, {
    cwd: basePath,
    all: true,
  })
  console.log(logs)
}

const generateClientTypes = async (
  srcFile: string,
  outDir: string,
  clean = false
) => {
  const params = [
    "client",
    `--src-file=${srcFile}`,
    `--out-dir=${outDir}`,
    "--type=combined",
    "--component=types",
  ]
  if (clean) {
    params.push("--clean")
  }

  const { all: logs } = await execa("medusa-oas", params, {
    cwd: basePath,
    all: true,
  })
  console.log(logs)
}

const getTmpDirectory = async () => {
  /**
   * RUNNER_TEMP: GitHub action, the path to a temporary directory on the runner.
   */
  const tmpDir = process.env["RUNNER_TEMP"] ?? os.tmpdir()
  return await fs.mkdtemp(`${tmpDir}${sep}`)
}

void (async () => {
  await run()
})()
