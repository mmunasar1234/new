window.WeddingStore = {
  save(key, data) {
    localStorage.setItem(WeddingBase.STORAGE_PREFIX + key, JSON.stringify(data));
  },

  load(key) {
    const raw = localStorage.getItem(WeddingBase.STORAGE_PREFIX + key);
    if (!raw) return null;
    try { return JSON.parse(raw); } catch { return null; }
  },

  remove(key) {
    localStorage.removeItem(WeddingBase.STORAGE_PREFIX + key);
  },

  listKeys() {
    const keys = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith(WeddingBase.STORAGE_PREFIX)) {
        keys.push(k.replace(WeddingBase.STORAGE_PREFIX, ''));
      }
    }
    return keys;
  },

  packForQR(data) {
    const copy = JSON.parse(JSON.stringify(data));
    delete copy.musicUrl;
    if (copy.gallery && copy.gallery.length > 4) copy.gallery = copy.gallery.slice(0, 4);
    return copy;
  },

  encodeForQR(data) {
    const json = JSON.stringify(data);
    return btoa(unescape(encodeURIComponent(json)));
  },

  decodeFromQR(encoded) {
    try {
      const json = decodeURIComponent(escape(atob(encoded)));
      return JSON.parse(json);
    } catch {
      return null;
    }
  },

  importFromHash() {
    const match = location.hash.match(/data=([^&]+)/);
    if (!match) return null;
    const data = this.decodeFromQR(match[1]);
    if (data) {
      const key = WeddingBase.getKey();
      this.save(key, data);
      history.replaceState(null, '', location.pathname + location.search);
    }
    return data;
  }
};
