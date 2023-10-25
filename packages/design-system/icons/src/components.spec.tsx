import { cleanup, render, screen } from "@testing-library/react"
import fs from "fs"
import path from "path"
import * as React from "react"

const componentsDir = path.join(__dirname, "components")

const icons = fs
  .readdirSync(componentsDir)
  .filter((file) => file !== "index.ts")

describe("Icon", () => {
  let testedIcons = 0

  it("should render each icon", async () => {
    const components = await Promise.all(
      icons.map(async (icon) => {
        const componentName = icon.replace(".tsx", "")
        const { default: Component } = await import(
          `./components/${componentName}`
        )

        return Component as React.FC
      })
    )

    components.forEach((Component) => {
      render(<Component data-testid="icon" />)

      // Check if the SVG element is rendered
      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      testedIcons++

      cleanup()
    })
  })

  it(`should verify that all ${icons.length} icons have been tested`, () => {
    expect(testedIcons).toBe(icons.length)
  })
})
