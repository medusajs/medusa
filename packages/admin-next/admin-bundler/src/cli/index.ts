import { createCli } from "./create-cli"

createCli()
  .then(async (cli) => cli.parseAsync(process.argv))
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
