import React, { useContext, useEffect } from "react"
import { useLocalStorage } from "../hooks/utils"
import { RegionInfo, ProductVariant } from "../types"
import { getVariantPrice } from "../utils"
import { isArray, isEmpty, isObject } from "lodash"

interface Item {
  variant: ProductVariant
  quantity: number
  readonly total?: number
}

export interface BagState {
  region: RegionInfo
  items: Item[]
  totalItems: number
  bagTotal: number
}

interface BagContextState extends BagState {
  setRegion: (region: RegionInfo) => void
  addItem: (item: Item) => void
  removeItem: (id: string) => void
  updateItem: (id: string, item: Partial<Item>) => void
  setItems: (items: Item[]) => void
  updateItemQuantity: (id: string, quantity: number) => void
  incrementItemQuantity: (id: string) => void
  decrementItemQuantity: (id: string) => void
  getItem: (id: string) => Item | undefined
  clearBag: () => void
}

const BagContext = React.createContext<BagContextState | null>(null)

enum ACTION_TYPES {
  INIT,
  ADD_ITEM,
  SET_ITEMS,
  REMOVE_ITEM,
  UPDATE_ITEM,
  CLEAR_ITEMS,
  SET_REGION,
}

type Action =
  | { type: ACTION_TYPES.SET_REGION; payload: RegionInfo }
  | { type: ACTION_TYPES.INIT; payload: object }
  | { type: ACTION_TYPES.ADD_ITEM; payload: Item }
  | {
      type: ACTION_TYPES.UPDATE_ITEM
      payload: { id: string; item: Partial<Item> }
    }
  | { type: ACTION_TYPES.REMOVE_ITEM; payload: { id: string } }
  | { type: ACTION_TYPES.SET_ITEMS; payload: Item[] }
  | { type: ACTION_TYPES.CLEAR_ITEMS }

const reducer = (state: BagState, action: Action) => {
  switch (action.type) {
    case ACTION_TYPES.INIT: {
      return state
    }
    case ACTION_TYPES.SET_REGION: {
      return generateBagState(
        {
          ...state,
          region: action.payload,
        },
        state.items
      )
    }
    case ACTION_TYPES.ADD_ITEM: {
      const duplicateVariantIndex = state.items.findIndex(
        (item) => item.variant.id === action.payload?.variant?.id
      )
      if (duplicateVariantIndex !== -1) {
        state.items.splice(duplicateVariantIndex, 1)
      }
      const items = [...state.items, action.payload]
      return generateBagState(state, items)
    }
    case ACTION_TYPES.UPDATE_ITEM: {
      const items = state.items.map((item) =>
        item.variant.id === action.payload.id
          ? { ...item, ...action.payload.item }
          : item
      )

      return generateBagState(state, items)
    }
    case ACTION_TYPES.REMOVE_ITEM: {
      const items = state.items.filter(
        (item) => item.variant.id !== action.payload.id
      )
      return generateBagState(state, items)
    }
    case ACTION_TYPES.SET_ITEMS: {
      return generateBagState(state, action.payload)
    }
    case ACTION_TYPES.CLEAR_ITEMS: {
      return {
        ...state,
        items: [],
        bagTotal: 0,
        totalItems: 0,
      }
    }
    default:
      return state
  }
}

export const generateBagState = (state: BagState, items: Item[]) => {
  const newItems = generateItems(state.region, items)
  return {
    ...state,
    items: newItems,
    totalItems: items.reduce((sum, item) => sum + item.quantity, 0),
    bagTotal: calculateBagTotal(newItems),
  }
}

const generateItems = (region: RegionInfo, items: Item[]) => {
  return items.map((item) => ({
    ...item,
    total: getVariantPrice(item.variant, region),
  }))
}

const calculateBagTotal = (items: Item[]) => {
  return items.reduce(
    (total, item) => total + item.quantity * (item.total || 0),
    0
  )
}

interface BagProviderProps {
  children: React.ReactNode
  initialState?: BagState
}

const defaultInitialState: BagState = {
  region: {} as RegionInfo,
  items: [],
  bagTotal: 0,
  totalItems: 0,
}

export const BagProvider = ({
  initialState = defaultInitialState,
  children,
}: BagProviderProps) => {
  const [saved, save] = useLocalStorage(
    "medusa-bag",
    JSON.stringify(initialState)
  )

  const [state, dispatch] = React.useReducer(reducer, JSON.parse(saved))

  useEffect(() => {
    save(JSON.stringify(state))
  }, [state, save])

  const setRegion = (region: RegionInfo) => {
    if (!isObject(region) || isEmpty(region)) {
      throw new Error("region must be a non-empty object")
    }

    dispatch({ type: ACTION_TYPES.SET_REGION, payload: region })
  }

  const getItem = (id: string) => {
    return state.items.find((item) => item.variant.id === id)
  }

  const setItems = (items: Item[]) => {
    if (!isArray(items)) {
      throw new Error("items must be an array of items")
    }

    dispatch({ type: ACTION_TYPES.SET_ITEMS, payload: items })
  }

  const addItem = (item: Item) => {
    if (!isObject(item) || isEmpty(item)) {
      throw new Error("item must be a non-empty object")
    }

    dispatch({ type: ACTION_TYPES.ADD_ITEM, payload: item })
  }

  const updateItem = (id: string, item: Partial<Item>) => {
    dispatch({ type: ACTION_TYPES.UPDATE_ITEM, payload: { id, item } })
  }

  const updateItemQuantity = (id: string, quantity: number) => {
    const item = getItem(id)
    if (!item) return

    quantity = quantity <= 0 ? 1 : quantity

    dispatch({
      type: ACTION_TYPES.UPDATE_ITEM,
      payload: {
        id,
        item: {
          ...item,
          quantity: Math.min(item.variant.inventory_quantity, quantity),
        },
      },
    })
  }

  const incrementItemQuantity = (id: string) => {
    const item = getItem(id)
    if (!item) return

    dispatch({
      type: ACTION_TYPES.UPDATE_ITEM,
      payload: {
        id,
        item: {
          ...item,
          quantity: Math.min(
            item.variant.inventory_quantity,
            item.quantity + 1
          ),
        },
      },
    })
  }

  const decrementItemQuantity = (id: string) => {
    const item = getItem(id)
    if (!item) return

    dispatch({
      type: ACTION_TYPES.UPDATE_ITEM,
      payload: {
        id,
        item: { ...item, quantity: Math.max(0, item.quantity - 1) },
      },
    })
  }

  const removeItem = (id: string) => {
    dispatch({
      type: ACTION_TYPES.REMOVE_ITEM,
      payload: { id },
    })
  }

  const clearBag = () => {
    dispatch({
      type: ACTION_TYPES.CLEAR_ITEMS,
    })
  }

  return (
    <BagContext.Provider
      value={{
        ...state,
        setRegion,
        addItem,
        updateItem,
        updateItemQuantity,
        incrementItemQuantity,
        decrementItemQuantity,
        removeItem,
        getItem,
        setItems,
        clearBag,
      }}
    >
      {children}
    </BagContext.Provider>
  )
}

export const useBag = () => {
  const context = useContext(BagContext)
  if (!context) {
    throw new Error("useBag should be used as a child of BagProvider")
  }
  return context
}
