import { FileTypes, LocalFileServiceOptions } from "@medusajs/types";
import { AbstractFileProviderService } from "@medusajs/utils";
export declare class LocalFileService extends AbstractFileProviderService {
    static identifier: string;
    protected uploadDir_: string;
    protected backendUrl_: string;
    constructor(_: any, options: LocalFileServiceOptions);
    upload(file: FileTypes.ProviderUploadFileDTO): Promise<FileTypes.ProviderFileResultDTO>;
    delete(file: FileTypes.ProviderDeleteFileDTO): Promise<void>;
    getPresignedDownloadUrl(fileData: FileTypes.ProviderGetFileDTO): Promise<string>;
    private getUploadFilePath;
    private getUploadFileUrl;
    private ensureDirExists;
}
