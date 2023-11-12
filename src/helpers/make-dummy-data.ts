import { IUser } from "../interfaces/user";

export const makeDummyData = () => {
  let totalViews = 0;
  const two_years_of_random_view_dates = () => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const twoYearsAgo = currentYear - 2;

    const result: IUser["projects"]["x"]["viewDates"] = {};

    for (let year = twoYearsAgo; year <= currentYear; year++) {
      result[year.toString()] = {};

      for (let month = 0; month < 12; month++) {
        const totalDaysInMonth = new Date(year, month + 1, 0).getDate();
        result[year.toString()][(month + 1).toString()] = {};

        for (let day = 1; day <= totalDaysInMonth; day++) {
          // Generate a random number of views (for example, between 1 and 100)
          const randomViews = 10 + Math.floor(Math.random() * 4) + 1;

          totalViews += randomViews;

          // Assign the random number of views to the day
          result[year.toString()][(month + 1).toString()][day.toString()] =
            randomViews;
        }
      }
    }

    return result;
  };

  const viewDates = two_years_of_random_view_dates();

  return [totalViews, viewDates];
};
