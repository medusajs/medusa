import { FileTypes, IFileProvider } from "@medusajs/types";
export declare class AbstractFileProviderService implements IFileProvider {
    static identifier: string;
    getIdentifier(): any;
    upload(file: FileTypes.ProviderUploadFileDTO): Promise<FileTypes.ProviderFileResultDTO>;
    delete(file: FileTypes.ProviderDeleteFileDTO): Promise<void>;
    getPresignedDownloadUrl(fileData: FileTypes.ProviderGetFileDTO): Promise<string>;
}
