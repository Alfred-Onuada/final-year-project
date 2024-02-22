const navLinks = document.getElementsByClassName('nav-links');

[].forEach.call(navLinks, navLink => {
  const url = window.location.href;
  const host = window.location.protocol;
  const domain = window.location.host;

  const queryParams = url.replace(host, '').replace(domain, '').replace(/\//g, '');

  const navLinkHref = navLink.querySelector('a').href.replace(host, '').replace(domain, '').replace(/\//g, '');

  if (queryParams !== '' && navLinkHref !== '' && queryParams.startsWith(navLinkHref)) {
    navLink.classList.add('active');
  } else if (queryParams === '' && navLinkHref === '') {
    navLink.classList.add('active');
  }
})