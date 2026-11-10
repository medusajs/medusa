import { render, screen } from "@testing-library/react"
import * as React from "react"

import { Toast } from "./toast"

describe("Toast", () => {
  it("renders the action's icon after its label", () => {
    render(
      <Toast
        id="toast"
        title="New feature"
        action={{
          label: "Learn more",
          altText: "Learn more about the new feature",
          onClick: () => {},
          icon: <svg data-testid="action-icon" />,
        }}
      />
    )

    const action = screen.getByRole("button", { name: "Learn more" })
    expect(action).toContainElement(screen.getByTestId("action-icon"))
  })

  it("renders media above the content", () => {
    render(
      <Toast id="toast" title="New feature" media={<img alt="Preview" />} />
    )

    expect(screen.getByRole("img", { name: "Preview" })).toBeInTheDocument()
  })
})
