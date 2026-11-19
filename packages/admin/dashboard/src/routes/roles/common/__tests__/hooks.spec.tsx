// @vitest-environment jsdom
import { renderHook } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { useConfirmDeleteRole } from "../hooks"

const mocks = vi.hoisted(() => ({
  canReadUsers: true,
  prompt: vi.fn(),
  listUsers: vi.fn(),
}))

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string, options?: { count?: number }) => {
      return options?.count !== undefined ? `${key}:${options.count}` : key
    },
  }),
}))

vi.mock("@medusajs/ui", () => ({
  usePrompt: () => mocks.prompt,
}))

vi.mock("../../../../lib/client", () => ({
  sdk: { admin: { rbacRole: { listUsers: mocks.listUsers } } },
}))

vi.mock("../../../../providers/permissions-provider", () => ({
  usePermissions: () => ({ hasAllPermissions: () => mocks.canReadUsers }),
}))

vi.mock("../../../../hooks/api/rbac-policies", () => ({
  useRbacPolicies: vi.fn(),
  useRbacAssignablePolicies: vi.fn(),
}))

const role = { id: "role_1", name: "Editor" }

const descriptionOf = () => mocks.prompt.mock.calls[0][0].description

describe("useConfirmDeleteRole", () => {
  beforeEach(() => {
    mocks.canReadUsers = true
    mocks.prompt.mockReset().mockResolvedValue(true)
    mocks.listUsers.mockReset()
  })

  it("says how many users hold the role", async () => {
    mocks.listUsers.mockResolvedValue({ users: [{}], count: 3 })
    const { result } = renderHook(() => useConfirmDeleteRole())

    await expect(result.current(role)).resolves.toBe(true)

    expect(mocks.listUsers).toHaveBeenCalledWith("role_1", { limit: 1 })
    expect(descriptionOf()).toBe("roles.delete.descriptionWithUsers:3")
  })

  it("uses the plain description when no user holds the role", async () => {
    mocks.listUsers.mockResolvedValue({ users: [], count: 0 })
    const { result } = renderHook(() => useConfirmDeleteRole())

    await result.current(role)

    expect(descriptionOf()).toBe("roles.delete.description")
  })

  it("does not look up users the actor cannot read", async () => {
    mocks.canReadUsers = false
    const { result } = renderHook(() => useConfirmDeleteRole())

    await result.current(role)

    expect(mocks.listUsers).not.toHaveBeenCalled()
    expect(descriptionOf()).toBe("roles.delete.description")
  })

  it("still prompts when the user lookup fails", async () => {
    mocks.listUsers.mockRejectedValue(new Error("boom"))
    const { result } = renderHook(() => useConfirmDeleteRole())

    await result.current(role)

    expect(descriptionOf()).toBe("roles.delete.description")
  })
})
