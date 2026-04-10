import React from "react"
import { beforeEach, describe, expect, test, vi } from "vitest"
import { render, waitFor } from "@testing-library/react"
import { CloudAnnouncement } from "types"

// mock data
const mockAnnouncements: CloudAnnouncement[] = [
  {
    id: "ann-1",
    title: "New Feature A",
    subtitle: "Feature A is now available",
    link_url: "https://example.com/feature-a",
    published_at: new Date("2024-02-01"),
    created_at: new Date("2024-02-01"),
  },
  {
    id: "ann-2",
    title: "Improvement B",
    subtitle: "Improvement B details",
    link_url: "https://example.com/improvement-b",
    published_at: new Date("2024-01-15"),
    created_at: new Date("2024-01-15"),
  },
]

const defaultVersion = {
  number: "2.0.0",
  releaseDate: "2024-03-01",
  releaseUrl: "https://example.com/v2",
}

// mock functions
const mockGetAnnouncements = vi.fn()
const mockUseSiteConfig = vi.fn()

// mock components
vi.mock("@/providers/SiteConfig", () => ({
  useSiteConfig: () => mockUseSiteConfig(),
}))
vi.mock("@/utils/get-announcements", () => ({
  getAnnouncements: () => mockGetAnnouncements(),
}))
vi.mock("@/providers/BrowserProvider", () => ({
  useIsBrowser: () => ({ isBrowser: false }),
}))
vi.mock("@/components/ContentMenu/Section", () => ({
  ContentMenuSection: ({
    title,
    children,
  }: {
    title: string
    children: React.ReactNode
  }) => (
    <div data-testid="content-menu-section" data-title={title}>
      {children}
    </div>
  ),
}))

import { ContentMenuWhatsNew } from "../index"

beforeEach(() => {
  mockGetAnnouncements.mockResolvedValue([])
  mockUseSiteConfig.mockReturnValue({
    config: {
      version: undefined,
    },
  })
})

describe("render", () => {
  test("renders nothing when no announcements and no version", async () => {
    const { container } = render(<ContentMenuWhatsNew />)
    await waitFor(() => {
      expect(
        container.querySelector("[data-testid='content-menu-section']")
      ).not.toBeInTheDocument()
    })
  })

  test("renders What's new section with version announcement when version is configured", async () => {
    mockUseSiteConfig.mockReturnValue({
      config: {
        version: defaultVersion,
      },
    })
    const { container } = render(<ContentMenuWhatsNew />)

    await waitFor(() => {
      const section = container.querySelector(
        "[data-testid='content-menu-section']"
      )
      expect(section).toBeInTheDocument()
      expect(section).toHaveAttribute("data-title", "What's new")
    })
  })

  test("renders version announcement title and subtitle", async () => {
    mockUseSiteConfig.mockReturnValue({
      config: {
        version: defaultVersion,
      },
    })
    const { container } = render(<ContentMenuWhatsNew />)

    await waitFor(() => {
      expect(container).toHaveTextContent(`v${defaultVersion.number} is live`)
      expect(container).toHaveTextContent("See new features and improvements")
    })
  })

  test("renders fetched announcements", async () => {
    mockGetAnnouncements.mockResolvedValue(mockAnnouncements)
    const { container } = render(<ContentMenuWhatsNew />)

    await waitFor(() => {
      expect(container).toHaveTextContent("New Feature A")
      expect(container).toHaveTextContent("Feature A is now available")
      expect(container).toHaveTextContent("Improvement B")
    })
  })

  test("merges version announcement with fetched announcements", async () => {
    mockUseSiteConfig.mockReturnValue({
      config: {
        version: defaultVersion,
      },
    })
    mockGetAnnouncements.mockResolvedValue(mockAnnouncements)

    const { container } = render(<ContentMenuWhatsNew />)

    await waitFor(() => {
      expect(container).toHaveTextContent(`v${defaultVersion.number} is live`)
      expect(container).toHaveTextContent("New Feature A")
    })
  })

  test("limits merged announcements to three", async () => {
    mockUseSiteConfig.mockReturnValue({
      config: {
        version: defaultVersion,
      },
    })
    const manyAnnouncements: CloudAnnouncement[] = [
      {
        id: "ann-1",
        title: "Ann 1",
        created_at: new Date("2024-02-01"),
      },
      {
        id: "ann-2",
        title: "Ann 2",
        created_at: new Date("2024-01-15"),
      },
      {
        id: "ann-3",
        title: "Ann 3",
        created_at: new Date("2024-01-01"),
      },
    ]
    mockGetAnnouncements.mockResolvedValue(manyAnnouncements)

    const { container } = render(<ContentMenuWhatsNew />)

    await waitFor(() => {
      // Only 3 announcements should be shown (version + top 2 by date)
      const announcementTitles = Array.from(
        container.querySelectorAll(".text-2x-small-plus.text-medusa-fg-base")
      )
      expect(announcementTitles).toHaveLength(3)
    })
  })

  test("handles failed announcement fetch gracefully", async () => {
    mockGetAnnouncements.mockRejectedValue(new Error("Network error"))
    const { container } = render(<ContentMenuWhatsNew />)

    // Should not throw and should render nothing (no announcements, no version)
    await waitFor(() => {
      expect(
        container.querySelector("[data-testid='content-menu-section']")
      ).not.toBeInTheDocument()
    })
  })
})
