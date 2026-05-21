import posthog from "posthog-js"
import { AB_AI_FLAG, AB_AI_COOKIE, AB_DISTINCT_ID_COOKIE } from "./ab-tests"

function getCookie(name: string): string | undefined {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`))
  return match ? decodeURIComponent(match[1]) : undefined
}

const distinctId = getCookie(AB_DISTINCT_ID_COOKIE)
const variant = getCookie(AB_AI_COOKIE)

posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
  api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
  person_profiles: "always",
  defaults: "2025-05-24",
  autocapture: false,
  capture_dead_clicks: false,
  capture_heatmaps: false,
  capture_performance: false,
  capture_exceptions: false,
  capture_pageview: true,
  capture_pageleave: false,
  disable_session_recording: true,
  bootstrap:
    distinctId && variant
      ? {
          distinctID: distinctId,
          featureFlags: {
            [AB_AI_FLAG]: variant,
          },
        }
      : undefined,
})
