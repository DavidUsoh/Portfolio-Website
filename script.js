// ============================================================
// SHARED SITE SCRIPT — runs on every page
// Handles: mobile nav toggle, active tab highlighting
// ============================================================

document.addEventListener('DOMContentLoaded', function () {
  // Mobile nav toggle
  var toggle = document.querySelector('.nav-toggle');
  var tabs = document.querySelector('.nav-tabs');

  if (toggle && tabs) {
    toggle.addEventListener('click', function () {
      tabs.classList.toggle('open');
      var isOpen = tabs.classList.contains('open');
      toggle.setAttribute('aria-expanded', isOpen);
    });
  }

  // Highlight the active tab based on current page filename
  var currentPage = window.location.pathname.split('/').pop() || 'index.html';
  var links = document.querySelectorAll('.nav-tabs a');

  links.forEach(function (link) {
    var linkPage = link.getAttribute('href');
    if (linkPage === currentPage) {
      link.classList.add('active');
    }
  });
});
