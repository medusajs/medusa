import {
  ApplicationMethodTargetTypeValues,
  HttpTypes,
  RuleTypeValues,
} from "@medusajs/types"
import { Input } from "@medusajs/ui"
import { useWatch } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { useEffect } from "react"

import { Form } from "../../../../../../components/common/form"
import { Combobox } from "../../../../../../components/inputs/combobox"
import { useStore } from "../../../../../../hooks/api"
import { useComboboxData } from "../../../../../../hooks/use-combobox-data"
import { sdk } from "../../../../../../lib/client"

type RuleValueFormFieldType = {
  form: any
  identifier: string
  scope:
    | "application_method.buy_rules"
    | "rules"
    | "application_method.target_rules"
  name: string
  operator: string
  fieldRule: any
  attributes: HttpTypes.AdminRuleAttributeOption[]
  ruleType: RuleTypeValues
  applicationMethodTargetType: ApplicationMethodTargetTypeValues | undefined
}

const buildFilters = (attribute?: string, store?: HttpTypes.AdminStore) => {
  if (!attribute || !store) {
    return {}
  }

  if (attribute === "currency_code") {
    return {
      value: store.supported_currencies?.map((c) => c.currency_code),
    }
  }

  return {}
}

export const RuleValueFormField = ({
  form,
  identifier,
  scope,
  name,
  operator,
  fieldRule,
  attributes,
  ruleType,
  applicationMethodTargetType,
}: RuleValueFormFieldType) => {
  const { t } = useTranslation()

  const attribute = attributes?.find(
    (attr) => attr.value === fieldRule.attribute
  )

  const { store, isLoading: isStoreLoading } = useStore()

  const selectedValue = !Array.isArray(fieldRule.values)
    ? fieldRule.values
    : undefined

  const comboboxData = useComboboxData({
    queryFn: async (params) => {
      return await sdk.admin.promotion.listRuleValues(
        ruleType,
        attribute?.id!,
        {
          ...params,
          ...buildFilters(attribute?.id, store!),
          application_method_target_type: applicationMethodTargetType,
        }
      )
    },
    enabled:
      !!attribute?.id &&
      ["select", "multiselect"].includes(attribute.field_type) &&
      !isStoreLoading,
    getOptions: (data) => data.values,
    queryKey: ["rule-value-options", ruleType, attribute?.id],
    selectedValue,
  })

  const watchOperator = useWatch({
    control: form.control,
    name: operator,
  })

  useEffect(() => {
    const hasDirtyRules = Object.keys(form.formState.dirtyFields).length > 0

    /**
     * Don't reset values if fileds didn't change - this is to prevent reset of form on initial render when editing an existing rule
     */
    if (!hasDirtyRules) {
      return
    }

    if (watchOperator === "eq") {
      form.setValue(name, "")
    } else {
      form.setValue(name, [])
    }
  }, [watchOperator])

  return (
    <Form.Field
      key={`${identifier}.${scope}.${name}-${fieldRule.attribute}`}
      name={name}
      render={({ field: { onChange, ref, ...field } }) => {
        if (attribute?.field_type === "number") {
          return (
            <Form.Item className="basis-1/2">
              <Form.Control>
                <Input
                  {...field}
                  type="number"
                  onChange={onChange}
                  className="bg-ui-bg-base"
                  ref={ref}
                  min={1}
                  disabled={!fieldRule.attribute}
                />
              </Form.Control>
              <Form.ErrorMessage />
            </Form.Item>
          )
        } else if (attribute?.field_type === "text") {
          return (
            <Form.Item className="basis-1/2">
              <Form.Control>
                <Input
                  {...field}
                  ref={ref}
                  onChange={onChange}
                  className="bg-ui-bg-base"
                  disabled={!fieldRule.attribute}
                />
              </Form.Control>
              <Form.ErrorMessage />
            </Form.Item>
          )
        } else {
          return (
            <Form.Item className="basis-1/2">
              <Form.Control>
                <Combobox
                  {...field}
                  {...comboboxData}
                  ref={ref}
                  placeholder={
                    watchOperator === "eq"
                      ? t("labels.selectValue")
                      : t("labels.selectValues")
                  }
                  disabled={!watchOperator}
                  onChange={onChange}
                />
              </Form.Control>
              <Form.ErrorMessage />
            </Form.Item>
          )
        }
      }}
    />
  )
}
