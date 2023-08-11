import { renderHook } from "@testing-library/react-hooks/dom"
import { fixtures } from "../../../../mocks/data"
import {
  useAdminCreateNote,
  useAdminDeleteNote,
  useAdminUpdateNote,
} from "../../../../src/"
import { createWrapper } from "../../../utils"

describe("useAdminCreateNote hook", () => {
  test("creates a note and returns it", async () => {
    const note = {
      value: "talked to customer",
      resource_id: "test-swap",
      resource_type: "swap",
    }

    const { result, waitFor } = renderHook(() => useAdminCreateNote(), {
      wrapper: createWrapper(),
    })

    result.current.mutate(note)

    await waitFor(() => result.current.isSuccess)

    expect(result.current.data.response.status).toEqual(200)
    expect(result.current.data.note).toEqual(
      expect.objectContaining({
        ...fixtures.get("note"),
        ...note,
      })
    )
  })
})

describe("useAdminUpdateNote hook", () => {
  test("updates a note and returns it", async () => {
    const note = {
      value: "problem with the supplier",
      resource_id: "test-return",
      resource_type: "return",
    }

    const { result, waitFor } = renderHook(
      () => useAdminUpdateNote(fixtures.get("note").id),
      {
        wrapper: createWrapper(),
      }
    )

    result.current.mutate(note)

    await waitFor(() => result.current.isSuccess)

    expect(result.current.data.response.status).toEqual(200)
    expect(result.current.data.note).toEqual(
      expect.objectContaining({
        ...fixtures.get("note"),
        ...note,
      })
    )
  })
})

describe("useAdminDeleteNote hook", () => {
  test("deletes a note", async () => {
    const { result, waitFor } = renderHook(
      () => useAdminDeleteNote(fixtures.get("note").id),
      {
        wrapper: createWrapper(),
      }
    )

    result.current.mutate()

    await waitFor(() => result.current.isSuccess)

    expect(result.current.data.response.status).toEqual(200)
    expect(result.current.data).toEqual(
      expect.objectContaining({
        id: fixtures.get("note").id,
        deleted: true,
      })
    )
  })
})
