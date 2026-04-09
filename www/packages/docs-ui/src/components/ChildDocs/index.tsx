"use client"

import React from "react"
import { useChildDocs, UseChildDocsProps } from "@/hooks/use-child-docs"

export const ChildDocs = (props: UseChildDocsProps) => {
  const { component } = useChildDocs(props)

  return <>{component}</>
}
