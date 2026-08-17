/* ============================================================
   BERM INC. — static site generator
   Wraps page body fragments in shared partials, emits site/
   ============================================================ */
import { readFileSync, writeFileSync, mkdirSync, cpSync, rmSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { head, header, footer, ctaBand, tail, COMPANY, SITE_URL } from './partials.mjs';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const pagesDir = join(root, 'site-src', 'pages');
const outDir = join(root, 'site');
const assetsSrc = join(root, 'site-src', 'assets');

/* LocalBusiness JSON-LD (shared shape) */
const localBusinessLD = () => ({
  '@context': 'https://schema.org',
  '@type': 'HomeAndConstructionBusiness',
  name: COMPANY.name,
  url: SITE_URL + '/',
  image: SITE_URL + '/assets/img/hero-home.jpg',
  telephone: COMPANY.phone,
  email: COMPANY.email,
  priceRange: '$$',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Unit 355 - 7250 Keele Street',
    addressLocality: 'Vaughan',
    addressRegion: 'ON',
    postalCode: 'L4K 1Z8',
    addressCountry: 'CA',
  },
  areaServed: [
    { '@type': 'Place', name: 'Toronto' },
    { '@type': 'Place', name: 'Vaughan' },
    { '@type': 'Place', name: 'Greater Toronto Area' },
    { '@type': 'Place', name: 'Ottawa' },
    { '@type': 'Place', name: 'Hamilton' },
  ],
  description: 'Fully insured, HCRA-certified custom home builder in Toronto, Vaughan and the Greater Toronto Area. Custom homes, renovations, additions, project management, and building envelope systems.',
  openingHours: 'Mo-Fr 09:00-18:00',
});

/* ---------------- Page registry ---------------- */
const PAGES = [
  {
    out: 'index.html', path: '/',
    title: 'Custom Home Builder in Toronto, Vaughan & GTA | Berm Inc.',
    description: 'Berm Inc. is a fully insured, HCRA-certified custom home builder serving Toronto, Vaughan and the Greater Toronto Area — custom homes, renovations, additions, project management, and building envelope systems.',
    jsonld: localBusinessLD(),
  },
  {
    out: 'services/index.html', path: '/services/',
    title: 'Construction Services | Custom Homes, Renovations & Project Management | Berm Inc.',
    description: 'Custom home construction, construction project management, interior finishes and architectural details, and renovations & additions — delivered by Berm Inc. across Toronto and the GTA.',
  },
  {
    out: 'about/index.html', path: '/about/',
    title: 'About Berm Inc. | 25+ Years of Construction Experience',
    description: 'With over 25 years of experience in construction and project management, Berm Inc. is an HCRA-certified builder delivering custom homes and renovations across Ontario since 2016.',
  },
  {
    out: 'approach/index.html', path: '/approach/',
    title: 'Our Approach | Building Science, Passive House Principles & Craftsmanship | Berm Inc.',
    description: 'How Berm builds: building science first, a continuous building envelope, Passive House principles, a disciplined design-to-construction process, and craftsmanship you can verify.',
  },
  {
    out: 'work/index.html', path: '/work/',
    title: 'Our Work | Construction Photography & Industrial Background | Berm Inc.',
    description: 'Berm Inc. project photography — the work behind the walls: custom homes, envelope assemblies, structural work, and our industrial construction background across the GTA.',
  },
  {
    out: 'warranty/index.html', path: '/warranty/',
    title: 'Warranty & Protection | HCRA Licensed Builder B60719 | Berm Inc.',
    description: 'Berm Inc. is an HCRA-licensed Vendor and Builder in Ontario (Licence No. B60719). Quality is the first line of defence — warranty is the backup. Licensed, accountable, building-science driven.',
  },
  {
    out: 'blog/index.html', path: '/blog/',
    title: 'Construction Blog | Berm Inc.',
    description: 'Practical advice on hiring a contractor, modern home design, windows, and construction from Berm Inc., custom home builder in Toronto and the GTA.',
  },
  {
    out: 'blog/how-to-avoid-costly-mistakes-when-hiring-a-contractor/index.html',
    path: '/blog/how-to-avoid-costly-mistakes-when-hiring-a-contractor/',
    title: 'How to Avoid Costly Mistakes When Hiring a Contractor | Berm Inc.',
    description: 'Hiring the right contractor is one of the most important decisions in any renovation or custom home project. Here is what to check before signing a contract.',
    jsonld: blogPostLD(
      'How to Avoid Costly Mistakes When Hiring a Contractor',
      'Hiring the right contractor is one of the most important decisions in any renovation or custom home project. Before signing a contract, always check: clear scope of work and pricing, insurance & WSIB coverage, experience and past project quality, timeline and communication process, and exterior work details.',
      '2026-05-15', '/blog/how-to-avoid-costly-mistakes-when-hiring-a-contractor/'),
  },
  {
    out: 'blog/why-black-window-frames-and-large-glass-designs-are-defining-modern-homes/index.html',
    path: '/blog/why-black-window-frames-and-large-glass-designs-are-defining-modern-homes/',
    title: 'Why Black Window Frames & Large Glass Define Modern Homes | Berm Inc.',
    description: 'Black window frames and large-format glass are redefining modern homes — cleaner lines, brighter interiors, and a stronger connection between indoor and outdoor spaces.',
    jsonld: blogPostLD(
      'Why Black Window Frames and Large Glass Designs Are Defining Modern Homes',
      'Modern home design has shifted toward cleaner lines, brighter interiors, and stronger connections between indoor and outdoor spaces. Two of the biggest trends leading this transformation are black window frames and large-format windows.',
      '2026-05-16', '/blog/why-black-window-frames-and-large-glass-designs-are-defining-modern-homes/'),
  },
  {
    out: 'contact/index.html', path: '/contact/',
    title: 'Contact Berm Inc. | Free Consultation for Your Project',
    description: 'Schedule a free consultation with Berm Inc. — custom home builder serving Toronto, Vaughan and the GTA. Call 647-637-1499 or send us your project details.',
  },
  {
    out: '404.html', path: '/404.html',
    title: 'Page Not Found | Berm Inc.',
    description: 'The page you were looking for could not be found.',
  },
];

