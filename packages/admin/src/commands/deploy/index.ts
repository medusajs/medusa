import { spawn } from "child_process"
import * as fse from "fs-extra"
import { createTmpDir } from "./create-tmp-dir"

export default async function deploy() {
  const tmpDir = await createTmpDir()

  // Run vercel command
  const vercel = spawn("vercel", ["--prod"], {
    cwd: tmpDir,
    stdio: "inherit",
  })

  vercel.on("close", async (code) => {
    if (code === 0) {
      await fse.remove(tmpDir)
    }
  })
}
