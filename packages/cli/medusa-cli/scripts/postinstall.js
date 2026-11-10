const { styleText } = require(`util`)

const showSuccessMessage = () => {
  console.log(styleText(`green`, `Success!\n`))
  console.log(styleText(`cyan`, `Welcome to the Medusa CLI!`))
}

try {
  // check if it's a global installation of medusa-cli
  const npmArgs = JSON.parse(process.env[`npm_config_argv`])
  if (npmArgs.cooked && npmArgs.cooked.includes(`--global`)) {
    const createCli = require(`../dist/create-cli`)
    showSuccessMessage()
    createCli(`--help`)
  }
} catch (e) {}