function blogPostLD(headline, desc, date, url) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline,
    description: desc,
    datePublished: date,
    dateModified: date,
    author: { '@type': 'Person', name: 'Omid Rostami' },
    publisher: {
      '@type': 'Organization',
      name: 'Berm Inc.',
      url: SITE_URL + '/',
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': SITE_URL + url },
  };
}

/* ---------------- Build ---------------- */
function build() {
  if (existsSync(outDir)) rmSync(outDir, { recursive: true });
  mkdirSync(outDir, { recursive: true });
  cpSync(assetsSrc, join(outDir, 'assets'), { recursive: true });

  const urls = [];
  for (const page of PAGES) {
    const bodyFile = join(pagesDir, page.body || page.out.replace('index.html', 'home.html').split('/').join('_'));
    // map out -> page body filename
    const bodyName = bodyNameFor(page);
    const bodyPath = join(pagesDir, bodyName);
    if (!existsSync(bodyPath)) {
      console.error('MISSING BODY:', bodyName);
      process.exit(1);
    }
    const body = readFileSync(bodyPath, 'utf8');
    const jsonld = page.jsonld
      ? `<script type="application/ld+json">${JSON.stringify(page.jsonld)}</script>`
      : '';
    const html = head({
      title: page.title,
      description: page.description,
      path: page.path,
      jsonld,
    }) + header(page.path) + body + tail();
    const dest = join(outDir, page.out);
    mkdirSync(dirname(dest), { recursive: true });
    writeFileSync(dest, html);
    if (page.path !== '/404.html') urls.push(SITE_URL + page.path);
  }

  /* favicon */
  writeFileSync(join(outDir, 'favicon.svg'),
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" fill="#0d5fe0"/><path d="M16 14h32v6H22v10h24v6H22v10h26v6H16z" fill="#fff"/></svg>`);

  /* sitemap */
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${u}</loc></url>`).join('\n')}
</urlset>
`;
  writeFileSync(join(outDir, 'sitemap.xml'), sitemap);

  writeFileSync(join(outDir, 'robots.txt'),
    `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`);

  console.log(`Built ${PAGES.length} pages into site/`);
}

function bodyNameFor(page) {
  if (page.body) return page.body;
  if (page.path === '/') return 'home.html';
  if (page.path.startsWith('/blog/') && page.path !== '/blog/') {
    return 'post-' + page.path.split('/').filter(Boolean).pop() + '.html';
  }
  return page.path.split('/').filter(Boolean)[0].replace(/\.html$/, '') + '.html';
}

build();
