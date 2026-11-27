/**
 * Seed content for globals and list collections, taken from the current site
 * (revamp-homepage branch: SiteHeader, SiteFooter, index, About, NewReport, Reports,
 * and the account-opening steps shared by the service pages).
 * Bracketed text such as [Client name] or [XX] is still to be supplied by the client.
 */

export type SeedLink = { label: string; type: 'path' | 'url'; path?: string; url?: string; newTab?: boolean }

/** Internal link (site path). */
export const L = (label: string, path: string, newTab = false): SeedLink => ({ label, type: 'path', path, newTab })
/** External link. */
export const X = (label: string, url: string): SeedLink => ({ label, type: 'url', url, newTab: true })

const COMPLAINTS_PDF = '/docs/Procedure-for-Complaint-Handling-MUFAP.pdf'
const BOOKING_URL = 'https://meetings.hubspot.com/jessica-brennan'

// ── Site settings ────────────────────────────────────────────────────────────

export const siteSettings = {
  utilityBar: {
    text: 'PSX TREC holder · VIS entity rating A- / A-2',
    links: [L('Brokerage', '/brokerage'), L('Open an account', '/open-account')],
  },
  contact: {
    phone: '+92 42 3574 1714-15',
    phoneHref: '+924235741714',
    email: 'info@iel.net.pk',
    addresses: [
      { city: 'Lahore', address: '30 Cricketers Colony, 3rd floor, NETSOL Avenue, Ghazi Interchange, Ring Road' },
      { city: 'Karachi', address: 'Room 134, 3rd floor, KSE Building' },
    ],
  },
  // No client login URL exists on the current site yet (to be supplied before launch).
  clientLoginUrl: '',
  bookingUrl: BOOKING_URL,
  defaultSeo: {
    title: 'IEL | Financial and Transaction Advisory in Pakistan',
    description:
      'Integrated Equities Limited (IEL) advises companies, sponsors and investors on IPOs, debt and sukuk, mergers and acquisitions, and fundraising, with its own PSX brokerage for execution.',
  },
}

// ── Header menu (SiteHeader.astro, with the new clean URLs) ─────────────────

export const navigation = {
  items: [
    {
      ...L('About', '/about'),
      children: [L('About IEL', '/about'), L('Leadership', '/about#team'), L('Associated companies', '/about#Associated_Company')],
    },
    {
      ...L('Services', '/services/financial-advisory'),
      children: [
        L('Financial advisory', '/services/financial-advisory'),
        L('Strategy consulting', '/services/strategy-consulting'),
        L('Real estate advisory', '/services/real-estate-advisory'),
        L('Fintech solutions', '/services/fintech'),
      ],
    },
    { ...L('Transactions', '/#transactions'), children: [] },
    {
      ...L('Investors', '/regulatory'),
      children: [
        L('Regulatory information', '/regulatory'),
        L('Financial statements', '/financial-statements'),
        L('Investor education', '/investor-education'),
        L('Complaint handling procedure', COMPLAINTS_PDF, true),
        L('Fraud awareness', '/fraud-awareness'),
        L('Risk disclosure', '/risk-disclosure'),
      ],
    },
    {
      ...L('Brokerage & Research', '/brokerage'),
      children: [
        L('Brokerage', '/brokerage'),
        L('Research reports', '/research'),
        L('Corporate reports', '/corporate-reports'),
        L('News', '/news'),
        L('Learn (articles)', '/learn'),
      ],
    },
    {
      ...L('Contact', '/contact'),
      children: [L('Contact us', '/contact'), X('Book a consultation', BOOKING_URL), L('Open an account', '/open-account')],
    },
  ],
  cta: L('Discuss a mandate', '/#contact'),
}

// ── Footer (SiteFooter.astro) ────────────────────────────────────────────────

