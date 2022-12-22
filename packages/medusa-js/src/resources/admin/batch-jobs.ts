import {
  AdminBatchJobListRes,
  AdminBatchJobRes,
  AdminGetBatchParams,
  AdminPostBatchesReq,
} from "@medusajs/medusa"
import qs from "qs"
import { ResponsePromise } from "../../typings"
import BaseResource from "../base"
import { stringifyNullProperties } from "../../utils"

class AdminBatchJobsResource extends BaseResource {
  create(
    payload: AdminPostBatchesReq,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminBatchJobRes> {
    const path = `/admin/batch-jobs`
    return this.client.request("POST", path, payload, {}, customHeaders)
  }

  list(
    query?: AdminGetBatchParams,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminBatchJobListRes> {
    let path = `/admin/batch-jobs`

    if (query) {
      const queryString = qs.stringify(stringifyNullProperties(query))
      path = `/admin/batch-jobs?${queryString}`
    }

    return this.client.request("GET", path, undefined, {}, customHeaders)
  }

  cancel(
    batchJobId: string,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminBatchJobRes> {
    const path = `/admin/batch-jobs/${batchJobId}/cancel`
    return this.client.request("POST", path, undefined, {}, customHeaders)
  }

  confirm(
    batchJobId: string,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminBatchJobRes> {
    const path = `/admin/batch-jobs/${batchJobId}/confirm`
    return this.client.request("POST", path, undefined, {}, customHeaders)
  }

  retrieve(
    batchJobId: string,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminBatchJobRes> {
    const path = `/admin/batch-jobs/${batchJobId}`
    return this.client.request("GET", path, undefined, {}, customHeaders)
  }
}

export default AdminBatchJobsResource
