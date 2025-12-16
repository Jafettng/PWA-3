const routes = {
  '/home': 'pages/home.html',
  '/galeria': 'pages/galeria.html',
  '/contacto' :'pages/contacto.html',
};

async function loadPage(route) {
  const content = document.getElementById('content');
  const path = routes[route] || routes['/home'];

  try {
    const res = await fetch(path);
    const html = await res.text();
    content.innerHTML = html;
  } catch (err) {
    content.innerHTML = '<p>Error al cargar la página.</p>';
  }
}

window.addEventListener('hashchange', () => {
  const route = location.hash.slice(1);
  loadPage(route);
});

window.addEventListener('load', () => {
  const route = location.hash.slice(1) || '/home';
  loadPage(route);
});
