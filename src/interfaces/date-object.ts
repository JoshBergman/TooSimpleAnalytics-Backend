export interface DateObject {
  [year: number]: {
    [month: number]:
      | number
      | {
          [day: number]: number;
        };
  };
}
