import { SP_DC, DISCORD_WEBHOOK } from "$env/static/private";
import type { RequestHandler } from "./$types";

type Data = {
  clientId: string;
  accessToken: string;
  accessTokenExpirationTimestampMs: number;
  isAnonymous: boolean;
};

export const GET = (async ({ params }) => {
  try {
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
    ).text();
    return new Response(lyrics === "" ? JSON.stringify({ error: "Lyrics Not found" }) : lyrics, {
      headers: {
        "content-type": "application/json; charset=utf-8",
      },
    });
  } catch (e) {
    fetch(DISCORD_WEBHOOK, {
      method: "POST",
      headers: {
        "content-type": "application/json; charset=utf-8",
      },
      body: JSON.stringify({
        content: (() => {
          try {
            return JSON.stringify(e);
          } catch (e) {
            return "Unknown Runtime Error";
          }
        })(),
      }),
    });
    return new Response(JSON.stringify({ error: "Unknown Error Occurred!" }), {
      headers: {
        "content-type": "application/json; charset=utf-8",
      },
    });
  }
}) satisfies RequestHandler;
