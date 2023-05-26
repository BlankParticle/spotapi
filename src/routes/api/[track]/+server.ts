import { SP_DC } from "$env/static/private";
import type { RequestHandler } from "./$types";

type Data = {
  clientId: string;
  accessToken: string;
  accessTokenExpirationTimestampMs: number;
  isAnonymous: boolean;
};

export const GET = (async ({ params }) => {
  if (!process.env.ACCESS_TOKEN || Date.now() >= Number(process.env.ACCESS_TOKEN_EXPIRY)) {
    const data: Data = await (
      await fetch("https://open.spotify.com/get_access_token", {
        headers: {
          Cookie: `sp_dc=${SP_DC}`,
        },
      })
    ).json();
    process.env.ACCESS_TOKEN = data.accessToken;
    process.env.ACCESS_TOKEN_EXPIRY = data.accessTokenExpirationTimestampMs;
  }
  const url = `https://spclient.wg.spotify.com/color-lyrics/v2/track/${params.track}?format=json&vocalRemoval=false`;
  const lyrics = await (
    await fetch(url, {
      headers: {
        "app-platform": "WebPlayer",
        authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
      },
    })
  ).json();
  return new Response(JSON.stringify(lyrics, null, 2), {
    headers: {
      "content-type": "application/json; charset=utf-8",
    },
  });
}) satisfies RequestHandler;
