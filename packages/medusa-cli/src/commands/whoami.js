const axios = require("axios").default
const { getToken } = require("../util/token-store")

/**
 * Fetches the locally logged in user.
 */
module.exports = {
  whoami: async argv => {
    const apiHost =
      process.env.MEDUSA_API_HOST || "https://api.medusa-commerce.com"

    const tok = getToken()

    if (!tok) {
      console.log(
        "You are not logged into Medusa Cloud. Please run medusa login."
      )
      process.exit(0)
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

    if (auth.user) {
      console.log(`Hi, ${auth.user.first_name}! Here are your details:`)
      console.log(`id: ${auth.user.id}`)
      console.log(`email: ${auth.user.email}`)
      console.log(`first_name: ${auth.user.first_name}`)
      console.log(`last_name: ${auth.user.last_name}`)
    }
  },
}
