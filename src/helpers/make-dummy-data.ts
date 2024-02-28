import { IUser } from "../interfaces/user";

export const makeDummyData = () => {
  const meanViewDates = 150;
  let totalViews = 0;
  const viewDates: IUser["projects"]["project"]["viewDates"] = {};

  const today = new Date();
  const currYear = today.getFullYear();
  const date = new Date(2022, 0, 1);
  while (date < today) {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    if (!viewDates[year]) {
      viewDates[year] = {};
    }
    if (!viewDates[year][month]) {
      viewDates[year][month] = {};
    }

    viewDates[year][month][day] = makeFakeViewDate(
      month,
      meanViewDates,
      currYear - year
    );

    date.setDate(date.getDate() + 1); //increments date by 1 day
  }

  return [totalViews, viewDates];

  function makeFakeViewDate(
    month: number,
    meanViewsPerDay: number,
    yearsAgo: number
  ) {
    const viewsForDay = getDaysViews(month, meanViewsPerDay);
    const deviceDist = getDistribution(viewsForDay, 2, true, false);
    const browserDist = getDistribution(viewsForDay, 4, false, false);
    const StatesDist = getDistribution(viewsForDay, 10, false, true);
    const viewDate = {
      views: viewsForDay,
      agent: {
        device: {
          desktop: deviceDist[0],
          mobile: deviceDist[1],
        },
        browser: {
          Chromium: browserDist[0],
          Safari: browserDist[1],
          Edge: browserDist[3],
          Other: browserDist[2],
        },
      },
      locations: {
        US: {
          MN: StatesDist[0],
          TX: StatesDist[1],
          CA: StatesDist[2],
          FL: StatesDist[3],
          NY: StatesDist[4],
          CO: StatesDist[5],
          WI: StatesDist[6],
          MI: StatesDist[7],
          WA: StatesDist[8],
          WY: StatesDist[9],
        },
        FR: getRandomNumber(0, 4),
        PL: getRandomNumber(0, 2),
        NL: getRandomNumber(0, 2),
      },
    };

    totalViews += viewsForDay;
    return viewDate;

    function getDaysViews(month: number, meanViewsPerDay: number) {
      let views = meanViewsPerDay;
      const viewDeviation = getRandomNumber(
        0,
        Math.floor(meanViewsPerDay * 0.2)
      );

      if (getRandomNumber(0, 1) === 1) {
        views += viewDeviation;
      } else {
        views -= viewDeviation;
      }

      const monthModifier = month * 0.1; //used to show increase of views over time
      views += Math.floor(views * monthModifier);

      const yearModifier = yearsAgo * 0.3 * meanViewsPerDay; //makes older years appear as if they have less views
      views -= yearModifier;

      return Math.floor(views);
    }

    function getRandomNumber(min: number, max: number) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function getDistribution(
      number: number,
      distCount: number,
      useHarsh: boolean,
      useSoft: boolean
    ) {
      const dists = [];
      for (let i = 0; i < distCount; i++) {
        if (dists.length <= 0) {
          dists.push(1);
          continue;
        }
        let distDivisor = 0;
        if (useHarsh) {
          distDivisor = getRandomNumber(20, 40) * 0.1;
        } else if (useSoft) {
          distDivisor = getRandomNumber(15, 17) * 0.1;
        } else {
          distDivisor = getRandomNumber(1.8, 3.5);
        }
        dists.push(dists[i - 1] / distDivisor);
      }

      const appliedDists = [];
      let remainder = number;
      for (let i = dists.length - 1; i >= 0; i--) {
        let appliedDist = Math.floor(remainder * dists[i]);
        if (appliedDist <= 0) {
          appliedDist = 1;
        }

        appliedDists.unshift(appliedDist);
        remainder -= appliedDist;
      }
      return appliedDists;
    }
  }
};
