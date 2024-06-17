import ProcessManager from "./process-manager.js"

export default (processManager: ProcessManager) => {
  const abortController = new AbortController()
  processManager.onTerminated(() => abortController.abort())
  return abortController
}

export const isAbortError = (e: any) =>
  e !== null && "code" in e && e.code === "ABORT_ERR"

export const getAbortError = () => {
  return {
    code: "ABORT_ERR",
  }
}
