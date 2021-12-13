import BaseResource from "../base"
import CollectionsResource from "../collections"

class Admin extends BaseResource {
  public collections = new CollectionsResource(this.client)
}

export default Admin
