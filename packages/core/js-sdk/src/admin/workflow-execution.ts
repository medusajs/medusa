import { HttpTypes } from "@medusajs/types"
import { Client } from "../client"
import { ClientHeaders } from "../types"

export class WorkflowExecution {
  /**
   * @ignore
   */
  private client: Client
  /**
   * @ignore
   */
  constructor(client: Client) {
    this.client = client
  }

  async list(
    queryParams?: HttpTypes.AdminGetWorkflowExecutionsParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminWorkflowExecutionListResponse>(
      `/admin/workflows-executions`,
      {
        query: queryParams,
        headers,
      }
    )
  }

  async retrieve(id: string, headers?: ClientHeaders) {
    return await this.client.fetch<HttpTypes.AdminWorkflowExecutionResponse>(
      `/admin/workflows-executions/${id}`,
      {
        headers,
      }
    )
  }
}
