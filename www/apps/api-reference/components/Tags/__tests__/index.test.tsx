import React from "react"
import { beforeEach, describe, expect, test, vi } from "vitest"
import { cleanup, render, waitFor } from "@testing-library/react"
import { OpenAPI } from "types"

// mock data
const mockTags: OpenAPI.TagObject[] = [
  {
    name: "mockTag",
    description: "Mock Tag",
  },
]

// mock components
vi.mock("@/components/Tags/Section", () => ({
  default: ({ tag }: { tag: OpenAPI.TagObject }) => (
    <div data-testid="tag-section">{tag.name}</div>
  ),
}))
vi.mock("react", async () => {
  const actual = await vi.importActual<typeof React>("react")

  return {
    ...actual,
    Suspense: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  }
})

import Tags from ".."

beforeEach(() => {
  vi.clearAllMocks()
  cleanup()
})

describe("Tags", () => {
  test("does not render tags when tags is undefined", () => {
    const { container } = render(<Tags tags={undefined} />)
    expect(container).toBeEmptyDOMElement()
  })

  test("renders tags when tags is defined", async () => {
    const { container } = render(<Tags tags={mockTags} />)
    await waitFor(() => {
      const tagSections = container.querySelectorAll("[data-testid='tag-section']")
      expect(tagSections).toHaveLength(mockTags.length)
    })
  })
})