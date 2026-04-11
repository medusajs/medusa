import createAbortController, {
  isAbortError,
  getAbortError,
} from "../create-abort-controller"
import ProcessManager from "../process-manager"

describe("create-abort-controller", () => {
  describe("createAbortController", () => {
    let processManager: ProcessManager
    let sigtermListeners: Array<(...args: any[]) => void>
    let sigintListeners: Array<(...args: any[]) => void>

    beforeEach(() => {
      // Store existing listeners BEFORE creating ProcessManager
      sigtermListeners = process.listeners("SIGTERM") as Array<
        (...args: any[]) => void
      >
      sigintListeners = process.listeners("SIGINT") as Array<
        (...args: any[]) => void
      >
      processManager = new ProcessManager()
    })

    afterEach(() => {
      // Remove all listeners added during tests
      process.removeAllListeners("SIGTERM")
      process.removeAllListeners("SIGINT")
      // Restore original listeners
      sigtermListeners.forEach((listener) =>
        process.on("SIGTERM", listener as any)
      )
      sigintListeners.forEach((listener) => process.on("SIGINT", listener as any))
    })

    it("should create and return an AbortController", () => {
      const abortController = createAbortController(processManager)

      expect(abortController).toBeInstanceOf(AbortController)
      expect(abortController.signal).toBeDefined()
    })

    it("should abort the controller when process terminates with SIGTERM", () => {
      const abortController = createAbortController(processManager)
      const abortSpy = jest.spyOn(abortController, "abort")

      process.emit("SIGTERM")

      expect(abortSpy).toHaveBeenCalled()
    })

    it("should abort the controller when process terminates with SIGINT", () => {
      const abortController = createAbortController(processManager)
      const abortSpy = jest.spyOn(abortController, "abort")

      process.emit("SIGINT")

      expect(abortSpy).toHaveBeenCalled()
    })

    it("should not be aborted initially", () => {
      const abortController = createAbortController(processManager)

      expect(abortController.signal.aborted).toBe(false)
    })
  })

  describe("isAbortError", () => {
    it("should return true for abort error objects", () => {
      const abortError = { code: "ABORT_ERR" }

      expect(isAbortError(abortError)).toBe(true)
    })

    it("should return true for abort error from getAbortError", () => {
      const abortError = getAbortError()

      expect(isAbortError(abortError)).toBe(true)
    })

    it("should return false for null", () => {
      expect(isAbortError(null)).toBe(false)
    })

    it("should return false for undefined", () => {
      expect(isAbortError(undefined)).toBe(false)
    })

    it("should return false for string errors", () => {
      expect(isAbortError("npm install failed with status null")).toBe(false)
    })

    it("should return false for Error objects without code", () => {
      const error = new Error("Something went wrong")

      expect(isAbortError(error)).toBe(false)
    })

    it("should return false for objects with wrong code", () => {
      const error = { code: "ENOENT" }

      expect(isAbortError(error)).toBe(false)
    })

    it("should return false for objects with code as different type", () => {
      const error = { code: 123 }

      expect(isAbortError(error)).toBe(false)
    })

    it("should return false for empty objects", () => {
      expect(isAbortError({})).toBe(false)
    })

    it("should return false for numbers", () => {
      expect(isAbortError(123)).toBe(false)
    })

    it("should return false for booleans", () => {
      expect(isAbortError(true)).toBe(false)
      expect(isAbortError(false)).toBe(false)
    })

    it("should return false for arrays", () => {
      expect(isAbortError([])).toBe(false)
      expect(isAbortError(["ABORT_ERR"])).toBe(false)
    })

    it("should handle objects with ABORT_ERR code and additional properties", () => {
      const error = {
        code: "ABORT_ERR",
        message: "Operation aborted",
        timestamp: Date.now(),
      }

      expect(isAbortError(error)).toBe(true)
    })

    it("should handle Error-like objects with ABORT_ERR code", () => {
      const error = Object.assign(new Error("Aborted"), { code: "ABORT_ERR" })

      expect(isAbortError(error)).toBe(true)
    })
  })

  describe("getAbortError", () => {
    it("should return an object with ABORT_ERR code", () => {
      const error = getAbortError()

      expect(error).toEqual({ code: "ABORT_ERR" })
    })

    it("should return an object that passes isAbortError check", () => {
      const error = getAbortError()

      expect(isAbortError(error)).toBe(true)
    })

    it("should return a new object on each call", () => {
      const error1 = getAbortError()
      const error2 = getAbortError()

      expect(error1).not.toBe(error2)
      expect(error1).toEqual(error2)
    })
  })
})
