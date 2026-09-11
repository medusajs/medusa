import { render } from "@testing-library/react"
import * as React from "react"
import { I18nProvider } from "react-aria"

import { DatePicker } from "../date-picker"

describe("DateSegment", () => {
  it.each(["en-US", "fr-FR"])(
    "keeps a gap between the date and the time in %s",
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
       * The literal between the date and the time is ", " in en-US and a
       * lone " " in fr-FR. Both must render the spacing span; a bare
       * whitespace text node would collapse and glue "09/09/2026" to "09:05".
       */
      expect(container.querySelector("span.mx-1")).not.toBeNull()
    }
  )
})
