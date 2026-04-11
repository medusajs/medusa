import React from "react"
import { BrowserProvider } from "../../providers/BrowserProvider"
import { ColorModeProvider } from "../../providers/ColorMode"
import {
  LayoutProvider,
  type LayoutProviderProps,
} from "../../providers/Layout"
import { MobileProvider } from "../../providers/Mobile"
import { ModalProvider } from "../../providers/Modal"

type RootProvidersProps = {
  children: React.ReactNode
  layoutProviderProps?: Omit<LayoutProviderProps, "children">
}

export const RootProviders = ({
  children,
  layoutProviderProps = {},
}: RootProvidersProps) => {
  return (
    <BrowserProvider>
      <MobileProvider>
        <LayoutProvider {...layoutProviderProps}>
          <ColorModeProvider>
            <ModalProvider>{children}</ModalProvider>
          </ColorModeProvider>
        </LayoutProvider>
      </MobileProvider>
    </BrowserProvider>
  )
}
