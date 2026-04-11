import React from "react"
import { beforeEach, describe, expect, test, vi } from "vitest"
import { cleanup, render } from "@testing-library/react"
import { OpenAPI, Sidebar } from "types"

// mock data
const mockTag: OpenAPI.TagObject = {
  name: "mockTag",
  description: "Mock Tag",
}
const mockOperation: OpenAPI.Operation = {
  operationId: "mockOperation",
  summary: "Mock Operation",
  description: "Mock Operation",
  "x-authenticated": false,
  "x-codeSamples": [],
  requestBody: { content: {} },
  parameters: [],
  responses: { 
    "200": { 
      description: "OK", 
      content: { 
        "application/json": { 
          schema: { 
            type: "object", 
            properties: { name: { type: "string", properties: {} } } 
          } 
        } 
      } 
    } 
  }
}
const mockPaths: OpenAPI.PathsObject = {
  "/mock-path": {
    get: mockOperation,
  },
}
const mockSidebar: Sidebar.Sidebar = {
  sidebar_id: "mock-sidebar-id",
  title: "Mock Sidebar",
  items: [],
}

// mock functions
const mockFindSidebarItem = vi.fn((options: unknown) => undefined as Sidebar.SidebarItem | undefined)
const mockAddItems = vi.fn()
const mockUseSidebar = vi.fn(() => ({
  shownSidebar: mockSidebar as Sidebar.Sidebar | Sidebar.SidebarItemSidebar | undefined,
  addItems: mockAddItems,
}))
const mockUseLoading = vi.fn(() => ({
  loading: false,
}))
const mockGetTagChildSidebarItems = vi.fn(() => [] as Sidebar.SidebarItem[])
const mockCompareOperations = vi.fn((options: unknown) => 0)

// mock components and hooks
vi.mock("docs-ui", () => ({
  findSidebarItem: (options: unknown) => mockFindSidebarItem(options),
  useSidebar: () => mockUseSidebar(),
}))
vi.mock("react", async () => {
  const actual = await vi.importActual<typeof React>("react")

  return {
    ...actual,
    Suspense: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  }
})
vi.mock("@/utils/get-tag-child-sidebar-items", () => ({
  default: () => mockGetTagChildSidebarItems(),
}))
vi.mock("@/providers/loading", () => ({
  useLoading: () => mockUseLoading(),
}))
vi.mock("@/components/DividedLoading", () => ({
  default: (className: string) => <div data-testid="divided-loading" className={className}>Loading...</div>,
}))
vi.mock("@/utils/sort-operations-utils", () => ({
  compareOperations: (options: unknown) => mockCompareOperations(options),
}))
vi.mock("@/components/Tags/Operation", () => ({
  default: (props: TagOperationProps) => (
    <div 
      data-testid="operation-container" 
      data-method={props.method}
      data-endpoint-path={props.endpointPath}
      data-operation-id={props.operation.operationId}
    >Operation</div>
  ),
}))

import TagPaths from ".."
import { TagOperationProps } from "../../Operation"

beforeEach(() => {
  vi.clearAllMocks()
  cleanup()
})

describe("rendering", () => {
  test("renders loading when loading is true", () => {
    mockUseLoading.mockReturnValue({ loading: true })
    const { container } = render(
      <TagPaths tag={mockTag} paths={mockPaths} />
    )
    const dividedLoadingElement = container.querySelector("[data-testid='divided-loading']")
    expect(dividedLoadingElement).toBeInTheDocument()
  })

  test("does not render loading when loading is false", () => {
    mockUseLoading.mockReturnValue({ loading: false })
    const { container } = render(
      <TagPaths tag={mockTag} paths={mockPaths} />
    )
    const dividedLoadingElement = container.querySelector("[data-testid='divided-loading']")
    expect(dividedLoadingElement).not.toBeInTheDocument()
  })

  test("renders operations", () => {
    const { container } = render(
      <TagPaths tag={mockTag} paths={mockPaths} />
    )
    const operationElements = container.querySelectorAll("[data-testid='operation-container']")
    expect(operationElements).toHaveLength(1)
    expect(operationElements[0]).toHaveAttribute("data-method", "get")
    expect(operationElements[0]).toHaveAttribute("data-endpoint-path", "/mock-path")
    expect(operationElements[0]).toHaveAttribute("data-operation-id", "mockOperation")
  })

  test("renders operations in the correct order", () => {
    // change the mockCompareOperations return value to 1
    mockCompareOperations.mockReturnValue(-1)
    const modifiedMockPaths: OpenAPI.PathsObject = {
      "/mock-path": {
        get: {
          ...mockOperation,
          operationId: "mockOperation1",
        },
        post: {
          ...mockOperation,
          operationId: "mockOperation2",
        },
      },
    }
    const { container } = render(
      <TagPaths tag={mockTag} paths={modifiedMockPaths} />
    )
    const operationElements = container.querySelectorAll("[data-testid='operation-container']")
    expect(operationElements).toHaveLength(2)
    expect(operationElements[0]).toHaveAttribute("data-operation-id", "mockOperation2")
    expect(operationElements[1]).toHaveAttribute("data-operation-id", "mockOperation1")
  })
})

