import { ConfigModule } from "@medusajs/types"
import { transformFile } from "@swc/core"
import { getConfigFile } from "@medusajs/utils"
import { existsSync } from "node:fs"
import { copyFile, mkdir, readdir, rm, writeFile } from "node:fs/promises"
import path from "path"

type BuildArgs = {
  directory: string
}

type FileConfig = {
  inputDir: string
  outputDir: string
  targetExtension?: string
}

const INPUT_DIR = "./src"
const OUTPUT_DIR = "./dist"

const COMPILE_EXTENSIONS = [".ts", ".tsx", ".js", ".jsx"]
const IGNORE_EXTENSIONS = [".md"]

async function clean(path: string) {
  await rm(path, { recursive: true }).catch(() => {})
}

async function findFiles(dir: string): Promise<string[]> {
  try {
    const files = await readdir(dir, { withFileTypes: true })
    const paths = await Promise.all(
      files.map(async (file) => {
        const res = path.join(dir, file.name)
        return file.isDirectory() ? findFiles(res) : res
      })
    )
    return paths.flat()
  } catch (e) {
    console.log(`Failed to read directory ${dir}`)
    throw e
  }
}

const getOutputPath = (file: string, config: FileConfig) => {
  const { inputDir, outputDir, targetExtension } = config

  const inputDirName = path.basename(inputDir)
  const outputDirName = path.basename(outputDir)

  const relativePath = file.replace(inputDirName, outputDirName)
  let outputPath = relativePath

  if (targetExtension) {
    const currentExtension = path.extname(outputPath)
    outputPath = outputPath.replace(currentExtension, targetExtension)
  }

  return outputPath
}

const writeToOut = async (
  file: string,
  content: string,
  config: FileConfig
) => {
  const outputPath = getOutputPath(file, config)

  await mkdir(outputPath.replace(/\/[^/]+$/, ""), { recursive: true })
  await writeFile(outputPath, content)
}

async function copyToOut(file: string, config: FileConfig) {
  const outputPath = getOutputPath(file, config)
  const dirNameRegex = new RegExp("\\" + path.sep + "([^\\" + path.sep + "]+)$")

  await mkdir(outputPath.replace(dirNameRegex, ""), { recursive: true })
  await copyFile(file, outputPath)
}

const medusaTransform = async (file: string) => {
  if (COMPILE_EXTENSIONS.some((ext) => file.endsWith(ext))) {
    const outputPath = getOutputPath(file, {
      inputDir: INPUT_DIR,
      outputDir: OUTPUT_DIR,
    })
    const output = await transformFile(file, {
      sourceFileName: path.relative(path.dirname(outputPath), file),
      sourceMaps: "inline",
      module: {
        type: "commonjs",
      },
      jsc: {
        parser: {
          syntax: "typescript",
          decorators: true,
        },
        transform: {
          decoratorMetadata: true,
        },
        target: "es2021",
        externalHelpers: true,
      },
    })
    await writeToOut(file, output.code, {
      inputDir: INPUT_DIR,
      outputDir: OUTPUT_DIR,
      targetExtension: ".js",
    })
  } else if (!IGNORE_EXTENSIONS.some((ext) => file.endsWith(ext))) {
    // Copy non-ts files
    await copyToOut(file, { inputDir: INPUT_DIR, outputDir: OUTPUT_DIR })
  }
}

export default async function ({ directory }: BuildArgs) {
  const started = Date.now()

  const { configModule, error } = getConfigFile<ConfigModule>(
    directory,
    "medusa-config"
  )

  if (error) {
    console.log(`Failed to load medusa-config.js`)
    console.error(error)
    process.exit(1)
  }

  const input = path.join(directory, INPUT_DIR)
  const dist = path.join(directory, OUTPUT_DIR)

  await clean(dist)

  const files = await findFiles(input)

  await Promise.all(files.map(medusaTransform))

  const sources: string[] = []

  const projectSource = path.join(directory, "src", "admin")

  if (existsSync(projectSource)) {
    sources.push(projectSource)
  }

  const adminOptions = {
    disable: false,
    path: "/app" as const,
    outDir: "./build",
    sources,
    ...configModule.admin,
  }

  if (!adminOptions.disable) {
    try {
      const { build: buildProductionBuild } = await import(
        "@medusajs/admin-sdk"
      )

      await buildProductionBuild(adminOptions)
    } catch (error) {
      console.log("Failed to build admin")
    }
  }

  const time = Date.now() - started

  console.log(`Build completed in ${time}ms`)
}
