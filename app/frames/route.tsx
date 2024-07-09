/* eslint-disable react/jsx-key */
import { Button } from "frames.js/next";
import { frames } from "./frames";
import { appURL } from "../utils";

const frameHandler = frames(async () => {
  return {
    image: `${appURL()}/front.png`,
    imageOptions: {
      aspectRatio: "1.91:1",
    },
    buttons: [
      <Button action="post" target="/sentiment">
        Check!
      </Button>,
    ],
  };
});

export const GET = frameHandler;
export const POST = frameHandler;
