  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import FaceSmile from "../face-smile"

  describe("FaceSmile", () => {
    it("should render the icon without errors", async () => {
      render(<FaceSmile data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })