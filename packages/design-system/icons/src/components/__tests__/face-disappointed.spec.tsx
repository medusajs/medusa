  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import FaceDisappointed from "../face-disappointed"

  describe("FaceDisappointed", () => {
    it("should render the icon without errors", async () => {
      render(<FaceDisappointed data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })