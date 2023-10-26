import { PermissionsType } from "../users-permissions/use-permission";

export type PermissionsOptionsType = {
    value: string
    label: string
}

// Get permissions options

export const getPermissionsOptions = (permissions?: PermissionsType[]): PermissionsOptionsType[] => {
    return permissions?.map(p=>{
        return({
            value: p.id,
            label: p.name,
        });
    }) || [];
}

// Get permissions options values

export const getPermissionsOptionsValues = (options: PermissionsOptionsType[]): string[] => {
    return options.length ? options.map(o=>o.value) : []
}