/* ============================================================
   BERM INC. — shared partials: head, header, footer, CTA, form
   ============================================================ */
export const SITE_URL = 'https://berm-inc-site.vercel.app';

export const COMPANY = {
  name: 'Berm Inc.',
  legalName: 'Berm Inc.',
  tagline: 'Custom Home Builder in Toronto, Vaughan & Greater Toronto Area',
  phone: '647-637-1499',
  phoneHref: 'tel:+16476371499',
  email: 'Bermgroups@gmail.com',
  address: 'Unit 355 - 7250 Keele Street, Vaughan, ON Canada L4K 1Z8',
  areas: ['Ontario', 'Ottawa', 'Toronto', 'Hamilton'],
};

export const NAV = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about/' },
  { label: 'Our Approach', href: '/approach/' },
  { label: 'Services', href: '/services/' },
  { label: 'Our Work', href: '/work/' },
  { label: 'Warranty & Protection', href: '/warranty/' },
  { label: 'Contact', href: '/contact/' },
];

const FONT_HREF =
  'https://fonts.googleapis.com/css2?family=Archivo:wght@500;600;700;750;800&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500;600;700&display=swap';

export function head({ title, description, path, image, jsonld, canonical }) {
  const url = SITE_URL + path;
  const img = image ? SITE_URL + image : SITE_URL + '/assets/img/hero-home.jpg';
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title}</title>
  <meta name="description" content="${description}">
  <link rel="canonical" href="${canonical || url}">
  <meta name="robots" content="index, follow">
  <meta name="theme-color" content="#0a1f44">
  <meta name="geo.region" content="CA-ON">
  <meta name="geo.placename" content="Vaughan">
  <meta name="ICBM" content="43.7989, -79.5136">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="Berm Inc.">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${description}">
  <meta property="og:url" content="${url}">
  <meta property="og:image" content="${img}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="800">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${title}">
  <meta name="twitter:description" content="${description}">
  <meta name="twitter:image" content="${img}">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="${FONT_HREF}" rel="stylesheet">
  <link rel="icon" href="/favicon.svg" type="image/svg+xml">
  <link rel="apple-touch-icon" href="/assets/img/logo-mark.png">
  <link rel="stylesheet" href="/assets/css/tokens.css">
  <link rel="stylesheet" href="/assets/css/site.css">
  ${jsonld || ''}
</head>
<body>`;
}

export function header(path) {
  const links = NAV.map((item) => {
    const current = path === item.href || (item.href !== '/' && path.startsWith(item.href));
    return `      <a href="${item.href}"${current ? ' aria-current="page"' : ''}>${item.label}</a>`;
  }).join('\n');
  return `<header class="site-header">
  <div class="wrap site-header__inner">
    <a class="logo" href="/" aria-label="Berm Inc. — Home">
      <span class="logo-mark">B</span>
      <span class="logo-text">BERM<small>INC. CONSTRUCTION</small></span>
    </a>
    <nav class="main-nav" aria-label="Main navigation">
${links}
      <a class="btn header-cta" href="/contact/">Get a Quote <span class="arr">→</span></a>
    </nav>
    <button class="nav-toggle" aria-label="Toggle menu" aria-expanded="false"><span></span><span></span><span></span></button>
  </div>
</header>`;
}

export function footer(path) {
  return `<footer class="site-footer grid-bg--dark">
  <div class="wrap">
    <div class="footer-grid">
      <div class="footer-brand">
        <a class="logo" href="/" aria-label="Berm Inc. — Home">
          <span class="logo-mark">B</span>
          <span class="logo-text">BERM<small>INC. CONSTRUCTION</small></span>
        </a>
        <p>${COMPANY.tagline}. Fully insured, HCRA-certified builder serving Ontario with custom homes, renovations, and building envelope systems.</p>
      </div>
      <div class="footer-col">
        <h4>Explore</h4>
        <ul>
${NAV.map((n) => `          <li><a href="${n.href}">${n.label}</a></li>`).join('\n')}
        </ul>
      </div>
      <div class="footer-col">
        <h4>Service Areas</h4>
        <ul>
