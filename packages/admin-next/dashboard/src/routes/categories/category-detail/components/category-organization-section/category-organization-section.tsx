import { Plus, QueueList } from "@medusajs/icons"
import { ProductCategory } from "@medusajs/medusa"
import { Badge, Container, Heading, Text } from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom"
import { ActionMenu } from "../../../../../components/common/action-menu"

type CategoryOrganizationSectionProps = {
  category: ProductCategory
}

export const CategoryOrganizationSection = ({
  category,
}: CategoryOrganizationSectionProps) => {
  const { t } = useTranslation()

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading level="h2">{t("categories.organization.header")}</Heading>
        <ActionMenu
          groups={[
            {
              actions: [
                {
                  label: t("categories.organization.editRankLabel"),
                  icon: <QueueList />,
                  to: `rank`,
                },
                {
                  label: t("categories.createChildCategoryLabel"),
                  icon: <Plus />,
                  to: `create`,
                },
              ],
            },
          ]}
        />
      </div>
      <div className="text-ui-fg-subtle grid grid-cols-2 items-center px-6 py-4">
        <Text size="small" leading="compact" weight="plus">
          {t("categories.organization.parentLabel")}
        </Text>
        <div>
          {category.parent_category ? (
            <Badge
              size="2xsmall"
              asChild
              className="max-w-[150px] overflow-hidden"
            >
              <Link to={`/categories/${category.parent_category.id}`}>
                <span className="truncate">
                  {category.parent_category.name}
                </span>
              </Link>
            </Badge>
          ) : (
            <Text size="small" leading="compact">
              -
            </Text>
          )}
        </div>
      </div>
      <div className="text-ui-fg-subtle grid grid-cols-2 items-start px-6 py-4">
        <Text size="small" leading="compact" weight="plus">
          {t("categories.organization.childrenLabel")}
        </Text>
        <div>
          {category.category_children?.length > 0 ? (
            <ul className="flex flex-wrap items-start gap-1">
              {category.category_children.map((child) => (
                <Badge
                  key={child.id}
                  size="2xsmall"
                  asChild
                  className="w-fit max-w-full overflow-hidden"
                >
                  <Link to={`/categories/${child.id}`}>
                    <span className="truncate">{child.name}</span>
                  </Link>
                </Badge>
              ))}
            </ul>
          ) : (
            <Text size="small" leading="compact">
              -
            </Text>
          )}
        </div>
      </div>
    </Container>
  )
}
