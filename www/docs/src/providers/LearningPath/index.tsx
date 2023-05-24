import useIsBrowser from "@docusaurus/useIsBrowser"
import { getLearningPath } from "@site/src/utils/learningPaths"
import React, { createContext, useContext, useEffect, useState } from "react"
import { useHistory } from "@docusaurus/router"

export type LearningPath = {
  name: string
  label: string
  steps: LearningPathStepType[]
}

export type LearningPathStepType = {
  title?: string
  description: string
  path?: string
}

export type LearningPathContextType = {
  path: LearningPath
  setPath: (value: LearningPath) => void
  currentStep: number
  setCurrentStep: (value: number) => void
  startPath: (path: LearningPath) => void
  endPath: () => void
  nextStep: () => void
  hasNextStep: () => boolean
  previousStep: () => void
  hasPreviousStep: () => boolean
}

type LearningPathProviderProps = {
  children?: React.ReactNode
}

const LearningPathContext = createContext<LearningPathContextType | null>(null)

const LearningPathProvider: React.FC<LearningPathProviderProps> = ({
  children,
}) => {
  const [path, setPath] = useState<LearningPath | null>(null)
  const [currentStep, setCurrentStep] = useState(-1)
  const isBrowser = useIsBrowser()
  const history = useHistory()

  const startPath = (path: LearningPath) => {
    setPath(path)
    if (isBrowser) {
      localStorage.setItem(
        "learning-path",
        JSON.stringify({
          pathName: path.name,
          currentStep,
        })
      )
    }
  }

  useEffect(() => {
    if (path && currentStep === -1) {
      nextStep()
    }
  }, [path])

  const endPath = () => {
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
    console.log(newPath, history.location.pathname)
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

  const initPath = () => {
    if (isBrowser) {
      const storedPath = localStorage.getItem("learning-path")
      if (storedPath) {
        const storedPathParsed = JSON.parse(storedPath)
        const currentPath = getLearningPath(storedPathParsed?.pathName)
        console.log(storedPathParsed)
        if (currentPath) {
          setPath(currentPath)
          setCurrentStep(storedPathParsed?.currentStep || 0)
        }
      }
    }
  }

  if (!path) {
    initPath()
  }

  return (
    <LearningPathContext.Provider
      value={{
        path,
        setPath,
        currentStep,
        setCurrentStep,
        startPath,
        endPath,
        nextStep,
        hasNextStep,
        previousStep,
        hasPreviousStep,
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
