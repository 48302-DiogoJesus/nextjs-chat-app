- [x] Create PGSQL database schema with prisma (rooms, users) ! messages are not stored in DB (just memory)
  - [x] How to save users to DB (from oauth)
- [x] Add to UI input for entering a room by name
- [x] Use built in support for rooms inside socket io maybe
- [x] Don't loose messages unless refresh
- [x] Refactor trpc code into routers?
- [x] Put the getSession inside a trpc middleware
- [x] Establish listeners for all chat rooms when the myRooms changes
- [x] Rooms with IDS and admin (creator for now)
- [x] Make copy room id work
- [x] Remove nullables in getSession()
  solution: override Session type for next-auth context
- [x] Remove ugly: room as unknown as RoomModel (from trpc query result)
  solution: used superjson on trpc

- [ ] Create constraints around room names and messages (zod?)
- [ ] Typesafe env vars access

- [ ] Notification popup for when messages from rooms other than the selected one have been received
- [ ] Create error displayer component wrapper
- [ ] Change spinner color
- [ ] Use Inter Font and Roboto as secondary font

- [ ] Improve home page UI
- [ ] Overall refactor (src/ app/ lib/ server/ ??)

### Notes

- Rooms can exist "forever" (in database) with users associated to them.
  Conversations are not stored persistently (only exist while the server instance is running)
