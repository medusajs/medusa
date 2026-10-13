import { fireEvent, render, screen } from "@testing-library/react"
import * as React from "react"

import { Alert } from "./alert"

describe("Alert", () => {
  it("names the dismiss button and dismisses the alert", () => {
    render(<Alert dismissible>Saved</Alert>)

    fireEvent.click(screen.getByRole("button", { name: "Dismiss" }))

    expect(screen.queryByText("Saved")).not.toBeInTheDocument()
  })

  it("accepts a translated dismiss label", () => {
    render(
      <Alert dismissible dismissLabel="Descartar">
        Guardado
      </Alert>
    )

    expect(
      screen.getByRole("button", { name: "Descartar" })
    ).toBeInTheDocument()
  })

  it("has no dismiss button unless dismissible", () => {
    render(<Alert>Saved</Alert>)

    expect(screen.queryByRole("button")).not.toBeInTheDocument()
  })
})
