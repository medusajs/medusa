import path from "path"

export const getMedusaVersion = (): string => {
  try {
    return require(path.join(
      process.cwd(),
      `node_modules`,
      `@medusajs/medusa`,
      `package.json`
    )).version
  } catch (e) {
    return ``
  }
}
