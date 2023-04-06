import { default as authenticate } from "./authenticate"
import { default as authenticateCustomer } from "./authenticate-customer"
import { default as wrap } from "./await-middleware"
import { default as normalizeQuery } from "./normalized-query"
import { default as requireCustomerAuthentication } from "./require-customer-authentication"

export { default as authenticate } from "./authenticate"
export { default as authenticateCustomer } from "./authenticate-customer"
export { default as wrapHandler } from "./await-middleware"
export { canAccessBatchJob } from "./batch-job/can-access-batch-job"
export { getRequestedBatchJob } from "./batch-job/get-requested-batch-job"
export { doesConditionBelongToDiscount } from "./discount/does-condition-belong-to-discount"
export { default as normalizeQuery } from "./normalized-query"
export { default as requireCustomerAuthentication } from "./require-customer-authentication"
export { transformBody } from "./transform-body"
export { transformIncludesOptions } from "./transform-includes-options"
export { transformQuery, transformStoreQuery } from "./transform-query"

/**
 * @deprecated you can now import the middlewares directly without passing by the default export
 * e.g `import { authenticate } from "@medusajs/medusa"
 */
export default {
  authenticate,
  authenticateCustomer,
  requireCustomerAuthentication,
  normalizeQuery,
  /**
   * @deprecated use `import { wrapHandler } from "@medusajs/medusa"`
   */
  wrap,
}
