---
"@medusajs/admin-ui": patch
"@medusajs/admin": patch
---

fix(admin-ui): Admin UI fixes / enhancements

- Inventory and order UI fixes and tweaks
- focus-border clipping
- Fix use of `expand` parameter on order page
- Fix location address editing form state
- ensure that the allocation indicator is correctly displayed
- Fix inventory table pagination on location filter change
- Try and ensure allocation table checkmarks align better
- Add gap in table actions
- remove allocate button if no more allcoations can be made
- update edit-allocation sidebar
- create/update/delete inventory items according to inventory items on the variant
- Fix minor bugs related to the edit-allocation modal
- move tailwind to direct dependency
- display error messages for batch jobs
- draft order shipping details
- Implements redesigned public facing pages of admin UI.
- Add location names to fulfilment rows and timeline events
- Encode location id in URL on location table
