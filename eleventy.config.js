//import { IdAttributePlugin, InputPathToUrlTransformPlugin, HtmlBasePlugin } from "@11ty/eleventy";
//import { feedPlugin } from "@11ty/eleventy-plugin-rss";
//import pluginSyntaxHighlight from "@11ty/eleventy-plugin-syntaxhighlight";
//import pluginNavigation from "@11ty/eleventy-navigation";
//import { eleventyImageTransformPlugin } from "@11ty/eleventy-img";
import fontAwesomePlugin from "@11ty/font-awesome";
import eleventyNavigation from "@11ty/eleventy-navigation";
import Image from "@11ty/eleventy-img";
// Needed to load inline js.
import { minify } from "terser";

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
    // Add plugins FontAwesome
	eleventyConfig.addPlugin(fontAwesomePlugin);

	// Add plugins Navigation
	eleventyConfig.addPlugin(eleventyNavigation);

	// Cours triés par jour de la semaine (lundi -> dimanche)
	const DAY_ORDER = ["lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi", "dimanche"];
	eleventyConfig.addCollection("coursByDay", (collectionApi) =>
		collectionApi.getFilteredByTag("cours").sort(
			(a, b) => DAY_ORDER.indexOf(a.data.lesson.day) - DAY_ORDER.indexOf(b.data.lesson.day)
		)
	);

	// Gallery: generate lightweight thumbnails + a large image for the lightbox.
	// Emits a <button> holding an optimized <picture> thumbnail; the large
	// (1600px webp) URL is exposed via data-full for the JS lightbox to load.
	eleventyConfig.addAsyncShortcode("galleryItem", async function (src, alt, title, index) {
		const metadata = await Image(src, {
			widths: [400, 800, 1600],
			formats: ["webp", "jpeg"],
			outputDir: "_site/img/",
			urlPath: "/img/",
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
	// For example, `./public/css/` ends up in `_site/css/`
	eleventyConfig.addPassthroughCopy({"src/public/": "/public"});
    // eleventyConfig.addPassthroughCopy("./content/feed/pretty-atom-feed.xsl")
	// Run Eleventy when these files change:
	// https://www.11ty.dev/docs/watch-serve/#add-your-own-watch-targets

	// Watch CSS files
	eleventyConfig.addWatchTarget("css/**/*.css");
	// Watch images for the image pipeline.
	eleventyConfig.addWatchTarget("content/**/*.{svg,webp,png,jpg,jpeg,gif}");

	// Per-page bundles, see https://github.com/11ty/eleventy-plugin-bundle
	// Bundle <style> content and adds a {% css %} paired shortcode
	// eleventyConfig.addBundle("css", {
	// 	toFileDirectory: "dist",
	// 	// Add all <style> content to `css` bundle (use <style eleventy:ignore> to opt-out)
	// 	// Supported selectors: https://www.npmjs.com/package/posthtml-match-helper
	// 	bundleHtmlContentFromSelector: "style",
	// });

	// Bundle <script> content and adds a {% js %} paired shortcode
	// eleventyConfig.addBundle("js", {
	// 	toFileDirectory: "dist",
	// 	// Add all <script> content to the `js` bundle (use <script eleventy:ignore> to opt-out)
	// 	// Supported selectors: https://www.npmjs.com/package/posthtml-match-helper
	// 	bundleHtmlContentFromSelector: "script",
	// });

	eleventyConfig.addShortcode("currentBuildDate", () => {
		return (new Date()).toISOString();
	});

	// Features to make your build faster (when you need them)

	// If your passthrough copy gets heavy and cumbersome, add this line
	// to emulate the file copy on the dev server. Learn more:
	// https://www.11ty.dev/docs/copy/#emulate-passthrough-copy-during-serve
	// eleventyConfig.setServerPassthroughCopyBehavior("passthrough");
};

export const config = {
	// Control which files Eleventy will process
	// e.g.: *.md, *.njk, *.html, *.liquid
	templateFormats: [
		"md",
		"njk",
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
