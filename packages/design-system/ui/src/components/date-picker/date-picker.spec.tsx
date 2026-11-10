import { fireEvent, render, screen } from "@testing-library/react"
import * as React from "react"

import { DatePicker } from "./date-picker"

describe("DatePicker", () => {
  it("should not call onChange when the value prop changes", () => {
    const onChange = vi.fn()

    const { rerender } = render(
      <DatePicker
        aria-label="Date"
        value={new Date(2026, 10, 1)}
        onChange={onChange}
      />
    )

    rerender(<DatePicker aria-label="Date" value={null} onChange={onChange} />)
    rerender(
      <DatePicker
        aria-label="Date"
        value={new Date(2026, 10, 2)}
        onChange={onChange}
      />
    )

    expect(onChange).not.toHaveBeenCalled()
  })

  it("should call onChange once with null when cleared", () => {
    const onChange = vi.fn()

    render(
      <DatePicker
        aria-label="Date"
        value={new Date(2026, 10, 1)}
        onChange={onChange}
      />
    )

    const buttons = screen.getAllByRole("button")
    fireEvent.click(buttons[buttons.length - 1])

    expect(onChange).toHaveBeenCalledTimes(1)
    expect(onChange).toHaveBeenCalledWith(null)
  })
})
