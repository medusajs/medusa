import { fireEvent, render, screen } from "@testing-library/react"
import * as React from "react"
import { I18nProvider } from "react-aria"
import { vi } from "vitest"

import { DatePicker } from "./date-picker"

type DatePickerProps = React.ComponentProps<typeof DatePicker>

function picker(props: DatePickerProps) {
  return (
    <React.StrictMode>
      <I18nProvider locale="en-GB">
        <DatePicker aria-label="Date" hourCycle={24} {...props} />
      </I18nProvider>
    </React.StrictMode>
  )
}

function expectDate(day: string, month: string, year: string) {
  for (const [name, value] of [
    [/day/i, day],
    [/month/i, month],
    [/year/i, year],
  ] as const) {
    expect(screen.getByRole("spinbutton", { name })).toHaveAttribute(
      "aria-valuenow",
      value
    )
  }
}

describe("DatePicker", () => {
  describe.each(["day", "minute"] as const)("%s granularity", (granularity) => {
    it("renders controlled values and external resets without notifying", () => {
      const onChange = vi.fn()
      const { rerender } = render(
        picker({ value: new Date(2026, 9, 1, 9, 10), granularity, onChange })
      )

      expectDate("1", "10", "2026")
      expect(onChange).not.toHaveBeenCalled()

      rerender(
        picker({ value: new Date(2027, 1, 3, 14, 15), granularity, onChange })
      )

      expectDate("3", "2", "2027")
      if (granularity === "minute") {
        expect(
          screen.getByRole("spinbutton", { name: /hour/i })
        ).toHaveAttribute("aria-valuenow", "14")
        expect(
          screen.getByRole("spinbutton", { name: /minute/i })
        ).toHaveAttribute("aria-valuenow", "15")
      }

      rerender(picker({ value: null, granularity, onChange }))

      expect(
        screen.getByRole("spinbutton", { name: /day/i })
      ).not.toHaveAttribute("aria-valuenow")
      expect(onChange).not.toHaveBeenCalled()

      rerender(
        picker({ value: new Date(2026, 9, 1, 9, 10), granularity, onChange })
      )
      expectDate("1", "10", "2026")
      expect(onChange).not.toHaveBeenCalled()
    })

    it("keeps defaultValue across unrelated rerenders without notifying", () => {
      const onChange = vi.fn()
      const { rerender } = render(
        picker({
          defaultValue: new Date(2026, 9, 1, 9, 10),
          granularity,
          onChange,
        })
      )

      expectDate("1", "10", "2026")

      rerender(
        picker({
          defaultValue: new Date(2027, 1, 3, 14, 15),
          granularity,
          onChange,
        })
      )

      expectDate("1", "10", "2026")
      expect(onChange).not.toHaveBeenCalled()
    })

    it("notifies once and retains an uncontrolled keyboard edit", () => {
      const onChange = vi.fn()
      render(
        picker({
          defaultValue: new Date(2026, 9, 1, 9, 10),
          granularity,
          onChange,
        })
      )

      fireEvent.keyDown(screen.getByRole("spinbutton", { name: /day/i }), {
        key: "ArrowUp",
      })

      expectDate("2", "10", "2026")
      expect(onChange).toHaveBeenCalledTimes(1)
      expect(onChange).toHaveBeenCalledWith(
        new Date(
          2026,
          9,
          2,
          granularity === "minute" ? 9 : 0,
          granularity === "minute" ? 10 : 0
        )
      )
    })

    it("notifies once when clearing an uncontrolled date", () => {
      const onChange = vi.fn()
      render(
        picker({
          defaultValue: new Date(2026, 9, 1, 9, 10),
          granularity,
          onChange,
        })
      )

      fireEvent.click(screen.getByRole("button", { name: "Clear date" }))

      expect(onChange.mock.calls).toEqual([[null]])
      expect(
        screen.getByRole("spinbutton", { name: /day/i })
      ).not.toHaveAttribute("aria-valuenow")
      expect(screen.queryByRole("button", { name: "Clear date" })).toBeNull()
    })

    it("keeps an explicit controlled null empty even with a defaultValue", () => {
      const onChange = vi.fn()
      render(
        picker({
          value: null,
          defaultValue: new Date(2026, 9, 1, 9, 10),
          granularity,
          onChange,
        })
      )

      expect(
        screen.getByRole("spinbutton", { name: /day/i })
      ).not.toHaveAttribute("aria-valuenow")
      expect(onChange).not.toHaveBeenCalled()
    })

    it("supports a controlled parent echoing edits and clear without extra events", () => {
      const onChange = vi.fn()
      const ControlledPicker = () => {
        const [value, setValue] = React.useState<Date | null>(
          new Date(2026, 9, 1, 9, 10)
        )

        return picker({
          value,
          granularity,
          onChange: (next) => {
            onChange(next)
            // Guard against a feedback loop before it can hang the test.
            expect(onChange.mock.calls.length).toBeLessThanOrEqual(2)
            setValue(next)
          },
        })
      }

      render(<ControlledPicker />)

      expect(onChange).not.toHaveBeenCalled()
      fireEvent.keyDown(screen.getByRole("spinbutton", { name: /day/i }), {
        key: "ArrowUp",
      })
      expectDate("2", "10", "2026")
      expect(onChange).toHaveBeenCalledTimes(1)

      fireEvent.click(screen.getByRole("button", { name: "Clear date" }))

      expect(onChange).toHaveBeenCalledTimes(2)
      expect(onChange).toHaveBeenLastCalledWith(null)
      expect(
        screen.getByRole("spinbutton", { name: /day/i })
      ).not.toHaveAttribute("aria-valuenow")
    })

    it("retains the controlled value when the parent does not accept clearing", () => {
      const onChange = vi.fn()
      render(
        picker({ value: new Date(2026, 9, 1, 9, 10), granularity, onChange })
      )

      fireEvent.click(screen.getByRole("button", { name: "Clear date" }))

      expect(onChange.mock.calls).toEqual([[null]])
      expectDate("1", "10", "2026")
    })
  })

  it("does not notify when mounted empty", () => {
    const onChange = vi.fn()
    render(picker({ onChange }))

    expect(onChange).not.toHaveBeenCalled()
  })

  it("preserves date and seconds when editing an uncontrolled time", () => {
    const onChange = vi.fn()
    render(
      picker({
        defaultValue: new Date(2026, 9, 1, 9, 10, 11),
        granularity: "second",
        onChange,
      })
    )

    fireEvent.keyDown(screen.getByRole("spinbutton", { name: /hour/i }), {
      key: "ArrowUp",
    })

    expectDate("1", "10", "2026")
    expect(onChange.mock.calls).toEqual([[new Date(2026, 9, 1, 10, 10, 11)]])
  })

  it("supports uncontrolled edits and clearing without an onChange handler", () => {
    render(picker({ defaultValue: new Date(2026, 9, 1) }))

    fireEvent.keyDown(screen.getByRole("spinbutton", { name: /day/i }), {
      key: "ArrowUp",
    })
    expectDate("2", "10", "2026")

    fireEvent.click(screen.getByRole("button", { name: "Clear date" }))

    expect(
      screen.getByRole("spinbutton", { name: /day/i })
    ).not.toHaveAttribute("aria-valuenow")
  })
})
