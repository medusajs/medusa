const { WorkflowManager } = require("@medusajs/orchestration")
const { exportWorkflow } = require("@medusajs/workflows-sdk")

const handlers = new Map()
handlers.set("foo", {
  invoke: () => ({ foo: true }),
  compensate: () => {
    return { foo_reverted: true }
  },
})

handlers.set("bar", {
  invoke: () => ({ bar: true }),
  compensate: () => {
    return { bar_reverted: true }
  },
})

handlers.set("callExternal", {
  invoke: () => {
    // call to external API
    // receive response
    return { external_api_response: true }
  },
  compensate: () => {
    return { callExternal_reverted: true }
  },
})

const tenDaysRetention = 60 * 60 * 24 * 10

WorkflowManager.register(
  "async_test",
  {
    action: "foo",
    next: {
      action: "callExternal",
      async: true,
      next: {
        action: "bar",
      },
    },
  },
  handlers,
  { retentionTime: tenDaysRetention, storeExecution: true }
)

export const asyncWorkflow = exportWorkflow("async_test")
