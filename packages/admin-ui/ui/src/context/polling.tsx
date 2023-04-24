import React, { useCallback, useMemo } from "react"

import { AdminGetBatchParams, BatchJob } from "@medusajs/medusa"
import { useAdminBatchJobs } from "medusa-react"

type IPollingContext = {
  batchJobs?: BatchJob[]
  hasPollingError?: boolean
  resetInterval: () => Promise<void>
  refetch: () => void
}

// @ts-ignore
export const PollingContext = React.createContext<IPollingContext>({})

const oneMonthAgo = new Date(new Date().setMonth(new Date().getMonth() - 1))
oneMonthAgo.setHours(0, 0, 0, 0)

/**
 * Intervals for refetching batch jobs in seconds.
 */
const INTERVALS = [2, 5, 10, 15, 30, 60]

/**
 * Function factory for creating deduplicating timer object.
 * @param start - Initial starting point in the intervals array.
 */
const createDedupingTimer = (start: number) => {
  let deduplicationThreshold = Date.now()
  return {
    current: start,
    register() {
      deduplicationThreshold = Date.now()

      const currentInd = INTERVALS.findIndex((s) => s === this.current)
      this.current = INTERVALS[Math.min(INTERVALS.length - 1, currentInd + 1)]
    },
    isEnabled() {
      return Date.now() >= deduplicationThreshold
    },
    reset() {
      deduplicationThreshold = Date.now()
      this.current = INTERVALS[0]
    },
  }
}

const Timer = createDedupingTimer(INTERVALS[0])

/**
 * Batch job polling context provides batch jobs to the context.
 * Jobs are refreshed with nonlinear intervals.
 */
export const PollingProvider = ({ children }) => {
  const {
    batch_jobs: batchJobs,
    isError: hasPollingError,
    refetch,
  } = useAdminBatchJobs(
    {
      created_at: { gte: oneMonthAgo },
      failed_at: null,
    } as AdminGetBatchParams,
    {
      refetchOnWindowFocus: true,
      refetchInterval: Timer.current * 1000, // this is scheduling refetches
      enabled: Timer.isEnabled(), // this is only preventing refetches in between scheduled deadlines
      onSettled: Timer.register.bind(Timer),
    }
  )

  const resetInterval = useCallback(async () => {
    Timer.reset()
    await refetch()
  }, [refetch])

  const value = useMemo(
    () => ({
      batchJobs,
      hasPollingError,
      resetInterval,
      refetch,
    }),
    [refetch, batchJobs, hasPollingError, resetInterval]
  )

  return (
    <PollingContext.Provider value={value}>{children}</PollingContext.Provider>
  )
}
