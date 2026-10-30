// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { Dialog as RadixDialog } from "radix-ui"
import * as React from "react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}))

import { SidebarContext } from "../../../../providers/sidebar-provider/sidebar-context"
import { MobileSidebarContainer } from "../shell"

const TestWrapper = ({
  initialOpen = true,
  children,
}: {
  initialOpen?: boolean
  children?: React.ReactNode
}) => {
  const [mobile, setMobile] = React.useState(initialOpen)
  return (
    <SidebarContext.Provider
      value={{
        mobile,
        desktop: true,
        toggle: () => setMobile((prev) => !prev),
      }}
    >
      <MobileSidebarContainer>
        {children || <div data-testid="sidebar-content">Sidebar Content</div>}
      </MobileSidebarContainer>
    </SidebarContext.Provider>
  )
}

describe("MobileSidebarContainer cleanup", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    document.body.style.pointerEvents = ""
  })

  afterEach(() => {
    cleanup()
    document.body.style.pointerEvents = ""
    vi.restoreAllMocks()
  })

  it(
    "restores document.body.style.pointerEvents to empty string when mobile " +
      "sidebar closes with stale none pointerEvents",
    async () => {
      const user = userEvent.setup()

      // Pre-set pointerEvents to "none"
      document.body.style.pointerEvents = "none"

      render(<TestWrapper initialOpen={true} />)

      // Click close button inside mobile sidebar
      const closeBtn = screen.getByRole("button")
      await user.click(closeBtn)

      expect(document.body.style.pointerEvents).toBe("")
    }
  )

  it(
    "does not clear document.body.style.pointerEvents when another " +
      "active dialog is present",
    async () => {
      const user = userEvent.setup()

      // Pre-set pointerEvents to "none"
      document.body.style.pointerEvents = "none"

      // Render an active dialog in the document
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

      render(<TestWrapper initialOpen={true} />)

      const closeButtons = screen.getAllByRole("button")
      // Close the sidebar dialog
      await user.click(closeButtons[closeButtons.length - 1])

      // Since other-dialog is open, pointerEvents should remain "none"
      expect(document.body.style.pointerEvents).toBe("none")

      unmountOtherDialog()
    }
  )

  it("does not modify pointerEvents if it is not set to none", async () => {
    const user = userEvent.setup()
    document.body.style.pointerEvents = ""

    render(<TestWrapper initialOpen={true} />)

    const closeBtn = screen.getByRole("button")
    await user.click(closeBtn)

    expect(document.body.style.pointerEvents).toBe("")
  })
})
