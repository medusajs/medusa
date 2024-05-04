import { Context, CustomerDTO, CustomerTypes, DAL, ICustomerModuleService, InternalModuleDeclaration, ModuleJoinerConfig, ModulesSdkTypes } from "@medusajs/types";
import { ModulesSdkUtils } from "@medusajs/utils";
import { Address, Customer, CustomerGroup, CustomerGroupCustomer } from "../models";
type InjectedDependencies = {
    baseRepository: DAL.RepositoryService;
    customerService: ModulesSdkTypes.InternalModuleService<any>;
    addressService: ModulesSdkTypes.InternalModuleService<any>;
    customerGroupService: ModulesSdkTypes.InternalModuleService<any>;
    customerGroupCustomerService: ModulesSdkTypes.InternalModuleService<any>;
};
declare const CustomerModuleService_base: new (container: InjectedDependencies) => ModulesSdkUtils.AbstractModuleService<InjectedDependencies, CustomerDTO, {
    Address: {
        dto: any;
    };
    CustomerGroup: {
        dto: any;
    };
    CustomerGroupCustomer: {
        dto: any;
    };
}>;
export default class CustomerModuleService<TAddress extends Address = Address, TCustomer extends Customer = Customer, TCustomerGroup extends CustomerGroup = CustomerGroup, TCustomerGroupCustomer extends CustomerGroupCustomer = CustomerGroupCustomer> extends CustomerModuleService_base implements ICustomerModuleService {
    protected readonly moduleDeclaration: InternalModuleDeclaration;
    protected baseRepository_: DAL.RepositoryService;
    protected customerService_: ModulesSdkTypes.InternalModuleService<TCustomer>;
    protected addressService_: ModulesSdkTypes.InternalModuleService<TAddress>;
    protected customerGroupService_: ModulesSdkTypes.InternalModuleService<TCustomerGroup>;
    protected customerGroupCustomerService_: ModulesSdkTypes.InternalModuleService<TCustomerGroupCustomer>;
    constructor({ baseRepository, customerService, addressService, customerGroupService, customerGroupCustomerService, }: InjectedDependencies, moduleDeclaration: InternalModuleDeclaration);
    __joinerConfig(): ModuleJoinerConfig;
    create(data: CustomerTypes.CreateCustomerDTO, sharedContext?: Context): Promise<CustomerTypes.CustomerDTO>;
    create(data: CustomerTypes.CreateCustomerDTO[], sharedContext?: Context): Promise<CustomerTypes.CustomerDTO[]>;
    create_(dataOrArray: CustomerTypes.CreateCustomerDTO | CustomerTypes.CreateCustomerDTO[], sharedContext?: Context): Promise<CustomerTypes.CustomerDTO[]>;
    update(customerId: string, data: CustomerTypes.CustomerUpdatableFields, sharedContext?: Context): Promise<CustomerTypes.CustomerDTO>;
    update(customerIds: string[], data: CustomerTypes.CustomerUpdatableFields, sharedContext?: Context): Promise<CustomerTypes.CustomerDTO[]>;
    update(selector: CustomerTypes.FilterableCustomerProps, data: CustomerTypes.CustomerUpdatableFields, sharedContext?: Context): Promise<CustomerTypes.CustomerDTO[]>;
    createCustomerGroup(dataOrArrayOfData: CustomerTypes.CreateCustomerGroupDTO, sharedContext?: Context): Promise<CustomerTypes.CustomerGroupDTO>;
    createCustomerGroup(dataOrArrayOfData: CustomerTypes.CreateCustomerGroupDTO[], sharedContext?: Context): Promise<CustomerTypes.CustomerGroupDTO[]>;
    updateCustomerGroups(groupId: string, data: CustomerTypes.CustomerGroupUpdatableFields, sharedContext?: Context): Promise<CustomerTypes.CustomerGroupDTO>;
    updateCustomerGroups(groupIds: string[], data: CustomerTypes.CustomerGroupUpdatableFields, sharedContext?: Context): Promise<CustomerTypes.CustomerGroupDTO[]>;
    updateCustomerGroups(selector: CustomerTypes.FilterableCustomerGroupProps, data: CustomerTypes.CustomerGroupUpdatableFields, sharedContext?: Context): Promise<CustomerTypes.CustomerGroupDTO[]>;
    addCustomerToGroup(groupCustomerPair: CustomerTypes.GroupCustomerPair, sharedContext?: Context): Promise<{
        id: string;
    }>;
    addCustomerToGroup(groupCustomerPairs: CustomerTypes.GroupCustomerPair[], sharedContext?: Context): Promise<{
        id: string;
    }[]>;
    addAddresses(addresses: CustomerTypes.CreateCustomerAddressDTO[], sharedContext?: Context): Promise<CustomerTypes.CustomerAddressDTO[]>;
    addAddresses(address: CustomerTypes.CreateCustomerAddressDTO, sharedContext?: Context): Promise<CustomerTypes.CustomerAddressDTO>;
    private addAddresses_;
    updateAddresses(addressId: string, data: CustomerTypes.UpdateCustomerAddressDTO, sharedContext?: Context): Promise<CustomerTypes.CustomerAddressDTO>;
    updateAddresses(addressIds: string[], data: CustomerTypes.UpdateCustomerAddressDTO, sharedContext?: Context): Promise<CustomerTypes.CustomerAddressDTO[]>;
    updateAddresses(selector: CustomerTypes.FilterableCustomerAddressProps, data: CustomerTypes.UpdateCustomerAddressDTO, sharedContext?: Context): Promise<CustomerTypes.CustomerAddressDTO[]>;
    removeCustomerFromGroup(groupCustomerPair: CustomerTypes.GroupCustomerPair, sharedContext?: Context): Promise<void>;
    removeCustomerFromGroup(groupCustomerPairs: CustomerTypes.GroupCustomerPair[], sharedContext?: Context): Promise<void>;
    private flush;
}
export {};
