import { describe, expect, it, vi } from "vitest"

const g = globalThis as any
g.HTMLTextAreaElement = class {}
g.HTMLButtonElement = class {}
g.HTMLAnchorElement = class {}
g.HTMLInputElement = class {}

import { KeyboundForm } from "../keybound-form"

const renderForm = () => {
  const onSubmit = vi.fn()
  const form = (KeyboundForm as any).render({ onSubmit }, null)

  return { onKeyDown: form.props.onKeyDown, onSubmit }
}

const createEnterEvent = (
  target: unknown,
  modifiers: { metaKey?: boolean; ctrlKey?: boolean } = {}
) => ({
  key: "Enter",
  target,
  metaKey: false,
  ctrlKey: false,
  preventDefault: vi.fn(),
  ...modifiers,
})

describe("KeyboundForm", () => {
  it.each([
    ["button", () => new g.HTMLButtonElement()],
    ["link", () => new g.HTMLAnchorElement()],
  ])(
    "should let Enter activate a focused %s",
    (_, createTarget) => {
      const { onKeyDown, onSubmit } = renderForm()
      const event = createEnterEvent(createTarget())

      onKeyDown(event)

      expect(event.preventDefault).not.toHaveBeenCalled()
      expect(onSubmit).not.toHaveBeenCalled()
    }
  )

  it("should not submit the form when pressing Enter in an input", () => {
    const { onKeyDown, onSubmit } = renderForm()
    const event = createEnterEvent(new g.HTMLInputElement())

    onKeyDown(event)

    expect(event.preventDefault).toHaveBeenCalled()
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it("should submit the form when pressing Cmd+Enter or Ctrl+Enter", () => {
    const { onKeyDown, onSubmit } = renderForm()

    onKeyDown(createEnterEvent(new g.HTMLInputElement(), { metaKey: true }))
    onKeyDown(createEnterEvent(new g.HTMLButtonElement(), { ctrlKey: true }))

    expect(onSubmit).toHaveBeenCalledTimes(2)
  })
})
