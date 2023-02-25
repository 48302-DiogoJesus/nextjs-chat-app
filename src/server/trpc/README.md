# tRPC API Configuration and Routes

Defines the endpoints that can be called from the client. 
The inputs passed to the procedures are validated by ZOD schemas
The bussiness logic is currently in this procedures with only the data storage access being 
abstracted (currently inside ../prisma)


## MODULE RESPONSABILITY
 - Validate user input (using zod schemas)
 - Bussiness Logic
 - Call an internal persistent data storage api (prisma)


## DOES NOT DO
 - Directly access data storage modules (to keep bussiness logic as readable as possible)