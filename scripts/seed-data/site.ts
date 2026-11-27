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
    otherPhones: [{ number: '+92 42 3569 2606', href: '+924235692606' }],
    email: 'info@iel.net.pk',
    addresses: [
      { city: 'Lahore', address: '30 Cricketers Colony, 3rd floor, NETSOL Avenue, Ghazi Interchange, Ring Road' },
      { city: 'Karachi', address: 'Room 134, 3rd floor, KSE Building' },
    ],
  },
  // No client login URL exists on the current site yet (to be supplied before launch).
  clientLoginUrl: '',
  bookingUrl: BOOKING_URL,
  // Rating statement and report links from the old homepage, word for word.
  ratings: {
    text: 'Our brokerage is proudly rated BFR 2 & Entity Rating Long Term A- and Short Term A-2 by VIS Credit Rating Company',
    reports: [
      L('View Full Entity Rating', '/IEL Assets/PDF/Rating/ENTITY 2026.pdf', true),
      L('View Full BFR Rating', '/IEL Assets/PDF/Rating/OP_01044604005_00010446.pdf', true),
    ],
  },
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
  // Old footer: "Investor Complaints" links ("PSX Complaint Mgmnt", "SECP Complaint Mgmnt").
  investorComplaints: {
    title: 'Investor complaints',
    links: [
      X('PSX complaint management', 'https://www.psx.com.pk/psx/resources-and-tools/investors/investors-complaints'),
      X('SECP complaint management', 'https://sdms.secp.gov.pk/'),
    ],
  },
  // Old footer notice, word for word.
  vendorNotice: {
    title: 'Smart Stock System — Our Backoffice Software Vendor',
    text: 'At our brokerage, we leverage the Smart Stock System as our trusted backoffice software solution. This system helps ensure efficient trade processing, seamless settlements, and accurate client account management, enabling us to deliver a secure and reliable trading experience for all our customers.',
  },
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
// All 83 hard-coded statements, in the same tabs and order as on iel.net.pk
// (the 61 LCB reports under LCB, decided 27 Nov 2026). Statements published through
// the IEL app admin panel come from Supabase and are merged in at render time.

