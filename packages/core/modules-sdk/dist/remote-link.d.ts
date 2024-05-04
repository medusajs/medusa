import { ILinkModule, LoadedModule, ModuleJoinerRelationship } from "@medusajs/types";
import { Modules } from "./definitions";
export type DeleteEntityInput = {
    [moduleName: string | Modules]: Record<string, string | string[]>;
};
export type RestoreEntityInput = DeleteEntityInput;
type LinkDefinition = {
    [moduleName: string]: {
        [fieldName: string]: string;
    };
} & {
    data?: Record<string, unknown>;
};
type RemoteRelationship = ModuleJoinerRelationship & {
    isPrimary: boolean;
    isForeign: boolean;
};
type LoadedLinkModule = LoadedModule & ILinkModule;
type DeleteEntities = {
    [key: string]: string[];
};
type RemovedIds = {
    [serviceName: string]: DeleteEntities;
};
type RestoredIds = RemovedIds;
type CascadeError = {
    serviceName: string;
    method: String;
    args: any;
    error: Error;
};
export declare class RemoteLink {
    private modulesMap;
    private relationsPairs;
    private relations;
    constructor(modulesLoaded?: LoadedModule[]);
    addModule(mod: LoadedModule): void;
    private addRelationship;
    getLinkModule(moduleA: string, moduleAKey: string, moduleB: string, moduleBKey: string): LoadedLinkModule | undefined;
    getRelationships(): Map<string, Map<string, RemoteRelationship[]>>;
    private getLinkableKeys;
    private executeCascade;
    create(link: LinkDefinition | LinkDefinition[]): Promise<unknown[]>;
    dismiss(link: LinkDefinition | LinkDefinition[]): Promise<unknown[]>;
    delete(removedServices: DeleteEntityInput): Promise<[CascadeError[] | null, RemovedIds]>;
    restore(removedServices: DeleteEntityInput): Promise<[CascadeError[] | null, RestoredIds]>;
}
export {};
