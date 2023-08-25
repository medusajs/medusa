import React, { PropsWithChildren, useEffect } from "react"
import { adminProductKeys } from "medusa-react"

import { usePolling } from "./polling-provider"
import { queryClient } from "../constants/query-client"
import useNotification from "../hooks/use-notification"

/**
 * Provider for refreshing product/pricing lists after batch jobs are complete
 */
export const ImportRefresh = ({ children }: PropsWithChildren) => {
  const { batchJobs } = usePolling()
  const notification = useNotification()

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
          queryClient.invalidateQueries(adminProductKeys.all)
          notification("Success", "Product import completed", "success")
        }
      }
    }
  }, [batchJobs])

  return <>{children}</>
}
