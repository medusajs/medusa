import { Gift } from "@medusajs/icons"
import { Container, Text } from "@medusajs/ui"
import { useTranslation } from "react-i18next"

export const RedemptionsSection = ({
  redemptions,
}: {
  redemptions: number
}) => {
  const { t } = useTranslation()

  return (
    <Container className="flex flex-col gap-y-6 px-6 py-4">
      <div className="grid grid-cols-[28px_1fr] items-center gap-x-3">
        <div className="bg-ui-bg-base shadow-borders-base flex size-7 items-center justify-center rounded-md">
          <div className="bg-ui-bg-component flex size-6 items-center justify-center rounded-[4px]">
            <Gift className="text-ui-fg-subtle" />
          </div>
        </div>
        <Text
          className="text-ui-fg-subtle"
          weight="plus"
          size="small"
          leading="compact"
        >
          {t("fields.totalRedemptions")}
        </Text>
      </div>
      <div className="border-ui-fg-muted border-l-2 pl-2">
        <Text
          className="text-ui-fg-base leading-[100%]"
          weight="plus"
          size="xlarge"
        >
          {redemptions}
        </Text>
      </div>
    </Container>
  )
}
