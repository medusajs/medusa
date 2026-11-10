import { render } from "@testing-library/react"
import * as React from "react"
import { I18nProvider } from "react-aria"

import { DatePicker } from "../date-picker"

describe("DateSegment", () => {
  it.each(["en-US", "fr-FR"])(
    "renders every date/time separator as a spacing span in %s",
    (locale) => {
      const { container } = render(
        <I18nProvider locale={locale}>
          <DatePicker
            granularity="minute"
            value={new Date(2026, 8, 9, 9, 5)}
            aria-label="Date"
          />
        </I18nProvider>
      )

      /**
       * The literal between the date and the time depends on the locale:
       * ", " in en-US, a lone " " in fr-FR. Both must become the spacing
       * span. A ", " left as text is a visible comma without a gap; a " "
       * left as text collapses and glues the date to the time.
       *
       * Node's ICU also emits a " " before the day period in en-US
       * (09:05 AM), so the number of spans is not asserted: what matters is
       * that no separator survives as text.
       */
      expect(container.querySelector("span.mx-1")).not.toBeNull()

      const leafTexts = Array.from(container.querySelectorAll("div"))
        .filter((element) => element.children.length === 0)
        .map((element) => element.textContent ?? "")

      expect(leafTexts).not.toContain(", ")
      expect(
        leafTexts.filter((text) => text.length > 0 && text.trim() === "")
      ).toHaveLength(0)
    }
  )
})
