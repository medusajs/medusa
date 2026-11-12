// @vitest-environment jsdom
import React from "react"
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { TooltipProvider } from "@medusajs/ui"
import { HttpTypes } from "@medusajs/types"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { buildMatrix, MatrixPolicy } from "../../../common/utils"
import { EditRolePermissionsForm } from "./edit-role-permissions-form"

// Radix checkboxes inside a form measure themselves, jsdom has no ResizeObserver.
vi.stubGlobal(
  "ResizeObserver",
  class {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
)

const policy = (resource: string, operation: string): MatrixPolicy => ({
  id: `${resource}_${operation}`,
  key: `${resource}:${operation}`,
  resource,
  operation,
})

const policies = ["read", "create", "update", "delete"].flatMap((operation) => [
  policy("product", operation),
  policy("product_tag", operation),
])

// The actor cannot assign product_tag:delete.
const LOCKED = "product_tag_delete"
const assignableIds = new Set(
  policies.map((p) => p.id).filter((id) => id !== LOCKED)
)

const mocks = vi.hoisted(() => ({
  addPolicies: vi.fn(),
  removePolicies: vi.fn(),
  handleSuccess: vi.fn(),
  toastError: vi.fn(),
  confirm: vi.fn(),
}))

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string, options?: { defaultValue?: string }) =>
      options?.defaultValue ?? key,
  }),
}))

vi.mock("../../../../../hooks/use-document-direction", () => ({
  useDocumentDirection: () => "ltr",
}))

vi.mock("@medusajs/ui", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@medusajs/ui")>()

  return {
    ...actual,
    usePrompt: () => mocks.confirm,
    toast: { success: vi.fn(), error: mocks.toastError },
  }
})

vi.mock("../../../../../components/modals", () => ({
  RouteFocusModal: {
    Form: ({ children }: { children: React.ReactNode }) => <>{children}</>,
    Body: ({ children }: { children: React.ReactNode }) => (
      <div>{children}</div>
    ),
    Footer: ({ children }: { children: React.ReactNode }) => (
      <div>{children}</div>
    ),
    Close: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  },
  useRouteModal: () => ({ handleSuccess: mocks.handleSuccess }),
}))

vi.mock("../../../../../components/utilities/keybound-form", () => ({
  KeyboundForm: ({
    children,
    onSubmit,
  }: {
    children: React.ReactNode
    onSubmit: React.FormEventHandler<HTMLFormElement>
  }) => <form onSubmit={onSubmit}>{children}</form>,
}))

vi.mock("../../../../../hooks/api/rbac-roles", () => ({
  useAddRbacRolePolicies: () => ({
    mutateAsync: mocks.addPolicies,
    isPending: false,
  }),
  useRemoveRbacRolePolicies: () => ({
    mutateAsync: mocks.removePolicies,
    isPending: false,
  }),
}))

vi.mock("../../../common/hooks", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../../../common/hooks")>()

  return {
    ...actual,
    usePermissionsMatrix: () => ({
      matrix: buildMatrix(policies, assignableIds),
      assignableIds,
      wildcardPolicies: [],
      isPending: false,
      isError: false,
      error: null,
    }),
  }
})

const renderForm = (heldIds: string[]) => {
  const role = {
    id: "role_1",
    name: "Editor",
    policies: policies.filter((p) => heldIds.includes(p.id)),
  } as unknown as HttpTypes.AdminRbacRole

  render(
    <TooltipProvider>
      <EditRolePermissionsForm role={role} />
    </TooltipProvider>
  )

  // Groups are collapsed by default.
  // The summary lists the group too, the matrix comes first.
  fireEvent.click(screen.getAllByText("Products")[0])
}

const save = () => screen.getByRole("button", { name: "actions.save" })
const cell = (name: string) => screen.getByRole("checkbox", { name })

describe("EditRolePermissionsForm", () => {
  beforeEach(() => {
    mocks.addPolicies.mockResolvedValue({})
    mocks.removePolicies.mockResolvedValue({})
  })

  afterEach(() => {
    cleanup()
    vi.clearAllMocks()
  })

  it("disables Save when nothing changed", () => {
    renderForm(["product_read", "product_create"])

    expect((save() as HTMLButtonElement).disabled).toBe(true)
  })

  it("removes an unchecked policy through a single bulk call", async () => {
    renderForm(["product_read", "product_create", "product_update"])

    fireEvent.click(cell("Update Product"))

    expect((save() as HTMLButtonElement).disabled).toBe(false)
    fireEvent.click(save())

    await waitFor(() => expect(mocks.handleSuccess).toHaveBeenCalled())
    expect(mocks.removePolicies).toHaveBeenCalledTimes(1)
    expect(mocks.removePolicies).toHaveBeenCalledWith(["product_update"])
    expect(mocks.addPolicies).not.toHaveBeenCalled()
  })

  it("adds a checked policy together with its read policy", async () => {
    renderForm([])

    fireEvent.click(cell("Create Product"))
    fireEvent.click(save())

    await waitFor(() => expect(mocks.handleSuccess).toHaveBeenCalled())
    expect(mocks.addPolicies).toHaveBeenCalledTimes(1)

    const { policies: added } = mocks.addPolicies.mock.calls[0][0]
    expect([...added].sort()).toEqual(["product_create", "product_read"])
    expect(mocks.removePolicies).not.toHaveBeenCalled()
  })

  it("keeps a held policy the actor cannot assign, also after Clear all", async () => {
    mocks.confirm.mockResolvedValue(true)
    renderForm([LOCKED, "product_read"])

    const locked = cell("Delete Product tag") as HTMLButtonElement
    expect(locked.disabled).toBe(true)
    expect(locked.getAttribute("data-state")).toBe("checked")

    fireEvent.click(screen.getByText("roles.permissions.matrix.clearAll"))

    await waitFor(() => expect(mocks.confirm).toHaveBeenCalledTimes(1))
    await waitFor(() =>
      expect(
        (cell("Read Product") as HTMLButtonElement).getAttribute("data-state")
      ).toBe("unchecked")
    )
    expect(locked.getAttribute("data-state")).toBe("checked")

    fireEvent.click(save())

    await waitFor(() => expect(mocks.handleSuccess).toHaveBeenCalled())
    expect(mocks.removePolicies).toHaveBeenCalledTimes(1)
    expect(mocks.removePolicies).toHaveBeenCalledWith(["product_read"])
    expect(mocks.addPolicies).not.toHaveBeenCalled()
  })
})
