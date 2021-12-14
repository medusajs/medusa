import BaseResource from "../base"
import AdminAuthResource from "./auth"
import AdminCustomersResource from "./customers"
import AdminDiscountsResource from "./discounts"
import AdminInvitesResource from "./invites"
import AdminNotesResource from "./notes"

class Admin extends BaseResource {
  public auth = new AdminAuthResource(this.client)
  public customers = new AdminCustomersResource(this.client)
  public discounts = new AdminDiscountsResource(this.client)
  public invites = new AdminInvitesResource(this.client)
  public notes = new AdminNotesResource(this.client)
}

export default Admin
