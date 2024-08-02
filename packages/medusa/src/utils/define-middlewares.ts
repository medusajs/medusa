import { defineMiddlewares as originalDefineMiddlewares } from "@medusajs/framework"

/**
 * A helper function to configure the routes by defining custom middleware,
 * bodyparser config and validators to be merged with the pre-existing
 * route validators.
 */
export const defineMiddlewares = originalDefineMiddlewares
