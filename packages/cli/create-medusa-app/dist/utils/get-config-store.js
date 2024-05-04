import Configstore from "configstore";
let config;
export const getConfigStore = () => {
    if (!config) {
        config = new Configstore(`medusa`, {}, {
            globalConfigPath: true,
        });
    }
    return config;
};
