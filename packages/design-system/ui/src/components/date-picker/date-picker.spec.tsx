import { render, screen } from "@testing-library/react"
import * as React from "react"

import { DatePicker } from "./date-picker"

describe("DatePicker", () => {
  describe("Preset validation", () => {
    it("should throw an error if a preset is before the min year", async () => {
      expect(() =>
        render(
          <DatePicker
            fromYear={1800}
            presets={[
              {
                label: "Year of the first US census",
                date: new Date(1790, 0, 1),
              },
            ]}
          />
        )
      ).toThrowError(
        /Preset Year of the first US census is before fromYear 1800./
      )
    })

    it("should throw an error if a preset is after the max year", async () => {
      expect(() =>
        render(
          <DatePicker
            toYear={2012}
            presets={[
              {
                label: "End of the Mayan calendar",
                date: new Date(2025, 0, 1),
              },
            ]}
          />
        )
      ).toThrowError(/Preset End of the Mayan calendar is after toYear 2012./)
    })
  })

  describe("Single", () => {
    it("should render", async () => {
      render(<DatePicker />)

      expect(screen.getByRole("button")).toBeInTheDocument()
    })
  })

  describe("Range", () => {
    it("should render", async () => {
      render(<DatePicker mode={"range"} />)

      expect(screen.getByRole("button")).toBeInTheDocument()
    })
  })
})
