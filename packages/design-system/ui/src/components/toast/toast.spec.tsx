import { render, screen } from "@testing-library/react"
import * as React from "react"

import { Toast } from "./toast"

describe("Toast", () => {
  it("renders toast with title and description", () => {
    render(
      <Toast
        id="1"
        title="Test Toast"
        description="This is a test description"
      />
    )

    expect(screen.getByText("Test Toast")).toBeInTheDocument()
    expect(screen.getByText("This is a test description")).toBeInTheDocument()
  })

  it("renders dismiss button by default", () => {
    render(<Toast id="1" title="Test Toast" />)

    expect(screen.getByRole("button")).toBeInTheDocument()
  })

  it("does not render dismiss button when dismissable is false", () => {
    render(<Toast id="1" title="Test Toast" dismissable={false} />)

    expect(screen.queryByRole("button")).not.toBeInTheDocument()
  })

  it("renders dismiss button when dismissable is true", () => {
    render(<Toast id="1" title="Test Toast" dismissable={true} />)

    expect(screen.getByRole("button")).toBeInTheDocument()
  })
})
