import { AdminBatchJobRes, AdminPostBatchesReq } from "@medusajs/medusa"
import { Response } from "@medusajs/medusa-js"
import {
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from "@tanstack/react-query"

import { useMedusa } from "../../../contexts"
import { buildOptions } from "../../utils/buildOptions"
import { adminBatchJobsKeys } from "./queries"

/**
 * This hook creates a Batch Job to be executed asynchronously in the Medusa backend. If `dry_run` is set to `true`, the batch job will not be executed until the it is confirmed,
 * which can be done using the {@link useAdminConfirmBatchJob} hook.
 * 
 * @example
 * import React from "react"
 * import { useAdminCreateBatchJob } from "medusa-react"
 * 
 * const CreateBatchJob = () => {
 *   const createBatchJob = useAdminCreateBatchJob()
 *   // ...
 * 
 *   const handleCreateBatchJob = () => {
 *     createBatchJob.mutate({
 *       type: "publish-products",
 *       context: {},
 *       dry_run: true
 *     }, {
 *       onSuccess: ({ batch_job }) => {
 *         console.log(batch_job)
 *       }
 *     })
 *   }
 * 
 *   // ...
 * }
 * 
 * export default CreateBatchJob
 * 
 * @customNamespace Hooks.Admin.Batch Jobs
 * @category Mutations
 */
export const useAdminCreateBatchJob = (
  options?: UseMutationOptions<
    Response<AdminBatchJobRes>,
    Error,
    AdminPostBatchesReq
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation(
    (payload: AdminPostBatchesReq) => client.admin.batchJobs.create(payload),
    buildOptions(queryClient, adminBatchJobsKeys.lists(), options)
  )
}

/**
 * This hook marks a batch job as canceled. When a batch job is canceled, the processing of the batch job doesn’t automatically stop.
 * 
 * @example
 * import React from "react"
 * import { useAdminCancelBatchJob } from "medusa-react"
 * 
 * type Props = {
 *   batchJobId: string
 * }
 * 
 * const BatchJob = ({ batchJobId }: Props) => {
 *   const cancelBatchJob = useAdminCancelBatchJob(batchJobId)
 *   // ...
 * 
 *   const handleCancel = () => {
 *     cancelBatchJob.mutate(undefined, {
 *       onSuccess: ({ batch_job }) => {
 *         console.log(batch_job)
 *       }
 *     })
 *   }
 * 
 *   // ...
 * }
 * 
 * export default BatchJob
 * 
 * @customNamespace Hooks.Admin.Batch Jobs
 * @category Mutations
 */
export const useAdminCancelBatchJob = (
  /**
   * The ID of the batch job.
   */
  id: string,
  options?: UseMutationOptions<Response<AdminBatchJobRes>, Error>
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation(
    () => client.admin.batchJobs.cancel(id),
    buildOptions(
      queryClient,
      [adminBatchJobsKeys.lists(), adminBatchJobsKeys.detail(id)],
      options
    )
  )
}

/**
 * When a batch job is created, it's not executed automatically if `dry_run` is set to `true`. This hook confirms that the batch job should be executed.
 * 
 * @example
 * import React from "react"
 * import { useAdminConfirmBatchJob } from "medusa-react"
 * 
 * type Props = {
 *   batchJobId: string
 * }
 * 
 * const BatchJob = ({ batchJobId }: Props) => {
 *   const confirmBatchJob = useAdminConfirmBatchJob(batchJobId)
 *   // ...
 * 
 *   const handleConfirm = () => {
 *     confirmBatchJob.mutate(undefined, {
 *       onSuccess: ({ batch_job }) => {
 *         console.log(batch_job)
 *       }
 *     })
 *   }
 * 
 *   // ...
 * }
 * 
 * export default BatchJob
 */
export const useAdminConfirmBatchJob = (
  /**
   * The ID of the batch job.
   */
  id: string,
  options?: UseMutationOptions<Response<AdminBatchJobRes>, Error>
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation(
    () => client.admin.batchJobs.confirm(id),
    buildOptions(
      queryClient,
      [adminBatchJobsKeys.lists(), adminBatchJobsKeys.detail(id)],
      options
    )
  )
}
