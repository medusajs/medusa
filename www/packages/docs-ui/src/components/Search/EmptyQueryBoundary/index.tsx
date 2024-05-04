"use client"

import React from "react"
import { useInstantSearch } from "react-instantsearch"

export type SearchEmptyQueryBoundaryProps = {
  children: React.ReactNode
  fallback: React.ReactNode
}

export const SearchEmptyQueryBoundary = ({
  children,
  fallback,
}: SearchEmptyQueryBoundaryProps) => {
  const { indexUiState } = useInstantSearch()

  if (!indexUiState.query) {
    return <>{fallback}</>
  }

  return <>{children}</>
}
