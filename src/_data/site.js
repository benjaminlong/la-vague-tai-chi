// Site configuration — the single declared "customization surface" for this
// site, exposed to every template as the global `site.*`.
//
// This is the content/branding config. Visual theming (the brand color
// palette) lives in tailwind.config.js (`brand`), and the deploy domain is
// injected at build time via SITE_URL (see eleventy.config.js `baseUrl`).
export default {
	// --- Identity ---
	name: "La Vague Taï Chi Chuan",
	lang: "fr",             // <html lang> + used for og:locale defaults
	locale: "fr_FR",        // Open Graph locale
	description: "Enseignement du Taï Chi Chuan à Marseille — association La Vague.",

	// --- SEO / verification ---
	googleSiteVerification: "aYlNp24QflaYgCovml-MOUlBKFGMIT7-XR6vb2Gd9n4",

	// --- Branding (brand *colors* live in tailwind.config.js: `brand`) ---
	logo: {
		mark: "/public/logo.png",       // calligraphy mark (太極拳)
		wordmark: "/public/logolv.jpg",  // full wordmark + favicon
	},

	// --- Contact (rendered by partials/contact.html) ---
	contact: {
		name: "Pierre Navarino",
		phone: "+33676734581",           // tel: link
		phoneDisplay: "06 76 73 45 81",  // human-readable
		email: "lavague.taichichuan@free.fr",
	},

	// --- Social links ---
	socials: {
		facebook: "https://www.facebook.com/lavaguetaichichuan",
	},

	// --- Theme / appearance knobs ---
	// Brand *colors* live in tailwind.config.js (`brand`). Typography is here:
	// leave empty to use the theme's default (system) font stack.
	theme: {
		fonts: {
			googleFontsUrl: "", // e.g. "https://fonts.googleapis.com/css2?family=Playfair+Display&display=swap"
			heading: "",        // CSS font-family applied to h1–h6 when set
			base: "",           // CSS font-family applied to <body> when set
		},
	},

	// --- Footer ---
	footer: {
		note: "", // optional small line under the brand name; empty = hidden
	},
};

// NOTE — the following are intentionally NOT global config. They live in each
// page's front matter because they vary per page:
//   hero_enabled, hero_image, hero_title, hero_color   → hero banner
//   main_header: { title, subtitle, image_url }         → page header image
//   announcement_enabled, reprise_enabled               → schedule widgets
