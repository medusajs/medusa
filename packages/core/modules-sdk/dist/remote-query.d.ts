import { RemoteFetchDataCallback } from "@medusajs/orchestration";
import { JoinerArgument, JoinerRelationship, LoadedModule, ModuleJoinerConfig, RemoteExpandProperty, RemoteJoinerOptions, RemoteJoinerQuery, RemoteNestedExpands } from "@medusajs/types";
export declare class RemoteQuery {
    private remoteJoiner;
    private modulesMap;
    private customRemoteFetchData?;
    constructor({ modulesLoaded, customRemoteFetchData, servicesConfig, }: {
        modulesLoaded?: LoadedModule[];
        customRemoteFetchData?: RemoteFetchDataCallback;
        servicesConfig?: ModuleJoinerConfig[];
    });
    setFetchDataCallback(remoteFetchData: (expand: RemoteExpandProperty, keyField: string, ids?: (unknown | unknown[])[], relationship?: any) => Promise<{
        data: unknown[] | {
            [path: string]: unknown[];
        };
        path?: string;
    }>): void;
    static getAllFieldsAndRelations(expand: RemoteExpandProperty | RemoteNestedExpands[number], prefix?: string, args?: JoinerArgument): {
        select?: string[];
        relations: string[];
        args: JoinerArgument;
    };
    private hasPagination;
    private buildPagination;
    remoteFetchData(expand: RemoteExpandProperty, keyField: string, ids?: (unknown | unknown[])[], relationship?: JoinerRelationship): Promise<{
        data: unknown[] | {
            [path: string]: unknown;
        };
        path?: string;
    }>;
    query(query: string | RemoteJoinerQuery | object, variables?: Record<string, unknown>, options?: RemoteJoinerOptions): Promise<any>;
}
