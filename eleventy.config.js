import { HtmlBasePlugin, RenderPlugin } from "@11ty/eleventy";
import { eleventyImageTransformPlugin } from "@11ty/eleventy-img";
import { feedPlugin } from "@11ty/eleventy-plugin-rss";
import site from "./src/_data/site.json" with { type: "json" };

const SITE_URL = process.env.SITE_URL || "http://localhost:8080";

export default function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("src/assets");
  // Originals stay available for link previews (og:image); pages use the resized copies.
  eleventyConfig.addPassthroughCopy("src/images");
  eleventyConfig.addPassthroughCopy({ "src/assets/favicon.svg": "favicon.svg" });

  // Stories with "draft: true" show up while previewing locally but are never published.
  eleventyConfig.addPreprocessor("drafts", "*", (data) => {
    if (data.draft && process.env.ELEVENTY_RUN_MODE === "build") return false;
  });

  // Newest story first.
  eleventyConfig.addCollection("stories", (api) =>
    api.getFilteredByGlob("src/putopis/*.md").sort((a, b) => b.date - a.date)
  );

  // 01/07/2026
  eleventyConfig.addFilter("srDate", (value) => {
    const d = new Date(value);
    const pad = (n) => String(n).padStart(2, "0");
    return `${pad(d.getUTCDate())}/${pad(d.getUTCMonth() + 1)}/${d.getUTCFullYear()}`;
  });
  eleventyConfig.addFilter("isoDate", (value) => new Date(value).toISOString().slice(0, 10));

  // Plain-text preview of a story, cut at a word boundary.
  eleventyConfig.addFilter("excerpt", (html = "", length = 260) => {
    const text = String(html).replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
    if (text.length <= length) return text;
    return text.slice(0, text.lastIndexOf(" ", length)).replace(/[,.;:!?\s]+$/, "") + "…";
  });

  // Splits a multi-line text field into paragraphs on blank lines.
  eleventyConfig.addFilter("paragraphs", (text = "") =>
    String(text).split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean)
  );

  // Photo parts that follow each other are joined into one row, so two "Pola" photos sit side by side
  // even when they were added as separate parts in the editor.
  eleventyConfig.addFilter("groupSections", (sections) => {
    const out = [];
    for (const s of sections || []) {
      if (!s) continue;
      const prev = out[out.length - 1];
      if (s.type === "photos" && prev?.type === "photos") prev.items.push(...(s.items || []));
      else out.push(s.type === "photos" ? { ...s, items: [...(s.items || [])] } : s);
    }
    return out;
  });

  // "Fokus" choice from the editor → which part of a cropped photo stays visible.
  const FOCUS = {
    center: "50% 50%", top: "50% 0%", bottom: "50% 100%", left: "0% 50%", right: "100% 50%",
    "top-left": "0% 0%", "top-right": "100% 0%", "bottom-left": "0% 100%", "bottom-right": "100% 100%",
  };
  eleventyConfig.addFilter("focusPos", (focus) => FOCUS[focus] || FOCUS.center);

  // The story that follows this one in the list (wraps around to the newest).
  eleventyConfig.addFilter("nextStory", (stories, url) => {
    if (!stories || stories.length < 2) return null;
    const i = stories.findIndex((s) => s.url === url);
    return stories[(i + 1) % stories.length];
  });

  eleventyConfig.addPlugin(HtmlBasePlugin);
  // Lets the text parts of a story (written in Pages CMS) be turned into HTML: {{ text | renderContent("md") }}
  eleventyConfig.addPlugin(RenderPlugin);

  // Every <img> is resized and converted automatically, so full-size phone photos are fine to upload.
  eleventyConfig.addPlugin(eleventyImageTransformPlugin, {
    formats: ["webp", "jpeg"],
    widths: [480, 960, 1600],
    htmlOptions: {
      imgAttributes: {
        loading: "lazy",
        decoding: "async",
        sizes: "(min-width: 960px) 890px, 100vw",
      },
    },
  });

  eleventyConfig.addPlugin(feedPlugin, {
    type: "atom",
    outputPath: "/feed.xml",
    collection: { name: "stories", limit: 20 },
    metadata: {
      language: site.language,
      title: site.title,
      subtitle: site.description,
      base: SITE_URL + "/",
      author: { name: site.author },
    },
  });

  eleventyConfig.addGlobalData("siteUrl", SITE_URL);
  eleventyConfig.addGlobalData("year", new Date().getFullYear());
  // Added to the stylesheet link so browsers fetch the new styles after every publish
  // instead of reusing an old saved copy.
  eleventyConfig.addGlobalData("buildId", Date.now().toString(36));

  return {
    dir: { input: "src", output: "_site", includes: "_includes", data: "_data" },
    markdownTemplateEngine: false,
    htmlTemplateEngine: "njk",
  };
}
