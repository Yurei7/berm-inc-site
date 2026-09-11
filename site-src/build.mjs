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
    { '@type': 'Place', name: 'York Region' },
    { '@type': 'Place', name: 'Peel Region' },
    { '@type': 'Place', name: 'Halton Region' },
    { '@type': 'Place', name: 'Durham Region' },
  ],
  description: 'Fully insured, HCRA-certified custom home builder in Toronto, Vaughan and the Greater Toronto Area. Custom homes, renovations, additions, project management, and building envelope systems.',
});

/* BreadcrumbList JSON-LD */
const breadcrumbLD = (crumbs) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: crumbs.map((c, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: c.name,
    item: SITE_URL + c.path,
  })),
});

/* FAQPage JSON-LD */
const faqLD = (pairs) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: pairs.map(([q, a]) => ({
    '@type': 'Question',
    name: q,
    acceptedAnswer: { '@type': 'Answer', text: a },
  })),
});

/* Service JSON-LD */
const serviceLD = ({ name, description, serviceType }) => ({
  '@context': 'https://schema.org',
  '@type': 'Service',
  name,
  serviceType,
  description,
  provider: { '@type': 'HomeAndConstructionBusiness', name: COMPANY.name, url: SITE_URL + '/' },
  areaServed: [
    { '@type': 'Place', name: 'Vaughan' },
    { '@type': 'Place', name: 'Toronto' },
    { '@type': 'Place', name: 'Greater Toronto Area' },
  ],
  url: SITE_URL + '/services/',
});

