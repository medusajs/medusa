/**
 * @packageDocumentation
 * 
 * @customNamespace Providers.Session Cart
 */

import React, { useContext, useEffect } from "react"
import { getVariantPrice } from "../helpers"
import { useLocalStorage } from "../hooks/utils"
import { ProductVariant, RegionInfo } from "../types"
import { isArray, isEmpty, isObject } from "../utils"

/**
 * A session cart's item.
 */
export interface Item {
  /**
   * The product variant represented by this item in the cart.
   */
  variant: ProductVariant
  /**
   * The quantity added in the cart.
   */
  quantity: number
  /**
   * The total amount of the item in the cart.
   */
  readonly total?: number
}

export interface SessionCartState {
  /**
   * The region of the cart.
   */
  region: RegionInfo
  /**
   * The items in the cart.
   */
  items: Item[]
  /**
   * The total items in the cart.
   */
  totalItems: number
  /**
   * The total amount of the cart.
   */
  total: number
}

export interface SessionCartContextState extends SessionCartState {
  /**
   * A state function used to set the region.
   * 
   * @param region - The new value of the region.
   */
  setRegion: (region: RegionInfo) => void
  /**
   * This function adds an item to the session cart.
   * 
   * @param {Item} item - The item to add.
   */
  addItem: (item: Item) => void
  /**
   * This function removes an item from the session cart.
   * 
   * @param {string} id - The ID of the item.
   */
  removeItem: (id: string) => void
  /**
   * This function updates an item in the session cart.
   * 
   * @param {string} id - The ID of the item.
   * @param {Partial<Item>} item - The item's data to update.
   */
  updateItem: (id: string, item: Partial<Item>) => void
  /**
   * A state function used to set the items in the cart.
   * 
   * @param {Item[]} items - The items to set in the cart.
   */
  setItems: (items: Item[]) => void
  /**
   * This function updates an item's quantity in the cart.
   * 
   * @param {string} id - The ID of the item.
   * @param {number} quantity - The new quantity of the item.
   */
  updateItemQuantity: (id: string, quantity: number) => void
  /**
   * This function increments the item's quantity in the cart.
   * 
   * @param {string} id - The ID of the item.
   */
  incrementItemQuantity: (id: string) => void
  /**
   * This function decrements the item's quantity in the cart.
   * 
   * @param {string} id - The ID of the item.
   */
  decrementItemQuantity: (id: string) => void
  /**
   * This function retrieves an item's details by its ID.
   * 
   * @param {string} id - The ID of the item.
   * @returns {Item | undefined} The item in the cart, if found.
   */
  getItem: (id: string) => Item | undefined
  /**
   * Removes all items in the cart.
   */
  clearItems: () => void
}

const SessionCartContext = React.createContext<SessionCartContextState | null>(
  null
)

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

const reducer = (state: SessionCartState, action: Action) => {
  switch (action.type) {
    case ACTION_TYPES.INIT: {
      return state
    }
    case ACTION_TYPES.SET_REGION: {
      return generateCartState(
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
      return generateCartState(state, items)
    }
    case ACTION_TYPES.UPDATE_ITEM: {
      const items = state.items.map((item) =>
        item.variant.id === action.payload.id
          ? { ...item, ...action.payload.item }
          : item
      )

      return generateCartState(state, items)
    }
    case ACTION_TYPES.REMOVE_ITEM: {
      const items = state.items.filter(
        (item) => item.variant.id !== action.payload.id
      )
      return generateCartState(state, items)
    }
    case ACTION_TYPES.SET_ITEMS: {
      return generateCartState(state, action.payload)
    }
    case ACTION_TYPES.CLEAR_ITEMS: {
      return {
        ...state,
        items: [],
        total: 0,
        totalItems: 0,
      }
    }
    default:
      return state
  }
}

/**
 * @ignore
 */
export const generateCartState = (state: SessionCartState, items: Item[]) => {
  const newItems = generateItems(state.region, items)
  return {
    ...state,
    items: newItems,
    totalItems: items.reduce((sum, item) => sum + item.quantity, 0),
    total: calculateSessionCartTotal(newItems),
  }
}

const generateItems = (region: RegionInfo, items: Item[]) => {
  return items.map((item) => ({
    ...item,
    total: getVariantPrice(item.variant, region),
  }))
}

const calculateSessionCartTotal = (items: Item[]) => {
  return items.reduce(
    (total, item) => total + item.quantity * (item.total || 0),
    0
  )
}

export interface SessionCartProviderProps {
  /**
   * @ignore
   */
  children: React.ReactNode
  /**
   * An optional initial value to be used for the session cart.
   */
  initialState?: SessionCartState
}

const defaultInitialState: SessionCartState = {
  region: {} as RegionInfo,
  items: [],
  total: 0,
  totalItems: 0,
}

/**
 * Unlike the {@link Providers.Cart.CartProvider | CartProvider}, `SessionProvider` never interacts with the Medusa backend. It can be used to implement the user experience related to managing a cart’s items. 
 * Its state variables are JavaScript objects living in the browser, but are in no way communicated with the backend.
 * 
 * You can use the `SessionProvider` as a lightweight client-side cart functionality. It’s not stored in any database or on the Medusa backend.
 * 
 * To use `SessionProvider`, you first have to insert it somewhere in your component tree below the {@link Providers.Medusa.MedusaProvider | MedusaProvider}. Then, in any of the child components, 
 * you can use the {@link useSessionCart} hook to get access to client-side cart item functionalities.
 * 
 * @param {SessionCartProviderProps} param0 - Props of the provider.
 * 
 * @example
 * ```tsx title="src/App.ts"
 * import { SessionProvider, MedusaProvider } from "medusa-react"
 * import Storefront from "./Storefront"
 * import { QueryClient } from "@tanstack/react-query"
 * import React from "react"
 * 
 * const queryClient = new QueryClient()
 * 
 * const App = () => {
 *   return (
 *     <MedusaProvider
 *       queryClientProviderProps={{ client: queryClient }}
 *       baseUrl="http://localhost:9000"
 *     >
 *       <SessionProvider>
 *         <Storefront />
 *       </SessionProvider>
 *     </MedusaProvider>
 *   )
 * }
 * 
 * export default App
 * ```
 * 
 * @customNamespace Providers.Session Cart
 */
export const SessionCartProvider = ({
  initialState = defaultInitialState,
  children,
}: SessionCartProviderProps) => {
  const [saved, save] = useLocalStorage(
    "medusa-session-cart",
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

  const clearItems = () => {
    dispatch({
      type: ACTION_TYPES.CLEAR_ITEMS,
    })
  }

  return (
    <SessionCartContext.Provider
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
        clearItems,
      }}
    >
      {children}
    </SessionCartContext.Provider>
  )
}

/**
 * This hook exposes the context of {@link SessionCartProvider}.
 * 
 * @example
 * The following example assumes that you've added `SessionCartProvider` previously in the React components tree:
 * 
 * ```tsx title="src/Products.ts"
 * const Products = () => {
 *   const { addItem } = useSessionCart()
 *   // ...
 * 
 *   function addToCart(variant: ProductVariant) {
 *     addItem({
 *       variant: variant,
 *       quantity: 1,
 *     })
 *   }
 * }
 * ```
 * 
 * @customNamespace Providers.Session Cart
 */
export const useSessionCart = () => {
  const context = useContext(SessionCartContext)
  if (!context) {
    throw new Error(
      "useSessionCart should be used as a child of SessionCartProvider"
    )
  }
  return context
}
