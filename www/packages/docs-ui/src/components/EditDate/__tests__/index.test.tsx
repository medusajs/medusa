import React from "react"
import { describe, expect, test } from "vitest"
import { render } from "@testing-library/react"
import { EditDate } from "../../EditDate"

// mock data
const today = new Date()

describe("render", () => {
  test("renders edit date", () => {
    const { container } = render(
      <EditDate date={`${today.getFullYear()}-01-01`} />
    )
    expect(container).toBeInTheDocument()
    const editDate = container.querySelector("[data-testid='edit-date']")
    expect(editDate).toBeInTheDocument()
    expect(editDate).toHaveTextContent("Edited Jan 1")
  })

  test("renders edit date with different year", () => {
    const lastYear = today.getFullYear() - 1
    const { container } = render(<EditDate date={`${lastYear}-01-01`} />)
    expect(container).toBeInTheDocument()
    const editDate = container.querySelector("[data-testid='edit-date']")
    expect(editDate).toBeInTheDocument()
    expect(editDate).toHaveTextContent(`Edited Jan 1, ${lastYear}`)
  })

  test("doesn't render edit date if date is invalid", () => {
    const { container } = render(<EditDate date="invalid-date" />)
    expect(container).toBeInTheDocument()
    const editDate = container.querySelector("[data-testid='edit-date']")
    expect(editDate).not.toBeInTheDocument()
  })
})
