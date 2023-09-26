import { Spinner } from "@medusajs/icons"
import { Container } from "@medusajs/ui"
import * as React from "react"

import { HookRegistry } from "@/registries/hook-registry"
import { Feedback } from "./feedback"

type HookValuesProps = {
  hook: string
}

const HookValues = ({ hook }: HookValuesProps) => {
  const Props = React.useMemo(() => {
    const Table = HookRegistry[hook]?.table

    if (!Table) {
      return (
        <div className="flex min-h-[200px] w-full items-center justify-center">
          <p className="txt-compact-small">
            No API reference found for{" "}
            <span className="txt-compact-small-plus">{hook}</span>
          </p>
        </div>
      )
    }

    return <Table />
  }, [hook])

  return (
    <>
      <Container className="mb-6 mt-8 overflow-hidden p-0">
        <React.Suspense
          fallback={
            <div className="text-medusa-fg-muted flex flex-1 items-center justify-center">
              <Spinner className="animate-spin" />
            </div>
          }
        >
          {Props}
        </React.Suspense>
      </Container>
      <Feedback title={`props of ${hook}`} />
    </>
  )
}

export { HookValues }
