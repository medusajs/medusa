import "@testing-library/jest-dom"
import { vi } from "vitest"
import "./mocks/medusa-react"

const IntersectionObserverMock = vi.fn(() => ({
  disconnect: vi.fn(),
  observe: vi.fn(),
  takeRecords: vi.fn(),
  unobserve: vi.fn(),
}))

const ResizeObserverMock = vi.fn(() => ({
  disconnect: vi.fn(),
  observe: vi.fn(),
  unobserve: vi.fn(),
}))

vi.stubGlobal("IntersectionObserver", IntersectionObserverMock)
vi.stubGlobal("ResizeObserver", ResizeObserverMock)
