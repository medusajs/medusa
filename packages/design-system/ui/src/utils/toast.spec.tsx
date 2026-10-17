import { act, render, screen } from "@testing-library/react"
import * as React from "react"
import { toast as sonnerToast } from "sonner"
import { vi } from "vitest"

import { Toaster } from "@/components/toaster"
import { toast } from "./toast"

describe("toast.loading", () => {
  afterEach(() => {
    act(() => {
      sonnerToast.dismiss()
    })
  })

  it("defaults to dismissable: false when no props are provided", async () => {
    render(<Toaster />)

    act(() => {
      toast.loading("Loading data...")
    })

    const title = await screen.findByText("Loading data...")
    expect(title).toBeInTheDocument()

    // No close button should be present
    expect(screen.queryByRole("button")).not.toBeInTheDocument()
  })

  it("respects dismissable: true when explicitly passed", async () => {
    render(<Toaster />)

    act(() => {
      toast.loading("Deploying...", { dismissable: true })
    })

    const title = await screen.findByText("Deploying...")
    expect(title).toBeInTheDocument()

    // Close button should be rendered
    const closeButton = await screen.findByRole("button")
    expect(closeButton).toBeInTheDocument()
  })

  it("passes dismissible to sonner external options correctly", () => {
    const customSpy = vi.spyOn(sonnerToast, "custom")

    toast.loading("Default loading")
    expect(customSpy).toHaveBeenCalledWith(
      expect.any(Function),
      expect.objectContaining({ dismissible: false })
    )

    toast.loading("Dismissable loading", { dismissable: true })
    expect(customSpy).toHaveBeenCalledWith(
      expect.any(Function),
      expect.objectContaining({ dismissible: true })
    )

    customSpy.mockRestore()
  })
})