const PDF = '/IEL Assets/PDF/'
const AUDITED = 'Audited Financials 30 June'
const HALF_YEAR = 'Half Yearly 31 Dec'
const Q_SEPT = 'Quarter Ended 30 Sept'
const Q_MARCH = 'Quarter Ended 31 March'
const LCB = 'LCB'
export const staticStatements = [
  // Audited Financials 30 June
  { tab: AUDITED, title: 'IEL Audited Financial Statements June 30 2020', path: PDF + 'Audited Financials 30 June/IEL Audited Financial Statements June 30 2020.pdf' },
  { tab: AUDITED, title: 'IEL Audited Financial Statements June 30 2021', path: PDF + 'Audited Financials 30 June/IEL Audited Financial Statements June 30 2021.pdf' },
  { tab: AUDITED, title: 'IEL Audited Financial Statements June 30 2022', path: PDF + 'Audited Financials 30 June/IEL Audited Financial Statements June 30, 2022.pdf' },
  { tab: AUDITED, title: 'IEL Audited Financial Statements June 30 2023', path: PDF + 'Audited Financials 30 June/IEL Audited Financial Statements June 30, 2023.pdf' },
  { tab: AUDITED, title: 'IEL Audited Financial Statements June 30 2024', path: PDF + 'Audited Financials 30 June/IEL Audited Financial Statements June 30, 2024.pdf' },
  { tab: AUDITED, title: 'IEL Audited Financial Statements June 30 2025', path: PDF + 'Audited Financials 30 June/IEL Audited Financial Statements June 30 2025.pdf' },
  // Half Yearly 31 Dec
  { tab: HALF_YEAR, title: 'Half Yearly 31 December 2020', path: PDF + 'Half Yearly 31 Dec/Half Yearly 31 December 2020.pdf' },
  { tab: HALF_YEAR, title: 'Half Yearly 31 December 2021', path: PDF + 'Half Yearly 31 Dec/Half Yearly 31 December 2021.pdf' },
  { tab: HALF_YEAR, title: 'Half Yearly 31 December 2022', path: PDF + 'Half Yearly 31 Dec/Half Yearly 31 December 2022.pdf' },
  { tab: HALF_YEAR, title: 'Half Yearly 31 December 2023', path: PDF + 'Half Yearly 31 Dec/Half Yearly 31 December 2023.pdf' },
  { tab: HALF_YEAR, title: 'Half Yearly 31 December 2024', path: PDF + 'Half Yearly 31 Dec/Half Yearly 31 December 2024.pdf' },
  // Quarter Ended 30 Sept
  { tab: Q_SEPT, title: 'FS IEL Period Ended Sept 30, 2020', path: PDF + 'Quarter Ended 30 September/FS IEL Period Ended  Sept 30, 2020.pdf' },
  { tab: Q_SEPT, title: 'FS IEL Period Ended Sept 30, 2021', path: PDF + 'Quarter Ended 30 September/FS IEL Period Ended  Sept 30, 2021.pdf' },
  { tab: Q_SEPT, title: 'FS IEL Period Ended Sept 30, 2022', path: PDF + 'Quarter Ended 30 September/FS IEL Period Ended  Sept 30, 2022.pdf' },
  { tab: Q_SEPT, title: 'FS IEL Period Ended Sept 30, 2023', path: PDF + 'Quarter Ended 30 September/FS IEL Period Ended  Sept 30, 2023.pdf' },
  { tab: Q_SEPT, title: 'FS IEL Period Ended Sept 30, 2024', path: PDF + 'Quarter Ended 30 September/FS IEL Period Ended  Sept 30, 2024.pdf' },
  { tab: Q_SEPT, title: 'FS IEL Period Ended Sept 30, 2025', path: PDF + 'Quarter Ended 30 September/Financial statement  - Sep end 25-merged.pdf' },
  // Quarter Ended 31 March
  { tab: Q_MARCH, title: 'FS IEL Period Ended Mar 31, 2021', path: PDF + 'Quarter Ended 31 March/FS IEL Period Ended  Mar31, 2021.pdf' },
  { tab: Q_MARCH, title: 'FS IEL Period Ended Mar 31, 2022', path: PDF + 'Quarter Ended 31 March/FS IEL Period Ended  Mar31, 2022.pdf' },
  { tab: Q_MARCH, title: 'FS IEL Period Ended Mar 31, 2023', path: PDF + 'Quarter Ended 31 March/FS IEL Period Ended  Mar 31, 2023.pdf' },
  { tab: Q_MARCH, title: 'FS IEL Period Ended Mar 31, 2024', path: PDF + 'Quarter Ended 31 March/FS IEL Period Ended  Mar31, 2024.pdf' },
  { tab: Q_MARCH, title: 'FS IEL Period Ended Mar 31, 2025', path: PDF + 'Quarter Ended 31 March/March 2025 - Upload Version.pdf' },
  // LCB
  { tab: LCB, title: 'LCB July 2020', path: PDF + 'LCB/FY 2021/1-LCB July 2020.pdf' },
  { tab: LCB, title: 'LCB Aug 2020', path: PDF + 'LCB/FY 2021/2-LCB Aug 2020.pdf' },
  { tab: LCB, title: 'September 2020', path: PDF + 'LCB/FY 2021/3. September  2020.pdf' },
  { tab: LCB, title: 'LCB October 2020', path: PDF + 'LCB/FY 2021/4. October 2020.pdf' },
  { tab: LCB, title: 'LCB November 2020', path: PDF + 'LCB/FY 2021/5. November  2020.pdf' },
  { tab: LCB, title: 'LCB December 2020', path: PDF + 'LCB/FY 2021/6. December 2020.pdf' },
  { tab: LCB, title: 'LCB January 2021', path: PDF + 'LCB/FY 2021/7. January 2021.pdf' },
  { tab: LCB, title: 'LCB Feb 2021', path: PDF + 'LCB/FY 2021/8. LCB Feb 2021.pdf' },
  { tab: LCB, title: 'LCB May 2021', path: PDF + 'LCB/FY 2021/11. LCB May 2021.pdf' },
  { tab: LCB, title: 'LCB June 2021', path: PDF + 'LCB/FY 2021/12. LCB June 2021.pdf' },
  { tab: LCB, title: 'LCB July 2021', path: PDF + 'LCB/FY 2022/1.LCB July 2021.pdf' },
  { tab: LCB, title: 'LCB Aug 2021', path: PDF + 'LCB/FY 2022/2.LCB Aug 2021.pdf' },
  { tab: LCB, title: 'September 2021', path: PDF + 'LCB/FY 2022/3.LCB Sept 2021.pdf' },
  { tab: LCB, title: 'LCB October 2021', path: PDF + 'LCB/FY 2022/4.LCB Oct 2021.pdf' },
  { tab: LCB, title: 'LCB November 2021', path: PDF + 'LCB/FY 2022/5. LCB Nov 2021.pdf' },
  { tab: LCB, title: 'LCB December 2021', path: PDF + 'LCB/FY 2022/6.LCB December 2021.pdf' },
  { tab: LCB, title: 'LCB January 2022', path: PDF + 'LCB/FY 2022/7. LCB Jan 2022.pdf' },
  { tab: LCB, title: 'LCB Feb 2022', path: PDF + 'LCB/FY 2022/8.LCB Feb 2022.pdf' },
  { tab: LCB, title: 'LCB March 2022', path: PDF + 'LCB/FY 2022/9.LCB March 2022.pdf' },
  { tab: LCB, title: 'LCB June 2022', path: PDF + 'LCB/FY 2022/12. LCB Jun 2022.pdf' },
  { tab: LCB, title: 'LCB July 2022', path: PDF + 'LCB/FY 2023/1.LCB July 2022.pdf' },
  { tab: LCB, title: 'LCB Aug 2022', path: PDF + 'LCB/FY 2023/2.LCB Aug 2022.pdf' },
  { tab: LCB, title: 'September 2022', path: PDF + 'LCB/FY 2023/3.LCB Sept 2022.pdf' },
  { tab: LCB, title: 'LCB October 2022', path: PDF + 'LCB/FY 2023/4. LCB Oct 2022.pdf' },
  { tab: LCB, title: 'LCB November 2022', path: PDF + 'LCB/FY 2023/5.LCB Nov 2022.pdf' },
  { tab: LCB, title: 'LCB December 2022', path: PDF + 'LCB/FY 2023/6.LCB Dec 2022.pdf' },
  { tab: LCB, title: 'LCB January 2023', path: PDF + 'LCB/FY 2023/7.LCB Jan 2023.pdf' },
  { tab: LCB, title: 'LCB Feb 2023', path: PDF + 'LCB/FY 2023/8.LCB Feb 2023.pdf' },
  { tab: LCB, title: 'LCB March 2023', path: PDF + 'LCB/FY 2023/9.LCB MARCH 2023.pdf' },
  { tab: LCB, title: 'LCB Apr 2023', path: PDF + 'LCB/FY 2023/10.LCB Apr 2023.pdf' },
  { tab: LCB, title: 'LCB May 2023', path: PDF + 'LCB/FY 2023/11.LCB May 2023.pdf' },
  { tab: LCB, title: 'LCB June 2023', path: PDF + 'LCB/FY 2023/12.LCB June 2023.pdf' },
  { tab: LCB, title: 'LCB July 2023', path: PDF + 'LCB/FY 2024/1. LCB July 2023.pdf' },
  { tab: LCB, title: 'LCB Aug 2023', path: PDF + 'LCB/FY 2024/2. LCB Aug 2023.pdf' },
  { tab: LCB, title: 'September 2023', path: PDF + 'LCB/FY 2024/3. LCB Sept 2023.pdf' },
  { tab: LCB, title: 'LCB October 2023', path: PDF + 'LCB/FY 2024/4. LCB OCT 2023.pdf' },
  { tab: LCB, title: 'LCB November 2023', path: PDF + 'LCB/FY 2024/5. LCB NOV 2023.pdf' },
  { tab: LCB, title: 'LCB December 2023', path: PDF + 'LCB/FY 2024/6. LCB Dec 2023.pdf' },
  { tab: LCB, title: 'LCB January 2024', path: PDF + 'LCB/FY 2024/7. LCB  JAN 2024.pdf' },
  { tab: LCB, title: 'LCB Feb 2024', path: PDF + 'LCB/FY 2024/8. LCB FEB 2024.pdf' },
  { tab: LCB, title: 'LCB March 2024', path: PDF + 'LCB/FY 2024/9. LCB THIMS MAR 2024.pdf' },
  { tab: LCB, title: 'LCB Apr 2024', path: PDF + 'LCB/FY 2024/10.LCB THIMS APR 2024.pdf' },
  { tab: LCB, title: 'LCB May 2024', path: PDF + 'LCB/FY 2024/11.LCB THIMS MAY 2024.pdf' },
  { tab: LCB, title: 'LCB June 2024', path: PDF + 'LCB/FY 2024/12. LCB THIMS JUNE 2024.pdf' },
  { tab: LCB, title: 'LCB thims July 2024', path: PDF + 'LCB/FY 2025/1.LCB THIMS JULY 2024.pdf' },
  { tab: LCB, title: 'LCB thims Aug 2024', path: PDF + 'LCB/FY 2025/2. LCB THIMS AUG 2024.pdf' },
  { tab: LCB, title: 'LCB thims September 2024', path: PDF + 'LCB/FY 2025/3.LCB THIMS SEP 2024.pdf' },
  { tab: LCB, title: 'LCB thims October 2024', path: PDF + 'LCB/FY 2025/4.LCB THIMS OCT 2024.pdf' },
  { tab: LCB, title: 'LCB thims November 2024', path: PDF + 'LCB/FY 2025/5.LCB THIMS NOV 2024.pdf' },
  { tab: LCB, title: 'LCB thims December 2024', path: PDF + 'LCB/FY 2025/6.LCB THIMS DEC 2024.pdf' },
  { tab: LCB, title: 'LCB thims January 2025', path: PDF + 'LCB/FY 2025/7. LCB THIMS January 2025.pdf' },
  { tab: LCB, title: 'LCB thims Feb 2025', path: PDF + 'LCB/FY 2025/8. LCB THIMS February 2025.pdf' },
  { tab: LCB, title: 'LCB thims March 2025', path: PDF + 'LCB/FY 2025/9.LCB THIMS MARCH 25.pdf' },
  { tab: LCB, title: 'LCB thims Apr 2025', path: PDF + 'LCB/FY 2025/10.LCB THIMS APRIL 25.pdf' },
  { tab: LCB, title: 'LCB thims May 2025', path: PDF + 'LCB/FY 2025/11.LCB THIMS MAY 25.pdf' },
  { tab: LCB, title: 'LCB thims June 2025', path: PDF + 'LCB/FY 2025/12. LCB THIMS JUNE 25.pdf' },
  { tab: LCB, title: 'LCB thims July 2025', path: PDF + 'LCB/FY 2025/LCB THIMS JULY 25.pdf' },
  { tab: LCB, title: 'LCB thims Aug 2025', path: PDF + 'LCB/FY 2025/LCB THIMS AUG 25.pdf' },
  { tab: LCB, title: 'LCB thims September 2025', path: PDF + 'LCB/Liquid Capital Balance -September 2025.pdf' },
  { tab: LCB, title: 'LCB thims October 2025', path: PDF + 'LCB/Liquid Capital Balance -October 2025.pdf' },
  { tab: LCB, title: 'LCB thims December 2025', path: PDF + 'LCB/FY 2025/LCB December 2025.pdf' },
]

