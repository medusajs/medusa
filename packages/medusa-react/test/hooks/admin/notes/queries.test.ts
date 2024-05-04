import { renderHook } from "@testing-library/react-hooks/dom"
import { fixtures } from "../../../../mocks/data"
import { useAdminNote, useAdminNotes } from "../../../../src"
import { createWrapper } from "../../../utils"

describe("useAdminNotes hook", () => {
  test("returns a list of notes", async () => {
    const notes = fixtures.list("note")
    const { result, waitFor } = renderHook(() => useAdminNotes(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => result.current.isSuccess)

    expect(result.current.response.status).toEqual(200)
    expect(result.current.notes).toEqual(notes)
  })
})

describe("useAdminNote hook", () => {
  test("returns a note", async () => {
    const note = fixtures.get("note")
    const { result, waitFor } = renderHook(() => useAdminNote(note.id), {
      wrapper: createWrapper(),
    })

    await waitFor(() => result.current.isSuccess)

    expect(result.current.response.status).toEqual(200)
    expect(result.current.note).toEqual(note)
  })
})
