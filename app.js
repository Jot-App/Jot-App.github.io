// Initialize tracking codes
function initTracking() {
  // Google Analytics 4
  if (CONFIG.tracking.googleAnalytics.enabled && CONFIG.tracking.googleAnalytics.measurementId) {
    const gaScript = document.createElement('script');
    gaScript.async = true;
    gaScript.src = `https://www.googletagmanager.com/gtag/js?id=${CONFIG.tracking.googleAnalytics.measurementId}`;
    document.head.appendChild(gaScript);
    
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', CONFIG.tracking.googleAnalytics.measurementId);
  }

  // Facebook Pixel
  if (CONFIG.tracking.facebookPixel.enabled && CONFIG.tracking.facebookPixel.pixelId) {
    !function(f,b,e,v,n,t,s)
    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
    n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t,s)}(window, document,'script',
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
    _linkedin_partner_id = CONFIG.tracking.linkedinInsight.partnerId;
    window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || [];
    window._linkedin_data_partner_ids.push(_linkedin_partner_id);
    (function(l) {
    if (!l){window.lintrk = function(a,b){window.lintrk.q.push([a,b])};
    window.lintrk.q=[]}
    var s = document.getElementsByTagName("script")[0];
    var b = document.createElement("script");
    b.type = "text/javascript";b.async = true;
    b.src = "https://snap.licdn.com/li.lms-analytics/insight.min.js";
    s.parentNode.insertBefore(b, s);})(window.lintrk);
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

// Load content from config
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
  caseStudiesContainer.innerHTML = CONFIG.caseStudies.map((cs, index) => `
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
function showToast(m){
  const t=document.getElementById('errorToast');
  t.textContent=m;
  t.classList.add('active');
  setTimeout(()=>t.classList.remove('active'),4000);
}

// Smooth scrolling
window.addEventListener('load',()=>{
  initTracking();
  loadContent();
  
  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click',e=>{
      e.preventDefault();
      const t=document.querySelector(a.getAttribute('href'));
      if(t)t.scrollIntoView({behavior:'smooth',block:'start'});
    });
  });
});

// Website Analyzer
async function analyzeWebsite(){
  const i=document.getElementById('websiteUrl');
  let u=i.value.trim();
  if(!u){showToast('Please enter a website URL');return}
  if(!u.startsWith('http://')&&!u.startsWith('https://'))u='https://'+u;
  try{new URL(u)}catch(e){showToast('Please enter a valid website (e.g., example.com)');return}
  
  const l=document.getElementById('loading'),r=document.getElementById('results'),b=document.querySelector('.analyze-button');
  l.classList.add('active');r.classList.remove('active');b.disabled=true;
  
  try {
    const apiKeyParam = window.PAGE_SPEED_API_KEY && window.PAGE_SPEED_API_KEY !== 'YOUR_API_KEY_HERE' 
      ? `&key=${window.PAGE_SPEED_API_KEY}` 
      : '';
    const res=await fetch(`https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(u)}&strategy=mobile${apiKeyParam}`);
    const d=await res.json();
    
    if(d.error)throw new Error(d.error.message||'API Error');
    
    const lh=d.lighthouseResult,cat=lh.categories,aud=lh.audits,ps=Math.round(cat.performance.score*100);
    
    // Using the new IDs in index (1).html
    document.getElementById('overallScore').textContent=ps;
    
    // Load Time metric (Mapped from Speed Index or LCP)
    const loadTimeVal = (aud['speed-index'].numericValue / 1000).toFixed(1);
    document.getElementById('loadTime').textContent=loadTimeVal + 's';
    document.getElementById('loadTimeLabel').textContent=getMetricLabel(aud['speed-index'].score);
    
    // Page Size metric (Total Byte Weight)
    const pageSizeMB = (aud['total-byte-weight'].numericValue / (1024 * 1024)).toFixed(1);
    document.getElementById('pageSize').textContent=pageSizeMB + 'MB';
    document.getElementById('pageSizeLabel').textContent=getMetricLabel(aud['total-byte-weight'].score);
    
    // HTTP Requests metric (Network Requests)
    const requestsCount = aud['network-requests'].details.items.length;
    document.getElementById('requests').textContent=requestsCount;
    document.getElementById('requestsLabel').textContent=requestsCount < 50 ? 'Good' : 'Needs Work';
    
    // Images metric (Dom Size or count if available - using DOM size as proxy for complexity)
    document.getElementById('images').textContent=aud['dom-size'].displayValue;
    document.getElementById('imagesLabel').textContent=getMetricLabel(aud['dom-size'].score);
    
    // Scripts (Bootup time as proxy)
    document.getElementById('scripts').textContent=aud['bootup-time'].displayValue;
    document.getElementById('scriptsLabel').textContent=getMetricLabel(aud['bootup-time'].score);
    
    // Styles (Main thread work as proxy)
    document.getElementById('styles').textContent=aud['mainthread-work-breakdown'].displayValue;
    document.getElementById('stylesLabel').textContent=getMetricLabel(aud['mainthread-work-breakdown'].score);
    
    const c=2*Math.PI*90,o=c-(ps/100)*c;
    document.getElementById('scoreCircle').style.strokeDashoffset=o;
    
    const ops=lh.audits,rec=[];
    if(ops['uses-optimized-images']&&ops['uses-optimized-images'].score<1)rec.push({title:'Optimize Images',description:ops['uses-optimized-images'].description});
    if(ops['unused-css-rules']&&ops['unused-css-rules'].score<1)rec.push({title:'Remove Unused CSS',description:ops['unused-css-rules'].description});
    if(ops['render-blocking-resources']&&ops['render-blocking-resources'].score<1)rec.push({title:'Eliminate Render-Blocking Resources',description:ops['render-blocking-resources'].description});
    if(ops['unminified-javascript']&&ops['unminified-javascript'].score<1)rec.push({title:'Minify JavaScript',description:ops['unminified-javascript'].description});
    if(ops['server-response-time']&&ops['server-response-time'].score<1)rec.push({title:'Improve Server Response Time',description:ops['server-response-time'].description});
    
    const rl=document.getElementById('recommendationsList');
    rl.innerHTML='';
    if(rec.length===0){
        rl.innerHTML='<div class="recommendation-item"><div class="recommendation-title">🎉 Excellent Performance!</div><div class="recommendation-description">Your website is well-optimized. Keep up the great work!</div></div>';
    } else {
        rec.forEach(rc=>{
            rl.innerHTML+=`<div class="recommendation-item"><div class="recommendation-title">${rc.title}</div><div class="recommendation-description">${rc.description}</div></div>`;
        });
    }
    
    l.classList.remove('active');
    r.classList.add('active');
  } catch(err) {
    console.error('Error:',err);
    l.classList.remove('active');
    r.classList.add('active');
    const rl=document.getElementById('recommendationsList');
    const isQuota = err.message.includes('quota')||err.message.includes('Quota')||err.message.includes('exceeded');
    
    if(isQuota){
        document.getElementById('overallScore').textContent='⚠️';
        document.getElementById('loadTime').textContent='--';
        document.getElementById('loadTimeLabel').textContent='API Limit';
        rl.innerHTML='<div class="recommendation-item" style="border-left-color:#FF9500"><div class="recommendation-title">📊 API Quota Exceeded</div><div class="recommendation-description">The API key is either missing or has exceeded its quota.<br><br>Make sure you added your API key to PAGE_SPEED_API_KEY in index (1).html.<br><br><a href="https://pagespeed.web.dev/analysis?url='+encodeURIComponent(u)+'" target="_blank" rel="noopener" style="color:#E63027;font-weight:700;text-decoration:underline;font-size:1.1rem">→ Analyze on PageSpeed Insights (Official Tool) ←</a></div></div>';
    } else {
        document.getElementById('overallScore').textContent='❌';
        document.getElementById('loadTime').textContent='--';
        document.getElementById('loadTimeLabel').textContent='Error';
        rl.innerHTML='<div class="recommendation-item"><div class="recommendation-title">⚠️ Analysis Error</div><div class="recommendation-description">'+err.message+'<br><br>Try analyzing directly:<br><a href="https://pagespeed.web.dev/analysis?url='+encodeURIComponent(u)+'" target="_blank" rel="noopener" style="color:#E63027;font-weight:700;text-decoration:underline">→ PageSpeed Insights ←</a></div></div>';
    }
  } finally {
    b.disabled=false;
  }
}

function getMetricLabel(s){return s===null?'N/A':s>=0.9?'Good':s>=0.5?'Needs Improvement':'Poor'}
