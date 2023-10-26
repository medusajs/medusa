"use client"

import clsx from "clsx"
import { useEffect, useRef } from "react"

export type SectionProps = {
  addToSidebar?: boolean
} & React.AllHTMLAttributes<HTMLDivElement>

const Section = ({ children, className }: SectionProps) => {
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if ("scrollRestoration" in history) {
      // disable scroll on refresh
      history.scrollRestoration = "manual"
    }
  }, [])

  return (
    <div
      ref={sectionRef}
      className={clsx("[&_ul]:list-disc [&_ul]:px-1", "[&_h2]:pt-7", className)}
    >
      {children}
    </div>
  )
}

export default Section
