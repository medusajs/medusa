import React from "react"
import { beforeEach, describe, expect, test, vi } from "vitest"
import { cleanup, fireEvent, render } from "@testing-library/react"
import { OpenAPI } from "types"

// mock data
const mockWorkflow = "test-workflow"

// mock components
vi.mock("@/config", () => ({
  config: {
    baseUrl: "https://example.com",
  },
}))
vi.mock("docs-ui", () => ({
  SourceCodeLink: ({ link, text, icon }: { link: string, text: string, icon: React.ReactNode }) => (
    <div data-testid="source-code-link" data-link={link} data-text={text}>
      {text} {icon}
    </div>
  ),
  DecisionProcessIcon: () => (
    <div data-testid="decision-process-icon">
      Icon
    </div>
  ),
}))

import TagsOperationDescriptionSectionWorkflowBadge from ".."

beforeEach(() => {
  vi.clearAllMocks()
  cleanup()
})

describe("rendering", () => {
  test("renders workflow badge", () => {
    const { container } = render(
      <TagsOperationDescriptionSectionWorkflowBadge workflow={mockWorkflow} />
    )

    const sourceCodeLinkElement = container.querySelector("[data-testid='source-code-link']")
    expect(sourceCodeLinkElement).toBeInTheDocument()
    expect(sourceCodeLinkElement).toHaveTextContent(mockWorkflow)
    expect(sourceCodeLinkElement).toHaveAttribute(
      "data-link", 
      `https://example.com/resources/references/medusa-workflows/${mockWorkflow}`
    )
    const decisionProcessIconElement = container.querySelector("[data-testid='decision-process-icon']")
    expect(decisionProcessIconElement).toBeInTheDocument()
  })
})