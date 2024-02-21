import type {
  AdminCollectionsRes,
  AdminCustomerGroupsRes,
  AdminCustomersRes,
  AdminGiftCardsRes,
  AdminProductsRes,
  AdminPublishableApiKeysRes,
  AdminRegionsRes,
  AdminSalesChannelsRes,
  AdminUserRes,
} from "@medusajs/medusa"
import {
  Outlet,
  RouterProvider as Provider,
  RouteObject,
  createBrowserRouter,
} from "react-router-dom"

import { ProtectedRoute } from "../../components/authentication/require-auth"
import { ErrorBoundary } from "../../components/error/error-boundary"
import { MainLayout } from "../../components/layout/main-layout"
import { SettingsLayout } from "../../components/layout/settings-layout"

import routes from "medusa-admin:routes/pages"
import settings from "medusa-admin:settings/pages"

const routeExtensions: RouteObject[] = routes.pages.map((ext) => {
  return {
    path: ext.path,
    async lazy() {
      const { default: Component } = await import(/* @vite-ignore */ ext.file)
      return { Component }
    },
  }
})

const settingsExtensions: RouteObject[] = settings.pages.map((ext) => {
  return {
    path: `/settings${ext.path}`,
    async lazy() {
      const { default: Component } = await import(/* @vite-ignore */ ext.file)
      return { Component }
    },
  }
})

