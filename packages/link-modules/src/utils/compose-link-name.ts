import { toPascalCase } from "@medusajs/utils"

export const composeLinkName = (...args) => {
  return toPascalCase(
    args
      .concat("link")
      .map((name) => name.replace(/(_id|Service)$/gi, ""))
      .join("_")
  )
}
