const axios = require("axios").default
const inquirer = require("inquirer")
const open = require("open")
const execa = require("execa")
const resolveCwd = require(`resolve-cwd`)
const { getToken } = require("../util/token-store")
const logger = require("../logger").default

module.exports = {
  link: async argv => {
    const port = process.env.PORT || 9000
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

    // Checks if there is already a token from a previous log in; this is
    // necessary to redirect the customer to the page where local linking is
    // done
    const tok = getToken()
    if (!tok) {
      console.log(
        "You must login to Medusa Cloud first. Please run medusa login."
      )
      process.exit(1)
    }

    // Get the currently logged in user; we will be using the Cloud user id to
    // create a user in the local DB with the same user id; allowing you to
    // authenticate to the local API.
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

    const linkActivity = logger.activity("Linking local project")

    // Create the user with the user id
    if (!argv.skipLocalUser && auth.user) {
      let proc
      try {
        proc = await execa(
          `medusa`,
          [`user`, `--id`, auth.user.id, `--email`, auth.user.email],
          {
            env: {
              ...process.env,
              NODE_ENV: "command",
            },
          }
        )
      } catch (error) {
        logger.failure(linkActivity, "Failed to perform local linking")
        process.exit(1)
      }
    }

    logger.success(linkActivity, "Local project linked")

    console.log()
    console.log(
      "Link Medusa Cloud to your local server. This will open the browser"
    )
    console.log()

    const qs = [
      {
        type: "input",
        name: "open",
        message: "Press enter key to open browser for linking or n to exit",
      },
    ]

    await inquirer.prompt(qs).then(async a => {
      if (a.open === "n") {
        process.exit(0)
      }

      const params = `lurl=http://localhost:${port}&ltoken=${auth.user.id}`

      // This step sets the Cloud link by opening a browser
      const bo = await open(`${appHost}/local-link?${encodeURI(params)}`, {
        app: "browser",
        wait: false,
      })

      bo.on("error", err => {
        console.warn(err)
        console.log(
          `Could not open browser go to: ${appHost}/local-link?lurl=http://localhost:9000&ltoken=${auth.user.id}`
        )
      })
    })
  },
}
