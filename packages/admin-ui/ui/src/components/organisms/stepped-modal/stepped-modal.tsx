import clsx from "clsx"
import React, { PropsWithChildren, ReactNode, useReducer } from "react"
import { Button } from "../../atoms/button"
import { ILayeredModalContext, LayeredModal } from "../layered-modal"
import { Modal, ModalProps } from "../modal"

enum SteppedActions {
  ENABLENEXTPAGE,
  DISABLENEXTPAGE,
  GOTONEXTPAGE,
  GOTOPREVIOUSPAGE,
  SETPAGE,
  SUBMIT,
  RESET,
}

type SteppedAction = {
  type: SteppedActions
  payload?: number
}

type ISteppedContext = {
  currentStep: number
  nextStepEnabled: boolean
  enableNextPage: () => void
  disableNextPage: () => void
  goToNextPage: () => void
  goToPreviousPage: () => void
  submit: () => void
  reset: () => void
  setPage: (page: number) => void
}

const defaultContext: ISteppedContext = {
  currentStep: 0,
  nextStepEnabled: true,
  enableNextPage: () => {},
  disableNextPage: () => {},
  goToNextPage: () => {},
  goToPreviousPage: () => {},
  submit: () => {},
  reset: () => {},
  setPage: (page) => {},
}

const SteppedContext = React.createContext(defaultContext)

const reducer = (state: ISteppedContext, action: SteppedAction) => {
  switch (action.type) {
    case SteppedActions.ENABLENEXTPAGE: {
      return { ...state, nextStepEnabled: true }
    }
    case SteppedActions.DISABLENEXTPAGE: {
      return { ...state, nextStepEnabled: false }
    }
    case SteppedActions.GOTONEXTPAGE: {
      return { ...state, currentStep: state.currentStep + 1 }
    }
    case SteppedActions.GOTOPREVIOUSPAGE: {
      return { ...state, currentStep: Math.max(0, state.currentStep - 1) }
    }
    case SteppedActions.SETPAGE: {
      return {
        ...state,
        currentStep:
          action.payload && action.payload > 0
            ? action.payload
            : state.currentStep,
      }
    }
    case SteppedActions.SUBMIT: {
      return { ...state }
    }
    case SteppedActions.RESET: {
      return { ...state, currentStep: 0, nextStepEnabled: true }
    }
  }
}

type SteppedProps = {
  context: ISteppedContext
  title: string
  onSubmit: () => void
  lastScreenIsSummary?: boolean
  steps: ReactNode[]
  layeredContext?: ILayeredModalContext
} & ModalProps

export const SteppedProvider = ({ children }: PropsWithChildren) => {
  const [state, dispatch] = useReducer(reducer, defaultContext)

  return (
    <SteppedContext.Provider
      value={{
        ...state,
        enableNextPage: () => {
          dispatch({ type: SteppedActions.ENABLENEXTPAGE })
        },
        disableNextPage: () => {
          dispatch({ type: SteppedActions.DISABLENEXTPAGE })
        },
        goToNextPage: () => {
          dispatch({ type: SteppedActions.GOTONEXTPAGE })
        },
        goToPreviousPage: () => {
          dispatch({ type: SteppedActions.GOTOPREVIOUSPAGE })
        },
        submit: () => {
          dispatch({ type: SteppedActions.SUBMIT })
        },
        setPage: (page: number) => {
          dispatch({ type: SteppedActions.SETPAGE, payload: page })
        },
        reset: () => {
          dispatch({ type: SteppedActions.RESET })
        },
      }}
    >
      {children}
    </SteppedContext.Provider>
  )
}

export const SteppedModal = ({
  context,
  steps,
  layeredContext,
  title,
  onSubmit,
  lastScreenIsSummary = false,
  handleClose,
  isLargeModal = true,
}: SteppedProps) => {
  const resetAndClose = () => {
    context.reset()
    handleClose()
  }

  const resetAndSubmit = () => {
    onSubmit()
  }
  return (
    <ModalElement
      layeredContext={layeredContext}
      isLargeModal={isLargeModal}
      handleClose={resetAndClose}
    >
      <Modal.Body
        className={clsx(
          "flex max-h-full flex-col justify-between transition-transform duration-100"
        )}
      >
        <Modal.Header handleClose={resetAndClose}>
          <div className="flex flex-col">
            <h2 className="inter-xlarge-semibold">{title}</h2>
            {!lastScreenIsSummary ||
              (lastScreenIsSummary &&
                context.currentStep !== steps.length - 1 && (
                  <div className="flex items-center">
                    <span className="text-grey-50 inter-small-regular mr-4 w-[70px]">{`Step ${
                      context.currentStep + 1
                    } of ${steps.length}`}</span>
                    {steps.map((_, i) => (
                      <span
                        key={i}
                        className={clsx(
                          "mr-3 h-2 w-2 rounded-full",
                          {
                            "bg-grey-20": i > context.currentStep,
                            "bg-violet-60": context.currentStep >= i,
                          },
                          {
                            "outline-violet-20 outline outline-4":
                              context.currentStep === i,
                          }
                        )}
                      />
                    ))}
                  </div>
                ))}
          </div>
        </Modal.Header>
        <Modal.Content>{steps[context.currentStep]}</Modal.Content>
      </Modal.Body>
      <Modal.Footer>
        <div className="gap-x-xsmall flex w-full justify-end">
          <Button
            variant="ghost"
            size="small"
            disabled={context.currentStep === 0}
            onClick={() => context.goToPreviousPage()}
            className="w-[112px]"
          >
            Back
          </Button>
          <Button
            variant="primary"
            size="small"
            disabled={!context.nextStepEnabled}
            onClick={() =>
              context.currentStep === steps.length - 1
                ? resetAndSubmit()
                : context.goToNextPage()
            }
            className="w-[112px]"
          >
            {context.currentStep === steps.length - 1 ? "Submit" : "Next"}
          </Button>
        </div>
      </Modal.Footer>
    </ModalElement>
  )
}

type ModalElementProps = ModalProps & {
  layeredContext?: ILayeredModalContext
}

const ModalElement = ({
  handleClose,
  isLargeModal = true,
  children,
  layeredContext,
}: ModalElementProps) =>
  layeredContext ? (
    <LayeredModal
      context={layeredContext}
      handleClose={handleClose}
      isLargeModal={isLargeModal}
    >
      {children}
    </LayeredModal>
  ) : (
    <Modal handleClose={handleClose} isLargeModal={isLargeModal}>
      {children}
    </Modal>
  )

export const useSteppedModal = () => {
  const context = React.useContext(SteppedContext)

  if (!context) {
    throw new Error(
      "useSteppedModal must be used within a SteppedModalProvider"
    )
  }

  return context
}
