import { render, screen } from "@testing-library/react"
import * as React from "react"

import { Drawer } from "./drawer"

const renderDrawer = (header: React.ReactNode) =>
  render(
    <Drawer open>
      <Drawer.Content>
        {header}
        <Drawer.Body>Body</Drawer.Body>
      </Drawer.Content>
    </Drawer>
  )

describe("Drawer.Header", () => {
  it("names the close button for screen readers", () => {
    renderDrawer(
      <Drawer.Header>
        <Drawer.Title>Edit</Drawer.Title>
      </Drawer.Header>
    )

    expect(screen.getByRole("button", { name: "Close" })).toBeInTheDocument()
  })

  it("accepts a translated close label", () => {
    renderDrawer(
      <Drawer.Header closeLabel="Cerrar">
        <Drawer.Title>Editar</Drawer.Title>
      </Drawer.Header>
    )

    expect(screen.getByRole("button", { name: "Cerrar" })).toBeInTheDocument()
  })
})
