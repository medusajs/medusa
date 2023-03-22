import { asValue, createContainer } from "awilix"
import {
  existingCartId,
  existingCartIdWithCapturedStatus,
  existingResourceId,
  existingResourceNotCapturedId,
  nonExistingCartId,
  orderIdForExistingCartId,
  paymentId,
  paymentIntentId,
  throwingCartId,
} from "./data"

export const container = createContainer()
container.register(
  "logger",
  asValue({
    warn: jest.fn(),
    error: jest.fn(),
  })
)

container.register(
  "manager",
  asValue({
    transaction: function (cb) {
      return cb(this)
    },
  })
)

container.register(
  "idempotencyKeyService",
  asValue({
    withTransaction: function () {
      return this
    },
    retrieve: jest.fn().mockReturnValue(undefined),
    create: jest.fn().mockReturnValue({}),
  })
)

container.register(
  "cartCompletionStrategy",
  asValue({
    withTransaction: function () {
      return this
    },
    complete: jest.fn(),
  })
)

container.register(
  "cartService",
  asValue({
    withTransaction: function () {
      return this
    },
    retrieve: jest.fn().mockReturnValue({ context: {} }),
  })
)

container.register(
  "orderService",
  asValue({
    withTransaction: function () {
      return this
    },
    retrieveByCartId: jest.fn().mockImplementation(async (cartId) => {
      if (cartId === existingCartId) {
        return {
          id: orderIdForExistingCartId,
          payment_status: "pending",
        }
      }

      if (cartId === existingCartIdWithCapturedStatus) {
        return {
          id: "order-1",
          payment_status: "captured",
        }
      }

      if (cartId === throwingCartId) {
        throw new Error("Error")
      }

      if (cartId === nonExistingCartId) {
        return undefined
      }

      return {}
    }),
    capturePayment: jest.fn(),
  })
)

container.register(
  "paymentCollectionService",
  asValue({
    withTransaction: function () {
      return this
    },
    retrieve: jest.fn().mockImplementation(async (resourceId) => {
      if (resourceId === existingResourceId) {
        return {
          id: existingResourceId,
          payments: [
            {
              id: paymentId,
              data: {
                id: paymentIntentId,
              },
              captured_at: "date",
            },
          ],
        }
      }

      if (resourceId === existingResourceNotCapturedId) {
        return {
          id: existingResourceNotCapturedId,
          payments: [
            {
              id: paymentId,
              data: {
                id: paymentIntentId,
              },
              captured_at: null,
            },
          ],
        }
      }

      return {}
    }),
    capture: jest.fn(),
  })
)
