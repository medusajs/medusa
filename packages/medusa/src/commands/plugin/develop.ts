import { Compiler } from "@medusajs/framework/build-tools"
import { logger } from "@medusajs/framework/logger"
import * as swcCore from "@swc/core"
import { execFile } from "child_process"
import path from "path"

export default async function developPlugin({
  directory,
}: {
  directory: string
}) {
  let isBusy = false
  const compiler = new Compiler(directory, logger)
  const parsedConfig = await compiler.loadTSConfigFile()
  if (!parsedConfig) {
    return
  }

  const yalcBin = path.join(path.dirname(require.resolve("yalc")), "yalc.js")

  /**
   * Publishes the build output to the registry and updates
   * installations
   */
  function publishChanges() {
    /**
     * Here we avoid multiple publish calls when the filesystem is
     * changed too quickly. This might result in stale content in
     * some edge cases. However, not preventing multiple publishes
     * at the same time will result in race conditions and the old
     * output might appear in the published package.
     */
    if (isBusy) {
      return
    }
    isBusy = true

    /**
     * Yalc is meant to be used a binary and not as a long-lived
     * module import. Therefore we will have to execute it like
     * a command to get desired outcome. Otherwise, yalc behaves
     * flaky.
     */
    execFile(
      process.execPath,
      [yalcBin, "publish", "--push", "--no-scripts"],
      {
        cwd: directory,
      },
      (error, stdout, stderr) => {
        isBusy = false
        if (error) {
          console.log(error)
        }
        console.log(stdout)
        console.error(stderr)
      }
    )
  }

  /**
   * Transforms a given file using @swc/core
   */
  async function transformFile(filePath: string) {
    const output = await swcCore.transformFile(filePath, {
      sourceMaps: "inline",
      module: {
        type: "commonjs",
        strictMode: true,
        noInterop: false,
      },
      jsc: {
        externalHelpers: false,
        target: "es2021",
        parser: {
          syntax: "typescript",
          tsx: true,
          decorators: true,
          dynamicImport: true,
        },
        transform: {
          legacyDecorator: true,
          decoratorMetadata: true,
          react: {
            throwIfNamespace: false,
            useBuiltins: false,
            pragma: "React.createElement",
            pragmaFrag: "React.Fragment",
            importSource: "react",
            runtime: "automatic",
          },
        },
        keepClassNames: true,
        baseUrl: directory,
      },
    })
    return output.code
  }

  await compiler.buildPluginBackend(parsedConfig)
  await compiler.developPluginBackend(transformFile, publishChanges)
}
