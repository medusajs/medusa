const axios = require("axios").default
const open = require("open")
const inquirer = require("inquirer")
const { track } = require("medusa-telemetry")

const logger = require("../reporter").default
const { setToken } = require("../util/token-store")

/**
 * The login command allows the CLI to keep track of Cloud users; the command
 * makes a cli-login request to the cloud server and keeps an open connection
 * until the user has authenticated via the Medusa Cloud website.
 */
module.exports = {
  login: async _ => {
    track("CLI_LOGIN")
    const apiHost =
      process.env.MEDUSA_API_HOST || "https://api.medusa-commerce.com"

    const authHost = process.env.MEDUSA_AUTH_HOST || `${apiHost}/cli-auth`

    const loginHost =
      process.env.MEDUSA_APP_HOST || "https://app.medusa-commerce.com"

    const { data: urls } = await axios.post(authHost)

    const loginUri = `${loginHost}${urls.browser_url}`

    const prompts = [
      {
        type: "input",
        name: "open",
        message: "Press enter key to open browser for login or n to exit",
      },
    ]

    console.log()
    console.log("Login to Medusa Cloud")
    console.log()

    await inquirer.prompt(prompts).then(async a => {
      if (a.open === "n") {
        process.exit(0)
      }

      const browserOpen = await open(loginUri, {
        app: "browser",
        wait: false,
      })
      browserOpen.on("error", err => {
        console.warn(err)
        console.log(`Could not open browser go to: ${loginUri}`)
      })
    })

    const spinner = logger.activity(`Waiting for login at ${loginUri}`)
    const fetchAuth = async (retries = 3) => {
      try {
        const { data: auth } = await axios.get(`${authHost}${urls.cli_url}`, {
          headers: { authorization: `Bearer ${urls.cli_token}` },
        })
        return auth
      } catch (err) {
        if (retries > 0 && err.http && err.http.statusCode > 500)
          return fetchAuth(retries - 1)
        throw err
      }
    }
    const auth = await fetchAuth()

    // This is kept alive for several seconds until the user has authenticated
    // in the browser.
    const { data: user } = await axios
      .get(`${apiHost}/auth`, {
        headers: {
          authorization: `Bearer ${auth.password}`,
        },
      })
      .catch(err => {
        console.log(err)
        process.exit(1)
      })

    if (user) {
      track("CLI_LOGIN_SUCCEEDED")
      logger.success(spinner, "Log in succeeded.")
      setToken(auth.password)
    } else {
      track("CLI_LOGIN_FAILED")
      logger.failure(spinner, "Log in failed.")
    }
  },
}
