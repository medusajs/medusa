import { TypeDocOptions } from "typedoc"
import getOptions from "./get-options.js"

type Options = {
  moduleName: string
  typedocOptions?: Partial<TypeDocOptions>
}

export default function getModuleOptions({
  moduleName,
  typedocOptions,
}: Options): Partial<TypeDocOptions> {
  return getOptions({
    entryPointPath: `packages/core/types/src/${moduleName}/service.ts`,
    name: moduleName,
    tsConfigName: "types.json",
    entryPointStrategy: "expand",
    plugin: ["typedoc-plugin-rename-defaults"],
    enableInternalResolve: true,
    ...typedocOptions,
  })
}
