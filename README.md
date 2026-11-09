# Resplandor

A travel blog built from the Figma "Journal Page" designs. Stories are Markdown files in `src/putopis/`, photos live in `src/images/`, and everything is edited from the browser with [Pages CMS](https://app.pagescms.org). No coding needed.

## Writing a new story (no code)

1. Open https://app.pagescms.org and sign in with GitHub.
2. Open the **resplandor** repository, then go to **Priče (Putopis)** and click **Add an entry**.
3. Fill in the title, place, **country** (used by the "Sve Zemlje" filter), date and cover photo. Write the text (you can add photos inside it too) and optionally add photos at the end.
4. Click **Save**. The site rebuilds itself and the story is live in about 1–2 minutes.

To keep a story hidden while you're still working on it, tick **Skica (ne objavljuj još)**.

The quickest way to put a photo inside text you've already written:

1. Add the photo to **Fotografije u tekstu**. The first photo there is number 1, the second number 2, and so on.
2. In the text, click where the photo should go, press Enter, and type `[foto 1]` on its own line.

This works in **Tekst priče** and in every **Tekst** part. `[foto 2 3]` puts photos 2 and 3 in one row, which is useful for two **Pola** photos side by side. Each photo has the same layout, crop and zoom choices as the others.

Every story starts with a small map showing the country, its region filled in gold, and a pin on the place. Paste the place's coordinates into **Koordinate mesta za mapu**. In Google Maps, right-click the place and click the numbers at the top of the menu to copy them. The region is found automatically. Without coordinates, the map shows just the country. A country is mapped once it's listed in `lib/minimap.js`; the 9 filter countries and most of the Americas already are.

Stories are listed oldest first, so readers follow the journey from the beginning. **Sledeća priča** at the end of each story leads to the next one in time.

To put photos in the middle (or at the start) of a story, you can also use **Delovi priče**. Click **Add**, choose **Tekst** or **Fotografije**, and stack the parts in any order, e.g. text → photos → text → photos. They appear after **Tekst priče**, so to start a story with a photo, leave **Tekst priče** empty and make the first part **Fotografije**. Drag the parts to reorder them.

Every photo (in **Delovi priče** and at the end of a story) has a **Raspored** (layout) choice:

| Option | What it does |
| --- | --- |
| Širina teksta | As wide as the text (the default) |
| Široka | Wider than the text, for big landscapes |
| Pola | Half width. Put two in a row and they sit side by side |
| Cela širina ekrana | Edge to edge across the whole screen |
| Mala, u sredini | Smaller and centred, for detail shots |

To centre part of the text, put it in its own **Tekst** part under **Delovi priče** and set **Poravnanje** to **Na sredini**, or to **Na sredini, kurziv** for a quote-like look.

Photo parts that follow each other join into one row, so two **Pola** photos always sit side by side (on phones too), whether they're in one part or two.

Cropping is done with three choices on each photo (the original file is never changed):

- **Oblik (isecanje):** the shape to cut the photo to. The options are original, 3:2, 16:9, panorama 21:9, square or 4:5. **Pola** photos without a shape are cut to 4:5 so the pair lines up.
- **Koji deo fotografije ostaje:** which part is kept when it's cut: middle, top, bottom, left, right or a corner.
- **Uvećanje:** zoom in (125%, 150%, 200%) towards that same part for a tighter crop, or zoom out (75%, 50%) to show more of the photo. When zoomed out, the empty space around the photo is filled with a soft, blurred copy of it.

The cover photo has its own **Koji deo naslovne fotografije se vidi** choice for the story card.

The slideshow at the top of the home page is under **Početna strana → Velike fotografije na vrhu**. Add, remove or reorder photos there. Every slideshow photo fills the whole strip, so they all look uniform. Use **landscape** photos at least 1600px wide. Tall phone photos get cropped heavily and enlarged, so they look soft. The "focus" number picks which band of the photo stays visible: 0 = top, 50 = middle, 100 = bottom. The slideshow changes photo every 5 seconds and makes one dot per photo automatically. The intro text, the quote and the filter wording are on the same page. The site name, description and Instagram link are under **Podešavanja sajta**.

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
| `lib/minimap.js` | Draws the story mini maps; country names → map codes |
| `geo/americas.json` | Country and region outlines (Natural Earth, public domain) |
| `.pages.yml` | Pages CMS editor setup |
| `.github/workflows/deploy.yml` | Publishes to GitHub Pages on every change |

## Running it on your computer (optional)

Requires Node.js 20 or newer.

```
npm install
npm start
```

Then open http://localhost:8080.
