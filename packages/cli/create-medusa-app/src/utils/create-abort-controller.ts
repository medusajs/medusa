import ProcessManager from "./process-manager.js"

export default (processManager: ProcessManager) => {
  const abortController = new AbortController()
  processManager.onTerminated(() => abortController.abort())
  // Clack spinners put stdin in raw mode and call process.exit() on Ctrl+C
  // instead of emitting SIGINT, so child processes must also be stopped on exit.
  process.on("exit", () => abortController.abort())
  return abortController
}

export const isAbortError = (e: any) =>
  e !== null && typeof e === "object" && "code" in e && e.code === "ABORT_ERR"

export const getAbortError = () => {
  return {
    code: "ABORT_ERR",
  }
}
