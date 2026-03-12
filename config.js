// MAD HAT COMMUNICATIONS - WEBSITE CONFIGURATION
// Edit this file to update website content and tracking codes

const CONFIG = {
  // ============================================
  // TRACKING & ANALYTICS
  // ============================================
  tracking: {
    // Google Analytics 4
    googleAnalytics: {
      enabled: true,
      measurementId: 'G-58883HVDTC'
    },

    // Facebook Pixel
    facebookPixel: {
      enabled: false,
      pixelId: '1234567890' // Replace with your Facebook Pixel ID
    },

    // Google Tag Manager (Alternative to GA)
    googleTagManager: {
      enabled: false,
      containerId: 'GTM-XXXXXXX' // Replace with your GTM ID
    },

    // LinkedIn Insight Tag
    linkedinInsight: {
      enabled: false,
      partnerId: '12345' // Replace with your LinkedIn Partner ID
    },

    // Hotjar
    hotjar: {
      enabled: false,
      siteId: '12345' // Replace with your Hotjar Site ID
    }
  },

  // ============================================
  // COMPANY INFORMATION
  // ============================================
  company: {
    name: 'Mad Hat Communications',
    tagline: 'Performance-Driven Growth Marketing',
    description: 'From market expansion to conversion optimization, we deliver measurable results through strategic digital marketing, content production, and performance analytics.',
    email: 'amit@madhatcomm.in',
    phone: '+91 95350 15025',
    address: 'Your Address Here'
  },

  // ============================================
  // HERO SECTION
  // ============================================
  hero: {
    headline: 'Performance-Driven Growth Marketing',
    subtitle: 'From market expansion to conversion optimization, we deliver measurable results through strategic digital marketing, content production, and performance analytics.',
    ctaText: 'Analyze Your Website',
    ctaLink: '#analyzer'
  },

  // ============================================
  // STATISTICS
  // ============================================
  stats: [
    { number: '750+', label: 'Customers Acquired' },
    { number: '4.2x', label: 'Average ROAS Improvement' },
    { number: '64%', label: 'Average CAC Reduction' },
    { number: '7+', label: 'Markets Launched' }
  ],

  // ============================================
  // CASE STUDIES
  // ============================================
  caseStudies: [
    {
      name: 'Alankari',
      title: 'Alankari.com',
      description: 'Reduced customer acquisition costs for India\'s leading handloom saree brand through strategic conversion rate optimization and targeted performance marketing campaigns.',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      metrics: [
        { value: '64%', label: 'CAC Reduction' },
        { value: '4.2x', label: 'ROAS Increase' },
        { value: '127%', label: 'Conversion Rate' }
      ]
    },
    {
      name: 'DronaHQ',
      title: 'DronaHQ - Africa & Middle East Expansion',
      description: 'Spearheaded market entry strategy for low-code B2B SaaS platform, scaling from zero to 750+ customers across Africa and Middle East through localized demand generation and strategic partnerships.',
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      metrics: [
        { value: '750+', label: 'New Customers' },
        { value: '0→7', label: 'Markets Opened' },
        { value: '2 Yrs', label: 'Market Launch' }
      ]
    },
    {
      name: 'Q-SYS',
      title: 'QSC/Q-SYS - Exclusive Agency Partnership',
      description: 'Multi-year exclusive partnership covering India market launch, headquarters opening, 3 InfoComm events, PlayOutLoud podcast production, music videos, and testimonial content creation.',
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      metrics: [
        { value: '5+', label: 'Years Partnership' },
        { value: '50+', label: 'Content Pieces' },
        { value: '3', label: 'Major Events' }
      ]
    }
  ],

  // ============================================
  // SERVICES
  // ============================================
  services: [
    'Market Expansion Strategy',
    'Conversion Rate Optimization',
    'Performance Marketing',
    'Content Production & Events'
  ],

  // ============================================
  // FOOTER LINKS
  // ============================================
  footer: {
    company: [
      { text: 'About Us', link: '#' },
      { text: 'Case Studies', link: '#work' },
      { text: 'Blog', link: '#' },
      { text: 'Careers', link: '#' }
    ],
    social: {
      linkedin: 'https://www.linkedin.com/company/madhatcommunications/',
      twitter: 'https://twitter.com/madhat',
      facebook: 'https://www.facebook.com/MadHatComm'
    }
  },

  // ============================================
  // ANALYZER SETTINGS
  // ============================================
  analyzer: {
    title: 'Website Performance Analyzer',
    subtitle: 'Get instant insights into your website\'s speed, optimization, and user experience',
    placeholder: 'Enter website (e.g., madhatcomm.in or example.com)'
  }
};

// Export for use in HTML
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CONFIG;
}
