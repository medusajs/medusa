import AuthResource from "../auth"
import BaseResource from "../base"

class Admin extends BaseResource {
  public auth = new AuthResource(this.client)
}

export default Admin
