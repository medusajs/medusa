import { Admin } from "./admin"
import { Auth } from "./auth"
import { Client } from "./client"
import { Store } from "./store"
import { Config } from "./types"

class Medusa {
  public client: Client

  public admin: Admin
  public store: Store
  public auth: Auth

  constructor(config: Config) {
    this.client = new Client(config)

    this.admin = new Admin(this.client)
    this.store = new Store(this.client)
    this.auth = new Auth(this.client, config)
  }
}

export default Medusa
export { FetchError } from "./client"
