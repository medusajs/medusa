import useIsBrowser from "@docusaurus/useIsBrowser"
import { getLearningPath } from "@site/src/utils/learning-paths"
import React, { createContext, useContext, useEffect, useState } from "react"
import { useHistory } from "@docusaurus/router"
import { LearningPathFinishType } from "@site/src/components/LearningPath/Finish"
import { useAnalytics } from "docs-ui"

export type LearningPathType = {
  name: string
  label: string
  description?: string
  steps: LearningPathStepType[]
  finish?: LearningPathFinishType
  notificationId?: string
}

export type LearningPathStepType = {
  title?: string
  description?: string
  descriptionJSX?: JSX.Element
  path?: string
}

export type LearningPathContextType = {
  path?: LearningPathType
  setPath: (value: LearningPathType) => void
  currentStep: number
  setCurrentStep: (value: number) => void
  startPath: (path: LearningPathType) => void
  updatePath: (data: Pick<LearningPathType, "notificationId">) => void
  endPath: () => void
  nextStep: () => void
  hasNextStep: () => boolean
  previousStep: () => void
  hasPreviousStep: () => boolean
  goToStep: (stepIndex: number) => void
  isCurrentPath: () => boolean
  goToCurrentPath: () => void
}

type LearningPathProviderProps = {
  children?: React.ReactNode
}

const LearningPathContext = createContext<LearningPathContextType | null>(null)

const LearningPathProvider: React.FC<LearningPathProviderProps> = ({
  children,
}) => {
  const [path, setPath] = useState<LearningPathType | null>(null)
  const [currentStep, setCurrentStep] = useState(-1)
  const isBrowser = useIsBrowser()
  const history = useHistory()
  const { track } = useAnalytics()

  const startPath = (path: LearningPathType) => {
    setPath(path)
    setCurrentStep(-1)
    if (isBrowser) {
      localStorage.setItem(
        "learning-path",
        JSON.stringify({
          pathName: path.name,
          currentStep: -1,
        })
      )
    }

    track(`learning_path_${path.name}`, {
      url: history.location.pathname,
      state: `start`,
    })
  }

  useEffect(() => {
    if (path && currentStep === -1) {
      nextStep()
    }
  }, [path])

  const endPath = () => {
    const didFinish = currentStep === path.steps.length - 1
    const reachedIndex = currentStep === -1 ? 0 : currentStep
    track(`learning_path_${path.name}`, {
      url: history.location.pathname,
      state: !didFinish ? `closed` : `end`,
      reachedStep:
        path.steps[reachedIndex]?.title ||
        path.steps[reachedIndex]?.description ||
        path.steps[reachedIndex]?.descriptionJSX ||
        reachedIndex,
    })
    setPath(null)
    setCurrentStep(-1)
    if (isBrowser) {
      localStorage.removeItem("learning-path")
    }
  }

  const hasNextStep = () => currentStep !== path?.steps.length - 1

  const nextStep = () => {
    if (!path || !hasNextStep()) {
      return
    }
    const nextStepIndex = currentStep + 1
    setCurrentStep(nextStepIndex)
    const newPath = path.steps[nextStepIndex].path
    if (isBrowser) {
      localStorage.setItem(
        "learning-path",
        JSON.stringify({
          pathName: path.name,
          currentStep: nextStepIndex,
        })
      )
    }
    if (history.location.pathname !== newPath) {
      history.push(newPath)
    }
  }

  const hasPreviousStep = () => currentStep > 0

  const previousStep = () => {
    if (!path || !hasPreviousStep()) {
      return
    }

    const previousStepIndex = currentStep - 1
    setCurrentStep(previousStepIndex)
    const newPath = path.steps[previousStepIndex].path
    if (isBrowser) {
      localStorage.setItem(
        "learning-path",
        JSON.stringify({
          pathName: path.name,
          currentStep: previousStepIndex,
        })
      )
    }
    if (history.location.pathname !== newPath) {
      history.push(newPath)
    }
  }

  const goToStep = (stepIndex: number) => {
    if (!path || stepIndex >= path.steps.length) {
      return
    }

    setCurrentStep(stepIndex)
    const newPath = path.steps[stepIndex].path
    if (isBrowser) {
      localStorage.setItem(
        "learning-path",
        JSON.stringify({
          pathName: path.name,
          currentStep: stepIndex,
        })
      )
    }
    if (history.location.pathname !== newPath) {
      history.push(newPath)
    }
  }

  const isCurrentPath = () => {
    if (!path || currentStep === -1) {
      return false
    }

    return history.location.pathname === path.steps[currentStep].path
  }

  const goToCurrentPath = () => {
    if (!path || currentStep === -1) {
      return
    }

    history.push(path.steps[currentStep].path)
  }

  const updatePath = (data: Pick<LearningPathType, "notificationId">) => {
    setPath({
      ...path,
      ...data,
    })
  }

  const initPath = () => {
    if (isBrowser) {
      // give query parameters higher precedence over local storage
      const queryPathName = new URLSearchParams(history.location.search).get(
        "path"
      )
      const queryPath = getLearningPath(queryPathName)
      if (queryPath) {
        startPath(queryPath)
      } else {
        const storedPath = localStorage.getItem("learning-path")
        if (storedPath) {
          const storedPathParsed = JSON.parse(storedPath)
          const currentPath = getLearningPath(storedPathParsed?.pathName)
          if (currentPath) {
            setPath(currentPath)
            setCurrentStep(storedPathParsed?.currentStep || 0)
          }
        }
      }
    }
  }

  useEffect(() => {
    if (isBrowser && !path) {
      initPath()
    }
  }, [isBrowser])

  return (
    <LearningPathContext.Provider
      value={{
        path,
        setPath,
        currentStep,
        setCurrentStep,
        startPath,
        updatePath,
        endPath,
        nextStep,
        hasNextStep,
        previousStep,
        hasPreviousStep,
        goToStep,
        isCurrentPath,
        goToCurrentPath,
      }}
    >
      {children}
    </LearningPathContext.Provider>
  )
}

export default LearningPathProvider

export const useLearningPath = () => {
  const context = useContext(LearningPathContext)

  if (!context) {
    throw new Error(
      "useLearningPath must be used within a LearningPathProvider"
    )
  }

  return context
}
