# Maya Foxten — Landing Page

**Stack:** Static HTML · Netlify hosting · Netlify Functions · Brevo CRM

---

## File structure

```
mayafoxten/
  index.html                  full landing page (7 sections)
  netlify.toml                Netlify config
  netlify/functions/
    subscribe.js              server-side Brevo API call
  README.md
```

---

## Deploy in 5 steps

### 1. Buy the domain
Purchase mayafoxten.com from your registrar.

### 2. Push to GitHub
```bash
git init
git add .
git commit -m "Maya Foxten landing page"
git remote add origin https://github.com/YOUR_USERNAME/mayafoxten-site.git
git push -u origin main
```

### 3. Deploy on Netlify
- netlify.com > Add new site > Import from GitHub
- Select the repo, build settings auto-detected
- Click Deploy — live on .netlify.app in ~60s
- Site settings > Domain management > Add mayafoxten.com
- Follow Netlify DNS instructions

### 4. Set up Brevo
- Sign up at brevo.com (free tier: 300 emails/day, unlimited contacts)
- Contacts > Lists > Create list: "Maya Foxten - Lead Magnet"
- Note the List ID from the URL (/contacts/lists/3 = ID 3)
- Settings > API Keys > Generate and copy key

### 5. Add env vars to Netlify
Site settings > Environment variables:

  BREVO_API_KEY   your Brevo API key
  BREVO_LIST_ID   your list ID number (e.g. 3)

Trigger a redeploy after adding.

---

## Brevo welcome automation

1. Brevo > Automations > Create workflow
2. Trigger: Contact added to list (your lead magnet list)
3. Email 1 (immediate): PDF guide attached — "Your 3 Dog Truths are here"
4. Wait 2 days
5. Email 2: Maya's story, what drives the work
6. Wait 3 days
7. Email 3: soft pitch for The Loyal Heart eBook

---

## When the eBook is ready

Find the "Join the waitlist" button in index.html and replace:
  onclick="scrollToForm()"
with:
  href="YOUR_WHOP_LINK" target="_blank"

Change class btn-moss to btn-moss and remove the onclick.

---

## Local dev with form testing

```bash
npm install -g netlify-cli
netlify dev
```
Visit http://localhost:8888 — Function runs locally against env vars.
