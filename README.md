# La Vague Taï Chi Chuan 

La Vague Taï Chi Chuan website source code.

Build with 11ty. https://www.11ty.dev/

## Theme

The look lives in `src/_includes/themes/<name>/` (Hugo-style, Nunjucks). The
active theme is picked by the `THEME` env var (default `lavague`), so content
and config never hard-code a theme:

```
themes/lavague/
  layouts/_default/  baseof · single · list · summary   # generic layouts
  layouts/cours/     single · summary                    # content-type layouts
  partials/          header, footer, hero, contact, …    # includes
  assets/            theme.js, gallery-lightbox.js         # theme's own JS
```

A theme honors three contracts:

1. **Layouts** — content sets an abstract `layout:` (`single`, `list`, `cours`).
   `eleventy.config.js` maps it to the theme file, with a fallback: a
   content-type layout (`cours/single`) is used if it exists, else `_default`.
2. **Data** — everything configurable is in `src/_data/site.js` (`site.*`:
   identity, logo, contact, socials, SEO, fonts). Brand **colors** are the
   `brand` palette in `tailwind.config.js`. Deploy domain comes from `SITE_URL`.
3. **Assets** — each theme owns its JS; Tailwind CSS is built to `src/public/`.

**Add a content type:** create `layouts/<type>/single.html` (+ optional
`summary.html`), tag the content, point its `layout:` at `<type>`.

**Add / switch theme:** add `themes/<name>/` honoring the contracts, then build
with `THEME=<name> npx @11ty/eleventy`.

## A propos

Toutes les dernières modifications sont rensaigné dans le fichier [CHANGELOG](CHANGELOG.md). 
