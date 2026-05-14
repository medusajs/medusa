import React from "react"
import { beforeEach, describe, expect, test, vi } from "vitest"
import { render } from "@testing-library/react"

// mock functions
const mockSetFrontmatter = vi.fn(() => {})
const mockSetToc = vi.fn(() => {})

// mock components
vi.mock("@/providers/SiteConfig", () => ({
  useSiteConfig: () => ({
    setFrontmatter: mockSetFrontmatter,
    setToc: mockSetToc,
  }),
}))

import { InjectedMDXData } from "../../InjectedMDXData"

beforeEach(() => {
  vi.clearAllMocks()
})

describe("rendering", () => {
  test("sets frontmatter and toc when provided", () => {
    render(
      <InjectedMDXData
        frontmatter={{ title: "Test" }}
        toc={[{ title: "Test", id: "test", level: 1 }]}
      />
    )
    expect(mockSetFrontmatter).toHaveBeenCalledWith({ title: "Test" })
    expect(mockSetToc).toHaveBeenCalledWith([
      { title: "Test", id: "test", level: 1 },
    ])
  })
})
