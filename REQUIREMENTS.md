# Requirements

- [Time & Pay calculations](#time--pay-calculations)
  - [Retail Award](#retail-award)
- [Data entry](#data-entry)

## Time & Pay calculations

Calculation is performed on a per-worker basis

Inputs per worker:

- Award
- Hours worked (start/ + end times for each shift)
- Base pay rate (BPR)
- Whether casual loading applies

Output per worker:

- Classify time worked as either regular time (1), time-and-a-half (1.5) or double-time (2)
- Calculate total pay based on base pay rate, overtime loading and casual loading

#### Assumptions

- All times are in AEST
- All monetary amounts are in AUD
- Only 1 award applies to each worker
  - Corollary: all shifts for a particular worker apply under the same award
- Base pay rate & casual loading is applied at the worker level
  - Ie for a given worker, all shifts have the same pay rate & casual loading
- All breaks are ignored
  - *This is an initial assumption to simplify the first iteration of this tool*
  - Any time taken for a break is paid at the same rate as if it were not a break
  - Award rules relating to breaks are ignored (ie we will assume that all required breaks are taken & there is no
  additional overtime to be awarded)
- All public holidays are ignored

*Technical Assumptions*

- All monetary calculations will be made using cents in base 10
- All time calculations will be made using minutes in base 10
- All intermediate values will be calculated with the following precision:
  - Money: 4 decimal places
  - Time: 2 decimal places
- All final values will be calculated with a precision of 0 decimal places
- All rounding will be half-even

### Per-award rules

#### Retail Award

- All time worked is classified as either regular time (RT) or overtime (OT).
- Overtime is further classified as either time-and-a-half (TAH) or double-time (DT)
- Hours are paid according to the following formulae:
  - RT: RT hours * BPR
  - TAH: TAH hours * BPR * 1.5
  - DT: DT hours * BPR * 2
- If casual loading applies, the following pay will be added to the final amount:
  - Total hours * BPR * 0.25

**Overtime worked**

Time worked counts as overtime if any of the following are true:

- The time worked is outside any of the following windows:
  - 7am-9pm on a Monday - Friday
  - 7am-6pm on a Saturday
  - 9am-6pm on a Sunday
- Time worked is beyond 9 hours in a given day*
  - An exemption exists for the first such day this occurs in any given week. In that case, the threshold is 11 hours
rather than 9.
- Time worked is beyond 76 hours in a given fortnight
- All time worked beyond the 5th consecutive day that has a shift worked
- All time worked beyond 5 hours with no break
  - *Based on assumptions, we will be ignoring this requirement for now*

*Definition of "day" TBD

**Overtime pay**

- OT is grouped by the day in which it occurred
- The first 3 hours of OT in any given day is classified as TAH
- All remaining OT is classified as DT

## Data entry

Worker shift data will be entered as tabular data, with a row per shift worked. The table will have the following
columns:

| Employee code | Last name | First name | Shift start date | Shift start time | Shift end time | Casual Loading |
|--|--|--|--|--|--|--|
| S1065 | Doe | John | 14/09/2023 | 09:00 | 17:00 | Y |
| S1065 | Doe | John | 15/09/2023 | 09:00 | 17:00 | Y |
| S1066 | Smith | Matt | 14/09/2023 | 09:00 | 16:30 | N |

Options should exist to enter data via CSV upload or by manual data entry into a table UI.