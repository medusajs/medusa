/**
 * A/B test configuration for documentation pages.
 *
 * Each entry maps a URL path to its variant rewrite path.
 * The feature flag name in PostHog controls which variant is served.
 */

export const AB_AI_FLAG = "docs-ai-variant"

export const AB_AI_COOKIE = "ab_docs_variant"
export const AB_DISTINCT_ID_COOKIE = "ab_distinct_id"

/**
 * Maps original paths to their variant paths.
 * When the feature flag evaluates to "ai", requests to the key
 * are rewritten to the value.
 */
export const AB_TEST_PAGES: Record<string, string> = {
  "/learn": "/learn/variants/ai",
  "/learn/installation": "/learn/installation/variants/ai",
}
