# Solution Design

- [App Architecture](#app-architecture)
- [Data Models](#data-models)
- [Data Processing](#data-processing)
- [User Interface](#user-interface)

## App Architecture

Application is a single-page application written using React. All logic is contained in the SPA; there are no backend
components or network calls made by the SPA.

The SPA is served statically via CloudFront, backed by an S3 origin.

There is currently no data persistence scoped; however, if any persistence were to occur, it would utilize browser
local storage.

## Data Models

Key input entities:

- Worker
- Shift
- Schedule (defined in code/configuration, not user input)
- AwardRules

Key output entities:

- ClassifiedPayableTime
- ShiftPayable
- WorkerPayable

See [models](./award-calculator-fe/src/models) for specific attributes & relationships

## Data processing

### Data validation

The validation on tabular input data will work as follows:

- For each row:
  1. Parse into [WorkerShiftRow](./award-calculator-fe/src/models/inputs/table.ts) model
  2. Validate each field in the row
  3. Extract `Employee code`, `Last name`, `First name`, `Pay rate` and `Casual loading` from the row
  4. Perform a lookup to see if `Employee code` has previously been encountered.
    - If yes, validate that the other worker-level fields match the prior values
    - Otherwise, insert these fields to a map of `Employee code` -> worker-level fields
  5. Validation failures for the row are aggregated into a
[RowValidationFailures](./award-calculator-fe/src/models/validation.ts) instance, then added to a
[TableValidationFailures](./award-calculator-fe/src/models/validation.ts) instance for the table

### Pay calculation

**TODO**

## User Interface

### Data Entry & Modification Screen

![Data entry & modification screen](./diagrams/screens/data-entry-modification-screen.png)

All shift data will be displayed in an editable table, with 1 shift per row. An optional file upload may be provided,
which will populate the UI table with data from the file.

If there is already data in the UI table when a file is provided, the existing data will be dropped & overwritten by
the new file.

Employees in the table are uniquely identified by the `Employee code` field.

Once all data has been entered, the user may click "Compute Pay" to move to the screen that shows the outcome of the
pay calculation.

#### Validation

Validation will be applied when the "Calculate Pay" button is clicked. If there are failures, no navigation will occur
& each of the validation failures will be marked in the UI table.

When providing a file for upload, an additional validation step will occur when matching the CSV headers with expected
column names. If the columns do not align, an error modal will appear & the file will not be ingested.

Validation rules may apply at 1 of 2 levels. Field-level validation ensures a particular data value has a correct
format & value. Table-level validation ensures data consistency between rows of the table.

**Field-level validation**

- `Employee code` must match pattern `[a-zA-Z0-9]+`
- `Last name` and `First name` must each contain at least 1 character
- `Pay rate` must match pattern `\$?[0-9]+(\.[0-9]{1,2})?`
- `Pay rate` must have a value of `0.01` or greater
- `Shift start date` must be in the format of `dd/mm/yy` or `dd/mm/yyyy`
- `Shift start time` and `Shift end time` must each be in the format of `HH:MM`
- `Shift start time` and `Shift end time`, combined with `ShiftStartDate` and the app's global timezone, must be a valid date-time
- `Shift end time` must be at least 1 minute after `Shift start time`
- `Casual loading` must have one of the following values (case insensitive):
  - `y`
  - `n`
  - `yes`
  - `no`
  - `true`
  - `false`

**Table-level validation**

- For any 2 rows with the same `Employee code`, the following fields must also be the same:
  - `Last name`
  - `First name`
  - `Pay rate`
  - `Casual loading`

### Pay report screen

![Pay report screen](./diagrams/screens/pay-report-screen.png)

The rows in the pay report screen will correspond 1-to-1 with the rows in the input screen, with the same ordering.

The "Download" button will trigger a CSV download of this pay report.

Each row in the result table includes a "details" button which when clicked, opens a modal with a detailed breakdown of
the components of pay for that shift.

![Shift pay breakdown modal](./diagrams/screens/shift-pay-breakdown-modal.png)
