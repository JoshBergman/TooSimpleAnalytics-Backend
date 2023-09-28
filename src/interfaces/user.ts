export interface IUser {
  id: string;
  email: string;
  password: string;
  projects: {
    id: string;
    name: string;
  }[];
  resetId?: string;
}
