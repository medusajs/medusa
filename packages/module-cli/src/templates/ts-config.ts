import log from "../utils/logger.js"
import { resolve } from "path"
import { writeFile } from "fs/promises"
import { spinner } from "../index.js"

const tsconfigFileName = "tsconfig.json"
const tsconfigSpecFileName = "tsconfig.spec.json"

export async function generateTsConfig({
  modulePath,
}: {
  modulePath: string
}): Promise<void> {
  await generateTsConfig_({ modulePath })
  await generateTsConfigSpec_({ modulePath })
}

async function generateTsConfig_({ modulePath }: { modulePath: string }) {
  log(`Generating ${tsconfigFileName}`)

  const template = {
    compilerOptions: {
      lib: ["es2020"],
      target: "es2020",
      outDir: "./dist",
      esModuleInterop: true,
      declaration: true,
      module: "commonjs",
      moduleResolution: "node",
      emitDecoratorMetadata: true,
      experimentalDecorators: true,
      sourceMap: false,
      noImplicitReturns: true,
      strictNullChecks: true,
      strictFunctionTypes: true,
      noImplicitThis: true,
      allowJs: true,
      skipLibCheck: true,
      downlevelIteration: true, // to use ES5 specific tooling
      baseUrl: ".",
      resolveJsonModule: true,
      paths: {},
    },
    include: ["src"],
    exclude: [
      "dist",
      "./src/**/__tests__",
      "./src/**/__mocks__",
      "./src/**/__fixtures__",
      "node_modules",
    ],
  }

  try {
    const path = resolve(modulePath, tsconfigFileName)
    await writeFile(path, JSON.stringify(template, null, 4))
    spinner.succeed(`${tsconfigFileName} generated`)
  } catch (error) {
    log(`Failed to generate ${tsconfigFileName}`, "error")
    throw error
  }
}

async function generateTsConfigSpec_({ modulePath }: { modulePath: string }) {
  log(`Generating ${tsconfigSpecFileName}`)

  const template = {
    extends: "./tsconfig.json",
    include: ["src", "integration-tests"],
    exclude: ["node_modules", "dist"],
  }

  try {
    const path = resolve(modulePath, tsconfigSpecFileName)
    await writeFile(path, JSON.stringify(template, null, 4))
    spinner.succeed(`${tsconfigSpecFileName} generated`)
  } catch (error) {
    log(`Failed to generate ${tsconfigSpecFileName}`, "error")
    throw error
  }
}
