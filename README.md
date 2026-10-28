# Resplandor

A travel blog built from the Figma "Journal Page" designs. Stories are Markdown files in `src/putopis/`, photos live in `src/images/`, and everything is edited from the browser with [Pages CMS](https://app.pagescms.org). No coding needed.

## Writing a new story (no code)

1. Open https://app.pagescms.org and sign in with GitHub.
2. Open the **resplandor** repository, then go to **Priče (Putopis)** and click **Add an entry**.
3. Fill in the title, place, **country** (used by the "Sve Zemlje" filter), date and cover photo. Write the text (you can add photos inside it too) and optionally add photos at the end.
4. Click **Save**. The site rebuilds itself and the story is live in about 1–2 minutes.

To keep a story hidden while you're still working on it, tick **Skica (ne objavljuj još)**.

The big photo at the top, the intro text, the quote and the filter wording are under **Početna strana**. The site name, description and Instagram link are under **Podešavanja sajta**.

To add a new country to the filter, add it in two places: the `values` list under `country` in `.pages.yml`, and `src/_data/countries.json`.

Photos straight from your phone are fine. Every photo is resized and compressed automatically when the site is built.

## Project layout

| Path | What it is |
| --- | --- |
| `src/putopis/*.md` | Stories (one file each) |
| `src/_data/home.json` | Home page photo, heading, intro, quote, filter wording |
| `src/_data/countries.json` | Countries listed in the filter |
| `src/_data/site.json` | Site name, description, Instagram |
| `src/_includes/` | Page templates (header, story, card layout) |
| `src/assets/style.css` | All the styling |
| `.pages.yml` | Pages CMS editor setup |
| `.github/workflows/deploy.yml` | Publishes to GitHub Pages on every change |

## Running it on your computer (optional)

Requires Node.js 20 or newer.

```
npm install
npm start
```

Then open http://localhost:8080.
