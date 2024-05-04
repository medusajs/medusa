import { MedusaContainer } from "@medusajs/types";
export interface MedusaSuiteOptions<TService = unknown> {
    dbUtils: any;
    dbConnection: any;
    getContainer: () => MedusaContainer;
    api: any;
    dbConfig: {
        dbName: string;
        schema: string;
        clientUrl: string;
    };
}
export declare function medusaIntegrationTestRunner({ moduleName, dbName, schema, env, force_modules_migration, debug, testSuite, }: {
    moduleName?: string;
    env?: Record<string, any>;
    dbName?: string;
    schema?: string;
    debug?: boolean;
    force_modules_migration?: boolean;
    testSuite: <TService = unknown>(options: MedusaSuiteOptions<TService>) => void;
}): void;
