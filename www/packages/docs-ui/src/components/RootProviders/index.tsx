import React from "react"
import {
  BrowserProvider,
  ColorModeProvider,
  MobileProvider,
  ModalProvider,
} from "../../providers"

type RootProvidersProps = {
  children: React.ReactNode
}

export const RootProviders = ({ children }: RootProvidersProps) => {
  return (
    <BrowserProvider>
      <MobileProvider>
        <ColorModeProvider>
          <ModalProvider>{children}</ModalProvider>
        </ColorModeProvider>
      </MobileProvider>
    </BrowserProvider>
  )
}