export const footer = {
  columns: [
    {
      title: 'Services',
      links: [
        L('Financial advisory', '/services/financial-advisory'),
        L('Strategy consulting', '/services/strategy-consulting'),
        L('Real estate advisory', '/services/real-estate-advisory'),
        L('Brokerage', '/brokerage'),
        L('Fintech and digital', '/services/fintech'),
      ],
    },
    {
      title: 'Insights',
      links: [L('Research', '/research'), L('News', '/news'), L('Articles', '/learn'), L('Investor education', '/investor-education')],
    },
    {
      title: 'Investors',
      links: [
        L('Regulatory information', '/regulatory'),
        L('Financial statements', '/financial-statements'),
        L('Complaints (SECP, PSX)', COMPLAINTS_PDF, true),
        L('Fraud awareness notice', '/fraud-awareness'),
        L('Risk disclosure', '/risk-disclosure'),
      ],
    },
    {
      title: 'Company',
      links: [L('About IEL', '/about'), L('Contact', '/contact'), L('Open an account', '/open-account'), L('Terms and conditions', '/terms')],
    },
  ],
  complaints: { buttonLabel: 'Complaints (SECP, PSX)', pdfPath: COMPLAINTS_PDF },
  copyright: 'Integrated Equities Limited. Licensed by SECP. PSX TREC holder.',
  bottomLinks: [L('Privacy policy', '/privacy')],
}

// ── Homepage services (index.astro) ──────────────────────────────────────────
// `page` = slug of the service page the card relates to (linked after pages are created).

export const services = [
  { title: 'Equity capital markets', summary: 'IPO readiness, main board and GEM board listings, rights issues, offers for sale and private placements.', ctaLabel: 'Discuss a listing', page: 'services/financial-advisory' },
  { title: 'Debt and sukuk', summary: 'Sukuk and TFC structuring, Shariah-compliant financing, loan syndication and debt arrangement.', ctaLabel: 'Discuss a raise', page: 'services/financial-advisory' },
  { title: 'Mergers and acquisitions', summary: 'Buy-side and sell-side advisory, joint ventures, due diligence coordination and transaction agreements.', ctaLabel: 'Discuss a deal', page: 'services/financial-advisory' },
  { title: 'Valuation and feasibility', summary: 'Financial models, independent valuations, feasibility studies and investor presentations.', ctaLabel: 'Request a valuation', page: 'services/strategy-consulting' },
  { title: 'Restructuring', summary: 'Financial and corporate restructuring, lender negotiations and balance sheet repair.', ctaLabel: 'Talk to us', page: 'services/strategy-consulting' },
  { title: 'Strategy consulting', summary: 'Business plans, strategy reviews, market entry and real estate project advisory.', ctaLabel: 'Talk to us', page: 'services/strategy-consulting' },
]

// ── Transactions (placeholders until the client sends the list) ─────────────

export const transactions = [
  { year: '[Year]', practice: 'Equity capital markets', client: '[Client name]', description: 'Initial public offering, PSX main board', size: 'PKR [X] bn', role: '[Lead advisor / Arranger]' },
  { year: '[Year]', practice: 'Debt and sukuk', client: '[Client name]', description: 'Privately placed sukuk', size: 'PKR [X] bn', role: '[Lead advisor / Arranger]' },
  { year: '[Year]', practice: 'Mergers and acquisitions', client: '[Client name]', description: 'Sell-side advisory on stake sale', size: 'PKR [X] bn', role: '[Financial advisor]' },
  { year: '[Year]', practiceLabel: 'Block execution', client: '[Client name]', description: 'Block trade through IEL brokerage', size: '[X] m shares', role: '[Executing broker]' },
]

// ── Team (About.astro; bios word for word) ───────────────────────────────────

const M = '/IEL Assets/Members/'
type Person = { name: string; role: string; img: string; bio: string; home?: boolean }

