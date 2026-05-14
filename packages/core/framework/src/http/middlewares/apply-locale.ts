import { normalizeLocale } from "@medusajs/utils"
import type {
  MedusaNextFunction,
  MedusaRequest,
  MedusaResponse,
} from "../types"

const CONTENT_LANGUAGE_HEADER = "x-medusa-locale"

/**
 * Middleware that resolves the locale for the current request.
 *
 * Resolution order:
 * 1. Query parameter `?locale=en-US`
 * 2. x-medusa-locale header
 *
 * The resolved locale is set on `req.locale`.
 */
export async function applyLocale(
  req: MedusaRequest,
  _: MedusaResponse,
  next: MedusaNextFunction
) {
  // 1. Check query parameter
  const queryLocale = req.query.locale as string | undefined
  if (queryLocale) {
    req.locale = normalizeLocale(queryLocale)
    delete req.query.locale
    return next()
  }

  // 2. Check x-medusa-locale header
  const headerLocale = req.get(CONTENT_LANGUAGE_HEADER)
  if (headerLocale) {
    req.locale = normalizeLocale(headerLocale)
    return next()
  }

  return next()
}
