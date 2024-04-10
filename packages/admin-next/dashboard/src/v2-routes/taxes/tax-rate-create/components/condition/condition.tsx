import { Button, Text } from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import { ListSummary } from "../../../../../components/common/list-summary"
import { ConditionEntitiesValues } from "../../../common/types"

const N = 2

type ConditionProps = {
  labels: string[]
  type: ConditionEntitiesValues
  onClick: () => void
}

export function Condition({ labels, type, onClick }: ConditionProps) {
  const { t } = useTranslation()
  const isInButtonDisabled = !!labels.length

  return (
    <div className="text-center">
      <div className="bg-ui-bg-field shadow-borders-base inline-flex items-center divide-x overflow-hidden rounded-md">
        <Text
          as="span"
          size="small"
          leading="compact"
          weight="plus"
          className="text-ui-fg-muted shrink-0 px-2 py-1"
        >
          {t("taxRates.fields.appliesTo")} {t(`taxRates.fields.${type}`)}
        </Text>

        <div className="text-ui-fg-subtle max-w-[240px] shrink-0">
          <Button
            type="button"
            variant="transparent"
            size="small"
            disabled={isInButtonDisabled}
            onClick={() => onClick()}
            className="txt-compact-small-plus disabled:text-ui-fg-subtle rounded-none"
          >
            {labels.length && (
              <ListSummary
                inline
                n={N}
                className="!txt-compact-small-plus max-w-[200px]"
                list={labels}
              />
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
