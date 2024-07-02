import { PropsWithChildren, createContext } from "react"

type ConditionOperatorValue = "eq" | "in" | "nin"

type ConditionBlockValue<TValue> = {
  attribute: string
  operator: ConditionOperatorValue
  value: TValue
}

export type ConditionAttribute = {
  label: string
  value: string
}

type ConditionBlockState<TValue> = {
  defaultValue?: ConditionBlockValue<TValue>
  value?: ConditionBlockValue<TValue>
  onChange?: (value: ConditionBlockValue<TValue>) => void
  onRemove?: () => void
  attributes: ConditionAttribute | ConditionAttribute[]
  disableAttributes?: boolean
}

const ConditionBlockContext = createContext<ConditionBlockState<any> | null>(
  null
)

const useConditionBlock = () => {
  const context = ConditionBlockContext

  if (!context) {
    throw new Error("useConditionBlock must be used within a ConditionBlock")
  }

  return context
}

type ConditionBlockProps<TValue> = PropsWithChildren<
  ConditionBlockState<TValue>
>

const Root = <TValue,>({ children, ...props }: ConditionBlockProps<TValue>) => {
  return (
    <ConditionBlockContext.Provider value={props}>
      {children}
    </ConditionBlockContext.Provider>
  )
}

const Attribute = () => {}

const Operator = () => {}

const List = () => {}

const Item = () => {}

const Browse = () => {}

const Select = () => {}

export const ConditionBlock = Object.assign(Root, {
  Attribute,
  List,
  Item,
  Operator
  Browse,
  Select,
})
