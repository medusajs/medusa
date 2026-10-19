// @vitest-environment jsdom
import { renderHook } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

const { mockNavigate, mockMutateAsync, mockQueryClientClear } = vi.hoisted(() => ({
  mockNavigate: vi.fn(),
  mockMutateAsync: vi.fn(),
  mockQueryClientClear: vi.fn(),
}))

vi.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}))

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}))

vi.mock("../../../hooks/api/auth", () => ({
  useLogout: () => ({
    mutateAsync: mockMutateAsync,
  }),
}))

vi.mock("../../../lib/query-client", () => ({
  queryClient: {
    clear: mockQueryClientClear,
  },
}))

vi.mock("../../../lib/search/search-entities", () => ({
  getSearchEntityShortcuts: () => [],
  resolveSearchEntityShortcutLabel: () => "",
}))

import { useGlobalShortcuts } from "../hooks"

describe("useGlobalShortcuts logout handler", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    document.body.style.pointerEvents = "none"
  })

  afterEach(() => {
    document.body.style.pointerEvents = ""
  })

  it("navigates to login, clears cache, and resets body pointer-events on successful logout", async () => {
    mockMutateAsync.mockResolvedValueOnce(undefined)

    const { result } = renderHook(() => useGlobalShortcuts())
    const logoutShortcut = result.current.find(
      (s) => s.type === "commandShortcut" && s.callback
    )

    expect(logoutShortcut).toBeDefined()
    await logoutShortcut?.callback?.()

    expect(mockMutateAsync).toHaveBeenCalledTimes(1)
    expect(mockQueryClientClear).toHaveBeenCalledTimes(1)
    expect(mockNavigate).toHaveBeenCalledWith("/login")
    expect(document.body.style.pointerEvents).toBe("")
  })

  it("still navigates to login, clears cache, and resets body pointer-events if mutation fails", async () => {
    mockMutateAsync.mockRejectedValueOnce(new Error("Network error or 401"))

    const { result } = renderHook(() => useGlobalShortcuts())
    const logoutShortcut = result.current.find(
      (s) => s.type === "commandShortcut" && s.callback
    )

    expect(logoutShortcut).toBeDefined()
    await expect(logoutShortcut?.callback?.()).resolves.not.toThrow()

    expect(mockMutateAsync).toHaveBeenCalledTimes(1)
    expect(mockQueryClientClear).toHaveBeenCalledTimes(1)
    expect(mockNavigate).toHaveBeenCalledWith("/login")
    expect(document.body.style.pointerEvents).toBe("")
  })
})
