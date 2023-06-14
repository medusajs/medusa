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

export const useAdminBatchJobs = (
  query?: AdminGetBatchParams,
  options?: UseQueryOptionsWrapper<
    Response<AdminBatchJobListRes>,
    Error,
    ReturnType<BatchJobsQueryKey["list"]>
  >
) => {
  const { client } = useMedusa()
  const { data, ...rest } = useQuery(
    adminBatchJobsKeys.list(query),
    () => client.admin.batchJobs.list(query),
    options
  )
  return { ...data, ...rest } as const
}

export const useAdminBatchJob = (
  id: string,
  options?: UseQueryOptionsWrapper<
    Response<AdminBatchJobRes>,
    Error,
    ReturnType<BatchJobsQueryKey["detail"]>
  >
) => {
  const { client } = useMedusa()
  const { data, ...rest } = useQuery(
    adminBatchJobsKeys.detail(id),
    () => client.admin.batchJobs.retrieve(id),
    options
  )
  return { ...data, ...rest } as const
}
