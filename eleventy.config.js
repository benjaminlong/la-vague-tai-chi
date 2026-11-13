import fontAwesomePlugin from "@11ty/font-awesome";
import eleventyNavigation from "@11ty/eleventy-navigation";
import Image from "@11ty/eleventy-img";
// Needed to load inline js.
import { minify } from "terser";
import { existsSync } from "node:fs";

// Escape a string for safe use inside an HTML attribute value.
function escapeAttr(value) {
	return String(value || "")
		.replace(/&/g, "&amp;")
		.replace(/"/g, "&quot;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;");
}

/** @param {import("@11ty/eleventy").UserConfig} eleventyConfig */
export default async function(eleventyConfig) {
	// Base URL for absolute links in SEO/social meta (canonical, og:url,
	// og:image). Injected at build time via the SITE_URL env var (the GitHub
	// Pages workflow derives it from the CNAME file — see buildcd.yaml).
	// Unset locally → "" → root-relative URLs that resolve against localhost.
	eleventyConfig.addGlobalData("baseUrl", () =>
		(process.env.SITE_URL || "").replace(/\/+$/, "")
	);

    // Add plugins FontAwesome
	eleventyConfig.addPlugin(fontAwesomePlugin);

	// Add plugins Navigation
	eleventyConfig.addPlugin(eleventyNavigation);

	// --- Active theme ---
	// Content references abstract layout names (`single`, `list`, `cours`);
	// these aliases map them to the active theme's files, with a Hugo-style
	// fallback: use a content-type layout if it exists, else `_default`.
	// Swap the whole look by changing THEME (and adding themes/<name>/).
	const THEME = process.env.THEME || "lavague";
	const layout = (type, kind) => {
		const specific = `themes/${THEME}/layouts/${type}/${kind}.html`;
		const fallback = `themes/${THEME}/layouts/_default/${kind}.html`;
		return existsSync(`src/_includes/${specific}`) ? specific : fallback;
	};
	eleventyConfig.addLayoutAlias("single", layout("_default", "single"));
	eleventyConfig.addLayoutAlias("list",   layout("_default", "list"));
	eleventyConfig.addLayoutAlias("cours",  layout("cours", "single"));

	// Cours triés par jour de la semaine (lundi -> dimanche), avec un tri
	// secondaire alphabétique (inputPath) pour un ordre stable et déterministe.
	const DAY_ORDER = ["lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi", "dimanche"];
	eleventyConfig.addCollection("coursByDay", (collectionApi) =>
		collectionApi.getFilteredByTag("cours").sort(
			(a, b) =>
				DAY_ORDER.indexOf(a.data.lesson.day) - DAY_ORDER.indexOf(b.data.lesson.day)
				|| a.inputPath.localeCompare(b.inputPath)
		)
	);

	// Gallery: generate lightweight thumbnails + a large image for the lightbox.
	// Emits a <button> holding an optimized <picture> thumbnail; the large
	// (1600px webp) URL is exposed via data-full for the JS lightbox to load.
	eleventyConfig.addAsyncShortcode("galleryItem", async function (src, alt, title, index) {
		const metadata = await Image(src, {
			widths: [400, 800, 1600],
			formats: ["webp", "jpeg"],
			outputDir: "_site/public/gallery/",
			urlPath: "/public/gallery/",
		});

		const altText = escapeAttr(alt || title || "");
		const titleText = escapeAttr(title || "");

		// Apply the pathPrefix-aware `url` filter so generated image URLs work
		// under a subpath (e.g. GitHub Pages project sites at /repo/).
		const url = eleventyConfig.getFilter("url");

		// Thumbnail: small widths only (grid displays ~200px, 400/800 cover retina).
		const thumbWebp = metadata.webp
			.filter((img) => img.width <= 800)
			.map((img) => `${url(img.url)} ${img.width}w`)
			.join(", ");
		const thumbFallback =
			metadata.jpeg.find((img) => img.width === 400) || metadata.jpeg[0];

		// Large image for the viewer: biggest webp we generated.
		const full = metadata.webp[metadata.webp.length - 1];

		return `<button type="button" class="gallery-item block cursor-pointer border-0 bg-transparent p-0 m-0" data-index="${index}" data-full="${url(full.url)}" data-alt="${altText}" data-title="${titleText}" aria-label="Agrandir l'image${titleText ? ` : ${titleText}` : ""}">
			<picture>
				<source type="image/webp" srcset="${thumbWebp}" sizes="(max-width: 640px) 45vw, 200px">
				<img src="${url(thumbFallback.url)}" width="${thumbFallback.width}" height="${thumbFallback.height}" alt="${altText}" loading="lazy" decoding="async" class="gallery-thumb h-40 w-48 max-w-full rounded object-cover shadow transition-transform duration-200 hover:scale-105">
			</picture>
		</button>`;
	});

	// Dark/Light Mode using jsmin and terser to minify the JavaScript code
	eleventyConfig.addFilter("jsmin", async function (code) {
		try {
			const minified = await minify(code);
			return minified.code;
		} catch (err) {
			console.error("Terser error: ", err);
			// Fail gracefully.
			return code;
		}
	});

	// Copy the contents of the `public` folder to the output folder
	// (e.g. `src/public/tailwind.css` -> `_site/public/tailwind.css`).
	eleventyConfig.addPassthroughCopy({"src/public/": "/public"});

	// Run Eleventy when these files change (dev server):
	// https://www.11ty.dev/docs/watch-serve/#add-your-own-watch-targets
	// CSS: main.css + the Tailwind output both live under src/public; the
	// Tailwind source is src/_assets/tailwind.css (compiled by `tailwind:watch`).
	eleventyConfig.addWatchTarget("src/**/*.css");
	// Images consumed by the eleventy-img pipeline (gallery sources, banners).
	eleventyConfig.addWatchTarget("src/_assets/**/*.{svg,webp,png,jpg,jpeg,gif}");

	eleventyConfig.addShortcode("currentBuildDate", () => {
		return (new Date()).toISOString();
	});
};

export const config = {
	// Control which files Eleventy will process.
	// `.html` = templates/pages, `.md` = prose content. Both are rendered
	// through Nunjucks (see *TemplateEngine below); there are no `.njk` files.
	templateFormats: [
		"md",
		"html",
	],

	// Pre-process *.md files with: (default: `liquid`)
	markdownTemplateEngine: "njk",

	// Pre-process *.html files with: (default: `liquid`)
	htmlTemplateEngine: "njk",

	// These are all optional:
	dir: {
		input: "src",          // default: "."
		includes: "_includes",  // default: "_includes" (`input` relative)
		data: "_data",          // default: "_data" (`input` relative)
		output: "_site"
	},

	// -----------------------------------------------------------------
	// Optional items:
	// -----------------------------------------------------------------

	// If your site deploys to a subdirectory, change `pathPrefix`.
	// Read more: https://www.11ty.dev/docs/config/#deploy-to-a-subdirectory-with-a-path-prefix

	// When paired with the HTML <base> plugin https://www.11ty.dev/docs/plugins/html-base/
	// it will transform any absolute URLs in your HTML to include this
	// folder name and does **not** affect where things go in the output folder.
	// pathPrefix: "/",
};
