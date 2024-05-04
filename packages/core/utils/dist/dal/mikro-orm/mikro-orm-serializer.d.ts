import { EntityDTO, Loaded } from "@mikro-orm/core";
import { SerializeOptions } from "@mikro-orm/core/serialization/EntitySerializer";
export declare class EntitySerializer {
    static serialize<T extends object, P extends string = never>(entity: T, options?: SerializeOptions<T, P> & {
        preventCircularRef?: boolean;
    }, parent?: object): EntityDTO<Loaded<T, P>>;
    private static propertyName;
    private static processProperty;
    private static extractChildOptions;
    private static processEntity;
    private static processCollection;
}
export declare const mikroOrmSerializer: <TOutput extends object>(data: any, options?: Parameters<typeof EntitySerializer.serialize>[1] & {
    preventCircularRef?: boolean;
}) => TOutput;
