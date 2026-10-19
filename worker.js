export default {
  async fetch(request, env, ctx) {
    // If accessed directly or routed, proxy to the origin web server
    const url = new URL(request.url);
    const originUrl = new URL(request.url);
    originUrl.hostname = '67.217.57.170';
    
    // Fallback: pass-through to origin fetch
    return fetch(request);
  }
};
