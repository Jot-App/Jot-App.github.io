# Mad Hat Communications Website

## 📁 File Structure

```
madhat-website/
├── index.html          # Main HTML file
├── config.js           # 🔧 EDIT THIS FILE to change content & tracking
├── app.js              # JavaScript logic (no need to edit)
├── styles.css          # Stylesheet (no need to edit)
└── README.md           # This file
```

## 🚀 Quick Start

1. **Edit `config.js`** to customize your website content
2. Upload all 4 files to your web hosting
3. Done! Your website is live

## ✏️ How to Edit Content

### Open `config.js` and edit these sections:

### 1. **Tracking Codes** (Lines 8-36)

```javascript
tracking: {
  googleAnalytics: {
    enabled: true,
    measurementId: 'G-XXXXXXXXXX' // ← Replace with your GA4 ID
  },
  facebookPixel: {
    enabled: true,
    pixelId: '1234567890' // ← Replace with your Pixel ID
  }
}
```

**How to get your IDs:**
- **Google Analytics**: Go to Admin → Data Streams → Copy Measurement ID
- **Facebook Pixel**: Business Manager → Events Manager → Copy Pixel ID
- Set `enabled: false` to disable any tracker

### 2. **Company Information** (Lines 38-45)

```javascript
company: {
  name: 'Mad Hat Communications',      // ← Your company name
  email: 'hello@madhat.com',           // ← Your email
  phone: '+1 (234) 567-890',           // ← Your phone
  address: 'Your Address Here'         // ← Your address
}
```

### 3. **Hero Section** (Lines 47-54)

```javascript
hero: {
  headline: 'Performance-Driven Growth Marketing',  // ← Main headline
  subtitle: 'From market expansion...',             // ← Subtitle text
  ctaText: 'Analyze Your Website',                 // ← Button text
  ctaLink: '#analyzer'                             // ← Button link
}
```

### 4. **Statistics** (Lines 56-63)

```javascript
stats: [
  { number: '750+', label: 'Customers Acquired' },  // ← Edit these
  { number: '4.2x', label: 'Average ROAS Improvement' },
  // Add more stats or remove as needed
]
```

### 5. **Case Studies** (Lines 65-110)

```javascript
caseStudies: [
  {
    name: 'Alankari',                    // ← Client name (short)
    title: 'Alankari.com',               // ← Full title
    description: 'Reduced customer...',  // ← Description
    gradient: 'linear-gradient(...)',    // ← Background color
    metrics: [
      { value: '64%', label: 'CAC Reduction' },  // ← Results
      // Add 3 metrics per case study
    ]
  },
  // Add more case studies by copying this block
]
```

**Color Gradients** (copy these or create your own):
```javascript
'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'  // Purple
'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'  // Pink
'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'  // Blue
'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'  // Green
'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'  // Orange
```

### 6. **Services** (Lines 112-119)

```javascript
services: [
  'Market Expansion Strategy',           // ← Your services
  'Conversion Rate Optimization',
  // Add or remove services
]
```

## 🎯 Adding Google Analytics

1. Go to [analytics.google.com](https://analytics.google.com)
2. Create a GA4 property
3. Copy the **Measurement ID** (starts with G-)
4. Edit `config.js`:

```javascript
googleAnalytics: {
  enabled: true,
  measurementId: 'G-ABC123XYZ' // ← Paste your ID here
}
```

## 📱 Adding Facebook Pixel

1. Go to [business.facebook.com](https://business.facebook.com)
2. Events Manager → Pixels → Copy Pixel ID
3. Edit `config.js`:

```javascript
facebookPixel: {
  enabled: true,
  pixelId: '1234567890123456' // ← Paste your ID here
}
```

## 🔧 Adding More Tracking Tools

The config supports:
- ✅ Google Analytics 4
- ✅ Facebook Pixel
- ✅ Google Tag Manager
- ✅ LinkedIn Insight Tag
- ✅ Hotjar

Just set `enabled: true` and add your IDs!

## 🌐 Hosting Your Website

### Option 1: Netlify (Easiest - FREE)
1. Go to [netlify.com](https://netlify.com)
2. Drag & drop all 4 files
3. Done! Your site is live

### Option 2: GitHub Pages (FREE)
1. Create a GitHub repository
2. Upload all files
3. Settings → Pages → Enable
4. Your site will be at `username.github.io/repo-name`

### Option 3: Your Own Hosting
Upload all 4 files to your hosting via:
- FTP (FileZilla, Cyberduck)
- cPanel File Manager
- SSH

## 🎨 Customization Tips

### Change Colors
Edit `index.html` CSS variables (line 19):
```css
:root {
  --primary: #0F0F0F;    /* Dark color */
  --accent: #E63027;     /* Accent color (buttons) */
  --secondary: #F5F5F0;  /* Background */
}
```

### Add New Case Studies
Copy this block in `config.js`:
```javascript
{
  name: 'ClientName',
  title: 'Full Client Title',
  description: 'What you did for them...',
  gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  metrics: [
    { value: '250%', label: 'Growth' },
    { value: '3.5x', label: 'ROI' },
    { value: '85%', label: 'Satisfaction' }
  ]
}
```

### Remove Sections
To hide a section, comment it out in `index.html`:
```html
<!-- <section class="stats">...</section> -->
```

## 🐛 Troubleshooting

**Analytics not working?**
- Check your Measurement ID is correct
- Wait 24 hours for data to appear
- Use browser extensions to verify (Google Tag Assistant)

**Content not updating?**
- Clear browser cache (Ctrl+Shift+R or Cmd+Shift+R)
- Make sure you edited `config.js` not `index.html`
- Check JavaScript console for errors (F12)

**Analyzer not working?**
- Some websites block iframe embedding
- This is normal - the error message guides users
- Alternative tools are suggested automatically

## 📞 Support

Need help? Edit the contact info in `config.js`:
```javascript
company: {
  email: 'your@email.com',
  phone: '+1234567890'
}
```

## 🔄 Updates

To update content in the future:
1. Edit `config.js`
2. Re-upload to your hosting
3. Clear cache to see changes

**That's it!** No coding knowledge needed. 🎉
