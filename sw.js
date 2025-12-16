const CACHE_NAME = 'Santa_Cruz-v4';

const ASSETS = [
  './',
  './index.html',
  './js/app.js',
  './css/style.css',
]

// Instalar SW y cachear el shell
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
      .catch(err => console.error('❌ Fallo al crear caché', err))
  );
});

// Activar SW y eliminar cachés antiguos
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => 
      Promise.all(
        keys.filter(key => key !== CACHE_NAME)
        .map(key => caches.delete(key))
        )
      )
    );
    self.clients.claim();
});

// Fetch simple
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});

self.addEventListener('notificationclick', event => {
  event.notification.close();

  event.waitUntil(
    clients.openWindow('https://wa.me/7571511481')
  );
});


function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("app_session", 1);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains("session")) {
        db.createObjectStore("session");
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function idbSet(key, value) {
  return openDB().then(db => {
    const tx = db.transaction("session", "readwrite");
    tx.objectStore("session").put(value, key);
    return tx.complete;
  });
}

function idbGet(key) {
  return openDB().then(db => {
    const tx = db.transaction("session", "readonly");
    return tx.objectStore("session").get(key);
  });
}


// Mensajes recibidos desde app.js

self.addEventListener("message", (event) => {
  const data = event.data;

  // Guardar usuario
  if (data.type === "save_user") {
    idbSet("usuario_nombre", data.usuario_nombre);
    idbSet("usuario_email", data.usuario_email);
  }

  // Devolver usuario a la página
  if (data.type === "get_user") {
    Promise.all([
      idbGet("usuario_nombre"),
      idbGet("usuario_email")
    ]).then(values => {
      const [nombre, correo] = values;
      event.ports[0].postMessage({
        usuario_nombre: nombre,
        usuario_email: correo
      });
    });
  }
});

self.addEventListener("message", event => {
  console.log("Mensaje recibido en SW:", event.data);
});