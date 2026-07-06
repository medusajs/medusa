import path from "path"
import { TypeDocOptions } from "typedoc"
import { rootPathPrefix } from "./general.js"

export const baseOptions: Partial<TypeDocOptions> = {
  plugin: ["typedoc-plugin-custom"],
  readme: "none",
  eslintPathName: path.join(
    rootPathPrefix,
    "www/apps/resources/.content.eslintrc.mjs"
  ),
  pluginsResolvePath: path.join(rootPathPrefix, "www"),
  exclude: ["**/node_modules/**"],
  excludeInternal: true,
  excludeExternals: true,
  excludeReferences: true,
  sort: ["source-order"],
  validation: {
    notExported: false,
    invalidLink: true,
    notDocumented: false,
  },
  // TODO: remove once we update to latest TypeDoc as it supports TypeScript 5.9
  skipErrorChecking: true,
  // Uncomment this when debugging
  // logLevel: "Error",
  // showConfig: true,
}
