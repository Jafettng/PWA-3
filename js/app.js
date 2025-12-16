async function loadComponent(id, file) {
  const el = document.getElementById(id);
  const res = await fetch(file);
  const html = await res.text();
  el.innerHTML = html;
}

window.addEventListener('DOMContentLoaded', async () => {
  await loadComponent('nav', 'component/header.html');

  // 👉 Ejecutar justo después de que el navbar se cargó
  if (window.actualizarBotonesNavbar) {
      actualizarBotonesNavbar();
  }

  await loadComponent('footer', 'component/footer.html');

  if (window.DB) DB.openDB();
});


