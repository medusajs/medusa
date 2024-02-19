import BaseResource from "../base"
import AdminV2AuthResource from "./auth"

/**
 * This class includes properties used to send requests to the [Admin API Routes](https://docs.medusajs.com/api/admin). All its properties
 * are available in the JS Client under the `medusa.admin` property.
 */
class AdminV2 extends BaseResource {
  public auth = new AdminV2AuthResource(this.client)
}

export { AdminV2 }
