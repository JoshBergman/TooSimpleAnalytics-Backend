// This is the data stored for each day (IDayData)
interface IDayData {
  views: number;
  agent?: {
    device?: {
      desktop?: number;
      mobile?: number;
    };
    browser?: {
      [browserBrand: string]: number;
    };
  };
  // The countryCode "US" will have another nested layer for each state where all other country codes will just have views for that country
  locations?: {
    [countryCode: string]: number | { [usStateCode: string]: number };
  };
}

export interface IUser {
  id: string; //primarily used for JWT and finding user in db. Is designed to be able to be replaced to reset the existing JWT's. DB is indexed by this field
  permID: string; // used as a project ID to reference the account projects when adding views. Changing this will break existing endpoints
  //todo add db index for permID
  email: string;
  password: string;
  verify: string; // used for verifying the user has ownership / access to the email used for the account
  resetID?: string; // used for resetting password
  projects: {
    [projectName: string]: {
      totalViews: number;
      viewDates: {
        [year: string]: {
          [month: string]: {
            [day: string]: IDayData;
          };
        };
      };
    };
  };
}
