import React from "react"
import { Controller, useFieldArray } from "react-hook-form"
import { NextCreateableSelect } from "../../../../../components/molecules/select/next-select"
import { NestedForm } from "../../../../../utils/nested-form"

export type VariantOptionValueType = {
  option_id: string
  value: string
  label: string
  isDisabled?: boolean
}

export type VariantOptionType = {
  option_id: string
  title: string
  option: VariantOptionValueType | null
}

export type VariantSelectOptionsFormType = VariantOptionType[]

type Props = {
  form: NestedForm<VariantSelectOptionsFormType>
  options: VariantOptionValueType[]
  onCreateOption: (optionId: string, value: string) => void
}

const VariantSelectOptionsForm = ({ form, options, onCreateOption }: Props) => {
  const { control, path } = form

  const { fields } = useFieldArray({
    control: form.control,
    name: path(),
    keyName: "fieldId",
  })

  return (
    <div className="grid grid-cols-2 gap-large pb-2xsmall">
      {fields.map((field, index) => {
        return (
          <Controller
            key={field.fieldId}
            control={control}
            name={path(`${index}.option`)}
            render={({ field: { value, onChange, onBlur, ref } }) => {
              return (
                <NextCreateableSelect
                  ref={ref}
                  value={value}
                  onChange={onChange}
                  onBlur={onBlur}
                  label={field.title}
                  placeholder="Choose an option"
                  required
                  options={
                    options.filter((o) => o.option_id === field.option_id) || []
                  }
                  onCreateOption={(value) => {
                    const newOption = {
                      option_id: field.option_id,
                      value: value,
                      label: value,
                    }

                    onCreateOption(field.option_id, value)

                    onChange(newOption)
                  }}
                />
              )
            }}
          />
        )
      })}
    </div>
  )
}

export default VariantSelectOptionsForm
