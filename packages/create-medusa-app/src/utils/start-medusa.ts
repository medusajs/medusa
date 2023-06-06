import { exec } from "child_process"
import onProcessTerminated from "./on-process-terminated.js"
import boxen from "boxen"
import chalk from "chalk"

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

  onProcessTerminated(() =>
    console.log(
      boxen(
        chalk.green(
          `Change to the ${directory} directory to explore your Medusa project. Check out the Medusa documentation to start your development:
          https://docs.medusajs.com/`
        ),
        {
          titleAlignment: "center",
          textAlignment: "center",
          padding: 1,
          margin: 1,
          float: "center",
        }
      )
    )
  )
}
