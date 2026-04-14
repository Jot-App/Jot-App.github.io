(function () {
  var headerHTML =
    '<header class="header" id="siteHeader">' +
      '<nav class="nav-container" aria-label="Main navigation">' +
        '<a href="index.html" class="logo-link" aria-label="Mad Hat Communications">' +
          '<img src="logo.svg" alt="Mad Hat Communications" class="logo-svg">' +
        '</a>' +
        '<button class="nav-toggle" id="navToggle" aria-controls="mainNav" aria-expanded="false" aria-label="Toggle menu">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
            '<path d="M3 6h18M3 12h18M3 18h18"></path>' +
          '</svg>' +
        '</button>' +
        '<ul class="nav-links" id="mainNav">' +
          '<li><a href="work.html">Work</a></li>' +
          '<li class="has-dropdown" id="servicesDropdown">' +
            '<button class="nav-dropdown-toggle" id="servicesToggle" aria-expanded="false" aria-controls="servicesMenu">Services</button>' +
            '<ul class="dropdown-menu" id="servicesMenu" aria-label="Services submenu">' +
              '<li><a href="growth-marketing.html">Growth Marketing</a></li>' +
              '<li><a href="performance-marketing.html">Performance Marketing</a></li>' +
              '<li><a href="brand-communications.html">Brand &amp; Communications</a></li>' +
              '<li><a href="cro.html">Conversion Optimisation</a></li>' +
            '</ul>' +
          '</li>' +
          '<li><a href="about.html">About</a></li>' +
          '<li><a href="blog.html">Blog</a></li>' +
          '<li><a href="contact.html">Contact</a></li>' +
        '</ul>' +
      '</nav>' +
    '</header>';

  window.renderHeader = function () {
    var container = document.getElementById('headerContainer');
    if (container) {
      container.innerHTML = headerHTML;
      initHeader();
    }
  };

  function initHeader() {
    var page = window.location.pathname.split('/').pop() || 'index.html';
    var servicePages = {
      'growth-marketing.html': true,
      'performance-marketing.html': true,
      'brand-communications.html': true,
      'cro.html': true
    };

    // Highlight active top-level links
    document.querySelectorAll('.nav-links > li > a').forEach(function (a) {
      if (a.getAttribute('href') === page) a.classList.add('active');
    });

    // Highlight Services button + active sub-link when on a service page
    if (servicePages[page]) {
      var btn = document.getElementById('servicesToggle');
      if (btn) btn.classList.add('active');
      document.querySelectorAll('#servicesMenu a').forEach(function (a) {
        if (a.getAttribute('href') === page) a.classList.add('active');
      });
    }

    setupEventListeners();
  }

  function setupEventListeners() {
    var header  = document.getElementById('siteHeader');
    var toggle  = document.getElementById('navToggle');
    var mainNav = document.getElementById('mainNav');

    // ── Hamburger open/close ──
    if (toggle) {
      toggle.addEventListener('click', function (e) {
        e.stopPropagation();
        var isOpen = header.classList.toggle('nav-open');
        toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      });
    }

    // ── Close mobile nav when a top-level page link is clicked ──
    // Does NOT trigger for dropdown toggle buttons or dropdown sub-links
    if (mainNav) {
      mainNav.addEventListener('click', function (e) {
        var link = e.target.closest('a');
        if (link && !link.closest('.dropdown-menu')) {
          header.classList.remove('nav-open');
          toggle.setAttribute('aria-expanded', 'false');
        }
      });
    }

    // ── Services dropdown toggle ──
    document.querySelectorAll('.nav-dropdown-toggle').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        var parent = btn.parentElement;
        var isOpen = parent.classList.toggle('open');
        btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');

        // Close any other open dropdowns
        document.querySelectorAll('.has-dropdown.open').forEach(function (el) {
          if (el !== parent) {
            el.classList.remove('open');
            var other = el.querySelector('.nav-dropdown-toggle');
            if (other) other.setAttribute('aria-expanded', 'false');
          }
        });
      });
    });

    // ── Close dropdown on outside click ──
    document.addEventListener('click', function (e) {
      if (!e.target.closest('.has-dropdown')) {
        document.querySelectorAll('.has-dropdown.open').forEach(function (el) {
          el.classList.remove('open');
          var b = el.querySelector('.nav-dropdown-toggle');
          if (b) b.setAttribute('aria-expanded', 'false');
        });
      }
    });

    // ── Close everything on Escape ──
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        header.classList.remove('nav-open');
        if (toggle) toggle.setAttribute('aria-expanded', 'false');
        document.querySelectorAll('.has-dropdown.open').forEach(function (el) {
          el.classList.remove('open');
          var b = el.querySelector('.nav-dropdown-toggle');
          if (b) b.setAttribute('aria-expanded', 'false');
        });
      }
    });
  }
})();