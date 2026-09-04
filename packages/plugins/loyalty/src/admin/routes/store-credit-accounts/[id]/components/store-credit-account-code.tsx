import { Container } from "@medusajs/ui"

import { Share } from "@medusajs/icons"
import { Header } from "../../../../components/header"

function StoreCreditAccountCodeSection({ code }: { code?: string }) {
  if (!code) {
    return null
  }

  return (
    <Container className="p-0">
      <Header title="Account Code" />

      <div className="mb-2 flex items-center gap-x-4 px-6">
        <Share className="inline" />
        <div className="text-ui-fg-subtle text-sm">{code}</div>
      </div>
    </Container>
  )
}

export default StoreCreditAccountCodeSection
