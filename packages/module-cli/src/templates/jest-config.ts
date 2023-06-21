import log from "../utils/logger.js"
import { resolve } from "path"
import { writeFile } from "fs/promises"
import { spinner } from "../index.js"
import dedent from "dedent"

const fileName = "jest.config.js"

export async function generateJestConfig({
  modulePath,
}: {
  modulePath: string
}): Promise<void> {
  log(`Generating ${fileName}`)

  const template = dedent`module.exports = {
    moduleNameMapper: {},
    globals: {
      "ts-jest": {
        tsConfig: "tsconfig.spec.json",
        isolatedModules: false,
      },
    },
    transform: {
      "^.+\\.[jt]s?$": "ts-jest",
    },
    testEnvironment: "node",
    moduleFileExtensions: ["js", "ts"],
    modulePathIgnorePatterns: ["dist/"],
    setupFiles: ["<rootDir>/integration-tests/setup-env.js"],
    setupFilesAfterEnv: ["<rootDir>/integration-tests/setup.js"],
  }`

  try {
    const path = resolve(modulePath, fileName)
    await writeFile(path, template)
    spinner.succeed(`${fileName} generated`)
  } catch (error) {
    log(`Failed to generate ${fileName}`, "error")
    throw error
  }
}
