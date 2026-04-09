import { HttpTypes } from "@medusajs/types"
import { t } from "i18next"
import { Outlet, RouteObject, UIMatch } from "react-router-dom"
import { ProtectedRoute } from "../../components/authentication/protected-route"
import { MainLayout } from "../../components/layout/main-layout"
import { PublicLayout } from "../../components/layout/public-layout"
import { SettingsLayout } from "../../components/layout/settings-layout"
import { ErrorBoundary } from "../../components/utilities/error-boundary"
import { TaxRegionDetailBreadcrumb } from "../../routes/tax-regions/tax-region-detail/breadcrumb"
import { taxRegionLoader } from "../../routes/tax-regions/tax-region-detail/loader"

export function getRouteMap({
  settingsRoutes,
  coreRoutes,
}: {
  settingsRoutes: RouteObject[]
  coreRoutes: RouteObject[]
}) {
  return [
    {
      element: <ProtectedRoute />,
      errorElement: <ErrorBoundary />,
      children: [
        {
          element: <MainLayout />,
          children: [
            {
              path: "/",
              errorElement: <ErrorBoundary />,
              lazy: () => import("../../routes/home"),
            },
            {
              path: "/products",
              errorElement: <ErrorBoundary />,
              handle: {
                breadcrumb: () => t("products.domain"),
              },
              children: [
                {
                  path: "",
                  lazy: () => import("../../routes/products/product-list"),
                  children: [
                    {
                      path: "create",
                      lazy: () =>
                        import("../../routes/products/product-create"),
                    },
                    {
                      path: "import",
                      lazy: () =>
                        import("../../routes/products/product-import"),
                    },
                    {
                      path: "export",
                      lazy: () =>
                        import("../../routes/products/product-export"),
                    },
                  ],
                },
                {
                  path: ":id",
                  errorElement: <ErrorBoundary />,
                  lazy: async () => {
                    const { Breadcrumb, loader } = await import(
                      "../../routes/products/product-detail"
                    )

                    return {
                      Component: Outlet,
                      loader,
                      handle: {
                        breadcrumb: (
                          match: UIMatch<HttpTypes.AdminProductResponse>
                        ) => <Breadcrumb {...match} />,
                      },
                    }
                  },
                  children: [
                    {
                      path: "",
                      lazy: () =>
                        import("../../routes/products/product-detail"),
                      children: [
                        {
                          path: "edit",
                          lazy: () =>
                            import("../../routes/products/product-edit"),
                        },
                        {
                          path: "edit-variant",
                          lazy: () =>
                            import(
                              "../../routes/product-variants/product-variant-edit"
                            ),
                        },
                        {
                          path: "sales-channels",
                          lazy: () =>
                            import(
                              "../../routes/products/product-sales-channels"
                            ),
                        },
                        {
                          path: "attributes",
                          lazy: () =>
                            import("../../routes/products/product-attributes"),
                        },
                        {
                          path: "organization",
                          lazy: () =>
                            import(
                              "../../routes/products/product-organization"
                            ),
                        },
                        {
                          path: "shipping-profile",
                          lazy: () =>
                            import(
                              "../../routes/products/product-shipping-profile"
                            ),
                        },
                        {
                          path: "media",
                          lazy: () =>
                            import("../../routes/products/product-media"),
                        },
                        {
                          path: "images/:image_id/variants",
                          lazy: () =>
                            import(
                              "../../routes/products/product-image-variants-edit"
                            ),
                        },
                        {
                          path: "prices",
                          lazy: () =>
                            import("../../routes/products/product-prices"),
                        },
                        {
                          path: "options/create",
                          lazy: () =>
                            import(
                              "../../routes/products/product-create-option"
                            ),
                        },
                        {
                          path: "options/:option_id/edit",
                          lazy: () =>
                            import("../../routes/products/product-edit-option"),
                        },
                        {
                          path: "variants/create",
                          lazy: () =>
                            import(
                              "../../routes/products/product-create-variant"
                            ),
                        },
                        {
                          path: "stock",
                          lazy: () =>
                            import("../../routes/products/product-stock"),
                        },
                        {
                          path: "metadata/edit",
                          lazy: () =>
                            import("../../routes/products/product-metadata"),
                        },
                      ],
                    },
                    {
                      path: "variants/:variant_id",
                      lazy: async () => {
                        const { Component, Breadcrumb, loader } = await import(
                          "../../routes/product-variants/product-variant-detail"
                        )

                        return {
                          Component,
                          loader,
                          handle: {
                            breadcrumb: (
                              // eslint-disable-next-line max-len
                              match: UIMatch<HttpTypes.AdminProductVariantResponse>
                            ) => <Breadcrumb {...match} />,
                          },
                        }
                      },
                      children: [
                        {
                          path: "edit",
                          lazy: () =>
                            import(
                              "../../routes/product-variants/product-variant-edit"
                            ),
                        },
                        {
                          path: "prices",
                          lazy: () =>
                            import("../../routes/products/product-prices"),
                        },
                        {
                          path: "manage-items",
                          lazy: () =>
                            import(
                              "../../routes/product-variants/product-variant-manage-inventory-items"
                            ),
                        },
                        {
                          path: "media",
                          lazy: () =>
                            import(
                              "../../routes/product-variants/product-variant-media"
                            ),
                        },
                        {
                          path: "metadata/edit",
                          lazy: () =>
                            import(
                              "../../routes/product-variants/product-variant-metadata"
                            ),
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              path: "/categories",
              errorElement: <ErrorBoundary />,
              handle: {
                breadcrumb: () => t("categories.domain"),
              },
              children: [
                {
                  path: "",
                  lazy: () => import("../../routes/categories/category-list"),
                  children: [
                    {
                      path: "create",
                      lazy: () =>
                        import("../../routes/categories/category-create"),
                    },
                    {
                      path: "organize",
                      lazy: () =>
                        import("../../routes/categories/category-organize"),
                    },
                  ],
                },
                {
                  path: ":id",
                  lazy: async () => {
                    const { Component, Breadcrumb, loader } = await import(
                      "../../routes/categories/category-detail"
                    )

                    return {
                      Component,
                      loader,
                      handle: {
                        breadcrumb: (
                          match: UIMatch<HttpTypes.AdminProductCategoryResponse>
                        ) => <Breadcrumb {...match} />,
                      },
                    }
                  },
                  children: [
                    {
                      path: "edit",
                      lazy: () =>
                        import("../../routes/categories/category-edit"),
                    },
                    {
                      path: "products",
                      lazy: () =>
                        import("../../routes/categories/category-products"),
                    },
                    {
                      path: "organize",
                      lazy: () =>
                        import("../../routes/categories/category-organize"),
                    },
                    {
                      path: "metadata/edit",
                      lazy: () =>
                        import("../../routes/categories/categories-metadata"),
                    },
                  ],
                },
              ],
            },
            {
              path: "/orders",
              errorElement: <ErrorBoundary />,
              handle: {
                breadcrumb: () => t("orders.domain"),
              },
              children: [
                {
                  path: "",
                  lazy: () => import("../../routes/orders/order-list"),
                  children: [
                    {
                      path: "export",
                      lazy: () => import("../../routes/orders/order-export"),
                    },
                  ],
                },
                {
                  path: ":id",
                  lazy: async () => {
                    const { Component, Breadcrumb, loader } = await import(
                      "../../routes/orders/order-detail"
                    )

                    return {
                      Component,
                      loader,
                      handle: {
                        breadcrumb: (
                          match: UIMatch<HttpTypes.AdminOrderResponse>
                        ) => <Breadcrumb {...match} />,
                      },
                    }
                  },
                  children: [
                    {
                      path: "fulfillment",
                      lazy: () =>
                        import("../../routes/orders/order-create-fulfillment"),
                    },
                    {
                      path: "returns/:return_id/receive",
                      lazy: () =>
                        import("../../routes/orders/order-receive-return"),
                    },
                    {
                      path: "allocate-items",
                      lazy: () =>
                        import("../../routes/orders/order-allocate-items"),
                    },
                    {
                      path: ":f_id/create-shipment",
                      lazy: () =>
                        import("../../routes/orders/order-create-shipment"),
                    },
                    {
                      path: "returns",
                      lazy: () =>
                        import("../../routes/orders/order-create-return"),
                    },
                    {
                      path: "claims",
                      lazy: () =>
                        import("../../routes/orders/order-create-claim"),
                    },
                    {
                      path: "exchanges",
                      lazy: () =>
                        import("../../routes/orders/order-create-exchange"),
                    },
                    {
                      path: "edits",
                      lazy: () =>
                        import("../../routes/orders/order-create-edit"),
                    },
                    {
                      path: "refund",
                      lazy: () =>
                        import("../../routes/orders/order-create-refund"),
                    },
                    {
                      path: "transfer",
                      lazy: () =>
                        import("../../routes/orders/order-request-transfer"),
                    },
                    {
                      path: "email",
                      lazy: () =>
                        import("../../routes/orders/order-edit-email"),
                    },
                    {
                      path: "shipping-address",
                      lazy: () =>
                        import(
                          "../../routes/orders/order-edit-shipping-address"
                        ),
                    },
                    {
                      path: "billing-address",
                      lazy: () =>
                        import(
                          "../../routes/orders/order-edit-billing-address"
                        ),
                    },
                    {
                      path: "metadata/edit",
                      lazy: () => import("../../routes/orders/order-metadata"),
                    },
                  ],
                },
              ],
            },
            {
              path: "/promotions",
              errorElement: <ErrorBoundary />,
              handle: {
                breadcrumb: () => t("promotions.domain"),
              },
              children: [
                {
                  path: "",
                  lazy: () => import("../../routes/promotions/promotion-list"),
                },
                {
                  path: "create",
                  lazy: () =>
                    import("../../routes/promotions/promotion-create"),
                },
                {
                  path: ":id",
                  lazy: async () => {
                    const { Component, Breadcrumb, loader } = await import(
                      "../../routes/promotions/promotion-detail"
                    )

                    return {
                      Component,
                      loader,
                      handle: {
                        breadcrumb: (
                          match: UIMatch<HttpTypes.AdminPromotionResponse>
                        ) => <Breadcrumb {...match} />,
                      },
                    }
                  },
                  children: [
                    {
                      path: "edit",
                      lazy: () =>
                        import(
                          "../../routes/promotions/promotion-edit-details"
                        ),
                    },
                    {
                      path: "add-to-campaign",
                      lazy: () =>
                        import(
                          "../../routes/promotions/promotion-add-campaign"
                        ),
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
              errorElement: <ErrorBoundary />,
              handle: {
                breadcrumb: () => t("campaigns.domain"),
              },
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
                  lazy: async () => {
                    const { Component, Breadcrumb, loader } = await import(
                      "../../routes/campaigns/campaign-detail"
                    )

                    return {
                      Component,
                      loader,
                      handle: {
                        breadcrumb: (
                          match: UIMatch<HttpTypes.AdminCampaignResponse>
                        ) => <Breadcrumb {...match} />,
                      },
                    }
                  },
                  children: [
                    {
                      path: "edit",
                      lazy: () =>
                        import("../../routes/campaigns/campaign-edit"),
                    },
                    {
                      path: "configuration",
                      lazy: () =>
                        import("../../routes/campaigns/campaign-configuration"),
                    },
                    {
                      path: "edit-budget",
                      lazy: () =>
                        import("../../routes/campaigns/campaign-budget-edit"),
                    },
                    {
                      path: "add-promotions",
                      lazy: () =>
                        import(
                          "../../routes/campaigns/add-campaign-promotions"
                        ),
                    },
                  ],
                },
              ],
            },
            {
              path: "/collections",
              errorElement: <ErrorBoundary />,
              handle: {
                breadcrumb: () => t("collections.domain"),
              },
              children: [
                {
                  path: "",
                  lazy: () =>
                    import("../../routes/collections/collection-list"),
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
                  lazy: async () => {
                    const { Component, Breadcrumb, loader } = await import(
                      "../../routes/collections/collection-detail"
                    )

                    return {
                      Component,
                      loader,
                      handle: {
                        breadcrumb: (
                          match: UIMatch<HttpTypes.AdminCollectionResponse>
                        ) => <Breadcrumb {...match} />,
                      },
                    }
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
                    {
                      path: "metadata/edit",
                      lazy: () =>
                        import("../../routes/collections/collection-metadata"),
                    },
                  ],
                },
              ],
            },
            {
              path: "/price-lists",
              errorElement: <ErrorBoundary />,
              handle: {
                breadcrumb: () => t("priceLists.domain"),
              },
              children: [
                {
                  path: "",
                  lazy: () =>
                    import("../../routes/price-lists/price-list-list"),
                  children: [
                    {
                      path: "create",
                      lazy: () =>
                        import("../../routes/price-lists/price-list-create"),
                    },
                  ],
                },
                {
                  path: ":id",
                  lazy: async () => {
                    const { Component, Breadcrumb, loader } = await import(
                      "../../routes/price-lists/price-list-detail"
                    )

                    return {
                      Component,
                      loader,
                      handle: {
                        breadcrumb: (
                          match: UIMatch<HttpTypes.AdminPriceListResponse>
                        ) => <Breadcrumb {...match} />,
                      },
                    }
                  },
                  children: [
                    {
                      path: "edit",
                      lazy: () =>
                        import("../../routes/price-lists/price-list-edit"),
                    },
                    {
                      path: "configuration",
                      lazy: () =>
                        import(
                          "../../routes/price-lists/price-list-configuration"
                        ),
                    },
                    {
                      path: "products/add",
                      lazy: () =>
                        import(
                          "../../routes/price-lists/price-list-prices-add"
                        ),
                    },
                    {
                      path: "products/edit",
                      lazy: () =>
                        import(
                          "../../routes/price-lists/price-list-prices-edit"
                        ),
                    },
                  ],
                },
              ],
            },
            {
              path: "/customers",
              errorElement: <ErrorBoundary />,
              handle: {
                breadcrumb: () => t("customers.domain"),
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
                  lazy: async () => {
                    const { Component, Breadcrumb, loader } = await import(
                      "../../routes/customers/customer-detail"
                    )

                    return {
                      Component,
                      loader,
                      handle: {
                        breadcrumb: (
                          match: UIMatch<HttpTypes.AdminCustomerResponse>
                        ) => <Breadcrumb {...match} />,
                      },
                    }
                  },
                  children: [
                    {
                      path: "edit",
                      lazy: () =>
                        import("../../routes/customers/customer-edit"),
                    },
                    {
                      path: "create-address",
                      lazy: () =>
                        import(
                          "../../routes/customers/customer-create-address"
                        ),
                    },
                    {
                      path: "add-customer-groups",
                      lazy: () =>
                        import(
                          "../../routes/customers/customers-add-customer-group"
                        ),
                    },
                    {
                      path: ":order_id/transfer",
                      lazy: () =>
                        import("../../routes/orders/order-request-transfer"),
                    },
                    {
                      path: "metadata/edit",
                      lazy: () =>
                        import("../../routes/customers/customer-metadata"),
                    },
                  ],
                },
              ],
            },
            {
              path: "/customer-groups",
              errorElement: <ErrorBoundary />,
              handle: {
                breadcrumb: () => t("customerGroups.domain"),
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
                  lazy: async () => {
                    const { Component, Breadcrumb, loader } = await import(
                      "../../routes/customer-groups/customer-group-detail"
                    )

                    return {
                      Component,
                      loader,
                      handle: {
                        breadcrumb: (
                          match: UIMatch<HttpTypes.AdminCustomerGroupResponse>
                        ) => <Breadcrumb {...match} />,
                      },
                    }
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
                    {
                      path: "metadata/edit",
                      lazy: () =>
                        import(
                          "../../routes/customer-groups/customer-group-metadata"
                        ),
                    },
                  ],
                },
              ],
            },
            {
              path: "/reservations",
              errorElement: <ErrorBoundary />,
              handle: {
                breadcrumb: () => t("reservations.domain"),
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
                        import("../../routes/reservations/reservation-create"),
                    },
                  ],
                },
                {
                  path: ":id",
                  lazy: async () => {
                    const { Component, Breadcrumb, loader } = await import(
                      "../../routes/reservations/reservation-detail"
                    )

                    return {
                      Component,
                      loader,
                      handle: {
                        breadcrumb: (
                          match: UIMatch<HttpTypes.AdminReservationResponse>
                        ) => <Breadcrumb {...match} />,
                      },
                    }
                  },
                  children: [
                    {
                      path: "edit",
                      lazy: () =>
                        import(
                          "../../routes/reservations/reservation-detail/components/edit-reservation"
                        ),
                    },
                    {
                      path: "metadata/edit",
                      lazy: () =>
                        import(
                          "../../routes/reservations/reservation-metadata"
                        ),
                    },
                  ],
                },
              ],
            },
            {
              path: "/inventory",
              errorElement: <ErrorBoundary />,
              handle: {
                breadcrumb: () => t("inventory.domain"),
              },
              children: [
                {
                  path: "",
                  lazy: () => import("../../routes/inventory/inventory-list"),
                  children: [
                    {
                      path: "create",
                      lazy: () =>
                        import("../../routes/inventory/inventory-create"),
                    },
                    {
                      path: "stock",
                      lazy: () =>
                        import("../../routes/inventory/inventory-stock"),
                    },
                  ],
                },
                {
                  path: ":id",
                  lazy: async () => {
                    const { Component, Breadcrumb, loader } = await import(
                      "../../routes/inventory/inventory-detail"
                    )

                    return {
                      Component,
                      loader,
                      handle: {
                        breadcrumb: (
                          match: UIMatch<HttpTypes.AdminInventoryItemResponse>
                        ) => <Breadcrumb {...match} />,
                      },
                    }
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
                      path: "metadata/edit",
                      lazy: () =>
                        import("../../routes/inventory/inventory-metadata"),
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
                  ],
                },
              ],
            },
            ...coreRoutes,
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
          handle: {
            breadcrumb: () => t("app.nav.settings.header"),
          },
          element: <SettingsLayout />,
          children: [
            {
              index: true,
              errorElement: <ErrorBoundary />,
              lazy: () => import("../../routes/settings"),
            },
            {
              path: "profile",
              errorElement: <ErrorBoundary />,
              lazy: () => import("../../routes/profile/profile-detail"),
              handle: {
                breadcrumb: () => t("profile.domain"),
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
              errorElement: <ErrorBoundary />,
              element: <Outlet />,
              handle: {
                breadcrumb: () => t("regions.domain"),
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
                  lazy: async () => {
                    const { Component, Breadcrumb, loader } = await import(
                      "../../routes/regions/region-detail"
                    )

                    return {
                      Component,
                      loader,
                      handle: {
                        breadcrumb: (
                          match: UIMatch<HttpTypes.AdminRegionResponse>
                        ) => <Breadcrumb {...match} />,
                      },
                    }
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
                      path: "metadata/edit",
                      lazy: () =>
                        import("../../routes/regions/region-metadata"),
                    },
                  ],
                },
              ],
            },
            {
              path: "store",
              errorElement: <ErrorBoundary />,
              lazy: () => import("../../routes/store/store-detail"),
              handle: {
                breadcrumb: () => t("store.domain"),
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
                {
                  path: "locales",
                  lazy: () => import("../../routes/store/store-add-locales"),
                },
                {
                  path: "metadata/edit",
                  lazy: () => import("../../routes/store/store-metadata"),
                },
              ],
            },
            {
              path: "users",
              errorElement: <ErrorBoundary />,
              element: <Outlet />,
              handle: {
                breadcrumb: () => t("users.domain"),
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
                  lazy: async () => {
                    const { Component, Breadcrumb, loader } = await import(
                      "../../routes/users/user-detail"
                    )

                    return {
                      Component,
                      loader,
                      handle: {
                        breadcrumb: (
                          match: UIMatch<HttpTypes.AdminUserResponse>
                        ) => <Breadcrumb {...match} />,
                      },
                    }
                  },
                  children: [
                    {
                      path: "edit",
                      lazy: () => import("../../routes/users/user-edit"),
                    },
                    {
                      path: "metadata/edit",
                      lazy: () => import("../../routes/users/user-metadata"),
                    },
                  ],
                },
              ],
            },
            {
              path: "sales-channels",
              errorElement: <ErrorBoundary />,
              element: <Outlet />,
              handle: {
                breadcrumb: () => t("salesChannels.domain"),
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
                  lazy: async () => {
                    const { Component, Breadcrumb, loader } = await import(
                      "../../routes/sales-channels/sales-channel-detail"
                    )

                    return {
                      Component,
                      loader,
                      handle: {
                        breadcrumb: (
                          match: UIMatch<HttpTypes.AdminSalesChannelResponse>
                        ) => <Breadcrumb {...match} />,
                      },
                    }
                  },
                  children: [
                    {
                      path: "edit",
                      lazy: () =>
                        import(
                          "../../routes/sales-channels/sales-channel-edit"
                        ),
                    },
                    {
                      path: "add-products",
                      lazy: () =>
                        import(
                          "../../routes/sales-channels/sales-channel-add-products"
                        ),
                    },
                    {
                      path: "metadata/edit",
                      lazy: () =>
                        import(
                          "../../routes/sales-channels/sales-channel-metadata"
                        ),
                    },
                  ],
                },
              ],
            },
            {
              path: "locations",
              errorElement: <ErrorBoundary />,
              element: <Outlet />,
              handle: {
                breadcrumb: () => t("locations.domain"),
              },
              children: [
                {
                  path: "",
                  lazy: () => import("../../routes/locations/location-list"),
                },
                {
                  path: "create",
                  lazy: () => import("../../routes/locations/location-create"),
                },
                {
                  path: "shipping-profiles",
                  element: <Outlet />,
                  handle: {
                    breadcrumb: () => t("shippingProfile.domain"),
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
                      path: ":shipping_profile_id",
                      lazy: async () => {
                        const { Component, Breadcrumb, loader } = await import(
                          "../../routes/shipping-profiles/shipping-profile-detail"
                        )

                        return {
                          Component,
                          loader,
                          handle: {
                            breadcrumb: (
                              // eslint-disable-next-line max-len
                              match: UIMatch<HttpTypes.AdminShippingProfileResponse>
                            ) => <Breadcrumb {...match} />,
                          },
                        }
                      },
                      children: [
                        {
                          path: "metadata/edit",
                          lazy: () =>
                            import(
                              "../../routes/shipping-profiles/shipping-profile-metadata"
                            ),
                        },
                      ],
                    },
                  ],
                },
                {
                  path: "shipping-option-types",
                  errorElement: <ErrorBoundary />,
                  element: <Outlet />,
                  handle: {
                    breadcrumb: () => t("shippingOptionTypes.domain"),
                  },
                  children: [
                    {
                      path: "",
                      lazy: () =>
                        import(
                          "../../routes/shipping-option-types/shipping-option-type-list"
                        ),
                      children: [
                        {
                          path: "create",
                          lazy: () =>
                            import(
                              "../../routes/shipping-option-types/shipping-option-type-create"
                            ),
                        },
                      ],
                    },
                    {
                      path: ":id",
                      lazy: async () => {
                        const { Component, Breadcrumb, loader } = await import(
                          "../../routes/shipping-option-types/shipping-option-type-detail"
                        )

                        return {
                          Component,
                          loader,
                          handle: {
                            breadcrumb: (
                              // eslint-disable-next-line max-len
                              match: UIMatch<HttpTypes.AdminShippingOptionTypeResponse>
                            ) => <Breadcrumb {...match} />,
                          },
                        }
                      },
                      children: [
                        {
                          path: "edit",
                          lazy: () =>
                            import(
                              "../../routes/shipping-option-types/shipping-option-type-edit"
                            ),
                        },
                      ],
                    },
                  ],
                },
                {
                  path: ":location_id",
                  lazy: async () => {
                    const { Component, Breadcrumb, loader } = await import(
                      "../../routes/locations/location-detail"
                    )

                    return {
                      Component,
                      loader,
                      handle: {
                        breadcrumb: (
                          match: UIMatch<HttpTypes.AdminStockLocationResponse>
                        ) => <Breadcrumb {...match} />,
                      },
                    }
                  },
                  children: [
                    {
                      path: "edit",
                      lazy: () =>
                        import("../../routes/locations/location-edit"),
                    },
                    {
                      path: "sales-channels",
                      lazy: () =>
                        import(
                          "../../routes/locations/location-sales-channels"
                        ),
                    },
                    {
                      path: "fulfillment-providers",
                      lazy: () =>
                        import(
                          "../../routes/locations/location-fulfillment-providers"
                        ),
                    },
                    {
                      path: "fulfillment-set/:fset_id",
                      children: [
                        {
                          path: "service-zones/create",
                          lazy: () =>
                            import(
                              "../../routes/locations/location-service-zone-create"
                            ),
                        },
                        {
                          path: "service-zone/:zone_id",
                          children: [
                            {
                              path: "edit",
                              lazy: () =>
                                import(
                                  "../../routes/locations/location-service-zone-edit"
                                ),
                            },
                            {
                              path: "areas",
                              lazy: () =>
                                import(
                                  "../../routes/locations/location-service-zone-manage-areas"
                                ),
                            },
                            {
                              path: "shipping-option",
                              children: [
                                {
                                  path: "create",
                                  lazy: () =>
                                    import(
                                      "../../routes/locations/location-service-zone-shipping-option-create"
                                    ),
                                },
                                {
                                  path: ":so_id",
                                  children: [
                                    {
                                      path: "edit",
                                      lazy: () =>
                                        import(
                                          "../../routes/locations/location-service-zone-shipping-option-edit"
                                        ),
                                    },
                                    {
                                      path: "pricing",
                                      lazy: () =>
                                        import(
                                          "../../routes/locations/location-service-zone-shipping-option-pricing"
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
              path: "product-tags",
              errorElement: <ErrorBoundary />,
              element: <Outlet />,
              handle: {
                breadcrumb: () => t("productTags.domain"),
              },
              children: [
                {
                  path: "",
                  lazy: () =>
                    import("../../routes/product-tags/product-tag-list"),
                  children: [
                    {
                      path: "create",
                      lazy: () =>
                        import("../../routes/product-tags/product-tag-create"),
                    },
                  ],
                },
                {
                  path: ":id",
                  lazy: async () => {
                    const { Component, Breadcrumb, loader } = await import(
                      "../../routes/product-tags/product-tag-detail"
                    )

                    return {
                      Component,
                      loader,
                      handle: {
                        breadcrumb: (
                          match: UIMatch<HttpTypes.AdminProductTagResponse>
                        ) => <Breadcrumb {...match} />,
                      },
                    }
                  },
                  children: [
                    {
                      path: "edit",
                      lazy: () =>
                        import("../../routes/product-tags/product-tag-edit"),
                    },
                    {
                      path: "metadata/edit",
                      lazy: () =>
                        import(
                          "../../routes/product-tags/product-tag-metadata"
                        ),
                    },
                  ],
                },
              ],
            },
            {
              path: "workflows",
              errorElement: <ErrorBoundary />,
              element: <Outlet />,
              handle: {
                breadcrumb: () => t("workflowExecutions.domain"),
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
                  lazy: async () => {
                    const { Component, Breadcrumb, loader } = await import(
                      "../../routes/workflow-executions/workflow-execution-detail"
                    )

                    return {
                      Component,
                      loader,
                      handle: {
                        breadcrumb: (
                          // eslint-disable-next-line max-len
                          match: UIMatch<HttpTypes.AdminWorkflowExecutionResponse>
                        ) => <Breadcrumb {...match} />,
                      },
                    }
                  },
                },
              ],
            },
            {
              path: "product-types",
              errorElement: <ErrorBoundary />,
              element: <Outlet />,
              handle: {
                breadcrumb: () => t("productTypes.domain"),
              },
              children: [
                {
                  path: "",
                  lazy: () =>
                    import("../../routes/product-types/product-type-list"),
                  children: [
                    {
                      path: "create",
                      lazy: () =>
                        import(
                          "../../routes/product-types/product-type-create"
                        ),
                    },
                  ],
                },
                {
                  path: ":id",
                  lazy: async () => {
                    const { Component, Breadcrumb, loader } = await import(
                      "../../routes/product-types/product-type-detail"
                    )

                    return {
                      Component,
                      loader,
                      handle: {
                        breadcrumb: (
                          match: UIMatch<HttpTypes.AdminProductTypeResponse>
                        ) => <Breadcrumb {...match} />,
                      },
                    }
                  },
                  children: [
                    {
                      path: "edit",
                      lazy: () =>
                        import("../../routes/product-types/product-type-edit"),
                    },
                    {
                      path: "metadata/edit",
                      lazy: () =>
                        import(
                          "../../routes/product-types/product-type-metadata"
                        ),
                    },
                  ],
                },
              ],
            },
            {
              path: "publishable-api-keys",
              element: <Outlet />,
              handle: {
                breadcrumb: () => t("apiKeyManagement.domain.publishable"),
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
                  lazy: async () => {
                    const { Component, Breadcrumb, loader } = await import(
                      "../../routes/api-key-management/api-key-management-detail"
                    )

                    return {
                      Component,
                      loader,
                      handle: {
                        breadcrumb: (
                          match: UIMatch<HttpTypes.AdminApiKeyResponse>
                        ) => <Breadcrumb {...match} />,
                      },
                    }
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
                breadcrumb: () => t("apiKeyManagement.domain.secret"),
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
                  lazy: async () => {
                    const { Component, Breadcrumb, loader } = await import(
                      "../../routes/api-key-management/api-key-management-detail"
                    )

                    return {
                      Component,
                      loader,
                      handle: {
                        breadcrumb: (
                          match: UIMatch<HttpTypes.AdminApiKeyResponse>
                        ) => <Breadcrumb {...match} />,
                      },
                    }
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
              path: "tax-regions",
              element: <Outlet />,
              handle: {
                breadcrumb: () => t("taxRegions.domain"),
              },
              children: [
                {
                  path: "",
                  lazy: () =>
                    import("../../routes/tax-regions/tax-region-list"),
                  children: [
                    {
                      path: "create",
                      lazy: () =>
                        import("../../routes/tax-regions/tax-region-create"),
                    },
                  ],
                },
                {
                  path: ":id",
                  Component: Outlet,
                  loader: taxRegionLoader,
                  handle: {
                    breadcrumb: (
                      match: UIMatch<HttpTypes.AdminTaxRegionResponse>
                    ) => <TaxRegionDetailBreadcrumb {...match} />,
                  },
                  children: [
                    {
                      path: "",
                      lazy: async () => {
                        const { Component } = await import(
                          "../../routes/tax-regions/tax-region-detail"
                        )

                        return {
                          Component,
                        }
                      },
                      children: [
                        {
                          path: "edit",
                          lazy: () =>
                            import("../../routes/tax-regions/tax-region-edit"),
                        },
                        {
                          path: "provinces/create",
                          lazy: () =>
                            import(
                              "../../routes/tax-regions/tax-region-province-create"
                            ),
                        },
                        {
                          path: "overrides/create",
                          lazy: () =>
                            import(
                              "../../routes/tax-regions/tax-region-tax-override-create"
                            ),
                        },
                        {
                          path: "overrides/:tax_rate_id/edit",
                          lazy: () =>
                            import(
                              "../../routes/tax-regions/tax-region-tax-override-edit"
                            ),
                        },
                        {
                          path: "tax-rates/create",
                          lazy: () =>
                            import(
                              "../../routes/tax-regions/tax-region-tax-rate-create"
                            ),
                        },
                        {
                          path: "tax-rates/:tax_rate_id/edit",
                          lazy: () =>
                            import(
                              "../../routes/tax-regions/tax-region-tax-rate-edit"
                            ),
                        },
                      ],
                    },
                    {
                      path: "provinces/:province_id",
                      lazy: async () => {
                        const { Component, Breadcrumb, loader } = await import(
                          "../../routes/tax-regions/tax-region-province-detail"
                        )

                        return {
                          Component,
                          loader,
                          handle: {
                            breadcrumb: (
                              match: UIMatch<HttpTypes.AdminTaxRegionResponse>
                            ) => <Breadcrumb {...match} />,
                          },
                        }
                      },
                      children: [
                        {
                          path: "tax-rates/create",
                          lazy: () =>
                            import(
                              "../../routes/tax-regions/tax-region-tax-rate-create"
                            ),
                        },
                        {
                          path: "tax-rates/:tax_rate_id/edit",
                          lazy: () =>
                            import(
                              "../../routes/tax-regions/tax-region-tax-rate-edit"
                            ),
                        },
                        {
                          path: "overrides/create",
                          lazy: () =>
                            import(
                              "../../routes/tax-regions/tax-region-tax-override-create"
                            ),
                        },
                        {
                          path: "overrides/:tax_rate_id/edit",
                          lazy: () =>
                            import(
                              "../../routes/tax-regions/tax-region-tax-override-edit"
                            ),
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              path: "return-reasons",
              element: <Outlet />,
              handle: {
                breadcrumb: () => t("returnReasons.domain"),
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
                      path: ":id",
                      children: [
                        {
                          path: "edit",
                          lazy: () =>
                            import(
                              "../../routes/return-reasons/return-reason-edit"
                            ),
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              path: "refund-reasons",
              element: <Outlet />,
              handle: {
                breadcrumb: () => t("refundReasons.domain"),
              },
              children: [
                {
                  path: "",
                  lazy: () =>
                    import("../../routes/refund-reasons/refund-reason-list"),
                  children: [
                    {
                      path: "create",
                      lazy: () =>
                        import(
                          "../../routes/refund-reasons/refund-reason-create"
                        ),
                    },

                    {
                      path: ":id",
                      children: [
                        {
                          path: "edit",
                          lazy: () =>
                            import(
                              "../../routes/refund-reasons/refund-reason-edit"
                            ),
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              path: "translations",
              errorElement: <ErrorBoundary />,
              handle: {
                breadcrumb: () => t("translations.domain"),
              },
              children: [
                {
                  path: "",
                  lazy: () =>
                    import("../../routes/translations/translation-list"),
                  children: [
                    {
                      path: "settings",
                      lazy: () => import("../../routes/translations/settings"),
                    },
                  ],
                },
                {
                  path: "edit",
                  lazy: () =>
                    import("../../routes/translations/translations-edit"),
                },
                {
                  path: "add-locales",
                  lazy: () => import("../../routes/translations/add-locales"),
                },
              ],
            },
            ...(settingsRoutes.flatMap(r => r?.children || [])),
          ],
        },
      ],
    },
    {
      element: <PublicLayout />,
      children: [
        {
          errorElement: <ErrorBoundary />,
          children: [
            {
              path: "/login",
              lazy: () => import("../../routes/login"),
            },
            {
              path: "/reset-password",
              lazy: () => import("../../routes/reset-password"),
            },
            {
              path: "/invite",
              lazy: () => import("../../routes/invite"),
            },
            {
              path: "*",
              lazy: () => import("../../routes/no-match"),
            },
          ],
        },
      ],
    },
  ]
}
