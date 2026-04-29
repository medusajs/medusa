import React from "react"
import { beforeEach, describe, expect, test, vi } from "vitest"
import { cleanup, fireEvent, render, waitFor } from "@testing-library/react"
import { OpenAPI } from "types"

// mock data
const mockOperation: OpenAPI.Operation = {
  operationId: "test-operation-id",
  "x-authenticated": false,
  "x-codeSamples": [],
  tags: ["test-tag"],
  summary: "test-summary",
  description: "test-description",
  responses: {},
  parameters: [],
  requestBody: {
    content: {},
  },
}

// mock components
vi.mock("@/components/Tags/Operation/DescriptionSection/Security", () => ({
  default: ({ security }: { security: OpenAPI.OpenAPIV3.SecurityRequirementObject[] }) => (
    <div data-testid="security">{JSON.stringify(security)}</div>
  ),
}))
vi.mock("@/components/Tags/Operation/DescriptionSection/RequestBody", () => ({
  default: ({ requestBody }: { requestBody: OpenAPI.RequestObject }) => (
    <div data-testid="request-body">{JSON.stringify(requestBody)}</div>
  ),
}))
vi.mock("@/components/Tags/Operation/DescriptionSection/Responses", () => ({
  default: ({ responses }: { responses: OpenAPI.ResponsesObject }) => (
    <div data-testid="responses">{JSON.stringify(responses)}</div>
  ),
}))
vi.mock("@/components/Tags/Operation/DescriptionSection/Parameters", () => ({
  default: ({ parameters }: { parameters: OpenAPI.Parameter[] }) => (
    <div data-testid="parameters">{JSON.stringify(parameters)}</div>
  ),
}))
vi.mock("@/components/Tags/Operation/DescriptionSection/WorkflowBadge", () => ({
  default: ({ workflow }: { workflow: string }) => (
    <div data-testid="workflow">{workflow}</div>
  ),
}))
vi.mock("@/components/Tags/Operation/DescriptionSection/Events", () => ({
  default: ({ events }: { events: OpenAPI.OasEvents[] }) => (
    <div data-testid="events">{JSON.stringify(events)}</div>
  ),
}))
vi.mock("@/components/Tags/Operation/DescriptionSection/DeprecationNotice", () => ({
  default: ({ deprecationMessage }: { deprecationMessage: string }) => (
    <div data-testid="deprecation-notice">{deprecationMessage}</div>
  ),
}))
vi.mock("@/components/Tags/Operation/DescriptionSection/FeatureFlagNotice", () => ({
  default: ({ featureFlag }: { featureFlag: string }) => (
    <div data-testid="feature-flag">{featureFlag}</div>
  ),
}))
vi.mock("@/components/MDXContent/Client", () => ({
  default: ({ content }: { content: string }) => (
    <div data-testid="mdx-content">{content}</div>
  ),
}))
vi.mock("docs-ui", () => ({
  Badge: ({ 
    variant, 
    children, 
    ...props
  }: { variant: string, children: React.ReactNode, [key: string]: unknown }) => (
    <div data-testid="badge" data-variant={variant} {...props}>{children}</div>
  ),
  Link: ({ 
    href, 
    children,
    ...props
  }: { href: string, children: React.ReactNode, [key: string]: unknown }) => (
    <div data-testid="link" data-href={href} {...props}>{children}</div>
  ),
  FeatureFlagNotice: ({ featureFlag }: { featureFlag: string }) => (
    <div data-testid="feature-flag">{featureFlag}</div>
  ),
  H2: ({ children }: { children: React.ReactNode }) => (
    <h2 data-testid="h2">{children}</h2>
  ),
  Tooltip: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="tooltip">{children}</div>
  ),
  MarkdownContent: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="markdown-content">{children}</div>
  ),
}))
vi.mock("@/components/Feedback", () => ({
  Feedback: ({ question }: { question: string }) => (
    <div data-testid="feedback">{question}</div>
  ),
}))

import TagsOperationDescriptionSection from ".."

beforeEach(() => {
  vi.clearAllMocks()
  cleanup()
})

