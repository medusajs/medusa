import { HttpTypes } from "@medusajs/types"
import { Outlet, RouteObject } from "react-router-dom"

import { ErrorBoundary } from "../../components/utilities/error-boundary"
import { productLoader } from "../../routes/products/product-detail/loader"

export const RoutesCore: RouteObject[] = [
  {
    index: true,
    errorElement: <ErrorBoundary />,
    lazy: () => import("../../routes/home"),
  },
  {
    path: "/products",
    errorElement: <ErrorBoundary />,
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
          {
            path: "import",
            lazy: () => import("../../routes/products/product-import"),
          },
          {
            path: "export",
            lazy: () => import("../../routes/products/product-export"),
          },
        ],
      },
      {
        path: ":id",
        errorElement: <ErrorBoundary />,
        Component: Outlet,
        loader: productLoader,
        handle: {
          crumb: (data: HttpTypes.AdminProductResponse) => data.product.title,
        },
        children: [
          {
            path: "",
            lazy: () => import("../../routes/products/product-detail"),
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
                lazy: () => import("../../routes/products/product-attributes"),
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
                lazy: () => import("../../routes/products/product-edit-option"),
              },
              {
                path: "variants/create",
                lazy: () =>
                  import("../../routes/products/product-create-variant"),
              },
              {
                path: "metadata/edit",
                lazy: () => import("../../routes/products/product-metadata"),
              },
            ],
          },
          {
            path: "variants/:variant_id",
            lazy: () =>
              import("../../routes/product-variants/product-variant-detail"),
            handle: {
              crumb: (data: HttpTypes.AdminProductVariantResponse) =>
                data.variant.title,
            },
            children: [
              {
                path: "edit",
                lazy: () =>
                  import("../../routes/product-variants/product-variant-edit"),
              },
              {
                path: "prices",
                lazy: () => import("../../routes/products/product-prices"),
              },
              {
                path: "manage-items",
                lazy: () =>
                  import(
                    "../../routes/product-variants/product-variant-manage-inventory-items"
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
      crumb: () => "Categories",
    },
    children: [
      {
        path: "",
        lazy: () => import("../../routes/categories/category-list"),
        children: [
          {
            path: "create",
            lazy: () => import("../../routes/categories/category-create"),
          },
          {
            path: "organize",
            lazy: () => import("../../routes/categories/category-organize"),
          },
        ],
      },
      {
        path: ":id",
        lazy: () => import("../../routes/categories/category-detail"),
        handle: {
          crumb: (data: HttpTypes.AdminProductCategoryResponse) =>
            data.product_category.name,
        },
        children: [
          {
            path: "edit",
            lazy: () => import("../../routes/categories/category-edit"),
          },
          {
            path: "products",
            lazy: () => import("../../routes/categories/category-products"),
          },
          {
            path: "organize",
            lazy: () => import("../../routes/categories/category-organize"),
          },
        ],
      },
    ],
  },
  {
    path: "/orders",
    errorElement: <ErrorBoundary />,
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
            lazy: () => import("../../routes/orders/order-create-fulfillment"),
          },
          {
            path: "returns/:return_id/receive",
            lazy: () => import("../../routes/orders/order-receive-return"),
          },
          {
            path: "allocate-items",
            lazy: () => import("../../routes/orders/order-allocate-items"),
          },
          {
            path: ":f_id/create-shipment",
            lazy: () => import("../../routes/orders/order-create-shipment"),
          },
          {
            path: "returns",
            lazy: () => import("../../routes/orders/order-create-return"),
          },
          {
            path: "claims",
            lazy: () => import("../../routes/orders/order-create-claim"),
          },
          {
            path: "exchanges",
            lazy: () => import("../../routes/orders/order-create-exchange"),
          },
          {
            path: "edits",
            lazy: () => import("../../routes/orders/order-create-edit"),
          },
          {
            path: "refund",
            lazy: () => import("../../routes/orders/order-create-refund"),
          },
        ],
      },
    ],
  },
  {
    path: "/promotions",
    errorElement: <ErrorBoundary />,
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
            lazy: () => import("../../routes/promotions/common/edit-rules"),
          },
        ],
      },
    ],
  },
  {
    path: "/campaigns",
    errorElement: <ErrorBoundary />,
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
            path: "configuration",
            lazy: () => import("../../routes/campaigns/campaign-configuration"),
          },
          {
            path: "edit-budget",
            lazy: () => import("../../routes/campaigns/campaign-budget-edit"),
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
    errorElement: <ErrorBoundary />,
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
            lazy: () => import("../../routes/collections/collection-create"),
          },
        ],
      },
      {
        path: ":id",
        lazy: () => import("../../routes/collections/collection-detail"),
        handle: {
          crumb: (data: { collection: HttpTypes.AdminCollection }) =>
            data.collection.title,
        },
        children: [
          {
            path: "edit",
            lazy: () => import("../../routes/collections/collection-edit"),
          },
          {
            path: "products",
            lazy: () =>
              import("../../routes/collections/collection-add-products"),
          },
        ],
      },
    ],
  },
  {
    path: "/price-lists",
    errorElement: <ErrorBoundary />,
    handle: {
      crumb: () => "Price Lists",
    },
    children: [
      {
        path: "",
        lazy: () => import("../../routes/price-lists/price-list-list"),
        children: [
          {
            path: "create",
            lazy: () => import("../../routes/price-lists/price-list-create"),
          },
        ],
      },
      {
        path: ":id",
        lazy: () => import("../../routes/price-lists/price-list-detail"),
        handle: {
          crumb: (data: HttpTypes.AdminPriceListResponse) =>
            data.price_list.title,
        },
        children: [
          {
            path: "edit",
            lazy: () => import("../../routes/price-lists/price-list-edit"),
          },
          {
            path: "configuration",
            lazy: () =>
              import("../../routes/price-lists/price-list-configuration"),
          },
          {
            path: "products/add",
            lazy: () =>
              import("../../routes/price-lists/price-list-prices-add"),
          },
          {
            path: "products/edit",
            lazy: () =>
              import("../../routes/price-lists/price-list-prices-edit"),
          },
        ],
      },
    ],
  },
  {
    path: "/customers",
    errorElement: <ErrorBoundary />,
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
            lazy: () => import("../../routes/customers/customer-create"),
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
              import("../../routes/customers/customers-add-customer-group"),
          },
          {
            path: "metadata/edit",
            lazy: () => import("../../routes/customers/customer-metadata"),
          },
        ],
      },
    ],
  },
  {
    path: "/customer-groups",
    errorElement: <ErrorBoundary />,
    handle: {
      crumb: () => "Customer Groups",
    },
    children: [
      {
        path: "",
        lazy: () => import("../../routes/customer-groups/customer-group-list"),
        children: [
          {
            path: "create",
            lazy: () =>
              import("../../routes/customer-groups/customer-group-create"),
          },
        ],
      },
      {
        path: ":id",
        lazy: () =>
          import("../../routes/customer-groups/customer-group-detail"),
        handle: {
          crumb: (data: { customer_group: HttpTypes.AdminCustomerGroup }) =>
            data.customer_group.name,
        },
        children: [
          {
            path: "edit",
            lazy: () =>
              import("../../routes/customer-groups/customer-group-edit"),
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
              import("../../routes/customer-groups/customer-group-metadata"),
          },
        ],
      },
    ],
  },
  {
    path: "/reservations",
    errorElement: <ErrorBoundary />,
    handle: {
      crumb: () => "Reservations",
    },
    children: [
      {
        path: "",
        lazy: () => import("../../routes/reservations/reservation-list"),
        children: [
          {
            path: "create",
            lazy: () => import("../../routes/reservations/reservation-create"),
          },
        ],
      },
      {
        path: ":id",
        lazy: () => import("../../routes/reservations/reservation-detail"),
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
    errorElement: <ErrorBoundary />,
    handle: {
      crumb: () => "Inventory",
    },
    children: [
      {
        path: "",
        lazy: () => import("../../routes/inventory/inventory-list"),
        children: [
          {
            path: "create",
            lazy: () => import("../../routes/inventory/inventory-create"),
          },
        ],
      },
      {
        path: ":id",
        lazy: () => import("../../routes/inventory/inventory-detail"),
        handle: {
          crumb: (data: HttpTypes.AdminInventoryItemResponse) =>
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
]
