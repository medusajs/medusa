import {
  TransactionStepsDefinition,
  TransactionStepStatus,
  TransactionState,
  TransactionHandlerType,
  TransactionPayload,
} from "."

export type TransactionStepHandler = (
  actionId: string,
  handlerType: TransactionHandlerType,
  payload: TransactionPayload
) => Promise<unknown>

/**
 * @class TransactionStep
 * @classdesc A class representing a single step in a transaction flow
 */
export class TransactionStep {
  /**
   * @member id - The id of the step
   * @member depth - The depth of the step in the flow
   * @member definition - The definition of the step
   * @member invoke - The current state and status of the invoke action of the step
   * @member compensate - The current state and status of the compensate action of the step
   * @member attempts - The number of attempts made to execute the step
   * @member failures - The number of failures encountered while executing the step
   * @member lastAttempt - The timestamp of the last attempt made to execute the step
   * @member next - The ids of the next steps in the flow
   * @member saveResponse - A flag indicating if the response of a step should be shared in the transaction context and available to subsequent steps - default is false
   */
  private stepFailed = false
  id: string
  depth: number
  definition: TransactionStepsDefinition
  invoke: {
    state: TransactionState
    status: TransactionStepStatus
  }
  compensate: {
    state: TransactionState
    status: TransactionStepStatus
  }
  attempts: number
  failures: number
  lastAttempt: number | null
  next: string[]
  saveResponse: boolean

  public getStates() {
    return this.isCompensating() ? this.compensate : this.invoke
  }

  public beginCompensation() {
    if (this.isCompensating()) {
      return
    }

    this.stepFailed = true
    this.attempts = 0
    this.failures = 0
    this.lastAttempt = null
  }

  public isCompensating() {
    return this.stepFailed
  }

  public changeState(toState: TransactionState) {
    const allowed = {
      [TransactionState.DORMANT]: [TransactionState.NOT_STARTED],
      [TransactionState.NOT_STARTED]: [
        TransactionState.INVOKING,
        TransactionState.COMPENSATING,
        TransactionState.FAILED,
        TransactionState.SKIPPED,
      ],
      [TransactionState.INVOKING]: [
        TransactionState.FAILED,
        TransactionState.DONE,
      ],
      [TransactionState.COMPENSATING]: [
        TransactionState.REVERTED,
        TransactionState.FAILED,
      ],
      [TransactionState.DONE]: [TransactionState.COMPENSATING],
    }

    const curState = this.getStates()
    if (
      curState.state === toState ||
      allowed?.[curState.state]?.includes(toState)
    ) {
      curState.state = toState
      return
    }

    throw new Error(
      `Updating State from "${curState.state}" to "${toState}" is not allowed.`
    )
  }

  public changeStatus(toStatus: TransactionStepStatus) {
    const allowed = {
      [TransactionStepStatus.WAITING]: [
        TransactionStepStatus.OK,
        TransactionStepStatus.TEMPORARY_FAILURE,
        TransactionStepStatus.PERMANENT_FAILURE,
      ],
      [TransactionStepStatus.TEMPORARY_FAILURE]: [
        TransactionStepStatus.IDLE,
        TransactionStepStatus.PERMANENT_FAILURE,
      ],
      [TransactionStepStatus.PERMANENT_FAILURE]: [TransactionStepStatus.IDLE],
    }

    const curState = this.getStates()
    if (
      curState.status === toStatus ||
      toStatus === TransactionStepStatus.WAITING ||
      allowed?.[curState.status]?.includes(toStatus)
    ) {
      curState.status = toStatus
      return
    }

    throw new Error(
      `Updating Status from "${curState.status}" to "${toStatus}" is not allowed.`
    )
  }

  canRetry(): boolean {
    return !!(
      this.lastAttempt &&
      this.definition.retryInterval &&
      Date.now() - this.lastAttempt > this.definition.retryInterval * 1e3
    )
  }

  canInvoke(flowState: TransactionState): boolean {
    const { status, state } = this.getStates()
    return (
      (!this.isCompensating() &&
        state === TransactionState.NOT_STARTED &&
        flowState === TransactionState.INVOKING) ||
      status === TransactionStepStatus.TEMPORARY_FAILURE
    )
  }

  canCompensate(flowState: TransactionState): boolean {
    return (
      this.isCompensating() &&
      this.getStates().state === TransactionState.NOT_STARTED &&
      flowState === TransactionState.COMPENSATING
    )
  }
}
