import { DateTimeFormatter, ZonedDateTime } from '@js-joda/core';
import Decimal from 'decimal.js';

export const renderAsLocalDate = (dateTime: string): string => {
  return ZonedDateTime.parse(dateTime).format(DateTimeFormatter.ofPattern("dd/MM/yyyy"));
};

export const renderAsLocalTime = (dateTime: string): string => {
  return ZonedDateTime.parse(dateTime).format(DateTimeFormatter.ofPattern("HH:mm"));
};

export const renderDuration = (durationInMinutes: string): string => {
  const hours = new Decimal(durationInMinutes).dividedBy(new Decimal('60')).floor();
  const minutes = new Decimal(durationInMinutes).mod(new Decimal('60'));

  const parts = [];
  if (hours.greaterThan(0)) {
    parts.push(`${hours.toString()}h`);
  }
  if (minutes.greaterThan(0)) {
    parts.push(`${minutes.toString()}m`);
  }
  
  return parts.join(' ') || '0m';
};
