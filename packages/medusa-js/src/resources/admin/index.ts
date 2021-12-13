import BaseResource from "../base"
import AdminAuthResource from "./auth"
import AdminCustomerResource from "./customers"

class Admin extends BaseResource {
  public auth = new AdminAuthResource(this.client)
  public customers = new AdminCustomerResource(this.client)
}

export default Admin
