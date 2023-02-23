- [x] Create PGSQL database schema with prisma (rooms, users) ! messages are not stored in DB (just memory)
  - [x] How to save users to DB (from oauth)
- [x] Add to UI input for entering a room by name
- [x] Use built in support for rooms inside socket io maybe (check if can scale FIRST)

- [ ] Don't loose messages unless refresh
- [ ] Fix CSS of ROOM component

- [ ] Remove nullables in getSession()
- [ ] Put the getSession inside a trpc middleware
- [ ] Refactor trpc code into routers?
- [ ] Make copy name work

- [ ] Remove ugly: room as unknown as RoomModel (from trpc query result)

- [ ] Creater error displayer component wrapper
- [ ] Change spinner color
- [ ] Improve home page UI
- [ ] Use Inter Font and Roboto as secondary font

- [ ] Overall refactor (src/ app/ lib/ server/)

### Notes

- Rooms can exist "forever" (in database) with users associated to them.
  Conversations are not stored persistently (only exist while the server instance is running)
