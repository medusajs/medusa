// The Node test environment, adapted to running suites against a bundled build
// (see `getTestBundleDirectory`). The bundle is loaded with Node's own require,
// outside jest's sandbox, so:
// - the sandbox gets that require (test environments load outside the
//   sandbox, so this module's `require` is Node's);
// - the sandbox shares the real `process.env`, which the bundled app reads
//   (jest otherwise gives each test file its own copy);
// - the sandbox uses the outer `Date`, so dates the app returns are
//   `instanceof Date` in tests (e.g. `expect.any(Date)`).
const NodeEnvironment = require("jest-environment-node").TestEnvironment

class BundleTestEnvironment extends NodeEnvironment {
  constructor(...args: any[]) {
    super(...args)
    this.global.__MEDUSA_NATIVE_REQUIRE__ = require
    // Globals the bundle defines (e.g. `PolicyOperation`) land here
    this.global.__MEDUSA_OUTER_GLOBAL__ = globalThis
    this.global.process.env = process.env
    this.global.Date = Date
  }
}

module.exports = BundleTestEnvironment
