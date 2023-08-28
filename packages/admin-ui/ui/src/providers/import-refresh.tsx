import React, { PropsWithChildren, useEffect } from "react"
import { adminProductKeys } from "medusa-react"

import { usePolling } from "./polling-provider"
import { queryClient } from "../constants/query-client"
import useNotification from "../hooks/use-notification"
import { capitalize } from "lodash"

let lastDisplayedNotificationAt = Date.now()

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
        (job) => job.status === "completed"
      )

      for (const job of completedJobs) {
        const jobCompletedTimestamp = new Date(job.completed_at).getTime()

        if (jobCompletedTimestamp > lastDisplayedNotificationAt) {
          notification(
            "Success",
            capitalize(`${job.type.split("-").join(" ")} batch job completed`),
            "success"
          )
          lastDisplayedNotificationAt = Date.now()
        }

        if (
          job.type === "product-import" &&
          jobCompletedTimestamp > refreshedTimestamp
        ) {
          queryClient.invalidateQueries(adminProductKeys.all)
        }
      }
    }
  }, [batchJobs])

  return <>{children}</>
}
