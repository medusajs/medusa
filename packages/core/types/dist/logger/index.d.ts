export interface Logger {
    panic: (data: any) => void;
    shouldLog: (level: string) => void;
    setLogLevel: (level: string) => void;
    unsetLogLevel: () => void;
    activity: (message: string, config?: any) => void;
    progress: (activityId: any, message: any) => void;
    error: (messageOrError: any, error?: any) => void;
    failure: (activityId: any, message: any) => void;
    success: (activityId: any, message: any) => void;
    debug: (message: any) => void;
    info: (message: any) => void;
    warn: (message: any) => void;
    log: (...args: any[]) => void;
}
//# sourceMappingURL=index.d.ts.map