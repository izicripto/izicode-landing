// Service Worker para Izicode Edu PWA
// Versão 1.4.0 — HTML/JS sempre buscados com cache:'no-store' (ver fetch handler)

const CACHE_NAME = 'izicode-edu-v1.4';
const OFFLINE_URL = '/offline.html';

// Recursos para cache inicial
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/dashboard.html',
  '/login.html',
  '/dashboards/aluno.html',
  '/create-project.html',
  '/library.html',
  '/manifest.json',
  '/logo.svg',
  '/images/logo.png',
  '/js/firebase-config.js',
  '/js/auth.js',
  OFFLINE_URL
];

// Instalação do Service Worker
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Instalando...');

  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Cache aberto');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// Ativação do Service Worker
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Ativando...');

  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[Service Worker] Removendo cache antigo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Estratégia de cache: Network First com fallback para Cache
self.addEventListener('fetch', (event) => {
  // Ignorar requisições que não são GET
  if (event.request.method !== 'GET') return;

  // Ignorar requisições com esquemas não suportados (ex: chrome-extension)
  if (!event.request.url.startsWith('http')) return;

  // Ignorar requisições para APIs externas (Firebase, etc)
  if (event.request.url.includes('firebaseio.com') ||
    event.request.url.includes('googleapis.com') ||
    event.request.url.includes('gstatic.com')) {
    return;
  }

  // HTML e JS nunca devem vir do cache HTTP do navegador: buscamos pela URL
  // (string, não o Request original) com cache:'no-store' para garantir que
  // o SW sempre bata na rede de verdade, mesmo que a resposta anterior
  // tenha sido salva com um Cache-Control antigo mais permissivo (esse foi
  // o motivo de deploys corrigidos ainda aparecerem "bugados" por até 1h).
  // Não dá para reconstruir um Request de navegação com `new Request()` —
  // o Fetch API proíbe isso para requests com mode 'navigate' — por isso
  // usamos a URL crua em vez do objeto event.request nesses casos.
  const isCodeAsset = event.request.destination === 'document' || event.request.destination === 'script';
  const fetchPromise = isCodeAsset
    ? fetch(event.request.url, { cache: 'no-store', credentials: 'same-origin' })
    : fetch(event.request);

  event.respondWith(
    fetchPromise
      .then((response) => {
        // Se a resposta for válida, clone e armazene no cache
        if (response && response.status === 200) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return response;
      })
      .catch(() => {
        // Se falhar, tente buscar do cache
        return caches.match(event.request)
          .then((cachedResponse) => {
            if (cachedResponse) {
              return cachedResponse;
            }

            // Se for uma navegação e não houver cache, mostre página offline
            if (event.request.mode === 'navigate') {
              return caches.match(OFFLINE_URL);
            }
          });
      })
  );
});

// Sincronização em background (para futuras features)
self.addEventListener('sync', (event) => {
  console.log('[Service Worker] Sincronização em background:', event.tag);

  if (event.tag === 'sync-projects') {
    event.waitUntil(syncProjects());
  }
});

// Função auxiliar para sincronizar projetos
async function syncProjects() {
  // TODO: Implementar sincronização de projetos offline
  console.log('[Service Worker] Sincronizando projetos...');
}

// Notificações Push (para futuras features)
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'Nova notificação da Izicode Edu',
    icon: '/images/logo.png',
    badge: '/images/logo.png',
    vibrate: [200, 100, 200]
  };

  event.waitUntil(
    self.registration.showNotification('Izicode Edu', options)
  );
});
