import { useLearningPath } from "@/providers"
import React, { useCallback, useEffect, useRef, useState } from "react"
import { LearningPathStepActions } from "./Actions"
import clsx from "clsx"
import { IconCircleDottedLine } from "@/components/Icons"
import { CheckCircleSolid, CircleMiniSolid, ListBullet } from "@medusajs/icons"
import { Badge, Button, Link } from "@/components"
import { CSSTransition, SwitchTransition } from "react-transition-group"

type LearningPathStepsProps = {
  onFinish?: () => void
  onClose?: () => void
}

export const LearningPathSteps = ({ ...rest }: LearningPathStepsProps) => {
  const { path, currentStep, goToStep } = useLearningPath()
  const [collapsed, setCollapsed] = useState(false)
  const stepsRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const nodeRef: React.RefObject<HTMLElement> = collapsed ? buttonRef : stepsRef

  const handleScroll = useCallback(() => {
    if (window.scrollY > 100 && !collapsed) {
      // automatically collapse steps
      setCollapsed(true)
    } else if (
      (window.scrollY === 0 ||
        window.scrollY + window.innerHeight >= document.body.scrollHeight) &&
      collapsed
    ) {
      // automatically open steps
      setCollapsed(false)
    }
  }, [collapsed])

  useEffect(() => {
    window.addEventListener("scroll", handleScroll)

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [handleScroll])

  if (!path) {
    return <></>
  }

  return (
    <SwitchTransition>
      <CSSTransition
        key={collapsed ? "show_path" : "show_button"}
        nodeRef={nodeRef}
        timeout={300}
        addEndListener={(done) => {
          nodeRef.current?.addEventListener("transitionend", done, false)
        }}
        classNames={{
          enter: "animate-maximize animate-fast",
          exit: "animate-minimize animate-fast",
        }}
      >
        <>
          {!collapsed && (
            <div
              className={clsx(
                "bg-medusa-bg-base shadow-flyout dark:shadow-flyout-dark rounded",
                "transition-transform origin-bottom-right flex flex-col"
              )}
              ref={stepsRef}
            >
              <div className="overflow-auto basis-3/4">
                {path.steps.map((step, index) => (
                  <div
                    className={clsx(
                      "border-0 border-b border-solid border-medusa-border-base",
                      "relative p-docs_1"
                    )}
                    key={index}
                  >
                    <div
                      className={clsx("flex items-center gap-docs_1 relative")}
                    >
                      <div className="w-docs_2 flex-none flex items-center justify-center">
                        {index === currentStep && (
                          <IconCircleDottedLine
                            className={clsx(
                              "shadow-active dark:shadow-active-dark rounded-full",
                              "!text-ui-fg-interactive"
                            )}
                          />
                        )}
                        {index < currentStep && (
                          <CheckCircleSolid className="text-ui-fg-interactive" />
                        )}
                        {index > currentStep && (
                          <CircleMiniSolid className="text-ui-fg-subtle" />
                        )}
                      </div>
                      <span
                        className={clsx(
                          "text-compact-medium-plus text-medusa-fg-base"
                        )}
                      >
                        {step.title}
                      </span>
                      <Link
                        href={step.path}
                        className={clsx("absolute top-0 left-0 w-full h-full")}
                        onClick={(e) => {
                          e.preventDefault()
                          goToStep(index)
                        }}
                      />
                    </div>
                    {index === currentStep && (
                      <div className={clsx("flex items-center gap-docs_1")}>
                        <div className="w-docs_2 flex-none"></div>
                        <div
                          className={clsx(
                            "text-medium text-ui-fg-subtle mt-docs_1"
                          )}
                        >
                          {step.descriptionJSX ?? step.description}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <LearningPathStepActions setCollapsed={setCollapsed} {...rest} />
            </div>
          )}
          {collapsed && (
            <Button
              variant="secondary"
              className={clsx(
                "!p-[10px] !shadow-flyout dark:!shadow-flyout-dark !text-medusa-fg-subtle w-fit h-fit",
                "rounded-full border-0 mr-0 ml-auto fixed md:relative max-[767px]:bottom-docs_1 max-[767px]:right-docs_1 "
              )}
              onClick={() => setCollapsed(false)}
              buttonRef={buttonRef}
            >
              <ListBullet />
              <Badge
                variant="blue"
                className={clsx("absolute -top-docs_0.25 -right-docs_0.25")}
              >
                !
              </Badge>
            </Button>
          )}
        </>
      </CSSTransition>
    </SwitchTransition>
  )
}
