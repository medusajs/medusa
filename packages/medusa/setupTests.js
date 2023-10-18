global.performance = require("perf_hooks").performance

global.afterEach(async () => {
  await new Promise((resolve) => setImmediate(resolve))
})
