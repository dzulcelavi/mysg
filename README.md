# MYSG

A web app version of [MoveToMalaysia.com](https://movetomalaysia.com): every page, the blog, and the seven Master Guide tools (visa, schools, property, commuting, cost of living, private transport, JS-SEZ), in the site's own layout and theme.

## Use it

Live at https://dzulcelavi.github.io/move-to-malaysia/

On a phone, open that link and install it: on Android tap **Install** (or the browser menu, then *Add to Home screen*); on iPhone tap **Share**, then *Add to Home Screen*. It then opens full screen from its own icon and works offline.

## Files

- `index.html`: page shell, styles, header and footer
- `app.js`: router and the site pages (home, about, services, testimonials, blog, media, contact, summits)
- `guides.js`: Master Guide pages and calculators
- `data-guides.js`: guide data (visas, schools, areas, commute costs, prices, cars, JS-SEZ)
- `data-content.js`: blog articles and long-form guide content
- `manifest.webmanifest`, `sw.js`, `icons/`: app install, offline support and icons

## Differences from the website

- Traffic cameras link to LTA OneMotoring instead of embedding the live feed.
- The currency converter uses a rate you enter, not a live feed.
- The contact and summit forms prepare a WhatsApp or email message instead of posting to the CRM.
- Photos are replaced with placeholders.
