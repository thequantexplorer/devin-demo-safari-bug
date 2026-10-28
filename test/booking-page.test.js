const test = require('node:test');
const assert = require('node:assert');
const { JSDOM } = require('jsdom');
const { createApp } = require('../server/app');

// Loads the real page + public/app.js against the real server. `withoutIdleCallback`
// mimics Safari / iOS WebKit, which has no window.requestIdleCallback.
async function loadPage({ withoutIdleCallback }) {
  const server = createApp().listen(0);
  const base = `http://localhost:${server.address().port}/`;
  const errors = [];
  const dom = await JSDOM.fromURL(base, {
    runScripts: 'dangerously',
    resources: 'usable',
    beforeParse(window) {
      window.fetch = (url, opts) => fetch(new URL(url, base), opts);
      if (withoutIdleCallback) delete window.requestIdleCallback;
      else window.requestIdleCallback = (cb) => setTimeout(() => cb({ didTimeout: false, timeRemaining: () => 50 }), 0);
      window.addEventListener('unhandledrejection', (e) => errors.push(e.reason));
      window.addEventListener('error', (e) => errors.push(e.error));
    },
  });
  return { dom, errors, close: () => { dom.window.close(); server.close(); } };
}

async function waitForSlots(document, timeoutMs = 3000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    if (document.querySelectorAll('#slots .slot').length) return;
    await new Promise((r) => setTimeout(r, 20));
  }
  throw new Error(`slots never rendered; #slots says: "${document.getElementById('slots').textContent}"`);
}

for (const withoutIdleCallback of [true, false]) {
  test(`renders time slots ${withoutIdleCallback ? 'without' : 'with'} requestIdleCallback`, async () => {
    const page = await loadPage({ withoutIdleCallback });
    try {
      await waitForSlots(page.dom.window.document);
      assert.doesNotMatch(page.dom.window.document.getElementById('slots').textContent, /Loading/);
      assert.deepStrictEqual(page.errors, []);
    } finally {
      page.close();
    }
  });
}
