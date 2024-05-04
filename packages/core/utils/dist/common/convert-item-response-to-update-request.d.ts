interface ItemRecord extends Record<string, any> {
    id: string;
}
export declare function convertItemResponseToUpdateRequest(item: ItemRecord, selects: string[], relations: string[], fromManyRelationships?: boolean): ItemRecord;
export {};
