import { HttpTypes } from "@medusajs/types"
import { Divider } from "../../../../components/common/divider"
import { Text } from "@medusajs/ui"
import { useTranslation } from "react-i18next"

export const ImportSummary = ({
  summary,
}: {
  summary: HttpTypes.AdminImportProductResponse["summary"]
}) => {
  const { t } = useTranslation()

  return (
    <div className="shadow-elevation-card-rest bg-ui-bg-component transition-fg rounded-md flex flex-row px-3 py-2">
      <Stat
        title={summary.toCreate.toLocaleString()}
        description={t("products.import.upload.productsToCreate")}
      />
      <Divider orientation="vertical" className="px-3 h-10" />
      <Stat
        title={summary.toUpdate.toLocaleString()}
        description={t("products.import.upload.productsToUpdate")}
      />
    </div>
  )
}

const Stat = ({
  title,
  description,
}: {
  title: string
  description: string
}) => {
  return (
    <div className="flex-1 flex flex-col justify-center">
      <Text size="xlarge" className="font-sans font-medium">
        {title}
      </Text>

      <Text
        leading="compact"
        size="xsmall"
        weight="plus"
        className="text-ui-fg-subtle"
      >
        {description}
      </Text>
    </div>
  )
}
