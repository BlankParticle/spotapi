import { Hono } from "hono";

type Bindings = {
  SPOTIFY_COOKIE: string;
};

const predefinedRequestHeaders = {
  "User-Agent":
    "Mozilla/5.0 (X11; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/114.0",
  Accept:
    "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
  "Accept-Language": "en-US,en;q=0.5",
  "Alt-Used": "open.spotify.com",
  "Upgrade-Insecure-Requests": "1",
  "Sec-Fetch-Dest": "document",
  "Sec-Fetch-Mode": "navigate",
  "Sec-Fetch-Site": "cross-site",
};

const predefinedResponseHeaders = {
  "content-type": "application/json; charset=utf-8",
};

const app = new Hono<{ Bindings: Bindings }>();

let ACCESS_TOKEN: string | null = null;
let ACCESS_TOKEN_EXPIRY: number = Date.now();

type AccessTokenAPIData = {
  clientId: string;
  accessToken: string;
  accessTokenExpirationTimestampMs: number;
  isAnonymous: boolean;
};

app.get("/lyrics/:track_id", async (c) => {
  if (!c.env.SPOTIFY_COOKIE) {
    return new Response(
      JSON.stringify({ error: "API hasn't been setup correctly" }),
      {
        headers: predefinedResponseHeaders,
        status: 500,
      }
    );
  }

  try {
    if (!ACCESS_TOKEN || ACCESS_TOKEN_EXPIRY <= Date.now()) {
      console.log("[DEBUG] Getting token");
      const raw_data = await (
        await fetch("https://open.spotify.com/get_access_token", {
          headers: {
            ...predefinedRequestHeaders,
            Cookie: `sp_dc=${c.env.SPOTIFY_COOKIE}`,
          },
        })
      ).text();
      try {
        const data: AccessTokenAPIData = JSON.parse(raw_data);
        ACCESS_TOKEN = data.accessToken;
        ACCESS_TOKEN_EXPIRY = data.accessTokenExpirationTimestampMs;
      } catch (e) {
        console.log(e, raw_data);
        return new Response(
          JSON.stringify({ error: "Unknown Error Occurred!" }),
          {
            headers: predefinedResponseHeaders,
            status: 500,
          }
        );
      }
    }

    const { track_id } = c.req.param();
    const url = `https://spclient.wg.spotify.com/color-lyrics/v2/track/${track_id}?format=json&vocalRemoval=false`;
    const lyrics = await (
      await fetch(url, {
        headers: {
          "app-platform": "WebPlayer",
          authorization: `Bearer ${ACCESS_TOKEN}`,
        },
      })
    ).text();

    return new Response(
      lyrics === ""
        ? JSON.stringify({ error: "Lyrics are not available for this song" })
        : lyrics,
      {
        headers: predefinedResponseHeaders,
        status: lyrics === "" ? 404 : 200,
      }
    );
  } catch (e) {
    console.log(e);
    return new Response(JSON.stringify({ error: "Unknown Error Occurred!" }), {
      headers: predefinedResponseHeaders,
      status: 500,
    });
  }
});

app.get("*", (c) =>
  c.json(
    {
      error: "Bad Request, Try Requesting to /lyrics/<spotify_track_id>",
    },
    404
  )
);

export default app;
