"use client"

import * as React from "react"
import { I18nProvider as Primitive, I18nProviderProps as Props } from "react-aria"

interface I18nProviderProps extends Props {}

const I18nProvider = (props: I18nProviderProps) => {
  return <Primitive {...props} />
}

export { I18nProvider }
