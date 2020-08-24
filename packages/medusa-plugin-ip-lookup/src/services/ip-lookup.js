import { BaseService } from "medusa-interfaces"
import axios from "axios"

class IpLookupService extends BaseService {
  constructor({}, options) {
    super()

    this.options_ = options
  }

  async lookupIp(ipAddress) {
    return axios.get(
      `http://api.ipstack.com/${ipAddress}?access_key=${this.options_.access_token}`
    )
  }
}

export default IpLookupService
