import fse from "fs-extra"
import path, { resolve } from "path"
import vite from "vite"
import { BuildOptions, CleanOptions } from "../types"

class AdminService {
  async clean({ appDir, outDir }: CleanOptions) {
    const cacheDir = path.join(appDir, ".cache")
    const buildDir = path.join(outDir, "build")

    await fse.remove(cacheDir)
    await fse.remove(buildDir)
  }

  async build({ base }: BuildOptions) {
    await vite.build({
      base,
      define: {
        __BASENAME__: JSON.stringify(base),
      },
      root: resolve(__dirname, "../dashboard"),
    })
  }
}

export default AdminService
