import { DateObject } from "../interfaces/date-object";

export function getDateRangeProjection(startDate: Date, endDate: Date) {
  //! BEWARE! STARTDATE IS THE EARLIER DATE AND ENDDATE IS THE LATER DATE SWITCHING THEM WILL GIVE EMPTY OBJECT
  const dateRange: DateObject = {};

  const startMonth = startDate.getMonth();
  const startYear = startDate.getFullYear();
  const endMonth = endDate.getMonth();
  const endYear = endDate.getFullYear();

  // Iterate through each day between start and end date
  for (
    let currentDate = new Date(startDate);
    currentDate <= endDate;
    currentDate.setDate(currentDate.getDate() + 1)
  ) {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const day = currentDate.getDate();

    if (
      (month === startMonth && year === startYear) ||
      (month === endMonth && year === endYear)
    ) {
      // Add the current date to the date range object
      if (!dateRange[year]) dateRange[year] = {};
      if (!dateRange[year][month + 1]) dateRange[year][month + 1] = {};
      //@ts-expect-error We can be 100% confident as this is type checked lol
      dateRange[year][month + 1][day] = 1;
    } else {
      if (!dateRange[year]) dateRange[year] = {};
      if (!dateRange[year][month + 1]) dateRange[year][month + 1] = {};
      dateRange[year][month + 1] = 1;

      //increment currentDate by a month if the month is fully included
      if (currentDate.getMonth() === 11) {
        // December (zero-based)
        currentDate.setFullYear(currentDate.getFullYear() + 1); // Increment year
        currentDate.setMonth(0); // Set month to January (zero-based)
      } else {
        currentDate.setMonth(currentDate.getMonth() + 1); // Increment month
      }
    }
  }

  return dateRange;
}
