import { PencilSquare } from "@medusajs/icons"
import { Product } from "@medusajs/medusa"
import { Badge, Container, Heading } from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom"
import { ActionMenu } from "../../../../../components/common/action-menu"
import { SectionRow } from "../../../../../components/common/section"

type ProductOrganizationSectionProps = {
  product: Product
}

export const ProductOrganizationSection = ({
  product,
}: ProductOrganizationSectionProps) => {
  const { t } = useTranslation()

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading level="h2">{t("products.organization")}</Heading>
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
      </div>

      <SectionRow
        title={t("fields.tags")}
        value={
          product.tags.length > 0
            ? product.tags.map((tag) => (
                <Badge key={tag.id} className="w-fit" size="2xsmall" asChild>
                  <Link to={`/products?tags=${tag.id}`}>{tag.value}</Link>
                </Badge>
              ))
            : undefined
        }
      />
      <SectionRow
        title={t("fields.type")}
        value={
          product.type ? (
            <Badge size="2xsmall" className="w-fit" asChild>
              <Link to={`/products?type_id=${product.type_id}`}>
                {product.type.value}
              </Link>
            </Badge>
          ) : undefined
        }
      />

      <SectionRow
        title={t("fields.collection")}
        value={
          product.collection ? (
            <Badge size="2xsmall" color="blue" className="w-fit" asChild>
              <Link to={`/collections/${product.collection.id}`}>
                {product.collection.title}
              </Link>
            </Badge>
          ) : undefined
        }
      />

      <SectionRow
        title={t("fields.categories")}
        value={
          product.categories?.length > 0
            ? product.categories.map((pcat) => (
                <Badge
                  key={pcat.id}
                  className="w-fit"
                  color="purple"
                  size="2xsmall"
                  asChild
                >
                  <Link to={`/categories/${pcat.id}`}>{pcat.name}</Link>
                </Badge>
              ))
            : undefined
        }
      />
    </Container>
  )
}
