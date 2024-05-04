import { act, renderHook } from "@testing-library/react"

import { useToggleState } from "./use-toggle-state"

describe("useToggleState", () => {
  test("should return a state and a function to toggle it", () => {
    const { result } = renderHook(() => useToggleState())

    expect(result.current[0]).toBe(false)
    expect(typeof result.current[1]).toBe("function")
  })

  test("should return a state and a function to toggle it with an initial value", () => {
    const { result } = renderHook(() => useToggleState(true))

    expect(result.current[0]).toBe(true)
  })

  test("should update the state when the toggle function is called", () => {
    const { result } = renderHook(() => useToggleState())

    expect(result.current[0]).toBe(false)

    act(() => {
      result.current[1]()
    })

    expect(result.current[0]).toBe(true)
  })

  test("should update the state when the close function is called", () => {
    const { result } = renderHook(() => useToggleState(true))

    expect(result.current[0]).toBe(true)

    act(() => {
      result.current[2]()
    })

    expect(result.current[0]).toBe(false)
  })

  test("should update the state when the open function is called", () => {
    const { result } = renderHook(() => useToggleState())

    expect(result.current[0]).toBe(false)

    act(() => {
      result.current[3]()
    })

    expect(result.current[0]).toBe(true)
  })
})
