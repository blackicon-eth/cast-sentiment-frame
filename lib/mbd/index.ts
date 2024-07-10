import { MbdResponse } from "./types";

/**
 * Get the sentiment labels for the casts from MBD endpoint.
 * @param {string[]} ids - The casts' IDs to get the sentiment labels.
 * @returns The response from MBD with the sentiment labels related to the casts.
 **/
export const getSentimentLabels = async (ids: string[]): Promise<MbdResponse | null> => {
  try {
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

    if (!mbdRes.ok) {
      console.error("Error while getting the sentiment labels: ", mbdRes.statusText);
      return null;
    }

    return await mbdRes.json();
  } catch (error: any) {
    console.error("Error while getting the sentiment labels: ", error.message ?? error);
    return null;
  }
};
