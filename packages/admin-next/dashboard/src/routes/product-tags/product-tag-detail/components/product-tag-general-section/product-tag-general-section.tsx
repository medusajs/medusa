import { PencilSquare, Trash } from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"
import { Container, Heading } from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import { ActionMenu } from "../../../../../components/common/action-menu"

type ProductTagGeneralSectionProps = {
  productTag: HttpTypes.AdminProductTag
}

export const ProductTagGeneralSection = ({
  productTag,
}: ProductTagGeneralSectionProps) => {
  const { t } = useTranslation()

  return (
    <Container className="flex items-center justify-between">
      <div className="flex items-center gap-x-1.5">
        <span className="text-ui-fg-muted h1-core">#</span>
        <Heading>{productTag.value}</Heading>
      </div>
      <ActionMenu
        groups={[
          {
            actions: [
              {
                icon: <PencilSquare />,
                label: t("actions.edit"),
                to: "edit",
              },
            ],
          },
          {
            actions: [
              {
                icon: <Trash />,
                label: t("actions.delete"),
                onClick: () => {},
              },
            ],
          },
        ]}
      />
    </Container>
  )
}