describe("sidebar", () => {
  test("doesn't add items to sidebar when shownSidebar is not set", () => {
    mockUseSidebar.mockReturnValue({ 
      shownSidebar: undefined, 
      addItems: mockAddItems,
    })
    render(
      <TagPaths tag={mockTag} paths={mockPaths} />
    )
    expect(mockAddItems).not.toHaveBeenCalled()
  })

  test("doesn't add items to sidebar when paths is not set", () => {
    mockUseSidebar.mockReturnValue({ 
      shownSidebar: mockSidebar,
      addItems: mockAddItems,
    })
    render(
      <TagPaths tag={mockTag} paths={{}} />
    )
    expect(mockAddItems).not.toHaveBeenCalled()
  })

  test("adds items to sidebar when shownSidebar is set and paths is set and tag doesn't have an associated schema", () => {
    mockUseSidebar.mockReturnValue({ 
      shownSidebar: {
        ...mockSidebar,
        items: [
          {
            type: "category",
            title: mockTag.name,
            children: [],
          }
        ]
      },
      addItems: mockAddItems,
    })
    mockFindSidebarItem.mockReturnValue({
      type: "category",
      title: mockTag.name,
      children: [],
    })
    const mockPathItems: Sidebar.SidebarItem[] = [
      {
        type: "link",
        title: "Mock Link",
        path: "/mock-link",
        children: [],
      }
    ]
    mockGetTagChildSidebarItems.mockReturnValue(mockPathItems)
    render(
      <TagPaths tag={mockTag} paths={mockPaths} />
    )
    expect(mockAddItems).toHaveBeenCalledWith(mockPathItems, {
      sidebar_id: mockSidebar.sidebar_id,
      // since there is no associated schema, the index position is 0
      indexPosition: 0,
      parent: {
        type: "category",
        title: mockTag.name,
        path: "",
        changeLoaded: true,
      },
    })
  })

  test("adds items to sidebar when shownSidebar is set and paths is set and tag has an associated schema", () => {
    mockUseSidebar.mockReturnValue({ 
      shownSidebar: {
        ...mockSidebar,
        items: [
          {
            type: "category",
            title: mockTag.name,
            children: [],
          }
        ]
      },
      addItems: mockAddItems,
    })
    mockFindSidebarItem.mockReturnValue({
      type: "category",
      title: mockTag.name,
      children: [],
    })
    const mockPathItems: Sidebar.SidebarItem[] = [
      {
        type: "link",
        title: "Mock Link",
        path: "/mock-link",
        children: [],
      }
    ]
    mockGetTagChildSidebarItems.mockReturnValue(mockPathItems)
    render(
      <TagPaths tag={{
        ...mockTag,
        "x-associatedSchema": {
          $ref: "#/components/schemas/MockSchema",
        }
      }} paths={mockPaths} />
    )
    expect(mockAddItems).toHaveBeenCalledWith(mockPathItems, {
      sidebar_id: mockSidebar.sidebar_id,
      indexPosition: 1,
      parent: {
        type: "category",
        title: mockTag.name,
        path: "",
        changeLoaded: true,
      },
    })
  })

  test("doesn't add items to sidebar when parent item is not found", () => {
    mockUseSidebar.mockReturnValue({ 
      shownSidebar: mockSidebar,
      addItems: mockAddItems,
    })
    mockFindSidebarItem.mockReturnValue(undefined)
    render(
      <TagPaths tag={mockTag} paths={mockPaths} />
    )
    expect(mockAddItems).not.toHaveBeenCalled()
  })

  test("doesn't add items to sidebar when parent item has enough children and tag doesn't have an associated schema", () => {
    mockUseSidebar.mockReturnValue({ 
      shownSidebar: mockSidebar,
      addItems: mockAddItems,
    })
    mockFindSidebarItem.mockReturnValue({
      type: "category",
      title: mockTag.name,
      children: [{ type: "link", title: "Mock Link", path: "/mock-link", children: [] }],
    })
    render(
      <TagPaths tag={mockTag} paths={mockPaths} />
    )
    expect(mockAddItems).not.toHaveBeenCalled()
  })

  test("adds item to sidebar when parent item has an item and tag has an associated schema", () => {
    mockUseSidebar.mockReturnValue({ 
      shownSidebar: mockSidebar,
      addItems: mockAddItems,
    })
    mockFindSidebarItem.mockReturnValue({
      type: "category",
      title: mockTag.name,
      children: [{ type: "link", title: "Mock Schema", path: "/mock-schema", children: [] }],
    })
    render(
      <TagPaths tag={{
        ...mockTag,
        "x-associatedSchema": {
          $ref: "#/components/schemas/MockSchema",
        }
      }} paths={mockPaths} />
    )
    expect(mockAddItems).toHaveBeenCalled()
  })

  test("doesn't add items to sidebar when parent item has enough children and tag has an associated schema", () => {
    mockUseSidebar.mockReturnValue({ 
      shownSidebar: mockSidebar,
      addItems: mockAddItems,
    })
    mockFindSidebarItem.mockReturnValue({
      type: "category",
      title: mockTag.name,
      children: [{ 
        type: "link", 
        title: "Mock Link", 
        path: "/mock-link", 
        children: [] 
      }, {
        type: "link",
        title: "Mock Link 2",
        path: "/mock-link-2",
        children: [] }],
    })
    render(
      <TagPaths tag={{
        ...mockTag,
        "x-associatedSchema": {
          $ref: "#/components/schemas/MockSchema",
        }
      }} paths={mockPaths} />
    )
    expect(mockAddItems).not.toHaveBeenCalled()
  })
})