# My Map Poster (Web App & API)
This repository contains the source code for the final project of my "Cloud Computing II" course. \
The project is based on a web app that allows users to design their own map poster for printing. This repository contains the web app as well as the backend API, both built with Next.js.

## Prerequisites
For running or building the application some environment variables must be set. The `.env.local.example` file can be used as a template for defining the required env vars.

## Development
To start a development server the following command can be used:

```bash
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Production
A production image for the web app and API can be created using the included Dockerfile. Using a GitHub Action located in the `.github/workflows` directory, an image is automatically built and uploaded upon a push to this repository's main branch. Via GitHub Secrets the environment variables are provided during the build stage of the GitHub Action.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.