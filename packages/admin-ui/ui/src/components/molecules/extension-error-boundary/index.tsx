import React, { ErrorInfo } from "react"

type WidgetInfo = {
  name: string
  origin: string
}

type Props = {
  children: React.ReactNode
  info: WidgetInfo
}

type State = {
  hasError: boolean
}

class ExtensionErrorBoundary extends React.Component<Props, State> {
  public state: State = {
    hasError: false,
  }

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return <Fallback info={this.props.info} />
    }

    return this.props.children
  }
}

const Fallback = ({ info }: { info: WidgetInfo }) => {
  return (
    <div>
      <h1>Something went wrong</h1>
      <p>
        The widget <strong>{info.name}</strong> from{" "}
        <strong>{info.origin}</strong> crashed.
      </p>
    </div>
  )
}

export default ExtensionErrorBoundary
