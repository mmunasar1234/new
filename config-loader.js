(function () {
  const key = WeddingBase.getKey();
  WeddingStore.importFromHash();
  const saved = WeddingStore.load(key);
  if (saved) window.WEDDING_CONFIG = Object.assign(WeddingBase.defaultConfig(), saved);
})();
