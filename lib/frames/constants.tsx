import { appURL } from "../../app/utils";
import { Button } from "frames.js/next";

type AspectRatioType = "1.91:1" | "1:1" | undefined;
const aspectRatio: AspectRatioType = "1.91:1";

export const errorFrame = {
  image: `${appURL()}/error.png`,
  imageOptions: {
    aspectRatio: aspectRatio,
  },
  buttons: [
    <Button key="1" action="post" target="/sentiment">
      Try again
    </Button>,
  ],
};
