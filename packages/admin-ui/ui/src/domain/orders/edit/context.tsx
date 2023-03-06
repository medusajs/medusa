import React, { createContext, PropsWithChildren, useEffect } from "react"
import { useAdminOrderEdits } from "medusa-react"
import { OrderEdit } from "@medusajs/medusa"

import useToggleState from "../../../hooks/use-toggle-state"

export type IOrderEditContext = {
  showModal: () => void
  hideModal: () => void

  isModalVisible: boolean

  activeOrderEditId?: string
  setActiveOrderEdit: (orderEditId?: string) => string

  orderEdits?: OrderEdit[]
}

let activeId = undefined

// @ts-ignore
export const OrderEditContext = createContext<IOrderEditContext>({})

type OrderEditProviderProps = PropsWithChildren<{ orderId: string }>

function OrderEditProvider(props: OrderEditProviderProps) {
  const { orderId } = props
  const [isModalVisible, showModal, hideModal] = useToggleState(false)

  // TODO: sort by created_at
  const { order_edits, count } = useAdminOrderEdits({
    order_id: orderId,
    //limit: count, // TODO
  })

  useEffect(() => {
    if (!isModalVisible) {
      activeId = undefined
    }
  }, [isModalVisible])

  const value = {
    isModalVisible,
    showModal,
    hideModal,
    orderEdits: order_edits,
    activeOrderEditId: activeId,
    setActiveOrderEdit: (id: string | undefined) => (activeId = id),
  }

  return <OrderEditContext.Provider value={value} children={props.children} />
}

export default OrderEditProvider
