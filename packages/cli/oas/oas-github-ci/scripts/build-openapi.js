#!/usr/bin/env node

const fs = require("fs/promises")
const os = require("os")
const path = require("path")
const execa = require("execa")

const isDryRun = process.argv.indexOf("--dry-run") !== -1
const withFullFile = process.argv.indexOf("--with-full-file") !== -1
const archiveVersionArg = process.argv.find((a) =>
  a.startsWith("--archive-version=")
)
const archiveVersion = archiveVersionArg ? archiveVersionArg.split("=")[1] : undefined
const basePath = path.resolve(__dirname, `../`)
const repoRootPath = path.resolve(basePath, `../../../../`)
const docsApiPath = path.resolve(repoRootPath, "www/apps/api-reference/specs")

const FULL_SPEC_FILE_NAME = "openapi.full.yaml"

const run = async () => {
  const oasOutDir = isDryRun ? await getTmpDirectory() : docsApiPath
  for (const apiType of ["store", "admin"]) {
    await archiveCurrentFullSpec(apiType)
    await generateOASSource(oasOutDir, apiType)
    const oasSrcFile = path.resolve(oasOutDir, `${apiType}.oas.json`)
    const docsOutDir = path.resolve(oasOutDir, apiType)
    await generateDocs(oasSrcFile, docsOutDir, apiType, isDryRun)
  }
}

/**
 * Copies the full OAS of the currently released version to
 * `specs/versions/{archiveVersion}` before it's overwritten by the generated
 * OAS of the new release. Must run before `generateDocs`, which cleans the
 * output directory.
 */
const archiveCurrentFullSpec = async (apiType) => {
  if (!archiveVersion || isDryRun) {
    return
  }

  const currentFile = path.resolve(docsApiPath, apiType, FULL_SPEC_FILE_NAME)
  if (!(await fileExists(currentFile))) {
    console.log(`Skipped archiving ${apiType}: ${currentFile} doesn't exist`)
    return
  }

  const archiveOutFile = path.resolve(
    docsApiPath,
    "versions",
    archiveVersion,
    apiType,
    FULL_SPEC_FILE_NAME
  )
  await fs.mkdir(path.dirname(archiveOutFile), { recursive: true })
  await fs.copyFile(currentFile, archiveOutFile)
  console.log(`Archived version ${archiveVersion} to ${archiveOutFile}`)
}

const fileExists = async (filePath) => {
  try {
    await fs.access(filePath)
    return true
  } catch {
    return false
  }
}

const generateOASSource = async (outDir, apiType) => {
  const commandParams = ["oas", `--type=${apiType}`, `--out-dir=${outDir}`, "--local"]
  const { all: logs } = await execa(
    "medusa-oas",
    commandParams,
    { cwd: basePath, all: true }
  )
  console.log(logs)
}

const generateDocs = async (srcFile, outDir, apiType, isDryRun) => {
  let params = [
    "docs",
    `--src-file=${srcFile}`,
    `--out-dir=${outDir}`,
    `--clean`,
    `--split`,
  ]
  if (isDryRun) {
    params.push("--dry-run")
  }
  await runMedusaOasCommand(params)
  if (withFullFile && !isDryRun) {
    console.log("Generating full file...")
    params = [
      "docs",
      `--src-file=${srcFile}`,
      `--out-dir=${outDir}`,
      `--main-file-name=${FULL_SPEC_FILE_NAME}`,
    ]
    await runMedusaOasCommand(params)
    console.log("Finished generating full file.")
  }
}

const runMedusaOasCommand = async (params) => {
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
  return await fs.mkdtemp(tmpDir)
}

void (async () => {
  try {
    await run()
  } catch (err) {
    console.log(err)
    process.exit(1)
  }
})()
