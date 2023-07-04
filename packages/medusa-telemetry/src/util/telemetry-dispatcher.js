import removeSlash from "remove-trailing-slash"
import axios from "axios"
import axiosRetry from "axios-retry"

import showAnalyticsNotification from "./show-notification"
import Store from "../store"
import isTruthy from "./is-truthy"

const MEDUSA_TELEMETRY_VERBOSE = process.env.MEDUSA_TELEMETRY_VERBOSE || false

class TelemetryDispatcher {
  constructor(options) {
    this.store_ = new Store()

    this.host = removeSlash(
      options.host || "https://telemetry.medusa-commerce.com"
    )
    this.path = removeSlash(options.path || "/batch")

    let axiosInstance = options.axiosInstance
    if (!axiosInstance) {
      axiosInstance = axios.create()
    }
    this.axiosInstance = axiosInstance

    this.timeout = options.timeout || false
    this.flushed = false

    axiosRetry(this.axiosInstance, {
      retries: 3,
      retryDelay: axiosRetry.exponentialDelay,
      retryCondition: this.isErrorRetryable_,
    })
  }

  isTrackingEnabled() {
    // Cache the result
    if (this.trackingEnabled !== undefined) {
      return this.trackingEnabled
    }
    let enabled = this.store_.getConfig(`telemetry.enabled`)
    if (enabled === undefined || enabled === null) {
      showAnalyticsNotification()
      enabled = true
      this.store_.setConfig(`telemetry.enabled`, enabled)
    }
    this.trackingEnabled = enabled
    return enabled
  }

  async dispatch() {
    if (!this.isTrackingEnabled()) {
      return
    }

    await this.store_.flushEvents(async events => {
      if (!events.length) {
        if (isTruthy(MEDUSA_TELEMETRY_VERBOSE)) {
          console.log("No events to POST - skipping")
        }
        return true
      }

      const data = {
        batch: events,
        timestamp: new Date(),
      }

      const req = {
        headers: {},
      }

      return await this.axiosInstance
        .post(`${this.host}${this.path}`, data, req)
        .then(() => {
          if (isTruthy(MEDUSA_TELEMETRY_VERBOSE)) {
            console.log("POSTing batch succeeded")
          }
          return true
        })
        .catch(e => {
          if (isTruthy(MEDUSA_TELEMETRY_VERBOSE)) {
            console.error("Failed to POST event batch", e)
          }
          return false
        })
    })
  }

  isErrorRetryable_(error) {
    // Retry Network Errors.
    if (axiosRetry.isNetworkError(error)) {
      return true
    }

    if (!error.response) {
      // Cannot determine if the request can be retried
      return false
    }

    // Retry Server Errors (5xx).
    if (error.response.status >= 500 && error.response.status <= 599) {
      return true
    }

    // Retry if rate limited.
    if (error.response.status === 429) {
      return true
    }

    return false
  }
}

export default TelemetryDispatcher