describe("rendering", () => {
  test("renders operation summary, description, feedback, responses (default)", async () => {
    const { container } = render(<TagsOperationDescriptionSection operation={mockOperation} />)

    const h2Element = container.querySelector("[data-testid='h2']")
    expect(h2Element).toBeInTheDocument()
    expect(h2Element).toHaveTextContent(mockOperation.summary)
    const mdxContentElement = container.querySelector("[data-testid='mdx-content']")
    expect(mdxContentElement).toBeInTheDocument()
    expect(mdxContentElement).toHaveTextContent(mockOperation.description)
    const feedbackElement = container.querySelector("[data-testid='feedback']")
    expect(feedbackElement).toBeInTheDocument()
    expect(feedbackElement).toHaveTextContent("Did this API Route run successfully?")
    await waitFor(() => {
      const responsesElement = container.querySelector("[data-testid='responses']")
      expect(responsesElement).toBeInTheDocument()
      expect(responsesElement).toHaveTextContent(JSON.stringify(mockOperation.responses))
    })
  })

  test("renders deprecated notice when operation is deprecated", async () => {
    const modifiedOperation: OpenAPI.Operation = {
      ...mockOperation,
      deprecated: true,
      "x-deprecated_message": "test-deprecated-message",
    }
    const { container } = render(<TagsOperationDescriptionSection operation={modifiedOperation} />)
    await waitFor(() => {
      const deprecationNoticeElement = container.querySelector("[data-testid='deprecation-notice']")
      expect(deprecationNoticeElement).toBeInTheDocument()
      expect(deprecationNoticeElement).toHaveTextContent("test-deprecated-message")
    })
  })

  test("does not render deprecated notice when operation is not deprecated", () => {
    const { container } = render(<TagsOperationDescriptionSection operation={mockOperation} />)
    const deprecationNoticeElement = container.querySelector("[data-testid='deprecation-notice']")
    expect(deprecationNoticeElement).not.toBeInTheDocument()
  })

  test("renders feature flag notice when operation has a feature flag", () => {
    const modifiedOperation: OpenAPI.Operation = {
      ...mockOperation,
      "x-featureFlag": "test-feature-flag",
    }
    const { container } = render(<TagsOperationDescriptionSection operation={modifiedOperation} />)
    const featureFlagNoticeElement = container.querySelector("[data-testid='feature-flag']")
    expect(featureFlagNoticeElement).toBeInTheDocument()
    expect(featureFlagNoticeElement).toHaveTextContent("test-feature-flag")
  })

  test("does not render feature flag notice when operation does not have a feature flag", () => {
    const { container } = render(<TagsOperationDescriptionSection operation={mockOperation} />)
    const featureFlagNoticeElement = container.querySelector("[data-testid='feature-flag']")
    expect(featureFlagNoticeElement).not.toBeInTheDocument()
  })

  test("renders since badge when operation has a since", () => {
    const modifiedOperation: OpenAPI.Operation = {
      ...mockOperation,
      "x-since": "1.0.0",
    }
    const { container } = render(<TagsOperationDescriptionSection operation={modifiedOperation} />)
    const sinceBadgeElement = container.querySelector("[data-testid='since-badge']")
    expect(sinceBadgeElement).toBeInTheDocument()
    expect(sinceBadgeElement).toHaveTextContent("1.0.0")
  })

  test("does not render since badge when operation does not have a since", () => {
    const { container } = render(<TagsOperationDescriptionSection operation={mockOperation} />)
    const sinceBadgeElement = container.querySelector("[data-testid='since-badge']")
    expect(sinceBadgeElement).not.toBeInTheDocument()
  })

  test("renders operation custom badges when operation has custom badges", () => {
    const modifiedOperation: OpenAPI.Operation = {
      ...mockOperation,
      "x-badges": [{
        text: "test-badge",
        description: "test-description",
        variant: "blue",
      }],
    }
    const { container } = render(<TagsOperationDescriptionSection operation={modifiedOperation} />)
    const customBadgeElement = container.querySelector("[data-testid='custom-badge']")
    expect(customBadgeElement).toBeInTheDocument()
    expect(customBadgeElement).toHaveTextContent("test-badge")
    expect(customBadgeElement).toHaveAttribute("data-variant", "blue")
  })

  test("does not render custom badges when operation does not have custom badges", () => {
    const { container } = render(<TagsOperationDescriptionSection operation={mockOperation} />)
    const customBadgeElement = container.querySelector("[data-testid='custom-badge']")
    expect(customBadgeElement).not.toBeInTheDocument()
  })

  test("renders operation's workflow badge when operation has a workflow", async () => {
    const modifiedOperation: OpenAPI.Operation = {
      ...mockOperation,
      "x-workflow": "test-workflow",
    }
    const { container } = render(<TagsOperationDescriptionSection operation={modifiedOperation} />)
    await waitFor(() => {
      const workflowBadgeElement = container.querySelector("[data-testid='workflow']")
      expect(workflowBadgeElement).toBeInTheDocument()
      expect(workflowBadgeElement).toHaveTextContent("test-workflow")
    })
  })

  test("does not render workflow badge when operation does not have a workflow", () => {
    const { container } = render(<TagsOperationDescriptionSection operation={mockOperation} />)
    const workflowBadgeElement = container.querySelector("[data-testid='workflow']")
    expect(workflowBadgeElement).not.toBeInTheDocument()
  })

  test("renders operation's related guide link when operation has a related guide", () => {
    const modifiedOperation: OpenAPI.Operation = {
      ...mockOperation,
      externalDocs: {
        url: "https://example.com",
        description: "test-description",
      },
    }
    const { container } = render(<TagsOperationDescriptionSection operation={modifiedOperation} />)
    const relatedGuideLinkElement = container.querySelector("[data-testid='related-guide-link']")
    expect(relatedGuideLinkElement).toBeInTheDocument()
    expect(relatedGuideLinkElement).toHaveTextContent("test-description")
    expect(relatedGuideLinkElement).toHaveAttribute("data-href", "https://example.com")
  })

  test("does not render related guide link when operation does not have a related guide", () => {
    const { container } = render(<TagsOperationDescriptionSection operation={mockOperation} />)
    const relatedGuideLinkElement = container.querySelector("[data-testid='related-guide-link']")
    expect(relatedGuideLinkElement).not.toBeInTheDocument()
  })

  test("renders operation's security when operation has security", async () => {
    const modifiedOperation: OpenAPI.Operation = {
      ...mockOperation,
      security: [{ "bearer": [] }],
    }
    const { container } = render(<TagsOperationDescriptionSection operation={modifiedOperation} />)
    await waitFor(() => {
      const securityElement = container.querySelector("[data-testid='security']")
      expect(securityElement).toBeInTheDocument()
      expect(securityElement).toHaveTextContent(JSON.stringify(modifiedOperation.security))
    })
  })

  test("does not render security when operation does not have security", () => {
    const { container } = render(<TagsOperationDescriptionSection operation={mockOperation} />)
    const securityElement = container.querySelector("[data-testid='security']")
    expect(securityElement).not.toBeInTheDocument()
  })

  test("renders operation's parameters when operation has parameters", () => {
    const modifiedOperation: OpenAPI.Operation = {
      ...mockOperation,
      parameters: [{
        name: "test-parameter",
        in: "query",
        description: "test-description",
        schema: {
          type: "string",
          properties: {},
        },
        examples: {},
      }],
    }
    const { container } = render(<TagsOperationDescriptionSection operation={modifiedOperation} />)
    const parametersElement = container.querySelector("[data-testid='parameters']")
    expect(parametersElement).toBeInTheDocument()
    expect(parametersElement).toHaveTextContent(JSON.stringify(modifiedOperation.parameters))
  })

  test("does not render parameters when operation does not have parameters", () => {
    const { container } = render(<TagsOperationDescriptionSection operation={mockOperation} />)
    const parametersElement = container.querySelector("[data-testid='parameters']")
    expect(parametersElement).not.toBeInTheDocument()
  })

  test("renders operation's request body when operation has a request body", async () => {
    const modifiedOperation: OpenAPI.Operation = {
      ...mockOperation,
      requestBody: {
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {},
            },
          },
        },
      },
    }
    const { container } = render(<TagsOperationDescriptionSection operation={modifiedOperation} />)
    await waitFor(() => {
      const requestBodyElement = container.querySelector("[data-testid='request-body']")
      expect(requestBodyElement).toBeInTheDocument()
      expect(requestBodyElement).toHaveTextContent(JSON.stringify(modifiedOperation.requestBody))
    })
  })

  test("does not render request body when operation does not have a request body", () => {
    const { container } = render(<TagsOperationDescriptionSection operation={mockOperation} />)
    const requestBodyElement = container.querySelector("[data-testid='request-body']")
    expect(requestBodyElement).not.toBeInTheDocument()
  })
  
  test("renders operation's events when operation has events", async () => {
    const modifiedOperation: OpenAPI.Operation = {
      ...mockOperation,
      "x-events": [{
        name: "test-event",
        description: "test-description",
        payload: "test-payload",
      }],
    }
    const { container } = render(<TagsOperationDescriptionSection operation={modifiedOperation} />)
    await waitFor(() => {
      const eventsElement = container.querySelector("[data-testid='events']")
      expect(eventsElement).toBeInTheDocument()
      expect(eventsElement).toHaveTextContent(JSON.stringify(modifiedOperation["x-events"]))
    })
  })

  test("does not render events when operation does not have events", () => {
    const { container } = render(<TagsOperationDescriptionSection operation={mockOperation} />)
    const eventsElement = container.querySelector("[data-testid='events']")
    expect(eventsElement).not.toBeInTheDocument()
  })
})