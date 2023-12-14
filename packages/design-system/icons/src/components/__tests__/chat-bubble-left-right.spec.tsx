  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import ChatBubbleLeftRight from "../chat-bubble-left-right"

  describe("ChatBubbleLeftRight", () => {
    it("should render without crashing", async () => {
      render(<ChatBubbleLeftRight data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })