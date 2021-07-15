const axios = require("axios").default
const { getToken } = require("../util/token-store")
const logger = require("../reporter").default

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

    const activity = logger.activity("checking login details")

    const { data: auth } = await axios
      .get(`${apiHost}/auth`, {
        headers: {
          authorization: `Bearer ${tok}`,
        },
      })
      .catch(err => {
        logger.failure(activity, "Couldn't gather login details")
        logger.error(err)
        process.exit(1)
      })

    if (auth.user) {
      logger.success(
        activity,
        `Hi, ${auth.user.first_name}! Here are your details:`
      )

      console.log(`id: ${auth.user.id}`)
      console.log(`email: ${auth.user.email}`)
      console.log(`first_name: ${auth.user.first_name}`)
      console.log(`last_name: ${auth.user.last_name}`)
    }
  },
}
