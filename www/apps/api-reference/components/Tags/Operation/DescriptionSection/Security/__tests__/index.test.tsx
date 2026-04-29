import React from "react"
import { beforeEach, describe, expect, test, vi } from "vitest"
import { cleanup, fireEvent, render } from "@testing-library/react"
import { OpenAPI } from "types"

// mock function
const mockGetSecuritySchema = vi.fn((key: string) => ({
  "x-displayName": "Bearer Token",
  "x-is-auth": true,
}))
const mockUseBaseSpecs = vi.fn(() => ({
  getSecuritySchema: mockGetSecuritySchema,
}))

// mock components and hooks
vi.mock("@/providers/base-specs", () => ({
  useBaseSpecs: () => ({
    getSecuritySchema: mockGetSecuritySchema,
  }),
}))
vi.mock("docs-ui", () => ({
  Card: ({ title, text, href }: { title: string, text: string, href: string }) => (
    <div data-testid="card" data-title={title} data-href={href}>
      {text}
    </div>
  ),
}))

import TagsOperationDescriptionSectionSecurity from ".."

beforeEach(() => {
  vi.clearAllMocks()
  cleanup()
})

describe("rendering", () => {
  test("renders security with authentication", () => {
    const { container } = render(
      <TagsOperationDescriptionSectionSecurity security={[{ "bearer": [] }]} />
    )

    const cardElement = container.querySelector("[data-testid='card']")
    expect(cardElement).toBeInTheDocument()
    expect(cardElement).toHaveTextContent("Bearer Token")
    expect(cardElement).toHaveAttribute("data-href", "#authentication")
  })

  test("renders security without authentication", () => {
    mockGetSecuritySchema.mockReturnValue({
      "x-displayName": "Bearer Token",
      "x-is-auth": false,
    })
    const { container } = render(
      <TagsOperationDescriptionSectionSecurity security={[{ "bearer": [] }]} />
    )

    const cardElement = container.querySelector("[data-testid='card']")
    expect(cardElement).toBeInTheDocument()
    expect(cardElement).toHaveTextContent("Bearer Token")
    expect(cardElement).not.toHaveAttribute("data-href")
  })

  test("renders security with multiple security schemes", () => {
    const { container } = render(
      <TagsOperationDescriptionSectionSecurity security={[{ "bearer": [] }, { "apiKey": [] }]} />
    )

    const cardElement = container.querySelector("[data-testid='card']")
    expect(cardElement).toBeInTheDocument()
    // it renders the same security scheme twice because we're mocking the getSecuritySchema function
    expect(cardElement).toHaveTextContent("Bearer Token or Bearer Token")
  })
})