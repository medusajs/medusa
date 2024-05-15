import { RuleAttributeOptionsResponse, StoreDTO } from "@medusajs/types"
import { Input, Select } from "@medusajs/ui"
import { RefCallBack, useWatch } from "react-hook-form"
import { Form } from "../../../../../../components/common/form"
import { Combobox } from "../../../../../../components/inputs/combobox"
import { usePromotionRuleValues } from "../../../../../../hooks/api/promotions"
import { useStore } from "../../../../../../hooks/api/store"

type RuleValueFormFieldType = {
  form: any
  identifier: string
  scope:
    | "application_method.buy_rules"
    | "rules"
    | "application_method.target_rules"
  valuesField: any
  operatorsField: any
  valuesRef: RefCallBack
  fieldRule: any
  attributes: RuleAttributeOptionsResponse[]
  ruleType: "rules" | "target-rules" | "buy-rules"
}

const buildFilters = (attribute?: string, store?: StoreDTO) => {
  if (!attribute || !store) {
    return {}
  }

  if (attribute === "currency_code") {
    return {
      value: store.supported_currency_codes,
    }
  }

  return {}
}

export const RuleValueFormField = ({
  form,
  identifier,
  scope,
  valuesField,
  operatorsField,
  valuesRef,
  fieldRule,
  attributes,
  ruleType,
}: RuleValueFormFieldType) => {
  const attribute = attributes?.find(
    (attr) => attr.value === fieldRule.attribute
  )

  const { store, isLoading: isStoreLoading } = useStore()
  const { values: options = [] } = usePromotionRuleValues(
    ruleType,
    attribute?.id!,
    buildFilters(attribute?.id, store),
    {
      enabled:
        !!attribute?.id && attribute.field_type === "select" && !isStoreLoading,
    }
  )

  const watchOperator = useWatch({
    control: form.control,
    name: operatorsField.name,
  })

  return (
    <Form.Field
      key={`${identifier}.${scope}.${valuesField.name}-${fieldRule.attribute}`}
      {...valuesField}
      render={({ field: { onChange, ref, ...field } }) => {
        if (fieldRule.field_type === "number") {
          return (
            <Form.Item className="basis-1/2">
              <Form.Control>
                <Input
                  {...field}
                  type="number"
                  onChange={onChange}
                  className="bg-ui-bg-base"
                  ref={valuesRef}
                  min={1}
                />
              </Form.Control>
              <Form.ErrorMessage />
            </Form.Item>
          )
        } else if (fieldRule.field_type === "text") {
          return (
            <Form.Item className="basis-1/2">
              <Form.Control>
                <Input
                  {...field}
                  onChange={onChange}
                  className="bg-ui-bg-base"
                />
              </Form.Control>
              <Form.ErrorMessage />
            </Form.Item>
          )
        } else if (watchOperator === "eq") {
          return (
            <Form.Item className="basis-1/2">
              <Form.Control>
                <Select
                  {...field}
                  value={
                    Array.isArray(field.value) ? field.value[0] : field.value
                  }
                  onValueChange={onChange}
                >
                  <Select.Trigger ref={ref} className="bg-ui-bg-base">
                    <Select.Value placeholder="Select Value" />
                  </Select.Trigger>

                  <Select.Content>
                    {options?.map((option, i) => (
                      <Select.Item
                        key={`${identifier}-value-option-${i}`}
                        value={option.value}
                      >
                        <span className="text-ui-fg-subtle">
                          {option.label}
                        </span>
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select>
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
                  placeholder="Select Values"
                  options={options}
                  onChange={onChange}
                  className="bg-ui-bg-base"
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
