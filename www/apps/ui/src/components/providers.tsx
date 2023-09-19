"use client"

import {
  ColorModeProvider,
  MobileProvider,
  ModalProvider,
  NavbarProvider,
} from "docs-ui"
import SearchProvider from "./search-provider"

type ProvidersProps = {
  children: React.ReactNode
}

const Providers = ({ children }: ProvidersProps) => {
  return (
    <MobileProvider>
      <ColorModeProvider>
        <ModalProvider>
          <NavbarProvider basePath={process.env.NEXT_PUBLIC_BASE_PATH}>
            <SearchProvider>{children}</SearchProvider>
          </NavbarProvider>
        </ModalProvider>
      </ColorModeProvider>
    </MobileProvider>
  )
}

export { Providers }
