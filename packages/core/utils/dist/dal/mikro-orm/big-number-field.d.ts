import { Property } from "@mikro-orm/core";
export declare function MikroOrmBigNumberProperty(options?: Parameters<typeof Property>[0] & {
    rawColumnName?: string;
}): (target: any, columnName: string) => void;
