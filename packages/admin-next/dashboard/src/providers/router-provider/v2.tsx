import { AdminCustomersRes } from "@medusajs/client-types"
import { Spinner } from "@medusajs/icons"
import {
  AdminCollectionsRes,
  AdminProductsRes,
  AdminPromotionRes,
  AdminRegionsRes,
} from "@medusajs/medusa"
import {
  AdminApiKeyResponse,
  AdminProductCategoryResponse,
  SalesChannelDTO,
  UserDTO,
} from "@medusajs/types"
import { Navigate, Outlet, RouteObject, useLocation } from "react-router-dom"
import { ErrorBoundary } from "../../components/error/error-boundary"
import { MainLayout } from "../../components/layout-v2/main-layout"
import { SettingsLayout } from "../../components/layout/settings-layout"
import { useMe } from "../../hooks/api/users"
import { PriceListRes } from "../../types/api-responses"
import { SearchProvider } from "../search-provider"
import { SidebarProvider } from "../sidebar-provider"

export const ProtectedRoute = () => {
  const { user, isLoading } = useMe()
  const location = useLocation()

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner className="text-ui-fg-interactive animate-spin" />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return (
    <SidebarProvider>
      <SearchProvider>
        <Outlet />
      </SearchProvider>
    </SidebarProvider>
  )
}

/**
 * Experimental V2 routes.
 *
 * These routes are only available if the `MEDUSA_V2` feature flag is enabled.
 */
