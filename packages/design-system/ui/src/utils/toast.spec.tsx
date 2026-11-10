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

describe("toast position", () => {
  afterEach(() => {
    vi.mocked(sonnerToast.custom).mockClear()
  })

  it("should default to the top right when props are passed without a position", () => {
    toast.info("Saved", { description: "The product was saved." })

    expect(getLastToast().external?.position).toEqual("top-right")
  })

  it("should use the given position", () => {
    toast.info("Saved", { position: "bottom-left" })

    expect(getLastToast().external?.position).toEqual("bottom-left")
  })
})
