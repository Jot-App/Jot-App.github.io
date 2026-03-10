// Initialize tracking codes from config
function initTracking() {
  // Google Analytics 4
  if (CONFIG.tracking.googleAnalytics.enabled && CONFIG.tracking.googleAnalytics.measurementId) {
    // Note: GA is already loaded via the hardcoded gtag snippet in index.html
    // This just ensures config-based GA also fires if measurementId differs
    if (CONFIG.tracking.googleAnalytics.measurementId !== 'G-58883HVDTC') {
      const gaScript = document.createElement('script');
      gaScript.async = true;
      gaScript.src = `https://www.googletagmanager.com/gtag/js?id=${CONFIG.tracking.googleAnalytics.measurementId}`;
      document.head.appendChild(gaScript);
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', CONFIG.tracking.googleAnalytics.measurementId);
    }
  }

  // Facebook Pixel
  if (CONFIG.tracking.facebookPixel.enabled && CONFIG.tracking.facebookPixel.pixelId) {
    !function(f,b,e,v,n,t,s)
    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
    n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t,s)}(window,document,'script',
    'https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', CONFIG.tracking.facebookPixel.pixelId);
    fbq('track', 'PageView');
  }

  // Google Tag Manager
  if (CONFIG.tracking.googleTagManager.enabled && CONFIG.tracking.googleTagManager.containerId) {
    (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer',CONFIG.tracking.googleTagManager.containerId);
  }

  // LinkedIn Insight Tag
  if (CONFIG.tracking.linkedinInsight.enabled && CONFIG.tracking.linkedinInsight.partnerId) {
    window._linkedin_partner_id = CONFIG.tracking.linkedinInsight.partnerId;
    window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || [];
    window._linkedin_data_partner_ids.push(window._linkedin_partner_id);
    (function(l) {
      if (!l){window.lintrk = function(a,b){window.lintrk.q.push([a,b])};
      window.lintrk.q=[]}
      var s = document.getElementsByTagName("script")[0];
      var b = document.createElement("script");
      b.type = "text/javascript"; b.async = true;
      b.src = "https://snap.licdn.com/li.lms-analytics/insight.min.js";
      s.parentNode.insertBefore(b, s);
    })(window.lintrk);
  }

  // Hotjar
  if (CONFIG.tracking.hotjar.enabled && CONFIG.tracking.hotjar.siteId) {
    (function(h,o,t,j,a,r){
      h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
      h._hjSettings={hjid:CONFIG.tracking.hotjar.siteId,hjsv:6};
      a=o.getElementsByTagName('head')[0];
      r=o.createElement('script');r.async=1;
      r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
      a.appendChild(r);
    })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
  }
}

