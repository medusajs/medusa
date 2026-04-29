import React from "react"
import { beforeEach, describe, expect, test, vi } from "vitest"
import { render } from "@testing-library/react"

// mock functions
const mockUsePageScrollManager = vi.fn(() => {})
const mockUseCurrentLearningPath = vi.fn(() => {})

// mock components
vi.mock("@/hooks/use-page-scroll-manager", () => ({
  usePageScrollManager: () => mockUsePageScrollManager(),
}))

vi.mock("@/hooks/use-current-learning-path", () => ({
  useCurrentLearningPath: () => mockUseCurrentLearningPath(),
}))

import { HooksLoader } from "../../HooksLoader"

beforeEach(() => {
  vi.clearAllMocks()
})

describe("rendering", () => {
  test("doesn't load anything by default", () => {
    const { container } = render(<HooksLoader>Test</HooksLoader>)
    expect(mockUsePageScrollManager).not.toHaveBeenCalled()
    expect(mockUseCurrentLearningPath).not.toHaveBeenCalled()
    expect(container).toHaveTextContent("Test")
  })

  test("loads page scroll manager when pageScrollManager is true", () => {
    render(
      <HooksLoader options={{ pageScrollManager: true }}>Test</HooksLoader>
    )
    expect(mockUsePageScrollManager).toHaveBeenCalled()
    expect(mockUseCurrentLearningPath).not.toHaveBeenCalled()
  })

  test("loads current learning path when currentLearningPath is true", () => {
    render(
      <HooksLoader options={{ currentLearningPath: true }}>Test</HooksLoader>
    )
    expect(mockUsePageScrollManager).not.toHaveBeenCalled()
    expect(mockUseCurrentLearningPath).toHaveBeenCalled()
  })
})
