import { PencilSquare, Trash } from "@medusajs/icons"
import type { ProductCategory } from "@medusajs/medusa"
import { Container, Heading, Text } from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import { ActionMenu } from "../../../../../components/common/action-menu"

type CategoryGeneralSectionProps = {
  category: ProductCategory
}

export const CategoryGeneralSection = ({
  category,
}: CategoryGeneralSectionProps) => {
  const { t } = useTranslation()

  return (
    <Container className="p-0 divide-y">
      <div className="px-6 py-4 flex items-center justify-between">
        <div>
          <Heading>{category.name}</Heading>
          <Text size="small" className="text-ui-fg-subtle">
            {category.description}
          </Text>
        </div>
        <ActionMenu
          groups={[
            {
              actions: [
                {
                  icon: <PencilSquare />,
                  label: t("general.edit"),
                  to: `/categories/${category.id}/edit`,
                },
              ],
            },
            {
              actions: [
                {
                  icon: <Trash />,
                  label: t("general.delete"),
                  to: `/categories/${category.id}/edit`,
                },
              ],
            },
          ]}
        />
      </div>
      <div className="px-6 py-4 grid grid-cols-2">
        <Text size="small" leading="compact" weight="plus">
          {t("fields.handle")}
        </Text>
        <Text size="small" className="text-ui-fg-subtle">
          /{category.handle}
        </Text>
      </div>
    </Container>
  )
}
