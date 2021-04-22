const axios = require("axios").default
const resolveCwd = require(`resolve-cwd`)
const Netrc = require("netrc-parser").default

module.exports = {
  link: async argv => {
    const apiHost =
      process.env.MEDUSA_API_HOST || "https://api.medusa-commerce.com"
    const hostMachine =
      process.env.MEDUSA_HOST_MACHINE || "api.medusa-commerce.com"

    function resolveLocalCommand(command) {
      try {
        const cmdPath = resolveCwd.silent(
          `@medusajs/medusa/dist/commands/${command}`
        )
        return require(cmdPath).default
      } catch (err) {
        console.log("Could not find local user command.")
        process.exit(1)
      }
    }

    await Netrc.load()

    if (!Netrc.machines[hostMachine]) {
      console.log(
        "You must login to Medusa Cloud first. Please run medusa login."
      )
      process.exit(1)
    }

    const { login, password } = Netrc.machines[hostMachine]

    const { data: auth } = await axios
      .get(`${apiHost}/auth`, {
        auth: {
          username: login,
          password: password,
        },
      })
      .catch(err => {
        console.log(err)
        process.exit(1)
      })

    if (auth.user) {
      const localCmd = resolveLocalCommand(`user`)
      return localCmd({
        directory: argv.directory,
        id: auth.user.id,
        email: auth.user.email,
      })
    }
  },
}
