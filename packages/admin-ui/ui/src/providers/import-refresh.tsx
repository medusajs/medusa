import React, { PropsWithChildren, useEffect } from "react"
import { adminProductKeys } from "medusa-react"

import { usePolling } from "./polling-provider"
import { queryClient } from "../constants/query-client"

/**
 * Provider for refreshing product/pricing lists after batch jobs are complete
 */
export const ImportRefresh = ({ children }: PropsWithChildren) => {
  const { batchJobs } = usePolling()

  useEffect(() => {
    if (!batchJobs) {
      return
    }

    const productListQuery = Object.entries(
      queryClient.getQueryCache().queriesMap
    ).find(([k, v]) => k.includes("admin_products"))?.[1]

    if (productListQuery) {
      const refreshedTimestamp = productListQuery.state.dataUpdatedAt

      const completedJobs = batchJobs.filter(
        (job) => job.status === "completed" && job.type === "product-import"
      )

      for (const job of completedJobs) {
        const jobCompletedTimestamp = new Date(job.completed_at).getTime()
        if (jobCompletedTimestamp > refreshedTimestamp) {
          console.warn("Batch job finished: refreshing products list")
          queryClient.invalidateQueries(adminProductKeys.all)
        }
      }
    }
  }, [batchJobs])

  return <>{children}</>
}
