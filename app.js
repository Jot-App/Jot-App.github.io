// Initialize tracking codes from config
function initTracking() {
  // Google Analytics 4
  if (CONFIG.tracking.googleAnalytics.enabled && CONFIG.tracking.googleAnalytics.measurementId) {
    // GA is already loaded via the hardcoded gtag snippet in index.html for G-58883HVDTC
    // Only load again if a different ID is configured
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
      window.lintrk.q=[];}
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

// Load all content from config.js into the page
function loadContent() {
  // Logo is a structured HTML element — don't overwrite its inner markup
  document.getElementById('footerCompanyName').textContent = CONFIG.company.name;
  document.getElementById('copyrightName').textContent = CONFIG.company.name;
  document.getElementById('footerDescription').textContent = CONFIG.company.description;
  document.getElementById('footerEmail').href = `mailto:${CONFIG.company.email}`;
  document.getElementById('footerEmail').textContent = CONFIG.company.email;
  document.getElementById('footerPhone').href = `tel:${CONFIG.company.phone.replace(/[^0-9+]/g, '')}`;
  document.getElementById('footerPhone').textContent = CONFIG.company.phone;
  document.getElementById('currentYear').textContent = new Date().getFullYear();

  document.getElementById('heroHeadline').textContent = CONFIG.hero.headline;
  document.getElementById('heroSubtitle').textContent = CONFIG.hero.subtitle;
  document.getElementById('heroCTA').textContent = CONFIG.hero.ctaText;
  document.getElementById('heroCTA').href = CONFIG.hero.ctaLink;

  document.getElementById('statsContainer').innerHTML = CONFIG.stats.map(stat => `
    <div class="stat-item">
      <div class="stat-number">${stat.number}</div>
      <div class="stat-label">${stat.label}</div>
    </div>
  `).join('');

  document.getElementById('caseStudiesContainer').innerHTML = CONFIG.caseStudies.map(cs => `
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

  document.getElementById('servicesContainer').innerHTML = CONFIG.services.map(s =>
    `<a href="#">${s}</a>`
  ).join('');

  document.getElementById('companyLinksContainer').innerHTML = CONFIG.footer.company.map(link =>
    `<a href="${link.link}">${link.text}</a>`
  ).join('');

  document.getElementById('analyzerTitle').textContent = CONFIG.analyzer.title;
  document.getElementById('analyzerSubtitle').textContent = CONFIG.analyzer.subtitle;
  document.getElementById('websiteUrl').placeholder = CONFIG.analyzer.placeholder;
}

// Toast notification
function showToast(msg) {
  const t = document.getElementById('errorToast');
  t.textContent = msg;
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

// ─── Safe audit helpers ───────────────────────────────────────────────────────
// Prevent crashes when PageSpeed API omits an audit for certain sites

function getMetricLabel(score) {
  if (score === null || score === undefined) return 'N/A';
  return score >= 0.9 ? 'Good' : score >= 0.5 ? 'Needs Improvement' : 'Poor';
}

function safeDisplay(aud, key) {
  return (aud[key] && aud[key].displayValue) ? aud[key].displayValue : 'N/A';
}

function safeNumeric(aud, key) {
  return (aud[key] && aud[key].numericValue != null) ? aud[key].numericValue : null;
}

function safeScore(aud, key) {
  return (aud[key] != null) ? aud[key].score : null;
}

// ─── Website Analyzer ────────────────────────────────────────────────────────
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
    const apiKey = window.PAGE_SPEED_API_KEY || '';
    const keyParam = (apiKey && apiKey !== 'YOUR_API_KEY_HERE') ? `&key=${apiKey}` : '';
    const apiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&strategy=mobile${keyParam}`;

    const res = await fetch(apiUrl);
    const data = await res.json();

    if (data.error) throw new Error(data.error.message || 'API Error');

    const lh = data.lighthouseResult;
    const aud = lh.audits;
    const score = Math.round(lh.categories.performance.score * 100);

    // Overall score + circle animation
    document.getElementById('overallScore').textContent = score;
    const circumference = 2 * Math.PI * 90;
    document.getElementById('scoreCircle').style.strokeDashoffset = circumference - (score / 100) * circumference;

    // Load Time (Speed Index)
    const speedIndex = safeNumeric(aud, 'speed-index');
    document.getElementById('loadTime').textContent = speedIndex !== null ? (speedIndex / 1000).toFixed(1) + 's' : 'N/A';
    document.getElementById('loadTimeLabel').textContent = getMetricLabel(safeScore(aud, 'speed-index'));

    // Page Size (Total Byte Weight)
    const byteWeight = safeNumeric(aud, 'total-byte-weight');
    document.getElementById('pageSize').textContent = byteWeight !== null ? (byteWeight / (1024 * 1024)).toFixed(1) + ' MB' : 'N/A';
    document.getElementById('pageSizeLabel').textContent = getMetricLabel(safeScore(aud, 'total-byte-weight'));

    // HTTP Requests
    const reqItems = aud['network-requests'] && aud['network-requests'].details && aud['network-requests'].details.items;
    const reqCount = reqItems ? reqItems.length : null;
    document.getElementById('requests').textContent = reqCount !== null ? reqCount : 'N/A';
    document.getElementById('requestsLabel').textContent = reqCount !== null ? (reqCount < 50 ? 'Good' : 'Needs Work') : 'N/A';

    // DOM Size
    document.getElementById('images').textContent = safeDisplay(aud, 'dom-size');
    document.getElementById('imagesLabel').textContent = getMetricLabel(safeScore(aud, 'dom-size'));

    // JS Bootup Time
    document.getElementById('scripts').textContent = safeDisplay(aud, 'bootup-time');
    document.getElementById('scriptsLabel').textContent = getMetricLabel(safeScore(aud, 'bootup-time'));

    // Main Thread Work
    document.getElementById('styles').textContent = safeDisplay(aud, 'mainthread-work-breakdown');
    document.getElementById('stylesLabel').textContent = getMetricLabel(safeScore(aud, 'mainthread-work-breakdown'));

    // Recommendations
    const checks = [
      ['uses-optimized-images', 'Optimize Images'],
      ['unused-css-rules', 'Remove Unused CSS'],
      ['render-blocking-resources', 'Eliminate Render-Blocking Resources'],
      ['unminified-javascript', 'Minify JavaScript'],
      ['server-response-time', 'Improve Server Response Time']
    ];

    const recs = checks.filter(([key]) => aud[key] && aud[key].score !== null && aud[key].score < 1);
    const recList = document.getElementById('recommendationsList');

    if (recs.length === 0) {
      recList.innerHTML = '<div class="recommendation-item"><div class="recommendation-title">🎉 Excellent Performance!</div><div class="recommendation-description">Your website is well-optimized. Keep up the great work!</div></div>';
    } else {
      recList.innerHTML = recs.map(([key, title]) => `
        <div class="recommendation-item">
          <div class="recommendation-title">${title}</div>
          <div class="recommendation-description">${aud[key].description || ''}</div>
        </div>
      `).join('');
    }

    loading.classList.remove('active');
    results.classList.add('active');

  } catch (err) {
    console.error('Analyzer error:', err);
    loading.classList.remove('active');
    results.classList.add('active');

    const isQuota = err.message.toLowerCase().includes('quota') || err.message.toLowerCase().includes('exceeded');

    // Reset all metric cards
    ['loadTime','pageSize','requests','images','scripts','styles'].forEach(id => {
      document.getElementById(id).textContent = '--';
    });
    ['loadTimeLabel','pageSizeLabel','requestsLabel','imagesLabel','scriptsLabel','stylesLabel'].forEach(id => {
      document.getElementById(id).textContent = isQuota ? 'API Limit' : 'Error';
    });

    document.getElementById('overallScore').textContent = isQuota ? '⚠️' : '❌';

    const recList = document.getElementById('recommendationsList');
    if (isQuota) {
      recList.innerHTML = `
        <div class="recommendation-item" style="border-left-color:#FF9500">
          <div class="recommendation-title">📊 API Quota Exceeded</div>
          <div class="recommendation-description">
            The PageSpeed API quota has been exceeded. Please try again later, or:<br><br>
            <a href="https://pagespeed.web.dev/analysis?url=${encodeURIComponent(url)}" target="_blank" rel="noopener" style="color:#E63027;font-weight:700;text-decoration:underline">
              → Analyze on PageSpeed Insights ←
            </a>
          </div>
        </div>`;
    } else {
      recList.innerHTML = `
        <div class="recommendation-item">
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
