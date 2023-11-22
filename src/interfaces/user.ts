export interface IUser {
  id: string; //primarily used for JWT and searching user. Is designed to be able to be replaced to reset the existing jwt's
  permID: string; // used as a project ID to reference the account projects when adding views. Changing this will break existing endpoints
  email: string;
  password: string;
  verify: string; // used for verifying the user has ownership / access to the email used for the account
  projects: {
    [projectName: string]: {
      totalViews: number;
      viewDates: {
        [year: string]: {
          [month: string]: {
            [day: string]: number;
          };
        };
      };
    };
  };
  resetId?: string;
}
