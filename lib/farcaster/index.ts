export const createCastIntent = (fid: string, sentiment: string) => {
  const url = `https://sentiment-frame.vercel.app/frames/sentiment?fid=${fid}`;
  const text = `I just checked my sentiment of my casts and it's quite ${sentiment}. Check yours too!`;
  const finalURL = `https://warpcast.com/~/compose?text=${encodeURIComponent(text)}&embeds[]=${encodeURIComponent(url)}`;
  return finalURL;
};
