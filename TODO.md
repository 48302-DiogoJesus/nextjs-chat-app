- [x] Create PGSQL database schema with prisma (rooms, users) ! messages are not stored in DB (just memory)
  - [x] How to save users to DB (from oauth)
- [ ] Use tRPC to create rooms, post messages to rooms and later subscribe to messages in rooms (WS)

- [ ] Improve home page UI
- [ ] Use Inter Font and Roboto as secondary font

### Notes

- Rooms can exist "forever" (in database) with users associated to them.
  Conversations are not stored persistently (only exist while the server instance is running)
