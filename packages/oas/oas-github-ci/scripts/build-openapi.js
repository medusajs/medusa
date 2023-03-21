#!/usr/bin/env node

const fs = require("fs/promises")
const os = require("os")
const path = require("path")
const execa = require("execa")
const yaml = require("js-yaml")
const OpenAPIParser = require("@readme/openapi-parser")

const isDryRun = process.argv.indexOf("--dry-run") !== -1
const shouldGenerateSample = process.argv.indexOf("--generate-samples") !== -1
const basePath = path.resolve(__dirname, `../`)
const repoRootPath = path.resolve(basePath, `../../../`)
const docsApiPath = path.resolve(repoRootPath, "docs/api/")
const redoclyConfigPath = path.resolve(
  repoRootPath,
  "docs-util/redocly/config.yaml"
)

const run = async () => {
  const outputPath = isDryRun ? await getTmpDirectory() : docsApiPath

  for (const apiType of ["store", "admin"]) {
    await generateOASSource(outputPath, apiType)
    const inputJsonFile = path.resolve(outputPath, `${apiType}.oas.json`)
    const outputYamlFile = path.resolve(outputPath, `${apiType}.oas.yaml`)
    const referenceOutputDir = path.resolve(docsApiPath, apiType)
    const samplesSubDir = "generated"
    if (!isDryRun && shouldGenerateSample) {
      await generateCodeSamples(
        inputJsonFile,
        referenceOutputDir,
        samplesSubDir,
        apiType
      )
    }
    try {
      await sanitizeOAS(inputJsonFile)
      await circularReferenceCheck(inputJsonFile)
    } catch (err) {
      if (!isDryRun && shouldGenerateSample) {
        await cleanUpGeneratedCodeSample(
          referenceOutputDir,
          samplesSubDir,
          apiType
        )
      }
      throw err
    }
    await jsonFileToYamlFile(inputJsonFile, outputYamlFile)

    if (!isDryRun) {
      if (shouldGenerateSample) {
        await cleanUpGeneratedCodeSample(
          referenceOutputDir,
          samplesSubDir,
          apiType
        )
      }
      await generateReference(outputYamlFile, referenceOutputDir)
    }
  }
}

/**
 * We are generating the samples into the referenceOutputDir to allow
 * `sanitizeOAS` to resolve their reference during bundling.
 */
const generateCodeSamples = async (
  inputJsonFile,
  referenceOutputDir,
  samplesSubDir,
  apiType
) => {
  const jsonString = await fs.readFile(inputJsonFile, "utf8")
  const jsonObject = JSON.parse(jsonString)
  if (!jsonObject["paths"]) {
    return
  }
  const samplesOutputDir = path.resolve(referenceOutputDir, samplesSubDir)

  await _generateClientCodeSample(inputJsonFile, samplesOutputDir)
  for (const [route, path] of Object.entries(jsonObject["paths"])) {
    for (const [method, operation] of Object.entries(path)) {
      if (!operation["operationId"]) {
        continue
      }
      if (operation["x-codeSamples"]) {
        delete operation["x-codeSamples"]
      }
      if (operation["x-code-samples"]) {
        delete operation["x-code-samples"]
      }
      operation["x-codeSamples"] = [
        {
          /**
           * Redocly does not have an entry for TypeScript.
           * Plus, it seems to be using `lang` as an index,
           * so we can't have two entries with the same `lang`.
           */
          lang: "js",
          label: "TS Client",
          source: {
            $ref: `./${apiType}/${samplesSubDir}/samples/ts/${operation["operationId"]}.ts`,
          },
        },
        {
          lang: "JavaScript",
          label: "JS Client",
          source: {
            $ref: `./${apiType}/${samplesSubDir}/samples/js/${operation["operationId"]}.js`,
          },
        },
        {
          lang: "cURL",
          source: {
            $ref: `./${apiType}/${samplesSubDir}/samples/sh/${operation["operationId"]}.sh`,
          },
        },
      ]
    }
  }
  const outJsonString = JSON.stringify(jsonObject, null, 2)
  await fs.writeFile(inputJsonFile, outJsonString, "utf8")
}
const _generateClientCodeSample = async (srcFile, outDir) => {
  const params = [
    "client",
    `--component=samples`,
    `--client-package=@medusajs/medusa-js`,
    `--src-file=${srcFile}`,
    `--out-dir=${outDir}`,
  ]
  const { all: logs } = await execa("medusa-oas", params, {
    cwd: basePath,
    all: true,
  })
  console.log(logs)
}
const cleanUpGeneratedCodeSample = async (
  referenceOutputDir,
  samplesSubDir
) => {
  return
  const samplesOutputDir = path.resolve(referenceOutputDir, samplesSubDir)
  await fs.rm(samplesOutputDir, { recursive: true, force: true })
}

const generateOASSource = async (outDir, apiType) => {
  const params = ["oas", `--type=${apiType}`, `--out-dir=${outDir}`]
  const { all: logs } = await execa("medusa-oas", params, {
    cwd: basePath,
    all: true,
  })
  console.log(logs)
}

const jsonFileToYamlFile = async (inputJsonFile, outputYamlFile) => {
  const jsonString = await fs.readFile(inputJsonFile, "utf8")
  const jsonObject = JSON.parse(jsonString)
  const yamlString = yaml.dump(jsonObject)
  await fs.writeFile(outputYamlFile, yamlString, "utf8")
}

const sanitizeOAS = async (srcFile) => {
  const { all: logs } = await execa(
    "redocly",
    ["bundle", srcFile, `--output=${srcFile}`, `--config=${redoclyConfigPath}`],
    { cwd: basePath, all: true }
  )
  console.log(logs)
}

const circularReferenceCheck = async (srcFile) => {
  const parser = new OpenAPIParser()
  await parser.validate(srcFile, {
    dereference: {
      circular: "ignore",
    },
  })
  if (parser.$refs.circular) {
    const fileName = path.basename(srcFile)
    const circularRefs = [...parser.$refs.circularRefs]
    circularRefs.sort()
    console.log(circularRefs)
    throw new Error(
      `🔴 Unhandled circular references - ${fileName} - Please patch in docs-util/redocly/config.yaml`
    )
  }
  console.log(`🟢 All circular references handled`)
}

const generateReference = async (srcFile, outDir) => {
  await fs.rm(outDir, { recursive: true, force: true })
  const { all: logs } = await execa(
    "redocly",
    ["split", srcFile, `--outDir=${outDir}`],
    { cwd: basePath, all: true }
  )
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
