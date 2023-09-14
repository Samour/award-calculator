# Solution Design

- [Data Models](#data-models)

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
