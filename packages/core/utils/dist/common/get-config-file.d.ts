/**
 * Attempts to resolve the config file in a given root directory.
 * @param {string} rootDir - the directory to find the config file in.
 * @param {string} configName - the name of the config file.
 * @return {object} an object containing the config module and its path as well as an error property if the config couldn't be loaded.
 */
declare function getConfigFile<TConfig = unknown>(rootDir: string, configName: string): {
    configModule: TConfig;
    configFilePath: string;
    error?: any;
};
export default getConfigFile;
