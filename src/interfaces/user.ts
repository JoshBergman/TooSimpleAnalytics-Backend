export interface IUser {
  id: string;
  permID: string;
  email: string;
  password: string;
  projects: {
    [key: string]: {
      views: number;
    };
  };
  resetId?: string;
}
