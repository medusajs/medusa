import type { NavigateFunction } from "react-router-dom"

type NotificationFunction = (title: string, message: string) => void

export type Notify = {
  error: NotificationFunction
  success: NotificationFunction
  info: NotificationFunction
  warning: NotificationFunction
}

export type Navigate = NavigateFunction

export type FeatureFlagHelpers = {
  isFeatureEnabled: (flag: string) => boolean
  featureToggleList: Record<string, boolean>
}
