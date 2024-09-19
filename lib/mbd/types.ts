export type MbdResponse = {
  body: {
    sentiment: {
      label: "negative" | "neutral" | "positive";
      score: number;
    }[];
  }[];
};
