/**
 * Seed content for the Open Account, Contact and Learn pages, extracted from the
 * revamp-homepage Astro pages (OpenAccount.astro, Contact.astro, Resources.astro).
 * Text is word for word.
 */
import type { SeedPage } from './pages'

export const CDC_PORTAL_URL = 'https://cgp.cdcaccess.com.pk/cdc/cgp/r/centralized-gateway-portal/login?intermediary=N3NMZGYHUKU46'

/** FAQs per account type (added to the shared account-opening global). */
export const accountFaqs: Record<string, { question: string; answer: string }[]> = {
  'Sahulat (Easy) Account': [
    {
      question: 'What makes the Sahulat Account different?',
      answer:
        "It's designed for simplicity. Perfect for new investors or those who want essential trading features without complexity. You get everything you need to start building wealth—just streamlined and straightforward.",
    },
    {
      question: "What's the investment limit?",
      answer:
        "Your Sahulat Account comes with a reasonable investment limit that's perfect for getting started and building your portfolio gradually. As you grow, you can easily upgrade to our Individual Account for unlimited access.",
    },
    {
      question: 'Do I need extensive documentation?',
      answer: "Nope. Just your NIC and basic details. We've stripped away the paperwork so you can start investing faster.",
    },
    {
      question: 'Can I upgrade later?',
      answer:
        "Absolutely. Your Sahulat Account is your stepping stone. When you're ready for more advanced features and higher limits, upgrading to an Individual Account is just a few clicks away.",
    },
    {
      question: 'Is this really free?',
      answer:
        "Yes, it's actually free. No hidden charges, no surprise fees when you sign up. You open it, start investing, and only pay standard trading fees after your first 30 days—exactly as it should be.",
    },
  ],
  'Individual Account': [
    {
      question: 'What exactly is a "free" account?',
      answer:
        'It\'s actually free. No hidden charges, no "gotcha" moments when you sign up. You open it, start investing, and only pay when you make trades—just like it should be.',
    },
  ],
  'Corporate Account': [
    {
      question: 'What makes a corporate account different?',
      answer:
        'Think of it as your business getting VIP treatment. You get multiple team members trading, higher limits, bulk transaction tools, and detailed reporting. Everything your business needs to invest professionally.',
    },
    {
      question: 'How much money do we need to start?',
      answer:
        "Whatever makes sense for your business. We've seen companies start with 500K and others with 50 million. The account grows with you, so start where you're comfortable.",
    },
    {
      question: 'Who can access and trade on the account?',
      answer:
        'You decide. Set up your team with different permission levels—some can view only, others can trade up to certain limits. You stay in control of who does what.',
    },
    {
      question: 'What documents do we actually need?',
      answer:
        "The usual business stuff: company registration, tax papers, a board resolution saying you can trade stocks, and ID copies of whoever will be trading. Here's the best part: we'll send you a personalized checklist, help you gather everything, and if you're missing something like a board resolution, we'll draft the template for you. Zero stress.",
    },
    {
      question: 'How long does this whole process take?',
      answer:
        "Usually 2-3 business days once we have your documents. We need the extra time to verify everything properly with PSX and SECP. Your dedicated account manager texts you daily updates and handles any issues before they become problems. No surprises, no waiting around wondering what's happening.",
    },
    {
      question: 'What are the trading costs after the free month?',
      answer:
        "Simple and transparent: 0.03% or Rs 0.15 per trade (whichever is higher) whether you're day trading or buying to hold. Rollover fees are just Rs 0.01-0.02. We handle all the regulatory stuff (taxes, CDC charges) at actual cost—no markup.",
    },
    {
      question: 'Are there hidden fees we should worry about?',
      answer:
        'Nope. Just the standard regulatory charges that every broker has to collect—provincial sales tax, capital value tax, and maintenance fees. We pass these through at actual cost and keep you informed about everything.',
    },
    {
      question: 'Can we set spending limits and controls?',
      answer:
        'Absolutely. Set daily trading limits, require approvals for big transactions, create whatever controls fit your risk management. Your business, your rules.',
    },
    {
      question: 'What if something goes wrong or we need help?',
      answer:
        'You get a dedicated account manager who knows your business and actually picks up the phone. No phone trees, no ticket systems, no "please hold." Just direct access to someone who can solve problems in real-time. We even give you their WhatsApp number for quick questions. That\'s how confident we are in our service.',
    },
    {
      question: 'Is our money and data safe?',
      answer:
        "Your funds stay in your own bank account—we never touch them. We're fully licensed by PSX and regulated by SECP. Your business information gets the same protection as major corporations.",
    },
    {
      question: 'Ready to give your business the investment tools it deserves?',
      answer:
        "Opening a corporate account is faster than your next team meeting, and we'll literally hold your hand through everything. No corporate bureaucracy, just results.",
    },
  ],
}

