import { join } from "path"

export const getMedusaVersion = (): string => {
  try {
    return require(join(
      process.cwd(),
      `node_modules`,
      `@medusajs/medusa`,
      `package.json`
    )).version
  } catch (e) {
    return ``
  }
}