${COMPANY.areas.map((a) => `          <li>${a}</li>`).join('\n')}
        </ul>
      </div>
      <div class="footer-col footer-contact">
        <h4>Contact</h4>
        <ul>
          <li><span class="ico">&#9660;</span>${COMPANY.address}</li>
          <li><span class="ico">&#9990;</span><a href="${COMPANY.phoneHref}">${COMPANY.phone}</a></li>
          <li><span class="ico">&#9993;</span><a href="mailto:${COMPANY.email}">${COMPANY.email}</a></li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <span>© 2026 by Berm Inc. All rights reserved.</span>
      <span>HCRA Licence No. B60719 · Vendor &amp; Builder</span>
      <span>Custom Homes · Renovations · Building Envelope · Exterior Systems</span>
    </div>
  </div>
</footer>`;
}

export function ctaBand() {
  return `<section class="cta-band" aria-label="Start a conversation">
  <div class="cta-band__bg"><img src="/assets/img/cta-bg.jpg" alt="" aria-hidden="true" loading="lazy"></div>
  <div class="cta-band__scrim grid-bg--dark"></div>
  <div class="wrap cta-band__inner">
    <div>
      <p class="eyebrow eyebrow--light">Ready to build better?</p>
      <h2>Let's Build Something That Performs as Beautifully as It Looks.</h2>
      <p class="lede">Whether you are planning a modern custom home, a high-performance residence, or a home incorporating Passive House principles, Berm can help turn the concept into a carefully built reality.</p>
      <div class="cta-band__actions">
        <a class="btn btn--lg" href="/contact/">Start a Conversation <span class="arr">→</span></a>
        <a class="btn btn--ghost-light btn--lg" href="/approach/">Explore Our Approach</a>
      </div>
    </div>
    <div class="cta-band__contact">
      <a href="${COMPANY.phoneHref}"><span class="ico">&#9990;</span>${COMPANY.phone}</a>
      <a href="mailto:${COMPANY.email}"><span class="ico">&#9993;</span>${COMPANY.email}</a>
      <a href="https://maps.google.com/?q=7250+Keele+Street+Vaughan+ON" rel="noopener" target="_blank"><span class="ico">&#9673;</span>${COMPANY.address}</a>
    </div>
  </div>
</section>`;
}

export function quoteForm({ compact = false } = {}) {
  return `<div class="form-wrap">
  <form class="form-grid" data-berm-form novalidate>
    <div class="form-field">
      <label for="f-name">Name *</label>
      <input id="f-name" name="Name" type="text" required autocomplete="name">
    </div>
    <div class="form-field">
      <label for="f-email">Email *</label>
      <input id="f-email" name="Email" type="email" required autocomplete="email">
    </div>
    <div class="form-field">
      <label for="f-phone">Phone</label>
      <input id="f-phone" name="Phone" type="tel" autocomplete="tel">
    </div>
    <div class="form-field">
      <label for="f-type">Project type</label>
      <select id="f-type" name="Project type">
        <option value="">— Select —</option>
        <option>Custom Home Construction</option>
        <option>Construction Project Management</option>
        <option>Interior Finishes &amp; Architectural Details</option>
        <option>Renovation or Addition</option>
        <option>Other</option>
      </select>
    </div>
    <div class="form-field form-field--full">
      <label for="f-msg">Tell us about your project *</label>
      <textarea id="f-msg" name="Project details" required placeholder="Location, scope, timeline — whatever you know so far."></textarea>
    </div>
    <div class="form-field--full">
      <button class="btn" type="submit">Submit <span class="arr">→</span></button>
      <p class="form-note">Submitting opens your email app — your message goes straight to our team.</p>
    </div>
  </form>
  <div class="form-success" data-form-success hidden>
    <h3>Almost done — check your email.</h3>
    <p>Your message (ref <span data-ref></span>) has been opened in your email app. Just press send and we'll get back to you shortly. If nothing opened, email us directly at <a href="mailto:${COMPANY.email}">${COMPANY.email}</a>.</p>
  </div>
</div>`;
}

export function tail() {
  return `<script src="/assets/js/site.js" defer></script>
</body>
</html>`;
}
