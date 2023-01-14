import {
  TransactionStepsDefinition,
  TransactionStepStatus,
  TransactionState,
} from "."

export class TransactionStep {
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
  last_attempt: number | null
  next: string[]
  response: unknown
  forwardResponse: boolean

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
    this.last_attempt = null
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

  public saveResponse(response) {
    this.response = response
  }

  public getResponse(): unknown {
    return this.response
  }

  canRetry(): boolean {
    return !!(
      this.last_attempt &&
      this.definition.retryInterval &&
      Date.now() - this.last_attempt > this.definition.retryInterval * 1e3
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
