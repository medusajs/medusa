export interface Logger {
  panic: (data) => void
  shouldLog: (level: string) => void
  setLogLevel: (level: string) => void
  unsetLogLevel: () => void
  activity: (message: string, config?) => void
  progress: (activityId, message) => void
  error: (messageOrError, error?) => void
  failure: (activityId, message) => void
  success: (activityId, message) => void
  debug: (message) => void
  info: (message) => void
  warn: (message) => void
  log: (...args) => void
}
