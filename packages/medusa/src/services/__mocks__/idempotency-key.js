import { MockManager } from "medusa-test-utils"

export const IdempotencyKeyService = {
  withTransaction: function() {
    return this
  },
  initializeRequest: jest.fn().mockImplementation(() => {
    return {
      idempotency_key: "testkey",
      recovery_point: "started",
    }
  }),
  workStage: jest.fn().mockImplementation(async (key, fn) => {
    try {
      const { recovery_point, response_code, response_body } = await fn(
        MockManager
      )

      if (recovery_point) {
        return {
          key: { recovery_point },
        }
      } else {
        return {
          key: {
            recovery_point: "finished",
            response_body,
            response_code,
          },
        }
      }
    } catch (err) {
      return { error: err }
    }
  }),
}

const mock = jest.fn().mockImplementation(() => {
  return IdempotencyKeyService
})

export default mock
