import React, { Dispatch, SetStateAction, useEffect, useState } from "react"
import {
  FormProvider,
  useForm,
  useFormContext,
  UseFormReturn,
} from "react-hook-form"
import {
  AllocationType,
  ConditionMap,
  DiscountConditionOperator,
  DiscountConditionType,
  DiscountRuleType,
  UpdateConditionProps,
} from "../../../types"
import { DiscountFormValues } from "./mappers"

type DiscountFormProviderProps = {
  children?: React.ReactNode
}

const defaultConditions: ConditionMap = {
  products: {
    id: undefined,
    operator: DiscountConditionOperator.IN,
    type: DiscountConditionType.PRODUCTS,
    items: [],
  },
  product_collections: {
    id: undefined,
    operator: DiscountConditionOperator.IN,
    type: DiscountConditionType.PRODUCT_COLLECTIONS,
    items: [],
  },
  product_tags: {
    id: undefined,
    operator: DiscountConditionOperator.IN,
    type: DiscountConditionType.PRODUCT_TAGS,
    items: [],
  },
  product_types: {
    id: undefined,
    operator: DiscountConditionOperator.IN,
    type: DiscountConditionType.PRODUCT_TYPES,
    items: [],
  },
  customer_groups: {
    id: undefined,
    operator: DiscountConditionOperator.IN,
    type: DiscountConditionType.CUSTOMER_GROUPS,
    items: [],
  },
}

export const DiscountFormProvider = ({
  children,
}: DiscountFormProviderProps) => {
  const [hasExpiryDate, setHasExpiryDate] = useState(false)
  const [hasStartDate, setHasStartDate] = useState(false)
  const [prevUsageLimit, setPrevUsageLimit] = useState<number | null>(null)
  const [prevValidDuration, setPrevValidDuration] = useState<string | null>(
    null
  )

  const [conditions, setConditions] = useState<ConditionMap>(defaultConditions)

  const updateCondition = ({ type, items, operator }: UpdateConditionProps) => {
    setConditions((prevConditions) => ({
      ...prevConditions,
      [type]: {
        ...prevConditions[type],
        items,
        operator,
      },
    }))
  }

  const methods = useForm<DiscountFormValues>({
    defaultValues: {
      rule: {
        type: DiscountRuleType.PERCENTAGE,
        allocation: AllocationType.TOTAL,
      },
    },
    shouldUnregister: true,
  })

  const type = methods.watch("rule.type")
  const isDynamic = methods.watch("is_dynamic")
  const usageLimit = methods.watch("usage_limit")
  const validDuration = methods.watch("valid_duration")

  const endsAt = methods.watch("ends_at")
  const startsAt = methods.watch("starts_at")

  useEffect(() => {
    if (hasExpiryDate && !endsAt) {
      methods.setValue(
        "ends_at",
        new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000)
      )
    }

    if (!hasExpiryDate && endsAt) {
      methods.setValue("ends_at", null)
    }
  }, [endsAt, hasExpiryDate])

  useEffect(() => {
    if (hasStartDate && !startsAt) {
      methods.setValue("starts_at", new Date(new Date().getTime()))
    }

    if (!hasStartDate && startsAt) {
      methods.setValue("starts_at", undefined)
    }
  }, [endsAt, hasExpiryDate])

  const handleConfigurationChanged = (values) => {
    if (values.indexOf("ends_at") > -1 && !hasExpiryDate) {
      setHasExpiryDate(true)
    } else if (values.indexOf("ends_at") === -1 && hasExpiryDate) {
      setHasExpiryDate(false)
    }

    if (values.indexOf("starts_at") === -1 && hasStartDate) {
      setHasStartDate(false)
    } else if (values.indexOf("starts_at") > -1 && !hasStartDate) {
      setHasStartDate(true)
    }

    // usage_limit
    if (values.indexOf("usage_limit") === -1 && usageLimit) {
      setPrevUsageLimit(usageLimit)
      // debounce the setValue call to not flash an empty field when collapsing the accordion
      setTimeout(() => {
        methods.setValue("usage_limit", null)
      }, 300)
    } else if (values.indexOf("usage_limit") > -1 && usageLimit) {
      methods.setValue("usage_limit", prevUsageLimit)
    }

    // valid duration
    if (values.indexOf("valid_duration") === -1 && validDuration !== "") {
      setPrevValidDuration(validDuration)
      // debounce the setValue call to not flash an empty field when collapsing the accordion
      setTimeout(() => {
        methods.setValue("valid_duration", "")
      }, 300)
    } else if (values.indexOf("valid_duration") > -1 && validDuration === "") {
      methods.setValue("valid_duration", prevValidDuration)
    }
  }

  const handleReset = () => {
    setConditions(defaultConditions)
    methods.reset({
      rule: {
        type: DiscountRuleType.PERCENTAGE,
        allocation: AllocationType.TOTAL,
      },
    })
  }

  useEffect(() => {
    handleReset()
  }, [])

  return (
    <FormProvider {...methods}>
      <DiscountFormContext.Provider
        value={{
          type,
          isDynamic,
          hasExpiryDate,
          setHasExpiryDate,
          hasStartDate,
          setHasStartDate,
          handleConfigurationChanged,
          conditions,
          updateCondition,
          setConditions,
          handleReset,
          form: methods,
        }}
      >
        {children}
      </DiscountFormContext.Provider>
    </FormProvider>
  )
}

const DiscountFormContext = React.createContext<{
  type?: string
  isDynamic: boolean
  hasExpiryDate: boolean
  setHasExpiryDate: (value: boolean) => void
  hasStartDate: boolean
  setHasStartDate: (value: boolean) => void
  handleConfigurationChanged: (values: string[]) => void
  conditions: ConditionMap
  updateCondition: (props: UpdateConditionProps) => void
  setConditions: Dispatch<SetStateAction<ConditionMap>>
  handleReset: () => void
  form: UseFormReturn<DiscountFormValues>
} | null>(null)

export const useDiscountForm = () => {
  const context = React.useContext(DiscountFormContext)
  const form = useFormContext<DiscountFormValues>()
  if (!context) {
    throw new Error("useDiscountForm must be a child of DiscountFormContext")
  }
  return { ...form, ...context }
}
