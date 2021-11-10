<<<<<<< HEAD
import Client from '../request';

export default class BaseResource {
  public client: Client;
=======
import Client from "../request";

export default class BaseResource {
  public client: any;
>>>>>>> typescript

  constructor(client: Client) {
    this.client = client;
  }
}