export const v2Routes: RouteObject[] = [
  {
    path: "/login",
    lazy: () => import("../../v2-routes/login"),
  },
  {
    path: "/",
    lazy: () => import("../../v2-routes/home"),
  },
  {
    path: "*",
    lazy: () => import("../../routes/no-match"),
  },
  {
    path: "/invite",
    lazy: () => import("../../v2-routes/invite"),
  },
  {
    element: <ProtectedRoute />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        path: "/",
        element: <MainLayout />,
        children: [
          {
            path: "/products",
            handle: {
              crumb: () => "Products",
            },
            children: [
              {
                path: "",
                lazy: () => import("../../v2-routes/products/product-list"),
                children: [
                  {
                    path: "create",
                    lazy: () =>
                      import("../../v2-routes/products/product-create"),
                  },
                ],
              },
              {
                path: ":id",
                lazy: () => import("../../v2-routes/products/product-detail"),
                handle: {
                  crumb: (data: AdminProductsRes) => data.product.title,
                },
                children: [
                  {
                    path: "edit",
                    lazy: () => import("../../v2-routes/products/product-edit"),
                  },
                  {
                    path: "sales-channels",
                    lazy: () =>
                      import("../../v2-routes/products/product-sales-channels"),
                  },
                  {
                    path: "attributes",
                    lazy: () =>
                      import("../../v2-routes/products/product-attributes"),
                  },
                  {
                    path: "organization",
                    lazy: () =>
                      import("../../v2-routes/products/product-organization"),
                  },
                  {
                    path: "media",
                    lazy: () =>
                      import("../../v2-routes/products/product-media"),
                  },
                  {
                    path: "options/create",
                    lazy: () =>
                      import("../../v2-routes/products/product-create-option"),
                  },
                  {
                    path: "options/:option_id/edit",
                    lazy: () =>
                      import("../../v2-routes/products/product-edit-option"),
                  },
                  {
                    path: "variants/create",
                    lazy: () =>
                      import("../../v2-routes/products/product-create-variant"),
                  },
                  {
                    path: "variants/:variant_id/edit",
                    lazy: () =>
                      import("../../v2-routes/products/product-edit-variant"),
                  },
                ],
              },
            ],
          },
          {
            path: "/categories",
            handle: {
              crumb: () => "Categories",
            },
            children: [
              {
                path: "",
                lazy: () => import("../../v2-routes/categories/category-list"),
              },
              {
                path: ":id",
                lazy: () =>
                  import("../../v2-routes/categories/category-detail"),
                handle: {
                  crumb: (data: AdminProductCategoryResponse) =>
                    data.product_category.name,
                },
              },
            ],
          },
          {
            path: "/orders",
            handle: {
              crumb: () => "Orders",
            },
            children: [
              {
                path: "",
                lazy: () => import("../../v2-routes/orders/order-list"),
              },
            ],
          },
          {
            path: "/promotions",
            handle: {
              crumb: () => "Promotions",
            },
            children: [
              {
                path: "",
                lazy: () => import("../../v2-routes/promotions/promotion-list"),
              },
              {
                path: ":id",
                lazy: () =>
                  import("../../v2-routes/promotions/promotion-detail"),
                handle: {
                  crumb: (data: AdminPromotionRes) => data.promotion?.code,
                },
                children: [
                  {
                    path: "edit",
                    lazy: () =>
                      import(
                        "../../v2-routes/promotions/promotion-edit-details"
                      ),
                  },
                  {
                    path: "add-to-campaign",
                    lazy: () =>
                      import(
                        "../../v2-routes/promotions/promotion-add-campaign"
                      ),
                  },
                  {
                    path: ":ruleType/edit",
                    lazy: () => import("../../v2-routes/promotions/edit-rules"),
                  },
                ],
              },
            ],
          },
          {
            path: "/collections",
            handle: {
              crumb: () => "Collections",
            },
            children: [
              {
                path: "",
                lazy: () =>
                  import("../../v2-routes/collections/collection-list"),
                children: [
                  {
                    path: "create",
                    lazy: () =>
                      import("../../v2-routes/collections/collection-create"),
                  },
                ],
              },
              {
                path: ":id",
                lazy: () =>
                  import("../../v2-routes/collections/collection-detail"),
                handle: {
                  crumb: (data: AdminCollectionsRes) => data.collection.title,
                },
                children: [
                  {
                    path: "edit",
                    lazy: () =>
                      import("../../v2-routes/collections/collection-edit"),
                  },
                  {
                    path: "products",
                    lazy: () =>
                      import(
                        "../../v2-routes/collections/collection-add-products"
                      ),
                  },
                ],
              },
            ],
          },
          {
            path: "/pricing",
            handle: {
              crumb: () => "Pricing",
            },
            children: [
              {
                path: "",
                lazy: () => import("../../v2-routes/pricing/pricing-list"),
                children: [
                  {
                    path: "create",
                    lazy: () =>
                      import("../../v2-routes/pricing/pricing-create"),
                  },
                ],
              },
              {
                path: ":id",
                lazy: () => import("../../v2-routes/pricing/pricing-detail"),
                handle: {
                  crumb: (data: PriceListRes) => data.price_list.title,
                },
                children: [
                  {
                    path: "edit",
                    lazy: () => import("../../v2-routes/pricing/pricing-edit"),
                  },
                  {
                    path: "configuration",
                    lazy: () =>
                      import("../../v2-routes/pricing/pricing-configuration"),
                  },
                  {
                    path: "products/add",
                    lazy: () =>
                      import("../../v2-routes/pricing/pricing-products-add"),
                  },
                  {
                    path: "products/edit",
                    lazy: () =>
                      import("../../v2-routes/pricing/pricing-products-prices"),
                  },
                ],
              },
            ],
          },
          {
            path: "/customers",
            handle: {
              crumb: () => "Customers",
            },
            children: [
              {
                path: "",
                lazy: () => import("../../v2-routes/customers/customer-list"),
                children: [
                  {
                    path: "create",
                    lazy: () =>
                      import("../../v2-routes/customers/customer-create"),
                  },
                ],
              },
              {
                path: ":id",
                lazy: () => import("../../v2-routes/customers/customer-detail"),
                handle: {
                  crumb: (data: AdminCustomersRes) => data.customer.email,
                },
                children: [
                  {
                    path: "edit",
                    lazy: () =>
                      import("../../v2-routes/customers/customer-edit"),
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    element: <ProtectedRoute />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        path: "/settings",
        element: <SettingsLayout />,
        handle: {
          crumb: () => "Settings",
        },
        children: [
          {
            index: true,
            lazy: () => import("../../v2-routes/settings"),
          },
          {
            path: "profile",
            lazy: () => import("../../v2-routes/profile/profile-detail"),
            handle: {
              crumb: () => "Profile",
            },
            children: [
              {
                path: "edit",
                lazy: () => import("../../v2-routes/profile/profile-edit"),
              },
            ],
          },
          {
            path: "regions",
            element: <Outlet />,
            handle: {
              crumb: () => "Regions",
            },
            children: [
              {
                path: "",
                lazy: () => import("../../v2-routes/regions/region-list"),
                children: [
                  {
                    path: "create",
                    lazy: () => import("../../v2-routes/regions/region-create"),
                  },
                ],
              },
              {
                path: ":id",
                lazy: () => import("../../v2-routes/regions/region-detail"),
                handle: {
                  crumb: (data: AdminRegionsRes) => data.region.name,
                },
                children: [
                  {
                    path: "edit",
                    lazy: () => import("../../v2-routes/regions/region-edit"),
                  },
                  {
                    path: "countries/add",
                    lazy: () =>
                      import("../../v2-routes/regions/region-add-countries"),
                  },
                ],
              },
            ],
          },
          {
            path: "store",
            lazy: () => import("../../v2-routes/store/store-detail"),
            handle: {
              crumb: () => "Store",
            },
            children: [
              {
                path: "edit",
                lazy: () => import("../../v2-routes/store/store-edit"),
              },
              {
                path: "currencies",
                lazy: () =>
                  import("../../v2-routes/store/store-add-currencies"),
              },
            ],
          },
          {
            path: "shipping",
            lazy: () => import("../../v2-routes/shipping/locations-list"),
            handle: {
              crumb: () => "Shipping",
            },
            children: [
              {
                path: "location/:location_id",
                children: [
                  {
                    path: "fulfillment-set/:fset_id",
                    children: [
                      {
                        path: "service-zones/create",
                        lazy: () =>
                          import(
                            "../../v2-routes/shipping/service-zone-create"
                          ),
                      },
                      {
                        path: "service-zone/:zone_id",
                        children: [
                          {
                            path: "shipping-options/create",
                            lazy: () =>
                              import(
                                "../../v2-routes/shipping/shipping-options-create"
                              ),
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            path: "shipping-profiles",
            lazy: () =>
              import("../../v2-routes/shipping/shipping-profiles-list"),
            handle: {
              crumb: () => "Shipping Profiles",
            },
            children: [
              {
                path: "create",
                lazy: () =>
                  import("../../v2-routes/shipping/shipping-profile-create"),
              },
            ],
          },
          {
            path: "users",
            element: <Outlet />,
            handle: {
              crumb: () => "Users",
            },
            children: [
              {
                path: "",
                lazy: () => import("../../v2-routes/users/user-list"),
                children: [
                  {
                    path: "invite",
                    lazy: () => import("../../v2-routes/users/user-invite"),
                  },
                ],
              },
              {
                path: ":id",
                lazy: () => import("../../v2-routes/users/user-detail"),
                handle: {
                  crumb: (data: { user: UserDTO }) => data.user.email,
                },
                children: [
                  {
                    path: "edit",
                    lazy: () => import("../../v2-routes/users/user-edit"),
                  },
                ],
              },
            ],
          },
          {
            path: "locations",
            element: <Outlet />,
            handle: {
              crumb: () => "Locations",
            },
            children: [
              {
                path: "",
                lazy: () => import("../../v2-routes/locations/location-list"),
                children: [
                  {
                    path: "create",
                    lazy: () =>
                      import("../../v2-routes/locations/location-create"),
                  },
                ],
              },
              {
                path: ":id",
                lazy: () => import("../../v2-routes/locations/location-detail"),
                children: [
                  {
                    path: "edit",
                    lazy: () =>
                      import("../../v2-routes/locations/location-edit"),
                  },
                  {
                    path: "add-sales-channels",
                    lazy: () =>
                      import(
                        "../../v2-routes/locations/location-add-sales-channels"
                      ),
                  },
                ],
              },
            ],
          },
          {
            path: "sales-channels",
            element: <Outlet />,
            handle: {
              crumb: () => "Sales Channels",
            },
            children: [
              {
                path: "",
                lazy: () =>
                  import("../../v2-routes/sales-channels/sales-channel-list"),
                children: [
                  {
                    path: "create",
                    lazy: () =>
                      import(
                        "../../v2-routes/sales-channels/sales-channel-create"
                      ),
                  },
                ],
              },
              {
                path: ":id",
                lazy: () =>
                  import("../../v2-routes/sales-channels/sales-channel-detail"),
                handle: {
                  crumb: (data: { sales_channel: SalesChannelDTO }) =>
                    data.sales_channel.name,
                },
                children: [
                  {
                    path: "edit",
                    lazy: () =>
                      import(
                        "../../v2-routes/sales-channels/sales-channel-edit"
                      ),
                  },
                  {
                    path: "add-products",
                    lazy: () =>
                      import(
                        "../../v2-routes/sales-channels/sales-channel-add-products"
                      ),
                  },
                ],
              },
            ],
          },
          {
            path: "workflows",
            element: <Outlet />,
            handle: {
              crumb: () => "Workflows",
            },
            children: [
              {
                path: "",
                lazy: () =>
                  import(
                    "../../v2-routes/workflow-executions/workflow-execution-list"
                  ),
              },
              {
                path: ":id",
                lazy: () =>
                  import(
                    "../../v2-routes/workflow-executions/workflow-execution-detail"
                  ),
                handle: {
                  crumb: (data: { workflow: any }) => {
                    if (!data) {
                      return ""
                    }

                    return data.workflow.name
                  },
                },
              },
            ],
          },
          {
            path: "api-key-management",
            element: <Outlet />,
            handle: {
              crumb: () => "API Key Management",
            },
            children: [
              {
                path: "",
                lazy: () =>
                  import(
                    "../../v2-routes/api-key-management/api-key-management-list"
                  ),
                children: [
                  {
                    path: "create",
                    lazy: () =>
                      import(
                        "../../v2-routes/api-key-management/api-key-management-create"
                      ),
                  },
                ],
              },
              {
                path: ":id",
                lazy: () =>
                  import(
                    "../../v2-routes/api-key-management/api-key-management-detail"
                  ),
                handle: {
                  crumb: (data: AdminApiKeyResponse) => {
                    return data.api_key.title
                  },
                },
                children: [
                  {
                    path: "edit",
                    lazy: () =>
                      import(
                        "../../v2-routes/api-key-management/api-key-management-edit"
                      ),
                  },
                  {
                    path: "add-sales-channels",
                    lazy: () =>
                      import(
                        "../../v2-routes/api-key-management/api-key-management-add-sales-channels"
                      ),
                  },
                ],
              },
            ],
          },
          {
            path: "taxes",
            element: <Outlet />,
            handle: {
              crumb: () => "Taxes",
            },
            children: [
              {
                path: "",
                lazy: () => import("../../v2-routes/taxes/tax-region-list"),
                children: [],
              },
            ],
          },
        ],
      },
    ],
  },
]