// Load content from config into the page
function loadContent() {
  // Company info
  document.getElementById('companyName').textContent = CONFIG.company.name;
  document.getElementById('footerCompanyName').textContent = CONFIG.company.name;
  document.getElementById('copyrightName').textContent = CONFIG.company.name;
  document.getElementById('footerDescription').textContent = CONFIG.company.description;
  document.getElementById('footerEmail').href = `mailto:${CONFIG.company.email}`;
  document.getElementById('footerEmail').textContent = CONFIG.company.email;
  document.getElementById('footerPhone').href = `tel:${CONFIG.company.phone.replace(/[^0-9+]/g, '')}`;
  document.getElementById('footerPhone').textContent = CONFIG.company.phone;
  document.getElementById('currentYear').textContent = new Date().getFullYear();

  // Hero section
  document.getElementById('heroHeadline').textContent = CONFIG.hero.headline;
  document.getElementById('heroSubtitle').textContent = CONFIG.hero.subtitle;
  document.getElementById('heroCTA').textContent = CONFIG.hero.ctaText;
  document.getElementById('heroCTA').href = CONFIG.hero.ctaLink;

  // Stats
  const statsContainer = document.getElementById('statsContainer');
  statsContainer.innerHTML = CONFIG.stats.map(stat => `
    <div class="stat-item">
      <div class="stat-number">${stat.number}</div>
      <div class="stat-label">${stat.label}</div>
    </div>
  `).join('');

  // Case Studies
  const caseStudiesContainer = document.getElementById('caseStudiesContainer');
  caseStudiesContainer.innerHTML = CONFIG.caseStudies.map(cs => `
    <article class="case-card">
      <div class="case-image" style="background: ${cs.gradient}">
        <div class="case-logo">${cs.name}</div>
      </div>
      <div class="case-content">
        <h3 class="case-title">${cs.title}</h3>
        <p class="case-description">${cs.description}</p>
        <div class="case-metrics">
          ${cs.metrics.map(m => `
            <div class="metric">
              <div class="metric-value">${m.value}</div>
              <div class="metric-label">${m.label}</div>
            </div>
          `).join('')}
        </div>
      </div>
    </article>
  `).join('');

  // Services
  const servicesContainer = document.getElementById('servicesContainer');
  servicesContainer.innerHTML = CONFIG.services.map(service =>
    `<a href="#">${service}</a>`
  ).join('');

  // Company links
  const companyLinksContainer = document.getElementById('companyLinksContainer');
  companyLinksContainer.innerHTML = CONFIG.footer.company.map(link =>
    `<a href="${link.link}">${link.text}</a>`
  ).join('');

  // Analyzer
  document.getElementById('analyzerTitle').textContent = CONFIG.analyzer.title;
  document.getElementById('analyzerSubtitle').textContent = CONFIG.analyzer.subtitle;
  document.getElementById('websiteUrl').placeholder = CONFIG.analyzer.placeholder;
}

// Toast notification
function showToast(m) {
  const t = document.getElementById('errorToast');
  t.textContent = m;
  t.classList.add('active');
  setTimeout(() => t.classList.remove('active'), 4000);
}

// Smooth scrolling
window.addEventListener('load', () => {
  initTracking();
  loadContent();

  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      const target = document.querySelector(a.getAttribute('href'));
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
});

// Helper label
function getMetricLabel(s) {
  return s === null ? 'N/A' : s >= 0.9 ? 'Good' : s >= 0.5 ? 'Needs Improvement' : 'Poor';
}

