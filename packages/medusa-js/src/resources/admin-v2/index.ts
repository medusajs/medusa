import BaseResource from "../base"
import AdminV2AuthResource from "./auth"

class AdminV2 extends BaseResource {
  public auth = new AdminV2AuthResource(this.client)
}

export { AdminV2 }
