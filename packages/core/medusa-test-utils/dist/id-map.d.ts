export default instance;
declare const instance: IdMap;
declare class IdMap {
    ids: {};
    getId(key: any, prefix?: string, length?: number): any;
}
