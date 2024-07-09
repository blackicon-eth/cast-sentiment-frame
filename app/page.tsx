import { fetchMetadata } from "frames.js/next";
import type { Metadata } from "next";
import { appURL } from "./utils";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Cast sentiment frame",
    description: "A Farcaster frame that allows you to check the sentiment of your casts",
    other: {
      ...(await fetchMetadata(new URL("/frames", appURL()))),
    },
  };
}

// This is a react server component only
export default async function Home() {
  return <div className="p-4">{"You should not be here :)"}</div>;
}
