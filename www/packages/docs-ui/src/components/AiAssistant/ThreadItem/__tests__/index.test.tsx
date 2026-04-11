import React from "react"
import { beforeEach, describe, expect, test, vi } from "vitest"
import { render } from "@testing-library/react"
import * as AiAssistantMocks from "../../__mocks__"
import { AiAssistantThreadItem as AiAssistantThreadItemType } from "../../../../providers/AiAssistant"
import { CodeMdxProps } from "../../../CodeMdx"

// mock data
const mockQuestionThreadItem: AiAssistantThreadItemType = {
  type: "question",
  content: "test content",
}
const mockEmptyAnswerThreadItem: AiAssistantThreadItemType = {
  type: "answer",
  content: "",
}
const mockAnswerWithQuestionThreadItem: AiAssistantThreadItemType = {
  type: "answer",
  content: "test answer",
  question_id: "123",
}
const mockAnswerWithoutQuestionThreadItem: AiAssistantThreadItemType = {
  type: "answer",
  content: "test answer",
}
const mockErrorThreadItem: AiAssistantThreadItemType = {
  type: "error",
  content: "test error",
}

// Mock components and hooks
vi.mock("@kapaai/react-sdk", () => ({
  useChat: () => AiAssistantMocks.mockUseChat(),
}))
vi.mock("@/components/CodeMdx", () => ({
  CodeMdx: (props: CodeMdxProps) => <code {...props} />,
}))
vi.mock("@/components/MarkdownContent", () => ({
  MarkdownContent: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}))
vi.mock("@/components/MDXComponents", () => ({
  MDXComponents: () => {
    return {}
  },
}))
vi.mock("@/components/AiAssistant/ThreadItem/Actions", () => ({
  AiAssistantThreadItemActions: () => <div>AiAssistantThreadItemActions</div>,
}))
vi.mock("@/components/Loading/Dots", () => ({
  DotsLoading: () => <div>DotsLoading</div>,
}))
vi.mock("@/components/AiAssistant/Loading", () => ({
  AiAssistantLoading: () => <div>AiAssistantLoading</div>,
}))

import { AiAssistantThreadItem } from "../../ThreadItem"

beforeEach(() => {
  AiAssistantMocks.mockConversation.length = 1
  AiAssistantMocks.mockAddFeedback.mockClear()
  AiAssistantMocks.mockSubmitQuery.mockClear()
  AiAssistantMocks.mockStopGeneration.mockClear()
  AiAssistantMocks.mockUseChat.mockReturnValue(
    AiAssistantMocks.defaultUseChatReturn
  )
})

describe("rendering", () => {
  test("renders question thread item", () => {
    const { container } = render(
      <AiAssistantThreadItem item={mockQuestionThreadItem} />
    )
    expect(container).toBeInTheDocument()
    const wrapper = container.querySelector("div")
    expect(wrapper).toHaveClass("justify-end")
    expect(container).toHaveTextContent(mockQuestionThreadItem.content)
    expect(container).toHaveTextContent("AiAssistantThreadItemActions")
  })
  test("renders answer thread item", () => {
    const { container } = render(
      <AiAssistantThreadItem item={mockAnswerWithQuestionThreadItem} />
    )
    expect(container).toBeInTheDocument()
    const wrapper = container.querySelector("div")
    expect(wrapper).toHaveClass("!pr-[20px]")
    expect(container).toHaveTextContent(
      mockAnswerWithQuestionThreadItem.content
    )
    expect(container).toHaveTextContent("AiAssistantThreadItemActions")
  })
  test("renders answer thread item without actions if answer has no question_id", () => {
    const { container } = render(
      <AiAssistantThreadItem item={mockAnswerWithoutQuestionThreadItem} />
    )
    expect(container).toBeInTheDocument()
    expect(container).not.toHaveTextContent("AiAssistantThreadItemActions")
  })
  test("renders error thread item", () => {
    const { container } = render(
      <AiAssistantThreadItem item={mockErrorThreadItem} />
    )
    expect(container).toBeInTheDocument()
    const span = container.querySelector("span.text-medusa-fg-error")
    expect(span).toBeInTheDocument()
    expect(span).toHaveTextContent(mockErrorThreadItem.content)
  })
})

describe("loading", () => {
  test("shows loading when answer has no question_id and no content", () => {
    const { container } = render(
      <AiAssistantThreadItem item={mockEmptyAnswerThreadItem} />
    )
    expect(container).toBeInTheDocument()
    expect(container).toHaveTextContent("AiAssistantLoading")
  })
  test("hide loading when answer has question_id and no content", () => {
    const { container } = render(
      <AiAssistantThreadItem
        item={{
          ...mockAnswerWithQuestionThreadItem,
          content: "",
        }}
      />
    )
    expect(container).toBeInTheDocument()
    expect(container).not.toHaveTextContent("AiAssistantLoading")
  })
  test("hide loading when answer has content", () => {
    const { container } = render(
      <AiAssistantThreadItem item={mockAnswerWithoutQuestionThreadItem} />
    )
    expect(container).toBeInTheDocument()
    expect(container).not.toHaveTextContent("AiAssistantLoading")
  })
  test("hide loading when error is not empty", () => {
    const { container } = render(
      <AiAssistantThreadItem item={mockErrorThreadItem} />
    )
    expect(container).toBeInTheDocument()
    expect(container).not.toHaveTextContent("AiAssistantLoading")
  })
})
