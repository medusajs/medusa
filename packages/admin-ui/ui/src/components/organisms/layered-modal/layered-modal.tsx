import clsx from "clsx"
import React, {
  PropsWithChildren,
  ReactNode,
  useContext,
  useReducer,
} from "react"
import { Button } from "../../atoms/button"
import { ArrowLeftIcon } from "../../icons"
import { Modal, ModalProps } from "../modal"

enum LayeredModalActions {
  PUSH,
  POP,
  RESET,
}

type LayeredModalAction = {
  type: LayeredModalActions
  payload?: LayeredModalScreen
}

export type LayeredModalScreen = {
  title: string
  subtitle?: string
  onBack: () => void
  onConfirm?: () => void
  view: ReactNode
}

export type ILayeredModalContext = {
  screens: LayeredModalScreen[]
  push: (screen: LayeredModalScreen) => void
  pop: () => void
  reset: () => void
}

const defaultContext: ILayeredModalContext = {
  screens: [],
  push: (screen) => {},
  pop: () => {},
  reset: () => {},
}

const LayeredModalContext = React.createContext(defaultContext)

function reducer(state: ILayeredModalContext, action: LayeredModalAction) {
  switch (action.type) {
    case LayeredModalActions.PUSH: {
      if (action.payload) {
        return { ...state, screens: [...state.screens, action.payload] }
      }

      return state
    }
    case LayeredModalActions.POP: {
      return {
        ...state,
        screens: state.screens.length > 1 ? state.screens.slice(0, -1) : [],
      }
    }
    case LayeredModalActions.RESET: {
      return { ...state, screens: [] }
    }
    default:
      return state
  }
}

export type LayeredModalProps = {
  context: ILayeredModalContext
} & ModalProps

export const LayeredModalProvider = ({ children }: PropsWithChildren) => {
  const [state, dispatch] = useReducer(reducer, defaultContext)

  return (
    <LayeredModalContext.Provider
      value={{
        ...state,
        push: (screen: LayeredModalScreen) => {
          dispatch({ type: LayeredModalActions.PUSH, payload: screen })
        },

        pop: () => {
          dispatch({ type: LayeredModalActions.POP })
        },

        reset: () => {
          dispatch({ type: LayeredModalActions.RESET })
        },
      }}
    >
      {children}
    </LayeredModalContext.Provider>
  )
}

export const LayeredModal = ({
  context,
  children,
  handleClose,
  open,
  isLargeModal = true,
}: LayeredModalProps) => {
  const emptyScreensAndClose = () => {
    context.reset()
    handleClose()
  }

  const screen = context.screens[context.screens.length - 1]
  return (
    <Modal
      open={open}
      isLargeModal={isLargeModal}
      handleClose={emptyScreensAndClose}
    >
      <Modal.Body
        className={clsx(
          "flex flex-col justify-between transition-transform duration-200",
          {
            "translate-x-0": typeof screen !== "undefined",
            "translate-x-full": typeof screen === "undefined",
          }
        )}
      >
        {screen ? (
          <>
            <Modal.Header handleClose={emptyScreensAndClose}>
              <div className="flex items-center">
                <Button
                  type="button"
                  variant="ghost"
                  size="small"
                  className="text-grey-50 h-8 w-8"
                  onClick={screen.onBack}
                >
                  <ArrowLeftIcon size={20} />
                </Button>
                <div className="gap-x-2xsmall flex items-center">
                  <h2 className="inter-xlarge-semibold ml-5">{screen.title}</h2>
                  {screen.subtitle && (
                    <span className="inter-xlarge-regular text-grey-50">
                      ({screen.subtitle})
                    </span>
                  )}
                </div>
              </div>
            </Modal.Header>
            {screen.view}
          </>
        ) : (
          <></>
        )}
      </Modal.Body>
      <div
        className={clsx("transition-transform duration-200", {
          "-translate-x-full": typeof screen !== "undefined",
        })}
      >
        <div
          className={clsx("transition-display", {
            "hidden opacity-0 delay-500": typeof screen !== "undefined",
          })}
        >
          {children}
        </div>
      </div>
    </Modal>
  )
}

export const useLayeredModal = () => {
  const context = useContext(LayeredModalContext)
  if (context === null) {
    throw new Error(
      "useLayeredModal must be used within a LayeredModalProvider"
    )
  }
  return context
}
