export interface Logger {
  panic: (data: any) => void
  shouldLog: (level: string) => boolean
  setLogLevel: (level: string) => void
  unsetLogLevel: () => void
  activity: (message: string, config?: Record<string, any>) => string
  progress: (activityId: string, message: string) => void
  error: (messageOrError: string | Error, error?: Error) => void
  failure: (activityId: string, message: string) => Record<string, any> | null
  success: (activityId: string, message: string) => Record<string, any> | null
  debug: (message: string) => void
  info: (message: string) => void
  warn: (message: string) => void
  log: (...args: any[]) => void
}
