"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import { Analytics, AnalyticsBrowser } from "@segment/analytics-next"

export type ExtraData = {
  section?: string
  [key: string]: any
}

export type AnalyticsContextType = {
  loaded: boolean
  analytics: Analytics | null
  track: (
    event: string,
    options?: Record<string, any>,
    callback?: () => void
  ) => void
}

const AnalyticsContext = createContext<AnalyticsContextType | null>(null)

export type AnalyticsProviderProps = {
  writeKey?: string
  children?: React.ReactNode
}

const LOCAL_STORAGE_KEY = "ajs_anonymous_id"

export const AnalyticsProvider = ({
  writeKey = "temp",
  children,
}: AnalyticsProviderProps) => {
  // loaded is used to ensure that a connection has been made to segment
  // even if it failed. This is to ensure that the connection isn't
  // continuously retried
  const [loaded, setLoaded] = useState<boolean>(false)
  const [analytics, setAnalytics] = useState<Analytics | null>(null)
  const analyticsBrowser = new AnalyticsBrowser()

  const init = () => {
    if (!loaded) {
      analyticsBrowser
        .load(
          { writeKey },
          {
            initialPageview: true,
            user: {
              localStorage: {
                key: LOCAL_STORAGE_KEY,
              },
            },
          }
        )
        .then((instance) => {
          setAnalytics(instance[0])
        })
        .catch((e) =>
          console.error(`Could not connect to Segment. Error: ${e}`)
        )
        .finally(() => setLoaded(true))
    }
  }

  const track = async (
    event: string,
    options?: Record<string, any>,
    callback?: () => void
  ) => {
    if (analytics) {
      void analytics.track(
        event,
        {
          ...options,
          uuid: analytics.user().anonymousId(),
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
        loaded,
      }}
    >
      {children}
    </AnalyticsContext.Provider>
  )
}

export const useAnalytics = () => {
  const context = useContext(AnalyticsContext)

  if (!context) {
    throw new Error("useAnalytics must be used within a AnalyticsProvider")
  }

  return context
}
