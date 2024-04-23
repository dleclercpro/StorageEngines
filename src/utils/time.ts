import TimeDuration from '../models/units/TimeDuration';

export const sleep = async (duration: TimeDuration) => {
    const ms = duration.toMs().getAmount();

    await new Promise(resolve => setTimeout(resolve, ms));
};

export const toUTC = (now: Date) => {

    // Convert the date to UTC
    const year = now.getUTCFullYear();
    const month = now.getUTCMonth() + 1;
    const day = now.getUTCDate();

    // Format the date components to ensure two digits for month and day
    const formattedMonth = month < 10 ? `0${month}` : `${month}`;
    const formattedDay = day < 10 ? `0${day}` : `${day}`;

    // Combine the parts to form the final string
    return `${year}-${formattedMonth}-${formattedDay}`;
};

/**
 * Check if a string is a valid date in the YYYY-MM-DD format.
 * @param dateString The string to validate.
 * @returns boolean True if valid, false otherwise.
 */
export const isValidDate = (dateString: string) => {
    const date = new Date(dateString);

    if (!date.getTime()) {
        return false;
    }
    
    // Confirm that the input date string has not been reinterpreted (e.g., different formats).
    const dateParts = dateString.split('-');
    return date.getUTCFullYear() === parseInt(dateParts[0], 10) &&
           date.getUTCMonth() === parseInt(dateParts[1], 10) - 1 &&
           date.getUTCDate() === parseInt(dateParts[2], 10);
}