import { render, screen } from "@testing-library/react"
import * as React from "react"
import { I18nProvider } from "react-aria"

import { Calendar } from "./calendar"

describe("Calendar", () => {
  it("reflects an externally updated value", () => {
    const calendar = (value: Date) => (
      <I18nProvider locale="en-GB">
        <Calendar aria-label="Date" value={value} />
      </I18nProvider>
    )
    const { rerender } = render(calendar(new Date(2026, 9, 1)))

    rerender(calendar(new Date(2026, 9, 3)))

    expect(screen.getByRole("gridcell", { selected: true })).toHaveTextContent(
      "3"
    )
  })
})
