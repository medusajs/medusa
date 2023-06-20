import React, { createContext, useContext, useReducer } from "react"
import { NotificationItemProps } from "@site/src/components/Notification/Item"
import { v4 as uuid4 } from "uuid"
import NotificationContainer from "@site/src/components/Notification/Container"

export type NotificationItemType = {
  id?: string
} & NotificationItemProps

type NotificationContextType = {
  notifications: NotificationItemType[]
  addNotification: (value: NotificationItemType) => void
  generateId: () => string
  removeNotification: (id: string) => void
  updateNotification: (
    id: string,
    updatedData: Partial<Omit<NotificationItemType, "id">>
  ) => void
}

type NotificationProviderProps = {
  children?: React.ReactNode
}

enum NotificationReducerActionTypes {
  ADD = "add",
  REMOVE = "remove",
  UPDATE = "update",
}

type NotificationReducerAction =
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

const NotificationProvider: React.FC<NotificationProviderProps> = ({
  children,
}) => {
  const [notifications, dispatch] = useReducer(notificationReducer, [])

  const generateId = () => uuid4()

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

export default NotificationProvider

export const useNotifications = () => {
  const context = useContext(NotificationContext)

  if (!context) {
    console.warn("useNotifications must be used within a NotificationProvider")
  }

  return context
}
