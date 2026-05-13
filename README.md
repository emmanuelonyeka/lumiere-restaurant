# Lumière — Fine Dining Restaurant Template

A premium HTML template for fine dining and luxury restaurants. Built with semantic HTML, modern CSS, and vanilla JavaScript — no build step, no dependencies to install. Drop the files on any web host and you're live.

Designed around a fictional two-Michelin-star restaurant in Paris, the template includes a complete reservation system powered by EmailJS, so bookings work out of the box without a backend.

---

## What's Included

- **Homepage** with hero video, story, menu (24 dishes across 8 categories), chef's special, trust signals, experiences, gallery, private events, and contact map
- **Multi-step reservation flow** (experience → date/time → details → confirmation)
- **Modify reservation** page for guests to update existing bookings
- **Cancel reservation** page with reason capture
- **Staff confirmation** page for handling large-group requests manually
- **Privacy & Terms** legal page
- **Custom 404** error page
- Fully responsive — works on phones, tablets, and desktops
- Lazy-loaded images, mobile-optimized hero video, accessible markup
- One config file controls all environment-specific values

---

## File Structure

​```
lumiere-restaurant/
├── index.html           Homepage
├── reservation.html     Multi-step booking
├── modify.html          Modify existing booking
├── cancel.html          Cancel booking
├── confirm.html         Staff confirmation
├── legal.html           Privacy & terms
├── 404.html             Error page
├── style.css            All styles
├── script.js            Homepage interactions
├── config.js            Your configuration (edit this!)
├── favicon.svg          Browser tab icon
├── images/              All images and hero videos
│   ├── hero-bg.jpg / .mp4         Desktop hero
│   ├── hero-bg-mobile.jpg / .mp4  Mobile hero (portrait)
│   ├── chef.jpg
│   ├── private-dining.jpg
│   ├── wine-cellar.jpg
│   └── (menu category folders)
└── audio/               Optional ambient soundtracks
​```

---

## Quick Start

