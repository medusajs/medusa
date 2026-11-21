import * as React from "react"
import { toast as sonnerToast } from "sonner"

import { toast } from "./toast"

vi.mock("sonner", () => ({
  toast: {
    custom: vi.fn(),
    dismiss: vi.fn(),
  },
}))

const getLastToast = () => {
  const [renderToast, external] = vi.mocked(sonnerToast.custom).mock.lastCall!
  const element = renderToast("toast-id") as React.ReactElement<{
    dismissable?: boolean
  }>
  return { external, dismissable: element.props.dismissable }
}

describe("toast.loading", () => {
  afterEach(() => {
    vi.mocked(sonnerToast.custom).mockClear()
  })

  it("should be dismissable when dismissable is true", () => {
    toast.loading("Deploying", { duration: Infinity, dismissable: true })

    const { external, dismissable } = getLastToast()

    expect(external?.dismissible).toBe(true)
    expect(dismissable).toBe(true)
  })

  it("should not be dismissable by default", () => {
    toast.loading("Deploying")

    const { external, dismissable } = getLastToast()

    expect(external?.dismissible).toBe(false)
    expect(dismissable).toBe(false)
  })
})

describe("toast callbacks", () => {
  afterEach(() => {
    vi.mocked(sonnerToast.custom).mockClear()
  })

  it("should forward onDismiss and onAutoClose to sonner", () => {
    const onDismiss = vi.fn()
    const onAutoClose = vi.fn()

    toast("Saved", { onDismiss, onAutoClose })

    const { external } = getLastToast()

    expect(external?.onDismiss).toBe(onDismiss)
    expect(external?.onAutoClose).toBe(onAutoClose)
  })

  it("should forward onDismiss and onAutoClose from variant toasts", () => {
    const onDismiss = vi.fn()
    const onAutoClose = vi.fn()

    toast.success("Saved", { onDismiss, onAutoClose })

    const { external } = getLastToast()

    expect(external?.onDismiss).toBe(onDismiss)
    expect(external?.onAutoClose).toBe(onAutoClose)
  })

  it("should forward onDismiss and onAutoClose from promise toasts", async () => {
    const onDismiss = vi.fn()
    const onAutoClose = vi.fn()

    await toast.promise(Promise.resolve(), {
      loading: "Saving",
      success: "Saved",
      error: "Failed",
      onDismiss,
      onAutoClose,
    })
    await new Promise((resolve) => setTimeout(resolve, 0))

    const { external } = getLastToast()

    expect(external?.onDismiss).toBe(onDismiss)
    expect(external?.onAutoClose).toBe(onAutoClose)
  })
})

describe("toast.custom", () => {
  afterEach(() => {
    vi.mocked(sonnerToast.custom).mockClear()
  })

  it("should forward custom render function and props to sonner", () => {
    const customJsx = () => <div>Custom Content</div>
    const onDismiss = vi.fn()
    const onAutoClose = vi.fn()

    toast.custom(customJsx, {
      duration: 3000,
      dismissable: true,
      onDismiss,
      onAutoClose,
    })

    const [renderToast, external] =
      vi.mocked(sonnerToast.custom).mock.lastCall!

    expect(renderToast).toBe(customJsx)
    expect(external).toEqual({
      position: "top-right",
      duration: 3000,
      dismissible: true,
      onDismiss,
      onAutoClose,
    })
  })
})