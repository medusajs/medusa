import { PencilSquare } from "@medusajs/icons"
import { Product, ProductOptionValue } from "@medusajs/medusa"
import { Badge, Container, Heading, Text } from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import { ActionMenu } from "../../../../../components/common/action-menu"

type ProductOptionSectionProps = {
  product: Product
}

export const ProductOptionSection = ({
  product,
}: ProductOptionSectionProps) => {
  const { t } = useTranslation()
  const options = product.options

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading level="h2">Options</Heading>
        <ActionMenu
          groups={[
            {
              actions: [
                {
                  label: t("general.edit"),
                  icon: <PencilSquare />,
                  to: "options",
                },
              ],
            },
          ]}
        />
      </div>
      {options.length > 0 ? (
        options.map((option) => {
          return (
            <div
              key={option.id}
              className="grid grid-cols-2 items-start px-6 py-4"
            >
              <Text size="small" leading="compact" weight="plus">
                {option.title}
              </Text>
              <div className="flex flex-wrap gap-1">
                {option.values
                  .filter(filterDuplicateValues)
                  .map((value, index) => {
                    return (
                      <Badge
                        size="2xsmall"
                        className="flex min-w-[20px] items-center justify-center"
                        key={index}
                      >
                        {value.value}
                      </Badge>
                    )
                  })}
              </div>
            </div>
          )
        })
      ) : (
        <div></div>
      )}
    </Container>
  )
}

function filterDuplicateValues(
  value: ProductOptionValue,
  index: number,
  array: ProductOptionValue[]
) {
  return array.findIndex((v) => v.value === value.value) === index
}
