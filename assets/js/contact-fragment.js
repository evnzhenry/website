document.addEventListener('DOMContentLoaded', function(){
  // Centralized contact config
  const cfg = {
    hours: 'Mon-Fri 08:30-17:00',
    phoneDisplay: '+256 703 676 598',
    phoneTel: '+256703676598',
    email: 'contact@stronicholdings.com',
    social: {
      facebook: '#',
      linkedin: '#',
      twitter: '#',
      youtube: '#',
      tiktok: '#'
    }
  };

  // Shared social icons markup (uses FA for email/facebook/linkedin/twitter/youtube; inline SVG for TikTok)
  const socialIconsHtml = `
        <li><a href="mailto:${cfg.email}" target="_blank" rel="noopener" aria-label="Email"><i class="fa fa-envelope"></i></a></li>
        <li><a href="${cfg.social.facebook}" target="_blank" rel="noopener" aria-label="Facebook"><i class="fa fa-facebook"></i></a></li>
        <li><a href="${cfg.social.linkedin}" target="_blank" rel="noopener" aria-label="LinkedIn"><i class="fa fa-linkedin"></i></a></li>
        <li><a href="${cfg.social.twitter}" target="_blank" rel="noopener" aria-label="Twitter"><i class="fa fa-twitter"></i></a></li>
        <li><a href="${cfg.social.youtube}" target="_blank" rel="noopener" aria-label="YouTube"><i class="fa fa-youtube"></i></a></li>
        <li><a href="${cfg.social.tiktok}" target="_blank" rel="noopener" aria-label="TikTok">
          <svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M10 2v6.5a3.5 3.5 0 1 1-2.7-3.4v1.9a1.7 1.7 0 1 0 1.7 1.7V2h1z" fill="currentColor"/>
            <path d="M11 2c.4 1.5 1.5 2.6 3 3v1.5c-1.6-.2-2.7-.9-3.5-1.9V2z" fill="currentColor"/>
          </svg>
        </a></li>
  `;

  // Replace sub-header content if present
  document.querySelectorAll('.sub-header').forEach(function(sh){
    const left = sh.querySelector('.left-info');
    const right = sh.querySelector('.right-icons');
    if (left){
      left.innerHTML = `
        <li><a href="#"><i class="fa fa-clock-o"></i>${cfg.hours}</a></li>
        <li><a href="tel:${cfg.phoneTel}"><i class="fa fa-phone"></i>${cfg.phoneDisplay}</a></li>
      `;
    }
    if (right){
      // Populate header with social icons
      right.innerHTML = socialIconsHtml;
    }
  });

  // Unify footer social icons across pages
  document.querySelectorAll('footer ul.social-icons').forEach(function(ul){
    ul.innerHTML = socialIconsHtml;
  });

  // Ensure "Check Status" is visible in the main navbar across pages
  document.querySelectorAll('nav.navbar .navbar-nav').forEach(function(nav){
    var hasStatus = Array.prototype.slice.call(nav.querySelectorAll('a.nav-link')).some(function(a){
      var href = a.getAttribute('href') || '';
      return href.indexOf('loan-status.html') !== -1 || href.indexOf('/loan-status') !== -1;
    });
    var isLoanStatusPage = /\/loan-status$/i.test(location.pathname) || /loan-status\.html$/i.test(location.pathname);
    if (!hasStatus){
      var li = document.createElement('li');
      li.className = 'nav-item' + (isLoanStatusPage ? ' active' : '');
      var a = document.createElement('a');
      a.className = 'nav-link';
      a.href = '/loan-status';
      a.textContent = 'Check Status';
      li.appendChild(a);
      nav.appendChild(li);
    } else if (isLoanStatusPage){
      var statusLink = nav.querySelector('a.nav-link[href*="loan-status.html"], a.nav-link[href*="/loan-status"]');
      if (statusLink && statusLink.parentElement){
        statusLink.parentElement.classList.add('active');
      }
    }
  });
});
