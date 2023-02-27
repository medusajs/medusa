import React, { createContext, ReactNode } from "react"

type SkeletonContextType = {
  isLoading?: boolean
}

const SkeletonContext = createContext<SkeletonContextType>({
  isLoading: false,
})

type Props = {
  children?: ReactNode
  isLoading?: boolean
}

export const SkeletonProvider = ({ children, isLoading }: Props) => {
  return (
    <SkeletonContext.Provider
      value={{
        isLoading,
      }}
    >
      {children}
    </SkeletonContext.Provider>
  )
}

export const useSkeleton = () => {
  const { isLoading } = React.useContext(SkeletonContext)

  return { isLoading }
}
