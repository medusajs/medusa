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
