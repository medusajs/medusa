import { HttpTypes } from "@medusajs/types"
import { Outlet, RouteObject } from "react-router-dom"
import { ErrorBoundary } from "../../components/utilities/error-boundary"
import { getCountryByIso2 } from "../../lib/data/countries"
import {
  getProvinceByIso2,
  isProvinceInCountry,
} from "../../lib/data/country-states"
import { taxRegionLoader } from "../../routes/tax-regions/tax-region-detail/loader"

export const RoutesSettings: RouteObject[] = [
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
    errorElement: <ErrorBoundary />,
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
          crumb: (data: { region: HttpTypes.AdminRegion }) => data.region.name,
        },
        children: [
          {
            path: "edit",
            lazy: () => import("../../routes/regions/region-edit"),
          },
          {
            path: "countries/add",
            lazy: () => import("../../routes/regions/region-add-countries"),
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
          crumb: (data: HttpTypes.AdminUserResponse) => data.user.email,
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
    errorElement: <ErrorBoundary />,
    element: <Outlet />,
    handle: {
      crumb: () => "Sales Channels",
    },
    children: [
      {
        path: "",
        lazy: () => import("../../routes/sales-channels/sales-channel-list"),
        children: [
          {
            path: "create",
            lazy: () =>
              import("../../routes/sales-channels/sales-channel-create"),
          },
        ],
      },
      {
        path: ":id",
        lazy: () => import("../../routes/sales-channels/sales-channel-detail"),
        handle: {
          crumb: (data: HttpTypes.AdminSalesChannelResponse) =>
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
              import("../../routes/sales-channels/sales-channel-add-products"),
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
      crumb: () => "Locations & Shipping",
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
          crumb: () => "Shipping Profiles",
        },
        children: [
          {
            path: "",
            lazy: () =>
              import("../../routes/shipping-profiles/shipping-profiles-list"),
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
            handle: {
              crumb: (data: HttpTypes.AdminShippingProfileResponse) =>
                data.shipping_profile.name,
            },
            lazy: () =>
              import("../../routes/shipping-profiles/shipping-profile-detail"),
          },
        ],
      },
      {
        path: "shipping-option-types",
        errorElement: <ErrorBoundary />,
        element: <Outlet />,
        handle: {
          crumb: () => "Shipping Option Types",
        },
      },
      {
        path: ":location_id",
        lazy: () => import("../../routes/locations/location-detail"),
        handle: {
          crumb: (data: HttpTypes.AdminStockLocationResponse) =>
            data.stock_location.name,
        },
        children: [
          {
            path: "edit",
            lazy: () => import("../../routes/locations/location-edit"),
          },
          {
            path: "sales-channels",
            lazy: () =>
              import("../../routes/locations/location-sales-channels"),
          },
          {
            path: "fulfillment-providers",
            lazy: () =>
              import("../../routes/locations/location-fulfillment-providers"),
          },
          {
            path: "fulfillment-set/:fset_id",
            children: [
              {
                path: "service-zones/create",
                lazy: () =>
                  import("../../routes/locations/location-service-zone-create"),
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
      crumb: () => "Product Tags",
    },
    children: [
      {
        path: "",
        lazy: () => import("../../routes/product-tags/product-tag-list"),
        children: [
          {
            path: "create",
            lazy: () => import("../../routes/product-tags/product-tag-create"),
          },
        ],
      },
      {
        path: ":id",
        lazy: () => import("../../routes/product-tags/product-tag-detail"),
        handle: {
          crumb: (data: HttpTypes.AdminProductTagResponse) =>
            data.product_tag.value,
        },
        children: [
          {
            path: "edit",
            lazy: () => import("../../routes/product-tags/product-tag-edit"),
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
      crumb: () => "Workflows",
    },
    children: [
      {
        path: "",
        lazy: () =>
          import("../../routes/workflow-executions/workflow-execution-list"),
      },
      {
        path: ":id",
        lazy: () =>
          import("../../routes/workflow-executions/workflow-execution-detail"),
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
    path: "product-types",
    errorElement: <ErrorBoundary />,
    element: <Outlet />,
    handle: {
      crumb: () => "Product Types",
    },
    children: [
      {
        path: "",
        lazy: () => import("../../routes/product-types/product-type-list"),
        children: [
          {
            path: "create",
            lazy: () =>
              import("../../routes/product-types/product-type-create"),
          },
        ],
      },
      {
        path: ":id",
        lazy: () => import("../../routes/product-types/product-type-detail"),
        handle: {
          crumb: (data: HttpTypes.AdminProductTypeResponse) =>
            data.product_type.value,
        },
        children: [
          {
            path: "edit",
            lazy: () => import("../../routes/product-types/product-type-edit"),
          },
        ],
      },
    ],
  },

  {
    path: "publishable-api-keys",
    errorElement: <ErrorBoundary />,
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
              import("../../routes/api-key-management/api-key-management-list"),
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
          import("../../routes/api-key-management/api-key-management-detail"),
        handle: {
          crumb: (data: HttpTypes.AdminApiKeyResponse) => {
            return data.api_key.title
          },
        },
        children: [
          {
            path: "edit",
            lazy: () =>
              import("../../routes/api-key-management/api-key-management-edit"),
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
    errorElement: <ErrorBoundary />,
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
              import("../../routes/api-key-management/api-key-management-list"),
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
          import("../../routes/api-key-management/api-key-management-detail"),
        handle: {
          crumb: (data: HttpTypes.AdminApiKeyResponse) => {
            return data.api_key.title
          },
        },
        children: [
          {
            path: "edit",
            lazy: () =>
              import("../../routes/api-key-management/api-key-management-edit"),
          },
        ],
      },
    ],
  },
  {
    path: "tax-regions",
    errorElement: <ErrorBoundary />,
    element: <Outlet />,
    handle: {
      crumb: () => "Tax Regions",
    },
    children: [
      {
        path: "",
        lazy: () => import("../../routes/tax-regions/tax-region-list"),
        children: [
          {
            path: "create",
            lazy: () => import("../../routes/tax-regions/tax-region-create"),
          },
        ],
      },
      {
        path: ":id",
        Component: Outlet,
        loader: taxRegionLoader,
        handle: {
          crumb: (data: HttpTypes.AdminTaxRegionResponse) => {
            return (
              getCountryByIso2(data.tax_region.country_code)?.display_name ||
              data.tax_region.country_code?.toUpperCase()
            )
          },
        },
        children: [
          {
            path: "",
            lazy: () => import("../../routes/tax-regions/tax-region-detail"),
            children: [
              {
                path: "provinces/create",
                lazy: () =>
                  import("../../routes/tax-regions/tax-region-province-create"),
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
                  import("../../routes/tax-regions/tax-region-tax-rate-create"),
              },
              {
                path: "tax-rates/:tax_rate_id/edit",
                lazy: () =>
                  import("../../routes/tax-regions/tax-region-tax-rate-edit"),
              },
            ],
          },
          {
            path: "provinces/:province_id",
            lazy: () =>
              import("../../routes/tax-regions/tax-region-province-detail"),
            handle: {
              crumb: (data: HttpTypes.AdminTaxRegionResponse) => {
                const countryCode = data.tax_region.country_code?.toUpperCase()
                const provinceCode =
                  data.tax_region.province_code?.toUpperCase()

                const isValid = isProvinceInCountry(countryCode, provinceCode)

                return isValid ? getProvinceByIso2(provinceCode) : provinceCode
              },
            },
            children: [
              {
                path: "tax-rates/create",
                lazy: () =>
                  import("../../routes/tax-regions/tax-region-tax-rate-create"),
              },
              {
                path: "tax-rates/:tax_rate_id/edit",
                lazy: () =>
                  import("../../routes/tax-regions/tax-region-tax-rate-edit"),
              },
            ],
          },
        ],
      },
    ],
  },
  {
    path: "return-reasons",
    errorElement: <ErrorBoundary />,
    element: <Outlet />,
    handle: {
      crumb: () => "Return Reasons",
    },
    children: [
      {
        path: "",
        lazy: () => import("../../routes/return-reasons/return-reason-list"),
        children: [
          {
            path: "create",
            lazy: () =>
              import("../../routes/return-reasons/return-reason-create"),
          },

          {
            path: ":id",
            children: [
              {
                path: "edit",
                lazy: () =>
                  import("../../routes/return-reasons/return-reason-edit"),
              },
            ],
          },
        ],
      },
    ],
  },
]
