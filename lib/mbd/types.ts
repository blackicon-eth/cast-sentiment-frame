export type NeynarResponse = {
  result: {
    casts: any;
    next: {
      cursor: string;
    };
  };
} | null;
