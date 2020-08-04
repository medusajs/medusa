import randomize from "randomatic"
import { OauthService } from "medusa-interfaces"
import Brightpearl from "../utils/brightpearl"

const CLIENT_SECRET = process.env.BP_CLIENT_SECRET || ""

class BrightpearlOauth extends OauthService {
  constructor({}, options) {
    super()

    this.account_ = options.account
  }

  static getAppDetails(options) {
    const client_id = "medusa-dev"
    const client_secret = CLIENT_SECRET
    const state = randomize("A0", 16)
    const redirect = "https://localhost:8000/a/oauth/brightpearl"
    return {
      application_name: "brightpearl",
      display_name: "Brightpearl",
      install_url: `https://oauth.brightpearl.com/authorize/${options.account}?response_type=code&client_id=${client_id}&redirect_uri=${redirect}&state=${state}`,
      state,
    }
  }

  async generateToken(code) {
    const params = {
      client_id: "medusa-dev",
      client_secret: CLIENT_SECRET,
      redirect: "https://localhost:8000/a/oauth/brightpearl",
      code,
    }

    const data = await Brightpearl.createToken(this.account_, params)
    return data
  }
}

export default BrightpearlOauth
