import { Client } from "../client"

export class Admin {
  private client: Client
  constructor(client: Client) {
    this.client = client
  }
}
