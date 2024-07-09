import { DEFAULT_HUB_API_KEY } from "../constants";
import { NeynarResponse } from "./types";

export const getMostRecentCastsForUser = async (fid: string, cursor: string): Promise<NeynarResponse> => {
  const queryString = "?fid=" + fid + "&viewerFid=3&limit=50" + (cursor ? "&cursor=" + cursor : "");

  // get channel feed from Neynar
  const url = "https://api.neynar.com/v1/farcaster/casts" + queryString;
  const neynarRes = await fetch(url, {
    method: "GET",
    headers: {
      accept: "application/json",
      api_key: DEFAULT_HUB_API_KEY,
    },
  });

  const neynarResJson = await neynarRes.json();

  if (neynarResJson.code) {
    return null;
  }
  return neynarResJson;
};

export const getSentimentLabels = async (ids: any) => {
  let url = "https://api.mbd.xyz/v1/farcaster/casts/labels/for-items";
  const mbdRes = await fetch(url, {
    method: "POST",
    headers: {
      accept: "application/json",
      "HTTP-Referer": "https://docs.mbd.xyz/",
      "X-Title": "mbd_docs",
      "content-Type": "application/json",
      "x-api-key": process.env.MBD_API_KEY!,
    },
    body: JSON.stringify({
      items_list: ids,
      label_category: "sentiment",
    }),
  });
  return mbdRes.json();
};
