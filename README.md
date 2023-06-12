# Spot API
> **Warning:** Spotify doesn't provide any official lyrics API, this project is supposed to provide lyrics by requesting to spotify's WebPlayer lyrics API. So I can't host it for you. You can't use this API for any commercial use, this API is supposed to be self hosted and used in personal sites like your portfolio. I, [BlankParticle](https://github.com/BlankParticle) or any other entity mentioned in the project will not responsible for anything.

## Context
I was creating my Portfolio when it occurred to me that I could add a **Spotify Widget** in my portfolio, I saw some examples but they all looked the same. So as a responsible developer, I tried to create a widget with lyrics, but spotify didn't have any lyrics API thus this Project was born.

## The Blog Article
Read more about How I created this project at [my blog article](https://blog.blankparticle.me/creating-a-self-hosted-spotify-lyrics-api-using-cloudflare-workers).

## Project Structure
Initially, this was a [Svelte Kit](https://kit.svelte.dev) Project, I used Svelte API routes with [Vercel](https://vercel.com) as a hosting. But later I thought that maybe I can create this as a Project with standalone serverless functions.

You can find code for different cloud providers in their respective folders.

### Currently Planned Platforms
- [x] Cloudflare Workers (wrangler)
- [ ] Vercel

## Self Hosting your API

First clone this repo using git

```bash
git clone https://github.com/BlankParticle/spotapi.git
cd spotapi
```
Now you need Your [Spotify User Cookie](https://blog.blankparticle.me/creating-a-self-hosted-spotify-lyrics-api-using-cloudflare-workers#heading-obtaining-the-spdc-cookie), You can make a new spotify account. You only need the `sp_dc` cookie. Be sure not to leak this cookie because this can be used to login into your spotify account.

> **Note:** This cookie may expire if you logout from your account or after 1 year of use, You must check for that and provide a new cookie when that happens.

Now save this cookie in a `.env` file in project root
```bash
SPOTIFY_COOKIE=your-sp_dc-cookie
```
Then install NodeJs and `npm` (or `pnpm`/`yarn`) if haven't already.

### Cloudflare Worker
#### Test Locally before deploying
```bash
cp .env wrangler/.dev.vars
cd wrangler
npm install # or use "pnpm install" or "yarn"
npm run dev # or use "pnpm dev" or "yarn dev"
```

If all that works then you can go to <http://localhost:8787/lyrics/4PTG3Z6ehGkBFwjybzWkR8> and test your worker.

#### Deploy to cloudflare worker
If you don't have a cloudflare account, [create one](https://dash.cloudflare.com/). 
Now type,
```bash
npm run add-secret # or use "pnpm add-secret" or "yarn add-secret"
```
then login (if prompted), and put your cookie.

Now you can run,
```bash
npm run deploy # or use "pnpm run deploy" or "yarn run deploy"
```
And, You have your self hosted Spotify Lyrics API.

### Vercel
> Work in Progress
