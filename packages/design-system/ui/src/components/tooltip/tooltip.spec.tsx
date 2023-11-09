import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { Tooltip } from "./tooltip"

test("Tooltip renders trigger element", () => {
  render(
    <Tooltip content="Tooltip text">
      <div>Hover me</div>
    </Tooltip>
  )

  const triggerElement = screen.getByText("Hover me")
  expect(triggerElement).toBeInTheDocument()
})

test("Tooltip shows on hover", async () => {
  render(
    <Tooltip content="Tooltip text" data-testid="tooltip">
      <div>Hover me</div>
    </Tooltip>
  )
  const triggerElement = screen.getByText("Hover me")

  const user = userEvent.setup()

  await user.hover(triggerElement)

  await waitFor(() => {
    const tooltip = screen.getByTestId("tooltip")

    expect(tooltip).toBeInTheDocument()
  })
})
