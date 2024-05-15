import fs from "node:fs/promises"
import path from "path"

const inputDir = "./src"
const outputDir = "./dist"
const compileExtensions = [".ts", ".tsx", ".js", ".jsx"]
const ignoreExtensions = [".md"]
const dryRun = false

const inputDirName = path.basename(inputDir)
const outputDirName = path.basename(outputDir)

// Recursively find all files to compile
export const findFiles = async (dir, { allowNonExistent } = {}) => {
  try {
    let files = await fs.readdir(dir, { withFileTypes: true })
    let paths = await Promise.all(
      files.map(async (file) => {
        const res = path.join(dir, file.name)
        return file.isDirectory() ? findFiles(res) : res
      })
    )
    return paths.flat()
  } catch (e) {
    if (allowNonExistent && e.code === "ENOENT") {
      return []
    }
    throw e
  }
}

const getOutputPath = (file, config) => {
  const { targetExtension } = config

  const relativePath = file.replace(inputDirName, outputDirName)
  let outputPath = relativePath

  if (targetExtension) {
    const currentExtension = path.extname(outputPath)
    outputPath = outputPath.replace(currentExtension, targetExtension)
  }

  return outputPath
}

const writeToOut = async (file, content, config) => {
  const outputPath = getOutputPath(file, config)
  if (dryRun) {
    console.log(`Writing ${file} to ${outputPath}`)
    return
  }
  await fs.mkdir(outputPath.replace(/\/[^/]+$/, ""), { recursive: true })
  await fs.writeFile(outputPath, content)
}

const copyToOut = async (file, config) => {
  const outputPath = getOutputPath(file, config)

  if (dryRun) {
    console.log(`Copying ${file} to ${outputPath}`)
    return
  }
  await fs.mkdir(outputPath.replace(/\/[^/]+$/, ""), { recursive: true })
  await fs.copyFile(file, outputPath)
}

export const medusaTransform = async (file) => {
  if (compileExtensions.some((ext) => file.endsWith(ext))) {
    const outputPath = getOutputPath(file, { inputDir, outputDir })

    const swc = await import("@swc/core")
    const output = await swc.transformFile(file, {
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
      },
    })
    await writeToOut(file, output.code, {
      inputDir,
      outputDir,
      targetExtension: ".js",
    })
  } else if (!ignoreExtensions.some((ext) => file.endsWith(ext))) {
    // Copy non-ts files
    await copyToOut(file, { inputDir, outputDir })
  }
}
