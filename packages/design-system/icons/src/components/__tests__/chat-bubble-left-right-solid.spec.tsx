  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import ChatBubbleLeftRightSolid from "../chat-bubble-left-right-solid"

  describe("ChatBubbleLeftRightSolid", () => {
    it("should render the icon without errors", async () => {
      render(<ChatBubbleLeftRightSolid data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })