import { PencilSquare } from "@medusajs/icons"
import { Product } from "@medusajs/medusa"
import { Badge, Container, Heading, Text } from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom"
import { ActionMenu } from "../../../../../components/common/action-menu"

type ProductOrganizationSectionProps = {
  product: Product
}

export const ProductOrganizationSection = ({
  product,
}: ProductOrganizationSectionProps) => {
  const { t } = useTranslation()

  const { tags, type, collection, categories } = product

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading level="h2">Organization</Heading>
        <ActionMenu
          groups={[
            {
              actions: [
                {
                  label: t("general.edit"),
                  icon: <PencilSquare />,
                  to: "organization",
                },
              ],
            },
          ]}
        />
      </div>
      <div className="text-ui-fg-subtle grid grid-cols-2 items-start px-6 py-4">
        <Text size="small" leading="compact" weight="plus">
          Tags
        </Text>
        <div className="flex flex-wrap gap-1">
          {tags.length > 0
            ? tags.map((tag) => (
                <Badge size="2xsmall" color="green" key={tag.id} asChild>
                  <Link to={`/products?tag=${tag.value}`}>{tag.value}</Link>
                </Badge>
              ))
            : "-"}
        </div>
      </div>
      <div className="text-ui-fg-subtle grid grid-cols-2 items-start px-6 py-4">
        <Text size="small" leading="compact" weight="plus">
          Type
        </Text>
        <Text size="small" leading="compact">
          {type ? (
            <Badge size="2xsmall" color="orange" asChild>
              <Link to={`/products?type_id=${type.id}`}>{type.value}</Link>
            </Badge>
          ) : (
            "-"
          )}
        </Text>
      </div>
      <div className="text-ui-fg-subtle grid grid-cols-2 items-start px-6 py-4">
        <Text size="small" leading="compact" weight="plus">
          Collection
        </Text>
        <Text size="small" leading="compact">
          {collection?.title ? (
            <Badge
              size="2xsmall"
              color="blue"
              asChild
              className="transition-fg hover:bg-ui-tag-blue-bg-hover"
            >
              <Link to={`/collections/${collection.id}`}>
                {collection.title}
              </Link>
            </Badge>
          ) : (
            "-"
          )}
        </Text>
      </div>
      <div className="text-ui-fg-subtle grid grid-cols-2 items-start px-6 py-4">
        <Text size="small" leading="compact" weight="plus">
          Categories
        </Text>
        <div className="flex flex-wrap gap-1">
          {categories.length > 0
            ? categories.map((category) => (
                <Badge
                  size="2xsmall"
                  key={category.id}
                  className="transition-fg hover:bg-ui-tag-purple-bg-hover"
                  color="purple"
                  asChild
                >
                  <Link to={`/categories/${category.id}`}>{category.name}</Link>
                </Badge>
              ))
            : "-"}
        </div>
      </div>
    </Container>
  )
}
