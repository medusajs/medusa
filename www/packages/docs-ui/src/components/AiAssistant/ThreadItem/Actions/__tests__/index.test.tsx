import React from "react"
import { beforeEach, describe, expect, test, vi } from "vitest"
import { fireEvent, render } from "@testing-library/react"
import { ButtonProps } from "../../../../Button"
import { AiAssistantThreadItem } from "../../../../../providers/AiAssistant"
import * as AiAssistantMocks from "../../../__mocks__"

// mock data
const mockQuestionThreadItem: AiAssistantThreadItem = {
  type: "question",
  content: "test content",
}
const mockAnswerThreadItem: AiAssistantThreadItem = {
  type: "answer",
  content: "test answer",
  question_id: "123",
}
const mockSiteConfig = {
  config: {
    baseUrl: "https://docs.medusajs.com",
  },
}

// Mock functions
const mockHandleCopy = vi.fn()
const defaultUseCopyReturn = {
  handleCopy: mockHandleCopy,
  isCopied: false,
}
const useCopyMock = vi.fn(() => defaultUseCopyReturn)

// Mock components and hooks
vi.mock("@kapaai/react-sdk", () => ({
  useChat: () => AiAssistantMocks.mockUseChat(),
}))
vi.mock("@/providers/SiteConfig", () => ({
  useSiteConfig: () => mockSiteConfig,
}))
vi.mock("@/components/Button", () => ({
  Button: (props: ButtonProps) => <button {...props} />,
}))
vi.mock("next/link", () => ({
  default: ({ children, ...props }: React.ComponentProps<"a">) => (
    <a {...props}>{children}</a>
  ),
}))
vi.mock("@/hooks/use-copy", () => ({
  useCopy: () => useCopyMock(),
}))

import { AiAssistantThreadItemActions } from "../../Actions"

beforeEach(() => {
  AiAssistantMocks.mockUseChat.mockReturnValue(
    AiAssistantMocks.defaultUseChatReturn
  )
  AiAssistantMocks.mockAddFeedback.mockClear()
  AiAssistantMocks.mockSubmitQuery.mockClear()
  AiAssistantMocks.mockStopGeneration.mockClear()
  AiAssistantMocks.mockConversation.length = 1
  mockHandleCopy.mockClear()
  useCopyMock.mockReturnValue(defaultUseCopyReturn)
})

describe("rendering", () => {
  test("renders question thread item actions", () => {
    const { container } = render(
      <AiAssistantThreadItemActions item={mockQuestionThreadItem} />
    )
    expect(container).toBeInTheDocument()
    const wrapper = container.querySelector("div")
    expect(wrapper).toHaveClass("justify-end")
    const linkCopyButton = container.querySelector(
      "[data-testid='link-copy-button']"
    )
    expect(linkCopyButton).toBeInTheDocument()
  })
  test("renders answer thread item actions", () => {
    const { container } = render(
      <AiAssistantThreadItemActions item={mockAnswerThreadItem} />
    )
    expect(container).toBeInTheDocument()
    const wrapper = container.querySelector("div")
    expect(wrapper).toHaveClass("justify-between")
    const answerCopyButton = container.querySelector(
      "[data-testid='answer-copy-button']"
    )
    expect(answerCopyButton).toBeInTheDocument()
    const upvoteButton = container.querySelector(
      "[data-testid='upvote-button']"
    )
    expect(upvoteButton).toBeInTheDocument()
    const downvoteButton = container.querySelector(
      "[data-testid='downvote-button']"
    )
    expect(downvoteButton).toBeInTheDocument()
  })
})

describe("question interactions", () => {
  test("clicking link copy button should copy the link", () => {
    const { container } = render(
      <AiAssistantThreadItemActions item={mockQuestionThreadItem} />
    )
    expect(container).toBeInTheDocument()
    const linkCopyButton = container.querySelector(
      "[data-testid='link-copy-button']"
    )
    expect(linkCopyButton).toBeInTheDocument()

    fireEvent.click(linkCopyButton!)
    expect(mockHandleCopy).toHaveBeenCalledTimes(1)
  })
})

describe("answer interactions", () => {
  test("clicking answer copy button should copy the answer", () => {
    const { container } = render(
      <AiAssistantThreadItemActions item={mockAnswerThreadItem} />
    )
    expect(container).toBeInTheDocument()
    const answerCopyButton = container.querySelector(
      "[data-testid='answer-copy-button']"
    )
    expect(answerCopyButton).toBeInTheDocument()

    fireEvent.click(answerCopyButton!)
    expect(mockHandleCopy).toHaveBeenCalledTimes(1)
  })
  test("clicking upvote button should upvote the answer", () => {
    const { container } = render(
      <AiAssistantThreadItemActions item={mockAnswerThreadItem} />
    )
    expect(container).toBeInTheDocument()
    const upvoteButton = container.querySelector(
      "[data-testid='upvote-button']"
    )
    expect(upvoteButton).toBeInTheDocument()

    fireEvent.click(upvoteButton!)
    expect(AiAssistantMocks.mockAddFeedback).toHaveBeenCalledTimes(1)
    expect(AiAssistantMocks.mockAddFeedback).toHaveBeenCalledWith(
      mockAnswerThreadItem.question_id,
      "upvote"
    )
  })
  test("clicking downvote button should downvote the answer", () => {
    const { container } = render(
      <AiAssistantThreadItemActions item={mockAnswerThreadItem} />
    )
    expect(container).toBeInTheDocument()
    const downvoteButton = container.querySelector(
      "[data-testid='downvote-button']"
    )
    expect(downvoteButton).toBeInTheDocument()

    fireEvent.click(downvoteButton!)
    expect(AiAssistantMocks.mockAddFeedback).toHaveBeenCalledTimes(1)
    expect(AiAssistantMocks.mockAddFeedback).toHaveBeenCalledWith(
      mockAnswerThreadItem.question_id,
      "downvote"
    )
  })

  test("downvote button should be hidden if the answer has been upvoted", () => {
    const { container } = render(
      <AiAssistantThreadItemActions item={mockAnswerThreadItem} />
    )
    expect(container).toBeInTheDocument()
    const downvoteButton = container.querySelector(
      "[data-testid='downvote-button']"
    )
    expect(downvoteButton).toBeInTheDocument()
    const upvoteButton = container.querySelector(
      "[data-testid='upvote-button']"
    )
    expect(upvoteButton).toBeInTheDocument()

    fireEvent.click(upvoteButton!)
    expect(downvoteButton).not.toBeInTheDocument()
  })

  test("upvote button should be hidden if the answer has been downvoted", () => {
    const { container } = render(
      <AiAssistantThreadItemActions item={mockAnswerThreadItem} />
    )
    expect(container).toBeInTheDocument()
    const upvoteButton = container.querySelector(
      "[data-testid='upvote-button']"
    )
    expect(upvoteButton).toBeInTheDocument()
    const downvoteButton = container.querySelector(
      "[data-testid='downvote-button']"
    )
    expect(downvoteButton).toBeInTheDocument()

    fireEvent.click(downvoteButton!)
    expect(upvoteButton).not.toBeInTheDocument()
  })
})
