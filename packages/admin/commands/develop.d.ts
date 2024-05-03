import { AdminOptions } from "@medusajs/admin-ui";
type DevelopArgs = AdminOptions & {
    port: number;
};
export default function develop({ backend, path, port }: DevelopArgs): Promise<void>;
export {};
//# sourceMappingURL=develop.d.ts.map