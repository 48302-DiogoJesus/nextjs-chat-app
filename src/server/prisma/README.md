# Prisma (Data Storage Interactions)

This module provides abstraction (in the form of functions) over persistent data access

Currently it is being called by the tRPC API directly

## MODULE RESPONSABILITY
 - Abstract access to data storage
 - Perform minimal selections (using selections)
 - Limit the output (using zod schemas)


## DOES NOT DO
 - Input validation (since it's being called by a trusted entity (API module (ex: trpc)))
 - Bussiness logic
