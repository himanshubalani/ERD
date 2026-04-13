
## ER Diagram Design Decisions

- Instead of a single large `users` table, a base `users` table is used for authentication, with separate `trainers` and `clients` profile tables.  
  → This keeps role-specific data clean and avoids unnecessary null fields.

- A `subscriptions` table acts as a bridge between `clients`, `trainers`, and `programs`.  
  → This models the business relationship clearly and supports multiple subscriptions over time.

- Instead of storing fixed attributes like weight or body fat directly in `check_ins`, a separate `progress_metrics` table is used.  
  → This allows flexible tracking of different metrics without schema changes.

- `sessions` and `check_ins` are strictly separated:
  - `sessions` → live, scheduled events (e.g., Zoom calls with time and link)  
  - `check_ins` → asynchronous client updates (e.g., weight, mood, notes)  
  → Prevents confusion in scheduling vs reporting logic.

- A `trainer_feedback` table is linked directly to `check_ins`.  
  → Ensures structured feedback for each client submission.

- `programs` (what is sold) are separated from `program_contents` (what is delivered).  
  → Supports better organization and scalability of program materials.

- The `payments` table is linked to `subscriptions` instead of `users`.  
  → Enables tracking revenue per program/plan and ties payments to specific service periods for refunds or renewals.


---

## Relationships

- `users.id` → `trainers.user_id` [1:1]

- `users.id` → `clients.user_id` [1:1]

- `programs.id` → `program_contents.program_id` [1:N]

- `clients.id` → `subscriptions.client_id` [1:N]

- `trainers.id` → `subscriptions.trainer_id` [1:N]

- `programs.id` → `subscriptions.program_id` [1:N]

- `trainers.id` → `sessions.trainer_id` [1:N]

- `clients.id` → `sessions.client_id` [1:N]

- `clients.id` → `check_ins.client_id` [1:N]

- `check_ins.id` → `progress_metrics.check_in_id` [1:N]

- `check_ins.id` → `trainer_feedback.check_in_id` [1:1]

- `trainers.id` → `trainer_feedback.trainer_id` [1:N]

- `subscriptions.id` → `payments.subscription_id` [1:N]
```