// ── Corporate reports (Reports.astro) ────────────────────────────────────────

export const corporateReports = [{ title: 'SLGL Corporate Report', path: '/IEL Assets/PDF/SLGL Corporate Report .pdf' }]

// ── Account opening steps (identical on all five service pages) ──────────────

// ── Homepage pop-ups (old index.html #dualPopupContainer, text word for word) ───
// `bodyHtml` is converted to rich text by the seed. The old fraud notice's internal
// heading "WEBSITE POPUP — FRAUD AWARENESS NOTICE" is left out; "IMPORTANT NOTICE"
// becomes the eyebrow.

export const popups = {
  enabled: true,
  dontShowAgainLabel: 'Don’t show this again',
  notices: [
    {
      title: 'Shareholder Agahi – Your Gateway to Shareholder Insights',
      bodyHtml:
        '<p>Pakistan’s first comprehensive platform, developed by <strong>PICG</strong> and <strong>CDC</strong>, dedicated to enhancing shareholder awareness and empowerment.</p>' +
        '<p>Discover real-time updates, rights, and governance insights. Empower yourself with accurate information.</p>',
      links: [X('Explore the Portal', 'https://www.shareholderagahi.com/'), X('Watch Tutorial (Urdu)', 'https://www.youtube.com/watch?v=O7iCRiKJ37A')],
      images: [
        { path: '/IEL Assets/pop_up_img1.jpg', alt: 'Shareholder Agahi' },
        { path: '/IEL Assets/pop-up-img2.png', alt: 'Pakistan Institute of Corporate Governance (PICG)' },
        { path: '/IEL Assets/pop-up-img3.jpg', alt: 'Central Depository Company (CDC)' },
      ],
    },
    {
      eyebrow: 'Important notice',
      title: 'Beware of Fraudulent Schemes',
      bodyHtml: [
        '<h4>Misusing the Name of IEL</h4>',
        '<p>Fraudulent individuals and entities are increasingly misusing the identity of licensed Securities Brokers through fake profiles, apps, unauthorized WhatsApp numbers, and misleading social media pages to deceive investors.</p>',
        '<h3>What to watch out for</h3>',
        '<ul>',
        '<li><strong>Fake WhatsApp Numbers &amp; Apps:</strong> Unauthorized mobile apps and WhatsApp numbers impersonating licensed brokers.</li>',
        '<li><strong>Fake Social Media Profiles:</strong> Profiles falsely impersonating directors or executives of brokerage houses.</li>',
        '<li><strong>Requests for OTPs &amp; Funds:</strong> Demands for OTPs, personal information, or money through unofficial channels.</li>',
        '<li><strong>Misleading Pages &amp; Links:</strong> Fake pages with no official affiliation to any PSX-licensed brokerage firm.</li>',
        '</ul>',
        '<h3>Please note</h3>',
        '<ul>',
        '<li>IEL has NO affiliation with any unofficial pages, profiles, apps, or WhatsApp numbers.</li>',
        '<li>We NEVER request OTPs, personal information, funds, or investments through unofficial platforms.</li>',
        '<li>All communication is conducted ONLY through our official phone numbers, website, email, and verified social media handles.</li>',
        '</ul>',
        '<h3>How to stay protected</h3>',
        '<ul>',
        '<li>Always verify the authenticity of any communication before engaging.</li>',
        '<li>Confirm licensed entities through the SECP and PSX official websites before transacting.</li>',
        '<li>Transact ONLY through official banking channels linked to licensed brokers.</li>',
        '<li>Regularly visit SECP, PSX, CDC, and NCCPL websites for authentic updates and public alerts.</li>',
        '<li>When in doubt, contact our official representatives directly before taking any action.</li>',
        '</ul>',
        '<h3>Official channels</h3>',
        '<ul>',
        '<li><strong>Website:</strong> www.iel.net.pk</li>',
        '<li><strong>Email:</strong> info@iel.net.pk</li>',
        '<li><strong>Helpline:</strong> 0345 0091263</li>',
        '</ul>',
      ].join(''),
      closeLabel: 'I Understand – Proceed to Website',
    },
  ],
}

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
