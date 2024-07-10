export type MbdResponse = {
  status_code: number;
  body: [
    {
      item_id: string;
      labels: {
        sentiment: {
          neutral: number;
          positive: number;
          negative: number;
        };
      };
    }
  ];
};
