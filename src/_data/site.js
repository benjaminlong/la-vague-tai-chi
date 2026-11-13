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

	// Fallback social-share image (og:image / twitter:image) used when a page
	// doesn't set its own `seoImage` in front matter. Root-relative; made
	// absolute at build time via baseUrl. Empty = no image on shares.
	defaultSeoImage: "/public/banners/TaiChi-10-1280.jpg",

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
		// Dark/light feature switch. true = show the toggle, follow the OS
		// preference, and remember the visitor's choice. false = always light:
		// the toggle is hidden and the OS dark-mode preference is ignored.
		darkModeEnabled: false,
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
