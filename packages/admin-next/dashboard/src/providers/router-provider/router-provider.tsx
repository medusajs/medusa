import {
  Outlet,
  RouterProvider as Provider,
  RouteObject,
  createBrowserRouter,
} from "react-router-dom"

import { ProtectedRoute } from "../../components/authentication/require-auth"
import { MainLayout } from "../../components/layout/main-layout"
import { PublicLayout } from "../../components/layout/public-layout"

import { AdminProductsRes, AdminRegionsRes } from "@medusajs/medusa"
import routes from "medusa-admin:routes/pages"
import settings from "medusa-admin:settings/pages"
import { ErrorBoundary } from "../../components/error/error-boundary"
import { SettingsLayout } from "../../components/layout/settings-layout"

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
    element: <PublicLayout />,
    children: [
      {
        path: "/login",
        lazy: () => import("../../routes/login"),
      },
    ],
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
                lazy: () => import("../../routes/orders/list"),
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
                index: true,
                lazy: () => import("../../routes/products/views/product-list"),
              },
              {
                path: ":id",
                lazy: () =>
                  import("../../routes/products/views/product-details"),
                handle: {
                  crumb: (data: AdminProductsRes) => data.product.title,
                },
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
                index: true,
                lazy: () => import("../../routes/collections/list"),
              },
              {
                path: ":id",
                lazy: () => import("../../routes/collections/details"),
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
                index: true,
                lazy: () => import("../../routes/customers/list"),
              },
              {
                path: ":id",
                lazy: () => import("../../routes/customers/details"),
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
                index: true,
                lazy: () => import("../../routes/customer-groups/list"),
              },
              {
                path: ":id",
                lazy: () => import("../../routes/customer-groups/details"),
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
                index: true,
                lazy: () => import("../../routes/gift-cards/list"),
              },
              {
                path: ":id",
                lazy: () => import("../../routes/gift-cards/details"),
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
                children: [
                  {
                    path: "edit",
                    lazy: () =>
                      import("../../routes/sales-channels/sales-channel-edit"),
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
                children: [
                  {
                    path: "edit",
                    lazy: () =>
                      import(
                        "../../routes/api-key-management/api-key-management-edit"
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
