import { Context, CreateFileDTO, FileDTO, ModuleJoinerConfig, FileTypes, FilterableFileProps, FindConfig } from "@medusajs/types";
import FileProviderService from "./file-provider-service";
type InjectedDependencies = {
    fileProviderService: FileProviderService;
};
export default class FileModuleService implements FileTypes.IFileModuleService {
    protected readonly fileProviderService_: FileProviderService;
    constructor({ fileProviderService }: InjectedDependencies);
    __joinerConfig(): ModuleJoinerConfig;
    create(data: CreateFileDTO[], sharedContext?: Context): Promise<FileDTO[]>;
    create(data: CreateFileDTO, sharedContext?: Context): Promise<FileDTO>;
    delete(ids: string[], sharedContext?: Context): Promise<void>;
    delete(id: string, sharedContext?: Context): Promise<void>;
    retrieve(id: string): Promise<FileDTO>;
    list(filters?: FilterableFileProps, config?: FindConfig<FileDTO>, sharedContext?: Context): Promise<FileDTO[]>;
    listAndCount(filters?: FilterableFileProps, config?: FindConfig<FileDTO>, sharedContext?: Context): Promise<[FileDTO[], number]>;
}
export {};
