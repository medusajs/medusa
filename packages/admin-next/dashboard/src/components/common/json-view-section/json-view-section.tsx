import { ArrowsPointingOut, XMarkMini } from "@medusajs/icons"
import {
  Badge,
  Container,
  Drawer,
  Heading,
  IconButton,
  Kbd,
} from "@medusajs/ui"
import Primitive from "@uiw/react-json-view"
import { CSSProperties, Suspense } from "react"
import { useTranslation } from "react-i18next"

type JsonViewSectionProps = {
  data: object
  root?: string
  title?: string
}

// TODO: Fix the positioning of the copy btn
export const JsonViewSection = ({
  data,
  root,
  title = "JSON",
}: JsonViewSectionProps) => {
  const { t } = useTranslation()
  const numberOfKeys = Object.keys(data).length

  return (
    <Container className="flex items-center justify-between px-6 py-4">
      <div className="flex items-center gap-x-4">
        <Heading level="h2">{title}</Heading>
        <Badge size="2xsmall">{numberOfKeys} keys</Badge>
      </div>
      <Drawer>
        <Drawer.Trigger asChild>
          <IconButton
            size="small"
            variant="transparent"
            className="text-ui-fg-subtle"
          >
            <ArrowsPointingOut />
          </IconButton>
        </Drawer.Trigger>
        <Drawer.Content className="border-ui-code-border bg-ui-code-bg-base text-ui-code-fg-subtle dark overflow-hidden border shadow-none max-md:inset-x-2 max-md:max-w-[calc(100%-16px)]">
          <div className="bg-ui-code-bg-base border-ui-code-border flex items-center justify-between border-b px-6 py-4">
            <div className="flex items-center gap-x-4">
              <Heading className="text-ui-code-fg-base">{title}</Heading>
              <Badge size="2xsmall">{numberOfKeys} keys</Badge>
            </div>
            <div className="flex items-center gap-x-2">
              <Kbd>esc</Kbd>
              <Drawer.Close asChild>
                <IconButton
                  size="small"
                  variant="transparent"
                  className="text-ui-fg-subtle"
                >
                  <XMarkMini />
                </IconButton>
              </Drawer.Close>
            </div>
          </div>
          <Drawer.Body className="overflow-auto p-4">
            <Suspense fallback={<div>Loading...</div>}>
              <Primitive
                value={data}
                displayDataTypes={false}
                keyName={root}
                style={
                  {
                    "--w-rjv-font-family": "Roboto Mono, monospace",
                    "--w-rjv-line-color": "var(--code-border)",
                    "--w-rjv-curlybraces-color": "rgb(255,255,255)",
                    "--w-rjv-key-string": "rgb(247,208,25)",
                    "--w-rjv-info-color": "var(--code-fg-muted)",
                    "--w-rjv-type-string-color": "rgb(73,209,110)",
                    "--w-rjv-quotes-string-color": "rgb(73,209,110)",
                    "--w-rjv-type-boolean-color": "rgb(187,77,96)",
                    "--w-rjv-type-int-color": "rgb(247,208,25)",
                    "--w-rjv-type-float-color": "rgb(247,208,25)",
                    "--w-rjv-type-bigint-color": "rgb(247,208,25)",
                    "--w-rjv-key-number": "rgb(247,208,25)",
                    "--w-rjv-arrow-color": "rgb(255,255,255)",
                    "--w-rjv-copied-color": "var(--code-fg-subtle)",
                    "--w-rjv-copied-success-color": "var(--code-fg-base)",
                    "--w-rjv-colon-color": "rgb(255,255,255)",
                  } as CSSProperties
                }
                collapsed={1}
              >
                <Primitive.Quote render={() => <span />} />
                <Primitive.Null
                  render={() => (
                    <span className="text-ui-tag-red-text">null</span>
                  )}
                />
                <Primitive.Undefined
                  render={() => (
                    <span className="text-ui-code-fg-muted">undefined</span>
                  )}
                />
                <Primitive.CountInfo
                  render={(_props, { value }) => {
                    return (
                      <span className="text-ui-tag-neutral-text ml-2">
                        {t("general.items", {
                          count: Object.keys(value as object).length,
                        })}
                      </span>
                    )
                  }}
                />
                {/* <Primitive.Arrow>
                  <TriangleDownMini className="text-ui-code-fg-subtle -ml-[3px]" />
                </Primitive.Arrow> */}
                <Primitive.Colon>
                  <span className="mr-1">:</span>
                </Primitive.Colon>
              </Primitive>
            </Suspense>
          </Drawer.Body>
        </Drawer.Content>
      </Drawer>
    </Container>
  )
}
