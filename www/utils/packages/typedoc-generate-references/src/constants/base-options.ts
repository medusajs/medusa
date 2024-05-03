import path from "path"
import { TypeDocOptions } from "typedoc"
import { rootPathPrefix } from "./general.js"

console.log(rootPathPrefix)

export const baseOptions: Partial<TypeDocOptions> = {
  plugin: ["typedoc-plugin-custom"],
  readme: "none",
  eslintPathName: path.join(
    rootPathPrefix,
    "www/packages/eslint-config-docs/content.js"
  ),
  pluginsResolvePath: path.join(rootPathPrefix, "www"),
  exclude: [path.join(rootPathPrefix, "node_modules/**")],
  excludeInternal: true,
  excludeExternals: true,
  excludeReferences: true,
  disableSources: true,
  sort: ["source-order"],
  validation: {
    notExported: false,
    invalidLink: true,
    notDocumented: false,
  },
  // Uncomment this when debugging
  // logLevel: "Error",
  // showConfig: true,
}
