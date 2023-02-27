import { vi } from "vitest"
import { fixtures, Resources } from "../fixtures"

vi.mock("medusa-react", async () => {
  const actual = await vi.importActual("medusa-react")
  return {
    // @ts-ignore
    ...actual,
    MedusaProvider: vi.fn(({ children }) => children),
    // Get queries
    useAdminGetSession: vi.fn(() => mockGetQuery("user")),
    useAdminStore: vi.fn(() => mockGetQuery("store")),
    useAdminProduct: vi.fn(() => mockGetQuery("product")),
    useAdminCustomer: vi.fn(() => mockGetQuery("customer")),
    useAdminOrder: vi.fn(() => mockGetQuery("order")),
    // List queries
    useAdminCustomers: vi.fn(() => mockListQuery("customer")),
    useAdminProducts: vi.fn(() => mockListQuery("product")),
    useAdminOrders: vi.fn(() => mockListQuery("order")),
    useAdminShippingOptions: vi.fn(() => mockListQuery("shipping_option")),
    useAdminReturnReasons: vi.fn(() => mockListQuery("return_reason")),
    useAdminBatchJobs: vi.fn(() => {
      return []
    }),
    // Mutations
    useAdminCreateClaim: vi.fn(() => mockMutation),
  }
})

const mockMutation = {
  mutate: vi.fn().mockImplementation((data) => console.log(data)),
  mutateAsync: vi.fn(),
  isLoading: false,
}

const mockListQuery = (resource: keyof Resources) => {
  return {
    [`${resource}s`]: fixtures.list(resource, 5),
    isLoading: false,
    count: 5,
  }
}

const mockGetQuery = (resource: keyof Resources) => {
  return {
    [`${resource}`]: fixtures.get(resource),
    isLoading: false,
  }
}
