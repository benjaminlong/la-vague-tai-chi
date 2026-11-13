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

	// --- Contact (rendered by components/contact.html) ---
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
};
