const CACHE_NAME = 'kounotrip-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/style.css',
  '/script.js',
  '/manifest.json',
  // 可能なら画像やロゴ、POI 定義 JSON なども列挙
  '/regions.json',
  '/pois.json',
  '/courses.json'
];

// インストール時に静的アセットをキャッシュ
self.addEventListener('install', event => {
  // インストール直後の即時有効化を行う場合は skipWaiting() を有効にできます（注意して使う）
  // self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(STATIC_ASSETS))
      .catch(err => console.warn('Failed to pre-cache', err))
  );
});

// 有効化時に古いキャッシュを削除
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) return caches.delete(key);
          return Promise.resolve();
        })
      )
    ).then(() => self.clients.claim())
  );
});

// fetch ハンドラ
self.addEventListener('fetch', event => {
  // 非 GET リクエストはキャッシュロジックから外す（POST 等を誤ってキャッシュしない）
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // ナビゲーション要求（ページ遷移 / SPA の初期ロード）はネットワーク優先で試し、失敗したら index.html を返す
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then(response => response)
        .catch(() => caches.match('/index.html'))
    );
    return;
  }

  // API / 動的データは network-first（オフライン時はキャッシュにフォールバック）
  if (url.pathname.startsWith('/api/') || url.pathname.startsWith('/data/')) {
    event.respondWith(
      fetch(event.request)
        .then(res => {
          // 成功したレスポンスをキャッシュに保存しておく（オプション）
          const copy = res.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
          return res;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // それ以外（静的アセット）は cache-first
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(res => {
        // 失敗したり不正なレスポンスはそのまま返す
        if (!res || res.status !== 200 || res.type === 'opaque') return res;
        const copy = res.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
        return res;
      }).catch(() => {
        // もし何も見つからなければナビゲーションなら index.html へフォールバック
        if (event.request.destination === 'document' || event.request.mode === 'navigate') {
          return caches.match('/index.html');
        }
        return undefined;
      });
    })
  );
});