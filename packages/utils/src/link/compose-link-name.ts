import { lowerCaseFirst, toPascalCase } from "../common"

export const composeLinkName = (...args) => {
  return lowerCaseFirst(toPascalCase(composeTableName(...args.concat("link"))))
}

export const composeTableName = (...args) => {
  return args.map((name) => name.replace(/(_id|Service)$/gi, "")).join("_")
}
