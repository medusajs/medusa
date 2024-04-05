import type {
  AdminCustomerGroupsRes,
  AdminCustomersRes,
  AdminDiscountsRes,
  AdminDraftOrdersRes,
  AdminGiftCardsRes,
  AdminOrdersRes,
  AdminProductsRes,
  AdminPublishableApiKeysRes,
  AdminRegionsRes,
  AdminSalesChannelsRes,
  AdminUserRes,
} from "@medusajs/medusa"
import { Outlet, RouteObject } from "react-router-dom"

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
                    path: "options/create",
                    lazy: () =>
                      import("../../routes/products/product-create-option"),
                  },
                  {
                    path: "options/:option_id/edit",
                    lazy: () =>
                      import("../../routes/products/product-edit-option"),
                  },
                  {
                    path: "media",
                    lazy: () => import("../../routes/products/product-media"),
                  },
                  {
                    path: "variants/:variant_id/edit",
                    lazy: () =>
                      import("../../routes/products/product-edit-variant"),
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
          {
            path: "/pricing",
            handle: {
              crumb: () => "Pricing",
            },
            children: [
              {
                path: "",
                lazy: () => import("../../routes/pricing/pricing-list"),
                children: [
                  // {
                  //   path: "create",
                  //   lazy: () => import("../../routes/pricing/pricing-create"),
                  // },
                ],
              },
              {
                path: ":id",
                lazy: () => import("../../routes/pricing/pricing-detail"),
                children: [
                  {
                    path: "edit",
                    lazy: () => import("../../routes/pricing/pricing-edit"),
                  },
                  {
                    path: "products/add",
                    lazy: () =>
                      import("../../routes/pricing/pricing-products-add"),
                  },
                  {
                    path: "products/edit",
                    lazy: () =>
                      import("../../routes/pricing/pricing-products-edit"),
                  },
                ],
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
            path: "return-reasons",
            element: <Outlet />,
            handle: {
              crumb: () => "Return Reasons",
            },
            children: [
              {
                path: "",
                lazy: () =>
                  import("../../routes/return-reasons/return-reason-list"),
                children: [
                  {
                    path: "create",
                    lazy: () =>
                      import(
                        "../../routes/return-reasons/return-reason-create"
                      ),
                  },
                  {
                    path: ":id/edit",
                    lazy: () =>
                      import("../../routes/return-reasons/return-reason-edit"),
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
                  {
                    path: "countries/add",
                    lazy: () =>
                      import("../../routes/regions/region-add-countries"),
                  },
                  {
                    path: "shipping-options/:so_id/edit",
                    lazy: () =>
                      import(
                        "../../routes/regions/region-edit-shipping-option"
                      ),
                  },
                  {
                    path: "shipping-options/create",
                    lazy: () =>
                      import(
                        "../../routes/regions/region-create-shipping-option"
                      ),
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
                path: "",
                lazy: () => import("../../routes/taxes/tax-list"),
              },
              {
                path: ":id",
                lazy: () => import("../../routes/taxes/tax-detail"),
                handle: {
                  crumb: (data: AdminRegionsRes) => data.region.name,
                },
                children: [
                  {
                    path: "edit",
                    lazy: () => import("../../routes/taxes/tax-edit"),
                  },
                  {
                    path: "tax-rates/create",
                    lazy: () => import("../../routes/taxes/tax-rate-create"),
                  },
                  {
                    path: "tax-rates/:rate_id/edit",
                    lazy: () => import("../../routes/taxes/tax-rate-edit"),
                  },
                  {
                    path: "tax-rates/:rate_id/edit-overrides",
                    lazy: () =>
                      import("../../routes/taxes/tax-rate-edit-overrides"),
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
]
