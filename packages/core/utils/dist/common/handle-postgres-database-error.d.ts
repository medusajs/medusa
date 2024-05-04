export declare const DatabaseErrorCode: {
    databaseDoesNotExist: string;
    connectionFailure: string;
    wrongCredentials: string;
    notFound: string;
    migrationMissing: string;
};
export declare function handlePostgresDatabaseError(err: any): never;
