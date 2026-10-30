// @vitest-environment jsdom
import { cleanup, render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { DropdownMenu, toast } from "@medusajs/ui"
import { Dialog as RadixDialog } from "radix-ui"
import * as React from "react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

const mockNavigate = vi.fn()
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom")
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}))

const mockMutateAsync = vi.fn()
let mockIsPending = false
vi.mock("../../../../hooks/api", () => ({
  useLogout: () => ({
    mutateAsync: mockMutateAsync,
    isPending: mockIsPending,
  }),
  useMe: () => ({
    user: {
      first_name: "Test",
      last_name: "User",
      email: "test@medusajs.com",
    },
    isPending: false,
    isError: false,
  }),
}))

import { Logout } from "../user-menu"
import { queryClient } from "../../../../lib/query-client"

const renderLogout = () => {
  return render(
    <DropdownMenu defaultOpen={true}>
      <DropdownMenu.Content>
        <Logout />
      </DropdownMenu.Content>
    </DropdownMenu>
  )
}

describe("Logout component", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockIsPending = false
    document.body.style.pointerEvents = ""
    vi.spyOn(queryClient, "clear")
    vi.spyOn(toast, "error").mockImplementation(() => "" as any)
  })

  afterEach(() => {
    cleanup()
    document.body.style.pointerEvents = ""
    vi.restoreAllMocks()
  })

  it(
    "clears query cache, redirects to /login, and restores pointerEvents to " +
      "default empty value on successful logout",
    async () => {
      const user = userEvent.setup()
      mockMutateAsync.mockResolvedValueOnce(undefined)
      document.body.style.pointerEvents = "none"

      renderLogout()

      const logoutButton = screen.getByRole("menuitem", {
        name: /app.menus.actions.logout/i,
      })
      await user.click(logoutButton)

      await waitFor(() => {
        expect(mockMutateAsync).toHaveBeenCalledTimes(1)
        expect(queryClient.clear).toHaveBeenCalledTimes(1)
        expect(mockNavigate).toHaveBeenCalledWith("/login")
        expect(document.body.style.pointerEvents).toBe("")
      })
    }
  )

  it(
    "handles logout error by showing toast.error and still clears query " +
      "cache, redirects to /login, and restores pointerEvents",
    async () => {
      const user = userEvent.setup()
      const error = new Error("Network error during logout")
      mockMutateAsync.mockRejectedValueOnce(error)
      document.body.style.pointerEvents = "none"

      renderLogout()

      const logoutButton = screen.getByRole("menuitem", {
        name: /app.menus.actions.logout/i,
      })
      await user.click(logoutButton)

      await waitFor(() => {
        expect(mockMutateAsync).toHaveBeenCalledTimes(1)
        expect(toast.error).toHaveBeenCalledWith(
          "Network error during logout"
        )
        expect(queryClient.clear).toHaveBeenCalledTimes(1)
        expect(mockNavigate).toHaveBeenCalledWith("/login")
        expect(document.body.style.pointerEvents).toBe("")
      })
    }
  )

  it(
    "does not override pointerEvents when another modal dialog is " +
      "active during logout",
    async () => {
      const user = userEvent.setup()
      mockMutateAsync.mockResolvedValueOnce(undefined)
      document.body.style.pointerEvents = "none"

      const { unmount: unmountOtherDialog } = render(
        <RadixDialog.Root defaultOpen={true}>
          <RadixDialog.Portal>
            <RadixDialog.Overlay />
            <RadixDialog.Content data-testid="other-dialog">
              <RadixDialog.Title>Active Dialog</RadixDialog.Title>
              <RadixDialog.Description>
                Active description
              </RadixDialog.Description>
            </RadixDialog.Content>
          </RadixDialog.Portal>
        </RadixDialog.Root>
      )

      renderLogout()

      const logoutButton = screen.getByRole("menuitem", {
        name: /app.menus.actions.logout/i,
      })
      await user.click(logoutButton)

      await waitFor(() => {
        expect(mockMutateAsync).toHaveBeenCalledTimes(1)
        expect(queryClient.clear).toHaveBeenCalledTimes(1)
        expect(mockNavigate).toHaveBeenCalledWith("/login")
        expect(document.body.style.pointerEvents).toBe("none")
      })

      unmountOtherDialog()
    }
  )

  it(
    "prevents duplicate logout submissions while a logout request is " +
      "already pending",
    async () => {
      const user = userEvent.setup()
      let resolveLogout: () => void = () => {}
      mockMutateAsync.mockImplementation(
        () =>
          new Promise<void>((resolve) => {
            resolveLogout = resolve
          })
      )

      renderLogout()

      const logoutButton = screen.getByRole("menuitem", {
        name: /app.menus.actions.logout/i,
      })

      // First click initiates logout
      await user.click(logoutButton)
      expect(mockMutateAsync).toHaveBeenCalledTimes(1)

      // Second click while pending should not trigger another call
      await user.click(logoutButton)
      expect(mockMutateAsync).toHaveBeenCalledTimes(1)

      // Resolve the mutation
      resolveLogout()

      await waitFor(() => {
        expect(queryClient.clear).toHaveBeenCalledTimes(1)
        expect(mockNavigate).toHaveBeenCalledWith("/login")
      })
    }
  )

  it("disables the menu item when logout mutation reports isPending", () => {
    mockIsPending = true

    renderLogout()

    const logoutButton = screen.getByRole("menuitem", {
      name: /app.menus.actions.logout/i,
    })
    expect(logoutButton.hasAttribute("data-disabled")).toBe(true)
    expect(logoutButton.getAttribute("aria-disabled")).toBe("true")
  })
})