export const board: Person[] = [
  { name: 'Sardar Ali Wattoo', role: 'Sponsor / Director / CEO', img: 'sardar_ali_watto.png', bio: 'Above 28 years experience. Served top management positions in renowned business houses/groups. Vast experience of finance, equity & debt IPO/listings; Mills finance syndications, M&A, Real Estate, Energy, Telecom, IT, Media, Financial Services, Textiles, Cement, Pipelines, Pharma and Projects development.' },
  { name: 'Sadia Ali', role: 'Sponsor / Non-Executive Director', img: 'Sadia_ali.png', bio: 'Sadia graduated from Punjab University in 1994 and served as Director & CEO of Poseidon Synergies (Private) Limited from 2008 to 2015. Poseidon is currently the parent company of Singer Pakistan Limited. Sadia is a shareholder of Integrated Equities Limited and has continuously served on its board since 2008.' },
  { name: 'Syed Kashan Hussain Kazmi', role: 'Director / COO', img: 'kashan_hussan.png', bio: 'Kashan Kazmi is a senior finance and management professional with over 25 years of working experience in Financial Industry of Pakistan in different roles in Capital Markets, Asset Management and Investment Advisory, Portfolio Management, and Equity Brokerage. He has previously served as CEO of First Capital Investments Limited (FCIL).' },
  { name: 'Muhammad Mohsin Nawaz Sabri', role: 'Independent Director', img: 'mohsin.jpeg', bio: 'Mr. Muhammad Mohsin Nawaz Sabri is an advocate Hight Court and a member of Punjab Bar Council. He has done his Post Graduate Diploma in International Affairs and LL.B. from Punjab University in 2016 and has been practicing law since then. He is Ex Vice Chairman of Human Rights Committee High Court and is legal advisor to various companies and has high ambitions about his future.' },
  { name: 'Muhammad Iqbal Hussain', role: 'Director/CCO', img: 'iqbal_hussain.png', bio: 'A seasoned professional with over 20 years of experience in Regulatory Compliance, Risk Management, Finance, and Corporate Advisory across diverse industries in Pakistan and abroad. His expertise includes Corporate Restructuring, IPOs, Mergers & Acquisitions, PSX listings, and regulatory matters. He brings strong leadership, governance, and strategic management capabilities, with extensive experience in leading crossfunctional teams and supporting business growth.' },
  { name: 'Syed Akbar Naqi Zaidi', role: 'Non-Executive Director', img: 'akbar_naqi.png', bio: 'Akbar Naqi is a senior management professional with over 20 years of experience across Brokerage, Corporate Finance, Telecom, and Media. He has worked on transactions exceeding US$300 million at First Capital Group, including mergers, listings, and the first foreign-listed convertible bond by a Pakistani company. He also contributed to Sindh Bank’s acquisition of a full commercial banking license. He previously served as Executive Director at AlHoqani Securities and is currently the CEO of Media Info Systems.' },
  { name: 'Bashir Ahmed Sheikh', role: 'Independent Director', img: 'bashir_ahmad.jpeg', bio: 'A seasoned banking professional with over 56 years of diverse domestic and international experience across Corporate, Commercial and Retail Banking, Investment and Risk Management. He has held senior management positions in leading financial institutions, with extensive expertise in Syndications, Equity Investments, Underwriting, Advisory Services, Mergers & Acquisitions, Privatization, Compliance and Regulatory Affairs. He has also served on the Boards of First Capital Corporation, Dawood Leasing, Japan Power Generation, Al Hamra Hills and Al Hamra Avenue.' },
]

