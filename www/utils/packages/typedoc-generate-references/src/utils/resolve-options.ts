import getModuleOptions from "./get-module-options.js"
import { customModulesOptions } from "../constants/references-details.js"
import customOptions from "../constants/custom-options.js"
import getReferenceType from "./get-reference-type.js"

export default function resolveOptions(referenceName: string) {
  return getReferenceType(referenceName) === "module"
    ? getModuleOptions({
        moduleName: referenceName,
        typedocOptions: Object.hasOwn(customModulesOptions, referenceName)
          ? customModulesOptions[referenceName]
          : undefined,
      })
    : Object.hasOwn(customOptions, referenceName)
      ? customOptions[referenceName]
      : undefined
}
