"use client"

import React from "react"
import { useCurrentLearningPath } from "../../hooks/use-current-learning-path"
import { usePageScrollManager } from "../../hooks/use-page-scroll-manager"

type HooksLoaderProps = {
  options?: {
    pageScrollManager?: boolean
    currentLearningPath?: boolean
  }
  children?: React.ReactNode
}

export const HooksLoader = ({ children, options = {} }: HooksLoaderProps) => {
  const { pageScrollManager, currentLearningPath } = options
  // load any hooks that require providers to be loaded here.
  if (pageScrollManager) {
    usePageScrollManager()
  }
  if (currentLearningPath) {
    useCurrentLearningPath()
  }

  return <>{children}</>
}
