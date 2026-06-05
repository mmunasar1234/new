window.QRLib = {
  _scanLoaded: false,

  loadScanner() {
    if (this._scanLoaded) return Promise.resolve();
    return new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = 'https://unpkg.com/html5-qrcode@2.3.8/html5-qrcode.min.js';
      s.onload = () => { this._scanLoaded = true; resolve(); };
      s.onerror = reject;
      document.head.appendChild(s);
    });
  },

  buildUrl(key, data) {
    const packed = WeddingStore.packForQR(data);
    const encoded = WeddingStore.encodeForQR(packed);
    const base = location.href.replace(/[^/]*$/, '');
    return base + 'class.html?w=' + encodeURIComponent(key) + '#data=' + encoded;
  },

  showQR(containerId, text) {
    const box = document.getElementById(containerId);
    if (!box) return;
    const safe = encodeURIComponent(text);
    box.innerHTML =
      '<img id="qrImage" width="280" height="280" alt="QR Code" ' +
      'style="border:3px solid #c9a962;border-radius:8px;background:#faf7f2;display:block;margin:0 auto" ' +
      'src="https://api.qrserver.com/v1/create-qr-code/?size=300x300&margin=12&color=2c2416&bgcolor=faf7f2&data=' + safe + '">' +
      '<p class="qr-link-text" style="font-size:0.75rem;color:#888;margin-top:0.75rem;word-break:break-all;padding:0 0.5rem">' + text + '</p>';
    box.style.display = 'block';
  },

  downloadQR() {
    const img = document.getElementById('qrImage');
    if (!img) return;
    const a = document.createElement('a');
    a.download = 'martiqaad-qr.png';
    a.href = img.src;
    a.click();
  },

  parseScanResult(text) {
    try {
      if (text.includes('data=')) {
        const encoded = decodeURIComponent(text.split('data=')[1].split('&')[0].split('#')[0]);
        const data = WeddingStore.decodeFromQR(encoded);
        if (data) return data;
      }
      const url = new URL(text, location.href);
      const encoded = url.hash.match(/data=([^&]+)/);
      if (encoded) {
        const data = WeddingStore.decodeFromQR(decodeURIComponent(encoded[1]));
        if (data) return data;
      }
      const key = url.searchParams.get('w') || url.searchParams.get('key');
      if (key) return { _key: key };
    } catch {}
    try {
      return WeddingStore.decodeFromQR(text);
    } catch {}
    return null;
  }
};
