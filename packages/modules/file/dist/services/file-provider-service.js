"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const medusa_core_utils_1 = require("medusa-core-utils");
const _types_1 = require("../types");
class FileProviderService {
    constructor(container) {
        const fileProviderKeys = Object.keys(container).filter((k) => k.startsWith(_types_1.FileProviderRegistrationPrefix));
        if (fileProviderKeys.length !== 1) {
            throw new medusa_core_utils_1.MedusaError(medusa_core_utils_1.MedusaError.Types.INVALID_DATA, `File module should be initialized with exactly one provider`);
        }
        this.fileProvider_ = container[fileProviderKeys[0]];
    }
    static getRegistrationIdentifier(providerClass, optionName) {
        return `${providerClass.identifier}_${optionName}`;
    }
    upload(file) {
        return this.fileProvider_.upload(file);
    }
    delete(fileData) {
        return this.fileProvider_.delete(fileData);
    }
    getPresignedDownloadUrl(fileData) {
        return this.fileProvider_.getPresignedDownloadUrl(fileData);
    }
}
exports.default = FileProviderService;
