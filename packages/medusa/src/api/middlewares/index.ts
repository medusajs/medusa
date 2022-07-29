import { default as authenticateCustomer } from "./authenticate-customer"
import { default as authenticate } from "./authenticate"
import { default as normalizeQuery } from "./normalized-query"
import { default as wrap } from "./await-middleware"

export { getRequestedBatchJob } from "./batch-job/get-requested-batch-job"
export { canAccessBatchJob } from "./batch-job/can-access-batch-job"
export { transformQuery } from "./transform-query"
export { transformBody } from "./transform-body"
export { default as awaitMiddleware } from "./await-middleware"

export default {
  authenticate,
  authenticateCustomer,
  normalizeQuery,
  wrap,
}
