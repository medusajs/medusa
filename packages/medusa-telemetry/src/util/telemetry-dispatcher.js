import removeSlash from "remove-trailing-slash"
import axios from "axios"

import showAnalyticsNotification from "./show-notification"
import Store from "../store"
import isTruthy from "./is-truthy"

const MEDUSA_TELEMETRY_VERBOSE = process.env.MEDUSA_TELEMETRY_VERBOSE || false
const MAX_RETRIES = 3
const NON_RETRYABLE_ERROR_CODES = new Set([
  "ECONNABORTED",
  "ENOTFOUND",
  "ENETUNREACH",
  "CERT_HAS_EXPIRED",
  "CERT_NOT_YET_VALID",
  "CERT_REVOKED",
  "CERT_UNTRUSTED",
  "DEPTH_ZERO_SELF_SIGNED_CERT",
  "SELF_SIGNED_CERT_IN_CHAIN",
  "UNABLE_TO_GET_ISSUER_CERT_LOCALLY",
  "UNABLE_TO_VERIFY_LEAF_SIGNATURE",
  "ERR_TLS_CERT_ALTNAME_INVALID",
])

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

      return await this.postWithRetry_(`${this.host}${this.path}`, data, req)
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

  async postWithRetry_(url, data, config) {
    for (let retry = 1; ; retry++) {
      try {
        return await this.axiosInstance.post(url, data, config)
      } catch (error) {
        if (retry > MAX_RETRIES || !this.isErrorRetryable_(error)) {
          throw error
        }
        const delay = 2 ** retry * 100
        await new Promise((resolve) =>
          setTimeout(resolve, delay + Math.random() * delay * 0.2)
        )
      }
    }
  }

  isErrorRetryable_(error) {
    // Retry Network Errors.
    if (
      !error.response &&
      error.code &&
      !NON_RETRYABLE_ERROR_CODES.has(error.code)
    ) {
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
