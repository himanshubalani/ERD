Here are some choices I made to make this a better ER Diagram.

- `buildings`, `floors`, `shafts`, and `elevators` are separated into distinct tables to clearly model physical infrastructure, keeping static configuration isolated from operational data.

- `shafts` is introduced as an intermediary between `buildings` and `elevators` to enforce a real-world constraint (1 shaft → 1 elevator) while allowing shaft-specific attributes like installation data.

- `floors` uses a composite unique constraint on (`building_id`, `floor_number`) instead of a global unique floor number, allowing multiple buildings to reuse the same numbering system.

- `elevators` uses a surrogate primary key while `shaft_id` is marked `unique` to enforce a strict 1:1 relationship without relying on natural identifiers.

- `elevator_floor_access` is a junction table to model restricted access (e.g., VIP/service elevators), avoiding hardcoded logic for which floors an elevator can serve.

- Dynamic runtime fields like `current_status`, `current_floor_id`, and `current_direction` are stored in `elevators` for simplicity, with the tradeoff of mixing live state with configuration.

- `tickets` models a receptionist-controlled flow where access is issued before making a request, reflecting real-world controlled environments.

- `floor_requests` separates request intent from execution, allowing independent tracking of states like `pending`, `assigned`, `completed`, and `cancelled`.

- `ride_assignments` acts as a junction table between `rides` and `floor_requests`, enabling one ride to fulfill multiple requests efficiently.

- `rides` represents a continuous elevator movement instead of individual stops, making it easier to track metrics like duration and distance.

- `ride_logs` is separated from `rides` to capture high-frequency telemetry such as `power_consumption_kwh`, `weight_onboard_kg`, and `camera_log_url` without bloating the main table.

- `maintenance_logs` is isolated from operational flow to track servicing, repairs, and technician activity independently.

- Enums like `elevator_status`, `request_status`, and `direction` are explicitly defined to enforce valid states and avoid inconsistent string values.

- `tickets.issued_by_staff_id` is included to support staff-controlled issuance, leaving room for a future `staff` table.

- `building_id` is stored in `elevators` as a deliberate denormalisation, even though it can be derived via `shafts`, to simplify querying.

- `ride_type` is kept flexible as an enum-like field to support scenarios like `normal`, `emergency`, and `VIP` rides without changing schema.

## What Was on My Mind

- Smart Elevator hmmmmm...

- I have three elevators in my building , say we have a source floor and destination floor

- They have a few functions -

- A person is Inside and clicks 15 so the lift moves from source to destination 15. It can be going up or down. Let's call it a lift_session.

- It has a alert button that will start a alarm in lift control room/area.

- It has door open and close buttons (loggable but not necessary i guess)

- It has emergency protocol in case lift power breaks.

- In protocol it goes to the closet floor in way and opens the door.

- Now we multiply it to 3 per building, there are 4 buildings.

- Lift algo decides which one will go based on direction and closeness to source floor. on each building. it's local

- Also we can have a CCTV logs too, they start recording at session start and end at session end.

- We need to address that a lift can fulfill multiple sessions concurrently. Like we have 3-4 people in a lift at once, going to different floors, let's assume, lift algo chooses a people going down. we have then P1 going from 15 to Ground, P2 going 12 to 5, P3 going from 10 to 1 and then P4 going 3 to ground. We need to account for that in DB.

- Now we go to Microsoft Office on 8th floor, Building B Commercial Site in DLF Downtown, Gurgoan for GitHub Career Fair.We multiply no of lifts again, enter a receptionist and security who manages lifts. Based on my memories, I had to ask the receptionist about my floor and he gave me a small ticket/receipt of sorts. In it I had lift name and floor number. like I went to G lift with floor 8. there were lifts going to I or J so 10-11 lifts per building.

- Let me figure out what happened in the background.

- We get a ride request in a building, backend sees which lifts are free, find closest one, ask it to come to ground floor for me. tell the receptionist, this lift is good to go here and prints a ticket with the details. I go scan it in scanner in front of lifts (like metro), specifically my lift opens, floor already selected. now I enter the lift, camera starts recording me, I get to my 8th floor, door opens and I leave, camera stops recording. Sends ride data with session details like ticket id, source floor, destination floor, lift , camera log, lift stats (power, weight onboard), session start and end time.

- Now multiply this to multiple buildings and we have a cool system. What happens with shaft? I guess it's for maintainance, so attributes like status, last_maintaince, last_error_date, log updated_at etc
