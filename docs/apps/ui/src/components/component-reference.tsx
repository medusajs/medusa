import { Documentation } from "react-docgen"
import { Suspense } from "react"
import { Spinner } from "@medusajs/icons"
import { PropTable } from "./props-table"
import { Container, clx } from "@medusajs/ui"
import { Feedback } from "./feedback"
import { MarkdownContent } from "docs-ui"
import { components } from "./mdx-components"

type ComponentReferenceProps = {
  mainComponent: string
  componentsToShow?: string[]
  specsSrc?: string
}

const ComponentReference = ({
  mainComponent,
  componentsToShow = [mainComponent],
  specsSrc,
}: ComponentReferenceProps) => {
  if (!specsSrc) {
    return <></>
  }

  const specs = JSON.parse(specsSrc) as Documentation[]

  return (
    <>
      {componentsToShow.map((component, index) => {
        const componentSpec = specs?.find(
          (spec) => spec.displayName === component
        )
        const hasProps =
          componentSpec?.props && Object.keys(componentSpec.props).length > 0
        return (
          <Suspense
            fallback={
              <div className="text-medusa-fg-muted flex flex-1 items-center justify-center">
                <Spinner className="animate-spin" />
              </div>
            }
            key={index}
          >
            {componentSpec && (
              <>
                {componentsToShow.length > 1 && (
                  <h3 className={clx("h3-docs mb-2 mt-10 text-medusa-fg-base")}>
                    {componentSpec.displayName || component}
                  </h3>
                )}
                {componentSpec.description && (
                  <MarkdownContent components={components}>
                    {componentSpec.description}
                  </MarkdownContent>
                )}
                {hasProps && (
                  <>
                    <Container className="mb-6 mt-8 overflow-hidden p-0">
                      <Suspense
                        fallback={
                          <div className="text-medusa-fg-muted flex flex-1 items-center justify-center">
                            <Spinner className="animate-spin" />
                          </div>
                        }
                      >
                        <PropTable props={componentSpec.props!} />
                      </Suspense>
                    </Container>
                    <Feedback title={`props of ${component}`} />
                  </>
                )}
              </>
            )}
          </Suspense>
        )
      })}
    </>
  )
}

export { ComponentReference }
