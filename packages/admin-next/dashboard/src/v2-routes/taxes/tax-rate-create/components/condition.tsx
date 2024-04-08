import { Button, Text } from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import { ListSummary } from "../../../../components/common/list-summary"

const N = 2
export enum DiscountConditionOperator {
  IN = "in",
  NOT_IN = "not_in",
}

export enum ConditionEntities {
  PRODUCT = "products",
}

type ConditionProps = {
  labels: string[]
  isInOperator: boolean
  type: ConditionEntities
  onClick: (op: DiscountConditionOperator) => void
}

export function Condition({
  labels,
  isInOperator,
  type,
  onClick,
}: ConditionProps) {
  const { t } = useTranslation()

  const isInButtonDisabled = !!labels.length && !isInOperator
  const isExButtonDisabled = !!labels.length && isInOperator

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
          Tax Rate applies to
        </Text>
        <div className="text-ui-fg-subtle max-w-[240px] shrink-0">
          <Button
            type="button"
            variant="transparent"
            size="small"
            disabled={isInButtonDisabled}
            onClick={() => onClick("in" as DiscountConditionOperator)}
            className="txt-compact-small-plus disabled:text-ui-fg-subtle rounded-none"
          >
            {isInOperator && labels.length ? (
              <ListSummary
                inline
                n={N}
                className="!txt-compact-small-plus max-w-[200px]"
                list={labels}
              />
            ) : (
              t(labels.length ? "fields.all" : "fields.none")
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
