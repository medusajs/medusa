export type ModulesResponse = Array<{
    /**
     * The key of the module.
     */
    module: string;
    /**
     * The resolution path of the module or false if module is not installed.
     */
    resolution: string;
}>;
