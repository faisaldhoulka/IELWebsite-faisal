/**
 * Seed content for the homepage and the 12 CMS pages, taken from the current site
 * (revamp-homepage branch). Legal pages read their text from ./legal/*.html.
 */
import { headingId } from '../../src/lib/slug'
import { L, accountOpening } from './site'

type Button = ReturnType<typeof L> & { style: 'primary' | 'secondary' }
const P = (label: string, path: string): Button => ({ ...L(label, path), style: 'primary' })
const S = (label: string, path: string): Button => ({ ...L(label, path), style: 'secondary' })

// ── Homepage (index.astro) ───────────────────────────────────────────────────

export const homepage = {
  seo: {
    title: 'IEL | Financial and Transaction Advisory in Pakistan',
    description:
      'Integrated Equities Limited (IEL) advises companies, sponsors and investors on IPOs, debt and sukuk, mergers and acquisitions, and fundraising, with its own PSX brokerage for execution.',
  },
  sections: [
    {
      blockType: 'hero',
      anchor: 'top',
      eyebrow: 'Financial and transaction advisory · Lahore and Karachi',
      title: 'Advice on listings, capital raising and corporate transactions in Pakistan.',
      intro:
        'IEL advises companies, sponsors and investors on IPOs, debt and sukuk, mergers and acquisitions, and fundraising. Our own PSX brokerage executes what we structure.',
      buttons: [P('Discuss a mandate', '/#contact'), S('View transactions', '/#transactions')],
      stats: [
        { value: '2008', label: 'Advising and executing since' },
        { value: 'A- / A-2', label: 'VIS entity rating, long and short term' },
        { value: '[XX]', label: 'Transactions advised' },
        { value: 'PKR [XX] bn', label: 'Capital raised and transacted' },
      ],
    },
    {
      blockType: 'services',
      anchor: 'advisory',
      eyebrow: 'Advisory services',
      title: 'One team from first model to closing.',
      intro: 'Each mandate is led by a partner and staffed by analysts who build the model, draft the documents and sit in the negotiations.',
      cardsLinkToContact: true,
    },
    {
      blockType: 'transactions',
      anchor: 'transactions',
      eyebrow: 'Selected transactions',
      title: 'Recent mandates',
      sectionLink: L('All transactions', '/#transactions'),
      limit: 4,
    },
    {
      blockType: 'process',
      eyebrow: 'How a mandate runs',
      title: 'Four stages, one accountable partner.',
      steps: [
        { name: 'Assess', color: 'green', text: 'We review the business, the numbers and the options, and tell you plainly whether the transaction makes sense.' },
        { name: 'Structure', color: 'wine', text: 'Valuation, instrument design, regulatory route with SECP and PSX, and the information memorandum.' },
        { name: 'Market', color: 'red', text: 'Investor and counterparty outreach, roadshows, book building and negotiation of terms.' },
        { name: 'Close', color: 'pine', text: 'Documentation, approvals, settlement and execution through our brokerage where shares change hands.' },
      ],
    },
    {
      blockType: 'team',
      anchor: 'team',
      eyebrow: 'Leadership',
      title: 'The people who lead your mandate',
      sectionLink: L('Full team', '/about#team'),
      limit: 3,
    },
    {
      blockType: 'insights',
      anchor: 'insights',
      eyebrow: 'Insights',
      title: 'Research that informs our advice',
      sectionLink: L('All insights', '/research'),
      items: [
        { tag: 'Sector note · [Date]', title: '[Sector deep dive title, e.g. fertilizer sector outlook]', text: 'Peer comparison, earnings drivers and valuation.', href: '/research' },
        { tag: 'Morning Insights · Daily', title: 'Pre-open note on PSX, rates and commodities', text: "Index levels, headlines and the day's outlook.", href: '/research' },
        { tag: 'Market Closing · Daily', title: 'End-of-day PSX wrap', text: 'Gainers, laggers, volume leaders and sector participation.', href: '/research' },
      ],
    },
    {
      blockType: 'ctaBand',
      anchor: 'brokerage',
      title: 'Trading with IEL',
      text: 'Our PSX brokerage, rated BFR 2 by VIS, serves individual, corporate and institutional investors. Open an account online in minutes.',
      buttons: [S('Open an account', '/open-account'), S('Brokerage services', '/brokerage')],
    },
    { blockType: 'partners', anchor: 'about', title: 'Associated companies' },
    {
      blockType: 'contact',
      anchor: 'contact',
      title: 'Start a conversation',
      text: 'Tell us what you are working on. A partner replies within [one business day], and every enquiry is confidential.',
      showContactDetails: true,
      submitLabel: 'Send enquiry',
    },
  ],
}

