import onProcessTerminated from "./on-process-terminated.js"

export default () => {
  const abortController = new AbortController()
  onProcessTerminated(() => abortController.abort())
  return abortController
}

export const isAbortError = (e: any) =>
  e !== null && "code" in e && e.code === "ABORT_ERR"
