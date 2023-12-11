import { useEffect, useState } from "react"
import { Customer, CustomerGroup } from "@medusajs/medusa";
import { Button } from "@medusajs/ui"
import { Container } from "@medusajs/ui"
import getCustomerFields, { CustomerFieldsType } from "../../../utils/customers/getcustomerfields";
import { addGroupCustomer, getCustomersGroups, removeGroupCustomer } from "../../../utils/customers/groups";
import getCustomer from "../../../utils/customers/getcustomer";
import FieldView from "../../../utils/customers/fieldview";

type CustomersGroupsWidgetType = {
  customer: Customer
}

const CustomersGroupsWidget = ({customer}: CustomersGroupsWidgetType) => {

  const [customerGroups, setCustomerGroups] = useState([] as CustomerGroup[]);
  const [groupChanging, setGroupChanging] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [fields, setFields] = useState([] as CustomerFieldsType[]);
  
  // Get groups with changes

  const getGroups = async (c: Customer) => {
    
    if(c.groups?.length) {
      for(let i in c.groups) {
        if(c.groups[i].metadata?.type) {
          c.groups[i] = await getGroupChanges(c.groups[i]);
        }
      }
    }
    else if(c?.metadata?.type) {
      
      const group = {
        'name' : 'Not set',
        'metadata': {}
      } as CustomerGroup;

      const group_to = await getCustomersGroups(c.metadata.type+'_request' as string);
      
      if(group_to) {
        group.metadata._change_to = group_to.id;
        group.metadata._change_to_name = group_to.name;
        c.groups.push(group);
      }

    }

    setCustomerGroups(c.groups);
    setGroupChanging(false);

  }

  // Get group changes

  const getGroupChanges = async (group: CustomerGroup) => {

    // Get group type

    let type = String(group.metadata?.type).replace('_request', '').replace('_denied', '');
    let subtype = String(group.metadata?.type).replace(type, '');

    // Change to

    let f = type + (subtype != '_request' ? '_request' : '');

    const group_to = await getCustomersGroups(f);
    
    if(group_to?.id) {
      group.metadata._change_to = group_to.id;
      group.metadata._change_to_name = group_to.name;
    }

    // Deny

    if(subtype != '_denied') {

      const group_deny = await getCustomersGroups(type+'_denied');
    
      if(group_deny?.id) {
        group.metadata._deny_to = group_deny.id;
      }

    }

    // Return

    return group;

  }

  // Change group

  const changeGroup = (id_from: string, id_to?: string) => {
    setGroupChanging(true);
    removeGroupCustomer(id_from, customer?.id as string).then(()=>{
      addGroupCustomer(id_to, customer?.id as string).then(()=>{
        loadData(true);
      })
    })
  }

  // Deny

  const denyGroup = async (id_from: string) => {

    // Get deny group

    const group_to = await getCustomersGroups('denied' as string);

    // Change group

    changeGroup(id_from, group_to?.id);

  }

  // Get data

  const loadData = (skipLoading?: boolean) => {
    if(!skipLoading)
      setIsLoading(true);

    getCustomer(customer.id!).then(c=>{
      getGroups(c);
      
      if(!skipLoading)
        setIsLoading(false);
    });
  }

  // Get customers

  useEffect(()=>{
    loadData();
    setFields(getCustomerFields(customer))
  },[]);

  return (
    <>
      {(!!customerGroups?.length || !!fields.length) && !isLoading &&
        <Container className="py-4">
          {!!customerGroups?.length &&
            <div className="flex flex-col gap-3">
              {customerGroups.map(g=>
                <div className="flex flex-row gap-3" key={g.id || g.name}>
                  <span className="font-bold">{g.name}</span>
                  {!!g.metadata?._change_to &&
                    <Button
                      variant="secondary"
                      size="base"
                      className="px-2 py-0 text-xs font-normal"
                      title="Change group"
                      onClick={()=>{changeGroup(g.id, g.metadata?._change_to as string)}}
                      disabled={groupChanging}
                      isLoading={groupChanging}
                    >
                      &rarr; <span>{g.metadata?._change_to_name as string}</span>
                    </Button>
                  }
                  {!!g.metadata?._deny_to &&
                    <Button
                      variant="secondary"
                      className={"px-2 py-0 text-xs font-normal" + (groupChanging ? " hidden" : "")}
                      title="Deny"
                      onClick={()=>{changeGroup(g.id, g.metadata?._deny_to as string)}}
                      disabled={groupChanging}
                      isLoading={groupChanging}
                    >
                      x <span>Deny</span>
                    </Button>
                  }
                </div>
              )}
            </div>
          }
          {!!fields.length &&
            <div className="mt-6 grid grid-cols-2 gap-4">
              {fields.map(f=>
                <FieldView title={f.name} key={f.id} islink={f.islink}>{f.value}</FieldView>
              )}
            </div>
          }
        </Container>
      }
    </>
  )
}

export default CustomersGroupsWidget
