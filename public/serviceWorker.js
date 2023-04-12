let CACHE_NAME = "my-site-cache-v2";
const urlsToCache = ["/", "/index.html"];

self.addEventListener("install", function (event) {
  caches.keys().then(function (keys) {
    keys.forEach(function (key) {
      console.log("CacheKey: " + key);
      if (key !== CACHE_NAME) {
        caches.delete(key).then(function (deleted) {
          if (deleted) {
            console.log(key + " deleted successfully");
          } else {
            console.error(key + " not found");
          }
        });
      }
    });
  });

  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      console.log("Cache opened:", CACHE_NAME);
      return cache.addAll(urlsToCache);
    })
  );
});
