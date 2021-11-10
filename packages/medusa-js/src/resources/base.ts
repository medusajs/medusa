import Client from "../request";

export default class BaseResource {
  public client: any;

  constructor(client: Client) {
    this.client = client;
  }
}
