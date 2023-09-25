"use client"

import { Spinner } from "@medusajs/icons"
import * as React from "react"
import { ExampleRegistry } from "../registries/example-registry"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/tabs"
import { Feedback } from "./feedback"
import clsx from "clsx"
import { CodeBlock } from "docs-ui"

interface ComponentExampleProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string
}

export function ComponentExample({
  children,
  name,
  ...props
}: ComponentExampleProps) {
  const Preview = React.useMemo(() => {
    const Component = ExampleRegistry[name]?.component

    if (!Component) {
      return <p>Component {name} not found in registry</p>
    }

    return <Component />
  }, [name])

  const CodeElement = children as React.ReactElement
  const Code = CodeElement.props.code

  return (
    <div className="relative my-4 flex flex-col space-y-2" {...props}>
      <Tabs defaultValue="preview" className="relative mr-auto w-full">
        <div className="flex flex-col items-center justify-between pb-3">
          <TabsList className="">
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="code">Code</TabsTrigger>
          </TabsList>
          <TabsContent value="preview" className="relative">
            <div
              className={clsx(
                "bg-docs-bg border-medusa-border-base flex max-h-[400px] min-h-[400px]",
                "dark:bg-docs-bg-dark dark:border-medusa-border-base-dark",
                "w-full items-center justify-center overflow-auto rounded-md border px-10 py-5"
              )}
            >
              <React.Suspense
                fallback={
                  <div className="text-medusa-fg-muted dark:text-medusa-fg-muted-dark flex items-center text-sm">
                    <Spinner className="animate-spin" />
                  </div>
                }
              >
                {Preview}
              </React.Suspense>
            </div>
          </TabsContent>
          <TabsContent value="code" className="relative ">
            <CodeBlock source={Code} lang="tsx" />
          </TabsContent>
        </div>
      </Tabs>
      <Feedback
        title={`example ${name}`}
        question="Was this example helpful?"
      />
    </div>
  )
}
