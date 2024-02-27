import { render, screen } from "@testing-library/react"
import * as React from "react"

import { Text } from "./text"

describe("Text", () => {
  it("renders a text", () => {
    render(<Text>I am a paragraph</Text>)

    const text = screen.getByText("I am a paragraph")
    expect(text).toBeInTheDocument()
    expect(text.tagName).toBe("P")
  })

  it("renders a text as a child", () => {
    render(
      <Text asChild>
        <span>I am a span</span>
      </Text>
    )

    const text = screen.getByText("I am a span")
    expect(text).toBeInTheDocument()
    expect(text.tagName).toBe("SPAN")
  })
})
