"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import { AnalyticsBrowser } from "@segment/analytics-next"
import { Area } from "@/types/openapi"

export type ExtraData = {
  area: Area
  section?: string
}

type AnalyticsContextType = {
  analytics: AnalyticsBrowser | null
  track: (
    event: string,
    options?: Record<string, any>,
    callback?: () => void
  ) => void
}

const AnalyticsContext = createContext<AnalyticsContextType | null>(null)

type AnalyticsProviderProps = {
  children?: React.ReactNode
}

const LOCAL_STORAGE_KEY = "ajs_anonymous_id"

const AnalyticsProvider: React.FC<AnalyticsProviderProps> = ({ children }) => {
  const [analytics, setAnalytics] = useState<AnalyticsBrowser | null>(null)

  const init = () => {
    if (!analytics) {
      // setAnalytics(
      //   AnalyticsBrowser.load(
      //     { writeKey: process.env.NEXT_PUBLIC_SEGMENT_API_KEY || "temp" },
      //     {
      //       initialPageview: true,
      //       user: {
      //         localStorage: {
      //           key: LOCAL_STORAGE_KEY,
      //         },
      //       },
      //     }
      //   )
      // )
    }
  }

  const track = async (
    event: string,
    options?: Record<string, any>,
    callback?: () => void
  ) => {
    if (analytics) {
      const userId = (await analytics.user()).anonymousId
      void analytics.track(
        event,
        {
          ...options,
          uuid: userId,
        },
        callback
      )
    } else if (callback) {
      console.warn(
        "Segment is either not installed or not configured. Simulating success..."
      )
      callback()
    }
  }

  useEffect(() => {
    init()
  }, [])

  return (
    <AnalyticsContext.Provider
      value={{
        analytics,
        track,
      }}
    >
      {children}
    </AnalyticsContext.Provider>
  )
}

export default AnalyticsProvider

export const useAnalytics = () => {
  const context = useContext(AnalyticsContext)

  if (!context) {
    throw new Error("useAnalytics must be used within a AnalyticsProvider")
  }

  return context
}
