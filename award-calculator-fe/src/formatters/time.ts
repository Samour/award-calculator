import { DateTimeFormatter, ZonedDateTime } from '@js-joda/core';
import Decimal from 'decimal.js';
import { IncrementalMinuteDuration } from 'models/time';

export const renderAsLocalDate = (dateTime: ZonedDateTime): string => {
  return dateTime.format(DateTimeFormatter.ofPattern("dd/MM/yyyy"));
};

export const renderAsLocalTime = (dateTime: ZonedDateTime): string => {
  return dateTime.format(DateTimeFormatter.ofPattern("HH:mm"));
};

export const renderDuration = (durationInMinutes: IncrementalMinuteDuration): string => {
  const hours = durationInMinutes.dividedBy(new Decimal('60')).floor();
  const minutes = durationInMinutes.mod(new Decimal('60'));

  const parts = [];
  if (hours.greaterThan(0)) {
    parts.push(`${hours.toString()}h`);
  }
  if (minutes.greaterThan(0)) {
    parts.push(`${minutes.toString()}m`);
  }
  
  return parts.join(' ') || '0m';
};
