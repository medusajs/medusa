import { Controller, useFieldArray, useWatch } from "react-hook-form"
import { currencies } from "../../../../utils/currencies"
import { nestedForm, NestedForm } from "../../../../utils/nested-form"
import IncludesTaxTooltip from "../../../atoms/includes-tax-tooltip"
import InputError from "../../../atoms/input-error"
import Switch from "../../../atoms/switch"
import CoinsIcon from "../../../fundamentals/icons/coins-icon"
import IconTooltip from "../../../molecules/icon-tooltip"
import MetadataForm, { MetadataFormType } from "../../general/metadata-form"
import PriceFormInput from "../../general/prices-form/price-form-input"

type DenominationType = {
  amount: number
  currency_code: string
  includes_tax?: boolean
}

export type DenominationFormType = {
  defaultDenomination: DenominationType
  currencyDenominations: DenominationType[]
  useSameValue: boolean
  metadata: MetadataFormType
}

type Props = {
  form: NestedForm<DenominationFormType>
}

const DenominationForm = ({ form }: Props) => {
  const {
    control,
    path,
    formState: { errors },
  } = form

  const { fields } = useFieldArray({
    control,
    name: path("currencyDenominations"),
    keyName: "fieldKey",
  })

  const defaultCurrency = useWatch({
    control,
    name: path("defaultDenomination"),
  })

  const useSameValue = useWatch({
    control,
    name: path("useSameValue"),
  })

  return (
    <div className="gap-y-xlarge flex flex-col">
      <div>
        <div className="gap-x-2xsmall flex items-center">
          <h2 className="inter-base-semibold">Default currency</h2>
          <IconTooltip
            type="info"
            content="The denomination in your store's default currency"
          />
        </div>
        <div className="pt-small gap-x-base rounded-rounded relative grid grid-cols-[1fr_223px] justify-between transition-colors">
          <div className="gap-x-small flex items-center">
            <div className="bg-grey-10 rounded-rounded text-grey-50 flex h-10 w-10 items-center justify-center">
              <CoinsIcon size={20} />
            </div>
            <div className="gap-x-xsmall flex items-center">
              <span className="inter-base-semibold">
                {defaultCurrency.currency_code.toUpperCase()}
              </span>
              <span className="inter-base-regular text-grey-50">
                {currencies[defaultCurrency.currency_code.toUpperCase()].name}
              </span>
              <IncludesTaxTooltip includesTax={defaultCurrency.includes_tax} />
            </div>
          </div>
          <Controller
            name={path(`defaultDenomination.amount`)}
            control={control}
            rules={{
              required:
                "An amount for your store's default currency is required",
            }}
            render={({ field: { value, onChange, name } }) => {
              return (
                <>
                  <PriceFormInput
                    onChange={onChange}
                    amount={value !== null ? value : undefined}
                    currencyCode={defaultCurrency.currency_code}
                    errors={errors}
                  />
                  <InputError errors={errors} name={name} />
                </>
              )
            }}
          />
        </div>
      </div>
      <div>
        <div className="flex items-start justify-between">
          <div className="gap-y-2xsmall flex flex-col">
            <h2 className="inter-base-semibold">
              Use value for all currencies?
            </h2>
            <p className="inter-small-regular text-grey-50 max-w-[60%]">
              If enabled the value used for the store&apos;s default currency
              code will also be applied to all other currencies in your store.
            </p>
          </div>
          <Controller
            control={control}
            name={path("useSameValue")}
            render={({ field: { value, onChange, ...rest } }) => {
              return (
                <Switch checked={value} onCheckedChange={onChange} {...rest} />
              )
            }}
          />
        </div>
      </div>
      {!useSameValue && (
        <div>
          <div className="gap-x-2xsmall flex items-center">
            <h2 className="inter-base-semibold">Other currencies</h2>
            <IconTooltip
              type="info"
              content="The denomination in your store's other currencies"
            />
          </div>
          <div className="gap-y-xsmall pt-small flex flex-col">
            {fields.map((denom, index) => {
              return (
                <div
                  key={denom.fieldKey}
                  className="gap-x-base rounded-rounded relative grid grid-cols-[1fr_223px] justify-between transition-colors"
                >
                  <div className="gap-x-small flex items-center">
                    <div className="bg-grey-10 rounded-rounded text-grey-50 flex h-10 w-10 items-center justify-center">
                      <CoinsIcon size={20} />
                    </div>
                    <div className="gap-x-xsmall flex items-center">
                      <span className="inter-base-semibold">
                        {denom.currency_code.toUpperCase()}
                      </span>
                      <span className="inter-base-regular text-grey-50">
                        {currencies[denom.currency_code.toUpperCase()].name}
                      </span>
                      <IncludesTaxTooltip includesTax={denom.includes_tax} />
                    </div>
                  </div>
                  <Controller
                    name={path(`currencyDenominations.${index}.amount`)}
                    control={control}
                    render={({
                      field: { value, onChange },
                      formState: { errors },
                    }) => {
                      return (
                        <PriceFormInput
                          onChange={onChange}
                          amount={value !== null ? value : undefined}
                          currencyCode={denom.currency_code}
                          errors={errors}
                        />
                      )
                    }}
                  />
                </div>
              )
            })}
          </div>
        </div>
      )}
      <div>
        <h2 className="inter-base-semibold mb-base">Metadata</h2>
        <MetadataForm form={nestedForm(form, "metadata")} />
      </div>
    </div>
  )
}

export default DenominationForm
