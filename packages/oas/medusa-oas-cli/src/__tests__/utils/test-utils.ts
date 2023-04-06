import execa from "execa"
import { OpenAPIObject } from "openapi3-ts"
import path from "path"

const basePath = path.resolve(__dirname, `../../../`)

export const runCLI = async (command: string, options: string[] = []) => {
  const params = ["run", "medusa-oas", command, ...options]
  try {
    const { all: logs } = await execa("yarn", params, {
      cwd: basePath,
      all: true,
    })
  } catch (err) {
    throw new Error(err.message + err.all)
  }
}

export const getBaseOpenApi = (): OpenAPIObject => {
  return {
    openapi: "3.0.0",
    info: {
      title: "Test",
      version: "1.0.0",
    },
    paths: {},
    components: {},
  }
}
