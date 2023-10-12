export interface IUser {
  id: string;
  permID: string;
  email: string;
  password: string;
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
