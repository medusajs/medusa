/**
 * Inlined in the bundle's entry: adds a hint to the "Cannot find module" error
 * of a request that is neither in the bundle nor on disk. The error's code and
 * first line stay as Node wrote them (code probes optional dependencies with
 * try/require), and errors already carrying the hint are left alone.
 */
export const RUNTIME_MISSING_MODULE_HINT = `
function __medusaAddMissingModuleHint(error, request) {
  if (!error || error.code !== "MODULE_NOT_FOUND" || typeof error.message !== "string") return;
  if (error.message.indexOf("medusa build --bundle") !== -1) return;
  if (require("module").isBuiltin(request)) return;
  var hint = "This app is running from a bundle built with 'medusa build --bundle'; '" + request + "' is not in the bundle and was not found on disk. Packages and modules that are only enabled at run time are not bundled: enable them in the configuration the build sees, or install them next to the bundle.";
  var message = error.message;
  error.message = message + "\\n" + hint;
  if (typeof error.stack === "string" && error.stack.indexOf(message) !== -1) {
    error.stack = error.stack.replace(message, error.message);
  }
}
`
