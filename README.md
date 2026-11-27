# Move to Malaysia

A web app version of [MoveToMalaysia.com](https://movetomalaysia.com): every page, the blog, and the seven Master Guide tools (visa, schools, property, commuting, cost of living, private transport, JS-SEZ), in the site's own layout and theme.

## Run it

Open `index.html` in a browser. There is no build step and nothing to install.

## Files

- `index.html`: page shell, styles, header and footer
- `app.js`: router and the site pages (home, about, services, testimonials, blog, media, contact, summits)
- `guides.js`: Master Guide pages and calculators
- `data-guides.js`: guide data (visas, schools, areas, commute costs, prices, cars, JS-SEZ)
- `data-content.js`: blog articles and long-form guide content

## Differences from the website

- Traffic cameras link to LTA OneMotoring instead of embedding the live feed.
- The currency converter uses a rate you enter, not a live feed.
- The contact and summit forms prepare a WhatsApp or email message instead of posting to the CRM.
- Photos are replaced with placeholders.
