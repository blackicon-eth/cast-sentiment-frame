import { DEFAULT_HUB_API_KEY } from "./constants";
import { NeynarResponse } from "./types";

/**
 * Get the 100 most recent casts for a user from Neynar.
 * @param {string} fid - The user's fid.
 * @returns The response from Neynar with the user's casts' hashes, limited to 100.
 **/
export const get100MostRecentCastsHashesForUser = async (fid: string): Promise<string[] | null> => {
  // variables declarations
  let cursor = "";
  let ids: string[] = [];

  try {
    do {
      const queryString = "?fid=" + fid + "&viewerFid=3&limit=50" + (cursor ? "&cursor=" + cursor : "");
      const url = "https://api.neynar.com/v1/farcaster/casts" + queryString;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          accept: "application/json",
          api_key: DEFAULT_HUB_API_KEY,
        },
      });

      // Handle HTTP error (response.status is not in the range 200-299)
      if (!response.ok) {
        return null;
      }

      const neynarRes: NeynarResponse = await response.json();

      // If the response has a result, extract the cast hashes (item IDs)
      if ("result" in neynarRes) {
        ids.push(...neynarRes.result.casts.map((cast: { hash: string }) => cast.hash));
        cursor = neynarRes.result.next.cursor;
      }
    } while (cursor && ids.length < 100);

    return ids.slice(0, 100);
  } catch (error: any) {
    console.error("Error while getting the most recent user's casts: ", error.message ?? error);
    return null;
  }
};
