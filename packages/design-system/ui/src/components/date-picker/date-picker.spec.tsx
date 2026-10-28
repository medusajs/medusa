import { fireEvent, render, screen } from "@testing-library/react"
import * as React from "react"
import { I18nProvider } from "react-aria"
import { vi } from "vitest"

import { DatePicker } from "./date-picker"

describe("DatePicker", () => {
  it.each(["day", "minute"] as const)(
    "avoids a controlled-parent feedback loop with %s granularity",
    (granularity) => {
      const notifications = new Set<number | undefined>()
      const ControlledPicker = () => {
        const [value, setValue] = React.useState<Date | null>(
          new Date(2026, 9, 1, 9, 10)
        )

        return (
          <I18nProvider locale="en-GB">
            <button onClick={() => setValue(new Date(2027, 1, 3, 14, 15))}>
              Update date
            </button>
            <DatePicker
              aria-label="Date"
              granularity={granularity}
              hourCycle={24}
              value={value}
              onChange={(next) => {
                // Fail before a repeated notification can cause an endless loop.
                expect(notifications.has(next?.getTime())).toBe(false)
                notifications.add(next?.getTime())
                setValue(next)
              }}
            />
          </I18nProvider>
        )
      }

      render(<ControlledPicker />)

      fireEvent.click(screen.getByRole("button", { name: "Update date" }))

      expect(screen.getByRole("spinbutton", { name: /day/i })).toHaveAttribute(
        "aria-valuenow",
        "3"
      )
    }
  )

  it.each(["day", "minute"] as const)(
    "reflects an externally updated value with %s granularity",
    (granularity) => {
      const onChange = vi.fn()
      const picker = (value: Date) => (
        <I18nProvider locale="en-GB">
          <DatePicker
            aria-label="Date"
            granularity={granularity}
            hourCycle={24}
            value={value}
            onChange={onChange}
          />
        </I18nProvider>
      )
      const { rerender } = render(picker(new Date(2026, 9, 1, 9, 10)))

      rerender(picker(new Date(2027, 1, 3, 14, 15)))

      expect(screen.getByRole("spinbutton", { name: /day/i })).toHaveAttribute(
        "aria-valuenow",
        "3"
      )
      expect(
        screen.getByRole("spinbutton", { name: /month/i })
      ).toHaveAttribute("aria-valuenow", "2")
      expect(screen.getByRole("spinbutton", { name: /year/i })).toHaveAttribute(
        "aria-valuenow",
        "2027"
      )

      if (granularity === "minute") {
        expect(
          screen.getByRole("spinbutton", { name: /hour/i })
        ).toHaveAttribute("aria-valuenow", "14")
        expect(
          screen.getByRole("spinbutton", { name: /minute/i })
        ).toHaveAttribute("aria-valuenow", "15")
      }
    }
  )
})
