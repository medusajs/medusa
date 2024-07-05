import { ConditionEntities } from "./constants"

export type ConditionsOption = {
  value: string
  label: string
}

export type ConditionsState = {
  [K in ConditionEntities]: boolean
}

export type ConditionEntitiesValues = `${ConditionEntities}`
