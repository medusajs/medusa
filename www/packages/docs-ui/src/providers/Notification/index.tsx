"use client"

import React, { createContext, useContext, useMemo, useReducer } from "react"
import { NotificationItemProps, NotificationContainer } from "@/components"
import uuid from "react-uuid"

export type NotificationItemType = {
  id?: string
} & NotificationItemProps

export type NotificationContextType = {
  notifications: NotificationItemType[]
  addNotification: (value: NotificationItemType) => void
  generateId: () => string
  removeNotification: (id: string) => void
  updateNotification: (
    id: string,
    updatedData: Partial<Omit<NotificationItemType, "id">>
  ) => void
}

export enum NotificationReducerActionTypes {
  ADD = "add",
  REMOVE = "remove",
  UPDATE = "update",
}

export type NotificationReducerAction =
  | {
      type: NotificationReducerActionTypes.ADD
      notification: NotificationItemType
    }
  | {
      type: NotificationReducerActionTypes.REMOVE
      id: string
    }
  | {
      type: NotificationReducerActionTypes.UPDATE
      id: string
      updatedData: Partial<Omit<NotificationItemType, "id">>
    }

const notificationReducer = (
  state: NotificationItemType[],
  action: NotificationReducerAction
) => {
  switch (action.type) {
    case NotificationReducerActionTypes.ADD:
      return [...state, action.notification]
    case NotificationReducerActionTypes.REMOVE:
      return state.filter((notification) => notification.id !== action.id)
    case NotificationReducerActionTypes.UPDATE:
      return state.map((notification) => {
        if (notification.id === action.id) {
          return {
            ...notification,
            ...action.updatedData,
          }
        }

        return notification
      })
    default:
      return state
  }
}

const NotificationContext = createContext<NotificationContextType | null>(null)

export type NotificationProviderProps = {
  children?: React.ReactNode
  initial?: NotificationItemType[]
}

export const NotificationProvider = ({
  children,
  initial = [],
}: NotificationProviderProps) => {
  const generateId = () => uuid()

  const normalizedInitial = useMemo(() => {
    return initial.map((notif) => ({
      id: generateId(),
      ...notif,
    }))
  }, [initial])

  const [notifications, dispatch] = useReducer(
    notificationReducer,
    normalizedInitial
  )

  const addNotification = (notification: NotificationItemType) => {
    if (!notification.id) {
      notification.id = generateId()
    }
    dispatch({
      type: NotificationReducerActionTypes.ADD,
      notification,
    })
  }

  const updateNotification = (
    id: string,
    updatedData: Partial<Omit<NotificationItemType, "id">>
  ) => {
    dispatch({
      type: NotificationReducerActionTypes.UPDATE,
      id,
      updatedData,
    })
  }

  const removeNotification = (id: string) => {
    dispatch({
      type: NotificationReducerActionTypes.REMOVE,
      id,
    })
  }

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        addNotification,
        generateId,
        removeNotification,
        updateNotification,
      }}
    >
      {children}
      <NotificationContainer />
    </NotificationContext.Provider>
  )
}

export const useNotifications = (
  suppressError?: boolean
): NotificationContextType | null => {
  const context = useContext(NotificationContext)

  if (!context && !suppressError) {
    throw new Error(
      "useNotifications must be used within a NotificationProvider"
    )
  }

  return context
}
