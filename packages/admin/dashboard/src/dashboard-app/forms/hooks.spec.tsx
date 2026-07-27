// @vitest-environment jsdom
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, describe, expect, it, vi } from "vitest"
import { z } from "zod"

import { useExtendableForm } from "./hooks"

/**
 * Regression coverage for the zod v4 / @hookform/resolvers v5 upgrade.
 *
 * With @hookform/resolvers@3 the zodResolver guarded on the removed
 * `ZodError.errors` property, so under zod v4 it re-threw instead of mapping
 * issues into `formState.errors` — admin form validation errors were silently
 * dropped. These tests assert the validated behaviour: invalid submits surface
 * field errors, valid submits still reach the submit handler.
 */
describe("useExtendableForm zod v4 validation", () => {
  afterEach(() => {
    cleanup()
    vi.restoreAllMocks()
  })

  const schema = z.object({
    title: z.string().min(1, "Title is required"),
  })

  const TestForm = ({
    onValid,
    defaultTitle,
  }: {
    onValid: (values: { title: string }) => void
    defaultTitle: string
  }) => {
    const form = useExtendableForm({
      defaultValues: { title: defaultTitle },
      schema,
      configs: [],
    })

    return (
      <form onSubmit={form.handleSubmit(onValid)}>
        <input aria-label="title" {...form.register("title")} />
        {form.formState.errors.title && (
          <span role="alert">
            {String(form.formState.errors.title.message)}
          </span>
        )}
        <button type="submit">Submit</button>
      </form>
    )
  }

  it("surfaces a field error on an invalid submit", async () => {
    const onValid = vi.fn()
    render(<TestForm onValid={onValid} defaultTitle="" />)

    fireEvent.click(screen.getByText("Submit"))

    expect(await screen.findByText("Title is required")).toBeTruthy()
    expect(onValid).not.toHaveBeenCalled()
  })

  it("calls the submit handler on a valid submit", async () => {
    const onValid = vi.fn()
    render(<TestForm onValid={onValid} defaultTitle="Hello" />)

    fireEvent.click(screen.getByText("Submit"))

    await waitFor(() => expect(onValid).toHaveBeenCalledTimes(1))
    expect(screen.queryByText("Title is required")).toBeNull()
  })
})
