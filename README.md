# The Belize Project — Hope Gala Website

Source for **[hopegala.bz](https://hopegala.bz)**, the website for The Belize Project and its annual Hope Gala fundraiser.

It's a static site (plain HTML, CSS and JavaScript — no build step, no framework) hosted on GitHub Pages. Day-to-day text, photo and document updates are made through a browser-based Content Manager (CMS) at **[hopegala.bz/admin](https://hopegala.bz/admin/#/collections/home)**, so most edits never require touching code.

---

## How it fits together

| Piece | What it does | Where it lives |
|---|---|---|
| **Website pages** | Five HTML pages that read their editable content from JSON files at load time | Repo root (`*.html`) |
| **Content files** | All editable text, image paths, sponsorship tiers, gallery albums, etc. | `assets/content/*.json` |
| **Content Manager (CMS)** | [Decap CMS](https://decapcms.org) — a form-based editor that commits changes straight to this repo | `admin/` → [hopegala.bz/admin](https://hopegala.bz/admin/#/collections/home) |
| **CMS login proxy** | A Cloudflare Worker that completes GitHub OAuth for the Content Manager | `hopegala-decap-proxy.hopegala.workers.dev` (Cloudflare account, not in this repo) |
| **Hosting** | GitHub Pages, deployed automatically on every push to `main` | `.github/workflows/static.yml` |
| **Domain** | `hopegala.bz` points at GitHub Pages | `CNAME` file + DNS at the domain registrar |
| **Contact form** | Sends "Contact Us" messages via [EmailJS](https://www.emailjs.com) | IDs at the top of `assets/js/main.js` |
| **Story video** | Embedded from YouTube (video ID is editable in the CMS) | YouTube |

---

## Editing the website with the CMS (no coding needed)

**CMS address: [https://hopegala.bz/admin/#/collections/home](https://hopegala.bz/admin/#/collections/home)**

1. Open the link above and click **Login with GitHub**. Use a GitHub account that has write access to this repository.
2. Pick a section from the left-hand menu (direct links below).
3. Click the page entry, make your changes, and watch the preview on the right — it looks like the real site. Every field has a hint underneath explaining exactly what it controls and what size photos should be.
4. Click **Publish** (top of the editor) → **Publish now**. The live site updates in about 1–2 minutes.

### CMS sections

| Section | Direct link | What you can change |
|---|---|---|
| **Homepage** | [/admin/#/collections/home](https://hopegala.bz/admin/#/collections/home) | Banner slideshow photos, big title and motto, YouTube story video (ID, heading, show/hide), "Why Belize?" paragraphs |
| **Ministries** | [/admin/#/collections/ministries](https://hopegala.bz/admin/#/collections/ministries) | Page headings; add/remove/reorder ministries (name, short name, subtitle, logo, write-up); add/remove programs |
| **Resources & Documents** | [/admin/#/collections/resources](https://hopegala.bz/admin/#/collections/resources) | Download categories (tiles) and the PDFs/images inside each one |
| **Gala Photo Galleries** | [/admin/#/collections/gallery](https://hopegala.bz/admin/#/collections/gallery) | Photo albums: name, type (Gala Night / Ministry), cover photo, photos |
| **Gala Event Page** | [/admin/#/collections/gala](https://hopegala.bz/admin/#/collections/gala) | Title, date/location line, pledge button text, countdown (on/off + date/time), sponsorship tiers/prices/perks (on/off), "Purpose & Praise" and "Faithful Stewardship" text, and the **Make a Pledge** pop-up (verse, thank-you text, bank details, contact people, email) |

The ministry logos on the Gala page come automatically from the **Ministries** section — change them there.

### Common tasks

- **Add/remove/reorder items** (photos, paragraphs, ministries, tiers): use the **Add …** button at the bottom of a list, the **X** to delete, and the drag handle/arrows to reorder.
- **New paragraph inside a description:** press Enter twice to leave a blank line.
- **Hide a section without deleting it:** use the **Show …?** switches (story video, countdown, sponsorship). Turn them back on any time.
- **Change the YouTube video:** paste only the code after `v=` in the link (e.g. `youtube.com/watch?v=trWomaffddI` → `trWomaffddI`).
- **Bank account number** in the pledge pop-up: double-check it — donors send money to it.

### Yearly gala checklist

**Before the gala**
- Gala Event Page → update title, date/location line, countdown date, and sponsorship prices/perks; turn the countdown and sponsorship sections **on**
- Resources & Documents → upload the new year's flyer, pledge form, sponsorship sheet, etc.
- Homepage → swap in new banner images if desired

**After the gala**
- Gala Event Page → turn the countdown (and sponsorship, if closed) **off**
- Gala Photo Galleries → **Add Albums**, name it (e.g. *Hope Gala 2027*), set Album Type to *Gala Night*, enter a new folder name like `gala-night-2027` (lowercase, dashes, no spaces — never change this on existing albums), choose a cover, then add the photos

### Photo sizes

Photos are automatically shrunk in the browser before upload (longest side 1600px), and a GitHub Action compresses any images pushed to the repo as a second safety net. Still, following the size hints keeps the site fast and stops photos getting cropped:

| Use | Recommended size |
|---|---|
| Homepage banner | ~2000 × 650 px, wide strip, JPG under 500 KB |
| Ministry logo | Square, ~500 × 500 px, under 300 KB, white or transparent background |
| Album cover | Landscape, ~1200 × 900 px, JPG under 500 KB |
| Gallery photo | 1200–1600 px longest side, JPG under 1 MB |

Tip: when sending photos from a phone, choose *Medium* or *Large* rather than *Actual Size*. [Canva](https://www.canva.com) can resize banners to 2000 × 650.

---

## Project structure

```
hopegalabz/
├── index.html            Homepage                  ← home.json
├── gala.html             Gala event page           ← gala.json + ministries.json
├── ministries.html       Ministries & programs     ← ministries.json
├── gallery.html          Photo albums              ← gallery.json
├── resources.html        Downloadable documents    ← resources.json
├── CNAME                 Custom domain (hopegala.bz)
├── .nojekyll             Tells GitHub Pages not to run Jekyll
│
├── admin/                Content Manager (Decap CMS)
│   ├── index.html          Loads Decap + the scripts below
│   ├── config.yml          Defines every editable field, label and hint
│   ├── image-compress.js   Resizes photos in the browser before upload
│   └── preview-templates.js  Makes the editor preview look like the real site
│
├── assets/
│   ├── content/          JSON content files (edited via the CMS)
│   ├── css/main.css      All site styles
│   ├── js/main.js        Shared header, footer, contact & donation modals, EmailJS
│   └── images/
│       ├── logos/          Site, ministry and social logos
│       ├── slideshow/      Homepage banner images
│       ├── ministries/     Per-ministry photos (jacobsfarm, bit, Dorcas, restore)
│       ├── gala-night-20xx/, hope-gala-2022/   Gallery albums
│       ├── uploads/        New CMS uploads land here (created on first upload)
│       └── (loose files)   Page graphics: bubbles, map, chart, dove, sponsor
│
├── docs/                 PDFs linked from the Resources page (flyer, pledge form, sponsorship sheets)
│
└── .github/workflows/
    ├── static.yml          Deploys the site to GitHub Pages on push to main
    └── compress-images.yml Compresses any new/changed .jpg/.png on push
```

### How pages load content

Each page ships with default HTML content, then fetches its JSON file from `assets/content/` and fills in the editable parts. If a JSON file fails to load, the page still renders with its built-in defaults rather than breaking.

The shared header, footer, Contact Us modal and Make a Donation modal are injected by `assets/js/main.js` into placeholder `<div>`s (`#site-header`, `#site-footer`, `#site-modal`) on every page. Change navigation or footer content there, once, rather than in each HTML file.

### Adding a new editable field

1. Add the field to the relevant collection in `admin/config.yml` (keep the `hint` text plain-English — it's what editors see).
2. Add the matching key to the JSON file in `assets/content/`.
3. Read and render it in the page's fetch script (and in `admin/preview-templates.js` if you want it to show in the editor preview).

---

## Local development

No build tools are needed — just serve the folder over HTTP (opening the files directly with `file://` will block the JSON fetches):

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

The CMS at `/admin` is wired to the live site and repo (it uses absolute `https://hopegala.bz/` URLs and commits to `main`), so anything published there goes live.

---

## Deployment

Pushing to `main` (including every CMS **Publish**) deploys automatically via **Actions → Deploy static content to Pages**. A deploy can also be started manually from the Actions tab (*Run workflow*).

When images change, **Compress Images** runs and may commit compressed versions back to `main` (tagged `[skip-compress]` so it doesn't loop), which triggers one more deploy.

---

## Accounts & access

Whoever maintains the site will need access to:

| Service | Used for |
|---|---|
| **GitHub** — `hopegalabz-jpg/hopegalabz` | Code, hosting, CMS login (editors need write access: *Settings → Collaborators*) |
| **Cloudflare** — `hopegala-decap-proxy` Worker | GitHub OAuth for the CMS login (holds the OAuth client ID/secret) |
| **GitHub OAuth App** | The app the Worker authenticates against; its callback URL points to the Worker |
| **EmailJS** | Delivers Contact Us form submissions |
| **Domain registrar** for `hopegala.bz` | DNS records pointing to GitHub Pages |
| **YouTube** | Hosts the story video |

> The EmailJS public key and IDs in `main.js` are designed to be public; restrict allowed origins to `hopegala.bz` in the EmailJS dashboard. Never commit private keys or the OAuth client secret to this repo.

---

## Troubleshooting

| Problem | Check |
|---|---|
| Can't log in to the CMS | GitHub account has write access to the repo; Cloudflare Worker is running; OAuth App callback URL is correct |
| Published but the site didn't change | Actions tab — wait for the deploy to finish (green check), then hard-refresh (Ctrl/Cmd + Shift + R) |
| Section is blank or showing old text | Browser console for a JSON load error — usually a typo in a hand-edited JSON file |
| Photo looks cropped | Wrong shape for that slot — see the photo size table above |
| Contact form not sending | EmailJS dashboard (monthly quota, service/template still active, allowed origins) |

---

Built by **[Kismet Code Digital](https://kismetcodedigital.com)**.