1. **Sign up for EmailJS.** Reservation forms use [EmailJS](https://www.emailjs.com) to send guest and staff confirmation emails. Create a free account, add an email service (Gmail, Outlook, etc.), and create two templates — one for guest emails, one for staff. The free tier includes 200 emails/month, which is plenty for most small restaurants.

2. **Edit `config.js`.** Open the file in any text editor. Replace the placeholder values with your own:
   - `baseUrl` — your live website URL (e.g. `https://www.your-restaurant.com`)
   - `whatsappNumber` — international format, digits only (e.g. `33123456789` for +33 1 23 45 67 89)
   - `emailjs.publicKey` — from EmailJS dashboard → Account → API Keys
   - `emailjs.serviceId` — from EmailJS dashboard → Email Services
   - `emailjs.guestTemplate` — your guest email template ID
   - `emailjs.staffTemplate` — your staff email template ID

3. **Update contact details in HTML.** A few visible contact links live directly in HTML. Search and replace these across `index.html` and `legal.html`:
   - `+33123456789` → your phone number (in `tel:` links)
   - `reservations@lumiere.com` → your email (in `mailto:` links and visible text)
   - `0000000000` → your WhatsApp number, digits only (in `wa.me/` links)

4. **Update SEO and social-sharing URLs.** Search and replace `https://YOUR-DOMAIN-HERE.com` across `index.html`, `reservation.html`, and `legal.html` with your live website URL. This affects:
   - Canonical URL (`<link rel="canonical">`)
   - Open Graph and Twitter Card share metadata
   - Schema.org structured data (JSON-LD)
   - A few internal navigation links

   If you skip this step, social shares of your site will show the placeholder URL, and search engines may mis-index your pages.

5. **Replace images.** Drop your own photos into the `images/` folder using the same filenames, or update the paths in `index.html`. Recommended dimensions:
   - Hero desktop: 1920×1080 (.jpg + .mp4)
   - Hero mobile: 720×1280 portrait (.jpg + .mp4)
   - Menu items: 800×800 square
   - Chef portrait: 1200×1600 portrait
   - Gallery & private dining: 1600×1200 landscape

6. **Customize content.** Open `index.html` and edit the menu items, story, chef bio, address, opening hours, and so on. Everything is plain HTML — no special syntax. Look for the section comments (e.g. `<!-- ABOUT SECTION -->`) to navigate.

7. **Deploy.** Upload all files to any static host. Works on:
   - Netlify (drag-and-drop the folder)
   - Vercel (connect a GitHub repo)
   - GitHub Pages (push to a repo, enable Pages)
   - Any traditional web host (FTP/cPanel)

   No server-side code is required.

---

## Configuring EmailJS Templates

Your two EmailJS templates need specific merge fields to work with the booking forms. Each booking page sends these fields when a user submits.

**Guest template** (used for confirmation, modification, cancellation emails) needs:

`guest_name`, `guest_email`, `booking_id`, `experience_label`, `party_size`, `booking_date`, `booking_time`, `special_requests`, `subject_line`, `is_pending`, `is_confirmed`, `is_modified`, `is_cancelled`, `whatsapp_url`, `restaurant_email`, `restaurant_phone`, `modify_url`, `cancel_url`

**Staff template** (used for new bookings, modifications, cancellations) needs:

`guest_name`, `guest_email`, `guest_phone`, `booking_id`, `experience_label`, `party_size`, `booking_date`, `booking_time`, `special_requests`, `cancel_reason`, `subject_line`, `confirm_url`

In your EmailJS template editor, use these fields with double-curly-brace syntax: `{{guest_name}}`, `{{booking_date}}`, etc. For conditional content (e.g. "we'll confirm shortly" vs "your table is reserved"), use Mustache-style blocks: `{{#is_pending}}...{{/is_pending}}`.

If you'd like a starter template that uses all of these fields, contact support.

---

## Customizing the Look

Brand colors and fonts are controlled by CSS variables at the top of `style.css`. Search for `:root {` near the start of the file. The main tokens:

- `--color-gold: #C6A769` — primary accent (buttons, dividers, hover states)
- `--color-bg-primary: #0a0a0a` — page background
- `--font-serif: 'Cormorant Garamond'` — display font (titles, body)
- `--font-sans: 'Montserrat'` — UI font (buttons, labels)

Change those values once and the change cascades through every page.

To swap the fonts entirely, also update the Google Fonts `<link>` tag in the `<head>` of every HTML file.

There's also a small developer-facing console signature in `script.js` at the bottom (look for `CONSOLE WELCOME`). It prints a styled brand message when developers open the browser console. You can customize the text or delete the entire block — your choice.

---

## Browser Support

Tested in current versions of Chrome, Safari, Firefox, and Edge, on desktop and mobile. Older browsers (IE11, etc.) are not supported — modern CSS features like `clamp()` and `:has()` are used throughout.

---

## License

Single-site use only. You may use this template for one website (yours or your client's). For multiple sites, additional licenses are required.

You may not resell, redistribute, or sublicense the template files. See `LICENSE` for full terms.

---

## Image & Audio Credits

The demo photos and hero videos shipped with the template are licensed for **demo purposes only** and must be replaced with your own assets before going live.

The `audio/` folder contains three 1-second silent placeholder MP3s so the ambient sound feature loads cleanly. Replace them with your own royalty-free tracks to hear actual audio — see `audio/README.txt` for guidance.

---

## Support

Setup support is included for **30 days** from purchase, via email. Reach out at `emmanuel.onyekachi.dev@gmail.com` for:

- Setup questions (config, EmailJS, deployment)
- Bug reports
- Clarifications on documentation

Custom development and design changes are not included — those are offered separately. Contact for a quote.

---

## Changelog

**v1.0** — Initial release.