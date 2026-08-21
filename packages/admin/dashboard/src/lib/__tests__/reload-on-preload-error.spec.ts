import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { registerReloadOnPreloadError } from "../reload-on-preload-error"

const dispatchPreloadError = () => {
  const event = new Event("vite:preloadError", { cancelable: true })
  ;(window as unknown as EventTarget).dispatchEvent(event)
  return event
}

describe("registerReloadOnPreloadError", () => {
  beforeEach(() => {
    vi.useFakeTimers()

    const store = new Map<string, string>()
    vi.stubGlobal("window", new EventTarget())
    vi.stubGlobal("sessionStorage", {
      getItem: (key: string) => store.get(key) ?? null,
      setItem: (key: string, value: string) => void store.set(key, value),
    })
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.useRealTimers()
  })

  it("reloads once and cancels the event", () => {
    const reload = vi.fn()
    registerReloadOnPreloadError(reload)

    const event = dispatchPreloadError()

    expect(reload).toHaveBeenCalledTimes(1)
    expect(event.defaultPrevented).toBe(true)
  })

  it("does not reload again within the cooldown, letting the error surface", () => {
    const reload = vi.fn()
    registerReloadOnPreloadError(reload)

    dispatchPreloadError()
    const second = dispatchPreloadError()

    expect(reload).toHaveBeenCalledTimes(1)
    expect(second.defaultPrevented).toBe(false)
  })

  it("reloads again after the cooldown has passed", () => {
    const reload = vi.fn()
    registerReloadOnPreloadError(reload)

    dispatchPreloadError()
    vi.advanceTimersByTime(11_000)
    dispatchPreloadError()

    expect(reload).toHaveBeenCalledTimes(2)
  })

  it("does not reload when storage is unusable", () => {
    vi.stubGlobal("sessionStorage", {
      getItem: () => {
        throw new Error("blocked")
      },
      setItem: () => {
        throw new Error("blocked")
      },
    })

    const reload = vi.fn()
    registerReloadOnPreloadError(reload)

    const event = dispatchPreloadError()

    expect(reload).not.toHaveBeenCalled()
    expect(event.defaultPrevented).toBe(false)
  })
})
