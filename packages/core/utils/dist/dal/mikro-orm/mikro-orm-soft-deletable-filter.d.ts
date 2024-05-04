export declare const SoftDeletableFilterKey = "softDeletable";
interface FilterArguments {
    withDeleted?: boolean;
}
export declare const mikroOrmSoftDeletableFilterOptions: {
    name: string;
    cond: ({ withDeleted }?: FilterArguments) => {
        deleted_at?: undefined;
    } | {
        deleted_at: null;
    };
    default: boolean;
    args: boolean;
};
export {};
