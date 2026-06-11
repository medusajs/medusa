import { HttpTypes } from "@medusajs/types"
import { t } from "i18next"
import { Outlet, RouteObject, UIMatch } from "react-router-dom"
import { ProtectedRoute } from "../../components/authentication/protected-route"
import { RoutePermissionGuard } from "../../components/authentication/route-permission-guard"
import { MainLayout } from "../../components/layout/main-layout"
import { PublicLayout } from "../../components/layout/public-layout"
import { SettingsLayout } from "../../components/layout/settings-layout"
import { ErrorBoundary } from "../../components/utilities/error-boundary"
import { TaxRegionDetailBreadcrumb } from "../../routes/tax-regions/tax-region-detail/breadcrumb"
import { taxRegionLoader } from "../../routes/tax-regions/tax-region-detail/loader"
import { PermissionsRequirementsProvider } from "../../providers/permissions-provider"

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
              element: (
                <PermissionsRequirementsProvider>
                  <RoutePermissionGuard />
                </PermissionsRequirementsProvider>
              ),
              handle: {
                breadcrumb: () => t("products.domain"),
                permissions: "product:read",
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
                      handle: { permissions: "product:create" },
                    },
                    {
                      path: "import",
                      lazy: () =>
                        import("../../routes/products/product-import"),
                      handle: { permissions: "product:create" },
                    },
                    {
                      path: "export",
                      lazy: () =>
                        import("../../routes/products/product-export"),
                      handle: { permissions: "product:read" },
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
                          handle: { permissions: "product:update" },
                        },
                        {
                          path: "edit-variant",
                          lazy: () =>
                            import(
                              "../../routes/product-variants/product-variant-edit"
                            ),
                          handle: {
                            permissions: [
                              "product:update",
                              "product_variant:update",
                            ],
                          },
                        },
                        {
                          path: "sales-channels",
                          lazy: () =>
                            import(
                              "../../routes/products/product-sales-channels"
                            ),
                          handle: { permissions: "product:update" },
                        },
                        {
                          path: "attributes",
                          lazy: () =>
                            import("../../routes/products/product-attributes"),
                          handle: { permissions: "product:update" },
                        },
                        {
                          path: "organization",
                          lazy: () =>
                            import(
                              "../../routes/products/product-organization"
                            ),
                          handle: { permissions: "product:update" },
                        },
                        {
                          path: "shipping-profile",
                          lazy: () =>
                            import(
                              "../../routes/products/product-shipping-profile"
                            ),
                          handle: { permissions: "product:update" },
                        },
                        {
                          path: "media",
                          lazy: () =>
                            import("../../routes/products/product-media"),
                          handle: { permissions: "product:update" },
                        },
                        {
                          path: "images/:image_id/variants",
                          lazy: () =>
                            import(
                              "../../routes/products/product-image-variants-edit"
                            ),
                          handle: {
                            permissions: [
                              "product:update",
                              "product_variant:update",
                            ],
                          },
                        },
                        {
                          path: "prices",
                          lazy: () =>
                            import("../../routes/products/product-prices"),
                          handle: {
                            permissions: [
                              "product:update",
                              "product_variant:update",
                              "price:update",
                            ],
                          },
                        },
                        {
                          path: "options/create",
                          lazy: () =>
                            import(
                              "../../routes/products/product-create-option"
                            ),
                          handle: {
                            permissions: [
                              "product:update",
                              "product_option:create",
                            ],
                          },
                        },
                        {
                          path: "options/:option_id/edit",
                          lazy: () =>
                            import("../../routes/products/product-edit-option"),
                          handle: {
                            permissions: [
                              "product:update",
                              "product_option:update",
                            ],
                          },
                        },
                        {
                          path: "variants/create",
                          lazy: () =>
                            import(
                              "../../routes/products/product-create-variant"
                            ),
                          handle: {
                            permissions: [
                              "product:update",
                              "product_variant:create",
                            ],
                          },
                        },
                        {
                          path: "stock",
                          lazy: () =>
                            import("../../routes/products/product-stock"),
                          handle: {
                            permissions: [
                              "product:update",
                              "product_variant:update",
                              "inventory_level:update",
                            ],
                          },
                        },
                        {
                          path: "metadata/edit",
                          lazy: () =>
                            import("../../routes/products/product-metadata"),
                          handle: { permissions: "product:update" },
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
                            permissions: [
                              "product:read",
                              "product_variant:read",
                            ],
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
                          handle: {
                            permissions: [
                              "product:update",
                              "product_variant:update",
                            ],
                          },
                        },
                        {
                          path: "prices",
                          lazy: () =>
                            import("../../routes/products/product-prices"),
                          handle: {
                            permissions: [
                              "product:update",
                              "product_variant:update",
                              "price:update",
                            ],
                          },
                        },
                        {
                          path: "manage-items",
                          lazy: () =>
                            import(
                              "../../routes/product-variants/product-variant-manage-inventory-items"
                            ),
                          handle: {
                            permissions: [
                              "product:update",
                              "product_variant:update",
                              "inventory_level:update",
                            ],
                          },
                        },
                        {
                          path: "media",
                          lazy: () =>
                            import(
                              "../../routes/product-variants/product-variant-media"
                            ),
                          handle: {
                            permissions: [
                              "product:update",
                              "product_variant:update",
                            ],
                          },
                        },
                        {
                          path: "metadata/edit",
                          lazy: () =>
                            import(
                              "../../routes/product-variants/product-variant-metadata"
                            ),
                          handle: {
                            permissions: [
                              "product:update",
                              "product_variant:update",
                            ],
                          },
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
              element: (
                <PermissionsRequirementsProvider>
                  <RoutePermissionGuard />
                </PermissionsRequirementsProvider>
              ),
              handle: {
                breadcrumb: () => t("categories.domain"),
                permissions: "product_category:read",
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
                      handle: { permissions: "product_category:create" },
                    },
                    {
                      path: "organize",
                      lazy: () =>
                        import("../../routes/categories/category-organize"),
                      handle: { permissions: "product_category:update" },
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
                      handle: { permissions: "product_category:update" },
                    },
                    {
                      path: "products",
                      lazy: () =>
                        import("../../routes/categories/category-products"),
                      handle: {
                        permissions: [
                          "product:update",
                          "product_category:update",
                        ],
                      },
                    },
                    {
                      path: "organize",
                      lazy: () =>
                        import("../../routes/categories/category-organize"),
                      handle: { permissions: "product_category:update" },
                    },
                    {
                      path: "metadata/edit",
                      lazy: () =>
                        import("../../routes/categories/categories-metadata"),
                      handle: { permissions: "product_category:update" },
                    },
                  ],
                },
              ],
            },
            {
              path: "/orders",
              errorElement: <ErrorBoundary />,
              element: (
                <PermissionsRequirementsProvider>
                  <RoutePermissionGuard />
                </PermissionsRequirementsProvider>
              ),
              handle: {
                breadcrumb: () => t("orders.domain"),
                permissions: "order:read",
              },
              children: [
                {
                  path: "",
                  lazy: () => import("../../routes/orders/order-list"),
                  children: [
                    {
                      path: "export",
                      lazy: () => import("../../routes/orders/order-export"),
                      handle: { permissions: "order:read" },
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
                      handle: {
                        permissions: ["order:update", "fulfillment:create"],
                      },
                    },
                    {
                      path: "returns/:return_id/receive",
                      lazy: () =>
                        import("../../routes/orders/order-receive-return"),
                      handle: {
                        permissions: ["return:update"],
                      },
                    },
                    {
                      path: "allocate-items",
                      lazy: () =>
                        import("../../routes/orders/order-allocate-items"),
                      handle: {
                        permissions: ["reservation_item:create"],
                      },
                    },
                    {
                      path: ":f_id/create-shipment",
                      lazy: () =>
                        import("../../routes/orders/order-create-shipment"),
                      handle: {
                        permissions: ["order:update", "fulfillment:update"],
                      },
                    },
                    {
                      path: "returns",
                      lazy: () =>
                        import("../../routes/orders/order-create-return"),
                      handle: {
                        permissions: ["return:create", "return:update"],
                      },
                    },
                    {
                      path: "claims",
                      lazy: () =>
                        import("../../routes/orders/order-create-claim"),
                      handle: {
                        permissions: [
                          "order_claim:create",
                          "order_claim:update",
                        ],
                      },
                    },
                    {
                      path: "exchanges",
                      lazy: () =>
                        import("../../routes/orders/order-create-exchange"),
                      handle: {
                        permissions: [
                          "order_exchange:create",
                          "order_exchange:update",
                        ],
                      },
                    },
                    {
                      path: "edits",
                      lazy: () =>
                        import("../../routes/orders/order-create-edit"),
                      handle: {
                        permissions: [
                          "order_change:create",
                          "order_change:update",
                        ],
                      },
                    },
                    {
                      path: "refund",
                      lazy: () =>
                        import("../../routes/orders/order-create-refund"),
                      handle: {
                        permissions: ["order:update", "refund:create"],
                      },
                    },
                    {
                      path: "transfer",
                      lazy: () =>
                        import("../../routes/orders/order-request-transfer"),
                      handle: {
                        permissions: ["customer:update", "order:update"],
                      },
                    },
                    {
                      path: "email",
                      lazy: () =>
                        import("../../routes/orders/order-edit-email"),
                      handle: {
                        permissions: ["order:update"],
                      },
                    },
                    {
                      path: "shipping-address",
                      lazy: () =>
                        import(
                          "../../routes/orders/order-edit-shipping-address"
                        ),
                      handle: {
                        permissions: ["order_address:update", "order:update"],
                      },
                    },
                    {
                      path: "billing-address",
                      lazy: () =>
                        import(
                          "../../routes/orders/order-edit-billing-address"
                        ),
                      handle: {
                        permissions: ["order_address:update", "order:update"],
                      },
                    },
                    {
                      path: "metadata/edit",
                      lazy: () => import("../../routes/orders/order-metadata"),
                      handle: { permissions: "order:update" },
                    },
                  ],
                },
              ],
            },
            {
              path: "/promotions",
              errorElement: <ErrorBoundary />,
              element: (
                <PermissionsRequirementsProvider>
                  <RoutePermissionGuard />
                </PermissionsRequirementsProvider>
              ),
              handle: {
                breadcrumb: () => t("promotions.domain"),
                permissions: "promotion:read",
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
                  handle: { permissions: "promotion:create" },
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
                      handle: { permissions: "promotion:update" },
                    },
                    {
                      path: "add-to-campaign",
                      lazy: () =>
                        import(
                          "../../routes/promotions/promotion-add-campaign"
                        ),
                      handle: {
                        permissions: [
                          "promotion:update",
                          "campaign:read",
                          "campaign:update",
                        ],
                      },
                    },
                    {
                      path: ":ruleType/edit",
                      lazy: () =>
                        import("../../routes/promotions/common/edit-rules"),
                      handle: { permissions: "promotion:update" },
                    },
                  ],
                },
              ],
            },
            {
              path: "/campaigns",
              errorElement: <ErrorBoundary />,
              element: (
                <PermissionsRequirementsProvider>
                  <RoutePermissionGuard />
                </PermissionsRequirementsProvider>
              ),
              handle: {
                breadcrumb: () => t("campaigns.domain"),
                permissions: "campaign:read",
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
                  handle: { permissions: "campaign:create" },
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
                      handle: { permissions: "campaign:update" },
                    },
                    {
                      path: "configuration",
                      lazy: () =>
                        import("../../routes/campaigns/campaign-configuration"),
                      handle: { permissions: "campaign:update" },
                    },
                    {
                      path: "edit-budget",
                      lazy: () =>
                        import("../../routes/campaigns/campaign-budget-edit"),
                      handle: { permissions: "campaign:update" },
                    },
                    {
                      path: "add-promotions",
                      lazy: () =>
                        import(
                          "../../routes/campaigns/add-campaign-promotions"
                        ),
                      handle: {
                        permissions: [
                          "campaign:update",
                          "prmotion:read",
                          "promotion:update",
                        ],
                      },
                    },
                  ],
                },
              ],
            },
            {
              path: "/collections",
              errorElement: <ErrorBoundary />,
              element: (
                <PermissionsRequirementsProvider>
                  <RoutePermissionGuard />
                </PermissionsRequirementsProvider>
              ),
              handle: {
                breadcrumb: () => t("collections.domain"),
                permissions: "product_collection:read",
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
                      handle: { permissions: "product_collection:create" },
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
                      handle: { permissions: "product_collection:update" },
                    },
                    {
                      path: "products",
                      lazy: () =>
                        import(
                          "../../routes/collections/collection-add-products"
                        ),
                      handle: {
                        permissions: [
                          "product:read",
                          "product:update",
                          "product_collection:update",
                        ],
                      },
                    },
                    {
                      path: "metadata/edit",
                      lazy: () =>
                        import("../../routes/collections/collection-metadata"),
                      handle: { permissions: "product_collection:update" },
                    },
                  ],
                },
              ],
            },
            {
              path: "/price-lists",
              errorElement: <ErrorBoundary />,
              element: (
                <PermissionsRequirementsProvider>
                  <RoutePermissionGuard />
                </PermissionsRequirementsProvider>
              ),
              handle: {
                breadcrumb: () => t("priceLists.domain"),
                permissions: "price_list:read",
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
                      handle: {
                        permissions: ["price_list:create", "product:read"],
                      },
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
                      handle: { permissions: "price_list:update" },
                    },
                    {
                      path: "configuration",
                      lazy: () =>
                        import(
                          "../../routes/price-lists/price-list-configuration"
                        ),
                      handle: { permissions: "price_list:update" },
                    },
                    {
                      path: "products/add",
                      lazy: () =>
                        import(
                          "../../routes/price-lists/price-list-prices-add"
                        ),
                      handle: {
                        permissions: ["price_list:update", "product:read"],
                      },
                    },
                    {
                      path: "products/edit",
                      lazy: () =>
                        import(
                          "../../routes/price-lists/price-list-prices-edit"
                        ),
                      handle: {
                        permissions: ["price_list:update", "product:read"],
                      },
                    },
                    {
                      path: "metadata/edit",
                      lazy: () =>
                        import("../../routes/price-lists/price-list-metadata"),
                      handle: { permissions: "price_list:update" },
                    },
                  ],
                },
              ],
            },
            {
              path: "/customers",
              errorElement: <ErrorBoundary />,
              element: (
                <PermissionsRequirementsProvider>
                  <RoutePermissionGuard />
                </PermissionsRequirementsProvider>
              ),
              handle: {
                breadcrumb: () => t("customers.domain"),
                permissions: "customer:read",
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
                      handle: { permissions: "customer:create" },
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
                      handle: { permissions: "customer:update" },
                    },
                    {
                      path: "create-address",
                      lazy: () =>
                        import(
                          "../../routes/customers/customer-create-address"
                        ),
                      handle: {
                        permissions: [
                          "customer:update",
                          "customer_address:create",
                        ],
                      },
                    },
                    {
                      path: "add-customer-groups",
                      lazy: () =>
                        import(
                          "../../routes/customers/customers-add-customer-group"
                        ),
                      handle: {
                        permissions: [
                          "customer:update",
                          "customer_group:update",
                        ],
                      },
                    },
                    {
                      path: ":order_id/transfer",
                      lazy: () =>
                        import("../../routes/orders/order-request-transfer"),
                      handle: {
                        permissions: ["customer:update", "order:update"],
                      },
                    },
                    {
                      path: "metadata/edit",
                      lazy: () =>
                        import("../../routes/customers/customer-metadata"),
                      handle: { permissions: "customer:update" },
                    },
                  ],
                },
              ],
            },
            {
              path: "/customer-groups",
              errorElement: <ErrorBoundary />,
              element: (
                <PermissionsRequirementsProvider>
                  <RoutePermissionGuard />
                </PermissionsRequirementsProvider>
              ),
              handle: {
                breadcrumb: () => t("customerGroups.domain"),
                permissions: "customer_group:read",
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
                      handle: { permissions: "customer_group:create" },
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
                      handle: { permissions: "customer_group:update" },
                    },
                    {
                      path: "add-customers",
                      lazy: () =>
                        import(
                          "../../routes/customer-groups/customer-group-add-customers"
                        ),
                      handle: {
                        permissions: [
                          "customer:read",
                          "customer:update",
                          "customer_group:update",
                        ],
                      },
                    },
                    {
                      path: "metadata/edit",
                      lazy: () =>
                        import(
                          "../../routes/customer-groups/customer-group-metadata"
                        ),
                      handle: { permissions: "customer_group:update" },
                    },
                  ],
                },
              ],
            },
            {
              path: "/reservations",
              errorElement: <ErrorBoundary />,
              element: (
                <PermissionsRequirementsProvider>
                  <RoutePermissionGuard />
                </PermissionsRequirementsProvider>
              ),
              handle: {
                breadcrumb: () => t("reservations.domain"),
                permissions: "reservation_item:read",
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
                      handle: {
                        permissions: [
                          "reservation_item:create",
                          "stock_location:read",
                        ],
                      },
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
                        permissions: [
                          "reservation_item:read",
                          "inventory_item:read",
                          "inventory_level:read",
                          "stock_location:read",
                        ],
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
                      handle: {
                        permissions: [
                          "reservation_item:read",
                          "inventory_item:read",
                          "inventory_level:read",
                          "stock_location:read",
                          "reservation_item:update",
                        ],
                      },
                    },
                    {
                      path: "metadata/edit",
                      lazy: () =>
                        import(
                          "../../routes/reservations/reservation-metadata"
                        ),
                      handle: { permissions: "reservation_item:update" },
                    },
                  ],
                },
              ],
            },
            {
              path: "/inventory",
              errorElement: <ErrorBoundary />,
              element: (
                <PermissionsRequirementsProvider>
                  <RoutePermissionGuard />
                </PermissionsRequirementsProvider>
              ),
              handle: {
                breadcrumb: () => t("inventory.domain"),
                permissions: "inventory_item:read",
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
                      handle: {
                        permissions: [
                          "inventory_item:create",
                          "inventory_level:read",
                        ],
                      },
                    },
                    {
                      path: "stock",
                      lazy: () =>
                        import("../../routes/inventory/inventory-stock"),
                      handle: {
                        permissions: [
                          "inventory_level:read",
                          "inventory_level:create",
                          "inventory_level:update",
                          "inventory_level:delete",
                        ],
                      },
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
                      handle: { permissions: "inventory_item:update" },
                    },
                    {
                      path: "attributes",
                      lazy: () =>
                        import(
                          "../../routes/inventory/inventory-detail/components/edit-inventory-item-attributes"
                        ),
                      handle: { permissions: "inventory_item:update" },
                    },
                    {
                      path: "metadata/edit",
                      lazy: () =>
                        import("../../routes/inventory/inventory-metadata"),
                      handle: { permissions: "inventory_item:update" },
                    },
                    {
                      path: "locations",
                      lazy: () =>
                        import(
                          "../../routes/inventory/inventory-detail/components/manage-locations"
                        ),
                      handle: {
                        permissions: [
                          "inventory_level:create",
                          "inventory_level:update",
                          "inventory_level:delete",
                        ],
                      },
                    },
                    {
                      path: "locations/:location_id",
                      lazy: () =>
                        import(
                          "../../routes/inventory/inventory-detail/components/adjust-inventory"
                        ),
                      handle: { permissions: "inventory_level:update" },
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
              element: (
                <PermissionsRequirementsProvider>
                  <RoutePermissionGuard />
                </PermissionsRequirementsProvider>
              ),
              handle: {
                breadcrumb: () => t("regions.domain"),
                permissions: "region:read",
              },
              children: [
                {
                  path: "",
                  lazy: () => import("../../routes/regions/region-list"),
                  children: [
                    {
                      path: "create",
                      lazy: () => import("../../routes/regions/region-create"),
                      handle: {
                        permissions: ["region:create", "currency:read"],
                      },
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
                      handle: { permissions: "region:update" },
                    },
                    {
                      path: "countries/add",
                      lazy: () =>
                        import("../../routes/regions/region-add-countries"),
                      handle: { permissions: "region:update" },
                    },
                    {
                      path: "metadata/edit",
                      lazy: () =>
                        import("../../routes/regions/region-metadata"),
                      handle: { permissions: "region:update" },
                    },
                  ],
                },
              ],
            },
            {
              path: "store",
              errorElement: <ErrorBoundary />,
              element: (
                <PermissionsRequirementsProvider>
                  <RoutePermissionGuard />
                </PermissionsRequirementsProvider>
              ),
              handle: {
                breadcrumb: () => t("store.domain"),
                permissions: "store:read",
              },
              children: [
                {
                  path: "",
                  lazy: () => import("../../routes/store/store-detail"),
                  children: [
                    {
                      path: "edit",
                      lazy: () => import("../../routes/store/store-edit"),
                      handle: { permissions: "store:update" },
                    },
                    {
                      path: "currencies",
                      lazy: () =>
                        import("../../routes/store/store-add-currencies"),
                      handle: {
                        permissions: ["store:update", "currency:read"],
                      },
                    },
                    {
                      path: "locales",
                      lazy: () =>
                        import("../../routes/store/store-add-locales"),
                      handle: { permissions: "store:update" },
                    },
                    {
                      path: "metadata/edit",
                      lazy: () => import("../../routes/store/store-metadata"),
                      handle: { permissions: "store:update" },
                    },
                  ],
                },
              ],
            },
            {
              path: "users",
              errorElement: <ErrorBoundary />,
              element: (
                <PermissionsRequirementsProvider>
                  <RoutePermissionGuard />
                </PermissionsRequirementsProvider>
              ),
              handle: {
                breadcrumb: () => t("users.domain"),
                permissions: "user:read",
              },
              children: [
                {
                  path: "",
                  lazy: () => import("../../routes/users/user-list"),
                  children: [
                    {
                      path: "invite",
                      element: <RoutePermissionGuard />,
                      handle: {
                        permissions: ["invite:create", "invite:read"],
                      },
                      children: [
                        {
                          path: "",
                          lazy: () => import("../../routes/users/user-invite"),
                        },
                      ],
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
                      handle: { permissions: "user:update" },
                    },
                    {
                      path: "metadata/edit",
                      lazy: () => import("../../routes/users/user-metadata"),
                      handle: { permissions: "user:update" },
                    },
                  ],
                },
              ],
            },
            {
              path: "roles",
              errorElement: <ErrorBoundary />,
              element: <RoutePermissionGuard />,
              handle: {
                breadcrumb: () => t("roles.domain"),
                permissions: "rbac_role:read",
              },
              children: [
                {
                  path: "",
                  lazy: () => import("../../routes/roles/role-list"),
                  children: [
                    {
                      path: "create",
                      element: <RoutePermissionGuard />,
                      handle: { permissions: "rbac_role:create" },
                      children: [
                        {
                          path: "",
                          lazy: () => import("../../routes/roles/role-create"),
                        },
                      ],
                    },
                  ],
                },
                {
                  path: ":id",
                  lazy: async () => {
                    const { Component, Breadcrumb, loader } = await import(
                      "../../routes/roles/role-detail"
                    )

                    return {
                      Component,
                      loader,
                      handle: {
                        breadcrumb: (
                          match: UIMatch<HttpTypes.AdminRbacRoleResponse>
                        ) => <Breadcrumb {...match} />,
                      },
                    }
                  },
                  children: [
                    {
                      path: "edit",
                      element: <RoutePermissionGuard />,
                      handle: { permissions: "rbac_role:update" },
                      children: [
                        {
                          path: "",
                          lazy: () => import("../../routes/roles/role-edit"),
                        },
                      ],
                    },
                    {
                      path: "add-users",
                      element: <RoutePermissionGuard />,
                      handle: {
                        permissions: ["user:update", "rbac_role:update"],
                      },
                      children: [
                        {
                          path: "",
                          lazy: () =>
                            import("../../routes/roles/role-add-users"),
                        },
                      ],
                    },
                    {
                      path: "permissions",
                      element: <RoutePermissionGuard />,
                      handle: { permissions: "rbac_role:update" },
                      children: [
                        {
                          path: "",
                          lazy: () =>
                            import("../../routes/roles/role-permissions"),
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              path: "policies",
              errorElement: <ErrorBoundary />,
              element: <RoutePermissionGuard />,
              handle: {
                breadcrumb: () => t("policies.domain"),
                permissions: "rbac_policy:read",
              },
              children: [
                {
                  path: "",
                  lazy: () => import("../../routes/policies/policy-list"),
                  // TODO: V1: policy CRUD lives in code (`definePolicies`).Uncomment
                  // along with the matching list/detail action sites to
                  // re-enable dashboard CRUD.
                  // children: [
                  //   {
                  //     path: "create",
                  //     element: <RoutePermissionGuard />,
                  //     handle: { permissions: "rbac_policy:create" },
                  //     children: [
                  //       {
                  //         path: "",
                  //         lazy: () =>
                  //           import("../../routes/policies/policy-create"),
                  //       },
                  //     ],
                  //   },
                  // ],
                },
                {
                  path: ":id",
                  lazy: async () => {
                    const { Component, Breadcrumb, loader } = await import(
                      "../../routes/policies/policy-detail"
                    )

                    return {
                      Component,
                      loader,
                      handle: {
                        breadcrumb: (
                          match: UIMatch<HttpTypes.AdminRbacPolicyResponse>
                        ) => <Breadcrumb {...match} />,
                      },
                    }
                  },
                  // TODO: V1: `edit` child kept commented out — see note above.
                  // children: [
                  //   {
                  //     path: "edit",
                  //     element: <RoutePermissionGuard />,
                  //     handle: { permissions: "rbac_policy:update" },
                  //     children: [
                  //       {
                  //         path: "",
                  //         lazy: () =>
                  //           import("../../routes/policies/policy-edit"),
                  //       },
                  //     ],
                  //   },
                  // ],
                },
              ],
            },
            {
              path: "sales-channels",
              errorElement: <ErrorBoundary />,
              element: (
                <PermissionsRequirementsProvider>
                  <RoutePermissionGuard />
                </PermissionsRequirementsProvider>
              ),
              handle: {
                breadcrumb: () => t("salesChannels.domain"),
                permissions: "sales_channel:read",
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
                      handle: { permissions: "sales_channel:create" },
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
                      handle: { permissions: "sales_channel:update" },
                    },
                    {
                      path: "add-products",
                      lazy: () =>
                        import(
                          "../../routes/sales-channels/sales-channel-add-products"
                        ),
                      handle: {
                        permissions: [
                          "sales_channel:update",
                          "product:read",
                          "product:update",
                        ],
                      },
                    },
                    {
                      path: "metadata/edit",
                      lazy: () =>
                        import(
                          "../../routes/sales-channels/sales-channel-metadata"
                        ),
                      handle: { permissions: "sales_channel:update" },
                    },
                  ],
                },
              ],
            },
            {
              path: "locations",
              errorElement: <ErrorBoundary />,
              element: (
                <PermissionsRequirementsProvider>
                  <RoutePermissionGuard />
                </PermissionsRequirementsProvider>
              ),
              handle: {
                breadcrumb: () => t("locations.domain"),
                permissions: "stock_location:read",
              },
              children: [
                {
                  path: "",
                  lazy: () => import("../../routes/locations/location-list"),
                  handle: { permissions: "stock_location:read" },
                },
                {
                  path: "create",
                  lazy: () => import("../../routes/locations/location-create"),
                  handle: { permissions: "stock_location:create" },
                },
                {
                  path: "shipping-profiles",
                  element: (
                    <PermissionsRequirementsProvider>
                      <RoutePermissionGuard />
                    </PermissionsRequirementsProvider>
                  ),
                  handle: {
                    breadcrumb: () => t("shippingProfile.domain"),
                    permissions: "shipping_profile:read",
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
                          handle: { permissions: "shipping_profile:create" },
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
                          handle: { permissions: "shipping_profile:update" },
                        },
                      ],
                    },
                  ],
                },
                {
                  path: "shipping-option-types",
                  errorElement: <ErrorBoundary />,
                  element: (
                    <PermissionsRequirementsProvider>
                      <RoutePermissionGuard />
                    </PermissionsRequirementsProvider>
                  ),
                  handle: {
                    breadcrumb: () => t("shippingOptionTypes.domain"),
                    permissions: "shipping_option_type:read",
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
                          handle: {
                            permissions: "shipping_option_type:create",
                          },
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
                          handle: {
                            permissions: "shipping_option_type:update",
                          },
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
                      handle: { permissions: "stock_location:update" },
                    },
                    {
                      path: "sales-channels",
                      lazy: () =>
                        import(
                          "../../routes/locations/location-sales-channels"
                        ),
                      handle: {
                        permissions: [
                          "stock_location:update",
                          "sales_channel:read",
                        ],
                      },
                    },
                    {
                      path: "fulfillment-providers",
                      lazy: () =>
                        import(
                          "../../routes/locations/location-fulfillment-providers"
                        ),
                      handle: { permissions: "stock_location:update" },
                    },
                    {
                      path: "metadata/edit",
                      lazy: () =>
                        import("../../routes/locations/location-metadata"),
                      handle: { permissions: "stock_location:update" },
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
                          handle: {
                            permissions: [
                              "stock_location:update",
                              "fulfillment_set:create",
                              "service_zone:create",
                            ],
                          },
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
                              handle: {
                                permissions: [
                                  "stock_location:update",
                                  "fulfillment_set:update",
                                  "service_zone:update",
                                ],
                              },
                            },
                            {
                              path: "areas",
                              lazy: () =>
                                import(
                                  "../../routes/locations/location-service-zone-manage-areas"
                                ),
                              handle: {
                                permissions: [
                                  "stock_location:update",
                                  "fulfillment_set:update",
                                  "service_zone:update",
                                ],
                              },
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
                                  handle: {
                                    permissions: [
                                      "stock_location:update",
                                      "shipping_option:create",
                                    ],
                                  },
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
                                      handle: {
                                        permissions: [
                                          "stock_location:update",
                                          "shipping_option:update",
                                        ],
                                      },
                                    },
                                    {
                                      path: "pricing",
                                      lazy: () =>
                                        import(
                                          "../../routes/locations/location-service-zone-shipping-option-pricing"
                                        ),
                                      handle: {
                                        permissions: [
                                          "stock_location:update",
                                          "shipping_option:update",
                                        ],
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
                  ],
                },
              ],
            },
            {
              path: "product-tags",
              errorElement: <ErrorBoundary />,
              element: (
                <PermissionsRequirementsProvider>
                  <RoutePermissionGuard />
                </PermissionsRequirementsProvider>
              ),
              handle: {
                breadcrumb: () => t("productTags.domain"),
                permissions: "product_tag:read",
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
                      handle: { permissions: "product_tag:create" },
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
                      handle: { permissions: "product_tag:update" },
                    },
                    {
                      path: "metadata/edit",
                      lazy: () =>
                        import(
                          "../../routes/product-tags/product-tag-metadata"
                        ),
                      handle: { permissions: "product_tag:update" },
                    },
                  ],
                },
              ],
            },
            {
              path: "workflows",
              errorElement: <ErrorBoundary />,
              element: (
                <PermissionsRequirementsProvider>
                  <RoutePermissionGuard />
                </PermissionsRequirementsProvider>
              ),
              handle: {
                breadcrumb: () => t("workflowExecutions.domain"),
                permissions: "workflow_execution:read",
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
              element: (
                <PermissionsRequirementsProvider>
                  <RoutePermissionGuard />
                </PermissionsRequirementsProvider>
              ),
              handle: {
                breadcrumb: () => t("productTypes.domain"),
                permissions: "product_type:read",
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
                      handle: { permissions: "product_type:create" },
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
                      handle: { permissions: "product_type:update" },
                    },
                    {
                      path: "metadata/edit",
                      lazy: () =>
                        import(
                          "../../routes/product-types/product-type-metadata"
                        ),
                      handle: { permissions: "product_type:update" },
                    },
                  ],
                },
              ],
            },
            {
              path: "publishable-api-keys",
              element: (
                <PermissionsRequirementsProvider>
                  <RoutePermissionGuard />
                </PermissionsRequirementsProvider>
              ),
              handle: {
                breadcrumb: () => t("apiKeyManagement.domain.publishable"),
                permissions: "api_key:read",
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
                          handle: { permissions: "api_key:create" },
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
                      handle: { permissions: "api_key:update" },
                    },
                    {
                      path: "sales-channels",
                      lazy: () =>
                        import(
                          "../../routes/api-key-management/api-key-management-sales-channels"
                        ),
                      handle: {
                        permissions: ["api_key:update", "sales_channel:read"],
                      },
                    },
                  ],
                },
              ],
            },
            {
              path: "secret-api-keys",
              element: (
                <PermissionsRequirementsProvider>
                  <RoutePermissionGuard />
                </PermissionsRequirementsProvider>
              ),
              handle: {
                breadcrumb: () => t("apiKeyManagement.domain.secret"),
                permissions: "api_key:read",
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
                          handle: { permissions: "api_key:create" },
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
                      handle: { permissions: "api_key:update" },
                    },
                  ],
                },
              ],
            },
            {
              path: "tax-regions",
              element: (
                <PermissionsRequirementsProvider>
                  <RoutePermissionGuard />
                </PermissionsRequirementsProvider>
              ),
              handle: {
                breadcrumb: () => t("taxRegions.domain"),
                permissions: "tax_region:read",
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
                      handle: { permissions: "tax_region:create" },
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
                          handle: { permissions: "tax_region:update" },
                        },
                        {
                          path: "provinces/create",
                          lazy: () =>
                            import(
                              "../../routes/tax-regions/tax-region-province-create"
                            ),
                          handle: { permissions: "tax_region:create" },
                        },
                        {
                          path: "overrides/create",
                          lazy: () =>
                            import(
                              "../../routes/tax-regions/tax-region-tax-override-create"
                            ),
                          handle: {
                            permissions: [
                              "tax_region:update",
                              "tax_rate:create",
                            ],
                          },
                        },
                        {
                          path: "overrides/:tax_rate_id/edit",
                          lazy: () =>
                            import(
                              "../../routes/tax-regions/tax-region-tax-override-edit"
                            ),
                          handle: {
                            permissions: [
                              "tax_region:update",
                              "tax_rate:update",
                            ],
                          },
                        },
                        {
                          path: "tax-rates/create",
                          lazy: () =>
                            import(
                              "../../routes/tax-regions/tax-region-tax-rate-create"
                            ),
                          handle: {
                            permissions: [
                              "tax_region:update",
                              "tax_rate:create",
                            ],
                          },
                        },
                        {
                          path: "tax-rates/:tax_rate_id/edit",
                          lazy: () =>
                            import(
                              "../../routes/tax-regions/tax-region-tax-rate-edit"
                            ),
                          handle: {
                            permissions: [
                              "tax_region:update",
                              "tax_rate:update",
                            ],
                          },
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
                          handle: {
                            permissions: [
                              "tax_region:update",
                              "tax_rate:create",
                            ],
                          },
                        },
                        {
                          path: "tax-rates/:tax_rate_id/edit",
                          lazy: () =>
                            import(
                              "../../routes/tax-regions/tax-region-tax-rate-edit"
                            ),
                          handle: {
                            permissions: [
                              "tax_region:update",
                              "tax_rate:update",
                            ],
                          },
                        },
                        {
                          path: "overrides/create",
                          lazy: () =>
                            import(
                              "../../routes/tax-regions/tax-region-tax-override-create"
                            ),
                          handle: {
                            permissions: [
                              "tax_region:update",
                              "tax_rate:create",
                            ],
                          },
                        },
                        {
                          path: "overrides/:tax_rate_id/edit",
                          lazy: () =>
                            import(
                              "../../routes/tax-regions/tax-region-tax-override-edit"
                            ),
                          handle: {
                            permissions: [
                              "tax_region:update",
                              "tax_rate:update",
                            ],
                          },
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              path: "return-reasons",
              element: (
                <PermissionsRequirementsProvider>
                  <RoutePermissionGuard />
                </PermissionsRequirementsProvider>
              ),
              handle: {
                breadcrumb: () => t("returnReasons.domain"),
                permissions: "return_reason:read",
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
                      handle: { permissions: "return_reason:create" },
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
                          handle: { permissions: "return_reason:update" },
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              path: "refund-reasons",
              element: (
                <PermissionsRequirementsProvider>
                  <RoutePermissionGuard />
                </PermissionsRequirementsProvider>
              ),
              handle: {
                breadcrumb: () => t("refundReasons.domain"),
                permissions: "refund_reason:read",
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
                      handle: { permissions: "refund_reason:create" },
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
                          handle: { permissions: "refund_reason:update" },
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
              element: (
                <PermissionsRequirementsProvider>
                  <RoutePermissionGuard />
                </PermissionsRequirementsProvider>
              ),
              handle: {
                breadcrumb: () => t("translations.domain"),
                permissions: "translation:read",
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
                      handle: {
                        permissions: [
                          "translation_setting:create",
                          "translation_setting:update",
                          "translation_setting:delete",
                        ],
                      },
                    },
                  ],
                },
                {
                  path: "edit",
                  lazy: () =>
                    import("../../routes/translations/translations-edit"),
                  // Read-only users can open the editor in view mode; the form
                  // itself disables inputs + hides save actions without
                  // translation:create + translation:update.
                  handle: { permissions: "translation:read" },
                },
                {
                  path: "add-locales",
                  lazy: () => import("../../routes/translations/add-locales"),
                  handle: { permissions: "store:update" },
                },
              ],
            },
            ...settingsRoutes.flatMap((r) => r?.children || []),
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
