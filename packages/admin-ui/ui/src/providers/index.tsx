import { PropsWithChildren } from "react"
import { MedusaProvider } from "./medusa-provider"

const Providers = ({ children }: PropsWithChildren) => {
  return <MedusaProvider>{children}</MedusaProvider>
}

export default Providers
