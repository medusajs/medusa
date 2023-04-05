import { Discount } from "@medusajs/medusa"
import { useAdminUpdateDiscount } from "medusa-react"
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react"
import useNotification from "../../../../../hooks/use-notification"
import { getErrorMessage } from "../../../../../utils/error-messages"
import {
  ConditionMap,
  DiscountConditionOperator,
  DiscountConditionType,
  UpdateConditionProps,
} from "../../../types"

type ConditionsProviderProps = {
  discount: Discount
  children: ReactNode
}

type ConditionContext = {
  conditions: ConditionMap
  updateCondition: (props: UpdateConditionProps) => void
  save: () => void
  updateAndSave: (props: UpdateConditionProps) => void
  reset: () => void
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

const ConditionsContext = createContext<ConditionContext | null>(null)

export const ConditionsProvider = ({
  discount,
  children,
}: ConditionsProviderProps) => {
  const [conditions, setConditions] = useState<ConditionMap>(defaultConditions)
  const { mutate } = useAdminUpdateDiscount(discount.id)

  const notification = useNotification()

  const reset = () => {
    if (discount.rule.conditions.length) {
      let initialConditions = defaultConditions

      for (const condition of discount.rule.conditions) {
        initialConditions = {
          ...initialConditions,
          [condition.type]: {
            ...initialConditions[condition.type],
            id: condition.id,
          },
        }

        setConditions(initialConditions)
      }
    } else {
      setConditions(defaultConditions)
    }
  }

  useEffect(() => {
    reset()
  }, [discount])

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

  const handleSubmit = (conditions: ConditionMap) => {
    const conditionsToSubmit = Object.values(conditions)
      .filter((condition) => condition.items.length)
      .map((condition) => ({
        [condition.type]: condition.items.map((i) => i.id),
        operator: condition.operator,
      }))

    if (!conditionsToSubmit.length) {
      return
    }

    mutate(
      {
        rule: {
          id: discount.rule.id,
          conditions: conditionsToSubmit,
        },
      },
      {
        onSuccess: () => {
          notification(
            "Condtions were succesfully added",
            "Discount conditions updated",
            "success"
          )
        },
        onError: (err) => {
          notification("Error", getErrorMessage(err), "error")
        },
      }
    )
  }

  const save = () => {
    handleSubmit(conditions)
  }

  const updateAndSave = ({ type, items, operator }: UpdateConditionProps) => {
    const update = {
      ...conditions,
      [type]: {
        ...conditions[type],
        items,
        operator,
      },
    }

    handleSubmit(update)
  }

  return (
    <ConditionsContext.Provider
      value={{
        conditions,
        updateCondition,
        reset,
        save,
        updateAndSave,
      }}
    >
      {children}
    </ConditionsContext.Provider>
  )
}

export const useConditions = () => {
  const context = useContext(ConditionsContext)
  if (context === null) {
    throw new Error("useConditions must be used within a ConditionsProvider")
  }
  return context
}
