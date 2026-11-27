# MYSG

An installable web app with free guides and tools for moving from Singapore to Johor: the seven Master Guide tools (visa, schools, property, commuting, cost of living, private transport, JS-SEZ) and the articles. For relocation services (webinars, tours, concierge, summits), the app links to [movetomalaysia.com](https://movetomalaysia.com/).

## Use it

Live at https://dzulcelavi.github.io/mysg/

On a phone, open that link and install it: on Android tap **Install** (or the browser menu, then *Add to Home screen*); on iPhone tap **Share**, then *Add to Home Screen*. It then opens full screen from its own icon and works offline.

## Files

- `index.html`: page shell, styles, header and footer
- `app.js`: router and the app pages (home, guides, blog, more)
- `guides.js`: Master Guide pages and calculators
- `data-guides.js`: guide data (visas, schools, areas, commute costs, prices, cars, JS-SEZ)
- `data-content.js`: blog articles and long-form guide content
- `manifest.webmanifest`, `sw.js`, `icons/`: app install, offline support and icons

## Differences from the website

- Traffic cameras link to LTA OneMotoring instead of embedding the live feed.
- The currency converter uses a rate you enter, not a live feed.
- Photos are replaced with placeholders.