export const management: Person[] = [
  { name: 'Sardar Ali Wattoo', role: 'Chief Executive Officer', img: 'sardar_ali_watto.png', home: true, bio: 'Above 28 years experience. Served top management positions in renowned business houses/groups. Vast experience of finance, equity & debt IPO/listings; Mills finance syndications, M&A, Real Estate, Energy, Telecom, IT, Media, Financial Services, Textiles, Cement, Pipelines, Pharma and Projects development.' },
  { name: 'Kashan Kazmi', role: 'Chief Operating Officer', img: 'kashan_hussan.png', bio: 'Highly focused, results oriented senior level finance and management professional with extensive hands-on diverse experience in Treasury, Financial Accounting, Asset Management, Mills & Procurement Administration and Business leadership. Has over 25 years of experience in various industries' },
  { name: 'Haroon Khalil', role: 'Head of Investment Banking', img: 'haroon_khalil.jpeg', home: true, bio: 'He is a seasoned professional with over 10 years of diverse experience in finance, accounts, and regulatory compliance. His expertise includes corporate restructuring, mergers and acquisitions, and listing of companies on PSX. Haroon is an ACCA and a graduate of OBU, with an MBA from LUMS.' },
  { name: 'Saniya Tauseef', role: 'Head of Research', img: 'sania_touseef.jpeg', home: true, bio: 'She has 12+ years’ experience across PACRA, Digicom and A.F. Ferguson, with research, ratings, audit and credit-risk exposure. Finance and research professional with 12+ years’ experience across auditing, accounting, financial management, credit risk assessment and economic research, including senior research and ratingsroles at PACRA.' },
  { name: 'Muhammad Iqbal Hussain', role: 'Head of Compliance', img: 'iqbal_hussain.png', bio: 'Seasoned professional with a rich diverse experience spanning over 20 years. He is MBA (Finance), PIPFA qualified and having PMR and FCM certifications of IFMP. He also have AML/CFT Training for Directors and Compliance Managers conducted by SECP (IFMP).' },
  { name: 'Muhammad Shahjahan', role: 'Head of Internal Audit', img: 'shahahan.jpeg', bio: 'A Chartered Management Accountant with around seven years of experience in Internal Audit, Financial Reporting and Advisory, with expertise in Risk Management, Internal Controls, Compliance and Financial Analysis. He has contributed to strengthening governance, improving business processes and addressing operational and financial risks.' },
  { name: 'Bilal Hanif', role: 'Chief Financial Officer', img: 'bilal_hanif.png', bio: 'Bilal is a commerce graduate and completed his Article-ship from Nasir Javaid Maqsood Imran Chartered Accountants. He has over 10 years of experience in accounting, audit, financial reporting and taxation.' },
  { name: 'Asif Hussain', role: 'Manager Equities', img: 'asif_hussan.jpeg', bio: 'He is graduate and has PMR, FCM and SBC certifications of IFMP. Highly experience manager with more than 15 years of capital market experience. He has a deep understanding of the stock’s technical analysis and has good communication with the Client’s to execute trades based on their Investment Portfolio Statements.' },
  { name: 'Faisal Khan', role: 'Manager Operations', img: 'faisal_khan.jpeg', bio: 'Faisal is a graduate and has more than 15 years of experience in Operations, IT and settlements. He has obtained AML/CFT Training for Directors and Compliance Managers conducted by SECP (IFMP).' },
  { name: 'Waseem Ul Hassan', role: 'General Manager Accounts', img: 'waseem_ul_hassan.jpeg', bio: 'Waseem is a seasoned finance professional with over 27 years of experience in accounting and finance. He is a graduate and has completed his CA Articles. He has 20 years of experience in the brokerage industry.' },
  { name: 'Sabir Bashir', role: 'AVP Corporate Finance', img: 'sabir_bashir.jpeg', bio: 'Sabir is a Chartered Accountant (Finalist) and completed his Article-ship from Nasir Javaid Maqsood Imran Chartered Accountants. Having more than 4 years of experience in liaising with the Company & Audit Firm to assist in Audit and Assurance, Financial Accounting, Corporate and Finance Management related activities.' },
  { name: 'Waleed Zafar', role: 'Financial Analyst', img: 'waleed-zafar-new-pic.jpeg', bio: 'Waleed, a CFA Level III candidate, holds a BBA from the University of Central Punjab and brings close to two years of experience as a Financial Analyst. He has expertise in financial modelling, valuations, pitchdeck preparation, and comprehensive industry research.' },
  { name: 'Muhammad Adil', role: 'Financial Analyst', img: 'muhammad_adil.jpeg', bio: 'Adil is a member of ICMAP and a CFA Level II candidate, bringing nearly two years of experience as a Financial Analyst in addition to one year in accounting. His background includes detailed financial modelling, industry research, pitch-deck, and valuations.' },
  { name: 'Shahzaib Shafiq', role: 'Research Analyst', img: 'shahzaib_shafiq.jpeg', bio: 'Shahzaib Shafiq is a CA Finalist with over 4 years of professional experience in the fields of audit of financial statements and tax return/advisory services. He has completed his article ship from KPMG Taseer Hadi & Co.' },
]

