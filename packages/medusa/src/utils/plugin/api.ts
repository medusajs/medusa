import { RequestHandler, Router } from "express"
import { MedusaContainer } from "../../types/global"
import { parseCorsOrigins } from "medusa-core-utils"
import cors from "cors"
import authenticate from "../../api/middlewares/authenticate"

/**
 * Get a middleware / request handler that sets up CORS for the admin app on responses,
 * according to the 'admin_cors' key in medusa config
 * @param container Medusa DI Container
 * @returns express middleware usable by router.use
 */
export function getAdminCors(container: MedusaContainer): RequestHandler {
  return getCors(
    container.resolveCore("configModule").projectConfig.admin_cors ?? ""
  )
}

/**
 * Get a middleware / request handler that sets up CORS for the storefront app on responses,
 * according to the 'store_cors' key in medusa config
 * @param container Medusa DI Container
 * @returns express middleware usable by router.use
 */
export function getStoreCors(container: MedusaContainer): RequestHandler {
  return getCors(
    container.resolveCore("configModule").projectConfig.store_cors ?? ""
  )
}

/**
 * Get a cors middleware for a given cors setting string
 * @param corsString List of cors origins, delimited by ';'
 * @returns express middleware that allows given origins
 */
export function getCors(corsString: string): RequestHandler {
  const corsOptions = {
    origin: parseCorsOrigins(corsString),
    credentials: true,
  }
  return cors(corsOptions)
}

/**
 * Get a router that handles admin requests
 * - CORS configured for admin app
 * - must be authenticated as an admin
 * @param container app's DI container
 * @returns a router - can be used directly or as a middleware
 */
export function adminRouter(container: MedusaContainer): Router {
  const corsHandler = getAdminCors(container)
  return Router().use(corsHandler, authenticate())
}

/**
 * Get a router that handles storefront requests
 * - CORS configured for store app
 * @param container app's DI container
 * @returns a router - can be used directly or as a middleware
 */
export function storeRouter(container: MedusaContainer): Router {
  const corsHandler = getStoreCors(container)
  return Router().use(corsHandler)
}
