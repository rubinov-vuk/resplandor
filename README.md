# Resplandor

A travel blog built from the Figma "Journal Page" designs. Stories are Markdown files in `src/putopis/`, photos live in `src/images/`, and everything is edited from the browser with [Pages CMS](https://app.pagescms.org). No coding needed.

## Writing a new story (no code)

1. Open https://app.pagescms.org and sign in with GitHub.
2. Open the **resplandor** repository, then go to **Priče (Putopis)** and click **Add an entry**.
3. Fill in the title, place, **country** (used by the "Sve Zemlje" filter), date and cover photo. Write the text (you can add photos inside it too) and optionally add photos at the end.
4. Click **Save**. The site rebuilds itself and the story is live in about 1–2 minutes.

To keep a story hidden while you're still working on it, tick **Skica (ne objavljuj još)**.

To put photos in the middle (or at the start) of a story, use **Delovi priče**. Click **Add**, choose **Tekst** or **Fotografije**, and stack the parts in any order, e.g. text → photos → text → photos. They appear after **Tekst priče**, so to start a story with a photo, leave **Tekst priče** empty and make the first part **Fotografije**. Drag the parts to reorder them.

Every photo (in **Delovi priče** and at the end of a story) has a **Raspored** (layout) choice:

| Option | What it does |
| --- | --- |
| Širina teksta | As wide as the text (the default) |
| Široka | Wider than the text, for big landscapes |
| Pola | Half width. Put two in a row and they sit side by side |
| Cela širina ekrana | Edge to edge across the whole screen |
| Mala, u sredini | Smaller and centred, for detail shots |

Photo parts that follow each other join into one row, so two **Pola** photos always sit side by side (on phones too), whether they're in one part or two.

Cropping is done with three choices on each photo (the original file is never changed):

- **Oblik (isecanje):** the shape to cut the photo to. The options are original, 3:2, 16:9, panorama 21:9, square or 4:5. **Pola** photos without a shape are cut to 4:5 so the pair lines up.
- **Koji deo fotografije ostaje:** which part is kept when it's cut: middle, top, bottom, left, right or a corner.
- **Uvećanje:** zoom in (125%, 150%, 200%) towards that same part, for a tighter crop.

The cover photo has its own **Koji deo naslovne fotografije se vidi** choice for the story card.

The slideshow at the top of the home page is under **Početna strana → Velike fotografije na vrhu**. Add, remove or reorder photos there. Each photo has a caption (shown top right) and a "focus" number that picks which part of the photo is visible. The slideshow changes photo every 5 seconds and makes one dot per photo automatically. The intro text, the quote and the filter wording are on the same page. The site name, description and Instagram link are under **Podešavanja sajta**.

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
