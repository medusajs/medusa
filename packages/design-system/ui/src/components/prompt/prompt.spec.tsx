import {
  RenderResult,
  cleanup,
  fireEvent,
  render,
} from "@testing-library/react"
import * as React from "react"

import { Prompt } from "./prompt"

import { Button } from "@/components/button"

const TRIGGER_TEXT = "Open"
const TITLE_TEXT = "Delete something"
const DESCRIPTION_TEXT = "Are you sure? This cannot be undone."
const CANCEL_TEXT = "Cancel"
const CONFIRM_TEXT = "Confirm"

describe("Prompt", () => {
  let rendered: RenderResult
  let trigger: HTMLElement

  beforeEach(() => {
    rendered = render(
      <Prompt>
        <Prompt.Trigger asChild>
          <Button>{TRIGGER_TEXT}</Button>
        </Prompt.Trigger>
        <Prompt.Content>
          <Prompt.Header>
            <Prompt.Title>{TITLE_TEXT}</Prompt.Title>
            <Prompt.Description>{DESCRIPTION_TEXT}</Prompt.Description>
          </Prompt.Header>
          <Prompt.Footer>
            <Prompt.Cancel>{CANCEL_TEXT}</Prompt.Cancel>
            <Prompt.Action>{CONFIRM_TEXT}</Prompt.Action>
          </Prompt.Footer>
        </Prompt.Content>
      </Prompt>
    )

    trigger = rendered.getByText(TRIGGER_TEXT)
  })

  afterEach(() => {
    cleanup()
  })

  it("renders a basic alert dialog when the trigger is clicked", async () => {
    fireEvent.click(trigger)

    const title = await rendered.findByText(TITLE_TEXT)
    const description = await rendered.findByText(DESCRIPTION_TEXT)

    expect(title).toBeInTheDocument()
    expect(description).toBeInTheDocument()
  })

  it("close the dialog when the cancel button is clicked", async () => {
    fireEvent.click(trigger)

    const title = rendered.queryByText(TITLE_TEXT)
    const description = rendered.queryByText(DESCRIPTION_TEXT)

    expect(title).toBeInTheDocument()
    expect(description).toBeInTheDocument()

    const cancelButton = await rendered.findByText(CANCEL_TEXT)

    fireEvent.click(cancelButton)

    expect(title).not.toBeInTheDocument()
    expect(description).not.toBeInTheDocument()
  })

  it("close the dialog when the confirm button is clicked", async () => {
    fireEvent.click(trigger)

    const title = rendered.queryByText(TITLE_TEXT)
    const description = rendered.queryByText(DESCRIPTION_TEXT)

    expect(title).toBeInTheDocument()
    expect(description).toBeInTheDocument()

    const confirmButton = await rendered.findByText(CONFIRM_TEXT)

    fireEvent.click(confirmButton)

    expect(title).not.toBeInTheDocument()
    expect(description).not.toBeInTheDocument()
  })
})
