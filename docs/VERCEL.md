# Vercel deployment notes

## Existing configuration
`vercel.json` configures the Vite SPA fallback and long-lived immutable caching for `/assets/*`, while `index.html` is revalidated. The explicit `/404.html` is intended for missing static paths before the catch-all SPA rewrite. Re-check these behaviors in a real Vercel deployment.

## Project setup and Preview Deployments
1. Import this repository in Vercel and select Vite if framework detection does not do so automatically.
2. Set the production branch to `main`.
3. In **Project Settings → Git**, ensure Preview Deployments are enabled for pull requests. Vercel normally creates previews for pushes to non-production branches connected to the project; organization policies can restrict this.
4. Open a test PR and confirm its checks contain a preview URL. Verify the preview is isolated from production data and does not receive production-only secrets.
5. Set environment variables in **Project Settings → Environment Variables** only when a feature requires them, selecting the right Development, Preview, and Production scopes. Redeploy after changing variables.

## Environment variables
The current app is a static Vite/React client and requires no environment variables to build or run. Never put secrets in `VITE_*` variables: these values are bundled into client code. If future server-side features require secrets, keep them server-only and scope them appropriately.

## Private gift link: Deployment Protection trade-offs
- **Vercel Authentication / team login**: strongest convenient option for private previews, but recipients need access to the Vercel team/account. Not suitable for a recipient who should not sign in.
- **Password protection**: where available on your Vercel plan, protects the deployment with a shared password. The recipient must enter it; anyone who gets the password can share it. Check plan/feature availability in Vercel before relying on it.
- **Protection bypass / shareable bypass link**: convenient for testers, but the bypass URL is effectively a bearer credential. Treat it like a password, avoid public posts, and revoke or rotate it after the gift moment if supported.
- **Unlisted public URL**: simplest and frictionless, but not access control. Anyone who receives or guesses the URL can open it; robots directives are not a security boundary.
- **Separate production domain/path**: convenient for a polished experience, but a secret path is still not protection. Use actual deployment protection or an application-level authentication gate for sensitive content.

Before choosing protection, check the current Vercel plan and exact protection mode in the dashboard. Avoid placing private names, photos, or messages in a publicly accessible preview until protection is verified.
