import Client from "../request"

export default class BaseResource {
  public client: Client

  constructor(client: Client) {
    this.client = client
  }
}
