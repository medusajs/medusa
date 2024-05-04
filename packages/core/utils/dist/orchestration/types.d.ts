export declare enum TransactionHandlerType {
    INVOKE = "invoke",
    COMPENSATE = "compensate"
}
export declare enum TransactionStepStatus {
    IDLE = "idle",
    OK = "ok",
    WAITING = "waiting_response",
    TEMPORARY_FAILURE = "temp_failure",
    PERMANENT_FAILURE = "permanent_failure"
}
export declare enum TransactionState {
    NOT_STARTED = "not_started",
    INVOKING = "invoking",
    WAITING_TO_COMPENSATE = "waiting_to_compensate",
    COMPENSATING = "compensating",
    DONE = "done",
    REVERTED = "reverted",
    FAILED = "failed"
}
export declare enum TransactionStepState {
    NOT_STARTED = "not_started",
    INVOKING = "invoking",
    COMPENSATING = "compensating",
    DONE = "done",
    REVERTED = "reverted",
    FAILED = "failed",
    DORMANT = "dormant",
    SKIPPED = "skipped",
    TIMEOUT = "timeout"
}
