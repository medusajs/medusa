export namespace verdaccioConfig {
    const storage: string;
    const port: number;
    const max_body_size: string;
    namespace web {
        const enable: boolean;
        const title: string;
    }
    const logs: {
        type: string;
        format: string;
        level: string;
    }[];
    const packages: {
        "**": {
            access: string;
            publish: string;
            proxy: string;
        };
    };
    namespace uplinks {
        namespace npmjs {
            const url: string;
            const max_fails: number;
        }
    }
}
export const registryUrl: string;
