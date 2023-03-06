import React, { useState } from "react"
import {
  FieldValues,
  FormProvider,
  SubmitHandler,
  useForm,
  useFormContext,
  useWatch,
} from "react-hook-form"
import { weekFromNow } from "../../../../utils/date-utils"
import {
  ConfigurationField,
  CreatePriceListPricesFormValues,
  PriceListFormValues,
  PriceListType,
} from "../types"

const defaultState: PriceListFormValues = {
  customer_groups: [],
  name: null,
  description: null,
  ends_at: null,
  starts_at: null,
  prices: null,
  type: PriceListType.SALE,
  includes_tax: null,
}

const PriceListFormContext = React.createContext<{
  configFields: Pick<
    PriceListFormValues,
    "starts_at" | "ends_at" | "customer_groups"
  >
  handleConfigurationSwitch: (values: string[]) => void
  prices: CreatePriceListPricesFormValues | null
  setPrices: React.Dispatch<
    React.SetStateAction<CreatePriceListPricesFormValues | null>
  >
  handleSubmit: <T extends FieldValues>(
    submitHandler: SubmitHandler<T>
  ) => (e?: React.BaseSyntheticEvent) => Promise<void>
} | null>(null)

type FormProviderProps = {
  priceList?: PriceListFormValues
  children?: React.ReactNode
}

export const PriceListFormProvider: React.FC<FormProviderProps> = ({
  priceList = defaultState,
  children,
}) => {
  const [configFields, setConfigFields] = useState<
    Pick<PriceListFormValues, "starts_at" | "ends_at" | "customer_groups">
  >({
    customer_groups: priceList.customer_groups,
    ends_at: priceList.ends_at,
    starts_at: priceList.starts_at,
  })
  const methods = useForm<PriceListFormValues>({
    defaultValues: priceList,
  })

  const [prices, setPrices] = useState<CreatePriceListPricesFormValues | null>(
    null
  )

  const currentStartsAt = useWatch({
    name: "starts_at",
    control: methods.control,
  })
  const currentEndsAt = useWatch({
    name: "ends_at",
    control: methods.control,
  })
  const currentCustomerGroups = useWatch({
    name: "customer_groups",
    control: methods.control,
  })

  const disableConfiguration = (configField: ConfigurationField) => {
    let configToSave: unknown | null = null

    switch (configField) {
      case "customer_groups":
        configToSave = currentCustomerGroups
        break
      case "starts_at":
        configToSave = currentStartsAt
        break
      case "ends_at":
        configToSave = currentEndsAt
        break
    }

    // we save the configuration field value to the state, so that if the user re-enables the field we can populate it with the previous value
    setConfigFields({
      ...configFields,
      [configField]: configToSave,
    })

    // use timeout to avoid flashing default value
    setTimeout(() => methods.setValue(configField, null), 300)
  }

  const enableConfiguration = (configField: ConfigurationField) => {
    // we get the configuration field value from the state, so that if the user re-enables the field we can populate it with the previous value
    if (configFields[configField]) {
      methods.setValue(configField, configFields[configField])
    } else {
      // if the configuration field value is null, we set a default value
      switch (configField) {
        case "starts_at":
          methods.setValue("starts_at", new Date())
          break
        case "ends_at":
          methods.setValue("ends_at", weekFromNow())
          break
        case "customer_groups":
          methods.setValue("customer_groups", [])
          break
      }
    }
  }

  const handleConfigurationSwitch = (values: string[]) => {
    for (const key of Object.keys(configFields)) {
      if (values.includes(key)) {
        enableConfiguration(key as ConfigurationField)
      } else {
        disableConfiguration(key as ConfigurationField)
      }
    }
  }

  const handleSubmit = (submitHandler) => {
    return methods.handleSubmit((values) => {
      submitHandler({ ...values, prices })
    })
  }

  return (
    <FormProvider {...methods}>
      <PriceListFormContext.Provider
        value={{
          configFields,
          handleConfigurationSwitch,
          prices,
          handleSubmit,
          setPrices,
        }}
      >
        {children}
      </PriceListFormContext.Provider>
    </FormProvider>
  )
}

export const usePriceListForm = () => {
  const context = React.useContext(PriceListFormContext)
  const form = useFormContext<PriceListFormValues>()
  if (context === null) {
    throw new Error(
      "usePriceListForm must be used within a PriceListFormProvider"
    )
  }
  return { ...form, ...context }
}
