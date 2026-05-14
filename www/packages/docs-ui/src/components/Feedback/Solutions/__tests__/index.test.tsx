import React from "react"
import { beforeEach, describe, expect, test, vi } from "vitest"
import { render, waitFor } from "@testing-library/react"
import { GitHubSearchItem } from "../../.."

// mock data
const mockGitHubSearchItem: GitHubSearchItem = {
  url: "https://github.com/medusajs/medusa/issues/123",
  html_url: "https://github.com/medusajs/medusa/issues/123",
  title: "Test Issue",
}

// mock hooks
const mockSearchGitHub = vi.fn(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async (_input: RequestInfo | URL, _init?: RequestInit | undefined) => {
    const response = new Response(
      JSON.stringify({ items: [mockGitHubSearchItem] })
    )
    // Mock the json() method to return the parsed data
    response.json = vi.fn().mockResolvedValue({ items: [mockGitHubSearchItem] })
    return Promise.resolve(response)
  }
)

// mock components
vi.mock("@/components/Link", () => ({
  Link: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}))
vi.mock("@/components/MDXComponents", () => ({
  MDXComponents: {
    ul: (props: React.HTMLAttributes<HTMLUListElement>) => <ul {...props} />,
    li: (props: React.HTMLAttributes<HTMLLIElement>) => <li {...props} />,
  },
}))

// helper function
const getGitHubSearchUrl = (query: string) =>
  `https://api.github.com/search/issues?q=${encodeURIComponent(`${query} repo:medusajs/medusa is:closed is:issue`)}&sort=updated&per_page=3&advanced_search=true`

import { Solutions } from "../../Solutions"

beforeEach(() => {
  window.fetch = mockSearchGitHub
  mockSearchGitHub.mockClear()
})

describe("render", () => {
  test("doesn't render solutions if feedback is true (positive)", () => {
    const { container } = render(<Solutions feedback={true} />)
    expect(container).toBeInTheDocument()
    const solutionItems = container.querySelectorAll(
      "[data-testid='solution-item']"
    )
    expect(solutionItems).toHaveLength(0)
    expect(mockSearchGitHub).not.toHaveBeenCalled()
  })

  test("renders solutions if feedback is false using document title", async () => {
    document.title = "Test Page"
    const { container } = render(<Solutions feedback={false} />)
    expect(container).toBeInTheDocument()
    await waitFor(() => {
      expect(mockSearchGitHub).toHaveBeenCalledWith(
        getGitHubSearchUrl("Test Page"),
        {
          headers: {
            Accept: "application/vnd.github.v3+json",
          },
        }
      )
    })
    const solutionItems = container.querySelectorAll(
      "[data-testid='solution-item']"
    )
    expect(solutionItems).toHaveLength(1)
    expect(solutionItems[0]).toBeInTheDocument()
    expect(solutionItems[0]).toHaveTextContent("Test Issue")
  })

  test("renders solutions if feedback is false using message", async () => {
    const { container } = render(
      <Solutions feedback={false} message="Test Message" />
    )
    expect(container).toBeInTheDocument()
    await waitFor(() => {
      expect(mockSearchGitHub).toHaveBeenCalledWith(
        getGitHubSearchUrl("Test Message"),
        {
          headers: {
            Accept: "application/vnd.github.v3+json",
          },
        }
      )
    })
    const solutionItems = container.querySelectorAll(
      "[data-testid='solution-item']"
    )
    expect(solutionItems).toHaveLength(1)
    expect(solutionItems[0]).toBeInTheDocument()
    expect(solutionItems[0]).toHaveTextContent("Test Issue")
  })

  test("uses first 256 characters of message if feedback is false and it is longer than 256 characters", () => {
    const longMessage = "a".repeat(257)
    const shortMessage = longMessage.substring(0, 256)
    const { container } = render(
      <Solutions feedback={false} message={shortMessage} />
    )
    expect(container).toBeInTheDocument()
    expect(mockSearchGitHub).toHaveBeenCalledWith(
      getGitHubSearchUrl(shortMessage),
      {
        headers: {
          Accept: "application/vnd.github.v3+json",
        },
      }
    )
  })

  test("gets query from document title if feedback is false and no results are provided for message", async () => {
    document.title = "Test Page"
    mockSearchGitHub.mockImplementation(async () => {
      const response = new Response(JSON.stringify({ items: [] }))
      response.json = vi.fn().mockResolvedValue({ items: [] })
      return response
    })
    const { container } = render(
      <Solutions feedback={false} message="Test Message" />
    )
    expect(container).toBeInTheDocument()
    await waitFor(() => {
      expect(mockSearchGitHub).toHaveBeenCalledTimes(2)
    })
    const solutionItems = container.querySelectorAll(
      "[data-testid='solution-item']"
    )
    expect(solutionItems).toHaveLength(0)
    expect(mockSearchGitHub).toHaveBeenCalledWith(
      getGitHubSearchUrl("Test Message"),
      {
        headers: {
          Accept: "application/vnd.github.v3+json",
        },
      }
    )
    expect(mockSearchGitHub).toHaveBeenCalledWith(
      getGitHubSearchUrl("Test Page"),
      {
        headers: {
          Accept: "application/vnd.github.v3+json",
        },
      }
    )
  })
})
