import { format, toZonedTime, fromZonedTime } from 'date-fns-tz';

/**
 * Get the user's current timezone
 */
export const getUserTimezone = () => {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
};

/**
 * Convert a date from one timezone to another
 */
export const convertTimezone = (date, fromTimezone, toTimezone) => {
  try {
    // Convert the date to the target timezone
    const zonedDate = toZonedTime(date, toTimezone);
    return zonedDate;
  } catch (error) {
    console.error('Error converting timezone:', error);
    return date;
  }
};

/**
 * Format a date in a specific timezone
 */
export const formatInTimezone = (date, timezone, formatString = 'PPpp') => {
  try {
    const zonedDate = toZonedTime(date, timezone);
    return format(zonedDate, formatString, { timeZone: timezone });
  } catch (error) {
    console.error('Error formatting date in timezone:', error);
    return format(new Date(date), formatString);
  }
};

/**
 * Get timezone abbreviation (e.g., PST, EST)
 */
export const getTimezoneAbbr = (timezone, date = new Date()) => {
  try {
    const formatted = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      timeZoneName: 'short'
    }).format(date);
    
    const parts = formatted.split(' ');
    return parts[parts.length - 1];
  } catch (error) {
    console.error('Error getting timezone abbreviation:', error);
    return timezone;
  }
};

/**
 * Get UTC offset for a timezone
 */
export const getTimezoneOffset = (timezone, date = new Date()) => {
  try {
    const formatted = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      timeZoneName: 'longOffset'
    }).format(date);
    
    const match = formatted.match(/GMT([+-]\d{1,2}):?(\d{2})?/);
    if (match) {
      return match[0];
    }
    return '';
  } catch (error) {
    console.error('Error getting timezone offset:', error);
    return '';
  }
};

/**
 * Check if two dates are in the same day in a given timezone
 */
export const isSameDayInTimezone = (date1, date2, timezone) => {
  try {
    const zoned1 = toZonedTime(date1, timezone);
    const zoned2 = toZonedTime(date2, timezone);
    
    return (
      zoned1.getFullYear() === zoned2.getFullYear() &&
      zoned1.getMonth() === zoned2.getMonth() &&
      zoned1.getDate() === zoned2.getDate()
    );
  } catch (error) {
    console.error('Error comparing dates in timezone:', error);
    return false;
  }
};

/**
 * Format time range with timezone info
 */
export const formatTimeRange = (startDate, endDate, timezone, showTimezone = true) => {
  try {
    const userTimezone = getUserTimezone();
    const isUserTimezone = timezone === userTimezone;
    
    const startFormatted = formatInTimezone(startDate, timezone, 'MMM d, yyyy h:mm a');
    const endFormatted = formatInTimezone(endDate, timezone, 'h:mm a');
    
    const timezoneDisplay = showTimezone 
      ? ` ${getTimezoneAbbr(timezone, new Date(startDate))}`
      : '';
    
    if (isSameDayInTimezone(startDate, endDate, timezone)) {
      return `${startFormatted} - ${endFormatted}${timezoneDisplay}`;
    } else {
      const endFullFormatted = formatInTimezone(endDate, timezone, 'MMM d, yyyy h:mm a');
      return `${startFormatted} - ${endFullFormatted}${timezoneDisplay}`;
    }
  } catch (error) {
    console.error('Error formatting time range:', error);
    return `${format(new Date(startDate), 'PPpp')} - ${format(new Date(endDate), 'pp')}`;
  }
};

/**
 * Convert event times to user's timezone
 */
export const convertEventToUserTimezone = (event) => {
  const userTimezone = getUserTimezone();
  
  if (!event || !event.startDate || !event.endDate) {
    return event;
  }
  
  return {
    ...event,
    displayStartDate: convertTimezone(event.startDate, event.timezone, userTimezone),
    displayEndDate: convertTimezone(event.endDate, event.timezone, userTimezone),
    displayTimezone: userTimezone,
    originalTimezone: event.timezone
  };
};

/**
 * Get list of common timezones for dropdown
 */
export const getTimezoneOptions = () => {
  return [
    { value: 'America/New_York', label: 'Eastern Time (ET)' },
    { value: 'America/Chicago', label: 'Central Time (CT)' },
    { value: 'America/Denver', label: 'Mountain Time (MT)' },
    { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
    { value: 'America/Anchorage', label: 'Alaska Time (AKT)' },
    { value: 'Pacific/Honolulu', label: 'Hawaii Time (HT)' },
    { value: 'Europe/London', label: 'London (GMT)' },
    { value: 'Europe/Paris', label: 'Paris (CET)' },
    { value: 'Europe/Berlin', label: 'Berlin (CET)' },
    { value: 'Europe/Moscow', label: 'Moscow (MSK)' },
    { value: 'Asia/Dubai', label: 'Dubai (GST)' },
    { value: 'Asia/Kolkata', label: 'India (IST)' },
    { value: 'Asia/Singapore', label: 'Singapore (SGT)' },
    { value: 'Asia/Tokyo', label: 'Tokyo (JST)' },
    { value: 'Asia/Hong_Kong', label: 'Hong Kong (HKT)' },
    { value: 'Australia/Sydney', label: 'Sydney (AEDT)' },
    { value: 'Pacific/Auckland', label: 'Auckland (NZDT)' },
    { value: 'UTC', label: 'UTC' }
  ];
};