export const membersDir = M

// ── Associated companies ─────────────────────────────────────────────────────

export const partners = [
  { name: 'PACRA', logoPath: '/IEL Assets/company_2.png', text: "Pakistan's first and leading credit rating agency since 1994, established with Fitch Ratings and IFC. With 8,500+ rating opinions across 55+ sectors and complete independence, PACRA covers 40% of KSE-100 companies." },
  { name: 'TASDEEQ', logoPath: '/IEL Assets/company_3.png', text: "Pakistan's first State Bank licensed credit information bureau. Enabling smarter lending decisions that catalyses credit market growth." },
]

// ── Financial statements kept on the site (STATIC_STATEMENTS) ────────────────
// Kept exactly as on the current site: all seven under the Audited Financials tab,
// including the four LCB documents (decided 27 Nov 2026).

const AUDITED = 'Audited Financials 30 June'
export const staticStatements = [
  { tab: AUDITED, title: 'IEL Audited Financial Statements June 30 2020', path: '/IEL Assets/PDF/Audited Financials 30 June/IEL Audited Financial Statements June 30 2020.pdf' },
  { tab: AUDITED, title: 'IEL Audited Financial Statements June 30 2021', path: '/IEL Assets/PDF/Audited Financials 30 June/IEL Audited Financial Statements June 30 2021.pdf' },
  { tab: AUDITED, title: 'IEL Audited Financial Statements June 30 2022', path: '/IEL Assets/PDF/Audited Financials 30 June/IEL Audited Financial Statements June 30, 2022.pdf' },
  { tab: AUDITED, title: 'LCB thims Aug 2025', path: '/IEL Assets/PDF/LCB/FY 2025/LCB THIMS AUG 25.pdf' },
  { tab: AUDITED, title: 'LCB thims September 2025', path: '/IEL Assets/PDF/LCB/Liquid Capital Balance -September 2025.pdf' },
  { tab: AUDITED, title: 'LCB thims October 2025', path: '/IEL Assets/PDF/LCB/Liquid Capital Balance -October 2025.pdf' },
  { tab: AUDITED, title: 'LCB thims December 2025', path: '/IEL Assets/PDF/LCB/FY 2025/LCB December 2025.pdf' },
]

// ── Corporate reports (Reports.astro) ────────────────────────────────────────

export const corporateReports = [{ title: 'SLGL Corporate Report', path: '/IEL Assets/PDF/SLGL Corporate Report .pdf' }]

// ── Account opening steps (identical on all five service pages) ──────────────

export const accountOpening = {
  accounts: [
    {
      name: 'Sahulat (Easy) Account',
      steps: [
        { title: 'Fill in your basics', text: 'Complete our simple sign-up form with your basic information.' },
        { title: 'Verify with OTP', text: 'Enter the one-time password sent to your registered mobile number.' },
        { title: 'Submit your NIC', text: 'Upload your National Identity Card for quick verification to get started.' },
        { title: 'Receive account info', text: 'Check your registered email for account credentials and next steps.' },
      ],
    },
    {
      name: 'Individual Account',
      steps: [
        { title: 'Fill in your basics', text: 'Complete our simple sign-up form with your basic information.' },
        { title: 'Verify with OTP', text: 'Enter the one-time password sent to your registered mobile number.' },
        { title: 'Submit your details', text: 'Upload your ID and documents to complete verification.' },
        { title: 'Receive account info', text: 'Check your registered email for account credentials and next steps.' },
      ],
    },
    {
      name: 'Corporate Account',
      steps: [
        { title: 'Tell us about your business', text: 'Fill out the form and get a call from a specialist within 30 minutes.' },
        { title: 'Upload your documents', text: 'Get a customised checklist, document gathering support and template assistance (e.g. board resolution).' },
        { title: 'Set up your team', text: 'Set custom trading limits and controls, with a scheduled call for personalised setup.' },
        { title: 'Start trading', text: 'Personalised team training and hands-on support for your first trades.' },
      ],
    },
  ],
  buttonLabel: 'Get started',
  buttonPath: '/open-account',
}
