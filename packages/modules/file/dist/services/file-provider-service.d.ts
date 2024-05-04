import { Constructor, FileTypes } from "@medusajs/types";
import { FileProviderRegistrationPrefix } from "../types";
type InjectedDependencies = {
    [key: `${typeof FileProviderRegistrationPrefix}${string}`]: FileTypes.IFileProvider;
};
export default class FileProviderService {
    protected readonly fileProvider_: FileTypes.IFileProvider;
    constructor(container: InjectedDependencies);
    static getRegistrationIdentifier(providerClass: Constructor<FileTypes.IFileProvider>, optionName?: string): string;
    upload(file: FileTypes.ProviderUploadFileDTO): Promise<FileTypes.ProviderFileResultDTO>;
    delete(fileData: FileTypes.ProviderDeleteFileDTO): Promise<void>;
    getPresignedDownloadUrl(fileData: FileTypes.ProviderGetFileDTO): Promise<string>;
}
export {};
