import { exec } from "child_process"

type StartOptions = {
  directory: string
  abortController?: AbortController
}

export default ({ directory, abortController }: StartOptions) => {
  const childProcess = exec(`npm run dev`, {
    cwd: directory,
    signal: abortController?.signal,
    env: {
      ...process.env,
    },
  })

  childProcess.stdout?.pipe(process.stdout)
  childProcess.stderr?.pipe(process.stderr)
}
