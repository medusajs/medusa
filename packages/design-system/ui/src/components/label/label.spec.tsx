import { render, screen } from "@testing-library/react"
import * as React from "react"

import { Label } from "./label"

test("renders a label", () => {
  render(<Label>I am a label</Label>)

  const text = screen.getByText("I am a label")
  expect(text).toBeInTheDocument()
  expect(text.tagName).toBe("LABEL")
})
