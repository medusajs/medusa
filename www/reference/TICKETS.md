# TICKETS

This is a list of tickets for items that need to be completed for the API references fulfill its DOD.

- Prevent location state from being replaced while scrolling to a section or method by clicking a sidebar link. Currently the URL is visibly changed for some of the sections/methods that is between the original position and the target position.

- Styling of sidebar section links. Currently they keep their "active" state styling if a user has clicked the link and then scrolled to another section/method. This is not the intended outcome.

- Add function that scrolls the SideBar to the position of the SideBarItem that links to the currently viewed section/method.

- Fix goTo method in NavigationProvider. Intended behaviour: open provided section -> if method is provided, then scroll to method || scroll to section. Currently it only opens the provided section and scrolls to it, whether a method is provided or not. This is due to the method component not having been rendered at the time of the check. We need to somehow await the opening process and then scroll to the method after it is rendered.

- There currently is two `Create a Gift Card` methods in admin/gift-card. This causes an issue as both a highlighted as active when one is viewed, and scrollTo will only go to the first instance. This could be fixed by changing how method handles are created. But a better solution would be to change the name of one the methods, such as `Create a Gift Card` and `Create a Gift Card with ID` as one of the functions take an ID as a parameter.
