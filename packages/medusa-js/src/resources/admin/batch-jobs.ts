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

/**
 * This class is used to send requests to [Admin Batch Job API Routes](https://docs.medusajs.com/api/admin#batch-jobs). All its method
 * are available in the JS Client under the `medusa.admin.batchJobs` property.
 * 
 * All methods in this class require {@link AdminAuthResource.createSession | user authentication}.
 * 
 * A batch job is a task that is performed by the Medusa backend asynchronusly. For example, the Import Product feature is implemented using batch jobs.
 * The methods in this class allow admins to manage the batch jobs and their state.
 * 
 * Related Guide: [How to import products](https://docs.medusajs.com/modules/products/admin/import-products).
 */
class AdminBatchJobsResource extends BaseResource {

  /**
   * Create a Batch Job to be executed asynchronously in the Medusa backend. If `dry_run` is set to `true`, the batch job will not be executed until the it is confirmed,
   * which can be done using the {@link confirm} method.
   * @param payload - The data of the batch job to create.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<AdminBatchJobRes>} Resolves to the batch job's details.
   * 
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.batchJobs.create({
   *   type: 'product-export',
   *   context: {},
   *   dry_run: false
   * }).then((({ batch_job }) => {
   *   console.log(batch_job.id);
   * })
   */
  create(
    payload: AdminPostBatchesReq,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminBatchJobRes> {
    const path = `/admin/batch-jobs`
    return this.client.request("POST", path, payload, {}, customHeaders)
  }

  /**
   * Retrieve a list of Batch Jobs. The batch jobs can be filtered by fields such as `type` or `confirmed_at`. The batch jobs can also be sorted or paginated.
   * @param {AdminGetBatchParams} query - Filters and pagination configurations to apply on the retrieved batch jobs.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<AdminBatchJobListRes>} The list of batch jobs with pagination fields.
   * 
   * @example
   * To list batch jobs:
   * 
   * ```ts
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.batchJobs.list()
   * .then(({ batch_jobs, limit, offset, count }) => {
   *   console.log(batch_jobs.length)
   * })
   * ```
   * 
   * To specify relations that should be retrieved within the batch jobs:
   * 
   * ```ts
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.batchJobs.list({
   *   expand: "created_by_user"
   * })
   * .then(({ batch_jobs, limit, offset, count }) => {
   *   console.log(batch_jobs.length)
   * })
   * ```
   * 
   * By default, only the first `10` records are retrieved. You can control pagination by specifying the `limit` and `offset` properties:
   * 
   * ```ts
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.batchJobs.list({
   *   expand: "created_by_user",
   *   limit,
   *   offset
   * })
   * .then(({ batch_jobs, limit, offset, count }) => {
   *   console.log(batch_jobs.length)
   * })
   * ```
   */
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

  /**
   * Mark a batch job as canceled. When a batch job is canceled, the processing of the batch job doesn’t automatically stop.
   * @param {string} batchJobId - The ID of the batch job.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<AdminBatchJobRes>} Resolves to the batch job's details.
   * 
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.batchJobs.cancel(batchJobId)
   * .then(({ batch_job }) => {
   *   console.log(batch_job.id);
   * })
   */
  cancel(
    batchJobId: string,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminBatchJobRes> {
    const path = `/admin/batch-jobs/${batchJobId}/cancel`
    return this.client.request("POST", path, undefined, {}, customHeaders)
  }

  /**
   * When a batch job is created, it's not executed automatically if `dry_run` is set to `true`. This method confirms that the batch job should be executed.
   * @param {string} batchJobId - The ID of the batch job.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<AdminBatchJobRes>} Resolves to the batch job's details.
   * 
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.batchJobs.confirm(batchJobId)
   * .then(({ batch_job }) => {
   *   console.log(batch_job.id);
   * })
   */
  confirm(
    batchJobId: string,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminBatchJobRes> {
    const path = `/admin/batch-jobs/${batchJobId}/confirm`
    return this.client.request("POST", path, undefined, {}, customHeaders)
  }

  /**
   * Retrieve the details of a batch job.
   * @param {string} batchJobId - The ID of the batch job.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<AdminBatchJobRes>} Resolves to the batch job's details.
   * 
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.batchJobs.retrieve(batchJobId)
   * .then(({ batch_job }) => {
   *   console.log(batch_job.id);
   * })
   */
  retrieve(
    batchJobId: string,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminBatchJobRes> {
    const path = `/admin/batch-jobs/${batchJobId}`
    return this.client.request("GET", path, undefined, {}, customHeaders)
  }
}

export default AdminBatchJobsResource
