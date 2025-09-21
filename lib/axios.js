
function headersToObject(headers) {
  const obj = {};
  if (!headers) return obj;
  if (typeof headers.forEach === 'function') {
    headers.forEach((value, key) => {
      obj[key.toLowerCase()] = value;
    });
    return obj;
  }

  Object.keys(headers).forEach((k) => {
    obj[k.toLowerCase()] = headers[k];
  });
  return obj;
}

function ensureFetch() {
  if (typeof globalThis.fetch !== 'function') {
    throw new Error('fetch is not available in this environment. Install axios or enable global fetch (Node >=18).');
  }
}

function createShim() {
  ensureFetch();

  async function request(method, url, data, config = {}) {
    const fetchOpts = {
      method: method.toUpperCase(),
      headers: { ...(config.headers || {}) },
      
      redirect: config.redirect || 'follow',
    };

    if (data !== undefined && data !== null) {

      const hasContentType = Object.keys(fetchOpts.headers || {}).some(h => h.toLowerCase() === 'content-type');
      if (!hasContentType && typeof data === 'object' && !(data instanceof ArrayBuffer) && !Buffer.isBuffer(data) && !(data instanceof Uint8Array)) {
        fetchOpts.headers['content-type'] = 'application/json';
        fetchOpts.body = JSON.stringify(data);
      } else {
        fetchOpts.body = data;
      }
    }

    const res = await fetch(url, fetchOpts);

    const headersObj = headersToObject(res.headers || {});

    
    const responseType = (config.responseType || '').toLowerCase();

    let resData;
    if (responseType === 'arraybuffer' || responseType === 'blob' || config.binary === true) {
      const ab = await res.arrayBuffer();
      resData = Buffer.from(ab);
    } else {
      const contentType = (headersObj['content-type'] || '').toLowerCase();
      const text = await res.text();
      if (contentType.includes('application/json')) {
        try {
          resData = JSON.parse(text);
        } catch (e) {
          resData = text;
        }
      } else {
        resData = text;
      }
    }

    return {
      data: resData,
      status: res.status,
      statusText: res.statusText,
      headers: headersObj,
      url: res.url
    };
  }

  return {
    async get(url, config = {}) { return request('get', url, undefined, config); },
    async head(url, config = {}) { 
      ensureFetch();
      const res = await fetch(url, { method: 'HEAD', headers: config.headers || {}, redirect: config.redirect || 'follow' });
      return { status: res.status, statusText: res.statusText, headers: headersToObject(res.headers || {}), url: res.url };
    },
    async post(url, data, config = {}) { return request('post', url, data, config); },
    async put(url, data, config = {}) { return request('put', url, data, config); },
    async patch(url, data, config = {}) { return request('patch', url, data, config); },
    async delete(url, config = {}) { return request('delete', url, undefined, config); },
    create(config = {}) {
      return this;
    }
  };
}

let exported;
try {

  exported = require('axios');
} catch (err) {
 
  exported = createShim();
}

module.exports = exported;