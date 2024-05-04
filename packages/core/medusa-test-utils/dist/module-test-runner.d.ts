import { TestDatabase } from "./database";
export interface SuiteOptions<TService = unknown> {
    MikroOrmWrapper: TestDatabase;
    medusaApp: any;
    service: TService;
    dbConfig: {
        schema: string;
        clientUrl: string;
    };
}
export declare function moduleIntegrationTestRunner({ moduleName, moduleModels, moduleOptions, joinerConfig, schema, debug, testSuite, resolve, injectedDependencies, }: {
    moduleName: string;
    moduleModels?: any[];
    moduleOptions?: Record<string, any>;
    joinerConfig?: any[];
    schema?: string;
    dbName?: string;
    injectedDependencies?: Record<string, any>;
    resolve?: string;
    debug?: boolean;
    testSuite: <TService = unknown>(options: SuiteOptions<TService>) => void;
}): void;
