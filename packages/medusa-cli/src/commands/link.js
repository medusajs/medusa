const axios = require("axios").default
const open = require("open")
const resolveCwd = require(`resolve-cwd`)
const { getToken } = require("../util/token-store")

module.exports = {
  link: async argv => {
    const appHost =
      process.env.MEDUSA_APP_HOST || "https://app.medusa-commerce.com"

    const apiHost =
      process.env.MEDUSA_API_HOST || "https://api.medusa-commerce.com"

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

    const tok = getToken()
    if (!tok) {
      console.log(
        "You must login to Medusa Cloud first. Please run medusa login."
      )
      process.exit(1)
    }

    const { data: auth } = await axios
      .get(`${apiHost}/auth`, {
        headers: {
          authorization: `Bearer ${tok}`,
        },
      })
      .catch(err => {
        console.log(err)
        process.exit(1)
      })

    if (!argv.skipLocalUser && auth.user) {
      const localCmd = resolveLocalCommand(`user`)
      await localCmd({
        directory: argv.directory,
        id: auth.user.id,
        email: auth.user.email,
      })
    }

    console.log(auth.user)

    const bo = await open(
      `${appHost}/local-link?lurl=http://localhost:4000&ltoken=${auth.user.id}`,
      {
        app: "browser",
        wait: false,
      }
    )
    bo.on("error", err => {
      console.warn(err)
      console.log(
        `Could not open browser go to: ${loginHost}${urls.browser_url}`
      )
    })
  },
}
