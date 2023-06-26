import React from "react"
import ApiDoc from "@theme-original/ApiDoc"
import type { ApiDocProps } from "@theme-original/ApiDoc"
import type { WrapperProps } from "@docusaurus/types"
import UserProvider from "@site/src/providers/User"

type Props = WrapperProps<typeof ApiDocProps>

export default function ApiDocWrapper(props: Props): JSX.Element {
  return (
    <>
      <UserProvider>
        <ApiDoc {...props} />
      </UserProvider>
    </>
  )
}
