//import { IdAttributePlugin, InputPathToUrlTransformPlugin, HtmlBasePlugin } from "@11ty/eleventy";
//import { feedPlugin } from "@11ty/eleventy-plugin-rss";
//import pluginSyntaxHighlight from "@11ty/eleventy-plugin-syntaxhighlight";
//import pluginNavigation from "@11ty/eleventy-navigation";
//import { eleventyImageTransformPlugin } from "@11ty/eleventy-img";
import fontAwesomePlugin from "@11ty/font-awesome";
import eleventyNavigation from "@11ty/eleventy-navigation";
// Needed to load inline js.
import { minify } from "terser";

/** @param {import("@11ty/eleventy").UserConfig} eleventyConfig */
export default async function(eleventyConfig) {
    // Add plugins FontAwesome
	eleventyConfig.addPlugin(fontAwesomePlugin);

	// Add plugins Navigation
	eleventyConfig.addPlugin(eleventyNavigation);

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
