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

- [x] Notification popup for when messages from rooms other than the selected one have been received
- [x] Replace CircularProgressIndicator components with DaisyUI spinners

- [x] Simplify data flow in Chat Page
- [x] Optimize socket connections in Chat Page
      one socket created initially. onConnect join all myRooms
      when a room is joined/created/deleted sub/unsub from that socket room

- [ ] Allow admin to delete the room
        then emit "room-deleted" event with the roomId to that room
        clients then should remove their ws subscription (leave room) 
- [ ] Try Framer Motion for page load animations
- [ ] Typesafe env vars access

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


### React

- IN `const [value, setValue] = useState()` value is a value
- IN `const ref = useRef()` ref.current is a reference
- If we have a function that uses an external value, if we need it to always access the most recent 
value use useRef, otherwise useState 