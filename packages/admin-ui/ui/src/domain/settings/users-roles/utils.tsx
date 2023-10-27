import { Option } from "../../../types/shared";
import { PermissionsType } from "../users-permissions/use-permission";

type OptionsType = {
    id: string,
    name: string
}

// Get options values

export const getOptionsValues = (options: Option[]): string[] => {
    return options.length ? options.map(o=>o.value) : []
}

// Get permissions options

export const getPermissionsOptions = (permissions?: PermissionsType[]): Option[] => {
    return permissions?.map(p=>{
        return({
            value: p.id,
            label: p.name
        });
    }) || [];
}

// Get options

export const getOptions = (options?: OptionsType[]): Option[] => {
    return options?.map(p=>{
        return({
            value: p.id,
            label: p.name
        });
    }) || [];
}