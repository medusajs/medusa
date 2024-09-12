import {
  Tracer as OTTracer,
  Span,
  trace,
  context,
  propagation,
} from "@opentelemetry/api"

/**
 * Tracer creates an instrumentation scope within the application
 * code. For example: You might create a tracer for the API
 * requests, another one for the modules, one for workflows
 * and so on.
 *
 * There is no need to create a Tracer instance per HTTP
 * call.
 */
export class Tracer {
  /**
   * Reference to the underlying OpenTelemetry tracer
   */
  #otTracer: OTTracer
  constructor(public name: string, public version?: string) {
    this.#otTracer = trace.getTracer(name, version)
  }

  /**
   * Returns the underlying tracer from open telemetry that
   * could be used directly for certain advanced use-cases
   */
  getOTTracer() {
    return this.#otTracer
  }

  /**
   * Trace a function call. Using this method will create a
   * child scope for the invocations within the callback.
   */
  trace<F extends (span: Span) => unknown>(
    name: string,
    callback: F
  ): ReturnType<F> {
    return this.#otTracer.startActiveSpan(name, callback)
  }

  /**
   * Returns the active context
   */
  getActiveContext() {
    return context.active()
  }

  /**
   * Returns the propagation state from the current active
   * context
   */
  getPropagationState() {
    let output = {}
    propagation.inject(context.active(), output)
    return output as { traceparent: string; tracestate?: string }
  }

  /**
   * Use the existing propogation state and trace an action. This
   * will allow the newly traced action to be part of some
   * existing trace
   */
  withPropagationState(state: { traceparent: string; tracestate?: string }) {
    return {
      trace: <F extends (span: Span) => unknown>(
        name: string,
        callback: F
      ): ReturnType<F> => {
        const activeContext = propagation.extract(context.active(), state)
        return this.#otTracer.startActiveSpan(name, {}, activeContext, callback)
      },
    }
  }
}