// ── Pages ────────────────────────────────────────────────────────────────────

export type SeedPage = {
  title: string
  slug: string
  template?: 'standard' | 'legal' | 'document'
  hero: { eyebrow?: string; title?: string; intro?: string; buttons?: Button[]; aside?: Record<string, string> }
  layout: Record<string, unknown>[]
  showContactBand?: boolean
  seo?: { title?: string; description?: string }
  /** Legal pages: name of the file in seed-data/legal (converted to rich text by the seed). */
  legalHtml?: string
}

const CLIENTS = {
  blockType: 'logoGrid',
  eyebrow: 'Clients',
  title: 'Who we have worked with',
  background: 'pine',
  logos: [
    { name: 'Agritech', imagePath: '/IEL Assets/partners/logo_1.png' },
    { name: 'ABL Funds', imagePath: '/IEL Assets/partners/logo_2.png' },
    { name: 'NBP Funds', imagePath: '/IEL Assets/partners/logo_3.png' },
    { name: 'Pakistan Cricket Board', imagePath: '/IEL Assets/partners/logo_4.png' },
    { name: 'Masood Textile Mills', imagePath: '/IEL Assets/partners/logo_5.png' },
  ],
}

const faq = (items: [string, string][]) => ({
  blockType: 'faq',
  eyebrow: 'FAQs',
  title: 'Questions we are often asked',
  showContactLink: true,
  items: items.map(([question, answer]) => ({ question, answer })),
})

const whatWeDo = (title: string, cards: [string, string][]) => ({
  blockType: 'cardGrid',
  eyebrow: 'What we do',
  title,
  background: 'white',
  numbered: true,
  cards: cards.map(([t, text]) => ({ title: t, text })),
})

const openAccount = (eyebrow = 'Brokerage') => ({
  blockType: 'accountOpening',
  eyebrow,
  title: 'Open your account in minutes',
  intro: 'Fast, secure and simple onboarding for individual and corporate investors.',
  showButton: true,
})

const ADVISORY_BUTTONS = [P('Discuss a mandate', '/#contact'), S('Book a free consultation', '/contact')]

