import { PropsWithChildren, createContext } from "react"

type ConditionOperator =
  | "eq"
  | "ne"
  | "gt"
  | "lt"
  | "gte"
  | "lte"
  | "in"
  | "nin"

type ConditionBlockValue<TValue> = {
  attribute: string
  operator: ConditionOperator
  value: TValue
}

type ConditionBlockState<TValue> = {
  defaultValue?: ConditionBlockValue<TValue>
  value?: ConditionBlockValue<TValue>
  onChange: (value: ConditionBlockValue<TValue>) => void
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

const Divider = () => {}

const Operator = () => {}

const Item = () => {}

export const ConditionBlock = Object.assign(Root, {
  Divider,
})
