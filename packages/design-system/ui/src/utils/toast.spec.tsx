import { toast as sonnerToast } from "sonner"
import { toast } from "./toast"

vi.mock("sonner", () => {
  const custom = vi.fn()
  const dismiss = vi.fn()
  return { toast: Object.assign(vi.fn(), { custom, dismiss }) }
})

vi.mock("@/components/toast", () => ({
  Toast: () => null,
}))

const custom = vi.mocked(sonnerToast.custom)

describe("toast", () => {
  beforeEach(() => {
    custom.mockClear()
  })

  it("forwards dismissable: true to loading toasts", () => {
    toast.loading("Deploying", {
      id: "x",
      duration: Infinity,
      dismissable: true,
    })

    expect(custom).toHaveBeenCalledTimes(1)
    const [renderFn, external] = custom.mock.calls[0]
    expect(external.dismissible).toBe(true)
    expect(renderFn("toast-id").props.dismissable).toBe(true)
  })

  it("keeps loading toasts non-dismissable by default", () => {
    toast.loading("Deploying")

    const [renderFn, external] = custom.mock.calls[0]
    expect(external.dismissible).toBe(false)
    expect(renderFn("toast-id").props.dismissable).toBe(false)
  })
})
