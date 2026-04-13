Here are some choices I made to improve this ER Diagram:

- Vehicles are divided into categories via a `vehicle_categories` table instead of a flat enum — this allows attaching rules, descriptions, and rates to each type without altering the schema.

- The `vehicles` table uses a surrogate integer primary key, with `license_plate` as a unique constraint. License plates can change hands or get reissued, so using them as identifiers felt unreliable.

- Since this is a Comic-Con event, visitor access matters as much as the vehicle itself. The `visitor_profiles` table stores details about the person — name, access type (VIP, exhibitor, staff, cosplayer), and permit number — separately from the vehicle they arrived in.

- Taking inspiration from real event systems, `visitor_vehicles` is a junction table linking profiles to vehicles. A cosplayer might bring props in one car but carpool on another day. This supports a one-to-many relationship between a person and vehicles.

- The `spot_categories` table includes `required_access` and `base_hourly_rate`. This ensures that, for example, a VIP spot only accepts VIP-level profiles, and pricing logic is centralized.

- `category_spot_permissions` acts as a junction table defining which vehicle categories can use which spot categories. For example, an EV cannot park in a bike spot, and a bike cannot use an EV charging bay. This enforces rules at the schema level.

- If a session’s `exit_time` is `NULL` and the spot is assigned, it is considered occupied — eliminating the need for additional state syncing.

- `parking_tickets` and `parking_sessions` are kept separate. A ticket is issued at entry, while a session captures the full lifecycle from entry to exit. This allows a single ticket to span multiple sessions across event days.

- Walking visitors and cab users do not require profiles, so `profile_id` can be `NULL`.

- The `payments` table captures standard fields along with a `transaction_ref` for dispute handling or record-keeping. A status enum (`pending`, `completed`, `failed`) keeps payment tracking straightforward.

## What Was on My Mind
- I go to comic con yayy! as a cosplayer. 

- I try to enter the premises, there is a ticket guy. I tell him I'm cosplayer with comic on permit as proof. he notes my license number. If I were in a cab, after licence, I would be asked to go to dropzone. after dropzone, the cab leaves. no parking needed. But I have my own car. which is priced a certain amount 

- UNDERSTAND THE DATA POINTS

- okay okay back up let's do small scenarios

- if cosplayer, VIPs, exhibitors, staff enter

- in car or SUV , goes to dedicated reserved parking zone for vehicle type

- in EV, goes to reserved EV parking zone

- in cab, goes to dropzone, no parking

- if normal attendee enter

- in car or SUV, goes to normal parking zone for vehicle type

- in EV, goes to available EV station parking

- in cab, to dropzone and no parking.

- assume, everyone tells which kind of person they are (cosplayer, VIP, attendee etc).

- okay now, for everyone, a license number is taken at entry to mark a vehicle. and entry time is noted.

- if a cab, they get dropzone parking spot (5-10 mins). then they leave with no-minimal parking cost.

- if a VIP, cosplayer etc enters in any type of personal car including EV, they are assigned a dedicated spot, zone and level based on level of importance. spot is mostly available there.

- if a attendee enters, they are given a regular spot, zone and level. later they came, farther or lower they go to park.

- Now since times are calculated, for attendees we give hourly parking rates with fixed first hour and then rolling rates for parking. Mybe at a higher rate they get all day parking, but for simplicity for this ER diagram let's do hourly, minutes parking.

- VIP, cosplayers and staff get all day parking ticket at fixed price or free depending on their importance and priority. 

- cosplayers with props, exhibitors, VIP guests, staff) get closer parking( so connected to zone and level)

- these people get a elevated privilege attribute to them that allows them to get these perks.

- a parking session ideally includes licence number, vehicle type, (attendee type, privilege), entry, duration calculated on fly (or stored idk), exit.

- based on assignment, there should be payment records too, so we can have a id for the person who parked and how much they paid, payment method, connected to ticket, timestamp of payment and perhaps a transaction ref for later.

- again this happens as payment happens later at exit.

- I hope this satifies the assignment criteria.

- What is a Zone or a level. 

- I think zones are areas for specific type of vehicle and a level includes most of them . there are multiple zones on a level and there are multiple levels.

- I have seen this in Mumbai airport.

- There are areas marked like E! - E10 on level 5, E1- 10 beings zones

- level 6 has P1- P6 being zones, and within them there are 30 - 40 parkng spots each. so a spot could be S25 on D2 zone on level D