# Prisma Query Selections

Selections store Data Storage (ex: PostgreSQL) field selections. This is useful:

- For security reasons (DB only gives us what we need) (Ex: public fields from a User object if sensitive data is in the same table as public/non-sensitive data)
- They reduce amount of data coming from DB