"use strict";

exports.__esModule = true;
exports.testRequireError = void 0;

// This module is also copied into the .cache directory some modules copied there
// from cache-dir can also use this module.
const testRequireError = (moduleName, err) => {
  // PnP will return the following code when a require is allowed per the
  // dependency tree rules but the requested file doesn't exist
  if (err.code === `QUALIFIED_PATH_RESOLUTION_FAILED` || err.pnpCode === `QUALIFIED_PATH_RESOLUTION_FAILED`) {
    return true;
  }

  const regex = new RegExp(`Error:\\s(\\S+\\s)?[Cc]annot find module\\s.${moduleName.replace(/[-/\\^$*+?.()|[\]{}]/g, `\\$&`)}`);
  const [firstLine] = err.toString().split(`\n`);
  return regex.test(firstLine.replace(/\\\\/g, `\\`));
};

exports.testRequireError = testRequireError;
//# sourceMappingURL=test-require-error.js.map