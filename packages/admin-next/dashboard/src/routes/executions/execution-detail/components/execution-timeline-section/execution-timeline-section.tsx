import { Container, Heading, Text, clx } from "@medusajs/ui"
import {
  BLUE_STATES,
  GRAY_STATES,
  GREEN_STATES,
  ORANGE_STATES,
  RED_STATES,
} from "../../../constants"
import { WorkflowExecutionDTO, WorkflowExecutionStep } from "../../../types"

type ExecutionTimelineSectionProps = {
  execution: WorkflowExecutionDTO
}

export const ExecutionTimelineSection = ({
  execution,
}: ExecutionTimelineSectionProps) => {
  return (
    <Container className="overflow-hidden px-0 pb-8 pt-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading level="h2">Timeline</Heading>
      </div>
      <div className="h-[156px] w-full overflow-hidden border-y">
        <Canvas execution={execution} />
      </div>
    </Container>
  )
}

const createNodeClusters = (steps: Record<string, WorkflowExecutionStep>) => {
  const actionableSteps = Object.values(steps).filter(
    (step) => step.id !== "_root"
  )

  const clusters: Record<number, WorkflowExecutionStep[]> = {}

  actionableSteps.forEach((step) => {
    if (!clusters[step.depth]) {
      clusters[step.depth] = []
    }

    clusters[step.depth].push(step)
  })

  return clusters
}

const getNextCluster = (
  clusters: Record<number, WorkflowExecutionStep[]>,
  depth: number
) => {
  const nextDepth = depth + 1
  return clusters[nextDepth]
}

const Canvas = ({ execution }: { execution: WorkflowExecutionDTO }) => {
  const clusteers = createNodeClusters(execution.execution?.steps || {})

  return (
    <div className="bg-ui-bg-subtle flex min-h-[156px] items-center justify-center bg-[radial-gradient(var(--border-base)_1.5px,transparent_0)] bg-[length:20px_20px] bg-repeat p-16">
      <div className="flex items-start">
        {Object.entries(clusteers).map(([depth, cluster]) => {
          const next = getNextCluster(clusteers, Number(depth))

          return (
            <div key={depth} className="flex items-start">
              <div className="flex flex-col justify-center gap-y-2">
                {cluster.map((step) => (
                  <Node key={step.id} step={step} />
                ))}
              </div>
              <Line next={next} />
            </div>
          )
        })}
      </div>
    </div>
  )
}

const HorizontalArrow = () => {
  return (
    <svg
      width="42"
      height="12"
      viewBox="0 0 42 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M41.5303 6.53033C41.8232 6.23744 41.8232 5.76256 41.5303 5.46967L36.7574 0.696699C36.4645 0.403806 35.9896 0.403806 35.6967 0.696699C35.4038 0.989593 35.4038 1.46447 35.6967 1.75736L39.9393 6L35.6967 10.2426C35.4038 10.5355 35.4038 11.0104 35.6967 11.3033C35.9896 11.5962 36.4645 11.5962 36.7574 11.3033L41.5303 6.53033ZM0.999996 5.25C0.585785 5.25 0.249996 5.58579 0.249996 6C0.249996 6.41421 0.585785 6.75 0.999996 6.75V5.25ZM41 5.25L0.999996 5.25V6.75L41 6.75V5.25Z"
        fill="var(--border-strong)"
      />
    </svg>
  )
}

const MiddleArrow = () => {
  return (
    <svg
      width="22"
      height="38"
      viewBox="0 0 22 38"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="-mt-[6px]"
    >
      <path
        d="M0.999878 32H0.249878V32.75H0.999878V32ZM21.5284 32.5303C21.8213 32.2374 21.8213 31.7626 21.5284 31.4697L16.7554 26.6967C16.4625 26.4038 15.9876 26.4038 15.6947 26.6967C15.4019 26.9896 15.4019 27.4645 15.6947 27.7574L19.9374 32L15.6947 36.2426C15.4019 36.5355 15.4019 37.0104 15.6947 37.3033C15.9876 37.5962 16.4625 37.5962 16.7554 37.3033L21.5284 32.5303ZM0.249878 0L0.249878 32H1.74988L1.74988 0H0.249878ZM0.999878 32.75L20.998 32.75V31.25L0.999878 31.25V32.75Z"
        fill="var(--border-strong)"
      />
    </svg>
  )
}

