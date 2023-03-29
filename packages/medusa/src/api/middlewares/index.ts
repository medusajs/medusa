import { default as authenticate } from "./authenticate"
import { default as authenticateCustomer } from "./authenticate-customer"
import { default as wrap } from "./await-middleware"
import { default as normalizeQuery } from "./normalized-query"
import { default as requireCustomerAuthentication } from "./require-customer-authentication"

export { canAccessBatchJob } from "./batch-job/can-access-batch-job"
export { getRequestedBatchJob } from "./batch-job/get-requested-batch-job"
export { doesConditionBelongToDiscount } from "./discount/does-condition-belong-to-discount"
export { transformIncludesOptions } from "./transform-includes-options"
export { transformBody } from "./transform-body"
export { transformQuery, transformStoreQuery } from "./transform-query"

export default {
  authenticate,
  authenticateCustomer,
  requireCustomerAuthentication,
  normalizeQuery,
  wrap,
}
