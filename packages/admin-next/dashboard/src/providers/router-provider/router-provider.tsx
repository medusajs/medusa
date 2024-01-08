import {
  RouterProvider as Provider,
  RouteObject,
  createBrowserRouter,
} from "react-router-dom"

import { RequireAuth } from "../../components/authentication/require-auth"
import { AppLayout } from "../../components/layout/app-layout"
import { PublicLayout } from "../../components/layout/public-layout"

import { AdminProductsRes } from "@medusajs/medusa"
import routes from "medusa-admin:routes/pages"
import settings from "medusa-admin:settings/pages"
import { ErrorBoundary } from "../../components/error/error-boundary"
import { SearchProvider } from "../search-provider"

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
    element: (
      <RequireAuth>
        <SearchProvider>
          <AppLayout />
        </SearchProvider>
      </RequireAuth>
    ),
    errorElement: <ErrorBoundary />,
    children: [
      {
        path: "/",
        lazy: () => import("../../routes/home"),
      },
      {
        path: "/orders",
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
            lazy: () => import("../../routes/products/views/product-details"),
            handle: {
              crumb: (data: AdminProductsRes) => data.product.title,
            },
          },
        ],
      },
      {
        path: "/categories",
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
        lazy: () => import("../../routes/inventory/list"),
      },
      {
        path: "/discounts",
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
      {
        path: "/settings",
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
            lazy: () => import("../../routes/profile/views/profile-details"),
            handle: {
              crumb: () => "Profile",
            },
          },
          {
            path: "store",
            lazy: () => import("../../routes/store/views/store-details"),
            handle: {
              crumb: () => "Store",
            },
          },
          {
            path: "locations",
            lazy: () => import("../../routes/locations/list"),
          },
          {
            path: "regions",
            handle: {
              crumb: () => "Regions",
            },
            children: [
              {
                index: true,
                lazy: () => import("../../routes/regions/views/region-list"),
              },
              {
                path: ":id",
                lazy: () => import("../../routes/regions/views/region-details"),
              },
            ],
          },
          {
            path: "users",
            lazy: () => import("../../routes/users"),
            handle: {
              crumb: () => "Users",
            },
          },
          {
            path: "currencies",
            lazy: () =>
              import("../../routes/currencies/views/currencies-details"),
            handle: {
              crumb: () => "Currencies",
            },
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
            handle: {
              crumb: () => "Sales Channels",
            },
            children: [
              {
                index: true,
                lazy: () =>
                  import(
                    "../../routes/sales-channels/views/sales-channel-list"
                  ),
              },
              {
                path: ":id",
                lazy: () =>
                  import(
                    "../../routes/sales-channels/views/sales-channel-details"
                  ),
              },
            ],
          },
          {
            path: "api-key-management",
            lazy: () => import("../../routes/api-key-management"),
            handle: {
              crumb: () => "API Key Management",
            },
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
