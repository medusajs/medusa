// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { afterEach, describe, expect, it, vi } from "vitest"

import { KeyboundForm } from "./keybound-form"

afterEach(() => {
  cleanup()
})

describe("KeyboundForm", () => {
  it("allows Enter to activate a focused button", async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()

    render(
      <KeyboundForm>
        <button type="button" onClick={onClick}>
          Close
        </button>
      </KeyboundForm>
    )

    screen.getByRole("button", { name: "Close" }).focus()
    await user.keyboard("{Enter}")

    expect(onClick).toHaveBeenCalledTimes(1)
  })
})
