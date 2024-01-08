import { exec } from "child_process"

const [, , command, ...args] = process.argv
const npxCommand = `npx --no-install ${command} ${args.join(" ")}`

exec(npxCommand, (error, stdout, stderr) => {
  if (error) {
    // bubble up the error
    throw error
  }
})
