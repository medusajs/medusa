import React from "react"
import { vi } from "vitest"

// Mock functions
const mockSetChatOpened = vi.fn()
const mockTrack = vi.fn()
const mockGetChatWindowElm = vi.fn()
const mockGetInputElm = vi.fn()
const mockFocusInput = vi.fn()
const mockSubmitQuery = vi.fn()
const mockGetLatest = vi.fn(() => ({
  question: "last question",
}))
const mockAddFeedback = vi.fn()

// Create a mock conversation that behaves like an array
const createMockConversation = () => {
  const conversationItems: Array<{
    question: string
    answer: string
    id: string
    sources?: unknown[]
    isGenerationAborted?: boolean
  }> = []

  return {
    get length() {
      return conversationItems.length
    },
    set length(value: number) {
      // When length is set, update the items array
      if (value > conversationItems.length) {
        // Add new items
        for (let i = conversationItems.length; i < value; i++) {
          conversationItems.push({
            question: `Question ${i + 1}`,
            answer: `Answer ${i + 1}`,
            id: `id-${i + 1}`,
            sources: [],
            isGenerationAborted: false,
          })
        }
      } else if (value < conversationItems.length) {
        // Remove items
        conversationItems.splice(value)
      }
    },
    getLatest: mockGetLatest,
    getLatestCompleted: mockGetLatest,
    map(callback: (item: unknown, index: number) => React.ReactNode) {
      return conversationItems.map(callback)
    },
  }
}

const mockConversation = createMockConversation()
// Initialize with default length
mockConversation.length = 1
const mockStopGeneration = vi.fn()
const mockToggle = vi.fn()
const defaultUseAiAssistantReturn = {
  chatOpened: true,
  inputRef: React.createRef<HTMLTextAreaElement>(),
  contentRef: React.createRef<HTMLDivElement>(),
  loading: false,
  setChatOpened: mockSetChatOpened,
  isCaptchaLoaded: true,
}

const defaultUseDeepThinkingReturn = {
  active: false,
  toggle: mockToggle,
}
const defaultUseChatReturn = {
  conversation: mockConversation,
  error: "",
  submitQuery: mockSubmitQuery,
  stopGeneration: mockStopGeneration,
  addFeedback: mockAddFeedback,
  isGeneratingAnswer: false,
  isPreparingAnswer: false,
}
const mockUseAiAssistant = vi.fn(() => defaultUseAiAssistantReturn)
const mockUseDeepThinking = vi.fn(() => defaultUseDeepThinkingReturn)
const mockUseChat = vi.fn(() => defaultUseChatReturn)

export {
  mockSetChatOpened,
  mockTrack,
  mockGetChatWindowElm,
  mockGetInputElm,
  mockFocusInput,
  mockSubmitQuery,
  mockGetLatest,
  mockConversation,
  mockStopGeneration,
  mockToggle,
  mockUseAiAssistant,
  mockUseDeepThinking,
  mockUseChat,
  mockAddFeedback,
  defaultUseAiAssistantReturn,
  defaultUseDeepThinkingReturn,
  defaultUseChatReturn,
}
