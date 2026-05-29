import { PencilSquare } from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"
import { Badge, Container, Heading, Tooltip } from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom"
import { ActionMenu } from "../../../../../components/common/action-menu"
import { SectionRow } from "../../../../../components/common/section"
import { useExtension } from "../../../../../providers/extension-provider"
import { usePermissions } from "../../../../../providers/permissions-provider"

type ProductOrganizationSectionProps = {
  product: HttpTypes.AdminProduct
}

export const ProductOrganizationSection = ({
  product,
}: ProductOrganizationSectionProps) => {
  const { t } = useTranslation()
  const { getDisplays } = useExtension()
  const { hasPermission } = usePermissions()

  const canUpdate = hasPermission("product:update")
  const canReadTags = hasPermission("product_tag:read")
  const canReadTypes = hasPermission("product_type:read")
  const canReadCollections = hasPermission("product_collection:read")
  const canReadCategories = hasPermission("product_category:read")

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading level="h2">{t("products.organization.header")}</Heading>
        {canUpdate && (
          <ActionMenu
            groups={[
              {
                actions: [
                  {
                    label: t("actions.edit"),
                    to: "organization",
                    icon: <PencilSquare />,
                  },
                ],
              },
            ]}
          />
        )}
      </div>

      {canReadTags && (
        <SectionRow
          title={t("fields.tags")}
          value={
            product.tags?.length
              ? product.tags.map((tag) => (
                  <OrganizationTag
                    key={tag.id}
                    label={tag.value}
                    to={`/settings/product-tags/${tag.id}`}
                  />
                ))
              : undefined
          }
        />
      )}
      {canReadTypes && (
        <SectionRow
          title={t("fields.type")}
          value={
            product.type ? (
              <OrganizationTag
                label={product.type.value}
                to={`/settings/product-types/${product.type_id}`}
              />
            ) : undefined
          }
        />
      )}

      {canReadCollections && (
        <SectionRow
          title={t("fields.collection")}
          value={
            product.collection ? (
              <OrganizationTag
                label={product.collection.title}
                to={`/collections/${product.collection.id}`}
              />
            ) : undefined
          }
        />
      )}

      {canReadCategories && (
        <SectionRow
          title={t("fields.categories")}
          value={
            product.categories?.length
              ? product.categories.map((pcat) => (
                  <OrganizationTag
                    key={pcat.id}
                    label={pcat.name}
                    to={`/categories/${pcat.id}`}
                  />
                ))
              : undefined
          }
        />
      )}

      {getDisplays("product", "organize").map((Component, i) => {
        return <Component key={i} data={product} />
      })}
    </Container>
  )
}

const OrganizationTag = ({ label, to }: { label: string; to: string }) => {
  return (
    <Tooltip content={label}>
      <Badge size="2xsmall" className="block w-fit truncate" asChild>
        <Link to={to}>{label}</Link>
      </Badge>
    </Tooltip>
  )
}
