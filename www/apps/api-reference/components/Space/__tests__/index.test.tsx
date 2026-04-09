import React from "react"
import { beforeEach, describe, expect, test, vi } from "vitest"
import { cleanup, render } from "@testing-library/react"


import Space from ".."

beforeEach(() => {
  vi.clearAllMocks()
  cleanup()
})

describe("rendering", () => {
  test("renders space with default styles", () => {
    const { getByTestId } = render(<Space />)
    const spaceElement = getByTestId("space")
    expect(spaceElement).toBeInTheDocument()
    expect(spaceElement).toHaveStyle({
      height: "1px",
      marginTop: "0px",
      marginBottom: "0px",
      marginLeft: "0px",
      marginRight: "0px",
    })
  })

  test("renders space with correct styles", () => {
    const { getByTestId } = render(<Space top={10} bottom={10} left={10} right={10} />)
    const spaceElement = getByTestId("space")
    expect(spaceElement).toBeInTheDocument()
    expect(spaceElement).toHaveStyle({
      height: "1px",
      marginTop: "9px",
      marginBottom: "9px",
      marginLeft: "10px",
      marginRight: "10px",
    })
  })
})