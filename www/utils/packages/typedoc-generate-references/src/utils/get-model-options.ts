import { TypeDocOptions } from "typedoc"
import getOptions from "./get-options.js"

type Options = {
  moduleName: string
  typedocOptions?: Partial<TypeDocOptions>
}

export default function getModelOptions({
  moduleName,
  typedocOptions = {},
}: Options): Partial<TypeDocOptions> {
  const entryPath = `packages/modules/${moduleName}/src/models/index.ts`

  return getOptions({
    entryPointPath: entryPath,
    name: `${moduleName}-models`,
    tsConfigName: `${moduleName}.json`,
    generateModelsDiagram: true,
    diagramAddToFile: entryPath,
    resolveDmlRelations: true,
    generateDMLsDiagram: true,
    diagramDMLAddToFile: entryPath,
    ...typedocOptions,
  })
}
