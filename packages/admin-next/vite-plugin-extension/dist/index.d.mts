import { PluginOption } from 'vite';

type InjectArgs = {
    sources?: string[];
};
declare function inject(args?: InjectArgs): PluginOption;

export { inject as default };
