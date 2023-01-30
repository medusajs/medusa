type SpinnerContext = {
    message: string;
    successMessage?: string;
    errorMessage?: string;
};
export declare const reporter: {
    spinner: <T>(promise: Promise<T>, { message, errorMessage, successMessage }: SpinnerContext) => Promise<T>;
    error: (message: string) => void;
    info: (message: string) => void;
    warn: (message: string) => void;
};
export {};
//# sourceMappingURL=reporter.d.ts.map