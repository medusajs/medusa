import AxiosClient, { Client, Config } from "./client"
import MedusaAdmin from "./resources/admin"
import MedusaStore from "./resources/store"

class Medusa extends MedusaStore {
  private client_: Client
  public admin: MedusaAdmin
  private static instance: Medusa

  constructor(config: Config) {
    super()
    this.client_ = new AxiosClient(config)
    this.admin = new MedusaAdmin()
    Medusa.instance = this
  }

  public static getInstance(): Medusa {
    return this.instance
  }

  handleRequest<RequestType, ResponseType>(
    config: RequestType
  ): Promise<ResponseType> {
    return this.client_.request(config)
  }
}

export default Medusa
