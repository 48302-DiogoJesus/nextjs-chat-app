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
- [x] Create constraints around room names and messages (zod?)
- [x] Secure data from db using zod (will cut out unexpected fields (not present in the schema))
- [x] Used DaisyUI for basic elements and information/error modals (not very friendly to work with)

- [ ] Notification popup for when messages from rooms other than the selected one have been received
- [ ] Typesafe env vars access
- [ ] Allow admin to delete the room
- [ ] Try Framer Motion for page load animations

- [ ] Replace CircularProgressIndicator components with DaisyUI spinners
- [ ] Put Inter Font as primary font and Roboto as secondary
- [ ] Allow admins to change room name

- [ ] Limit the number of users in the room members UI

- [ ] Add plain email/password as auth alternative
- [ ] Add magic link authentication
- [ ] Add google oauth (maybe not since only defined test users can use it)  

- [ ] Understand conventions around project structure (src/ app/ lib/ server/ ??)

### Notes

- Rooms can exist "forever" (in database) with users associated to them.
  Conversations are not stored persistently (only exist while the server instance is running)
