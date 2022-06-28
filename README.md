# webcam-guessr
[![Netlify Status](https://api.netlify.com/api/v1/badges/6f6b78c7-3030-4d7d-b52c-d9a0a8f11d58/deploy-status)](https://app.netlify.com/sites/webcamguessr/deploys)

-----

## Environment Variables

Copy `.env.example` in root to `.env` and set the specific keys.

Needs API-Keys for Bing Maps and Windy

- Windy API: [https://api.windy.com/webcams](https://api.windy.com/webcams)
- Bing Maps: [https://www.bingmapsportal.com/](https://api.windy.com/webcams)

Alternatively use OSM for local development ([https://www.openstreetmap.org/](https://www.openstreetmap.org/))

## Developing

Once you've cloned the project and installed dependencies with `npm install` start a development server:

```bash
# prepare project when changing theme or on first start
npm run prepare

npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

Generate Country Data via `node create-json.cjs`

Credits country list: [https://gist.github.com/cplpearce/3bc5f1e9b1187df51d2085ffca795bee](https://gist.github.com/cplpearce/3bc5f1e9b1187df51d2085ffca795bee)

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.
