## Relationships

- `departments.id` → `doctors.department_id` [1:N]

- `doctors.doctor_id` → `doctor_specialties.doctor_id` [1:N]

- `specialties.id` → `doctor_specialties.specialty_id` [1:N]

- `patients.patient_id` → `appointments.patient_pin` [1:N]

- `doctors.doctor_id` → `appointments.doctor_id` [1:N]

- `appointments.appointment_id` → `consultations.appointment_id` [1:1]

- `patients.patient_id` → `consultations.patient_pin` [1:N]

- `doctors.doctor_id` → `consultations.doctor_id` [1:N]

- `consultations.consultation_id` → `prescribed_tests.consultation_id` [1:N]

- `test_catalog.test_id` → `prescribed_tests.test_id` [1:N]

- `prescribed_tests.prescription_id` → `diagnostic_reports.prescription_id` [1:1]

- `doctors.doctor_id` → `diagnostic_reports.reviewed_by_doctor_id` [1:N]

- `consultations.consultation_id` → `invoices.consultation_id` [1:N]

- `invoices.invoice_id` → `invoice_items.invoice_id` [1:N]

- `test_catalog.test_id` → `invoice_items.test_id` [1:N]

- `pharmacy_items.item_id` → `invoice_items.pharmacy_item_id` [1:N]

- `consultations.consultation_id` → `invoice_items.consultation_id` [1:N]

- `invoices.invoice_id` → `payments.invoice_id` [1:1]

- `consultations.consultation_id` → `pharmacy_items.consultation_id` [1:N]


---

## Here's how I came up with this design -

- Data points I found in my hospital receipt

- Receipt No

- PIN (Personal Identification Number For Patient)

- Patient Name

- Age

- Sex Gender

- Date (Date+ Time)

- Address (three lines, separated by commas, plus city)

- Entitlement (it says self pay)

- Loc: PHA(pharmacy Main, so I guess their inhouse pharmacy)

- Doctor

- External Doctor

- Narration.


---

## now my thoughts exactly on how I designed this -

- We need patient table, can take patient info attributes from above data points. Plus we need phone number and email(optional). Also number of visits, and types of visits only for appointment, consultation or report, emergency or other (this amy or may not be needed.

- We need doctor table, data points for a doctor meay include, ID, First name, last name, gender, contact number, email address, success rate, rating, number of appointments, consultations, and diagnosis precribed , then their specialty, registration number, years of experience, department, working hours, availibilty or more.

- We need a audit trail on how patient and doctor interact

- We need a payment table, details like payment_id, order_id, payment_method, payment_status, amount_paid, transaction_ref, payment_date

- We need a Appointments table, with Appointment ID, Date, status and connections to both doctor and patients.

- We need a table for diagnosis and diagnostic tests, so we can create a report,

- Specialty should be a separate table or entity if a doctor can have multiple specialties (many-to-many relationship) or if specializations require detailed attributes (e.g., certification board).

- Similarly, there should be departmants table with list of departments with department ID, name and location(within clinic) (or is it redundant?)

- How do you do mediacal records in database? Okay we need, Record ID, Patient ID, Doctor ID, Diagnosis, Treatment, Date atleast here.

- With that we need tables for list of tests available, prescribed ones (to patient), and reports.

- Wait how do I handle billing? We will need data from appointment, consultation, prescription items, test prices. add them, create total.