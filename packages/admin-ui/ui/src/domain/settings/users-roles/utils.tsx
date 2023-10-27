import { PermissionsType } from "../users-permissions/use-permission";
import { RolesType } from "./use-role";

export type OptionsType = {
    value: string
    label: string
}

// Get options values

export const getOptionsValues = (options: OptionsType[]): string[] => {
    return options.length ? options.map(o=>o.value) : []
}

// Get permissions options

export const getPermissionsOptions = (permissions?: PermissionsType[]): OptionsType[] => {
    return permissions?.map(p=>{
        return({
            value: p.id,
            label: p.name
        });
    }) || [];
}

// Get roles options

export const getRolesOptions = (roles?: RolesType[]): OptionsType[] => {
    return roles?.map(p=>{
        return({
            value: p.id,
            label: p.name
        });
    }) || [];
}