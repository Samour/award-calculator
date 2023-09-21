import { LocalDateTime, ZoneId } from '@js-joda/core';
import Decimal from 'decimal.js';
import { LoadingClassification, WorkerPayable } from 'models/outputs/payable';
import { APP_TIME_ZONE } from 'models/time';

// Keeping this around, as we'll probably want to use it in future
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const dummyWorkerPayableOutcomes: WorkerPayable[] = [
  {
    worker: {
      code: 'S1065',
      name: {
        lastName: 'Doe',
        firstName: 'Joe',
      },
      basePayRate: new Decimal('2575'),
      casualLoading: true,
      shifts: [],
    },
    shifts: [
      {
        shift: {
          sourceRow: 0,
          startTime: LocalDateTime.parse('2023-09-14T09:00:00').atZone(ZoneId.of(APP_TIME_ZONE)),
          endTime: LocalDateTime.parse('2023-09-14T17:00:00').atZone(ZoneId.of(APP_TIME_ZONE)),
        },
        increments: [
          {
            startTime: LocalDateTime.parse('2023-09-14T09:00:00').atZone(ZoneId.of(APP_TIME_ZONE)),
            endTime: LocalDateTime.parse('2023-09-14T15:30:00').atZone(ZoneId.of(APP_TIME_ZONE)),
            duration: new Decimal('390'),
            classification: LoadingClassification.REGULAR_TIME,
            loading: new Decimal('1'),
            payableAmount: new Decimal('16737.50'),
          },
          {
            startTime: LocalDateTime.parse('2023-09-14T15:30:00').atZone(ZoneId.of(APP_TIME_ZONE)),
            endTime: LocalDateTime.parse('2023-09-14T17:00:00').atZone(ZoneId.of(APP_TIME_ZONE)),
            duration: new Decimal('90'),
            classification: LoadingClassification.TIME_AND_A_HALF,
            loading: new Decimal('1.5'),
            payableAmount: new Decimal('5793.75'),
          },
          {
            startTime: LocalDateTime.parse('2023-09-14T09:00:00').atZone(ZoneId.of(APP_TIME_ZONE)),
            endTime: LocalDateTime.parse('2023-09-14T17:00:00').atZone(ZoneId.of(APP_TIME_ZONE)),
            duration: new Decimal('480'),
            classification: LoadingClassification.CASUAL,
            loading: new Decimal('0.25'),
            payableAmount: new Decimal('5150'),
          },
        ],
        payableAmount: new Decimal('27681'),
      },
      {
        shift: {
          sourceRow: 1,
          startTime: LocalDateTime.parse('2023-09-15T09:00:00').atZone(ZoneId.of(APP_TIME_ZONE)),
          endTime: LocalDateTime.parse('2023-09-15T17:00:00').atZone(ZoneId.of(APP_TIME_ZONE)),
        },
        increments: [
          {
            startTime: LocalDateTime.parse('2023-09-15T09:00:00').atZone(ZoneId.of(APP_TIME_ZONE)),
            endTime: LocalDateTime.parse('2023-09-15T15:30:00').atZone(ZoneId.of(APP_TIME_ZONE)),
            duration: new Decimal('390'),
            classification: LoadingClassification.REGULAR_TIME,
            loading: new Decimal('1'),
            payableAmount: new Decimal('16737.50'),
          },
          {
            startTime: LocalDateTime.parse('2023-09-15T15:30:00').atZone(ZoneId.of(APP_TIME_ZONE)),
            endTime: LocalDateTime.parse('2023-09-15T17:00:00').atZone(ZoneId.of(APP_TIME_ZONE)),
            duration: new Decimal('90'),
            classification: LoadingClassification.TIME_AND_A_HALF,
            loading: new Decimal('1.5'),
            payableAmount: new Decimal('5793.75'),
          },
          {
            startTime: LocalDateTime.parse('2023-09-15T09:00:00').atZone(ZoneId.of(APP_TIME_ZONE)),
            endTime: LocalDateTime.parse('2023-09-15T17:00:00').atZone(ZoneId.of(APP_TIME_ZONE)),
            duration: new Decimal('480'),
            classification: LoadingClassification.CASUAL,
            loading: new Decimal('0.25'),
            payableAmount: new Decimal('5150'),
          },
        ],
        payableAmount: new Decimal('27681'),
      },
    ],
    payableAmount: new Decimal('55362'),
  },
  {
    worker: {
      code: 'S1066',
      name: {
        lastName: 'Smith',
        firstName: 'Matt',
      },
      basePayRate: new Decimal('2850'),
      casualLoading: false,
      shifts: [],
    },
    shifts: [
      {
        shift: {
          sourceRow: 2,
          startTime: LocalDateTime.parse('2023-09-14T09:00:00').atZone(ZoneId.of(APP_TIME_ZONE)),
          endTime: LocalDateTime.parse('2023-09-14T16:30:00').atZone(ZoneId.of(APP_TIME_ZONE)),
        },
        increments: [
          {
            startTime: LocalDateTime.parse('2023-09-14T09:00:00').atZone(ZoneId.of(APP_TIME_ZONE)),
            endTime: LocalDateTime.parse('2023-09-14T16:30:00').atZone(ZoneId.of(APP_TIME_ZONE)),
            duration: new Decimal('450'),
            classification: LoadingClassification.REGULAR_TIME,
            loading: new Decimal('1'),
            payableAmount: new Decimal('21375'),
          },
        ],
        payableAmount: new Decimal('21375'),
      },
    ],
    payableAmount: new Decimal('21375'),
  },
];
