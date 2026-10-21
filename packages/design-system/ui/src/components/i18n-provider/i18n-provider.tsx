"use client"

import { Direction } from "radix-ui"
import * as React from "react"
import {
  I18nProvider as Primitive,
  I18nProviderProps as Props,
  useLocale,
} from "react-aria"

interface I18nProviderProps extends Props {}

const I18nProvider = ({ children, ...props }: I18nProviderProps) => {
  return (
    <Primitive {...props}>
      <DirectionProvider>{children}</DirectionProvider>
    </Primitive>
  )
}

const DirectionProvider = ({ children }: React.PropsWithChildren) => {
  const { direction } = useLocale()

  return <Direction.Provider dir={direction}>{children}</Direction.Provider>
}

export { I18nProvider }
