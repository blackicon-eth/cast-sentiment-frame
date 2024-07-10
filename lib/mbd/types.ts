export type MbdResponse = {
  status_code: 200;
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
