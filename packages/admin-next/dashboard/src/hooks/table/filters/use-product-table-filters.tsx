import { useTranslation } from "react-i18next"
import { Filter } from "../../../components/table/data-table"
import { useProductTypes } from "../../api/product-types"
import { useSalesChannels } from "../../api/sales-channels"

const excludeableFields = [
  "sales_channel_id",
  "collections",
  "categories",
] as const

export const useProductTableFilters = (
  exclude?: (typeof excludeableFields)[number][]
) => {
  const { t } = useTranslation()

  const { product_types } = useProductTypes({
    limit: 1000,
    offset: 0,
  })

  // const { product_tags } = useAdminProductTags({
  //   limit: 1000,
  //   offset: 0,
  // })

  const isSalesChannelExcluded = exclude?.includes("sales_channel_id")

  const { sales_channels } = useSalesChannels(
    {
      limit: 1000,
      fields: "id,name",
    },
    {
      enabled: !isSalesChannelExcluded,
    }
  )

  const isCategoryExcluded = exclude?.includes("categories")

  // const { product_categories } = useAdminProductCategories({
  //   limit: 1000,
  //   offset: 0,
  //   fields: "id,name",
  //   expand: "",
  // }, {
  //  enabled: !isCategoryExcluded,
  // })

  const isCollectionExcluded = exclude?.includes("collections")

  // const { collections } = useAdminCollections(
  //   {
  //     limit: 1000,
  //     offset: 0,
  //   },
  //   {
  //     enabled: !isCollectionExcluded,
  //   }
  // )

  let filters: Filter[] = []

  if (product_types) {
    const typeFilter: Filter = {
      key: "type_id",
      label: t("fields.type"),
      type: "select",
      multiple: true,
      options: product_types.map((t) => ({
        label: t.value,
        value: t.id,
      })),
    }

    filters = [...filters, typeFilter]
  }

  // if (product_tags) {
  //   const tagFilter: Filter = {
  //     key: "tags",
  //     label: t("fields.tag"),
  //     type: "select",
  //     multiple: true,
  //     options: product_tags.map((t) => ({
  //       label: t.value,
  //       value: t.id,
  //     })),
  //   }

  //   filters = [...filters, tagFilter]
  // }

  if (sales_channels) {
    const salesChannelFilter: Filter = {
      key: "sales_channel_id",
      label: t("fields.salesChannel"),
      type: "select",
      multiple: true,
      options: sales_channels.map((s) => ({
        label: s.name,
        value: s.id,
      })),
    }

    filters = [...filters, salesChannelFilter]
  }

  // if (product_categories) {
  //   const categoryFilter: Filter = {
  //     key: "category_id",
  //     label: t("fields.category"),
  //     type: "select",
  //     multiple: true,
  //     options: product_categories.map((c) => ({
  //       label: c.name,
  //       value: c.id,
  //     })),
  //   }

  //   filters = [...filters, categoryFilter]
  // }

  // if (collections) {
  //   const collectionFilter: Filter = {
  //     key: "collection_id",
  //     label: t("fields.collection"),
  //     type: "select",
  //     multiple: true,
  //     options: collections.map((c) => ({
  //       label: c.title,
  //       value: c.id,
  //     })),
  //   }

  //   filters = [...filters, collectionFilter]
  // }

  const giftCardFilter: Filter = {
    key: "is_giftcard",
    label: t("fields.giftCard"),
    type: "select",
    options: [
      {
        label: t("fields.true"),
        value: "true",
      },
      {
        label: t("fields.false"),
        value: "false",
      },
    ],
  }

  const statusFilter: Filter = {
    key: "status",
    label: t("fields.status"),
    type: "select",
    multiple: true,
    options: [
      {
        label: t("products.productStatus.draft"),
        value: "draft",
      },
      {
        label: t("products.productStatus.proposed"),
        value: "proposed",
      },
      {
        label: t("products.productStatus.published"),
        value: "published",
      },
      {
        label: t("products.productStatus.rejected"),
        value: "rejected",
      },
    ],
  }

  const dateFilters: Filter[] = [
    { label: t("fields.createdAt"), key: "created_at" },
    { label: t("fields.updatedAt"), key: "updated_at" },
  ].map((f) => ({
    key: f.key,
    label: f.label,
    type: "date",
  }))

  filters = [...filters, statusFilter, giftCardFilter, ...dateFilters]

  return filters
}
