import { render, screen } from "@testing-library/react"
import * as React from "react"

import { FocusModal } from "./focus-modal"

const renderModal = (header: React.ReactNode) =>
  render(
    <FocusModal open>
      <FocusModal.Content>
        <FocusModal.Title>Create</FocusModal.Title>
        {header}
        <FocusModal.Body>Body</FocusModal.Body>
      </FocusModal.Content>
    </FocusModal>
  )

describe("FocusModal.Header", () => {
  it("names the close button for screen readers", () => {
    renderModal(<FocusModal.Header />)

    expect(screen.getByRole("button", { name: "Close" })).toBeInTheDocument()
  })

  it("accepts a translated close label", () => {
    renderModal(<FocusModal.Header closeLabel="Cerrar" />)

    expect(screen.getByRole("button", { name: "Cerrar" })).toBeInTheDocument()
  })
})
