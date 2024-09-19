import { Button } from "frames.js/next";
import { frames } from "../frames";
import { appURL } from "../../utils";
import { getSentimentLabels } from "../../../lib/mbd";
import * as fs from "node:fs/promises";
import * as path from "node:path";
import { createCastIntent } from "../../../lib/farcaster";
import { get100MostRecentCastsHashesForUser } from "../../../lib/neynar";
import { errorFrame } from "../../../lib/frames/constants";

const frameHandler = frames(async (ctx) => {
  // Search for the fid in the URL (if the fid is here, the frame was shared)
  const urlFid = ctx.url.searchParams.get("fid");

  // Get the fid from the URL or the cast message
  const fid = urlFid || ctx.message?.requesterFid;

  if (!fid) {
    return errorFrame;
  }

  // Get the 100 most recent casts for a user from Neynar and extract the cast hashes (item IDs)
  let ids = await get100MostRecentCastsHashesForUser(fid.toString());

  if (!ids) {
    return errorFrame;
  }

  // Get sentiment data from mbd
  const mbdRes = await getSentimentLabels(ids);

  if (!mbdRes || !mbdRes.body || mbdRes.body.length < 1) {
    return errorFrame;
  }

  // Compute score by taking the average positivity for the user's casts
  let count = 0;

  let positiveSum = 0;
  let negativeSum = 0;
  let neutralSum = 0;

  // Find the index of the sentiment labels to use it later
  const positiveIndex = mbdRes.body[0]!.sentiment.findIndex((sentiment) => sentiment.label === "positive");
  const negativeIndex = mbdRes.body[0]!.sentiment.findIndex((sentiment) => sentiment.label === "negative");
  const neutralIndex = mbdRes.body[0]!.sentiment.findIndex((sentiment) => sentiment.label === "neutral");

  mbdRes.body.map((current) => {
    console.log("Current item: ", current);
    const positive = current.sentiment[positiveIndex];
    const negative = current.sentiment[negativeIndex];
    const neutral = current.sentiment[neutralIndex];
    if (positive && negative && neutral) {
      count++;
      positiveSum += positive.score;
      neutralSum += neutral.score;
      negativeSum += negative.score;
    }
  });

  const positivityScore = positiveSum / count;
  const negativityScore = negativeSum / count;
  const neutralityScore = neutralSum / count;

  // Find the top score among the three
  const topScore = Math.max(positivityScore, negativityScore, neutralityScore);

  // Create the button based on if the frame was shared or not
  const buttons = [
    !urlFid ? (
      <Button
        action="link"
        target={createCastIntent(
          fid.toString(),
          topScore === positivityScore ? "positive" : topScore === negativityScore ? "negative" : "neutral"
        )}
      >
        Share your result!
      </Button>
    ) : (
      <Button action="post" target="/sentiment">
        Test yours!
      </Button>
    ),
  ];

  return {
    image: (
      <div tw="flex flex-col w-full h-full">
        <img src={`${appURL()}/background.png`} alt="background-image" tw="absolute w-full h-full" />
        <div tw="flex flex-col items-center -mt-4">
          <h1 tw="text-header text-center -mb-28">Sentiment in your casts</h1>
          <h1 tw="text-header text-center -mb-12">is mainly</h1>
          {topScore === positivityScore ? (
            <h1 tw="text-8xl text-center -mb-3 text-green-500">😁 Positive</h1>
          ) : topScore === negativityScore ? (
            <h1 tw="text-8xl text-center -mb-3 text-red-500">😞 Negative</h1>
          ) : (
            <h1 tw="text-8xl text-center -mb-3 text-gray-500">😐 Neutral</h1>
          )}
          <p tw="text-4xl text-center -mb-12">Positive score: {positivityScore.toFixed(2)}</p>
          <p tw="text-4xl text-center -mb-12">Neutral score: {neutralityScore.toFixed(2)}</p>
          <p tw="text-4xl text-center -mb-12">Negative score: {negativityScore.toFixed(2)}</p>
        </div>
      </div>
    ),
    imageOptions: {
      aspectRatio: "1.91:1",
      fonts: [
        {
          name: "Dangrek",
          data: await fs.readFile(path.join(path.resolve(process.cwd(), "public"), "dangrek.ttf")),
        },
      ],
    },
    buttons: buttons,
  };
});

export const GET = frameHandler;
export const POST = frameHandler;
