// @vitest-environment jsdom
import { cleanup, render } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import { afterEach, describe, expect, it, vi } from "vitest"

import { PublicLayout } from "../public-layout"

vi.mock("../../../../hooks/use-document-title", () => ({
  DocumentTitle: () => null,
}))

afterEach(() => {
  cleanup()
  document.body.style.pointerEvents = ""
})

describe("PublicLayout", () => {
  it("restores body pointer-events when mounted", () => {
    document.body.style.pointerEvents = "none"

    render(
      <MemoryRouter initialEntries={["/login"]}>
        <PublicLayout />
      </MemoryRouter>
    )

    expect(document.body.style.pointerEvents).toBe("")
  })
})