const EndArrow = () => {
  return (
    <svg
      width="22"
      height="38"
      viewBox="0 0 22 38"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="-mt-[6px]"
    >
      <path
        d="M21.5284 32.5303C21.8213 32.2374 21.8213 31.7626 21.5284 31.4697L16.7554 26.6967C16.4625 26.4038 15.9876 26.4038 15.6947 26.6967C15.4019 26.9896 15.4019 27.4645 15.6947 27.7574L19.9374 32L15.6947 36.2426C15.4019 36.5355 15.4019 37.0104 15.6947 37.3033C15.9876 37.5962 16.4625 37.5962 16.7554 37.3033L21.5284 32.5303ZM0.249878 0L0.249878 28H1.74988L1.74988 0H0.249878ZM4.99988 32.75L20.998 32.75V31.25L4.99988 31.25V32.75ZM0.249878 28C0.249878 30.6234 2.37653 32.75 4.99988 32.75V31.25C3.20495 31.25 1.74988 29.7949 1.74988 28H0.249878Z"
        fill="var(--border-strong)"
      />
    </svg>
  )
}

const Arrow = ({ depth }: { depth: number }) => {
  if (depth === 1) {
    return <HorizontalArrow />
  }

  if (depth === 2) {
    return (
      <div className="flex flex-col items-end">
        <HorizontalArrow />
        <EndArrow />
      </div>
    )
  }

  const inbetween = Array.from({ length: depth - 2 }).map((_, index) => (
    <MiddleArrow key={index} />
  ))

  return (
    <div className="flex flex-col items-end">
      <HorizontalArrow />
      {inbetween}
      <EndArrow />
    </div>
  )
}

const Line = ({ next }: { next?: WorkflowExecutionStep[] }) => {
  if (!next) {
    return null
  }

  return (
    <div className="-ml-[5px] -mr-[7px] w-[60px] pr-[7px]">
      <div className="flex min-h-[24px] w-full items-start">
        <div className="flex h-6 w-2.5 items-center justify-center">
          <div className="bg-ui-button-neutral shadow-borders-base size-2.5 shrink-0 rounded-full" />
        </div>
        <div className="pt-1.5">
          <Arrow depth={next.length} />
        </div>
      </div>
    </div>
  )
}

const Node = ({ step }: { step: WorkflowExecutionStep }) => {
  if (step.id === "_root") {
    return null
  }

  const name = step.id.split(".").pop()

  return (
    <div
      className="bg-ui-bg-base shadow-borders-base flex min-w-[120px] items-center gap-x-0.5 rounded-md p-0.5"
      data-step-id={step.id}
    >
      <div className="flex size-5 items-center justify-center">
        <div
          className={clx(
            "size-2 rounded-sm shadow-[inset_0_0_0_1px_rgba(0,0,0,0.12)]",
            {
              "bg-ui-tag-green-icon": GREEN_STATES.includes(step.invoke.state),
              "bg-ui-tag-blue-icon": BLUE_STATES.includes(step.invoke.state),
              "bg-ui-tag-orange-icon": ORANGE_STATES.includes(
                step.invoke.state
              ),
              "bg-ui-tag-red-icon": RED_STATES.includes(step.invoke.state),
              "bg-ui-tag-gray-icon": GRAY_STATES.includes(step.invoke.state),
            }
          )}
        />
      </div>
      <Text size="xsmall" leading="compact" weight="plus">
        {name}
      </Text>
    </div>
  )
}
