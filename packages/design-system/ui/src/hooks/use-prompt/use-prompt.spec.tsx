import { RenderResult, fireEvent, render } from "@testing-library/react"
import * as React from "react"

import { usePrompt } from "./use-prompt"

const OPEN_TEXT = "Open dialog"
const TITLE_TEXT = "Delete something"
const DESCRIPTION_TEXT = "Are you sure? This cannot be undone."
const CANCEL_TEXT = "Cancel"
const CONFIRM_TEXT = "Confirm"
const VERIFICATION_TEXT = "medusa-design-system"

const DialogTest = ({ verificationText }: { verificationText?: string }) => {
  const dialog = usePrompt()

  const handleAction = async () => {
    await dialog({
      title: TITLE_TEXT,
      description: DESCRIPTION_TEXT,
      cancelText: CANCEL_TEXT,
      confirmText: CONFIRM_TEXT,
      verificationText,
      variant: "danger",
    })
  }

  return (
    <div>
      <button onClick={handleAction}>{OPEN_TEXT}</button>
    </div>
  )
}

describe("usePrompt", () => {
  let rendered: RenderResult
  let trigger: HTMLElement

  beforeEach(() => {
    rendered = render(<DialogTest />)
    trigger = rendered.getByText(OPEN_TEXT)
  })

  afterEach(() => {
    // Try to find the cancel button and click it to close the dialog
    // We need to do this a we are appending a div to the body and it will not be removed
    // automatically by the cleanup
    const cancelButton = rendered.queryByText(CANCEL_TEXT)

    if (cancelButton) {
      fireEvent.click(cancelButton)
    }
  })

  it("renders a basic alert dialog when the trigger is clicked", async () => {
    fireEvent.click(trigger)

    const title = await rendered.findByText(TITLE_TEXT)
    const description = await rendered.findByText(DESCRIPTION_TEXT)

    expect(title).toBeInTheDocument()
    expect(description).toBeInTheDocument()
  })

  it("unmounts the dialog when the cancel button is clicked", async () => {
    fireEvent.click(trigger)

    const cancelButton = await rendered.findByText(CANCEL_TEXT)

    fireEvent.click(cancelButton)

    const title = rendered.queryByText(TITLE_TEXT)
    const description = rendered.queryByText(DESCRIPTION_TEXT)

    expect(title).not.toBeInTheDocument()
    expect(description).not.toBeInTheDocument()
  })

  it("unmounts the dialog when the confirm button is clicked", async () => {
    fireEvent.click(trigger)

    const confirmButton = await rendered.findByText(CONFIRM_TEXT)

    fireEvent.click(confirmButton)

    const title = rendered.queryByText(TITLE_TEXT)
    const description = rendered.queryByText(DESCRIPTION_TEXT)

    expect(title).not.toBeInTheDocument()
    expect(description).not.toBeInTheDocument()
  })

  it("renders a verification input when verificationText is provided", async () => {
    rendered.rerender(<DialogTest verificationText="delete" />)
    fireEvent.click(trigger)

    const input = await rendered.findByRole("textbox")

    expect(input).toBeInTheDocument()
  })

  it("renders a disabled confirm button when verificationText is provided", async () => {
    rendered.rerender(<DialogTest verificationText={VERIFICATION_TEXT} />)
    fireEvent.click(trigger)

    const button = await rendered.findByText(CONFIRM_TEXT)

    expect(button).toBeDisabled()
  })

  it("renders an enabled confirm button when verificationText is provided and the input matches", async () => {
    rendered.rerender(<DialogTest verificationText={VERIFICATION_TEXT} />)
    fireEvent.click(trigger)

    const input = await rendered.findByRole("textbox")
    const button = await rendered.findByText(CONFIRM_TEXT)

    fireEvent.change(input, { target: { value: VERIFICATION_TEXT } })

    expect(button).toBeEnabled()
  })
})
