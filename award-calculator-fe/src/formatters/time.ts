import { DateTimeFormatter, ZonedDateTime } from '@js-joda/core';

export const renderAsLocalDate = (dateTime: ZonedDateTime): string => {
  return dateTime.format(DateTimeFormatter.ofPattern("dd/MM/yyyy"));
};
