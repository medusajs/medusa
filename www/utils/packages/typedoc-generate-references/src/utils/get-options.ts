import { TypeDocOptions } from "typedoc"
import { baseOptions } from "../constants/base-options.js"
import path from "path"
import {
  docsUtilPathPrefix,
  jsonOutputPathPrefix,
  rootPathPrefix,
} from "../constants/general.js"

type Options = {
  entryPointPath: string | string[]
  tsConfigName: string
  jsonFileName?: string
} & Partial<TypeDocOptions>

export function getEntryPoints(entryPointPaths: string | string[]): string[] {
  if (Array.isArray(entryPointPaths)) {
    return entryPointPaths.map((entryPath) =>
      path.join(rootPathPrefix, entryPath)
    )
  } else {
    return [path.join(rootPathPrefix, entryPointPaths)]
  }
}

export default function getOptions({
  entryPointPath,
  tsConfigName,
  jsonFileName,
  name,
  plugin,
  ...rest
}: Options): Partial<TypeDocOptions> {
  return {
    ...baseOptions,
    entryPoints: getEntryPoints(entryPointPath),
    tsconfig: path.join(
      docsUtilPathPrefix,
      "packages",
      "typedoc-config",
      tsConfigName
    ),
    plugin: [...(baseOptions.plugin || []), ...(plugin || [])],
    name,
    json: path.join(jsonOutputPathPrefix, `${jsonFileName || name}.json`),
    ...rest,
  }
}
