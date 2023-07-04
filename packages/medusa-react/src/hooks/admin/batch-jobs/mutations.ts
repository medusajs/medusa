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
 * Hook returns functions for creating batch jobs.
 *
 * @param options
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
 * Hook return functions for canceling a batch job
 *
 * @param id - id of the batch job
 * @param options
 */
export const useAdminCancelBatchJob = (
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
 * Hook return functions for confirming a batch job
 *
 * @param id - id of the batch job
 * @param options
 */
export const useAdminConfirmBatchJob = (
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