/* ---------------- Page registry ---------------- */
const PAGES = [
  {
    out: 'index.html', path: '/',
    title: 'Custom Home Builder in Toronto, Vaughan & GTA | Berm Inc.',
    description: 'Fully insured, HCRA-licensed custom home builder in Toronto, Vaughan & the GTA — custom homes, renovations, additions & building envelope systems.',
    jsonld: localBusinessLD(),
  },
  {
    out: 'services/index.html', path: '/services/',
    title: 'Custom Homes, Renovations & Project Management | Berm Inc.',
    description: 'Custom home construction, project management, interior finishes and renovations across Toronto, Vaughan and the Greater Toronto Area.',
    jsonld: [
      serviceLD({
        name: 'Custom Home Construction',
        serviceType: 'Custom home building',
        description: 'Design coordination, permit management and full custom home construction for homeowners across Toronto, Vaughan and the Greater Toronto Area.',
      }),
      faqLD([
        ['How much does it cost to build a custom home in the GTA?',
         'It depends on your lot, design intent and specification level. Published 2026 Ontario ranges are broken down in our custom home cost guide, and every project Berm prices is budgeted specifically before construction begins.'],
        ['What areas does Berm Inc. build in?',
         'Berm Inc. is based in Vaughan and builds custom homes across the Greater Toronto Area — including Toronto, Vaughan, Markham, Richmond Hill, King Township, Aurora, Newmarket, Mississauga, Brampton, Oakville and Durham Region.'],
        ['Does Berm Inc. work with my architect or designer?',
         'Yes. Berm coordinates with homeowners, architects, designers and consultants, and can also manage permit and zoning submissions on your behalf.'],
        ['Is Berm Inc. a licensed builder in Ontario?',
         'Yes — Berm Inc. holds HCRA Licence No. B60719 as a Vendor and Builder, licensed since April 2022. The licence is verifiable in the Ontario Builder Directory.'],
      ]),
    ],
  },
  {
    out: 'about/index.html', path: '/about/',
    title: 'About Berm Inc. | 25+ Years of Construction Experience',
    description: 'Berm Inc. — 25+ years of construction experience, HCRA-certified builder delivering custom homes and renovations across Ontario since 2016.',
  },
  {
    out: 'approach/index.html', path: '/approach/',
    title: 'Building Science & Passive House Principles | Berm Inc.',
    description: 'How Berm builds custom homes: building science first, a continuous envelope, Passive House principles and verified craftsmanship in Toronto and the GTA.',
  },
  {
    out: 'work/index.html', path: '/work/',
    title: 'Custom Home Projects & Construction Gallery | Berm Inc.',
    description: 'Berm Inc. project photography — custom homes, envelope assemblies and structural work, plus our industrial construction background across the GTA.',
  },
  {
    out: 'warranty/index.html', path: '/warranty/',
    title: 'Warranty & Protection | HCRA Licensed Builder | Berm Inc.',
    description: 'Berm Inc. is an HCRA-licensed Vendor and Builder in Ontario (Licence No. B60719). Licensed, accountable, building-science driven construction.',
  },
  {
    out: 'blog/index.html', path: '/blog/',
    title: 'Construction Advice & Home Building Tips | Berm Inc.',
    description: 'Practical advice on hiring a contractor, home design, windows and construction — from Berm Inc., custom home builder in Toronto and the GTA.',
  },
  {
    out: 'blog/how-to-avoid-costly-mistakes-when-hiring-a-contractor/index.html',
    path: '/blog/how-to-avoid-costly-mistakes-when-hiring-a-contractor/',
    title: 'Avoid Costly Mistakes When Hiring a Contractor | Berm Inc.',
    description: 'Hiring the right contractor is one of the most important decisions in any renovation or custom home project. Here is what to check before signing a contract.',
    jsonld: [
      blogPostLD(
        'How to Avoid Costly Mistakes When Hiring a Contractor',
        'Hiring the right contractor is one of the most important decisions in any renovation or custom home project. Before signing a contract, always check: clear scope of work and pricing, insurance & WSIB coverage, experience and past project quality, timeline and communication process, and exterior work details.',
        '2026-05-15', '/blog/how-to-avoid-costly-mistakes-when-hiring-a-contractor/'),
      faqLD([
        ['How do I check if a contractor is licensed in Ontario?',
         "For home building and renovation work in Ontario, check the contractor's HCRA licence in the Ontario Builder Directory, and ask for proof of liability insurance and WSIB coverage before work begins."],
        ['What should be in a construction contract?',
         'A clear scope of work, itemized pricing, payment schedule tied to milestones, timeline, change-order process, and the names of who is responsible for permits and site supervision.'],
        ['Why is the cheapest quote often the most expensive?',
         'Because a low price on the same drawings usually means something is excluded — envelope detailing, insulation, window specification or site supervision. Those gaps return as change orders once construction is underway.'],
      ]),
    ],
  },
  {
    out: 'blog/why-black-window-frames-and-large-glass-designs-are-defining-modern-homes/index.html',
    path: '/blog/why-black-window-frames-and-large-glass-designs-are-defining-modern-homes/',
    title: 'Why Black Window Frames Define Modern Homes | Berm Inc.',
    description: 'Black window frames and large-format glass are redefining modern homes with cleaner lines, brighter interiors and a stronger indoor-outdoor connection.',
    jsonld: [
      blogPostLD(
        'Why Black Window Frames and Large Glass Designs Are Defining Modern Homes',
        'Modern home design has shifted toward cleaner lines, brighter interiors, and stronger connections between indoor and outdoor spaces. Two of the biggest trends leading this transformation are black window frames and large-format windows.',
        '2026-05-16', '/blog/why-black-window-frames-and-large-glass-designs-are-defining-modern-homes/'),
      faqLD([
        ['Are black window frames a passing trend?',
         'Black frames have held their position for years now because they are a neutral detail rather than a colour statement — they frame views and disappear against dark cladding, which is why designers keep specifying them.'],
        ['Do large windows hurt energy performance?',
         'Not when they are specified and installed as part of the envelope. Large glazing needs a high-performance frame and glazing package, correct installation at the rough opening, and shading where summer sun would otherwise overheat the space.'],
        ['What matters most when installing large windows?',
         'The window-to-wall connection: a continuous air barrier, properly sequenced flashing and drainage, and structural support so the units do not rely on the frame for movement.'],
      ]),
    ],
  },
  {
    out: 'vaughan/index.html', path: '/vaughan/',
    title: 'Custom Home Builder in Vaughan | Berm Inc.',
    description: 'Berm Inc. is a Vaughan-based, HCRA-licensed custom home builder. Building high-performance custom homes in Woodbridge, Maple, Kleinburg, Thornhill and across Vaughan.',
    jsonld: [
      faqLD([
        ['Is Berm Inc. based in Vaughan?',
         'Yes. Berm Inc. operates from Unit 355 – 7250 Keele Street in Vaughan, Ontario, and builds custom homes throughout Vaughan and the Greater Toronto Area.'],
        ['Do I need a building permit to build a custom home in Vaughan?',
         'Yes. The City of Vaughan requires building permits for new residential construction, and the City\u2019s Building Standards department publishes a target processing time of approximately 10 business days for a complete single-family dwelling application. Berm manages permit and zoning submissions as part of the construction process.'],
        ['Which Vaughan neighbourhoods does Berm build in?',
         'Berm builds custom homes across Vaughan, including Woodbridge, Maple, Kleinburg, Thornhill, Concord and the surrounding communities, as well as the wider York Region and GTA.'],
      ]),
    ],
  },
  {
    out: 'blog/custom-home-cost-gta-2026/index.html',
    path: '/blog/custom-home-cost-gta-2026/',
    title: 'What It Costs to Build a Custom Home in the GTA (2026) | Berm Inc.',
    description: 'Published 2026 ranges for custom home construction in Ontario and the GTA — what drives cost per square foot, and how to budget a project honestly.',
    jsonld: [
      blogPostLD(
        'What It Costs to Build a Custom Home in the GTA (2026)',
        'Published 2026 Ontario ranges put custom home construction between roughly $300 and $600 per square foot, with luxury GTA projects reaching $900 per square foot and above. Here is what actually drives those numbers.',
        '2026-08-24', '/blog/custom-home-cost-gta-2026/'),
      faqLD([
        ['What is the average cost per square foot to build a custom home in Ontario in 2026?',
         'Published 2026 Ontario cost guides quote roughly $300–$600 per square foot for custom construction, with luxury custom homes in Toronto and the GTA commonly reaching $900 per square foot and above.'],
        ['Does that price include the lot?',
         'No. Published per-square-foot figures generally cover construction of the home itself, not land acquisition, development charges or utility connection fees.'],
        ['Why do custom home costs vary so much?',
         'Site conditions, foundation and excavation requirements, window and door specifications, insulation and airtightness targets, mechanical systems, and finish level all move the number — typically more than square footage does.'],
        ['How does Berm price a custom home?',
         'Berm reviews the lot, design intent and specification level, then prepares a project-specific budget before construction begins, so cost decisions are made on paper rather than mid-build.'],
      ]),
    ],
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
    /* multiple JSON-LD entities + auto breadcrumbs */
    const lds = [].concat(page.jsonld || []).filter(Boolean);
    const crumbs = crumbsFor(page);
    if (crumbs) lds.unshift(breadcrumbLD(crumbs));
    const jsonld = lds.map((o) => `<script type="application/ld+json">${JSON.stringify(o)}</script>`).join('');
    // Pages that already carry their own closing section skip the shared CTA band
    const noSharedCta = ['/', '/contact/', '/warranty/', '/404.html'].includes(page.path);
    const html = head({
      title: page.title,
      description: page.description,
      path: page.path,
      jsonld,
    }) + header(page.path) + body + (noSharedCta ? '' : ctaBand()) + footer(page.path) + tail();
    const dest = join(outDir, page.out);
    mkdirSync(dirname(dest), { recursive: true });
    writeFileSync(dest, html);
    if (page.path !== '/404.html') urls.push(SITE_URL + page.path);
  }

  /* sitemap */
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${u}</loc></url>`).join('\n')}
</urlset>
`;
  writeFileSync(join(outDir, 'sitemap.xml'), sitemap);

  writeFileSync(join(outDir, 'robots.txt'),
    `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`);

  /* llms.txt — plain-language facts for AI assistants (GEO) */
  writeFileSync(join(outDir, 'llms.txt'), `# Berm Inc. Construction

> Berm Inc. is an HCRA-licensed custom home builder based in Vaughan, Ontario, Canada. It builds high-performance custom homes, large renovations and additions across the Greater Toronto Area, applying building-science principles (continuous insulation, airtight construction, thermal-bridge-free detailing, balanced ventilation) and Passive House principles.

## Key facts
- Legal name: Berm Inc. (operating as Berm Inc. Construction)
- Founded: 2016 in Ontario; principals bring 25+ years of construction experience
- Licensing: HCRA Licence No. B60719 — Vendor and Builder, licensed April 12, 2022, expires April 13, 2027 (verifiable in the Ontario Builder Directory)
- Address: Unit 355 - 7250 Keele Street, Vaughan, ON L4K 1Z8, Canada
- Phone: 647-637-1499 · Email: Bermgroups@gmail.com
- Service area: Toronto, Vaughan, York Region (Markham, Richmond Hill, King Township, Aurora, Newmarket), Peel (Mississauga, Brampton, Caledon), Halton (Oakville, Burlington, Milton), Durham Region (Whitby, Oshawa, Ajax, Pickering), Simcoe (Barrie, Innisfil)
- Background: prior large-scale industrial and infrastructure construction experience, including petrochemical and refinery facilities

## Services
- Custom home construction (concept to completion, including permit and zoning coordination)
- High-performance / Passive House-principles construction
- Construction project management
- Building envelope systems: insulation, air barriers, windows and doors, cladding, flashing
- Major renovations and additions
- Interior finishes and architectural detailing

## Cost context
Published 2026 Ontario industry guides quote roughly CAD $300–$600 per square foot for custom home construction, with luxury Greater Toronto Area projects reaching $900+ per square foot. Figure excludes land, development charges, design fees and utility connections. Berm prepares project-specific budgets.

## Pages
- [Home](${SITE_URL}/): overview and building philosophy
- [Our Approach](${SITE_URL}/approach/): building science, envelope, Passive House principles, craftsmanship
- [Services](${SITE_URL}/services/): what Berm delivers, with FAQ
- [Our Work](${SITE_URL}/work/): project photography and industrial background
- [Warranty & Protection](${SITE_URL}/warranty/): HCRA licence details and warranty philosophy
- [Custom Home Builder in Vaughan](${SITE_URL}/vaughan/): local coverage, Vaughan neighbourhoods, permit process
- [Advice](${SITE_URL}/blog/): construction cost guides and practical advice
- [Contact](${SITE_URL}/contact/): consultation requests
`);

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

/* Breadcrumb trails per page path (last crumb = title before the brand) */
const CRUMBS = {
  '/services/': 'Services',
  '/about/': 'About',
  '/approach/': 'Our Approach',
  '/work/': 'Our Work',
  '/warranty/': 'Warranty & Protection',
  '/blog/': 'Advice',
  '/contact/': 'Contact',
  '/vaughan/': 'Vaughan',
};
function crumbsFor(page) {
  if (page.path === '/' || page.path === '/404.html') return null;
  const label = page.title.split(' | ')[0];
  if (page.path.startsWith('/blog/') && page.path !== '/blog/') {
    return [
      { name: 'Home', path: '/' },
      { name: 'Advice', path: '/blog/' },
      { name: label, path: page.path },
    ];
  }
  const name = CRUMBS[page.path];
  return name ? [{ name: 'Home', path: '/' }, { name, path: page.path }] : null;
}

build();