export const extraPages: SeedPage[] = [
  {
    title: 'Open Account',
    slug: 'open-account',
    hero: {
      eyebrow: 'Open an account',
      title: 'Ready to make your money work smarter?',
      intro:
        "From your first investment to your retirement plan, we've got strategies that fit your life. Open a free brokerage account with IEL in minutes.",
      buttons: [
        { label: 'Compare account types', type: 'path', path: '#account-types', newTab: false, style: 'secondary' },
        { label: 'Self registration (Assan Connect)', type: 'url', url: CDC_PORTAL_URL, newTab: true, style: 'secondary' },
      ],
      aside: {
        form: 'openAccount',
        title: 'Open a free account',
        text: 'Leave your name and mobile number and our team will get in touch.',
        linkLabel: 'See account types',
        linkPath: '#account-types',
        secondLinkLabel: 'Self Registration Assan Connect (CDC portal)',
        secondLinkPath: CDC_PORTAL_URL,
      },
    },
    seo: {
      title: 'Open Account',
      description:
        'Open a free brokerage account with IEL in minutes. Choose from Sahulat, Individual, or Corporate accounts with low, transparent trading fees.',
    },
    layout: [
      {
        blockType: 'cardGrid',
        eyebrow: 'Pricing',
        title: 'Start investing without the wait—or any fees.',
        intro: 'Low, transparent trading costs. Taxes and regulatory charges are passed through at actual cost.',
        background: 'white',
        numbered: true,
        cards: [
          {
            value: '0.03 Paisas',
            title: 'brokerage for shares under PKR 10',
            text: 'Ultra-low flat-rate trading costs so your profits stay yours.',
          },
          {
            value: '0.05 Paisas',
            title: 'brokerage for shares between PKR 10–30',
            text: 'Still among the lowest in the market — designed for active traders.',
          },
          {
            value: '0.15%',
            title: 'brokerage for shares above PKR 30',
            text: 'Transparent, minimal fees that keep more money in your portfolio.',
          },
          {
            value: 'PKR 0.01',
            title: 'daily rollover for shares up to PKR 75',
            text: 'Hold positions overnight without breaking the bank.',
          },
          {
            value: 'PKR 0.05',
            title: 'maximum daily rollover, even for premium shares',
            text: 'No hidden charges. No surprises. Just honest costs that let your investments grow.',
          },
        ],
      },
      {
        blockType: 'accountOpening',
        anchor: 'account-types',
        eyebrow: 'How it works',
        title: 'Open your account in minutes',
        intro: 'Experience fast, secure, and seamless onboarding.',
        style: 'tabs',
        showButton: false,
      },
    ],
  },
  {
    title: 'Contact',
    slug: 'contact',
    showContactBand: false,
    hero: {
      eyebrow: 'Contact',
      title: 'Let’s talk about your next smart move',
      intro: 'Whether you’ve got questions, need guidance, or just want to explore what IEL can do for you — we’re here for it.',
    },
    seo: {
      title: 'Contact',
      description: 'Get in touch with Integrated Equities Limited (IEL) for any inquiries or assistance you may need.',
    },
    layout: [
      {
        blockType: 'contactForm',
        eyebrow: 'Get in touch',
        title: 'Reach out to us',
        intro: 'Have questions or feedback? We are here to help you.',
        details: [
          {
            label: 'Email',
            value: 'support@iel.net.pk',
            href: 'mailto:support@iel.net.pk',
          },
          {
            label: 'Phone number',
            value: '+92-42-35741714-15',
            href: 'tel:+924235741714',
          },
          {
            label: 'Hours',
            value: 'Monday–Friday, 9:00 AM – 6:00 PM (PST)',
          },
        ],
        complaints: {
          title: 'Lodge a complaint',
          text: 'For any complaint please email us at',
          email: 'compliance@iel.net.pk',
          personLabel: 'Contact person for complaints',
          personName: 'Mr. Muhammad Iqbal Hussian',
          personRole: 'VP / Chief Compliance Officer',
          phone: '+92 345 0091263',
          phoneHref: '+923450091263',
        },
        formTitle: 'Send us a message',
        formIntro: 'All fields are required.',
      },
      {
        blockType: 'offices',
        eyebrow: 'Locations',
        title: 'Our offices',
        offices: [
          {
            name: 'Lahore office',
            address: '30 Cricketers Colony, 3rd floor, NETSOL Avenue, Ghazi Interchange, Ring Road',
            mapUrl:
              'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2803.931832327946!2d74.42374977463443!3d31.4986965482142!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39190f4702f9cafb%3A0x8f1d31d128a3ab40!2sGhazi%20Interchange%20Park!5e1!3m2!1sen!2s!4v1751026646944!5m2!1sen!2s',
          },
          {
            name: 'Karachi office',
            address: 'Room 134, 3rd floor, KSE Building',
            mapUrl:
              'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2984.0653418464963!2d66.9982154!3d24.8475401!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3eb315af10b7321f%3A0xa85bfcf37fa6cd63!2sPakistan%20Stock%20Exchange!5e1!3m2!1sen!2s!4v1751034210545!5m2!1sen!2s',
          },
        ],
      },
    ],
  },
  {
    title: 'Resources',
    slug: 'learn',
    hero: {
      eyebrow: 'Resources',
      title: 'Resources',
      intro: 'Your investment toolkit, simplified. From account forms to market articles, find what you need when you need it.',
    },
    seo: {
      title: 'Resources',
      description: 'Account opening forms, commission schedule and investor articles from Integrated Equities Limited (IEL).',
    },
    layout: [
      {
        blockType: 'fileList',
        anchor: 'related_forms',
        eyebrow: 'Downloads',
        title: 'Related forms',
        intro: 'Forms for opening and maintaining an account with IEL, as PDF.',
        style: 'cards',
        files: [
          {
            label: 'Corporate New',
            text: 'Account opening form for companies and other corporate clients.',
            path: '/IEL Assets/PDF/Corporate_new.pdf',
          },
          {
            label: 'Individual New',
            text: 'Account opening form for individual investors.',
            path: '/IEL Assets/PDF/Individual_new.pdf',
          },
          {
            label: 'Commission Slab',
            text: 'IEL brokerage commission schedule.',
            path: '/IEL Assets/PDF/IEL_Commission_Schedule.pdf',
          },
          {
            label: '10 FATCA',
            text: 'FATCA self-certification form.',
            path: '/IEL Assets/PDF/10_FATCA.pdf',
          },
          {
            label: 'CRS Form',
            text: 'Common Reporting Standard self-certification form.',
            path: '/IEL Assets/PDF/CRS_Form.pdf',
          },
          {
            label: 'For US Citizen',
            text: 'Additional form for US citizens and US persons.',
            path: '/IEL Assets/PDF/For_US_Citizen.pdf',
          },
        ],
      },
      { blockType: 'articles', eyebrow: 'Articles', title: 'Our latest articles' },
    ],
  },
]
