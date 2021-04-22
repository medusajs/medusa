const axios = require("axios").default
const open = require("open")
const Netrc = require("netrc-parser").default
const inquirer = require("inquirer")

module.exports = {
  login: async _ => {
    const apiHost =
      process.env.MEDUSA_API_HOST || "https://api.medusa-commerce.com"

    const authHost = process.env.MEDUSA_AUTH_HOST || `${apiHost}/cli-auth`

    const loginHost =
      process.env.MEDUSA_LOGIN_HOST || "https://admin.medusa-commerce.com"

    const { data: urls } = await axios.post(authHost)

    const qs = [
      {
        type: "input",
        name: "open",
        message: "Press enter key to open browser for login or n to exit",
      },
    ]

    await inquirer.prompt(qs).then(async a => {
      if (a.open === "n") {
        process.exit(0)
      }

      const bo = await open(`${loginHost}${urls.browser_url}`, {
        app: "browser",
        wait: false,
      })
      bo.on("error", err => {
        console.warn(err)
        console.log(
          `Could not open browser go to: ${loginHost}${urls.browser_url}`
        )
      })

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

      const { data: user } = await axios
        .get(`${apiHost}/auth`, {
          auth: {
            username: auth.username,
            password: auth.password,
          },
        })
        .catch(err => {
          console.log(err)
          process.exit(1)
        })

      await Netrc.load()
      if (user) {
        const hostMachine =
          process.env.MEDUSA_HOST_MACHINE || "api.medusa-commerce.com"

        if (!Netrc.machines[hostMachine]) {
          Netrc.machines[hostMachine] = {}
        }
        Netrc.machines[hostMachine].login = auth.username
        Netrc.machines[hostMachine].password = auth.password
      }
      await Netrc.save()
    })
  },
}
