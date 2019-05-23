var filesToCache = [
  '/',
  'per9_app/style/main.css',
  'per9_app/images/still_life_medium.jpg',
  'per9_app/images/horse_medium.jpg',
  'per9_app/images/still_life_medium.jpg',
  'per9_app/images/volt_medium.jpg',
  'per9_app/index.html',
  'per9_app/pages/offline.html',
  'per9_app/pages/404.html',
  'per9_app/pages/post1.html',
  'per9_app/pages/post2.html',
  'per9_app/pages/post2.html',
];

var	staticCacheName	=	'pages-cache-v1';
self.addEventListener('install',	function(event)	{
		console.log('Attempting	to	install	service	worker	and	cache	static	assets');
		event.waitUntil(
				caches.open(staticCacheName)
				.then(function(cache)	{
						return	cache.addAll(filesToCache);
				})
		);
});


self.addEventListener('fetch',	function(event)	{
		console.log('Fetch	event	for	',	event.request.url);
		event.respondWith(
				caches.match(event.request).then(function(response)	{
						if	(response)	{
								console.log('Found	',	event.request.url,	'	in	cache');
								return	response;
						}
						console.log('Network	request	for	',	event.request.url);
						return	fetch(event.request)
						.then(function(response)	{
		//	TODO	5	-	Respond	with	custom	404	page
		return	caches.open(staticCacheName).then(function(cache)	{
				if	(event.request.url.indexOf('test')	<	0)	{
						cache.put(event.request.url,	response.clone());
				}
				return	response;
		});
});
				}).catch(function(error)	{
						//	TODO	6	-	Respond	with	custom	offline	page
				})
		);
});


self.addEventListener('activate',	function(event)	{
		console.log('Activating	new	service	worker...');
		var	cacheWhitelist	=	[staticCacheName];
		event.waitUntil(
				caches.keys().then(function(cacheNames)	{
						return	Promise.all(
								cacheNames.map(function(cacheName)	{
										if	(cacheWhitelist.indexOf(cacheName)	===	-1)	{
												return	caches.delete(cacheName);
										}
								})
						);
				})
		);
});


self.addEventListener('activate', event => {
  console.log('Activating new service worker...');

  const cacheWhitelist = [staticCacheName];

  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', event => {
  console.log('Fetch event for ', event.request.url);
  event.respondWith(
    caches.match(event.request)
    .then(response => {
      if (response) {
        console.log('Found ', event.request.url, ' in cache');
        return response;
      }
      console.log('Network request for ', event.request.url);
      return fetch(event.request)
      .then(response => {
        if (response.status === 404) {
          return caches.match('pages/404.html');
        }
        return caches.open(staticCacheName)
        .then(cache => {
          cache.put(event.request.url, response.clone());
          return response;
        });
      });
    }).catch(error => {
      console.log('Error, ', error);
      return caches.match('pages/offline.html');
    })
  );
});

