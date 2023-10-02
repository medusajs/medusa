import { AnalyticsBrowser } from "@segment/analytics-next"
import { useAdminGetSession, useAdminStore, useAdminUsers } from "medusa-react"
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react"
import { useLocation } from "react-router-dom"
import Fade from "../components/atoms/fade-wrapper"
import AnalyticsPreferencesModal from "../components/organisms/analytics-preferences"
import { useDebounce } from "../hooks/use-debounce"
import { useFeatureFlag } from "../providers/feature-flag-provider"
import { useAdminAnalyticsConfig } from "../services/analytics"

type Props = {
  children?: React.ReactNode
  writeKey: string
}

type Event =
  | "numProducts"
  | "numOrders"
  | "numDiscounts"
  | "numUsers"
  | "regions"
  | "currencies"
  | "storeName"
  | "userEmail"

type AnalyticsContextType = {
  trackCurrencies: (properties: TrackCurrenciesPayload) => void
  trackNumberOfOrders: (properties: TrackCountPayload) => void
  trackNumberOfDiscounts: (properties: TrackCountPayload) => void
  trackNumberOfProducts: (properties: TrackCountPayload) => void
  trackRegions: (properties: TrackRegionsPayload) => void
  trackUserEmail: (properties: TrackUserEmailPayload) => void
  setSubmittingConfig: (status: boolean) => void
}

const AnalyticsContext = createContext<AnalyticsContextType | null>(null)

export const AnalyticsProvider = ({ writeKey, children }: Props) => {
  const [submittingConfig, setSubmittingConfig] = useState(false)
  const { analytics_config: config, isLoading } = useAdminAnalyticsConfig()

  const location = useLocation()

  const { user } = useAdminGetSession()
  const { users } = useAdminUsers()
  const { store } = useAdminStore()

  const { isFeatureEnabled } = useFeatureFlag()
  const isEnabled = useMemo(() => {
    return isFeatureEnabled("analytics")
  }, [isFeatureEnabled])

  const analytics = useMemo(() => {
    if (!config || !isEnabled) {
      return null // Don't initialize analytics if not enabled or the user's preferences are not loaded yet
    }

    if (config.opt_out) {
      return null // Don't initialize if user has opted out
    }

    return AnalyticsBrowser.load({ writeKey })
  }, [config, writeKey, isEnabled])

  useEffect(() => {
    if (!analytics || !config || !user || !store) {
      return
    }

    analytics.identify(user.id, {
      store: store.name,
    })
  }, [config, analytics, user, store])

  const askPermission = useMemo(() => {
    if (submittingConfig) {
      return true
    }

    if (!isEnabled || !user) {
      return false // Don't ask for permission if feature is not enabled
    }

    return !config && !isLoading
  }, [config, isLoading, isEnabled, user, submittingConfig])

  /**
   * Ensure that the focus modal is animated smoothly.
   */
  const animateIn = useDebounce(askPermission, 1000)

  const track = useCallback(
    (event: Event, properties?: Record<string, unknown>) => {
      if (!analytics) {
        // If analytics is not initialized, then we return early
        return
      }

      analytics.track(event, properties)
    },
    [analytics]
  )

  const trackNumberOfUsers = useCallback(
    (properties: TrackCountPayload) => {
      track("numUsers", properties)
    },
    [track]
  )

  const trackStoreName = useCallback(
    (properties: TrackStoreNamePayload) => {
      track("storeName", properties)
    },
    [track]
  )

  const trackNumberOfProducts = (properties: TrackCountPayload) => {
    track("numProducts", properties)
  }

  const trackNumberOfOrders = (properties: TrackCountPayload) => {
    track("numOrders", properties)
  }

  const trackRegions = (properties: TrackRegionsPayload) => {
    track("regions", properties)
  }

  const trackCurrencies = (properties: TrackCurrenciesPayload) => {
    track("currencies", properties)
  }

  const trackNumberOfDiscounts = (properties: TrackCountPayload) => {
    track("numDiscounts", properties)
  }

  const trackUserEmail = (properties: TrackUserEmailPayload) => {
    track("userEmail", properties)
  }

  // Track number of users
  useEffect(() => {
    if (users) {
      trackNumberOfUsers({ count: users.length })
    }
  }, [users, trackNumberOfUsers])

  // Track store name
  useEffect(() => {
    if (store) {
      trackStoreName({ name: store.name })
    }
  }, [store, trackStoreName])

  // Track pages visited when location changes
  useEffect(() => {
    if (!analytics) {
      return
    }

    analytics.page()
  }, [location])

  return (
    <AnalyticsContext.Provider
      value={{
        trackRegions,
        trackCurrencies,
        trackNumberOfOrders,
        trackNumberOfProducts,
        trackNumberOfDiscounts,
        trackUserEmail,
        setSubmittingConfig,
      }}
    >
      {askPermission && (
        <Fade isVisible={animateIn} isFullScreen={true}>
          <AnalyticsPreferencesModal />
        </Fade>
      )}
      {children}
    </AnalyticsContext.Provider>
  )
}

type TrackCurrenciesPayload = {
  used_currencies: string[]
}

type TrackStoreNamePayload = {
  name: string
}

type TrackCountPayload = {
  count: number
}

type TrackRegionsPayload = {
  regions: string[]
  count: number
}

type TrackUserEmailPayload = {
  email: string | undefined
}

export const useAnalytics = () => {
  const context = useContext(AnalyticsContext)

  if (!context) {
    throw new Error("useAnalytics must be used within a AnalyticsProvider")
  }

  return context
}
