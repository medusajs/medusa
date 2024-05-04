export type PanicData = {
    id: string;
    context: {
        rootPath: string;
        path: string;
    };
};
export declare enum PanicId {
    InvalidProjectName = "10000",
    InvalidPath = "10002",
    AlreadyNodeProject = "10003"
}
export declare const panicHandler: (panicData?: PanicData) => {
    message: string;
};
