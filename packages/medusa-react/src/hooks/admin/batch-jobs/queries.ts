import {
  AdminBatchJobListRes,
  AdminBatchJobRes,
  AdminGetBatchParams,
} from "@medusajs/medusa"
import { Response } from "@medusajs/medusa-js"
import { useQuery } from "@tanstack/react-query"
import { useMedusa } from "../../../contexts"
import { UseQueryOptionsWrapper } from "../../../types"
import { queryKeysFactory } from "../../utils/index"

const ADMIN_COLLECTIONS_QUERY_KEY = `admin_batches` as const

export const adminBatchJobsKeys = queryKeysFactory(ADMIN_COLLECTIONS_QUERY_KEY)

type BatchJobsQueryKey = typeof adminBatchJobsKeys

/**
 * This hook retrieves a list of Batch Jobs. The batch jobs can be filtered by fields such as `type` or `confirmed_at`. The batch jobs can also be sorted or paginated.
 *
 * @example
 * To list batch jobs:
 *
 * ```ts
 * import React from "react"
 * import { useAdminBatchJobs } from "medusa-react"
 *
 * const BatchJobs = () => {
 *   const {
 *     batch_jobs,
 *     limit,
 *     offset,
 *     count,
 *     isLoading
 *   } = useAdminBatchJobs()
 *
 *   return (
 *     <div>
 *       {isLoading && <span>Loading...</span>}
 *       {batch_jobs?.length && (
 *         <ul>
 *           {batch_jobs.map((batchJob) => (
 *             <li key={batchJob.id}>
 *               {batchJob.id}
 *             </li>
 *           ))}
 *         </ul>
 *       )}
 *     </div>
 *   )
 * }
 *
 * export default BatchJobs
 * ```
 *
 * To specify relations that should be retrieved within the batch jobs:
 *
 * ```ts
 * import React from "react"
 * import { useAdminBatchJobs } from "medusa-react"
 *
 * const BatchJobs = () => {
 *   const {
 *     batch_jobs,
 *     limit,
 *     offset,
 *     count,
 *     isLoading
 *   } = useAdminBatchJobs({
 *     expand: "created_by_user",
 *     limit: 10,
 *     offset: 0
 *   })
 *
 *   return (
 *     <div>
 *       {isLoading && <span>Loading...</span>}
 *       {batch_jobs?.length && (
 *         <ul>
 *           {batch_jobs.map((batchJob) => (
 *             <li key={batchJob.id}>
 *               {batchJob.id}
 *             </li>
 *           ))}
 *         </ul>
 *       )}
 *     </div>
 *   )
 * }
 *
 * export default BatchJobs
 * ```
 *
 * By default, only the first `10` records are retrieved. You can control pagination by specifying the `limit` and `offset` properties:
 *
 * ```ts
 * import React from "react"
 * import { useAdminBatchJobs } from "medusa-react"
 *
 * const BatchJobs = () => {
 *   const {
 *     batch_jobs,
 *     limit,
 *     offset,
 *     count,
 *     isLoading
 *   } = useAdminBatchJobs({
 *     expand: "created_by_user",
 *     limit: 20,
 *     offset: 0
 *   })
 *
 *   return (
 *     <div>
 *       {isLoading && <span>Loading...</span>}
 *       {batch_jobs?.length && (
 *         <ul>
 *           {batch_jobs.map((batchJob) => (
 *             <li key={batchJob.id}>
 *               {batchJob.id}
 *             </li>
 *           ))}
 *         </ul>
 *       )}
 *     </div>
 *   )
 * }
 *
 * export default BatchJobs
 * ```
 *
 * @customNamespace Hooks.Admin.Batch Jobs
 * @category Queries
 */
export const useAdminBatchJobs = (
  /**
   * Filters and pagination configurations to apply on the retrieved batch jobs.
   */
  query?: AdminGetBatchParams,
  options?: UseQueryOptionsWrapper<
    Response<AdminBatchJobListRes>,
    Error,
    ReturnType<BatchJobsQueryKey["list"]>
  >
) => {
  const { client } = useMedusa()
  const { data, ...rest } = useQuery({
    queryKey: adminBatchJobsKeys.list(query),
    queryFn: () => client.admin.batchJobs.list(query),
    ...options,
  })
  return { ...data, ...rest } as const
}

/**
 * This hook retrieves the details of a batch job.
 *
 * @example
 * import React from "react"
 * import { useAdminBatchJob } from "medusa-react"
 *
 * type Props = {
 *   batchJobId: string
 * }
 *
 * const BatchJob = ({ batchJobId }: Props) => {
 *   const { batch_job, isLoading } = useAdminBatchJob(batchJobId)
 *
 *   return (
 *     <div>
 *       {isLoading && <span>Loading...</span>}
 *       {batch_job && <span>{batch_job.created_by}</span>}
 *     </div>
 *   )
 * }
 *
 * export default BatchJob
 *
 * @customNamespace Hooks.Admin.Batch Jobs
 * @category Queries
 */
export const useAdminBatchJob = (
  /**
   * The ID of the batch job.
   */
  id: string,
  options?: UseQueryOptionsWrapper<
    Response<AdminBatchJobRes>,
    Error,
    ReturnType<BatchJobsQueryKey["detail"]>
  >
) => {
  const { client } = useMedusa()
  const { data, ...rest } = useQuery({
    queryKey: adminBatchJobsKeys.detail(id),
    queryFn: () => client.admin.batchJobs.retrieve(id),
    ...options,
  })
  return { ...data, ...rest } as const
}
