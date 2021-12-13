import BaseResource from "../base"
import AdminAuthResource from "./auth"

class Admin extends BaseResource {
  public auth = new AdminAuthResource(this.client)
}

export default Admin
