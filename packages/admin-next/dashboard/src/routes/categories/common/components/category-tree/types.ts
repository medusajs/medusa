import { ProductCategory } from "@medusajs/medusa"
import { ComponentType } from "react"

type OnChangeArgs = {
  dragItem: ProductCategory
  items: ProductCategory[]
  targetPath: number[]
}

export type OnChangeFn =
  | ((args: OnChangeArgs) => Promise<void>)
  | ((args: OnChangeArgs) => void)

export type ItemMenuCompoment = ComponentType<{
  item: ProductCategory
  isDisabled?: boolean
}>
