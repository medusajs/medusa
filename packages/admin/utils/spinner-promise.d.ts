type spinnerContext = {
    message: string;
    successMessage?: string;
    errorMessage?: string;
};
export declare const spinner: <T>(promise: Promise<T>, { message, errorMessage, successMessage }: spinnerContext) => Promise<T>;
export {};
//# sourceMappingURL=spinner-promise.d.ts.map