const router = createBrowserRouter([
  {
    path: "/login",
    lazy: () => import("../../routes/login"),
  },
  {
    path: "/reset-password",
    element: <Outlet />,
    children: [
      {
        index: true,
        lazy: () =>
          import("../../routes/reset-password/reset-password-request"),
      },
      {
        path: ":token",
        lazy: () => import("../../routes/reset-password/reset-password-token"),
      },
    ],
  },
  {
    path: "/invite",
    lazy: () => import("../../routes/invite"),
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
            index: true,
            lazy: () => import("../../routes/home"),
          },
          {
            path: "/orders",
            handle: {
              crumb: () => "Orders",
            },
            children: [
              {
                index: true,
                lazy: () => import("../../routes/orders/order-list"),
              },
              {
                path: ":id",
                lazy: () => import("../../routes/orders/details"),
              },
            ],
          },
          {
            path: "/draft-orders",
            handle: {
              crumb: () => "Draft Orders",
            },
            children: [
              {
                index: true,
                lazy: () => import("../../routes/draft-orders/list"),
              },
              {
                path: ":id",
                lazy: () => import("../../routes/draft-orders/details"),
              },
            ],
          },
          {
            path: "/products",
            handle: {
              crumb: () => "Products",
            },
            children: [
              {
                path: "",
                lazy: () => import("../../routes/products/product-list"),
                children: [
                  {
                    path: "create",
                    lazy: () => import("../../routes/products/product-create"),
                  },
                ],
              },
              {
                path: ":id",
                lazy: () => import("../../routes/products/product-detail"),
                handle: {
                  crumb: (data: AdminProductsRes) => data.product.title,
                },
                children: [
                  {
                    path: "edit",
                    lazy: () => import("../../routes/products/product-edit"),
                  },
                  {
                    path: "sales-channels",
                    lazy: () =>
                      import("../../routes/products/product-sales-channels"),
                  },
                  {
                    path: "attributes",
                    lazy: () =>
                      import("../../routes/products/product-attributes"),
                  },
                  {
                    path: "options",
                    lazy: () => import("../../routes/products/product-options"),
                  },
                  {
                    path: "gallery",
                    lazy: () => import("../../routes/products/product-gallery"),
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
                index: true,
                lazy: () => import("../../routes/categories/list"),
              },
              {
                path: ":id",
                lazy: () => import("../../routes/categories/details"),
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
                lazy: () => import("../../routes/collections/collection-list"),
                children: [
                  {
                    path: "create",
                    lazy: () =>
                      import("../../routes/collections/collection-create"),
                  },
                ],
              },
              {
                path: ":id",
                handle: {
                  crumb: (data: AdminCollectionsRes) => data.collection.title,
                },
                lazy: () =>
                  import("../../routes/collections/collection-detail"),
                children: [
                  {
                    path: "edit",
                    lazy: () =>
                      import("../../routes/collections/collection-edit"),
                  },
                  {
                    path: "add-products",
                    lazy: () =>
                      import(
                        "../../routes/collections/collection-add-products"
                      ),
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
                lazy: () => import("../../routes/customers/customer-list"),
                children: [
                  {
                    path: "create",
                    lazy: () =>
                      import("../../routes/customers/customer-create"),
                  },
                ],
              },
              {
                path: ":id",
                lazy: () => import("../../routes/customers/customer-detail"),
                handle: {
                  crumb: (data: AdminCustomersRes) => data.customer.email,
                },
                children: [
                  {
                    path: "edit",
                    lazy: () => import("../../routes/customers/customer-edit"),
                  },
                ],
              },
            ],
          },
          {
            path: "/customer-groups",
            handle: {
              crumb: () => "Customer Groups",
            },
            children: [
              {
                path: "",
                lazy: () =>
                  import("../../routes/customer-groups/customer-group-list"),
                children: [
                  {
                    path: "create",
                    lazy: () =>
                      import(
                        "../../routes/customer-groups/customer-group-create"
                      ),
                  },
                ],
              },
              {
                path: ":id",
                lazy: () =>
                  import("../../routes/customer-groups/customer-group-detail"),
                handle: {
                  crumb: (data: AdminCustomerGroupsRes) =>
                    data.customer_group.name,
                },
                children: [
                  {
                    path: "add-customers",
                    lazy: () =>
                      import(
                        "../../routes/customer-groups/customer-group-add-customers"
                      ),
                  },
                  {
                    path: "edit",
                    lazy: () =>
                      import(
                        "../../routes/customer-groups/customer-group-edit"
                      ),
                  },
                ],
              },
            ],
          },
          {
            path: "/gift-cards",
            handle: {
              crumb: () => "Gift Cards",
            },
            children: [
              {
                path: "",
                lazy: () => import("../../routes/gift-cards/gift-card-list"),
                children: [
                  {
                    path: "create",
                    lazy: () =>
                      import("../../routes/gift-cards/gift-card-create"),
                  },
                ],
              },
              {
                path: ":id",
                lazy: () => import("../../routes/gift-cards/gift-card-detail"),
                handle: {
                  crumb: (data: AdminGiftCardsRes) => data.gift_card.code,
                },
                children: [
                  {
                    path: "edit",
                    lazy: () =>
                      import("../../routes/gift-cards/gift-card-edit"),
                  },
                ],
              },
            ],
          },
          {
            path: "/inventory",
            handle: {
              crumb: () => "Inventory",
            },
            lazy: () => import("../../routes/inventory/list"),
          },
          {
            path: "/discounts",
            handle: {
              crumb: () => "Discounts",
            },
            children: [
              {
                index: true,
                lazy: () => import("../../routes/discounts/list"),
              },
              {
                path: ":id",
                lazy: () => import("../../routes/discounts/details"),
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
                index: true,
                lazy: () => import("../../routes/pricing/list"),
              },
              {
                path: ":id",
                lazy: () => import("../../routes/pricing/details"),
              },
            ],
          },
        ],
      },
      {
        path: "/settings",
        element: <SettingsLayout />,
        handle: {
          crumb: () => "Settings",
        },
        children: [
          {
            index: true,
            lazy: () => import("../../routes/settings"),
          },
          {
            path: "profile",
            lazy: () => import("../../routes/profile/profile-detail"),
            handle: {
              crumb: () => "Profile",
            },
            children: [
              {
                path: "edit",
                lazy: () => import("../../routes/profile/profile-edit"),
              },
            ],
          },
          {
            path: "store",
            lazy: () => import("../../routes/store/store-detail"),
            handle: {
              crumb: () => "Store",
            },
            children: [
              {
                path: "edit",
                lazy: () => import("../../routes/store/store-edit"),
              },
              {
                path: "add-currencies",
                lazy: () => import("../../routes/store/store-add-currencies"),
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
                lazy: () => import("../../routes/locations/location-list"),
                children: [
                  {
                    path: "create",
                    lazy: () =>
                      import("../../routes/locations/location-create"),
                  },
                ],
              },
              {
                path: ":id",
                lazy: () => import("../../routes/locations/location-detail"),
                children: [
                  {
                    path: "edit",
                    lazy: () => import("../../routes/locations/location-edit"),
                  },
                  {
                    path: "add-sales-channels",
                    lazy: () =>
                      import(
                        "../../routes/locations/location-add-sales-channels"
                      ),
                  },
                ],
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
                lazy: () => import("../../routes/regions/region-list"),
                children: [
                  {
                    path: "create",
                    lazy: () => import("../../routes/regions/region-create"),
                  },
                ],
              },
              {
                path: ":id",
                lazy: () => import("../../routes/regions/region-detail"),
                handle: {
                  crumb: (data: AdminRegionsRes) => data.region.name,
                },
                children: [
                  {
                    path: "edit",
                    lazy: () => import("../../routes/regions/region-edit"),
                  },
                ],
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
                lazy: () => import("../../routes/users/user-list"),
                children: [
                  {
                    path: "invite",
                    lazy: () => import("../../routes/users/user-invite"),
                  },
                ],
              },
              {
                path: ":id",
                lazy: () => import("../../routes/users/user-detail"),
                handle: {
                  crumb: (data: AdminUserRes) => data.user.email,
                },
                children: [
                  {
                    path: "edit",
                    lazy: () => import("../../routes/users/user-edit"),
                  },
                ],
              },
            ],
          },
          {
            path: "taxes",
            handle: {
              crumb: () => "Taxes",
            },
            children: [
              {
                index: true,
                lazy: () => import("../../routes/taxes/views/tax-list"),
              },
              {
                path: ":id",
                lazy: () => import("../../routes/taxes/views/tax-details"),
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
                  import("../../routes/sales-channels/sales-channel-list"),
                children: [
                  {
                    path: "create",
                    lazy: () =>
                      import(
                        "../../routes/sales-channels/sales-channel-create"
                      ),
                  },
                ],
              },
              {
                path: ":id",
                lazy: () =>
                  import("../../routes/sales-channels/sales-channel-detail"),
                handle: {
                  crumb: (data: AdminSalesChannelsRes) =>
                    data.sales_channel.name,
                },
                children: [
                  {
                    path: "edit",
                    lazy: () =>
                      import("../../routes/sales-channels/sales-channel-edit"),
                  },
                  {
                    path: "add-products",
                    lazy: () =>
                      import(
                        "../../routes/sales-channels/sales-channel-add-products"
                      ),
                  },
                ],
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
                    "../../routes/api-key-management/api-key-management-list"
                  ),
                children: [
                  {
                    path: "create",
                    lazy: () =>
                      import(
                        "../../routes/api-key-management/api-key-management-create"
                      ),
                  },
                ],
              },
              {
                path: ":id",
                lazy: () =>
                  import(
                    "../../routes/api-key-management/api-key-management-detail"
                  ),
                handle: {
                  crumb: (data: AdminPublishableApiKeysRes) =>
                    data.publishable_api_key.title,
                },
                children: [
                  {
                    path: "edit",
                    lazy: () =>
                      import(
                        "../../routes/api-key-management/api-key-management-edit"
                      ),
                  },
                  {
                    path: "add-sales-channels",
                    lazy: () =>
                      import(
                        "../../routes/api-key-management/api-key-management-add-sales-channels"
                      ),
                  },
                ],
              },
            ],
          },
          ...settingsExtensions,
        ],
      },
      ...routeExtensions,
    ],
  },
  {
    path: "*",
    lazy: () => import("../../routes/no-match"),
  },
])

export const RouterProvider = () => {
  return <Provider router={router} />
}
