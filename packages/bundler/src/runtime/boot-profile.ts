/**
 * Inlined first in the entry: with MEDUSA_LOG_BOOT_TIMINGS=true, records the
 * self time spent evaluating each bundled file. Every file pushes its path on
 * __MEDUSA_FILE_STACK__ when it starts and pops it when done (see
 * keepIdentity), so the time between two of those marks belongs to the file
 * on top. logBootSummary (@medusajs/utils) reports it.
 */
export const RUNTIME_BOOT_PROFILE = `
if (process.env.MEDUSA_LOG_BOOT_TIMINGS === "true") {
  (function () {
    var stack = [], self = new Map(), last = performance.now();
    var charge = function () {
      var now = performance.now();
      if (stack.length) {
        var file = stack[stack.length - 1];
        self.set(file, (self.get(file) || 0) + now - last);
      }
      last = now;
    };
    stack.push = function (file) { charge(); return Array.prototype.push.call(this, file); };
    stack.pop = function () { charge(); return Array.prototype.pop.call(this); };
    globalThis.__MEDUSA_FILE_STACK__ = stack;
    globalThis.__MEDUSA_BOOT_EVAL_PROFILE__ = {
      startedAt: process.uptime(),
      self: self,
    };
  })();
}
`
