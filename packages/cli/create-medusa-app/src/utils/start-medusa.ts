import { exec } from "child_process"
import PackageManager from "./package-manager.js"

type StartOptions = {
  directory: string
  abortController?: AbortController
  packageManager: PackageManager
}

export default ({
  directory,
  abortController,
  packageManager,
}: StartOptions) => {
  const command = packageManager.getCommandStr(`dev`)
  const childProcess = exec(command, {
    cwd: directory,
    signal: abortController?.signal,
    env: {
      ...process.env,
    },
  })

  childProcess.stdout?.pipe(process.stdout)
  childProcess.stderr?.pipe(process.stderr)
}
