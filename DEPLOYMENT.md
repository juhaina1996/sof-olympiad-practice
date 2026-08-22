# Deploying this site and getting it into Google

This app is built to be crawlable and SEO-ready: every syllabus/practice page
is statically generated (`next build` produced 34 static pages), has real
text content (not hidden behind a login), and has proper metadata, a
sitemap, and FAQ structured data. Follow these steps to actually put it on
the internet and start getting found on Google.

## 1. Push the code to GitHub

```bash
cd ~/Personal/sof-olympiad-practice
git add -A
git commit -m "Initial SOF Olympiad practice site"
git branch -M main
```

Create an empty repo on GitHub (github.com → New repository → don't
initialize with a README), then:

```bash
git remote add origin https://github.com/<your-username>/<repo-name>.git
git push -u origin main
```

## 2. Deploy to Vercel (free)

Vercel is made by the Next.js team and deploys this kind of app with zero
configuration.

1. Go to https://vercel.com and sign up with your GitHub account.
2. Click **Add New → Project**, select this repo, click **Deploy**.
3. In a couple of minutes you'll get a live URL like
   `https://sof-olympiad-practice.vercel.app`.

Every time you `git push` after this, Vercel automatically redeploys.

## 3. Get a real domain (recommended, ~$10-15/year)

A `.com` looks more trustworthy to both users and Google than a `.vercel.app`
subdomain, and is worth it once you're serious about traffic/ads.

1. Buy a domain from Namecheap, GoDaddy, or Google Domains — something
   short and on-topic, e.g. `olympiadprephub.com`.
2. In your Vercel project → **Settings → Domains**, add the domain.
3. Vercel will show you a DNS record to add at your domain registrar
   (usually an `A` record or `CNAME`). Add it there — it typically takes
   a few minutes to a few hours to activate.

## 4. Update the site config with your real URL

Once your domain is live, edit `config/site.ts`:

```ts
export const siteConfig = {
  ...
  url: "https://your-real-domain.com", // <-- update this
  ...
};
```

This matters a lot — the sitemap, canonical URLs, and Open Graph tags all
use this value. Commit and push the change so it redeploys.

## 5. Submit to Google Search Console (free)

This is how you tell Google your site exists and ask it to crawl it.

1. Go to https://search.google.com/search-console and sign in.
2. Add your domain as a property (the "Domain" property type, verified via
   a DNS TXT record your registrar lets you add — Search Console shows you
   exactly what to paste).
3. Once verified, go to **Sitemaps** in the left sidebar and submit:
   `https://your-domain.com/sitemap.xml`
4. Use **URL Inspection** on a few key pages (homepage, `/imo/class-1`) and
   click **Request Indexing** to speed up the first crawl.

## 6. Apply for Google AdSense (once you have some traffic/content)

1. Go to https://adsense.google.com and apply with your domain.
2. Google reviews the site for original content and policy compliance —
   this site already has a Privacy Policy page (`/privacy`) which AdSense
   requires. Approval can take days to a few weeks and often wants to see
   some real visitor traffic first, so it's worth doing steps 1-5 and
   waiting a couple of weeks before applying.
3. Once approved, add your AdSense script/ad units — ask me and I can wire
   them into the layout when you have your publisher ID.

## 7. Actually getting ranked (the slow, real part)

Technical SEO (done) gets you crawlable — it does not get you ranked.
Ranking is about relevance and authority, built over weeks/months:

- **Content depth**: this covers Classes 1-3. Expanding to Classes 4-12
  (especially since IMO/NSO/IEO/IGKO all go up to Class 12) massively
  increases the number of search queries you can rank for. Ask me to
  extend to more grades whenever you're ready — the architecture already
  supports it.
- **Backlinks**: ask school parent WhatsApp groups, education forums, or
  local school websites to link to specific class pages. Even a handful of
  relevant links helps meaningfully for a new site.
- **Fresh content**: adding new sample questions or a short blog post
  ("IMO Class 3 preparation tips") every so often signals an active site
  to Google.
- **Patience**: a brand-new domain typically takes 4-12 weeks before Google
  meaningfully ranks it for competitive terms, even with everything above
  done correctly. Traffic (and AdSense revenue) builds gradually, not
  overnight.

## Regenerating/expanding content

- `npm run generate:questions` — rebuilds `data/questions/*.ts` from the
  generator script. Edit `scripts/generate-questions.mjs` to add more
  questions/topics/grades, then re-run this.
- `npm run validate:content` — checks every question has valid
  exam/topic references and a correct answer before you ship a content
  change.
