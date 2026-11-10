// @vitest-environment jsdom
import React from "react"
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, describe, expect, it, vi } from "vitest"
import { HttpTypes } from "@medusajs/types"

import { EditUserForm } from "./edit-user-form"

const mocks = vi.hoisted(() => ({
  mutateAsync: vi.fn(),
  handleSuccess: vi.fn(),
  toastError: vi.fn(),
}))

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}))

vi.mock("@medusajs/ui", () => ({
  Button: ({
    children,
    isLoading: _isLoading,
    ...props
  }: React.ComponentProps<"button"> & { isLoading?: boolean }) => (
    <button {...props}>{children}</button>
  ),
  Input: (props: React.ComponentProps<"input">) => <input {...props} />,
  toast: {
    success: vi.fn(),
    error: mocks.toastError,
  },
}))

vi.mock("../../../../../components/common/form", () => ({
  Form: {
    Label: ({ children }: { children: React.ReactNode }) => (
      <label>{children}</label>
    ),
    Field: ({
      render,
    }: {
      render: (props: { field: object }) => React.ReactNode
    }) => <>{render({ field: {} })}</>,
    Item: ({ children }: { children: React.ReactNode }) => (
      <div>{children}</div>
    ),
    Control: ({ children }: { children: React.ReactNode }) => <>{children}</>,
    ErrorMessage: () => null,
  },
}))

vi.mock("../../../../../components/modals", () => ({
  RouteDrawer: {
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

vi.mock("../../../../../hooks/api/users", () => ({
  useUpdateUser: () => ({ mutateAsync: mocks.mutateAsync, isPending: false }),
}))

const user = {
  id: "user_1",
  email: "user@example.com",
  first_name: "Jane",
  last_name: "Doe",
} as unknown as HttpTypes.AdminUser

describe("EditUserForm", () => {
  afterEach(() => {
    cleanup()
    vi.clearAllMocks()
  })

  it("shows the error in a toast when updating the user fails", async () => {
    mocks.mutateAsync.mockImplementation(
      async (_values: unknown, options?: { onError?: (e: Error) => void }) => {
        options?.onError?.(new Error("Failed to fetch"))
      }
    )

    render(<EditUserForm user={user} />)

    fireEvent.click(screen.getByRole("button", { name: "actions.save" }))

    await waitFor(() => {
      expect(mocks.mutateAsync).toHaveBeenCalledTimes(1)
      expect(mocks.toastError).toHaveBeenCalledWith("Failed to fetch")
    })
    expect(mocks.handleSuccess).not.toHaveBeenCalled()
  })
})
