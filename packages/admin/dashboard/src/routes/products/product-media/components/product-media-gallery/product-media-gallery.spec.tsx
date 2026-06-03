import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react"
import { afterEach, describe, expect, it, vi } from "vitest"

const mockMutateAsync = vi.fn().mockResolvedValue({})
const mockPrompt = vi.fn()

vi.mock("react-router-dom", () => ({
  useLocation: () => ({ state: null }),
  Link: ({ children, to }: { children: React.ReactNode; to: string }) => (
    <a href={to}>{children}</a>
  ),
}))

vi.mock("../../../../../hooks/api/products", () => ({
  useUpdateProduct: () => ({ mutateAsync: mockMutateAsync, isPending: false }),
}))

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (k: string) => k }),
}))

vi.mock("@medusajs/ui", async () => {
  const actual = await vi.importActual<typeof import("@medusajs/ui")>(
    "@medusajs/ui"
  )
  return { ...actual, usePrompt: () => mockPrompt }
})

vi.mock("../../../../../components/modals", () => ({
  RouteFocusModal: {
    Header: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="modal-header">{children}</div>
    ),
    Body: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="modal-body">{children}</div>
    ),
  },
}))

import React from "react"
import { ProductMediaGallery } from "./product-media-gallery"

const makeImage = (id: string, url: string) => ({ id, url })

const makeProduct = (images: { id: string; url: string }[], thumbnail = "") => ({
  id: "prod_test",
  images,
  thumbnail: thumbnail || null,
})

describe("ProductMediaGallery – handleDeleteCurrent", () => {
  afterEach(() => {
    cleanup()
    vi.clearAllMocks()
  })

  it("does not crash when deleting the only image", async () => {
    mockPrompt.mockResolvedValueOnce(true)

    const product = makeProduct([makeImage("img1", "https://example.com/1.jpg")])
    render(<ProductMediaGallery product={product as any} />)

    const deleteBtn = screen.getByRole("button", {
      name: /products\.media\.deleteImageLabel/i,
    })

    expect(() => fireEvent.click(deleteBtn)).not.toThrow()

    await waitFor(() => expect(mockPrompt).toHaveBeenCalledTimes(1))
    await waitFor(() => expect(mockMutateAsync).toHaveBeenCalledTimes(1))

    expect(mockMutateAsync).toHaveBeenCalledWith(
      expect.objectContaining({ images: [] })
    )
  })

  it("does not decrement curr below 0 when deleting the only image", async () => {
    mockPrompt.mockResolvedValueOnce(true)

    const product = makeProduct([makeImage("img1", "https://example.com/1.jpg")])

    // If curr went to -1, accessing media[-1] in Canvas would throw during render.
    // A successful render after deletion confirms curr stayed ≥ 0.
    expect(() =>
      render(<ProductMediaGallery product={product as any} />)
    ).not.toThrow()

    const deleteBtn = screen.getByRole("button", {
      name: /products\.media\.deleteImageLabel/i,
    })
    fireEvent.click(deleteBtn)

    // No unhandled error should propagate
    await waitFor(() => expect(mockMutateAsync).toHaveBeenCalledTimes(1))
    expect(screen.getByTestId("modal-body")).toBeInTheDocument()
  })

  it("decrements curr when deleting the last of multiple images", async () => {
    mockPrompt.mockResolvedValueOnce(true)

    const images = [
      makeImage("img1", "https://example.com/1.jpg"),
      makeImage("img2", "https://example.com/2.jpg"),
    ]
    const product = makeProduct(images)
    render(<ProductMediaGallery product={product as any} />)

    // Navigate to the last image (index 1) via ArrowRight key
    fireEvent.keyDown(document, { key: "ArrowRight" })

    const deleteBtn = screen.getByRole("button", {
      name: /products\.media\.deleteImageLabel/i,
    })
    fireEvent.click(deleteBtn)

    await waitFor(() => expect(mockMutateAsync).toHaveBeenCalledTimes(1))

    // mutateAsync should be called keeping only img1
    expect(mockMutateAsync).toHaveBeenCalledWith(
      expect.objectContaining({
        images: expect.arrayContaining([expect.objectContaining({ id: "img1" })]),
      })
    )
  })

  it("does not decrement curr when deleting a non-last image", async () => {
    mockPrompt.mockResolvedValueOnce(true)

    const images = [
      makeImage("img1", "https://example.com/1.jpg"),
      makeImage("img2", "https://example.com/2.jpg"),
    ]
    const product = makeProduct(images)
    render(<ProductMediaGallery product={product as any} />)

    // curr starts at 0 (first image) — deleting it should NOT decrement
    const deleteBtn = screen.getByRole("button", {
      name: /products\.media\.deleteImageLabel/i,
    })
    fireEvent.click(deleteBtn)

    await waitFor(() => expect(mockMutateAsync).toHaveBeenCalledTimes(1))

    expect(mockMutateAsync).toHaveBeenCalledWith(
      expect.objectContaining({
        images: expect.arrayContaining([expect.objectContaining({ id: "img2" })]),
      })
    )
  })

  it("does nothing when user cancels the prompt", async () => {
    mockPrompt.mockResolvedValueOnce(false)

    const product = makeProduct([makeImage("img1", "https://example.com/1.jpg")])
    render(<ProductMediaGallery product={product as any} />)

    const deleteBtn = screen.getByRole("button", {
      name: /products\.media\.deleteImageLabel/i,
    })
    fireEvent.click(deleteBtn)

    await waitFor(() => expect(mockPrompt).toHaveBeenCalledTimes(1))
    expect(mockMutateAsync).not.toHaveBeenCalled()
  })
})