export const pages: SeedPage[] = [
  // About
  {
    title: 'About Us',
    slug: 'about',
    hero: {
      eyebrow: 'About IEL',
      title: 'About Us',
      intro: 'The difference between hoping and knowing? Having IEL in your corner.',
      buttons: [P('Meet the team', '#team'), S('Associated companies', '#Associated_Company')],
    },
    seo: {
      title: 'About Us',
      description: 'Pakistan-based financial services firm offering brokerage, corporate advisory, and investment research. Meet the team behind IEL.',
    },
    layout: [
      {
        blockType: 'richText',
        anchor: 'about',
        eyebrow: 'Who we are',
        title: 'About',
        html: [
          'Integrated Equities Limited (IEL) is a Pakistan-based financial services firm providing investment banking, corporate finance advisory, equity brokerage and investment research services to corporations, sponsors and investors.',
          'Our advisory practice supports clients throughout the transaction lifecycle—from evaluating strategic alternatives and developing financial models to valuation, transaction structuring, capital raising, investor engagement and execution. Our experience spans public and private equity transactions, mergers and acquisitions, strategic partnerships, joint ventures, corporate restructuring, project finance and capital-market offerings.',
          'IEL combines rigorous financial analysis with a practical understanding of Pakistan’s business, regulatory and capital-market environment. We work closely with management teams, boards, shareholders and professional advisers across sectors including energy and infrastructure, power and utilities, industrials, consumer businesses, textiles, food, technology and real estate.',
          'Our approach is analytical, commercially focused and execution-driven. We aim to provide clear, independent and decision-useful advice—helping clients understand opportunities, manage risks and structure transactions that support sustainable long-term value.',
        ].map((p) => `<p>${p}</p>`).join(''),
      },
      {
        blockType: 'cardGrid',
        anchor: 'mission',
        eyebrow: 'What drives us',
        title: 'Our Mission',
        intro: "We look after Pakistan's next generation of investors—because your first investment should feel empowering, not intimidating.",
        background: 'pine',
        numbered: true,
        cards: [
          ['We cut through the confusion', 'straight talk about money, zero intimidation'],
          ['Every big investor started with one rupee', 'your first step matters more than your bank balance'],
          ['Ask us anything', "Seriously, we've heard every question and we're here for it"],
          ['When you grow, Pakistan grows', "your success fuels the economy we're all building together"],
          ['Learn first, earn smart', 'confidence comes from understanding, not guessing'],
          ["Pakistan's financial future runs through you", "We're building wealth for the generation that's building Pakistan"],
        ].map(([title, text]) => ({ title, text })),
      },
      {
        blockType: 'teamList',
        anchor: 'team',
        eyebrow: 'Leadership',
        title: 'Meet the Team',
        intro: "A team of varied experiences, driven by the same belief: wealth building isn't just for the wealthy.",
        groups: ['board', 'management'],
      },
      {
        blockType: 'cardGrid',
        anchor: 'Associated_Company',
        eyebrow: 'Associated companies',
        title: 'Associated and Affiliate Companies',
        background: 'white',
        numbered: false,
        cards: [
          {
            title: 'PACRA',
            imagePath: '/IEL Assets/company_2.png',
            text: "Pakistan's first and leading credit rating agency since 1994, established with Fitch Ratings and IFC. With 8,500+ rating opinions across 55+ sectors and complete independence, PACRA covers 40% of KSE-100 companies.",
          },
          {
            title: 'TASDEEQ',
            imagePath: '/IEL Assets/company_3.png',
            text: "Pakistan's first State Bank licensed credit information bureau. Enabling smarter lending decisions that catalyses credit market growth.",
          },
        ],
      },
    ],
  },

  // Service pages (same template)
  {
    title: 'Financial advisory',
    slug: 'services/financial-advisory',
    hero: {
      eyebrow: 'Advisory',
      title: 'Financial advisory',
      intro: 'Advice that goes beyond ideas: IPOs and listings, sukuk, M&A and capital raising, taken from preparation through to execution.',
      buttons: ADVISORY_BUTTONS,
    },
    seo: { title: 'Financial Advisory', description: 'Expert financial advisory services to help you navigate the complexities of the financial markets and achieve your goals.' },
    layout: [
      whatWeDo('Financial advisory services', [
        ['IPO advisory and listing support', 'From preparation to execution. Complete IPO guidance including regulatory compliance, valuation, timing strategy and management of the listing process.'],
        ['Sukuk structuring', 'Shariah-compliant financing tailored to your needs. Structuring of sukuk instruments that optimise the cost of capital while meeting Islamic finance principles.'],
        ['M&A transactions', 'Deal execution from start to finish: buy-side and sell-side advisory, due diligence, valuation and negotiation support for mergers and acquisitions.'],
        ['Debt and equity capital raising', 'Access to capital when you need it. Fundraising across debt and equity markets on the best available terms and pricing.'],
        ['Investor presentations and pitch decks', 'Presentations that clearly communicate your value proposition and growth story to investors.'],
      ]),
      CLIENTS,
      faq([
        ["What's included in your IPO services?", 'Everything from A to Z. We handle the paperwork, timing, compliance and the complex work so you can focus on running your business.'],
        ['Can you help with Islamic finance options?', 'Yes. We specialise in sukuk structuring that meets Shariah requirements while keeping costs competitive, so you get compliant financing that works for your business.'],
        ['How do you help with raising capital?', 'We connect you with the right investors at the right time. Whether you need debt or equity, we help you raise funding on terms that make sense.'],
      ]),
      openAccount(),
    ],
  },
  {
    title: 'Strategy consulting',
    slug: 'services/strategy-consulting',
    hero: {
      eyebrow: 'Advisory',
      title: 'Strategy consulting',
      intro: 'Success starts with a strategy you can stand behind: feasibility studies, market entry, restructuring and financial models built to deliver.',
      buttons: ADVISORY_BUTTONS,
    },
    seo: { title: 'Strategy Consulting', description: 'Expert strategy consulting services to help you navigate the complexities of the financial markets and achieve your goals.' },
    layout: [
      whatWeDo('Strategy consulting services', [
        ['Feasibility studies and business models', 'Know before you leap. We run the numbers, study the market and tell you plainly whether your idea will work, and how to make it profitable.'],
        ['Go-to-market and expansion plans', 'Enter new markets with the right timing, solid research and practical plans that help you grow without expensive mistakes.'],
        ['Corporate structuring and turnaround', 'Fix what is broken and optimise what is working. Whether you are restructuring or turning things around, we help you build a business that runs smoothly.'],
        ['Financial modelling and forecasting', 'Clear financial models and forecasts that help you plan and show investors you know your numbers.'],
      ]),
      CLIENTS,
      faq([
        ['How honest are you with feasibility studies?', 'Completely. We tell you plainly whether your idea will work, with no sugar-coating, just real analysis that saves you time and money. If it is good, we show you how to make it profitable.'],
        ["What's your approach to market entry?", 'Smart timing, solid research and practical plans. We help you enter new markets without expensive mistakes, so you know when to move and how to win.'],
        ['Do you help fix struggling businesses?', 'Yes. We identify what is broken, build on what is working and help you put a business in place that runs smoothly. Real fixes, not band-aid solutions.'],
      ]),
      openAccount(),
    ],
  },
  {
    title: 'Real estate advisory',
    slug: 'services/real-estate-advisory',
    hero: {
      eyebrow: 'Advisory',
      title: 'Real estate advisory',
      intro: 'Property can do more than appreciate. We advise on REITs, due diligence, project financing and joint ventures.',
      buttons: ADVISORY_BUTTONS,
    },
    seo: { title: 'Real Estate Advisory', description: 'Expert real estate advisory services to help you navigate the complexities of the real estate market and achieve your goals.' },
    layout: [
      whatWeDo('Real estate advisory services', [
        ['REIT setup and compliance', 'We handle the regulatory requirements so you can launch your real estate investment trust smoothly and focus on finding good opportunities.'],
        ['Real estate investment due diligence', 'Analysis before you commit: comprehensive property evaluation that prevents costly surprises.'],
        ['Capital structuring for property projects', 'Financing structures for property projects designed to maximise returns while keeping risk in check.'],
        ['JV and partnership structuring', "Clear partnership agreements that protect everyone's interests while moving your projects forward."],
      ]),
      CLIENTS,
      faq([
        ['How do you help with REIT setup?', "We handle the regulatory complexity so you don't have to. From setup to compliance, we manage the process while you focus on finding good investment opportunities."],
        ['What does your real estate due diligence cover?', 'Everything that matters. We analyse the property, market conditions and potential risks so you know exactly what you are getting into.'],
        ['Can you structure real estate partnerships?', 'Yes. We create partnership agreements that protect everyone while moving your projects forward: clear terms, fair structures and successful outcomes.'],
      ]),
      openAccount(),
    ],
  },
  {
    title: 'Fintech and digital solutions',
    slug: 'services/fintech',
    hero: {
      eyebrow: 'Fintech',
      title: 'Fintech and digital solutions',
      intro: 'Fintech that works: making finance intuitive for your clients and scalable for you.',
      buttons: ADVISORY_BUTTONS,
      aside: {
        title: "Trading doesn't have to be complicated.",
        text: 'We built a platform that makes sense: clean charts, real insights and no fluff, because your money deserves better than guesswork.',
        linkLabel: 'Start trading',
        linkPath: '/open-account',
      },
    },
    seo: { title: 'Fintech & Digital Solutions', description: 'Expert Fintech & Digital Solutions services to help you navigate the complexities of the financial markets and achieve your goals.' },
    layout: [
      whatWeDo('Fintech and digital services', [
        ['White-label brokerage apps', 'Your brand, our technology. Complete mobile and web trading platforms that you can customise and launch under your own identity, without the development headaches.'],
        ['AI-powered investment insights', 'Analytics powered by artificial intelligence that spot patterns, identify trends and deliver insights that make sense to everyone.'],
        ['API-based trading infrastructure', 'Reliable API infrastructure that links your systems to trading platforms, market data and financial services.'],
        ['Investor education platforms', 'Interactive learning tools that turn complex financial concepts into clear, actionable knowledge.'],
      ]),
      CLIENTS,
      faq([
        ['What makes your trading platform special?', 'It makes sense. Clean design, real insights and no fluff. We built it for people who want to trade smart, not just trade often.'],
        ['Can I use your technology for my own business?', 'Yes. Our white-label solutions let you launch trading platforms under your own brand, with proven technology and without the development headaches.'],
        ['How does your AI investment tool work?', 'It spots patterns and trends that are easy to miss, then explains them in plain English. Instead of overwhelming you with data, it gives you actionable insights that help you invest smarter.'],
      ]),
      openAccount(),
    ],
  },
  {
    title: 'Brokerage',
    slug: 'brokerage',
    hero: {
      eyebrow: 'Brokerage',
      title: 'Brokerage',
      intro: 'It is not just about buying and selling, it is about making every trade count. Equity brokerage for individual, corporate and institutional investors.',
      buttons: [P('Open an account', '/open-account'), S('Contact us', '/contact')],
    },
    seo: { title: 'Brokerage', description: 'Retail and institutional equity brokerage with competitive pricing, real-time trading tools, and research-backed insights. Open your account with IEL.' },
    layout: [
      whatWeDo('Brokerage services', [
        ['Retail and institutional equity brokerage', 'Access the market on your terms, with competitive pricing and full transparency. Whether you trade as an individual or manage institutional flows, our execution is built for accuracy and trust.'],
        ['Advanced trading platform and mobile app', 'Trade across desktop and mobile with tools designed for serious investors. Real-time market data, detailed charts and smooth execution come as standard.'],
        ['Market research and trading signals', 'Make informed decisions with intelligence that goes beyond headlines. Our analysts deliver practical insights, technical signals and timely updates rooted in real market behaviour.'],
        ['Portfolio management support', 'Performance tracking, risk evaluation and tailored guidance that keep your portfolio aligned with your goals.'],
      ]),
      openAccount('Accounts'),
      CLIENTS,
      faq([
        ['What makes your brokerage different from other trading platforms?', 'We focus on what matters: smart execution, fair pricing and insights that help you make better decisions. Think of us as your trading partner, not just another app.'],
        ['Do you work with both new and experienced investors?', 'Yes. Whether you are making your first trade or managing serious money, our platform is simple enough for beginners and powerful enough for professionals.'],
        ['What kind of support do I get for my portfolio?', 'Performance tracking, risk checks and guidance that make sense: clear insights that help you make better decisions, without confusing reports.'],
      ]),
    ],
  },

  // Investor education (three PDF lists)
  {
    title: 'Investor Education',
    slug: 'investor-education',
    hero: {
      eyebrow: 'Investors',
      title: 'Investor Education',
      intro: 'Investor education resources from IEL: guides, risk disclosures, trading terms, and regulatory documents to help you invest with confidence.',
      buttons: [P('Investor guides', '#guides'), S('Trading with IEL', '#trading'), S('Regulations and policies', '#regulations')],
    },
    seo: {
      title: 'Investor Education',
      description: 'Investor education resources from IEL: guides, risk disclosures, trading terms, and regulatory documents to help you invest with confidence.',
    },
    layout: (
      [
        ['guides', 'Investor guides', ['Investor Guide SECP English', 'Investor Guide Urdu', 'PSX Invester Awareness Guide Book - Urdu', 'Trading Common Terms in English', 'Common Terms Urdu']],
        ['trading', 'Trading with IEL', ['Internet Trading Terms', 'Order Executions Flow', 'Service Level Agreement', 'Risk Disclosure', 'User Manual Soct Tech']],
        ['regulations', 'Regulations and policies', ['Arbitration Regulations English', 'Arbitration Regulations Urdu', 'PSX-Regulations-October-03-2025-Bonus-and-Right-Issue-Timelines', 'Annexure B1 - IEL AMLCFTCPF Policy Approved on 22 March 2024']],
      ] as [string, string, string[]][]
    ).map(([anchor, title, docs]) => ({
      blockType: 'fileList',
      anchor,
      title,
      files: docs.map((name) => ({ label: name, path: `/IEL Assets/PDF/Investor Education/${name}.pdf` })),
    })),
  },

  // Legal and document pages (text from seed-data/legal/*.html)
  {
    title: 'Privacy Policy',
    slug: 'privacy',
    template: 'legal',
    legalHtml: 'privacy',
    hero: {
      eyebrow: 'Legal',
      title: 'Privacy Policy',
      intro: 'This comprehensive statement outlines our Privacy Policy, Risk Disclosures, and other regulatory commitments, aimed at ensuring that our clients are fully informed and confident in their engagement with us.',
    },
    seo: { title: 'Privacy Policy', description: "IEL's privacy policy covering data protection, regulatory disclosures, and risk statements for clients of Integrated Equities Limited." },
    layout: [],
  },
  {
    title: 'Terms and Conditions',
    slug: 'terms',
    template: 'legal',
    legalHtml: 'terms',
    hero: {
      eyebrow: 'Legal',
      title: 'Terms and Conditions',
      intro: 'These Terms and Conditions govern your access to and use of the website, mobile applications, and digital services operated by IEL.',
    },
    seo: { title: 'Terms and Conditions', description: "Terms and conditions for using Integrated Equities Limited's (IEL) brokerage services, trading platform, and website." },
    layout: [],
  },
  {
    title: 'Risk Disclosure',
    slug: 'risk-disclosure',
    template: 'legal',
    legalHtml: 'risk-disclosure',
    hero: { eyebrow: 'Legal', title: 'Risk Disclosure', intro: 'The customer should carefully read this document before opening a trading account with IEL.' },
    seo: { title: 'Risk Disclosure', description: 'Risk disclosure statement from IEL covering market, liquidity, leverage, and operational risks involved in trading securities on PSX.' },
    layout: [],
  },
  {
    title: 'Fraud Warning',
    slug: 'fraud-awareness',
    template: 'legal',
    legalHtml: 'fraud-awareness',
    hero: { eyebrow: 'Legal', title: 'Fraud Warning', intro: 'The customer should carefully read this document before opening trading account with a broker.' },
    seo: {
      title: 'Fraud Warning',
      description: 'Fraud warning and risk disclosure from IEL: how to identify fraudulent schemes, verify official communications, and protect yourself when trading.',
    },
    layout: [
      {
        blockType: 'buttons',
        buttons: [P('Read the full Risk Disclosure', `/risk-disclosure#${headingId('1. Basic Risks Involved in Trading in Securities Market')}`)],
      },
    ],
  },
  {
    title: 'Regulatory Information',
    slug: 'regulatory',
    template: 'document',
    legalHtml: 'regulatory',
    hero: {
      eyebrow: 'Corporate information',
      title: 'Regulatory Information',
      intro: 'Corporate governance, board composition, regulatory status, and shareholding information for Integrated Equities Limited (IEL).',
    },
    seo: { title: 'Regulatory Information', description: 'Corporate governance, board composition, regulatory status, and shareholding information for Integrated Equities Limited (IEL).' },
    layout: [],
  },
]

export { accountOpening }
