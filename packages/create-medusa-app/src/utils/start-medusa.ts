import { exec } from "child_process"

type StartOptions = {
  directory: string
  abortController?: AbortController
}

export default ({ directory, abortController }: StartOptions) => {
  const childProcess = exec(`npx -y @medusajs/medusa-cli develop`, {
    cwd: directory,
    signal: abortController?.signal,
  })

  childProcess.stdout?.pipe(process.stdout)
}
