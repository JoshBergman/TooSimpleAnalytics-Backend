import { IUser } from "../interfaces/user";

export const makeDummyData = () => {
  const generateNormalDistribution = (mean: number, stdDev: number): number => {
    let u1 = 0;
    let u2 = 0;

    // Generate two independent random variables with a uniform distribution (0, 1)
    while (u1 === 0) u1 = Math.random();
    while (u2 === 0) u2 = Math.random();

    // Apply the Box-Muller transform to generate random numbers with a standard normal distribution
    const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);

    // Scale and shift the random number to the desired mean and standard deviation
    return mean + stdDev * z0;
  };

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
          const meanViews = 40;
          const stdDevViews = 2;
          const randomViews = Math.round(
            generateNormalDistribution(meanViews, stdDevViews)
          );

          totalViews += randomViews;

          // Assign the random number of views to the day
          result[year.toString()][(month + 1).toString()][
            day.toString()
          ].views = randomViews;
        }
      }
    }

    return result;
  };

  const viewDates = two_years_of_random_view_dates();

  return [totalViews, viewDates];
};