// Website Analyzer
async function analyzeWebsite() {
  const input = document.getElementById('websiteUrl');
  let url = input.value.trim();

  if (!url) { showToast('Please enter a website URL'); return; }
  if (!url.startsWith('http://') && !url.startsWith('https://')) url = 'https://' + url;
  try { new URL(url); } catch(e) { showToast('Please enter a valid website (e.g., example.com)'); return; }

  const loading = document.getElementById('loading');
  const results = document.getElementById('results');
  const btn = document.querySelector('.analyze-button');

  loading.classList.add('active');
  results.classList.remove('active');
  btn.disabled = true;

  try {
    // Read API key set in index.html
    const apiKey = window.PAGE_SPEED_API_KEY || '';
    const keyParam = apiKey && apiKey !== 'YOUR_API_KEY_HERE' ? `&key=${apiKey}` : '';
    const apiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&strategy=mobile${keyParam}`;

    const res = await fetch(apiUrl);
    const data = await res.json();

    if (data.error) throw new Error(data.error.message || 'API Error');

    const lh = data.lighthouseResult;
    const cat = lh.categories;
    const aud = lh.audits;
    const score = Math.round(cat.performance.score * 100);

    // Overall score
    document.getElementById('overallScore').textContent = score;

    // Animate circle
    const circumference = 2 * Math.PI * 90;
    document.getElementById('scoreCircle').style.strokeDashoffset = circumference - (score / 100) * circumference;

    // Metrics
    document.getElementById('loadTime').textContent = (aud['speed-index'].numericValue / 1000).toFixed(1) + 's';
    document.getElementById('loadTimeLabel').textContent = getMetricLabel(aud['speed-index'].score);

    const sizeMB = (aud['total-byte-weight'].numericValue / (1024 * 1024)).toFixed(1);
    document.getElementById('pageSize').textContent = sizeMB + ' MB';
    document.getElementById('pageSizeLabel').textContent = getMetricLabel(aud['total-byte-weight'].score);

    const reqCount = aud['network-requests'].details.items.length;
    document.getElementById('requests').textContent = reqCount;
    document.getElementById('requestsLabel').textContent = reqCount < 50 ? 'Good' : 'Needs Work';

    document.getElementById('images').textContent = aud['dom-size'].displayValue;
    document.getElementById('imagesLabel').textContent = getMetricLabel(aud['dom-size'].score);

    document.getElementById('scripts').textContent = aud['bootup-time'].displayValue;
    document.getElementById('scriptsLabel').textContent = getMetricLabel(aud['bootup-time'].score);

    document.getElementById('styles').textContent = aud['mainthread-work-breakdown'].displayValue;
    document.getElementById('stylesLabel').textContent = getMetricLabel(aud['mainthread-work-breakdown'].score);

    // Recommendations
    const recList = document.getElementById('recommendationsList');
    const checks = [
      ['uses-optimized-images', 'Optimize Images'],
      ['unused-css-rules', 'Remove Unused CSS'],
      ['render-blocking-resources', 'Eliminate Render-Blocking Resources'],
      ['unminified-javascript', 'Minify JavaScript'],
      ['server-response-time', 'Improve Server Response Time']
    ];

    const recs = checks.filter(([key]) => aud[key] && aud[key].score < 1);

    if (recs.length === 0) {
      recList.innerHTML = '<div class="recommendation-item"><div class="recommendation-title">🎉 Excellent Performance!</div><div class="recommendation-description">Your website is well-optimized. Keep up the great work!</div></div>';
    } else {
      recList.innerHTML = recs.map(([key, title]) => `
        <div class="recommendation-item">
          <div class="recommendation-title">${title}</div>
          <div class="recommendation-description">${aud[key].description}</div>
        </div>
      `).join('');
    }

    loading.classList.remove('active');
    results.classList.add('active');

  } catch (err) {
    console.error('Analyzer error:', err);
    loading.classList.remove('active');
    results.classList.add('active');

    const recList = document.getElementById('recommendationsList');
    const isQuota = err.message.toLowerCase().includes('quota') || err.message.toLowerCase().includes('exceeded');

    document.getElementById('overallScore').textContent = isQuota ? '⚠️' : '❌';
    document.getElementById('loadTime').textContent = '--';
    document.getElementById('loadTimeLabel').textContent = isQuota ? 'API Limit' : 'Error';
    document.getElementById('pageSize').textContent = '--';
    document.getElementById('pageSizeLabel').textContent = '--';
    document.getElementById('requests').textContent = '--';
    document.getElementById('requestsLabel').textContent = '--';
    document.getElementById('images').textContent = '--';
    document.getElementById('imagesLabel').textContent = '--';
    document.getElementById('scripts').textContent = '--';
    document.getElementById('scriptsLabel').textContent = '--';
    document.getElementById('styles').textContent = '--';
    document.getElementById('stylesLabel').textContent = '--';

    if (isQuota) {
      recList.innerHTML = `<div class="recommendation-item" style="border-left-color:#FF9500">
        <div class="recommendation-title">📊 API Quota Exceeded</div>
        <div class="recommendation-description">
          The PageSpeed API quota has been exceeded. Please try again later, or analyze directly:<br><br>
          <a href="https://pagespeed.web.dev/analysis?url=${encodeURIComponent(url)}" target="_blank" rel="noopener" style="color:#E63027;font-weight:700;text-decoration:underline">
            → Analyze on PageSpeed Insights ←
          </a>
        </div>
      </div>`;
    } else {
      recList.innerHTML = `<div class="recommendation-item">
        <div class="recommendation-title">⚠️ Analysis Error</div>
        <div class="recommendation-description">
          ${err.message}<br><br>
          Try analyzing directly:<br>
          <a href="https://pagespeed.web.dev/analysis?url=${encodeURIComponent(url)}" target="_blank" rel="noopener" style="color:#E63027;font-weight:700;text-decoration:underline">
            → PageSpeed Insights ←
          </a>
        </div>
      </div>`;
    }
  } finally {
    btn.disabled = false;
  }
}
