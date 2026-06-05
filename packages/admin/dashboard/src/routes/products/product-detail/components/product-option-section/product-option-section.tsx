import { ArrowRight, PencilSquare } from "@medusajs/icons"
import { Badge, Container, Heading } from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import { ActionMenu } from "../../../../../components/common/action-menu"
import { SectionRow } from "../../../../../components/common/section"
import { HttpTypes } from "@medusajs/types"

const OptionActions = ({
  option,
}: {
  option: HttpTypes.AdminProductOption
}) => {
  const { t } = useTranslation()

  return (
    <ActionMenu
      groups={[
        {
          actions: [
            {
              label: t("actions.goToProductOption"),
              to: `/product-options/${option.id}`,
              icon: <ArrowRight />,
            },
          ],
        },
      ]}
    />
  )
}

type ProductOptionSectionProps = {
  product: HttpTypes.AdminProduct
}

export const ProductOptionSection = ({
  product,
}: ProductOptionSectionProps) => {
  const { t } = useTranslation()

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading level="h2">{t("products.options.header")}</Heading>
        <ActionMenu
          groups={[
            {
              actions: [
                {
                  label: t("actions.manage"),
                  to: "options/manage",
                  icon: <PencilSquare />,
                },
              ],
            },
          ]}
        />
      </div>

      {product.options?.map((option) => {
        return (
          <SectionRow
            title={option.title}
            key={option.id}
            value={[...(option.values ?? [])]
              .sort((a, b) => {
                if (a.rank == null && b.rank == null) {
                  return 0
                }
                if (a.rank == null) {
                  return 1
                }
                if (b.rank == null) {
                  return -1
                }
                return a.rank - b.rank
              })
              .map((val) => {
                return (
                  <Badge
                    key={val.value}
                    size="2xsmall"
                    className="flex min-w-[20px] items-center justify-center"
                  >
                    {val.value}
                  </Badge>
                )
              })}
            actions={<OptionActions option={option} />}
          />
        )
      })}
    </Container>
  )
}
