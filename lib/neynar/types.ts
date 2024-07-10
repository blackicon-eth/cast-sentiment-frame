export type NeynarResponse =
  | {
      result: {
        casts: any;
        next: {
          cursor: string;
        };
      };
    }
  | {
      code: string;
      message: string;
      property: string;
    };
