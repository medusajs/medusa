# Structure

- Models (`/models`)
This is where the data layer lives. Define data models here no logic only schema and data access layer. (Default is MongoDB so we have data access layer defined for us already)

- Services (`/services`)
This is where our business logic lives. Define services that perform calculations, update the data layer, synchronize services, etc.

- Controllers (`/api`)
This is the interface lives. Define how the user interacts with the service layer. Ensure that the user has permission to do what they intend to, authenticate requests, call service layer.

- Jobs (`/jobs`)
This is where background and recurring tasks live. Want to send some data somewhere every night, this would be where to do it. Calls service layer methods and should, like controllers, not contain business logic.

- Subscribers (`/subscribers`)
This is where events live. Want to perform a certain task whenever something else happens, this is where to do it.

# Extending the core

The core will look for files in the folders listed above, and inject the custom code.



