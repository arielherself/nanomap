<p align="center">
<img src="public/icon.jpeg" style="height: 100px; border-radius: 50%"/>
</p>
<h1 align="center">nanoMap</h1>

**nanoMap** is a minimalized port for scheduling route on [OpenStreetMap](https://openstreetmap.org). This application is built with [Create React App](https://create-react-app.dev/) and the basic functionality uses [React Leaflet](https://react-leaflet.js.org) and [Vercel Serverless Functions](https://vercel.com/docs/functions/serverless-functions).

# Deployment

## Vercel

We already deployed two instances for you to use:

- Stable release: https://nanomap.vercel.app (suggested for most users)
- Developer release: https://nanomap-dev.vercel.app

You can also click this button to deploy with your own account: [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Farielherself%2Fnanomap&project-name=nanomap&repository-name=nanomap&demo-title=nanoMap&demo-description=A%20minimalized%20port%20for%20scheduling%20route%20on%20OpenStreetMap&demo-url=https%3A%2F%2Fnanomap.vercel.app)

## On your server

_Please install the latest version of [Node.js](https://nodejs.org), [npmJS](https://www.npmjs.com) and [Vercel CLI](https://vercel.com/docs/cli) first._

Just four line of script:

```shell
git clone "https://github.com/arielherself/nanomap" nanomap &&
cd nanomap &&
npm install &&
vercel dev
```
