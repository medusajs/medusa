type BuildArgs = {
    root?: string;
};
declare function build({ root }: BuildArgs): Promise<void>;

type BundleArgs = {
    root?: string | undefined;
    watch?: boolean | undefined;
};
declare function bundle({ watch, root }: BundleArgs): Promise<void>;

type DevArgs = {
    port?: number | undefined;
    host?: string | boolean | undefined;
};
declare function dev({ port, host }: DevArgs): Promise<void>;

export { build, bundle, dev };
