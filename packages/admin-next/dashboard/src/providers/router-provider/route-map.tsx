import {
  AdminApiKeyResponse,
  AdminProductCategoryResponse,
  AdminTaxRateResponse,
  AdminTaxRegionResponse,
  HttpTypes,
  SalesChannelDTO,
  UserDTO,
} from "@medusajs/types"
import { Outlet, RouteObject } from "react-router-dom"

import { ProtectedRoute } from "../../components/authentication/protected-route"
import { MainLayout } from "../../components/layout/main-layout"
import { SettingsLayout } from "../../components/layout/settings-layout"
import { ErrorBoundary } from "../../components/utilities/error-boundary"
import { InventoryItemRes, PriceListRes } from "../../types/api-responses"

import { RouteExtensions } from "./route-extensions"
import { SettingsExtensions } from "./settings-extensions"

export const RouteMap: RouteObject[] = [
  {
    path: "/login",
    lazy: () => import("../../routes/login"),
  },
  {
    path: "/",
    lazy: () => import("../../routes/home"),
  },
  {
    path: "*",
    lazy: () => import("../../routes/no-match"),
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
                  crumb: (data: { product: HttpTypes.AdminProduct }) =>
                    data.product.title,
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
                    path: "organization",
                    lazy: () =>
                      import("../../routes/products/product-organization"),
                  },
                  {
                    path: "media",
                    lazy: () => import("../../routes/products/product-media"),
                  },
                  {
                    path: "prices",
                    lazy: () => import("../../routes/products/product-prices"),
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
                    path: "variants/create",
                    lazy: () =>
                      import("../../routes/products/product-create-variant"),
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
                path: "",
                lazy: () => import("../../routes/categories/category-list"),
              },
              {
                path: ":id",
                lazy: () => import("../../routes/categories/category-detail"),
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
                lazy: () => import("../../routes/orders/order-list"),
              },
              {
                path: ":id",
                lazy: () => import("../../routes/orders/order-detail"),
                children: [
                  {
                    path: "fulfillment",
                    lazy: () =>
                      import("../../routes/orders/order-create-fulfillment"),
                  },
                ],
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
                lazy: () => import("../../routes/promotions/promotion-list"),
              },
              {
                path: "create",
                lazy: () => import("../../routes/promotions/promotion-create"),
              },
              {
                path: ":id",
                lazy: () => import("../../routes/promotions/promotion-detail"),
                handle: {
                  // TODO: Re-add type when it's available again
                  crumb: (data: any) => data.promotion?.code,
                },
                children: [
                  {
                    path: "edit",
                    lazy: () =>
                      import("../../routes/promotions/promotion-edit-details"),
                  },
                  {
                    path: "add-to-campaign",
                    lazy: () =>
                      import("../../routes/promotions/promotion-add-campaign"),
                  },
                  {
                    path: ":ruleType/edit",
                    lazy: () =>
                      import("../../routes/promotions/common/edit-rules"),
                  },
                ],
              },
            ],
          },
          {
            path: "/campaigns",
            handle: { crumb: () => "Campaigns" },
            children: [
              {
                path: "",
                lazy: () => import("../../routes/campaigns/campaign-list"),
                children: [],
              },
              {
                path: "create",
                lazy: () => import("../../routes/campaigns/campaign-create"),
              },
              {
                path: ":id",
                lazy: () => import("../../routes/campaigns/campaign-detail"),
                handle: { crumb: (data: any) => data.campaign.name },
                children: [
                  {
                    path: "edit",
                    lazy: () => import("../../routes/campaigns/campaign-edit"),
                  },
                  {
                    path: "edit-budget",
                    lazy: () =>
                      import("../../routes/campaigns/campaign-budget-edit"),
                  },
                  {
                    path: "add-promotions",
                    lazy: () =>
                      import("../../routes/campaigns/add-campaign-promotions"),
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
                lazy: () =>
                  import("../../routes/collections/collection-detail"),
                handle: {
                  crumb: (data: { collection: HttpTypes.AdminCollection }) =>
                    data.collection.title,
                },
                children: [
                  {
                    path: "edit",
                    lazy: () =>
                      import("../../routes/collections/collection-edit"),
                  },
                  {
                    path: "products",
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
            path: "/pricing",
            handle: {
              crumb: () => "Pricing",
            },
            children: [
              {
                path: "",
                lazy: () => import("../../routes/pricing/pricing-list"),
                children: [
                  {
                    path: "create",
                    lazy: () => import("../../routes/pricing/pricing-create"),
                  },
                ],
              },
              {
                path: ":id",
                lazy: () => import("../../routes/pricing/pricing-detail"),
                handle: {
                  crumb: (data: PriceListRes) => data.price_list.title,
                },
                children: [
                  {
                    path: "edit",
                    lazy: () => import("../../routes/pricing/pricing-edit"),
                  },
                  {
                    path: "configuration",
                    lazy: () =>
                      import("../../routes/pricing/pricing-configuration"),
                  },
                  {
                    path: "products/add",
                    lazy: () => import("../../routes/pricing/pricing-products"),
                  },
                  {
                    path: "products/edit",
                    lazy: () =>
                      import("../../routes/pricing/pricing-products-prices"),
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
                  // Re-add type when it's available again
                  crumb: (data: any) => data.customer.email,
                },
                children: [
                  {
                    path: "edit",
                    lazy: () => import("../../routes/customers/customer-edit"),
                  },
                  {
                    path: "add-customer-groups",
                    lazy: () =>
                      import(
                        "../../routes/customers/customers-add-customer-group"
                      ),
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
                  crumb: (data: {
                    customer_group: HttpTypes.AdminCustomerGroup
                  }) => data.customer_group.name,
                },
                children: [
                  {
                    path: "edit",
                    lazy: () =>
                      import(
                        "../../routes/customer-groups/customer-group-edit"
                      ),
                  },
                  {
                    path: "add-customers",
                    lazy: () =>
                      import(
                        "../../routes/customer-groups/customer-group-add-customers"
                      ),
                  },
                ],
              },
            ],
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
                children: [
                  {
                    path: "create",
                    lazy: () =>
                      import(
                        "../../routes/reservations/reservation-list/create-reservation"
                      ),
                  },
                ],
              },
              {
                path: ":id",
                lazy: () =>
                  import("../../routes/reservations/reservation-detail"),
                handle: {
                  crumb: ({ reservation }: any) => {
                    return (
                      reservation?.inventory_item?.title ??
                      reservation?.inventory_item?.sku ??
                      reservation?.id
                    )
                  },
                },
                children: [
                  {
                    path: "edit",
                    lazy: () =>
                      import(
                        "../../routes/reservations/reservation-detail/components/edit-reservation"
                      ),
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
            children: [
              {
                path: "",
                lazy: () => import("../../routes/inventory/inventory-list"),
              },
              {
                path: ":id",
                lazy: () => import("../../routes/inventory/inventory-detail"),
                handle: {
                  crumb: (data: InventoryItemRes) =>
                    data.inventory_item.title ?? data.inventory_item.sku,
                },
                children: [
                  {
                    path: "edit",
                    lazy: () =>
                      import(
                        "../../routes/inventory/inventory-detail/components/edit-inventory-item"
                      ),
                  },
                  {
                    path: "attributes",
                    lazy: () =>
                      import(
                        "../../routes/inventory/inventory-detail/components/edit-inventory-item-attributes"
                      ),
                  },
                  {
                    path: "locations",
                    lazy: () =>
                      import(
                        "../../routes/inventory/inventory-detail/components/manage-locations"
                      ),
                  },
                  {
                    path: "locations/:location_id",
                    lazy: () =>
                      import(
                        "../../routes/inventory/inventory-detail/components/adjust-inventory"
                      ),
                  },
                  {
                    // TODO: create reservation
                    path: "reservations",
                    lazy: () => import("../../routes/customers/customer-edit"),
                  },
                  {
                    // TODO: edit reservation
                    path: "reservations/:reservation_id",
                    lazy: () => import("../../routes/customers/customer-edit"),
                  },
                ],
              },
            ],
          },
          ...RouteExtensions,
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
                  crumb: (data: { region: HttpTypes.AdminRegion }) =>
                    data.region.name,
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
                ],
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
                path: "currencies",
                lazy: () => import("../../routes/store/store-add-currencies"),
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
                  crumb: (data: { user: UserDTO }) => data.user.email,
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
                  crumb: (data: { sales_channel: SalesChannelDTO }) =>
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
            path: "shipping",
            element: <Outlet />,
            handle: {
              crumb: () => "Location & Shipping",
            },
            children: [
              {
                path: "",
                lazy: () => import("../../routes/shipping/location-list"),
              },
              {
                path: "create",
                lazy: () => import("../../routes/shipping/location-create"),
              },
              {
                path: ":location_id",
                lazy: () => import("../../routes/shipping/location-details"),
                children: [
                  {
                    path: "edit",
                    lazy: () => import("../../routes/shipping/location-edit"),
                  },
                  {
                    path: "sales-channels/edit",
                    lazy: () =>
                      import(
                        "../../routes/shipping/location-add-sales-channels"
                      ),
                  },
                  {
                    path: "fulfillment-set/:fset_id",
                    children: [
                      {
                        path: "service-zones/create",
                        lazy: () =>
                          import("../../routes/shipping/service-zone-create"),
                      },
                      {
                        path: "service-zone/:zone_id",
                        children: [
                          {
                            path: "edit",
                            lazy: () =>
                              import("../../routes/shipping/service-zone-edit"),
                          },
                          {
                            path: "edit-areas",
                            lazy: () =>
                              import(
                                "../../routes/shipping/service-zone-areas-edit"
                              ),
                          },
                          {
                            path: "shipping-option",
                            children: [
                              {
                                path: "create",
                                lazy: () =>
                                  import(
                                    "../../routes/shipping/shipping-options-create"
                                  ),
                              },
                              {
                                path: ":so_id",
                                children: [
                                  {
                                    path: "edit",
                                    lazy: () =>
                                      import(
                                        "../../routes/shipping/shipping-option-edit"
                                      ),
                                  },
                                  {
                                    path: "edit-pricing",
                                    lazy: () =>
                                      import(
                                        "../../routes/shipping/shipping-options-edit-pricing"
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
                    "../../routes/workflow-executions/workflow-execution-list"
                  ),
              },
              {
                path: ":id",
                lazy: () =>
                  import(
                    "../../routes/workflow-executions/workflow-execution-detail"
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
            path: "shipping-profiles",
            element: <Outlet />,
            handle: {
              crumb: () => "Shipping Profiles",
            },
            children: [
              {
                path: "",
                lazy: () =>
                  import(
                    "../../routes/shipping-profiles/shipping-profiles-list"
                  ),
                children: [
                  {
                    path: "create",
                    lazy: () =>
                      import(
                        "../../routes/shipping-profiles/shipping-profile-create"
                      ),
                  },
                ],
              },
              {
                path: ":id",
                lazy: () =>
                  import(
                    "../../routes/shipping-profiles/shipping-profile-detail"
                  ),
              },
            ],
          },
          {
            path: "publishable-api-keys",
            element: <Outlet />,
            handle: {
              crumb: () => "Publishable API Keys",
            },
            children: [
              {
                path: "",
                element: <Outlet />,
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
                ],
              },
              {
                path: ":id",
                lazy: () =>
                  import(
                    "../../routes/api-key-management/api-key-management-detail"
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
                        "../../routes/api-key-management/api-key-management-edit"
                      ),
                  },
                  {
                    path: "sales-channels",
                    lazy: () =>
                      import(
                        "../../routes/api-key-management/api-key-management-sales-channels"
                      ),
                  },
                ],
              },
            ],
          },
          {
            path: "secret-api-keys",
            element: <Outlet />,
            handle: {
              crumb: () => "Secret API Keys",
            },
            children: [
              {
                path: "",
                element: <Outlet />,
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
                ],
              },
              {
                path: ":id",
                lazy: () =>
                  import(
                    "../../routes/api-key-management/api-key-management-detail"
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
                        "../../routes/api-key-management/api-key-management-edit"
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
                lazy: () => import("../../routes/taxes/tax-region-list"),
                children: [
                  {
                    path: "create",
                    lazy: () => import("../../routes/taxes/tax-region-create"),
                    children: [],
                  },
                ],
              },
              {
                path: ":id",
                lazy: () => import("../../routes/taxes/tax-region-detail"),
                handle: {
                  crumb: (data: AdminTaxRegionResponse) => {
                    return data.tax_region.country_code
                  },
                },
                children: [
                  {
                    path: "create-default",
                    lazy: () =>
                      import("../../routes/taxes/tax-province-create"),
                    children: [],
                  },
                  {
                    path: "create-override",
                    lazy: () => import("../../routes/taxes/tax-rate-create"),
                    children: [],
                  },
                  {
                    path: "tax-rates",
                    children: [
                      {
                        path: ":taxRateId",
                        children: [
                          {
                            path: "edit",
                            lazy: () =>
                              import("../../routes/taxes/tax-rate-edit"),
                            handle: {
                              crumb: (data: AdminTaxRateResponse) => {
                                return data.tax_rate.code
                              },
                            },
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
          ...SettingsExtensions,
        ],
      },
    ],
  },
]
