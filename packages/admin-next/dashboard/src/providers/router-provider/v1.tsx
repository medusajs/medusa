import type {
  AdminDiscountsRes,
  AdminDraftOrdersRes,
  AdminGiftCardsRes,
  AdminOrdersRes,
} from "@medusajs/medusa"
import { Outlet, RouteObject } from "react-router-dom"

import { ProtectedRoute } from "../../components/authentication/require-auth"
import { ErrorBoundary } from "../../components/error/error-boundary"
import { MainLayout } from "../../components/layout/main-layout"

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

/**
 * V1 routes.
 *
 * These routes are loaded by default.
 */
export const v1Routes: RouteObject[] = [
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
                path: "",
                lazy: () => import("../../routes/orders/order-list"),
              },
              {
                path: ":id",
                lazy: () => import("../../routes/orders/order-detail"),
                handle: {
                  crumb: (data: AdminOrdersRes) =>
                    `Order #${data.order.display_id}`,
                },
                children: [
                  {
                    path: "shipping-address",
                    lazy: () =>
                      import("../../routes/orders/order-shipping-address"),
                  },
                  {
                    path: "billing-address",
                    lazy: () =>
                      import("../../routes/orders/order-billing-address"),
                  },
                  {
                    path: "email",
                    lazy: () => import("../../routes/orders/order-email"),
                  },
                  {
                    path: "transfer-ownership",
                    lazy: () =>
                      import("../../routes/orders/order-transfer-ownership"),
                  },
                  {
                    path: "edit",
                    lazy: () => import("../../routes/orders/order-edit"),
                  },
                  {
                    path: "returns",
                    lazy: () =>
                      import("../../routes/orders/order-create-return"),
                  },
                  {
                    path: "refund",
                    lazy: () => import("../../routes/orders/order-refund"),
                  },
                ],
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
                path: "",
                lazy: () =>
                  import("../../routes/draft-orders/draft-order-list"),
                children: [
                  {
                    path: "create",
                    lazy: () =>
                      import("../../routes/draft-orders/draft-order-create"),
                  },
                ],
              },
              {
                path: ":id",
                lazy: () =>
                  import("../../routes/draft-orders/draft-order-detail"),
                handle: {
                  crumb: (data: AdminDraftOrdersRes) =>
                    `Draft #${data.draft_order.display_id}`,
                },
                children: [
                  {
                    path: "transfer-ownership",
                    lazy: () =>
                      import(
                        "../../routes/draft-orders/draft-order-transfer-ownership"
                      ),
                  },
                  {
                    path: "shipping-address",
                    lazy: () =>
                      import(
                        "../../routes/draft-orders/draft-order-shipping-address"
                      ),
                  },
                  {
                    path: "billing-address",
                    lazy: () =>
                      import(
                        "../../routes/draft-orders/draft-order-billing-address"
                      ),
                  },
                  {
                    path: "email",
                    lazy: () =>
                      import("../../routes/draft-orders/draft-order-email"),
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
            path: "/inventory",
            handle: {
              crumb: () => "Inventory",
            },
            lazy: () => import("../../routes/inventory/inventory-list"),
          },
          {
            path: "/reservations",
            handle: {
              crumb: () => "Reservations",
            },
            children: [
              {
                path: "",
                lazy: () =>
                  import("../../routes/reservations/reservation-list"),
              },
              {
                path: ":id",
                lazy: () =>
                  import("../../routes/reservations/reservation-detail"),
                // children: [
                //   {
                //     path: "edit",
                //     lazy: () =>
                //       import("../../routes/reservations/reservation-edit"),
                //   },
                // ],
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
            path: "/discounts",
            handle: {
              crumb: () => "Discounts",
            },
            children: [
              {
                path: "",
                lazy: () => import("../../routes/discounts/discount-list"),
              },
              {
                path: "create",
                lazy: () => import("../../routes/discounts/discount-create"),
              },
              {
                path: ":id",
                lazy: () => import("../../routes/discounts/discount-detail"),
                handle: {
                  crumb: (data: AdminDiscountsRes) => data.discount.code,
                },
                children: [
                  {
                    path: "edit",
                    lazy: () =>
                      import("../../routes/discounts/discount-edit-details"),
                  },
                  {
                    path: "configuration",
                    lazy: () =>
                      import(
                        "../../routes/discounts/discount-edit-configuration"
                      ),
                  },
                  {
                    path: "conditions",
                    lazy: () =>
                      import("../../routes/discounts/discount-edit-conditions"),
                  },
                ],
              },
            ],
          },
        ],
      },
      ...routeExtensions,
    ],
  },
  {
    path: "*",
    lazy: () => import("../../routes/no-match"),
  },
]
